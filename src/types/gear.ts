/**
 * Gear catalogue types.
 *
 * Products come from supplier data curated in `scripts/gear/curated/*.json`
 * and are generated into `src/data/gear.generated.ts` by
 * `scripts/gear/build.py`. A product is one product line (e.g. a filter
 * series); its models are the sizes that differ in specs.
 */

export type GearCategory =
  | "aquariums"
  | "filters"
  | "lights"
  | "co2"
  | "fertilisers"
  | "heaters"
  | "cooling"
  | "pumps"
  | "air-pumps"
  | "sterilisers"
  | "plumbing"
  | "stands"
  | "paludarium"
  | "tools"
  | "feeders"
  | "hardscape";

/** Standard numeric fields a model can carry. All metric, all optional. */
export interface GearModelNumbers {
  flowLph?: number;
  headM?: number;
  powerW?: number;
  tankMinL?: number;
  tankMaxL?: number;
  volumeL?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  glassMm?: number;
  mediaL?: number;
  airLpm?: number;
  outlets?: number;
  heaterW?: number;
  uvW?: number;
  lumens?: number;
  kelvin?: number;
  fitsLengthMinCm?: number;
  fitsLengthMaxCm?: number;
  hoseMm?: number;
  weightKg?: number;
  capacityMl?: number;
}

export type GearNumericField = keyof GearModelNumbers;

export interface GearModel extends GearModelNumbers {
  name: string;
  sku?: string;
  /** Anything without a standard field, label → value. */
  extra?: Record<string, string>;
}

export interface GearImage {
  /** Public path, e.g. /images/gear/filters/eheim-classic.webp */
  src: string;
  /** 360px thumbnail, same aspect ratio. */
  thumb: string;
  width: number;
  height: number;
}

export type GearSpecSource = "manufacturer" | "retailer" | "knowledge";

export interface GearProduct {
  id: string;
  brand: string;
  name: string;
  category: GearCategory;
  subtype: string;
  summary: string;
  highlights: string[];
  bestFor: string;
  watchOut?: string;
  specs: Record<string, string>;
  models: GearModel[];
  hardscapeType?: string;
  images: GearImage[];
  sourceUrl?: string;
  sourceName?: string;
  /** Affiliate link (rendered with rel="sponsored" and a disclosure). */
  affiliateUrl?: string;
  specSource: GearSpecSource;
}

/**
 * The compact shape shipped to client components (index filters, compare
 * table). Same as GearProduct but with only the first image and without
 * the long-form arrays the client never renders.
 */
export interface GearCard {
  id: string;
  brand: string;
  name: string;
  category: GearCategory;
  subtype: string;
  summary: string;
  bestFor: string;
  watchOut?: string;
  highlights: string[];
  specs: Record<string, string>;
  models: GearModel[];
  image?: GearImage;
}
