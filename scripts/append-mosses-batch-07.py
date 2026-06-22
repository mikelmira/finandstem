#!/usr/bin/env python3
"""Append 3 new moss entries (session 07)."""

from __future__ import annotations
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TS = ROOT / "src" / "data" / "mosses.ts"

NEW = [
    {
        "id": "moss-011", "slug": "singapore-moss",
        "commonName": "Singapore Moss", "scientificName": "Vesicularia dubyana",
        "family": "Hypnaceae",
        "origin": "Southeast Asia",
        "type": "Moss",
        "attachment": "Wood, stone, mesh",
        "typicalUse": "Walls, trees, midground accents",
        "light": "Medium",
        "co2": "Optional",
        "growthRate": "Medium",
        "tempRange": "20–28", "phRange": "5.5–7.5",
        "flowRate": "Low to Medium",
        "difficulty": 2,
        "trimming": "Every 3–4 weeks",
        "careSummary": "The historically 'true' Java moss — what was originally sold under that name before Taxiphyllum barbieri displaced it. Frond pattern is more irregular and shaggier than modern Java moss, with a deeper green colour. Slightly fussier on water quality and needs better light to keep dense.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Vesicularia_dubyana",
    },
    {
        "id": "moss-012", "slug": "stringy-moss",
        "commonName": "Stringy Moss", "scientificName": "Leptodictyum riparium",
        "family": "Amblystegiaceae",
        "origin": "Cosmopolitan (Europe and the Americas)",
        "type": "Moss",
        "attachment": "Wood, stone, mesh; tolerates free-floating",
        "typicalUse": "Trailing accents from driftwood, midground texture",
        "light": "Low to Medium",
        "co2": "Optional",
        "growthRate": "Medium",
        "tempRange": "15–26", "phRange": "5.5–7.5",
        "flowRate": "Low to Medium",
        "difficulty": 2,
        "trimming": "Every 4 weeks to maintain dense, trailing form",
        "careSummary": "Long, thin, string-like fronds that drape from hardscape like underwater Spanish moss. Prefers cooler water than most aquarium mosses — pairs well with white cloud minnows, hillstream loaches, and other subtropical species. Will brown in tanks held above 26 °C long-term.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Leptodictyum_riparium",
    },
    {
        "id": "moss-013", "slug": "round-pellia",
        "commonName": "Round Pellia", "scientificName": "Monosolenium tenerum",
        "family": "Monosoleniaceae",
        "origin": "East Asia",
        "type": "Liverwort (thallose)",
        "attachment": "Wood, stone, mesh — heavy enough to anchor itself",
        "typicalUse": "Midground texture, foreground when tied to flat stones",
        "light": "Low to Medium",
        "co2": "Optional",
        "growthRate": "Slow",
        "tempRange": "18–26", "phRange": "5.5–7.5",
        "flowRate": "Low",
        "difficulty": 2,
        "trimming": "Pinch back loose flaps; thinner than moss-trimming",
        "careSummary": "A thalloid liverwort, often confused with mosses, with flat ribbon-like fronds that grow in tight clumps. Heavier than most mosses, which lets it anchor itself on flat stones without thread. Pairs visually with iwagumi-style hardscape; offers a contrast texture to the fibrous look of Java or Christmas moss.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Monosolenium",
    },
]


TEMPLATE = """  {{
    id: "{id}",
    slug: "{slug}",
    category: "mosses",
    commonName: "{commonName}",
    scientificName: "{scientificName}",
    family: "{family}",
    origin: "{origin}",
    type: "{type}",
    attachment: "{attachment}",
    typicalUse: "{typicalUse}",
    light: "{light}",
    co2: "{co2}",
    growthRate: "{growthRate}",
    tempRange: "{tempRange}",
    phRange: "{phRange}",
    flowRate: "{flowRate}",
    difficulty: {difficulty},
    trimming: "{trimming}",
    careSummary: "{careSummary}",
    imageSourceUrl: "{imageSourceUrl}",
    imageLicenseHint: "Commons (mostly CC-BY-SA)",
  }},"""


def main() -> None:
    src = TS.read_text(encoding="utf-8")
    if "] as const;" not in src:
        raise SystemExit("Could not find closing `] as const;`")
    rendered = []
    for entry in NEW:
        safe = {k: (v.replace('"', '\\"') if isinstance(v, str) else v) for k, v in entry.items()}
        rendered.append(TEMPLATE.format(**safe))
    block = "\n".join(rendered) + "\n"
    TS.write_text(src.replace("] as const;", block + "] as const;"), encoding="utf-8")
    print(f"OK — appended {len(NEW)} mosses")


if __name__ == "__main__":
    main()
