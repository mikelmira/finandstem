import { SectionShell, SectionHeading } from "@/components/sections/section-shell";
import { PillButton } from "@/components/ui/pill-button";
import { fish, plants, shrimp, mosses, snails } from "@/data";
import type { CatalogueEntry } from "@/types/catalogue";
import { FeaturedSlider } from "@/components/sections/featured-slider";

/**
 * "Start here" — horizontal slider of beginner-friendly species
 * pulled from across all five catalogue pillars. Native scroll-snap
 * carries mobile + desktop; a small client component layers in
 * the prev/next buttons on the desktop view.
 */
export function FeaturedEntries() {
  // Curated list — one signature beginner pick per pillar plus a
  // couple of extra fan-favourites, all difficulty ≤ 2.
  const picks: ReadonlyArray<CatalogueEntry | undefined> = [
    fish.find((f) => f.slug === "neon-tetra"),
    shrimp.find((s) => s.slug === "cherry-shrimp"),
    plants.find((p) => p.slug === "anubias-nana"),
    snails.find((s) => s.slug === "zebra-nerite-snail"),
    mosses.find((m) => m.slug === "java-moss"),
    fish.find((f) => f.slug === "ember-tetra"),
    plants.find((p) => p.slug === "amazon-sword"),
    shrimp.find((s) => s.slug === "amano-shrimp"),
    plants.find((p) => p.slug === "java-fern"),
    fish.find((f) => f.slug === "otocinclus"),
  ];
  const entries = picks.filter(
    (e): e is CatalogueEntry => e !== undefined,
  );

  return (
    <SectionShell className="relative isolate border-t border-border/60">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Start here"
          title="Beginner-friendly classics."
          subtitle="Species that almost always work in a first planted tank — across fish, plants, shrimp, mosses, and snails. Swipe through and tap any card for the full profile."
        />
        <PillButton href="/fish" variant="ghost" size="sm">
          Browse all
        </PillButton>
      </div>

      <FeaturedSlider entries={entries} />
    </SectionShell>
  );
}
