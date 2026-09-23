import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight, Check } from "lucide-react";
import type { GearCategory } from "@/types/gear";
import { SectionShell } from "@/components/sections/section-shell";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { AccordionSection } from "@/components/ui/accordion-section";
import { Faq } from "@/components/seo/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { GearIndexClient } from "@/components/gear/gear-index-client";
import { GearCard } from "@/components/gear/gear-card";
import { GearCompareTray } from "@/components/gear/gear-compare-tray";
import { GEAR_CATEGORIES, gearCategoryMeta } from "@/lib/gear/categories";
import { activeGearCategories, brandsIn, categoryImage, gearInCategory, toCard } from "@/lib/gear";
import { CATEGORY_SEO_TITLE, gearCategoryJsonLd } from "@/lib/gear/seo";
import { site } from "@/lib/site";
import { METRIC, RATINGS_DISCLAIMER } from "@/lib/gear/ratings";

/** Lower-case a label mid-sentence but keep acronyms like UV and CO2. */
function sentenceCase(label: string): string {
  return label
    .split(" ")
    .map((w) => (/^[A-Z0-9]+$/.test(w) ? w : w.toLowerCase()))
    .join(" ");
}

interface RouteParams {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return activeGearCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { category } = await params;
  const meta = gearCategoryMeta(category);
  if (!meta) return {};
  const products = gearInCategory(meta.id);
  const brands = brandsIn(meta.id);
  const title = CATEGORY_SEO_TITLE[meta.id];
  const description = `${products.length} ${meta.label.toLowerCase()} from ${brands.slice(0, 4).join(", ")}${brands.length > 4 ? " and more" : ""}, with real specs per model, a tank-size matcher and side-by-side compare.`;
  const canonical = `${site.url}/gear/${meta.id}`;
  const img = categoryImage(meta.id);
  const images = img ? [{ url: `${site.url}${img.src}`, width: img.width, height: img.height, alt: title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "website", url: canonical, siteName: site.name, title, description, images },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  };
}

export default async function GearCategoryPage({ params }: RouteParams) {
  const { category } = await params;
  const meta = gearCategoryMeta(category);
  if (!meta) notFound();
  const products = gearInCategory(meta.id as GearCategory);
  if (products.length === 0) notFound();
  const cards = products.map(toCard);
  const brands = brandsIn(meta.id);
  const others = activeGearCategories().filter((c) => c !== meta.id);

  return (
    <>
      <JsonLd data={gearCategoryJsonLd(meta, products)} id={`gear-cat-jsonld-${meta.id}`} />

      <section className="relative isolate border-b border-border/60 pt-24 pb-10 sm:pt-28 sm:pb-12">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Gear", href: "/gear" },
              { name: meta.label },
            ]}
            className="mb-6"
          />
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
            Gear catalogue · {products.length} {products.length === 1 ? meta.singular : meta.label.toLowerCase()}
          </p>
          <h1 className="text-display-tight mt-4 max-w-4xl text-balance text-4xl leading-[1.1] sm:text-5xl">
            Aquarium {meta.label.toLowerCase()}, compared properly
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">
            {meta.tagline} From {brands.join(", ")}. Match them to your tank, then put up to four side by side.
          </p>
        </div>
      </section>

      <SectionShell className="!pb-8 !pt-10" containerClassName="max-w-4xl">
        <div className="flex flex-col gap-3">
          <AccordionSection eyebrow="The short answer" title={`Choosing ${sentenceCase(meta.label)}`}>
            <p id="tldr" className="text-sm leading-relaxed text-foreground/90 sm:text-base">
              {meta.intro}
            </p>
          </AccordionSection>
          <AccordionSection eyebrow="Checklist" title="How to choose">
            <ul className="flex flex-col gap-2.5">
              {meta.howToChoose.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90 sm:text-base">
                  <Check className="mt-1 size-4 flex-none text-[var(--brand)]" aria-hidden />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </AccordionSection>
        </div>
      </SectionShell>

      <SectionShell className="!pt-4">
        <Suspense
          fallback={
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c, i) => (
                <li key={c.id}>
                  <GearCard card={c} priority={i < 3} />
                </li>
              ))}
            </ul>
          }
        >
          <GearIndexClient category={meta.id} cards={cards} />
        </Suspense>
        <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
          Price and {METRIC[meta.id].label.toLowerCase()} ratings: {RATINGS_DISCLAIMER}{" "}
          <Link href="/about#ratings" className="underline underline-offset-2 hover:text-foreground">
            How we rate gear
          </Link>
          .
        </p>
      </SectionShell>

      <SectionShell className="!pt-0" containerClassName="max-w-4xl">
        <Faq
          items={meta.faqs}
          intro={`Straight answers to the questions people ask most when choosing aquarium ${meta.label.toLowerCase()}.`}
        />
        <div className="mt-10">
          <h2 className="text-display-tight text-2xl">Keep reading</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {meta.related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm transition-colors hover:border-[var(--brand)]/40"
                >
                  {r.label}
                  <ArrowRight className="size-4 flex-none text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10">
          <h2 className="text-display-tight text-2xl">Other gear</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {others.map((c) => (
              <Link
                key={c}
                href={`/gear/${c}`}
                className="press rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm transition-colors hover:border-[var(--brand)]/40"
              >
                {GEAR_CATEGORIES[c].label}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
          Specs come from the maker or a major retailer&rsquo;s listing and are checked where
          we can. Makers revise products, so confirm the figures on the product page before
          you buy. Product photos are supplied by the brands and their distributors.
        </p>
      </SectionShell>

      <GearCompareTray />
    </>
  );
}
