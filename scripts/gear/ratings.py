"""
Fin & Stem gear ratings: a 1-5 price level and a 1-5 category metric.

These are editorial estimates, not lab tests, and every place they appear on
the site carries that disclaimer. The method is deliberately simple and
documented so it can be explained and adjusted:

Price level (1 budget -> 5 premium), relative within each category:
  * Brand positioning in the hobby gives a baseline (BRAND_PRICE).
  * Where a real retail price is known (priceFrom), its position among the
    other priced products in the same category is blended 50/50 with the
    brand baseline.
  * PRICE_OVERRIDES pins well-known product lines where brand alone misleads.

Category metric (label defined per category on the site):
  build quality / build and finish: brand baseline (BRAND_BUILD) plus overrides
  lights, plant growth power: watts per cm of fixture, ranked in the category
  heaters, control and safety: by heater type
  air pumps, quietness: brand baseline
  cooling, cooling power: chiller vs fan
  fertilisers, ease of use: by product type
  hardscape, soft-water safety: from the stone or wood's effect on water
"""
import re

GBP_TO_USD = 1.27

BRAND_PRICE = {
    "Dophin": 1, "SunSun": 1, "Boyu": 2, "Qanvee": 2, "Juwel": 3, "Oase": 3,
    "Eheim": 3, "Chihiros": 3, "UNS": 3, "2HR Aquarist": 3, "Twinstar": 4, "ADA": 5,
}
BRAND_BUILD = {
    "Dophin": 2, "SunSun": 2, "Boyu": 2, "Qanvee": 3, "Juwel": 3, "Oase": 4,
    "Eheim": 4, "Chihiros": 3, "UNS": 4, "2HR Aquarist": 4, "Twinstar": 4, "ADA": 5,
}
BRAND_QUIET = {"Eheim": 4, "Oase": 4, "Juwel": 3, "UNS": 3, "Boyu": 2, "SunSun": 2, "Dophin": 2}

# id -> {"price": n} / {"metric": n}. Only for lines where brand alone misleads.
OVERRIDES = {
    "eheim-classic": {"price": 2, "metric": 5},
    "eheim-professionel-5e": {"price": 5, "metric": 5},
    "eheim-professionel-4-plus": {"price": 4, "metric": 5},
    "eheim-professionel-3-1200xl": {"price": 5, "metric": 5},
    "eheim-ecco-pro": {"price": 3, "metric": 4},
    "eheim-experience": {"price": 3, "metric": 4},
    "eheim-thermocontrol-plus-e": {"price": 4},
    "eheim-climacontrol-plus": {"price": 5},
    "sunsun-hw-3000-series-frequency-canister-filter": {"price": 2, "metric": 3},
    "sunsun-hw-300-and-hw-400-series-canister-filter": {"metric": 3},
    "chihiros-a-ii-series": {"price": 2},
    "chihiros-a-ii-max": {"price": 2},
    "chihiros-wrgb-ii-pro": {"price": 4},
    "chihiros-wrgb-vivid-3": {"price": 5},
    "chihiros-rgb-vivid-ii": {"price": 5},
    "twinstar-e-series-ver5": {"price": 4},
    "twinstar-s-series-ver5": {"price": 5},
    "uns-pro-co2-dual-stage-regulator": {"price": 4, "metric": 5},
    "uns-mini-co2-dual-stage-regulator": {"price": 3, "metric": 4},
    "uns-pro-co2-kit": {"price": 4, "metric": 5},
    "boyu-c-series-chiller": {"price": 3},
    "boyu-cw-ln-series-chiller": {"price": 3},
}

FERT_EASE = {
    "all-in-one": 5, "conditioner": 5, "bacteria": 5, "aquasoil": 4, "root-feed": 4,
    "foliar": 4, "micro-trace": 4, "remineraliser": 3, "single-nutrient": 3,
    "supplement": 3, "algae-treatment": 3,
}
HEATER_CONTROL = {"smart": 5, "inline": 4, "titanium": 3, "glass": 3, "preset": 2}


def clamp(n):
    return max(1, min(5, int(round(n))))


def usd(p):
    v = p.get("priceFrom")
    if not isinstance(v, (int, float)) or v <= 0:
        return None
    return v * GBP_TO_USD if (p.get("currency") or "").upper() == "GBP" else float(v)


def quantile_tier(value, values):
    """1-5 by position of value among values (inclusive rank)."""
    below = sum(1 for x in values if x < value)
    return clamp(1 + 4 * below / max(1, len(values) - 1))


def watts_per_cm(p):
    best = None
    for m in p.get("models", []):
        w, l = m.get("powerW"), m.get("lengthCm") or m.get("fitsLengthMaxCm")
        if w and l and l >= 20:
            r = w / l
            best = r if best is None else max(best, r)
    return best


def soft_water_safety(p):
    effect = (p.get("specs") or {}).get("Effect on water", "").lower()
    if p.get("subtype") in ("wood", "bonsai"):
        return 5 if "raise" not in effect else 3
    if "raise" in effect and ("probably" in effect or "sometimes" in effect or "slightly" in effect):
        return 2
    if "raise" in effect:
        return 1
    if "inert" in effect and "not stated" not in effect and "usually" not in effect:
        return 5
    if "usually inert" in effect:
        return 4
    return 3


def compute(products):
    """Set p["ratings"] = {"price": n, "metric": n} on every product."""
    priced = {}
    for p in products:
        v = usd(p)
        if v is not None:
            priced.setdefault(p["category"], []).append(v)
    lights = [r for r in (watts_per_cm(p) for p in products if p["category"] == "lights") if r]

    for p in products:
        cat, brand = p["category"], p["brand"]
        base = BRAND_PRICE.get(brand, 3)
        v = usd(p)
        price = clamp((base + quantile_tier(v, priced[cat])) / 2) if v is not None and len(priced.get(cat, [])) >= 4 else base

        if cat == "lights":
            r = watts_per_cm(p)
            metric = quantile_tier(r, lights) if r else BRAND_BUILD.get(brand, 3)
        elif cat == "heaters":
            metric = HEATER_CONTROL.get(p.get("subtype"), 3) - (1 if brand in ("Dophin",) else 0)
        elif cat == "air-pumps":
            metric = BRAND_QUIET.get(brand, 3) - (1 if p.get("subtype") == "battery" else 0)
        elif cat == "cooling":
            metric = 5 if p.get("subtype") == "chiller" else 2
        elif cat == "fertilisers":
            metric = FERT_EASE.get(p.get("subtype"), 3)
        elif cat == "hardscape":
            metric = soft_water_safety(p)
        else:
            metric = BRAND_BUILD.get(brand, 3)

        o = OVERRIDES.get(p["id"], {})
        p["ratings"] = {"price": clamp(o.get("price", price)), "metric": clamp(o.get("metric", metric))}


def tech_level(p):
    """Which planted-tank style a product suits: ["low"], ["high"] or both.

    Low tech = no injected CO2, low to medium light. High tech = injected CO2
    and strong light. Most gear suits both; only lights, CO2 gear, filters
    and a few fertilisers split.
    """
    cat, sub = p["category"], p.get("subtype")
    if cat == "co2":
        return ["high"]
    if cat == "lights":
        m = (p.get("ratings") or {}).get("metric", 3)
        return ["low"] if m <= 2 else ["high"] if m >= 4 else ["low", "high"]
    if cat == "filters":
        return ["low", "high"] if sub == "canister" else ["low"]
    if cat == "fertilisers" and p["id"] == "2hr-aquarist-apt-ei":
        return ["high"]
    return ["low", "high"]


def compute_tech(products):
    for p in products:
        p["tech"] = tech_level(p)
