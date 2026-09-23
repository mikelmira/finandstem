import data from "@/data/gear.generated.json";
import type { GearCard, GearCategory, GearProduct } from "@/types/gear";
import { GEAR_CATEGORY_ORDER } from "@/lib/gear/categories";
import { productFit, type GearQuery } from "@/lib/gear/match";

/**
 * Server-side accessors for the gear catalogue. The generated JSON is
 * only ever imported here (server components), client components get
 * compact `GearCard`s passed as props or fetch /gear-data/<category>.json.
 */
/** Last catalogue refresh; drives sitemap lastmod and JSON-LD dateModified. */
export const GEAR_UPDATED = "2026-09-23";

export const GEAR: ReadonlyArray<GearProduct> = data as unknown as GearProduct[];

const BY_ID = new Map(GEAR.map((p) => [p.id, p]));

export function getGear(id: string): GearProduct | undefined {
  return BY_ID.get(id);
}

export function gearInCategory(category: GearCategory): GearProduct[] {
  return GEAR.filter((p) => p.category === category);
}

export function gearCount(category: GearCategory): number {
  return GEAR.reduce((n, p) => n + (p.category === category ? 1 : 0), 0);
}

export function activeGearCategories(): GearCategory[] {
  return GEAR_CATEGORY_ORDER.filter((c) => gearCount(c) > 0);
}

export function gearPath(p: Pick<GearProduct, "category" | "id">): string {
  return `/gear/${p.category}/${p.id}`;
}

export function gearTitle(p: Pick<GearProduct, "brand" | "name">): string {
  return `${p.brand} ${p.name}`;
}

export function toCard(p: GearProduct): GearCard {
  return {
    id: p.id,
    brand: p.brand,
    name: p.name,
    category: p.category,
    subtype: p.subtype,
    summary: p.summary,
    bestFor: p.bestFor,
    watchOut: p.watchOut,
    highlights: p.highlights,
    specs: p.specs,
    models: p.models,
    image: p.images[0],
    ratings: p.ratings,
    tech: p.tech,
  };
}

/** Products in a category that fit the query, best fit first. */
export function gearMatches(
  category: GearCategory,
  q: GearQuery,
  limit = 6,
): { product: GearProduct; models: string[]; fit: "ideal" | "workable" }[] {
  const rows: { product: GearProduct; models: string[]; fit: "ideal" | "workable" }[] = [];
  for (const p of gearInCategory(category)) {
    const r = productFit(category, p.models, q);
    if (r.fit === "ideal" || r.fit === "workable") {
      rows.push({ product: p, models: r.models, fit: r.fit });
    }
  }
  rows.sort(
    (a, b) =>
      (a.fit === b.fit ? 0 : a.fit === "ideal" ? -1 : 1) ||
      b.product.images.length - a.product.images.length,
  );
  return rows.slice(0, limit);
}

/** Related products: same subtype first, then same category. */
export function relatedGear(p: GearProduct, limit = 4): GearProduct[] {
  const same = GEAR.filter(
    (o) => o.id !== p.id && o.category === p.category && o.subtype === p.subtype,
  );
  const rest = GEAR.filter(
    (o) => o.id !== p.id && o.category === p.category && o.subtype !== p.subtype,
  );
  // Prefer other brands so the list is a genuine comparison.
  const pick = [...same.filter((o) => o.brand !== p.brand), ...same.filter((o) => o.brand === p.brand), ...rest];
  return pick.slice(0, limit);
}

export function hardscapeProductsFor(typeSlug: string): GearProduct[] {
  return GEAR.filter((p) => p.hardscapeType === typeSlug);
}

export function brandsIn(category: GearCategory): string[] {
  return Array.from(new Set(gearInCategory(category).map((p) => p.brand))).sort();
}

/** A small spread across brands for "browse the catalogue" teasers. */
export function featuredGear(category: GearCategory, limit = 3): GearProduct[] {
  const seen = new Set<string>();
  const out: GearProduct[] = [];
  const pool = [...gearInCategory(category)].sort(
    (a, b) => b.images.length - a.images.length || b.models.length - a.models.length,
  );
  for (const p of pool) {
    if (seen.has(p.brand)) continue;
    seen.add(p.brand);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

/** Best representative image for a category (share cards, hub tiles). */
export function categoryImage(category: GearCategory) {
  const pool = gearInCategory(category);
  return (pool.find((p) => p.images.length > 1) ?? pool[0])?.images[0];
}

/** Supplier product whose name best matches each hardscape type. */
const TYPE_PHOTO_PRODUCT: Record<string, string> = {
  "spider-wood": "Spider Wood",
  "lava-rock": "Black Lava Rock",
  "seiryu-stone": "Seiryu Stone",
  slate: "Black Slate",
  "dragon-stone": "Ohko Dragon Stone",
  manzanita: "Manzanita Wood",
};

/**
 * A correctly identified photo for a hardscape type, taken from the supplier
 * product of the same material, with the product it came from.
 */
/** Types whose supplier photo doesn't clearly show the material. */
const TYPE_PHOTO_SKIP = new Set(["cholla-wood"]);

export function hardscapeTypePhoto(typeSlug: string) {
  if (TYPE_PHOTO_SKIP.has(typeSlug)) return null;
  const pool = hardscapeProductsFor(typeSlug);
  const wanted = TYPE_PHOTO_PRODUCT[typeSlug];
  const product = (wanted && pool.find((p) => p.name === wanted)) || pool[0];
  const image = product?.images[0];
  if (!product || !image) return null;
  return {
    src: image.src,
    width: image.width,
    height: image.height,
    alt: `${product.name} from ${product.brand}`,
    productHref: gearPath(product),
    productName: `${product.brand} ${product.name}`,
  };
}
