"""
Plant image rescue — replaces six known-wrong / duplicate / drawing-only
plant images with correct Wikimedia Commons photos, then scrapes the
~25 plant slugs that have no image at all by searching Commons for the
scientific name.

Run from project root:
  python3 scripts/fix-plant-images.py
"""
from __future__ import annotations

import html
import json
import re
import sys
import time
from pathlib import Path
from typing import Optional

import requests

COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = (
    "FinAndStem/0.1 (https://finandstem.com; finandstem@gmail.com) requests"
)
HEADERS = {"User-Agent": USER_AGENT}

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_IMG = ROOT / "public" / "images" / "catalogue" / "plants"
ATTRIB_TS = ROOT / "src" / "data" / "image-attribution.ts"
TARGET_WIDTH = 1200

TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")

# Exact-title replacements for the six known-wrong / duplicate / drawing
# entries (highest-confidence picks already verified to exist on Commons).
EXACT_TARGETS = [
    # (slug, common, scientific, exact File:title, wikipedia URL)
    (
        "anubias-nana",
        "Anubias Nana",
        "Anubias barteri var. nana",
        "File:Anubias barteri var. nana.JPG",
        "https://en.wikipedia.org/wiki/Anubias_barteri",
    ),
    (
        "java-fern-trident",
        "Java Fern 'Trident'",
        "Microsorum pteropus 'Trident'",
        "File:Microsorum-pteropus-trident.jpg",
        "https://en.wikipedia.org/wiki/Java_fern",
    ),
    (
        "rotala-hra",
        "Rotala 'H'ra'",
        "Rotala rotundifolia 'H'ra'",
        "File:Rotala-rotundifolia-hra.jpg",
        "https://en.wikipedia.org/wiki/Rotala_rotundifolia",
    ),
    (
        "hydrocotyle-japan",
        "Hydrocotyle Tripartita 'Japan'",
        "Hydrocotyle tripartita",
        "File:Hydrocotyle-tripartita.jpg",
        "https://en.wikipedia.org/wiki/Hydrocotyle",
    ),
    (
        "monte-carlo",
        "Monte Carlo",
        "Micranthemum tweediei",
        "File:Micranthemum-tweediei.jpg",
        "https://en.wikipedia.org/wiki/Micranthemum_tweediei",
    ),
    (
        "bucephalandra",
        "Bucephalandra",
        "Bucephalandra sp.",
        "File:Bucephalandra.jpg",
        "https://en.wikipedia.org/wiki/Bucephalandra",
    ),
]

# Slugs to search Commons for by scientific name when no file exists yet.
SEARCH_TARGETS = [
    ("amazon-frogbit", "Amazon Frogbit", "Limnobium laevigatum",
     "https://en.wikipedia.org/wiki/Limnobium_laevigatum",
     ["Limnobium laevigatum", "Amazon frogbit aquarium"]),
    ("aponogeton-crispus", "Aponogeton Crispus", "Aponogeton crispus",
     "https://en.wikipedia.org/wiki/Aponogeton_crispus",
     ["Aponogeton crispus"]),
    ("bacopa-caroliniana", "Bacopa Caroliniana", "Bacopa caroliniana",
     "https://en.wikipedia.org/wiki/Bacopa_caroliniana",
     ["Bacopa caroliniana"]),
    ("bolbitis-heudelotii", "African Water Fern", "Bolbitis heudelotii",
     "https://en.wikipedia.org/wiki/Bolbitis_heudelotii",
     ["Bolbitis heudelotii"]),
    ("chain-sword", "Pygmy Chain Sword", "Helanthium tenellum",
     "https://en.wikipedia.org/wiki/Helanthium",
     ["Helanthium tenellum", "Echinodorus tenellus"]),
    ("cryptocoryne-lutea", "Cryptocoryne Lutea", "Cryptocoryne lutea",
     "https://en.wikipedia.org/wiki/Cryptocoryne",
     ["Cryptocoryne lutea"]),
    ("cryptocoryne-parva", "Cryptocoryne Parva", "Cryptocoryne parva",
     "https://en.wikipedia.org/wiki/Cryptocoryne_parva",
     ["Cryptocoryne parva"]),
    ("glossostigma-elatinoides", "Glossostigma Elatinoides",
     "Glossostigma elatinoides",
     "https://en.wikipedia.org/wiki/Glossostigma_elatinoides",
     ["Glossostigma elatinoides"]),
    ("hc-cuba", "Dwarf Baby Tears", "Hemianthus callitrichoides 'Cuba'",
     "https://en.wikipedia.org/wiki/Hemianthus_callitrichoides",
     ["Hemianthus callitrichoides", "HC Cuba aquarium"]),
    ("hygrophila-pinnatifida", "Hygrophila Pinnatifida",
     "Hygrophila pinnatifida",
     "https://en.wikipedia.org/wiki/Hygrophila",
     ["Hygrophila pinnatifida"]),
    ("java-fern-windelov", "Java Fern 'Windelov'",
     "Microsorum pteropus 'Windelov'",
     "https://en.wikipedia.org/wiki/Java_fern",
     ["Microsorum pteropus Windelov", "Java fern Windelov"]),
    ("lilaeopsis-brasiliensis", "Brazilian Micro Sword",
     "Lilaeopsis brasiliensis",
     "https://en.wikipedia.org/wiki/Lilaeopsis",
     ["Lilaeopsis brasiliensis", "Lilaeopsis aquarium"]),
    ("limnophila-sessiliflora", "Asian Ambulia",
     "Limnophila sessiliflora",
     "https://en.wikipedia.org/wiki/Limnophila_sessiliflora",
     ["Limnophila sessiliflora"]),
    ("lobelia-cardinalis-mini", "Lobelia Cardinalis 'Mini'",
     "Lobelia cardinalis 'Mini'",
     "https://en.wikipedia.org/wiki/Lobelia_cardinalis",
     ["Lobelia cardinalis", "Lobelia cardinalis aquarium"]),
    ("ludwigia-repens", "Ludwigia Repens", "Ludwigia repens",
     "https://en.wikipedia.org/wiki/Ludwigia_repens",
     ["Ludwigia repens"]),
    ("ludwigia-super-red", "Ludwigia Super Red",
     "Ludwigia palustris 'Super Red'",
     "https://en.wikipedia.org/wiki/Ludwigia_palustris",
     ["Ludwigia palustris super red", "Ludwigia palustris"]),
    ("marsilea-hirsuta", "Marsilea Hirsuta", "Marsilea hirsuta",
     "https://en.wikipedia.org/wiki/Marsilea_hirsuta",
     ["Marsilea hirsuta"]),
    ("needle-hairgrass", "Needle Hairgrass", "Eleocharis acicularis",
     "https://en.wikipedia.org/wiki/Eleocharis_acicularis",
     ["Eleocharis acicularis"]),
    ("pearlweed", "Pearlweed", "Hemianthus glomeratus",
     "https://en.wikipedia.org/wiki/Hemianthus",
     ["Hemianthus glomeratus", "Hemianthus micranthemoides"]),
    ("pogostemon-helferi", "Pogostemon Helferi", "Pogostemon helferi",
     "https://en.wikipedia.org/wiki/Pogostemon_helferi",
     ["Pogostemon helferi"]),
    ("ranunculus-inundatus", "Ranunculus Inundatus",
     "Ranunculus inundatus",
     "https://en.wikipedia.org/wiki/Ranunculus_inundatus",
     ["Ranunculus inundatus"]),
    ("rotala-wallichii", "Rotala Wallichii", "Rotala wallichii",
     "https://en.wikipedia.org/wiki/Rotala_wallichii",
     ["Rotala wallichii"]),
    ("sagittaria-subulata", "Dwarf Sagittaria", "Sagittaria subulata",
     "https://en.wikipedia.org/wiki/Sagittaria_subulata",
     ["Sagittaria subulata"]),
    ("salvinia-natans", "Salvinia Natans", "Salvinia natans",
     "https://en.wikipedia.org/wiki/Salvinia_natans",
     ["Salvinia natans"]),
    ("staurogyne-repens", "Staurogyne Repens", "Staurogyne repens",
     "https://en.wikipedia.org/wiki/Staurogyne",
     ["Staurogyne repens"]),
]

SKIP_HINTS = (
    "icon", "logo", "map", "stub", "wiki", "distribution", "range",
    "disambig", "drawing", "illustration", "diagram", "sketch", "herbarium",
    "botanical_drawing",
)
ACCEPT_MIMES = ("image/jpeg", "image/png", "image/webp", "image/jpg")


def clean(s: Optional[str]) -> str:
    if not s:
        return ""
    s = html.unescape(s)
    return WHITESPACE_RE.sub(" ", TAG_RE.sub(" ", s)).strip()


def fetch_meta(file_title: str) -> Optional[dict]:
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
    pages = (r.json().get("query") or {}).get("pages") or {}
    for _pid, page in pages.items():
        infos = page.get("imageinfo")
        if not infos:
            return None
        return _shape(file_title, infos[0])
    return None


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
    pages = (r.json().get("query") or {}).get("pages") or {}
    return sorted(pages.values(), key=lambda p: p.get("index", 9999))


def _shape(file_title: str, info: dict) -> dict:
    meta = info.get("extmetadata", {}) or {}

    def gv(key: str) -> Optional[str]:
        v = meta.get(key)
        return v.get("value") if v else None

    return {
        "fileTitle": file_title,
        "url": info.get("thumburl") or info.get("url"),
        "mime": info.get("mime"),
        "width": info.get("thumbwidth") or info.get("width"),
        "height": info.get("thumbheight") or info.get("height"),
        "license": clean(gv("LicenseShortName")),
        "licenseUrl": gv("LicenseUrl"),
        "author": clean(gv("Artist")) or "Unknown",
        "credit": clean(gv("Credit")),
        "descriptionUrl": info.get("descriptionurl"),
    }


def looks_decorative(title: str) -> bool:
    n = title.lower()
    return any(h in n for h in SKIP_HINTS)


def is_commercial_safe(lic: str) -> bool:
    if not lic:
        return False
    s = lic.lower()
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
        if info.get("mime") not in ACCEPT_MIMES:
            continue
        m = _shape(title, info)
        if not is_commercial_safe(m.get("license") or ""):
            continue
        w = m.get("width") or 0
        if w < 400:
            continue
        return m
    return None


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
    return "jpg"


def download(url: str, dest: Path) -> None:
    r = requests.get(url, headers=HEADERS, stream=True, timeout=120)
    r.raise_for_status()
    dest.parent.mkdir(parents=True, exist_ok=True)
    with open(dest, "wb") as f:
        for chunk in r.iter_content(8192):
            f.write(chunk)


def load_attribution() -> dict:
    raw = ATTRIB_TS.read_text()
    m = re.search(
        r"IMAGE_ATTRIBUTION:[^=]+=\s*(\{[\s\S]*\})\s*as const;",
        raw,
    )
    if not m:
        sys.exit("Could not parse attribution file")
    return json.loads(m.group(1))


def write_attribution(d: dict) -> None:
    body = json.dumps(d, indent=2, ensure_ascii=False, sort_keys=True)
    ATTRIB_TS.write_text(
        "// Auto-generated by scripts/scrape-images.py — do not edit by hand.\n"
        "// Run that script to refresh after image edits or new entries.\n\n"
        'import type { ImageAttribution } from "@/types/catalogue";\n\n'
        f"export const IMAGE_ATTRIBUTION: Record<string, ImageAttribution> = {body} as const;\n"
    )


def upsert(
    attribution: dict, slug: str, common: str, scientific: str,
    wiki_url: str, meta: dict,
) -> None:
    ext = ext_from_mime(meta.get("mime"))
    dest = PUBLIC_IMG / f"{slug}.jpg"
    # Always normalise to .jpg path (works for jpeg/png served by Next image opt)
    if dest.exists():
        dest.unlink()
    if ext != "jpg":
        dest = PUBLIC_IMG / f"{slug}.{ext}"
    download(meta["url"], dest)
    attribution[slug] = {
        "slug": slug,
        "category": "plants",
        "src": f"/images/catalogue/plants/{dest.name}",
        "alt": f"{common} ({scientific})",
        "width": meta.get("width"),
        "height": meta.get("height"),
        "license": meta.get("license"),
        "licenseUrl": meta.get("licenseUrl"),
        "author": meta.get("author"),
        "credit": meta.get("credit"),
        "fileTitle": meta.get("fileTitle"),
        "descriptionUrl": meta.get("descriptionUrl"),
        "wikipediaUrl": wiki_url,
    }


def main() -> int:
    attribution = load_attribution()
    PUBLIC_IMG.mkdir(parents=True, exist_ok=True)

    print("\n--- exact replacements (known-wrong / duplicate / drawing) ---")
    for slug, common, scientific, file_title, wiki in EXACT_TARGETS:
        print(f"[fix] {slug}  ← {file_title}")
        meta = fetch_meta(file_title)
        if not meta or not meta.get("url"):
            # Fall back to a Commons search of the scientific name when the
            # exact file title doesn't exist.
            print("       ! exact title missing, falling back to search")
            for query in (scientific, common):
                try:
                    pages = search_commons(query)
                except Exception as ex:
                    print(f"       ! search error: {ex}")
                    continue
                cand = pick(pages)
                if cand:
                    meta = cand
                    break
        if not meta or not meta.get("url"):
            print("       ! still no usable image, skipping")
            continue
        if not is_commercial_safe(meta.get("license") or ""):
            print(f"       ! non-commercial license {meta.get('license')}, skipping")
            continue
        upsert(attribution, slug, common, scientific, wiki, meta)
        print(
            f"       ok  {meta.get('license')}  {meta.get('width')}x{meta.get('height')}  by {meta.get('author')}"
        )
        time.sleep(0.4)

    print("\n--- search-based scrape for missing plant slugs ---")
    for slug, common, scientific, wiki, queries in SEARCH_TARGETS:
        if slug in attribution:
            print(f"[skip] {slug} (now has image)")
            continue
        meta = None
        for q in queries:
            print(f"[search] {slug} :: {q!r}")
            try:
                pages = search_commons(q)
            except Exception as ex:
                print(f"       ! search error: {ex}")
                continue
            meta = pick(pages)
            if meta:
                print(f"       picked: {meta['fileTitle']}  {meta['license']}  {meta['width']}x{meta['height']}")
                break
            time.sleep(0.3)
        if not meta:
            print(f"       ! no usable image for {slug}")
            continue
        upsert(attribution, slug, common, scientific, wiki, meta)
        time.sleep(0.4)

    cleaned = {
        slug: {k: v for k, v in rec.items() if v is not None}
        for slug, rec in attribution.items()
    }
    write_attribution(cleaned)
    print(f"\nDone. Total attributions: {len(cleaned)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
