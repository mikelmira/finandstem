import type { DetailSection } from "@/data/species-detail";
import type { CatalogueCategory } from "@/types/catalogue";

export type GroupKey =
  | "care"
  | "wild"
  | "behavior"
  | "watch"
  | "variants"
  | "tankmates"
  | "protips";

export interface DetailGroup {
  key: GroupKey;
  label: string;
  /** Short helper that runs alongside the heading. */
  blurb: string;
  sections: DetailSection[];
}

/**
 * For each reference-section key (from species_detail.py) we know which
 * thematic group it should appear under. This mapping covers every key
 * used across fish / plants / shrimp / mosses, so adding a new species
 * type with new keys just needs an entry here.
 */
const KEY_TO_GROUP: Record<string, GroupKey> = {
  // care
  tankSetup: "care",
  fertilization: "care",
  trimming: "care",
  tying: "care",
  quarantine: "care",

  // wild
  habitat: "wild",
  habitatNatural: "wild",
  wildDiet: "wild",
  conservation: "wild",
  emersedForm: "wild",
  flowering: "wild",

  // behavior
  sexing: "behavior",
  breeding: "behavior",
  molting: "behavior",
  lifecycle: "behavior",

  // variants
  colorForms: "variants",
  colorGrades: "variants",
  variants: "variants",
  sisterSpecies: "variants",
  misidentification: "variants",
  identificationNotes: "variants",

  // watch-out
  diseases: "watch",
  deficiencies: "watch",
  algaeIssues: "watch",
  misconceptions: "watch",
  commonMistakes: "watch",

  // tank mates (rendered separately as a dedicated panel)
  goodTankMates: "tankmates",
  badTankMates: "tankmates",

  // pro tips (rendered as a callout)
  proTips: "protips",
  etymology: "protips",
};

const GROUP_BLURBS: Record<GroupKey, string> = {
  care: "What it needs from you, day to day.",
  wild: "Where it comes from in nature.",
  behavior: "How it moves, courts, and reproduces.",
  watch: "What can go wrong and how to spot it.",
  variants: "Cultivars, color lines, and what gets mislabeled.",
  tankmates: "Who it lives with, and who it doesn't.",
  protips: "Hard-won lessons from the tank.",
};

const GROUP_LABELS: Record<GroupKey, string> = {
  care: "How to care for it",
  wild: "In the wild",
  behavior: "Behavior & breeding",
  watch: "Things to watch for",
  variants: "Variants & identification",
  tankmates: "Who it lives with",
  protips: "Pro tips",
};

const GROUP_ORDER: GroupKey[] = [
  "tankmates",
  "care",
  "wild",
  "behavior",
  "variants",
  "watch",
  "protips",
];

export interface GroupedDetail {
  groups: DetailGroup[];
  /** The two tank-mate sections, isolated for the dedicated panel. */
  goodTankMates?: DetailSection;
  badTankMates?: DetailSection;
  /** Pro tips + etymology, isolated for the callout. */
  protips: DetailSection[];
}

export function groupDetailSections(
  sections: DetailSection[],
  _category: CatalogueCategory,
): GroupedDetail {
  void _category;
  const buckets: Record<GroupKey, DetailSection[]> = {
    care: [],
    wild: [],
    behavior: [],
    variants: [],
    watch: [],
    tankmates: [],
    protips: [],
  };

  for (const s of sections) {
    const g = KEY_TO_GROUP[s.key];
    if (!g) continue;
    buckets[g].push(s);
  }

  const groups: DetailGroup[] = GROUP_ORDER
    // tank mates and protips render as bespoke panels, not in the
    // generic grouped list
    .filter((k) => k !== "tankmates" && k !== "protips")
    .filter((k) => buckets[k].length > 0)
    .map((k) => ({
      key: k,
      label: GROUP_LABELS[k],
      blurb: GROUP_BLURBS[k],
      sections: buckets[k],
    }));

  return {
    groups,
    goodTankMates: buckets.tankmates.find((s) => s.key === "goodTankMates"),
    badTankMates: buckets.tankmates.find((s) => s.key === "badTankMates"),
    protips: buckets.protips,
  };
}
