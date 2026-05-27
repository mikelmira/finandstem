"""Scrape Wikimedia Commons images for the snail catalogue.

For each slug, fetches a curated Wikimedia file and merges its
attribution into src/data/image-attribution.ts. Saves the image to
public/images/catalogue/snails/.
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
OUT_DIR.mkdir(parents=True, exist_ok=True)
ATTR_TS = ROOT / "src" / "data" / "image-attribution.ts"

# (slug, Commons file, alt text)
TARGETS = [
    (
        "zebra-nerite-snail",
        "Zebra Nerite snail in our shrimp tank (15049923475).jpg",
        "Zebra Nerite Snail (Neritina natalensis) on aquarium glass",
    ),
    (
        "mystery-snail",
        "Pomacea bridgesii.jpg",
        "Mystery Snail (Pomacea bridgesii) crawling on driftwood",
    ),
    (
        "ramshorn-snail",
        "Planorbella duryi.jpg",
        "Ramshorn Snail (Planorbella duryi) — spiral flat shell",
    ),
    (
        "malaysian-trumpet-snail",
        "Melanoides tuberculata 01.jpg",
        "Malaysian Trumpet Snail (Melanoides tuberculata) on substrate",
    ),
    (
        "assassin-snail",
        "Anentome helena.jpg",
        "Assassin Snail (Anentome helena) — yellow-and-brown striped conical shell",
    ),
    (
        "rabbit-snail",
        "Tylomelania sp.jpg",
        "Rabbit Snail (Tylomelania sp.) — long conical shell with prominent antennae",
    ),
    (
        "horned-nerite-snail",
        "Clithon corona.jpg",
        "Horned Nerite Snail (Clithon corona) — small black-and-yellow shell with horn spines",
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


def search_first(query: str) -> str | None:
    """Fallback: search Commons for the first file matching the query."""
    url = (
        "https://commons.wikimedia.org/w/api.php?action=query&format=json"
        "&list=search&srnamespace=6&srlimit=5&srsearch="
        + urllib.parse.quote(query)
    )
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read().decode("utf-8"))
    results = data.get("query", {}).get("search", [])
    for r in results:
        title = r["title"]
        if title.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            return title.replace("File:", "")
    return None


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
    entry = json.dumps(
        {
            "alt": alt,
            "author": author,
            "category": "snails",
            "credit": "",
            "descriptionUrl": description_url,
            "fileTitle": file_title,
            "height": height,
            "license": license_short,
            "licenseUrl": license_url or None,
            "slug": slug,
            "src": src,
            "width": width,
            "wikipediaUrl": "",
        },
        indent=2,
        sort_keys=True,
    )
    # Drop None entries (licenseUrl when absent)
    entry = re.sub(r',?\n\s*"\w+":\s*null', "", entry)
    indented = "\n".join("  " + line for line in entry.splitlines())

    # If the slug entry already exists, replace it. Otherwise, append
    # before the closing `};` of the object.
    pattern = re.compile(
        r'(\n  \"' + re.escape(slug) + r'\":\s*)\{[^{}]*\}',
        re.DOTALL,
    )
    if pattern.search(ts_text):
        return pattern.sub(lambda m: m.group(1) + indented, ts_text)
    # Append before the closing brace. Use lambda to avoid escape-processing.
    insertion = ",\n" + indented + "\n};\n"
    return re.sub(r"\n\};\s*$", lambda _m: insertion, ts_text)


def main() -> None:
    ts_text = ATTR_TS.read_text()
    saved = 0
    for slug, filename, alt in TARGETS:
        print(f"→ {slug}")
        actual_filename = filename
        try:
            data = fetch_meta(actual_filename)
        except Exception as exc:
            print(f"  meta fetch failed: {exc}")
            continue
        pages = data.get("query", {}).get("pages", {})
        page = next(iter(pages.values()), {})

        # If the curated file is missing, search Commons for a fallback
        if page.get("missing") is not None or "imageinfo" not in page:
            print(f"  curated file missing; searching")
            fallback = None
            try:
                # Search by scientific name from the alt text
                m = re.search(r"\(([^)]+)\)", alt)
                if m:
                    fallback = search_first(m.group(1))
            except Exception as exc:
                print(f"  search failed: {exc}")
            if not fallback:
                print(f"  no fallback found; skipping")
                time.sleep(2)
                continue
            actual_filename = fallback
            print(f"  using fallback: {actual_filename}")
            time.sleep(2)
            try:
                data = fetch_meta(actual_filename)
            except Exception as exc:
                print(f"  fallback meta fetch failed: {exc}")
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
        author = strip_html(md.get("Artist", {}).get("value", "Unknown"))
        width = ii.get("width", 0)
        height = ii.get("height", 0)
        description_url = (
            "https://commons.wikimedia.org/wiki/File:"
            + urllib.parse.quote(actual_filename)
        )

        new_ext = os.path.splitext(url)[1].lower() or ".jpg"
        local = OUT_DIR / f"{slug}{new_ext}"

        for attempt in range(3):
            try:
                req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
                with urllib.request.urlopen(req) as r, open(local, "wb") as f:
                    f.write(r.read())
                print(f"  saved {local.name}  ({license_short} · {author[:40]})")
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
            file_title=f"File:{actual_filename}",
            width=width,
            height=height,
        )
        time.sleep(2)

    ATTR_TS.write_text(ts_text)
    print(f"\nWrote {ATTR_TS}")
    print(f"Saved {saved} / {len(TARGETS)} images")


if __name__ == "__main__":
    main()
