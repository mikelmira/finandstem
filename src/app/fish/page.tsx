import { Suspense } from "react";
import type { Metadata } from "next";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { FishFilters } from "@/components/filters/fish-filters";
import { fishNorm } from "@/lib/catalogue/normalize";
import {
  parseFishFilters,
  applyFishFilters,
  fishChips,
} from "@/lib/catalogue/filters";

export const metadata: Metadata = {
  title: "Fish",
  description:
    "Freshwater fish for the planted tank — schoolers, micropredators, dwarf cichlids, surface specialists, and algae crew. Filter by tank size, temperament, water column, parameters, plant- and shrimp-safety, and more. Built to help aquascapers anywhere stock the right fish for their water.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function FishIndexPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filters = parseFishFilters(sp);
  const chips = fishChips(filters);
  const filtered = applyFishFilters(fishNorm, filters);
  const entries = filtered.map((n) => n.raw);

  return (
    <>
      <PageHero
        eyebrow="Fish"
        title="Fish for the planted tank."
        subtitle={`${fishNorm.length} species profiled — schoolers, micropredators, algae crew, surface specialists and centrepieces. Parameters, group sizes, water column, plant and shrimp safety. Filter by what your water can hold; the catalogue tells you what fits.`}
        backgroundImage={atmosphere.angelfish}
        breadcrumb={[{ label: "Fish" }]}
      />
      <SectionShell>
        <Suspense fallback={null}>
          <FishFilters
            filters={filters}
            chips={chips}
            resultCount={entries.length}
            totalCount={fishNorm.length}
          >
            <EntryGrid entries={entries} />
          </FishFilters>
        </Suspense>
      </SectionShell>
    </>
  );
}
