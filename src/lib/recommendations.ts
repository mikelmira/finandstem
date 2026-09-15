/**
 * Which recommended products attach to which content.
 *
 * Deliberately sparse: a product is listed against a page only where it does
 * the specific job that page is about. Algae types with no suitable treatment
 * (green spot, cyanobacteria, diatoms, green water) are absent on purpose, so
 * the recommendation never turns into a shoehorned advert.
 */

/** Algae slug -> product ids. Only the algae a spot treatment actually helps. */
export const ALGAE_PRODUCTS: Record<string, string[]> = {
  "black-beard-algae": ["apt-fix", "apt-fixlite"],
  "staghorn-algae": ["apt-fix", "apt-fixlite"],
  "hair-algae": ["apt-fix", "apt-fixlite"],
  "fuzz-algae": ["apt-fix", "apt-fixlite"],
  cladophora: ["apt-fix", "apt-fixlite"],
};

/** Ready-made dosing options, shown on the fertiliser dosing calculator. */
export const DOSING_PRODUCTS = ["apt3", "apt-ei", "apt1"];

/**
 * Plant-deficiency slug -> the product that actually addresses it, plus a
 * heading. Macro and micro shortages are fixed by an all-in-one fertiliser;
 * calcium and magnesium are a remineralisation job in soft or RO water; CO2 is
 * a gear-and-technique fix with no bottled product, so it is absent here.
 */
/**
 * Disease slug -> product, only where a product genuinely treats it. Most
 * fish disease is medication and husbandry, which we don't sell, so those are
 * absent on purpose. Shrimp molting failure is a remineralisation fix, which a
 * shrimp remineraliser addresses directly.
 */
export const DISEASE_PRODUCTS: Record<
  string,
  { ids: string[]; heading: string }
> = {
  "shrimp-failed-molt": {
    ids: ["apt-sky-plus", "apt-sky"],
    heading: "Remineralising for healthy molts",
  },
};

export const DEFICIENCY_PRODUCTS: Record<
  string,
  { ids: string[]; heading: string }
> = {
  "nitrogen-deficiency": { ids: ["apt3", "apt-ei"], heading: "Fixing it with an all-in-one fertiliser" },
  "phosphorus-deficiency": { ids: ["apt3", "apt-ei"], heading: "Fixing it with an all-in-one fertiliser" },
  "potassium-deficiency": { ids: ["apt3", "apt-ei"], heading: "Fixing it with an all-in-one fertiliser" },
  "iron-deficiency": { ids: ["apt3", "apt-ei"], heading: "Fixing it with a complete fertiliser" },
  "magnesium-deficiency": { ids: ["apt-sky-plus"], heading: "Remineralising to fix it" },
  "calcium-deficiency": { ids: ["apt-sky-plus"], heading: "Remineralising to fix it" },
};

/**
 * Substrate detail pages, keyed by substrate category. Aquasoil tanks get the
 * new-tank starter; inert substrates get the root feed, since they don't feed
 * roots on their own.
 */
export function substrateRecommendation(
  category: string,
): { ids: string[]; heading: string } | null {
  if (category === "active-aquasoil") {
    return { ids: ["apt-start"], heading: "Starting a new aquasoil tank" };
  }
  if (
    category === "inert-sand" ||
    category === "inert-nutrient" ||
    category === "additive-or-base-layer"
  ) {
    return { ids: ["apt-jazz"], heading: "Feeding roots in an inert substrate" };
  }
  return null;
}
