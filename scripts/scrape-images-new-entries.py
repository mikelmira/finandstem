"""
Fin & Stem — One-off image scraper for the 25 newly-added catalogue entries
(15 fish + 10 plants) that are hard-coded in src/data/*.ts and therefore not
present in the seed spreadsheet.

Behaviour:
- For each new entry, asks Wikipedia for the page's lead image, resolves it on
  Commons, downloads a ~1200 px copy, and merges an ImageAttribution record
  into src/data/image-attribution.ts (preserving everything already there).
- Skips non-commercial licenses (CC-BY-NC, etc.) — anything kept here is safe
  for commercial use with attribution.

Run from project root:
  python3 scripts/scrape-images-new-entries.py
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
    "FinAndStem/0.1 (https://finandstem.com; mikee@dsg.co.za) requests"
)
HEADERS = {"User-Agent": USER_AGENT}

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_IMG = ROOT / "public" / "images" / "catalogue"
ATTRIB_TS = ROOT / "src" / "data" / "image-attribution.ts"

TARGET_WIDTH = 1200

TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")


# --- New entries (must match src/data/fish.ts + src/data/plants.ts) ----------

NEW_ENTRIES = [
    # 15 fish
    {"slug": "zebra-danio", "category": "fish", "commonName": "Zebra Danio", "scientificName": "Danio rerio", "wikipediaUrl": "https://en.wikipedia.org/wiki/Zebrafish"},
    {"slug": "boesemani-rainbow", "category": "fish", "commonName": "Boesemani Rainbowfish", "scientificName": "Melanotaenia boesemani", "wikipediaUrl": "https://en.wikipedia.org/wiki/Boeseman%27s_rainbowfish"},
    {"slug": "praecox-rainbow", "category": "fish", "commonName": "Dwarf Neon Rainbowfish", "scientificName": "Melanotaenia praecox", "wikipediaUrl": "https://en.wikipedia.org/wiki/Melanotaenia_praecox"},
    {"slug": "bolivian-ram", "category": "fish", "commonName": "Bolivian Ram", "scientificName": "Mikrogeophagus altispinosus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Bolivian_ram"},
    {"slug": "panda-corydoras", "category": "fish", "commonName": "Panda Corydoras", "scientificName": "Corydoras panda", "wikipediaUrl": "https://en.wikipedia.org/wiki/Corydoras_panda"},
    {"slug": "bronze-corydoras", "category": "fish", "commonName": "Bronze Corydoras", "scientificName": "Corydoras aeneus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Corydoras_aeneus"},
    {"slug": "congo-tetra", "category": "fish", "commonName": "Congo Tetra", "scientificName": "Phenacogrammus interruptus", "wikipediaUrl": "https://en.wikipedia.org/wiki/Congo_tetra"},
    {"slug": "bloodfin-tetra", "category": "fish", "commonName": "Bloodfin Tetra", "scientificName": "Aphyocharax anisitsi", "wikipediaUrl": "https://en.wikipedia.org/wiki/Bloodfin_tetra"},
    {"slug": "silver-tip-tetra", "category": "fish", "commonName": "Silver Tip Tetra", "scientificName": "Hasemania nana", "wikipediaUrl": "https://en.wikipedia.org/wiki/Hasemania_nana"},
    {"slug": "dwarf-gourami", "category": "fish", "commonName": "Dwarf Gourami", "scientificName": "Trichogaster lalius", "wikipediaUrl": "https://en.wikipedia.org/wiki/Dwarf_gourami"},
    {"slug": "paradise-fish", "category": "fish", "commonName": "Paradise Fish", "scientificName": "Macropodus opercularis", "wikipediaUrl": "https://en.wikipedia.org/wiki/Paradise_fish"},
    {"slug": "scarlet-badis", "category": "fish", "commonName": "Scarlet Badis", "scientificName": "Dario dario", "wikipediaUrl": "https://en.wikipedia.org/wiki/Dario_dario"},
    {"slug": "espe-rasbora", "category": "fish", "commonName": "Lambchop Rasbora", "scientificName": "Trigonostigma espei", "wikipediaUrl": "https://en.wikipedia.org/wiki/Trigonostigma_espei"},
    {"slug": "kribensis", "category": "fish", "commonName": "Kribensis", "scientificName": "Pelvicachromis pulcher", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pelvicachromis_pulcher"},
    {"slug": "spotted-blue-eye", "category": "fish", "commonName": "Spotted Blue-eye", "scientificName": "Pseudomugil gertrudae", "wikipediaUrl": "https://en.wikipedia.org/wiki/Pseudomugil_gertrudae"},

    # 10 plants
    {"slug": "anubias-barteri", "category": "plants", "commonName": "Anubias Barteri", "scientificName": "Anubias barteri var. barteri", "wikipediaUrl": "https://en.wikipedia.org/wiki/Anubias_barteri"},
    {"slug": "cryptocoryne-balansae", "category": "plants", "commonName": "Crypt Balansae", "scientificName": "Cryptocoryne crispatula var. balansae", "wikipediaUrl": "https://en.wikipedia.org/wiki/Cryptocoryne_crispatula"},
    {"slug": "java-fern-trident", "category": "plants", "commonName": "Java Fern 'Trident'", "scientificName": "Microsorum pteropus 'Trident'", "wikipediaUrl": "https://en.wikipedia.org/wiki/Java_fern"},
    {"slug": "rotala-wallichii", "category": "plants", "commonName": "Rotala Wallichii", "scientificName": "Rotala wallichii", "wikipediaUrl": "https://en.wikipedia.org/wiki/Rotala_wallichii"},
    {"slug": "rotala-hra", "category": "plants", "commonName": "Rotala 'H'ra'", "scientificName": "Rotala rotundifolia 'H'ra'", "wikipediaUrl": "https://en.wikipedia.org/wiki/Rotala_rotundifolia"},
    {"slug": "hydrocotyle-tripartita-japan", "category": "plants", "commonName": "Hydrocotyle Tripartita 'Japan'", "scientificName": "Hydrocotyle tripartita", "wikipediaUrl": "https://en.wikipedia.org/wiki/Hydrocotyle"},
    {"slug": "brazilian-pennywort", "category": "plants", "commonName": "Brazilian Pennywort", "scientificName": "Hydrocotyle leucocephala", "wikipediaUrl": "https://en.wikipedia.org/wiki/Hydrocotyle_leucocephala"},
    {"slug": "water-wisteria", "category": "plants", "commonName": "Water Wisteria", "scientificName": "Hygrophila difformis", "wikipediaUrl": "https://en.wikipedia.org/wiki/Hygrophila_difformis"},
    {"slug": "tiger-lotus", "category": "plants", "commonName": "Tiger Lotus (Red)", "scientificName": "Nymphaea zenkeri", "wikipediaUrl": "https://en.wikipedia.org/wiki/Nymphaea_lotus"},
    {"slug": "alternanthera-reineckii-mini", "category": "plants", "commonName": "Alternanthera Reineckii 'Mini'", "scientificName": "Alternanthera reineckii 'Mini'", "wikipediaUrl": "https://en.wikipedia.org/wiki/Alternanthera_reineckii"},
]


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


def load_existing_attribution() -> dict:
    """Read the existing TS attribution file and parse the JSON-ish object."""
    if not ATTRIB_TS.exists():
        return {}
    raw = ATTRIB_TS.read_text()
    # Slice between the opening `= {` and the closing `} as const;`
    m = re.search(
        r"export const IMAGE_ATTRIBUTION:[^=]+=\s*(\{[\s\S]*\})\s*as const;",
        raw,
    )
    if not m:
        print("! could not parse existing attribution file — bailing rather than overwrite")
        sys.exit(2)
    return json.loads(m.group(1))


def main() -> int:
    PUBLIC_IMG.mkdir(parents=True, exist_ok=True)
    attribution = load_existing_attribution()
    print(f"loaded {len(attribution)} existing attributions")

    added = 0
    for e in NEW_ENTRIES:
        slug = e["slug"]
        category = e["category"]
        out_dir = PUBLIC_IMG / category
        out_dir.mkdir(parents=True, exist_ok=True)

        existing = list(out_dir.glob(f"{slug}.*"))
        if slug in attribution and existing:
            print(f"[skip]  {category}/{slug}")
            continue

        title = wiki_title_from_url(e["wikipediaUrl"])
        print(f"[scan]  {category}/{slug}  ←  {title}")

        try:
            file_title = fetch_wikipedia_lead_image(title)
            if not file_title:
                print("        ! no lead image on Wikipedia")
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
            added += 1
            time.sleep(0.4)
            print(f"        ok  {meta.get('license')}  {meta.get('width')}x{meta.get('height')}")
        except requests.HTTPError as ex:
            print(f"        ! http {ex}")
        except Exception as ex:
            print(f"        ! {ex}")

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

    print(f"\nDone. Added {added}. Total now {len(attribution)}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
