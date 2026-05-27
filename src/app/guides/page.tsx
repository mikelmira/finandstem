import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { site } from "@/lib/site";
import { listGuides, countWords, getGuide } from "@/lib/guides";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { guidesIndexJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Long-form guides answering the questions aquascapers ask — compatibility, comparisons, tank-setup walkthroughs, biotope deep-dives.",
  alternates: { canonical: `${site.url}/guides` },
  openGraph: {
    type: "website",
    url: `${site.url}/guides`,
    siteName: site.name,
    title: "Guides — Fin & Stem",
    description:
      "Long-form guides answering the questions aquascapers ask — compatibility, comparisons, tank-setup walkthroughs, biotope deep-dives.",
  },
};

const KIND_LABELS: Record<string, string> = {
  compatibility: "Compatibility",
  comparison: "Comparison",
  list: "List article",
  setup: "Tank setup",
  biotope: "Biotope guide",
  faq: "FAQ deep-dive",
};

export default function GuidesIndexPage() {
  const guides = listGuides();

  return (
    <>
      <JsonLd data={guidesIndexJsonLd(guides)} id="guides-index-jsonld" />
      <PageHero
        eyebrow="Guides"
        title="Long-form answers to the questions aquascapers actually ask."
        subtitle="Every guide here is the same shape: lead with the direct answer, walk through the reasoning, link out to the catalogue species mentioned, and cite real sources. Written for aquascapers anywhere — not for SEO machines."
        breadcrumb={[{ label: "Guides" }]}
      />

      <SectionShell>
        {guides.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug}>
                <GuideCard slug={g.slug} />
              </li>
            ))}
          </ul>
        )}
      </SectionShell>
    </>
  );
}

interface GuideCardProps {
  slug: string;
}

function GuideCard({ slug }: GuideCardProps) {
  const entry = getGuide(slug);
  if (!entry) return null;
  const fm = entry.frontmatter;
  const readingTimeMin = Math.max(
    1,
    Math.round(countWords(entry.raw) / 220),
  );
  const updated = new Date(fm.updatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <Link
      href={`/guides/${fm.slug}`}
      className="glass glass-edge lift group flex h-full flex-col overflow-hidden rounded-2xl no-underline transition-colors hover:border-[var(--brand)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {fm.heroImage && (
        <div className="relative aspect-[5/3] w-full overflow-hidden bg-muted">
          <Image
            src={fm.heroImage}
            alt={fm.heroAlt ?? fm.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
            {KIND_LABELS[fm.kind] ?? "Guide"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {readingTimeMin} min read
          </span>
        </div>
        <h2 className="text-display-tight text-xl leading-snug sm:text-2xl">
          {fm.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {fm.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          <time dateTime={fm.updatedAt}>{updated}</time>
          <span className="inline-flex items-center gap-1 font-medium text-foreground transition-colors group-hover:text-[var(--brand)]">
            Read
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="glass glass-edge mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-3xl p-10 text-center sm:p-12">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
        <BookOpen className="size-6" aria-hidden />
      </span>
      <h2 className="text-display-tight text-2xl sm:text-3xl">
        First guides land soon.
      </h2>
      <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
        Guides are long-form articles answering the specific questions
        aquascapers ask before stocking — &ldquo;can these two species live
        together?&rdquo;, &ldquo;low-tech vs high-tech: which carpet plant
        is right?&rdquo;, &ldquo;how do I scape a 30 L blackwater nano?&rdquo;
        — each one cross-referencing the catalogue. The first batch is in
        the pipeline.
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
          href="/planted-tank-guide"
          className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
        >
          The planted-tank pillar
        </Link>
      </div>
    </div>
  );
}
