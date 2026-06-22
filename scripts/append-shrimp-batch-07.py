#!/usr/bin/env python3
"""Append 5 new shrimp entries (session 07)."""

from __future__ import annotations
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TS = ROOT / "src" / "data" / "shrimp.ts"

NEW = [
    {
        "id": "shrimp-011", "slug": "green-jade-shrimp",
        "commonName": "Green Jade Shrimp", "scientificName": "Neocaridina davidi 'Green Jade'",
        "origin": "Selectively bred (Taiwan)",
        "adultSize": "2.5–3 cm", "minTankSize": "20 L", "colonyMin": 10,
        "diet": "Omnivore / detritivore",
        "feedingNotes": "Biofilm, algae, blanched veg, sinking pellets, calcium-rich food.",
        "tempRange": "18–28", "phRange": "6.5–8.0", "dghRange": "6–15",
        "flowRate": "Low to Medium", "tdsRange": "150–250",
        "lifespan": "1.5", "difficulty": 1,
        "breeding": "Very easy, colony breeds without intervention",
        "algaeEaterRating": 4, "plantSafe": "Yes",
        "fishTankSafeWith": "Nano fish only, chili rasbora, ember tetra, otocinclus",
        "careSummary": "The deep emerald green colour morph of Neocaridina davidi — colour purity has been selectively bred up to a deep, almost matte jade. Same care as cherry shrimp, including the same robustness. Crossing with other Neocaridina morphs reverts the colony to wild brown over a few generations.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Neocaridina_davidi",
    },
    {
        "id": "shrimp-012", "slug": "tiger-shrimp",
        "commonName": "Tiger Shrimp", "scientificName": "Caridina mariae",
        "origin": "Southern China and Hong Kong",
        "adultSize": "2.5–3 cm", "minTankSize": "30 L", "colonyMin": 10,
        "diet": "Omnivore / detritivore",
        "feedingNotes": "Biofilm, algae wafer, blanched spinach, low-protein shrimp food.",
        "tempRange": "18–24", "phRange": "6.0–7.5", "dghRange": "4–10",
        "flowRate": "Low to Medium", "tdsRange": "150–250",
        "lifespan": "1.5", "difficulty": 3,
        "breeding": "Medium — needs softer, slightly cooler water than Neocaridina",
        "algaeEaterRating": 3, "plantSafe": "Yes",
        "fishTankSafeWith": "Nano fish only, dwarf rasboras, otocinclus",
        "careSummary": "Black-and-clear striped Caridina with orange eyes. Sits between Neocaridina (hardy) and Crystal Red shrimp (delicate) on the difficulty curve. Tolerates slightly harder water than Crystal Reds but still wants soft, cool, stable conditions to breed.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Caridina",
    },
    {
        "id": "shrimp-013", "slug": "sulawesi-cardinal-shrimp",
        "commonName": "Sulawesi Cardinal Shrimp", "scientificName": "Caridina dennerli",
        "origin": "Lake Matano, Sulawesi (Indonesia)",
        "adultSize": "1.5–2 cm", "minTankSize": "40 L", "colonyMin": 10,
        "diet": "Omnivore / detritivore (biofilm-focused)",
        "feedingNotes": "Biofilm and softened algae wafer. Live in mineral-rich Sulawesi lake water.",
        "tempRange": "26–30", "phRange": "7.5–8.5", "dghRange": "6–12",
        "flowRate": "Low", "tdsRange": "150–250",
        "lifespan": "1–1.5", "difficulty": 5,
        "breeding": "Hard — requires Sulawesi-spec water and stable parameters",
        "algaeEaterRating": 3, "plantSafe": "Yes",
        "fishTankSafeWith": "Species-only tank recommended — almost no fish coexist safely",
        "careSummary": "An expert-only shrimp: deep red body, white legs, and white antennae like a tiny cardinal. Requires high pH, warm water, and high mineral content — the inverse of Crystal Red shrimp chemistry. Single-species biotope tanks only.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Caridina_dennerli",
    },
    {
        "id": "shrimp-014", "slug": "vampire-shrimp",
        "commonName": "Vampire Shrimp", "scientificName": "Atya gabonensis",
        "origin": "West and Central Africa",
        "adultSize": "12–15 cm", "minTankSize": "100 L", "colonyMin": 1,
        "diet": "Filter feeder",
        "feedingNotes": "Powdered fry food, crushed flake, baby brine shrimp suspended in current. Filters fine particles from the water column with fan-like appendages.",
        "tempRange": "24–28", "phRange": "6.5–7.5", "dghRange": "5–15",
        "flowRate": "Medium to high (mandatory)",
        "tdsRange": "150–300", "lifespan": "5–10",
        "difficulty": 3, "breeding": "Very hard (larvae need brackish/marine phase)",
        "algaeEaterRating": 1, "plantSafe": "Yes",
        "fishTankSafeWith": "Peaceful community fish and rasboras, never with cichlids or large barbs",
        "careSummary": "A large filter-feeding shrimp with blue-grey to deep-purple colouration and fan-like appendages it waves into the current to catch food. Reaches 15 cm. Needs strong flow and a powdered food supply — adults will starve in stagnant tanks. Long-lived (up to 10 years).",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Atya_gabonensis",
    },
    {
        "id": "shrimp-015", "slug": "black-rose-shrimp",
        "commonName": "Black Rose Shrimp", "scientificName": "Neocaridina davidi 'Black Rose'",
        "origin": "Selectively bred",
        "adultSize": "2.5–3 cm", "minTankSize": "20 L", "colonyMin": 10,
        "diet": "Omnivore / detritivore",
        "feedingNotes": "Biofilm, algae, blanched veg, sinking pellets, calcium-rich food.",
        "tempRange": "18–28", "phRange": "6.5–8.0", "dghRange": "6–15",
        "flowRate": "Low to Medium", "tdsRange": "150–250",
        "lifespan": "1.5", "difficulty": 1,
        "breeding": "Very easy, colony breeds without intervention",
        "algaeEaterRating": 4, "plantSafe": "Yes",
        "fishTankSafeWith": "Nano fish only, chili rasbora, ember tetra, otocinclus",
        "careSummary": "Deep velvet-black colour morph of Neocaridina davidi. The black is genetically the most stable of the dark Neocaridina morphs, with less reversion to wild brown over generations than chocolate or carbon variants. Reads stunningly against pale sand or aquasoil.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Neocaridina_davidi",
    },
]


TEMPLATE = """  {{
    id: "{id}",
    slug: "{slug}",
    category: "shrimp",
    commonName: "{commonName}",
    scientificName: "{scientificName}",
    origin: "{origin}",
    adultSize: "{adultSize}",
    minTankSize: "{minTankSize}",
    colonyMin: {colonyMin},
    diet: "{diet}",
    feedingNotes: "{feedingNotes}",
    tempRange: "{tempRange}",
    phRange: "{phRange}",
    dghRange: "{dghRange}",
    flowRate: "{flowRate}",
    tdsRange: "{tdsRange}",
    lifespan: "{lifespan}",
    difficulty: {difficulty},
    breeding: "{breeding}",
    algaeEaterRating: {algaeEaterRating},
    plantSafe: "{plantSafe}",
    fishTankSafeWith: "{fishTankSafeWith}",
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
    print(f"OK — appended {len(NEW)} shrimp")


if __name__ == "__main__":
    main()
