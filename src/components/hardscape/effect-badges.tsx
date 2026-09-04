import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { ChemEffect, HardscapeType } from "@/data/hardscape";
import { cn } from "@/lib/utils";

const EFFECT_STYLE: Record<ChemEffect, string> = {
  raises: "bg-amber-500/12 text-amber-700 dark:text-amber-400",
  lowers: "bg-sky-500/12 text-sky-700 dark:text-sky-400",
  neutral: "bg-muted text-muted-foreground",
};

const EFFECT_LABEL: Record<ChemEffect, string> = {
  raises: "raises",
  lowers: "lowers",
  neutral: "no change",
};

function EffectIcon({ effect }: { effect: ChemEffect }) {
  const cls = "size-3";
  if (effect === "raises") return <ArrowUp className={cls} aria-hidden />;
  if (effect === "lowers") return <ArrowDown className={cls} aria-hidden />;
  return <Minus className={cls} aria-hidden />;
}

function Pill({
  effect,
  label,
}: {
  effect: ChemEffect;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        EFFECT_STYLE[effect],
      )}
      title={`${label} ${EFFECT_LABEL[effect]}`}
    >
      <EffectIcon effect={effect} />
      {label}
    </span>
  );
}

/** Compact chemistry summary for a hardscape item: pH, hardness, and (for
 *  wood) tannins and buoyancy. */
export function EffectBadges({ item }: { item: HardscapeType }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Pill effect={item.phEffect} label="pH" />
      <Pill effect={item.hardnessEffect} label="Hardness" />
      {item.category === "wood" && item.tannins !== "none" && (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {item.tannins} tannins
        </span>
      )}
      {item.category === "wood" && item.buoyancy && (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {item.buoyancy === "sinks"
            ? "sinks"
            : item.buoyancy === "floats"
              ? "floats"
              : "soak first"}
        </span>
      )}
    </div>
  );
}
