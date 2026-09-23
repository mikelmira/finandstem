import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { SectionShell } from "@/components/sections/section-shell";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Faq } from "@/components/seo/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { GearGallery } from "@/components/gear/gear-gallery";
import { GearModelTable } from "@/components/gear/gear-model-table";
import { GearFitChecker } from "@/components/gear/gear-fit-checker";
import { GearCompareButton } from "@/components/gear/gear-compare-button";
import { GearCompareTray } from "@/components/gear/gear-compare-tray";
import { GearCard } from "@/components/gear/gear-card";
import { BrandLogo } from "@/components/gear/brand-logo";
import { brandLogo, LOGO_NOTICE } from "@/data/suppliers";
import { GEAR_CATEGORIES } from "@/lib/gear/categories";
import { CATEGORY_QUERY } from "@/lib/gear/match";
import { GEAR, GEAR_UPDATED, getGear, gearTitle, relatedGear, toCard } from "@/lib/gear";
import { gearFaqs } from "@/lib/gear/faq";
import { fitTitle, gearProductJsonLd } from "@/lib/gear/seo";
import { Sources } from "@/components/seo/sources";
import { AuthorByline } from "@/components/seo/author-byline";
import { formatRange } from "@/lib/gear/fields";
import { RatingIcons } from "@/components/gear/gear-rating";
import { METRIC, PRICE_LABEL, PRICE_WORDS, RATINGS_DISCLAIMER, TECH_HELP, techText } from "@/lib/gear/ratings";
import { getHardscape } from "@/data/hardscape";
import { site } from "@/lib/site";

interface RouteParams {
  params: Promise<{ category: string; id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return GEAR.map((p) => ({ category: p.category, id: p.id }));
}

/** Where each category's explainer lives. */
const EXPLAINER: Partial<Record<string, { label: string; href: string }>> = {
  filters: { label: "How aquarium filtration works", href: "/equipment/filtration" },
  lights: { label: "Planted tank lighting explained", href: "/equipment/lighting" },
  co2: { label: "CO2 injection, step by step", href: "/equipment/co2-injection" },
  heaters: { label: "Choosing and placing a heater", href: "/equipment/heaters" },
  pumps: { label: "Circulation and flow", href: "/equipment/circulation-and-flow" },
  plumbing: { label: "Circulation and flow", href: "/equipment/circulation-and-flow" },
  hardscape: { label: "Aquarium hardscape guide", href: "/aquarium-hardscape-guide" },
  aquariums: { label: "Stocking by tank size", href: "/tanks" },
};

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { category, id } = await params;
  const p = getGear(id);
  if (!p || p.category !== category) return {};
  const meta = GEAR_CATEGORIES[p.category];
  const name = gearTitle(p);
  const title = fitTitle([`${name} specs, sizes and alternatives`, `${name} specs and sizes`, `${name} specs`, name]);
  const description = metaDescription(p.summary);
  const canonical = `${site.url}/gear/${p.category}/${p.id}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: site.name,
      title: `${name}: ${meta.singular} specs and sizes`,
      description,
      images: p.images[0] ? [{ url: `${site.url}${p.images[0].src}`, width: p.images[0].width, height: p.images[0].height }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} specs and sizes`,
      description,
      images: p.images[0] ? [`${site.url}${p.images[0].src}`] : undefined,
    },
  };
}

/** Trim to a whole sentence or word under ~155 characters. */
function metaDescription(text: string): string {
  if (text.length <= 155) return text;
  const cut = text.slice(0, 155);
  const stop = cut.lastIndexOf(". ");
  if (stop > 90) return cut.slice(0, stop + 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export default async function GearProductPage({ params }: RouteParams) {
  const { category, id } = await params;
  const p = getGear(id);
  if (!p || p.category !== category) notFound();
  const meta = GEAR_CATEGORIES[p.category];
  const related = relatedGear(p, 4);
  const faqs = gearFaqs(p, related.slice(0, 3));
  const title = gearTitle(p);
  const hardscapeType = p.hardscapeType ? getHardscape(p.hardscapeType) : undefined;
  const explainer = EXPLAINER[p.category];
  const canCheckFit = CATEGORY_QUERY[p.category].length > 0;
  const keyFacts: { label: string; value: string }[] = [];
  for (const f of meta.cardFields) {
    if (f === "tankRange" || f === "fitsRange" || f === "dimensions") continue;
    const value = formatRange(p.models, f);
    if (value) keyFacts.push({ label: f, value });
  }
  const specEntries = Object.entries(p.specs);

  return (
    <>
      <JsonLd data={gearProductJsonLd(p, meta, faqs)} id={`gear-jsonld-${p.id}`} />

      <section className="relative isolate border-b border-border/60 pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Gear", href: "/gear" },
              { name: meta.label, href: `/gear/${meta.id}` },
              { name: title },
            ]}
            className="mb-6"
          />
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr]">
            <GearGallery images={p.images} alt={title} />
            <div className="flex flex-col gap-5">
              {brandLogo(p.brand) && (
                <Link
                  href={`/gear/${p.category}?brand=${encodeURIComponent(p.brand)}`}
                  className="w-fit rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/55"
                  title={`More ${p.brand} ${meta.label.toLowerCase()}`}
                >
                  <BrandLogo brand={p.brand} eager className="h-8 max-w-[10rem]" />
                </Link>
              )}
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
                {p.brand} · {meta.subtypes[p.subtype] ?? p.subtype}
              </p>
              <h1 className="text-display-tight text-balance text-4xl leading-[1.1] sm:text-5xl">
                {title}
              </h1>
              <p className="text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
                {p.summary}
              </p>
              <AuthorByline updatedAt={GEAR_UPDATED} />
              {p.ratings && (
                <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {PRICE_LABEL}
                      </dt>
                      <dd className="mt-1 flex items-center gap-2">
                        <RatingIcons value={p.ratings.price} kind="price" label={PRICE_LABEL} size="md" />
                        <span className="text-xs text-muted-foreground">{PRICE_WORDS[p.ratings.price]}</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {METRIC[p.category].label}
                      </dt>
                      <dd className="mt-1 flex items-center gap-2">
                        <RatingIcons value={p.ratings.metric} kind="metric" label={METRIC[p.category].label} size="md" />
                        <span className="text-xs text-muted-foreground">{p.ratings.metric}/5</span>
                      </dd>
                    </div>
                  </dl>
                  {p.tech && (
                    <p className="mt-3 text-sm">
                      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Suits </span>
                      <Link href="/guides/low-tech-vs-high-tech-planted-tank" className="font-medium underline decoration-[var(--brand)]/40 underline-offset-4 hover:text-[var(--brand)]" title={TECH_HELP}>
                        {techText(p.tech)} tanks
                      </Link>
                    </p>
                  )}
                  <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                    {METRIC[p.category].help}. {RATINGS_DISCLAIMER}{" "}
                    <Link href="/about#ratings" className="underline underline-offset-2 hover:text-foreground">
                      How we rate gear
                    </Link>
                    .
                  </p>
                </div>
              )}
              {keyFacts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {keyFacts.map((f) => (
                    <span
                      key={f.label}
                      className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium"
                    >
                      {f.value}
                    </span>
                  ))}
                  <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium">
                    {p.models.length} {p.models.length === 1 ? "model" : "models"}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <GearCompareButton
                  category={p.category}
                  item={{ id: p.id, name: title, thumb: p.images[0]?.thumb }}
                  size="md"
                />
                <Link
                  href={`/gear/${p.category}`}
                  className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium transition-colors hover:border-[var(--brand)]/40"
                >
                  All {meta.label.toLowerCase()}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                {p.affiliateUrl ? (
                  <a
                    href={p.affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="press inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
                  >
                    View at {p.sourceName ?? p.brand}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                ) : (
                  p.sourceUrl && (
                    <a
                      href={p.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="press inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-[var(--brand)]"
                    >
                      Product page
                      <ArrowUpRight className="size-4" aria-hidden />
                    </a>
                  )
                )}
              </div>
              {p.affiliateUrl && (
                <p className="text-xs text-muted-foreground">
                  This is an affiliate link: it costs you nothing extra, and we only list products we would use ourselves.
                </p>
              )}
              {canCheckFit && <GearFitChecker category={p.category} models={p.models} />}
            </div>
          </div>
        </div>
      </section>

      <SectionShell className="!pt-12" containerClassName="max-w-4xl">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="glass glass-edge rounded-2xl p-6">
            <h2 className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
              <Sparkles className="size-4" aria-hidden /> Best for
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/90">{p.bestFor}</p>
          </div>
          {p.watchOut && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
              <h2 className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-amber-800">
                <AlertTriangle className="size-4" aria-hidden /> Worth knowing
              </h2>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">{p.watchOut}</p>
            </div>
          )}
        </div>

        {p.highlights.length > 0 && (
          <div className="mt-10">
            <h2 className="text-display-tight text-2xl sm:text-3xl">What stands out</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-base leading-relaxed text-foreground/90">
                  <Check className="mt-1 size-4 flex-none text-[var(--brand)]" aria-hidden />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            {p.models.length > 1 ? "Models and specs" : "Specs"}
          </h2>
          <div className="mt-5">
            <GearModelTable models={p.models} fields={meta.tableFields} />
          </div>
          {specEntries.length > 0 && (
            <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 rounded-2xl border border-border/60 bg-background/60 p-6 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Brand</dt>
                <dd className="mt-0.5 text-sm font-medium sm:text-base">{p.brand}</dd>
              </div>
              {specEntries.map(([k, v]) => (
                <div key={k} className={v.length > 60 ? "sm:col-span-2" : ""}>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 text-sm font-medium leading-snug sm:text-base">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {p.specSource === "manufacturer"
              ? "Figures from the maker's published specifications."
              : p.specSource === "retailer"
                ? `Figures from ${p.sourceName ?? "a major retailer"}'s product listing.`
                : "Figures from the maker's widely published specifications."}{" "}
            Makers revise products, so check the current figures before buying. Photos supplied by the brand or its distributor.{" "}
            {brandLogo(p.brand) ? LOGO_NOTICE : null}
          </p>
        </div>

        {hardscapeType && (
          <div className="mt-12 rounded-2xl border border-border/60 bg-background/60 p-6">
            <h2 className="text-display-tight text-xl sm:text-2xl">
              What {hardscapeType.name.toLowerCase()} does to your water
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85 sm:text-base">{hardscapeType.water}</p>
            <Link
              href={`/hardscape/${hardscapeType.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline"
            >
              Full {hardscapeType.name} guide
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        )}
      </SectionShell>

      {related.length > 0 && (
        <SectionShell className="!pt-0">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-display-tight text-2xl sm:text-3xl">Compare with</h2>
            <Link href={`/gear/${p.category}`} className="text-sm font-medium text-[var(--brand)] hover:underline">
              Browse all {meta.label.toLowerCase()}
            </Link>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.id}>
                <GearCard card={toCard(r)} />
              </li>
            ))}
          </ul>
        </SectionShell>
      )}

      <SectionShell className="!pt-0" containerClassName="max-w-4xl">
        <Faq items={faqs} intro={`Quick answers about the ${title}, drawn from its specs.`} />
        {p.sourceUrl && (
          <div className="mt-10">
            <Sources
              items={[
                {
                  label: `${title} product listing${p.sourceName ? ` (${p.sourceName})` : ""}`,
                  url: p.sourceUrl,
                },
              ]}
            />
          </div>
        )}
        <div className="mt-10 grid gap-2 sm:grid-cols-2">
          {explainer && (
            <Link
              href={explainer.href}
              className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm transition-colors hover:border-[var(--brand)]/40"
            >
              {explainer.label}
              <ArrowRight className="size-4 flex-none text-muted-foreground" aria-hidden />
            </Link>
          )}
          <Link
            href={`/gear/${p.category}`}
            className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm transition-colors hover:border-[var(--brand)]/40"
          >
            How to choose {meta.label.toLowerCase()}
            <ArrowRight className="size-4 flex-none text-muted-foreground" aria-hidden />
          </Link>
          <Link
            href="/planner"
            className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm transition-colors hover:border-[var(--brand)]/40"
          >
            Plan the whole tank
            <ArrowRight className="size-4 flex-none text-muted-foreground" aria-hidden />
          </Link>
          <Link
            href="/gear"
            className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm transition-colors hover:border-[var(--brand)]/40"
          >
            Kit list for your tank size
            <ArrowRight className="size-4 flex-none text-muted-foreground" aria-hidden />
          </Link>
        </div>
      </SectionShell>

      <GearCompareTray />
    </>
  );
}
