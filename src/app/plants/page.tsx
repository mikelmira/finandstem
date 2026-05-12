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

export const metadata: Metadata = {
  title: "Plants",
  description:
    "Aquatic plants for the planted aquarium — foreground carpets, midground epiphytes, background stems and rosettes. Filter by light, CO₂, position, growth rate and parameters.",
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
      <PageHero
        eyebrow="Plants"
        title="Plants for the planted tank."
        subtitle={`${plantNorm.length} species profiled — from beginner Anubias and Java Fern through Cryptocoryne, sword plants, carpets, and high-tech stems. Light, CO₂, substrate, and propagation in one place.`}
        backgroundImage={atmosphere.plantMacro}
      />
      <SectionShell>
        <Suspense fallback={null}>
          <PlantFilters
            filters={filters}
            chips={chips}
            resultCount={entries.length}
          >
            <EntryGrid entries={entries} />
          </PlantFilters>
        </Suspense>
      </SectionShell>
    </>
  );
}
