"""Audit pass #3 — wrong-subject image cleanup + scientific name fixes
+ stale species-count fixes flagged by the cross-site audit.

Image part:
  · DELETE 6 wrong-subject / duplicate images
  · REPLACE 3 wrong-subject images with curated Wikimedia files

Text part:
  · Update synonymised scientific names in plants.ts + fish.ts
  · Refresh home.ts species-count copy so it reflects the current
    catalogue + the five pillars
  · Hedge the Fukada IAPLC consecutive-wins claim in history.ts
  · Soften the Amano '1,000+ races' figure in history.ts
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
ATTR_TS = ROOT / "src/data/image-attribution.ts"
USER_AGENT = "fin-and-stem/1.0 (https://finandstem.com)"

# ─── Image fixes ─────────────────────────────────────────────────────

# Delete the file + remove from IMAGE_ATTRIBUTION. Catalogue card
# falls back to the ImageOff icon, which is honest about the gap.
TO_DELETE = [
    ("weeping-moss", "mosses", "Photo shows water lily pads, not Vesicularia ferriei"),
    ("red-tiger-lotus", "plants", "1800s botanical engraving, not an aquarium photo"),
    ("flame-moss", "mosses", "Generic Taxiphyllum, not flame-pattern variant"),
    ("peacock-moss", "mosses", "Generic Taxiphyllum, not peacock-pattern variant"),
    ("spiky-moss", "mosses", "Generic Taxiphyllum, not spiky-pattern variant"),
    ("mini-christmas-moss", "mosses", "Duplicate of christmas-moss file"),
]

# (slug, category, wikimedia_file, alt, old_ext)
TO_REPLACE = [
    (
        "crystal-red-shrimp",
        "shrimp",
        "Caridina cf. cantonensis - crystal red - adult and baby.JPG",
        "Crystal Red Shrimp (Caridina cantonensis) — adult with distinctive red-and-white banding plus a juvenile",
        ".jpg",
    ),
    (
        "scarlet-badis",
        "fish",
        "Dario dario male.jpg",
        "Scarlet Badis (Dario dario) — adult male with vivid red and blue vertical bars",
        ".jpg",
    ),
    (
        "snowball-shrimp",
        "shrimp",
        "Neocaridina-cf-zhangjiajiensis-sp-white-pearl.jpg",
        "Snowball / White Pearl Shrimp (Neocaridina davidi 'Snowball') — solid pearl-white body",
        ".jpg",
    ),
]


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
    pattern = re.compile(
        r'\n  \"' + re.escape(slug) + r'\":\s*\{[^{}]*\},?',
        re.DOTALL,
    )
    new, count = pattern.subn("", ts_text)
    if count == 0:
        print(f"    ! attribution entry not found for {slug}")
    return new


def update_attribution_entry(
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
    category: str,
) -> str:
    entry = {
        "alt": alt,
        "author": author,
        "category": category,
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
    new, count = pattern.subn(lambda m: m.group(1) + indented, ts_text)
    if count == 0:
        print(f"    ! attribution entry not found for {slug} — skipping replace")
    return new


def do_images() -> None:
    print("=== IMAGE FIXES ===\n")
    ts_text = ATTR_TS.read_text()

    print("[DELETE]")
    for slug, category, reason in TO_DELETE:
        plat = ROOT / "public" / "images" / "catalogue" / category
        # Try common extensions
        for ext in (".webp", ".jpg", ".jpeg", ".png"):
            f = plat / f"{slug}{ext}"
            if f.exists():
                f.unlink()
                print(f"  deleted {f.name}  ({reason})")
                break
        ts_text = remove_attribution_entry(ts_text, slug)
    ATTR_TS.write_text(ts_text)

    print("\n[REPLACE]")
    ts_text = ATTR_TS.read_text()
    for slug, category, wm_filename, alt, old_ext in TO_REPLACE:
        print(f"→ {slug}  ←  {wm_filename}")
        try:
            data = fetch_meta(wm_filename)
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
            + urllib.parse.quote(wm_filename)
        )

        # Always save as .jpg/.webp under the slug
        new_ext = os.path.splitext(url)[1].lower() or ".jpg"
        if new_ext.upper() == ".JPG":
            new_ext = ".jpg"
        old_local = ROOT / "public" / "images" / "catalogue" / category / f"{slug}{old_ext}"
        if old_local.exists():
            old_local.unlink()
            print(f"  removed old {old_local.name}")
        # Also clear any same-stem files with different ext
        for e in (".webp", ".jpg", ".jpeg", ".png"):
            f = old_local.with_suffix(e)
            if f.exists():
                f.unlink()
        new_local = old_local.with_suffix(new_ext)

        for attempt in range(3):
            try:
                req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
                with urllib.request.urlopen(req) as r, open(new_local, "wb") as f:
                    f.write(r.read())
                print(f"  saved {new_local.name}  ({license_short} · {author[:40]})")
                break
            except Exception as exc:
                wait = 2 ** attempt * 3
                print(f"  download failed ({exc}); waiting {wait}s")
                time.sleep(wait)
        else:
            continue

        ts_text = update_attribution_entry(
            ts_text,
            slug,
            src=f"/images/catalogue/{category}/{slug}{new_ext}",
            alt=alt,
            author=author,
            license_short=license_short,
            license_url=license_url,
            description_url=description_url,
            file_title=f"File:{wm_filename}",
            width=width,
            height=height,
            category=category,
        )
        time.sleep(2)
    ATTR_TS.write_text(ts_text)


# ─── Text fixes ──────────────────────────────────────────────────────

TEXT_PATCHES = [
    # Scientific name updates — synonymised in current taxonomy
    (
        "src/data/plants.ts",
        'scientificName: "Echinodorus bleheri"',
        'scientificName: "Echinodorus grisebachii"',
    ),
    (
        "src/data/plants.ts",
        'scientificName: "Hemianthus glomeratus"',
        'scientificName: "Micranthemum micranthemoides"',
    ),
    (
        "src/data/fish.ts",
        'scientificName: "Crossocheilus oblongus"',
        'scientificName: "Crossocheilus langei"',
    ),
    # Home page — stale species counts + four → five pillars
    (
        "src/content/home.ts",
        "80+ profiled fish, plants, shrimp, and mosses",
        "130+ profiled fish, plants, shrimp, mosses, and snails",
    ),
    (
        "src/content/home.ts",
        "88+ species profiled across four pillars",
        "130+ species profiled across five pillars",
    ),
    (
        "src/content/home.ts",
        '"Species profiled across four pillars"',
        '"Species profiled across five pillars"',
    ),
    (
        "src/content/home.ts",
        '"34 species profiled, schoolers, micropredators, dwarf cichlids, algae crew, and surface specialists. Parameters, group sizes, water column, plant and shrimp safety, and the catch in plain English."',
        '"55+ species profiled — schoolers, micropredators, dwarf cichlids, algae crew, and surface specialists. Parameters, group sizes, water column, plant and shrimp safety, and the catch in plain English."',
    ),
    (
        "src/content/home.ts",
        '"34 species profiled, foregrounds and carpets, midground rosettes, background stems and bulbs, floating cover. Light demand, CO₂, substrate, propagation, and trimming cadence."',
        '"45+ species profiled — foregrounds and carpets, midground rosettes, background stems and bulbs, floating cover. Light demand, CO₂, substrate, propagation, and trimming cadence."',
    ),
    # History page — hedge inflated Fukada claim
    (
        "src/content/history.ts",
        "Takayuki Fukada (Japan) won the top prize in 2015 and 2016, one of the few aquascapers to win consecutive years.",
        "Top finishers come from Japan, Vietnam, Thailand, and beyond — Takayuki Fukada (Japan) took the 2015 grand prize, and other contestants have placed in the top three across consecutive years.",
    ),
    # History page — soften Amano '1,000+ races' (most sources cite ~300 wins)
    (
        "src/content/history.ts",
        "He competed as a professional keirin track cyclist from 1974, winning over 1,000 races and earning more than one million pounds before retiring in 1990.",
        "He competed as a professional keirin track cyclist from 1974, winning hundreds of races over the course of a long career before retiring in 1990.",
    ),
    # History page — soften the 1860 date claim for C. multidentata's
    # original description (commonly cited as De Haan, 1844)
    (
        "src/content/history.ts",
        "reclassified to *Caridina multidentata* in 2006 when researchers determined that the species had actually been described first in 1860 under the latter name",
        "reclassified to *Caridina multidentata* in 2006 when researchers determined that the species had actually been described first in the 19th century under the latter name",
    ),
]


def do_text() -> None:
    print("\n\n=== TEXT FIXES ===\n")
    for path, find, repl in TEXT_PATCHES:
        f = ROOT / path
        text = f.read_text()
        if find not in text:
            print(f"  ! not found in {path}: {find[:60]}…")
            continue
        f.write_text(text.replace(find, repl))
        print(f"  patched {path}: {find[:50]}… → {repl[:50]}…")


def main() -> None:
    do_images()
    do_text()
    print("\nDone.")


if __name__ == "__main__":
    main()
