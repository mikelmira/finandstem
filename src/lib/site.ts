export const site = {
  name: "Fin & Stem",
  shortName: "Fin & Stem",
  wordmark: ["Fin", "&", "Stem"],
  tagline: "Helping aquascapers everywhere build the planted tank they imagined.",
  description:
    "A planted-aquarium reference: 200+ fish, plants, shrimp, mosses and snails cross-referenced for compatibility, plus aquarium gear matched to your tank.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://finandstem.com",
  owner: {
    name: "Mike Elmira",
    location: "South Africa",
  },
  /** Public-facing email for corrections, image takedowns, partnerships. */
  contact: {
    email: "finandstem@gmail.com",
  },
  social: {
    youtube: "#",
    instagram: "#",
    reddit: "#",
    rss: "/feed.xml",
  },
  // Primary navigation lives in lib/nav.ts (grouped dropdowns).
  footer: {
    columns: [
      {
        title: "Catalogue",
        links: [
          { label: "Fish", href: "/fish" },
          { label: "Plants", href: "/plants" },
          { label: "Shrimp", href: "/shrimp" },
          { label: "Mosses", href: "/mosses" },
          { label: "Snails", href: "/snails" },
          { label: "Substrates", href: "/substrates" },
          { label: "Hardscape", href: "/hardscape" },
          { label: "Gear catalogue", href: "/gear" },
          { label: "Fertilisers", href: "/gear/fertilisers" },
        ],
      },
      {
        title: "Tools",
        links: [
          { label: "Species finder", href: "/species-finder" },
          { label: "Species world map", href: "/species-map" },
          { label: "Tank Planner", href: "/planner" },
          { label: "Compare species", href: "/compare" },
          { label: "Compare gear", href: "/gear/compare" },
          { label: "Kit finder", href: "/gear" },
          { label: "Compatibility", href: "/compatibility" },
          { label: "Stocking by tank size", href: "/tanks" },
          { label: "Calculators", href: "/calculators" },
        ],
      },
      {
        title: "Site",
        links: [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Guides", href: "/guides" },
          { label: "How to cycle a tank", href: "/aquarium-cycling" },
          { label: "Water chemistry", href: "/water-chemistry" },
          { label: "Aquascaping design", href: "/aquascaping-design" },
          { label: "Maintenance routine", href: "/aquarium-maintenance" },
          { label: "Algae ID", href: "/algae" },
          { label: "Deficiency ID", href: "/deficiencies" },
          { label: "Fish & shrimp health", href: "/diseases" },
          { label: "Equipment", href: "/equipment" },
          { label: "Glossary", href: "/glossary" },
          { label: "History", href: "/history-of-aquascaping" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", href: "/legal/privacy" },
          { label: "Terms", href: "/legal/terms" },
        ],
      },
    ],
    note:
      "Built in South Africa, written for aquascapers everywhere. Care numbers are working ranges, observe your tank, cross-check several sources, and consult a vet for anything medical. Species photography is sourced from Wikimedia Commons and iNaturalist under open licences, with attribution and a source link on every image. Gear and hardscape product photos are supplied by the brands and their distributors.",
  },
} as const;

export type SiteConfig = typeof site;
