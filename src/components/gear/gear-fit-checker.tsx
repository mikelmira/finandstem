"use client";

import * as React from "react";
import Link from "next/link";
import type { GearCategory, GearModel } from "@/types/gear";
import {
  CATEGORY_QUERY,
  gearHref,
  modelFit,
  typicalLengthForLitres,
  type Fit,
  type GearQuery,
} from "@/lib/gear/match";
import { cn } from "@/lib/utils";

const FIT_TEXT: Record<Fit, string> = {
  ideal: "Good fit",
  workable: "Could work",
  no: "Not a fit",
};

/**
 * "Will it fit my tank?" widget on a product page. The reader types their
 * tank volume (or length, for lights and stands) and every model gets a
 * verdict, with a link to other products that fit if none of these do.
 */
export function GearFitChecker({
  category,
  models,
}: {
  category: GearCategory;
  models: GearModel[];
}) {
  const inputs = CATEGORY_QUERY[category];
  const useLength = inputs.includes("length") && !inputs.includes("tank");
  const [value, setValue] = React.useState("");
  const n = Number(value);
  const valid = value !== "" && Number.isFinite(n) && n > 0;
  const q: GearQuery = valid ? (useLength ? { lengthCm: n } : { tankL: n }) : {};
  const rows = valid
    ? models.map((m) => ({ m, fit: modelFit(category, m, q) }))
    : [];
  const anyFit = rows.some((r) => r.fit === "ideal" || r.fit === "workable");
  const rated = rows.some((r) => r.fit !== null);

  return (
    <div className="glass glass-edge rounded-2xl p-5 sm:p-6">
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
        Will it suit my tank?
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="text-sm text-foreground/85" htmlFor="fit-input">
          {useLength ? "My tank is" : "My tank holds"}
        </label>
        <input
          id="fit-input"
          type="number"
          inputMode="numeric"
          min={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="60"
          className="w-24 rounded-lg border border-border bg-background/70 px-2 py-1.5 text-sm focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
        />
        <span className="text-sm text-muted-foreground">{useLength ? "cm long" : "litres"}</span>
      </div>
      {valid && (
        <div className="mt-4 flex flex-col gap-2">
          {rated ? (
            <ul className="flex flex-col gap-1.5">
              {rows.map(({ m, fit }) => (
                <li key={m.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-foreground">{m.name}</span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                      fit === "ideal" && "bg-emerald-600/15 text-emerald-800",
                      fit === "workable" && "bg-amber-500/15 text-amber-800",
                      fit === "no" && "bg-rose-500/12 text-rose-800",
                      fit === null && "bg-foreground/5 text-muted-foreground",
                    )}
                  >
                    {fit ? FIT_TEXT[fit] : "No rating"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              The maker doesn&rsquo;t give a rating we can check this against.
            </p>
          )}
          {!anyFit && (
            <Link
              href={gearHref(category, useLength ? { lengthCm: n } : { tankL: n })}
              className="mt-1 text-sm font-medium text-[var(--brand)] hover:underline"
            >
              See what does fit a {useLength ? `${n} cm` : `${n} L`} tank
            </Link>
          )}
          {anyFit && !useLength && category !== "aquariums" && (
            <Link
              href={gearHref(category, { tankL: n })}
              className="mt-1 text-sm font-medium text-[var(--brand)] hover:underline"
            >
              Compare with everything else that fits {n} L
            </Link>
          )}
          {useLength && anyFit && (
            <Link
              href={gearHref(category, { lengthCm: n })}
              className="mt-1 text-sm font-medium text-[var(--brand)] hover:underline"
            >
              Everything made for a {n} cm tank
            </Link>
          )}
          {!useLength && category === "aquariums" && (
            <p className="text-xs text-muted-foreground">
              A {n} L tank is typically about {typicalLengthForLitres(n)} cm long.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
