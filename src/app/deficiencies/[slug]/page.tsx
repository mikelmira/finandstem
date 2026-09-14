import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Leaf } from "lucide-react";

import { site } from "@/lib/site";
import { findNorm } from "@/lib/catalogue/normalize";
import {
  DEFICIENCIES,
  getDeficiency,
  SYMPTOM_LOCATION_LABEL,
} from "@/data/deficiencies";
import { deficiencyPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";
import { ProductNote } from "@/components/recommend/product-note";
import { DEFICIENCY_PRODUCTS } from "@/lib/recommendations";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return DEFICIENCIES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const def = getDeficiency(slug);
  if (!def) return {};
  const title = `${def.name} in Aquarium Plants: How to Identify and Fix It`;
  const description = def.spot;
  const canonical = `${site.url}/deficiencies/${slug}`;
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
      def.name,
      def.element,
      ...def.aliases,
      `${def.element.toLowerCase()} deficiency planted tank`,
      "aquarium plant deficiency",
    ],
    other: { "article:author": `${site.url}/about` },
  };
}

export default async function DeficiencyPage({ params }: RouteParams) {
  const { slug } = await params;
  const def = getDeficiency(slug);
  if (!def) notFound();

  const plants = def.relatedPlants
    .map((p) => {
      const norm = findNorm("plants", p.slug);
      return norm
        ? { href: `/plants/${p.slug}`, name: norm.commonName, note: p.note }
        : null;
    })
    .filter((x): x is { href: string; name: string; note: string } => x !== null);

  const rec = DEFICIENCY_PRODUCTS[def.slug];
  const others = DEFICIENCIES.filter((d) => d.slug !== def.slug);

  return (
    <>
      <JsonLd
        data={deficiencyPageJsonLd({
          slug: def.slug,
          name: def.name,
          description: def.spot,
          faqs: def.faqs,
        })}
        id={`deficiency-jsonld-${def.slug}`}
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Plant deficiencies", href: "/deficiencies" },
            { name: def.name },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Plant deficiency guide
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            {def.name}
          </h1>
          {def.aliases.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Also called {def.aliases.join(", ")}
            </p>
          )}
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {def.spot}
          </p>
          <dl className="mt-6 flex flex-wrap gap-2">
            <MetaChip label="Nutrient" value={def.element} />
            <MetaChip label="Shows" value={SYMPTOM_LOCATION_LABEL[def.showsOn]} />
            {def.kind !== "other" && (
              <MetaChip
                label="Mobility"
                value={def.mobile ? "Mobile in the plant" : "Immobile in the plant"}
              />
            )}
          </dl>
        </header>

        <Tldr body={def.tldr} subject={def.name} />

        <Section title="What you see">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {def.appearance}
          </p>
        </Section>

        <Section title="What causes it">
          <ul className="flex flex-col gap-2">
            {def.causes.map((c) => (
              <li key={c} className="flex gap-2.5 leading-relaxed text-foreground/90">
                <span
                  className="mt-2 size-1.5 flex-none rounded-full bg-[var(--brand)]"
                  aria-hidden
                />
                {c}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="How to fix it">
          <ol className="flex flex-col gap-3">
            {def.fix.map((step, i) => (
              <li key={step} className="flex gap-3 leading-relaxed text-foreground/90">
                <span
                  className="mt-0.5 inline-flex size-6 flex-none items-center justify-center rounded-full bg-[var(--brand)]/12 text-xs font-semibold text-[var(--brand)]"
                  aria-hidden
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          {rec && <ProductNote productIds={rec.ids} heading={rec.heading} />}
        </Section>

        <Section title="Keep it from coming back">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {def.prevention}
          </p>
        </Section>

        <Section title="Easy to confuse with">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {def.confusedWith}
          </p>
        </Section>

        {plants.length > 0 && (
          <Section title="Plants that show it first">
            <p className="text-pretty leading-relaxed text-foreground/90">
              Compare against a species you keep. These plants flag{" "}
              {def.element.split(" ")[0].toLowerCase()} trouble early or clearly:
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {plants.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="press flex items-start gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                  >
                    <Leaf
                      className="mt-0.5 size-4 flex-none text-[var(--brand)]"
                      aria-hidden
                    />
                    <span className="text-sm leading-relaxed text-foreground/90">
                      <span className="font-medium text-foreground">{p.name}</span>
                      <span className="text-muted-foreground"> — {p.note}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <section className="mt-12">
          <Faq items={def.faqs} />
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Related
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {[
              { label: "Fertiliser dosing calculator", href: "/calculators/fertiliser-dosing" },
              { label: "Identify aquarium algae", href: "/algae" },
              { label: "Browse aquarium plants", href: "/plants" },
            ].map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="press inline-flex items-center gap-1.5 text-sm font-medium underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)]"
                >
                  {r.label}
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            Not what you&rsquo;re seeing?
          </h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {others.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/deficiencies/${d.slug}`}
                  className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                >
                  <span>{d.name}</span>
                  <ArrowRight
                    className="size-4 flex-none text-muted-foreground"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12">
          <Link
            href="/deficiencies"
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to deficiency ID
          </Link>
        </div>
      </article>
    </>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs backdrop-blur">
      <span className="font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="text-foreground/90">{value}</span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-display-tight mb-4 text-2xl sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}
