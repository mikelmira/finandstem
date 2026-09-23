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
import { gearCount } from "@/lib/gear";

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
        <div className="mt-14 flex flex-col gap-3 rounded-2xl border border-[var(--brand)]/25 bg-[var(--brand)]/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-display-tight text-xl sm:text-2xl">
              See real pieces before you buy
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {gearCount("hardscape")} stones, woods and bonsai trees from suppliers, with photos,
              sizes and what each does to your water.
            </p>
          </div>
          <Link
            href="/gear/hardscape"
            className="press inline-flex flex-none items-center gap-1.5 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white"
          >
            Browse hardscape
          </Link>
        </div>
        <p className="mt-12 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Picked your stone and wood? The next step is arranging it. See{" "}
          <Link
            href="/aquascaping-design"
            className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)]"
          >
            aquascaping design and composition
          </Link>{" "}
          for the rule of thirds, layout shapes and the main styles.
        </p>
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
