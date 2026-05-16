import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ComparePicker, type CompareOption } from "@/components/compare/compare-picker";
import { CompareOverview } from "@/components/compare/compare-overview";
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
        subtitle="Pick up to four species from any category. We score the group out of 100, stack every species' temperature, pH, and hardness on the same axis to show the overlap, and surface the conflicts you'll need to plan around."
        breadcrumb={[{ label: "Compare" }]}
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
          <div className="flex flex-col gap-12">
            <CompareOverview entries={entries} />
            <section className="flex flex-col gap-4">
              <header className="flex items-baseline justify-between gap-3">
                <h2 className="text-display-tight text-2xl sm:text-3xl">
                  Full attributes
                </h2>
                <span className="text-xs text-muted-foreground">
                  Every parameter, side by side
                </span>
              </header>
              <CompareTable entries={entries} />
            </section>
          </div>
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
