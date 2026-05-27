import * as React from "react";
import { cn } from "@/lib/utils";

interface SizeBarProps {
  label: string;
  /** Full visual scale in cm. */
  scaleMaxCm: number;
  /** The species' size range in cm. */
  range: { min: number; max: number } | null;
  /** Kept for backward compatibility, no longer rendered as a
   *  silhouette. The size readout now stands on its own ruler. */
  kind?: "fish" | "shrimp" | "plant" | "moss";
  className?: string;
}

export function SizeBar({
  label,
  scaleMaxCm,
  range,
  kind: _kind,
  className,
}: SizeBarProps) {
  void _kind;
  const span = scaleMaxCm;
  const clamp = (n: number) =>
    Math.max(0, Math.min(100, (n / span) * 100));

  // Build a coarse tick set across the scale — 0, 25%, 50%, 75%, 100%
  const ticks = [0, scaleMaxCm * 0.25, scaleMaxCm * 0.5, scaleMaxCm * 0.75, scaleMaxCm];

  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <figcaption className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <span className="font-medium text-foreground">
          {range
            ? range.min === range.max
              ? `${range.min} cm`
              : `${range.min}–${range.max} cm`
            : ", "}
        </span>
      </figcaption>
      <div className="flex flex-col gap-1.5">
        <div
          className="relative h-2.5 w-full overflow-hidden rounded-full bg-foreground/10"
          role="img"
          aria-label={`${label}${
            range ? ` ${range.min}–${range.max} cm` : ""
          } on a ruler from 0 to ${scaleMaxCm} cm`}
        >
          {range && (
            <div
              className="absolute inset-y-0 rounded-full bg-[var(--brand)]/80 shadow-[0_0_10px_-2px_color-mix(in_oklab,var(--brand)_55%,transparent)]"
              style={{
                left: `${clamp(range.min)}%`,
                width: `${Math.max(2, clamp(range.max) - clamp(range.min))}%`,
              }}
            />
          )}
          {ticks.map((t) => (
            <span
              key={t}
              aria-hidden
              className="absolute top-0 h-full w-px bg-foreground/15"
              style={{ left: `${clamp(t)}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] tabular-nums text-muted-foreground">
          {ticks.map((t) => (
            <span key={t}>{Math.round(t)}</span>
          ))}
        </div>
      </div>
    </figure>
  );
}
