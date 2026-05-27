"""Download Wikimedia Commons images for /history-of-aquascaping.

Targets curated images that illustrate the Dutch → Amano → modern arc.
Saves each to public/images/history/ and emits a JSON manifest with
license + author + Commons source URL for legal attribution.
"""

from __future__ import annotations

import json
import os
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "images" / "history"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# (slug, commons-filename, alt-text). Slug becomes the local filename.
TARGETS = [
    (
        "florestas-submersas-hero",
        "Florestas Submersas by Takashi Amano (31995078117).jpg",
        "Florestas Submersas — Takashi Amano's 160,000-litre installation at Oceanário de Lisboa, his final major project",
    ),
    (
        "florestas-submersas-wide",
        "Oceanario 2018 1.jpg",
        "Wide view of Takashi Amano's Florestas Submersas Nature Aquarium installation at the Lisbon Oceanarium",
    ),
    (
        "iwagumi-scape",
        "Iwagumi Scape.jpg",
        "A classic Iwagumi-style planted aquarium with stones arranged according to Japanese garden principles",
    ),
    (
        "nature-style-aquascape",
        "Nature style aquascape.png",
        "Nature Aquarium style planted tank in the Takashi Amano tradition — driftwood, dense plants, asymmetric composition",
    ),
    (
        "aga-contest-winner",
        "Cho Jaesun 2020 AGA Top 10.jpg",
        "Cho Jaesun's AGA-contest top-ten aquascape — an example of contemporary contest-style aquarium design",
    ),
    (
        "planted-shrimp-tank",
        "Live planted aquarium with neocaridina shrimp.jpg",
        "A modern planted aquarium with Neocaridina shrimp foraging across the substrate",
    ),
    (
        "triangle-design",
        "Aquascape im Triangel Design.jpg",
        "Triangular composition aquascape — a contest-driven evolution of the Nature Aquarium style",
    ),
]


def fetch_meta(filename: str) -> dict:
    url = (
        "https://commons.wikimedia.org/w/api.php?action=query&format=json"
        "&prop=imageinfo&iiprop=url|extmetadata"
        "&titles=File:" + urllib.parse.quote(filename)
    )
    req = urllib.request.Request(url, headers={"User-Agent": "fin-and-stem/1.0"})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode("utf-8"))


def strip_html(s: str) -> str:
    """Crude HTML strip for the Artist field."""
    import re

    return re.sub(r"<[^>]+>", "", s).strip()


def main() -> None:
    manifest = []
    for slug, filename, alt in TARGETS:
        print(f"→ {slug}")
        for attempt in range(4):
            try:
                data = fetch_meta(filename)
                break
            except Exception as exc:
                wait = 2 ** attempt * 3
                print(f"  meta fetch failed ({exc}); waiting {wait}s")
                time.sleep(wait)
        else:
            print(f"  giving up on {slug}")
            continue
        pages = data.get("query", {}).get("pages", {})
        page = next(iter(pages.values()), {})
        ii = page.get("imageinfo", [{}])[0]
        url = ii.get("url")
        if not url:
            print(f"  no url; skipping")
            continue
        md = ii.get("extmetadata", {})
        license_short = md.get("LicenseShortName", {}).get("value", "Unknown")
        license_url = md.get("LicenseUrl", {}).get("value", "")
        artist = strip_html(md.get("Artist", {}).get("value", "Unknown"))
        commons_file = (
            "https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(filename)
        )

        ext = os.path.splitext(url)[1].lower() or ".jpg"
        local_filename = f"{slug}{ext}"
        local_path = OUT_DIR / local_filename
        if not local_path.exists():
            for attempt in range(4):
                try:
                    req = urllib.request.Request(
                        url, headers={"User-Agent": "fin-and-stem/1.0"}
                    )
                    with urllib.request.urlopen(req) as r, open(local_path, "wb") as f:
                        f.write(r.read())
                    print(f"  saved {local_filename}")
                    break
                except Exception as exc:
                    wait = 2 ** attempt * 3
                    print(f"  download failed ({exc}); waiting {wait}s")
                    time.sleep(wait)
        else:
            print(f"  already on disk")
        time.sleep(2)

        manifest.append(
            {
                "slug": slug,
                "src": f"/images/history/{local_filename}",
                "alt": alt,
                "author": artist,
                "license": license_short,
                "licenseUrl": license_url,
                "source": commons_file,
            }
        )

    out = OUT_DIR / "_manifest.json"
    out.write_text(json.dumps(manifest, indent=2))
    print(f"\nWrote {out} with {len(manifest)} entries")


if __name__ == "__main__":
    main()
