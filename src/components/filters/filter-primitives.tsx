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
  return (
    <button
      type="button"
      onClick={() => onSelect(!selected)}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs transition-colors",
        selected
          ? "border-[var(--brand)]/60 bg-[var(--brand)]/15 text-foreground"
          : "border-border bg-background/60 text-muted-foreground hover:border-[var(--brand)]/40 hover:text-foreground",
        className,
      )}
    >
      {children}
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
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
      <span className="text-foreground/90">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={selected}
        onClick={() => onChange(!selected)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          selected ? "bg-[var(--brand)]/80" : "bg-border/70",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "inline-block size-4 rounded-full bg-background shadow-sm transition-transform",
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
  precision = 1,
}: RangePairProps) {
  const lo = value?.min ?? "";
  const hi = value?.max ?? "";
  const update = (which: "min" | "max", raw: string) => {
    const otherKey = which === "min" ? "max" : "min";
    if (raw === "") {
      const other = value?.[otherKey];
      if (other === undefined) {
        onChange(null);
      } else {
        onChange({
          min: which === "min" ? bounds.min : other,
          max: which === "max" ? bounds.max : other,
        });
      }
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    const base = value ?? { min: bounds.min, max: bounds.max };
    onChange({ ...base, [which]: n });
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        inputMode="decimal"
        min={bounds.min}
        max={bounds.max}
        step={bounds.step ?? 1}
        value={lo}
        placeholder={`${bounds.min}`}
        onChange={(e) => update("min", e.target.value)}
        className="w-full rounded-lg border border-border bg-background/70 px-3 py-1.5 text-sm placeholder:text-muted-foreground/60 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
      />
      <span className="text-xs text-muted-foreground" aria-hidden>
        –
      </span>
      <input
        type="number"
        inputMode="decimal"
        min={bounds.min}
        max={bounds.max}
        step={bounds.step ?? 1}
        value={hi}
        placeholder={`${bounds.max}`}
        onChange={(e) => update("max", e.target.value)}
        className="w-full rounded-lg border border-border bg-background/70 px-3 py-1.5 text-sm placeholder:text-muted-foreground/60 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
      />
      {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      <span className="sr-only">precision {precision}</span>
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
              "rounded-full px-2.5 py-1 transition-colors",
              selected
                ? "bg-[var(--brand)]/15 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
