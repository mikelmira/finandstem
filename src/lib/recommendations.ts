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
