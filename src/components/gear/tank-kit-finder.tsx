"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GearCategory } from "@/types/gear";
import {
  gearHref,
  recommendedFlow,
  recommendedHeaterW,
  typicalLengthForLitres,
  type GearQuery,
} from "@/lib/gear/match";
import { cn } from "@/lib/utils";

export interface KitSize {
  litres: number;
  label: string;
  counts: Partial<Record<GearCategory, number>>;
}

interface KitRow {
  category: GearCategory;
  title: string;
  detail: string;
  query: GearQuery;
}

function rowsFor(litres: number): KitRow[] {
  const len = typicalLengthForLitres(litres);
  const flow = recommendedFlow(litres);
  const heat = recommendedHeaterW(litres);
  return [
    {
      category: "aquariums",
      title: "Tanks this size",
      detail: `Around ${litres} L, typically ${len} cm long`,
      query: { tankL: litres },
    },
    {
      category: "filters",
      title: "Filters",
      detail: `Rated ${flow.min}–${flow.max} L/h (5 to 10× turnover)`,
      query: { tankL: litres },
    },
    {
      category: "lights",
      title: "Lights",
      detail: `Made for a ${len} cm tank`,
      query: { lengthCm: len },
    },
    {
      category: "heaters",
      title: "Heaters",
      detail: `About ${heat.min}–${heat.max} W`,
      query: { tankL: litres },
    },
    {
      category: "co2",
      title: "CO2 gear",
      detail: "Diffusers and kits rated for this volume",
      query: { tankL: litres },
    },
    {
      category: "stands",
      title: "Stands",
      detail: `A top at least ${len} cm long`,
      query: { lengthCm: len },
    },
    {
      category: "air-pumps",
      title: "Air pumps",
      detail: "For night-time aeration and power cuts",
      query: { tankL: litres },
    },
  ];
}

/** Pick a tank size, get a checklist of gear that fits it. */
export function TankKitFinder({ sizes }: { sizes: KitSize[] }) {
  const [litres, setLitres] = React.useState(60);
  const size = sizes.find((s) => s.litres === litres);
  const rows = rowsFor(litres).filter((r) => (size?.counts[r.category] ?? 1) > 0);

  return (
    <div className="glass glass-edge rounded-3xl p-6 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
        Kit finder
      </p>
      <h2 className="text-display-tight mt-2 text-2xl sm:text-3xl">
        What fits my tank?
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Pick your tank size and we&rsquo;ll line up the gear that suits it, using the same
        rules of thumb as the planner.
      </p>
      <div className="mt-5 flex flex-wrap gap-2" role="radiogroup" aria-label="Tank size">
        {sizes.map((s) => (
          <button
            key={s.litres}
            type="button"
            role="radio"
            aria-checked={s.litres === litres}
            onClick={() => setLitres(s.litres)}
            className={cn(
              "press rounded-full border px-3 py-1.5 text-sm transition-colors",
              s.litres === litres
                ? "border-[var(--brand)]/60 bg-[var(--brand)]/15 font-medium text-foreground"
                : "border-border bg-background/60 text-muted-foreground hover:border-[var(--brand)]/40 hover:text-foreground",
            )}
          >
            {s.litres} L
          </button>
        ))}
      </div>
      {size && <p className="mt-3 text-xs text-muted-foreground">{size.label}</p>}
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {rows.map((r) => {
          const n = size?.counts[r.category];
          return (
            <li key={r.category}>
              <Link
                href={gearHref(r.category, r.query)}
                className="press group flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 p-4 transition-colors hover:border-[var(--brand)]/40"
              >
                <span>
                  <span className="block font-medium text-foreground">
                    {r.title}
                    {typeof n === "number" && (
                      <span className="ml-2 rounded-full bg-[var(--brand)]/12 px-2 py-0.5 text-[11px] font-medium text-[var(--brand)]">
                        {n} fit
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{r.detail}</span>
                </span>
                <ArrowRight className="size-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href={`/planner?tank=${litres}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand)] hover:underline"
      >
        Plan livestock and plants for a {litres} L tank
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
