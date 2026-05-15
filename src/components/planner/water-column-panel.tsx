import { Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { FishMark } from "@/components/icons/species-icons";
import type {
  WaterColumnReport,
  WaterColumnZone,
} from "@/lib/catalogue/tank-builder";

interface WaterColumnPanelProps {
  report: WaterColumnReport;
}

/**
 * Visual water-column distribution panel.
 *
 *   ┌──────────────┐
 *   │ TOP          │  • Threadfin Rainbow
 *   │ ░░░░░░░░░░░░ │  • Endler's
 *   ├──────────────┤
 *   │ MID          │  • Neon Tetra ×10
 *   │ ▓▓▓▓▓▓▓▓▓▓▓▓ │
 *   ├──────────────┤
 *   │ BOTTOM       │  · (empty)
 *   └──────────────┘
 *
 * Each zone is lit by the brand-green when at least one species
 * occupies it, with the fish count rendered as a small density bar.
 * Empty zones go grey with a "Nothing stocked" caption.
 */
export function WaterColumnPanel({ report }: WaterColumnPanelProps) {
  const zones: WaterColumnZone[] = ["Top", "Mid", "Bottom"];
  const totalFish =
    report.zones.Top.fishCount +
    report.zones.Mid.fishCount +
    report.zones.Bottom.fishCount;

  if (totalFish === 0) return null;

  return (
    <article className="glass glass-edge flex flex-col gap-4 rounded-2xl p-5 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]"
          >
            <Waves className="size-4" strokeWidth={1.85} />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Water column
            </span>
            <span className="text-[11px] text-muted-foreground/70">
              {totalFish} fish across{" "}
              {3 - report.missingZones.length} of 3 zones
            </span>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]",
            report.isBalanced
              ? "border-[var(--brand)]/45 bg-[var(--brand)]/15 text-[var(--brand)]"
              : "border-amber-500/45 bg-amber-500/15 text-amber-800",
          )}
        >
          {report.isBalanced ? "Balanced" : "Imbalanced"}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
        {/* Cross-section tank graphic */}
        <div
          aria-hidden
          className="relative flex h-44 flex-col overflow-hidden rounded-xl border border-foreground/15 bg-background/40 sm:h-52"
        >
          {/* Surface line */}
          <span className="absolute inset-x-0 top-1 h-px bg-foreground/15" />
          {zones.map((z, i) => {
            const data = report.zones[z];
            const active = data.fishCount > 0;
            const density = Math.min(1, data.fishCount / Math.max(totalFish, 1));
            return (
              <div
                key={z}
                className={cn(
                  "relative flex flex-1 items-center justify-center border-b border-foreground/10 last:border-b-0 transition-colors",
                  active ? "bg-[var(--brand)]/12" : "bg-foreground/[0.04]",
                )}
              >
                {/* Density tint — wider band for zones with more fish */}
                {active && (
                  <span
                    className="absolute inset-x-2 inset-y-2 rounded-md bg-[var(--brand)]/15"
                    style={{ opacity: 0.5 + density * 0.5 }}
                  />
                )}
                {/* Mini fish silhouettes — up to 5, scales with count */}
                {active && (
                  <div className="relative z-10 flex items-center justify-center gap-1">
                    {Array.from({
                      length: Math.min(
                        5,
                        Math.max(1, Math.round(data.fishCount / 4)),
                      ),
                    }).map((_, j) => (
                      <FishMark
                        key={j}
                        className={cn(
                          "size-3.5 text-[var(--brand)]",
                          j % 2 === 1 && "-translate-y-0.5",
                        )}
                      />
                    ))}
                  </div>
                )}
                <span className="absolute left-2 top-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                  {z}
                </span>
                <span className="absolute right-2 top-1.5 text-[9px] font-semibold tabular-nums text-foreground/80">
                  {data.fishCount > 0 ? `${data.fishCount}` : "—"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Per-zone species lists */}
        <ul className="flex flex-col gap-2">
          {zones.map((z) => {
            const data = report.zones[z];
            const active = data.fishCount > 0;
            return (
              <li
                key={z}
                className="flex items-start gap-3 rounded-xl border border-foreground/8 bg-background/30 px-3 py-2"
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold uppercase tracking-[0.14em]",
                    active
                      ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                      : "bg-foreground/8 text-muted-foreground",
                  )}
                  aria-hidden
                >
                  {z[0]}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {z}
                    {active && (
                      <span className="ml-2 normal-case tracking-normal text-foreground/80">
                        {data.fishCount} fish
                      </span>
                    )}
                  </span>
                  {active ? (
                    <span className="mt-0.5 text-xs leading-snug text-foreground/85">
                      {data.species
                        .map((s) => `${s.count} × ${s.commonName}`)
                        .join(" · ")}
                    </span>
                  ) : (
                    <span className="mt-0.5 text-xs italic text-muted-foreground/70">
                      Nothing stocked here
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
