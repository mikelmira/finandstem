import { Suspense } from "react";
import type { Metadata } from "next";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { TankMatesLinks } from "@/components/catalogue/tank-mates-links";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { ShrimpIndexClient } from "@/components/filters/shrimp-index-client";
import { shrimpNorm } from "@/lib/catalogue/normalize";
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

// Fully static: filtering runs client-side from the URL (see ShrimpIndexClient).
export default function ShrimpIndexPage() {
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
        {/* Fallback = full unfiltered grid, prerendered into the static HTML for
            SEO; the client filter takes over on hydration. */}
        <Suspense fallback={<EntryGrid entries={shrimp} />}>
          <ShrimpIndexClient />
        </Suspense>
        <div className="mt-12">
          <TankMatesLinks entries={shrimp} />
        </div>
      </SectionShell>
    </>
  );
}
