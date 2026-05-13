import Link from "next/link";
import { ArrowLeft, ChevronDown, ExternalLink, MapPin } from "lucide-react";
import {
  CATEGORY_META,
  type CatalogueEntry,
  type CatalogueCategory,
  type FishEntry,
  type PlantEntry,
  type ShrimpEntry,
  type MossEntry,
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
import { type QuickFact } from "@/components/catalogue/quick-facts";
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
  const facts = deriveQuickFacts(entry);

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
              <h1 className="text-display-tight animate-rise mt-4 text-balance text-4xl sm:text-5xl md:text-6xl">
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
                <CompareButton
                  category={entry.category}
                  slug={entry.slug}
                  commonName={entry.commonName}
                />
              </div>

              {/* Key-fact pills — the 3 most decision-critical numbers */}
              <HeroKeyFacts entry={entry} />

              {/* Care summary, sits with the title block */}
              <div className="glass glass-edge animate-rise mt-7 rounded-2xl p-6 sm:p-7">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                  Care at a glance
                </p>
                <p className="mt-3 text-base leading-relaxed text-foreground/90">
                  {entry.careSummary}
                </p>
              </div>
            </div>

            {/* Right — feature image */}
            {image && (
              <div className="lg:pt-8">
                <EntryImage image={image} ratio="tall" priority />
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
              <TankFitPanel entry={entry} facts={facts} />
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

      {/* ─── More in this category (full-bleed footer block) ─────── */}
      {related.length > 0 && (
        <SectionShell className="border-t border-border/60 !pt-16 sm:!pt-20">
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
              className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/50"
            >
              See all {meta.label.toLowerCase()}
              <ArrowLeft className="size-4 -scale-x-100" aria-hidden />
            </Link>
          </div>
        </SectionShell>
      )}

      {/* ─── Companions — cross-category ─────────────────────────── */}
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
        <header className="mb-6 flex flex-col gap-2">
          <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span
              aria-hidden
              className="text-[var(--brand)] tabular-nums"
            >
              {String(number).padStart(2, "0")}
            </span>
            <span
              aria-hidden
              className="h-px w-6 bg-[var(--brand)]/30"
            />
            {eyebrow}
          </span>
          <h2 className="text-display-tight text-2xl sm:text-3xl">{title}</h2>
          {subtitle && (
            <p className="text-pretty text-sm text-muted-foreground sm:text-base">
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

function deriveQuickFacts(entry: CatalogueEntry): QuickFact[] {
  if (entry.category === "fish") return fishFacts(entry as FishEntry);
  if (entry.category === "plants") return plantFacts(entry as PlantEntry);
  if (entry.category === "shrimp") return shrimpFacts(entry as ShrimpEntry);
  return mossFacts(entry as MossEntry);
}

function fishFacts(f: FishEntry): QuickFact[] {
  return [
    { label: "Family", value: f.family },
    { label: "Water column", value: f.waterColumn },
    {
      label: "Schooling",
      value: f.schooling,
      helper: `Group of ${f.minGroupSize}+`,
    },
    { label: "Temperament", value: f.temperament },
    { label: "Diet", value: f.diet, helper: f.feedingNotes },
    { label: "Lifespan", value: `${f.lifespan} yrs` },
    { label: "Breeding", value: f.breedingDifficulty },
  ];
}

function plantFacts(p: PlantEntry): QuickFact[] {
  return [
    { label: "Family", value: p.family },
    { label: "Type", value: p.plantType },
    { label: "Position", value: p.position },
    { label: "Substrate", value: p.substrate },
    { label: "Propagation", value: p.propagation },
  ];
}

function shrimpFacts(s: ShrimpEntry): QuickFact[] {
  return [
    { label: "Colony min", value: `${s.colonyMin}+` },
    { label: "Diet", value: s.diet, helper: s.feedingNotes },
    { label: "Breeding", value: s.breeding },
    {
      label: "Algae grazing",
      value: `${s.algaeEaterRating}/5`,
    },
    { label: "Lifespan", value: `${s.lifespan} yrs` },
  ];
}

function mossFacts(m: MossEntry): QuickFact[] {
  return [
    { label: "Family", value: m.family },
    { label: "Type", value: m.type },
    { label: "Attachment", value: m.attachment },
    { label: "Typical use", value: m.typicalUse },
    { label: "Trimming", value: m.trimming },
  ];
}
