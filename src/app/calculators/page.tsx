import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/lib/site";
import { organizationRef } from "@/lib/seo";
import { CALCULATORS } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Aquarium Calculators: Volume, Substrate, CO2 & Dosing",
  description:
    "Free planted-tank calculators: work out your true tank volume, how much substrate to buy, your dissolved CO2 from pH and KH, and dry fertiliser dosing in ppm. No signup.",
  alternates: { canonical: `${site.url}/calculators` },
};

export default function CalculatorsHubPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${site.url}/calculators#collection`,
              url: `${site.url}/calculators`,
              name: "Aquarium Calculators",
              description:
                "Planted-tank calculators for volume, substrate, CO2 and fertiliser dosing.",
              publisher: organizationRef(),
              inLanguage: "en",
            },
            {
              "@type": "ItemList",
              itemListElement: CALCULATORS.map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: c.name,
                item: `${site.url}/calculators/${c.slug}`,
              })),
            },
          ],
        }}
        id="calculators-hub-jsonld"
      />

      <PageHero
        eyebrow="Calculators"
        title="The numbers, worked out for you."
        subtitle="Four quick planted-tank calculators. Get your tank's true volume, how much substrate to buy, your dissolved CO2 from pH and KH, and how dry salts turn into ppm. All free, all in your browser, nothing to sign up for."
        breadcrumb={[{ label: "Calculators" }]}
      />

      <SectionShell>
        <ul className="grid gap-3 sm:grid-cols-2">
          {CALCULATORS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/calculators/${c.slug}`}
                className="press group flex h-full flex-col gap-2 rounded-2xl border border-border bg-background/60 p-5 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium">{c.name}</span>
                  <ArrowRight
                    className="mt-0.5 size-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {c.spot}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </SectionShell>
    </>
  );
}
