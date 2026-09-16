import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/lib/site";
import { organizationRef } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { SpeciesFinder } from "@/components/finder/species-finder";
import { SPECIES_INDEX, FINDER_PRESETS } from "@/lib/catalogue/species-index";

const PAGE_URL = `${site.url}/species-finder`;

export const metadata: Metadata = {
  title: "Aquarium Species Finder: Match Fish & Plants to Your Water",
  description:
    "Find aquarium species that fit your tank. Filter fish, plants, shrimp and snails by pH, GH, temperature, region and biotope, or pick a tank type like Amazon or hillstream.",
  alternates: { canonical: PAGE_URL },
};

export default function SpeciesFinderPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "@id": `${PAGE_URL}#app`,
              name: "Aquarium Species Finder",
              url: PAGE_URL,
              applicationCategory: "ReferenceApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              description:
                "Filter aquarium fish, plants, shrimp and snails by water parameters, region and biotope to find species that suit your tank.",
              publisher: organizationRef(),
              inLanguage: "en",
            },
          ],
        }}
        id="species-finder-jsonld"
      />

      <PageHero
        eyebrow="Species finder"
        title="Which species fit your tank?"
        subtitle="Set your water, or pick a tank type like an Amazon blackwater or a hillstream river, and see every fish, plant, shrimp and snail from the catalogue that suits it. Real species tolerate a range, so this shows what fits the water you actually have."
        breadcrumb={[{ label: "Species finder" }]}
      />

      <SectionShell>
        <SpeciesFinder records={[...SPECIES_INDEX]} presets={[...FINDER_PRESETS]} />

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Planning a biotope? Once you have a shortlist, check everything gets
          along with the{" "}
          <Link href="/compatibility" className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 hover:text-[var(--brand)]">
            compatibility tool
          </Link>
          , build the tank in the{" "}
          <Link href="/planner" className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 hover:text-[var(--brand)]">
            tank planner
          </Link>
          , and see where species come from on the{" "}
          <Link href="/species-map" className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 hover:text-[var(--brand)]">
            world map
          </Link>
          .
        </p>
      </SectionShell>
    </>
  );
}
