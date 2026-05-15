import { parseRange, type NumericRange } from "@/lib/range";
import {
  fishNorm,
  plantNorm,
  shrimpNorm,
  mossNorm,
  type FishNorm,
  type PlantNorm,
  type ShrimpNorm,
  type MossNorm,
  type Light,
  type CO2,
} from "@/lib/catalogue/normalize";
import {
  classifyFlow,
  findTankStandard,
  nearestTankStandard,
  verdictForLoad,
  type FlowVerdict,
  type StockingVerdict,
} from "@/lib/catalogue/tank-standards";
import type { CatalogueEntry } from "@/types/catalogue";

const LIGHT_RANK: Record<Light, number> = { Low: 1, Medium: 2, High: 3 };
const CO2_RANK: Record<CO2, number> = {
  None: 0,
  Optional: 1,
  Recommended: 2,
  Required: 3,
};

export interface TankSelection {
  /** `${category}:${slug}` or `${category}:${slug}:${count}` ids in
   *  URL order. The optional count overrides the species' default
   *  stocking (minGroupSize for fish, colonyMin for shrimp). */
  ids: string[];
  /** User-supplied tank size in litres, optional. */
  tankL?: number;
  /** User-supplied filter flow in litres per hour, optional. */
  filterLph?: number;
}

export interface TankSelectionResolved {
  fish: FishNorm[];
  plants: PlantNorm[];
  shrimp: ShrimpNorm[];
  mosses: MossNorm[];
  /** All selected entries in URL order. */
  all: ReadonlyArray<{
    category: CatalogueEntry["category"];
    slug: string;
    entry: CatalogueEntry;
    /** Resolved count — user override or default (minGroupSize /
     *  colonyMin / 1 for plants & mosses). */
    count: number;
    /** Default count this species would use if the user hasn't
     *  set one — surfaced so the UI can show "default: 10". */
    defaultCount: number;
    /** True if the user explicitly set the count via URL. */
    hasCustomCount: boolean;
  }>;
  /** Map of `${category}:${slug}` → resolved count, for quick lookups. */
  counts: Record<string, number>;
}

export interface TankRequirements {
  /** Largest minimum tank size among selected species. */
  minTankL: number | null;
  /** Intersection of every species' temperature range. Null if conflict. */
  temp: NumericRange | null;
  /** Intersection of every species' pH range. Null if conflict. */
  ph: NumericRange | null;
  /** Intersection of every species' dGH range. Null if conflict. */
  dgh: NumericRange | null;
  /** Highest light demand across selected plants + mosses. */
  light: Light | null;
  /** Highest CO₂ demand across selected plants + mosses. */
  co2: CO2 | null;
  /** Distinct substrate notes the selected plants ask for. */
  substrateNotes: string[];
  /** Aggregated equipment recommendations. */
  equipmentNotes: string[];
}

export interface StockingItem {
  /** Per-species line in the breakdown, e.g. "10 × Neon Tetra (40 cm)". */
  commonName: string;
  category: "fish" | "shrimp";
  count: number;
  adultSizeCm: number;
  contributionCm: number;
}

export interface StockingReport {
  /** Sum of adult fish lengths plus shrimp contribution, in cm. */
  bioloadCm: number;
  /** Bioload divided by tank volume, cm per litre. */
  loadPerLitre: number | null;
  /** Bucket verdict — only populated when tankL is provided. */
  verdict: StockingVerdict | null;
  /** Headroom in cm before tipping into the next band. */
  headroomCm: number | null;
  /** Per-species contribution, so the user can see what the planner
   *  is assuming (group size × adult length). Sorted by contribution
   *  descending. */
  breakdown: StockingItem[];
  /** When the verdict is "tooSmall", these are the species whose
   *  minTankL exceeds the user's tank size — so the UI can name
   *  them directly. */
  oversizedSpecies: ReadonlyArray<{ commonName: string; minTankL: number }>;
  /** The required tank size = max minTankL across the selection.
   *  Populated whenever we have at least one species with a
   *  minTankL value, regardless of tank size. */
  requiredTankL: number | null;
}

export interface FilterReport {
  /** Filter flow rate the user picked, l/h. Null if not set. */
  filterLph: number | null;
  /** Recommended [min, max] range for the chosen tank volume. */
  recommendedRange: [number, number] | null;
  /** Verdict from classifyFlow — only populated when both tankL and
   *  filterLph are provided. */
  verdict: FlowVerdict | null;
}

export type WaterColumnZone = "Top" | "Mid" | "Bottom";

export interface WaterColumnSpecies {
  slug: string;
  commonName: string;
  /** Resolved stocking count for the species. */
  count: number;
}

export interface WaterColumnReport {
  zones: Record<
    WaterColumnZone,
    {
      /** Species that occupy this zone (a species can be in multiple). */
      species: WaterColumnSpecies[];
      /** Sum of stocked fish in this zone. */
      fishCount: number;
    }
  >;
  /** Zones with no fish. */
  missingZones: WaterColumnZone[];
  /** Zone with the most stocked fish; null when nothing is stocked. */
  dominantZone: WaterColumnZone | null;
  /** Share of the most-occupied zone, 0–1. */
  dominantShare: number;
  /** True when every zone has at least one species and no zone holds
   *  more than 65 % of total fish. */
  isBalanced: boolean;
}

export type PlantFitVerdict =
  | "fits"        // max height ≤ 0.7× water column
  | "borderline"  // 0.7×–1.0× — will press against the surface
  | "overflow";   // > water column — won't physically fit submerged

export interface PlantFitItem {
  commonName: string;
  slug: string;
  category: "plants" | "mosses";
  count: number;
  maxHeightCm: number | null;
  /** Estimated total floor footprint, count × per-specimen spread. */
  footprintCm2: number;
  /** True for floating plants — their coverage applies to the
   *  surface, not the floor. */
  isFloating: boolean;
  verdict: PlantFitVerdict | null;
}

export interface PlantFitReport {
  items: PlantFitItem[];
  /** Sum of footprintCm2 for non-floating plants. */
  floorCoverageCm2: number;
  /** Sum of footprintCm2 for floating plants. */
  surfaceCoverageCm2: number;
  /** Tank floor area when known; cm². */
  tankFloorAreaCm2: number | null;
  /** Tank water-column depth when known; cm. */
  tankHeightCm: number | null;
  /** floorCoverageCm2 / tankFloorAreaCm2 — null when either is missing. */
  floorCoveragePct: number | null;
  /** surfaceCoverageCm2 / tankFloorAreaCm2. */
  surfaceCoveragePct: number | null;
}

export interface TankWarning {
  severity: "danger" | "warn" | "info";
  title: string;
  body: string;
}

export interface TankBuilderResult {
  selection: TankSelectionResolved;
  requirements: TankRequirements;
  stocking: StockingReport;
  filter: FilterReport;
  plantFit: PlantFitReport;
  waterColumn: WaterColumnReport;
  warnings: TankWarning[];
}

/* ─────────────────────────────  Resolver  ──────────────────────────────── */

/** Parse one id token. Accepts `category:slug` or
 *  `category:slug:count`. Returns null for malformed tokens. */
function parseIdToken(raw: string): {
  category: string;
  slug: string;
  count: number | null;
} | null {
  const parts = raw.split(":");
  if (parts.length < 2) return null;
  const [category, slug, countStr] = parts;
  if (!category || !slug) return null;
  if (countStr === undefined) return { category, slug, count: null };
  const n = Number(countStr);
  if (Number.isNaN(n) || n < 1) return { category, slug, count: null };
  return { category, slug, count: Math.floor(n) };
}

/** Default stocking count for a species when the user hasn't picked
 *  one — schooling fish at their school minimum, shrimp at colony
 *  minimum, single-fish at 1, plants & mosses always 1. */
function defaultCountFor(
  category: string,
  fish?: FishNorm,
  shrimp?: ShrimpNorm,
): number {
  if (category === "fish" && fish) return Math.max(1, fish.minGroupSize);
  if (category === "shrimp" && shrimp)
    return Math.max(1, shrimp.raw.colonyMin);
  return 1;
}

export function resolveSelection(ids: string[]): TankSelectionResolved {
  const fish: FishNorm[] = [];
  const plants: PlantNorm[] = [];
  const shrimp: ShrimpNorm[] = [];
  const mosses: MossNorm[] = [];
  const all: Array<{
    category: CatalogueEntry["category"];
    slug: string;
    entry: CatalogueEntry;
    count: number;
    defaultCount: number;
    hasCustomCount: boolean;
  }> = [];
  const counts: Record<string, number> = {};

  for (const id of ids) {
    const parsed = parseIdToken(id);
    if (!parsed) continue;
    const { category, slug, count: userCount } = parsed;

    if (category === "fish") {
      const hit = fishNorm.find((f) => f.slug === slug);
      if (hit && !all.some((a) => a.category === "fish" && a.slug === slug)) {
        const def = defaultCountFor("fish", hit);
        const count = userCount ?? def;
        fish.push(hit);
        all.push({
          category: "fish",
          slug,
          entry: hit.raw,
          count,
          defaultCount: def,
          hasCustomCount: userCount !== null,
        });
        counts[`fish:${slug}`] = count;
      }
    } else if (category === "plants") {
      const hit = plantNorm.find((p) => p.slug === slug);
      if (hit && !all.some((a) => a.category === "plants" && a.slug === slug)) {
        const count = userCount ?? 1;
        plants.push(hit);
        all.push({
          category: "plants",
          slug,
          entry: hit.raw,
          count,
          defaultCount: 1,
          hasCustomCount: userCount !== null,
        });
        counts[`plants:${slug}`] = count;
      }
    } else if (category === "shrimp") {
      const hit = shrimpNorm.find((s) => s.slug === slug);
      if (hit && !all.some((a) => a.category === "shrimp" && a.slug === slug)) {
        const def = defaultCountFor("shrimp", undefined, hit);
        const count = userCount ?? def;
        shrimp.push(hit);
        all.push({
          category: "shrimp",
          slug,
          entry: hit.raw,
          count,
          defaultCount: def,
          hasCustomCount: userCount !== null,
        });
        counts[`shrimp:${slug}`] = count;
      }
    } else if (category === "mosses") {
      const hit = mossNorm.find((m) => m.slug === slug);
      if (hit && !all.some((a) => a.category === "mosses" && a.slug === slug)) {
        const count = userCount ?? 1;
        mosses.push(hit);
        all.push({
          category: "mosses",
          slug,
          entry: hit.raw,
          count,
          defaultCount: 1,
          hasCustomCount: userCount !== null,
        });
        counts[`mosses:${slug}`] = count;
      }
    }
  }

  return { fish, plants, shrimp, mosses, all, counts };
}

/* ────────────────────────────  Computations  ───────────────────────────── */

function intersect(
  ranges: ReadonlyArray<NumericRange | null>,
): NumericRange | null {
  const valid = ranges.filter((r): r is NumericRange => r !== null);
  if (valid.length === 0) return null;
  const min = Math.max(...valid.map((r) => r.min));
  const max = Math.min(...valid.map((r) => r.max));
  if (min > max) return null;
  return { min, max };
}

/**
 * Light demand for the tank = the max of each species's MINIMUM
 * requirement.
 *
 * `parseLight("Low to Medium")` expands to `["Low", "Medium"]`
 * meaning the plant *tolerates* that range. Its actual minimum
 * requirement is the LOW end. The tank must satisfy the
 * most-demanding plant's minimum — anyone whose minimum is met has
 * no problem with extra light.
 *
 * The previous version took max over the union of all tolerated
 * levels, which over-reported (e.g. Anubias alone reported "Medium
 * light" when it grows fine at Low).
 */
function highestLight(
  pieces: ReadonlyArray<{ light: Light[] }>,
): Light | null {
  let maxRank = -1;
  let result: Light | null = null;
  for (const p of pieces) {
    if (p.light.length === 0) continue;
    let minRank = Infinity;
    let minLight: Light | null = null;
    for (const l of p.light) {
      if (LIGHT_RANK[l] < minRank) {
        minRank = LIGHT_RANK[l];
        minLight = l;
      }
    }
    if (minLight !== null && minRank > maxRank) {
      maxRank = minRank;
      result = minLight;
    }
  }
  return result;
}

/**
 * CO₂ demand for the tank — same shape as `highestLight`. Each
 * species's minimum CO₂ need is the lowest token in its tolerance
 * range; the tank needs the maximum of those minimums.
 */
function highestCO2(pieces: ReadonlyArray<{ co2: CO2[] }>): CO2 | null {
  let maxRank = -1;
  let result: CO2 | null = null;
  for (const p of pieces) {
    if (p.co2.length === 0) continue;
    let minRank = Infinity;
    let minCo2: CO2 | null = null;
    for (const l of p.co2) {
      if (CO2_RANK[l] < minRank) {
        minRank = CO2_RANK[l];
        minCo2 = l;
      }
    }
    if (minCo2 !== null && minRank > maxRank) {
      maxRank = minRank;
      result = minCo2;
    }
  }
  return result;
}

function substrateNotes(plants: PlantNorm[]): string[] {
  const out = new Set<string>();
  for (const p of plants) {
    const note = p.raw.substrate;
    if (!note) continue;
    out.add(note.replace(/—/g, "—").trim());
  }
  return Array.from(out);
}

function equipmentNotes(
  plants: PlantNorm[],
  mosses: MossNorm[],
  fish: FishNorm[],
  shrimp: ShrimpNorm[],
  light: Light | null,
  co2: CO2 | null,
): string[] {
  const out = new Set<string>();
  if (co2 === "Required" || co2 === "Recommended") {
    out.add(
      `CO₂ injection ${co2.toLowerCase()} — pressurised system + diffuser + drop checker.`,
    );
  } else if (co2 === "Optional" && plants.length > 0) {
    out.add(
      "CO₂ is optional — adding it accelerates growth but isn't required.",
    );
  }
  if (light === "High") {
    out.add(
      "High-output light (60+ PAR at substrate) for the most demanding plants.",
    );
  } else if (light === "Medium") {
    out.add("Medium-output light (30–60 PAR at substrate).");
  }
  // Heavy root feeders?
  if (plants.some((p) => /root|nutrient-rich|sword|sagittaria|crypt/i.test(p.raw.substrate))) {
    out.add(
      "Nutrient-rich substrate or root tabs for heavy root feeders (swords, crypts, sagittaria).",
    );
  }
  // Caridina-class shrimp?
  if (
    shrimp.some((s) => s.lineage === "Caridina") &&
    shrimp.some((s) => s.lineage !== "Caridina")
  ) {
    out.add(
      "Caridina + Neocaridina together is risky — they want different water; keep them separate.",
    );
  } else if (shrimp.some((s) => s.lineage === "Caridina")) {
    out.add(
      "Caridina shrimp prefer active soil + RO water remineralised with a low-TDS salt.",
    );
  }
  // Otocinclus / SAE need a mature tank
  if (fish.some((f) => /otocinclus|crossocheilus/i.test(f.raw.scientificName))) {
    out.add(
      "Add Otocinclus / Siamese Algae Eater only after the tank has run 8–10 weeks with visible biofilm.",
    );
  }
  // Mosses sometimes attached
  if (mosses.length > 0) {
    out.add(
      "Mosses attach to wood, stone, or mesh — tie or super-glue, never bury.",
    );
  }
  return Array.from(out);
}

/* ─────────────────────────────  Warnings  ──────────────────────────────── */

function paramWarnings(
  selection: TankSelectionResolved,
  req: TankRequirements,
): TankWarning[] {
  const out: TankWarning[] = [];
  // Temperature conflict
  if (selection.all.length >= 2) {
    const temps = selection.all
      .map((a) =>
        "tempRange" in a.entry
          ? parseRange(a.entry.tempRange as string)
          : null,
      )
      .filter((r): r is NumericRange => r !== null);
    if (temps.length >= 2 && req.temp === null) {
      out.push({
        severity: "danger",
        title: "Temperature mismatch",
        body: "At least one species in this tank wants a temperature range that doesn't overlap the others. Pick species that share a temperature window, or remove the outlier.",
      });
    }
    // pH conflict
    const phs = selection.all
      .map((a) =>
        "phRange" in a.entry
          ? parseRange(a.entry.phRange as string)
          : null,
      )
      .filter((r): r is NumericRange => r !== null);
    if (phs.length >= 2 && req.ph === null) {
      out.push({
        severity: "danger",
        title: "pH mismatch",
        body: "The selected species' pH ranges don't overlap. Some prefer soft acidic blackwater, others alkaline — one tank can't serve both.",
      });
    }
    // dGH conflict
    const dghs = selection.all
      .map((a) =>
        "dghRange" in a.entry && (a.entry as { dghRange?: string }).dghRange
          ? parseRange((a.entry as { dghRange: string }).dghRange)
          : null,
      )
      .filter((r): r is NumericRange => r !== null);
    if (dghs.length >= 2 && req.dgh === null) {
      out.push({
        severity: "danger",
        title: "Hardness mismatch",
        body: "The selected species can't share a hardness window. Soft-water species (CRS, cardinals) and hard-water species (livebearers, vals) need different tanks.",
      });
    }
  }

  // Tight windows
  if (req.temp && req.temp.max - req.temp.min < 1) {
    out.push({
      severity: "warn",
      title: "Tight temperature window",
      body: `The overlap is only ${req.temp.min}–${req.temp.max} °C. Heater stability matters more than usual; consider an external controller.`,
    });
  }
  if (req.ph && req.ph.max - req.ph.min < 0.5) {
    out.push({
      severity: "warn",
      title: "Narrow pH overlap",
      body: `Target pH is ${req.ph.min}–${req.ph.max}. Test weekly; use buffered substrate or remineraliser to keep it stable.`,
    });
  }

  return out;
}

function bioWarnings(
  selection: TankSelectionResolved,
  tankL: number | undefined,
  req: TankRequirements,
): TankWarning[] {
  const out: TankWarning[] = [];

  // Shrimp + predatory fish?
  if (selection.shrimp.length > 0) {
    const predators = selection.fish.filter((f) => f.shrimpSafe === "no");
    if (predators.length > 0) {
      out.push({
        severity: "danger",
        title: "Predator and shrimp together",
        body: `${predators
          .map((p) => p.commonName)
          .join(
            ", ",
          )} will hunt shrimp. Either keep the shrimp in a separate tank or remove the predators.`,
      });
    }
    const semiSafe = selection.fish.filter(
      (f) => f.shrimpSafe === "adults-only",
    );
    if (semiSafe.length > 0) {
      out.push({
        severity: "warn",
        title: "Shrimplets are at risk",
        body: `${semiSafe
          .map((p) => p.commonName)
          .join(
            ", ",
          )} are documented to eat shrimp fry. Adult shrimp usually survive but the colony won't grow.`,
      });
    }
  }

  // Plant-unsafe fish?
  if (selection.plants.length > 0) {
    const plantUnsafe = selection.fish.filter((f) => !f.plantSafe);
    if (plantUnsafe.length > 0) {
      out.push({
        severity: "warn",
        title: "Plant-shredding fish",
        body: `${plantUnsafe
          .map((p) => p.commonName)
          .join(
            ", ",
          )} are known to nip or uproot plants. Choose tougher plants (Anubias, Java fern) or remove the fish.`,
      });
    }
  }

  // Schooling fish reminders — warn when stocked below the species'
  // minGroupSize, otherwise stay silent.
  for (const f of selection.fish) {
    if (!f.schooling) continue;
    const count = selection.counts[`fish:${f.slug}`] ?? f.minGroupSize;
    if (count < f.minGroupSize) {
      out.push({
        severity: "warn",
        title: `${f.commonName} under-grouped`,
        body: `You've planned for ${count} ${f.commonName.toLowerCase()}${count === 1 ? "" : "s"} — they need at least ${f.minGroupSize} to feel safe and shoal naturally. Below that they're stressed and lose colour.`,
      });
    }
  }

  // Tank size check
  if (tankL !== undefined && req.minTankL !== null && tankL < req.minTankL) {
    out.push({
      severity: "danger",
      title: `Tank too small (${tankL} L)`,
      body: `The largest minimum-tank requirement among your selection is ${req.minTankL} L. Either choose a larger tank or remove the species that needs the most room.`,
    });
  }

  // Difficulty surfacing
  const advanced = selection.all.filter(
    ({ entry }) => entry.difficulty >= 4,
  );
  if (advanced.length > 0) {
    out.push({
      severity: "info",
      title: "Demanding species present",
      body: `${advanced
        .map((a) => a.entry.commonName)
        .join(
          ", ",
        )} are difficulty 4+. Stable parameters and weekly maintenance are non-negotiable.`,
    });
  }

  // Caridina + Neocaridina conflict (parameter mismatch covered separately,
  // but call it out specifically because the labels overlap visually)
  const cari = selection.shrimp.filter((s) => s.lineage === "Caridina").length;
  const neo = selection.shrimp.filter((s) => s.lineage === "Neocaridina").length;
  if (cari > 0 && neo > 0) {
    out.push({
      severity: "warn",
      title: "Caridina + Neocaridina mix",
      body: "These lineages want fundamentally different water (Caridina: soft, low TDS, low pH; Neocaridina: harder, higher pH). Keep them in separate tanks.",
    });
  }

  // Banned plant call-out
  for (const p of selection.plants) {
    if (
      p.raw.careSummary.toLowerCase().includes("banned") ||
      p.raw.careSummary.toLowerCase().includes("invasive")
    ) {
      out.push({
        severity: "info",
        title: `${p.commonName} is regulated`,
        body: `${p.commonName} is banned or listed as invasive in several US states and parts of Australia / South Africa. Check local rules before sourcing.`,
      });
    }
  }

  return out;
}

/* ────────────────────────────  Bioload / filter  ──────────────────────── */

/**
 * Cumulative "cm of adult fish" load for the selection plus a
 * per-species breakdown so the UI can show what the planner is
 * assuming (group size × adult length).
 *
 * Assumptions:
 *   • Fish count at the species' minGroupSize. This is the minimum
 *     responsible stocking for schoolers; non-schoolers default to 1.
 *   • Each fish contributes its adult length max (worst-case planning).
 *   • Shrimp contribute at ~⅕ a comparable-length fish, scaled to the
 *     species' colony minimum.
 */
function computeBioload(selection: TankSelectionResolved): {
  cm: number;
  breakdown: StockingItem[];
} {
  let total = 0;
  const breakdown: StockingItem[] = [];

  for (const f of selection.fish) {
    const range = parseRange(f.raw.adultSize);
    const adult = range ? range.max : 0;
    const count = selection.counts[`fish:${f.slug}`] ?? f.minGroupSize;
    const contribution = adult * count;
    if (contribution > 0) {
      total += contribution;
      breakdown.push({
        commonName: f.commonName,
        category: "fish",
        count,
        adultSizeCm: adult,
        contributionCm: Number(contribution.toFixed(1)),
      });
    }
  }

  for (const s of selection.shrimp) {
    const range = parseRange(s.raw.adultSize);
    const adult = range ? range.max : 0;
    const count = selection.counts[`shrimp:${s.slug}`] ?? s.raw.colonyMin;
    // Shrimp produce far less waste per cm of body — scale to ⅕.
    const contribution = adult * count * 0.2;
    if (contribution > 0) {
      total += contribution;
      breakdown.push({
        commonName: s.commonName,
        category: "shrimp",
        count,
        adultSizeCm: adult,
        contributionCm: Number(contribution.toFixed(1)),
      });
    }
  }

  breakdown.sort((a, b) => b.contributionCm - a.contributionCm);
  return { cm: Number(total.toFixed(1)), breakdown };
}

/** Collect every species in the selection whose minTankL is set,
 *  so we can compute the dimensional requirement and surface the
 *  offending species names when the tank is too small. */
function collectMinTanks(
  selection: TankSelectionResolved,
): Array<{ commonName: string; minTankL: number }> {
  const out: Array<{ commonName: string; minTankL: number }> = [];
  for (const f of selection.fish) {
    if (f.minTankL !== null) {
      out.push({ commonName: f.commonName, minTankL: f.minTankL });
    }
  }
  for (const s of selection.shrimp) {
    if (s.minTankL !== null) {
      out.push({ commonName: s.commonName, minTankL: s.minTankL });
    }
  }
  return out;
}

function buildStockingReport(
  selection: TankSelectionResolved,
  tankL: number | undefined,
): StockingReport {
  const { cm: bioloadCm, breakdown } = computeBioload(selection);
  const minTanks = collectMinTanks(selection);
  const requiredTankL =
    minTanks.length > 0
      ? Math.max(...minTanks.map((m) => m.minTankL))
      : null;

  if (tankL === undefined || tankL <= 0) {
    return {
      bioloadCm,
      loadPerLitre: null,
      verdict: null,
      headroomCm: null,
      breakdown,
      oversizedSpecies: [],
      requiredTankL,
    };
  }

  // Dimensional check takes precedence over the bioload bands —
  // if any selected species needs a bigger tank than the user has
  // picked, the stocking gauge reports "tooSmall" regardless of
  // how light the bioload looks.
  const oversizedSpecies = minTanks
    .filter((m) => m.minTankL > tankL)
    .sort((a, b) => b.minTankL - a.minTankL);

  const loadPerLitre = Number((bioloadCm / tankL).toFixed(2));

  if (oversizedSpecies.length > 0) {
    return {
      bioloadCm,
      loadPerLitre,
      verdict: "tooSmall",
      headroomCm: null,
      breakdown,
      oversizedSpecies,
      requiredTankL,
    };
  }

  const verdict = verdictForLoad(loadPerLitre);
  // Headroom = cm of fish you can still add before "full" (1.0 cm/L).
  const headroomCm = Math.max(0, Number((tankL * 1.0 - bioloadCm).toFixed(1)));
  return {
    bioloadCm,
    loadPerLitre,
    verdict,
    headroomCm,
    breakdown,
    oversizedSpecies: [],
    requiredTankL,
  };
}

function buildFilterReport(
  tankL: number | undefined,
  filterLph: number | undefined,
): FilterReport {
  if (tankL === undefined) {
    return {
      filterLph: filterLph ?? null,
      recommendedRange: null,
      verdict: null,
    };
  }
  if (filterLph === undefined) {
    // We can still surface the recommendation even without a flow
    // value, so the UI can prefill the input.
    const v = classifyFlow(tankL, 0);
    if (v.kind === "starve") {
      return {
        filterLph: null,
        recommendedRange: v.recommended,
        verdict: null,
      };
    }
    return { filterLph: null, recommendedRange: null, verdict: null };
  }
  const verdict = classifyFlow(tankL, filterLph);
  const recommendedRange =
    verdict.kind === "ok"
      ? null
      : (verdict.recommended as [number, number]);
  return { filterLph, recommendedRange, verdict };
}

function filterAndStockingWarnings(
  selection: TankSelectionResolved,
  stocking: StockingReport,
  filter: FilterReport,
  tankL: number | undefined,
): TankWarning[] {
  const out: TankWarning[] = [];

  // Stocking verdict
  if (stocking.verdict === "overstocked" && tankL !== undefined) {
    out.push({
      severity: "danger",
      title: "Overstocked",
      body: `Combined adult bioload is ~${stocking.bioloadCm} cm of fish in a ${tankL} L tank (${stocking.loadPerLitre} cm/L). That's above the 1.5 cm/L ceiling — expect ammonia spikes and aggression. Drop a group or upsize the tank.`,
    });
  } else if (stocking.verdict === "full" && tankL !== undefined) {
    out.push({
      severity: "warn",
      title: "Approaching capacity",
      body: `~${stocking.bioloadCm} cm of fish in a ${tankL} L tank (${stocking.loadPerLitre} cm/L). Comfortable, but no headroom for a new group without water-change discipline.`,
    });
  } else if (
    stocking.verdict === "understocked" &&
    selection.fish.length > 0 &&
    tankL !== undefined
  ) {
    out.push({
      severity: "info",
      title: "Room for more",
      body: `~${stocking.headroomCm} cm of fish capacity available before this tank is full. Consider a second schooling group or a small bottom team.`,
    });
  }

  // Filter verdict
  if (filter.verdict && tankL !== undefined) {
    const v = filter.verdict;
    if (v.kind === "blast") {
      out.push({
        severity: "danger",
        title: `Filter too strong (${v.turnover.toFixed(1)}× turnover)`,
        body: `A ${filter.filterLph} L/h filter on a ${tankL} L tank will blast inhabitants around. Recommended range for this tank: ${v.recommended[0]}–${v.recommended[1]} L/h. Either step down to a smaller filter or fit a flow diffuser / spray bar.`,
      });
    } else if (v.kind === "starve") {
      out.push({
        severity: "danger",
        title: `Filter undersized (${v.turnover.toFixed(1)}× turnover)`,
        body: `${filter.filterLph} L/h is too little for a ${tankL} L tank — biofilter starves and detritus settles. Aim for ${v.recommended[0]}–${v.recommended[1]} L/h.`,
      });
    } else if (v.kind === "high") {
      // Hillstream / strong-flow species are happy here.
      const flowFriendly = selection.fish.some((f) =>
        f.flow.includes("High") || f.flow.includes("Very High"),
      );
      if (!flowFriendly) {
        out.push({
          severity: "warn",
          title: `Filter at the top of range (${v.turnover.toFixed(1)}× turnover)`,
          body: `Recommended range is ${v.recommended[0]}–${v.recommended[1]} L/h. A spray bar or flow deflector will help keep the surface action without stressing slow swimmers.`,
        });
      }
    } else if (v.kind === "low") {
      out.push({
        severity: "info",
        title: `Filter on the gentle side (${v.turnover.toFixed(1)}× turnover)`,
        body: `Recommended range is ${v.recommended[0]}–${v.recommended[1]} L/h. Light filtration suits shrimp and slow swimmers; ramp up if you stock heavier in future.`,
      });
    }
  }

  return out;
}

/* ─────────────────────────────  Plant fit  ───────────────────────────── */

/**
 * Typical per-specimen floor footprint, cm². Looked up from the
 * freeform `plantType` string (e.g. "Rhizome / Epiphyte") via
 * keyword matching. Numbers are rough planting estimates from
 * aquascaping experience — the user can sanity-check by eye in
 * the planner UI.
 */
function plantFootprintFor(plantType: string): number {
  const t = plantType.toLowerCase();
  if (t.includes("floating")) return 80;       // 9 cm round leaves
  if (t.includes("carpet")) return 100;        // per pot — spreads further
  if (t.includes("grass")) return 150;         // val / sag / hairgrass
  if (t.includes("rhizome") || t.includes("epiphyte")) return 250;
  if (t.includes("bulb")) return 400;          // tiger lotus, aponogeton
  if (t.includes("rosette")) return 400;       // sword / crypt
  if (t.includes("stem")) return 50;           // per bunch of 5 stems
  return 100;
}

function buildPlantFitReport(
  selection: TankSelectionResolved,
  tankL: number | undefined,
): PlantFitReport {
  const std =
    tankL !== undefined
      ? (findTankStandard(tankL) ?? nearestTankStandard(tankL))
      : null;
  const tankHeightCm = std?.internalHeightCm ?? null;
  const tankFloorAreaCm2 = std?.floorAreaCm2 ?? null;

  const items: PlantFitItem[] = [];
  let floor = 0;
  let surface = 0;

  for (const p of selection.plants) {
    const count = selection.counts[`plants:${p.slug}`] ?? 1;
    const footprint = plantFootprintFor(p.raw.plantType) * count;
    const isFloating = p.raw.plantType.toLowerCase().includes("floating");
    const max = p.maxHeightCm;

    let verdict: PlantFitVerdict | null = null;
    if (tankHeightCm !== null && max !== null && !isFloating) {
      if (max > tankHeightCm) verdict = "overflow";
      else if (max > tankHeightCm * 0.7) verdict = "borderline";
      else verdict = "fits";
    }

    if (isFloating) surface += footprint;
    else floor += footprint;

    items.push({
      commonName: p.commonName,
      slug: p.slug,
      category: "plants",
      count,
      maxHeightCm: max,
      footprintCm2: footprint,
      isFloating,
      verdict,
    });
  }

  // Mosses contribute small footprints — attached to hardscape and
  // grow as patches. Height is irrelevant (they sit where you put
  // them) so verdict stays null.
  for (const m of selection.mosses) {
    const count = selection.counts[`mosses:${m.slug}`] ?? 1;
    const footprint = 60 * count;
    floor += footprint;
    items.push({
      commonName: m.commonName,
      slug: m.slug,
      category: "mosses",
      count,
      maxHeightCm: null,
      footprintCm2: footprint,
      isFloating: false,
      verdict: null,
    });
  }

  const floorCoveragePct =
    tankFloorAreaCm2 !== null && tankFloorAreaCm2 > 0
      ? Number((floor / tankFloorAreaCm2).toFixed(2))
      : null;
  const surfaceCoveragePct =
    tankFloorAreaCm2 !== null && tankFloorAreaCm2 > 0
      ? Number((surface / tankFloorAreaCm2).toFixed(2))
      : null;

  return {
    items,
    floorCoverageCm2: floor,
    surfaceCoverageCm2: surface,
    tankFloorAreaCm2,
    tankHeightCm,
    floorCoveragePct,
    surfaceCoveragePct,
  };
}

function plantFitWarnings(
  report: PlantFitReport,
  tankL: number | undefined,
): TankWarning[] {
  const out: TankWarning[] = [];

  // Per-plant height overflow / borderline
  const overflow = report.items.filter((i) => i.verdict === "overflow");
  const borderline = report.items.filter((i) => i.verdict === "borderline");

  if (overflow.length > 0 && report.tankHeightCm !== null) {
    out.push({
      severity: "danger",
      title:
        overflow.length === 1
          ? `${overflow[0].commonName} is too tall for this tank`
          : `${overflow.length} plants will outgrow this tank`,
      body: `Tank water column is ~${report.tankHeightCm} cm. ${overflow
        .map((o) => `${o.commonName} grows to ${o.maxHeightCm} cm`)
        .join("; ")}. These plants will press against the surface and need constant trimming, or choose shorter alternatives (carpet / rosette).`,
    });
  }

  if (borderline.length > 0 && report.tankHeightCm !== null) {
    out.push({
      severity: "info",
      title: `Background plants will fill the tank`,
      body: `${borderline
        .map((b) => `${b.commonName} (${b.maxHeightCm} cm)`)
        .join(", ")} grow tall enough to fill most of your ${report.tankHeightCm} cm water column. Plan for regular trimming.`,
    });
  }

  // Floor coverage — surface a tip when planting density is heavy
  if (
    report.floorCoveragePct !== null &&
    report.tankFloorAreaCm2 !== null &&
    tankL !== undefined
  ) {
    if (report.floorCoveragePct > 1.1) {
      out.push({
        severity: "warn",
        title: "Tank floor is over-planted",
        body: `Plants would cover ~${Math.round(
          report.floorCoveragePct * 100,
        )} % of the tank floor (${report.floorCoverageCm2} cm² in ${report.tankFloorAreaCm2} cm²). Drop counts or pick smaller-footprint species — over-dense plantings shade each other and trap detritus.`,
      });
    } else if (report.floorCoveragePct < 0.2 && report.items.length > 0) {
      out.push({
        severity: "info",
        title: "Room for more plants",
        body: `Plants cover ~${Math.round(
          report.floorCoveragePct * 100,
        )} % of the tank floor. A heavier planting (60–80 %) outcompetes algae and gives fish more cover.`,
      });
    }
  }

  // Surface coverage — floaters shouldn't cover the whole tank
  if (
    report.surfaceCoveragePct !== null &&
    report.surfaceCoveragePct > 0.6
  ) {
    out.push({
      severity: "warn",
      title: "Floating plants will shade the tank",
      body: `Floaters would cover ~${Math.round(
        report.surfaceCoveragePct * 100,
      )} % of the surface. Keep below 50 % so light still reaches the substrate — skim weekly.`,
    });
  }

  return out;
}

/* ───────────────────────────  Water column  ─────────────────────────── */

/**
 * Build a water-column occupancy report from the fish selection.
 * Each fish can occupy more than one zone (e.g. zebra danios use
 * both mid and top); the species appears in every zone it touches
 * but its full count is counted in each zone for visualisation
 * purposes — share calculations elsewhere use total stocked fish
 * across the *distinct* species per zone (i.e. counts are summed
 * per zone, then compared to the all-zones total).
 */
function buildWaterColumnReport(
  selection: TankSelectionResolved,
): WaterColumnReport {
  const zones: Record<WaterColumnZone, WaterColumnSpecies[]> = {
    Top: [],
    Mid: [],
    Bottom: [],
  };

  for (const f of selection.fish) {
    const count = selection.counts[`fish:${f.slug}`] ?? f.minGroupSize;
    for (const z of f.waterColumn) {
      zones[z].push({ slug: f.slug, commonName: f.commonName, count });
    }
  }

  const zoneCounts: Record<WaterColumnZone, number> = {
    Top: zones.Top.reduce((acc, s) => acc + s.count, 0),
    Mid: zones.Mid.reduce((acc, s) => acc + s.count, 0),
    Bottom: zones.Bottom.reduce((acc, s) => acc + s.count, 0),
  };

  const total = zoneCounts.Top + zoneCounts.Mid + zoneCounts.Bottom;
  const dominantZone =
    total === 0
      ? null
      : (Object.entries(zoneCounts).sort((a, b) => b[1] - a[1])[0][0] as WaterColumnZone);
  const dominantShare =
    total === 0 || dominantZone === null
      ? 0
      : zoneCounts[dominantZone] / total;
  const missingZones = (["Top", "Mid", "Bottom"] as WaterColumnZone[]).filter(
    (z) => zoneCounts[z] === 0,
  );
  const isBalanced =
    selection.fish.length >= 2 &&
    missingZones.length === 0 &&
    dominantShare <= 0.65;

  return {
    zones: {
      Top: { species: zones.Top, fishCount: zoneCounts.Top },
      Mid: { species: zones.Mid, fishCount: zoneCounts.Mid },
      Bottom: { species: zones.Bottom, fishCount: zoneCounts.Bottom },
    },
    missingZones,
    dominantZone,
    dominantShare,
    isBalanced,
  };
}

function waterColumnWarnings(
  selection: TankSelectionResolved,
  report: WaterColumnReport,
): TankWarning[] {
  // Only meaningful once there are 2+ fish species to balance across.
  if (selection.fish.length < 2) return [];

  const out: TankWarning[] = [];

  // All bottom dwellers — no surface action, food drops uneaten
  if (
    report.zones.Bottom.fishCount > 0 &&
    report.zones.Top.fishCount === 0 &&
    report.zones.Mid.fishCount === 0
  ) {
    out.push({
      severity: "warn",
      title: "All fish are bottom-dwellers",
      body: "Top and middle of the tank will look empty, and surface food drops uneaten. Add a mid or top species (rasboras, danios, hatchetfish) to use the whole water column.",
    });
    return out;
  }

  // All surface dwellers — bottom is dead, no clean-up crew
  if (
    report.zones.Top.fishCount > 0 &&
    report.zones.Mid.fishCount === 0 &&
    report.zones.Bottom.fishCount === 0
  ) {
    out.push({
      severity: "warn",
      title: "All fish are surface-dwellers",
      body: "The bottom of the tank is unstocked — debris will build up. Add a bottom team (corydoras, otocinclus, hillstream loach) or shrimp.",
    });
    return out;
  }

  // No mid-level — most common imbalance
  if (
    report.zones.Mid.fishCount === 0 &&
    report.zones.Top.fishCount + report.zones.Bottom.fishCount > 0
  ) {
    out.push({
      severity: "info",
      title: "No mid-level swimmers",
      body: "The middle of the tank is empty. Adding a schooling mid-water species (tetras, rasboras) gives the tank visual depth and ties the top and bottom together.",
    });
  }

  // No bottom — common in nano scapes, worth flagging
  if (
    report.zones.Bottom.fishCount === 0 &&
    report.zones.Top.fishCount + report.zones.Mid.fishCount > 0
  ) {
    out.push({
      severity: "info",
      title: "No bottom team",
      body: "No bottom-dwelling fish or shrimp. A small group of corydoras or a shrimp colony picks up leftover food and keeps detritus in check.",
    });
  }

  // Dominant zone — one zone holds the majority of the bioload
  if (report.dominantZone && report.dominantShare > 0.65) {
    const pct = Math.round(report.dominantShare * 100);
    out.push({
      severity: "info",
      title: `${pct}% of your fish swim in the ${report.dominantZone.toLowerCase()}`,
      body: `Heavy concentration in a single zone. Spreading stocking across all three levels makes the tank read fuller for the same bioload.`,
    });
  }

  return out;
}

/* ──────────────────────────────  Builder  ─────────────────────────────── */

export function buildTank(input: TankSelection): TankBuilderResult {
  const selection = resolveSelection(input.ids);

  // Pull every entry that has temp/ph/dGH for intersection
  const tempRanges = selection.all
    .map((a) =>
      "tempRange" in a.entry ? parseRange(a.entry.tempRange as string) : null,
    )
    .filter((r): r is NumericRange => r !== null);
  const phRanges = selection.all
    .map((a) =>
      "phRange" in a.entry ? parseRange(a.entry.phRange as string) : null,
    )
    .filter((r): r is NumericRange => r !== null);
  const dghRanges = selection.all
    .map((a) =>
      "dghRange" in a.entry && (a.entry as { dghRange?: string }).dghRange
        ? parseRange((a.entry as { dghRange: string }).dghRange)
        : null,
    )
    .filter((r): r is NumericRange => r !== null);

  // Minimum tank size = largest minimum among species
  const tankSizes = [
    ...selection.fish.map((f) => f.minTankL),
    ...selection.shrimp.map((s) => s.minTankL),
  ].filter((n): n is number => n !== null && Number.isFinite(n));
  const minTankL = tankSizes.length > 0 ? Math.max(...tankSizes) : null;

  // Light + CO₂ — highest demand among plants & mosses
  const lightSources = [...selection.plants, ...selection.mosses];
  const light = highestLight(lightSources);
  const co2 = highestCO2(lightSources);

  const requirements: TankRequirements = {
    minTankL,
    temp: intersect(tempRanges),
    ph: intersect(phRanges),
    dgh: intersect(dghRanges),
    light,
    co2,
    substrateNotes: substrateNotes(selection.plants),
    equipmentNotes: equipmentNotes(
      selection.plants,
      selection.mosses,
      selection.fish,
      selection.shrimp,
      light,
      co2,
    ),
  };

  const stocking = buildStockingReport(selection, input.tankL);
  const filter = buildFilterReport(input.tankL, input.filterLph);
  const plantFit = buildPlantFitReport(selection, input.tankL);
  const waterColumn = buildWaterColumnReport(selection);

  const warnings = [
    ...paramWarnings(selection, requirements),
    ...bioWarnings(selection, input.tankL, requirements),
    ...filterAndStockingWarnings(selection, stocking, filter, input.tankL),
    ...plantFitWarnings(plantFit, input.tankL),
    ...waterColumnWarnings(selection, waterColumn),
  ];

  return {
    selection,
    requirements,
    stocking,
    filter,
    plantFit,
    waterColumn,
    warnings,
  };
}

/* ─────────────────────  Utility for the UI layer  ─────────────────────── */

/**
 * For a parameter range bar, return the [min, max] used as the scale plus
 * each individual species' own range, so the UI can show every contributing
 * range stacked against the same axis.
 */
export interface ParameterContribution {
  label: string;
  category: CatalogueEntry["category"];
  range: NumericRange;
}

export function temperatureContributions(
  selection: TankSelectionResolved,
): ParameterContribution[] {
  return selection.all
    .map((a) => {
      const r =
        "tempRange" in a.entry
          ? parseRange(a.entry.tempRange as string)
          : null;
      if (!r) return null;
      return {
        label: a.entry.commonName,
        category: a.category,
        range: r,
      };
    })
    .filter((c): c is ParameterContribution => c !== null);
}

export function phContributions(
  selection: TankSelectionResolved,
): ParameterContribution[] {
  return selection.all
    .map((a) => {
      const r =
        "phRange" in a.entry ? parseRange(a.entry.phRange as string) : null;
      if (!r) return null;
      return { label: a.entry.commonName, category: a.category, range: r };
    })
    .filter((c): c is ParameterContribution => c !== null);
}

export function dghContributions(
  selection: TankSelectionResolved,
): ParameterContribution[] {
  return selection.all
    .map((a) => {
      const dgh =
        "dghRange" in a.entry && (a.entry as { dghRange?: string }).dghRange
          ? parseRange((a.entry as { dghRange: string }).dghRange)
          : null;
      if (!dgh) return null;
      return {
        label: a.entry.commonName,
        category: a.category,
        range: dgh,
      };
    })
    .filter((c): c is ParameterContribution => c !== null);
}

