import { SectionHeading } from "@/components/sections/section-shell";
import { PillButton } from "@/components/ui/pill-button";
import { fish, plants, shrimp, mosses, snails } from "@/data";
import type { CatalogueEntry } from "@/types/catalogue";
import { FeaturedSlider } from "@/components/sections/featured-slider";

/**
 * "Start here" — horizontal slider of beginner-friendly species
 * pulled from across all five catalogue pillars.
 *
 * Layout: the heading row sits inside the standard page container
 * (so it aligns left at the content gutter); the slider track lives
 * outside that container so it can extend all the way to the right
 * edge of the viewport. The first card aligns with the heading on
 * the left, and the track bleeds off-screen on the right so users
 * see partial cards peek as a "more to scroll" affordance.
 */
export function FeaturedEntries() {
  // Curated list, one signature beginner pick per pillar plus a
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
    <section className="relative isolate border-t border-border/60 py-20 sm:py-24 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Start here"
            title="Beginner-friendly classics."
            subtitle="Species that almost always work in a first planted tank, across fish, plants, shrimp, mosses, and snails. Tap any card for the full profile."
          />
          <PillButton href="/fish" variant="ghost" size="sm">
            Browse all
          </PillButton>
        </div>
      </div>

      <FeaturedSlider entries={entries} />
    </section>
  );
}
