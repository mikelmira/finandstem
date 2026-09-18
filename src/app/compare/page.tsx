import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { CompareClient } from "@/components/compare/compare-client";
import { comparisonPairs } from "@/lib/catalogue/comparisons";

export const metadata: Metadata = {
  title: "Compare species and substrates",
  description:
    "Put up to four catalogue species or substrates side by side. Livestock mode compares fish, plants, shrimp, mosses, and snails. Substrate mode compares aquasoils and inert substrates by pH effect, ammonia release, and lifespan.",
};

// Fully static: the comparison is resolved client-side from the URL (see
// CompareClient). The "Popular comparisons" block stays server-rendered so its
// links are in the static HTML for SEO.
export default function ComparePage() {
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Put species side by side."
        subtitle="Pick up to four species from any category, or switch to substrate mode. We score the group, stack every temperature, pH and hardness range on the same axis to show the overlap, and surface the conflicts you'll need to plan around."
        breadcrumb={[{ label: "Compare" }]}
      />

      <SectionShell>
        <Suspense fallback={<div className="h-24" />}>
          <CompareClient />
        </Suspense>
      </SectionShell>

      <PopularComparisons />
    </>
  );
}

const POPULAR_CATS = [
  { key: "fish", label: "Fish" },
  { key: "plants", label: "Plants" },
  { key: "shrimp", label: "Shrimp" },
  { key: "mosses", label: "Mosses" },
] as const;

/** A browsable set of ready-made comparison pages, grouped by category. */
function PopularComparisons() {
  const pairs = comparisonPairs();
  return (
    <SectionShell>
      <div className="max-w-3xl">
        <h2 className="text-display-tight text-2xl sm:text-3xl">Popular comparisons</h2>
        <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
          Weighing two species against each other? These ready-made head-to-heads
          line up care, size, water and temperament for you. Every species page
          also links to its own comparisons.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-8">
        {POPULAR_CATS.map(({ key, label }) => {
          const group = pairs.filter((p) => p.a.category === key).slice(0, 8);
          if (group.length === 0) return null;
          return (
            <section key={key}>
              <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.map((p) => (
                  <li key={p.versus}>
                    <Link
                      href={`/compare/${p.versus}`}
                      className="press inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                    >
                      {p.a.commonName} vs {p.b.commonName}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </SectionShell>
  );
}
