import type { Metadata } from "next";
import { TopicFigure } from "@/components/seo/topic-figure";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";

import { site } from "@/lib/site";
import { CATEGORY_META } from "@/types/catalogue";
import { findNorm } from "@/lib/catalogue/normalize";
import {
  DISEASES,
  getDisease,
  PATHOGEN_LABEL,
  AFFECTED_LABEL,
} from "@/data/diseases";
import { diseasePageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";
import { ProductNote } from "@/components/recommend/product-note";
import { DISEASE_PRODUCTS } from "@/lib/recommendations";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return DISEASES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const disease = getDisease(slug);
  if (!disease) return {};
  const title = `${disease.name}: Symptoms, Causes and Treatment`;
  const description = disease.spot;
  const canonical = `${site.url}/diseases/${slug}`;
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
      disease.name,
      ...disease.aliases,
      `${disease.name.toLowerCase()} treatment`,
      `how to treat ${disease.name.toLowerCase()}`,
      "aquarium fish disease",
    ],
    other: { "article:author": `${site.url}/about` },
  };
}

export default async function DiseasePage({ params }: RouteParams) {
  const { slug } = await params;
  const disease = getDisease(slug);
  if (!disease) notFound();

  const species = disease.atRisk
    .map((s) => {
      const norm = findNorm(s.category, s.slug);
      return norm
        ? {
            href: `${CATEGORY_META[s.category].path}/${s.slug}`,
            name: norm.commonName,
            note: s.note,
          }
        : null;
    })
    .filter((x): x is { href: string; name: string; note: string } => x !== null);

  const rec = DISEASE_PRODUCTS[disease.slug];
  const others = DISEASES.filter((d) => d.slug !== disease.slug);

  return (
    <>
      <JsonLd
        data={diseasePageJsonLd({
          slug: disease.slug,
          name: disease.name,
          description: disease.spot,
          faqs: disease.faqs,
        })}
        id={`disease-jsonld-${disease.slug}`}
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Fish & shrimp health", href: "/diseases" },
            { name: disease.name },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Fish &amp; shrimp health guide
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            {disease.name}
          </h1>
          {disease.aliases.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Also called {disease.aliases.join(", ")}
            </p>
          )}
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {disease.spot}
          </p>
          <dl className="mt-6 flex flex-wrap gap-2">
            <MetaChip
              label="Affects"
              value={disease.affects.map((a) => AFFECTED_LABEL[a]).join(" & ")}
            />
            <MetaChip label="Type" value={PATHOGEN_LABEL[disease.pathogen]} />
            <MetaChip
              label="Contagious"
              value={disease.contagious ? "Yes, spreads" : "No"}
            />
          </dl>
        </header>

        <TopicFigure group="diseases" slug={disease.slug} className="mb-10" />

        <Tldr body={disease.tldr} subject={disease.name} />

        <Section title="What you see">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {disease.symptoms}
          </p>
        </Section>

        <Section title="What causes it">
          <ul className="flex flex-col gap-2">
            {disease.causes.map((c) => (
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

        <Section title="How to treat it">
          <ol className="flex flex-col gap-3">
            {disease.treatment.map((step, i) => (
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

          <div className="mt-6 flex gap-3 rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4">
            <ShieldAlert
              className="mt-0.5 size-5 flex-none text-[var(--brand)]"
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                Treatment safety in a planted tank
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {disease.safetyNote}
              </p>
            </div>
          </div>

          {rec && <ProductNote productIds={rec.ids} heading={rec.heading} />}
        </Section>

        <Section title="Prevent it">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {disease.prevention}
          </p>
        </Section>

        <Section title="Easy to confuse with">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {disease.confusedWith}
          </p>
        </Section>

        {species.length > 0 && (
          <Section title="Species most at risk">
            <p className="text-pretty leading-relaxed text-foreground/90">
              Species that catch this most often, or that need a gentler
              treatment:
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {species.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="press flex items-start gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                  >
                    <ArrowRight
                      className="mt-0.5 size-4 flex-none text-[var(--brand)]"
                      aria-hidden
                    />
                    <span className="text-sm leading-relaxed text-foreground/90">
                      <span className="font-medium text-foreground">{s.name}</span>
                      <span className="text-muted-foreground">: {s.note}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <section className="mt-12">
          <Faq items={disease.faqs} />
        </section>

        <section className="mt-14">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            Not what you&rsquo;re seeing?
          </h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {others.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/diseases/${d.slug}`}
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
            href="/diseases"
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to fish &amp; shrimp health
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
