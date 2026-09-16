import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import {
  DISEASES,
  PATHOGEN_LABEL,
  type Affected,
} from "@/data/diseases";
import { site } from "@/lib/site";
import { organizationRef } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Fish & Shrimp Disease ID: Symptoms, Causes and Safe Treatment",
  description:
    "Spot what's wrong with your fish or shrimp, from ich and fin rot to failed molts, and treat it without wiping out your shrimp, snails or plants.",
  alternates: { canonical: `${site.url}/diseases` },
};

const GROUP_ORDER: Affected[] = ["fish", "shrimp"];

const GROUP_TITLE: Record<Affected, string> = {
  fish: "Fish diseases",
  shrimp: "Shrimp problems",
  snails: "Snail problems",
};

const GROUP_BLURB: Record<Affected, string> = {
  fish: "Most fish illness is a parasite, a bacterial infection, or a fungus taking hold on a stressed or injured fish. Match the look to the cause, then treat without harming your inverts and plants.",
  shrimp: "Shrimp rarely 'catch' things the way fish do. Their troubles are mostly water chemistry and molting, plus a couple of treatable external hitchhikers. Internal infections are best prevented, not cured.",
  snails: "Snail health issues are uncommon and mostly down to water quality and shell care.",
};

export default function DiseaseHubPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${site.url}/diseases#collection`,
              url: `${site.url}/diseases`,
              name: "Fish & Shrimp Disease ID",
              description:
                "Identify and treat common aquarium fish and shrimp health problems, with invertebrate-safe treatment for planted tanks.",
              publisher: organizationRef(),
              inLanguage: "en",
            },
            {
              "@type": "ItemList",
              itemListElement: DISEASES.map((d, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: d.name,
                item: `${site.url}/diseases/${d.slug}`,
              })),
            },
          ],
        }}
        id="disease-hub-jsonld"
      />

      <PageHero
        eyebrow="Fish & shrimp health"
        title="What's wrong with your fish or shrimp?"
        subtitle="Salt-like spots, ragged fins, a gold dusting, a shrimp stuck in its shell. Each points somewhere different. Find the match below, then treat it the planted-tank way, without copper or harsh meds that wipe out your shrimp, snails and beneficial bacteria."
        breadcrumb={[{ label: "Fish & shrimp health" }]}
      />

      <SectionShell>
        <div className="flex flex-col gap-14">
          {GROUP_ORDER.map((group) => {
            const inGroup = DISEASES.filter((d) => d.affects.includes(group));
            if (inGroup.length === 0) return null;
            return (
              <div key={group}>
                <header className="mb-5 border-b border-border/60 pb-4">
                  <h2 className="text-display-tight text-2xl sm:text-3xl">
                    {GROUP_TITLE[group]}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {GROUP_BLURB[group]}
                  </p>
                </header>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {inGroup.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/diseases/${d.slug}`}
                        className="press group flex h-full flex-col gap-1.5 rounded-xl border border-border bg-background/60 p-4 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-medium text-foreground transition-colors group-hover:text-[var(--brand)]">
                            {d.name}
                          </span>
                          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                            {PATHOGEN_LABEL[d.pathogen]}
                          </span>
                        </span>
                        <span className="text-sm leading-relaxed text-muted-foreground">
                          {d.spot}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A sick fish or shrimp is nearly always telling you something about the
          tank: a chill, a water-quality slip, a stressed newcomer, or minerals
          out of range. Match the symptom, treat the animal, then fix the cause
          so it doesn&rsquo;t return. Every guide flags which treatments are safe
          around shrimp, snails and plants, and which belong in a quarantine
          tank. In a new tank, sudden losses are usually the{" "}
          <Link
            href="/aquarium-cycling"
            className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)]"
          >
            cycle
          </Link>
          , not a disease. And if it&rsquo;s the plants that look unwell rather
          than the animals, see{" "}
          <Link
            href="/deficiencies"
            className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)]"
          >
            plant deficiency ID
          </Link>
          .
        </p>
      </SectionShell>
    </>
  );
}
