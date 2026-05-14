import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { BuilderPicker, type BuilderOption } from "@/components/planner/builder-picker";
import { TankComposition } from "@/components/planner/tank-composition";
import { TankRequirementsPanel } from "@/components/planner/tank-requirements";
import { TankSetupCard } from "@/components/planner/tank-setup-card";
import { StockingGauge } from "@/components/planner/stocking-gauge";
import { TankWarnings } from "@/components/planner/tank-warnings";
import { allNorm } from "@/lib/catalogue/normalize";
import { buildTank } from "@/lib/catalogue/tank-builder";

export const metadata: Metadata = {
  title: "Tank Planner",
  description:
    "Build your tank species by species. Add fish, plants, shrimp, and mosses — we cross-reference parameters and flag every compatibility issue, plus surface the water, light, CO₂, and substrate the combined tank actually needs.",
};

const OPTIONS: BuilderOption[] = allNorm
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

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function numParam(v: string | string[] | undefined): number | undefined {
  const s = first(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isNaN(n) ? undefined : n;
}

export default async function PlannerPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const rawIds = first(sp.species) ?? "";
  const ids = rawIds
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const tankL = numParam(sp.tank);
  const filterLph = numParam(sp.filter);

  const result = buildTank({ ids, tankL, filterLph });
  const entries = result.selection.all.map((a) => a.entry);
  const hasSelection = entries.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Tank Planner"
        title="Build your tank, species by species."
        subtitle="Pick the tank, pick the filter, then add the fish, plants, shrimp, and mosses you're considering. We cross-reference every parameter, check stocking against best-practice rules, and tell you what light, CO₂, and substrate the combined tank actually needs."
      />

      <SectionShell>
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-10">
          {/* Left — tank setup + species picker + composition (sticky on desktop) */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">
            <Suspense fallback={null}>
              <TankSetupCard tankL={tankL} filterLph={filterLph} />
            </Suspense>

            <div className="glass glass-edge rounded-2xl p-5 sm:p-6">
              <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                Add to your tank
              </h2>
              <div className="mt-4">
                <Suspense fallback={null}>
                  <BuilderPicker options={OPTIONS} selected={ids} />
                </Suspense>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Your tank ({entries.length})
                </h2>
                {entries.length > 0 && (
                  <span className="text-[11px] text-muted-foreground/70">
                    Tap to open • × to remove
                  </span>
                )}
              </div>
              <Suspense fallback={null}>
                <TankComposition entries={entries} />
              </Suspense>
            </div>
          </div>

          {/* Right — stocking, requirements + warnings */}
          <div className="flex flex-col gap-8">
            {hasSelection ? (
              <>
                <StockingGauge stocking={result.stocking} tankL={tankL} />
                <TankRequirementsPanel
                  requirements={result.requirements}
                  tankL={tankL}
                />
                <TankWarnings
                  warnings={result.warnings}
                  hasSelection={hasSelection}
                />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </SectionShell>
    </>
  );
}

function EmptyState() {
  return (
    <div className="glass glass-edge animate-rise flex flex-col items-start gap-4 rounded-2xl p-8 sm:p-10">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
        Pick your inhabitants
      </span>
      <h2 className="text-display-tight text-2xl sm:text-3xl">
        Add a species to start the analysis
      </h2>
      <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
        Every time you add a fish, plant, shrimp, or moss, we recompute
        the parameters your tank needs to keep all of them happy.
        You&rsquo;ll see whether your chosen tank size + filter handle
        the combined bioload, the overlapping temperature / pH /
        hardness, the light and CO₂ scales, what substrate to use —
        plus every compatibility conflict before you spend the money.
      </p>
      <ul className="grid grid-cols-1 gap-2 text-sm text-foreground/85 sm:grid-cols-2">
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden />
          Standard tank sizes with matched filter ranges
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden />
          Live stocking gauge — comfortable, full, overstocked
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden />
          Light 1–5 + CO₂ 1–3 from the plants you add
        </li>
        <li className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden />
          Predator / prey + plant-safety flags
        </li>
      </ul>
    </div>
  );
}
