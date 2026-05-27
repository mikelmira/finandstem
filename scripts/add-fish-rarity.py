#!/usr/bin/env python3
"""Add `rarity: N` field to every entry in src/data/fish.ts.

Rarity scale (1 = ubiquitous, 5 = very rare):
  1 — every fish shop stocks it
  2 — mainstream shops, regular availability
  3 — specialist shops or seasonal
  4 — special-order, line-bred morphs, importers only
  5 — collector tier, wild-caught only, F1 imports

Idempotent: skips entries that already have a rarity field.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FISH_TS = ROOT / "src" / "data" / "fish.ts"

RARITY: dict[str, int] = {
    # Tier 1 — ubiquitous
    "neon-tetra": 1,
    "cardinal-tetra": 1,
    "guppy": 1,
    "platy": 1,
    "swordtail": 1,
    "sailfin-molly": 1,
    "zebra-danio": 1,
    "tiger-barb": 1,
    "angelfish": 1,
    "harlequin-rasbora": 1,
    "bronze-corydoras": 1,
    "otocinclus": 1,
    "kuhli-loach": 1,
    "dwarf-gourami": 1,
    # Tier 2 — common
    "ember-tetra": 2,
    "cherry-barb": 2,
    "honey-gourami": 2,
    "black-neon-tetra": 2,
    "glowlight-tetra": 2,
    "white-cloud-mountain-minnow": 2,
    "rummynose-tetra": 2,
    "ram-cichlid": 2,
    "panda-corydoras": 2,
    "bristlenose-pleco": 2,
    "lemon-tetra": 2,
    "black-skirt-tetra": 2,
    "bloodfin-tetra": 2,
    "congo-tetra": 2,
    "siamese-algae-eater": 2,
    "paradise-fish": 2,
    "red-tail-shark": 2,
    "pearl-gourami": 2,
    "sterbai-corydoras": 2,
    "pygmy-corydoras": 2,
    "celestial-pearl-danio": 2,
    "boesemani-rainbow": 2,
    # Tier 3 — uncommon
    "chili-rasbora": 3,
    "sparkling-gourami": 3,
    "apistogramma-cacatuoides": 3,
    "endler-livebearer": 3,
    "marbled-hatchetfish": 3,
    "diamond-tetra": 3,
    "threadfin-rainbowfish": 3,
    "dwarf-pencilfish": 3,
    "bolivian-ram": 3,
    "praecox-rainbow": 3,
    "silver-tip-tetra": 3,
    "espe-rasbora": 3,
    "kribensis": 3,
    "black-phantom-tetra": 3,
    # Tier 4 — rare
    "clown-killifish": 4,
    "scarlet-badis": 4,
    "forktail-blue-eye": 4,
    "apistogramma-agassizii": 4,
    "reticulated-hillstream-loach": 4,
    "dwarf-puffer": 4,
    "spotted-blue-eye": 4,
}


def main() -> None:
    src = FISH_TS.read_text(encoding="utf-8")
    lines = src.split("\n")
    out: list[str] = []

    current_slug: str | None = None
    rarity_inserted = False

    slug_re = re.compile(r'^\s*slug:\s*"([^"]+)"')
    rarity_re = re.compile(r"^\s*rarity:")
    breeding_re = re.compile(r'^\s*breedingDifficulty:\s*"[^"]*",\s*$')

    for line in lines:
        out.append(line)
        m = slug_re.match(line)
        if m:
            current_slug = m.group(1)
            rarity_inserted = False
            continue
        if rarity_re.match(line):
            # Already has rarity, skip insertion for this entry.
            rarity_inserted = True
            continue
        if (
            current_slug
            and not rarity_inserted
            and breeding_re.match(line)
        ):
            if current_slug not in RARITY:
                raise SystemExit(
                    f"No rarity mapping for slug: {current_slug}. "
                    "Add it to RARITY in this script."
                )
            rarity = RARITY[current_slug]
            indent = re.match(r"^\s*", line).group(0)
            out.append(f"{indent}rarity: {rarity},")
            rarity_inserted = True

    FISH_TS.write_text("\n".join(out), encoding="utf-8")
    print(f"OK — patched {FISH_TS}")


if __name__ == "__main__":
    main()
