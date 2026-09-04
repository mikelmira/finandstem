import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { CATEGORY_META } from "@/types/catalogue";
import { getEntryDates } from "@/data/timestamps";
import {
  comparisonPairs,
  getComparison,
  comparisonTitle,
  comparisonDescription,
  comparisonTldr,
  comparisonFaqs,
  type ComparisonPair,
} from "@/lib/catalogue/comparisons";
import { comparisonPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { AuthorByline } from "@/components/seo/author-byline";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";
import { CompareOverview } from "@/components/compare/compare-overview";
import { CompareTable } from "@/components/compare/compare-table";

interface RouteParams {
  params: Promise<{ versus: string }>;
}

// Only the curated pairs exist; anything else is a 404 rather than a thin
// auto-rendered page.
export const dynamicParams = false;

export async function generateStaticParams() {
  return comparisonPairs().map((p) => ({ versus: p.versus }));
}

function trim(text: string, max = 155): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { versus } = await params;
  const pair = getComparison(versus);
  if (!pair) return {};
  const title = comparisonTitle(pair);
  const description = trim(comparisonDescription(pair));
  const canonical = `${site.url}/compare/${versus}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: site.name,
      title,
      description,
      locale: "en",
      authors: [`${site.url}/about`],
    },
    twitter: { card: "summary_large_image", title, description },
    keywords: [
      `${pair.a.commonName} vs ${pair.b.commonName}`,
      `${pair.a.commonName} or ${pair.b.commonName}`,
      pair.a.commonName,
      pair.b.commonName,
      `${CATEGORY_META[pair.a.category].singular.toLowerCase()} comparison`,
    ],
    other: { "article:author": `${site.url}/about` },
  };
}

/** Up to six other comparisons that share one of these two species. */
function relatedComparisons(current: ComparisonPair): ComparisonPair[] {
  const slugs = new Set([current.a.slug, current.b.slug]);
  return comparisonPairs()
    .filter(
      (p) =>
        p.versus !== current.versus &&
        (slugs.has(p.a.slug) || slugs.has(p.b.slug)),
    )
    .slice(0, 6);
}

export default async function ComparisonPage({ params }: RouteParams) {
  const { versus } = await params;
  const pair = getComparison(versus);
  if (!pair) notFound();

  const { a, b } = pair;
  const title = comparisonTitle(pair);
  const description = comparisonDescription(pair);
  const tldr = comparisonTldr(pair);
  const faqs = comparisonFaqs(pair);
  const meta = CATEGORY_META[a.category];

  const aDates = getEntryDates(a.slug);
  const bDates = getEntryDates(b.slug);
  const updatedAt =
    [aDates.updatedAt, bDates.updatedAt].sort().at(-1) ?? aDates.updatedAt;

  const related = relatedComparisons(pair);

  return (
    <>
      <JsonLd
        data={comparisonPageJsonLd({
          title,
          description,
          slug: versus,
          faqs,
          aSlug: a.slug,
          bSlug: b.slug,
          aName: a.commonName,
          bName: b.commonName,
        })}
        id={`comparison-jsonld-${versus}`}
      />

      <article className="mx-auto w-full max-w-5xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Compare", href: "/compare" },
            { name: title },
          ]}
          className="mb-8"
        />

        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            {meta.singular} comparison
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            {a.commonName} vs {b.commonName}
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
          <div className="mt-6 border-t border-border/50 pt-5">
            <AuthorByline updatedAt={updatedAt} />
          </div>
        </header>

        <Tldr body={tldr} subject={`${a.commonName} vs ${b.commonName}`} />

        <section className="mt-12 flex flex-col gap-12">
          <CompareOverview entries={[a.raw, b.raw]} />
          <div className="flex flex-col gap-4">
            <header className="flex items-baseline justify-between gap-3">
              <h2 className="text-display-tight text-2xl sm:text-3xl">
                Full attributes
              </h2>
              <span className="text-xs text-muted-foreground">
                Every parameter, side by side
              </span>
            </header>
            <CompareTable entries={[a.raw, b.raw]} />
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <ProfileLink
            href={`${meta.path}/${a.slug}`}
            common={a.commonName}
            scientific={a.scientificName}
          />
          <ProfileLink
            href={`${meta.path}/${b.slug}`}
            common={b.commonName}
            scientific={b.scientificName}
          />
        </section>

        <section className="mt-12">
          <Faq items={faqs} />
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="text-display-tight text-2xl sm:text-3xl">
              More comparisons
            </h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.versus}>
                  <Link
                    href={`/compare/${r.versus}`}
                    className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                  >
                    <span>
                      {r.a.commonName} vs {r.b.commonName}
                    </span>
                    <ArrowRight
                      className="size-4 flex-none text-muted-foreground"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/compare"
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Compare any species
          </Link>
          <Link
            href={meta.path}
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            All {meta.label.toLowerCase()}
          </Link>
        </div>
      </article>
    </>
  );
}

function ProfileLink({
  href,
  common,
  scientific,
}: {
  href: string;
  common: string;
  scientific: string;
}) {
  return (
    <Link
      href={href}
      className="press group flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 p-5 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
    >
      <span>
        <span className="block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Full care profile
        </span>
        <span className="mt-1 block font-medium">{common}</span>
        <span className="block text-sm italic text-muted-foreground">
          {scientific}
        </span>
      </span>
      <ArrowRight
        className="size-5 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
