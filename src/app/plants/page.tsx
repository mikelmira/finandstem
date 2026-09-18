import { Suspense } from "react";
import type { Metadata } from "next";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { PlantIndexClient } from "@/components/filters/plant-index-client";
import { plantNorm } from "@/lib/catalogue/normalize";
import { plants } from "@/data";
import { JsonLd } from "@/components/seo/json-ld";
import { categoryIndexJsonLd } from "@/lib/seo";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Plants",
  description:
    "Aquatic plants for every planted aquarium, carpets, epiphytes, stems, floaters, and bulbs. Filter by light, CO₂, position, and water parameters.",
  alternates: {
    canonical: `${site.url}/plants`,
  },
};

// Fully static: filtering runs client-side from the URL (see PlantIndexClient).
export default function PlantsIndexPage() {
  return (
    <>
      <JsonLd
        data={categoryIndexJsonLd("plants", plants)}
        id="plants-index-jsonld"
      />
      <PageHero
        eyebrow="Plants"
        title="Plants for the planted tank."
        subtitle={`${plantNorm.length} species profiled, beginner Anubias and Java Fern through Cryptocoryne, sword plants, carpets, high-tech stems, bulbs and floaters. Light, CO₂, substrate, and propagation in one place. Filter by what your tank can support.`}
        backgroundImage={atmosphere.plantMacro}
        breadcrumb={[{ label: "Plants" }]}
      />
      <SectionShell>
        {/* Fallback = full unfiltered grid, prerendered into the static HTML for
            SEO; the client filter takes over on hydration. */}
        <Suspense fallback={<EntryGrid entries={plants} />}>
          <PlantIndexClient />
        </Suspense>
      </SectionShell>
    </>
  );
}
