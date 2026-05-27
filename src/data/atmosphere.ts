/**
 * Atmosphere photography, used as hero backgrounds across the site.
 * Each photo credits its Unsplash photographer per the Unsplash License
 * (https://unsplash.com/license).
 */

export interface AtmosphereImage {
  src: string;
  alt: string;
  photographer: string;
  source: string;
}

export const atmosphere = {
  aquascapeWide: {
    src: "/images/atmosphere/aquascape-wide.webp",
    alt: "A long planted aquascape with dense aquatic plants and driftwood",
    photographer: "Simon Infanger",
    source: "https://unsplash.com/photos/DKtJILopN8c",
  },
  angelfish: {
    src: "/images/atmosphere/angelfish.webp",
    alt: "Angelfish swimming over sand in a planted aquarium",
    photographer: "Simon Infanger",
    source: "https://unsplash.com/photos/mK5mMFo4jcA",
  },
  carpetSchool: {
    src: "/images/atmosphere/carpet-school.webp",
    alt: "Small fish swimming above a green carpet of aquatic plants",
    photographer: "Simon Infanger",
    source: "https://unsplash.com/photos/yHupbfucTvs",
  },
  nanoTank: {
    src: "/images/atmosphere/nano-tank.webp",
    alt: "A small planted nano aquarium glowing in a dark room",
    photographer: "Szabo Gedeon",
    source: "https://unsplash.com/photos/vfEVeNMq2hA",
  },
  driftwoodMoss: {
    src: "/images/atmosphere/driftwood-moss.webp",
    alt: "Driftwood covered in moss with glowing tetras swimming nearby",
    photographer: "Tran Mau Tri Tam",
    source: "https://unsplash.com/photos/HMTLGBtb6Jc",
  },
  amanoMacro: {
    src: "/images/atmosphere/amano-macro.webp",
    alt: "Close-up of an Amano shrimp on driftwood",
    photographer: "Mate Molnar",
    source: "https://unsplash.com/photos/Nti1SPucduY",
  },
  dwarfGourami: {
    src: "/images/atmosphere/dwarf-gourami.webp",
    alt: "A blue dwarf gourami in a dark planted tank",
    photographer: "Denis Bayer",
    source: "https://unsplash.com/photos/-trfIiFltKg",
  },
  plantMacro: {
    src: "/images/atmosphere/plant-macro.webp",
    alt: "Close-up of aquatic plant foliage on a mossy stone",
    photographer: "Jerry Wang",
    source: "https://unsplash.com/photos/A1yjAj4AriA",
  },
  loachesCave: {
    src: "/images/atmosphere/loaches-cave.webp",
    alt: "Botia loaches gathered in a rocky cave on a gravel substrate",
    photographer: "Aquarium Products India",
    source: "https://unsplash.com/photos/Z6yUFdhuz-s",
  },
  snailsOnBacopa: {
    src: "/images/atmosphere/snails-on-bacopa.webp",
    alt: "Red ramshorn snails climbing a Bacopa stem in a planted aquarium",
    photographer: "Josephina Kolpachnikof",
    source: "https://unsplash.com/photos/l14vjcZBerc",
  },
  schoolDriftwood: {
    src: "/images/atmosphere/pexels-pinamon-16671903.jpg",
    alt: "A small school of fish swimming over driftwood and dense aquatic plants in a planted aquarium",
    photographer: "Pinamon",
    source: "https://www.pexels.com/photo/16671903/",
  },
  cichlidsTank: {
    src: "/images/atmosphere/pexels-tuan-vy-903011268-33593382.webp",
    alt: "Mixed community fish, guppies, mollies and tetras in a warm-lit planted aquarium",
    photographer: "Tuan Vy",
    source: "https://www.pexels.com/photo/33593382/",
  },
  twoTetras: {
    src: "/images/atmosphere/pexels-aradra-p-1874764-37755820.webp",
    alt: "Two congo tetras side by side in a dark planted aquarium",
    photographer: "Aradra P",
    source: "https://www.pexels.com/photo/37755820/",
  },
} as const satisfies Record<string, AtmosphereImage>;

export type AtmosphereKey = keyof typeof atmosphere;
