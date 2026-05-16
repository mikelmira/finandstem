import { Suspense } from "react";
import type { Metadata } from "next";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { MossFilters } from "@/components/filters/moss-filters";
import { mossNorm } from "@/lib/catalogue/normalize";
import {
  parseMossFilters,
  applyMossFilters,
  mossChips,
} from "@/lib/catalogue/filters";

export const metadata: Metadata = {
  title: "Mosses",
  description:
    "Aquatic mosses for hardscape, shrimp nurseries, and aquascaping detail work — Java, Christmas, Flame, Weeping, Phoenix, Süßwassertang and more. Filter by attachment surface, typical use, light, and CO₂. Built for aquascapers worldwide.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MossesIndexPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filters = parseMossFilters(sp);
  const chips = mossChips(filters);
  const filtered = applyMossFilters(mossNorm, filters);
  const entries = filtered.map((n) => n.raw);

  return (
    <>
      <PageHero
        eyebrow="Mosses"
        title="Mosses for the planted tank."
        subtitle={`${mossNorm.length} species profiled — Java and Christmas through Fissidens, Süßwassertang, Riccia and beyond. Attachment surface, typical use, trimming cadence, and the shapes each one forms underwater. The detail work that makes a scape feel alive.`}
        backgroundImage={atmosphere.driftwoodMoss}
        breadcrumb={[{ label: "Mosses" }]}
      />
      <SectionShell>
        <Suspense fallback={null}>
          <MossFilters
            filters={filters}
            chips={chips}
            resultCount={entries.length}
            totalCount={mossNorm.length}
          >
            <EntryGrid entries={entries} />
          </MossFilters>
        </Suspense>
      </SectionShell>
    </>
  );
}
