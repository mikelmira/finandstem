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
          return (
            <div
              key={level}
              className={cn(
                "flex flex-1 flex-col items-center gap-1.5 rounded-lg px-1.5 py-2 transition-colors",
                active
                  ? "bg-[color-mix(in_oklab,var(--brand)_18%,transparent)]"
                  : "",
              )}
            >
              <FlowIcon
                level={i as 0 | 1 | 2 | 3 | 4}
                className={cn(
                  "h-6 w-full",
                  active
                    ? "text-[var(--brand)]"
                    : "text-foreground/25",
                )}
              />
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

/**
 * Custom flow-rate icons — five distinct silhouettes that read at a
 * glance as a progression from calm to turbulent.
 *
 *   0 Still     — three flat layers of motionless water
 *   1 Low       — a single gentle ripple over a calm layer
 *   2 Medium    — two stacked sine waves
 *   3 High      — three taller stacked waves
 *   4 V. high   — three tight, high-frequency waves
 *
 * Drawn with currentColor so the parent controls active/inactive
 * tinting; aria-hidden because the textual label sits beside them.
 */
function FlowIcon({
  level,
  className,
}: {
  level: 0 | 1 | 2 | 3 | 4;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 28 18"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {level === 0 && (
        <>
          <line x1="4" y1="5" x2="24" y2="5" opacity="0.55" />
          <line x1="4" y1="9" x2="24" y2="9" />
          <line x1="4" y1="13" x2="24" y2="13" opacity="0.55" />
        </>
      )}
      {level === 1 && (
        <>
          <path d="M 3 6 Q 8 3.5 13 6 T 25 6" />
          <line x1="3" y1="12" x2="25" y2="12" opacity="0.45" />
        </>
      )}
      {level === 2 && (
        <>
          <path
            d="M 2 5 Q 6 2 10 5 T 18 5 T 26 5"
            opacity="0.55"
          />
          <path d="M 2 12 Q 6 9 10 12 T 18 12 T 26 12" />
        </>
      )}
      {level === 3 && (
        <>
          <path d="M 2 4 Q 5 0.5 8 4 T 14 4 T 20 4 T 26 4" opacity="0.5" />
          <path d="M 2 9 Q 5 5.5 8 9 T 14 9 T 20 9 T 26 9" />
          <path d="M 2 14 Q 5 10.5 8 14 T 14 14 T 20 14 T 26 14" opacity="0.65" />
        </>
      )}
      {level === 4 && (
        <>
          <path
            d="M 1 4 Q 3 0 5 4 T 9 4 T 13 4 T 17 4 T 21 4 T 25 4 T 27 4"
            opacity="0.5"
          />
          <path d="M 1 10 Q 3 5 5 10 T 9 10 T 13 10 T 17 10 T 21 10 T 25 10 T 27 10" />
          <path
            d="M 1 16 Q 3 11 5 16 T 9 16 T 13 16 T 17 16 T 21 16 T 25 16 T 27 16"
            opacity="0.65"
          />
        </>
      )}
    </svg>
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
