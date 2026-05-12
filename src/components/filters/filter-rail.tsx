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
  category: "fish" | "plants" | "shrimp" | "mosses";
  children: React.ReactNode;
}

export function FilterRail({
  rail,
  chips,
  onClearChip,
  resultCount,
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
      <div className="flex flex-wrap items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium"
          aria-expanded={mobileOpen}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-[var(--brand)]/15 px-2 py-0.5 text-xs text-foreground">
              {activeCount}
            </span>
          )}
        </button>
        <span className="text-xs text-muted-foreground">
          {resultCount} {noun}
        </span>
      </div>

      {/* Left rail */}
      <aside
        className={cn(
          "glass glass-edge order-2 rounded-2xl p-5 lg:order-1 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto",
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
        </div>

        <div
          className={cn("mt-5 flex flex-col gap-5", !open && "lg:hidden")}
        >
          {rail}
        </div>
      </aside>

      {/* Right column */}
      <div className="order-1 flex flex-col gap-5 lg:order-2">
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

        <div className="hidden text-xs text-muted-foreground lg:block">
          {resultCount} {noun}
        </div>

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
