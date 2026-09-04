/**
 * "Best fish, plants and shrimp for an N litre tank" pages.
 *
 * Built from the catalogue and the standard tank sizes. The fish list is the
 * real draw ("best fish for a 20 litre tank" is a common search), scaled so
 * only species that actually fit the volume show up. Sizes that already have a
 * hand-written guide (30 L, 60 L) are left out so the two never compete.
 */

import {
  fishNorm,
  shrimpNorm,
  plantNorm,
  type FishNorm,
  type ShrimpNorm,
  type PlantNorm,
} from "@/lib/catalogue/normalize";
import {
  STANDARD_TANKS,
  findTankStandard,
  type TankStandard,
} from "@/lib/catalogue/tank-standards";

/** Volumes that already have a dedicated hand-written guide. */
const GUIDE_OWNED_LITRES = new Set([30, 60]);
/** Very large display sizes with little "best fish for" search intent. */
const SKIP_LITRES = new Set([350, 600]);

export function generatedTanks(): TankStandard[] {
  return STANDARD_TANKS.filter(
    (t) => !GUIDE_OWNED_LITRES.has(t.litres) && !SKIP_LITRES.has(t.litres),
  );
}

export function tankSizeSlug(litres: number): string {
  return `${litres}-litres`;
}

export function parseTankSizeSlug(slug: string): TankStandard | null {
  const m = /^(\d+)-litres$/.exec(slug);
  if (!m) return null;
  const std = findTankStandard(Number(m[1]));
  if (!std) return null;
  if (GUIDE_OWNED_LITRES.has(std.litres) || SKIP_LITRES.has(std.litres))
    return null;
  return std;
}

export interface TankPicks {
  fish: FishNorm[];
  shrimp: ShrimpNorm[];
  plants: PlantNorm[];
  fishTotal: number;
}

export function tankPicks(std: TankStandard): TankPicks {
  const litres = std.litres;

  const fitFish = fishNorm.filter(
    (f) => f.minTankL != null && f.minTankL <= litres,
  );
  const fish = [...fitFish]
    .sort((a, b) => {
      // Peaceful community fish first.
      const pa = a.temperament === "Peaceful" ? 0 : 1;
      const pb = b.temperament === "Peaceful" ? 0 : 1;
      if (pa !== pb) return pa - pb;
      // Then the roomiest species that still fits, so bigger tanks surface
      // their centrepiece options rather than only nano fish.
      const ta = a.minTankL ?? 0;
      const tb = b.minTankL ?? 0;
      if (tb !== ta) return tb - ta;
      return a.commonName.localeCompare(b.commonName);
    })
    .slice(0, 12);

  const shrimp = [...shrimpNorm]
    .filter((s) => s.minTankL == null || s.minTankL <= litres)
    .sort(
      (a, b) =>
        b.algaeEaterRating - a.algaeEaterRating ||
        a.commonName.localeCompare(b.commonName),
    )
    .slice(0, 6);

  // Scale plants to the tank: shorter foreground/midground for small tanks,
  // taller background species earn their place as the tank grows.
  const small = litres <= 45;
  const plants = [...plantNorm]
    .map((p) => ({ p, score: plantScore(p, std, small) }))
    .sort((a, b) => b.score - a.score || a.p.difficulty - b.p.difficulty)
    .slice(0, 8)
    .map(({ p }) => p);

  return { fish, shrimp, plants, fishTotal: fitFish.length };
}

function plantScore(p: PlantNorm, std: TankStandard, small: boolean): number {
  let s = 0;
  const fitsHeight =
    p.maxHeightCm == null || p.maxHeightCm <= std.internalHeightCm;
  if (fitsHeight) s += 2;
  if (small) {
    if (p.position.includes("Foreground")) s += 3;
    if (p.position.includes("Midground")) s += 1;
    if (p.plantType.includes("Carpet")) s += 1;
  } else {
    if (p.position.includes("Background")) s += 2;
    if (p.position.includes("Midground")) s += 2;
  }
  if (p.light.includes("Low")) s += 1; // easy, low-tech friendly
  return s;
}

export function tankTitle(std: TankStandard): string {
  return `Best Fish, Plants & Shrimp for a ${std.litres} Litre Tank`;
}

export function tankDescription(std: TankStandard): string {
  return `What actually fits a ${std.litres} litre aquarium: the best fish, shrimp and plants scaled to the space, matched from the catalogue so you can stock it without overcrowding.`;
}

function stockingIdea(litres: number): string {
  if (litres <= 10) return "a single shrimp colony or one small betta";
  if (litres <= 20) return "a small shoal of nano fish or a shrimp colony";
  if (litres <= 45) return "one schooling group plus a small clean-up crew";
  if (litres <= 90)
    return "a schooling group, a centrepiece fish and a bottom team";
  if (litres <= 180)
    return "a couple of shoaling groups plus a feature fish";
  return "several groups or a few larger species with room to spare";
}

export function tankTldr(std: TankStandard, picks: TankPicks): string {
  const litres = std.litres;
  const roomy =
    litres <= 20
      ? "There isn't much room, so stocking has to stay light and every choice counts."
      : litres <= 90
        ? "That's enough room for a proper little community if you don't overdo the numbers."
        : "That's plenty of room to build a layered community.";
  return `A ${litres} litre tank suits ${stockingIdea(litres)}. ${roomy} From the catalogue, ${picks.fishTotal} fish fit a tank this size, and the best of them are below alongside shrimp and plants scaled to the space. Everything here stays inside what ${litres} litres can handle for swimming room and bioload, so you can mix picks without tipping into overstocked. Run the exact combination through the planner before you buy.`;
}

export interface TankFaq {
  question: string;
  answer: string;
}

export function tankFaqs(std: TankStandard, picks: TankPicks): TankFaq[] {
  const litres = std.litres;
  const topFish = picks.fish
    .slice(0, 3)
    .map((f) => f.commonName)
    .join(", ");
  const topPlants = picks.plants
    .slice(0, 2)
    .map((p) => p.commonName)
    .join(" and ");

  return [
    {
      question: `How many fish can you keep in a ${litres} litre tank?`,
      answer: `As a rough guide, aim for around ${litres} cm of adult fish across the whole tank for a comfortable load, less if the fish are chunky. In practice that's ${stockingIdea(litres)}. The planner adds up the real bioload for any mix so you don't have to guess.`,
    },
    {
      question: `What are the best fish for a ${litres} litre tank?`,
      answer: topFish
        ? `Peaceful species that fit the space. Good starting points from the catalogue are ${topFish}, with the full ranked list above. Pick one schooling group as the backbone, then build around it.`
        : `Peaceful species that fit the space, ranked above by how well they suit ${litres} litres.`,
    },
    {
      question: `Can you keep shrimp in a ${litres} litre tank?`,
      answer: `Yes. Dwarf shrimp thrive at this size and add a clean-up crew without much bioload. The shrimp picks above all suit a ${litres} litre tank, and they get along with the peaceful fish listed here.`,
    },
    {
      question: `What plants suit a ${litres} litre tank?`,
      answer: topPlants
        ? `${topPlants} are easy, well-scaled choices for ${litres} litres. The list above leans to species that won't outgrow the tank or need constant trimming.`
        : `Species scaled to the height and footprint of the tank, listed above, leaning towards low-maintenance choices.`,
    },
  ];
}
