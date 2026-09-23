export const home = {
  hero: {
    eyebrow: "Built to help aquascapers",
    title: "Build the planted tank you imagined.",
    subtitle:
      "Fin & Stem is a working reference for aquascapers anywhere in the world. 200+ profiled fish, plants, shrimp, mosses and snails, cross-referenced for compatibility, plus 400+ filters, lights, CO2 kits, fertilisers and hardscape matched to your tank size. Parameters up front, every photo attributed. From a 20 L nano on a kitchen counter to a 600 L showpiece, start here.",
    primaryCta: { label: "Browse the catalogue", href: "/fish" },
    secondaryCta: { label: "Compatibility tool", href: "/compatibility" },
  },
  pillars: {
    eyebrow: "Five pillars",
    title: "Stock smarter. Start anywhere.",
    items: [
      {
        title: "Fish",
        slug: "fish",
        body: "90+ species profiled: schoolers, micropredators, dwarf cichlids, algae crew, and surface specialists. Parameters, group sizes, water column, plant and shrimp safety, and the catch in plain English.",
        sources: "Parameters · group size · tank-mate safety",
      },
      {
        title: "Plants",
        slug: "plants",
        body: "80+ species profiled: foregrounds and carpets, midground rosettes, background stems and bulbs, floating cover. Light demand, CO₂, substrate, propagation, and trimming cadence.",
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
        body: "Java, Christmas, Flame, Phoenix, Weeping, Süßwassertang, Riccia and more. Attachment surface, typical use, trimming cadence, and the shape each one forms underwater.",
        sources: "Attachment · use · trimming",
      },
      {
        title: "Snails",
        slug: "snails",
        body: "Nerites, mystery snails, ramshorns, MTS, assassins, rabbits. The algae crew, the substrate cleaners, the display species, and the ones that arrive uninvited.",
        sources: "Algae crew · breeding · plant safety",
      },
    ],
  },
  ethos: {
    eyebrow: "What this site is",
    title: "Built for everyone who loves the underwater world.",
    body: "Most aquascaping resources profile species in isolation and leave you cross-referencing five tabs to figure out what works with what. Fin & Stem ties everything together, every fish links to plant and shrimp safety, every plant lists its real light and CO₂ demand, every shrimp tells you which fish it survives alongside. Written for the global aquascaping community, a love letter to the beauty of what we build underwater.",
    points: [
      "200+ species profiled across five pillars, and every entry shows the parameters that actually matter up front.",
      "The Compatibility page cross-references any fish, plant, shrimp or moss against the other three, so you can see at a glance what fits in your water.",
      "A gear catalogue of 400+ products from 12 brands, matched to your tank size, with verified specs and side-by-side compare.",
      "Species photos come from Wikimedia Commons, Flickr and iNaturalist under open licences, with the author, licence and a link back to the source on every photo.",
      "Written by aquascapers who keep planted tanks themselves, and who still find the underwater world quietly astonishing.",
    ],
  },
  faq: {
    eyebrow: "Common questions",
    title: "What aquascapers ask before stocking a tank.",
    items: [
      {
        q: "Are the parameters here a hard rule?",
        a: "No, they're working ranges. Most species tolerate a wider band once acclimated, but breeding and long-term health usually need the numbers shown. Match the species to your water before stocking; don't chase the species' water with chemicals.",
      },
      {
        q: "Is this written for a specific region?",
        a: "No, Fin & Stem is for aquascapers anywhere. Care numbers are species-specific, not regional. The guidance on substrate, lighting, and CO₂ adapts to whatever brands you can source locally, from Singapore to São Paulo to Cape Town.",
      },
      {
        q: "Can I keep shrimp with fish?",
        a: "Depends on both species. Adult Amano shrimp survive most community fish; cherry shrimplets get eaten by almost anything bigger than a chili rasbora. Every shrimp profile shows specific tank-mate guidance, and the Compatibility page lets you anchor on a shrimp and see which fish are documented as safe.",
      },
      {
        q: "Do I need CO₂?",
        a: "Not for most beginner-friendly plants. Anubias, Java Fern, Cryptocoryne, Vallisneria, Bacopa, and Hygrophila all thrive without injected CO₂. Carpets are different: Monte Carlo grows far better with CO₂ and HC Cuba really needs it, and most red stems only colour up properly with it. Every plant profile spells out its CO₂ need.",
      },
      {
        q: "Where does the data come from?",
        a: "Care ranges cross-reference FishBase, the IUCN Red List, Tropica's plant database, original species descriptions, and hands-on experience. Common-name and origin data tracks Wikipedia and Wikidata. We never paraphrase competitor sites: if a number is from someone else, it's cited. Gear specs come from the makers' published figures or a major retailer's listing.",
      },
      {
        q: "Where do the photos come from?",
        a: "Species photos come from Wikimedia Commons first, then Flickr and iNaturalist, using only licences that allow reuse (CC0, CC BY and CC BY-SA, never non-commercial). A handful of harder-to-find plants use photos from Tropica and Buce Plant. Every photo links back to its source so you can check the author and licence yourself. Gear photos are supplied by the brands and their distributors.",
      },
    ],
  },
} as const;
