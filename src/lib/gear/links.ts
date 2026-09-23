import type { GearCategory } from "@/types/gear";
import type { GearQuery } from "@/lib/gear/match";

/**
 * Where content pages point into the gear catalogue. Keyed "<section>:<slug>"
 * (e.g. "deficiencies:iron-deficiency"). Products are gear ids; categories
 * render as "browse" links, optionally filtered by subtype or tank query.
 * Only link gear that genuinely helps with the page's problem.
 */
export interface GearLinkSet {
  heading: string;
  products: string[];
  categories: { category: GearCategory; label: string; type?: string; query?: GearQuery }[];
}

export const GEAR_LINKS: Record<string, GearLinkSet> = {
  // Plant deficiencies: the fertilisers that supply the missing nutrient.
  "deficiencies:nitrogen-deficiency": {
    heading: "Fertilisers that supply nitrogen",
    products: ["ada-green-brighty-nitrogen", "2hr-aquarist-apt3", "2hr-aquarist-apt-jazz"],
    categories: [{ category: "fertilisers", label: "All fertilisers" }],
  },
  "deficiencies:phosphorus-deficiency": {
    heading: "Fertilisers that supply phosphorus",
    products: ["2hr-aquarist-apt3", "2hr-aquarist-apt-ei"],
    categories: [{ category: "fertilisers", label: "All-in-one fertilisers", type: "all-in-one" }],
  },
  "deficiencies:potassium-deficiency": {
    heading: "Fertilisers that supply potassium",
    products: ["ada-green-brighty-neutral-k", "2hr-aquarist-apt1", "2hr-aquarist-apt3"],
    categories: [{ category: "fertilisers", label: "All fertilisers" }],
  },
  "deficiencies:iron-deficiency": {
    heading: "Fertilisers that supply iron",
    products: ["ada-green-brighty-iron", "ada-eca-plus", "2hr-aquarist-apt1"],
    categories: [{ category: "fertilisers", label: "Single-nutrient bottles", type: "single-nutrient" }],
  },
  "deficiencies:magnesium-deficiency": {
    heading: "Products that supply magnesium",
    products: ["2hr-aquarist-apt-sky", "2hr-aquarist-apt-sky-plus", "2hr-aquarist-apt3"],
    categories: [{ category: "fertilisers", label: "Remineralisers", type: "remineraliser" }],
  },
  "deficiencies:calcium-deficiency": {
    heading: "Remineralisers that supply calcium and magnesium",
    products: ["2hr-aquarist-apt-sky-plus", "2hr-aquarist-apt-sky"],
    categories: [{ category: "fertilisers", label: "Remineralisers", type: "remineraliser" }],
  },
  "deficiencies:co2-deficiency": {
    heading: "Adding CO2",
    products: ["uns-nano-co2-kit", "uns-pro-co2-kit", "uns-co2-diffuser"],
    categories: [{ category: "co2", label: "All CO2 gear" }],
  },

  // Algae: treatments and the gear that removes the cause.
  "algae:black-beard-algae": {
    heading: "Treating it and steadying CO2",
    products: ["2hr-aquarist-apt-fix", "2hr-aquarist-apt-fixlite"],
    categories: [
      { category: "co2", label: "CO2 regulators and diffusers" },
      { category: "fertilisers", label: "Algae treatments", type: "algae-treatment" },
    ],
  },
  "algae:staghorn-algae": {
    heading: "Spot treatments",
    products: ["2hr-aquarist-apt-fix", "2hr-aquarist-apt-fixlite"],
    categories: [{ category: "fertilisers", label: "Algae treatments", type: "algae-treatment" }],
  },
  "algae:hair-algae": {
    heading: "Spot treatments",
    products: ["2hr-aquarist-apt-fix", "2hr-aquarist-apt-fixlite"],
    categories: [{ category: "fertilisers", label: "Algae treatments", type: "algae-treatment" }],
  },
  "algae:fuzz-algae": {
    heading: "Spot treatments",
    products: ["2hr-aquarist-apt-fix", "2hr-aquarist-apt-fixlite"],
    categories: [{ category: "fertilisers", label: "Algae treatments", type: "algae-treatment" }],
  },
  "algae:cladophora": {
    heading: "Spot treatments",
    products: ["2hr-aquarist-apt-fix", "2hr-aquarist-apt-fixlite"],
    categories: [{ category: "fertilisers", label: "Algae treatments", type: "algae-treatment" }],
  },
  "algae:green-water": {
    heading: "UV clarifiers clear green water",
    products: ["eheim-reeflexuv", "eheim-reeflexuv-plus-e", "oase-cleartronic"],
    categories: [{ category: "sterilisers", label: "All UV and sterilisers", type: "uv" }],
  },
  "algae:surface-film": {
    heading: "Surface skimmers remove the film",
    products: ["eheim-skim350", "juwel-eccoskim", "uns-delta-mini-surface-skimmer"],
    categories: [{ category: "plumbing", label: "All surface skimmers", type: "surface-skimmer" }],
  },
  "algae:green-spot-algae": {
    heading: "Keeping phosphate topped up",
    products: ["2hr-aquarist-apt3", "2hr-aquarist-apt-ei"],
    categories: [{ category: "fertilisers", label: "All-in-one fertilisers", type: "all-in-one" }],
  },

  // Water and setup pages.
  "page:water-chemistry": {
    heading: "Remineralisers and water conditioners",
    products: ["2hr-aquarist-apt-sky", "2hr-aquarist-apt-sky-plus", "2hr-aquarist-apt-pure"],
    categories: [
      { category: "fertilisers", label: "Remineralisers", type: "remineraliser" },
      { category: "fertilisers", label: "Water conditioners", type: "conditioner" },
    ],
  },
  "page:aquarium-cycling": {
    heading: "Starter bacteria and filtration",
    products: ["2hr-aquarist-apt-start", "2hr-aquarist-apt-balance"],
    categories: [
      { category: "fertilisers", label: "Starters and bacteria", type: "bacteria" },
      { category: "filters", label: "Filters by tank size" },
    ],
  },
  "calculators:fertiliser-dosing": {
    heading: "Fertilisers to dose",
    products: ["2hr-aquarist-apt3", "2hr-aquarist-apt-ei", "ada-green-brighty-mineral"],
    categories: [{ category: "fertilisers", label: "Compare all fertilisers" }],
  },
  "calculators:co2": {
    heading: "CO2 gear",
    products: ["uns-nano-co2-kit", "uns-pro-co2-kit", "uns-drop-checker"],
    categories: [{ category: "co2", label: "All CO2 gear" }],
  },
};

export function gearCategoryHref(c: {
  category: GearCategory;
  type?: string;
  query?: GearQuery;
}): string {
  const sp = new URLSearchParams();
  if (c.type) sp.set("type", c.type);
  if (c.query?.tankL) sp.set("tank", String(c.query.tankL));
  if (c.query?.lengthCm) sp.set("length", String(c.query.lengthCm));
  const qs = sp.toString();
  return qs ? `/gear/${c.category}?${qs}` : `/gear/${c.category}`;
}
