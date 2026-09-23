import type { GearCategory, GearModel } from "@/types/gear";

/**
 * Tank-fit logic for the gear catalogue. Pure functions, safe on server
 * and client, so the category pages, the planner and the tank-size pages
 * all agree on what "fits a 60 litre tank" means.
 *
 * The rules are rules of thumb, stated plainly in the UI:
 *   · Filters: rated flow of 5–12× the tank volume per hour is the sweet
 *     spot for a planted tank (rated flow is measured with an empty
 *     canister, real flow with media and hoses is noticeably lower, so
 *     we deliberately allow a little headroom above 10×).
 *   · Heaters: about 1 W per litre in a normal room, 0.6–1.6 W/L is fine.
 *   · Lights: the maker's stated tank length, or a fixture a little
 *     shorter than the tank.
 *   · Everything else: the maker's rated tank volume.
 */

export type Fit = "ideal" | "workable" | "no";

export interface GearQuery {
  /** Tank volume in litres. */
  tankL?: number;
  /** Wanted filter/pump flow window in L/h. */
  flowMin?: number;
  flowMax?: number;
  /** Tank length in cm (lights, tanks, stands). */
  lengthCm?: number;
}

export function hasQuery(q: GearQuery): boolean {
  return Boolean(q.tankL || q.flowMin || q.flowMax || q.lengthCm);
}

/** Which query inputs make sense for each category. */
export const CATEGORY_QUERY: Record<
  GearCategory,
  ReadonlyArray<"tank" | "flow" | "length">
> = {
  aquariums: ["tank", "length"],
  filters: ["tank", "flow"],
  lights: ["length"],
  co2: ["tank"],
  heaters: ["tank"],
  cooling: ["tank"],
  pumps: ["flow", "tank"],
  "air-pumps": ["tank"],
  sterilisers: ["tank"],
  plumbing: ["tank"],
  stands: ["length"],
  paludarium: [],
  tools: [],
  feeders: [],
  hardscape: [],
};

const RANK: Record<Fit, number> = { ideal: 2, workable: 1, no: 0 };

function worst(a: Fit, b: Fit): Fit {
  return RANK[a] <= RANK[b] ? a : b;
}

function ratedVolumeFit(m: GearModel, tankL: number): Fit | null {
  if (!m.tankMaxL && !m.tankMinL) return null;
  const max = m.tankMaxL ?? Infinity;
  const min = m.tankMinL ?? 0;
  if (tankL > max * 1.1 || tankL < min * 0.8) return "no";
  if (m.tankMaxL && m.tankMaxL > tankL * 4 && !m.tankMinL) return "workable";
  return "ideal";
}

function filterFlowFit(flow: number, tankL: number): Fit {
  const t = flow / tankL;
  if (t >= 5 && t <= 12) return "ideal";
  if (t >= 3.5 && t <= 16) return "workable";
  return "no";
}

function flowWindowFit(flow: number, q: GearQuery): Fit | null {
  if (!q.flowMin && !q.flowMax) return null;
  const lo = q.flowMin ?? 0;
  const hi = q.flowMax ?? Infinity;
  if (flow >= lo && flow <= hi * 1.35) return "ideal";
  if (flow >= lo * 0.8 && flow <= hi * 1.8) return "workable";
  return "no";
}

function heaterFit(m: GearModel, tankL: number): Fit | null {
  const rated = ratedVolumeFit(m, tankL);
  if (rated) return rated;
  if (!m.heaterW) return null;
  const wpl = m.heaterW / tankL;
  // Tiny tanks: small heaters are sold in 10–25 W steps, be lenient.
  if (tankL <= 20 && m.heaterW <= 25) return "ideal";
  if (wpl >= 0.6 && wpl <= 1.6) return "ideal";
  if (wpl >= 0.4 && wpl <= 2.5) return "workable";
  return "no";
}

function lightFit(m: GearModel, len: number): Fit | null {
  if (m.fitsLengthMinCm || m.fitsLengthMaxCm) {
    const lo = m.fitsLengthMinCm ?? m.fitsLengthMaxCm!;
    const hi = m.fitsLengthMaxCm ?? m.fitsLengthMinCm!;
    // A light made for exactly 60 cm still suits 60–65 cm tanks.
    if (len >= lo - 2 && len <= hi + 5) return "ideal";
    if (len >= lo - 8 && len <= hi + 15) return "workable";
    return "no";
  }
  if (m.lengthCm) {
    if (m.lengthCm <= len + 2 && m.lengthCm >= len * 0.8) return "ideal";
    if (m.lengthCm <= len + 8 && m.lengthCm >= len * 0.6) return "workable";
    return "no";
  }
  return null;
}

function tankSizeFit(m: GearModel, q: GearQuery): Fit | null {
  let fit: Fit | null = null;
  if (q.tankL && m.volumeL) {
    const r = m.volumeL / q.tankL;
    fit = r >= 0.85 && r <= 1.2 ? "ideal" : r >= 0.65 && r <= 1.5 ? "workable" : "no";
  }
  if (q.lengthCm && m.lengthCm) {
    const d = Math.abs(m.lengthCm - q.lengthCm);
    const f: Fit = d <= 5 ? "ideal" : d <= 12 ? "workable" : "no";
    fit = fit ? worst(fit, f) : f;
  }
  return fit;
}

function standFit(m: GearModel, len: number): Fit | null {
  const l = m.fitsLengthMaxCm ?? m.lengthCm;
  if (!l) return null;
  if (l >= len && l <= len + 8) return "ideal";
  if (l >= len - 2 && l <= len + 20) return "workable";
  return "no";
}

/**
 * How well one model fits the query. Returns null when the model has no
 * data the query can be judged on (the UI then shows it as "not rated"
 * rather than hiding it silently).
 */
export function modelFit(
  category: GearCategory,
  m: GearModel,
  q: GearQuery,
): Fit | null {
  switch (category) {
    case "filters": {
      let fit: Fit | null = null;
      if (m.flowLph && q.tankL) fit = filterFlowFit(m.flowLph, q.tankL);
      if (m.flowLph) {
        const w = flowWindowFit(m.flowLph, q);
        if (w) fit = fit ? worst(fit, w) : w;
      }
      if (q.tankL) {
        const r = ratedVolumeFit(m, q.tankL);
        if (r) fit = fit ? (r === "no" ? "no" : fit) : r;
      }
      return fit;
    }
    case "pumps": {
      let fit: Fit | null = null;
      if (m.flowLph) fit = flowWindowFit(m.flowLph, q);
      if (q.tankL) {
        const r = ratedVolumeFit(m, q.tankL);
        if (r) fit = fit ? worst(fit, r) : r;
      }
      return fit;
    }
    case "heaters":
      return q.tankL ? heaterFit(m, q.tankL) : null;
    case "lights":
      return q.lengthCm ? lightFit(m, q.lengthCm) : null;
    case "aquariums":
      return tankSizeFit(m, q);
    case "stands":
      return q.lengthCm ? standFit(m, q.lengthCm) : null;
    case "co2":
    case "cooling":
    case "air-pumps":
    case "sterilisers":
    case "plumbing":
      return q.tankL ? ratedVolumeFit(m, q.tankL) : null;
    default:
      return null;
  }
}

export interface ProductFit {
  fit: Fit | null;
  /** Names of the models that fit best. */
  models: string[];
}

/** Best fit across a product's models. */
export function productFit(
  category: GearCategory,
  models: ReadonlyArray<GearModel>,
  q: GearQuery,
): ProductFit {
  let best: Fit | null = null;
  let names: string[] = [];
  for (const m of models) {
    const f = modelFit(category, m, q);
    if (f === null) continue;
    if (best === null || RANK[f] > RANK[best]) {
      best = f;
      names = f === "no" ? [] : [m.name];
    } else if (f === best && f !== "no") {
      names.push(m.name);
    }
  }
  return { fit: best, models: names };
}

/** Typical tank length for a volume, used when only litres are known. */
export function typicalLengthForLitres(litres: number): number {
  const table: ReadonlyArray<[number, number]> = [
    [10, 25],
    [20, 30],
    [30, 36],
    [45, 45],
    [60, 60],
    [90, 75],
    [120, 80],
    [180, 90],
    [240, 120],
    [350, 150],
    [600, 180],
  ];
  let best = table[0];
  for (const row of table) {
    if (Math.abs(row[0] - litres) < Math.abs(best[0] - litres)) best = row;
  }
  return best[1];
}

/** Recommended rated-flow window for a planted tank of this volume. */
export function recommendedFlow(litres: number): { min: number; max: number } {
  return {
    min: Math.round((litres * 5) / 10) * 10,
    max: Math.round((litres * 10) / 10) * 10,
  };
}

/** Recommended heater wattage band for this volume. */
export function recommendedHeaterW(litres: number): { min: number; max: number } {
  return {
    min: Math.max(10, Math.round(litres * 0.8)),
    max: Math.max(25, Math.round(litres * 1.5)),
  };
}

/** Parse a gear query from URL search params (tank, flow, length). */
export function parseGearQuery(sp: {
  get(name: string): string | null;
}): GearQuery {
  const num = (s: string | null) => {
    if (!s) return undefined;
    const n = Number(s);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const q: GearQuery = {
    tankL: num(sp.get("tank")),
    lengthCm: num(sp.get("length")),
  };
  const flow = sp.get("flow");
  if (flow) {
    const [a, b] = flow.split("-");
    q.flowMin = num(a);
    q.flowMax = num(b ?? null);
  }
  return q;
}

/** Build a category URL with a query. */
export function gearHref(category: GearCategory, q: GearQuery = {}): string {
  const sp = new URLSearchParams();
  if (q.tankL) sp.set("tank", String(q.tankL));
  if (q.flowMin || q.flowMax)
    sp.set(
      "flow",
      q.flowMax ? `${q.flowMin ?? 0}-${q.flowMax}` : String(q.flowMin),
    );
  if (q.lengthCm) sp.set("length", String(q.lengthCm));
  const qs = sp.toString();
  return qs ? `/gear/${category}?${qs}` : `/gear/${category}`;
}
