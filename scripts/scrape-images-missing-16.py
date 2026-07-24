"""
Targeted scraper for the 16 catalogue entries still without a resolvable image
(found via the data-integrity audit). Uses Commons full-text search, filters to
commercial-safe licences (never CC-BY-NC), downloads the best match, converts it
to WebP to match the rest of the catalogue, and merges attribution into
src/data/image-attribution.ts.

Cultivar entries (e.g. Echinodorus 'Ozelot', Java Fern 'Trident') fall back to
their base species, since aquarium-trade cultivars rarely have Commons photos
under the cultivar name.

Safety: refuses to write if the existing attribution file fails to load with a
plausible entry count, so a parse failure can never wipe the file.
"""
from __future__ import annotations

import html
import io
import json
import re
import sys
import time
from pathlib import Path
from typing import Optional

import requests
from PIL import Image

COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = (
    "FinAndStem/0.1 (https://finandstem.example.com; mikee@dsg.co.za) requests"
)
HEADERS = {"User-Agent": USER_AGENT}

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_IMG = ROOT / "public" / "images" / "catalogue"
ATTRIB_TS = ROOT / "src" / "data" / "image-attribution.ts"
TARGET_WIDTH = 1200
MIN_EXISTING = 150  # guard: file must load at least this many entries

TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")

SKIP_HINTS = (
    "icon", "logo", "map", "stub", "wiki", "distribution", "range",
    "disambig", "dab list", "merge-arrow", "infosign", "question",
    "padlock", "loudspeaker", "herbarium sheet", "type specimen",
)
ACCEPT_MIMES = ("image/jpeg", "image/png", "image/webp", "image/jpg")

# (slug, category, commonName, scientificName, [search queries in priority order])
TARGETS = [
    ("pacific-blue-eye", "fish", "Pacific Blue Eye", "Pseudomugil signifer",
     ["Pseudomugil signifer", "Pacific blue eye fish"]),
    ("monte-carlo", "plants", "Monte Carlo", "Micranthemum tweediei",
     ["Micranthemum tweediei", "Micranthemum tweediei aquarium", "Micranthemum umbrosum"]),
    ("red-tiger-lotus", "plants", "Red Tiger Lotus", "Nymphaea zenkeri",
     ["Nymphaea zenkeri", "Nymphaea lotus red", "Nymphaea lotus aquarium"]),
    ("java-fern-trident", "plants", "Java Fern 'Trident'", "Microsorum pteropus 'Trident'",
     ["Microsorum pteropus", "Leptochilus pteropus", "Java fern aquarium"]),
    ("rotala-wallichii", "plants", "Rotala Wallichii", "Rotala wallichii",
     ["Rotala wallichii", "Rotala wallichii aquarium"]),
    ("rotala-hra", "plants", "Rotala 'H'ra'", "Rotala rotundifolia 'H'ra'",
     ["Rotala rotundifolia", "Rotala rotundifolia aquarium"]),
    ("eriocaulon-cinereum", "plants", "Eriocaulon Cinereum", "Eriocaulon cinereum",
     ["Eriocaulon cinereum", "Eriocaulon"]),
    ("rotala-macrandra", "plants", "Rotala Macrandra", "Rotala macrandra",
     ["Rotala macrandra", "Rotala macrandra aquarium"]),
    ("ludwigia-arcuata", "plants", "Ludwigia Arcuata", "Ludwigia arcuata",
     ["Ludwigia arcuata", "Ludwigia brevipes"]),
    ("cyperus-helferi", "plants", "Cyperus Helferi", "Cyperus helferi",
     ["Cyperus helferi", "Cyperus helferi aquarium"]),
    ("lindernia-rotundifolia", "plants", "Lindernia Rotundifolia", "Lindernia rotundifolia",
     ["Lindernia rotundifolia", "Lindernia"]),
    ("echinodorus-red-flame", "plants", "Echinodorus 'Red Flame'", "Echinodorus 'Red Flame'",
     ["Echinodorus aquarium", "Echinodorus planted tank", "Echinodorus"]),
    ("eleocharis-vivipara", "plants", "Umbrella Hairgrass", "Eleocharis vivipara",
     ["Eleocharis vivipara", "Eleocharis"]),
    ("echinodorus-ozelot", "plants", "Echinodorus 'Ozelot'", "Echinodorus 'Ozelot'",
     ["Echinodorus schlueteri", "Echinodorus aquarium", "Echinodorus"]),
    ("weeping-moss", "mosses", "Weeping Moss", "Vesicularia ferriei",
     ["Vesicularia ferriei", "Vesicularia dubyana", "aquarium moss driftwood"]),
    ("mini-christmas-moss", "mosses", "Mini Christmas Moss", "Vesicularia sp.",
     ["Vesicularia montagnei", "Christmas moss aquarium", "Vesicularia"]),
]


def clean(s: Optional[str]) -> str:
    if not s:
        return ""
    s = html.unescape(s)
    return WHITESPACE_RE.sub(" ", TAG_RE.sub(" ", s)).strip()


def search_commons(query: str, limit: int = 25) -> list[dict]:
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrnamespace": 6,
        "gsrsearch": query,
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|mime|size",
        "iiurlwidth": TARGET_WIDTH,
    }
    r = requests.get(COMMONS_API, params=params, headers=HEADERS, timeout=30)
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    return sorted(pages.values(), key=lambda p: p.get("index", 9999))


def looks_decorative(name: str) -> bool:
    n = name.lower()
    return any(h in n for h in SKIP_HINTS)


def is_commercial_safe(license_str: str) -> bool:
    if not license_str:
        return False
    s = license_str.lower()
    return not ("non-commercial" in s or "-nc" in s or "noncommercial" in s)


def pick(pages: list[dict]) -> Optional[dict]:
    for page in pages:
        title = page.get("title", "")
        if looks_decorative(title):
            continue
        infos = page.get("imageinfo")
        if not infos:
            continue
        info = infos[0]
        meta = info.get("extmetadata", {})

        def gv(k: str) -> Optional[str]:
            v = meta.get(k)
            return v.get("value") if v else None

        mime = info.get("mime")
        if mime not in ACCEPT_MIMES:
            continue
        license_ = clean(gv("LicenseShortName"))
        if not is_commercial_safe(license_):
            continue
        w = info.get("thumbwidth") or info.get("width") or 0
        if w < 400:
            continue
        return {
            "fileTitle": title,
            "url": info.get("thumburl") or info.get("url"),
            "mime": mime,
            "width": w,
            "height": info.get("thumbheight") or info.get("height"),
            "license": license_,
            "licenseUrl": gv("LicenseUrl"),
            "author": clean(gv("Artist")) or "Unknown",
            "credit": clean(gv("Credit")),
            "descriptionUrl": info.get("descriptionurl"),
        }
    return None


def download_webp(url: str, dest: Path) -> None:
    r = requests.get(url, headers=HEADERS, timeout=120)
    r.raise_for_status()
    img = Image.open(io.BytesIO(r.content))
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGB")
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=82, method=6)


def load_attribution() -> dict[str, dict]:
    raw = ATTRIB_TS.read_text()
    m = re.search(
        r"export const IMAGE_ATTRIBUTION[^=]*=\s*(\{[\s\S]*\})\s*as const;", raw
    )
    if not m:
        raise SystemExit("ABORT: could not locate IMAGE_ATTRIBUTION object; refusing to write.")
    return json.loads(m.group(1))


def write_attribution(d: dict[str, dict]) -> None:
    body = json.dumps(d, indent=2, ensure_ascii=False, sort_keys=True)
    ATTRIB_TS.write_text(
        "// Auto-generated by scripts/scrape-images-*.py — do not edit by hand.\n"
        "// Run that script to refresh after image edits or new entries.\n\n"
        'import type { ImageAttribution } from "@/types/catalogue";\n\n'
        f"export const IMAGE_ATTRIBUTION: Record<string, ImageAttribution> = {body} as const;\n"
    )


def main() -> int:
    attribution = load_attribution()
    if len(attribution) < MIN_EXISTING:
        raise SystemExit(
            f"ABORT: only loaded {len(attribution)} existing entries "
            f"(expected >= {MIN_EXISTING}); refusing to write."
        )
    print(f"Loaded {len(attribution)} existing attributions.")

    ok, failed = [], []
    for slug, category, common, scientific, queries in TARGETS:
        if slug in attribution:
            print(f"[skip] {slug} (already present)")
            continue
        meta = None
        for q in queries:
            print(f"\n[search] {slug} :: {q!r}")
            try:
                pages = search_commons(q)
            except Exception as ex:
                print(f"  ! {ex}")
                continue
            print(f"  results: {len(pages)}")
            meta = pick(pages)
            if meta:
                break
            time.sleep(0.4)

        if not meta:
            print(f"  ! {slug} still no usable image")
            failed.append(slug)
            continue

        dest = PUBLIC_IMG / category / f"{slug}.webp"
        try:
            download_webp(meta["url"], dest)
        except Exception as ex:
            print(f"  ! download/convert failed: {ex}")
            failed.append(slug)
            continue

        entry = {
            "slug": slug,
            "category": category,
            "src": f"/images/catalogue/{category}/{slug}.webp",
            "alt": f"{common} ({scientific})",
            "width": meta.get("width"),
            "height": meta.get("height"),
            "license": meta.get("license"),
            "licenseUrl": meta.get("licenseUrl"),
            "author": meta.get("author"),
            "credit": meta.get("credit"),
            "fileTitle": meta.get("fileTitle"),
            "descriptionUrl": meta.get("descriptionUrl"),
            "wikipediaUrl": f"https://en.wikipedia.org/wiki/{scientific.split(chr(39))[0].strip().replace(' ', '_')}",
        }
        # The ImageAttribution TS type has no nullable fields — drop any key
        # whose Commons metadata came back empty so the emitted file type-checks.
        attribution[slug] = {k: v for k, v in entry.items() if v is not None}
        write_attribution(attribution)
        ok.append((slug, meta))
        print(f"  ok  {meta.get('license')}  {meta.get('width')}x{meta.get('height')}  <- {meta.get('fileTitle')}")
        time.sleep(0.5)

    print(f"\n=== DONE. {len(ok)} fetched, {len(failed)} failed. Total: {len(attribution)} ===")
    for slug, meta in ok:
        print(f"  {slug:26s} {meta['license']:16s} {meta['author'][:40]:40s} {meta['fileTitle']}")
    if failed:
        print("FAILED:", ", ".join(failed))
    return 0


if __name__ == "__main__":
    sys.exit(main())
