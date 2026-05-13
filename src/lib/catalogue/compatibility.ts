import { overlaps } from "@/lib/range";
import {
  allNorm,
  fishNorm,
  plantNorm,
  shrimpNorm,
  mossNorm,
  type NormalizedEntry,
  type FishNorm,
  type PlantNorm,
  type ShrimpNorm,
  type MossNorm,
} from "@/lib/catalogue/normalize";

export type CompatibilityCategory = "fish" | "plants" | "shrimp" | "mosses";

export interface MatchReason {
  badge: string;
  description: string;
}

export interface CompatibilityMatch<E = NormalizedEntry> {
  entry: E;
  reasons: MatchReason[];
}

export function parseAnchor(value: string | undefined): {
  category: CompatibilityCategory;
  slug: string;
} | null {
  if (!value) return null;
  const [category, slug] = value.split(":");
  if (!category || !slug) return null;
  if (
    category !== "fish" &&
    category !== "plants" &&
    category !== "shrimp" &&
    category !== "mosses"
  )
    return null;
  return { category, slug };
}

export function findAnchor(value: string | undefined): NormalizedEntry | null {
  const parsed = parseAnchor(value);
  if (!parsed) return null;
  const hit = allNorm.find(
    (e) => e.category === parsed.category && e.slug === parsed.slug,
  );
  return hit ?? null;
}

function paramReasons(
  anchor: NormalizedEntry,
  candidate: NormalizedEntry,
): MatchReason[] | null {
  const reasons: MatchReason[] = [];
  if (!overlaps(anchor.tempRange, candidate.tempRange)) return null;
  reasons.push({
    badge: "Temp ✓",
    description: `${candidate.tempRange?.min}–${candidate.tempRange?.max} °C overlaps anchor's ${anchor.tempRange?.min}–${anchor.tempRange?.max} °C`,
  });
  if (!overlaps(anchor.phRange, candidate.phRange)) return null;
  reasons.push({
    badge: "pH ✓",
    description: `${candidate.phRange?.min}–${candidate.phRange?.max} pH overlaps anchor's ${anchor.phRange?.min}–${anchor.phRange?.max}`,
  });
  if (anchor.dghRange && candidate.dghRange) {
    if (!overlaps(anchor.dghRange, candidate.dghRange)) return null;
    reasons.push({
      badge: "dGH ✓",
      description: `${candidate.dghRange.min}–${candidate.dghRange.max} dGH overlaps anchor's ${anchor.dghRange.min}–${anchor.dghRange.max}`,
    });
  }
  return reasons;
}

function matchFish(
  anchor: NormalizedEntry,
  candidate: FishNorm,
): CompatibilityMatch<FishNorm> | null {
  if (anchor.category === "fish" && anchor.slug === candidate.slug) return null;
  const base = paramReasons(anchor, candidate);
  if (!base) return null;
  if (anchor.category === "shrimp" && candidate.shrimpSafe !== "yes")
    return null;
  if (anchor.category === "shrimp")
    base.push({
      badge: "Shrimp-safe ✓",
      description: "Listed as fully shrimp-safe.",
    });

  // Fish-to-fish: filter on temperament pairing.
  if (anchor.category === "fish") {
    const a = anchor.temperament;
    const c = candidate.temperament;
    const peaceful = (t: typeof a) =>
      t === "Peaceful" || t === "Territorial when breeding";
    const aggressive = (t: typeof a) => t === "Aggressive";
    // Aggressive + Peaceful pairing is a no-go.
    if ((aggressive(a) && peaceful(c)) || (aggressive(c) && peaceful(a)))
      return null;
    base.push({
      badge: "Temperament ✓",
      description:
        a === c
          ? `Both species are ${a.toLowerCase()}.`
          : `${a} and ${c.toLowerCase()} can share a tank without bullying.`,
    });
  }
  return { entry: candidate, reasons: base };
}

function matchPlant(
  anchor: NormalizedEntry,
  candidate: PlantNorm,
): CompatibilityMatch<PlantNorm> | null {
  if (anchor.category === "plants" && anchor.slug === candidate.slug)
    return null;
  const base = paramReasons(anchor, candidate);
  if (!base) return null;
  if (anchor.category === "fish" && !anchor.plantSafe) return null;
  if (anchor.category === "fish" && anchor.plantSafe)
    base.push({
      badge: "Plant-safe ✓",
      description: "Anchor fish is plant-safe.",
    });
  return { entry: candidate, reasons: base };
}

function matchShrimp(
  anchor: NormalizedEntry,
  candidate: ShrimpNorm,
): CompatibilityMatch<ShrimpNorm> | null {
  if (anchor.category === "shrimp" && anchor.slug === candidate.slug)
    return null;
  const base = paramReasons(anchor, candidate);
  if (!base) return null;
  if (anchor.category === "fish") {
    if (anchor.shrimpSafe === "no") return null;
    base.push({
      badge:
        anchor.shrimpSafe === "yes" ? "Shrimp-safe ✓" : "Adult shrimp ✓",
      description:
        anchor.shrimpSafe === "yes"
          ? "Anchor fish is fully shrimp-safe."
          : "Anchor fish is safe with adult shrimp.",
    });
  }
  return { entry: candidate, reasons: base };
}

function matchMoss(
  anchor: NormalizedEntry,
  candidate: MossNorm,
): CompatibilityMatch<MossNorm> | null {
  if (anchor.category === "mosses" && anchor.slug === candidate.slug)
    return null;
  const reasons: MatchReason[] = [];
  if (!overlaps(anchor.tempRange, candidate.tempRange)) return null;
  reasons.push({
    badge: "Temp ✓",
    description: `${candidate.tempRange?.min}–${candidate.tempRange?.max} °C overlaps anchor's ${anchor.tempRange?.min}–${anchor.tempRange?.max} °C`,
  });
  if (!overlaps(anchor.phRange, candidate.phRange)) return null;
  reasons.push({
    badge: "pH ✓",
    description: `${candidate.phRange?.min}–${candidate.phRange?.max} pH overlaps anchor's ${anchor.phRange?.min}–${anchor.phRange?.max}`,
  });
  return { entry: candidate, reasons };
}

export interface CompatibilityResult {
  anchor: NormalizedEntry;
  fish: CompatibilityMatch<FishNorm>[];
  plants: CompatibilityMatch<PlantNorm>[];
  shrimp: CompatibilityMatch<ShrimpNorm>[];
  mosses: CompatibilityMatch<MossNorm>[];
}

export function buildCompatibility(
  anchor: NormalizedEntry,
): CompatibilityResult {
  const fish = fishNorm
    .map((c) => matchFish(anchor, c))
    .filter((m): m is CompatibilityMatch<FishNorm> => m !== null);
  const plants = plantNorm
    .map((c) => matchPlant(anchor, c))
    .filter((m): m is CompatibilityMatch<PlantNorm> => m !== null);
  const shrimp = shrimpNorm
    .map((c) => matchShrimp(anchor, c))
    .filter((m): m is CompatibilityMatch<ShrimpNorm> => m !== null);
  const mosses = mossNorm
    .map((c) => matchMoss(anchor, c))
    .filter((m): m is CompatibilityMatch<MossNorm> => m !== null);
  return { anchor, fish, plants, shrimp, mosses };
}
