#!/usr/bin/env python3
"""
Build the gear catalogue from curated supplier data.

Reads   scripts/gear/curated/*.json   (see CURATION.md for the schema)
Writes  public/images/gear/<category>/<id>-<n>.webp (+ -thumb.webp)
        src/data/gear.generated.json  (full products, server side)
        public/gear-data/<category>.json (compact cards, compare tool)

Images are converted to webp and compressed: the main image is capped at
900 px on its long side, thumbnails at 360 px. Conversion is skipped when
the output already exists and is newer than the source, so re-runs are fast.

Usage: python3 scripts/gear/build.py [--force-images]
"""
import glob, json, os, re, sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CURATED = os.path.join(ROOT, "scripts", "gear", "curated")
IMG_OUT = os.path.join(ROOT, "public", "images", "gear")
DATA_OUT = os.path.join(ROOT, "src", "data", "gear.generated.json")
CARDS_OUT = os.path.join(ROOT, "public", "gear-data")
FORCE = "--force-images" in sys.argv

CATEGORIES = {
    "aquariums": {"rimless", "framed", "all-in-one", "desktop", "with-cabinet"},
    "filters": {"canister", "hang-on-back", "internal", "sponge", "top"},
    "lights": {"bar", "clip-on", "pendant", "stand", "paludarium"},
    "co2": {"kit", "regulator", "diffuser", "drop-checker", "bubble-counter", "cylinder", "controller"},
    "fertilisers": {"all-in-one", "micro-trace", "single-nutrient", "root-feed", "supplement",
                    "remineraliser", "bacteria", "algae-treatment", "conditioner", "foliar", "aquasoil"},
    "heaters": {"glass", "inline", "titanium", "preset", "smart"},
    "cooling": {"chiller", "fan"},
    "pumps": {"water-pump", "circulation"},
    "air-pumps": {"air-pump", "battery"},
    "sterilisers": {"uv", "electrolytic"},
    "plumbing": {"lily-pipe", "surface-skimmer"},
    "stands": {"cabinet", "stand"},
    "paludarium": {"enclosure", "misting", "fan"},
    "tools": {"tweezers", "scissors", "scraper", "substrate-tool", "gravel-cleaner", "magnet-cleaner"},
    "feeders": {"auto-feeder"},
    "hardscape": {"stone", "wood", "sand-gravel", "bonsai", "set"},
}
NUMERIC = {"flowLph", "headM", "powerW", "tankMinL", "tankMaxL", "volumeL", "lengthCm",
           "widthCm", "heightCm", "glassMm", "mediaL", "airLpm", "outlets", "heaterW", "uvW",
           "lumens", "kelvin", "fitsLengthMinCm", "fitsLengthMaxCm", "hoseMm", "weightKg",
           "capacityMl"}
HARDSCAPE_TYPES = {"seiryu-stone", "dragon-stone", "lava-rock", "pagoda-stone", "petrified-wood",
                   "slate", "texas-holey-rock", "spider-wood", "manzanita", "mopani-wood",
                   "malaysian-driftwood", "cholla-wood"}
SPEC_SOURCES = {"manufacturer", "retailer", "knowledge"}
MAIN_PX, THUMB_PX = 900, 360

# User rules (2026-09-23): aquarium equipment and hardscape only. No hand
# tools, feeders or food containers, and nothing made for terrariums or
# paludariums.
DROP_CATEGORIES = {"tools", "feeders", "paludarium"}
DROP_SUBTYPES = {("lights", "paludarium")}
TERRARIUM_WORDS = re.compile(r"terrari|paluda|wabi[- ]?kusa|reptile|vivari|emersed|misting|mist wall|pond", re.I)

problems = []


def clean_text(s):
    if not isinstance(s, str):
        return s
    s = s.replace("—", ", ").replace("–", "-").replace(" ,", ",")
    return re.sub(r"\s+", " ", s).strip()


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def convert(src, dest_main, dest_thumb):
    fresh = (not FORCE and os.path.exists(dest_main) and os.path.exists(dest_thumb)
             and os.path.getmtime(dest_main) >= os.path.getmtime(src))
    if fresh:
        with Image.open(dest_main) as im:
            return im.size
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode in ("P", "LA") or (im.mode == "RGBA"):
            im = im.convert("RGBA")
            # Flatten transparency onto white so product cut-outs stay clean.
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.split()[-1])
            im = bg
        elif im.mode != "RGB":
            im = im.convert("RGB")
        main = im.copy()
        main.thumbnail((MAIN_PX, MAIN_PX), Image.LANCZOS)
        main.save(dest_main, "WEBP", quality=72, method=6)
        thumb = im.copy()
        thumb.thumbnail((THUMB_PX, THUMB_PX), Image.LANCZOS)
        thumb.save(dest_thumb, "WEBP", quality=68, method=6)
        return main.size


def validate(p, file):
    where = f"{os.path.basename(file)}:{p.get('id')}"
    cat = p.get("category")
    if cat not in CATEGORIES:
        problems.append(f"{where} bad category {cat}")
        return False
    if p.get("subtype") not in CATEGORIES[cat]:
        problems.append(f"{where} bad subtype {p.get('subtype')} for {cat}, set to first")
        p["subtype"] = sorted(CATEGORIES[cat])[0]
    if not p.get("models"):
        p["models"] = [{"name": "Standard"}]
    for m in p["models"]:
        m["name"] = clean_text(str(m.get("name") or "Standard"))
        for k in list(m.keys()):
            if k in ("name", "sku", "extra"):
                continue
            if k not in NUMERIC:
                problems.append(f"{where} unknown model field {k}, moved to extra")
                m.setdefault("extra", {})[k] = str(m.pop(k))
                continue
            v = m[k]
            if isinstance(v, str):
                try:
                    v = float(re.sub(r"[^0-9.]", "", v))
                except ValueError:
                    v = None
            if not isinstance(v, (int, float)) or v <= 0:
                m.pop(k)
                continue
            m[k] = int(v) if float(v).is_integer() else round(float(v), 2)
        if m.get("extra"):
            m["extra"] = {clean_text(k): clean_text(str(v)) for k, v in m["extra"].items() if v not in (None, "")}
            if not m["extra"]:
                m.pop("extra")
        if "sku" in m and not m["sku"]:
            m.pop("sku")
    if p.get("hardscapeType") and p["hardscapeType"] not in HARDSCAPE_TYPES:
        problems.append(f"{where} unknown hardscapeType {p['hardscapeType']}, dropped")
        p.pop("hardscapeType")
    if p.get("specSource") not in SPEC_SOURCES:
        p["specSource"] = "retailer"
    for key in ("summary", "bestFor", "watchOut", "name", "brand"):
        if key in p:
            p[key] = clean_text(p[key])
    p["highlights"] = [clean_text(h) for h in p.get("highlights") or [] if h]
    p["specs"] = {clean_text(k): clean_text(str(v)) for k, v in (p.get("specs") or {}).items() if v not in (None, "")}
    return True


def main():
    products, seen = [], set()
    for file in sorted(glob.glob(os.path.join(CURATED, "*.json"))):
        try:
            items = json.load(open(file))
        except json.JSONDecodeError as e:
            problems.append(f"{os.path.basename(file)} invalid JSON: {e}")
            continue
        for p in items:
            if p.get("category") in DROP_CATEGORIES or (p.get("category"), p.get("subtype")) in DROP_SUBTYPES:
                continue
            text = " ".join(str(p.get(k, "")) for k in ("name", "summary", "bestFor"))
            if TERRARIUM_WORDS.search(text):
                problems.append(f"REVIEW terrarium wording: {p.get('brand')} {p.get('name')} ({p.get('category')})")
            if not validate(p, file):
                continue
            pid = slug(p.get("id") or f"{p['brand']}-{p['name']}")
            base, n = pid, 2
            while pid in seen:
                pid = f"{base}-{n}"
                n += 1
            seen.add(pid)
            p["id"] = pid
            products.append(p)

    os.makedirs(CARDS_OUT, exist_ok=True)
    out = []
    for p in products:
        cat_dir = os.path.join(IMG_OUT, p["category"])
        os.makedirs(cat_dir, exist_ok=True)
        cap = 5 if p["category"] == "hardscape" else 4
        imgs = []
        for i, src in enumerate([s for s in p.get("images") or [] if os.path.exists(s)][:cap]):
            name = f"{p['id']}-{i + 1}"
            main_path = os.path.join(cat_dir, name + ".webp")
            thumb_path = os.path.join(cat_dir, name + "-thumb.webp")
            try:
                w, h = convert(src, main_path, thumb_path)
            except Exception as e:  # corrupt or unsupported source
                problems.append(f"{p['id']} image {src}: {e}")
                continue
            rel = f"/images/gear/{p['category']}/{name}"
            imgs.append({"src": rel + ".webp", "thumb": rel + "-thumb.webp", "width": w, "height": h})
        if not imgs:
            problems.append(f"{p['id']} has no usable images, skipped")
            continue
        record = {
            "id": p["id"], "brand": p["brand"], "name": p["name"],
            "category": p["category"], "subtype": p["subtype"],
            "summary": p.get("summary", ""), "highlights": p["highlights"],
            "bestFor": p.get("bestFor", ""), "specs": p["specs"], "models": p["models"],
            "images": imgs, "specSource": p["specSource"],
        }
        for opt in ("watchOut", "hardscapeType", "sourceUrl", "sourceName", "affiliateUrl"):
            if p.get(opt):
                record[opt] = p[opt]
        out.append(record)

    out.sort(key=lambda r: (r["category"], r["brand"].lower(), r["name"].lower()))
    with open(DATA_OUT, "w") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))

    by_cat = {}
    for r in out:
        card = {k: r[k] for k in ("id", "brand", "name", "category", "subtype", "summary",
                                  "bestFor", "highlights", "specs", "models") if k in r}
        if r.get("watchOut"):
            card["watchOut"] = r["watchOut"]
        card["image"] = r["images"][0]
        by_cat.setdefault(r["category"], []).append(card)
    for cat in CATEGORIES:
        with open(os.path.join(CARDS_OUT, f"{cat}.json"), "w") as f:
            json.dump(by_cat.get(cat, []), f, ensure_ascii=False, separators=(",", ":"))

    # Remove webp files for products that no longer exist.
    live = {os.path.basename(i["src"]) for r in out for i in r["images"]} | \
           {os.path.basename(i["thumb"]) for r in out for i in r["images"]}
    removed = 0
    for fpath in glob.glob(os.path.join(IMG_OUT, "*", "*.webp")):
        if os.path.basename(fpath) not in live:
            os.remove(fpath)
            removed += 1

    print(f"products {len(out)}  images {sum(len(r['images']) for r in out)}  stale removed {removed}")
    for cat in CATEGORIES:
        print(f"  {cat:12} {len(by_cat.get(cat, []))}")
    if problems:
        print(f"\n{len(problems)} notes:")
        for p in problems[:200]:
            print("  -", p)


if __name__ == "__main__":
    main()
