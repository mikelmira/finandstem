import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
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
import type { Stat } from "@/components/catalogue/stat-grid";
import { Eyebrow, SectionShell } from "@/components/sections/section-shell";
import { EntryCard } from "@/components/catalogue/entry-card";
import { EntryImage } from "@/components/catalogue/entry-image";
import { ImageGallery } from "@/components/catalogue/image-gallery";
import { AtAGlance } from "@/components/catalogue/at-a-glance";
import { QuickFacts, type QuickFact } from "@/components/catalogue/quick-facts";
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

  return (
    <>
      {/* Hero ─────────────────────────────────────────────────────── */}
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
              </div>

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

            {/* Right — feature image with attribution */}
            {image && (
              <div className="lg:pt-8">
                <EntryImage image={image} ratio="tall" priority />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 1. AT A GLANCE — visual parameter charts ────────────────── */}
      <SectionShell className="!pt-12 sm:!pt-16">
        <header className="mb-6 flex flex-col gap-1">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            At a glance
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            The parameters that decide whether {entry.commonName.toLowerCase()}{" "}
            fits in your tank.
          </p>
        </header>
        <AtAGlance entry={entry} />
      </SectionShell>

      {/* 2. QUICK FACTS — compact category-specific facts ────────── */}
      {facts.length > 0 && (
        <SectionShell className="!pt-0">
          <header className="mb-6 flex flex-col gap-1">
            <h2 className="text-display-tight text-2xl sm:text-3xl">
              Quick facts
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              The lookup table for everything that isn&rsquo;t a parameter.
            </p>
          </header>
          <QuickFacts facts={facts} />
        </SectionShell>
      )}

      {/* 3. WHO IT LIVES WITH ─────────────────────────────────────── */}
      <SectionShell className="!pt-0">
        <header className="mb-6 flex flex-col gap-1">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            Who it lives with
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Tank-mate safety and the species this one is documented to thrive
            (or fail) alongside.
          </p>
        </header>
        <TankMatesPanel
          entry={entry}
          good={grouped.goodTankMates}
          bad={grouped.badTankMates}
          compatHref={`/compatibility?anchor=${entry.category}:${entry.slug}`}
        />
      </SectionShell>

      {/* 4. THEMED SECTIONS — each rendered with its own distinct UI ─ */}
      {grouped.groups.map((g) => (
        <SectionShell key={g.key} className="!pt-0">
          {g.key === "care" ? (
            <CareSteps sections={g.sections} />
          ) : g.key === "wild" ? (
            <WildSplit entry={entry} sections={g.sections} />
          ) : g.key === "behavior" ? (
            <BehaviorTimeline sections={g.sections} />
          ) : g.key === "variants" ? (
            <VariantsBoard sections={g.sections} />
          ) : g.key === "watch" ? (
            <WatchOutCards sections={g.sections} />
          ) : (
            <GroupedSection group={g} />
          )}
        </SectionShell>
      ))}

      {/* 5. PRO TIPS callout ─────────────────────────────────────── */}
      {grouped.protips.length > 0 && (
        <SectionShell className="!pt-0">
          <ProTipsCallout sections={grouped.protips} />
        </SectionShell>
      )}

      {/* 6. GALLERY ──────────────────────────────────────────────── */}
      {gallery.length > 1 && (
        <SectionShell className="!pt-0">
          <header className="mb-6 flex flex-col gap-1">
            <h2 className="text-display-tight text-2xl sm:text-3xl">Gallery</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              {gallery.length} photos sourced from Wikimedia Commons,
              iNaturalist, and retailer catalogues — every image links back to
              its source.
            </p>
          </header>
          <ImageGallery images={gallery} />
        </SectionShell>
      )}

      {/* 7. IMAGE ATTRIBUTION — small fine-print card ────────────── */}
      {image && (
        <SectionShell className="!pt-0">
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
                    href={image.descriptionUrl ?? entry.imageSourceUrl}
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
                href={entry.imageSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-medium transition-colors hover:border-[var(--brand)]/40"
              >
                Wikipedia article
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </SectionShell>
      )}

      {/* 8. MORE IN THIS CATEGORY ────────────────────────────────── */}
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
              className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/50"
            >
              See all {meta.label.toLowerCase()}
              <ArrowLeft className="size-4 -scale-x-100" aria-hidden />
            </Link>
          </div>
        </SectionShell>
      )}

      {/* 9. COMPANIONS — cross-category ─────────────────────────── */}
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
