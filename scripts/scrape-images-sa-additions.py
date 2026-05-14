"""
One-off adapter — fetch Wikimedia Commons images and attribution
metadata for the 20 South-African-aquarium-hobby additions.

The main scrape-images.py reads the (read-only) seed spreadsheet
which doesn't carry these new entries. Rather than mutate the
spreadsheet, this script supplies the same shape inline and reuses
the primary script's fetch helpers via `import scrape_images`.
"""
from __future__ import annotations

import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Dynamic import — the primary script's filename uses a hyphen which
# isn't a valid Python identifier, so we load it via importlib.
spec = importlib.util.spec_from_file_location(
    "scrape_images", ROOT / "scripts" / "scrape-images.py"
)
assert spec and spec.loader, "Could not load scrape-images.py"
si = importlib.util.module_from_spec(spec)
spec.loader.exec_module(si)

# 20 new SA-hobby entries — slug, category, wikipedia URL
NEW_ENTRIES: list[dict] = [
    # Fish (10)
    {
        "slug": "guppy",
        "category": "fish",
        "commonName": "Guppy",
        "scientificName": "Poecilia reticulata",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Guppy",
    },
    {
        "slug": "platy",
        "category": "fish",
        "commonName": "Southern Platy",
        "scientificName": "Xiphophorus maculatus",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Xiphophorus_maculatus",
    },
    {
        "slug": "sailfin-molly",
        "category": "fish",
        "commonName": "Sailfin Molly",
        "scientificName": "Poecilia latipinna",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Sailfin_molly",
    },
    {
        "slug": "swordtail",
        "category": "fish",
        "commonName": "Green Swordtail",
        "scientificName": "Xiphophorus hellerii",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Green_swordtail",
    },
    {
        "slug": "zebra-danio",
        "category": "fish",
        "commonName": "Zebra Danio",
        "scientificName": "Danio rerio",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Zebrafish",
    },
    {
        "slug": "tiger-barb",
        "category": "fish",
        "commonName": "Tiger Barb",
        "scientificName": "Puntigrus tetrazona",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Tiger_barb",
    },
    {
        "slug": "black-skirt-tetra",
        "category": "fish",
        "commonName": "Black Skirt Tetra",
        "scientificName": "Gymnocorymbus ternetzi",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Black_tetra",
    },
    {
        "slug": "bronze-corydoras",
        "category": "fish",
        "commonName": "Bronze Corydoras",
        "scientificName": "Corydoras aeneus",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Corydoras_aeneus",
    },
    {
        "slug": "angelfish",
        "category": "fish",
        "commonName": "Angelfish",
        "scientificName": "Pterophyllum scalare",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Pterophyllum_scalare",
    },
    {
        "slug": "red-tail-shark",
        "category": "fish",
        "commonName": "Red-Tailed Black Shark",
        "scientificName": "Epalzeorhynchos bicolor",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Red-tailed_black_shark",
    },

    # Plants (10)
    {
        "slug": "hygrophila-corymbosa",
        "category": "plants",
        "commonName": "Temple Plant",
        "scientificName": "Hygrophila corymbosa",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Hygrophila_corymbosa",
    },
    {
        "slug": "water-wisteria",
        "category": "plants",
        "commonName": "Water Wisteria",
        "scientificName": "Hygrophila difformis",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Hygrophila_difformis",
    },
    {
        "slug": "brazilian-pennywort",
        "category": "plants",
        "commonName": "Brazilian Pennywort",
        "scientificName": "Hydrocotyle leucocephala",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Hydrocotyle_leucocephala",
    },
    {
        "slug": "bacopa-monnieri",
        "category": "plants",
        "commonName": "Bacopa Monnieri",
        "scientificName": "Bacopa monnieri",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Bacopa_monnieri",
    },
    {
        "slug": "anubias-barteri",
        "category": "plants",
        "commonName": "Anubias Barteri",
        "scientificName": "Anubias barteri var. barteri",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Anubias_barteri",
    },
    {
        "slug": "cabomba",
        "category": "plants",
        "commonName": "Green Cabomba",
        "scientificName": "Cabomba caroliniana",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Cabomba_caroliniana",
    },
    {
        "slug": "anacharis",
        "category": "plants",
        "commonName": "Anacharis",
        "scientificName": "Egeria densa",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Egeria_densa",
    },
    {
        "slug": "red-tiger-lotus",
        "category": "plants",
        "commonName": "Red Tiger Lotus",
        "scientificName": "Nymphaea zenkeri",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Nymphaea_zenkeri",
    },
    {
        "slug": "cryptocoryne-balansae",
        "category": "plants",
        "commonName": "Cryptocoryne Balansae",
        "scientificName": "Cryptocoryne crispatula var. balansae",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Cryptocoryne_crispatula",
    },
    {
        "slug": "hydrocotyle-japan",
        "category": "plants",
        "commonName": "Hydrocotyle Tripartita 'Japan'",
        "scientificName": "Hydrocotyle tripartita 'Japan'",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Hydrocotyle",
    },
]


def load_attribution() -> dict:
    if not si.ATTRIB_TS.exists():
        return {}
    raw = si.ATTRIB_TS.read_text()
    m = re.search(
        r"export const IMAGE_ATTRIBUTION:[^=]*=\s*(\{[\s\S]*?\});",
        raw,
    )
    if not m:
        return {}
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return {}


def write_attribution(records: dict) -> None:
    sorted_recs = dict(sorted(records.items()))
    body = json.dumps(sorted_recs, indent=2, ensure_ascii=False)
    out = (
        "// Auto-generated by scripts/scrape-images*.py — do not edit by hand.\n"
        "// Run that script to refresh after image edits or new entries.\n\n"
        'import type { ImageAttribution } from "@/types/catalogue";\n\n'
        f"export const IMAGE_ATTRIBUTION: Record<string, ImageAttribution> = {body};\n"
    )
    si.ATTRIB_TS.write_text(out)


def main() -> int:
    attribution = load_attribution()
    si.PUBLIC_IMG.mkdir(parents=True, exist_ok=True)

    for e in NEW_ENTRIES:
        slug = e["slug"]
        category = e["category"]
        out_dir = si.PUBLIC_IMG / category
        out_dir.mkdir(parents=True, exist_ok=True)

        existing = list(out_dir.glob(f"{slug}.*"))
        if slug in attribution and existing:
            print(f"[skip]  {category}/{slug}")
            continue

        title = si.wiki_title_from_url(e["wikipediaUrl"])
        print(f"[scan]  {category}/{slug}  ←  {title}")

        try:
            file_title = si.fetch_wikipedia_lead_image(title)
            if not file_title:
                print("        ! no lead image, try the article's image list")
                # Fallback path: list images on the article
                params = {
                    "action": "query",
                    "format": "json",
                    "titles": title,
                    "prop": "images",
                    "imlimit": 50,
                }
                import requests

                r = requests.get(
                    si.WIKI_API, params=params, headers=si.HEADERS, timeout=20
                )
                r.raise_for_status()
                pages = r.json().get("query", {}).get("pages", {})
                images: list[str] = []
                for p in pages.values():
                    for img in p.get("images", []):
                        t = img.get("title", "")
                        if t.lower().endswith((".jpg", ".jpeg", ".png")) and not any(
                            bad in t.lower()
                            for bad in [
                                "logo",
                                "wiki",
                                "commons-logo",
                                "icon",
                                "flag",
                                "map",
                            ]
                        ):
                            images.append(t)
                if not images:
                    print("        ! no usable images")
                    continue
                file_title = images[0]

            meta = si.fetch_commons_metadata(file_title)
            if not meta:
                print("        ! no metadata")
                continue
            if not si.is_commercial_safe(meta["license"]):
                print(f"        ! license blocked: {meta['license']}")
                continue

            ext = si.ext_from_mime(meta.get("mime"))
            dest = out_dir / f"{slug}.{ext}"
            si.download(meta["url"], dest)

            attribution[slug] = {
                "alt": f"{e['commonName']} ({e['scientificName']})",
                "author": meta["author"],
                "category": category,
                "credit": meta["credit"],
                "descriptionUrl": meta["descriptionUrl"],
                "fileTitle": file_title,
                "height": meta["height"],
                "license": meta["license"],
                "licenseUrl": meta.get("licenseUrl", ""),
                "slug": slug,
                "src": f"/images/catalogue/{category}/{slug}.{ext}",
                "width": meta["width"],
                "wikipediaUrl": e["wikipediaUrl"],
            }
            # Drop empty licenseUrl to match existing record shape
            if not attribution[slug]["licenseUrl"]:
                del attribution[slug]["licenseUrl"]
            print(
                f"        ✓ {category}/{slug}.{ext}  ({meta['license']}, {meta['author']})"
            )
        except Exception as exc:
            print(f"        ! error: {exc}")

    write_attribution(attribution)
    print(f"\nWrote {si.ATTRIB_TS.relative_to(ROOT)} with {len(attribution)} records.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
