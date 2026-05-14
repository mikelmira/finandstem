"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STANDARD_TANKS,
  classifyFlow,
  findTankStandard,
  type TankStandard,
} from "@/lib/catalogue/tank-standards";

interface TankSetupCardProps {
  /** Current tank litres from the URL — undefined when unset. */
  tankL?: number;
  /** Current filter flow l/h from the URL — undefined when unset. */
  filterLph?: number;
}

/**
 * Two-input setup panel for the planner: the user picks a standard
 * tank size from a dropdown, then a filter flow rate constrained by
 * the recommended range for that tank.
 *
 * The filter input shows the recommended range as a hint and warns
 * when the chosen flow falls outside the safe window (the planner's
 * full warnings panel covers this in detail; this card just gives a
 * realtime cue).
 *
 * Both values write to URL params `tank` and `filter` so the server
 * component can read them on the next render.
 */
export function TankSetupCard({ tankL, filterLph }: TankSetupCardProps) {
  const router = useRouter();
  const search = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const standard = tankL ? findTankStandard(tankL) : null;

  function push(next: { tankL?: number | null; filterLph?: number | null }) {
    const sp = new URLSearchParams(search?.toString() ?? "");
    if (next.tankL !== undefined) {
      if (next.tankL === null) sp.delete("tank");
      else sp.set("tank", String(next.tankL));
    }
    if (next.filterLph !== undefined) {
      if (next.filterLph === null) sp.delete("filter");
      else sp.set("filter", String(next.filterLph));
    }
    const qs = sp.toString();
    router.replace(qs ? `/planner?${qs}` : "/planner", { scroll: false });
  }

  function selectTank(t: TankStandard) {
    // When the user picks a new tank size, snap the filter flow into
    // the middle of the new recommended range so they don't end up
    // with a "blast" warning the second they switch tanks.
    const midFlow = Math.round((t.recMinLph + t.recMaxLph) / 2);
    push({ tankL: t.litres, filterLph: midFlow });
    setOpen(false);
  }

  function onFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (v === "") {
      push({ filterLph: null });
      return;
    }
    const n = Number(v);
    if (!Number.isNaN(n)) push({ filterLph: n });
  }

  const verdict =
    tankL && filterLph ? classifyFlow(tankL, filterLph) : null;

  return (
    <div className="glass glass-edge rounded-2xl p-5 sm:p-6">
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
        Your tank
      </h2>

      <div
        ref={containerRef}
        className="mt-4 flex flex-col gap-5"
      >
        {/* Tank size dropdown */}
        <div className="relative flex flex-col gap-2">
          <label
            htmlFor="tank-size"
            className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
          >
            Tank size
          </label>
          <button
            id="tank-size"
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="press flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm transition-colors hover:border-[var(--brand)]/45 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
          >
            <span className="flex flex-col items-start">
              {standard ? (
                <>
                  <span className="font-medium">{standard.label}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {standard.blurb}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  Choose a standard tank volume…
                </span>
              )}
            </span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                open && "rotate-180 text-[var(--brand)]",
              )}
              aria-hidden
            />
          </button>

          {open && (
            <ul
              role="listbox"
              className="animate-drop-in absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-auto rounded-xl border border-border bg-card p-1 shadow-xl"
            >
              {STANDARD_TANKS.map((t) => {
                const selected = t.litres === tankL;
                return (
                  <li key={t.litres}>
                    <button
                      type="button"
                      onClick={() => selectTank(t)}
                      className={cn(
                        "press flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-foreground/5",
                        selected && "bg-[var(--brand)]/8 text-foreground",
                      )}
                    >
                      <span className="flex flex-col gap-0.5">
                        <span className="font-medium">{t.label}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {t.blurb}
                        </span>
                      </span>
                      <span className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
                          {t.recMinLph}–{t.recMaxLph} L/h
                        </span>
                        {selected && (
                          <Check
                            className="size-4 text-[var(--brand)]"
                            aria-hidden
                          />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Filter flow input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="filter-flow"
            className="flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <Wind className="size-3.5" aria-hidden />
              Filter flow
            </span>
            {standard && (
              <span className="font-normal normal-case tracking-normal text-muted-foreground/70">
                rec. {standard.recMinLph}–{standard.recMaxLph} L/h
              </span>
            )}
          </label>
          <div className="flex items-center gap-2">
            <input
              id="filter-flow"
              type="number"
              inputMode="numeric"
              min={0}
              max={9999}
              step={10}
              placeholder={
                standard
                  ? String(Math.round((standard.recMinLph + standard.recMaxLph) / 2))
                  : "L/h"
              }
              value={filterLph ?? ""}
              onChange={onFilterChange}
              disabled={!tankL}
              className="w-32 rounded-xl border border-border bg-background/70 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="text-xs text-muted-foreground">L/h</span>
            {verdict && (
              <span
                className={cn(
                  "ml-auto inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]",
                  verdict.kind === "ok" &&
                    "border-emerald-600/45 bg-emerald-500/12 text-emerald-800",
                  verdict.kind === "low" &&
                    "border-sky-500/45 bg-sky-500/12 text-sky-800",
                  verdict.kind === "high" &&
                    "border-amber-500/45 bg-amber-500/15 text-amber-800",
                  (verdict.kind === "blast" || verdict.kind === "starve") &&
                    "border-rose-500/50 bg-rose-500/15 text-rose-800",
                )}
              >
                {verdict.kind === "ok" && `${verdict.turnover.toFixed(1)}× turnover`}
                {verdict.kind === "low" && `Low · ${verdict.turnover.toFixed(1)}×`}
                {verdict.kind === "high" && `Strong · ${verdict.turnover.toFixed(1)}×`}
                {verdict.kind === "blast" && `Too strong · ${verdict.turnover.toFixed(1)}×`}
                {verdict.kind === "starve" && `Too weak · ${verdict.turnover.toFixed(1)}×`}
              </span>
            )}
          </div>
          {!tankL && (
            <p className="text-[11px] text-muted-foreground/70">
              Pick a tank size first — we'll suggest a matching filter range.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
