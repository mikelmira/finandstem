#!/usr/bin/env python3
"""
Ingest supplier product dumps into one normalised list and classify each item
into a Fin & Stem gear category, or exclude it with a reason.

Only main equipment and hardscape are kept. Excluded: livestock (plants, moss,
fish), consumables (fertilisers, food, conditioners, filter media, test kits),
spare parts (o-rings, impellers, hoses, replacement tubes), reef/marine-only
gear, decorations, bundles, and small accessories.

Usage:  python3 scripts/gear/ingest.py [--root ~/Downloads] [--out <dir>]
Writes: <out>/records.json (kept), <out>/excluded.json, prints a summary.
"""
import json, os, re, sys, argparse, collections

ap = argparse.ArgumentParser()
ap.add_argument("--root", default=os.path.expanduser("~/Downloads"))
ap.add_argument("--out", default="scripts/gear/.build")
args = ap.parse_args()
ROOT, OUT = args.root, args.out
os.makedirs(OUT, exist_ok=True)

SOURCES = ["boyu", "chihiros-twinstar-qanvee", "dooa", "dophin",
           "eheim-juwel-oase", "uns", "sunsun", "twinstar-official"]

BRAND_NORMAL = {
    "Ultum Nature Systems": "UNS", "Boyu": "Boyu", "Twinstar": "Twinstar",
    "Chihiros": "Chihiros", "Qanvee": "Qanvee", "DOOA": "DOOA", "Dophin": "Dophin",
    "Eheim": "Eheim", "Oase": "Oase", "Juwel": "Juwel", "SunSun": "SunSun", "ADA": "ADA",
}


def load():
    recs = []
    for s in SOURCES:
        p = os.path.join(ROOT, s, "data.json")
        if not os.path.exists(p):
            continue
        data = json.load(open(p))
        for it in (data["items"] if isinstance(data, dict) else data):
            files = []
            for f in it.get("image_files") or []:
                # some sets were delivered with images in a sibling "<name> 2" folder
                for base in (os.path.join(ROOT, s), os.path.join(ROOT, s + " 2")):
                    if os.path.exists(os.path.join(base, f)):
                        files.append(os.path.join(base, f))
                        break
            recs.append({
                "source_set": s,
                "brand": BRAND_NORMAL.get(it.get("brand"), it.get("brand")),
                "source": it.get("source"),
                "source_url": it.get("source_url"),
                "title": (it.get("full_title") or it.get("title") or "").strip(),
                "handle": it.get("handle"),
                "type": re.sub(r"\s+", " ", (it.get("type") or "")).strip(),
                "tags": it.get("tags") or [],
                "options": it.get("options") or [],
                "variants": it.get("variants") or [],
                "specs": it.get("specs") or "",
                "images": [f for f in files if os.path.exists(f)],
            })
    # ADA: loose PNGs named <handle>_<n>.png, no data.json
    ada = os.path.join(ROOT, "ADA-images")
    if os.path.isdir(ada):
        groups = collections.defaultdict(list)
        for f in sorted(os.listdir(ada)):
            m = re.match(r"(.+?)_(\d+)\.(png|jpe?g|webp)$", f, re.I)
            if m:
                groups[m.group(1)].append((int(m.group(2)), os.path.join(ada, f)))
        for handle, files in groups.items():
            title = re.sub(r"^ada[-\s]", "", handle.replace("-", " ")).strip()
            recs.append({
                "source_set": "ADA-images", "brand": "ADA",
                "source": "ADA (supplier files)", "source_url": None,
                "title": "ADA " + title.title(), "handle": "ada-" + re.sub(r"^ada-", "", handle),
                "type": "", "tags": [], "options": [], "variants": [], "specs": "",
                "images": [p for _, p in sorted(files)],
            })
    return recs


def has(text, *words):
    return any(re.search(w, text) for w in words)


PLANT_WORDS = [r"\banubias\b", r"cryptocoryne", r"\brotala\b", r"bolbitis", r"hygrophila",
    r"micranth", r"eleocharis", r"pogost", r"lagenandra", r"limnophila", r"hydrocotyle",
    r"ranunculus", r"utricularia", r"echinodorus", r"staurogyne", r"myriophyllum",
    r"glossostigma", r"lilaeopsis", r"alternanthera", r"aponogeton", r"\briccia\b",
    r"riccardia", r"\bmoss\b", r"callicostella", r"hemianthus", r"wabi[\s-]?kusa",
    r"\bic\s?\d{3}\b", r"\bbs\s?\d{3}\b", r"monte carlo", r"\bhc\b dwarf", r"hair grass",
    r"pearl weed", r"vallisneria", r"java fern", r"bucephalandra", r"tissue culture"]

CONSUMABLE_WORDS = [r"fertili[sz]", r"green brighty", r"\bclear (water|super)\b", r"conditioner",
    r"dechlor", r"chlor[\s-]?off", r"soft water", r"vita mix", r"eca plus", r"green gain",
    r"phyton", r"bacter", r"bottom plus", r"tourmaline", r"bio rio", r"\bmedia\b",
    r"\bcarbon\b", r"purigen", r"ceramic ring", r"bio ?balls?", r"sinter", r"substrat pro",
    r"\bfood\b", r"pack checker", r"\btest (kit|strip)", r"\bsalt\b", r"wood tight",
    r"moss cotton", r"\bfilter (sponge|foam|pads?|floss|wool|cotton|mat|bag)s?\b",
    r"\b(foam|sponge|pad|floss)s? (set|pack|refill)\b", r"\bnitrate\b", r"phosphate remover",
    r"aquarium plants?\b", r"live plant", r"plant (soil|substrate)"]

SPARE_WORDS = [r"o[\s-]?ring", r"\bseal\b", r"gasket", r"impeller", r"\breplacement\b",
    r"\bspares?\b", r"spare part", r"\bhose\b", r"\btubing\b", r"co2 (tube|black)",
    r"\bclips?\b", r"suction cup", r"spring washer", r"y[\s-]?branch", r"\bt[58]\b",
    r"\bbulb\b", r"cartridge", r"check valve", r"non[\s-]?return", r"connector", r"\bfitting\b",
    r"\bcaps?\b", r"\blids?\b", r"cover glass", r"glass aquarium mat", r"garden mat",
    r"\bmat\b", r"power (supply|adapter)", r"transformer", r"\bcable\b", r"extension",
    r"pre[\s-]?filter", r"intake (strainer|guard)", r"spray ?bar", r"\bbrush\b",
    r"\bblades?\b", r"hanging (kit|set)", r"light (stand|hanger|bracket)", r"\bbracket\b",
    r"mounting", r"\bremote\b", r"\bcontroller\b", r"\bdisplay\b", r"shaft", r"rotor",
    r"housing", r"\bbasket\b", r"\bvalve\b", r"quick ?disconnect", r"\bnozzle\b",
    r"sealing", r"\btap\b", r"double tap", r"clean bottle", r"light screen", r"aqua screen",
    r"thermometer", r"air ?stone", r"airline", r"air line", r"\bgift card\b", r"\bpipe brush"]

REEF_WORDS = [r"\breef\b", r"saltwater", r"marine", r"protein skimmer", r"\bcoral\b", r"dosing"]

DECOR_WORDS = [r"ornament", r"decoration", r"\bbackground\b", r"3d back", r"\bfigure\b",
    r"fake plant", r"artificial"]

BUNDLE_WORDS = [r"\bbundle\b", r"\bcombo\b", r"starter set\b(?!.*aquarium)"]


def classify(r):
    t = (r["title"] + " " + r["type"] + " " + " ".join(r["tags"])).lower()
    title = r["title"].lower()
    ty = r["type"].lower()

    # hard excludes
    if has(title + " " + ty, *REEF_WORDS) and not has(title, r"freshwater"):
        return None, "reef/marine"
    if has(title, *PLANT_WORDS):
        return None, "livestock (plant/moss)"
    if has(title, *CONSUMABLE_WORDS):
        return None, "consumable"
    if has(ty, r"^decoration$") or has(title, *DECOR_WORDS):
        return None, "decoration"
    if has(ty, r"bundles? and kits") or has(title, *BUNDLE_WORDS):
        return None, "bundle"
    if has(ty, r"spare parts?"):
        return None, "spare part"
    if has(ty, r"^planter$") or has(title, r"\bplanter\b"):
        return None, "planter"

    # DOOA: paludarium / wabi-kusa line
    if r["brand"] == "DOOA":
        if has(title, r"light|solar"):
            return ("lights", "paludarium light"), None
        if has(title, r"tweez|scissor|spatula|tool|pinsett"):
            return ("tools", "layout tool"), None
        if has(title, *SPARE_WORDS) and not has(title, r"system|paluda|glass pot|glass air|terra base|mist wall"):
            return None, "accessory"
        return ("paludarium", "paludarium system"), None

    # CO2 (before generic "filter"/"pump" so diffusers/regulators land here)
    if has(t, r"\bco2\b", r"pollen glass", r"\bbeetle\b", r"drop ?checker", r"bubble counter",
           r"regulator", r"atomi[sz]er", r"speed controller", r"\bdiffuser\b(?!.*air)"):
        if has(title, r"tube|tubing|per meter|check valve|y[\s-]?branch|seal|washer|refill|spare|replacement|reagent|solution|cylinder cap"):
            return None, "co2 spare"
        if has(title, r"air stone|air diffuser"):
            return None, "accessory"
        sub = ("regulator" if has(title, r"regulator|speed controller|solenoid")
               else "drop checker" if has(title, r"drop ?checker")
               else "bubble counter" if has(title, r"bubble counter")
               else "co2 system" if has(title, r"\bkit\b|system|set\b")
               else "cylinder" if has(title, r"cylinder|bottle")
               else "diffuser")
        return ("co2", sub), None

    if has(title, *SPARE_WORDS):
        return None, "spare/accessory"

    if has(t, r"chiller"):
        return ("chillers", "chiller"), None
    if has(t, r"\buv\b", r"u\.v\.", r"steriliz|sterilis|clarifier"):
        return ("uv", "uv steriliser"), None
    if has(t, r"heater"):
        return ("heaters", "heater"), None
    if has(t, r"auto(matic)? ?feeder", r"\bfeeder\b"):
        return ("feeders", "auto feeder"), None
    if has(t, r"air pump", r"air compressor", r"aerator", r"submersible-air", r"battery pump",
           r"oxygen pump", r"air-pump"):
        return ("air-pumps", "air pump"), None
    if has(t, r"lily pipe", r"inflow", r"outflow", r"flow pipe", r"surface skimmer",
           r"poppy", r"violet"):
        sub = "surface skimmer" if has(title, r"skimmer") else "lily pipe"
        return ("plumbing", sub), None

    # filters
    if has(t, r"filter", r"biomaster", r"biocompact", r"bioflow", r"aquaball", r"pick ?up",
           r"filtration pump", r"hang[\s-]?on", r"canister", r"professionel", r"ecco pro",
           r"\bclassic\b", r"experience"):
        if has(title, r"filter (media|sponge|foam|pad|floss|wool|basket|bag)|media"):
            return None, "filter consumable"
        sub = ("canister" if has(t, r"canister|external|out ?side filter|professionel|classic|ecco|experience|biomaster|thermo|\bhw[-\s]?\d")
               else "hang-on-back" if has(t, r"hang[\s-]?on|hob|slim hanging|\bhbl")
               else "sponge" if has(t, r"sponge filter|biological sponge")
               else "internal")
        return ("filters", sub), None

    if has(t, r"wave ?maker", r"circulation pump", r"stream pump", r"flow pump", r"wavemaker"):
        return ("pumps", "circulation / wavemaker"), None
    if has(t, r"\bpump\b"):
        return ("pumps", "water pump"), None

    if has(t, r"\blight", r"\bled\b", r"lamp", r"helialux", r"aquasky", r"wrgb", r"spotlight",
           r"lighting", r"luminaire", r"\bsolar\b"):
        return ("lights", "led light"), None

    if has(t, r"cabinet", r"\bstand\b"):
        return ("stands", "cabinet / stand"), None

    if has(title, r"tweez", r"pinsett", r"scissor", r"scraper", r"\brazor\b", r"flattener",
           r"spatula", r"trimmer", r"planting tool", r"algae scraper", r"gravel (cleaner|vac)",
           r"siphon", r"net\b"):
        sub = ("tweezers" if has(title, r"tweez|pinsett")
               else "scissors" if has(title, r"scissor|trimmer")
               else "glass scraper" if has(title, r"scraper|razor")
               else "substrate tool" if has(title, r"flattener|spatula")
               else "maintenance tool")
        return ("tools", sub), None

    if has(t, r"aquarium", r"fish tank", r"\btank\b", r"tanks", r"cube", r"nano", r"rimless",
           r"desktop") and not has(title, r"accessor"):
        return ("aquariums", "aquarium"), None

    if has(t, r"hardscape", r"\brock\b", r"\bstone\b", r"\bwood\b", r"driftwood", r"\bsand\b",
           r"gravel", r"branch", r"root"):
        if has(title, r"power sand|amazonia|controsoil|aqua ?soil|soil\b"):
            return None, "active substrate (lives in /substrates)"
        sub = ("sand & gravel" if has(title, r"sand|gravel")
               else "wood" if has(title, r"wood|branch|root|manzanita|driftwood|twig|stick")
               else "stone")
        return ("hardscape", sub), None

    return None, "unclassified"


def main():
    recs = load()
    kept, excl = [], []
    for r in recs:
        cat, reason = classify(r)
        if cat:
            r["category"], r["subtype"] = cat
            kept.append(r)
        else:
            r["exclude_reason"] = reason
            excl.append(r)
    json.dump(kept, open(os.path.join(OUT, "records.json"), "w"), indent=1)
    json.dump(excl, open(os.path.join(OUT, "excluded.json"), "w"), indent=1)
    print(f"total {len(recs)}  kept {len(kept)}  excluded {len(excl)}")
    print("kept by category:")
    for c, n in collections.Counter(r["category"] for r in kept).most_common():
        print(f"  {c:12} {n}")
    print("excluded by reason:")
    for c, n in collections.Counter(r["exclude_reason"] for r in excl).most_common():
        print(f"  {c:40} {n}")


if __name__ == "__main__":
    main()
