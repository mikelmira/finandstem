import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";
import { AuthorByline } from "@/components/seo/author-byline";
import { pillarPageJsonLd } from "@/lib/seo";
import { clusterItemsFor, type Pillar } from "@/lib/pillars";

interface PillarPageProps {
  pillar: Pillar;
}

/**
 * Shared renderer for the six pillar hub pages.
 *
 * Layout: breadcrumb → eyebrow + title → TL;DR → intro paragraphs →
 * cluster list (catalogue entries) → FAQ → footer CTA. All anchors are
 * keyword-rich, all images use Next.js <Image>, and the page emits a
 * full pillarPageJsonLd graph (Article + BreadcrumbList + ItemList + FAQPage).
 */
export function PillarPage({ pillar }: PillarPageProps) {
  const cluster = clusterItemsFor(pillar);

  return (
    <>
      <JsonLd
        data={pillarPageJsonLd({
          path: pillar.path,
          title: pillar.title,
          description: pillar.description,
          tldr: pillar.tldr,
          faqs: pillar.faqs,
          cluster,
        })}
        id={`pillar-jsonld-${pillar.slug}`}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border/60">
        <div className="brand-aurora absolute inset-0 -z-20 opacity-80" aria-hidden />
        <div className="bg-grid absolute inset-0 -z-10 opacity-50" aria-hidden />
        <div className="mx-auto w-full max-w-4xl px-6 pt-24 pb-12 sm:px-8 sm:pt-28 sm:pb-16">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: pillar.title },
            ]}
            className="mb-6"
          />
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            {pillar.heroEyebrow}
          </p>
          <h1 className="text-display-tight animate-rise mt-3 text-balance text-3xl sm:text-4xl md:text-5xl">
            {pillar.title}
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {pillar.description}
          </p>
          <div className="mt-6">
            <AuthorByline />
          </div>
        </div>
      </section>

      {/* TL;DR */}
      <SectionShell className="!pt-12 sm:!pt-16">
        <div className="mx-auto max-w-3xl">
          <Tldr body={pillar.tldr} subject={pillar.title} />
        </div>
      </SectionShell>

      {/* Intro body */}
      <SectionShell className="!pt-0">
        <div className="prose-pillar mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
          {pillar.intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </SectionShell>

      {/* Cluster list */}
      {cluster.length > 0 && (
        <SectionShell className="!pt-0">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-display-tight text-2xl sm:text-3xl">
              The full catalogue in this guide
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {cluster.length} profiles · each cross-referenced for compatibility with the
              rest of the catalogue.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {cluster.map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    className="press group flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm transition-colors hover:border-[var(--brand)]/50 hover:bg-background"
                  >
                    <span className="font-medium text-foreground">{item.name}</span>
                    <ArrowRight
                      className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </SectionShell>
      )}

      {/* FAQ */}
      <SectionShell className="!pt-0">
        <div className="mx-auto max-w-3xl">
          <Faq items={pillar.faqs} />
        </div>
      </SectionShell>

      {/* Footer CTA */}
      <SectionShell className="border-t border-border/60">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            Ready to plan your tank?
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Pick any species and Fin & Stem will cross-reference everything compatible
            across all four categories.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/compatibility"
              className="press inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--brand)]/20 transition-all hover:-translate-y-0.5"
            >
              Open the compatibility tool
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/planner"
              className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
            >
              Plan a tank
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </SectionShell>
    </>
  );
}
