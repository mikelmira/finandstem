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
import { shrimp } from "@/data";
import { JsonLd } from "@/components/seo/json-ld";
import { categoryIndexJsonLd } from "@/lib/seo";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shrimp",
  description:
    "Freshwater shrimp for the planted tank, Neocaridina morphs, Caridina specialists, Amano, and bamboo filter-feeders. Filter by lineage and TDS.",
  alternates: {
    canonical: `${site.url}/shrimp`,
  },
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
      <JsonLd
        data={categoryIndexJsonLd("shrimp", shrimp)}
        id="shrimp-index-jsonld"
      />
      <PageHero
        eyebrow="Shrimp"
        title="Shrimp for the planted tank."
        subtitle={`${shrimpNorm.length} species profiled, Neocaridina colour morphs through Caridina specialists like Crystal Red and Blue Bolt, plus filter-feeding bamboo shrimp and the legendary Amano algae crew. Colony minimums, TDS targets, lineage, and which fish they survive alongside.`}
        backgroundImage={atmosphere.amanoMacro}
        breadcrumb={[{ label: "Shrimp" }]}
      />
      <SectionShell>
        <Suspense fallback={null}>
          <ShrimpFilters
            filters={filters}
            chips={chips}
            resultCount={entries.length}
            totalCount={shrimpNorm.length}
          >
            <EntryGrid entries={entries} />
          </ShrimpFilters>
        </Suspense>
      </SectionShell>
    </>
  );
}
