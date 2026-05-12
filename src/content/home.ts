export const home = {
  hero: {
    eyebrow: "Planted-aquarium reference",
    title: "Care profiles for the planted tank — connected.",
    subtitle:
      "Fish, plants, shrimp and mosses. Parameters, group sizes, light and CO₂ demand, tank-mate safety, and the catch each species has in plain English.",
    primaryCta: { label: "Browse fish", href: "/fish" },
    secondaryCta: { label: "Browse plants", href: "/plants" },
  },
  pillars: {
    eyebrow: "Four pillars",
    title: "Start anywhere. Everything links.",
    items: [
      {
        title: "Fish",
        slug: "fish",
        body: "Schoolers, micropredators, dwarf cichlids and algae crew — water-column behaviour, group size, plant and shrimp safety.",
        sources: "Parameters · group size · tank-mate notes",
      },
      {
        title: "Plants",
        slug: "plants",
        body: "Foreground, midground, background — rhizome, rosette, stem and carpet. Light demand, CO₂, substrate, and propagation.",
        sources: "Light · CO₂ · substrate · propagation",
      },
      {
        title: "Shrimp",
        slug: "shrimp",
        body: "Neocaridina and Caridina lines — colony minimums, TDS targets, breeding notes, and which fish they survive alongside.",
        sources: "Colony · TDS · breeding · tank-mates",
      },
      {
        title: "Mosses",
        slug: "mosses",
        body: "Java, Christmas, Flame, Phoenix, Fissidens and more. Attachment, trimming cadence, and the shape each one forms.",
        sources: "Attachment · trimming · typical use",
      },
    ],
  },
  ethos: {
    eyebrow: "What this site is",
    title: "Built for the tank you actually own.",
    body: "Most aquascaping sources profile a species in isolation. Fin & Stem ties them together — every fish links to plant and shrimp safety, every plant lists its real light and CO₂ demand, every shrimp tells you what fish it survives with.",
    points: [
      "40 species profiled across four pillars — fish, plants, shrimp and mosses.",
      "Every entry shows temperature, pH, hardness and tank-size minimums up front.",
      "Plant-safe, shrimp-safe, and tank-mate notes are first-class data, not footnotes.",
      "Imagery sourced from Wikimedia Commons with full attribution where licenses allow.",
    ],
  },
  faq: {
    eyebrow: "Common questions",
    title: "What people ask before stocking a tank.",
    items: [
      {
        q: "Are the parameters here a hard rule?",
        a: "No — they're working ranges. Most species tolerate a wider band once acclimated, but breeding and long-term health usually need the numbers shown. Match the species to your water before stocking; don't try to chase the species's water with chemicals.",
      },
      {
        q: "Can I keep shrimp with fish?",
        a: "Depends on both species. Adult Amano shrimp survive most community fish; cherry shrimplets get eaten by almost anything bigger than a chili rasbora. Every shrimp profile shows specific tank-mate guidance.",
      },
      {
        q: "Do I need CO₂?",
        a: "Not for most beginner-friendly plants. Anubias, Java Fern, Cryptocoryne, Vallisneria and Hygrophila all thrive without injected CO₂. High-demand carpets like Monte Carlo, and most stems for vivid red colour, are CO₂-recommended — each plant profile makes this explicit.",
      },
      {
        q: "Where does the data come from?",
        a: "Care ranges are cross-referenced against FishBase, the IUCN Red List, original species descriptions, and hands-on experience. Common-name and origin data tracks Wikipedia / Wikidata. We never paraphrase competitor sites — if a number is from someone else, it's cited.",
      },
      {
        q: "Why aren't there photos on every entry yet?",
        a: "Imagery is being pulled from Wikimedia Commons one species at a time, with attribution recorded for each file. Not every species has a freely-licensed photo; rather than ship stock images, we leave the slot empty until a proper photo is in.",
      },
    ],
  },
} as const;
