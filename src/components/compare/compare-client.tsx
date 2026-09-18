"use client";

import { useSearchParams } from "next/navigation";
import {
  ComparePicker,
  type CompareOption,
} from "@/components/compare/compare-picker";
import { CompareModeToggle } from "@/components/compare/compare-mode-toggle";
import { CompareOverview } from "@/components/compare/compare-overview";
import { CompareTable } from "@/components/compare/compare-table";
import { SubstrateCompareTable } from "@/components/compare/substrate-compare-table";
import { allNorm } from "@/lib/catalogue/normalize";
import { substrates, findSubstrate } from "@/data";
import type { CatalogueEntry } from "@/types/catalogue";
import type { SubstrateEntry } from "@/types/substrate";
import type { CompareMode } from "@/lib/compare-storage";

const LIVESTOCK_OPTIONS: CompareOption[] = allNorm
  .map((n) => ({
    value: `${n.category}:${n.slug}`,
    label: n.commonName,
    scientific: n.scientificName,
    category: n.category,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const SUBSTRATE_OPTIONS: CompareOption[] = substrates
  .map((s) => ({
    value: `substrate:${s.slug}`,
    label: s.name,
    scientific: s.brand,
    category: "substrate" as const,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

/**
 * Client-side compare tool. The page is fully static; this reads the mode and
 * selected ids from the URL and resolves the comparison in the browser.
 */
export function CompareClient() {
  const searchParams = useSearchParams();
  const mode: CompareMode =
    searchParams?.get("mode") === "substrate" ? "substrate" : "livestock";

  const ids = (searchParams?.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const validIds = ids.filter((id) =>
    mode === "substrate" ? id.startsWith("substrate:") : !id.startsWith("substrate:"),
  );

  const livestockEntries: CatalogueEntry[] =
    mode === "livestock"
      ? validIds
          .map((id) => {
            const [category, slug] = id.split(":");
            return allNorm.find((n) => n.category === category && n.slug === slug)?.raw;
          })
          .filter((e): e is CatalogueEntry => Boolean(e))
      : [];

  const substrateEntries: SubstrateEntry[] =
    mode === "substrate"
      ? validIds
          .map((id) => findSubstrate(id.split(":")[1]))
          .filter((e): e is SubstrateEntry => Boolean(e))
      : [];

  const count = mode === "substrate" ? substrateEntries.length : livestockEntries.length;
  const activeOptions = mode === "substrate" ? SUBSTRATE_OPTIONS : LIVESTOCK_OPTIONS;

  return (
    <>
      <div className="mb-8">
        <CompareModeToggle mode={mode} />
      </div>
      <div className="glass glass-edge mb-10 rounded-2xl p-5 sm:p-6">
        <ComparePicker
          mode={mode}
          options={activeOptions}
          selected={validIds.filter((id) => activeOptions.find((o) => o.value === id))}
        />
      </div>

      {count === 0 ? (
        <EmptyState mode={mode} />
      ) : count === 1 ? (
        <OnlyOneState mode={mode} />
      ) : mode === "substrate" ? (
        <div className="flex flex-col gap-12">
          <section className="flex flex-col gap-4">
            <header className="flex items-baseline justify-between gap-3">
              <h2 className="text-display-tight text-2xl sm:text-3xl">Full specs</h2>
              <span className="text-xs text-muted-foreground">Every parameter, side by side</span>
            </header>
            <SubstrateCompareTable entries={substrateEntries} />
          </section>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <CompareOverview entries={livestockEntries} />
          <section className="flex flex-col gap-4">
            <header className="flex items-baseline justify-between gap-3">
              <h2 className="text-display-tight text-2xl sm:text-3xl">Full attributes</h2>
              <span className="text-xs text-muted-foreground">Every parameter, side by side</span>
            </header>
            <CompareTable entries={livestockEntries} />
          </section>
        </div>
      )}
    </>
  );
}

function EmptyState({ mode }: { mode: CompareMode }) {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <p className="text-base font-medium">
        {mode === "substrate" ? "Pick a substrate to start." : "Pick a species to start."}
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
