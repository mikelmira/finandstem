import { Suspense } from "react";
import type { Metadata } from "next";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { ShrimpFilters } from "@/components/filters/shrimp-filters";
import { shrimpNorm } from "@/lib/catalogue/normalize";
import {
  parseShrimpFilters,
  applyShrimpFilters,
  shrimpChips,
} from "@/lib/catalogue/filters";

export const metadata: Metadata = {
  title: "Shrimp",
  description:
    "Freshwater shrimp — Neocaridina, Caridina, Amano and bamboo. Filter by lineage, breeding difficulty, TDS, parameters, and algae-eater rating.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShrimpIndexPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filters = parseShrimpFilters(sp);
  const chips = shrimpChips(filters);
  const filtered = applyShrimpFilters(shrimpNorm, filters);
  const entries = filtered.map((n) => n.raw);

  return (
    <>
      <PageHero
        eyebrow="Shrimp"
        title="Shrimp for the planted tank."
        subtitle={`${shrimpNorm.length} species profiled — Neocaridina colour morphs through Caridina specialists like Crystal Red and Blue Bolt. Colony minimums, TDS targets, and tank-mate safety.`}
        backgroundImage={atmosphere.amanoMacro}
      />
      <SectionShell>
        <Suspense fallback={null}>
          <ShrimpFilters
            filters={filters}
            chips={chips}
            resultCount={entries.length}
          >
            <EntryGrid entries={entries} />
          </ShrimpFilters>
        </Suspense>
      </SectionShell>
    </>
  );
}
