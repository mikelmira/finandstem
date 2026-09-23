#!/usr/bin/env python3
"""
Build topic photos (algae, diseases, deficiencies, hardscape types) from the
verified selections in scripts/topic-images/<group>.json.

Each selection file is {"found": {"<slug>": [ {local, fileTitle, author,
license, licenseUrl, descriptionUrl, alt, context}, ... ]}, "notFound": {...}}.
Only Wikimedia Commons images under CC0 / public domain / CC BY / CC BY-SA
are accepted, and every image keeps its attribution.

Writes public/images/topics/<group>/<slug>[-n].webp (1000px max) and
src/data/topic-images.generated.json keyed "<group>:<slug>".

Usage: python3 scripts/topic-images/build.py
"""
import glob, json, os, re
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "scripts", "topic-images")
OUT_IMG = os.path.join(ROOT, "public", "images", "topics")
OUT_DATA = os.path.join(ROOT, "src", "data", "topic-images.generated.json")
OK_LICENSE = re.compile(r"^(cc0|public domain|pd|cc by(-sa)?\b|cc-by(-sa)?)", re.I)
LICENSE_URL = {
    "cc0": "https://creativecommons.org/publicdomain/zero/1.0/",
    "cc by 2.0": "https://creativecommons.org/licenses/by/2.0",
    "cc by 3.0": "https://creativecommons.org/licenses/by/3.0",
    "cc by 4.0": "https://creativecommons.org/licenses/by/4.0",
    "cc by-sa 2.0": "https://creativecommons.org/licenses/by-sa/2.0",
    "cc by-sa 2.5": "https://creativecommons.org/licenses/by-sa/2.5",
    "cc by-sa 3.0": "https://creativecommons.org/licenses/by-sa/3.0",
    "cc by-sa 4.0": "https://creativecommons.org/licenses/by-sa/4.0",
}


def clean(s):
    s = re.sub(r"<[^>]+>", "", s or "")
    s = s.replace("—", ", ").replace("–", "-")
    return re.sub(r"\s+", " ", s).strip()


def main():
    out, problems = {}, []
    for f in sorted(glob.glob(os.path.join(SRC, "*.json"))):
        group = os.path.splitext(os.path.basename(f))[0]
        data = json.load(open(f))
        os.makedirs(os.path.join(OUT_IMG, group), exist_ok=True)
        for slug, picks in (data.get("found") or {}).items():
            items = []
            for i, pick in enumerate(picks[:2]):
                lic = clean(pick.get("license"))
                if not OK_LICENSE.match(lic) or re.search(r"\b(nc|nd)\b", lic, re.I):
                    problems.append(f"{group}:{slug} rejected licence {lic}")
                    continue
                src = pick.get("local")
                if not src or not os.path.exists(src):
                    problems.append(f"{group}:{slug} missing file {src}")
                    continue
                name = slug if i == 0 else f"{slug}-{i + 1}"
                dest = os.path.join(OUT_IMG, group, name + ".webp")
                with Image.open(src) as im:
                    im = ImageOps.exif_transpose(im).convert("RGB")
                    im.thumbnail((1000, 1000), Image.LANCZOS)
                    im.save(dest, "WEBP", quality=74, method=6)
                    w, h = im.size
                items.append({
                    "src": f"/images/topics/{group}/{name}.webp",
                    "width": w, "height": h,
                    "alt": clean(pick.get("alt")),
                    "author": clean(pick.get("author")) or "Unknown",
                    "license": lic,
                    "licenseUrl": pick.get("licenseUrl") or LICENSE_URL.get(lic.lower()),
                    "sourceUrl": pick.get("descriptionUrl"),
                    "fileTitle": pick.get("fileTitle"),
                    "context": pick.get("context"),
                })
            if items:
                out[f"{group}:{slug}"] = items
    with open(OUT_DATA, "w") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)
    print(f"{len(out)} topics with photos")
    for p in problems:
        print("  -", p)


if __name__ == "__main__":
    main()
