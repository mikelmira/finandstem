/**
 * A unified, filterable index of every catalogue species, built once from the
 * normalised entries. It powers the species finder (filter by water and region)
 * and the world map (pins per region). Everything here is plain, serialisable
 * data so it can be handed straight to client components.
 *
 * Continents and biotopes are derived, not hand-tagged: continent from the
 * region coordinates, biotope from the water parameters and flow. That keeps
 * the tools working across all 200+ species without editing every profile.
 */

import { allNorm } from "./normalize";
import { regionsFromOrigin, type OriginRegion } from "./origin-regions";
import { getImage } from "@/data";
import { CATEGORY_META, type CatalogueCategory } from "@/types/catalogue";

export type Continent =
  | "south-america"
  | "north-central-america"
  | "africa"
  | "europe"
  | "south-asia"
  | "southeast-asia"
  | "east-asia"
  | "oceania"
  | "other";

export type Biotope =
  | "blackwater"
  | "softwater"
  | "hardwater"
  | "river"
  | "still"
  | "coldwater";

export interface NumRange {
  min: number;
  max: number;
}

export interface SpeciesRecord {
  slug: string;
  category: CatalogueCategory;
  categoryLabel: string;
  commonName: string;
  scientificName: string;
  href: string;
  image: string | null;
  origin: string;
  ph: NumRange | null;
  gh: NumRange | null;
  temp: NumRange | null;
  flowHigh: boolean;
  flowLow: boolean;
  regionIds: string[];
  continents: Continent[];
  biotopes: Biotope[];
}

export const CONTINENT_LABELS: Record<Continent, string> = {
  "south-america": "South America",
  "north-central-america": "North & Central America",
  africa: "Africa",
  europe: "Europe",
  "south-asia": "South Asia",
  "southeast-asia": "Southeast Asia",
  "east-asia": "East Asia",
  oceania: "Oceania & Australia",
  other: "Other / captive-bred",
};

export const BIOTOPE_LABELS: Record<Biotope, string> = {
  blackwater: "Blackwater (soft, acidic)",
  softwater: "Soft water",
  hardwater: "Hard water",
  river: "River / high flow",
  still: "Still / slow water",
  coldwater: "Coldwater / unheated",
};

const CATEGORY_LABELS: Record<CatalogueCategory, string> = {
  fish: "Fish",
  plants: "Plant",
  shrimp: "Shrimp",
  mosses: "Moss",
  snails: "Snail",
};

function continentOf([lng, lat]: [number, number]): Continent {
  if (lng >= 92 && lng <= 145 && lat >= -11 && lat <= 29) return "southeast-asia";
  if (lng >= -85 && lng <= -33 && lat >= -56 && lat <= 13) return "south-america";
  if (lng >= -170 && lng <= -50 && lat > 13 && lat <= 75) return "north-central-america";
  if (lng >= -20 && lng <= 52 && lat >= -35 && lat <= 37) return "africa";
  if (lng >= -12 && lng <= 45 && lat > 37 && lat <= 72) return "europe";
  if (lng >= 110 && lng <= 180 && lat >= -50 && lat < 0) return "oceania";
  if (lng >= 100 && lng <= 150 && lat >= 20 && lat <= 55) return "east-asia";
  if (lng >= 60 && lng <= 100 && lat >= 5 && lat <= 40) return "south-asia";
  if (lng >= 40 && lng <= 150 && lat >= 0 && lat <= 75) return "east-asia";
  return "other";
}

function biotopesOf(
  ph: NumRange | null,
  gh: NumRange | null,
  temp: NumRange | null,
  flowHigh: boolean,
  flowLow: boolean,
): Biotope[] {
  const b = new Set<Biotope>();
  if (ph && ph.max <= 6.8) b.add("blackwater");
  if ((ph && ph.min <= 7.0) || (gh && gh.min <= 6)) b.add("softwater");
  if ((ph && ph.min >= 7.4) || (gh && gh.min >= 10)) b.add("hardwater");
  if (flowHigh) b.add("river");
  if (flowLow && !flowHigh) b.add("still");
  if (temp && temp.min <= 18) b.add("coldwater");
  return [...b];
}

export const SPECIES_INDEX: ReadonlyArray<SpeciesRecord> = allNorm.map((e) => {
  const regions = regionsFromOrigin(e.origin);
  const continents = [
    ...new Set(regions.map((r) => continentOf(r.coords))),
  ] as Continent[];
  const flowHigh = e.flow.includes("High") || e.flow.includes("Very High");
  const flowLow = e.flow.includes("Still") || e.flow.includes("Low");
  const ph = e.phRange;
  const gh = e.dghRange;
  const temp = e.tempRange;
  const img = getImage(e.slug);
  return {
    slug: e.slug,
    category: e.category,
    categoryLabel: CATEGORY_LABELS[e.category],
    commonName: e.commonName,
    scientificName: e.scientificName,
    href: `${CATEGORY_META[e.category].path}/${e.slug}`,
    image: img?.src ?? null,
    origin: e.origin,
    ph: ph ? { min: ph.min, max: ph.max } : null,
    gh: gh ? { min: gh.min, max: gh.max } : null,
    temp: temp ? { min: temp.min, max: temp.max } : null,
    flowHigh,
    flowLow,
    regionIds: regions.map((r) => r.id),
    continents: continents.length ? continents : (["other"] as Continent[]),
    biotopes: biotopesOf(ph, gh, temp, flowHigh, flowLow),
  };
});

/** Region (with coords) plus the species native to it, for the world map. */
export interface RegionWithSpecies {
  region: OriginRegion;
  species: SpeciesRecord[];
}

export function regionsWithSpecies(): RegionWithSpecies[] {
  const byId = new Map<string, RegionWithSpecies>();
  for (const e of allNorm) {
    const rec = SPECIES_INDEX.find((s) => s.slug === e.slug && s.category === e.category);
    if (!rec) continue;
    for (const region of regionsFromOrigin(e.origin)) {
      const existing = byId.get(region.id);
      if (existing) existing.species.push(rec);
      else byId.set(region.id, { region, species: [rec] });
    }
  }
  return [...byId.values()].sort((a, b) => b.species.length - a.species.length);
}

/**
 * Finder presets: named tank types that pre-fill the filters. Each answers a
 * real question, "I want an Amazon tank / a hillstream river tank, what fits?".
 */
export interface FinderPreset {
  id: string;
  label: string;
  blurb: string;
  continents?: Continent[];
  biotopes?: Biotope[];
  ph?: number;
  gh?: number;
  temp?: number;
}

export const FINDER_PRESETS: ReadonlyArray<FinderPreset> = [
  {
    id: "amazon-blackwater",
    label: "Amazon blackwater",
    blurb: "Soft, acidic, tea-stained South American water. Tetras, dwarf cichlids, corydoras.",
    continents: ["south-america"],
    biotopes: ["blackwater"],
    ph: 6.2,
    gh: 3,
    temp: 26,
  },
  {
    id: "southeast-asian-stream",
    label: "Southeast Asian stream",
    blurb: "Gentle, slightly soft water from Asian streams. Rasboras, gouramis, loaches.",
    continents: ["southeast-asia"],
    ph: 6.8,
    gh: 6,
    temp: 25,
  },
  {
    id: "west-african",
    label: "West African",
    blurb: "Soft, warm African waters. Killifish, small characins, kribensis.",
    continents: ["africa"],
    ph: 6.8,
    gh: 6,
    temp: 26,
  },
  {
    id: "hillstream-river",
    label: "Hillstream / river",
    blurb: "Cool, fast, oxygen-rich flowing water. Hillstream loaches, danios, fast swimmers.",
    biotopes: ["river"],
    ph: 7.2,
    gh: 8,
    temp: 22,
  },
  {
    id: "hardwater-community",
    label: "Hard-water community",
    blurb: "Harder, alkaline water. Livebearers like guppies, mollies and platies thrive.",
    biotopes: ["hardwater"],
    ph: 7.8,
    gh: 14,
    temp: 25,
  },
  {
    id: "coldwater-unheated",
    label: "Coldwater / unheated",
    blurb: "A room-temperature tank with no heater. White clouds, hillstream loaches, shrimp.",
    biotopes: ["coldwater"],
    ph: 7.2,
    gh: 8,
    temp: 18,
  },
  {
    id: "shrimp-soft",
    label: "Soft-water shrimp tank",
    blurb: "Cool, soft, stable water for caridina and neocaridina shrimp and their plants.",
    ph: 6.5,
    gh: 6,
    temp: 23,
  },
];
