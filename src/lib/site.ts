export const site = {
  name: "Fin & Stem",
  shortName: "Fin & Stem",
  wordmark: ["Fin", "&", "Stem"],
  tagline: "Helping aquascapers everywhere build the planted tank they imagined.",
  description:
    "Fin & Stem is a planted-aquarium reference for aquascapers worldwide. 80+ profiled species — fish, plants, shrimp, and mosses — cross-referenced for compatibility, photographed from Wikimedia and iNaturalist, and written by tank-keepers in plain English.",
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
    { label: "Guides", href: "/guides" },
    { label: "Builds", href: "/builds" },
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
          { label: "Build journals", href: "/builds" },
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
      "Built in South Africa, written for aquascapers everywhere. Care numbers are working ranges — observe your tank, cross-check several sources, and consult a vet for anything medical. Photography sourced from Wikimedia Commons, iNaturalist, and retailer catalogues with attribution and source links on every image.",
  },
} as const;

export type SiteConfig = typeof site;
