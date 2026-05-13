import { Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const LIGHT_LEVELS = ["Low", "Medium", "High"] as const;
type LightLevel = (typeof LIGHT_LEVELS)[number];

const CO2_LEVELS = ["None", "Optional", "Recommended", "Required"] as const;
type CO2Level = (typeof CO2_LEVELS)[number];

const GROWTH_LEVELS = ["Slow", "Medium", "Fast", "Very Fast"] as const;
type GrowthLevel = (typeof GROWTH_LEVELS)[number];

const FLOW_LEVELS = ["Still", "Low", "Medium", "High", "Very High"] as const;
type FlowLevel = (typeof FLOW_LEVELS)[number];

function parseRange<T extends string>(
  raw: string,
  levels: ReadonlyArray<T>,
): { min: number; max: number } {
  const lower = raw.toLowerCase();
  const matches = levels.filter((l) => lower.includes(l.toLowerCase()));
  if (matches.length === 0) return { min: 0, max: 0 };
  const indexes = matches.map((m) => levels.indexOf(m));
  return { min: Math.min(...indexes), max: Math.max(...indexes) };
}

/* ─────────────────────────────  Light  ────────────────────────────── */

interface LightLevelProps {
  /** Raw value from data, e.g. "Low to Medium" or "High". */
  raw: string;
  className?: string;
}

export function LightLevel({ raw, className }: LightLevelProps) {
  const { min, max } = parseRange<LightLevel>(raw, LIGHT_LEVELS);
  const intensities = [12, 18, 26]; // sun icon sizes

  return (
    <figure
      className={cn("flex flex-col gap-2", className)}
      aria-label={`Light demand: ${raw}`}
    >
      <figcaption className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Light
        </span>
        <span className="font-medium text-foreground">{raw}</span>
      </figcaption>
      <div className="flex items-end gap-2">
        {LIGHT_LEVELS.map((level, i) => {
          const active = i >= min && i <= max;
          return (
            <div
              key={level}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors",
                active
                  ? "bg-[color-mix(in_oklab,var(--brand)_18%,transparent)] text-foreground"
                  : "text-muted-foreground/60",
              )}
            >
              <Sun
                style={{ width: intensities[i], height: intensities[i] }}
                strokeWidth={active ? 2 : 1.25}
                className={cn(
                  active ? "text-[var(--brand)]" : "text-foreground/30",
                )}
                aria-hidden
              />
              <span className="text-[10px] font-medium uppercase tracking-[0.16em]">
                {level}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

/* ─────────────────────────────  CO₂  ──────────────────────────────── */

interface CO2DemandProps {
  raw: string;
  className?: string;
}

export function CO2Demand({ raw, className }: CO2DemandProps) {
  const { min, max } = parseRange<CO2Level>(raw, CO2_LEVELS);

  return (
    <figure
      className={cn("flex flex-col gap-2", className)}
      aria-label={`CO₂ demand: ${raw}`}
    >
      <figcaption className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium uppercase tracking-[0.16em] text-muted-foreground">
          CO₂
        </span>
        <span className="font-medium text-foreground">{raw}</span>
      </figcaption>
      <div className="flex items-end gap-1.5">
        {CO2_LEVELS.map((level, i) => {
          const active = i >= min && i <= max;
          const size = 12 + i * 4; // 12, 16, 20, 24
          return (
            <div
              key={level}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 transition-colors",
                active
                  ? "bg-[color-mix(in_oklab,var(--brand)_18%,transparent)] text-foreground"
                  : "text-muted-foreground/60",
              )}
            >
              <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                aria-hidden
                className={cn(
                  active ? "text-[var(--brand)]" : "text-foreground/30",
                )}
              >
                {/* CO2 bubble — circle */}
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="currentColor"
                  fillOpacity={active ? 0.18 : 0.08}
                  stroke="currentColor"
                  strokeOpacity={active ? 0.9 : 0.35}
                  strokeWidth="1.6"
                />
                {/* Inner highlight to suggest a bubble */}
                <circle
                  cx="9"
                  cy="9"
                  r="2"
                  fill="currentColor"
                  fillOpacity={active ? 0.45 : 0.2}
                />
              </svg>
              <span className="text-[9px] font-medium uppercase tracking-[0.14em]">
                {level}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

/* ──────────────────────────  Growth rate  ─────────────────────────── */

interface GrowthRateBadgeProps {
  raw: string;
  className?: string;
}

/* ─────────────────────────────  Flow  ─────────────────────────────── */

interface FlowDemandProps {
  /** Raw value, e.g. "Low to Medium" or "Very High". */
  raw: string;
  className?: string;
}

export function FlowDemand({ raw, className }: FlowDemandProps) {
  const { min, max } = parseRange<FlowLevel>(raw, FLOW_LEVELS);

  return (
    <figure
      className={cn("flex flex-col gap-2", className)}
      aria-label={`Preferred flow rate: ${raw}`}
    >
      <figcaption className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Flow
        </span>
        <span className="font-medium text-foreground">{raw}</span>
      </figcaption>
      <div className="flex items-end gap-1">
        {FLOW_LEVELS.map((level, i) => {
          const active = i >= min && i <= max;
          // Increasingly long stacked current-lines: lower level = single short line,
          // higher level = three progressively longer parallel lines.
          const lineCount = Math.max(1, Math.min(3, Math.floor(i / 1.5) + 1));
          const lengths = [60, 80, 100].slice(0, lineCount).map((p) => {
            // scale the bars within a level by the level's intensity
            const intensity = 0.55 + (i / (FLOW_LEVELS.length - 1)) * 0.45;
            return Math.round(p * intensity);
          });
          return (
            <div
              key={level}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg px-1.5 py-2 transition-colors",
                active
                  ? "bg-[color-mix(in_oklab,var(--brand)_18%,transparent)]"
                  : "",
              )}
            >
              <span
                aria-hidden
                className="flex h-7 w-full flex-col items-start justify-center gap-1"
              >
                {lengths.map((pct, idx) => (
                  <span
                    key={idx}
                    style={{ width: `${pct}%` }}
                    className={cn(
                      "h-[2px] rounded-full transition-colors",
                      active
                        ? "bg-[var(--brand)]/85"
                        : "bg-foreground/15",
                    )}
                  />
                ))}
              </span>
              <span
                className={cn(
                  "text-[9px] font-medium uppercase tracking-[0.14em] text-center",
                  active ? "text-foreground" : "text-muted-foreground/60",
                )}
              >
                {level === "Very High" ? "V. high" : level}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

/* ──────────────────────────  Growth rate  ─────────────────────────── */

export function GrowthRateBadge({ raw, className }: GrowthRateBadgeProps) {
  const { min, max } = parseRange<GrowthLevel>(raw, GROWTH_LEVELS);

  return (
    <figure
      className={cn("flex flex-col gap-2", className)}
      aria-label={`Growth rate: ${raw}`}
    >
      <figcaption className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Growth
        </span>
        <span className="font-medium text-foreground">{raw}</span>
      </figcaption>
      <div className="flex items-end gap-1">
        {GROWTH_LEVELS.map((level, i) => {
          const active = i >= min && i <= max;
          // Height grows with level — slow=8, medium=14, fast=20, very fast=26
          const heightPx = 8 + i * 6;
          return (
            <div
              key={level}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg px-1.5 py-2 transition-colors",
                active
                  ? "bg-[color-mix(in_oklab,var(--brand)_18%,transparent)]"
                  : "",
              )}
            >
              <span
                aria-hidden
                style={{ height: heightPx }}
                className={cn(
                  "w-2 rounded-t-md transition-colors",
                  active
                    ? "bg-[var(--brand)]/85"
                    : "bg-foreground/15",
                )}
              />
              <span
                className={cn(
                  "text-[9px] font-medium uppercase tracking-[0.14em]",
                  active ? "text-foreground" : "text-muted-foreground/60",
                )}
              >
                {level === "Very Fast" ? "V. fast" : level}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
