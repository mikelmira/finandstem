"""Fin & Stem — Wikimedia image scraper for the 43 new species in session 07.

Pulls lead images from Wikipedia for each entry, downloads ~1200 px copies
as .jpg, and merges new ImageAttribution records into image-attribution.ts.

Run from project root:
  python3 scripts/scrape-images-batch-07.py
"""
from __future__ import annotations

import html
import json
import re
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
    # 15 fish
    {"slug": "pearl-danio", "category": "fish", "commonName": "Pearl Danio", "scientificName": "Danio albolineatus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pearl_danio"},
    {"slug": "buenos-aires-tetra", "category": "fish", "commonName": "Buenos Aires Tetra", "scientificName": "Hyphessobrycon anisitsi", "wikipediaUrl": "https://en.wikipedia.org/wiki/Hyphessobrycon_anisitsi"},
    {"slug": "black-molly", "category": "fish", "commonName": "Black Molly", "scientificName": "Poecilia sphenops", "wikipediaUrl": "https://en.wikipedia.org/wiki/Poecilia_sphenops"},
    {"slug": "common-pleco", "category": "fish", "commonName": "Common Pleco", "scientificName": "Pterygoplichthys pardalis", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pterygoplichthys_pardalis"},
    {"slug": "peacock-gudgeon", "category": "fish", "commonName": "Peacock Gudgeon", "scientificName": "Tateurndina ocellicauda", "wikipediaUrl": "https://en.wikipedia.org/wiki/Peacock_gudgeon"},
    {"slug": "apistogramma-borellii", "category": "fish", "commonName": "Umbrella Cichlid", "scientificName": "Apistogramma borellii", "wikipediaUrl": "https://en.wikipedia.org/wiki/Apistogramma_borellii"},
    {"slug": "keyhole-cichlid", "category": "fish", "commonName": "Keyhole Cichlid", "scientificName": "Cleithracara maronii", "wikipediaUrl": "https://en.wikipedia.org/wiki/Keyhole_cichlid"},
    {"slug": "discus", "category": "fish", "commonName": "Discus", "scientificName": "Symphysodon aequifasciatus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Symphysodon_aequifasciatus"},
    {"slug": "three-spot-gourami", "category": "fish", "commonName": "Three-spot Gourami", "scientificName": "Trichopodus trichopterus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Three_spot_gourami"},
    {"slug": "kissing-gourami", "category": "fish", "commonName": "Kissing Gourami", "scientificName": "Helostoma temminckii", "wikipediaUrl": "https://en.wikipedia.org/wiki/Kissing_gourami"},
    {"slug": "false-julii-cory", "category": "fish", "commonName": "False Julii Cory", "scientificName": "Corydoras trilineatus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Corydoras_trilineatus"},
    {"slug": "salt-and-pepper-cory", "category": "fish", "commonName": "Salt and Pepper Cory", "scientificName": "Corydoras habrosus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Corydoras_habrosus"},
    {"slug": "clown-loach", "category": "fish", "commonName": "Clown Loach", "scientificName": "Chromobotia macracanthus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Clown_loach"},
    {"slug": "florida-flagfish", "category": "fish", "commonName": "Florida Flagfish", "scientificName": "Jordanella floridae", "wikipediaUrl": "https://en.wikipedia.org/wiki/Jordanella_floridae"},
    {"slug": "pacific-blue-eye", "category": "fish", "commonName": "Pacific Blue Eye", "scientificName": "Pseudomugil signifer", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pacific_blue_eye"},
    # 15 plants
    {"slug": "limnophila-aromatica", "category": "plants", "commonName": "Limnophila Aromatica", "scientificName": "Limnophila aromatica", "wikipediaUrl": "https://en.wikipedia.org/wiki/Limnophila_aromatica"},
    {"slug": "bacopa-salzmannii", "category": "plants", "commonName": "Purple Bacopa", "scientificName": "Bacopa salzmannii", "wikipediaUrl": "https://en.wikipedia.org/wiki/Bacopa"},
    {"slug": "hornwort", "category": "plants", "commonName": "Hornwort", "scientificName": "Ceratophyllum demersum", "wikipediaUrl": "https://en.wikipedia.org/wiki/Ceratophyllum_demersum"},
    {"slug": "marsilea-quadrifolia", "category": "plants", "commonName": "Four-Leaf Clover", "scientificName": "Marsilea quadrifolia", "wikipediaUrl": "https://en.wikipedia.org/wiki/Marsilea_quadrifolia"},
    {"slug": "aponogeton-madagascariensis", "category": "plants", "commonName": "Madagascar Lace", "scientificName": "Aponogeton madagascariensis", "wikipediaUrl": "https://en.wikipedia.org/wiki/Aponogeton_madagascariensis"},
    {"slug": "crinum-calamistratum", "category": "plants", "commonName": "Crinum Calamistratum", "scientificName": "Crinum calamistratum", "wikipediaUrl": "https://en.wikipedia.org/wiki/Crinum_calamistratum"},
    {"slug": "pogostemon-erectus", "category": "plants", "commonName": "Pogostemon Erectus", "scientificName": "Pogostemon erectus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pogostemon"},
    {"slug": "guppy-grass", "category": "plants", "commonName": "Guppy Grass", "scientificName": "Najas guadalupensis", "wikipediaUrl": "https://en.wikipedia.org/wiki/Najas_guadalupensis"},
    {"slug": "anubias-coffeefolia", "category": "plants", "commonName": "Anubias Coffeefolia", "scientificName": "Anubias barteri", "wikipediaUrl": "https://en.wikipedia.org/wiki/Anubias_barteri"},
    {"slug": "anubias-hastifolia", "category": "plants", "commonName": "Spear-leaf Anubias", "scientificName": "Anubias hastifolia", "wikipediaUrl": "https://en.wikipedia.org/wiki/Anubias_hastifolia"},
    {"slug": "echinodorus-ozelot", "category": "plants", "commonName": "Echinodorus Ozelot", "scientificName": "Echinodorus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Echinodorus"},
    {"slug": "vallisneria-americana", "category": "plants", "commonName": "Jungle Vallisneria", "scientificName": "Vallisneria americana", "wikipediaUrl": "https://en.wikipedia.org/wiki/Vallisneria_americana"},
    {"slug": "eichhornia-diversifolia", "category": "plants", "commonName": "Eichhornia Diversifolia", "scientificName": "Eichhornia diversifolia", "wikipediaUrl": "https://en.wikipedia.org/wiki/Eichhornia"},
    {"slug": "taiwan-moss-lily", "category": "plants", "commonName": "Taiwan Moss Lily", "scientificName": "Nymphoides hydrophylla", "wikipediaUrl": "https://en.wikipedia.org/wiki/Nymphoides"},
    {"slug": "sagittaria-platyphylla", "category": "plants", "commonName": "Giant Sagittaria", "scientificName": "Sagittaria platyphylla", "wikipediaUrl": "https://en.wikipedia.org/wiki/Sagittaria_platyphylla"},
    # 5 shrimp
    {"slug": "green-jade-shrimp", "category": "shrimp", "commonName": "Green Jade Shrimp", "scientificName": "Neocaridina davidi", "wikipediaUrl": "https://en.wikipedia.org/wiki/Neocaridina_davidi"},
    {"slug": "tiger-shrimp", "category": "shrimp", "commonName": "Tiger Shrimp", "scientificName": "Caridina mariae", "wikipediaUrl": "https://en.wikipedia.org/wiki/Caridina"},
    {"slug": "sulawesi-cardinal-shrimp", "category": "shrimp", "commonName": "Sulawesi Cardinal Shrimp", "scientificName": "Caridina dennerli", "wikipediaUrl": "https://en.wikipedia.org/wiki/Caridina_dennerli"},
    {"slug": "vampire-shrimp", "category": "shrimp", "commonName": "Vampire Shrimp", "scientificName": "Atya gabonensis", "wikipediaUrl": "https://en.wikipedia.org/wiki/Atya_gabonensis"},
    {"slug": "black-rose-shrimp", "category": "shrimp", "commonName": "Black Rose Shrimp", "scientificName": "Neocaridina davidi", "wikipediaUrl": "https://en.wikipedia.org/wiki/Neocaridina_davidi"},
    # 5 snails
    {"slug": "black-devil-snail", "category": "snails", "commonName": "Black Devil Snail", "scientificName": "Faunus ater", "wikipediaUrl": "https://en.wikipedia.org/wiki/Faunus_ater"},
    {"slug": "pond-snail", "category": "snails", "commonName": "Pond Snail", "scientificName": "Physa acuta", "wikipediaUrl": "https://en.wikipedia.org/wiki/Physa_acuta"},
    {"slug": "colombian-ramshorn", "category": "snails", "commonName": "Colombian Ramshorn", "scientificName": "Marisa cornuarietis", "wikipediaUrl": "https://en.wikipedia.org/wiki/Marisa_cornuarietis"},
    {"slug": "spixi-snail", "category": "snails", "commonName": "Spixi Snail", "scientificName": "Asolene spixii", "wikipediaUrl": "https://en.wikipedia.org/wiki/Asolene_spixii"},
    {"slug": "japanese-trapdoor-snail", "category": "snails", "commonName": "Japanese Trapdoor Snail", "scientificName": "Cipangopaludina chinensis", "wikipediaUrl": "https://en.wikipedia.org/wiki/Cipangopaludina_chinensis"},
    # 3 mosses
    {"slug": "singapore-moss", "category": "mosses", "commonName": "Singapore Moss", "scientificName": "Vesicularia dubyana", "wikipediaUrl": "https://en.wikipedia.org/wiki/Vesicularia_dubyana"},
    {"slug": "stringy-moss", "category": "mosses", "commonName": "Stringy Moss", "scientificName": "Leptodictyum riparium", "wikipediaUrl": "https://en.wikipedia.org/wiki/Leptodictyum_riparium"},
    {"slug": "round-pellia", "category": "mosses", "commonName": "Round Pellia", "scientificName": "Monosolenium tenerum", "wikipediaUrl": "https://en.wikipedia.org/wiki/Monosolenium"},
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
    r = requests.get(WIKI_API, params={"action": "query", "titles": page_title, "prop": "pageimages", "piprop": "name|original", "format": "json", "redirects": 1}, headers=HEADERS, timeout=20)
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    for p in pages.values():
        if p.get("pageimage"):
            return f"File:{p['pageimage']}"
    return None


def get_commons_info(file_title: str) -> Optional[dict]:
    r = requests.get(COMMONS_API, params={"action": "query", "titles": file_title, "prop": "imageinfo", "iiprop": "url|extmetadata|size", "iiurlwidth": TARGET_WIDTH, "format": "json"}, headers=HEADERS, timeout=20)
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
        return {"thumb_url": info.get("thumburl") or info.get("url"), "descriptionUrl": info.get("descriptionurl"), "license": license_short, "licenseUrl": meta.get("LicenseUrl", {}).get("value"), "author": clean_text(meta.get("Artist", {}).get("value")), "credit": clean_text(meta.get("Credit", {}).get("value")), "fileTitle": file_title, "width": int(info.get("thumbwidth") or info.get("width") or 0), "height": int(info.get("thumbheight") or info.get("height") or 0)}
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
    target = cat_dir / f"{entry['slug']}.jpg"
    r = requests.get(info["thumb_url"], headers=HEADERS, timeout=30)
    r.raise_for_status()
    target.write_bytes(r.content)
    print(f"  [ok] {entry['slug']} → {target.relative_to(ROOT)} ({len(r.content)//1024} KB)")
    return {"slug": entry["slug"], "category": entry["category"], "src": f"/images/catalogue/{entry['category']}/{entry['slug']}.webp", "alt": f"{entry['commonName']} ({entry['scientificName']})", "author": info["author"], "credit": info["credit"], "license": info["license"], "licenseUrl": info.get("licenseUrl") or "", "fileTitle": info["fileTitle"], "descriptionUrl": info.get("descriptionUrl") or "", "width": info["width"], "height": info["height"], "wikipediaUrl": entry["wikipediaUrl"]}


def load_existing_attribution() -> dict:
    src = ATTRIB_TS.read_text(encoding="utf-8")
    m = re.search(r"export const IMAGE_ATTRIBUTION:[^=]*=\s*(\{.*?\})\s*as\s*const\s*;\s*\Z", src, re.DOTALL)
    if not m:
        raise SystemExit("Could not locate IMAGE_ATTRIBUTION object")
    return json.loads(m.group(1))


def write_attribution(data: dict) -> None:
    sorted_data = {k: dict(sorted(v.items())) for k, v in sorted(data.items())}
    pretty = json.dumps(sorted_data, indent=2, ensure_ascii=False)
    header = "// Auto-generated by scripts/scrape-images-batch-*.py — do not edit by hand.\n// Run that script to refresh after image edits or new entries.\n\nimport type { ImageAttribution } from \"@/types/catalogue\";\n\n"
    ATTRIB_TS.write_text(header + f"export const IMAGE_ATTRIBUTION: Record<string, ImageAttribution> = {pretty} as const;\n", encoding="utf-8")


def main() -> None:
    existing = load_existing_attribution()
    fetched = skipped = 0
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
        time.sleep(0.6)
    if fetched:
        write_attribution(existing)
        print(f"\nWrote attribution for {fetched} new entries.")
    print(f"Done. fetched={fetched} skipped={skipped} total={len(NEW_ENTRIES)}")


if __name__ == "__main__":
    main()
