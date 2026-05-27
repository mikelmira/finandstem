"""Upgrade 3 snail catalogue images to better Wikimedia files.

The initial scrape pass picked acceptable fallbacks for 4 species
(ramshorn, MTS, assassin, rabbit are all good aquarium shots), but
3 settled for sub-par files:
  · zebra-nerite-snail   → museum specimen shells
  · horned-nerite-snail  → shell-only PNG with scale bar
  · mystery-snail        → bowl with neon plastic gravel

This script replaces those three with curated aquarium-quality
Wikimedia photos and updates IMAGE_ATTRIBUTION accordingly.
"""

from __future__ import annotations

import json
import os
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "images" / "catalogue" / "snails"
ATTR_TS = ROOT / "src" / "data" / "image-attribution.ts"

# (slug, Commons filename, alt text, old local extension)
TARGETS = [
    (
        "zebra-nerite-snail",
        "Zebra Nerite Snail (Neritina natalensis sp. zebra) on glass.jpg",
        "Zebra Nerite Snail (Neritina natalensis) clinging to aquarium glass",
        ".jpg",
    ),
    (
        "horned-nerite-snail",
        "Clithon corona, Horned nerite snail from the Philippines 02.jpg",
        "Horned Nerite Snail (Clithon corona) — live snail with distinctive horn spines",
        ".png",
    ),
    (
        "mystery-snail",
        "Pomacea bridgesii 01.jpg",
        "Mystery Snail (Pomacea bridgesii) — golden-ivory body with long antennae",
        ".jpg",
    ),
]

USER_AGENT = "fin-and-stem/1.0 (https://finandstem.com)"


def fetch_meta(filename: str) -> dict:
    url = (
        "https://commons.wikimedia.org/w/api.php?action=query&format=json"
        "&prop=imageinfo&iiprop=url|extmetadata|size"
        "&titles=File:" + urllib.parse.quote(filename)
    )
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode("utf-8"))


def strip_html(s: str) -> str:
    return re.sub(r"<[^>]+>", "", s or "").strip()


def update_attribution(
    ts_text: str,
    slug: str,
    *,
    src: str,
    alt: str,
    author: str,
    license_short: str,
    license_url: str,
    description_url: str,
    file_title: str,
    width: int,
    height: int,
) -> str:
    entry = {
        "alt": alt,
        "author": author,
        "category": "snails",
        "credit": "",
        "descriptionUrl": description_url,
        "fileTitle": file_title,
        "height": height,
        "license": license_short,
        "slug": slug,
        "src": src,
        "width": width,
        "wikipediaUrl": "",
    }
    if license_url:
        entry["licenseUrl"] = license_url
    json_str = json.dumps(entry, indent=2, sort_keys=True)
    indented = "\n".join("  " + line for line in json_str.splitlines())
    pattern = re.compile(
        r'(\n  \"' + re.escape(slug) + r'\":\s*)\{[^{}]*\}',
        re.DOTALL,
    )
    if pattern.search(ts_text):
        return pattern.sub(lambda m: m.group(1) + indented, ts_text)
    return ts_text


def main() -> None:
    ts_text = ATTR_TS.read_text()
    saved = 0
    for slug, filename, alt, old_ext in TARGETS:
        print(f"→ {slug}")
        try:
            data = fetch_meta(filename)
        except Exception as exc:
            print(f"  meta fetch failed: {exc}")
            continue
        pages = data.get("query", {}).get("pages", {})
        page = next(iter(pages.values()), {})
        if page.get("missing") is not None or "imageinfo" not in page:
            print(f"  file missing on Commons; skipping")
            continue
        ii = page["imageinfo"][0]
        url = ii.get("url")
        if not url:
            continue
        md = ii.get("extmetadata", {})
        license_short = md.get("LicenseShortName", {}).get("value", "Unknown")
        license_url = md.get("LicenseUrl", {}).get("value", "")
        author = strip_html(md.get("Artist", {}).get("value", "Unknown"))
        width = ii.get("width", 0)
        height = ii.get("height", 0)
        description_url = (
            "https://commons.wikimedia.org/wiki/File:"
            + urllib.parse.quote(filename)
        )

        new_ext = os.path.splitext(url)[1].lower() or ".jpg"
        # Delete old file if extension changed
        old_local = OUT_DIR / f"{slug}{old_ext}"
        if old_local.exists() and new_ext != old_ext:
            old_local.unlink()
            print(f"  removed old {old_local.name}")
        new_local = OUT_DIR / f"{slug}{new_ext}"

        for attempt in range(3):
            try:
                req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
                with urllib.request.urlopen(req) as r, open(new_local, "wb") as f:
                    f.write(r.read())
                print(f"  saved {new_local.name}  ({license_short} · {author[:40]})")
                saved += 1
                break
            except Exception as exc:
                wait = 2 ** attempt * 3
                print(f"  download failed ({exc}); waiting {wait}s")
                time.sleep(wait)
        else:
            continue

        ts_text = update_attribution(
            ts_text,
            slug,
            src=f"/images/catalogue/snails/{slug}{new_ext}",
            alt=alt,
            author=author,
            license_short=license_short,
            license_url=license_url,
            description_url=description_url,
            file_title=f"File:{filename}",
            width=width,
            height=height,
        )
        time.sleep(2)

    ATTR_TS.write_text(ts_text)
    print(f"\nWrote {ATTR_TS}")
    print(f"Upgraded {saved} / {len(TARGETS)} snail images")


if __name__ == "__main__":
    main()
