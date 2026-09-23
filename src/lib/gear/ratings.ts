import type { GearCategory } from "@/types/gear";

/**
 * Labels for the 1-5 ratings. Price is the same everywhere; the second
 * rating is whatever matters most in that category. Method: see
 * scripts/gear/ratings.py and the "How we rate gear" section on /about.
 */
export const PRICE_LABEL = "Price";
export const PRICE_WORDS = ["", "Budget", "Value", "Mid-range", "Upper mid-range", "Premium"];

export const METRIC: Record<GearCategory, { label: string; help: string }> = {
  aquariums: { label: "Build and finish", help: "Glass clarity, seams, trim and overall finish" },
  filters: { label: "Build quality", help: "Materials, seals and long-term reliability" },
  lights: { label: "Plant growth power", help: "Output for its size, from watts per cm of fixture" },
  co2: { label: "Build quality", help: "Materials, precision and safety features" },
  fertilisers: { label: "Ease of use", help: "How simple it is to dose and get right" },
  heaters: { label: "Control and safety", help: "Accuracy, display and safety cut-outs" },
  cooling: { label: "Cooling power", help: "How much it can lower the temperature" },
  pumps: { label: "Build quality", help: "Materials, noise and long-term reliability" },
  "air-pumps": { label: "Quietness", help: "How unobtrusive it is in a living space" },
  sterilisers: { label: "Build quality", help: "Materials and long-term reliability" },
  plumbing: { label: "Build and finish", help: "Materials and finish in the tank" },
  stands: { label: "Build and finish", help: "Materials, rigidity and finish" },
  paludarium: { label: "Build quality", help: "Materials and finish" },
  tools: { label: "Build quality", help: "Materials and finish" },
  feeders: { label: "Build quality", help: "Materials and reliability" },
  hardscape: { label: "Soft-water safety", help: "5 = inert, 1 = raises hardness and pH" },
};

export const RATINGS_DISCLAIMER =
  "Ratings are Fin & Stem estimates based on typical retail prices, brand positioning and published specs, not lab testing. Prices vary by country and retailer, so treat them as a rough guide.";

export const TECH_LABEL: Record<"low" | "high", string> = {
  low: "Low tech",
  high: "High tech",
};

export function techText(tech?: ReadonlyArray<"low" | "high">): string | null {
  if (!tech || tech.length === 0) return null;
  if (tech.length === 2) return "Low and high tech";
  return TECH_LABEL[tech[0]];
}

export const TECH_HELP =
  "Low tech means no injected CO2 and low to medium light. High tech means injected CO2 and strong light.";
