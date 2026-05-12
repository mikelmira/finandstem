import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ComparePicker, type CompareOption } from "@/components/compare/compare-picker";
import { CompareTable } from "@/components/compare/compare-table";
import { allNorm } from "@/lib/catalogue/normalize";
import type { CatalogueEntry } from "@/types/catalogue";

export const metadata: Metadata = {
  title: "Compare species",
  description:
    "Put up to four catalogue species side by side — temperature, pH, hardness, tank size, light, CO₂, and tank-mate safety. Spot the conflicts at a glance.",
};

const OPTIONS: CompareOption[] = allNorm
  .map((n) => ({
    value: `${n.category}:${n.slug}`,
    label: n.commonName,
    scientific: n.scientificName,
    category: n.category,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ComparePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.ids) ? sp.ids[0] : sp.ids;
  const ids = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const entries: CatalogueEntry[] = ids
    .map((id) => {
      const [category, slug] = id.split(":");
      const hit = allNorm.find(
        (n) => n.category === category && n.slug === slug,
      );
      return hit?.raw;
    })
    .filter((e): e is CatalogueEntry => Boolean(e));

  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Put species side by side."
        subtitle="Pick up to four species from any category. We line up their parameters in one table so you can spot the conflicts at a glance — green dot beside a row means every selected species overlaps there, red means at least one is incompatible."
      />

      <SectionShell>
        <Suspense fallback={null}>
          <div className="glass glass-edge mb-10 rounded-2xl p-5 sm:p-6">
            <ComparePicker
              options={OPTIONS}
              selected={ids.filter((id) => OPTIONS.find((o) => o.value === id))}
            />
          </div>
        </Suspense>

        {entries.length === 0 ? (
          <EmptyState />
        ) : entries.length === 1 ? (
          <OnlyOneState />
        ) : (
          <CompareTable entries={entries} />
        )}
      </SectionShell>
    </>
  );
}

function EmptyState() {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <p className="text-base font-medium">Pick a species to start.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Search above by common name or scientific name. Add up to four
        species across any category — fish, plants, shrimp, or mosses.
      </p>
    </div>
  );
}

function OnlyOneState() {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <p className="text-base font-medium">
        Comparison needs at least two species.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Add another species to start lining up parameters side by side.
      </p>
    </div>
  );
}
