import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import {
  CATEGORY_META,
  type CatalogueEntry,
  type CatalogueCategory,
} from "@/types/catalogue";
import { Difficulty } from "@/components/catalogue/difficulty";
import { StatGrid, type Stat } from "@/components/catalogue/stat-grid";
import { Eyebrow, SectionShell } from "@/components/sections/section-shell";
import { EntryCard } from "@/components/catalogue/entry-card";
import { EntryImage } from "@/components/catalogue/entry-image";
import { ImageGallery } from "@/components/catalogue/image-gallery";
import { ReferenceSections } from "@/components/catalogue/reference-sections";
import { AtAGlance } from "@/components/catalogue/at-a-glance";
import { allEntries, getCategoryEntries, getImage } from "@/data";
import { getGallery } from "@/data/image-gallery";
import { getDetailSections } from "@/data/species-detail";
import { prepareImage } from "@/lib/wikimedia";

interface DetailSection {
  heading: string;
  body: string;
}

interface EntryDetailProps {
  entry: CatalogueEntry;
  stats: ReadonlyArray<Stat>;
  details?: ReadonlyArray<DetailSection>;
  pairings?: ReadonlyArray<{ label: string; value: string }>;
}

export function EntryDetail({
  entry,
  stats,
  details = [],
  pairings = [],
}: EntryDetailProps) {
  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);
  const galleryRaw = getGallery(entry.slug);
  const gallery = galleryRaw.map((g) =>
    prepareImage(g, entry.commonName, entry.scientificName),
  );
  const referenceSections = getDetailSections(entry.category, entry.slug);

  // Pick 3 related entries from the same category
  const peers = getCategoryEntries(entry.category).filter(
    (e) => e.slug !== entry.slug,
  );
  const related = peers.slice(0, 3);

  // Two cross-category entries as companions
  const otherCategories: CatalogueCategory[] = (
    ["fish", "plants", "shrimp", "mosses"] as CatalogueCategory[]
  ).filter((c) => c !== entry.category);
  const companions = otherCategories
    .map((c) => allEntries.find((e) => e.category === c))
    .filter((e): e is CatalogueEntry => Boolean(e));

  return (
    <>
      {/* Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-border/60">
        <div className="brand-aurora absolute inset-0 -z-20 opacity-80" aria-hidden />
        <div className="bg-grid absolute inset-0 -z-10 opacity-50" aria-hidden />

        <div className="mx-auto w-full max-w-6xl px-6 pt-12 pb-12 sm:px-8 sm:pt-16 sm:pb-16">
          <Link
            href={meta.path}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to {meta.label.toLowerCase()}
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            {/* Left — name + meta */}
            <div className="flex flex-col justify-end">
              <Eyebrow>{meta.singular}</Eyebrow>
              <h1 className="text-display-tight mt-4 text-balance text-4xl sm:text-5xl md:text-6xl">
                {entry.commonName}
              </h1>
              <p className="mt-3 text-pretty text-lg italic text-muted-foreground sm:text-xl">
                {entry.scientificName}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1 backdrop-blur">
                  <MapPin className="size-3.5" aria-hidden />
                  {entry.origin}
                </span>
                <Difficulty level={entry.difficulty} />
              </div>

              {/* Care summary, sits with the title block */}
              <div className="glass glass-edge mt-7 rounded-2xl p-6 sm:p-7">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                  Care at a glance
                </p>
                <p className="mt-3 text-base leading-relaxed text-foreground/90">
                  {entry.careSummary}
                </p>
              </div>
            </div>

            {/* Right — feature image with attribution */}
            {image && (
              <div className="lg:pt-8">
                <EntryImage image={image} ratio="tall" priority />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* At a glance — visual parameter charts ──────────────────── */}
      <SectionShell className="!pt-12 sm:!pt-16">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            At a glance
          </h2>
          <span className="text-xs text-muted-foreground">
            Parameters visualised
          </span>
        </div>
        <AtAGlance entry={entry} />
      </SectionShell>

      {/* Stats grid — full numbers ──────────────────────────────── */}
      <SectionShell className="!pt-0">
        <h2 className="sr-only">All parameters</h2>
        <StatGrid stats={stats} />
      </SectionShell>

      {/* Detail sections ─────────────────────────────────────────── */}
      {details.length > 0 && (
        <SectionShell className="!pt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {details.map((d) => (
              <article
                key={d.heading}
                className="glass glass-edge rounded-2xl p-6 sm:p-7"
              >
                <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                  {d.heading}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  {d.body}
                </p>
              </article>
            ))}
          </div>
        </SectionShell>
      )}

      {/* Reference (deep detail) ─────────────────────────────────── */}
      {referenceSections.length > 0 && (
        <SectionShell className="!pt-0">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-display-tight text-2xl sm:text-3xl">
              Reference
            </h2>
            <span className="text-xs text-muted-foreground">
              From {entry.commonName.toLowerCase()} field notes
            </span>
          </div>
          <ReferenceSections sections={referenceSections} />
        </SectionShell>
      )}

      {/* Gallery ─────────────────────────────────────────────────── */}
      {gallery.length > 1 && (
        <SectionShell className="!pt-0">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="text-display-tight text-2xl sm:text-3xl">Gallery</h2>
            <span className="text-xs text-muted-foreground">
              {gallery.length} photos
            </span>
          </div>
          <ImageGallery images={gallery} />
          <p className="mt-4 text-xs text-muted-foreground">
            Images sourced from Wikimedia Commons and iNaturalist under
            commercial-use Creative Commons licenses (CC BY, CC BY-SA, CC0).
            Click any photo to view its source page, author, and full
            licensing terms.
          </p>
        </SectionShell>
      )}

      {/* Pairings ────────────────────────────────────────────────── */}
      {pairings.length > 0 && (
        <SectionShell className="!pt-0">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            Pairing notes
          </h2>
          <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 md:grid-cols-2">
            {pairings.map((p) => (
              <div
                key={p.label}
                className="glass flex flex-col gap-1 bg-background p-5 sm:p-6"
              >
                <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {p.label}
                </dt>
                <dd className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                  {p.value}
                </dd>
              </div>
            ))}
          </dl>
        </SectionShell>
      )}

      {/* Image attribution detail ─────────────────────────────────── */}
      {image && (
        <SectionShell className="!pt-0">
          <div className="glass rounded-2xl p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Image credit
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  Photo by{" "}
                  <span className="font-medium">
                    {image.author && image.author !== "Unknown"
                      ? image.author
                      : "Unknown contributor"}
                  </span>
                  {image.license && (
                    <>
                      , licensed under{" "}
                      {image.licenseUrl ? (
                        <a
                          href={image.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
                        >
                          {image.license}
                        </a>
                      ) : (
                        <span className="font-medium">{image.license}</span>
                      )}
                    </>
                  )}
                  . Sourced from Wikimedia Commons; original{" "}
                  <a
                    href={image.descriptionUrl ?? entry.imageSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
                  >
                    file page
                  </a>
                  .
                </p>
              </div>
              <a
                href={entry.imageSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-medium transition-colors hover:border-[var(--brand)]/40"
              >
                Wikipedia article
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </SectionShell>
      )}

      {/* Related in this category ────────────────────────────────── */}
      {related.length > 0 && (
        <SectionShell className="border-t border-border/60">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            More {meta.label.toLowerCase()}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((e) => (
              <EntryCard key={e.slug} entry={e} />
            ))}
          </div>
          <div className="mt-8">
            <Link
              href={meta.path}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/50"
            >
              See all {meta.label.toLowerCase()}
              <ArrowLeft className="size-4 -scale-x-100" aria-hidden />
            </Link>
          </div>
        </SectionShell>
      )}

      {/* Companions ─────────────────────────────────────────────── */}
      {companions.length > 0 && (
        <SectionShell className="border-t border-border/60">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            Build the rest of the tank
          </h2>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            A planted tank is a system. Pair this {meta.singular.toLowerCase()}{" "}
            with entries from the other pillars to plan the whole scape.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companions.map((e) => (
              <EntryCard key={`${e.category}-${e.slug}`} entry={e} />
            ))}
          </div>
        </SectionShell>
      )}
    </>
  );
}
