export const site = {
  name: "Fin & Stem",
  shortName: "Fin & Stem",
  wordmark: ["Fin", "&", "Stem"],
  tagline: "A planted-aquarium reference.",
  description:
    "Care profiles for the freshwater planted tank — fish, plants, shrimp and mosses. Parameters, group sizes, light and CO₂ demand, tank-mate safety, and the catch in plain English.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://finandstem.example.com",
  owner: {
    name: "Mike Elmira",
    email: "mikee@dsg.co.za",
    location: "South Africa",
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
        title: "Site",
        links: [
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
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
      "Care numbers are starting points. Observe your tank, check several sources, and consult a vet for anything medical. Photography sourced from Wikimedia Commons under CC licenses where attribution allows.",
  },
} as const;

export type SiteConfig = typeof site;
