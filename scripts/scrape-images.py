"""
Fin & Stem — Wikimedia Commons image scraper.

Reads /tmp/seed.json (or the spreadsheet directly) for every catalogue entry,
fetches the lead Wikipedia image, resolves it on Wikimedia Commons, downloads
a sensible-sized copy into public/images/catalogue/<category>/<slug>.<ext>,
and writes attribution metadata into src/data/image-attribution.ts.

LEGAL: Every image must be rendered with:
  Author · License · Link to Commons file page.

Run from project root:
  python3 scripts/scrape-images.py
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

TARGET_WIDTH = 1200  # downscale to a sensible web size

TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")


def clean(text: Optional[str]) -> str:
    if not text:
        return ""
    s = html.unescape(text)
    s = TAG_RE.sub(" ", s)
    s = WHITESPACE_RE.sub(" ", s).strip()
    return s


def wiki_title_from_url(url: str) -> str:
    return unquote(url.rstrip("/").split("/wiki/")[-1])


def fetch_wikipedia_lead_image(title: str) -> Optional[str]:
    """Return the canonical 'File:xxx' name of the lead image, or None."""
    params = {
        "action": "query",
        "format": "json",
        "prop": "pageimages",
        "piprop": "name",
        "titles": title,
        "redirects": 1,
    }
    r = requests.get(WIKI_API, params=params, headers=HEADERS, timeout=30)
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    for _pid, page in pages.items():
        name = page.get("pageimage")
        if name:
            return f"File:{name}"
    return None


def fetch_commons_metadata(file_title: str) -> Optional[dict]:
    """Pull URL, scaled URL, license + author for a Commons file."""
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
            "attributionRequired": gv("AttributionRequired"),
            "objectName": clean(gv("ObjectName")),
            "descriptionUrl": info.get("descriptionurl"),
        }
    return None


def is_commercial_safe(license_str: str) -> bool:
    if not license_str:
        return False
    s = license_str.lower()
    # Block NC (non-commercial) and unknown. Everything else (CC0, CC-BY,
    # CC-BY-SA, public domain) is OK with attribution.
    if "nc" in s and "noncomm" not in s.replace("-", ""):
        # be conservative: anything containing "nc" maybe
        pass
    if "non-commercial" in s or "noncommercial" in s or "-nc" in s:
        return False
    return True


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


def collect_entries() -> list[dict]:
    """Read all 4 catalogue sheets and return a flat list of
    {slug, category, commonName, scientificName, wikipediaUrl}.
    """
    if not SEED_XLSX.exists():
        sys.exit(f"Seed spreadsheet missing at {SEED_XLSX}")
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


def main() -> int:
    entries = collect_entries()
    if not entries:
        sys.exit("No entries collected")

    PUBLIC_IMG.mkdir(parents=True, exist_ok=True)

    # Resume support — read any existing attribution file
    attribution: dict[str, dict] = {}
    if ATTRIB_TS.exists():
        # Best-effort parse: look for a JSON-equivalent block we wrote ourselves
        raw = ATTRIB_TS.read_text()
        m = re.search(r"export const IMAGE_ATTRIBUTION = (\{[\s\S]*?\}) as const;", raw)
        if m:
            try:
                attribution = json.loads(m.group(1))
            except json.JSONDecodeError:
                attribution = {}

    for e in entries:
        slug = e["slug"]
        if not slug or not e["wikipediaUrl"]:
            continue

        category = e["category"]
        out_dir = PUBLIC_IMG / category
        out_dir.mkdir(parents=True, exist_ok=True)

        # Skip if we already have a file for this entry
        existing = list(out_dir.glob(f"{slug}.*"))
        if slug in attribution and existing:
            print(f"[skip]  {category}/{slug}")
            continue

        title = wiki_title_from_url(e["wikipediaUrl"])
        print(f"[scan]  {category}/{slug}  ←  {title}")

        try:
            file_title = fetch_wikipedia_lead_image(title)
            if not file_title:
                print("        ! no lead image")
                continue

            meta = fetch_commons_metadata(file_title)
            if not meta or not meta.get("url"):
                print(f"        ! no commons metadata for {file_title}")
                continue

            if not is_commercial_safe(meta.get("license", "")):
                print(f"        ! skipping non-commercial license: {meta.get('license')}")
                continue

            ext = ext_from_mime(meta.get("mime"))
            dest = out_dir / f"{slug}.{ext}"
            download(meta["url"], dest)

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
            time.sleep(0.4)  # be polite to Wikimedia API
            print(f"        ok  {meta.get('license')}  {meta.get('width')}x{meta.get('height')}")
        except requests.HTTPError as ex:
            print(f"        ! http {ex}")
        except Exception as ex:
            print(f"        ! {ex}")

    # Write TypeScript output (strip nulls so TS optional fields stay clean)
    ATTRIB_TS.parent.mkdir(parents=True, exist_ok=True)
    cleaned = {
        slug: {k: v for k, v in rec.items() if v is not None}
        for slug, rec in attribution.items()
    }
    body = json.dumps(cleaned, indent=2, ensure_ascii=False, sort_keys=True)
    ATTRIB_TS.write_text(
        "// Auto-generated by scripts/scrape-images.py — do not edit by hand.\n"
        "// Run that script to refresh after image edits or new entries.\n\n"
        "import type { ImageAttribution } from \"@/types/catalogue\";\n\n"
        f"export const IMAGE_ATTRIBUTION: Record<string, ImageAttribution> = {body} as const;\n"
    )

    print(
        f"\nDone. {len(attribution)} entries with images. "
        f"Attribution written to {ATTRIB_TS.relative_to(ROOT)}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
