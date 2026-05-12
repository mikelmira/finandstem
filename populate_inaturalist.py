"""Fill gallery gaps using iNaturalist's CC-BY / CC0 photo pool.

Wikimedia Commons leaves some species uncovered (especially obscure aquarium-
trade plants and mosses). iNaturalist's research-grade observations contain
millions of photos — we filter strictly to CC-BY and CC0 licenses (commercial
use OK with attribution) and skip the default CC-BY-NC photos that would
break the site's monetization later.

Scans src/data/image-gallery.ts for species with 0 photos, queries
iNaturalist, and writes results to manual_images.json. Then emit_ts_data.py
generates src/data/manual-images.ts from that JSON.

Usage:
  python populate_inaturalist.py
"""
from __future__ import annotations

import json
import re
import sys
import time
from pathlib import Path

import requests

ROOT = Path(__file__).parent
GALLERY_TS = ROOT / "src" / "data" / "image-gallery.ts"
MANUAL_JSON = ROOT / "manual_images.json"

USER_AGENT = "FinAndStem/0.1 (contact: mikee@dsg.co.za)"
INAT_BASE = "https://api.inaturalist.org/v1"
HEADERS = {"User-Agent": USER_AGENT}
SLEEP = 0.5
PER_SPECIES = 5

LICENSE_URLS = {
    "cc-by": "https://creativecommons.org/licenses/by/4.0/",
    "cc-by-sa": "https://creativecommons.org/licenses/by-sa/4.0/",
    "cc0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "pd": "https://creativecommons.org/publicdomain/mark/1.0/",
}

LICENSE_SHORT = {
    "cc-by": "CC BY 4.0",
    "cc-by-sa": "CC BY-SA 4.0",
    "cc0": "CC0",
    "pd": "Public domain",
}


def find_gaps() -> dict[str, dict]:
    """Return {slug: {scientific_name, common_name}} for slugs with 0 photos.

    Reads scientific + common names from the TS catalogue files.
    """
    text = GALLERY_TS.read_text()
    # Every slug declared in IMAGE_GALLERY appears as "slug-name": [
    declared = set(re.findall(r'"([a-z][a-z0-9-]+)":\s*\[', text))

    # Read fish.ts and plants.ts to get the master slug + scientific name list.
    species_map: dict[str, dict] = {}
    for path, category in [
        (ROOT / "src" / "data" / "fish.ts", "fish"),
        (ROOT / "src" / "data" / "plants.ts", "plants"),
        (ROOT / "src" / "data" / "shrimp.ts", "shrimp"),
        (ROOT / "src" / "data" / "mosses.ts", "mosses"),
    ]:
        body = path.read_text()
        for match in re.finditer(
            r'slug:\s*"([^"]+)".*?commonName:\s*"([^"]+)".*?scientificName:\s*"([^"]+)"',
            body,
            re.DOTALL,
        ):
            slug, common, scientific = match.groups()
            species_map[slug] = {
                "category": category,
                "common": common,
                "scientific": scientific,
            }

    # Find slugs that exist in the catalogue but have 0 photos in the gallery
    # (either missing entirely OR appear with an empty array).
    gaps: dict[str, dict] = {}
    for slug, info in species_map.items():
        if slug not in declared:
            gaps[slug] = info
            continue
        # Slug is declared — check whether its array has any url entries.
        block = re.search(rf'"{re.escape(slug)}":\s*\[(.*?)\n  \]', text, re.DOTALL)
        if not block:
            continue
        if "url:" not in block.group(1):
            gaps[slug] = info
    return gaps


def search_inat(scientific_name: str) -> list[dict]:
    """Return up to PER_SPECIES CC-BY / CC0 photos for the species."""
    params = {
        "taxon_name": scientific_name,
        "photo_license": "cc-by,cc0",
        "per_page": 20,
        "order": "desc",
        "order_by": "votes",
        "quality_grade": "research",
        "photos": "true",
    }
    r = requests.get(
        f"{INAT_BASE}/observations",
        params=params,
        headers=HEADERS,
        timeout=20,
    )
    r.raise_for_status()
    data = r.json()
    observations = data.get("results", [])

    photos: list[dict] = []
    seen_urls: set[str] = set()
    for obs in observations:
        if len(photos) >= PER_SPECIES:
            break
        for p in obs.get("photos", []):
            if len(photos) >= PER_SPECIES:
                break
            license_code = p.get("license_code")
            if license_code not in ("cc-by", "cc0"):
                continue
            # iNat photo URLs come back as 'square' thumbnails — swap for 'original'.
            url = p.get("url") or ""
            if not url:
                continue
            original_url = url.replace("/square.", "/original.")
            if original_url in seen_urls:
                continue
            seen_urls.add(original_url)
            attribution = p.get("attribution") or ""
            # Format like: "(c) Mary Smith, some rights reserved (CC BY)"
            # Extract the author portion before the comma.
            author = ""
            if attribution:
                m = re.match(r"^\(c\)\s+([^,]+),", attribution)
                if m:
                    author = m.group(1).strip()
                else:
                    author = attribution.split(",")[0].strip()
            photos.append(
                {
                    "url": original_url,
                    "descriptionUrl": f"https://www.inaturalist.org/observations/{obs['id']}",
                    "fileTitle": f"iNat observation #{obs['id']}",
                    "license": LICENSE_SHORT.get(license_code, license_code.upper()),
                    "licenseUrl": LICENSE_URLS.get(license_code, ""),
                    "author": author,
                    "credit": attribution,
                    "attributionRequired": license_code == "cc-by",
                    "slot": "iNaturalist supplement",
                    "source": "inaturalist",
                }
            )
    return photos


def main() -> int:
    gaps = find_gaps()
    print(f"Found {len(gaps)} species with empty galleries.")

    # Load existing manual_images.json if present to preserve any hand-curated rows.
    existing: dict[str, list[dict]] = {}
    if MANUAL_JSON.exists():
        try:
            existing = json.loads(MANUAL_JSON.read_text())
        except Exception as e:
            print(f"  ! couldn't read existing manual_images.json: {e}", file=sys.stderr)

    out = dict(existing)
    for i, (slug, info) in enumerate(sorted(gaps.items()), 1):
        if slug in out and out[slug]:
            print(f"[{i}/{len(gaps)}] {slug}: already populated, skipping")
            continue
        print(f"[{i}/{len(gaps)}] {slug} ({info['scientific']})…")
        try:
            photos = search_inat(info["scientific"])
        except requests.RequestException as e:
            print(f"  ! iNat error: {e}", file=sys.stderr)
            time.sleep(SLEEP * 2)
            continue
        time.sleep(SLEEP)
        if photos:
            out[slug] = photos
            print(f"  -> {len(photos)} CC-BY/CC0 photos saved")
        else:
            print(f"  -> 0 photos (iNat has no CC-BY/CC0 coverage for this species)")
        # Save after each species to be crash-safe.
        MANUAL_JSON.write_text(json.dumps(out, indent=2))

    print(f"\nDone. {sum(1 for v in out.values() if v)} species with photos in manual_images.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
