import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { WaveMark } from "@/components/wave-mark";
import { getSpeciesPlate } from "@/components/icons/species-icons";
import { PillButton } from "@/components/ui/pill-button";
import {
  CATEGORY_META,
  type CatalogueEntry,
  type CatalogueCategory,
} from "@/types/catalogue";
import { Difficulty } from "@/components/catalogue/difficulty";
import { CompareButton } from "@/components/catalogue/compare-button";
import type { Stat } from "@/components/catalogue/stat-grid";
import { Eyebrow, SectionShell } from "@/components/sections/section-shell";
import { EntryCard } from "@/components/catalogue/entry-card";
import { EntryImage } from "@/components/catalogue/entry-image";
import { ImageGallery } from "@/components/catalogue/image-gallery";
import { HeroKeyFacts } from "@/components/catalogue/hero-key-facts";
import { TankFitPanel } from "@/components/catalogue/tank-fit-panel";
import { StickyToc, type StickyTocItem } from "@/components/catalogue/sticky-toc";
import { TankMatesPanel } from "@/components/catalogue/tank-mates-panel";
import { GroupedSection } from "@/components/catalogue/grouped-section";
import { ProTipsCallout } from "@/components/catalogue/pro-tips-callout";
import { CareSteps } from "@/components/catalogue/sections/care-steps";
import { WildSplit } from "@/components/catalogue/sections/wild-split";
import { BehaviorTimeline } from "@/components/catalogue/sections/behavior-timeline";
import { VariantsBoard } from "@/components/catalogue/sections/variants-board";
import { WatchOutCards } from "@/components/catalogue/sections/watch-out-cards";
import { allEntries, getCategoryEntries, getImage } from "@/data";
import { getGallery } from "@/data/image-gallery";
import { getDetailSections } from "@/data/species-detail";
import { groupDetailSections } from "@/lib/catalogue/detail-groups";
import { prepareImage } from "@/lib/wikimedia";

interface LegacyDetail {
  heading: string;
  body: string;
}

interface EntryDetailProps {
  entry: CatalogueEntry;
  /** Kept for backward compatibility — no longer rendered. */
  stats?: ReadonlyArray<Stat>;
  /** Kept for backward compatibility — no longer rendered. */
  details?: ReadonlyArray<LegacyDetail>;
  /** Kept for backward compatibility — no longer rendered. */
  pairings?: ReadonlyArray<{ label: string; value: string }>;
}

export function EntryDetail({
  entry,
  stats: _stats,
  details: _details,
  pairings: _pairings,
}: EntryDetailProps) {
  void _stats;
  void _details;
  void _pairings;
  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);
  const galleryRaw = getGallery(entry.slug);
  const gallery = galleryRaw.map((g) =>
    prepareImage(g, entry.commonName, entry.scientificName),
  );
  const sections = getDetailSections(entry.category, entry.slug);
  const grouped = groupDetailSections(sections, entry.category);

  // Pluck the themed groups by key so we can render them in the new
  // priority order (tank mates → pro tips → watch → care → background).
  const careGroup = grouped.groups.find((g) => g.key === "care");
  const watchGroup = grouped.groups.find((g) => g.key === "watch");
  const wildGroup = grouped.groups.find((g) => g.key === "wild");
  const behaviorGroup = grouped.groups.find((g) => g.key === "behavior");
  const variantsGroup = grouped.groups.find((g) => g.key === "variants");
  const hasBackground = Boolean(wildGroup ?? behaviorGroup ?? variantsGroup);

  // Pick 3 related entries from the same category
  const peers = getCategoryEntries(entry.category).filter(
    (e) => e.slug !== entry.slug,
  );
  const related = peers.slice(0, 3);

  // One entry from each other category for "build the tank" cross-references
  const otherCategories: CatalogueCategory[] = (
    ["fish", "plants", "shrimp", "mosses"] as CatalogueCategory[]
  ).filter((c) => c !== entry.category);
  const companions = otherCategories
    .map((c) => allEntries.find((e) => e.category === c))
    .filter((e): e is CatalogueEntry => Boolean(e));

  // Sticky TOC items — generated from what's actually present so the
  // numbering matches what the reader sees.
  const tocItems: StickyTocItem[] = [
    { id: "tank-fit", label: "Tank fit" },
    { id: "tank-mates", label: "Tank mates" },
    ...(grouped.protips.length > 0
      ? [{ id: "pro-tips", label: "Pro tips" }]
      : []),
    ...(watchGroup ? [{ id: "watch", label: "Watch for" }] : []),
    ...(careGroup ? [{ id: "care", label: "Care guide" }] : []),
    ...(hasBackground ? [{ id: "background", label: "Background" }] : []),
    ...(gallery.length > 1 ? [{ id: "gallery", label: "Gallery" }] : []),
  ];

  return (
    <>
      {/* ─── Hero ────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-border/60">
        <div className="brand-aurora absolute inset-0 -z-20 opacity-80" aria-hidden />
        <div className="bg-grid absolute inset-0 -z-10 opacity-50" aria-hidden />

        <div className="mx-auto w-full max-w-6xl px-6 pt-12 pb-12 sm:px-8 sm:pt-16 sm:pb-16">
          <Link
            href={meta.path}
            className="press inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to {meta.label.toLowerCase()}
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            {/* Left — name + meta */}
            <div className="flex flex-col justify-end">
              <Eyebrow>{meta.singular}</Eyebrow>
              <h1 className="text-display-tight animate-rise mt-4 text-balance text-5xl sm:text-6xl md:text-7xl">
                {entry.commonName}
              </h1>
              <p className="mt-4 text-pretty text-xl italic text-muted-foreground sm:text-2xl">
                {entry.scientificName}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-3 py-1">
                  <MapPin className="size-3.5" aria-hidden />
                  {entry.origin}
                </span>
                <Difficulty level={entry.difficulty} />
                <CompareButton
                  category={entry.category}
                  slug={entry.slug}
                  commonName={entry.commonName}
                />
              </div>

              {/* Key-fact pills — the 3 most decision-critical numbers */}
              <HeroKeyFacts entry={entry} />

              {/* Care summary — opens with a drop cap, like a field-guide
                  monograph. */}
              <div className="glass glass-edge animate-rise mt-7 rounded-2xl p-7 sm:p-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
                  Care at a glance
                </p>
                <p className="drop-cap mt-4 text-base leading-[1.65] text-foreground/90 sm:text-[17px]">
                  {entry.careSummary}
                </p>
              </div>
            </div>

            {/* Right — feature image + scientific-plate margin annotation. */}
            {image && (
              <div className="relative lg:pt-8">
                <EntryImage image={image} ratio="tall" priority />
                <SciencePlateAnnotation entry={entry} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Main column + sticky TOC on the right rail ──────────── */}
      <div className="mx-auto w-full max-w-7xl px-6 pt-12 pb-12 sm:px-8 sm:pt-16 sm:pb-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-14 xl:gap-20">
          <main className="flex min-w-0 flex-col gap-16 sm:gap-20">
            {/* 1. TANK FIT — parameter charts + categorical facts */}
            <DetailSection
              id="tank-fit"
              eyebrow="Decision"
              number={1}
              title="Tank fit"
              subtitle={`The parameters that decide whether ${entry.commonName.toLowerCase()} fits in your tank.`}
            >
              <TankFitPanel entry={entry} />
            </DetailSection>

            {/* 2. WHO IT LIVES WITH */}
            <DetailSection
              id="tank-mates"
              eyebrow="Compatibility"
              number={2}
              title="Who it lives with"
              subtitle="Tank-mate safety and the species this one is documented to thrive (or fail) alongside."
            >
              <TankMatesPanel
                entry={entry}
                good={grouped.goodTankMates}
                bad={grouped.badTankMates}
                compatHref={`/compatibility?anchor=${entry.category}:${entry.slug}`}
              />
            </DetailSection>

            {/* 3. PRO TIPS — promoted up: editorial moat */}
            {grouped.protips.length > 0 && (
              <DetailSection
                id="pro-tips"
                eyebrow="Hard-won"
                number={3}
                title="Pro tips"
                subtitle="Lessons from the tank that won't show up in a parameter chart."
                hideHeader
              >
                <ProTipsCallout sections={grouped.protips} />
              </DetailSection>
            )}

            {/* 4. WATCH FOR — promoted: high-value pitfall content */}
            {watchGroup && (
              <DetailSection
                id="watch"
                eyebrow="Heads-up"
                number={nextNumber(tocItems, "watch")}
                title={watchGroup.label}
                subtitle={watchGroup.blurb}
              >
                <WatchOutCards sections={watchGroup.sections} />
              </DetailSection>
            )}

            {/* 5. CARE GUIDE — what you actually do */}
            {careGroup && (
              <DetailSection
                id="care"
                eyebrow="Day to day"
                number={nextNumber(tocItems, "care")}
                title={careGroup.label}
                subtitle={careGroup.blurb}
                hideHeader
              >
                <CareSteps sections={careGroup.sections} />
              </DetailSection>
            )}

            {/* 6. BACKGROUND — wild + behavior + variants, collapsible */}
            {hasBackground && (
              <DetailSection
                id="background"
                eyebrow="Origins"
                number={nextNumber(tocItems, "background")}
                title="Background"
                subtitle="Where it comes from, how it behaves, and the variants you'll see at retail."
              >
                <details
                  className="group/bg flex flex-col gap-12 sm:gap-16"
                  open
                >
                  <summary className="press inline-flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-[var(--brand)]/40 hover:text-foreground [&::-webkit-details-marker]:hidden">
                    <ChevronDown
                      className="size-3.5 transition-transform duration-200 group-open/bg:rotate-180"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="group-open/bg:hidden">Show background</span>
                    <span className="hidden group-open/bg:inline">Hide background</span>
                  </summary>

                  <div className="flex flex-col gap-12 sm:gap-16">
                    {wildGroup && (
                      <WildSplit entry={entry} sections={wildGroup.sections} />
                    )}
                    {behaviorGroup && (
                      <BehaviorTimeline sections={behaviorGroup.sections} />
                    )}
                    {variantsGroup && (
                      <VariantsBoard sections={variantsGroup.sections} />
                    )}
                  </div>
                </details>
              </DetailSection>
            )}

            {/* Render any leftover themed groups we didn't explicitly pluck
                (defensive — should be empty given the mapping in detail-groups). */}
            {grouped.groups
              .filter(
                (g) =>
                  !["care", "watch", "wild", "behavior", "variants"].includes(
                    g.key,
                  ),
              )
              .map((g) => (
                <DetailSection
                  key={g.key}
                  id={`group-${g.key}`}
                  eyebrow="More"
                  number={0}
                  title={g.label}
                  subtitle={g.blurb}
                  hideHeader
                >
                  <GroupedSection group={g} />
                </DetailSection>
              ))}

            {/* 7. GALLERY — with attribution moved inline */}
            {gallery.length > 1 && (
              <DetailSection
                id="gallery"
                eyebrow="Photos"
                number={nextNumber(tocItems, "gallery")}
                title="Gallery"
                subtitle={`${gallery.length} photos sourced from Wikimedia Commons, iNaturalist, and retailer catalogues — every image links back to its source.`}
              >
                <div className="flex flex-col gap-6">
                  <ImageGallery images={gallery} />
                  {image && (
                    <HeroImageAttribution
                      image={image}
                      wikipediaUrl={entry.imageSourceUrl}
                    />
                  )}
                </div>
              </DetailSection>
            )}
          </main>

          {/* Right rail — sticky TOC (desktop only) */}
          {tocItems.length > 1 && (
            <aside className="relative hidden lg:block">
              <StickyToc items={tocItems} />
            </aside>
          )}
        </div>
      </div>

      {/* ─── More in this category — featured + sidebar bento ───── */}
      {related.length > 0 && (
        <SectionShell className="border-t border-border/60 !pt-16 sm:!pt-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                More {meta.label.toLowerCase()}
              </span>
              <h2 className="text-display-tight mt-3 text-3xl sm:text-4xl">
                Adjacent specimens in the catalogue.
              </h2>
            </div>
            <PillButton href={meta.path} variant="ghost" size="sm">
              See all {meta.label.toLowerCase()}
            </PillButton>
          </div>

          {/* Asymmetric bento — one large featured card, two compact rows */}
          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
            {related[0] && (
              <div className="lg:col-span-7">
                <EntryCard entry={related[0]} />
              </div>
            )}
            {related.length > 1 && (
              <ul className="flex flex-col gap-4 lg:col-span-5">
                {related.slice(1, 3).map((e) => (
                  <li key={e.slug} className="h-full">
                    <CompactEntryRow entry={e} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SectionShell>
      )}

      {/* ─── Companions — editorial cross-category strip ─────────── */}
      {companions.length > 0 && (
        <SectionShell className="border-t border-border/60">
          <div className="max-w-2xl">
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Cross-references
            </span>
            <h2 className="text-display-tight mt-3 text-3xl sm:text-4xl">
              Build the rest of the tank.
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              A planted tank is a system. Pair this {meta.singular.toLowerCase()}{" "}
              with one entry from each other pillar to plan the whole scape.
            </p>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {companions.map((e) => (
              <li key={`${e.category}-${e.slug}`}>
                <CompanionTile entry={e} />
              </li>
            ))}
          </ul>
        </SectionShell>
      )}
    </>
  );
}

/**
 * Compact horizontal entry row — square specimen image left, name +
 * scientific name + difficulty right. Used by "More in this category"
 * to provide visual variety against the featured EntryCard.
 */
function CompactEntryRow({ entry }: { entry: CatalogueEntry }) {
  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);
  return (
    <Link
      href={`${meta.path}/${entry.slug}`}
      className="glass glass-edge lift group relative flex h-full items-stretch overflow-hidden rounded-2xl"
    >
      <div className="relative aspect-square w-32 shrink-0 overflow-hidden sm:w-40">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="160px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            {meta.singular}
          </span>
          <h3 className="text-display-tight mt-1.5 text-lg leading-tight sm:text-xl">
            {entry.commonName}
          </h3>
          <p className="mt-0.5 text-xs italic text-muted-foreground sm:text-sm">
            {entry.scientificName}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Difficulty level={entry.difficulty} />
          <ArrowUpRight
            className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}

/**
 * Companion tile — vertical specimen plate used in the cross-category
 * "Build the rest of the tank" strip. Smaller and more uniform than
 * the main EntryCard so the three category callouts read as a set.
 */
function CompanionTile({ entry }: { entry: CatalogueEntry }) {
  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);
  return (
    <Link
      href={`${meta.path}/${entry.slug}`}
      className="glass glass-edge lift group relative flex h-full flex-col overflow-hidden rounded-2xl"
    >
      <div className="flex items-center justify-between gap-2 px-5 pt-5">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
          <WaveMarkInline />
          {meta.singular}
        </span>
        <ArrowUpRight
          className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
          aria-hidden
        />
      </div>
      <div className="px-5 pt-3 pb-4">
        <h3 className="text-display-tight text-xl leading-tight sm:text-[1.4rem]">
          {entry.commonName}
        </h3>
        <p className="mt-0.5 text-sm italic text-muted-foreground">
          {entry.scientificName}
        </p>
      </div>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        )}
      </div>
    </Link>
  );
}

/**
 * Tiny inline brand mark — used by sub-components that don't want
 * to pull in the full <WaveMark /> ceremony.
 */
function WaveMarkInline() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="size-3.5 text-[var(--brand)]"
    >
      <path
        d="M3 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path d="M16 28V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M16 18c-3.4 0-5.4-2-5.4-5 2.6 0 5.4 1.8 5.4 5z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M16 15c3 0 5-1.8 5-4.5-2.4 0-5 1.6-5 4.5z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Consistent section wrapper for the main column. Renders a numbered
 * eyebrow + title + subtitle, with the section's id wired up so the
 * sticky TOC can scroll to it.
 */
function DetailSection({
  id,
  eyebrow,
  number,
  title,
  subtitle,
  hideHeader = false,
  children,
}: {
  id: string;
  eyebrow: string;
  number: number;
  title: string;
  subtitle?: string;
  hideHeader?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      {!hideHeader && (
        <header className="mb-8 flex flex-col gap-4 sm:mb-10">
          {/* Stamp row — brand mark left, big numeral right. Mirrors the
              postage-stamp card chrome from the reference set. */}
          <div className="stamp-row">
            <span className="stamp-mark" aria-hidden>
              <WaveMark className="size-full" />
            </span>
            <span
              className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground"
              aria-hidden
            >
              {eyebrow}
            </span>
            <span className="stamp-numeral" aria-hidden>
              {String(number).padStart(2, "0")}
            </span>
          </div>
          {/* Thin brand rule under the stamp row, like the printed edge
              on a field-guide section divider. */}
          <span
            aria-hidden
            className="h-px w-full bg-[var(--brand)]/25"
          />
          <h2 className="text-display-tight mt-1 text-3xl sm:text-4xl md:text-[2.75rem]">
            {title}
          </h2>
          {subtitle && (
            <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}

/** Looks up a section's 1-based position in the rendered TOC list. */
function nextNumber(items: ReadonlyArray<StickyTocItem>, id: string): number {
  const idx = items.findIndex((i) => i.id === id);
  return idx === -1 ? items.length + 1 : idx + 1;
}

function HeroImageAttribution({
  image,
  wikipediaUrl,
}: {
  image: NonNullable<ReturnType<typeof getImage>>;
  wikipediaUrl: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Hero image credit
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
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
                    className="link-underline font-medium text-[var(--brand)]"
                  >
                    {image.license}
                  </a>
                ) : (
                  <span className="font-medium">{image.license}</span>
                )}
              </>
            )}
            . Source:{" "}
            <a
              href={image.descriptionUrl ?? wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-medium text-[var(--brand)]"
            >
              file page
            </a>
            .
          </p>
        </div>
        <a
          href={wikipediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-medium transition-colors hover:border-[var(--brand)]/40"
        >
          Wikipedia article
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}

/**
 * Margin annotation that overlaps the bottom-left corner of the hero
 * photo. Renders the scientific-plate silhouette for the species'
 * resolved body type — slim tetra, stocky perciform, gourami, eel,
 * catfish, livebearer, or the plant equivalents. Mirrors the
 * field-guide margin sketch: a hand-drawn outline beside the live
 * photograph, captioned with the body type as the field-guide would.
 */
function SciencePlateAnnotation({ entry }: { entry: CatalogueEntry }) {
  const { Plate, label } = getSpeciesPlate(entry);
  return (
    <figure
      aria-label={`Scientific plate of ${entry.commonName}`}
      className="glass glass-edge pointer-events-none absolute -bottom-6 -left-6 hidden w-44 rotate-[-3deg] rounded-2xl p-3 sm:block lg:-bottom-10 lg:-left-10 lg:w-52 lg:p-4"
    >
      <figcaption className="mb-1 flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        <span>Plate</span>
        <span className="text-[var(--brand)]">01</span>
      </figcaption>
      <div className="flex h-24 items-center justify-center text-[var(--brand)] lg:h-28">
        <Plate className="h-full w-full" />
      </div>
      <p className="mt-1 text-center text-[10px] italic text-muted-foreground">
        {label}
      </p>
    </figure>
  );
}

