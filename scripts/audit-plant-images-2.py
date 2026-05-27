"""Plant-image audit pass #2 — remove confirmed terrestrial / illustration /
wrong-subject images so the catalogue stops showing misleading photos.

Categories:
  (A) DELETE entirely — confirmed bad. Removes both the local file and the
      IMAGE_ATTRIBUTION entry. Catalogue card falls back to the ImageOff
      icon, which is honest about the gap.
  (B) REPLACE — confirmed better Wikimedia file with correct subject + license.
      Downloads the new file, updates the attribution entry, removes the old
      local file if the extension changed.

Plants in (A) need photography sourced from Tropica / Aquasabi / Buce Plant
later — those retailers block scraping, so the manual replacement is left
to the next pass.
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
PLANTS_DIR = ROOT / "public" / "images" / "catalogue" / "plants"
ATTR_TS = ROOT / "src" / "data" / "image-attribution.ts"

# Category A — delete (wrong subject / illustration / terrestrial-only)
TO_DELETE = [
    # Slug, file extension, why
    ("monte-carlo", ".jpg", "Photo of Monaco the country, not Micranthemum tweediei"),
    ("chain-sword", ".jpg", "1913 black-and-white botanical illustration"),
    ("pearlweed", ".png", "1913 black-and-white botanical illustration"),
    ("ludwigia-super-red", ".jpg", "Wrong species (Ludwigia palustris) shown in terrestrial form"),
    ("marsilea-hirsuta", ".jpg", "Wild grass field, not aquarium form"),
    ("lobelia-cardinalis-mini", ".jpg", "Wild terrestrial flower stalk in forest"),
    ("glossostigma-elatinoides", ".jpg", "Single flower close-up, not aquatic carpet"),
    ("ranunculus-inundatus", ".jpg", "Hand-held terrestrial leaf against sky"),
    ("needle-hairgrass", ".jpg", "Single dry seed-head on plain background"),
    ("dwarf-hairgrass", ".jpg", "Dried wild Eleocharis field photo"),
    ("lilaeopsis-brasiliensis", ".jpg", "Wild streamside with flowers, not aquarium carpet"),
    ("rotala-hra", ".jpg", "Duplicate of generic rotala-rotundifolia photo, not H'ra-specific"),
    ("java-fern-trident", ".jpg", "Duplicate of generic Microsorum pteropus, not trident form"),
]

# Category B — confirmed Wikimedia replacements (CC-licensed aquatic photos)
TO_REPLACE = [
    {
        "slug": "bacopa-monnieri",
        "old_ext": ".jpg",
        "wikimedia_file": "Bacopa monnieri aquarium plant.jpg",
        "alt": "Bacopa monnieri growing as a planted-aquarium foreground species",
    },
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


def remove_attribution_entry(ts_text: str, slug: str) -> str:
    """Remove a `"<slug>": { ... },` block from the IMAGE_ATTRIBUTION object."""
    # Match the entry block — opening quote-slug-quote then balanced braces
    pattern = re.compile(
        r'\n  \"' + re.escape(slug) + r'\":\s*\{[^{}]*\},?',
        re.DOTALL,
    )
    new_text, count = pattern.subn("", ts_text)
    if count == 0:
        print(f"  ! attribution entry not found for {slug}")
    return new_text


def update_attribution_entry(
    ts_text: str,
    slug: str,
    *,
    src: str,
    alt: str,
    author: str,
    license_short: str,
    description_url: str,
    file_title: str,
    width: int,
    height: int,
) -> str:
    """Replace the attribution entry for `slug` with new metadata."""
    new_entry = json.dumps(
        {
            "alt": alt,
            "author": author,
            "category": "plants",
            "credit": "",
            "descriptionUrl": description_url,
            "fileTitle": file_title,
            "height": height,
            "license": license_short,
            "slug": slug,
            "src": src,
            "width": width,
            "wikipediaUrl": "",
        },
        indent=2,
        sort_keys=True,
    )
    # Indent the new entry to two spaces (object-property indent)
    indented = "\n".join("  " + line for line in new_entry.splitlines())
    pattern = re.compile(
        r'(\n  \"' + re.escape(slug) + r'\":\s*)\{[^{}]*\}',
        re.DOTALL,
    )
    new_text, count = pattern.subn(lambda m: m.group(1) + indented, ts_text)
    if count == 0:
        print(f"  ! attribution entry not found for {slug} — appending")
    return new_text


def main() -> None:
    ts_text = ATTR_TS.read_text()

    # (A) Delete bad images + attribution entries
    print("=== DELETE pass ===")
    for slug, ext, reason in TO_DELETE:
        local = PLANTS_DIR / f"{slug}{ext}"
        if local.exists():
            local.unlink()
            print(f"deleted {local.name}  ({reason})")
        else:
            print(f"  (no file) {slug}")
        ts_text = remove_attribution_entry(ts_text, slug)

    # (B) Replace with better Wikimedia file
    print("\n=== REPLACE pass ===")
    for entry in TO_REPLACE:
        slug = entry["slug"]
        wm_filename = entry["wikimedia_file"]
        print(f"→ {slug}  ←  {wm_filename}")
        try:
            data = fetch_meta(wm_filename)
        except Exception as exc:
            print(f"  meta fetch failed: {exc}")
            continue
        pages = data.get("query", {}).get("pages", {})
        page = next(iter(pages.values()), {})
        if page.get("missing") is not None:
            print(f"  file missing on Commons; skipping")
            continue
        ii = page.get("imageinfo", [{}])[0]
        url = ii.get("url")
        if not url:
            continue
        md = ii.get("extmetadata", {})
        license_short = md.get("LicenseShortName", {}).get("value", "Unknown")
        author = strip_html(md.get("Artist", {}).get("value", "Unknown"))
        width = ii.get("width", 0)
        height = ii.get("height", 0)
        description_url = (
            "https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(wm_filename)
        )

        new_ext = os.path.splitext(url)[1].lower() or ".jpg"
        # Delete the old file if extension changed
        old_local = PLANTS_DIR / f"{slug}{entry['old_ext']}"
        if old_local.exists() and new_ext != entry["old_ext"]:
            old_local.unlink()
            print(f"  removed old {old_local.name}")

        new_local = PLANTS_DIR / f"{slug}{new_ext}"
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req) as r, open(new_local, "wb") as f:
            f.write(r.read())
        print(f"  saved {new_local.name}")

        ts_text = update_attribution_entry(
            ts_text,
            slug,
            src=f"/images/catalogue/plants/{slug}{new_ext}",
            alt=entry["alt"],
            author=author,
            license_short=license_short,
            description_url=description_url,
            file_title=f"File:{wm_filename}",
            width=width,
            height=height,
        )
        time.sleep(2)

    ATTR_TS.write_text(ts_text)
    print(f"\nWrote updated {ATTR_TS}")
    print(f"\nDeleted {len(TO_DELETE)} entries; replaced {len(TO_REPLACE)}.")


if __name__ == "__main__":
    main()
