import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { HARDSCAPE, getHardscape } from "@/data/hardscape";
import { hardscapePageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { AuthorByline } from "@/components/seo/author-byline";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";
import { EffectBadges } from "@/components/hardscape/effect-badges";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return HARDSCAPE.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const item = getHardscape(slug);
  if (!item) return {};
  const title = `${item.name}: Uses, and Its Effect on pH & Hardness`;
  const description = item.spot;
  const canonical = `${site.url}/hardscape/${slug}`;
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
      item.name,
      ...item.aliases,
      `${item.name.toLowerCase()} aquarium`,
      `does ${item.name.toLowerCase()} raise ph`,
      "aquascaping hardscape",
    ],
    other: { "article:author": `${site.url}/about` },
  };
}

export default async function HardscapePage({ params }: RouteParams) {
  const { slug } = await params;
  const item = getHardscape(slug);
  if (!item) notFound();

  const others = HARDSCAPE.filter(
    (h) => h.slug !== item.slug && h.category === item.category,
  );

  return (
    <>
      <JsonLd
        data={hardscapePageJsonLd({
          slug: item.slug,
          name: item.name,
          description: item.spot,
          faqs: item.faqs,
        })}
        id={`hardscape-jsonld-${item.slug}`}
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Hardscape", href: "/hardscape" },
            { name: item.name },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            {item.category === "stone" ? "Stone" : "Wood"}
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            {item.name}
          </h1>
          {item.aliases.length > 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Also called {item.aliases.join(", ")}
            </p>
          )}
          <div className="mt-4">
            <EffectBadges item={item} />
          </div>
          <div className="mt-6 border-t border-border/50 pt-5">
            <AuthorByline />
          </div>
        </header>

        <Tldr body={item.tldr} subject={item.name} />

        <Section title="What it looks like">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {item.appearance}
          </p>
        </Section>

        <Section title="What it does to your water">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {item.water}
          </p>
        </Section>

        <Section title="How to prepare it">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {item.prep}
          </p>
        </Section>

        <Section title="Using it in a scape">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {item.scaping}
          </p>
        </Section>

        <section className="mt-12">
          <Faq items={item.faqs} />
        </section>

        {others.length > 0 && (
          <section className="mt-14">
            <h2 className="text-display-tight text-2xl sm:text-3xl">
              More {item.category}
            </h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {others.map((h) => (
                <li key={h.slug}>
                  <Link
                    href={`/hardscape/${h.slug}`}
                    className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                  >
                    <span>{h.name}</span>
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

        <div className="mt-12">
          <Link
            href="/hardscape"
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All hardscape
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
