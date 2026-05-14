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
  /** `${category}:${slug}` ids in URL order. */
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
  }>;
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

export interface StockingReport {
  /** Sum of adult fish lengths plus shrimp contribution, in cm. */
  bioloadCm: number;
  /** Bioload divided by tank volume, cm per litre. */
  loadPerLitre: number | null;
  /** Bucket verdict — only populated when tankL is provided. */
  verdict: StockingVerdict | null;
  /** Headroom in cm before tipping into the next band. */
  headroomCm: number | null;
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
  warnings: TankWarning[];
}

/* ─────────────────────────────  Resolver  ──────────────────────────────── */

export function resolveSelection(ids: string[]): TankSelectionResolved {
  const fish: FishNorm[] = [];
  const plants: PlantNorm[] = [];
  const shrimp: ShrimpNorm[] = [];
  const mosses: MossNorm[] = [];
  const all: Array<{
    category: CatalogueEntry["category"];
    slug: string;
    entry: CatalogueEntry;
  }> = [];

  for (const id of ids) {
    const [category, slug] = id.split(":");
    if (!category || !slug) continue;
    if (category === "fish") {
      const hit = fishNorm.find((f) => f.slug === slug);
      if (hit && !all.some((a) => a.category === "fish" && a.slug === slug)) {
        fish.push(hit);
        all.push({ category: "fish", slug, entry: hit.raw });
      }
    } else if (category === "plants") {
      const hit = plantNorm.find((p) => p.slug === slug);
      if (hit && !all.some((a) => a.category === "plants" && a.slug === slug)) {
        plants.push(hit);
        all.push({ category: "plants", slug, entry: hit.raw });
      }
    } else if (category === "shrimp") {
      const hit = shrimpNorm.find((s) => s.slug === slug);
      if (hit && !all.some((a) => a.category === "shrimp" && a.slug === slug)) {
        shrimp.push(hit);
        all.push({ category: "shrimp", slug, entry: hit.raw });
      }
    } else if (category === "mosses") {
      const hit = mossNorm.find((m) => m.slug === slug);
      if (hit && !all.some((a) => a.category === "mosses" && a.slug === slug)) {
        mosses.push(hit);
        all.push({ category: "mosses", slug, entry: hit.raw });
      }
    }
  }

  return { fish, plants, shrimp, mosses, all };
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

function highestLight(
  pieces: ReadonlyArray<{ light: Light[] }>,
): Light | null {
  let max: Light | null = null;
  let maxRank = -1;
  for (const p of pieces) {
    for (const l of p.light) {
      if (LIGHT_RANK[l] > maxRank) {
        max = l;
        maxRank = LIGHT_RANK[l];
      }
    }
  }
  return max;
}

function highestCO2(pieces: ReadonlyArray<{ co2: CO2[] }>): CO2 | null {
  let max: CO2 | null = null;
  let maxRank = -1;
  for (const p of pieces) {
    for (const l of p.co2) {
      if (CO2_RANK[l] > maxRank) {
        max = l;
        maxRank = CO2_RANK[l];
      }
    }
  }
  return max;
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

  // Schooling fish reminders
  for (const f of selection.fish) {
    if (f.schooling && f.minGroupSize >= 6) {
      out.push({
        severity: "info",
        title: `${f.commonName} schools`,
        body: `Plan for at least ${f.minGroupSize} ${f.commonName.toLowerCase()}s — they're stressed in smaller groups and lose colour.`,
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
 * Cumulative "cm of adult fish" load for the selection. Fish count
 * at their full adult size × the actual stocking group; shrimp
 * contribute roughly 1/5 of a comparable-length fish.
 *
 * `groupSize` defaults to each fish's minGroupSize — that's the
 * stocking the planner assumes if the user just adds a single
 * species. Future iterations can let users override this per fish.
 */
function computeBioload(selection: TankSelectionResolved): number {
  let cm = 0;
  for (const f of selection.fish) {
    const range = parseRange(f.raw.adultSize);
    const adult = range ? range.max : 0;
    const group = Math.max(1, f.minGroupSize);
    cm += adult * group;
  }
  for (const s of selection.shrimp) {
    const range = parseRange(s.raw.adultSize);
    const adult = range ? range.max : 0;
    // Shrimp produce far less waste per cm of body — scale to ~⅕.
    // Use the colony minimum so the load reflects a real shrimp
    // colony, not a single specimen.
    cm += adult * Math.max(1, s.raw.colonyMin) * 0.2;
  }
  return Number(cm.toFixed(1));
}

function buildStockingReport(
  selection: TankSelectionResolved,
  tankL: number | undefined,
): StockingReport {
  const bioloadCm = computeBioload(selection);
  if (tankL === undefined || tankL <= 0) {
    return {
      bioloadCm,
      loadPerLitre: null,
      verdict: null,
      headroomCm: null,
    };
  }
  const loadPerLitre = Number((bioloadCm / tankL).toFixed(2));
  const verdict = verdictForLoad(loadPerLitre);
  // Headroom = cm of fish you can still add before "full" (1.0 cm/L).
  const headroomCm = Math.max(0, Number((tankL * 1.0 - bioloadCm).toFixed(1)));
  return { bioloadCm, loadPerLitre, verdict, headroomCm };
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

  const warnings = [
    ...paramWarnings(selection, requirements),
    ...bioWarnings(selection, input.tankL, requirements),
    ...filterAndStockingWarnings(selection, stocking, filter, input.tankL),
  ];

  return { selection, requirements, stocking, filter, warnings };
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

