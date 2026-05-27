import { fish } from "./fish";
import { plants } from "./plants";
import { shrimp } from "./shrimp";
import { mosses } from "./mosses";
import { snails } from "./snails";
import { IMAGE_ATTRIBUTION } from "./image-attribution";
import { getGallery } from "./image-gallery";
import { cleanAuthor } from "@/lib/wikimedia";
import type {
  CatalogueCategory,
  CatalogueEntry,
  FishEntry,
  PlantEntry,
  ShrimpEntry,
  MossEntry,
  SnailEntry,
  ImageAttribution,
} from "@/types/catalogue";

export { fish, plants, shrimp, mosses, snails };

function categoryForSlug(slug: string): CatalogueCategory | undefined {
  if (fish.some((f) => f.slug === slug)) return "fish";
  if (plants.some((p) => p.slug === slug)) return "plants";
  if (shrimp.some((s) => s.slug === slug)) return "shrimp";
  if (mosses.some((m) => m.slug === slug)) return "mosses";
  if (snails.some((s) => s.slug === slug)) return "snails";
  return undefined;
}

function entryName(
  slug: string,
): { commonName: string; scientificName: string } | undefined {
  const all: ReadonlyArray<CatalogueEntry> = [
    ...fish,
    ...plants,
    ...shrimp,
    ...mosses,
    ...snails,
  ];
  const hit = all.find((e) => e.slug === slug);
  if (!hit) return undefined;
  return {
    commonName: hit.commonName,
    scientificName: hit.scientificName,
  };
}

export function getImage(slug: string): ImageAttribution | undefined {
  const legacy = IMAGE_ATTRIBUTION[slug];
  if (legacy) return legacy;

  // Fallback: synthesize an ImageAttribution from the first gallery image
  // (auto-fetched + manual merged).
  const gallery = getGallery(slug);
  if (gallery.length === 0) return undefined;
  const lead = gallery[0];
  const names = entryName(slug);
  const category = categoryForSlug(slug);
  if (!names || !category) return undefined;

  return {
    slug,
    category,
    src: lead.url,
    alt: `${names.commonName} (${names.scientificName})`,
    license: lead.license || undefined,
    licenseUrl: lead.licenseUrl || undefined,
    author: cleanAuthor(lead.author),
    credit: lead.credit || undefined,
    fileTitle: lead.fileTitle || undefined,
    descriptionUrl: lead.descriptionUrl || undefined,
  };
}

export const allEntries: ReadonlyArray<CatalogueEntry> = [
  ...fish,
  ...plants,
  ...shrimp,
  ...mosses,
  ...snails,
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
    case "snails":
      return snails;
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
export function findSnail(slug: string): SnailEntry | undefined {
  return snails.find((s) => s.slug === slug);
}
