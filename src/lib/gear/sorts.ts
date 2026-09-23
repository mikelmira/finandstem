import type { GearCard, GearCategory, GearNumericField } from "@/types/gear";

/**
 * Sortable specs for each gear category. Each becomes two sort options
 * (low to high, high to low). Products without the figure sort last.
 * `fallback` is used when a model lacks the main field (e.g. a light with no
 * stated tank length falls back to its fixture length).
 */
export interface SortField {
  field: GearNumericField;
  label: string;
  /** Wording for each direction, e.g. ["Low flow first", "High flow first"]. */
  words: [string, string];
  fallback?: GearNumericField;
}

const TANK: SortField = { field: "tankMaxL", label: "Tank size", words: ["Smallest tank first", "Largest tank first"] };
const POWER: SortField = { field: "powerW", label: "Power use", words: ["Lowest power first", "Highest power first"] };

export const SORT_FIELDS: Record<GearCategory, SortField[]> = {
  aquariums: [
    { field: "volumeL", label: "Volume", words: ["Smallest first", "Largest first"] },
    { field: "lengthCm", label: "Length", words: ["Shortest first", "Longest first"] },
    { field: "glassMm", label: "Glass", words: ["Thinnest glass first", "Thickest glass first"] },
  ],
  filters: [
    { field: "flowLph", label: "Flow", words: ["Lowest flow first", "Highest flow first"] },
    TANK,
    { field: "mediaL", label: "Media volume", words: ["Least media first", "Most media first"] },
    POWER,
  ],
  lights: [
    {
      field: "fitsLengthMaxCm",
      fallback: "lengthCm",
      label: "Size",
      words: ["Smallest first", "Largest first"],
    },
    POWER,
    { field: "lumens", label: "Output", words: ["Lowest output first", "Highest output first"] },
  ],
  co2: [TANK],
  fertilisers: [],
  heaters: [{ field: "heaterW", label: "Wattage", words: ["Lowest wattage first", "Highest wattage first"] }, TANK],
  cooling: [TANK, POWER],
  pumps: [
    { field: "flowLph", label: "Flow", words: ["Lowest flow first", "Highest flow first"] },
    { field: "headM", label: "Head", words: ["Lowest head first", "Highest head first"] },
    POWER,
  ],
  "air-pumps": [
    { field: "airLpm", label: "Air output", words: ["Lowest output first", "Highest output first"] },
    { field: "outlets", label: "Outlets", words: ["Fewest outlets first", "Most outlets first"] },
    POWER,
  ],
  sterilisers: [{ field: "uvW", label: "UV lamp", words: ["Smallest lamp first", "Largest lamp first"] }, TANK],
  plumbing: [{ field: "hoseMm", label: "Hose size", words: ["Smallest hose first", "Largest hose first"] }],
  stands: [{ field: "lengthCm", label: "Length", words: ["Shortest first", "Longest first"] }],
  paludarium: [],
  tools: [],
  feeders: [],
  hardscape: [{ field: "weightKg", label: "Weight", words: ["Lightest first", "Heaviest first"] }],
};

/** Smallest (asc) or largest (desc) value across a product's models. */
export function sortKey(card: GearCard, f: SortField, dir: "asc" | "desc"): number | null {
  const vals = card.models
    .map((m) => (m[f.field] as number | undefined) ?? (f.fallback ? (m[f.fallback] as number | undefined) : undefined))
    .filter((v): v is number => typeof v === "number");
  if (vals.length === 0) return null;
  return dir === "asc" ? Math.min(...vals) : Math.max(...vals);
}
