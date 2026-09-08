/**
 * Recommended products, currently the 2HR Aquarist APT range.
 *
 * These are woven into the guidance where they genuinely help a reader do the
 * thing a page is teaching (treating an algae, dosing a tank, remineralising RO
 * water), not bolted on as adverts. The copy describes what each product does
 * and when you would reach for it, in our own words, so the mention earns its
 * place whether or not the reader ever clicks.
 *
 * `href` is the affiliate link. For the three products whose links arrived with
 * analytics params containing a personal email, only the `bg_ref` referral code
 * (the part that credits the sale) is kept. `image` is a local copy of the
 * product photo from the 2HR store, used under the affiliate relationship.
 * `href` is null for products whose affiliate link has not been supplied yet;
 * while null the product is named as plain text rather than linked.
 */

export interface Product {
  id: string;
  /** Short display name, e.g. "APT Fix". */
  name: string;
  brand: string;
  /**
   * What it does and when you'd reach for it, in our voice. One or two plain
   * sentences. This is the value, not a sales line.
   */
  blurb: string;
  /** Affiliate link. Null until the real link is provided. */
  href: string | null;
  /** Local product photo path, or null if we don't have one. */
  image: string | null;
  /** Public product page, for reference. Not rendered. */
  productUrl: string;
}

const BRAND = "2HR Aquarist";
const shop = (handle: string) => `https://2hraquarist.com/products/${handle}`;
const img = (id: string) => `/images/products/2hr/${id}.webp`;

export const PRODUCTS: Record<string, Product> = {
  "apt3": {
    id: "apt3",
    name: "APT3",
    brand: BRAND,
    blurb:
      "An all-in-one liquid fertiliser covering macro, micro and trace in one bottle, so you dose one thing daily instead of mixing dry salts. A sensible default for a CO2 tank with a normal fish load.",
    href: "https://www.2hraquarist.com/products/apt3?bg_ref=f5HwagCc30",
    image: img("apt3"),
    productUrl: shop("apt3"),
  },
  "apt-ei": {
    id: "apt-ei",
    name: "APT EI",
    brand: BRAND,
    blurb:
      "The Estimative Index dosing approach ready-made: generous, non-limiting nutrients for fast-growing high-tech tanks, without weighing out salts yourself.",
    href: "https://www.2hraquarist.com/wgozz9",
    image: img("apt-ei"),
    productUrl: shop("aptei"),
  },
  "apt1": {
    id: "apt1",
    name: "APT1",
    brand: BRAND,
    blurb:
      "The same micro and trace profile as APT3 but with no added nitrate or phosphate, for tanks where a heavy fish load already supplies those. Reach for it if nitrate keeps creeping up.",
    href: "https://www.2hraquarist.com/kipljl",
    image: img("apt1"),
    productUrl: shop("apt1"),
  },
  "apt-jazz": {
    id: "apt-jazz",
    name: "APT Jazz",
    brand: BRAND,
    blurb:
      "A slow-release root feed: substrate-bound nitrogen for hungry root feeders like swords and crypts. It works alongside a liquid fertiliser rather than replacing it.",
    href: "https://www.2hraquarist.com/ntuwyw",
    image: img("apt-jazz"),
    productUrl: shop("2hr-aquarist-apt-jazz"),
  },
  "apt-feast": {
    id: "apt-feast",
    name: "APT Feast",
    brand: BRAND,
    blurb:
      "A nutrient-rich aquasoil that feeds roots and softens water for roughly the first year. It is a full substrate, not an additive.",
    href: "https://www.2hraquarist.com/8rhlxr",
    image: img("apt-feast"),
    productUrl: shop("apt-feast"),
  },
  "apt-start": {
    id: "apt-start",
    name: "APT Start",
    brand: BRAND,
    blurb:
      "A one-off new-tank starter: substrate enrichment plus starter bacteria to help the first cycle settle faster. Used once at setup.",
    href: "https://www.2hraquarist.com/8wjgc5",
    image: img("apt-start"),
    productUrl: shop("2hr-aquarist-apt-start"),
  },
  "apt-balance": {
    id: "apt-balance",
    name: "APT Balance",
    brand: BRAND,
    blurb:
      "Beneficial bacteria dosed into a fresh or unsettled aquasoil tank to speed up nitrification and steady the early weeks.",
    href: null,
    image: img("apt-balance"),
    productUrl: shop("2hr-aquarist-apt-balance"),
  },
  "apt-fix": {
    id: "apt-fix",
    name: "APT Fix",
    brand: BRAND,
    blurb:
      "A spot treatment for stubborn algae, especially black beard, staghorn and the stringy or fuzzy filamentous types. You dose it straight onto the algae with the flow off, and it biodegrades.",
    href: "https://www.2hraquarist.com/products/aptfix?bg_ref=f5HwagCc30",
    image: img("apt-fix"),
    productUrl: shop("aptfix"),
  },
  "apt-fixlite": {
    id: "apt-fixlite",
    name: "APT FixLite",
    brand: BRAND,
    blurb:
      "A gentler version of the spot treatment for tanks with mosses, liverworts or vallisneria, which full-strength treatments can knock back.",
    href: "https://www.2hraquarist.com/products/2hr-aquarist-fixlite?bg_ref=f5HwagCc30",
    image: img("apt-fixlite"),
    productUrl: shop("2hr-aquarist-fixlite"),
  },
  "apt-pure": {
    id: "apt-pure",
    name: "APT Pure",
    brand: BRAND,
    blurb:
      "A concentrated dechlorinator that removes chlorine and chloramine and binds ammonia, nitrite and heavy metals at a water change.",
    href: null,
    image: img("apt-pure"),
    productUrl: shop("aptpure"),
  },
  "apt-sky": {
    id: "apt-sky",
    name: "APT Sky",
    brand: BRAND,
    blurb:
      "Remineralises RO or RODI water back to a usable GH without pushing KH or pH up, for soft-water tanks and shrimp started from pure water.",
    href: null,
    image: img("apt-sky"),
    productUrl: shop("2hr-aquarist-apt-sky"),
  },
  "apt-sky-plus": {
    id: "apt-sky-plus",
    name: "APT Sky Plus",
    brand: BRAND,
    blurb:
      "Like APT Sky, but nudges KH to about 2 and pH into the low 7s, for tanks mixing harder-water plants or neocaridina shrimp with soft-water plants.",
    href: null,
    image: img("apt-sky-plus"),
    productUrl: shop("2hr-aquarist-apt-sky-plus"),
  },
  "apt-dew": {
    id: "apt-dew",
    name: "APT Dew",
    brand: BRAND,
    blurb:
      "A foliar nutrient spray for emersed growth: mosses, terrariums, paludariums and the dry-start phase before a tank is flooded.",
    href: "https://www.2hraquarist.com/pto1iy",
    image: img("apt-dew"),
    productUrl: shop("2hr-aquarist-apt-dew"),
  },
};

export function getProduct(id: string): Product | undefined {
  return PRODUCTS[id];
}

/** True once at least one product in the set has a live link. */
export function anyLinked(ids: string[]): boolean {
  return ids.some((id) => PRODUCTS[id]?.href);
}
