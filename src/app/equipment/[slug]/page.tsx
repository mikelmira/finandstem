import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { EQUIPMENT, getEquipmentGuide } from "@/data/equipment";
import { equipmentPageJsonLd } from "@/lib/seo";
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
  return EQUIPMENT.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const guide = getEquipmentGuide(slug);
  if (!guide) return {};
  const title = `${guide.name}: How to Choose and Size It`;
  const description = guide.spot;
  const canonical = `${site.url}/equipment/${slug}`;
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
      guide.name.toLowerCase(),
      `aquarium ${guide.name.toLowerCase()}`,
      `how to choose ${guide.name.toLowerCase()}`,
      "planted tank equipment",
    ],
    other: { "article:author": `${site.url}/about` },
  };
}

export default async function EquipmentPage({ params }: RouteParams) {
  const { slug } = await params;
  const guide = getEquipmentGuide(slug);
  if (!guide) notFound();

  const others = EQUIPMENT.filter((e) => e.slug !== guide.slug);

  return (
    <>
      <JsonLd
        data={equipmentPageJsonLd({
          slug: guide.slug,
          name: guide.name,
          description: guide.spot,
          faqs: guide.faqs,
        })}
        id={`equipment-jsonld-${guide.slug}`}
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Equipment", href: "/equipment" },
            { name: guide.name },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Equipment guide
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            {guide.name}
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {guide.spot}
          </p>
          <div className="mt-6 border-t border-border/50 pt-5">
            <AuthorByline />
          </div>
        </header>

        <Tldr body={guide.tldr} subject={guide.name} />

        {guide.quickRef && (
          <div className="mt-10 glass glass-edge rounded-2xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              {guide.quickRef.title}
            </h2>
            {guide.quickRef.note && (
              <p className="mt-1 text-sm text-muted-foreground">
                {guide.quickRef.note}
              </p>
            )}
            <dl className="mt-4 divide-y divide-border/50">
              {guide.quickRef.rows.map((r) => (
                <div
                  key={r.label}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <dt className="text-sm font-medium text-foreground">
                    {r.label}
                  </dt>
                  <dd className="text-sm text-muted-foreground sm:text-right">
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {guide.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-display-tight mb-4 text-2xl sm:text-3xl">
              {s.heading}
            </h2>
            <p className="text-pretty leading-relaxed text-foreground/90">
              {s.body}
            </p>
          </section>
        ))}

        <section className="mt-12">
          <Faq items={guide.faqs} />
        </section>

        {guide.related && guide.related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Keep going
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {guide.related.map((r) => (
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
        )}

        <section className="mt-14">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            More equipment
          </h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {others.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/equipment/${e.slug}`}
                  className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                >
                  <span>{e.name}</span>
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
            href="/equipment"
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All equipment guides
          </Link>
        </div>
      </article>
    </>
  );
}
