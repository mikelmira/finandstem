/**
 * "Tank mates for X" pages, built from the compatibility engine.
 *
 * The species detail page carries hand-written good/bad tank-mate prose and a
 * link to the interactive tool. These pages are the other half: the actual
 * list of compatible species from the catalogue, matched on water and
 * temperament, with the reason each one fits. Generated for the animal
 * categories where "tank mates" is a real search ("neon tetra tank mates",
 * "cherry shrimp tank mates", "nerite snail tank mates").
 */

import {
  buildCompatibility,
  type CompatibilityResult,
  type CompatibilityMatch,
} from "@/lib/catalogue/compatibility";
import type { NormalizedEntry, FishNorm } from "@/lib/catalogue/normalize";

/** Categories that get a tank-mates page. */
export const TANK_MATE_CATEGORIES = ["fish", "shrimp", "snails"] as const;

export interface RankedMatches {
  fish: CompatibilityMatch<NormalizedEntry>[];
  plants: CompatibilityMatch<NormalizedEntry>[];
  shrimp: CompatibilityMatch<NormalizedEntry>[];
  mosses: CompatibilityMatch<NormalizedEntry>[];
  totals: { fish: number; plants: number; shrimp: number; mosses: number };
}

function rank(
  matches: ReadonlyArray<CompatibilityMatch<NormalizedEntry>>,
  cap: number,
): CompatibilityMatch<NormalizedEntry>[] {
  return [...matches]
    .sort(
      (a, b) =>
        a.entry.difficulty - b.entry.difficulty ||
        a.entry.commonName.localeCompare(b.entry.commonName),
    )
    .slice(0, cap);
}

/** Cap and order each category so the page stays focused, keeping totals. */
export function rankedMatches(result: CompatibilityResult): RankedMatches {
  return {
    fish: rank(result.fish, 15),
    plants: rank(result.plants, 12),
    shrimp: rank(result.shrimp, 12),
    mosses: rank(result.mosses, 8),
    totals: {
      fish: result.fish.length,
      plants: result.plants.length,
      shrimp: result.shrimp.length,
      mosses: result.mosses.length,
    },
  };
}

export function tankMatesTitle(anchor: NormalizedEntry): string {
  return `${anchor.commonName} Tank Mates`;
}

export function tankMatesDescription(anchor: NormalizedEntry): string {
  return `The best tank mates for the ${anchor.commonName}, matched on temperature, pH and temperament, with the reason each species fits.`;
}

function waterLine(anchor: NormalizedEntry): string {
  const t = anchor.tempRange;
  const p = anchor.phRange;
  if (t && p)
    return `around ${t.min} to ${t.max} °C and pH ${p.min} to ${p.max}`;
  if (t) return `around ${t.min} to ${t.max} °C`;
  return "its usual planted-tank water";
}

export function tankMatesTldr(
  anchor: NormalizedEntry,
  ranked: RankedMatches,
): string {
  const { totals } = ranked;
  const counts = `${totals.fish} fish, ${totals.plants} plants, ${totals.shrimp} shrimp and ${totals.mosses} mosses`;

  if (anchor.category === "fish") {
    const f = anchor as FishNorm;
    const nature =
      f.temperament === "Peaceful"
        ? "an easy-going community fish"
        : f.temperament === "Aggressive"
          ? "a bolder fish that needs its tank mates chosen with care"
          : `a ${f.temperament.toLowerCase()} fish`;
    return `The ${anchor.commonName} is ${nature} that settles best ${waterLine(anchor)}. Good tank mates are species happy in that same water that won't nip it or get eaten. From the catalogue that comes to ${counts}, each listed below with why it works. Match those numbers, keep group sizes sensible, and you've got a peaceful tank.`;
  }

  if (anchor.category === "shrimp") {
    return `The ${anchor.commonName} does best ${waterLine(anchor)} with calm, small-mouthed tank mates that won't hunt it. The safe options from the catalogue come to ${counts}, listed below with the reason each fits. Anything big or nippy is best kept out of a shrimp tank, especially while the colony is young.`;
  }

  // snails and anything else
  return `The ${anchor.commonName} is peaceful and gets along with most calm species that share its water, ${waterLine(anchor)}. Compatible options from the catalogue come to ${counts}, listed below. The main thing to avoid is anything known to eat snails.`;
}

export interface TankMateFaq {
  question: string;
  answer: string;
}

function firstNames(
  matches: ReadonlyArray<CompatibilityMatch<NormalizedEntry>>,
  n: number,
): string {
  const names = matches.slice(0, n).map((m) => m.entry.commonName);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function tankMatesFaqs(
  anchor: NormalizedEntry,
  ranked: RankedMatches,
): TankMateFaq[] {
  const faqs: TankMateFaq[] = [];
  const goodFish = firstNames(ranked.fish, 3);

  faqs.push({
    question: `What can live with ${anchor.commonName}?`,
    answer: goodFish
      ? `Peaceful species that share its water. Good picks from the catalogue include ${goodFish}, plus compatible plants, shrimp and mosses. The full list with reasons is above.`
      : `Peaceful species that share its water and won't treat it as food. The matched list from the catalogue is above, grouped by fish, plants, shrimp and mosses.`,
  });

  if (anchor.category === "fish") {
    const f = anchor as FishNorm;
    faqs.push({
      question: `How many ${anchor.commonName} should you keep together?`,
      answer: f.schooling
        ? `The ${anchor.commonName} is a schooling fish, so keep a group of at least ${f.minGroupSize}. A bigger group looks better and the fish feel safer, so they colour up and stop hiding.`
        : `You can keep the ${anchor.commonName} on its own or in a small group. Around ${f.minGroupSize} is a sensible starting point where the species does well together.`,
    });
    faqs.push({
      question: `Are ${anchor.commonName} shrimp-safe?`,
      answer:
        f.shrimpSafe === "yes"
          ? `Yes. The ${anchor.commonName} is safe with dwarf shrimp, including babies, so it works in a shrimp tank.`
          : f.shrimpSafe === "adults-only"
            ? `Mostly. Adult shrimp are usually fine with the ${anchor.commonName}, but shrimplets can be eaten, so give a breeding colony plenty of moss and cover.`
            : `Not really. The ${anchor.commonName} will treat dwarf shrimp as food, so keep them apart if you want the shrimp to breed.`,
    });
    faqs.push({
      question: `Do ${anchor.commonName} eat plants?`,
      answer: f.plantSafe
        ? `No. The ${anchor.commonName} is plant-safe, so it won't tear up a planted tank. That's why so many plants show up in the list above.`
        : `They can nibble or uproot soft plants, so lean on tougher species like anubias, java fern and mosses rather than delicate stems.`,
    });
  } else if (anchor.category === "shrimp") {
    faqs.push({
      question: `Will fish eat ${anchor.commonName}?`,
      answer: `Bigger or nippy fish will. Stick to the small, peaceful species in the list above, and even then give the colony plenty of moss and cover so shrimplets have somewhere to hide.`,
    });
    faqs.push({
      question: `Can you keep ${anchor.commonName} with other shrimp?`,
      answer: `Yes, they're happy in a colony and alongside the shrimp listed above. If you add another shrimp of the same type in a different colour, the two can crossbreed and the colours muddy over generations, so pick one strain if you want it to breed true.`,
    });
  } else {
    faqs.push({
      question: `What should you not keep with ${anchor.commonName}?`,
      answer: `Anything known to eat snails, such as assassin snails, loaches and pufferfish. The species listed above all leave it alone.`,
    });
  }

  return faqs;
}

export function tankMatesData(anchor: NormalizedEntry): {
  result: CompatibilityResult;
  ranked: RankedMatches;
} {
  const result = buildCompatibility(anchor);
  return { result, ranked: rankedMatches(result) };
}
