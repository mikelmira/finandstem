"""
Wikimedia Commons image scraper for the aquascaping catalogue.

Reads aquascaping-catalogue-seed.xlsx -> Image Sources sheet,
fetches the lead image for each Wikipedia article, then queries
the Wikimedia Commons API for the canonical URL, license, and
author so you can store legal attribution metadata.

LEGAL RULE: never publish a Commons image without rendering:
  Author · License · Link back to Commons file page.
For CC-BY-SA images, if you modify the image, your modified version
must also be CC-BY-SA.

USAGE:
  pip install openpyxl requests
  python scrape_images.py
Outputs:
  ./images/<slug>.jpg                  (downloaded image)
  ./image_attribution.json             (per-image metadata)

Designed to be run again safely — already-downloaded files are skipped.
"""
from __future__ import annotations

import json
import os
import sys
import time
from pathlib import Path
from typing import Optional
from urllib.parse import unquote

import requests
from openpyxl import load_workbook

WIKI_API = "https://en.wikipedia.org/w/api.php"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "AquascapingCatalogue/0.1 (contact: you@example.com)"  # CHANGE ME

HEADERS = {"User-Agent": USER_AGENT}

ROOT = Path(__file__).parent
IMG_DIR = ROOT / "images"
ATTRIB_PATH = ROOT / "image_attribution.json"
XLSX_PATH = ROOT / "aquascaping-catalogue-seed.xlsx"


def wiki_title_from_url(url: str) -> str:
    # https://en.wikipedia.org/wiki/Neon_tetra -> Neon_tetra
    return unquote(url.rstrip("/").split("/wiki/")[-1])


def fetch_wikipedia_lead_image(title: str) -> Optional[str]:
    """Return the canonical 'File:xxx' name of the lead image, or None."""
    params = {
        "action": "query",
        "format": "json",
        "prop": "pageimages",
        "piprop": "name",
        "titles": title,
    }
    r = requests.get(WIKI_API, params=params, headers=HEADERS, timeout=20)
    r.raise_for_status()
    pages = r.json().get("query", {}).get("pages", {})
    for _pid, page in pages.items():
        name = page.get("pageimage")
        if name:
            return f"File:{name}"
    return None


def fetch_commons_metadata(file_title: str) -> Optional[dict]:
    """Get URL + license + author for a File:xxx on Commons."""
    params = {
        "action": "query",
        "format": "json",
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|mime|size",
        "titles": file_title,
    }
    r = requests.get(COMMONS_API, params=params, headers=HEADERS, timeout=20)
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
            "url": info.get("url"),
            "mime": info.get("mime"),
            "width": info.get("width"),
            "height": info.get("height"),
            "license": gv("LicenseShortName"),
            "licenseUrl": gv("LicenseUrl"),
            "author": gv("Artist"),
            "credit": gv("Credit"),
            "attributionRequired": gv("AttributionRequired"),
            "objectName": gv("ObjectName"),
            "descriptionUrl": info.get("descriptionurl"),
        }
    return None


def download(url: str, dest: Path) -> None:
    if dest.exists():
        return
    r = requests.get(url, headers=HEADERS, stream=True, timeout=60)
    r.raise_for_status()
    dest.parent.mkdir(parents=True, exist_ok=True)
    with open(dest, "wb") as f:
        for chunk in r.iter_content(8192):
            f.write(chunk)


def main() -> int:
    if not XLSX_PATH.exists():
        print(f"Spreadsheet not found at {XLSX_PATH}", file=sys.stderr)
        return 1

    wb = load_workbook(XLSX_PATH, read_only=True)
    if "Image Sources" not in wb.sheetnames:
        print("Sheet 'Image Sources' not found", file=sys.stderr)
        return 1
    ws = wb["Image Sources"]

    # Column lookup from header row
    headers = [c.value for c in next(ws.iter_rows(min_row=1, max_row=1))]
    idx = {h: i for i, h in enumerate(headers)}

    attribution: dict[str, dict] = {}
    if ATTRIB_PATH.exists():
        attribution = json.loads(ATTRIB_PATH.read_text())

    IMG_DIR.mkdir(exist_ok=True)

    for row in ws.iter_rows(min_row=2, values_only=True):
        rec_id = row[idx["ID"]]
        category = row[idx["Category"]]
        common = row[idx["Common Name"]]
        wiki_url = row[idx["Wikipedia URL (start here)"]]
        if not wiki_url:
            continue

        slug_row = rec_id  # fish-001 etc.

        if slug_row in attribution and (IMG_DIR / f"{slug_row}.jpg").exists():
            print(f"[skip] {slug_row} {common}")
            continue

        title = wiki_title_from_url(wiki_url)
        print(f"[{slug_row}] {category} :: {common} :: {title}")

        try:
            file_title = fetch_wikipedia_lead_image(title)
            if not file_title:
                print(f"  ! no lead image found")
                continue
            meta = fetch_commons_metadata(file_title)
            if not meta or not meta.get("url"):
                print(f"  ! no commons metadata for {file_title}")
                continue

            ext = (meta.get("mime") or "image/jpeg").split("/")[-1]
            ext = "jpg" if ext == "jpeg" else ext
            dest = IMG_DIR / f"{slug_row}.{ext}"
            download(meta["url"], dest)

            attribution[slug_row] = {
                "id": slug_row,
                "category": category,
                "commonName": common,
                "scientificName": row[idx["Scientific Name"]],
                "wikipediaUrl": wiki_url,
                "localImage": str(dest.relative_to(ROOT)),
                **meta,
            }
            # Persist after every record so a crash doesn't lose progress
            ATTRIB_PATH.write_text(json.dumps(attribution, indent=2))
            time.sleep(0.5)  # gentle on Wikimedia API
        except requests.HTTPError as e:
            print(f"  ! http error: {e}")
        except Exception as e:
            print(f"  ! error: {e}")

    print(f"\nDone. {len(attribution)} attribution records in {ATTRIB_PATH}")
    print(f"Images in {IMG_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
