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
