import type { Metadata } from "next";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { SubstrateCard } from "@/components/substrate/substrate-card";
import { substrates } from "@/data";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/lib/site";
import {
  breadcrumbsJsonLd,
  organizationRef,
} from "@/lib/seo";
import {
  SUBSTRATE_CATEGORY_LABEL,
  type SubstrateCategory,
} from "@/types/substrate";

export const metadata: Metadata = {
  title: "Substrates",
  description:
    "Aquarium substrates and aquasoils, structured comparisons by pH effect, ammonia release, nutrient content, and buffering longevity. ADA, Tropica, UNS, Fluval, Dennerle, Seachem, CaribSea.",
  alternates: {
    canonical: `${site.url}/substrates`,
  },
};

const CATEGORY_ORDER: ReadonlyArray<SubstrateCategory> = [
  "active-aquasoil",
  "inert-nutrient",
  "inert-sand",
  "additive-or-base-layer",
];

const CATEGORY_BLURB: Record<SubstrateCategory, string> = {
  "active-aquasoil":
    "Volcanic clay pellets that lower pH and KH, leach ammonia during cycling, and feed plants for 12 to 24 months.",
  "inert-nutrient":
    "Mineral-rich gravel and sand that does not change water chemistry but supplies iron and trace elements via root contact.",
  "inert-sand":
    "Plain sand and gravel with no buffering and no nutrient release. Cheap, permanent, needs root tabs for heavy feeders.",
  "additive-or-base-layer":
    "Specialty additives and base layers used beneath active soils to extend nutrient release or feed bacteria.",
};

function substratesIndexJsonLd() {
  const url = `${site.url}/substrates`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: "Substrates — Fin & Stem catalogue",
        description:
          "17 planted-aquarium substrate profiles covering active aquasoils, inert nutrient substrates, inert sand and gravel, and additives.",
        publisher: organizationRef(),
        inLanguage: "en",
      },
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: "Substrates" },
        ],
        url,
      ),
      {
        "@type": "ItemList",
        itemListElement: substrates.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          item: `${site.url}/substrates/${s.slug}`,
        })),
      },
    ],
  };
}

export default function SubstratesIndexPage() {
  return (
    <>
      <JsonLd data={substratesIndexJsonLd()} id="substrates-index-jsonld" />
      <PageHero
        eyebrow="Substrates"
        title="The decision that shapes the tank."
        subtitle={`${substrates.length} substrates and aquasoils profiled across four categories. Choose the right substrate and the tank's pH, ammonia cycle, plant performance, and shrimp-safety profile all fall into place. Choose the wrong one and you fight the tank for two years.`}
        backgroundImage={atmosphere.aquascapeWide}
        breadcrumb={[{ label: "Substrates" }]}
      />
      <SectionShell>
        {CATEGORY_ORDER.map((cat) => {
          const inCat = substrates.filter((s) => s.category === cat);
          if (inCat.length === 0) return null;
          return (
            <div key={cat} className="mb-16 last:mb-0">
              <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3 border-b border-border/60 pb-4">
                <h2 className="text-display-tight text-2xl sm:text-3xl">
                  {SUBSTRATE_CATEGORY_LABEL[cat]}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {inCat.length} {inCat.length === 1 ? "profile" : "profiles"}
                </span>
              </header>
              <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {CATEGORY_BLURB[cat]}
              </p>
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {inCat.map((s) => (
                  <li key={s.slug}>
                    <SubstrateCard entry={s} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </SectionShell>
    </>
  );
}
