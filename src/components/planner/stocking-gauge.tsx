import { AlertTriangle, Fish } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STOCKING_BANDS,
  type StockingVerdict,
} from "@/lib/catalogue/tank-standards";
import type { StockingReport } from "@/lib/catalogue/tank-builder";

interface StockingGaugeProps {
  stocking: StockingReport;
  tankL?: number;
}

/**
 * Visual stocking gauge, a horizontal bar showing cumulative
 * adult-fish bioload (cm) against the tank's comfortable capacity.
 *
 * Bands (cm of fish per litre):
 *   0–0.5  understocked  (sky)
 *   0.5–1  comfortable   (brand green)
 *   1–1.5  full          (amber)
 *   1.5+   overstocked   (rose)
 *
 * Dimensional override: when at least one selected species' minTankL
 * exceeds the chosen tank, the gauge enters a "tooSmall" state that
 * suppresses the bioload bands. The bioload number is still shown
 * (informationally) but the verdict is "tank too small", the user
 * can't fix it by adding more or fewer fish, only by upsizing the
 * tank or removing the dimension-limited species.
 *
 * If tank size isn't set, the gauge falls back to a "raw bioload"
 * readout so the user still sees the cumulative fish length.
 */
export function StockingGauge({ stocking, tankL }: StockingGaugeProps) {
  if (tankL === undefined) {
    return (
      <article className="glass glass-edge flex flex-col gap-3 rounded-2xl p-5 sm:p-6">
        <header className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]"
          >
            <Fish className="size-4" strokeWidth={1.85} />
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Stocking
          </span>
        </header>
        <p className="text-sm text-muted-foreground">
          {stocking.bioloadCm > 0
            ? `~${stocking.bioloadCm} cm of adult fish so far. Pick a tank size to see whether this load fits.`
            : "Add a fish or shrimp to start tracking the bioload."}
        </p>
      </article>
    );
  }

  if (stocking.verdict === null) {
    return null;
  }

  // Dimensional override — show the tank-too-small panel and skip
  // the bioload gauge entirely.
  if (stocking.verdict === "tooSmall") {
    return <TankTooSmallPanel stocking={stocking} tankL={tankL} />;
  }

  const verdict = stocking.verdict;
  const tone = TONES[verdict];
  const loadPerL = stocking.loadPerLitre ?? 0;

  // Bar scale runs from 0 to 2 cm/L (clip beyond that). Band stops at
  // 0.5 / 1.0 / 1.5.
  const SCALE_MAX = 2;
  const pct = Math.min(100, (loadPerL / SCALE_MAX) * 100);

  return (
    <article className="glass glass-edge flex flex-col gap-4 rounded-2xl p-5 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]"
          >
            <Fish className="size-4" strokeWidth={1.85} />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Stocking
            </span>
            <span className="text-[11px] text-muted-foreground/70">
              {stocking.bioloadCm} cm of fish · {tankL} L tank · {loadPerL} cm/L
            </span>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]",
            tone.chip,
          )}
        >
          {STOCKING_BANDS[verdict].label}
        </span>
      </header>

      {/* Gauge */}
      <div className="flex flex-col gap-2">
        <div
          role="img"
          aria-label={`${stocking.bioloadCm} centimetres of fish in a ${tankL} litre tank, ${STOCKING_BANDS[verdict].label.toLowerCase()}`}
          className="relative h-3 w-full overflow-hidden rounded-full bg-foreground/8"
        >
          {/* Band backgrounds, subtle tints so the user sees where
              they sit in the scale even before the fill paints */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 bg-sky-500/18"
            style={{ width: "25%" }}
          />
          <span
            aria-hidden
            className="absolute inset-y-0 bg-[var(--brand)]/15"
            style={{ left: "25%", width: "25%" }}
          />
          <span
            aria-hidden
            className="absolute inset-y-0 bg-amber-500/18"
            style={{ left: "50%", width: "25%" }}
          />
          <span
            aria-hidden
            className="absolute inset-y-0 right-0 bg-rose-500/18"
            style={{ width: "25%" }}
          />
          {/* Tick dividers */}
          {[25, 50, 75].map((t) => (
            <span
              key={t}
              aria-hidden
              className="absolute inset-y-0 w-px bg-foreground/15"
              style={{ left: `${t}%` }}
            />
          ))}
          {/* Active fill */}
          <span
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
              tone.fill,
            )}
            style={{ width: `${pct}%` }}
            aria-hidden
          />
          {/* Marker, the precise current value */}
          <span
            className={cn(
              "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card",
              tone.marker,
            )}
            style={{ left: `${pct}%` }}
            aria-hidden
          />
        </div>
        <div className="flex justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
          <span>0 cm/L</span>
          <span>0.5</span>
          <span>1.0</span>
          <span>1.5</span>
          <span>2.0+</span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-foreground/85">
        {STOCKING_BANDS[verdict].blurb}{" "}
        {verdict !== "overstocked" && stocking.headroomCm !== null && (
          <span className="text-muted-foreground">
            Room for about {stocking.headroomCm} cm more of fish before this
            tank is full.
          </span>
        )}
      </p>

      <Breakdown stocking={stocking} />
    </article>
  );
}

/**
 * Renders the "tank too small" state, the gauge is dimmed and a
 * clear "upsize or remove these species" message takes its place.
 */
function TankTooSmallPanel({
  stocking,
  tankL,
}: {
  stocking: StockingReport;
  tankL: number;
}) {
  const offenders = stocking.oversizedSpecies;
  const required = stocking.requiredTankL;
  return (
    <article className="glass glass-edge flex flex-col gap-4 rounded-2xl border-rose-500/45 p-5 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex size-8 items-center justify-center rounded-full bg-rose-500/18 text-rose-700"
          >
            <AlertTriangle className="size-4" strokeWidth={1.85} />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Stocking
            </span>
            <span className="text-[11px] text-muted-foreground/70">
              {stocking.bioloadCm} cm of fish · {tankL} L tank ·{" "}
              {stocking.loadPerLitre ?? 0} cm/L
            </span>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full border border-rose-500/55 bg-rose-500/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-rose-800">
          Tank too small
        </span>
      </header>

      <p className="text-sm leading-relaxed text-foreground/85">
        The bioload would be fine, but at least one species can’t physically
        live in a {tankL} L tank. Aquarium minimums aren’t about waste, they
        cover horizontal swimming room, schooling behaviour, and territory.
      </p>

      <ul className="flex flex-col gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 text-sm">
        {offenders.map((o) => (
          <li
            key={o.commonName}
            className="flex items-baseline justify-between gap-3"
          >
            <span className="font-medium text-foreground/90">
              {o.commonName}
            </span>
            <span className="tabular-nums text-rose-700">
              needs ≥ {o.minTankL} L
            </span>
          </li>
        ))}
      </ul>

      {required !== null && (
        <p className="text-sm text-muted-foreground">
          Upsize to <strong className="text-foreground">{required} L</strong>{" "}
          or larger, or remove the species above.
        </p>
      )}

      <Breakdown stocking={stocking} />
    </article>
  );
}

function Breakdown({ stocking }: { stocking: StockingReport }) {
  if (stocking.breakdown.length === 0) return null;
  return (
    <details className="group/breakdown -mx-1">
      <summary className="press flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
        <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden />
        Stocking assumptions
        <span className="ml-auto text-[10px] text-muted-foreground/70 group-open/breakdown:hidden">
          Show
        </span>
        <span className="ml-auto hidden text-[10px] text-muted-foreground/70 group-open/breakdown:inline">
          Hide
        </span>
      </summary>
      <ul className="mt-2 flex flex-col gap-1.5 px-2 text-xs">
        {stocking.breakdown.map((b) => (
          <li
            key={`${b.category}-${b.commonName}`}
            className="flex items-baseline justify-between gap-3 text-foreground/85"
          >
            <span>
              <span className="font-semibold tabular-nums">{b.count} ×</span>{" "}
              {b.commonName}
              <span className="ml-1.5 text-muted-foreground">
                · {b.adultSizeCm} cm adult
              </span>
              {b.category === "shrimp" && (
                <span className="ml-1.5 text-muted-foreground/70">
                  (× 0.2 shrimp factor)
                </span>
              )}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {b.contributionCm} cm
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 px-2 text-[10px] leading-snug text-muted-foreground/70">
        Counts default to each species’ minimum responsible group
        (schoolers stocked at their school minimum, shrimp at their
        colony minimum). Adjust by adding or removing species.
      </p>
    </details>
  );
}

const TONES: Record<
  Exclude<StockingVerdict, "tooSmall">,
  { fill: string; marker: string; chip: string }
> = {
  understocked: {
    fill: "bg-sky-500/70",
    marker: "bg-sky-500",
    chip: "border-sky-500/45 bg-sky-500/15 text-sky-800",
  },
  comfortable: {
    fill: "bg-[var(--brand)]/80",
    marker: "bg-[var(--brand)]",
    chip: "border-[var(--brand)]/45 bg-[var(--brand)]/15 text-[var(--brand)]",
  },
  full: {
    fill: "bg-amber-500/75",
    marker: "bg-amber-500",
    chip: "border-amber-500/45 bg-amber-500/15 text-amber-800",
  },
  overstocked: {
    fill: "bg-rose-500/80",
    marker: "bg-rose-500",
    chip: "border-rose-500/50 bg-rose-500/15 text-rose-800",
  },
};
