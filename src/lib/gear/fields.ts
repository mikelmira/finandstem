import type { GearModel, GearNumericField } from "@/types/gear";

/** Display metadata for every standard numeric model field. */
export const FIELD_META: Record<
  GearNumericField,
  { label: string; unit: string; short?: string }
> = {
  flowLph: { label: "Flow", unit: "L/h" },
  headM: { label: "Max head", unit: "m" },
  powerW: { label: "Power", unit: "W" },
  tankMinL: { label: "Tank from", unit: "L" },
  tankMaxL: { label: "Tank up to", unit: "L" },
  volumeL: { label: "Volume", unit: "L" },
  lengthCm: { label: "Length", unit: "cm" },
  widthCm: { label: "Width", unit: "cm" },
  heightCm: { label: "Height", unit: "cm" },
  glassMm: { label: "Glass", unit: "mm" },
  mediaL: { label: "Media volume", unit: "L" },
  airLpm: { label: "Air output", unit: "L/min" },
  outlets: { label: "Outlets", unit: "" },
  heaterW: { label: "Heater", unit: "W" },
  uvW: { label: "UV lamp", unit: "W" },
  lumens: { label: "Output", unit: "lm" },
  kelvin: { label: "Colour temp", unit: "K" },
  fitsLengthMinCm: { label: "Fits tanks from", unit: "cm" },
  fitsLengthMaxCm: { label: "Fits tanks to", unit: "cm" },
  hoseMm: { label: "Hose", unit: "mm" },
  weightKg: { label: "Weight", unit: "kg" },
  capacityMl: { label: "Food capacity", unit: "ml" },
};

export function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString("en-GB");
  return n.toLocaleString("en-GB", { maximumFractionDigits: 1 });
}

export function formatField(field: GearNumericField, n: number): string {
  const meta = FIELD_META[field];
  return meta.unit ? `${formatNumber(n)} ${meta.unit}` : formatNumber(n);
}

/**
 * Pseudo-fields that combine two numbers into one readable value, used on
 * cards and in the compare table so a tank range or a light's fit range
 * reads as one cell.
 */
export type DisplayField =
  | GearNumericField
  | "tankRange"
  | "fitsRange"
  | "dimensions";

export const DISPLAY_LABEL: Record<DisplayField, string> = {
  ...Object.fromEntries(
    Object.entries(FIELD_META).map(([k, v]) => [k, v.label]),
  ),
  tankRange: "Tank size",
  fitsRange: "Made for tanks",
  dimensions: "Dimensions (L × W × H)",
} as Record<DisplayField, string>;

export function displayValue(
  model: GearModel,
  field: DisplayField,
): string | null {
  if (field === "tankRange") {
    const { tankMinL: a, tankMaxL: b } = model;
    if (a && b) return `${formatNumber(a)}–${formatNumber(b)} L`;
    if (b) return `up to ${formatNumber(b)} L`;
    if (a) return `from ${formatNumber(a)} L`;
    return null;
  }
  if (field === "fitsRange") {
    const { fitsLengthMinCm: a, fitsLengthMaxCm: b } = model;
    if (a && b && a !== b) return `${formatNumber(a)}–${formatNumber(b)} cm`;
    if (a || b) return `${formatNumber((a ?? b) as number)} cm`;
    return null;
  }
  if (field === "dimensions") {
    const { lengthCm: l, widthCm: w, heightCm: h } = model;
    if (l && w && h)
      return `${formatNumber(l)} × ${formatNumber(w)} × ${formatNumber(h)} cm`;
    if (l && w) return `${formatNumber(l)} × ${formatNumber(w)} cm`;
    if (l) return `${formatNumber(l)} cm long`;
    return null;
  }
  const v = model[field];
  return typeof v === "number" ? formatField(field, v) : null;
}

/** Range of a numeric field across a product's models, for card summaries. */
export function fieldRange(
  models: ReadonlyArray<GearModel>,
  field: GearNumericField,
): { min: number; max: number } | null {
  const vals = models
    .map((m) => m[field])
    .filter((v): v is number => typeof v === "number");
  if (vals.length === 0) return null;
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

export function formatRange(
  models: ReadonlyArray<GearModel>,
  field: GearNumericField,
): string | null {
  const r = fieldRange(models, field);
  if (!r) return null;
  const unit = FIELD_META[field].unit;
  const body =
    r.min === r.max
      ? formatNumber(r.min)
      : `${formatNumber(r.min)}–${formatNumber(r.max)}`;
  return unit ? `${body} ${unit}` : body;
}
