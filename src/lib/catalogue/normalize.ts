import type {
  CatalogueEntry,
  FishEntry,
  PlantEntry,
  ShrimpEntry,
  MossEntry,
  SnailEntry,
} from "@/types/catalogue";
import {
  parseRange,
  parseLeadingNumber,
  type NumericRange,
} from "@/lib/range";
import { fish, plants, shrimp, mosses, snails } from "@/data";

export type WaterColumn = "Top" | "Mid" | "Bottom";
export type Temperament =
  | "Peaceful"
  | "Semi-aggressive"
  | "Aggressive"
  | "Territorial when breeding";
export type Diet = "Omnivore" | "Micropredator" | "Herbivore" | "Filter feeder";
export type ShrimpSafety = "yes" | "adults-only" | "no";

export type PlantPosition =
  | "Foreground"
  | "Midground"
  | "Background"
  | "Floating";
export type PlantTypeNorm =
  | "Stem"
  | "Rosette"
  | "Rhizome"
  | "Carpet"
  | "Floating"
  | "Epiphyte";

export type Light = "Low" | "Medium" | "High";
export type CO2 = "None" | "Optional" | "Recommended" | "Required";
export type GrowthRate = "Slow" | "Medium" | "Fast" | "Very Fast";
export type FlowRate = "Still" | "Low" | "Medium" | "High" | "Very High";

export type ShrimpLineage = "Neocaridina" | "Caridina" | "Other";
export type ShrimpBreeding =
  | "Very easy"
  | "Easy"
  | "Medium"
  | "Hard"
  | "Larvae need brackish";

export type MossAttachment = "Wood" | "Stone" | "Mesh" | "Floating";
export type MossUse =
  | "Carpet"
  | "Wall"
  | "Tree"
  | "Bonsai"
  | "Crevice"
  | "Cave"
  | "Shrimp tank";

const LIGHT_ORDINAL: Record<Light, number> = { Low: 1, Medium: 2, High: 3 };
const CO2_ORDINAL: Record<CO2, number> = {
  None: 0,
  Optional: 1,
  Recommended: 2,
  Required: 3,
};
const GROWTH_ORDINAL: Record<GrowthRate, number> = {
  Slow: 1,
  Medium: 2,
  Fast: 3,
  "Very Fast": 4,
};
const FLOW_ORDINAL: Record<FlowRate, number> = {
  Still: 0,
  Low: 1,
  Medium: 2,
  High: 3,
  "Very High": 4,
};
export const FLOW_RANK = FLOW_ORDINAL;

function stripParens(s: string): string {
  return s.replace(/\([^)]*\)/g, " ").trim();
}

function lower(s: string): string {
  return s.toLowerCase();
}

function expandRange<T extends string>(
  raw: string,
  members: ReadonlyArray<T>,
  ordinal: Record<T, number>,
): T[] {
  const text = lower(stripParens(raw));
  const parts = text.split(/\s+to\s+|\s*\/\s*|,\s*/);
  const hits = new Set<T>();
  for (const part of parts) {
    for (const m of members) {
      if (part === lower(m)) hits.add(m);
    }
  }
  if (hits.size <= 1 && parts.length === 2) {
    const a = members.find((m) => parts[0].includes(lower(m)));
    const b = members.find((m) => parts[1].includes(lower(m)));
    if (a && b) {
      const lo = Math.min(ordinal[a], ordinal[b]);
      const hi = Math.max(ordinal[a], ordinal[b]);
      for (const m of members) {
        if (ordinal[m] >= lo && ordinal[m] <= hi) hits.add(m);
      }
    }
  }
  if (hits.size === 0) {
    for (const m of members) {
      if (text.includes(lower(m))) hits.add(m);
    }
  }
  return Array.from(hits);
}

function parseLight(raw: string): Light[] {
  return expandRange<Light>(raw, ["Low", "Medium", "High"], LIGHT_ORDINAL);
}

function parseCO2(raw: string): CO2[] {
  return expandRange<CO2>(
    raw,
    ["None", "Optional", "Recommended", "Required"],
    CO2_ORDINAL,
  );
}

function parseGrowth(raw: string): GrowthRate[] {
  return expandRange<GrowthRate>(
    raw,
    ["Slow", "Medium", "Fast", "Very Fast"],
    GROWTH_ORDINAL,
  );
}

function parseFlow(raw: string): FlowRate[] {
  return expandRange<FlowRate>(
    raw,
    ["Still", "Low", "Medium", "High", "Very High"],
    FLOW_ORDINAL,
  );
}

function parseWaterColumns(raw: string): WaterColumn[] {
  const text = lower(stripParens(raw));
  const hits = new Set<WaterColumn>();
  if (text.includes("top")) hits.add("Top");
  if (text.includes("mid")) hits.add("Mid");
  if (text.includes("bottom")) hits.add("Bottom");
  if (text.includes("all")) {
    hits.add("Top");
    hits.add("Mid");
    hits.add("Bottom");
  }
  return Array.from(hits);
}

function parseTemperament(raw: string): Temperament {
  const text = lower(raw);
  if (text.includes("territorial")) return "Territorial when breeding";
  if (text.includes("aggressive") && !text.includes("semi"))
    return "Aggressive";
  if (text.includes("semi")) return "Semi-aggressive";
  return "Peaceful";
}

function parseDiet(raw: string): Diet {
  const text = lower(raw);
  if (text.includes("filter")) return "Filter feeder";
  if (text.includes("herbivore") || text.includes("algae"))
    return "Herbivore";
  if (text.includes("micropredator")) return "Micropredator";
  return "Omnivore";
}

function parseSchooling(raw: string): boolean {
  return /^yes\b/i.test(String(raw).trim());
}

function parsePlantSafe(raw: string): boolean {
  return /^yes\b/i.test(String(raw).trim());
}

function parseShrimpSafe(raw: string): ShrimpSafety {
  const text = lower(raw);
  if (/^yes\b/.test(text) && !text.includes("adult")) return "yes";
  if (text.includes("adult") || text.includes("mostly")) return "adults-only";
  if (text.includes("risky") || /^no\b/.test(text)) return "no";
  if (/^yes\b/.test(text)) return "yes";
  return "adults-only";
}

function parsePlantPositions(raw: string): PlantPosition[] {
  const text = lower(stripParens(raw));
  const all: PlantPosition[] = [
    "Foreground",
    "Midground",
    "Background",
    "Floating",
  ];
  const ordinal: Record<PlantPosition, number> = {
    Foreground: 1,
    Midground: 2,
    Background: 3,
    Floating: 4,
  };
  const parts = text.split(/\s+to\s+|\s*\/\s*|,\s*/);
  const hits = new Set<PlantPosition>();
  for (const p of parts) {
    for (const m of all) {
      if (p === lower(m)) hits.add(m);
    }
  }
  if (hits.size <= 1 && parts.length >= 2) {
    const a = all.find((m) => parts[0].includes(lower(m)));
    const b = all.find((m) => parts[1].includes(lower(m)));
    if (a && b && a !== "Floating" && b !== "Floating") {
      const lo = Math.min(ordinal[a], ordinal[b]);
      const hi = Math.max(ordinal[a], ordinal[b]);
      for (const m of all) {
        if (m === "Floating") continue;
        if (ordinal[m] >= lo && ordinal[m] <= hi) hits.add(m);
      }
    }
  }
  if (hits.size === 0) {
    for (const m of all) if (text.includes(lower(m))) hits.add(m);
  }
  return Array.from(hits);
}

function parsePlantTypes(raw: string): PlantTypeNorm[] {
  const text = lower(raw);
  const out = new Set<PlantTypeNorm>();
  if (text.includes("stem")) out.add("Stem");
  if (text.includes("rosette")) out.add("Rosette");
  if (text.includes("rhizome")) out.add("Rhizome");
  if (text.includes("carpet")) out.add("Carpet");
  if (text.includes("floating")) out.add("Floating");
  if (text.includes("epiphyte")) out.add("Epiphyte");
  return Array.from(out);
}

function parseLineage(scientific: string): ShrimpLineage {
  const sn = scientific.trim();
  if (/^Neocaridina\b/i.test(sn)) return "Neocaridina";
  if (/^Caridina\b/i.test(sn)) return "Caridina";
  return "Other";
}

function parseShrimpBreeding(raw: string): ShrimpBreeding {
  const text = lower(raw);
  if (text.includes("brackish")) return "Larvae need brackish";
  if (text.includes("very easy")) return "Very easy";
  if (text.startsWith("easy")) return "Easy";
  if (text.includes("medium")) return "Medium";
  if (text.includes("hard")) return "Hard";
  return "Medium";
}

function parseMossAttachment(raw: string): MossAttachment[] {
  const text = lower(raw);
  const out = new Set<MossAttachment>();
  if (text.includes("wood")) out.add("Wood");
  if (text.includes("stone") || text.includes("rock")) out.add("Stone");
  if (text.includes("mesh")) out.add("Mesh");
  if (
    text.includes("floating") ||
    text.includes("floats") ||
    text.includes("free-floating")
  )
    out.add("Floating");
  return Array.from(out);
}

function parseMossUse(raw: string): MossUse[] {
  const text = lower(raw);
  const out = new Set<MossUse>();
  if (text.includes("carpet") || text.includes("mat")) out.add("Carpet");
  if (text.includes("wall")) out.add("Wall");
  if (text.includes("tree") || text.includes("canopy") || text.includes("branch"))
    out.add("Tree");
  if (text.includes("bonsai")) out.add("Bonsai");
  if (text.includes("crevice")) out.add("Crevice");
  if (text.includes("cave")) out.add("Cave");
  if (text.includes("shrimp")) out.add("Shrimp tank");
  return Array.from(out);
}

export interface BaseNorm {
  id: string;
  slug: string;
  category: CatalogueEntry["category"];
  commonName: string;
  scientificName: string;
  origin: string;
  difficulty: number;
  tempRange: NumericRange | null;
  phRange: NumericRange | null;
  dghRange: NumericRange | null;
  flow: FlowRate[];
  raw: CatalogueEntry;
}

export interface FishNorm extends BaseNorm {
  category: "fish";
  minTankL: number | null;
  waterColumn: WaterColumn[];
  temperament: Temperament;
  schooling: boolean;
  minGroupSize: number;
  diet: Diet;
  plantSafe: boolean;
  shrimpSafe: ShrimpSafety;
  lifespanRange: NumericRange | null;
  raw: FishEntry;
}

export interface PlantNorm extends BaseNorm {
  category: "plants";
  position: PlantPosition[];
  plantType: PlantTypeNorm[];
  light: Light[];
  co2: CO2[];
  growthRate: GrowthRate[];
  maxHeightCm: number | null;
  raw: PlantEntry;
}

export interface ShrimpNorm extends BaseNorm {
  category: "shrimp";
  lineage: ShrimpLineage;
  minTankL: number | null;
  tdsRange: NumericRange | null;
  algaeEaterRating: number;
  breeding: ShrimpBreeding;
  raw: ShrimpEntry;
}

export interface MossNorm extends BaseNorm {
  category: "mosses";
  attachment: MossAttachment[];
  typicalUse: MossUse[];
  light: Light[];
  co2: CO2[];
  growthRate: GrowthRate[];
  raw: MossEntry;
}

export interface SnailNorm extends BaseNorm {
  category: "snails";
  minTankL: number | null;
  algaeEaterRating: number;
  raw: SnailEntry;
}

export type NormalizedEntry =
  | FishNorm
  | PlantNorm
  | ShrimpNorm
  | MossNorm
  | SnailNorm;

function base(entry: CatalogueEntry): BaseNorm {
  return {
    id: entry.id,
    slug: entry.slug,
    category: entry.category,
    commonName: entry.commonName,
    scientificName: entry.scientificName,
    origin: entry.origin,
    difficulty: entry.difficulty,
    tempRange:
      "tempRange" in entry ? parseRange(entry.tempRange as string) : null,
    phRange: "phRange" in entry ? parseRange(entry.phRange as string) : null,
    dghRange:
      "dghRange" in entry && entry.dghRange
        ? parseRange(entry.dghRange as string)
        : null,
    flow: "flowRate" in entry ? parseFlow(entry.flowRate as string) : [],
    raw: entry,
  };
}

export const fishNorm: ReadonlyArray<FishNorm> = fish.map((f) => ({
  ...base(f),
  category: "fish" as const,
  minTankL: parseLeadingNumber(f.minTankSize),
  waterColumn: parseWaterColumns(f.waterColumn),
  temperament: parseTemperament(f.temperament),
  schooling: parseSchooling(f.schooling),
  minGroupSize: f.minGroupSize,
  diet: parseDiet(f.diet),
  plantSafe: parsePlantSafe(f.plantSafe),
  shrimpSafe: parseShrimpSafe(f.shrimpSafe),
  lifespanRange: parseRange(f.lifespan),
  raw: f,
}));

export const plantNorm: ReadonlyArray<PlantNorm> = plants.map((p) => ({
  ...base(p),
  category: "plants" as const,
  position: parsePlantPositions(p.position),
  plantType: parsePlantTypes(p.plantType),
  light: parseLight(p.light),
  co2: parseCO2(p.co2),
  growthRate: parseGrowth(p.growthRate),
  maxHeightCm:
    parseRange(p.maxHeight)?.max ?? parseLeadingNumber(p.maxHeight),
  raw: p,
}));

export const shrimpNorm: ReadonlyArray<ShrimpNorm> = shrimp.map((s) => ({
  ...base(s),
  category: "shrimp" as const,
  lineage: parseLineage(s.scientificName),
  minTankL: parseLeadingNumber(s.minTankSize),
  tdsRange: parseRange(s.tdsRange),
  algaeEaterRating: s.algaeEaterRating,
  breeding: parseShrimpBreeding(s.breeding),
  raw: s,
}));

export const mossNorm: ReadonlyArray<MossNorm> = mosses.map((m) => ({
  ...base(m),
  category: "mosses" as const,
  attachment: parseMossAttachment(m.attachment),
  typicalUse: parseMossUse(m.typicalUse),
  light: parseLight(m.light),
  co2: parseCO2(m.co2),
  growthRate: parseGrowth(m.growthRate),
  raw: m,
}));

export const snailNorm: ReadonlyArray<SnailNorm> = snails.map((s) => ({
  ...base(s),
  category: "snails" as const,
  minTankL: parseLeadingNumber(s.minTankSize),
  algaeEaterRating: s.algaeEaterRating,
  raw: s,
}));

export const allNorm: ReadonlyArray<NormalizedEntry> = [
  ...fishNorm,
  ...plantNorm,
  ...shrimpNorm,
  ...mossNorm,
  ...snailNorm,
];

export function findNorm(
  category: NormalizedEntry["category"],
  slug: string,
): NormalizedEntry | undefined {
  return allNorm.find((e) => e.category === category && e.slug === slug);
}
