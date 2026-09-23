import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Columns3 } from "lucide-react";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { Tldr } from "@/components/seo/tldr";
import { TankKitFinder, type KitSize } from "@/components/gear/tank-kit-finder";
import { GEAR_CATEGORIES } from "@/lib/gear/categories";
import { GEAR, activeGearCategories, categoryImage, gearCount, gearInCategory } from "@/lib/gear";
import { productFit, typicalLengthForLitres, type GearQuery } from "@/lib/gear/match";
import { STANDARD_TANKS } from "@/lib/catalogue/tank-standards";
import { GEAR_HUB_FAQS, gearHubJsonLd } from "@/lib/gear/seo";
import { Faq } from "@/components/seo/faq";
import { site } from "@/lib/site";
import type { GearCategory } from "@/types/gear";

export const metadata: Metadata = {
  title: "Aquarium gear compared by tank size",
  description:
    "Planted-aquarium equipment and hardscape with real specs. Match filters, lights, heaters and tanks to your tank size, then compare products side by side.",
  alternates: { canonical: `${site.url}/gear` },
};

const KIT_CATEGORIES: GearCategory[] = ["aquariums", "filters", "lights", "heaters", "co2", "stands", "air-pumps"];

function kitSizes(): KitSize[] {
  return STANDARD_TANKS.filter((t) => t.litres >= 20).map((t) => {
    const len = typicalLengthForLitres(t.litres);
    const counts: Partial<Record<GearCategory, number>> = {};
    for (const c of KIT_CATEGORIES) {
      const q: GearQuery = c === "lights" || c === "stands" ? { lengthCm: len } : { tankL: t.litres };
      counts[c] = gearInCategory(c).filter((p) => {
        const f = productFit(c, p.models, q).fit;
        return f === "ideal" || f === "workable";
      }).length;
    }
    return { litres: t.litres, label: t.blurb, counts };
  });
}

export default function GearHubPage() {
  const cats = activeGearCategories().map((c) => ({
    meta: GEAR_CATEGORIES[c],
    count: gearCount(c),
    image: categoryImage(c),
  }));
  const brands = Array.from(new Set(GEAR.map((p) => p.brand))).sort();

  return (
    <>
      <JsonLd data={gearHubJsonLd(cats)} id="gear-hub-jsonld" />
      <PageHero
        eyebrow="Gear"
        title="The kit, compared on the numbers that matter."
        subtitle={`${GEAR.length} products from ${brands.length} brands, with real specs. Tell us your tank size and we'll show what fits, then line products up side by side.`}
        backgroundImage={atmosphere.aquascapeWide}
        breadcrumb={[{ label: "Gear" }]}
      />

      <SectionShell className="!pb-10" containerClassName="max-w-5xl">
        <TankKitFinder sizes={kitSizes()} />
      </SectionShell>

      <SectionShell className="!pt-6">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3 border-b border-border/60 pb-4">
          <h2 className="text-display-tight text-2xl sm:text-3xl">Browse by category</h2>
          <Link
            href="/gear/compare"
            className="press inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline"
          >
            <Columns3 className="size-4" aria-hidden /> Compare products
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map(({ meta, count, image }) => (
            <li key={meta.id}>
              <Link
                href={`/gear/${meta.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--brand)]/40 hover:shadow-md"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-white">
                  {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.thumb}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold">{meta.label}</h3>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{meta.tagline}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-[var(--brand)]">
                    Browse <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell className="!pt-0" containerClassName="max-w-4xl">
        <Tldr
          subject="buying gear for a planted tank"
          body={
            "Start with the tank, because everything else is sized from it. Once you know the volume and length, the rest follows: a filter rated at about 5 to 10 times the volume per hour, a heater around 1 watt per litre, and a light made for the tank's length. Decide early whether you want a low-tech tank (low light, easy plants, no CO2) or a high-tech one (strong light, CO2, faster growth), because that choice changes the light and CO2 budget more than anything else.\n\nEvery product here lists the specs we could verify from the maker or a major retailer, and every category has a matcher that filters by your tank size. Found two or three you like? Add them to the compare table and look at them side by side, model by model. We only list main equipment and hardscape, not spare parts or consumables, so the lists stay useful."
          }
        />
        <div className="mt-10">
          <Faq items={GEAR_HUB_FAQS} intro="The questions people ask most when kitting out a planted tank." />
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Brands covered: {brands.join(", ")}. Fin &amp; Stem is not a shop and is not paid to
          rank anything here. Product photos are supplied by the brands and their distributors.
        </p>
      </SectionShell>
    </>
  );
}
