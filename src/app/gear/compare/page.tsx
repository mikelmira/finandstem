import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { GEAR_CATEGORIES } from "@/lib/gear/categories";
import { SectionShell } from "@/components/sections/section-shell";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { GearCompareClient } from "@/components/gear/gear-compare-client";
import { activeGearCategories, gearCount } from "@/lib/gear";
import { breadcrumbsJsonLd, organizationRef } from "@/lib/seo";
import { GEAR_COMPARE_FAQS } from "@/lib/gear/seo";
import { Faq } from "@/components/seo/faq";
import { site } from "@/lib/site";
import type { GearCategory } from "@/types/gear";

export const metadata: Metadata = {
  title: "Compare aquarium gear side by side",
  description:
    "Put up to four filters, lights, heaters, CO2 regulators, tanks or other aquarium gear side by side and compare them model by model on real specs.",
  alternates: { canonical: `${site.url}/gear/compare` },
};

export default function GearComparePage() {
  const counts: Partial<Record<GearCategory, number>> = {};
  for (const c of activeGearCategories()) counts[c] = gearCount(c);
  const url = `${site.url}/gear/compare`;
  return (
    <>
      <JsonLd
        id="gear-compare-jsonld"
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "@id": `${url}#app`,
              url,
              name: "Aquarium gear comparison",
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Any",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: organizationRef(),
              description:
                "Compare aquarium filters, lights, heaters, CO2 gear, tanks and more side by side on published specs.",
            },
            breadcrumbsJsonLd(
              [
                { name: "Home", href: "/" },
                { name: "Gear", href: "/gear" },
                { name: "Compare" },
              ],
              url,
            ),
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: GEAR_COMPARE_FAQS.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ],
        }}
      />
      <section className="border-b border-border/60 pt-24 pb-10 sm:pt-28">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Gear", href: "/gear" },
              { name: "Compare" },
            ]}
            className="mb-6"
          />
          <h1 className="text-display-tight text-balance text-4xl leading-[1.1] sm:text-5xl">
            Compare gear side by side
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">
            Pick up to four products from one category and choose the size of each. Every
            spec lines up in one table, so the differences are obvious.
          </p>
        </div>
      </section>
      <SectionShell className="!pt-10">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading the comparison…</p>}>
          <GearCompareClient counts={counts} />
        </Suspense>
      </SectionShell>
      <SectionShell className="!pt-0" containerClassName="max-w-3xl">
        <h2 className="text-display-tight text-2xl sm:text-3xl">How the comparison works</h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">
          <p>
            Every column is one product, and every row is one spec, so you read across to see
            which is bigger, stronger or more efficient. Products with several sizes get a
            model picker at the top of their column: choose the size you would actually buy
            and the numbers update.
          </p>
          <p>
            A dash means the maker doesn&rsquo;t publish that figure, not that it is zero.
            Filter and pump flow is the rated figure, measured without media or hoses, so
            compare filters against each other rather than against your tank&rsquo;s exact
            needs. The category pages have a tank-size matcher that allows for that.
          </p>
          <p>
            Not sure what to compare yet? Start with the{" "}
            <Link href="/gear" className="font-medium text-[var(--brand)] underline-offset-4 hover:underline">
              kit finder
            </Link>
            , pick your tank size, and it will list the filters, lights and heaters that fit.
          </p>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {activeGearCategories().map((c) => (
            <li key={c}>
              <Link
                href={`/gear/${c}`}
                className="press rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm transition-colors hover:border-[var(--brand)]/40"
              >
                {GEAR_CATEGORIES[c].label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Faq items={GEAR_COMPARE_FAQS} intro="Quick answers about using the comparison table." />
        </div>
      </SectionShell>
    </>
  );
}
