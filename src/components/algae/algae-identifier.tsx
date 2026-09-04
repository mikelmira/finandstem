"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type {
  AlgaeColor,
  AlgaeForm,
  AlgaeLocation,
  AlgaeSeverity,
} from "@/data/algae";
import { cn } from "@/lib/utils";

export interface AlgaeCard {
  slug: string;
  name: string;
  spot: string;
  color: AlgaeColor;
  forms: AlgaeForm[];
  locations: AlgaeLocation[];
  severity: AlgaeSeverity;
}

const COLORS: { value: AlgaeColor; label: string }[] = [
  { value: "green", label: "Green" },
  { value: "brown", label: "Brown" },
  { value: "black", label: "Black" },
  { value: "blue-green", label: "Blue-green" },
  { value: "clear", label: "Clear / oily" },
];

const FORMS: { value: AlgaeForm; label: string }[] = [
  { value: "spots", label: "Hard spots" },
  { value: "dust", label: "Dust / haze" },
  { value: "film", label: "Film / sheet" },
  { value: "fuzz", label: "Short fuzz" },
  { value: "hair", label: "Hair / threads" },
  { value: "clumps", label: "Tufts / clumps" },
  { value: "slime", label: "Slime" },
];

const LOCATIONS: { value: AlgaeLocation; label: string }[] = [
  { value: "glass", label: "On the glass" },
  { value: "plants", label: "On plants" },
  { value: "hardscape", label: "On wood / rock" },
  { value: "substrate", label: "On the substrate" },
  { value: "water", label: "In the water" },
  { value: "surface", label: "On the surface" },
];

const SEVERITY_LABEL: Record<AlgaeSeverity, string> = {
  harmless: "Harmless",
  nuisance: "Nuisance",
  stubborn: "Stubborn",
};

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "press rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-[var(--brand)] bg-[var(--brand)]/12 text-[var(--brand)]"
          : "border-border bg-background/60 text-foreground hover:border-[var(--brand)]/40",
      )}
    >
      {label}
    </button>
  );
}

export function AlgaeIdentifier({ items }: { items: AlgaeCard[] }) {
  const [color, setColor] = React.useState<AlgaeColor | null>(null);
  const [form, setForm] = React.useState<AlgaeForm | null>(null);
  const [location, setLocation] = React.useState<AlgaeLocation | null>(null);

  const results = items.filter(
    (a) =>
      (color === null || a.color === color) &&
      (form === null || a.forms.includes(form)) &&
      (location === null || a.locations.includes(location)),
  );

  const anyFilter = color !== null || form !== null || location !== null;

  return (
    <div className="glass glass-edge rounded-2xl p-6 sm:p-8">
      <FilterRow label="What colour is it?">
        {COLORS.map((c) => (
          <Chip
            key={c.value}
            label={c.label}
            active={color === c.value}
            onClick={() => setColor(color === c.value ? null : c.value)}
          />
        ))}
      </FilterRow>
      <FilterRow label="What does it look like?">
        {FORMS.map((c) => (
          <Chip
            key={c.value}
            label={c.label}
            active={form === c.value}
            onClick={() => setForm(form === c.value ? null : c.value)}
          />
        ))}
      </FilterRow>
      <FilterRow label="Where is it growing?">
        {LOCATIONS.map((c) => (
          <Chip
            key={c.value}
            label={c.label}
            active={location === c.value}
            onClick={() => setLocation(location === c.value ? null : c.value)}
          />
        ))}
      </FilterRow>

      <div className="mt-6 flex items-baseline justify-between gap-3 border-t border-border/50 pt-5">
        <p className="text-sm text-muted-foreground">
          {anyFilter
            ? `${results.length} match${results.length === 1 ? "" : "es"}`
            : `${items.length} common types`}
        </p>
        {anyFilter && (
          <button
            type="button"
            onClick={() => {
              setColor(null);
              setForm(null);
              setLocation(null);
            }}
            className="press text-sm font-medium text-[var(--brand)] hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {results.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/algae/${a.slug}`}
              className="press group flex h-full flex-col gap-2 rounded-2xl border border-border bg-background/60 p-4 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium leading-tight">{a.name}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {SEVERITY_LABEL[a.severity]}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {a.spot}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[var(--brand)]">
                How to fix it
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {anyFilter && results.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Nothing matches that exact combination. Try loosening one of the
          filters, algae doesn&rsquo;t always read the textbook.
        </p>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
