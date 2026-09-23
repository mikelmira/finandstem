import type { GearModel, GearRatings, TechLevel } from "@/types/gear";
import { modelFit, recommendedFlow, recommendedHeaterW, typicalLengthForLitres, type Fit } from "@/lib/gear/match";

/** One product in /gear-data/planner.json (see scripts/gear/build.py). */
export interface PlannerGear {
  id: string;
  brand: string;
  name: string;
  category: PlannerSlot;
  subtype: string;
  tech?: TechLevel[];
  ratings?: GearRatings;
  thumb: string;
  models: GearModel[];
}

export type PlannerSlot = "filters" | "lights" | "heaters" | "co2" | "fertilisers";

export const PLANNER_SLOTS: ReadonlyArray<{ slot: PlannerSlot; label: string; singular: string; plural: string }> = [
  { slot: "filters", label: "Filter", singular: "filter", plural: "filters" },
  { slot: "lights", label: "Light", singular: "light", plural: "lights" },
  { slot: "heaters", label: "Heater", singular: "heater", plural: "heaters" },
  { slot: "co2", label: "CO2", singular: "CO2 product", plural: "CO2 gear" },
  { slot: "fertilisers", label: "Fertiliser", singular: "fertiliser", plural: "fertilisers" },
];

export interface PickedGear {
  slot: PlannerSlot;
  id: string;
  model: string;
}

/** URL form: gear=filters:eheim-classic:350,lights:twinstar-s-series-ver5:600S */
export function parsePickedGear(raw: string | null): PickedGear[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => {
      const [slot, id, ...rest] = part.split(":");
      return { slot: slot as PlannerSlot, id: id ?? "", model: decodeURIComponent(rest.join(":")) };
    })
    .filter((g) => PLANNER_SLOTS.some((s) => s.slot === g.slot) && g.id);
}

export function serialisePickedGear(items: PickedGear[]): string {
  return items.map((g) => `${g.slot}:${g.id}:${encodeURIComponent(g.model)}`).join(",");
}

export interface GearVerdict {
  tone: "good" | "ok" | "warn" | "bad" | "info";
  text: string;
}

const FIT_TONE: Record<Fit, GearVerdict["tone"]> = { ideal: "good", workable: "ok", no: "bad" };

/**
 * How a chosen product and model suits this tank and these plants.
 * `lightNeed` is the plants' 1-5 light scale, `co2Need` their 1-3 CO2 scale.
 */
export function gearVerdicts(
  product: PlannerGear,
  model: GearModel,
  ctx: { tankL?: number; lightNeed?: number | null; co2Need?: number | null; hasCo2: boolean },
): GearVerdict[] {
  const out: GearVerdict[] = [];
  const { tankL } = ctx;

  if (product.category === "filters") {
    if (tankL && model.flowLph) {
      const fit = modelFit("filters", model, { tankL });
      const t = (model.flowLph / tankL).toFixed(1);
      const rec = recommendedFlow(tankL);
      out.push({
        tone: fit ? FIT_TONE[fit] : "info",
        text:
          fit === "no"
            ? `${model.flowLph} L/h is ${t}× turnover for ${tankL} L; aim for about ${rec.min}–${rec.max} L/h`
            : `${model.flowLph} L/h rated, about ${t}× turnover for ${tankL} L`,
      });
    } else if (!model.flowLph) {
      out.push({ tone: "info", text: "The maker doesn't publish a flow rate for this model" });
    }
    if (ctx.hasCo2 && product.tech && !product.tech.includes("high")) {
      out.push({ tone: "warn", text: "Surface agitation from this type of filter drives off injected CO2; a canister suits a CO2 tank better" });
    }
  }

  if (product.category === "lights") {
    const len = tankL ? typicalLengthForLitres(tankL) : undefined;
    if (len) {
      const fit = modelFit("lights", model, { lengthCm: len });
      if (fit) {
        out.push({
          tone: FIT_TONE[fit],
          text:
            fit === "no"
              ? `Not sized for a ~${len} cm tank, the typical length for ${tankL} L; check your tank's actual length`
              : `Sized for a ~${len} cm tank, the typical length for ${tankL} L`,
        });
      }
    }
    const power = product.ratings?.metric;
    if (power && ctx.lightNeed) {
      if (power <= ctx.lightNeed - 2) {
        out.push({ tone: "bad", text: "Too weak for the most light-hungry plants you've chosen" });
      } else if (power === ctx.lightNeed - 1) {
        out.push({ tone: "warn", text: "On the weak side for your most light-hungry plants; run it at full power or pick a stronger light" });
      } else if (power >= 4 && ctx.lightNeed <= 2) {
        out.push({ tone: "info", text: "Plenty of light for your plants; run it dimmed to avoid algae" });
      } else {
        out.push({ tone: "good", text: "Enough light for the plants you've chosen" });
      }
    }
    if (power && power >= 4 && !ctx.hasCo2 && (ctx.co2Need ?? 1) >= 2) {
      out.push({ tone: "warn", text: "Strong light without CO2 tends to grow algae; add CO2 or keep it dimmed" });
    }
  }

  if (product.category === "heaters" && tankL) {
    const fit = modelFit("heaters", model, { tankL });
    const rec = recommendedHeaterW(tankL);
    if (fit) {
      out.push({
        tone: FIT_TONE[fit],
        text:
          fit === "no"
            ? `Not sized for ${tankL} L; aim for about ${rec.min}–${rec.max} W`
            : model.heaterW
              ? `${model.heaterW} W suits ${tankL} L`
              : `Rated for ${tankL} L`,
      });
    }
  }

  if (product.category === "co2") {
    const fit = tankL ? modelFit("co2", model, { tankL }) : null;
    if (fit) out.push({ tone: FIT_TONE[fit], text: fit === "no" ? `Not rated for ${tankL} L` : `Rated for ${tankL} L` });
    out.push({ tone: "good", text: "Covers plants that want injected CO2" });
  }

  if (product.category === "fertilisers") {
    if (product.tech && !product.tech.includes("low") && !ctx.hasCo2) {
      out.push({ tone: "warn", text: "Aimed at high-tech tanks with CO2; dose lightly without it" });
    } else {
      out.push({ tone: "good", text: "Suits your setup; start with a light dose and adjust to growth" });
    }
  }
  return out;
}
