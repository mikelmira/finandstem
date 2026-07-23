export type CatalogueCategory =
  | "fish"
  | "plants"
  | "shrimp"
  | "mosses"
  | "snails";

export interface ImageAttribution {
  slug: string;
  category: CatalogueCategory;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  license?: string;
  licenseUrl?: string;
  author?: string;
  credit?: string;
  fileTitle?: string;
  descriptionUrl?: string;
  wikipediaUrl?: string;
}

interface CatalogueEntryBase {
  id: string;
  slug: string;
  category: CatalogueCategory;
  commonName: string;
  scientificName: string;
  origin: string;
  difficulty: number;
  careSummary: string;
  imageSourceUrl: string;
  imageLicenseHint: string;
}

export interface FishEntry extends CatalogueEntryBase {
  category: "fish";
  family: string;
  adultSize: string;
  minTankSize: string;
  waterColumn: string;
  temperament: string;
  schooling: string;
  minGroupSize: number;
  diet: string;
  feedingNotes: string;
  tempRange: string;
  phRange: string;
  dghRange: string;
  flowRate: string;
  lifespan: string;
  plantSafe: string;
  shrimpSafe: string;
  breedingDifficulty: string;
  /**
   * Rarity in the hobby on a 1-5 scale.
   *  1 = ubiquitous (every fish shop stocks it, e.g. neon tetra)
   *  2 = common (mainstream shops, regular availability)
   *  3 = uncommon (specialist shops or seasonal availability)
   *  4 = rare (special-order, line-bred morphs, importers only)
   *  5 = very rare (collector species, wild-caught only, F1 imports)
   */
  rarity: 1 | 2 | 3 | 4 | 5;
}

export interface PlantEntry extends CatalogueEntryBase {
  category: "plants";
  family: string;
  plantType: string;
  position: string;
  maxHeight: string;
  light: string;
  co2: string;
  growthRate: string;
  tempRange: string;
  phRange: string;
  dghRange: string;
  flowRate: string;
  substrate: string;
  propagation: string;
}

export interface ShrimpEntry extends CatalogueEntryBase {
  category: "shrimp";
  adultSize: string;
  minTankSize: string;
  colonyMin: number;
  diet: string;
  feedingNotes: string;
  tempRange: string;
  phRange: string;
  dghRange: string;
  flowRate: string;
  tdsRange: string;
  lifespan: string;
  breeding: string;
  algaeEaterRating: number;
  plantSafe: string;
  fishTankSafeWith: string;
}

export interface SnailEntry extends CatalogueEntryBase {
  category: "snails";
  family: string;
  adultSize: string;
  minTankSize: string;
  diet: string;
  feedingNotes: string;
  tempRange: string;
  phRange: string;
  dghRange: string;
  khRange: string;
  flowRate: string;
  lifespan: string;
  breeding: string;
  algaeEaterRating: number;
  plantSafe: string;
  fishTankSafeWith: string;
  shellCalciumDemand: string;
}

export interface MossEntry extends CatalogueEntryBase {
  category: "mosses";
  family: string;
  type: string;
  attachment: string;
  typicalUse: string;
  light: string;
  co2: string;
  growthRate: string;
  tempRange: string;
  phRange: string;
  flowRate: string;
  trimming: string;
}

export type CatalogueEntry =
  | FishEntry
  | PlantEntry
  | ShrimpEntry
  | MossEntry
  | SnailEntry;

export const CATEGORY_META: Record<
  CatalogueCategory,
  {
    label: string;
    singular: string;
    path: string;
    blurb: string;
  }
> = {
  fish: {
    label: "Fish",
    singular: "Fish",
    path: "/fish",
    blurb:
      "Community fish, schoolers, and centrepieces for the planted tank, from chili rasboras to German blue rams.",
  },
  plants: {
    label: "Plants",
    singular: "Plant",
    path: "/plants",
    blurb:
      "Foreground carpets, midground epiphytes, and background stems. Every entry lists light, CO₂, and substrate demand.",
  },
  shrimp: {
    label: "Shrimp",
    singular: "Shrimp",
    path: "/shrimp",
    blurb:
      "Neocaridina and Caridina species, colony minimums, water parameters, breeding notes, and tank-mate safety.",
  },
  mosses: {
    label: "Mosses",
    singular: "Moss",
    path: "/mosses",
    blurb:
      "Java, Christmas, Flame, Phoenix and more. Attachment, trimming cadence, and what each one is actually for.",
  },
  snails: {
    label: "Snails",
    singular: "Snail",
    path: "/snails",
    blurb:
      "Nerites, mystery snails, assassins, rabbits and more. Algae crew, display species, and the ones to avoid, with parameters, breeding, and tank-mate notes.",
  },
};

/* ─── Compare-tool union ──────────────────────────────────────────────
   `CompareEntry` is the ONLY type that crosses the species/substrate
   boundary. It exists for the compare tool, which supports two
   mutually-exclusive modes (livestock vs substrate). Planner and
   compatibility consume `CatalogueEntry` and therefore never see
   substrates, the type-level lever that enforces the exclusion at
   compile time.
   ────────────────────────────────────────────────────────────────────── */

import type { SubstrateEntry } from "./substrate";

export type CompareEntry = CatalogueEntry | SubstrateEntry;
