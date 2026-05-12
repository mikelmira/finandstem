import {
  fishNorm,
  plantNorm,
  shrimpNorm,
  mossNorm,
  type FishNorm,
  type PlantNorm,
  type ShrimpNorm,
  type MossNorm,
} from "@/lib/catalogue/normalize";
import { overlaps, type NumericRange } from "@/lib/range";

export type Style =
  | "low-tech"
  | "high-tech"
  | "shrimp"
  | "biotope-amazon"
  | "biotope-asian"
  | "community";

export type Experience = "beginner" | "intermediate" | "advanced";

export interface TankPlanRequest {
  tankL: number;
  style: Style;
  experience: Experience;
}

export interface PlanSuggestion<E> {
  entry: E;
  reasons: string[];
  /** Suggested quantity / qualifier (e.g. "10–12 individuals"). */
  qty?: string;
}

export interface TankPlan {
  request: TankPlanRequest;
  fish: {
    schooler?: PlanSuggestion<FishNorm>;
    centrepiece?: PlanSuggestion<FishNorm>;
    bottom?: PlanSuggestion<FishNorm>;
    algaeCrew?: PlanSuggestion<FishNorm>;
  };
  plants: {
    foreground?: PlanSuggestion<PlantNorm>;
    midground?: PlanSuggestion<PlantNorm>;
    background?: PlanSuggestion<PlantNorm>;
    floating?: PlanSuggestion<PlantNorm>;
  };
  shrimp?: PlanSuggestion<ShrimpNorm>;
  moss?: PlanSuggestion<MossNorm>;
  /** Anything that doesn't fit cleanly anywhere — surfaced as a warning. */
  warnings: string[];
}

const MAX_DIFFICULTY: Record<Experience, number> = {
  beginner: 2,
  intermediate: 3,
  advanced: 5,
};

const STYLE_LABEL: Record<Style, string> = {
  "low-tech": "Low-tech",
  "high-tech": "High-tech",
  shrimp: "Shrimp colony",
  "biotope-amazon": "Amazon biotope",
  "biotope-asian": "Southeast Asian biotope",
  community: "Community",
};

/** Friendly description of each style, for the page hero. */
export function styleLabel(s: Style): string {
  return STYLE_LABEL[s];
}

/* ─────────────────────────────  Filters  ──────────────────────────────── */

interface BaseScopeArgs {
  maxDifficulty: number;
  style: Style;
}

function tankFits(minTankL: number | null, userTankL: number): boolean {
  if (minTankL === null) return true;
  return minTankL <= userTankL;
}

function originMatches(origin: string, region: "amazon" | "asia"): boolean {
  const lower = origin.toLowerCase();
  if (region === "amazon") {
    return (
      lower.includes("amazon") ||
      lower.includes("orinoco") ||
      lower.includes("rio negro") ||
      lower.includes("guyana") ||
      lower.includes("suriname") ||
      lower.includes("madeira") ||
      lower.includes("brazil") ||
      lower.includes("peru") ||
      lower.includes("colombia") ||
      lower.includes("venezuela") ||
      lower.includes("south america")
    );
  }
  // asia / southeast asia
  return (
    lower.includes("asia") ||
    lower.includes("borneo") ||
    lower.includes("sumatra") ||
    lower.includes("java") ||
    lower.includes("malay") ||
    lower.includes("thailand") ||
    lower.includes("vietnam") ||
    lower.includes("sri lanka") ||
    lower.includes("india") ||
    lower.includes("china") ||
    lower.includes("myanmar") ||
    lower.includes("hong kong")
  );
}

function styleEligibleFish(f: FishNorm, style: Style): boolean {
  if (style === "shrimp") {
    // Shrimp tank — only fish that are documented as shrimp-safe with adults
    return f.shrimpSafe === "yes" || f.shrimpSafe === "adults-only";
  }
  if (style === "biotope-amazon") return originMatches(f.raw.origin, "amazon");
  if (style === "biotope-asian") return originMatches(f.raw.origin, "asia");
  return true;
}

function stylePlantBias(p: PlantNorm, style: Style): number {
  // Bonus score for matching style preferences
  let s = 0;
  if (style === "low-tech") {
    if (p.co2.includes("None") || p.co2.includes("Optional")) s += 30;
    if (p.co2.includes("Required")) s -= 50;
    if (p.difficulty <= 2) s += 10;
  }
  if (style === "high-tech") {
    if (p.co2.includes("Recommended") || p.co2.includes("Required")) s += 20;
    if (p.light.includes("High")) s += 10;
  }
  if (style === "biotope-amazon" && originMatches(p.raw.origin, "amazon")) s += 30;
  if (style === "biotope-asian" && originMatches(p.raw.origin, "asia")) s += 30;
  return s;
}

/* ───────────────────────────  Scoring helpers  ────────────────────────── */

interface ParamPreferences {
  tempRange?: NumericRange;
  phRange?: NumericRange;
  dghRange?: NumericRange;
}

function paramScore(
  candidateTemp: NumericRange | null,
  candidatePh: NumericRange | null,
  candidateDgh: NumericRange | null,
  prefs: ParamPreferences,
): number {
  let s = 0;
  if (prefs.tempRange && candidateTemp) {
    if (overlaps(candidateTemp, prefs.tempRange)) s += 15;
  }
  if (prefs.phRange && candidatePh) {
    if (overlaps(candidatePh, prefs.phRange)) s += 15;
  }
  if (prefs.dghRange && candidateDgh) {
    if (overlaps(candidateDgh, prefs.dghRange)) s += 15;
  }
  return s;
}

/* ────────────────────────────  Role pickers  ──────────────────────────── */

function pickFish(
  scope: BaseScopeArgs & { tankL: number },
  predicate: (f: FishNorm) => boolean,
  prefs: ParamPreferences,
): FishNorm | undefined {
  const eligible = fishNorm.filter(
    (f) =>
      tankFits(f.minTankL, scope.tankL) &&
      f.difficulty <= scope.maxDifficulty &&
      styleEligibleFish(f, scope.style) &&
      predicate(f),
  );
  if (eligible.length === 0) return undefined;
  return eligible
    .map((f) => ({
      f,
      score:
        paramScore(f.tempRange, f.phRange, f.dghRange, prefs) +
        // Smaller fish for smaller tanks score higher
        (f.minTankL !== null ? Math.max(0, 10 - (f.minTankL / scope.tankL) * 10) : 0) -
        f.difficulty,
    }))
    .sort((a, b) => b.score - a.score)[0].f;
}

function pickPlant(
  scope: BaseScopeArgs,
  predicate: (p: PlantNorm) => boolean,
  prefs: ParamPreferences,
): PlantNorm | undefined {
  const eligible = plantNorm.filter(
    (p) => p.difficulty <= scope.maxDifficulty && predicate(p),
  );
  if (eligible.length === 0) return undefined;
  return eligible
    .map((p) => ({
      p,
      score:
        paramScore(p.tempRange, p.phRange, p.dghRange, prefs) +
        stylePlantBias(p, scope.style) -
        p.difficulty * 2,
    }))
    .sort((a, b) => b.score - a.score)[0].p;
}

function pickShrimp(
  scope: BaseScopeArgs & { tankL: number },
  prefs: ParamPreferences,
): ShrimpNorm | undefined {
  const eligible = shrimpNorm.filter(
    (s) =>
      tankFits(s.minTankL, scope.tankL) &&
      s.difficulty <= scope.maxDifficulty,
  );
  if (eligible.length === 0) return undefined;
  // For shrimp-style tanks, prefer Neocaridina (easier)
  return eligible
    .map((s) => ({
      s,
      score:
        paramScore(s.tempRange, s.phRange, s.dghRange, prefs) +
        (scope.style === "shrimp" && s.lineage === "Neocaridina" ? 20 : 0) +
        (s.algaeEaterRating >= 4 ? 10 : 0) -
        s.difficulty * 3,
    }))
    .sort((a, b) => b.score - a.score)[0].s;
}

function pickMoss(
  scope: BaseScopeArgs,
  prefs: ParamPreferences,
): MossNorm | undefined {
  const eligible = mossNorm.filter(
    (m) => m.difficulty <= scope.maxDifficulty,
  );
  if (eligible.length === 0) return undefined;
  return eligible
    .map((m) => ({
      m,
      score:
        paramScore(m.tempRange, m.phRange, null, prefs) +
        (scope.style === "low-tech" &&
        (m.co2.includes("None") || m.co2.includes("Optional"))
          ? 10
          : 0) -
        m.difficulty * 2,
    }))
    .sort((a, b) => b.score - a.score)[0].m;
}

/* ─────────────────────────────  Main entry  ───────────────────────────── */

/** Friendly text explaining why this species fits this tank. */
function whyFish(
  f: FishNorm,
  scope: BaseScopeArgs & { tankL: number },
): string[] {
  const out: string[] = [];
  if (f.minTankL !== null) {
    out.push(
      f.minTankL <= scope.tankL * 0.5
        ? `Comfortable in ${scope.tankL} L`
        : `Min tank ${f.minTankL} L — fits your ${scope.tankL} L`,
    );
  }
  if (f.tempRange)
    out.push(`Temp ${f.tempRange.min}–${f.tempRange.max} °C`);
  if (scope.style === "biotope-amazon" && originMatches(f.raw.origin, "amazon"))
    out.push("Amazonian — fits biotope");
  if (scope.style === "biotope-asian" && originMatches(f.raw.origin, "asia"))
    out.push("Southeast Asian — fits biotope");
  if (scope.style === "shrimp" && f.shrimpSafe === "yes")
    out.push("Documented shrimp-safe");
  return out;
}

function whyPlant(p: PlantNorm, scope: BaseScopeArgs): string[] {
  const out: string[] = [];
  out.push(`${p.light[0]} light · CO₂ ${p.co2[0]}`);
  if (scope.style === "low-tech" && (p.co2.includes("None") || p.co2.includes("Optional")))
    out.push("No CO₂ injection required");
  if (scope.style === "high-tech" && p.co2.includes("Required"))
    out.push("Suits high-tech setup");
  if (
    (scope.style === "biotope-amazon" && originMatches(p.raw.origin, "amazon")) ||
    (scope.style === "biotope-asian" && originMatches(p.raw.origin, "asia"))
  )
    out.push("Native to biotope");
  return out;
}

function whyShrimp(s: ShrimpNorm): string[] {
  const out: string[] = [];
  out.push(`${s.lineage} · colony of ${s.raw.colonyMin}+`);
  if (s.algaeEaterRating >= 4)
    out.push(`Strong algae grazer (${s.algaeEaterRating}/5)`);
  if (s.difficulty <= 2) out.push("Beginner-friendly");
  return out;
}

function whyMoss(m: MossNorm): string[] {
  const out: string[] = [];
  out.push(m.raw.typicalUse);
  if (m.co2.includes("None") || m.co2.includes("Optional"))
    out.push("Thrives without CO₂");
  return out;
}

export function buildTankPlan(req: TankPlanRequest): TankPlan {
  const scope = {
    tankL: req.tankL,
    style: req.style,
    experience: req.experience,
    maxDifficulty: MAX_DIFFICULTY[req.experience],
  };

  // Style-driven parameter preferences — used to score candidates
  const prefs: ParamPreferences = {};
  if (req.style === "biotope-amazon")
    prefs.phRange = { min: 5.5, max: 7.0 };
  if (req.style === "biotope-asian")
    prefs.phRange = { min: 5.5, max: 7.5 };
  if (req.style === "shrimp")
    prefs.tempRange = { min: 20, max: 26 };

  /* Fish picks */
  const schooler = pickFish(
    scope,
    (f) =>
      f.schooling &&
      f.minGroupSize >= 6 &&
      f.waterColumn.includes("Mid"),
    prefs,
  );
  const centrepiece =
    req.tankL >= 100
      ? pickFish(
          scope,
          (f) =>
            !f.schooling ||
            f.raw.adultSize.includes("5") ||
            f.raw.adultSize.includes("6") ||
            f.raw.adultSize.includes("7"),
          prefs,
        )
      : undefined;
  const bottom = pickFish(
    scope,
    (f) => f.waterColumn.includes("Bottom"),
    prefs,
  );
  const algaeCrew = pickFish(
    scope,
    (f) =>
      f.diet === "Herbivore" ||
      f.raw.scientificName.toLowerCase().includes("otocinclus") ||
      f.raw.scientificName.toLowerCase().includes("ancistrus") ||
      f.raw.scientificName.toLowerCase().includes("crossocheilus"),
    prefs,
  );

  /* Plant picks */
  const foreground = pickPlant(
    scope,
    (p) =>
      p.position.includes("Foreground") &&
      !p.plantType.includes("Floating"),
    prefs,
  );
  const midground = pickPlant(
    scope,
    (p) =>
      p.position.includes("Midground") &&
      !p.plantType.includes("Floating"),
    prefs,
  );
  const background = pickPlant(
    scope,
    (p) =>
      p.position.includes("Background") &&
      !p.plantType.includes("Floating"),
    prefs,
  );
  const floating = pickPlant(
    scope,
    (p) => p.position.includes("Floating") || p.plantType.includes("Floating"),
    prefs,
  );

  const shrimp =
    req.tankL >= 20 &&
    req.style !== "biotope-amazon" /* shrimp don't pair with rams */
      ? pickShrimp(scope, prefs)
      : undefined;
  const moss = pickMoss(scope, prefs);

  /* Warnings */
  const warnings: string[] = [];
  if (req.tankL < 20)
    warnings.push("Tanks under 20 L are tricky for any community — consider a single species nano (chili rasbora OR cherry shrimp, not both).");
  if (req.experience === "beginner" && req.style === "high-tech")
    warnings.push("High-tech setups demand stable CO₂ and weekly dosing — many beginners do better with low-tech first.");
  if (req.style === "shrimp" && schooler && schooler.shrimpSafe !== "yes")
    warnings.push(`The picked schooler (${schooler.commonName}) may predate shrimp fry — consider keeping the shrimp tank species-only.`);

  return {
    request: req,
    fish: {
      schooler: schooler
        ? {
            entry: schooler,
            reasons: whyFish(schooler, scope),
            qty: `${schooler.minGroupSize}–${schooler.minGroupSize + 4} individuals`,
          }
        : undefined,
      centrepiece: centrepiece
        ? {
            entry: centrepiece,
            reasons: whyFish(centrepiece, scope),
            qty:
              centrepiece.minGroupSize > 1
                ? `Pair or trio`
                : `1–2 individuals`,
          }
        : undefined,
      bottom: bottom
        ? {
            entry: bottom,
            reasons: whyFish(bottom, scope),
            qty: bottom.schooling ? `${bottom.minGroupSize}+ individuals` : "1–3",
          }
        : undefined,
      algaeCrew: algaeCrew
        ? {
            entry: algaeCrew,
            reasons: whyFish(algaeCrew, scope),
            qty: algaeCrew.schooling ? `${algaeCrew.minGroupSize}+` : "2–4",
          }
        : undefined,
    },
    plants: {
      foreground: foreground
        ? { entry: foreground, reasons: whyPlant(foreground, scope) }
        : undefined,
      midground: midground
        ? { entry: midground, reasons: whyPlant(midground, scope) }
        : undefined,
      background: background
        ? { entry: background, reasons: whyPlant(background, scope) }
        : undefined,
      floating: floating
        ? { entry: floating, reasons: whyPlant(floating, scope) }
        : undefined,
    },
    shrimp: shrimp
      ? {
          entry: shrimp,
          reasons: whyShrimp(shrimp),
          qty: `${shrimp.raw.colonyMin}+ to start`,
        }
      : undefined,
    moss: moss
      ? { entry: moss, reasons: whyMoss(moss) }
      : undefined,
    warnings,
  };
}
