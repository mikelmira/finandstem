export const about = {
  hero: {
    eyebrow: "About",
    title: "A working reference for the planted aquarium.",
    subtitle:
      "Fin & Stem started as a frustration. Care numbers were scattered across forums and product pages. Species were profiled in isolation. Nothing connected the fish to the plants to the shrimp to the gear that made them work. So we started writing it down, and connecting it. Today it's a living reference for aquascapers anywhere in the world.",
  },
  ethos: {
    eyebrow: "Ethos",
    title: "A reference for everyone who loves the underwater world.",
    body: "Fin & Stem is a planted-aquarium reference. Care numbers, group sizes, light and CO₂ demand, tank-mate compatibility, written for the person stocking the tank, by someone who is still endlessly moved by what a glass box of water can become. Built to help aquascapers anywhere build the planted tank they imagined.",
    points: [
      {
        title: "Original writing, sourced data.",
        body: "Care ranges cross-reference FishBase, the IUCN Red List, Tropica's plant database, original species descriptions, and the documented experience of working aquascapers. Common-name and origin data tracks Wikipedia and Wikidata. We don't paraphrase competitor sites, if a number is from someone else, it's cited.",
      },
      {
        title: "Connections matter.",
        body: "Every species exists inside a system. Fish profiles flag plant and shrimp safety. Shrimp profiles list which fish they actually survive with. Plant profiles list their real light and CO₂ demand. The Compatibility page lets you anchor on any species and find what fits in your water. Cross-references are first-class data, not footnotes.",
      },
      {
        title: "Imagery, properly attributed.",
        body: "Species photos come from Wikimedia Commons (CC BY, CC BY-SA, CC0) and iNaturalist (CC BY and CC0 only, never the default CC BY-NC), with author and source recorded on every file and a back-link on every gallery thumbnail. Gear and hardscape photos are supplied by the brands and their distributors, and every product page links back to its source. The underwater world deserves to be shown by the people who actually captured it.",
      },
      {
        title: "Honest about uncertainty.",
        body: "Where authoritative sources disagree, we say so and pick a position with reasoning. When we don't know something, we say so. Care numbers are working ranges, not promises. If you find a species in your tank that contradicts what we wrote, tell us, we'd rather be corrected than wrong.",
      },
      {
        title: "Written for everywhere.",
        body: "The catalogue is built for aquascapers from Tokyo to Toronto to Cape Town. Care numbers are species-specific, not regional. We name brands as examples (ADA, Tropica, Seachem) but the guidance translates to whatever local substrate, fertiliser, and lighting you can source.",
      },
      {
        title: "A love letter to the planted tank.",
        body: "Every catalogue page is an excuse to look more closely at a corner of the underwater world, a shrimp moulting on driftwood, a Cryptocoryne unfurling a new leaf, a school of cardinal tetras turning together in the current. Fin & Stem exists because that is worth taking seriously.",
      },
    ],
  },
  references: {
    eyebrow: "References",
    title: "The shoulders we stand on.",
    body: "Fin & Stem ties together work that already exists. These are the sources we cite, learn from and link out to across the catalogue, the guides and the gear pages.",
    groups: [
      {
        title: "Species and scientific data",
        items: [
          { name: "FishBase", role: "Scientific fish data", note: "35,000+ fish species, biology, ecology and ranges. The backbone for fish taxonomy and parameter ranges.", url: "https://www.fishbase.se" },
          { name: "Wikipedia / Wikidata", role: "Common names, origin, synonyms", note: "Structured species facts and the first-pass reference for taxonomy cross-checks.", url: "https://en.wikipedia.org" },
          { name: "IUCN Red List", role: "Conservation status", note: "Cited where conservation status matters, particularly for wild-caught fish from Southeast Asia and Amazonia.", url: "https://www.iucnredlist.org" },
          { name: "GBIF", role: "Occurrence and range data", note: "Global Biodiversity Information Facility records, used to check native ranges for the species map.", url: "https://www.gbif.org" },
          { name: "Atlas of Living Australia", role: "Occurrence records", note: "Range and occurrence records for Australasian species.", url: "https://www.ala.org.au" },
          { name: "USDA PLANTS Database", role: "Plant taxonomy and range", note: "Taxonomy, native range and invasive-status checks for aquatic plants.", url: "https://plants.usda.gov" },
          { name: "Biodiversity Heritage Library", role: "Original descriptions", note: "Historic literature and original species descriptions, used for history and taxonomy.", url: "https://www.biodiversitylibrary.org" },
          { name: "Seriously Fish", role: "Freshwater species profiles", note: "The depth-of-detail benchmark for fish profiles. Useful for cross-checking parameter ranges.", url: "https://www.seriouslyfish.com" },
          { name: "Project Piaba", role: "Sustainable home-aquarium fisheries", note: "Research and context on the wild-caught Rio Negro fishery behind many tetras.", url: "https://www.projectpiaba.org" },
        ],
      },
      {
        title: "Planted-tank practice and community",
        items: [
          { name: "2HR Aquarist", role: "Planted-tank methodology", note: "The standard for dosing, CO2, algae diagnosis and high-tech technique. Cited, not paraphrased.", url: "https://www.2hraquarist.com" },
          { name: "Tropica", role: "Plant database and care basics", note: "Reference standard for the plants Tropica grows. Worth checking, then verifying against community experience.", url: "https://tropica.com/en/plants" },
          { name: "Flowgrow", role: "Aquatic plant database", note: "The most detailed community plant database, German-first. Used to cross-check plant parameters.", url: "https://www.flowgrow.de" },
          { name: "Aquasabi", role: "Plant and product guides", note: "Detailed plant profiles and substrate information from a leading European aquascaping shop.", url: "https://www.aquasabi.com" },
          { name: "UKAPS", role: "Planted-tank forum", note: "UK Aquatic Plant Society, a deep archive of real-world planted-tank experience.", url: "https://ukaps.org" },
          { name: "Aquarium Co-Op", role: "Practical fishkeeping advice", note: "Beginner-friendly care and low-tech planted-tank guidance.", url: "https://www.aquariumcoop.com" },
          { name: "Aquatic Gardeners Association", role: "Aquascaping contest showcase", note: "The AGA contest archive, a reference for layouts and styles.", url: "https://showcase.aquatic-gardeners.org" },
          { name: "IAPLC", role: "International aquascaping contest", note: "ADA's International Aquatic Plants Layout Contest, the benchmark for Nature Aquarium layouts.", url: "https://www.iaplc.com" },
          { name: "Buce Plant", role: "Plant supplier guides", note: "Care information for bucephalandra and other rare plants.", url: "https://buceplant.com" },
        ],
      },
      {
        title: "Imagery and licences",
        items: [
          { name: "Wikimedia Commons", role: "Open-licence imagery", note: "Primary photo source for species. Every image renders with author, licence and a link back to the Commons file.", url: "https://commons.wikimedia.org" },
          { name: "iNaturalist", role: "Open-licence imagery", note: "CC BY and CC0 photos only, never the default CC BY-NC. Fills gaps where Commons has no coverage.", url: "https://www.inaturalist.org" },
          { name: "Flickr", role: "Open-licence imagery", note: "Creative Commons photos for species and historic aquariums, credited on every image.", url: "https://www.flickr.com" },
          { name: "Unsplash", role: "Atmosphere photography", note: "Free-licence aquarium photography used for page headers.", url: "https://unsplash.com" },
          { name: "Creative Commons", role: "Licences", note: "The licences (CC BY, CC BY-SA, CC0) that make most of our species imagery possible.", url: "https://creativecommons.org" },
        ],
      },
      {
        title: "Substrate and product makers",
        items: [
          { name: "Seachem", role: "Substrates and water care", note: "Maker specs for Flourite and other inert nutrient substrates.", url: "https://www.seachem.com" },
          { name: "CaribSea", role: "Substrates", note: "Maker specs for Eco-Complete and other substrates.", url: "https://www.caribsea.com" },
          { name: "Dennerle", role: "Substrates and nano gear", note: "Maker specs for Dennerle substrates.", url: "https://dennerle.com" },
          { name: "JBL", role: "Substrates and water care", note: "Maker specs for JBL substrates.", url: "https://www.jbl.de" },
          { name: "Aqua Rebell", role: "Substrates", note: "Maker specs for Aqua Rebell soils.", url: "https://www.aqua-rebell.de" },
          { name: "Prodibio", role: "Substrate additives", note: "Maker specs for Prodibio base layers and additives.", url: "https://www.prodibio.com" },
          { name: "Brightwell Aquatics", role: "Substrates", note: "Maker specs for Brightwell substrates.", url: "https://www.brightwellaquatics.com" },
        ],
      },
    ],
  },
} as const;
