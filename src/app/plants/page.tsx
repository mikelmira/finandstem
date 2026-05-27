import { Suspense } from "react";
import type { Metadata } from "next";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { PlantFilters } from "@/components/filters/plant-filters";
import { plantNorm } from "@/lib/catalogue/normalize";
import {
  parsePlantFilters,
  applyPlantFilters,
  plantChips,
} from "@/lib/catalogue/filters";
import { plants } from "@/data";
import { JsonLd } from "@/components/seo/json-ld";
import { categoryIndexJsonLd } from "@/lib/seo";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Plants",
  description:
    "Aquatic plants for every planted aquarium — carpets, epiphytes, stems, floaters, and bulbs. Filter by light, CO₂, position, and water parameters.",
  alternates: {
    canonical: `${site.url}/plants`,
  },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PlantsIndexPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filters = parsePlantFilters(sp);
  const chips = plantChips(filters);
  const filtered = applyPlantFilters(plantNorm, filters);
  const entries = filtered.map((n) => n.raw);

  return (
    <>
      <JsonLd
        data={categoryIndexJsonLd("plants", plants)}
        id="plants-index-jsonld"
      />
      <PageHero
        eyebrow="Plants"
        title="Plants for the planted tank."
        subtitle={`${plantNorm.length} species profiled — beginner Anubias and Java Fern through Cryptocoryne, sword plants, carpets, high-tech stems, bulbs and floaters. Light, CO₂, substrate, and propagation in one place. Filter by what your tank can support.`}
        backgroundImage={atmosphere.plantMacro}
        breadcrumb={[{ label: "Plants" }]}
      />
      <SectionShell>
        <Suspense fallback={null}>
          <PlantFilters
            filters={filters}
            chips={chips}
            resultCount={entries.length}
            totalCount={plantNorm.length}
          >
            <EntryGrid entries={entries} />
          </PlantFilters>
        </Suspense>
      </SectionShell>
    </>
  );
}
