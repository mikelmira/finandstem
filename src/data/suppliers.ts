/**
 * Brands and retailers behind the gear catalogue. Brand names must match
 * the `brand` field in the curated gear data exactly so the About page can
 * count products per brand. URLs are the official brand sites (checked
 * 2026-09-23); where a brand has no official site we could confirm, we link
 * the retailer its specs came from.
 */
export interface Supplier {
  brand: string;
  url: string;
  country: string;
  note: string;
  /** Link text when the URL isn't the brand's own site. */
  linkLabel?: string;
}

export const GEAR_BRANDS: ReadonlyArray<Supplier> = [
  {
    brand: "ADA",
    url: "https://www.adana.co.jp/en/",
    country: "Japan",
    note: "Aqua Design Amano, the company behind the Nature Aquarium style. CO2 diffusers, lily pipes, lights and decorative sands.",
  },
  {
    brand: "Boyu",
    url: "http://www.boyuaquarium.com",
    country: "China",
    note: "Large aquarium manufacturer making tanks, filters, pumps, heaters, chillers and lights across a wide price range.",
  },
  {
    brand: "Chihiros",
    url: "https://www.chihiros.com",
    country: "China",
    note: "Planted-tank LED specialist, from WRGB bar lights to tiny spotlights, plus electrolytic algae-control units.",
  },
  {
    brand: "Dophin",
    url: "https://kwzone.com",
    country: "Malaysia",
    linkLabel: "KW Zone website",
    note: "Budget aquarium equipment from KW Zone: filters, air pumps, heaters, pumps and glass tanks.",
  },
  {
    brand: "Eheim",
    url: "https://eheim.com",
    country: "Germany",
    note: "Long-established filter maker known for the Classic and Professionel canisters, plus heaters, pumps and UV.",
  },
  {
    brand: "Juwel",
    url: "https://www.juwel-aquarium.com",
    country: "Germany",
    note: "Complete aquarium sets such as the Rio and Lido lines, with Bioflow filters, heaters and LED lighting.",
  },
  {
    brand: "Oase",
    url: "https://www.oase.com",
    country: "Germany",
    note: "Filters, heaters and optiwhite aquariums including the ScaperLine and HighLine ranges.",
  },
  {
    brand: "Qanvee",
    url: "https://shop.glassaqua.com",
    country: "USA",
    note: "Glass Aqua's own accessory line, sold through Glass Aqua.",
    linkLabel: "Glass Aqua website",
  },
  {
    brand: "SunSun",
    url: "https://www.sunsun-china.com",
    country: "China",
    note: "Maker of the widely sold HW canister filters, plus pumps, air pumps, heaters, lights and large tanks.",
  },
  {
    brand: "Twinstar",
    url: "https://twinstarstore.kr",
    country: "South Korea",
    linkLabel: "Twinstar official store",
    note: "Slim, high-output planted-tank LEDs (E, S and B series) and the Twinstar Nano steriliser.",
  },
  {
    brand: "UNS",
    url: "https://www.ultumnaturesystems.com",
    country: "USA",
    note: "Ultum Nature Systems: rimless tanks, stands, CO2 gear, canister filters and a large range of aquascaping hardscape.",
  },
];

/** Retailers whose listings supplied specs for the catalogue. */
export const GEAR_RETAILERS: ReadonlyArray<{ name: string; url: string; note: string }> = [
  {
    name: "Glass Aqua",
    url: "https://shop.glassaqua.com",
    note: "US retailer. Specs for Chihiros, Twinstar, Qanvee and UNS products.",
  },
  {
    name: "Charterhouse Aquatics",
    url: "https://www.charterhouse-aquatics.com",
    note: "UK retailer. Specs for Eheim, Juwel and Oase products.",
  },
  {
    name: "Twinstar Official Store",
    url: "https://twinstarstore.kr",
    note: "Twinstar's own store, used for current light specs.",
  },
  {
    name: "KW Zone",
    url: "https://kwzone.com",
    note: "Distributor of Dophin equipment, source of Dophin spec sheets.",
  },
];
