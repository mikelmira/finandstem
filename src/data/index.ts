import { fish } from "./fish";
import { plants } from "./plants";
import { shrimp } from "./shrimp";
import { mosses } from "./mosses";
import { IMAGE_ATTRIBUTION } from "./image-attribution";
import type {
  CatalogueCategory,
  CatalogueEntry,
  FishEntry,
  PlantEntry,
  ShrimpEntry,
  MossEntry,
  ImageAttribution,
} from "@/types/catalogue";

export { fish, plants, shrimp, mosses };

export function getImage(slug: string): ImageAttribution | undefined {
  return IMAGE_ATTRIBUTION[slug];
}

export const allEntries: ReadonlyArray<CatalogueEntry> = [
  ...fish,
  ...plants,
  ...shrimp,
  ...mosses,
];

export function getCategoryEntries(
  category: CatalogueCategory,
): ReadonlyArray<CatalogueEntry> {
  switch (category) {
    case "fish":
      return fish;
    case "plants":
      return plants;
    case "shrimp":
      return shrimp;
    case "mosses":
      return mosses;
  }
}

export function findFish(slug: string): FishEntry | undefined {
  return fish.find((f) => f.slug === slug);
}
export function findPlant(slug: string): PlantEntry | undefined {
  return plants.find((p) => p.slug === slug);
}
export function findShrimp(slug: string): ShrimpEntry | undefined {
  return shrimp.find((s) => s.slug === slug);
}
export function findMoss(slug: string): MossEntry | undefined {
  return mosses.find((m) => m.slug === slug);
}
