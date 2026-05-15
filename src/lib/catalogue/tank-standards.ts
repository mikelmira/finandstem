/**
 * Standard tank volumes the planner offers, plus the recommended
 * filter-flow range for each (in litres per hour).
 *
 * Filter-flow rule of thumb: total turnover should sit between **3×**
 * (gentle) and **10×** (high-flow / hillstream) of tank volume per
 * hour, with **5–6×** typical for a planted community. The `recMin`
 * and `recMax` columns are the comfortable working range; anything
 * outside that is flagged in the planner (`< minSafe` = too weak;
 * `> maxSafe` = too strong).
 *
 * The "min/maxSafe" bounds widen by a further 50 % so the planner
 * can warn without outright blocking — a slow filter on a heavily
 * planted tank or a strong filter feeding a hillstream loach are
 * both legitimate edge cases.
 */
export interface TankStandard {
  /** Volume in litres. */
  litres: number;
  /** Friendly label (e.g. "Nano · 30 L"). */
  label: string;
  /** Sub-label / use-case hint shown beside the option. */
  blurb: string;
  /** Minimum filter flow before it's considered understocked. */
  minSafeLph: number;
  /** Bottom of the recommended range. */
  recMinLph: number;
  /** Top of the recommended range. */
  recMaxLph: number;
  /** Maximum filter flow before it's considered too strong. */
  maxSafeLph: number;
  /** Internal water-column depth in cm — the planning ceiling for
   *  background plant height. Estimated as ~5 cm less than typical
   *  tank height for the given volume. */
  internalHeightCm: number;
  /** Approximate floor area in cm² — used to estimate plant
   *  coverage. */
  floorAreaCm2: number;
}

export const STANDARD_TANKS: ReadonlyArray<TankStandard> = [
  {
    litres: 10,
    label: "Pico · 10 L",
    blurb: "Single-species shrimp tank or a betta sorority of three.",
    minSafeLph: 25,
    recMinLph: 50,
    recMaxLph: 100,
    maxSafeLph: 150,
    internalHeightCm: 18,
    floorAreaCm2: 450,
  },
  {
    litres: 20,
    label: "Nano · 20 L",
    blurb: "Pico fish (chili rasbora, CPDs) or a shrimp colony.",
    minSafeLph: 50,
    recMinLph: 100,
    recMaxLph: 200,
    maxSafeLph: 300,
    internalHeightCm: 22,
    floorAreaCm2: 700,
  },
  {
    litres: 30,
    label: "Small nano · 30 L",
    blurb: "Small schooling group + shrimp or 1 small dwarf cichlid.",
    minSafeLph: 75,
    recMinLph: 150,
    recMaxLph: 300,
    maxSafeLph: 450,
    internalHeightCm: 26,
    floorAreaCm2: 1000,
  },
  {
    litres: 45,
    label: "Compact · 45 L",
    blurb: "Mid-size schoolers + a small bottom team.",
    minSafeLph: 110,
    recMinLph: 220,
    recMaxLph: 450,
    maxSafeLph: 680,
    internalHeightCm: 30,
    floorAreaCm2: 1250,
  },
  {
    litres: 60,
    label: "Aquascape · 60 L",
    blurb: "Classic 60 × 30 × 30 — the ADA mini-M standard scape.",
    minSafeLph: 150,
    recMinLph: 300,
    recMaxLph: 600,
    maxSafeLph: 900,
    internalHeightCm: 26,
    floorAreaCm2: 1800,
  },
  {
    litres: 90,
    label: "Community · 90 L",
    blurb: "Schooling group + a centrepiece + bottom team.",
    minSafeLph: 225,
    recMinLph: 450,
    recMaxLph: 900,
    maxSafeLph: 1350,
    internalHeightCm: 32,
    floorAreaCm2: 2800,
  },
  {
    litres: 120,
    label: "Community · 120 L",
    blurb: "Mixed community; the classic 4-foot tank in litres.",
    minSafeLph: 300,
    recMinLph: 600,
    recMaxLph: 1200,
    maxSafeLph: 1800,
    internalHeightCm: 37,
    floorAreaCm2: 3200,
  },
  {
    litres: 180,
    label: "Show · 180 L",
    blurb: "Substantial scape; multiple shoaling groups + a feature.",
    minSafeLph: 450,
    recMinLph: 900,
    recMaxLph: 1800,
    maxSafeLph: 2700,
    internalHeightCm: 42,
    floorAreaCm2: 4050,
  },
  {
    litres: 240,
    label: "Show · 240 L",
    blurb: "Large display; bigger species or many groups.",
    minSafeLph: 600,
    recMinLph: 1200,
    recMaxLph: 2400,
    maxSafeLph: 3600,
    internalHeightCm: 46,
    floorAreaCm2: 4800,
  },
  {
    litres: 350,
    label: "Showpiece · 350 L",
    blurb: "Six-foot statement tank.",
    minSafeLph: 875,
    recMinLph: 1750,
    recMaxLph: 3500,
    maxSafeLph: 5250,
    internalHeightCm: 46,
    floorAreaCm2: 7500,
  },
  {
    litres: 600,
    label: "Display · 600 L",
    blurb: "Public-aquarium scale.",
    minSafeLph: 1500,
    recMinLph: 3000,
    recMaxLph: 6000,
    maxSafeLph: 9000,
    internalHeightCm: 56,
    floorAreaCm2: 10800,
  },
];

/** Look up the standard that matches an exact volume, or null. */
export function findTankStandard(litres: number): TankStandard | null {
  return STANDARD_TANKS.find((t) => t.litres === litres) ?? null;
}

/** Closest standard for an arbitrary volume — used to give a flow
 *  recommendation even if the user enters a non-standard size. */
export function nearestTankStandard(litres: number): TankStandard {
  let closest = STANDARD_TANKS[0];
  let best = Math.abs(litres - closest.litres);
  for (const t of STANDARD_TANKS) {
    const d = Math.abs(litres - t.litres);
    if (d < best) {
      best = d;
      closest = t;
    }
  }
  return closest;
}

/* ─── Filter-flow verdict ────────────────────────────────────────────── */

export type FlowVerdict =
  | { kind: "ok"; turnover: number }
  | { kind: "low"; turnover: number; recommended: [number, number] }
  | { kind: "high"; turnover: number; recommended: [number, number] }
  | { kind: "blast"; turnover: number; recommended: [number, number] }
  | { kind: "starve"; turnover: number; recommended: [number, number] };

/**
 * Classify a filter flow against the standard's recommended range.
 *   - "starve" = below minSafe; clear under-stocked filtration
 *   - "low"    = between minSafe and recMin
 *   - "ok"     = within the recommended band
 *   - "high"   = between recMax and maxSafe
 *   - "blast"  = above maxSafe — likely to stress inhabitants
 */
export function classifyFlow(
  litres: number,
  filterLph: number,
): FlowVerdict {
  const std =
    findTankStandard(litres) ?? nearestTankStandard(litres);
  const turnover = filterLph / litres;
  const rec: [number, number] = [std.recMinLph, std.recMaxLph];
  if (filterLph < std.minSafeLph) {
    return { kind: "starve", turnover, recommended: rec };
  }
  if (filterLph < std.recMinLph) {
    return { kind: "low", turnover, recommended: rec };
  }
  if (filterLph > std.maxSafeLph) {
    return { kind: "blast", turnover, recommended: rec };
  }
  if (filterLph > std.recMaxLph) {
    return { kind: "high", turnover, recommended: rec };
  }
  return { kind: "ok", turnover };
}

/* ─── 1–5 light and 1–3 CO₂ scale ────────────────────────────────────── */

/**
 * Convert our stored Light token ("Low"/"Medium"/"High") to a finer
 * 1–5 scale the planner UI exposes.
 *
 * Mapped against PAR (μmol/m²/s) categories:
 *   1 = Very low      (<15 PAR — deep blackwater biotope)
 *   2 = Low           (15–30 PAR — Anubias / Java fern / crypts)   ← "Low"
 *   3 = Medium        (30–50 PAR — most aquarium plants)            ← "Medium"
 *   4 = High          (50–80 PAR — carpets, demanding reds)         ← "High"
 *   5 = Very high     (80+ PAR — high-tech competition scapes)
 *
 * Positions 1 and 5 are reserved for finer per-species data the
 * catalogue doesn't carry yet.
 */
export type LightScale = 1 | 2 | 3 | 4 | 5;
export function lightTo5(
  light: "Low" | "Medium" | "High" | null,
): LightScale | null {
  if (light === "Low") return 2;
  if (light === "Medium") return 3;
  if (light === "High") return 4;
  return null;
}

/**
 * Convert our stored CO₂ token to a 1–3 scale.
 *   1 — optional (None / Optional)
 *   2 — recommended
 *   3 — required
 */
export type Co2Scale = 1 | 2 | 3;
export function co2To3(
  co2: "None" | "Optional" | "Recommended" | "Required" | null,
): Co2Scale | null {
  if (co2 === null) return null;
  if (co2 === "None" || co2 === "Optional") return 1;
  if (co2 === "Recommended") return 2;
  return 3;
}

export const LIGHT_SCALE_LABELS: Record<LightScale, string> = {
  1: "Very low",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "Very high",
};

export const CO2_SCALE_LABELS: Record<Co2Scale, string> = {
  1: "Optional",
  2: "Recommended",
  3: "Required",
};

/* ─── Bioload / stocking ─────────────────────────────────────────────── */

/**
 * Approximate "cm of adult fish per litre" stocking heuristic. Plants
 * and mosses don't add bioload; shrimp count for far less than fish
 * (treated at ~⅕ a comparable-sized fish).
 *
 * Verdict bands (cm/L):
 *   ≤ 0.5  understocked
 *   ≤ 1.0  comfortable
 *   ≤ 1.5  full
 *   > 1.5  overstocked
 */
/**
 * Stocking verdict — `tooSmall` overrides the bioload bands when at
 * least one selected species' `minTankL` exceeds the chosen tank
 * volume. In that case the bioload number is technically fine but
 * the user can't keep these species in this tank for *dimensional*
 * reasons (a 3 cm tetra needs horizontal swimming room for the
 * whole shoal, even if the cumulative bioload is low).
 */
export type StockingVerdict =
  | "tooSmall"
  | "understocked"
  | "comfortable"
  | "full"
  | "overstocked";

export const STOCKING_BANDS: Record<
  Exclude<StockingVerdict, "tooSmall">,
  { min: number; max: number; label: string; blurb: string }
> = {
  understocked: {
    min: 0,
    max: 0.5,
    label: "Understocked",
    blurb: "Plenty of room — you can comfortably add more.",
  },
  comfortable: {
    min: 0.5,
    max: 1.0,
    label: "Comfortable",
    blurb: "Healthy stocking. Room for a small group more.",
  },
  full: {
    min: 1.0,
    max: 1.5,
    label: "Full",
    blurb: "Approaching capacity. Keep up weekly water changes.",
  },
  overstocked: {
    min: 1.5,
    max: Infinity,
    label: "Overstocked",
    blurb: "Likely too heavy. Drop a group or upsize the tank.",
  },
};

export function verdictForLoad(
  loadPerL: number,
): Exclude<StockingVerdict, "tooSmall"> {
  if (loadPerL <= STOCKING_BANDS.understocked.max) return "understocked";
  if (loadPerL <= STOCKING_BANDS.comfortable.max) return "comfortable";
  if (loadPerL <= STOCKING_BANDS.full.max) return "full";
  return "overstocked";
}
