import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import {
  ComparePicker,
  type CompareOption,
} from "@/components/compare/compare-picker";
import { CompareModeToggle } from "@/components/compare/compare-mode-toggle";
import { CompareOverview } from "@/components/compare/compare-overview";
import { CompareTable } from "@/components/compare/compare-table";
import { SubstrateCompareTable } from "@/components/compare/substrate-compare-table";
import Link from "next/link";
import { allNorm } from "@/lib/catalogue/normalize";
import { substrates, findSubstrate } from "@/data";
import type { CatalogueEntry } from "@/types/catalogue";
import { comparisonPairs } from "@/lib/catalogue/comparisons";
import type { SubstrateEntry } from "@/types/substrate";
import type { CompareMode } from "@/lib/compare-storage";

export const metadata: Metadata = {
  title: "Compare species and substrates",
  description:
    "Put up to four catalogue species or substrates side by side. Livestock mode compares fish, plants, shrimp, mosses, and snails. Substrate mode compares aquasoils and inert substrates by pH effect, ammonia release, and lifespan.",
};

// Livestock options across fish/plants/shrimp/mosses/snails.
const LIVESTOCK_OPTIONS: CompareOption[] = allNorm
  .map((n) => ({
    value: `${n.category}:${n.slug}`,
    label: n.commonName,
    scientific: n.scientificName,
    category: n.category,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

// Substrate options.
const SUBSTRATE_OPTIONS: CompareOption[] = substrates
  .map((s) => ({
    value: `substrate:${s.slug}`,
    label: s.name,
    scientific: s.brand,
    category: "substrate" as const,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseMode(raw: string | string[] | undefined): CompareMode {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "substrate" ? "substrate" : "livestock";
}

export default async function ComparePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const mode = parseMode(sp.mode);

  const rawIds = Array.isArray(sp.ids) ? sp.ids[0] : sp.ids;
  const ids = (rawIds ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Hard filter, drop any id that doesn't belong to the active mode.
  // Defensive guarantee, even if a stale URL is shared between modes
  // the wrong-type ids are silently dropped.
  const validIds = ids.filter((id) => {
    if (mode === "substrate") return id.startsWith("substrate:");
    return !id.startsWith("substrate:");
  });

  // Resolve livestock entries.
  const livestockEntries: CatalogueEntry[] =
    mode === "livestock"
      ? validIds
          .map((id) => {
            const [category, slug] = id.split(":");
            const hit = allNorm.find(
              (n) => n.category === category && n.slug === slug,
            );
            return hit?.raw;
          })
          .filter((e): e is CatalogueEntry => Boolean(e))
      : [];

  // Resolve substrate entries.
  const substrateEntries: SubstrateEntry[] =
    mode === "substrate"
      ? validIds
          .map((id) => {
            const [, slug] = id.split(":");
            return findSubstrate(slug);
          })
          .filter((e): e is SubstrateEntry => Boolean(e))
      : [];

  const count =
    mode === "substrate" ? substrateEntries.length : livestockEntries.length;
  const activeOptions =
    mode === "substrate" ? SUBSTRATE_OPTIONS : LIVESTOCK_OPTIONS;

  return (
    <>
      <PageHero
        eyebrow="Compare"
        title={
          mode === "substrate"
            ? "Put substrates side by side."
            : "Put species side by side."
        }
        subtitle={
          mode === "substrate"
            ? "Pick up to four substrates. We line up grain size, pH effect, ammonia release, nutrient content, and shrimp safety in one row each."
            : "Pick up to four species from any category. We score the group out of 100, stack every species' temperature, pH, and hardness on the same axis to show the overlap, and surface the conflicts you'll need to plan around."
        }
        breadcrumb={[{ label: "Compare" }]}
      />

      <SectionShell>
        <Suspense fallback={null}>
          <div className="mb-8">
            <CompareModeToggle mode={mode} />
          </div>
          <div className="glass glass-edge mb-10 rounded-2xl p-5 sm:p-6">
            <ComparePicker
              mode={mode}
              options={activeOptions}
              selected={validIds.filter((id) =>
                activeOptions.find((o) => o.value === id),
              )}
            />
          </div>
        </Suspense>

        {count === 0 ? (
          <EmptyState mode={mode} />
        ) : count === 1 ? (
          <OnlyOneState mode={mode} />
        ) : mode === "substrate" ? (
          <div className="flex flex-col gap-12">
            <section className="flex flex-col gap-4">
              <header className="flex items-baseline justify-between gap-3">
                <h2 className="text-display-tight text-2xl sm:text-3xl">
                  Full specs
                </h2>
                <span className="text-xs text-muted-foreground">
                  Every parameter, side by side
                </span>
              </header>
              <SubstrateCompareTable entries={substrateEntries} />
            </section>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            <CompareOverview entries={livestockEntries} />
            <section className="flex flex-col gap-4">
              <header className="flex items-baseline justify-between gap-3">
                <h2 className="text-display-tight text-2xl sm:text-3xl">
                  Full attributes
                </h2>
                <span className="text-xs text-muted-foreground">
                  Every parameter, side by side
                </span>
              </header>
              <CompareTable entries={livestockEntries} />
            </section>
          </div>
        )}
      </SectionShell>

      <PopularComparisons />
    </>
  );
}

const POPULAR_CATS = [
  { key: "fish", label: "Fish" },
  { key: "plants", label: "Plants" },
  { key: "shrimp", label: "Shrimp" },
  { key: "mosses", label: "Mosses" },
] as const;

/** A browsable set of ready-made comparison pages, grouped by category. */
function PopularComparisons() {
  const pairs = comparisonPairs();
  return (
    <SectionShell>
      <div className="max-w-3xl">
        <h2 className="text-display-tight text-2xl sm:text-3xl">
          Popular comparisons
        </h2>
        <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
          Weighing two species against each other? These ready-made head-to-heads
          line up care, size, water and temperament for you. Every species page
          also links to its own comparisons.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-8">
        {POPULAR_CATS.map(({ key, label }) => {
          const group = pairs.filter((p) => p.a.category === key).slice(0, 8);
          if (group.length === 0) return null;
          return (
            <section key={key}>
              <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.map((p) => (
                  <li key={p.versus}>
                    <Link
                      href={`/compare/${p.versus}`}
                      className="press inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                    >
                      {p.a.commonName} vs {p.b.commonName}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </SectionShell>
  );
}

function EmptyState({ mode }: { mode: CompareMode }) {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <p className="text-base font-medium">
        {mode === "substrate"
          ? "Pick a substrate to start."
          : "Pick a species to start."}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "substrate"
          ? "Search above by brand or product name. Add up to four substrates across active aquasoils, inert nutrient substrates, inert sand and gravel, or additives."
          : "Search above by common name or scientific name. Add up to four species across any category, fish, plants, shrimp, mosses, or snails."}
      </p>
    </div>
  );
}

function OnlyOneState({ mode }: { mode: CompareMode }) {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <p className="text-base font-medium">
        {mode === "substrate"
          ? "Comparison needs at least two substrates."
          : "Comparison needs at least two species."}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "substrate"
          ? "Add another substrate to start lining up parameters side by side."
          : "Add another species to start lining up parameters side by side."}
      </p>
    </div>
  );
}
