#!/usr/bin/env python3
"""Append 5 new snail entries (session 07)."""

from __future__ import annotations
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TS = ROOT / "src" / "data" / "snails.ts"

NEW = [
    {
        "id": "snail-008", "slug": "black-devil-snail",
        "commonName": "Black Devil Snail", "scientificName": "Faunus ater",
        "family": "Pachychilidae",
        "origin": "Brackish estuaries of Southeast Asia and the Pacific",
        "adultSize": "5–8", "minTankSize": "40",
        "diet": "Algae grazer / detritivore",
        "feedingNotes": "Soft algae, biofilm, decaying plant matter, blanched zucchini. Calcium via cuttlebone for the long, conical shell.",
        "tempRange": "22–28", "phRange": "7.0–8.5", "dghRange": "8–20", "khRange": "4–12",
        "flowRate": "Low to High", "lifespan": "5–8",
        "breeding": "Will not breed in pure fresh water (needs brackish for larval stage). A safe non-breeder for freshwater tanks.",
        "algaeEaterRating": 4, "plantSafe": "Yes",
        "fishTankSafeWith": "Peaceful community fish, large enough to ignore. Avoid assassin snails and large loaches.",
        "shellCalciumDemand": "High",
        "difficulty": 2,
        "careSummary": "Long, glossy black turret-shaped shell that looks more like a marine periwinkle than a freshwater snail. Tolerates fresh water indefinitely as long as hardness stays moderate — but won't breed unless given brackish conditions. The right algae crew snail for keepers who don't want a population explosion.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Faunus_ater",
    },
    {
        "id": "snail-009", "slug": "pond-snail",
        "commonName": "Pond Snail", "scientificName": "Physa acuta",
        "family": "Physidae",
        "origin": "North America (introduced worldwide)",
        "adultSize": "0.5–1.5", "minTankSize": "10",
        "diet": "Omnivore / scavenger",
        "feedingNotes": "Eats biofilm, decaying plants, fish food leftovers, fallen fruit, and dead snails. Will graze soft tender plant tissue if hungry.",
        "tempRange": "10–28", "phRange": "6.5–8.5", "dghRange": "3–25", "khRange": "2–15",
        "flowRate": "Low to High", "lifespan": "1–2",
        "breeding": "Hermaphroditic and prolific. Lays gelatinous egg clutches on glass and leaves. Population scales with food availability.",
        "algaeEaterRating": 3, "plantSafe": "Mostly yes (will nibble very soft tissue)",
        "fishTankSafeWith": "Almost any peaceful community. Vulnerable to assassin snails, loaches, and puffers.",
        "shellCalciumDemand": "Medium",
        "difficulty": 1,
        "careSummary": "Almost always arrives as a hitchhiker on new plants. Often demonised but actually a useful clean-up crew member — eats fish-food leftovers, dead leaves, and biofilm. Population self-regulates with food supply; an outbreak is a feeding-too-much signal, not a snail problem.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Physa_acuta",
    },
    {
        "id": "snail-010", "slug": "colombian-ramshorn",
        "commonName": "Colombian Ramshorn", "scientificName": "Marisa cornuarietis",
        "family": "Ampullariidae",
        "origin": "Northern South America",
        "adultSize": "3–5", "minTankSize": "75",
        "diet": "Omnivore (heavy plant-eater)",
        "feedingNotes": "Algae wafer, blanched zucchini and lettuce, sinking pellet. Will defoliate live aquatic plants if underfed.",
        "tempRange": "20–28", "phRange": "7.0–8.5", "dghRange": "8–20", "khRange": "4–12",
        "flowRate": "Low to Medium", "lifespan": "2–4",
        "breeding": "Lays jelly egg clutches under the waterline. Population grows quickly under good feeding.",
        "algaeEaterRating": 3, "plantSafe": "No (eats most aquatic plants)",
        "fishTankSafeWith": "Peaceful community fish and shrimp. Avoid assassin snails, large loaches, and crayfish.",
        "shellCalciumDemand": "High",
        "difficulty": 1,
        "careSummary": "A much larger ramshorn-shape relative of the apple snail family. The yellow-and-brown banded shell can reach 5 cm. Will graze live plants aggressively — best in hardscape-only tanks or with tough plants like Anubias and Bolbitis. Used in some regions for biological control of disease-carrying pond snails.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Marisa_cornuarietis",
    },
    {
        "id": "snail-011", "slug": "spixi-snail",
        "commonName": "Spixi Snail", "scientificName": "Asolene spixii",
        "family": "Ampullariidae",
        "origin": "South America",
        "adultSize": "2–3", "minTankSize": "40",
        "diet": "Omnivore / scavenger",
        "feedingNotes": "Algae, biofilm, fallen leaves, blanched veg, sinking pellet. Will eat pest snail eggs and small pest snails — a low-key population control.",
        "tempRange": "22–28", "phRange": "7.0–8.5", "dghRange": "5–15", "khRange": "3–10",
        "flowRate": "Low to Medium", "lifespan": "2–3",
        "breeding": "Lays jelly egg clutches under the waterline. Slower breeders than pond snails or ramshorns.",
        "algaeEaterRating": 3, "plantSafe": "Mostly yes (occasional nibbling)",
        "fishTankSafeWith": "Peaceful community fish and shrimp.",
        "shellCalciumDemand": "Medium",
        "difficulty": 2,
        "careSummary": "Zebra-striped apple snail relative — gold and dark-brown banding on a globose shell. Eats pest snail eggs, making it a gentler alternative to the assassin snail in a community tank. Slower-breeding than the Colombian ramshorn or pond snails, so doesn't take over.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Asolene_spixii",
    },
    {
        "id": "snail-012", "slug": "japanese-trapdoor-snail",
        "commonName": "Japanese Trapdoor Snail", "scientificName": "Cipangopaludina chinensis",
        "family": "Viviparidae",
        "origin": "East Asia",
        "adultSize": "4–6", "minTankSize": "60",
        "diet": "Omnivore / detritivore",
        "feedingNotes": "Algae, biofilm, decaying plant matter, fallen food. Calcium-supplemented food for shell maintenance.",
        "tempRange": "5–28", "phRange": "7.0–8.5", "dghRange": "8–25", "khRange": "4–15",
        "flowRate": "Low to Medium", "lifespan": "3–10",
        "breeding": "Livebearer (gives birth to fully-formed juveniles rather than laying eggs). Slow, manageable breeders.",
        "algaeEaterRating": 4, "plantSafe": "Yes (does not graze live plants)",
        "fishTankSafeWith": "Peaceful community fish, koi, goldfish.",
        "shellCalciumDemand": "High",
        "difficulty": 1,
        "careSummary": "Heavy, glossy olive-brown shell with a hard operculum (the 'trapdoor') that seals the snail in when threatened. Cold-tolerant — survives garden ponds in temperate climates and indoor unheated tanks. Livebearer rather than egg-layer, which makes population growth predictable.",
        "imageSourceUrl": "https://en.wikipedia.org/wiki/Cipangopaludina_chinensis",
    },
]


TEMPLATE = """  {{
    id: "{id}",
    slug: "{slug}",
    category: "snails",
    commonName: "{commonName}",
    scientificName: "{scientificName}",
    family: "{family}",
    origin: "{origin}",
    adultSize: "{adultSize}",
    minTankSize: "{minTankSize}",
    diet: "{diet}",
    feedingNotes: "{feedingNotes}",
    tempRange: "{tempRange}",
    phRange: "{phRange}",
    dghRange: "{dghRange}",
    khRange: "{khRange}",
    flowRate: "{flowRate}",
    lifespan: "{lifespan}",
    breeding: "{breeding}",
    algaeEaterRating: {algaeEaterRating},
    plantSafe: "{plantSafe}",
    fishTankSafeWith: "{fishTankSafeWith}",
    shellCalciumDemand: "{shellCalciumDemand}",
    difficulty: {difficulty},
    careSummary: "{careSummary}",
    imageSourceUrl: "{imageSourceUrl}",
    imageLicenseHint: "Commons (mostly CC-BY-SA)",
  }},"""


def main() -> None:
    src = TS.read_text(encoding="utf-8")
    # snails.ts ends with plain `];` rather than `] as const;`.
    closer = "] as const;" if "] as const;" in src else "];"
    if closer not in src:
        raise SystemExit("Could not find closing `];`")
    rendered = []
    for entry in NEW:
        safe = {k: (v.replace('"', '\\"') if isinstance(v, str) else v) for k, v in entry.items()}
        rendered.append(TEMPLATE.format(**safe))
    block = "\n".join(rendered) + "\n"
    TS.write_text(src.replace(closer, block + closer), encoding="utf-8")
    print(f"OK — appended {len(NEW)} snails")


if __name__ == "__main__":
    main()
