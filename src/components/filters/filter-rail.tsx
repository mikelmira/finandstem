"use client";

import * as React from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActiveChip } from "@/lib/catalogue/filters";
import { useFilterUrl } from "./use-filter-url";

const STORAGE_KEY = "fs:filter-rail-open";

interface FilterRailProps {
  rail: React.ReactNode;
  chips: ActiveChip[];
  onClearChip: (key: string) => void;
  resultCount: number;
  totalCount: number;
  category: "fish" | "plants" | "shrimp" | "mosses" | "snails";
  children: React.ReactNode;
}

export function FilterRail({
  rail,
  chips,
  onClearChip,
  resultCount,
  totalCount,
  category,
  children,
}: FilterRailProps) {
  const { clearAll, isPending } = useFilterUrl();
  const [open, setOpen] = React.useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const hydratedRef = React.useRef(false);

  React.useEffect(() => {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (v === "closed") setOpen(false);
    } catch {}
    hydratedRef.current = true;
  }, []);

  React.useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, open ? "open" : "closed");
    } catch {}
  }, [open]);

  const activeCount = chips.length;
  const noun =
    category === "fish"
      ? resultCount === 1
        ? "fish"
        : "fish"
      : category;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
      {/* Mobile filter toggle */}
      <div className="order-1 flex flex-wrap items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="filter-rail"
          className={cn(
            "press inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            mobileOpen
              ? "border-[var(--brand)]/55 bg-[var(--brand)]/15 text-foreground"
              : "border-border bg-background/70 text-foreground",
          )}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          {mobileOpen ? "Hide filters" : "Filters"}
          {activeCount > 0 && (
            <span className="rounded-full bg-[var(--brand)]/15 px-2 py-0.5 text-xs text-foreground">
              {activeCount}
            </span>
          )}
        </button>
        <span className="text-xs text-muted-foreground">
          {resultCount} of {totalCount} {noun}
        </span>
      </div>

      {/* Filter rail — appears as the second item on mobile (right after
          the toggle button), and as the left column on desktop. */}
      <aside
        id="filter-rail"
        className={cn(
          // Filter rail scrolls with the page (no internal scrollbar) so
          // the green card always covers every section, and so the lower
          // filters are reachable even when their stack is taller than
          // the viewport. We drop the sticky+max-h pattern that previously
          // truncated the bottom of the rail on tall mobile views.
          "glass glass-edge order-2 animate-fade-up rounded-2xl p-5 lg:order-1",
          !mobileOpen && "hidden lg:block",
        )}
        aria-label="Filters"
      >
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="hidden items-center gap-1.5 text-sm font-medium lg:inline-flex"
            aria-expanded={open}
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
            {activeCount > 0 && (
              <span className="ml-1 rounded-full bg-[var(--brand)]/15 px-1.5 py-0.5 text-xs">
                {activeCount}
              </span>
            )}
            <ChevronDown
              className={cn(
                "ml-1 size-3.5 transition-transform",
                !open && "-rotate-90",
              )}
              aria-hidden
            />
          </button>
          <span className="text-sm font-medium lg:hidden">Filters</span>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                disabled={isPending}
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="press inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground lg:hidden"
              aria-label="Close filters"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div
          className={cn("mt-5 flex flex-col gap-5", !open && "lg:hidden")}
        >
          {rail}
        </div>
      </aside>

      {/* Right column — content area. On mobile sits AFTER the rail
          (when open) so tapping "Filters" reveals the rail immediately
          above the result list rather than way below it. */}
      <div className="order-3 flex flex-col gap-5 lg:order-2">
        {/* Always-visible result count + filter summary */}
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border/50 pb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-display-tight text-3xl text-foreground sm:text-4xl">
              {resultCount}
            </span>
            <span className="text-sm text-muted-foreground">
              of {totalCount} {noun}
              {activeCount > 0 ? (
                <span>
                  {" "}
                  match
                  <span className="text-foreground"> {activeCount} filter{activeCount === 1 ? "" : "s"}</span>
                </span>
              ) : null}
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/85">
            {activeCount === 0
              ? "Use the filters to narrow the list"
              : "Adjust filters to widen or narrow"}
          </span>
        </div>

        {chips.length > 0 && (
          <div className="stagger flex flex-wrap items-center gap-2">
            {chips.map((c, i) => (
              <button
                key={c.key}
                type="button"
                onClick={() => onClearChip(c.key)}
                style={{ ["--i" as string]: Math.min(i, 8) }}
                className="animate-fade-up press group inline-flex items-center gap-1 rounded-full border border-[var(--brand)]/40 bg-[var(--brand)]/10 px-2.5 py-1 text-xs text-foreground transition-all duration-200 hover:border-[var(--brand)]/65 hover:bg-[var(--brand)]/20"
                aria-label={`Remove filter ${c.label}`}
              >
                {c.label}
                <X
                  className="size-3 transition-transform duration-200 group-hover:rotate-90"
                  aria-hidden
                />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              disabled={isPending}
              className="link-underline press text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  chips: ActiveChip[];
  onClearChip: (key: string) => void;
}

export function FilterEmptyState({ chips, onClearChip }: EmptyStateProps) {
  return (
    <div className="glass rounded-2xl p-8 text-center">
      <p className="text-base font-medium">No matches.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Try widening one of:
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {chips.length === 0 ? (
          <span className="text-xs text-muted-foreground">
            (no active filters)
          </span>
        ) : (
          chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => onClearChip(c.key)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs hover:border-[var(--brand)]/50"
            >
              {c.label}
              <X className="size-3" aria-hidden />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
