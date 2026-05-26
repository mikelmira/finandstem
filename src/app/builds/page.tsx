import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, NotebookPen } from "lucide-react";
import { site } from "@/lib/site";
import { builds } from "@/data/builds";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { buildsIndexJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Build journals",
  description:
    "First-hand tank-build journals from Fin & Stem — week-by-week timelines, parts lists, and photographs of real planted aquariums coming together.",
  alternates: {
    canonical: `${site.url}/builds`,
  },
  openGraph: {
    type: "website",
    url: `${site.url}/builds`,
    siteName: site.name,
    title: "Build journals",
    description:
      "First-hand tank-build journals — real planted tanks, week-by-week, parts lists, lessons learned.",
  },
};

export default function BuildsIndexPage() {
  return (
    <>
      <JsonLd data={buildsIndexJsonLd(builds)} id="builds-index-jsonld" />
      <PageHero
        eyebrow="Build journals"
        title="The tanks themselves."
        subtitle="Long-form first-hand build journals — every plant, fish, shrimp, hardscape choice and equipment decision documented week by week. The defensible content moat: photos of real tanks, not stock photography."
        breadcrumb={[{ label: "Build journals" }]}
      />

      <SectionShell>
        {builds.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {builds.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/builds/${b.slug}`}
                  className="glass glass-edge lift group flex h-full flex-col gap-3 rounded-2xl p-6 transition-colors hover:border-[var(--brand)]/40"
                >
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
                    {b.style ?? "Build journal"}
                  </span>
                  <h2 className="text-display-tight text-2xl">{b.title}</h2>
                  <p className="text-sm text-muted-foreground">{b.tagline}</p>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-foreground transition-colors group-hover:text-[var(--brand)]">
                    Read journal
                    <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SectionShell>
    </>
  );
}

function EmptyState() {
  return (
    <div className="glass glass-edge mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-3xl p-10 text-center sm:p-12">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
        <NotebookPen className="size-6" aria-hidden />
      </span>
      <h2 className="text-display-tight text-2xl sm:text-3xl">
        First build journal coming soon.
      </h2>
      <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
        Build journals are first-hand documentation of real planted tanks — every
        plant, fish, shrimp, stone, light, and substrate choice in one place,
        with photos week by week. The first journal is being written and
        photographed now; this page is the URL it&rsquo;ll live at when it ships.
      </p>
      <p className="text-xs text-muted-foreground">
        Until then, the catalogue&rsquo;s 122 cross-referenced species profiles
        are the deepest part of the site.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          href="/fish"
          className="press inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--brand)]/20 transition-all hover:-translate-y-0.5"
        >
          Browse the catalogue
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link
          href="/planner"
          className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
        >
          Plan a tank
        </Link>
      </div>
    </div>
  );
}
