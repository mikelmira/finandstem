import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { site } from "@/lib/site";
import { CATEGORY_META } from "@/types/catalogue";
import { findNorm } from "@/lib/catalogue/normalize";
import { ALGAE, getAlgae } from "@/data/algae";
import { algaePageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { AuthorByline } from "@/components/seo/author-byline";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ALGAE.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const algae = getAlgae(slug);
  if (!algae) return {};
  const title = `${algae.name}: How to Identify and Get Rid of It`;
  const description = algae.spot;
  const canonical = `${site.url}/algae/${slug}`;
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
      algae.name,
      ...algae.aliases,
      `how to get rid of ${algae.name.toLowerCase()}`,
      `${algae.name.toLowerCase()} aquarium`,
      "aquarium algae",
    ],
    other: { "article:author": `${site.url}/about` },
  };
}

export default async function AlgaePage({ params }: RouteParams) {
  const { slug } = await params;
  const algae = getAlgae(slug);
  if (!algae) notFound();

  const eaters = algae.eatenBy
    .map((e) => {
      const norm = findNorm(e.category, e.slug);
      return norm
        ? { href: `${CATEGORY_META[e.category].path}/${e.slug}`, name: norm.commonName }
        : null;
    })
    .filter((x): x is { href: string; name: string } => x !== null);

  const others = ALGAE.filter((a) => a.slug !== algae.slug);

  return (
    <>
      <JsonLd
        data={algaePageJsonLd({
          slug: algae.slug,
          name: algae.name,
          description: algae.spot,
          faqs: algae.faqs,
        })}
        id={`algae-jsonld-${algae.slug}`}
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Algae ID", href: "/algae" },
            { name: algae.name },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Algae fix guide
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            {algae.name}
          </h1>
          {algae.aliases.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Also called {algae.aliases.join(", ")}
            </p>
          )}
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {algae.spot}
          </p>
          <div className="mt-6 border-t border-border/50 pt-5">
            <AuthorByline />
          </div>
        </header>

        <Tldr body={algae.tldr} subject={algae.name} />

        <Section title="How to spot it">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {algae.appearance}
          </p>
        </Section>

        <Section title="What causes it">
          <ul className="flex flex-col gap-2">
            {algae.causes.map((c) => (
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
            {algae.fix.map((step, i) => (
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
        </Section>

        <Section title="Keep it from coming back">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {algae.prevention}
          </p>
        </Section>

        <Section title="What eats it">
          {eaters.length > 0 ? (
            <>
              <p className="text-pretty leading-relaxed text-foreground/90">
                A clean-up crew won&rsquo;t fix the cause, but these species graze
                it and keep the last of it down:
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {eaters.map((e) => (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                    >
                      <Check className="size-3.5 text-[var(--brand)]" aria-hidden />
                      {e.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-pretty leading-relaxed text-foreground/90">
              {algae.eatenByNote}
            </p>
          )}
        </Section>

        <section className="mt-12">
          <Faq items={algae.faqs} />
        </section>

        <section className="mt-14">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            Not what you&rsquo;ve got?
          </h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {others.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/algae/${a.slug}`}
                  className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                >
                  <span>{a.name}</span>
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
            href="/algae"
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to algae ID
          </Link>
        </div>
      </article>
    </>
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
