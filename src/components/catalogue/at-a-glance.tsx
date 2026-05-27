import { cn } from "@/lib/utils";
import { parseRange } from "@/lib/range";
import { RangeBar } from "@/components/charts/range-bar";
import { SizeBar } from "@/components/charts/size-bar";
import {
  LightLevel,
  CO2Demand,
  GrowthRateBadge,
  FlowDemand,
} from "@/components/charts/demand-badges";
import type {
  CatalogueEntry,
  FishEntry,
  PlantEntry,
  ShrimpEntry,
  MossEntry,
} from "@/types/catalogue";

interface AtAGlanceProps {
  entry: CatalogueEntry;
  className?: string;
}

export function AtAGlance({ entry, className }: AtAGlanceProps) {
  return (
    <section
      className={cn(
        "stagger glass glass-edge grid grid-cols-1 gap-5 rounded-2xl p-6 sm:p-7 md:grid-cols-2",
        className,
      )}
      aria-label="Parameters at a glance"
    >
      <div className="animate-fade-up" style={{ ["--i" as string]: 0 }}>
        <RangeBar
          label="Temperature"
          unit="°C"
          scale={{ min: 15, max: 32 }}
          range={parseRange(getTempString(entry))}
          precision={0}
          ticks={[15, 20, 25, 30]}
        />
      </div>
      <div className="animate-fade-up" style={{ ["--i" as string]: 1 }}>
        <RangeBar
          label="pH"
          scale={{ min: 4, max: 8.5 }}
          range={parseRange(getPhString(entry))}
          precision={1}
          ticks={[4, 5, 6, 7, 8]}
          tone="blue"
        />
      </div>
      {hasDgh(entry) && (
        <div className="animate-fade-up" style={{ ["--i" as string]: 2 }}>
          <RangeBar
            label="Hardness"
            unit="dGH"
            scale={{ min: 0, max: 25 }}
            range={parseRange(getDghString(entry))}
            precision={0}
            ticks={[0, 5, 10, 15, 20, 25]}
          />
        </div>
      )}

      {/* Category-specific extras */}
      {entry.category === "fish" && (
        <FishExtras entry={entry as FishEntry} />
      )}
      {entry.category === "shrimp" && (
        <ShrimpExtras entry={entry as ShrimpEntry} />
      )}
      {entry.category === "plants" && (
        <PlantExtras entry={entry as PlantEntry} />
      )}
      {entry.category === "mosses" && (
        <MossExtras entry={entry as MossEntry} />
      )}
    </section>
  );
}

function FishExtras({ entry }: { entry: FishEntry }) {
  const adultRange = parseRange(entry.adultSize);
  const schoolingYes = /\byes\b/i.test(entry.schooling);
  const schoolingHelper = recommendedGroupNote(
    entry.schooling,
    entry.minGroupSize,
    schoolingYes,
  );
  return (
    <>
      {adultRange && (
        <div className="animate-fade-up" style={{ ["--i" as string]: 3 }}>
          <SizeBar
            label="Adult size"
            kind="fish"
            scaleMaxCm={15}
            range={adultRange}
          />
        </div>
      )}
      {/* Water column + Schooling sit inline as a pair just above the
          flow row. Both are categorical (not numeric ranges) so they
          render as labelled values rather than charts. */}
      <ParameterFact
        index={4}
        label="Water column"
        value={capWord(entry.waterColumn)}
      />
      <ParameterFact
        index={5}
        label="Schooling"
        value={schoolingYes ? "Yes" : "No"}
        helper={schoolingHelper}
      />
      {entry.flowRate && (
        <div
          className="animate-fade-up md:col-span-2"
          style={{ ["--i" as string]: 6 }}
        >
          <FlowDemand raw={entry.flowRate} />
        </div>
      )}
    </>
  );
}

function ShrimpExtras({ entry }: { entry: ShrimpEntry }) {
  const adultRange = parseRange(entry.adultSize);
  const tdsRange = parseRange(entry.tdsRange);
  return (
    <>
      {adultRange && (
        <div className="animate-fade-up" style={{ ["--i" as string]: 3 }}>
          <SizeBar
            label="Adult size"
            kind="shrimp"
            scaleMaxCm={10}
            range={adultRange}
          />
        </div>
      )}
      {tdsRange && (
        <div className="animate-fade-up md:col-span-2" style={{ ["--i" as string]: 4 }}>
          <RangeBar
            label="TDS"
            unit="ppm"
            scale={{ min: 50, max: 500 }}
            range={tdsRange}
            precision={0}
            ticks={[50, 150, 250, 350, 500]}
            tone="brand"
          />
        </div>
      )}
      {entry.flowRate && (
        <div
          className="animate-fade-up md:col-span-2"
          style={{ ["--i" as string]: 5 }}
        >
          <FlowDemand raw={entry.flowRate} />
        </div>
      )}
    </>
  );
}

function PlantExtras({ entry }: { entry: PlantEntry }) {
  const heightRange = parseRange(entry.maxHeight);
  return (
    <>
      {heightRange && (
        <div className="animate-fade-up" style={{ ["--i" as string]: 3 }}>
          <SizeBar
            label="Height"
            kind="plant"
            scaleMaxCm={80}
            range={heightRange}
          />
        </div>
      )}
      <div className="animate-fade-up" style={{ ["--i" as string]: 4 }}>
        <LightLevel raw={entry.light} />
      </div>
      <div className="animate-fade-up" style={{ ["--i" as string]: 5 }}>
        <CO2Demand raw={entry.co2} />
      </div>
      <div className="animate-fade-up" style={{ ["--i" as string]: 6 }}>
        <GrowthRateBadge raw={entry.growthRate} />
      </div>
      {entry.flowRate && (
        <div
          className="animate-fade-up md:col-span-2"
          style={{ ["--i" as string]: 7 }}
        >
          <FlowDemand raw={entry.flowRate} />
        </div>
      )}
    </>
  );
}

function MossExtras({ entry }: { entry: MossEntry }) {
  return (
    <>
      <div className="animate-fade-up" style={{ ["--i" as string]: 3 }}>
        <LightLevel raw={entry.light} />
      </div>
      <div className="animate-fade-up" style={{ ["--i" as string]: 4 }}>
        <CO2Demand raw={entry.co2} />
      </div>
      <div className="animate-fade-up" style={{ ["--i" as string]: 5 }}>
        <GrowthRateBadge raw={entry.growthRate} />
      </div>
      {entry.flowRate && (
        <div
          className="animate-fade-up md:col-span-2"
          style={{ ["--i" as string]: 6 }}
        >
          <FlowDemand raw={entry.flowRate} />
        </div>
      )}
    </>
  );
}

function getTempString(entry: CatalogueEntry): string | undefined {
  return "tempRange" in entry ? (entry.tempRange as string) : undefined;
}

function getPhString(entry: CatalogueEntry): string | undefined {
  return "phRange" in entry ? (entry.phRange as string) : undefined;
}

function getDghString(entry: CatalogueEntry): string | undefined {
  return "dghRange" in entry ? (entry.dghRange as string) : undefined;
}

function hasDgh(entry: CatalogueEntry): boolean {
  return Boolean(getDghString(entry));
}

function capWord(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Surface a stocking recommendation under the "Schooling" parameter
 * fact so the reader knows how many to add, regardless of whether
 * the species is technically a schooler. Examples:
 *   • Yes / Yes (loose shoal)        → "Group of 8+"
 *   • Pair                            → "Keep as a bonded pair"
 *   • Pair or trio                    → "Best as a pair or trio"
 *   • Harem (1 male, 2–3 females)     → "Harem · 1 male, 2–3 females"
 *   • Solitary or pair                → "Solo or a pair"
 *   • No (live in groups)             → "Small group of 4+"
 *   • No                              → "Can be kept solo"
 */
function recommendedGroupNote(
  raw: string,
  min: number,
  isSchooling: boolean,
): string | undefined {
  const r = raw.toLowerCase();
  if (isSchooling) return `Group of ${min}+`;
  if (/harem/.test(r)) {
    const m = raw.match(/\(([^)]+)\)/);
    return m ? `Harem · ${m[1]}` : "Keep as a harem";
  }
  if (/\bpair\b/.test(r)) {
    if (/trio/.test(r)) return "Best as a pair or trio";
    if (/solitary|solo/.test(r)) return "Solo or a pair";
    return "Keep as a bonded pair";
  }
  if (/group/.test(r) && min >= 3) return `Small group of ${min}+`;
  if (min >= 2) return `Keep ${min}+ together`;
  return "Can be kept solo";
}

/**
 * Small labelled-fact tile for categorical parameters that don't have
 * a numeric range to chart (water column, schooling). Matches the
 * visual weight of the RangeBar / SizeBar charts so the grid stays
 * coherent.
 */
function ParameterFact({
  label,
  value,
  helper,
  index,
}: {
  label: string;
  value: string;
  helper?: string;
  index: number;
}) {
  return (
    <div
      className="animate-fade-up flex flex-col gap-1"
      style={{ ["--i" as string]: index }}
    >
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <p className="text-sm font-semibold text-foreground sm:text-base">
        {value}
      </p>
      {helper && (
        <p className="text-[11px] leading-snug text-muted-foreground/80">
          {helper}
        </p>
      )}
    </div>
  );
}
