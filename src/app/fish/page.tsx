import { Suspense } from "react";
import type { Metadata } from "next";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { TankMatesLinks } from "@/components/catalogue/tank-mates-links";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { FishIndexClient } from "@/components/filters/fish-index-client";
import { fishNorm } from "@/lib/catalogue/normalize";
import { fish } from "@/data";
import { JsonLd } from "@/components/seo/json-ld";
import { categoryIndexJsonLd } from "@/lib/seo";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fish",
  description:
    "Freshwater fish for the planted tank, schoolers, micropredators, dwarf cichlids, algae crew. Filter by tank size, temperament, parameters, and safety.",
  alternates: {
    // Pin canonical at the bare path so filter combinations (e.g. /fish?temp=22-26)
    // don't fragment crawl budget across hundreds of permutations.
    canonical: `${site.url}/fish`,
  },
};

// Fully static: filtering runs client-side from the URL (see FishIndexClient),
// so this page is served from the CDN with no per-request function invocations.
export default function FishIndexPage() {
  return (
    <>
      <JsonLd data={categoryIndexJsonLd("fish", fish)} id="fish-index-jsonld" />
      <PageHero
        eyebrow="Fish"
        title="Fish for the planted tank."
        subtitle={`${fishNorm.length} species profiled, schoolers, micropredators, algae crew, surface specialists and centrepieces. Parameters, group sizes, water column, plant and shrimp safety. Filter by what your water can hold; the catalogue tells you what fits.`}
        backgroundImage={atmosphere.angelfish}
        breadcrumb={[{ label: "Fish" }]}
      />
      <SectionShell>
        {/* The fallback (full unfiltered grid) is what gets prerendered into the
            static HTML, so every species link is present for SEO; the client
            filter takes over on hydration. */}
        <Suspense fallback={<EntryGrid entries={fish} />}>
          <FishIndexClient />
        </Suspense>
        <div className="mt-12">
          <TankMatesLinks entries={fish} />
        </div>
      </SectionShell>
    </>
  );
}
