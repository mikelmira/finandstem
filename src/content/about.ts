export const about = {
  hero: {
    eyebrow: "About",
    title: "A reference site, written by someone who keeps tanks.",
    subtitle:
      "Fin & Stem started as a frustration. Care numbers were scattered, contradictions were common, and nothing connected fish to plants to shrimp to the gear that made them work. So I started writing them down — and connecting them.",
  },
  ethos: {
    eyebrow: "Ethos",
    title: "What this site is, and isn't.",
    body: "Fin & Stem is a planted-aquarium reference. Care numbers, group sizes, light and CO₂ demand, tank-mate compatibility — written for the person stocking the tank, not the person selling the fish.",
    points: [
      {
        title: "Original writing, sourced data.",
        body: "Care ranges cross-reference FishBase, the IUCN Red List, original species descriptions, and hands-on experience. Common-name and origin data tracks Wikipedia and Wikidata. We don't paraphrase competitor sites — if a number is from someone else, it's cited.",
      },
      {
        title: "Connections matter.",
        body: "Every species exists inside a system. Fish profiles flag plant and shrimp safety. Shrimp profiles list which fish they survive with. Plant profiles list their real light and CO₂ demand. The connections are first-class data, not footnotes.",
      },
      {
        title: "Imagery, properly licensed.",
        body: "Photos come from Wikimedia Commons under their original CC-BY, CC-BY-SA or CC0 licenses, with author and source recorded next to every file. Where no freely-licensed photo exists, the slot stays empty — we don't ship stock images to fill space.",
      },
      {
        title: "Honest about uncertainty.",
        body: "Where authoritative sources disagree, we say so and pick a position with reasoning. When we don't know something, we say so. Care numbers are ranges, not promises.",
      },
      {
        title: "No shop. No paywall. No ads (yet).",
        body: "Reading is free. If we ever add affiliate links to equipment pages, they'll be inline-flagged and disclosed on every page they appear. Reading the site has to be useful before any of that.",
      },
    ],
  },
  references: {
    eyebrow: "References",
    title: "The shoulders we stand on.",
    body: "Fin & Stem ties together work that already exists. These are the sources we cite, learn from, and link out to throughout the catalogue.",
    items: [
      {
        name: "FishBase",
        role: "Scientific fish data",
        note: "35,000+ fish species — biology, ecology, ranges. The backbone for every fish entry's taxonomy and parameter ranges.",
      },
      {
        name: "Wikimedia Commons",
        role: "Open-license imagery",
        note: "Where most of our launch imagery comes from, with full attribution stored alongside every file.",
      },
      {
        name: "Wikipedia / Wikidata",
        role: "Common names, origin, synonyms",
        note: "Structured species facts and the first-pass reference for taxonomy cross-checks.",
      },
      {
        name: "2HR Aquarist",
        role: "Planted-tank methodology",
        note: "The standard for dosing, CO₂, algae diagnosis and high-tech planted-tank technique. Cited, not paraphrased.",
      },
      {
        name: "Seriously Fish",
        role: "Freshwater species profiles",
        note: "The depth-of-detail benchmark for fish profiles. Useful for cross-checking parameter ranges.",
      },
      {
        name: "Tropica Plant Database",
        role: "Plant photography & care basics",
        note: "Useful baseline for the plants Tropica sells. Worth checking, then verifying against community experience.",
      },
    ],
  },
  founder: {
    eyebrow: "Author",
    title: "Run by one person.",
    body: "Fin & Stem is written and maintained by the same person who scapes the reference tanks. No content farm, no rotating writer pool. Every entry is signed off by someone who has actually put the species in water.",
    location: "Based in South Africa, writing for a global audience.",
  },
} as const;
