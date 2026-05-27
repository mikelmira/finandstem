export const site = {
  name: "Fin & Stem",
  shortName: "Fin & Stem",
  wordmark: ["Fin", "&", "Stem"],
  tagline: "Helping aquascapers everywhere build the planted tank they imagined.",
  description:
    "A planted-aquarium reference for aquascapers worldwide. 100+ profiled fish, plants, shrimp, and mosses, cross-referenced for compatibility.",
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
  nav: [
    { label: "Fish", href: "/fish" },
    { label: "Plants", href: "/plants" },
    { label: "Shrimp", href: "/shrimp" },
    { label: "Mosses", href: "/mosses" },
    { label: "Snails", href: "/snails" },
    { label: "Substrates", href: "/substrates" },
    { label: "Guides", href: "/guides" },
    { label: "History", href: "/history-of-aquascaping" },
    { label: "Planner", href: "/planner" },
    { label: "Compare", href: "/compare" },
    { label: "Compatibility", href: "/compatibility" },
    { label: "About", href: "/about" },
  ],
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
        ],
      },
      {
        title: "Tools",
        links: [
          { label: "Tank Planner", href: "/planner" },
          { label: "Compare species", href: "/compare" },
          { label: "Compatibility", href: "/compatibility" },
        ],
      },
      {
        title: "Site",
        links: [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Guides", href: "/guides" },
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
      "Built in South Africa, written for aquascapers everywhere. Care numbers are working ranges, observe your tank, cross-check several sources, and consult a vet for anything medical. Photography sourced from Wikimedia Commons, iNaturalist, and retailer catalogues with attribution and source links on every image.",
  },
} as const;

export type SiteConfig = typeof site;
