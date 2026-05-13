import { cn } from "@/lib/utils";
import type { NumericRange } from "@/lib/range";
import type { CatalogueCategory } from "@/types/catalogue";

interface SpeciesRange {
  label: string;
  category: CatalogueCategory;
  range: NumericRange;
}

interface MultiRangeBarProps {
  label: string;
  unit?: string;
  scale: { min: number; max: number };
  ticks?: number[];
  precision?: number;
  species: ReadonlyArray<SpeciesRange>;
  intersection: NumericRange | null;
  className?: string;
}

const CATEGORY_BAR: Record<CatalogueCategory, string> = {
  fish: "bg-sky-400/55 ring-1 ring-inset ring-sky-300/50",
  plants: "bg-[var(--brand)]/55 ring-1 ring-inset ring-[var(--brand)]/55",
  shrimp: "bg-rose-400/55 ring-1 ring-inset ring-rose-300/50",
  mosses: "bg-emerald-400/55 ring-1 ring-inset ring-emerald-300/50",
};

const CATEGORY_DOT: Record<CatalogueCategory, string> = {
  fish: "bg-sky-300",
  plants: "bg-[var(--brand)]",
  shrimp: "bg-rose-300",
  mosses: "bg-emerald-300",
};

export function MultiRangeBar({
  label,
  unit,
  scale,
  ticks,
  precision = 0,
  species,
  intersection,
  className,
}: MultiRangeBarProps) {
  const span = scale.max - scale.min;
  const clamp = (n: number) =>
    Math.max(0, Math.min(100, ((n - scale.min) / span) * 100));
  const fmt = (n: number) =>
    precision === 0
      ? Math.round(n).toString()
      : n.toFixed(precision).replace(/\.0+$/, "");
  const renderTicks =
    ticks ?? [scale.min, (scale.min + scale.max) / 2, scale.max];

  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
            intersection
              ? "border-[var(--brand)]/45 bg-[var(--brand)]/15 text-foreground"
              : "border-rose-400/45 bg-rose-400/12 text-rose-200",
          )}
        >
          {intersection
            ? `${fmt(intersection.min)}–${fmt(intersection.max)}${unit ? ` ${unit}` : ""} overlap`
            : "No overlap"}
        </span>
      </figcaption>

      {/* Stacked species ranges */}
      <ul className="flex flex-col gap-1.5" aria-label={`${label} ranges per species`}>
        {species.map((s) => (
          <li
            key={s.label}
            className="grid grid-cols-[1fr_auto] items-center gap-3"
          >
            <div className="relative h-4 rounded-full bg-foreground/[0.06]">
              {renderTicks.map((t) => (
                <span
                  key={t}
                  aria-hidden
                  className="absolute top-0 h-full w-px bg-foreground/10"
                  style={{ left: `${clamp(t)}%` }}
                />
              ))}
              <div
                className={cn(
                  "absolute inset-y-0.5 rounded-full",
                  CATEGORY_BAR[s.category],
                )}
                style={{
                  left: `${clamp(s.range.min)}%`,
                  width: `${Math.max(2, clamp(s.range.max) - clamp(s.range.min))}%`,
                }}
                aria-label={`${s.label}: ${fmt(s.range.min)}–${fmt(s.range.max)}${unit ? ` ${unit}` : ""}`}
              />
            </div>
            <span className="flex items-center gap-1.5 text-[11px] text-foreground/85">
              <span
                aria-hidden
                className={cn("size-1.5 rounded-full", CATEGORY_DOT[s.category])}
              />
              <span className="truncate max-w-[12ch] sm:max-w-[16ch]">
                {s.label}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {/* Intersection bar — the actual target window */}
      <div className="flex flex-col gap-1">
        <div className="relative h-3 rounded-full bg-foreground/[0.06]">
          {renderTicks.map((t) => (
            <span
              key={t}
              aria-hidden
              className="absolute top-0 h-full w-px bg-foreground/10"
              style={{ left: `${clamp(t)}%` }}
            />
          ))}
          {intersection && (
            <div
              className="absolute inset-y-0 rounded-full bg-gradient-to-r from-[var(--brand)]/85 to-[var(--leaf)]/90 shadow-[0_0_14px_-2px_color-mix(in_oklab,var(--brand)_55%,transparent)]"
              style={{
                left: `${clamp(intersection.min)}%`,
                width: `${Math.max(2, clamp(intersection.max) - clamp(intersection.min))}%`,
              }}
            />
          )}
        </div>
        <div className="flex justify-between text-[10px] tabular-nums text-muted-foreground">
          {renderTicks.map((t) => (
            <span key={t}>
              {fmt(t)}
              {unit ? ` ${unit}` : ""}
            </span>
          ))}
        </div>
      </div>
    </figure>
  );
}
