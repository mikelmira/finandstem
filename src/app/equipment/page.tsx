import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/lib/site";
import { organizationRef } from "@/lib/seo";
import { EQUIPMENT } from "@/data/equipment";

export const metadata: Metadata = {
  title: "Aquarium Equipment: How to Choose Lighting, Filters, CO2 & Heating",
  description:
    "How to choose and size the gear for a planted tank, using the rules that hold across brands: PAR bands for lighting, turnover for filters, when you need CO2, and heater wattage. No jargon, no product hype.",
  alternates: { canonical: `${site.url}/equipment` },
};

export default function EquipmentHubPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${site.url}/equipment#collection`,
              url: `${site.url}/equipment`,
              name: "Aquarium Equipment",
              description:
                "How to choose and size aquarium lighting, filtration, CO2 and heating.",
              publisher: organizationRef(),
              inLanguage: "en",
            },
            {
              "@type": "ItemList",
              itemListElement: EQUIPMENT.map((e, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: e.name,
                item: `${site.url}/equipment/${e.slug}`,
              })),
            },
          ],
        }}
        id="equipment-hub-jsonld"
      />

      <PageHero
        eyebrow="Equipment"
        title="Choosing gear, without the guesswork."
        subtitle="You don't need to memorise product specs to kit out a tank. You need a few rules that hold across every brand: how much light your plants can use, how much filter flow to aim for, whether you actually need CO2, and what size heater to run. That's what these cover."
        breadcrumb={[{ label: "Equipment" }]}
      />

      <SectionShell>
        <ul className="grid gap-3 sm:grid-cols-2">
          {EQUIPMENT.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/equipment/${e.slug}`}
                className="press group flex h-full flex-col gap-2 rounded-2xl border border-border bg-background/60 p-5 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium">{e.name}</span>
                  <ArrowRight
                    className="mt-0.5 size-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {e.spot}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </SectionShell>
    </>
  );
}
