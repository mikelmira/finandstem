/**
 * Auto-generate FAQ + TL;DR content from catalogue data.
 *
 * Why: AEO/GEO acceptance criteria require every species page to have
 * (a) a 100–300-word TL;DR direct-answer block and (b) at least four FAQs
 * with FAQPage JSON-LD. Rather than hand-write 100 of each, we derive them
 * deterministically from the structured fields each entry already carries,
 * blended with the human-written `careSummary`. This keeps the answers
 * accurate to the data and trivially regeneratable when entries change.
 *
 * The generators are pure functions, safe to call inside server components,
 * generateMetadata, and JSON-LD builders.
 */

import type {
  CatalogueEntry,
  FishEntry,
  PlantEntry,
  ShrimpEntry,
  MossEntry,
  SnailEntry,
} from "@/types/catalogue";

export interface FaqItem {
  question: string;
  answer: string;
}

/* ─── TL;DR ───────────────────────────────────────────────────────────── */

/**
 * Build a 100–300-word TL;DR. Lead with the human careSummary, then append
 * a fact paragraph that gives crawlers and AI assistants the most queryable
 * specs in plain prose.
 */
export function buildTldr(entry: CatalogueEntry): string {
  const lead = entry.careSummary.trim();
  const facts = factParagraph(entry);
  return `${lead}\n\n${facts}`.trim();
}

function factParagraph(entry: CatalogueEntry): string {
  switch (entry.category) {
    case "fish":
      return fishFactParagraph(entry as FishEntry);
    case "plants":
      return plantFactParagraph(entry as PlantEntry);
    case "shrimp":
      return shrimpFactParagraph(entry as ShrimpEntry);
    case "mosses":
      return mossFactParagraph(entry as MossEntry);
    case "snails":
      return snailFactParagraph(entry as SnailEntry);
  }
}

function fishFactParagraph(f: FishEntry): string {
  const group =
    f.minGroupSize > 1
      ? `Keep ${f.commonName.toLowerCase()} in groups of ${f.minGroupSize}+, ${f.schooling.toLowerCase()} schoolers need numbers to display natural behaviour.`
      : `${f.commonName} can be kept singly or in a small group.`;
  return [
    `${f.commonName} (${f.scientificName}) reaches ${f.adultSize} as an adult and needs a minimum tank of ${f.minTankSize}.`,
    `Native to ${f.origin}, it lives in the ${f.waterColumn.toLowerCase()} water column with a ${f.temperament.toLowerCase()} temperament.`,
    `Aim for ${f.tempRange} °C, pH ${f.phRange}, and ${f.dghRange} dGH hardness. Lifespan is ${f.lifespan} years with good care.`,
    group,
    `Diet: ${f.diet.toLowerCase()}, ${f.feedingNotes}`,
    `Plant-safe: ${f.plantSafe}. Shrimp-safe: ${f.shrimpSafe}.`,
  ].join(" ");
}

function plantFactParagraph(p: PlantEntry): string {
  return [
    `${p.commonName} (${p.scientificName}) is a ${p.plantType.toLowerCase()} aquatic plant for the ${p.position.toLowerCase()} of a planted tank.`,
    `It reaches ${p.maxHeight} cm under good conditions and grows at a ${p.growthRate.toLowerCase()} rate.`,
    `Light: ${p.light.toLowerCase()}. CO₂: ${p.co2.toLowerCase()}.`,
    `Target ${p.tempRange} °C, pH ${p.phRange}, and ${p.dghRange} dGH.`,
    `Substrate: ${p.substrate}. Propagate via ${p.propagation.toLowerCase()}.`,
  ].join(" ");
}

function shrimpFactParagraph(s: ShrimpEntry): string {
  return [
    `${s.commonName} (${s.scientificName}) reaches ${s.adultSize} and needs a minimum tank of ${s.minTankSize} with a colony of ${s.colonyMin}+.`,
    `Native to ${s.origin}.`,
    `Aim for ${s.tempRange} °C, pH ${s.phRange}, ${s.dghRange} dGH, and ${s.tdsRange} ppm TDS.`,
    `Lifespan: ${s.lifespan} years. Breeding: ${s.breeding.toLowerCase()}.`,
    `Diet: ${s.diet.toLowerCase()}, ${s.feedingNotes}`,
    `Plant-safe: ${s.plantSafe}. Tank-mates: ${s.fishTankSafeWith}.`,
  ].join(" ");
}

function snailFactParagraph(s: SnailEntry): string {
  return [
    `${s.commonName} (${s.scientificName}) is an aquarium snail in family ${s.family}, native to ${s.origin}.`,
    `Adults reach ${s.adultSize} cm; minimum tank ${s.minTankSize} L.`,
    `Target ${s.tempRange} °C, pH ${s.phRange}, ${s.dghRange} dGH, ${s.khRange} dKH. Shell calcium demand: ${s.shellCalciumDemand.toLowerCase()}.`,
    `Diet: ${s.diet.toLowerCase()}, ${s.feedingNotes}`,
    `Breeding: ${s.breeding}`,
    `Algae-eating rating: ${s.algaeEaterRating}/5. Plant-safe: ${s.plantSafe}.`,
    `Tank mates: ${s.fishTankSafeWith}`,
  ].join(" ");
}

function mossFactParagraph(m: MossEntry): string {
  return [
    `${m.commonName} (${m.scientificName}) is a ${m.type.toLowerCase()} aquatic moss native to ${m.origin}.`,
    `Light: ${m.light.toLowerCase()}. CO₂: ${m.co2.toLowerCase()}. Growth rate: ${m.growthRate.toLowerCase()}.`,
    `Target ${m.tempRange} °C and pH ${m.phRange}.`,
    `Attach via ${m.attachment.toLowerCase()}. Typical use: ${m.typicalUse.toLowerCase()}.`,
    `Trimming: ${m.trimming}`,
  ].join(" ");
}

/* ─── FAQ ─────────────────────────────────────────────────────────────── */

export function buildFaqs(entry: CatalogueEntry): FaqItem[] {
  switch (entry.category) {
    case "fish":
      return fishFaqs(entry as FishEntry);
    case "plants":
      return plantFaqs(entry as PlantEntry);
    case "shrimp":
      return shrimpFaqs(entry as ShrimpEntry);
    case "mosses":
      return mossFaqs(entry as MossEntry);
    case "snails":
      return snailFaqs(entry as SnailEntry);
  }
}

function fishFaqs(f: FishEntry): FaqItem[] {
  return [
    {
      question: `What is the minimum tank size for ${f.commonName}?`,
      answer: `${f.commonName} (${f.scientificName}) needs a minimum tank of ${f.minTankSize}. They live in the ${f.waterColumn.toLowerCase()} water column and ${f.minGroupSize > 1 ? `should be kept in groups of ${f.minGroupSize}+` : "can be kept singly"}, so a longer footprint matters more than depth.`,
    },
    {
      question: `What water parameters do ${f.commonName} need?`,
      answer: `Target ${f.tempRange} °C, pH ${f.phRange}, and ${f.dghRange} dGH hardness. Acclimate slowly when moving them between water sources.`,
    },
    {
      question: `Are ${f.commonName} safe with shrimp?`,
      answer: `Shrimp safety: ${f.shrimpSafe}. Plant safety: ${f.plantSafe}.`,
    },
    {
      question: `What do ${f.commonName} eat?`,
      answer: `${f.commonName} are ${f.diet.toLowerCase()}. ${f.feedingNotes}`,
    },
    {
      question: `Are ${f.commonName} beginner-friendly?`,
      answer: `On Fin & Stem's 1–5 difficulty scale this species rates ${f.difficulty}/5. ${difficultyExplainer(f.difficulty)} Breeding difficulty: ${f.breedingDifficulty.toLowerCase()}.`,
    },
    {
      question: `How long do ${f.commonName} live?`,
      answer: `Typical lifespan in a well-maintained tank is ${f.lifespan} years.`,
    },
  ];
}

function plantFaqs(p: PlantEntry): FaqItem[] {
  return [
    {
      question: `Does ${p.commonName} need CO₂?`,
      answer: `CO₂ requirement: ${p.co2.toLowerCase()}. Light requirement: ${p.light.toLowerCase()}. Under ${p.co2.toLowerCase().includes("required") ? "stable injected CO₂" : "low-tech conditions"} the plant grows at a ${p.growthRate.toLowerCase()} rate.`,
    },
    {
      question: `What light level does ${p.commonName} need?`,
      answer: `${p.commonName} (${p.scientificName}) needs ${p.light.toLowerCase()} light. Run a photoperiod of 6–8 hours; longer photoperiods invite algae unless CO₂ and dosing are dialled in.`,
    },
    {
      question: `Where should ${p.commonName} be planted?`,
      answer: `Position: ${p.position.toLowerCase()}. Substrate: ${p.substrate} It typically reaches ${p.maxHeight} cm.`,
    },
    {
      question: `How do you propagate ${p.commonName}?`,
      answer: `Propagation method: ${p.propagation}. ${p.commonName} is a ${p.plantType.toLowerCase()} plant.`,
    },
    {
      question: `What water parameters does ${p.commonName} tolerate?`,
      answer: `Target ${p.tempRange} °C, pH ${p.phRange}, and ${p.dghRange} dGH. Flow tolerance: ${p.flowRate.toLowerCase()}.`,
    },
    {
      question: `Is ${p.commonName} suitable for beginners?`,
      answer: `Difficulty: ${p.difficulty}/5. ${difficultyExplainer(p.difficulty)}`,
    },
  ];
}

function shrimpFaqs(s: ShrimpEntry): FaqItem[] {
  return [
    {
      question: `What tank size do ${s.commonName} need?`,
      answer: `Minimum tank: ${s.minTankSize} with a colony of ${s.colonyMin}+. ${s.commonName} (${s.scientificName}) reach ${s.adultSize} as adults.`,
    },
    {
      question: `What water parameters do ${s.commonName} need?`,
      answer: `Target ${s.tempRange} °C, pH ${s.phRange}, ${s.dghRange} dGH, and ${s.tdsRange} ppm TDS. Mature, cycled, low-nitrate water is non-negotiable.`,
    },
    {
      question: `Are ${s.commonName} safe with fish?`,
      answer: `Tank-mate notes: ${s.fishTankSafeWith}. Plant safety: ${s.plantSafe}.`,
    },
    {
      question: `How do ${s.commonName} breed?`,
      answer: `Breeding: ${s.breeding}. In a stable colony of ${s.colonyMin}+ adults you will see berried females naturally once parameters and food are right.`,
    },
    {
      question: `What do ${s.commonName} eat?`,
      answer: `Diet: ${s.diet.toLowerCase()}, ${s.feedingNotes} Algae-eating rating: ${s.algaeEaterRating}/5.`,
    },
    {
      question: `How long do ${s.commonName} live?`,
      answer: `Typical lifespan: ${s.lifespan} years.`,
    },
  ];
}

function snailFaqs(s: SnailEntry): FaqItem[] {
  return [
    {
      question: `What tank size do ${s.commonName} need?`,
      answer: `Minimum tank: ${s.minTankSize} L. ${s.commonName} (${s.scientificName}) reach ${s.adultSize} cm as adults.`,
    },
    {
      question: `What water parameters do ${s.commonName} need?`,
      answer: `Target ${s.tempRange} °C, pH ${s.phRange}, ${s.dghRange} dGH, and ${s.khRange} dKH. Shell calcium demand is ${s.shellCalciumDemand.toLowerCase()}, supplement with cuttlebone or a mineral stone if your water is soft.`,
    },
    {
      question: `Are ${s.commonName} plant-safe?`,
      answer: `Plant safety: ${s.plantSafe}. ${s.commonName} are ${s.diet.toLowerCase()}, ${s.feedingNotes}`,
    },
    {
      question: `What fish can live with ${s.commonName}?`,
      answer: `Tank mates: ${s.fishTankSafeWith}`,
    },
    {
      question: `Do ${s.commonName} clean algae?`,
      answer: `Algae-eating rating: ${s.algaeEaterRating}/5. ${s.feedingNotes}`,
    },
    {
      question: `Do ${s.commonName} breed in freshwater?`,
      answer: `${s.breeding}`,
    },
    {
      question: `How long do ${s.commonName} live?`,
      answer: `Typical lifespan: ${s.lifespan} years in a stable, well-maintained tank.`,
    },
  ];
}

function mossFaqs(m: MossEntry): FaqItem[] {
  return [
    {
      question: `How do you attach ${m.commonName} in an aquarium?`,
      answer: `Attachment: ${m.attachment} Typical aquascaping use: ${m.typicalUse}`,
    },
    {
      question: `Does ${m.commonName} need CO₂?`,
      answer: `CO₂: ${m.co2.toLowerCase()}. Light: ${m.light.toLowerCase()}. Growth rate: ${m.growthRate.toLowerCase()}.`,
    },
    {
      question: `What water parameters does ${m.commonName} need?`,
      answer: `${m.commonName} (${m.scientificName}) tolerates ${m.tempRange} °C and pH ${m.phRange}. Flow: ${m.flowRate.toLowerCase()}.`,
    },
    {
      question: `How do you trim ${m.commonName}?`,
      answer: `${m.trimming}`,
    },
    {
      question: `Is ${m.commonName} beginner-friendly?`,
      answer: `Difficulty: ${m.difficulty}/5. ${difficultyExplainer(m.difficulty)}`,
    },
  ];
}

function difficultyExplainer(level: number): string {
  switch (level) {
    case 1:
      return "Almost unkillable, a solid first-tank choice.";
    case 2:
      return "Forgiving, beginner-friendly once the tank is cycled.";
    case 3:
      return "Intermediate, stable parameters and a mature tank matter.";
    case 4:
      return "Advanced, demands dialled-in CO₂/dosing or precise water chemistry.";
    case 5:
      return "Expert, narrow tolerances; not recommended until you've kept a stable tank for a year.";
    default:
      return "";
  }
}
