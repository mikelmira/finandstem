// Verified Wikimedia Commons photos for hardscape materials.
// Every entry has been checked by eye to confirm it shows the correct material,
// and is commercial-safe (CC0 / CC-BY / CC-BY-SA / public domain), credited to
// its author with a link back to the source file page on Commons.
//
// Types without a reliable, correctly-licensed photo of the actual aquascaping
// material (seiryu stone, dragon stone / ohko, pagoda stone, texas holey rock,
// spider wood, manzanita, mopani wood) are deliberately left out here and fall
// back to an honest material tile in HardscapeVisual. Vendor product photos are
// all-rights-reserved and are not used: a credit link is attribution, not a
// licence.

export interface HardscapeImage {
  src: string;
  alt: string;
  author?: string;
  license?: string;
  licenseUrl?: string;
  descriptionUrl?: string;
}

export const HARDSCAPE_IMAGES: Record<string, HardscapeImage> = {
  "lava-rock": {
    "alt": "A specimen of black vesicular scoria, the porous volcanic rock sold as aquarium lava rock",
    "author": "B. Domangue",
    "descriptionUrl": "https://commons.wikimedia.org/wiki/File:Scoria_-_Igneous_Rock.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "src": "/images/hardscape/lava-rock.webp"
  },
  "slate": {
    "alt": "A dark grey slate surface showing the flat, layered texture used for stacked aquascapes",
    "author": "Fernando Losada Rodríguez",
    "descriptionUrl": "https://commons.wikimedia.org/wiki/File:Pizarra.002_-_Aquarium_Finisterrae.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "src": "/images/hardscape/slate.webp"
  },
  "petrified-wood": {
    "alt": "A log of petrified wood showing the fossilised wood grain and mineralised core",
    "author": "Jon Sullivan",
    "descriptionUrl": "https://commons.wikimedia.org/wiki/File:PetrifiedWood.jpg",
    "license": "Public domain",
    "licenseUrl": "https://en.wikipedia.org/wiki/Public_domain",
    "src": "/images/hardscape/petrified-wood.webp"
  },
  "cholla-wood": {
    "alt": "The hollow, holey skeleton of a cholla cactus, the woody tube used in shrimp tanks",
    "author": "Saguaro National Park (US National Park Service)",
    "descriptionUrl": "https://commons.wikimedia.org/wiki/File:Cholla_(50618939777).jpg",
    "license": "Public domain",
    "licenseUrl": "https://en.wikipedia.org/wiki/Public_domain",
    "src": "/images/hardscape/cholla-wood.webp"
  },
  "malaysian-driftwood": {
    "alt": "An otocinclus resting on Malaysian driftwood in a planted aquarium",
    "author": "Evan Baldonado",
    "descriptionUrl": "https://commons.wikimedia.org/wiki/File:Otocinclus_Catfish_(Otocinclus_sp.)_on_Malaysian_driftwood_2.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "src": "/images/hardscape/malaysian-driftwood.webp"
  }
};
