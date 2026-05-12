import type { NumericRange } from "@/lib/range";
import { overlaps } from "@/lib/range";
import type {
  FishNorm,
  PlantNorm,
  ShrimpNorm,
  MossNorm,
  WaterColumn,
  Temperament,
  Diet,
  Light,
  CO2,
  GrowthRate,
  PlantPosition,
  PlantTypeNorm,
  ShrimpLineage,
  ShrimpBreeding,
  MossAttachment,
  MossUse,
} from "@/lib/catalogue/normalize";

export type SearchParamsLike = Record<string, string | string[] | undefined>;

export type ActiveChip = {
  key: string;
  label: string;
};

function first(value: string | string[] | undefined): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function readNumber(value: string | string[] | undefined): number | null {
  const v = first(value);
  if (v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function readBool(value: string | string[] | undefined): boolean {
  const v = first(value);
  return v === "1" || v === "true";
}

function readCSV(value: string | string[] | undefined): string[] {
  const v = first(value);
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function readRange(
  value: string | string[] | undefined,
): NumericRange | null {
  const v = first(value);
  if (!v) return null;
  const parts = v.split("-").map((s) => s.trim());
  if (parts.length !== 2) return null;
  const min = Number(parts[0]);
  const max = Number(parts[1]);
  if (Number.isNaN(min) || Number.isNaN(max)) return null;
  return { min: Math.min(min, max), max: Math.max(min, max) };
}

export const RANGE_BOUNDS = {
  temp: { min: 15, max: 32, step: 1 },
  ph: { min: 4.0, max: 8.5, step: 0.1 },
  dgh: { min: 0, max: 25, step: 1 },
  tds: { min: 50, max: 500, step: 10 },
} as const;

/* ──────────────────────────── Fish ──────────────────────────── */

export interface FishFilterState {
  tankL: number | null;
  column: WaterColumn[];
  temperament: Temperament[];
  schooling: boolean;
  groupMax: number | null;
  diet: Diet[];
  temp: NumericRange | null;
  ph: NumericRange | null;
  dgh: NumericRange | null;
  difficulty: number[];
  plantSafe: boolean;
  shrimpSafe: "any" | "yes" | "adults-only";
  lifespan: number | null;
}

export function parseFishFilters(sp: SearchParamsLike): FishFilterState {
  const shrimpSafeRaw = first(sp.shrimpSafe);
  return {
    tankL: readNumber(sp.tankL),
    column: readCSV(sp.column) as WaterColumn[],
    temperament: readCSV(sp.temperament) as Temperament[],
    schooling: readBool(sp.schooling),
    groupMax: readNumber(sp.groupMax),
    diet: readCSV(sp.diet) as Diet[],
    temp: readRange(sp.temp),
    ph: readRange(sp.ph),
    dgh: readRange(sp.dgh),
    difficulty: readCSV(sp.difficulty)
      .map((d) => Number(d))
      .filter((n) => !Number.isNaN(n)),
    plantSafe: readBool(sp.plantSafe),
    shrimpSafe:
      shrimpSafeRaw === "yes" || shrimpSafeRaw === "adults-only"
        ? shrimpSafeRaw
        : "any",
    lifespan: readNumber(sp.lifespan),
  };
}

export function applyFishFilters(
  entries: ReadonlyArray<FishNorm>,
  f: FishFilterState,
): FishNorm[] {
  return entries.filter((e) => {
    if (f.tankL !== null && e.minTankL !== null && e.minTankL > f.tankL)
      return false;
    if (f.column.length && !f.column.some((c) => e.waterColumn.includes(c)))
      return false;
    if (f.temperament.length && !f.temperament.includes(e.temperament))
      return false;
    if (f.schooling && !e.schooling) return false;
    if (f.groupMax !== null && e.minGroupSize > f.groupMax) return false;
    if (f.diet.length && !f.diet.includes(e.diet)) return false;
    if (f.temp && !overlaps(e.tempRange, f.temp)) return false;
    if (f.ph && !overlaps(e.phRange, f.ph)) return false;
    if (f.dgh && !overlaps(e.dghRange, f.dgh)) return false;
    if (f.difficulty.length && !f.difficulty.includes(e.difficulty))
      return false;
    if (f.plantSafe && !e.plantSafe) return false;
    if (f.shrimpSafe === "yes" && e.shrimpSafe !== "yes") return false;
    if (
      f.shrimpSafe === "adults-only" &&
      !(e.shrimpSafe === "yes" || e.shrimpSafe === "adults-only")
    )
      return false;
    if (
      f.lifespan !== null &&
      (e.lifespanRange === null || e.lifespanRange.max < f.lifespan)
    )
      return false;
    return true;
  });
}

export function fishChips(f: FishFilterState): ActiveChip[] {
  const out: ActiveChip[] = [];
  if (f.tankL !== null) out.push({ key: "tankL", label: `Tank ≥ ${f.tankL} L` });
  for (const c of f.column) out.push({ key: `column:${c}`, label: c });
  for (const t of f.temperament) out.push({ key: `temperament:${t}`, label: t });
  if (f.schooling) out.push({ key: "schooling", label: "Schooling" });
  if (f.groupMax !== null)
    out.push({ key: "groupMax", label: `Group ≤ ${f.groupMax}` });
  for (const d of f.diet) out.push({ key: `diet:${d}`, label: d });
  if (f.temp)
    out.push({ key: "temp", label: `${f.temp.min}–${f.temp.max} °C` });
  if (f.ph) out.push({ key: "ph", label: `pH ${f.ph.min}–${f.ph.max}` });
  if (f.dgh) out.push({ key: "dgh", label: `${f.dgh.min}–${f.dgh.max} dGH` });
  for (const d of f.difficulty)
    out.push({ key: `difficulty:${d}`, label: `Difficulty ${d}` });
  if (f.plantSafe) out.push({ key: "plantSafe", label: "Plant-safe" });
  if (f.shrimpSafe !== "any")
    out.push({
      key: "shrimpSafe",
      label: f.shrimpSafe === "yes" ? "Shrimp-safe" : "Safe with adult shrimp",
    });
  if (f.lifespan !== null)
    out.push({ key: "lifespan", label: `Lifespan ≥ ${f.lifespan} yr` });
  return out;
}

/* ─────────────────────────── Plants ─────────────────────────── */

export interface PlantFilterState {
  position: PlantPosition[];
  type: PlantTypeNorm[];
  light: Light[];
  co2: CO2[];
  growth: GrowthRate[];
  heightMax: number | null;
  temp: NumericRange | null;
  ph: NumericRange | null;
  dgh: NumericRange | null;
  difficulty: number[];
}

export function parsePlantFilters(sp: SearchParamsLike): PlantFilterState {
  return {
    position: readCSV(sp.position) as PlantPosition[],
    type: readCSV(sp.type) as PlantTypeNorm[],
    light: readCSV(sp.light) as Light[],
    co2: readCSV(sp.co2) as CO2[],
    growth: readCSV(sp.growth) as GrowthRate[],
    heightMax: readNumber(sp.heightMax),
    temp: readRange(sp.temp),
    ph: readRange(sp.ph),
    dgh: readRange(sp.dgh),
    difficulty: readCSV(sp.difficulty)
      .map((d) => Number(d))
      .filter((n) => !Number.isNaN(n)),
  };
}

export function applyPlantFilters(
  entries: ReadonlyArray<PlantNorm>,
  f: PlantFilterState,
): PlantNorm[] {
  return entries.filter((e) => {
    if (f.position.length && !f.position.some((p) => e.position.includes(p)))
      return false;
    if (f.type.length && !f.type.some((p) => e.plantType.includes(p)))
      return false;
    if (f.light.length && !f.light.some((p) => e.light.includes(p)))
      return false;
    if (f.co2.length && !f.co2.some((p) => e.co2.includes(p))) return false;
    if (f.growth.length && !f.growth.some((p) => e.growthRate.includes(p)))
      return false;
    if (
      f.heightMax !== null &&
      e.maxHeightCm !== null &&
      e.maxHeightCm > f.heightMax
    )
      return false;
    if (f.temp && !overlaps(e.tempRange, f.temp)) return false;
    if (f.ph && !overlaps(e.phRange, f.ph)) return false;
    if (f.dgh && !overlaps(e.dghRange, f.dgh)) return false;
    if (f.difficulty.length && !f.difficulty.includes(e.difficulty))
      return false;
    return true;
  });
}

export function plantChips(f: PlantFilterState): ActiveChip[] {
  const out: ActiveChip[] = [];
  for (const p of f.position) out.push({ key: `position:${p}`, label: p });
  for (const t of f.type) out.push({ key: `type:${t}`, label: t });
  for (const l of f.light) out.push({ key: `light:${l}`, label: `${l} light` });
  for (const c of f.co2) out.push({ key: `co2:${c}`, label: `CO₂: ${c}` });
  for (const g of f.growth) out.push({ key: `growth:${g}`, label: g });
  if (f.heightMax !== null)
    out.push({ key: "heightMax", label: `Height ≤ ${f.heightMax} cm` });
  if (f.temp)
    out.push({ key: "temp", label: `${f.temp.min}–${f.temp.max} °C` });
  if (f.ph) out.push({ key: "ph", label: `pH ${f.ph.min}–${f.ph.max}` });
  if (f.dgh) out.push({ key: "dgh", label: `${f.dgh.min}–${f.dgh.max} dGH` });
  for (const d of f.difficulty)
    out.push({ key: `difficulty:${d}`, label: `Difficulty ${d}` });
  return out;
}

/* ─────────────────────────── Shrimp ─────────────────────────── */

export interface ShrimpFilterState {
  lineage: ShrimpLineage[];
  tankL: number | null;
  difficulty: number[];
  algae: number | null;
  breeding: ShrimpBreeding[];
  temp: NumericRange | null;
  ph: NumericRange | null;
  dgh: NumericRange | null;
  tds: NumericRange | null;
}

export function parseShrimpFilters(sp: SearchParamsLike): ShrimpFilterState {
  return {
    lineage: readCSV(sp.lineage) as ShrimpLineage[],
    tankL: readNumber(sp.tankL),
    difficulty: readCSV(sp.difficulty)
      .map((d) => Number(d))
      .filter((n) => !Number.isNaN(n)),
    algae: readNumber(sp.algae),
    breeding: readCSV(sp.breeding) as ShrimpBreeding[],
    temp: readRange(sp.temp),
    ph: readRange(sp.ph),
    dgh: readRange(sp.dgh),
    tds: readRange(sp.tds),
  };
}

export function applyShrimpFilters(
  entries: ReadonlyArray<ShrimpNorm>,
  f: ShrimpFilterState,
): ShrimpNorm[] {
  return entries.filter((e) => {
    if (f.lineage.length && !f.lineage.includes(e.lineage)) return false;
    if (f.tankL !== null && e.minTankL !== null && e.minTankL > f.tankL)
      return false;
    if (f.difficulty.length && !f.difficulty.includes(e.difficulty))
      return false;
    if (f.algae !== null && e.algaeEaterRating < f.algae) return false;
    if (f.breeding.length && !f.breeding.includes(e.breeding)) return false;
    if (f.temp && !overlaps(e.tempRange, f.temp)) return false;
    if (f.ph && !overlaps(e.phRange, f.ph)) return false;
    if (f.dgh && !overlaps(e.dghRange, f.dgh)) return false;
    if (f.tds && !overlaps(e.tdsRange, f.tds)) return false;
    return true;
  });
}

export function shrimpChips(f: ShrimpFilterState): ActiveChip[] {
  const out: ActiveChip[] = [];
  for (const l of f.lineage) out.push({ key: `lineage:${l}`, label: l });
  if (f.tankL !== null) out.push({ key: "tankL", label: `Tank ≥ ${f.tankL} L` });
  for (const d of f.difficulty)
    out.push({ key: `difficulty:${d}`, label: `Difficulty ${d}` });
  if (f.algae !== null)
    out.push({ key: "algae", label: `Algae ≥ ${f.algae}/5` });
  for (const b of f.breeding) out.push({ key: `breeding:${b}`, label: b });
  if (f.temp)
    out.push({ key: "temp", label: `${f.temp.min}–${f.temp.max} °C` });
  if (f.ph) out.push({ key: "ph", label: `pH ${f.ph.min}–${f.ph.max}` });
  if (f.dgh) out.push({ key: "dgh", label: `${f.dgh.min}–${f.dgh.max} dGH` });
  if (f.tds)
    out.push({ key: "tds", label: `TDS ${f.tds.min}–${f.tds.max}` });
  return out;
}

/* ─────────────────────────── Mosses ─────────────────────────── */

export interface MossFilterState {
  attach: MossAttachment[];
  use: MossUse[];
  light: Light[];
  co2: CO2[];
  growth: GrowthRate[];
  difficulty: number[];
  temp: NumericRange | null;
  ph: NumericRange | null;
}

export function parseMossFilters(sp: SearchParamsLike): MossFilterState {
  return {
    attach: readCSV(sp.attach) as MossAttachment[],
    use: readCSV(sp.use) as MossUse[],
    light: readCSV(sp.light) as Light[],
    co2: readCSV(sp.co2) as CO2[],
    growth: readCSV(sp.growth) as GrowthRate[],
    difficulty: readCSV(sp.difficulty)
      .map((d) => Number(d))
      .filter((n) => !Number.isNaN(n)),
    temp: readRange(sp.temp),
    ph: readRange(sp.ph),
  };
}

export function applyMossFilters(
  entries: ReadonlyArray<MossNorm>,
  f: MossFilterState,
): MossNorm[] {
  return entries.filter((e) => {
    if (f.attach.length && !f.attach.some((a) => e.attachment.includes(a)))
      return false;
    if (f.use.length && !f.use.some((u) => e.typicalUse.includes(u)))
      return false;
    if (f.light.length && !f.light.some((p) => e.light.includes(p)))
      return false;
    if (f.co2.length && !f.co2.some((p) => e.co2.includes(p))) return false;
    if (f.growth.length && !f.growth.some((p) => e.growthRate.includes(p)))
      return false;
    if (f.difficulty.length && !f.difficulty.includes(e.difficulty))
      return false;
    if (f.temp && !overlaps(e.tempRange, f.temp)) return false;
    if (f.ph && !overlaps(e.phRange, f.ph)) return false;
    return true;
  });
}

export function mossChips(f: MossFilterState): ActiveChip[] {
  const out: ActiveChip[] = [];
  for (const a of f.attach) out.push({ key: `attach:${a}`, label: a });
  for (const u of f.use) out.push({ key: `use:${u}`, label: u });
  for (const l of f.light) out.push({ key: `light:${l}`, label: `${l} light` });
  for (const c of f.co2) out.push({ key: `co2:${c}`, label: `CO₂: ${c}` });
  for (const g of f.growth) out.push({ key: `growth:${g}`, label: g });
  for (const d of f.difficulty)
    out.push({ key: `difficulty:${d}`, label: `Difficulty ${d}` });
  if (f.temp)
    out.push({ key: "temp", label: `${f.temp.min}–${f.temp.max} °C` });
  if (f.ph) out.push({ key: "ph", label: `pH ${f.ph.min}–${f.ph.max}` });
  return out;
}
