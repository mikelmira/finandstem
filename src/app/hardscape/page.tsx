import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/lib/site";
import { organizationRef } from "@/lib/seo";
import { HARDSCAPE, type HardscapeType } from "@/data/hardscape";
import { EffectBadges } from "@/components/hardscape/effect-badges";
import { HardscapeVisual } from "@/components/hardscape/hardscape-visual";

export const metadata: Metadata = {
  title: "Aquascaping Hardscape: Stones & Wood and What They Do to Your Water",
  description:
    "Every aquascaping stone and wood, with its real effect on pH and hardness. Some stones raise hardness and quietly ruin a soft-water tank; most wood leaches tannins. Pick hardscape that matches the tank you want.",
  alternates: { canonical: `${site.url}/hardscape` },
};

const STONES = HARDSCAPE.filter((h) => h.category === "stone");
const WOOD = HARDSCAPE.filter((h) => h.category === "wood");

export default function HardscapeHubPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${site.url}/hardscape#collection`,
              url: `${site.url}/hardscape`,
              name: "Aquascaping Hardscape",
              description:
                "Aquascaping stones and wood with their effect on pH and hardness.",
              publisher: organizationRef(),
              inLanguage: "en",
            },
            {
              "@type": "ItemList",
              itemListElement: HARDSCAPE.map((h, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: h.name,
                item: `${site.url}/hardscape/${h.slug}`,
              })),
            },
          ],
        }}
        id="hardscape-hub-jsonld"
      />

      <PageHero
        eyebrow="Hardscape"
        title="Stones and wood, and what they do to your water."
        subtitle="The part most guides skip: some stones are calcareous and slowly push pH and hardness up, which quietly works against a soft-water tank, while most wood leaches tannins that tint the water and nudge pH down. Here's every common stone and wood with its real effect, so you can build a scape that suits the water you want."
        breadcrumb={[{ label: "Hardscape" }]}
      />

      <SectionShell>
        <HardscapeGroup title="Stone" note="Watch for calcareous stones" items={STONES} />
        <div className="mt-14">
          <HardscapeGroup title="Wood" note="Watch for tannins and floating" items={WOOD} />
        </div>
      </SectionShell>
    </>
  );
}

function HardscapeGroup({
  title,
  note,
  items,
}: {
  title: string;
  note: string;
  items: ReadonlyArray<HardscapeType>;
}) {
  return (
    <section>
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="text-display-tight text-2xl sm:text-3xl">{title}</h2>
        <span className="text-xs text-muted-foreground">{note}</span>
      </header>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((h) => (
          <li key={h.slug}>
            <Link
              href={`/hardscape/${h.slug}`}
              className="press group flex h-full flex-col gap-3 rounded-2xl border border-border bg-background/60 p-3 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
            >
              <HardscapeVisual item={h} size="card" />
              <div className="flex flex-col gap-3 px-2 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium leading-tight">{h.name}</span>
                  <ArrowRight
                    className="mt-0.5 size-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {h.spot}
                </p>
                <EffectBadges item={h} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
