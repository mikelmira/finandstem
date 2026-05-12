"""
Fallback scraper for entries the primary scraper missed.

Primary uses Wikipedia `pageimages` (the lead image). Some articles have no
lead image set. This script tries two fallbacks:
  1. List all images on the article via `prop=images`, filter to JPG/PNG,
     skip icons/logos/maps, take the first.
  2. Query the Commons category for the scientific name and grab the
     first reasonably-sized image.

Merges results into src/data/image-attribution.ts.
"""
from __future__ import annotations

import html
import json
import re
import sys
import time
from pathlib import Path
from typing import Optional
from urllib.parse import unquote

import openpyxl
import requests

WIKI_API = "https://en.wikipedia.org/w/api.php"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = (
    "FinAndStem/0.1 (https://finandstem.example.com; mikee@dsg.co.za) requests"
)
HEADERS = {"User-Agent": USER_AGENT}

ROOT = Path(__file__).resolve().parent.parent
SEED_XLSX = ROOT.parent / "aquascaping-catalogue-seed.xlsx"
PUBLIC_IMG = ROOT / "public" / "images" / "catalogue"
ATTRIB_TS = ROOT / "src" / "data" / "image-attribution.ts"

TARGET_WIDTH = 1200

TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")

SKIP_FILENAME_HINTS = (
    "icon",
    "logo",
    "map",
    "stub",
    "wiki",
    "distribution",
    "range",
    "commons-logo",
    "wikispecies",
    "info_sign",
    "infosign",
    "question",
    "ambox",
    "edit-icon",
    "padlock",
    "speakerlink",
    "loudspeaker",
    "openstreetmap",
    "disambig",
    "dab list",
    "dab_list",
    "merge-arrow",
    "commons-emblem",
    "yes_check",
    "no_cross",
)

SKIP_MIMES = ("image/svg+xml",)


def clean(text: Optional[str]) -> str:
    if not text:
        return ""
    s = html.unescape(text)
    s = TAG_RE.sub(" ", s)
    s = WHITESPACE_RE.sub(" ", s).strip()
    return s


def wiki_title_from_url(url: str) -> str:
    return unquote(url.rstrip("/").split("/wiki/")[-1])


def is_commercial_safe(license_str: str) -> bool:
    if not license_str:
        return False
    s = license_str.lower()
    if "non-commercial" in s or "noncommercial" in s or "-nc" in s:
        return False
    return True


def looks_decorative(name: str) -> bool:
    n = name.lower()
    return any(h in n for h in SKIP_FILENAME_HINTS)


def fetch_article_images(title: str) -> list[str]:
    """Return all File:* names referenced on the Wikipedia article."""
    out: list[str] = []
    cont: Optional[dict] = None
    while True:
        params = {
            "action": "query",
            "format": "json",
            "prop": "images",
            "imlimit": 50,
            "titles": title,
            "redirects": 1,
        }
        if cont:
            params.update(cont)
        r = requests.get(WIKI_API, params=params, headers=HEADERS, timeout=30)
        r.raise_for_status()
        data = r.json()
        pages = data.get("query", {}).get("pages", {})
        for _pid, page in pages.items():
            for img in page.get("images", []):
                title_ = img.get("title")
                if title_:
                    out.append(title_)
        cont = data.get("continue")
        if not cont:
            break
    return out


def fetch_commons_category_images(category: str) -> list[str]:
    """Return File:* names directly in a Commons category."""
    params = {
        "action": "query",
        "format": "json",
        "list": "categorymembers",
        "cmtitle": category if category.startswith("Category:") else f"Category:{category}",
        "cmtype": "file",
        "cmlimit": 30,
    }
    r = requests.get(COMMONS_API, params=params, headers=HEADERS, timeout=30)
    r.raise_for_status()
    members = r.json().get("query", {}).get("categorymembers", [])
    return [m["title"] for m in members if m.get("title", "").startswith("File:")]


def fetch_commons_metadata(file_title: str) -> Optional[dict]:
    params = {
        "action": "query",
        "format": "json",
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|mime|size",
        "iiurlwidth": TARGET_WIDTH,
        "titles": file_title,
    }
    r = requests.get(COMMONS_API, params=params, headers=HEADERS, timeout=30)
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    for _pid, page in pages.items():
        infos = page.get("imageinfo")
        if not infos:
            continue
        info = infos[0]
        meta = info.get("extmetadata", {})

        def gv(key: str) -> Optional[str]:
            v = meta.get(key)
            return v.get("value") if v else None

        return {
            "fileTitle": file_title,
            "url": info.get("thumburl") or info.get("url"),
            "fullUrl": info.get("url"),
            "mime": info.get("mime"),
            "width": info.get("thumbwidth") or info.get("width"),
            "height": info.get("thumbheight") or info.get("height"),
            "license": clean(gv("LicenseShortName")),
            "licenseUrl": gv("LicenseUrl"),
            "author": clean(gv("Artist")) or "Unknown",
            "credit": clean(gv("Credit")),
            "descriptionUrl": info.get("descriptionurl"),
        }
    return None


def download(url: str, dest: Path) -> None:
    if dest.exists():
        return
    r = requests.get(url, headers=HEADERS, stream=True, timeout=120)
    r.raise_for_status()
    dest.parent.mkdir(parents=True, exist_ok=True)
    with open(dest, "wb") as f:
        for chunk in r.iter_content(8192):
            f.write(chunk)


def ext_from_mime(mime: Optional[str]) -> str:
    if not mime:
        return "jpg"
    m = mime.lower()
    if "jpeg" in m or "jpg" in m:
        return "jpg"
    if "png" in m:
        return "png"
    if "webp" in m:
        return "webp"
    if "gif" in m:
        return "gif"
    if "svg" in m:
        return "svg"
    return "jpg"


def load_existing_attribution() -> dict[str, dict]:
    if not ATTRIB_TS.exists():
        return {}
    raw = ATTRIB_TS.read_text()
    m = re.search(r"export const IMAGE_ATTRIBUTION[^=]*=\s*(\{[\s\S]*?\}) as const;", raw)
    if not m:
        return {}
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return {}


def write_attribution(attribution: dict[str, dict]) -> None:
    body = json.dumps(attribution, indent=2, ensure_ascii=False, sort_keys=True)
    ATTRIB_TS.write_text(
        "// Auto-generated by scripts/scrape-images.py — do not edit by hand.\n"
        "// Run that script to refresh after image edits or new entries.\n\n"
        "import type { ImageAttribution } from \"@/types/catalogue\";\n\n"
        f"export const IMAGE_ATTRIBUTION: Record<string, ImageAttribution> = {body} as const;\n"
    )


def collect_entries() -> list[dict]:
    wb = openpyxl.load_workbook(SEED_XLSX, data_only=True)
    out = []
    for sheet, cat in [
        ("Fish", "fish"),
        ("Plants", "plants"),
        ("Shrimp", "shrimp"),
        ("Mosses", "mosses"),
    ]:
        if sheet not in wb.sheetnames:
            continue
        ws = wb[sheet]
        headers = [c.value for c in ws[1]]
        for row in ws.iter_rows(min_row=2, values_only=True):
            if not row or row[0] is None:
                continue
            d = dict(zip(headers, row))
            out.append(
                {
                    "slug": d.get("Slug"),
                    "category": cat,
                    "commonName": d.get("Common Name"),
                    "scientificName": d.get("Scientific Name"),
                    "wikipediaUrl": d.get("Image Source URL"),
                }
            )
    return out


def best_image_from_candidates(
    candidates: list[str], hint: str = ""
) -> Optional[dict]:
    """Walk candidate File:* titles in order, return the first that has a
    commercially-safe license AND looks like a real photo (not a tiny icon)."""
    hint_lc = hint.lower()
    # Prefer files whose name contains a hint (scientific or common name word)
    if hint_lc:
        hint_tokens = [t for t in re.split(r"\W+", hint_lc) if len(t) > 3]
    else:
        hint_tokens = []

    def score(name: str) -> int:
        n = name.lower()
        if looks_decorative(n):
            return -100
        s = 0
        for t in hint_tokens:
            if t in n:
                s += 5
        return s

    candidates = sorted(set(candidates), key=score, reverse=True)
    for cand in candidates:
        if looks_decorative(cand):
            continue
        meta = fetch_commons_metadata(cand)
        if not meta or not meta.get("url"):
            continue
        if not is_commercial_safe(meta.get("license", "")):
            continue
        if meta.get("mime") in SKIP_MIMES:
            continue
        # Reject tiny images
        w = meta.get("width") or 0
        if w < 400:
            continue
        return meta
    return None


def main() -> int:
    attribution = load_existing_attribution()
    entries = collect_entries()
    missing = [e for e in entries if e["slug"] not in attribution and e["wikipediaUrl"]]
    print(f"Missing: {len(missing)} entries")

    for e in missing:
        slug = e["slug"]
        category = e["category"]
        out_dir = PUBLIC_IMG / category
        title = wiki_title_from_url(e["wikipediaUrl"])
        hint = f"{e['commonName']} {e['scientificName']}"
        print(f"\n[try ]  {category}/{slug}  ←  {title}")

        meta: Optional[dict] = None
        # Fallback 1 — article images list
        try:
            article_imgs = fetch_article_images(title)
            print(f"        article images: {len(article_imgs)}")
            meta = best_image_from_candidates(article_imgs, hint=hint)
        except Exception as ex:
            print(f"        article-images error: {ex}")

        # Fallback 2 — Commons category for the scientific name
        if not meta:
            scientific = e["scientificName"] or ""
            cat_name = scientific.replace(" ", "_")
            print(f"        trying Commons category: {cat_name}")
            try:
                cat_imgs = fetch_commons_category_images(cat_name)
                print(f"        category images: {len(cat_imgs)}")
                meta = best_image_from_candidates(cat_imgs, hint=hint)
            except Exception as ex:
                print(f"        category error: {ex}")

        if not meta:
            print("        ! still no usable image")
            continue

        ext = ext_from_mime(meta.get("mime"))
        dest = out_dir / f"{slug}.{ext}"
        try:
            download(meta["url"], dest)
        except Exception as ex:
            print(f"        ! download failed: {ex}")
            continue

        attribution[slug] = {
            "slug": slug,
            "category": category,
            "src": f"/images/catalogue/{category}/{slug}.{ext}",
            "alt": f"{e['commonName']} ({e['scientificName']})",
            "width": meta.get("width"),
            "height": meta.get("height"),
            "license": meta.get("license"),
            "licenseUrl": meta.get("licenseUrl"),
            "author": meta.get("author"),
            "credit": meta.get("credit"),
            "fileTitle": meta.get("fileTitle"),
            "descriptionUrl": meta.get("descriptionUrl"),
            "wikipediaUrl": e["wikipediaUrl"],
        }
        write_attribution(attribution)
        print(
            f"        ok  {meta.get('license')}  {meta.get('width')}x{meta.get('height')}  ← {meta.get('fileTitle')}"
        )
        time.sleep(0.4)

    print(f"\nFinal: {len(attribution)} entries with images.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
