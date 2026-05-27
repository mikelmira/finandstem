export const about = {
  hero: {
    eyebrow: "About",
    title: "A working reference for the planted aquarium.",
    subtitle:
      "Fin & Stem started as a frustration. Care numbers were scattered across forums and product pages. Species were profiled in isolation. Nothing connected the fish to the plants to the shrimp to the gear that made them work. So we started writing it down — and connecting it. Today it's a living reference for aquascapers anywhere in the world.",
  },
  ethos: {
    eyebrow: "Ethos",
    title: "A reference for everyone who loves the underwater world.",
    body: "Fin & Stem is a planted-aquarium reference. Care numbers, group sizes, light and CO₂ demand, tank-mate compatibility — written for the person stocking the tank, by someone who is still endlessly moved by what a glass box of water can become. Built to help aquascapers anywhere build the planted tank they imagined.",
    points: [
      {
        title: "Original writing, sourced data.",
        body: "Care ranges cross-reference FishBase, the IUCN Red List, Tropica's plant database, original species descriptions, and the documented experience of working aquascapers. Common-name and origin data tracks Wikipedia and Wikidata. We don't paraphrase competitor sites — if a number is from someone else, it's cited.",
      },
      {
        title: "Connections matter.",
        body: "Every species exists inside a system. Fish profiles flag plant and shrimp safety. Shrimp profiles list which fish they actually survive with. Plant profiles list their real light and CO₂ demand. The Compatibility page lets you anchor on any species and find what fits in your water. Cross-references are first-class data, not footnotes.",
      },
      {
        title: "Imagery, properly attributed.",
        body: "Photos come from Wikimedia Commons (CC-BY, CC-BY-SA, CC0), iNaturalist (CC-BY and CC0 only — never the default CC-BY-NC), and retailer catalogues where the more obscure species need coverage. Author and source are recorded on every file, with a back-link on every gallery thumbnail. The underwater world deserves to be shown by the photographers who actually captured it.",
      },
      {
        title: "Honest about uncertainty.",
        body: "Where authoritative sources disagree, we say so and pick a position with reasoning. When we don't know something, we say so. Care numbers are working ranges, not promises. If you find a species in your tank that contradicts what we wrote, tell us — we'd rather be corrected than wrong.",
      },
      {
        title: "Written for everywhere.",
        body: "The catalogue is built for aquascapers from Tokyo to Toronto to Cape Town. Care numbers are species-specific, not regional. We name brands as examples (ADA, Tropica, Seachem) but the guidance translates to whatever local substrate, fertiliser, and lighting you can source.",
      },
      {
        title: "A love letter to the planted tank.",
        body: "Every catalogue page is an excuse to look more closely at a corner of the underwater world — a shrimp moulting on driftwood, a Cryptocoryne unfurling a new leaf, a school of cardinal tetras turning together in the current. Fin & Stem exists because that is worth taking seriously.",
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
        note: "Primary photo source for the catalogue. Every Wikimedia image renders with author, license, and a link back to the Commons file page.",
      },
      {
        name: "iNaturalist",
        role: "Open-license imagery (fallback)",
        note: "CC-BY and CC0 photos only — never the default CC-BY-NC. Fills gaps where Wikimedia has no coverage, especially for aquarium-trade plants.",
      },
      {
        name: "Wikipedia / Wikidata",
        role: "Common names, origin, synonyms",
        note: "Structured species facts and the first-pass reference for taxonomy cross-checks.",
      },
      {
        name: "Tropica Plant Database",
        role: "Plant photography & care basics",
        note: "Reference standard for the plants Tropica sells. Worth checking, then verifying against community experience.",
      },
      {
        name: "2HR Aquarist",
        role: "Planted-tank methodology",
        note: "The standard for dosing, CO₂, algae diagnosis, and high-tech planted-tank technique. Cited, not paraphrased.",
      },
      {
        name: "Seriously Fish",
        role: "Freshwater species profiles",
        note: "The depth-of-detail benchmark for fish profiles. Useful for cross-checking parameter ranges.",
      },
      {
        name: "IUCN Red List",
        role: "Conservation status",
        note: "Cited on every species where conservation status matters — particularly for wild-caught fish from Southeast Asia and Amazonia.",
      },
    ],
  },
} as const;
