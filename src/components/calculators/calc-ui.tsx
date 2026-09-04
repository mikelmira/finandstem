"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** A labelled numeric input, optionally with a trailing unit. */
export function NumberField({
  label,
  value,
  onChange,
  unit,
  step = "any",
  min = 0,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  step?: string;
  min?: number;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 focus-within:border-[var(--brand)]/50">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          step={step}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-base outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        {unit && (
          <span className="flex-none text-sm text-muted-foreground">{unit}</span>
        )}
      </span>
    </label>
  );
}

/** A segmented single-choice toggle. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
      )}
      <div className="inline-flex w-fit rounded-full border border-border bg-background/60 p-0.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={cn(
              "press rounded-full px-3 py-1.5 text-sm transition-colors",
              value === o.value
                ? "bg-[var(--brand)] text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** A result readout: big value + label + optional hint. */
export function Stat({
  label,
  value,
  hint,
  emphasis = false,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        emphasis
          ? "border-[var(--brand)]/40 bg-[var(--brand)]/8"
          : "border-border bg-background/60",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "text-display-tight mt-1 font-semibold",
          emphasis ? "text-2xl text-[var(--brand)] sm:text-3xl" : "text-xl sm:text-2xl",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Parse a numeric field, returning null when blank or invalid. */
export function num(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function round(n: number, dp = 1): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: dp,
  });
}
