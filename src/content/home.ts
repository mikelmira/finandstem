export const home = {
  hero: {
    eyebrow: "Built to help aquascapers",
    title: "Build the planted tank you imagined.",
    subtitle:
      "Fin & Stem is a working reference for aquascapers anywhere in the world. 80+ profiled fish, plants, shrimp, and mosses — cross-referenced for compatibility, parameters surfaced up front, photographed and attributed. From a 20 L nano on a kitchen counter to a 600 L showpiece — start here.",
    primaryCta: { label: "Browse the catalogue", href: "/fish" },
    secondaryCta: { label: "Compatibility tool", href: "/compatibility" },
  },
  pillars: {
    eyebrow: "Four pillars",
    title: "Stock smarter. Start anywhere.",
    items: [
      {
        title: "Fish",
        slug: "fish",
        body: "34 species profiled — schoolers, micropredators, dwarf cichlids, algae crew, and surface specialists. Parameters, group sizes, water column, plant and shrimp safety, and the catch in plain English.",
        sources: "Parameters · group size · tank-mate safety",
      },
      {
        title: "Plants",
        slug: "plants",
        body: "34 species profiled — foregrounds and carpets, midground rosettes, background stems and bulbs, floating cover. Light demand, CO₂, substrate, propagation, and trimming cadence.",
        sources: "Light · CO₂ · substrate · propagation",
      },
      {
        title: "Shrimp",
        slug: "shrimp",
        body: "Neocaridina, Caridina, and the specialty filter-feeders. Lineage, colony minimums, TDS targets, breeding notes, and which fish they actually survive alongside.",
        sources: "Lineage · TDS · breeding · tank-mates",
      },
      {
        title: "Mosses",
        slug: "mosses",
        body: "Java, Christmas, Flame, Phoenix, Fissidens, Süßwassertang and more. Attachment surface, typical use, trimming cadence, and the shape each one forms underwater.",
        sources: "Attachment · use · trimming",
      },
    ],
  },
  ethos: {
    eyebrow: "What this site is",
    title: "Built for everyone who loves the underwater world.",
    body: "Most aquascaping resources profile species in isolation and leave you cross-referencing five tabs to figure out what works with what. Fin & Stem ties everything together — every fish links to plant and shrimp safety, every plant lists its real light and CO₂ demand, every shrimp tells you which fish it survives alongside. Written by a tank-keeper for the global aquascaping community — a love letter to the beauty of what we build underwater.",
    points: [
      "88+ species profiled across four pillars — every entry shows the parameters that actually matter up front.",
      "The Compatibility page cross-references any anchor species against the other three categories — see at a glance what fits in your water.",
      "Image galleries sourced from Wikimedia Commons, iNaturalist, and retailer catalogues — with full attribution and back-links to the source on every photo.",
      "Written by someone who actually keeps the tanks — and who still finds the underwater world quietly astonishing.",
    ],
  },
  faq: {
    eyebrow: "Common questions",
    title: "What aquascapers ask before stocking a tank.",
    items: [
      {
        q: "Are the parameters here a hard rule?",
        a: "No — they're working ranges. Most species tolerate a wider band once acclimated, but breeding and long-term health usually need the numbers shown. Match the species to your water before stocking; don't chase the species' water with chemicals.",
      },
      {
        q: "Is this written for a specific region?",
        a: "No — Fin & Stem is for aquascapers anywhere. Care numbers are species-specific, not regional. The guidance on substrate, lighting, and CO₂ adapts to whatever brands you can source locally, from Singapore to São Paulo to Cape Town.",
      },
      {
        q: "Can I keep shrimp with fish?",
        a: "Depends on both species. Adult Amano shrimp survive most community fish; cherry shrimplets get eaten by almost anything bigger than a chili rasbora. Every shrimp profile shows specific tank-mate guidance, and the Compatibility page lets you anchor on a shrimp and see which fish are documented as safe.",
      },
      {
        q: "Do I need CO₂?",
        a: "Not for most beginner-friendly plants. Anubias, Java Fern, Cryptocoryne, Vallisneria, Bacopa, and Hygrophila all thrive without injected CO₂. Carpet plants like Monte Carlo and HC Cuba, plus most stems for vivid red colour, are CO₂-recommended — each plant profile makes this explicit.",
      },
      {
        q: "Where does the data come from?",
        a: "Care ranges cross-reference FishBase, the IUCN Red List, Tropica's plant database, original species descriptions, and hands-on experience. Common-name and origin data tracks Wikipedia and Wikidata. We never paraphrase competitor sites — if a number is from someone else, it's cited.",
      },
      {
        q: "Where do the photos come from?",
        a: "Wikimedia Commons first (open-license Creative Commons), iNaturalist second (CC-BY and CC0 only), and retailer catalogue photos third (Tropica, Buce Plant) where the more obscure species need coverage. Every gallery photo links back to its source page so you can verify the licensing and author yourself.",
      },
    ],
  },
} as const;
