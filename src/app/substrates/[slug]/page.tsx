import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Beaker, Check, X } from "lucide-react";
import { findSubstrate, substrates, plants } from "@/data";
import { PLANT_AFFINITY } from "@/data/substrate-plant-affinity";
import { SectionShell } from "@/components/sections/section-shell";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Tldr } from "@/components/seo/tldr";
import { Sources } from "@/components/seo/sources";
import { JsonLd } from "@/components/seo/json-ld";
import { SubstrateVisual } from "@/components/substrate/substrate-visual";
import { site } from "@/lib/site";
import {
  breadcrumbsJsonLd,
  personEntity,
  organizationEntity,
} from "@/lib/seo";
import {
  SUBSTRATE_CATEGORY_LABEL,
  PH_EFFECT_LABEL,
  KH_EFFECT_LABEL,
  AMMONIA_RELEASE_LABEL,
} from "@/types/substrate";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return substrates.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const entry = findSubstrate(slug);
  if (!entry) return {};
  const canonical = `${site.url}/substrates/${entry.slug}`;
  const desc = entry.careSummary.slice(0, 150);
  return {
    title: `${entry.name} — review and specs`,
    description: desc,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: site.name,
      title: `${entry.name} — Fin & Stem`,
      description: desc,
    },
  };
}

function substratePageJsonLd(slug: string) {
  const entry = findSubstrate(slug);
  if (!entry) return null;
  const url = `${site.url}/substrates/${entry.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: entry.name,
        description: entry.careSummary,
        datePublished: entry.publishedAt,
        dateModified: entry.updatedAt,
        inLanguage: "en",
        author: personEntity(),
        publisher: organizationEntity(),
        articleSection: "Substrates",
      },
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: "Substrates", href: "/substrates" },
          { name: entry.name },
        ],
        url,
      ),
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: entry.name,
        brand: { "@type": "Brand", name: entry.brand },
        category: SUBSTRATE_CATEGORY_LABEL[entry.category],
        countryOfOrigin: entry.countryOfOrigin,
        description: entry.careSummary,
        additionalProperty: [
          { "@type": "PropertyValue", name: "Grain size", value: entry.grainSize },
          { "@type": "PropertyValue", name: "pH target", value: entry.phTarget },
          { "@type": "PropertyValue", name: "Ammonia release", value: AMMONIA_RELEASE_LABEL[entry.ammoniaRelease] },
          { "@type": "PropertyValue", name: "Nutrient content", value: entry.nutrientContent },
          { "@type": "PropertyValue", name: "Buffering longevity", value: entry.bufferingLongevity },
          { "@type": "PropertyValue", name: "Recommended water", value: entry.recommendedWater },
        ],
      },
    ],
  };
}

export default async function SubstrateDetailPage({ params }: RouteParams) {
  const { slug } = await params;
  const entry = findSubstrate(slug);
  if (!entry) notFound();

  const affinityList = PLANT_AFFINITY[entry.category] ?? [];
  const affinityHits = affinityList
    .map((aff) => {
      const plant = plants.find((p) => p.slug === aff.slug);
      return plant ? { plant, note: aff.note } : null;
    })
    .filter(
      (a): a is { plant: (typeof plants)[number]; note: string } => a !== null,
    );

  // Supplier link, the first source URL is consistently the
  // manufacturer's official product page across all substrate entries.
  // Surfaced as a CTA so visitors can jump straight to the supplier.
  const supplierSource = entry.sources[0];

  return (
    <>
      {(() => {
        const data = substratePageJsonLd(entry.slug);
        return data ? <JsonLd data={data} id={`substrate-jsonld-${entry.slug}`} /> : null;
      })()}

      {/* Hero, brand-led title block on the cream paper background.
          Visual identity tile sits above the title — colour swatch
          representing the substrate's documented colour, plus grain
          texture. Akadama uses a real public-domain photo. */}
      <section className="relative isolate border-b border-border/60 pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Substrates", href: "/substrates" },
              { name: entry.name },
            ]}
            className="mb-6"
          />
          <SubstrateVisual entry={entry} size="hero" className="mb-8" />
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
            <Beaker className="size-4" aria-hidden />
            {entry.brand} · {SUBSTRATE_CATEGORY_LABEL[entry.category]}
          </p>
          <h1 className="text-display-tight mt-5 text-balance text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
            {entry.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">
            {entry.countryOfOrigin} · {entry.colour} · grain {entry.grainSize}
          </p>

          {/* Key-spec pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            <SpecPill label="pH target" value={entry.phTarget} />
            <SpecPill label="Ammonia" value={AMMONIA_RELEASE_LABEL[entry.ammoniaRelease]} />
            <SpecPill label="Lifespan" value={entry.bufferingLongevity} />
            <SpecPill
              label="Shrimp-safe"
              value={entry.shrimpSafe ? "Yes" : "No"}
              tone={entry.shrimpSafe ? "ok" : "warn"}
            />
          </div>

          {supplierSource && (
            <div className="mt-6 border-t border-border/50 pt-5">
              <a
                href={supplierSource.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="press group inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/40 bg-[var(--brand)]/5 px-4 py-2 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-[var(--brand)]/70 hover:bg-[var(--brand)]/10"
              >
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
                  Supplier
                </span>
                <span>Visit product page</span>
                <ArrowUpRight
                  className="size-4 text-[var(--brand)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
              <p className="mt-2 text-xs text-muted-foreground">
                External link to {extractDomain(supplierSource.url)} —
                opens in a new tab.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* TL;DR */}
      <SectionShell containerClassName="max-w-4xl">
        <Tldr body={entry.careSummary} subject={entry.name} />
      </SectionShell>

      {/* Spec table */}
      <SectionShell className="!pt-0" containerClassName="max-w-4xl">
        <div className="glass glass-edge rounded-2xl p-6 sm:p-8">
          <h2 className="text-display-tight text-2xl sm:text-3xl">Full specs</h2>
          <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
            <SpecRow label="Brand" value={entry.brand} />
            <SpecRow label="Country of origin" value={entry.countryOfOrigin} />
            <SpecRow label="Category" value={SUBSTRATE_CATEGORY_LABEL[entry.category]} />
            <SpecRow label="Colour" value={entry.colour} />
            <SpecRow label="Grain size" value={entry.grainSize} />
            <SpecRow label="pH target" value={entry.phTarget} />
            <SpecRow label="pH effect" value={PH_EFFECT_LABEL[entry.phEffect]} />
            <SpecRow label="KH effect" value={KH_EFFECT_LABEL[entry.khEffect]} />
            <SpecRow label="Ammonia release" value={AMMONIA_RELEASE_LABEL[entry.ammoniaRelease]} />
            <SpecRow label="Nutrient content" value={entry.nutrientContent} />
            <SpecRow label="Buffering longevity" value={entry.bufferingLongevity} />
            <SpecRow label="Recommended water" value={entry.recommendedWater} />
            <SpecRow label="Difficulty" value={`${entry.difficulty} / 5`} />
            <SpecRow label="Shrimp-safe" value={entry.shrimpSafe ? "Yes" : "No"} />
            <SpecRow
              label="Best for"
              value={entry.bestFor.join(", ")}
              wide
            />
          </dl>
        </div>
      </SectionShell>

      {/* Prose sections */}
      <SectionShell className="!pt-0" containerClassName="max-w-4xl">
        <div className="space-y-12">
          <ProseSection heading="How it works" body={entry.sections.howItWorks} />
          <ProseSection heading="Best use cases" body={entry.sections.bestUseCases} />
          <ProseSection heading="Common mistakes" body={entry.sections.commonMistakes} />
          <ProseSection heading="Pro tips" body={entry.sections.proTips} />
        </div>
      </SectionShell>

      {/* Plants that thrive in this substrate */}
      {affinityHits.length > 0 && (
        <SectionShell className="!pt-0" containerClassName="max-w-4xl">
          <div>
            <h2 className="text-display-tight text-2xl sm:text-3xl">
              Plants that thrive in this substrate
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Hand-curated pairings based on the substrate category, not a relational query.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {affinityHits.map(({ plant, note }) => (
                <li key={plant.slug}>
                  <Link
                    href={`/plants/${plant.slug}`}
                    className="press group flex flex-col gap-1 rounded-xl border border-border/60 bg-background/60 p-4 transition-colors hover:border-[var(--brand)]/40"
                  >
                    <span className="text-sm font-medium text-foreground transition-colors group-hover:text-[var(--brand)]">
                      {plant.commonName}
                    </span>
                    <span className="text-xs italic text-muted-foreground">
                      {plant.scientificName}
                    </span>
                    <span className="mt-1 text-xs leading-relaxed text-foreground/75">
                      {note}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </SectionShell>
      )}

      {/* Sources */}
      <SectionShell className="!pt-0" containerClassName="max-w-4xl">
        <Sources items={entry.sources} />
      </SectionShell>

      {/* Footer CTA, back to catalogue + open compare */}
      <SectionShell className="border-t border-border/60">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            Compare against another substrate.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Line up to four substrates side by side. Spec table, pH effect,
            ammonia release, nutrient content, shrimp safety.
          </p>
          <Link
            href="/compare"
            className="press inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--brand)]/20 transition-all hover:-translate-y-0.5"
          >
            Open the compare tool
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </SectionShell>
    </>
  );
}

function SpecPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "ok" | "warn";
}) {
  const toneClass =
    tone === "ok"
      ? "border-[var(--brand)]/40 bg-[var(--brand)]/10 text-foreground"
      : tone === "warn"
        ? "border-amber-500/40 bg-amber-500/10 text-amber-700"
        : "border-border bg-background/60 text-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${toneClass}`}
    >
      <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <span>{value}</span>
      {tone === "ok" && <Check className="size-3" aria-hidden />}
      {tone === "warn" && <X className="size-3" aria-hidden />}
    </span>
  );
}

function SpecRow({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium leading-snug text-foreground sm:text-base">
        {value}
      </dd>
    </div>
  );
}

/**
 * Strip a URL down to its bare hostname for the supplier-link helper text,
 * e.g. `https://www.adana.co.jp/en/...` → `adana.co.jp`.
 */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ProseSection({ heading, body }: { heading: string; body: string }) {
  if (!body) return null;
  return (
    <section>
      <h2 className="text-display-tight text-2xl sm:text-3xl">{heading}</h2>
      <p className="mt-4 text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
        {body}
      </p>
    </section>
  );
}
