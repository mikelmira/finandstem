"""
Fin & Stem — image scraper for the 40 newly-added entries from session 06
(20 fish + 20 plants). Pulls Wikimedia Commons lead images, downloads a
~1200 px copy as .webp, and merges new ImageAttribution records into
src/data/image-attribution.ts.

Run from project root:
  python3 scripts/scrape-images-batch-06.py
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

import requests

WIKI_API = "https://en.wikipedia.org/w/api.php"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = (
    "FinAndStem/0.1 (https://finandstem.com; finandstem@gmail.com) requests"
)
HEADERS = {"User-Agent": USER_AGENT}

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_IMG = ROOT / "public" / "images" / "catalogue"
ATTRIB_TS = ROOT / "src" / "data" / "image-attribution.ts"
TARGET_WIDTH = 1200

TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")

NEW_ENTRIES = [
    # 20 fish
    {"slug": "betta", "category": "fish", "commonName": "Siamese Fighting Fish", "scientificName": "Betta splendens", "wikipediaUrl": "https://en.wikipedia.org/wiki/Siamese_fighting_fish"},
    {"slug": "pristella-tetra", "category": "fish", "commonName": "Pristella Tetra", "scientificName": "Pristella maxillaris", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pristella_maxillaris"},
    {"slug": "bleeding-heart-tetra", "category": "fish", "commonName": "Bleeding Heart Tetra", "scientificName": "Hyphessobrycon erythrostigma", "wikipediaUrl": "https://en.wikipedia.org/wiki/Hyphessobrycon_erythrostigma"},
    {"slug": "penguin-tetra", "category": "fish", "commonName": "Penguin Tetra", "scientificName": "Thayeria boehlkei", "wikipediaUrl": "https://en.wikipedia.org/wiki/Thayeria_boehlkei"},
    {"slug": "serpae-tetra", "category": "fish", "commonName": "Serpae Tetra", "scientificName": "Hyphessobrycon eques", "wikipediaUrl": "https://en.wikipedia.org/wiki/Hyphessobrycon_eques"},
    {"slug": "denison-barb", "category": "fish", "commonName": "Roseline Shark", "scientificName": "Sahyadria denisonii", "wikipediaUrl": "https://en.wikipedia.org/wiki/Sahyadria_denisonii"},
    {"slug": "gold-barb", "category": "fish", "commonName": "Gold Barb", "scientificName": "Barbodes semifasciolatus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Barbodes_semifasciolatus"},
    {"slug": "rosy-barb", "category": "fish", "commonName": "Rosy Barb", "scientificName": "Pethia conchonius", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pethia_conchonius"},
    {"slug": "yoyo-loach", "category": "fish", "commonName": "Yoyo Loach", "scientificName": "Botia almorhae", "wikipediaUrl": "https://en.wikipedia.org/wiki/Botia_almorhae"},
    {"slug": "clown-pleco", "category": "fish", "commonName": "Clown Pleco", "scientificName": "Panaqolus maccus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Panaqolus_maccus"},
    {"slug": "glass-catfish", "category": "fish", "commonName": "Glass Catfish", "scientificName": "Kryptopterus vitreolus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Kryptopterus_vitreolus"},
    {"slug": "pictus-catfish", "category": "fish", "commonName": "Pictus Catfish", "scientificName": "Pimelodus pictus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pimelodus_pictus"},
    {"slug": "chocolate-gourami", "category": "fish", "commonName": "Chocolate Gourami", "scientificName": "Sphaerichthys osphromenoides", "wikipediaUrl": "https://en.wikipedia.org/wiki/Chocolate_gourami"},
    {"slug": "licorice-gourami", "category": "fish", "commonName": "Licorice Gourami", "scientificName": "Parosphromenus deissneri", "wikipediaUrl": "https://en.wikipedia.org/wiki/Parosphromenus_deissneri"},
    {"slug": "croaking-gourami", "category": "fish", "commonName": "Croaking Gourami", "scientificName": "Trichopsis vittata", "wikipediaUrl": "https://en.wikipedia.org/wiki/Trichopsis_vittata"},
    {"slug": "phoenix-rasbora", "category": "fish", "commonName": "Phoenix Rasbora", "scientificName": "Boraras merah", "wikipediaUrl": "https://en.wikipedia.org/wiki/Boraras_merah"},
    {"slug": "dwarf-rasbora", "category": "fish", "commonName": "Dwarf Rasbora", "scientificName": "Boraras maculatus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Boraras_maculatus"},
    {"slug": "indian-glassfish", "category": "fish", "commonName": "Indian Glass Fish", "scientificName": "Parambassis ranga", "wikipediaUrl": "https://en.wikipedia.org/wiki/Parambassis_ranga"},
    {"slug": "golden-wonder-killifish", "category": "fish", "commonName": "Golden Wonder Killifish", "scientificName": "Aplocheilus lineatus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Aplocheilus_lineatus"},
    {"slug": "dojo-loach", "category": "fish", "commonName": "Dojo Loach", "scientificName": "Misgurnus anguillicaudatus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pond_loach"},

    # 20 plants
    {"slug": "blyxa-japonica", "category": "plants", "commonName": "Blyxa Japonica", "scientificName": "Blyxa japonica", "wikipediaUrl": "https://en.wikipedia.org/wiki/Blyxa_japonica"},
    {"slug": "pogostemon-stellatus-octopus", "category": "plants", "commonName": "Pogostemon Stellatus 'Octopus'", "scientificName": "Pogostemon stellatus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pogostemon"},
    {"slug": "eriocaulon-cinereum", "category": "plants", "commonName": "Eriocaulon Cinereum", "scientificName": "Eriocaulon cinereum", "wikipediaUrl": "https://en.wikipedia.org/wiki/Eriocaulon_cinereum"},
    {"slug": "rotala-macrandra", "category": "plants", "commonName": "Rotala Macrandra", "scientificName": "Rotala macrandra", "wikipediaUrl": "https://en.wikipedia.org/wiki/Rotala_macrandra"},
    {"slug": "ludwigia-palustris", "category": "plants", "commonName": "Ludwigia Palustris", "scientificName": "Ludwigia palustris", "wikipediaUrl": "https://en.wikipedia.org/wiki/Ludwigia_palustris"},
    {"slug": "ludwigia-arcuata", "category": "plants", "commonName": "Ludwigia Arcuata", "scientificName": "Ludwigia arcuata", "wikipediaUrl": "https://en.wikipedia.org/wiki/Ludwigia_arcuata"},
    {"slug": "riccia-fluitans", "category": "plants", "commonName": "Riccia Fluitans", "scientificName": "Riccia fluitans", "wikipediaUrl": "https://en.wikipedia.org/wiki/Riccia_fluitans"},
    {"slug": "susswassertang", "category": "plants", "commonName": "Süßwassertang", "scientificName": "Lomariopsis lineata", "wikipediaUrl": "https://en.wikipedia.org/wiki/Lomariopsis"},
    {"slug": "ammania-gracilis", "category": "plants", "commonName": "Ammannia Gracilis", "scientificName": "Ammannia gracilis", "wikipediaUrl": "https://en.wikipedia.org/wiki/Ammannia_gracilis"},
    {"slug": "myriophyllum-mattogrossense", "category": "plants", "commonName": "Mato Grosso Milfoil", "scientificName": "Myriophyllum mattogrossense", "wikipediaUrl": "https://en.wikipedia.org/wiki/Myriophyllum"},
    {"slug": "heteranthera-zosterifolia", "category": "plants", "commonName": "Stargrass", "scientificName": "Heteranthera zosterifolia", "wikipediaUrl": "https://en.wikipedia.org/wiki/Heteranthera_zosterifolia"},
    {"slug": "cyperus-helferi", "category": "plants", "commonName": "Cyperus Helferi", "scientificName": "Cyperus helferi", "wikipediaUrl": "https://en.wikipedia.org/wiki/Cyperus_helferi"},
    {"slug": "helanthium-vesuvius", "category": "plants", "commonName": "Helanthium 'Vesuvius'", "scientificName": "Helanthium tenellum 'Vesuvius'", "wikipediaUrl": "https://en.wikipedia.org/wiki/Helanthium_tenellum"},
    {"slug": "water-lettuce", "category": "plants", "commonName": "Water Lettuce", "scientificName": "Pistia stratiotes", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pistia"},
    {"slug": "cryptocoryne-walkeri", "category": "plants", "commonName": "Cryptocoryne Walkeri", "scientificName": "Cryptocoryne walkeri", "wikipediaUrl": "https://en.wikipedia.org/wiki/Cryptocoryne_walkeri"},
    {"slug": "lindernia-rotundifolia", "category": "plants", "commonName": "Lindernia Rotundifolia", "scientificName": "Lindernia rotundifolia", "wikipediaUrl": "https://en.wikipedia.org/wiki/Lindernia_rotundifolia"},
    {"slug": "java-fern-narrow", "category": "plants", "commonName": "Narrow Leaf Java Fern", "scientificName": "Microsorum pteropus 'Narrow Leaf'", "wikipediaUrl": "https://en.wikipedia.org/wiki/Microsorum_pteropus"},
    {"slug": "anubias-petite", "category": "plants", "commonName": "Anubias Barteri 'Petite'", "scientificName": "Anubias barteri", "wikipediaUrl": "https://en.wikipedia.org/wiki/Anubias_barteri"},
    {"slug": "echinodorus-red-flame", "category": "plants", "commonName": "Echinodorus 'Red Flame'", "scientificName": "Echinodorus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Echinodorus"},
    {"slug": "eleocharis-vivipara", "category": "plants", "commonName": "Umbrella Hairgrass", "scientificName": "Eleocharis vivipara", "wikipediaUrl": "https://en.wikipedia.org/wiki/Eleocharis_vivipara"},
]


def clean_text(s: Optional[str]) -> str:
    if not s:
        return ""
    s = html.unescape(s)
    s = TAG_RE.sub("", s)
    return WHITESPACE_RE.sub(" ", s).strip()


def page_title_from_url(url: str) -> str:
    return unquote(url.rsplit("/", 1)[-1]).replace("_", " ")


def get_lead_image_filename(page_title: str) -> Optional[str]:
    r = requests.get(
        WIKI_API,
        params={
            "action": "query",
            "titles": page_title,
            "prop": "pageimages",
            "piprop": "name|original",
            "format": "json",
            "redirects": 1,
        },
        headers=HEADERS,
        timeout=20,
    )
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    for p in pages.values():
        if p.get("pageimage"):
            return f"File:{p['pageimage']}"
    return None


def get_commons_info(file_title: str) -> Optional[dict]:
    r = requests.get(
        COMMONS_API,
        params={
            "action": "query",
            "titles": file_title,
            "prop": "imageinfo",
            "iiprop": "url|extmetadata|size",
            "iiurlwidth": TARGET_WIDTH,
            "format": "json",
        },
        headers=HEADERS,
        timeout=20,
    )
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    for p in pages.values():
        ii = p.get("imageinfo")
        if not ii:
            continue
        info = ii[0]
        meta = info.get("extmetadata", {}) or {}
        license_short = clean_text(meta.get("LicenseShortName", {}).get("value"))
        if "non-commercial" in license_short.lower() or "nc" in license_short.lower().split():
            return None
        return {
            "thumb_url": info.get("thumburl") or info.get("url"),
            "descriptionUrl": info.get("descriptionurl"),
            "license": license_short,
            "licenseUrl": meta.get("LicenseUrl", {}).get("value"),
            "author": clean_text(meta.get("Artist", {}).get("value")),
            "credit": clean_text(meta.get("Credit", {}).get("value")),
            "fileTitle": file_title,
            "width": int(info.get("thumbwidth") or info.get("width") or 0),
            "height": int(info.get("thumbheight") or info.get("height") or 0),
        }
    return None


def fetch_image_for(entry: dict) -> Optional[dict]:
    page_title = page_title_from_url(entry["wikipediaUrl"])
    file_title = get_lead_image_filename(page_title)
    if not file_title:
        print(f"  [skip] no lead image for {entry['slug']}")
        return None
    info = get_commons_info(file_title)
    if not info or not info.get("thumb_url"):
        print(f"  [skip] no commercial license for {entry['slug']}")
        return None

    cat_dir = PUBLIC_IMG / entry["category"]
    cat_dir.mkdir(parents=True, exist_ok=True)
    # save as jpg first, then we'll convert to webp via existing script
    target = cat_dir / f"{entry['slug']}.jpg"
    r = requests.get(info["thumb_url"], headers=HEADERS, timeout=30)
    r.raise_for_status()
    target.write_bytes(r.content)
    print(f"  [ok] {entry['slug']} → {target.relative_to(ROOT)} ({len(r.content)//1024} KB)")

    return {
        "slug": entry["slug"],
        "category": entry["category"],
        "src": f"/images/catalogue/{entry['category']}/{entry['slug']}.webp",
        "alt": f"{entry['commonName']} ({entry['scientificName']})",
        "author": info["author"],
        "credit": info["credit"],
        "license": info["license"],
        "licenseUrl": info.get("licenseUrl") or "",
        "fileTitle": info["fileTitle"],
        "descriptionUrl": info.get("descriptionUrl") or "",
        "width": info["width"],
        "height": info["height"],
        "wikipediaUrl": entry["wikipediaUrl"],
    }


# ─── attribution writer ────────────────────────────────────────────────
ATTR_RE = re.compile(r"export const IMAGE_ATTRIBUTION:\s*Record<string,\s*ImageAttribution>\s*=\s*\{(.*)\}\s*as\s*const;?", re.DOTALL)
HEADER = """// Auto-generated by scripts/scrape-images-batch-06.py — do not edit by hand.
// Run that script to refresh after image edits or new entries.

import type { ImageAttribution } from "@/types/catalogue";

"""


def load_existing_attribution() -> dict:
    src = ATTRIB_TS.read_text(encoding="utf-8")
    # Extract the object body and parse loosely.
    m = ATTR_RE.search(src)
    if not m:
        # Try a relaxed form ending in `};`
        m2 = re.search(r"export const IMAGE_ATTRIBUTION:[^=]*=\s*(\{.*?\})\s*(?:as\s*const)?\s*;\s*\Z", src, re.DOTALL)
        if not m2:
            raise SystemExit("Could not locate IMAGE_ATTRIBUTION object in image-attribution.ts")
        body = m2.group(1)
    else:
        body = "{" + m.group(1) + "}"
    return json.loads(body)


def write_attribution(data: dict) -> None:
    # Sort keys alphabetically for stable diffs.
    sorted_data = {k: dict(sorted(v.items())) for k, v in sorted(data.items())}
    pretty = json.dumps(sorted_data, indent=2, ensure_ascii=False)
    out = HEADER + f"export const IMAGE_ATTRIBUTION: Record<string, ImageAttribution> = {pretty} as const;\n"
    ATTRIB_TS.write_text(out, encoding="utf-8")


def main() -> None:
    existing = load_existing_attribution()
    fetched = 0
    skipped = 0
    for entry in NEW_ENTRIES:
        if entry["slug"] in existing:
            print(f"[have] {entry['slug']}")
            continue
        print(f"[fetch] {entry['slug']}")
        record = fetch_image_for(entry)
        if record:
            existing[entry["slug"]] = record
            fetched += 1
        else:
            skipped += 1
        time.sleep(0.6)  # be polite

    if fetched:
        write_attribution(existing)
        print(f"\nWrote attribution for {fetched} new entries.")
    print(f"Done. fetched={fetched} skipped={skipped} total={len(NEW_ENTRIES)}")


if __name__ == "__main__":
    main()
