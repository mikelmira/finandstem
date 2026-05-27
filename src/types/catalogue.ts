export type CatalogueCategory = "fish" | "plants" | "shrimp" | "mosses";

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
  | MossEntry;

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
      "Community fish, schoolers, and centrepieces for the planted tank — from chili rasboras to German blue rams.",
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
      "Neocaridina and Caridina species — colony minimums, water parameters, breeding notes, and tank-mate safety.",
  },
  mosses: {
    label: "Mosses",
    singular: "Moss",
    path: "/mosses",
    blurb:
      "Java, Christmas, Flame, Phoenix and more. Attachment, trimming cadence, and what each one is actually for.",
  },
};
