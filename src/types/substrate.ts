/**
 * Substrate catalogue types — substrates are a separate top-level
 * category alongside fish / plants / shrimp / mosses / snails, but
 * they live OUTSIDE the existing `CatalogueEntry` union so the
 * planner and compatibility tools never see them.
 *
 * The compare tool is the only consumer that crosses this boundary,
 * via the new `CompareEntry` union exported from `@/types/catalogue`.
 */

export type SubstrateCategory =
  | "active-aquasoil"
  | "inert-nutrient"
  | "inert-sand"
  | "additive-or-base-layer";

export type PhEffect =
  | "lowers-strong"
  | "lowers-gentle"
  | "neutral"
  | "raises";

export type KhEffect =
  | "lowers-strong"
  | "lowers-gentle"
  | "neutral"
  | "raises";

export type AmmoniaRelease =
  | "none"
  | "very-light"
  | "light"
  | "moderate"
  | "strong";

export interface SubstrateEntry {
  /** "substrate-001"-style stable identifier. */
  id: string;
  /** URL slug, unique. */
  slug: string;
  /** Display name including brand if relevant. */
  name: string;
  brand: string;
  category: SubstrateCategory;
  countryOfOrigin: string;
  colour: string;
  /** Grain size as a human-readable range, e.g. "2 to 5 mm". */
  grainSize: string;
  /** Target pH range as a human-readable string, e.g. "5.8 to 6.2". */
  phTarget: string;
  phEffect: PhEffect;
  khEffect: KhEffect;
  ammoniaRelease: AmmoniaRelease;
  /** Free text: "Very high" / "High" / "Medium" / "Low" / "None". */
  nutrientContent: string;
  /** "18 to 24 months", "Permanent", etc. */
  bufferingLongevity: string;
  /** "Tap water tolerable", "RO + remineraliser preferred", etc. */
  recommendedWater: string;
  /** Range string in USD: "$35 to $50 per 9L bag". */
  typicalPriceUsd: string;
  /** 1 to 5. */
  difficulty: number;
  /** Free-text array of typical use cases. */
  bestFor: ReadonlyArray<string>;
  /** Whether this substrate is safe for dwarf shrimp. */
  shrimpSafe: boolean;
  /** Care summary, ~80 to 120 words. */
  careSummary: string;
  /** Long-form sections used by the detail page. */
  sections: {
    howItWorks: string;
    bestUseCases: string;
    commonMistakes: string;
    proTips: string;
  };
  /** Sources cited on the detail page. */
  sources: ReadonlyArray<{ label: string; url: string }>;
  publishedAt: string;
  updatedAt: string;
}

/** Human-readable labels for the four substrate categories. */
export const SUBSTRATE_CATEGORY_LABEL: Record<SubstrateCategory, string> = {
  "active-aquasoil": "Active aquasoil",
  "inert-nutrient": "Inert nutrient",
  "inert-sand": "Inert sand & gravel",
  "additive-or-base-layer": "Additive / base layer",
};

/** Human-readable labels for the discriminated enum fields. */
export const PH_EFFECT_LABEL: Record<PhEffect, string> = {
  "lowers-strong": "Lowers (strong)",
  "lowers-gentle": "Lowers (gentle)",
  neutral: "Neutral",
  raises: "Raises",
};

export const KH_EFFECT_LABEL: Record<KhEffect, string> = {
  "lowers-strong": "Lowers (strong)",
  "lowers-gentle": "Lowers (gentle)",
  neutral: "Neutral",
  raises: "Raises",
};

export const AMMONIA_RELEASE_LABEL: Record<AmmoniaRelease, string> = {
  none: "None",
  "very-light": "Very light",
  light: "Light",
  moderate: "Moderate",
  strong: "Strong",
};
