"""Parse the 17 substrate profiles in
`prompts/05-substrate-profiles-and-compare.md` and emit
`src/data/substrates.ts`.

The markdown has a strict shape per profile:

  ### N. Name
  | Field | Value |
  ...
  **How it works.** ...
  **Best use cases.** ...
  **Common mistakes.** ...
  **Pro tips.** ...
  **Sources:**
  - [Label](url)

We extract the table fields, the four prose sections, and the
sources block, then emit a TypeScript file that conforms to the
`SubstrateEntry` type defined in `src/types/substrate.ts`.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD = ROOT / "prompts" / "05-substrate-profiles-and-compare.md"
OUT = ROOT / "src" / "data" / "substrates.ts"

# Category bucket per profile index (1-based).
CATEGORY_BY_INDEX = {
    1: "active-aquasoil",
    2: "active-aquasoil",
    3: "active-aquasoil",
    4: "active-aquasoil",
    5: "active-aquasoil",
    6: "active-aquasoil",
    7: "active-aquasoil",
    8: "active-aquasoil",
    9: "active-aquasoil",
    10: "inert-nutrient",
    11: "inert-nutrient",
    12: "inert-nutrient",
    13: "inert-sand",
    14: "inert-sand",
    15: "inert-sand",
    16: "additive-or-base-layer",
    17: "additive-or-base-layer",
}

# Shrimp-safety per slug (from the cheat sheet table at the end of
# Part 1 — most are Yes, one is No for Black Diamond Blasting Sand,
# Power Sand is "used under active soil" so we mark True since
# stacked it's safe.
SHRIMP_SAFE = {
    "ada-amazonia-v2": True,
    "ada-amazonia-powder-v2": True,
    "ada-africana": True,
    "tropica-aquarium-soil": True,
    "tropica-aquarium-soil-powder": True,
    "uns-controsoil": True,
    "fluval-stratum": True,
    "dennerle-scapers-soil": True,
    "akadama": True,
    "caribsea-eco-complete": True,
    "seachem-flourite-black": True,
    "seachem-flourite-black-sand": True,
    "pool-filter-sand": True,
    "black-diamond-blasting-sand": False,
    "caribsea-tahitian-moon-sand": True,
    "ada-power-sand": True,
    "ada-bacter-100": True,
}


def map_ph_effect(target: str, category: str) -> str:
    t = target.lower()
    if "neutral" in t or t.strip() == "":
        return "neutral"
    if category == "active-aquasoil":
        # Active soils lower pH. Strong if the target is in the
        # 5.x to 6.5 band; gentle for slightly less aggressive ones.
        if re.search(r"5\.\d", t):
            return "lowers-strong"
        return "lowers-gentle"
    return "neutral"


def map_kh_effect(text: str) -> str:
    t = text.lower()
    if "lowers" in t:
        return "lowers-strong" if "0" in t or "strong" in t else "lowers-gentle"
    if "neutral" in t or t.strip() == "":
        return "neutral"
    return "neutral"


def map_ammonia(text: str) -> str:
    t = text.lower()
    if t.startswith("none") or "no ammonia" in t:
        return "none"
    if "very light" in t:
        return "very-light"
    if "strong" in t:
        return "strong"
    if "moderate" in t:
        return "moderate"
    if "light" in t:
        return "light"
    return "none"


def parse_table(block: str) -> dict[str, str]:
    """Parse the leading | Field | Value | table into a dict."""
    out: dict[str, str] = {}
    for line in block.splitlines():
        m = re.match(r"\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|", line.strip())
        if not m:
            continue
        key, val = m.group(1).strip(), m.group(2).strip()
        if key.lower() == "field" or set(key) <= {"-", " "}:
            continue
        out[key.lower()] = val
    return out


def parse_section(block: str, label: str) -> str:
    """Extract '**Label.** body' text up to the next bold-prefix or
    a horizontal rule."""
    m = re.search(
        rf"\*\*{re.escape(label)}\.?\*\*\s*(.*?)(?=\*\*[A-Z][^*]*?\*\*|\n---|\Z)",
        block,
        re.DOTALL,
    )
    if not m:
        return ""
    text = m.group(1).strip()
    return text


def parse_sources(block: str) -> list[dict[str, str]]:
    out = []
    m = re.search(r"\*\*Sources:?\*\*\s*(.*?)(?=\n---|\Z)", block, re.DOTALL)
    if not m:
        return []
    for ln in m.group(1).splitlines():
        ln = ln.strip()
        if not ln.startswith("-"):
            continue
        # Match [label](url)
        lm = re.search(r"\[([^\]]+)\]\(([^)]+)\)", ln)
        if lm:
            out.append({"label": lm.group(1).strip(), "url": lm.group(2).strip()})
    return out


def short_summary(profile: dict, sections: dict[str, str]) -> str:
    """Build a ~90-word careSummary from the first sentence of How it
    works + Best use cases + difficulty cue."""
    how = sections.get("howItWorks", "")
    use = sections.get("bestUseCases", "")
    first_how = re.split(r"(?<=\.)\s", how, maxsplit=1)[0]
    first_use = re.split(r"(?<=\.)\s", use, maxsplit=1)[0]
    parts = [first_how, first_use]
    return " ".join(p for p in parts if p).strip()


def main() -> None:
    text = MD.read_text()
    # Get only Part 1 (everything before "# Part 2").
    part1 = text.split("# Part 2", 1)[0]
    profile_re = re.compile(
        r"^### (\d+)\.\s*(.+?)\n(.*?)(?=^### \d+\.|^## Comparison cheat|^---\n## )",
        re.DOTALL | re.MULTILINE,
    )

    entries = []
    for m in profile_re.finditer(part1):
        idx = int(m.group(1))
        title = m.group(2).strip()
        body = m.group(3)

        table = parse_table(body)
        slug = table.get("slug", "").strip().strip("`")
        category = CATEGORY_BY_INDEX[idx]

        sections = {
            "howItWorks": parse_section(body, "How it works"),
            "bestUseCases": parse_section(body, "Best use cases"),
            "commonMistakes": parse_section(body, "Common mistakes"),
            "proTips": parse_section(body, "Pro tips"),
        }
        sources = parse_sources(body)

        # Best-for: split by comma, capitalise the words
        best_for_raw = table.get("best for", "")
        best_for = [b.strip() for b in best_for_raw.split(",") if b.strip()]

        # Difficulty: "3 of 5" → 3
        diff_m = re.search(r"(\d)", table.get("difficulty", "3"))
        difficulty = int(diff_m.group(1)) if diff_m else 3

        ph_target = table.get("ph target") or table.get("ph effect", "Neutral")
        ammonia_text = table.get("ammonia release", "")
        kh_text = table.get("kh effect", "")

        entry = {
            "id": f"substrate-{idx:03d}",
            "slug": slug,
            "name": title,
            "brand": table.get("brand", "").strip(),
            "category": category,
            "countryOfOrigin": table.get("country of origin", "").strip(),
            "colour": table.get("colour", "").strip(),
            "grainSize": table.get("grain size", "").strip() or table.get("form", "").strip(),
            "phTarget": ph_target,
            "phEffect": map_ph_effect(ph_target, category),
            "khEffect": map_kh_effect(kh_text),
            "ammoniaRelease": map_ammonia(ammonia_text),
            "nutrientContent": table.get("nutrient content", "").strip(),
            "bufferingLongevity": table.get("buffering longevity", "").strip(),
            "recommendedWater": table.get("recommended water", "").strip(),
            "typicalPriceUsd": table.get("typical price usd", "").strip(),
            "difficulty": difficulty,
            "bestFor": best_for,
            "shrimpSafe": SHRIMP_SAFE.get(slug, True),
            "careSummary": short_summary({"title": title}, sections),
            "sections": sections,
            "sources": sources,
            "publishedAt": "2026-05-27T12:00:00.000Z",
            "updatedAt": "2026-05-27T12:00:00.000Z",
        }
        entries.append(entry)

    if len(entries) != 17:
        raise SystemExit(f"Expected 17 profiles, got {len(entries)}")

    # Emit TypeScript
    lines = [
        "// Auto-generated by scripts/build-substrates.py.",
        "// Source of truth: prompts/05-substrate-profiles-and-compare.md (Part 1).",
        "",
        'import type { SubstrateEntry } from "@/types/substrate";',
        "",
        "export const substrates: ReadonlyArray<SubstrateEntry> = [",
    ]
    for e in entries:
        lines.append("  " + json.dumps(e, indent=2).replace("\n", "\n  ") + ",")
    lines.append("];")
    lines.append("")
    lines.append(
        "export function findSubstrate(slug: string): SubstrateEntry | undefined {"
    )
    lines.append("  return substrates.find((s) => s.slug === slug);")
    lines.append("}")
    lines.append("")
    OUT.write_text("\n".join(lines))
    print(f"Wrote {len(entries)} substrate entries to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
