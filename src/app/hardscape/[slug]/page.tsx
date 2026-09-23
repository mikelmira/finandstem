import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { HARDSCAPE, getHardscape } from "@/data/hardscape";
import { DEFAULT_OG_IMAGE, hardscapePageJsonLd, longDescription } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";
import { EffectBadges } from "@/components/hardscape/effect-badges";
import { HardscapeVisual, SHOW_HARDSCAPE_PHOTOS } from "@/components/hardscape/hardscape-visual";
import { HARDSCAPE_IMAGES } from "@/data/hardscape-images";
import { GearCard } from "@/components/gear/gear-card";
import { hardscapeProductsFor, toCard } from "@/lib/gear";

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
  const description = longDescription(item.spot, item.tldr);
  const piece = hardscapeProductsFor(item.slug)[0]?.images[0];
  const ogImage = piece ? `${site.url}${piece.src}` : DEFAULT_OG_IMAGE;
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
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
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
  const pieces = hardscapeProductsFor(item.slug);

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
        </header>

        <figure className="mb-10">
          <HardscapeVisual item={item} size="hero" />
          {SHOW_HARDSCAPE_PHOTOS && HARDSCAPE_IMAGES[item.slug] && (
            <figcaption className="mt-2 text-xs text-muted-foreground">
              Photo: {HARDSCAPE_IMAGES[item.slug].author}
              {HARDSCAPE_IMAGES[item.slug].license && (
                <>
                  {" · "}
                  {HARDSCAPE_IMAGES[item.slug].licenseUrl ? (
                    <a
                      href={HARDSCAPE_IMAGES[item.slug].licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      {HARDSCAPE_IMAGES[item.slug].license}
                    </a>
                  ) : (
                    HARDSCAPE_IMAGES[item.slug].license
                  )}
                </>
              )}
              {HARDSCAPE_IMAGES[item.slug].descriptionUrl && (
                <>
                  {" · "}
                  <a
                    href={HARDSCAPE_IMAGES[item.slug].descriptionUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Wikimedia Commons
                  </a>
                </>
              )}
            </figcaption>
          )}
        </figure>

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

        {pieces.length > 0 && (
          <section className="mt-12">
            <h2 className="text-display-tight text-2xl sm:text-3xl">
              {item.name} you can actually buy
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Supplier photos of real pieces, with the sizes they come in, so you can
              see the colour and texture before you order.
            </p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {pieces.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <GearCard card={toCard(p)} showCompare={false} />
                </li>
              ))}
            </ul>
            <Link
              href="/gear/hardscape"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline"
            >
              Browse all hardscape
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </section>
        )}

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
