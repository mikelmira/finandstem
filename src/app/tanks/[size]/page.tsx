import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { CATEGORY_META } from "@/types/catalogue";
import type { NormalizedEntry } from "@/lib/catalogue/normalize";
import {
  generatedTanks,
  parseTankSizeSlug,
  tankSizeSlug,
  tankPicks,
  tankTitle,
  tankDescription,
  tankTldr,
  tankFaqs,
} from "@/lib/catalogue/tank-picks";
import { tankGuidePageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { AuthorByline } from "@/components/seo/author-byline";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";

interface RouteParams {
  params: Promise<{ size: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return generatedTanks().map((t) => ({ size: tankSizeSlug(t.litres) }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { size } = await params;
  const std = parseTankSizeSlug(size);
  if (!std) return {};
  const title = tankTitle(std);
  const description = tankDescription(std);
  const canonical = `${site.url}/tanks/${size}`;
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
      `best fish for a ${std.litres} litre tank`,
      `${std.litres} litre tank stocking`,
      `${std.litres} litre aquarium fish`,
      `best plants for a ${std.litres} litre tank`,
      `stocking a ${std.litres} litre tank`,
    ],
    other: { "article:author": `${site.url}/about` },
  };
}

export default async function TankSizePage({ params }: RouteParams) {
  const { size } = await params;
  const std = parseTankSizeSlug(size);
  if (!std) notFound();

  const picks = tankPicks(std);
  const title = tankTitle(std);
  const description = tankDescription(std);
  const tldr = tankTldr(std, picks);
  const faqs = tankFaqs(std, picks);

  const others = generatedTanks().filter((t) => t.litres !== std.litres);

  return (
    <>
      <JsonLd
        data={tankGuidePageJsonLd({
          litres: std.litres,
          slug: size,
          title,
          description,
          faqs,
        })}
        id={`tank-jsonld-${size}`}
      />

      <article className="mx-auto w-full max-w-4xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Tank sizes", href: "/tanks" },
            { name: `${std.litres} litre tank` },
          ]}
          className="mb-8"
        />

        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            {std.label}
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            Best fish, plants &amp; shrimp for a {std.litres} litre tank
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
          <div className="mt-6 border-t border-border/50 pt-5">
            <AuthorByline />
          </div>
        </header>

        <Tldr body={tldr} subject={`stocking a ${std.litres} litre tank`} />

        <div className="mt-12 flex flex-col gap-12">
          <PickSection
            title="Best fish"
            note={`${picks.fishTotal} fit this size`}
            entries={picks.fish}
            hint={(e) =>
              "minTankL" in e && e.minTankL ? `from ${e.minTankL} L` : undefined
            }
          />
          <PickSection
            title="Shrimp"
            entries={picks.shrimp}
            hint={(e) =>
              "algaeEaterRating" in e && e.algaeEaterRating
                ? `algae ${e.algaeEaterRating}/5`
                : undefined
            }
          />
          <PickSection
            title="Plants"
            entries={picks.plants}
            hint={(e) =>
              "maxHeightCm" in e && e.maxHeightCm
                ? `to ${e.maxHeightCm} cm`
                : undefined
            }
          />
        </div>

        <section className="mt-12 flex flex-wrap gap-3">
          <Link
            href={`/planner?tank=${std.litres}`}
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--brand)]/10 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            Plan a {std.litres} L tank
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/compatibility"
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            Check compatibility
          </Link>
        </section>

        <section className="mt-12">
          <Faq items={faqs} />
        </section>

        <section className="mt-14">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            Other tank sizes
          </h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {others.map((t) => (
              <li key={t.litres}>
                <Link
                  href={`/tanks/${tankSizeSlug(t.litres)}`}
                  className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                >
                  <span>Best for a {t.litres} litre tank</span>
                  <ArrowRight
                    className="size-4 flex-none text-muted-foreground"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  );
}

function PickSection({
  title,
  note,
  entries,
  hint,
}: {
  title: string;
  note?: string;
  entries: ReadonlyArray<NormalizedEntry>;
  hint: (e: NormalizedEntry) => string | undefined;
}) {
  if (entries.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="text-display-tight text-2xl sm:text-3xl">{title}</h2>
        {note && <span className="text-xs text-muted-foreground">{note}</span>}
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {entries.map((e) => {
          const meta = CATEGORY_META[e.category];
          const tag = hint(e);
          return (
            <li key={`${e.category}-${e.slug}`}>
              <Link
                href={`${meta.path}/${e.slug}`}
                className="press group flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 p-4 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
              >
                <span>
                  <span className="block font-medium leading-tight">
                    {e.commonName}
                  </span>
                  <span className="block text-sm italic text-muted-foreground">
                    {e.scientificName}
                  </span>
                </span>
                <span className="flex flex-none items-center gap-2">
                  {tag && (
                    <span className="rounded-full bg-[var(--brand)]/12 px-2 py-0.5 text-[11px] font-medium text-[var(--brand)]">
                      {tag}
                    </span>
                  )}
                  <ArrowRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
