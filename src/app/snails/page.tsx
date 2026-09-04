import type { Metadata } from "next";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { EntryGrid } from "@/components/catalogue/entry-grid";
import { TankMatesLinks } from "@/components/catalogue/tank-mates-links";
import { snails } from "@/data";
import { JsonLd } from "@/components/seo/json-ld";
import { categoryIndexJsonLd } from "@/lib/seo";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Snails",
  description:
    "Aquarium snails for algae control, substrate cleanup, and display, nerites, mystery, ramshorn, MTS, assassins, rabbits, and more. Care, breeding, and tank-mate notes.",
  alternates: {
    canonical: `${site.url}/snails`,
  },
};

export default function SnailsIndexPage() {
  return (
    <>
      <JsonLd
        data={categoryIndexJsonLd("snails", snails)}
        id="snails-index-jsonld"
      />
      <PageHero
        eyebrow="Snails"
        title="Snails for the planted tank."
        subtitle={`${snails.length} species profiled, nerites, mystery snails, ramshorns, MTS, assassins, rabbits and more. The algae crew, the substrate cleaners, the display species, and the ones that arrive uninvited. Each entry lists shell-calcium demand, plant safety, breeding mechanism, and what eats them.`}
        backgroundImage={atmosphere.snailsOnBacopa}
        breadcrumb={[{ label: "Snails" }]}
      />
      <SectionShell>
        <EntryGrid entries={snails} />
        <div className="mt-12">
          <TankMatesLinks entries={snails} />
        </div>
      </SectionShell>
    </>
  );
}
