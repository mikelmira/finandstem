import type { Metadata } from "next";
import Link from "next/link";
import { topicImages } from "@/components/seo/topic-figure";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { atmosphere } from "@/data/atmosphere";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import {
  DEFICIENCIES,
  SYMPTOM_LOCATION_LABEL,
  type SymptomLocation,
} from "@/data/deficiencies";
import { site } from "@/lib/site";
import { organizationRef } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Plant Deficiency ID: Diagnose and Fix Aquarium Plant Problems",
  description:
    "Yellowing, pinholes, twisted tips, pale reds? Work out which nutrient your aquarium plants are short of by where the damage shows, then get the fix that works.",
  alternates: { canonical: `${site.url}/deficiencies` },
};

const GROUP_ORDER: SymptomLocation[] = ["old", "new", "all"];

const GROUP_BLURB: Record<SymptomLocation, string> = {
  old: "Mobile nutrients get pulled from old leaves to feed new growth, so a shortage shows on the lower, older leaves first.",
  new: "Immobile nutrients can't be moved once placed, so the newest leaves and growing tips show the shortage first.",
  all: "Not a mineral shortage, but the most common limit on plant growth, and it slows and shrinks the whole tank.",
};

export default function DeficiencyHubPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${site.url}/deficiencies#collection`,
              url: `${site.url}/deficiencies`,
              name: "Plant Deficiency ID",
              description:
                "Diagnose aquarium plant nutrient deficiencies by where the symptoms show, with the fix for each.",
              publisher: organizationRef(),
              inLanguage: "en",
            },
            {
              "@type": "ItemList",
              itemListElement: DEFICIENCIES.map((d, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: d.name,
                item: `${site.url}/deficiencies/${d.slug}`,
              })),
            },
          ],
        }}
        id="deficiency-hub-jsonld"
      />

      <PageHero
        backgroundImage={atmosphere.carpetSchool}
        eyebrow="Plant deficiency ID"
        title="Why does your plant look like that?"
        subtitle="Yellow old leaves, pale new tips, pinholes, twisted growth, fading reds. Each one points at a different nutrient. The first question is always where the damage shows, on the old leaves or the new, so start there and narrow it down."
        breadcrumb={[{ label: "Plant deficiencies" }]}
      />

      <SectionShell>
        <div className="flex flex-col gap-14">
          {GROUP_ORDER.map((group) => {
            const inGroup = DEFICIENCIES.filter((d) => d.showsOn === group);
            if (inGroup.length === 0) return null;
            return (
              <div key={group}>
                <header className="mb-5 border-b border-border/60 pb-4">
                  <h2 className="text-display-tight text-2xl sm:text-3xl">
                    {SYMPTOM_LOCATION_LABEL[group]}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {GROUP_BLURB[group]}
                  </p>
                </header>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {inGroup.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/deficiencies/${d.slug}`}
                        className="press group flex h-full flex-col gap-1.5 rounded-xl border border-border bg-background/60 p-4 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                      >
                        {(() => {
                                          const t = topicImages("deficiencies", d.slug)[0];
                                          return t ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                              src={t.src}
                                              alt={t.alt}
                                              loading="lazy"
                                              className="mb-1 aspect-[16/9] w-full rounded-lg object-cover"
                                            />
                                          ) : null;
                                        })()}
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-medium text-foreground transition-colors group-hover:text-[var(--brand)]">
                            {d.name}
                          </span>
                          <ArrowRight
                            className="size-4 flex-none text-muted-foreground"
                            aria-hidden
                          />
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
          A deficiency is the plant telling you what the water is short of. Work
          out where the damage starts, match it to a nutrient, then fix the
          supply rather than trimming symptoms. Each guide links to plants that
          show the shortage early, so you can compare against a species you keep.
          If the trouble is something growing on the leaf or glass rather than
          the leaf itself, that is algae, see{" "}
          <Link
            href="/algae"
            className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)]"
          >
            algae ID
          </Link>
          .
        </p>
      </SectionShell>
    </>
  );
}
