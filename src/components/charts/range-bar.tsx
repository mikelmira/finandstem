import { cn } from "@/lib/utils";

interface RangeBarProps {
  /** Label shown above the bar (e.g. "Temperature"). */
  label: string;
  /** Unit suffix shown beside the value (e.g. "°C", "ppm"). Empty for pH. */
  unit?: string;
  /** Full visual scale this bar shows. */
  scale: { min: number; max: number };
  /** The species' range. */
  range: { min: number; max: number } | null;
  /** Decimals for displayed numbers. */
  precision?: number;
  /** Optional tick stops to label below the bar. */
  ticks?: number[];
  /** Visual accent, defaults to brand. */
  tone?: "brand" | "blue" | "warning";
  className?: string;
}

const TONE: Record<NonNullable<RangeBarProps["tone"]>, { fill: string }> = {
  brand: { fill: "bg-[var(--brand)]/80" },
  blue: { fill: "bg-sky-400/75" },
  warning: { fill: "bg-amber-400/80" },
};

export function RangeBar({
  label,
  unit,
  scale,
  range,
  precision = 0,
  ticks,
  tone = "brand",
  className,
}: RangeBarProps) {
  const colour = TONE[tone];
  const span = scale.max - scale.min;
  const clamp = (n: number) =>
    Math.max(0, Math.min(100, ((n - scale.min) / span) * 100));

  const renderTicks = ticks ?? [scale.min, (scale.min + scale.max) / 2, scale.max];

  const fmt = (n: number) =>
    precision === 0 ? Math.round(n).toString() : n.toFixed(precision);

  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <figcaption className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <span className="font-medium text-foreground">
          {range
            ? range.min === range.max
              ? `${fmt(range.min)}${unit ? ` ${unit}` : ""}`
              : `${fmt(range.min)}–${fmt(range.max)}${unit ? ` ${unit}` : ""}`
            : ", "}
        </span>
      </figcaption>
      <div
        className="relative h-2.5 w-full overflow-hidden rounded-full bg-foreground/10"
        role="img"
        aria-label={`${label}${
          range ? ` range ${fmt(range.min)} to ${fmt(range.max)} ${unit ?? ""}` : ""
        }, on a scale from ${fmt(scale.min)} to ${fmt(scale.max)} ${unit ?? ""}`}
      >
        {range && (
          <div
            className={cn(
              "absolute inset-y-0 rounded-full shadow-[0_0_12px_-2px_color-mix(in_oklab,var(--brand)_55%,transparent)]",
              colour.fill,
            )}
            style={{
              left: `${clamp(range.min)}%`,
              width: `${Math.max(2, clamp(range.max) - clamp(range.min))}%`,
            }}
          />
        )}
        {renderTicks.map((t) => (
          <span
            key={t}
            aria-hidden
            className="absolute top-0 h-full w-px bg-foreground/15"
            style={{ left: `${clamp(t)}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] tabular-nums text-muted-foreground">
        {renderTicks.map((t) => (
          <span key={t}>
            {fmt(t)}
            {unit ? ` ${unit}` : ""}
          </span>
        ))}
      </div>
    </figure>
  );
}
