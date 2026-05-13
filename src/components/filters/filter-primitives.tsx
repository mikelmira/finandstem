"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FilterGroupProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FilterGroup({ label, hint, children, className }: FilterGroupProps) {
  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      <legend className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </legend>
      {hint && (
        <p className="text-[11px] leading-snug text-muted-foreground/80">
          {hint}
        </p>
      )}
      <div className="flex flex-col gap-2">{children}</div>
    </fieldset>
  );
}

interface ChipToggleProps {
  selected: boolean;
  onSelect: (next: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function ChipToggle({
  selected,
  onSelect,
  children,
  className,
}: ChipToggleProps) {
  const [popKey, setPopKey] = React.useState(0);
  const prevSelected = React.useRef(selected);

  React.useEffect(() => {
    if (selected && !prevSelected.current) {
      setPopKey((n) => n + 1);
    }
    prevSelected.current = selected;
  }, [selected]);

  return (
    <button
      type="button"
      onClick={() => onSelect(!selected)}
      aria-pressed={selected}
      className={cn(
        "press inline-flex items-center rounded-full border px-2.5 py-1 text-xs transition-[background-color,border-color,color,box-shadow] duration-200 ease-out",
        selected
          ? "border-[var(--brand)]/60 bg-[var(--brand)]/15 text-foreground shadow-[0_0_0_2px_color-mix(in_oklab,var(--brand)_18%,transparent)]"
          : "border-border bg-background/60 text-muted-foreground hover:border-[var(--brand)]/40 hover:text-foreground hover:bg-foreground/5",
        className,
      )}
    >
      <span
        key={popKey}
        className={cn("inline-flex", selected && popKey > 0 && "animate-pop")}
      >
        {children}
      </span>
    </button>
  );
}

interface MultiChipsProps<T extends string> {
  options: ReadonlyArray<{ value: T; label: string }>;
  values: T[];
  onChange: (next: T[]) => void;
}

export function MultiChips<T extends string>({
  options,
  values,
  onChange,
}: MultiChipsProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const selected = values.includes(o.value);
        return (
          <ChipToggle
            key={o.value}
            selected={selected}
            onSelect={(next) => {
              if (next) onChange([...values, o.value]);
              else onChange(values.filter((v) => v !== o.value));
            }}
          >
            {o.label}
          </ChipToggle>
        );
      })}
    </div>
  );
}

interface DifficultyChipsProps {
  values: number[];
  onChange: (next: number[]) => void;
}

export function DifficultyChips({ values, onChange }: DifficultyChipsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const selected = values.includes(n);
        return (
          <ChipToggle
            key={n}
            selected={selected}
            onSelect={(next) => {
              if (next) onChange([...values, n].sort());
              else onChange(values.filter((v) => v !== n));
            }}
          >
            {n}
          </ChipToggle>
        );
      })}
    </div>
  );
}

interface ToggleSwitchProps {
  label: string;
  selected: boolean;
  onChange: (next: boolean) => void;
}

export function ToggleSwitch({ label, selected, onChange }: ToggleSwitchProps) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 text-sm">
      <span className="text-foreground/90 transition-colors group-hover:text-foreground">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={selected}
        onClick={() => onChange(!selected)}
        className={cn(
          "press relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200",
          selected
            ? "bg-[var(--brand)]/85 shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_15%,transparent)]"
            : "bg-border/70 group-hover:bg-border",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block size-4 rounded-full bg-background shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            selected ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
    </label>
  );
}

interface NumberInputProps {
  value: number | null;
  onChange: (next: number | null) => void;
  placeholder?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({
  value,
  onChange,
  placeholder,
  unit,
  min,
  max,
  step,
}: NumberInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "") onChange(null);
          else {
            const n = Number(v);
            if (!Number.isNaN(n)) onChange(n);
          }
        }}
        className="w-full rounded-lg border border-border bg-background/70 px-3 py-1.5 text-sm placeholder:text-muted-foreground/60 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
      />
      {unit && (
        <span className="text-xs text-muted-foreground">{unit}</span>
      )}
    </div>
  );
}

interface RangePairProps {
  value: { min: number; max: number } | null;
  onChange: (next: { min: number; max: number } | null) => void;
  bounds: { min: number; max: number; step?: number };
  unit?: string;
  precision?: number;
}

export function RangePair({
  value,
  onChange,
  bounds,
  unit,
  precision = 0,
}: RangePairProps) {
  const step = bounds.step ?? 1;
  const lo = value?.min ?? bounds.min;
  const hi = value?.max ?? bounds.max;
  const active = value !== null;
  const span = bounds.max - bounds.min;
  const loPct = span > 0 ? ((lo - bounds.min) / span) * 100 : 0;
  const hiPct = span > 0 ? ((hi - bounds.min) / span) * 100 : 100;

  const fmt = (n: number) =>
    precision === 0
      ? Math.round(n).toString()
      : n.toFixed(precision).replace(/\.0+$/, "");

  function setMin(next: number) {
    const clamped = Math.max(bounds.min, Math.min(next, hi - step));
    onChange({ min: clamped, max: hi });
  }
  function setMax(next: number) {
    const clamped = Math.min(bounds.max, Math.max(next, lo + step));
    onChange({ min: lo, max: clamped });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span
          className={cn(
            "tabular-nums font-medium transition-colors",
            active ? "text-foreground" : "text-muted-foreground/80",
          )}
        >
          {fmt(lo)}
          {unit ? ` ${unit}` : ""}
        </span>
        {active ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="press inline-flex items-center rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-[var(--brand)]/40 hover:text-foreground"
          >
            Reset
          </button>
        ) : (
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
            Any
          </span>
        )}
        <span
          className={cn(
            "tabular-nums font-medium transition-colors",
            active ? "text-foreground" : "text-muted-foreground/80",
          )}
        >
          {fmt(hi)}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <div className="relative flex h-6 items-center px-[9px]">
        <div className="absolute inset-x-0 mx-[9px] h-1.5 rounded-full bg-foreground/10" />
        <div
          className={cn(
            "absolute h-1.5 rounded-full transition-colors",
            active
              ? "bg-gradient-to-r from-[var(--brand)]/85 to-[var(--leaf)]/90 shadow-[0_0_10px_-2px_color-mix(in_oklab,var(--brand)_55%,transparent)]"
              : "bg-foreground/15",
          )}
          style={{
            left: `calc(${loPct}% + ${(1 - loPct / 100) * 18 - 9}px)`,
            width: `calc(${Math.max(0, hiPct - loPct)}% + ${
              (loPct / 100 - hiPct / 100) * 18
            }px)`,
          }}
          aria-hidden
        />
        <input
          type="range"
          aria-label={`Minimum${unit ? ` ${unit}` : ""}`}
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={lo}
          onChange={(e) => setMin(Number(e.target.value))}
          className="range-thumb absolute inset-x-0 z-10"
        />
        <input
          type="range"
          aria-label={`Maximum${unit ? ` ${unit}` : ""}`}
          min={bounds.min}
          max={bounds.max}
          step={step}
          value={hi}
          onChange={(e) => setMax(Number(e.target.value))}
          className="range-thumb absolute inset-x-0 z-10"
        />
      </div>
    </div>
  );
}

interface TriSelectProps {
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string;
  onChange: (next: string) => void;
}

export function TriSelect({ options, value, onChange }: TriSelectProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-background/60 p-0.5 text-xs">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "press rounded-full px-2.5 py-1 transition-all duration-200",
              selected
                ? "bg-[var(--brand)]/15 text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--brand)_28%,transparent)]"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
