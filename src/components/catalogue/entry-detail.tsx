import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/sections/breadcrumb";
import { WaveMark } from "@/components/wave-mark";
import { CATEGORY_MARK } from "@/components/icons/species-icons";
import { PillButton } from "@/components/ui/pill-button";
import {
  CATEGORY_META,
  type CatalogueEntry,
  type CatalogueCategory,
  type PlantEntry,
} from "@/types/catalogue";
import { Difficulty } from "@/components/catalogue/difficulty";
import { CompareButton } from "@/components/catalogue/compare-button";
import { PlanButton } from "@/components/catalogue/plan-button";
import type { Stat } from "@/components/catalogue/stat-grid";
import { SectionShell } from "@/components/sections/section-shell";
import { EntryCard } from "@/components/catalogue/entry-card";
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
import { cn } from "@/lib/utils";
// SEO / AEO scaffolding — emits Article + BreadcrumbList + ImageObject +
// FAQPage JSON-LD plus rendered FAQ, sources, byline, and pillar link.
import { JsonLd } from "@/components/seo/json-ld";
import { Faq } from "@/components/seo/faq";
import { Sources } from "@/components/seo/sources";
import { AuthorByline } from "@/components/seo/author-byline";
import { Tldr } from "@/components/seo/tldr";
import { getEntryDates } from "@/data/timestamps";
import { speciesPageJsonLd, type SourceItem } from "@/lib/seo";
import { buildTldr, buildFaqs } from "@/lib/species-faq";
import type { ImageAttribution } from "@/types/catalogue";

interface LegacyDetail {
  heading: string;
  body: string;
}

interface EntryDetailProps {
  entry: CatalogueEntry;
  /** Kept for backward compatibility, no longer rendered. */
  stats?: ReadonlyArray<Stat>;
  /** Kept for backward compatibility, no longer rendered. */
  details?: ReadonlyArray<LegacyDetail>;
  /** Kept for backward compatibility, no longer rendered. */
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

  // SEO / AEO inputs — derived deterministically from the catalogue data
  // so every species page emits the same scaffolding without bespoke work.
  const tldr = buildTldr(entry);
  const faqs = buildFaqs(entry);
  const pillar = PILLAR_FOR_CATEGORY[entry.category];
  const { updatedAt } = getEntryDates(entry.slug);

  // Reading time — words / 220 wpm, clamped to ≥1 min. Counts the
  // headline prose blocks readers actually scan: TL;DR, care summary,
  // and each themed detail section body.
  const wordCount =
    tldr.split(/\s+/).length +
    entry.careSummary.split(/\s+/).length +
    sections.reduce((acc, s) => acc + (s.body?.split(/\s+/).length ?? 0), 0);
  const readingTimeMin = Math.max(1, Math.round(wordCount / 220));
  const sources: SourceItem[] = [
    { label: `Wikipedia: ${entry.scientificName}`, url: entry.imageSourceUrl },
    ...(image?.descriptionUrl
      ? [
          {
            label: "Lead image source (Wikimedia Commons)",
            url: image.descriptionUrl,
          },
        ]
      : []),
    ...uniqueGalleryDescriptionUrls(galleryRaw)
      .slice(0, 3)
      .map((url, i) => ({
        label: `Gallery image source #${i + 1}`,
        url,
      })),
  ];
  const seoImages: ImageAttribution[] = image ? [image] : [];

  // Sticky TOC items — generated from what's actually present so the
  // numbering matches what the reader sees. FAQ + Sources appended so
  // they're navigable from the right rail too.
  const tocItems: StickyTocItem[] = [
    { id: "tank-fit", label: "Tank fit" },
    { id: "tank-mates", label: "Tank mates" },
    ...(grouped.protips.length > 0
      ? [{ id: "pro-tips", label: "Pro tips" }]
      : []),
    ...(watchGroup ? [{ id: "watch", label: "Watch for" }] : []),
    ...(careGroup ? [{ id: "care", label: "Care guide" }] : []),
    ...(hasBackground ? [{ id: "background", label: "Background" }] : []),
    { id: "faq", label: "FAQ" },
    { id: "sources", label: "Sources" },
  ];

  return (
    <>
      <JsonLd
        data={speciesPageJsonLd({ entry, tldr, faqs, images: seoImages })}
        id={`species-jsonld-${entry.slug}`}
      />
      {/* ─── Hero, traditional 100vh splash ────────────────────── */}
      <section className="relative isolate flex h-[90vh] flex-col overflow-hidden md:h-screen md:min-h-[600px]">
        {/* Full-bleed species photo */}
        {image && (
          <div className="absolute inset-0 -z-30">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
        {/* Dual gradient, darker at top + bottom for legibility, lighter
            in the middle so the species photo stays the star */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-gradient-to-b from-black/55 via-black/20 to-black/75"
        />
        {/* Final fade into the page background */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-20 h-40 bg-gradient-to-b from-transparent to-background"
        />

        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-20">
          {/* Top, breadcrumb */}
          <Breadcrumb
            items={[
              { label: meta.label, href: meta.path },
              { label: entry.commonName },
            ]}
            tone="light"
            currentUrl={`${meta.path}/${entry.slug}`}
          />

          {/* Bottom, title block, pushed down by mt-auto */}
          <div className="animate-rise mt-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-white/85">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-[var(--brand)]"
                />
                {meta.singular}
              </span>
              {/* Plant pages get a second pill calling out the growth form
                  (stem, epiphyte, rosette, etc.), instantly tells the
                  reader what shape this plant takes in the tank without
                  scrolling to the spec table. */}
              {entry.category === "plants" && (
                <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  {distillPlantType((entry as PlantEntry).plantType)}
                </span>
              )}
            </div>
            <h1 className="text-display-tight mt-5 text-balance text-5xl leading-[1.2] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              {entry.commonName}
            </h1>
            <p className="mt-5 text-pretty text-xl italic text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] sm:text-2xl md:text-3xl">
              {entry.scientificName}
            </p>

            {/* Meta row, origin + difficulty + CTAs, sitting inside
                the hero. Origin pill uses a light backdrop-blur strip;
                Difficulty switches to its light tone; the Plan / Compare
                buttons keep their own cream-pill styling which already
                reads cleanly on the dark gradient. */}
            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-white backdrop-blur-sm">
                <MapPin className="size-3.5" aria-hidden />
                {entry.origin}
              </span>
              <Difficulty level={entry.difficulty} tone="light" />
              <PlanButton
                category={entry.category}
                slug={entry.slug}
                commonName={entry.commonName}
              />
              <CompareButton
                category={entry.category}
                slug={entry.slug}
                commonName={entry.commonName}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TL;DR, visible direct-answer paragraph ──────────────
          Lives in HTML, not just JSON-LD, so AI Overviews and answer
          engines can extract the 150-250-word factual lead. */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-3xl px-6 pt-12 pb-12 sm:px-8 sm:pt-16 sm:pb-16">
          <Tldr body={tldr} subject={entry.commonName} />
        </div>
      </section>

      {/* ─── Intro band, key facts, care, gallery ─────────────── */}
      <section className="border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-6 pt-12 pb-12 sm:px-8 sm:pt-16 sm:pb-16">
          {/* Key-fact pills, temp / pH / minimum-tank, plus cross-tank
              safety flags (plant-safe / shrimp-safe). */}
          <HeroKeyFacts entry={entry} />

          {/* Care summary, full-width when no gallery, paired with the
              gallery on the right when there are extra photos */}
          <div
            className={cn(
              "mt-10 grid grid-cols-1 gap-8",
              gallery.length > 0 &&
                "lg:grid-cols-[1.1fr_1fr] lg:gap-12",
            )}
          >
            <article className="glass glass-edge animate-rise rounded-3xl p-7 sm:p-8 md:p-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
                Care at a glance
              </p>
              <p className="drop-cap mt-4 text-base leading-[1.65] text-foreground/90 sm:text-[17px]">
                {entry.careSummary}
              </p>
              <div className="mt-6 border-t border-border/50 pt-5">
                <AuthorByline
                  updatedAt={updatedAt}
                  readingTimeMin={readingTimeMin}
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  Part of our{" "}
                  <Link
                    href={pillar.href}
                    className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)] hover:decoration-[var(--brand)]"
                  >
                    {pillar.label}
                  </Link>
                  .
                </p>
              </div>
            </article>

            {gallery.length > 0 && (
              <div className="glass glass-edge animate-rise rounded-3xl p-5 sm:p-6">
                <ImageGallery
                  images={gallery}
                  gridClassName="grid-cols-2"
                />
                {image && (
                  <p className="mt-4 text-[10px] leading-snug text-muted-foreground/85">
                    Hero photo by{" "}
                    <span className="font-medium text-foreground/85">
                      {image.author && image.author !== "Unknown"
                        ? image.author
                        : "unknown contributor"}
                    </span>
                    {image.license && (
                      <>
                        {" · "}
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
                    {entry.imageSourceUrl && (
                      <>
                        {" · "}
                        <a
                          href={entry.imageSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline font-medium text-[var(--brand)]"
                        >
                          Wikipedia
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Main column + sticky TOC on the right rail ──────────── */}
      <div className="mx-auto w-full max-w-7xl px-6 pt-12 pb-12 sm:px-8 sm:pt-16 sm:pb-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-14 xl:gap-20">
          <main className="flex min-w-0 flex-col gap-16 sm:gap-20">
            {/* 1. TANK FIT, parameter charts + categorical facts */}
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

            {/* 3. PRO TIPS, promoted up: editorial moat */}
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

            {/* 4. WATCH FOR, promoted: high-value pitfall content */}
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

            {/* 5. CARE GUIDE, what you actually do */}
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

            {/* 6. BACKGROUND, wild + behavior + variants, collapsible */}
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
                (defensive, should be empty given the mapping in detail-groups). */}
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

            {/* ─── FAQ, answer-engine direct-answer block ─────────── */}
            <DetailSection
              id="faq"
              eyebrow="Common questions"
              number={nextNumber(tocItems, "faq")}
              title="Frequently asked questions"
              subtitle="Direct answers to the questions search engines and AI assistants surface most often about this species."
              hideHeader
            >
              <Faq items={faqs} />
            </DetailSection>

            {/* ─── Sources & further reading ───────────────────────── */}
            <DetailSection
              id="sources"
              eyebrow="Provenance"
              number={nextNumber(tocItems, "sources")}
              title="Sources & further reading"
              subtitle="Primary references this profile draws on."
              hideHeader
            >
              <Sources items={sources} />
            </DetailSection>

            {/* Gallery now lives in the hero right column, see above */}
          </main>

          {/* Right rail, sticky TOC (desktop only) */}
          {tocItems.length > 1 && (
            <aside className="relative hidden lg:block">
              <StickyToc items={tocItems} />
            </aside>
          )}
        </div>
      </div>

      {/* ─── More in this category, featured + sidebar bento ───── */}
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

          {/* Asymmetric bento, one large featured card, two compact rows */}
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

      {/* ─── Companions, editorial cross-category strip ─────────── */}
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
 * Compact horizontal entry row, square specimen image left, name +
 * scientific name + difficulty right. Used by "More in this category"
 * to provide visual variety against the featured EntryCard.
 */
function CompactEntryRow({ entry }: { entry: CatalogueEntry }) {
  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);
  const CategoryMark = CATEGORY_MARK[entry.category];
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
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            <CategoryMark className="size-3.5 text-[var(--brand)]" />
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
 * Companion tile, vertical specimen plate used in the cross-category
 * "Build the rest of the tank" strip. Smaller and more uniform than
 * the main EntryCard so the three category callouts read as a set.
 */
function CompanionTile({ entry }: { entry: CatalogueEntry }) {
  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);
  const CategoryMark = CATEGORY_MARK[entry.category];
  return (
    <Link
      href={`${meta.path}/${entry.slug}`}
      className="glass glass-edge lift group relative flex h-full flex-col overflow-hidden rounded-2xl"
    >
      <div className="flex items-center justify-between gap-2 px-5 pt-5">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
          <CategoryMark className="size-3.5 text-[var(--brand)]" />
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
          {/* Stamp row, brand mark left, big numeral right. Mirrors the
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

/** Each catalogue category links up to one pillar hub. */
const PILLAR_FOR_CATEGORY: Record<
  CatalogueCategory,
  { href: string; label: string }
> = {
  fish: {
    href: "/aquarium-fish-guide",
    label: "complete guide to aquarium fish for the planted tank",
  },
  plants: {
    href: "/planted-tank-guide",
    label: "complete guide to the planted aquarium",
  },
  shrimp: {
    href: "/freshwater-shrimp-guide",
    label: "complete freshwater shrimp guide",
  },
  mosses: {
    href: "/aquatic-moss-guide",
    label: "complete guide to aquatic mosses",
  },
  // Snails don't yet have a dedicated pillar — point at the planted-tank
  // pillar as a sensible default (snails live as part of a planted setup).
  snails: {
    href: "/planted-tank-guide",
    label: "complete planted-aquarium guide",
  },
};

/**
 * Distill a plant's compound `plantType` string into a single,
 * aquascaper-friendly label for the hero pill. Examples:
 *   "Rhizome / Epiphyte"      → "Epiphyte"
 *   "Rosette / Runner"        → "Rosette"
 *   "Stem / Floating-tolerant" → "Stem"
 *   "Bulb / Rosette"          → "Bulb"
 *   "Carpet / Runner"         → "Carpet"
 *   "Floating"                → "Floating"
 *
 * Order matters, the most specific functional category wins (Floating
 * before Carpet, Carpet before Stem, etc.) because plants like
 * "Stem / Floating-tolerant" are still stems by behaviour. The check
 * for genuine floaters uses an anchored regex so it doesn't accidentally
 * match "floating-tolerant" inside a compound string.
 */
function distillPlantType(raw: string): string {
  const t = raw.toLowerCase();
  if (/^floating(\s|\/|$)/i.test(raw)) return "Floating";
  if (t.includes("bulb")) return "Bulb";
  if (t.includes("carpet")) return "Carpet";
  if (t.includes("epiphyte")) return "Epiphyte";
  if (t.includes("stem")) return "Stem";
  if (t.includes("rosette")) return "Rosette";
  if (t.includes("rhizome")) return "Rhizome";
  if (t.includes("moss")) return "Moss";
  return raw;
}

/** Dedupe gallery descriptionUrls for the Sources block. */
function uniqueGalleryDescriptionUrls(
  gallery: ReadonlyArray<{ descriptionUrl?: string }>,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const g of gallery) {
    const url = g.descriptionUrl;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push(url);
  }
  return out;
}


