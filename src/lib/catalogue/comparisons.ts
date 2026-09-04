/**
 * "X vs Y" comparison pages, built from the catalogue.
 *
 * We don't generate every possible pairing. That would be thousands of thin
 * pages nobody searches for. Instead we pair each species with the few peers
 * a keeper would actually weigh it against: same genus first, then the
 * closest same-category neighbours by care overlap and role. Each pair is
 * deduped and rendered once, in a stable slug order.
 *
 * Pairs that already have a hand-written guide are skipped so the two never
 * compete for the same query.
 */

import {
  fishNorm,
  plantNorm,
  shrimpNorm,
  mossNorm,
  type NormalizedEntry,
  type FishNorm,
  type PlantNorm,
} from "@/lib/catalogue/normalize";
import { overlaps, type NumericRange } from "@/lib/range";

/** Canonical pair keys already owned by a hand-written /guides comparison. */
const GUIDE_OWNED_PAIRS = new Set<string>([
  pairKey("cardinal-tetra", "neon-tetra"),
  pairKey("christmas-moss", "java-moss"),
]);

/** Up to this many peers per species, before de-duplication. */
const MAX_PEERS = 3;

export interface ComparisonPair {
  versus: string; // slugA-vs-slugB, in stable slug order
  a: NormalizedEntry;
  b: NormalizedEntry;
}

function pairKey(slugA: string, slugB: string): string {
  return [slugA, slugB].sort().join("-vs-");
}

function genus(e: NormalizedEntry): string {
  return e.scientificName.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
}

function sameGenus(a: NormalizedEntry, b: NormalizedEntry): boolean {
  const g = genus(a);
  return g.length > 0 && g === genus(b);
}

/** Role overlap adds a point when two species fill a similar niche. */
function roleMatch(a: NormalizedEntry, b: NormalizedEntry): boolean {
  if (a.category === "fish" && b.category === "fish") {
    const shareColumn = a.waterColumn.some((c) => b.waterColumn.includes(c));
    return shareColumn || (a.schooling && b.schooling);
  }
  if (a.category === "plants" && b.category === "plants") {
    return (
      a.position.some((p) => b.position.includes(p)) ||
      a.plantType.some((t) => b.plantType.includes(t))
    );
  }
  if (a.category === "shrimp" && b.category === "shrimp") {
    return a.lineage === b.lineage;
  }
  if (a.category === "mosses" && b.category === "mosses") {
    return a.typicalUse.some((u) => b.typicalUse.includes(u));
  }
  return false;
}

/** Higher means "more worth comparing". Same genus dominates. */
function similarity(a: NormalizedEntry, b: NormalizedEntry): number {
  if (a.category !== b.category) return -1;
  if (a.slug === b.slug) return -1;
  let s = 0;
  if (sameGenus(a, b)) s += 6;
  if (overlaps(a.tempRange, b.tempRange)) s += 1;
  if (overlaps(a.phRange, b.phRange)) s += 1;
  if (Math.abs(a.difficulty - b.difficulty) <= 1) s += 1;
  if (roleMatch(a, b)) s += 2;
  return s;
}

let cache: ComparisonPair[] | null = null;
let byVersus: Map<string, ComparisonPair> | null = null;

function build(): ComparisonPair[] {
  const groups: ReadonlyArray<ReadonlyArray<NormalizedEntry>> = [
    fishNorm,
    plantNorm,
    shrimpNorm,
    mossNorm,
  ];
  const seen = new Set<string>();
  const pairs: ComparisonPair[] = [];

  for (const group of groups) {
    for (const a of group) {
      const peers = group
        .filter((b) => b.slug !== a.slug)
        .map((b) => ({ b, score: similarity(a, b) }))
        // A same-genus pair (>=6) always qualifies; otherwise the species
        // must be genuinely close: overlapping temp + pH + difficulty + role.
        .filter(({ score }) => score >= 6 || score >= 5)
        .sort((x, y) => y.score - x.score)
        .slice(0, MAX_PEERS);

      for (const { b } of peers) {
        const key = pairKey(a.slug, b.slug);
        if (seen.has(key) || GUIDE_OWNED_PAIRS.has(key)) continue;
        seen.add(key);
        // Order the visible pair by the stable slug order the key used, so
        // A-vs-B and B-vs-A never both exist.
        const [firstSlug] = key.split("-vs-");
        const first = a.slug === firstSlug ? a : b;
        const second = first === a ? b : a;
        pairs.push({ versus: key, a: first, b: second });
      }
    }
  }
  return pairs;
}

export function comparisonPairs(): ComparisonPair[] {
  if (!cache) cache = build();
  return cache;
}

export function getComparison(versus: string): ComparisonPair | undefined {
  if (!byVersus) {
    byVersus = new Map(comparisonPairs().map((p) => [p.versus, p]));
  }
  return byVersus.get(versus);
}

/* ─── Copy, generated from the data ───────────────────────────────────── */

function difficultyWord(d: number): string {
  if (d <= 1) return "very easy";
  if (d === 2) return "beginner-friendly";
  if (d === 3) return "middle-of-the-road";
  if (d === 4) return "demanding";
  return "expert-level";
}

/** Overlap of two ranges, or null when they don't meet. */
function sharedRange(
  a: NumericRange | null,
  b: NumericRange | null,
): NumericRange | null {
  if (!a || !b) return null;
  const min = Math.max(a.min, b.min);
  const max = Math.min(a.max, b.max);
  return min <= max ? { min, max } : null;
}

export function comparisonTitle(p: ComparisonPair): string {
  return `${p.a.commonName} vs ${p.b.commonName}`;
}

export function comparisonDescription(p: ComparisonPair): string {
  const noun = categoryNoun(p.a.category);
  return `How the ${p.a.commonName} and ${p.b.commonName} compare on care, size, water and temperament, and which ${noun} suits your tank.`;
}

function categoryNoun(cat: NormalizedEntry["category"]): string {
  switch (cat) {
    case "fish":
      return "fish";
    case "plants":
      return "plant";
    case "shrimp":
      return "shrimp";
    case "mosses":
      return "moss";
    default:
      return "species";
  }
}

/**
 * A short, plain-language summary a person can read in one breath. Built from
 * real numbers so every page reads differently, and written to sound like a
 * keeper talking, not a spec sheet.
 */
export function comparisonTldr(p: ComparisonPair): string {
  const { a, b } = p;
  const water = sharedRange(a.tempRange, b.tempRange);
  const ph = sharedRange(a.phRange, b.phRange);
  const bits: string[] = [];

  const genusLine = sameGenus(a, b)
    ? `The ${a.commonName} and the ${b.commonName} are close cousins, both in the ${genusTitle(a)} group, so at a glance they ask for a lot of the same things.`
    : `The ${a.commonName} and the ${b.commonName} come up together a lot when people are choosing a ${categoryNoun(a.category)}, and they are close enough to weigh side by side.`;
  bits.push(genusLine);

  if (water) {
    bits.push(
      `Both are happy somewhere around ${water.min} to ${water.max} °C${
        ph ? ` and pH ${ph.min} to ${ph.max}` : ""
      }, so a single tank can suit either one.`,
    );
  } else {
    bits.push(
      `Their ideal water doesn't line up cleanly, so you'd be nudging conditions to favour one over the other.`,
    );
  }

  const easier =
    a.difficulty === b.difficulty
      ? null
      : a.difficulty < b.difficulty
        ? a
        : b;
  if (easier) {
    const other = easier === a ? b : a;
    bits.push(
      `The ${easier.commonName} is the more forgiving of the two, which matters if this is an early tank, while the ${other.commonName} rewards a bit more attention.`,
    );
  } else {
    bits.push(
      `Neither is harder than the other to keep, so the choice comes down to look and stocking rather than skill.`,
    );
  }

  bits.push(pickRecommendation(p));
  return bits.join(" ");
}

function genusTitle(e: NormalizedEntry): string {
  const g = e.scientificName.trim().split(/\s+/)[0] ?? "";
  return g.charAt(0).toUpperCase() + g.slice(1);
}

/** A genuine "which would I pick" line, leaning on whatever data separates them. */
function pickRecommendation(p: ComparisonPair): string {
  const { a, b } = p;
  if (a.category === "fish" && b.category === "fish") {
    const af = a as FishNorm;
    const bf = b as FishNorm;
    if (af.minTankL && bf.minTankL && af.minTankL !== bf.minTankL) {
      const smaller = af.minTankL < bf.minTankL ? af : bf;
      const bigger = smaller === af ? bf : af;
      return `If tank space is tight, the ${smaller.commonName} needs less room to feel settled; give the ${bigger.commonName} the nod when you have the litres to spare.`;
    }
    if (af.temperament !== bf.temperament) {
      return `For a calm community the gentler ${(af.temperament === "Peaceful" ? af : bf).commonName} slots in more easily.`;
    }
  }
  if (a.category === "plants" && b.category === "plants") {
    const ap = a as PlantNorm;
    const bp = b as PlantNorm;
    const lowLight = (x: PlantNorm) => x.light.includes("Low");
    if (lowLight(ap) !== lowLight(bp)) {
      const easy = lowLight(ap) ? ap : bp;
      return `In a low-tech, low-light setup the ${easy.commonName} is the safer bet; the other really wants brighter light to look its best.`;
    }
  }
  return `Read the full care notes on each below and pick the one whose look and pace fit the tank you're building.`;
}

export interface ComparisonFaq {
  question: string;
  answer: string;
}

export function comparisonFaqs(p: ComparisonPair): ComparisonFaq[] {
  const { a, b } = p;
  const faqs: ComparisonFaq[] = [];
  const water = sharedRange(a.tempRange, b.tempRange);
  const ph = sharedRange(a.phRange, b.phRange);

  faqs.push({
    question: `Can you keep ${a.commonName} and ${b.commonName} together?`,
    answer:
      water && ph
        ? `Yes. Their temperature and pH ranges overlap around ${water.min} to ${water.max} °C and pH ${ph.min} to ${ph.max}, so one set of water conditions keeps both comfortable. Match group sizes and cover the usual planted-tank basics and they share a tank fine.`
        : `You can, but their preferred water doesn't overlap neatly, so you'd be settling on a compromise that suits one better than the other. If you want both, aim for the middle of each range and watch how they settle in.`,
  });

  faqs.push({
    question: `Which is easier to keep, the ${a.commonName} or the ${b.commonName}?`,
    answer:
      a.difficulty === b.difficulty
        ? `They sit at the same care level, both ${difficultyWord(a.difficulty)}, so neither is the obvious beginner pick. The decision is really about the look you're after.`
        : `The ${(a.difficulty < b.difficulty ? a : b).commonName} is the easier of the two, closer to ${difficultyWord(Math.min(a.difficulty, b.difficulty))}, while the ${(a.difficulty < b.difficulty ? b : a).commonName} leans ${difficultyWord(Math.max(a.difficulty, b.difficulty))}.`,
  });

  faqs.push({
    question: `Do ${a.commonName} and ${b.commonName} need the same water?`,
    answer: water
      ? `Close to it. Aim for ${water.min} to ${water.max} °C${ph ? ` and pH ${ph.min} to ${ph.max}` : ""} and you're in the shared sweet spot for both. Full ranges are in the table above.`
      : `Not quite. Their ranges only brush against each other, so check the side-by-side table above before you commit to one tank for both.`,
  });

  faqs.push({
    question: `What's the main difference between the ${a.commonName} and the ${b.commonName}?`,
    answer: mainDifference(p),
  });

  return faqs;
}

function mainDifference(p: ComparisonPair): string {
  const { a, b } = p;
  if (a.category === "fish" && b.category === "fish") {
    const af = a as FishNorm;
    const bf = b as FishNorm;
    if (af.temperament !== bf.temperament) {
      return `Temperament is the big one. The ${af.commonName} is ${af.temperament.toLowerCase()} and the ${bf.commonName} is ${bf.temperament.toLowerCase()}, which changes who you can house them with.`;
    }
    if (af.minTankL && bf.minTankL && af.minTankL !== bf.minTankL) {
      return `Space. The ${af.commonName} wants about ${af.minTankL} litres minimum and the ${bf.commonName} around ${bf.minTankL}, so tank size can settle it.`;
    }
  }
  if (a.category === "plants" && b.category === "plants") {
    const ap = a as PlantNorm;
    const bp = b as PlantNorm;
    return `Placement and light. The ${ap.commonName} works as ${ap.position.join(" or ").toLowerCase() || "a feature plant"}, the ${bp.commonName} as ${bp.position.join(" or ").toLowerCase() || "a feature plant"}, and their light needs differ, which is covered in the table.`;
  }
  return `It comes down to look, size and pace rather than one being flatly better. The table above lays the numbers out row by row.`;
}
