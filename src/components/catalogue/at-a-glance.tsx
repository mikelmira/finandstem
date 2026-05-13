import { cn } from "@/lib/utils";
import { parseRange, parseLeadingNumber } from "@/lib/range";
import { RangeBar } from "@/components/charts/range-bar";
import { SizeBar } from "@/components/charts/size-bar";
import { TankSizeBadge } from "@/components/charts/tank-size-badge";
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
  const tankL = parseLeadingNumber(entry.minTankSize);
  const adultRange = parseRange(entry.adultSize);
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
      {tankL !== null && (
        <div
          className="animate-fade-up flex items-center"
          style={{ ["--i" as string]: 4 }}
        >
          <TankSizeBadge litres={tankL} />
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

function ShrimpExtras({ entry }: { entry: ShrimpEntry }) {
  const tankL = parseLeadingNumber(entry.minTankSize);
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
      {tankL !== null && (
        <div
          className="animate-fade-up flex items-center"
          style={{ ["--i" as string]: 4 }}
        >
          <TankSizeBadge litres={tankL} note="Minimum tank size" />
        </div>
      )}
      {tdsRange && (
        <div className="animate-fade-up md:col-span-2" style={{ ["--i" as string]: 5 }}>
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
          style={{ ["--i" as string]: 6 }}
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
