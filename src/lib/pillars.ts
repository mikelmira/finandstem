/**
 * Pillar pages — the six topic hubs Fin & Stem's catalogue and guides
 * cluster around. Each pillar links inward from every related catalogue
 * entry (via PILLAR_FOR_CATEGORY in entry-detail.tsx) and outward to its
 * cluster of catalogue pages.
 *
 * Pillars are deliberately content-light at launch — the goal is to claim
 * the URL, emit clean JSON-LD, and let the underlying catalogue populate
 * the ItemList. Mike will expand the editorial body over time.
 */

import { fish, plants, shrimp, mosses } from "@/data";
import { CATEGORY_META, type CatalogueCategory } from "@/types/catalogue";
import type { FaqItem } from "@/lib/species-faq";
import type { PillarItem } from "@/lib/seo";

export interface Pillar {
  slug: string;
  path: string;
  title: string;
  heroEyebrow: string;
  description: string;
  tldr: string;
  intro: ReadonlyArray<string>;
  faqs: ReadonlyArray<FaqItem>;
  /** Which catalogue category (or categories) does this pillar list? */
  clusterCategories: ReadonlyArray<CatalogueCategory>;
}

export const PILLARS: ReadonlyArray<Pillar> = [
  {
    slug: "planted-tank-guide",
    path: "/planted-tank-guide",
    title: "The Planted Aquarium — A Complete Guide",
    heroEyebrow: "Pillar guide",
    description:
      "A complete reference for the planted freshwater aquarium — lighting, CO₂, substrate, dosing, plant selection, and algae control — built on top of Fin & Stem's catalogue.",
    tldr:
      "A planted tank is a system: light drives photosynthesis, CO₂ feeds the plants, substrate anchors them, and dosing fills the gaps. Get those four right and most of the so-called 'plant problems' disappear. This guide walks through each lever in plain English, then hands you straight to the catalogue so you can pick species that actually fit the parameters you can hold. Every plant profile cross-references compatible fish, shrimp, and mosses — so by the time you've stocked, the tank already works.",
    intro: [
      "The planted aquarium is the most rewarding corner of the fishkeeping hobby — and the most over-mystified. There are no secret techniques. Just four levers (light, CO₂, substrate, dosing), one biological constraint (cycling), and the patience to let a tank mature before you call anything 'wrong'.",
      "Fin & Stem's catalogue is built around the planted tank as a system. Every plant entry tells you exactly what light and CO₂ regime it wants. Every fish entry tells you whether it'll uproot stems or shred floaters. Every shrimp entry tells you which fish will hunt them down. Pick your anchor species, then use the Compatibility tool to fill the rest.",
    ],
    faqs: [
      {
        question: "Do I need CO₂ for a planted tank?",
        answer:
          "Not for most beginner setups. Anubias, Java fern, Cryptocoryne, mosses, Vallisneria, and a long list of stem plants will thrive without injected CO₂ as long as light is moderate and the tank is well-cycled. CO₂ injection unlocks the demanding high-light reds (Rotala macrandra, Ludwigia super red, Alternanthera 'Mini') and lets carpets like HC Cuba and Monte Carlo grow flat and dense. Start low-tech; upgrade when you've outgrown the plant menu.",
      },
      {
        question: "What light intensity does a planted tank need?",
        answer:
          "PAR at substrate level matters more than wattage. Low-light tanks run 15–30 µmol PAR (most LEDs at 50% over a 40 cm tank); medium 30–60; high 60–120. Match light to plant choice — pushing a low-tech tank into high-light territory without CO₂ just feeds algae.",
      },
      {
        question: "How do I cycle a planted tank?",
        answer:
          "Plants partly cycle the tank for you — heavily-planted, well-lit setups can run fish-in from week one if you stock lightly, test daily, and water-change at the first sign of ammonia or nitrite. For a hands-off cycle, add a bacteria starter (Seachem Stability, Dr Tim's One & Only) and dose ammonia to 2 ppm; the tank's ready when 2 ppm of ammonia is processed to 0 ppm nitrite within 24 hours.",
      },
      {
        question: "Why is my planted tank getting algae?",
        answer:
          "Algae is a symptom — almost always of too much light for the plant biomass, unstable CO₂, or excess nutrients with no plant uptake. Diagnose by which algae: green dust = young tank, BBA = unstable CO₂, green water = too much ammonia, hair algae = nutrient surplus. Fix the cause; don't chase symptoms with algae-killing chemicals.",
      },
    ],
    clusterCategories: ["plants"],
  },
  {
    slug: "aquarium-fish-guide",
    path: "/aquarium-fish-guide",
    title: "Aquarium Fish for the Planted Tank — A Complete Guide",
    heroEyebrow: "Pillar guide",
    description:
      "How to choose freshwater aquarium fish based on water-parameter compatibility, temperament, and safety with plants and shrimp.",
    tldr:
      "Choosing fish for a planted tank means matching water parameters (temperature, pH, hardness) and behaviour (schooling needs, temperament, fin-nipping) to the rest of the system. The biggest planted-tank mistake is stocking by sight at the LFS. The fix is starting from your water, your tank size, and your plants — then picking fish that actually fit. This guide explains the trade-offs, then links to every fish profile Fin & Stem maintains.",
    intro: [
      "Fish are the last thing you should pick for a planted tank, not the first. Your tap water decides your hardness and pH. Your light + CO₂ level decides your plants. Your plants decide the available cover and the maturity timeline. Only then do fish slot in — based on temperament, water needs, plant safety, and shrimp safety.",
      "Below: every fish in Fin & Stem's catalogue, profiled for the parameters that actually matter when you're building a planted tank.",
    ],
    faqs: [
      {
        question: "What fish are best for a planted tank?",
        answer:
          "Small, peaceful, plant-safe schoolers dominate the planted-tank canon: neon tetras, cardinal tetras, ember tetras, harlequin rasboras, chili rasboras, celestial pearl danios, pygmy corydoras, and otocinclus. Centrepieces include German blue rams, Bolivian rams, honey gouramis, and sparkling gouramis. Avoid known plant-eaters (goldfish, silver dollars, large barbs) and notorious shrimp predators if you're keeping a shrimp colony.",
      },
      {
        question: "How many fish can I keep in my tank?",
        answer:
          "The 'one inch per gallon' rule is unreliable — adult size, body shape, bioload, and swimming style all matter more. Better starting points: a 60-litre tank supports 8–12 small schoolers plus a centrepiece, a 120-litre supports two schools plus a pair of dwarf cichlids, and a 240-litre opens the door to larger rainbowfish and apistogramma communities. Use Fin & Stem's per-species 'minimum tank size' field as the floor, not the goal.",
      },
      {
        question: "What's the difference between schooling and shoaling?",
        answer:
          "Schooling fish swim in coordinated, tightly-spaced groups (cardinal tetras, rummy-nose tetras). Shoaling fish gather loosely for safety without coordinated movement (most rasboras, livebearers). Both need numbers — 6 minimum, 10+ preferred. Single fish or pairs from these species are visibly stressed and short-lived.",
      },
      {
        question: "Do I need a heater for my aquarium?",
        answer:
          "Most tropical fish need 22–28 °C — a heater is mandatory unless your room sits in that range year-round. A handful of temperate species (white cloud mountain minnows, zebra danios, paradise fish, hillstream loaches) tolerate 16–22 °C and can run unheated in a stable room. Always size the heater at 1 W per litre minimum and use an inline thermostat for redundancy.",
      },
    ],
    clusterCategories: ["fish"],
  },
  {
    slug: "freshwater-shrimp-guide",
    path: "/freshwater-shrimp-guide",
    title: "Freshwater Shrimp — A Complete Keeping Guide",
    heroEyebrow: "Pillar guide",
    description:
      "Everything on keeping Neocaridina, Caridina, and other freshwater shrimp — water chemistry, colony management, breeding, tank-mate safety, and colour grading.",
    tldr:
      "Freshwater shrimp split into two main families: easy-going Neocaridina (cherry, blue dream, yellow, sakura) that breed in standard tap-water tanks, and demanding Caridina (crystal red, blue bolt, black king kong) that need re-mineralised RO and tight TDS control. Pick the right one for your water and the rest is straightforward — mature tank, no fish that eat them, copper-free food, and patience. Every Fin & Stem shrimp profile lists exact TDS, GH, KH, and temperature ranges so you can match species to water.",
    intro: [
      "Shrimp are the most parameter-sensitive livestock in freshwater. They don't shrug off a swing in TDS or a copper-laced fish food the way fish do. The flip side is that a stable colony breeds without your help — drop ten females into the right water, leave them alone, come back to a hundred.",
      "Start from your tap water. Hard, alkaline tap → Neocaridina. Soft, acidic tap (or you're willing to run RO) → Caridina. Mixing them works in a community Neocaridina-friendly setup but breeding any specific colour grade requires species-only tanks.",
    ],
    faqs: [
      {
        question: "What's the difference between Neocaridina and Caridina shrimp?",
        answer:
          "Neocaridina davidi (cherry shrimp and all its colour morphs) live in 6.5–8.0 pH, 6–14 dGH, 150–250 ppm TDS — standard tap water in most regions. Caridina cantonensis (crystal red, crystal black, blue bolt, taiwan bee, king kong) need 5.5–6.8 pH, 0–2 dKH, 4–6 dGH, 100–150 ppm TDS — re-mineralised RO water on active substrate. The two won't interbreed, but Neocaridinas will mongrel each other into wild-type brown if mixed.",
      },
      {
        question: "How many shrimp should I start with?",
        answer:
          "Minimum 10, ideally 20+. Shrimp are colony animals — small groups suffer higher stress, slower breeding, and lower survival rates after acclimation. A 10-litre nano can comfortably hold 15–20 adult Neocaridina; a 30-litre can run a self-sustaining colony of 50+.",
      },
      {
        question: "What kills shrimp in freshwater tanks?",
        answer:
          "Most common: copper-contaminated fish food (avoid Hikari Tropical Crisps and similar), unstable TDS during water changes (drip-acclimate, change <15% weekly), insecticide drift from agricultural areas, ammonia spikes in undersized tanks, and predatory tank mates. Quarantine new plants for two weeks — pesticide residues are the silent killer.",
      },
      {
        question: "Will fish eat shrimp?",
        answer:
          "Most fish will eat baby shrimp; many will eat adults too. Reliable shrimp-safe community fish: otocinclus, pygmy corydoras, sparkling gourami, chili rasbora, ember tetra (with adult shrimp), endler livebearer. Reliable shrimp predators: angelfish, gouramis larger than honey, all cichlids, all barbs, pufferfish. Check the 'Shrimp safe' field on every Fin & Stem fish profile.",
      },
    ],
    clusterCategories: ["shrimp"],
  },
  {
    slug: "aquatic-moss-guide",
    path: "/aquatic-moss-guide",
    title: "Aquatic Mosses — A Complete Aquascaping Guide",
    heroEyebrow: "Pillar guide",
    description:
      "Aquatic mosses for the planted tank — identification, attachment techniques, trimming cadence, and aquascaping applications.",
    tldr:
      "Mosses are aquascaping's secret weapon. They soften hardscape, harbour shrimp fry, and let you sketch detail into a scape that stem plants can't. Most are bombproof (Java, Christmas, Weeping) and run in any low-tech tank; a few demand cool water and CO₂ (Fissidens, Mini Pellia). Attach to wood and rock with thread, glue, or mesh — never bury them. This guide explains how to pick, attach, trim, and use each one.",
    intro: [
      "Aquatic mosses are clonal — every fragment can grow into a new mat — which makes them both unkillable and slightly unruly. Treat them as a sculpting medium: clip and replant for shape, tie or glue to hardscape, never bury the rhizoid.",
      "The Fin & Stem moss catalogue lists what each species is actually for (carpet, bonsai canopy, wall covering, biofilm food for shrimp fry) so you can pick by job rather than by name.",
    ],
    faqs: [
      {
        question: "How do you attach moss to driftwood or rock?",
        answer:
          "Three methods: cotton thread (rots away in 4–6 weeks, by which time the moss has anchored itself), super glue gel (cyanoacrylate is reef-safe and aquarium-safe once cured — apply to dry hardscape, press moss in for 10 seconds), or stainless mesh (best for large surfaces — sandwich moss between two layers of mesh, let it grow through). Never bury moss in substrate.",
      },
      {
        question: "Does aquarium moss need CO₂?",
        answer:
          "Java moss, Christmas moss, Weeping moss, and Flame moss all thrive without CO₂ — they grow slowly but reliably in low-tech tanks. Fissidens fontanus, Mini Pellia (Riccardia chamedryfolia), and Süßwassertang grow noticeably faster and tighter with CO₂. None require it.",
      },
      {
        question: "How do I trim aquarium moss?",
        answer:
          "Trim flat against the hardscape with curved aquascaping scissors. Cuttings can be re-tied or thrown to floaters where they'll continue to grow. Don't be afraid to cut hard — moss recovers from heavy trims and pushes denser, tighter growth afterwards. Trim every 4–8 weeks once established.",
      },
      {
        question: "What's the easiest moss for beginners?",
        answer:
          "Java moss (Taxiphyllum barbieri) — grows in any conditions, accepts almost any light level, anchors itself to anything, and rebounds from any abuse. Christmas moss (Vesicularia montagnei) is the second-easiest with a more ordered, layered growth pattern that looks cleaner in a scape.",
      },
    ],
    clusterCategories: ["mosses"],
  },
  {
    slug: "aquarium-hardscape-guide",
    path: "/aquarium-hardscape-guide",
    title: "Aquarium Hardscape — Stones, Wood, and Substrate",
    heroEyebrow: "Pillar guide",
    description:
      "How to choose stone, wood, and substrate for the planted aquarium — chemistry effects on pH and KH, sizing, buoyancy, and scaping principles.",
    tldr:
      "Hardscape is the bone structure of every planted tank — and the only element you can't easily change after setup. Get it right by understanding the three things stone and wood do beyond looking good: they shift pH and KH (or shouldn't), they release tannins (or shouldn't), and they take up tank volume that's now unavailable for plants and swim space. This guide covers the major stones and woods, their chemistry, and how to pick for the scape you actually want. (Full catalogue coming month 3.)",
    intro: [
      "Hardscape catalogue pages are still being authored — until then, this guide is the working reference for which stones and woods to choose and which to avoid.",
      "Two principles dominate. First: rocks containing calcium carbonate (Seiryu, Frodo Stone, Texas holey rock) raise KH and pH; inert rocks (Dragon Stone, Ohko, Lava Rock, Seiryu's inert cousins) don't. Second: every piece of wood floats until it's waterlogged — soak for 2–4 weeks or weight it down through the early months.",
    ],
    faqs: [
      {
        question: "Will Seiryu stone raise my pH?",
        answer:
          "Yes. Seiryu stone (and its sibling Frodo Stone) contains calcium carbonate that dissolves slowly into the water column, raising KH and pH over weeks. In tanks targeting soft, acidic conditions (Caridina shrimp, blackwater biotopes) Seiryu is a poor choice. In hard-water community tanks it's harmless. Test by dropping vinegar on the rock — if it fizzes, it's reactive.",
      },
      {
        question: "How long does aquarium wood need to soak?",
        answer:
          "Mopani and Malaysian driftwood typically sink within 2–4 weeks. Spider wood and Manzanita can take 4–8 weeks; some pieces never fully sink and need to be weighted with stainless steel screws into a tile or slate base. Pre-boiling for 1–2 hours speeds the process and bleeds tannins.",
      },
      {
        question: "Do I need aquasoil for a planted tank?",
        answer:
          "No, but it makes the first year easier. Aquasoils (ADA Amazonia, Tropica Aquarium Soil, Fluval Stratum) are nutrient-charged and buffer pH down for ~12 months, which suits soft-water plants and Caridina shrimp. After they're exhausted, root tabs in inert sand or gravel work equally well — and inert substrate is more shrimp-stable. Pick based on whether you want the buffering or not.",
      },
      {
        question: "How big should hardscape be for an aquascape?",
        answer:
          "Iwagumi rule of thirds: the focal stone (Oyaishi) sits at one of the two horizontal-third intersections and reaches roughly two-thirds the tank's height. Supporting stones step down from there. For wood, the eye reads a single dominant piece better than two equal-sized pieces; cluster smaller branches around one anchor.",
      },
    ],
    clusterCategories: [],
  },
  {
    slug: "aquarium-equipment-guide",
    path: "/aquarium-equipment-guide",
    title: "Aquarium Equipment — Lighting, Filtration, CO₂, Heating",
    heroEyebrow: "Pillar guide",
    description:
      "How to size and choose aquarium equipment for the planted tank — lighting PAR, filter GPH, CO₂ regulators, heaters, and the trade-offs that actually matter.",
    tldr:
      "Equipment choice is mostly about sizing — match wattage, flow, and PAR to the tank's volume and plant demand. Buy once, cry once on lights and CO₂ regulators; everything else can be upgraded later. This guide walks through each category and the floor-spec you shouldn't go below. The full equipment catalogue (with named brands and PAR/GPH numbers) launches month 3.)",
    intro: [
      "Equipment catalogue pages are still being authored. Until then, this guide is the working reference for sizing each component.",
      "Two rules apply to every category. First: oversize, then dial down. A larger filter run slow beats a smaller filter run hot. Second: redundancy on anything that fails silently — two heaters with independent thermostats, two CO₂ check valves, dual water-change buckets in case the kitchen tap is busy.",
    ],
    faqs: [
      {
        question: "What size filter do I need for my aquarium?",
        answer:
          "Aim for 5–8× turnover for planted tanks (volume × flow rate per hour). For a 60-litre tank that's 300–480 GPH — most canisters in the 250–400 GPH range work well. Plant-heavy tanks favour low-flow surface-skimming filters; bare-bottom shrimp tanks tolerate higher flow. The standard mistake is undersizing the filter then buying a second pump to compensate.",
      },
      {
        question: "How much light does a planted tank need?",
        answer:
          "Measured in PAR (photosynthetically active radiation) at substrate level, not watts. Low-tech tanks run 15–30 µmol PAR (most full-spectrum LEDs at 50% over a 40 cm tank). Medium-tech: 30–60 µmol. High-tech (CO₂ injected, carpets, reds): 60–120 µmol. The Twinstar S/SS, Chihiros WRGB II Pro, and ONF Flat Nano Plus are well-documented, hobbyist-tested options.",
      },
      {
        question: "Do I need a CO₂ system?",
        answer:
          "No — low-tech planted tanks thrive without injected CO₂. But once you want fast-growing reds, dense carpets, or want to push light over 60 µmol PAR, CO₂ becomes mandatory. A good starter system: 2 kg refillable bottle, dual-stage regulator (CO2Art, Aquario Neo), in-line atomiser, drop checker, and a solenoid on the lighting timer. Budget USD $200–350 for the full kit.",
      },
      {
        question: "What temperature should an aquarium heater be set to?",
        answer:
          "Match the heater set-point to the lowest-end species' preferred range. For most tropical communities, 24–25 °C is the right working temperature — warm enough for tetras and rasboras, not so hot that oxygen drops or shrimp suffer. Always size the heater at 1 W per litre minimum and run two smaller heaters in parallel rather than one large heater for failure redundancy.",
      },
    ],
    clusterCategories: [],
  },
];

/** Resolve cluster items from catalogue entries for a given pillar. */
export function clusterItemsFor(pillar: Pillar): PillarItem[] {
  const items: PillarItem[] = [];
  for (const cat of pillar.clusterCategories) {
    const entries =
      cat === "fish"
        ? fish
        : cat === "plants"
          ? plants
          : cat === "shrimp"
            ? shrimp
            : mosses;
    const meta = CATEGORY_META[cat];
    for (const e of entries) {
      items.push({
        name: `${e.commonName} — ${e.scientificName}`,
        url: `${meta.path}/${e.slug}`,
      });
    }
  }
  return items;
}

export function findPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}
