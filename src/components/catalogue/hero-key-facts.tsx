import * as React from "react";
import { Droplets, Thermometer, Users, Sun, Sprout, Leaf, Shell } from "lucide-react";
import { FishMark, PlantMark } from "@/components/icons/species-icons";
import { cn } from "@/lib/utils";
import type {
  CatalogueEntry,
  FishEntry,
  PlantEntry,
  ShrimpEntry,
  MossEntry,
} from "@/types/catalogue";

/** Accepts both Lucide icons and our custom species marks. */
type IconLike = React.ComponentType<{
  className?: string;
  strokeWidth?: number | string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

type SafetyTone = "good" | "warn" | "danger";

interface KeyFact {
  icon: IconLike;
  label: string;
  value: string;
  /** Safety pills get a tinted background + dot. Plain pills get the
   *  neutral glass-pill treatment. */
  tone?: SafetyTone;
}

interface HeroKeyFactsProps {
  entry: CatalogueEntry;
}

/**
 * At-a-glance pills shown in the hero so a reader can triage
 * "does this even fit my tank?" without scrolling. The picks are
 * the parameters most likely to disqualify a species — temperature,
 * pH / minimum tank size — plus the cross-tank safety flags
 * (plant-safe / shrimp-safe) that used to live further down the page.
 *
 *   • fish    → temp · pH · min tank · plant-safe · shrimp-safe
 *   • plants  → light · CO₂ · temp
 *   • shrimp  → temp · pH · colony · plant-safe · tank-mate safe
 *   • mosses  → temp · light · CO₂
 */
export function HeroKeyFacts({ entry }: HeroKeyFactsProps) {
  const facts = pickFacts(entry);
  if (facts.length === 0) return null;

  return (
    <ul
      className="mt-6 flex flex-wrap gap-2"
      aria-label="Key parameters at a glance"
    >
      {facts.map((f) => (
        <li
          key={f.label}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3.5 py-1.5 sm:px-4 sm:py-2",
            f.tone ? TONE_CLASS[f.tone] : "glass glass-edge border-transparent",
          )}
        >
          {f.tone ? (
            <span
              className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT[f.tone])}
              aria-hidden
            />
          ) : (
            <f.icon
              className="size-3.5 shrink-0 text-[var(--brand)] sm:size-4"
              strokeWidth={1.75}
              aria-hidden
            />
          )}
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:text-[11px]">
            {f.label}
          </span>
          <span className="text-xs font-semibold text-foreground sm:text-sm">
            {f.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

const TONE_CLASS: Record<SafetyTone, string> = {
  good: "border-[color-mix(in_oklab,var(--brand)_45%,transparent)] bg-[color-mix(in_oklab,var(--brand)_14%,transparent)]",
  warn: "border-amber-500/50 bg-amber-500/15",
  danger: "border-rose-500/55 bg-rose-500/15",
};

const TONE_DOT: Record<SafetyTone, string> = {
  good: "bg-[var(--brand)]",
  warn: "bg-amber-500",
  danger: "bg-rose-500",
};

/**
 * Map free-text safety values onto a tone:
 *   • "Yes" / unspecified → good
 *   • "Mostly" / "Adults only" / "Caution" → warn
 *   • "No" / "Risky" / "Not safe" → danger
 */
function safetyTone(value: string): SafetyTone {
  const v = value.toLowerCase();
  if (v.startsWith("no") || v.includes("risky") || v.includes("not safe"))
    return "danger";
  if (v.includes("mostly") || v.includes("adult") || v.includes("caution"))
    return "warn";
  return "good";
}

function pickFacts(entry: CatalogueEntry): KeyFact[] {
  if (entry.category === "fish") return fishKeyFacts(entry as FishEntry);
  if (entry.category === "plants") return plantKeyFacts(entry as PlantEntry);
  if (entry.category === "shrimp") return shrimpKeyFacts(entry as ShrimpEntry);
  return mossKeyFacts(entry as MossEntry);
}

function fishKeyFacts(f: FishEntry): KeyFact[] {
  const facts: KeyFact[] = [
    { icon: Thermometer, label: "Temp", value: `${f.tempRange} °C` },
    { icon: Droplets, label: "pH", value: f.phRange },
    { icon: FishMark, label: "Min tank", value: f.minTankSize },
  ];
  if (f.plantSafe) {
    facts.push({
      icon: Leaf,
      label: "Plant-safe",
      value: f.plantSafe,
      tone: safetyTone(f.plantSafe),
    });
  }
  if (f.shrimpSafe) {
    facts.push({
      icon: Shell,
      label: "Shrimp-safe",
      value: f.shrimpSafe,
      tone: safetyTone(f.shrimpSafe),
    });
  }
  return facts;
}

function plantKeyFacts(p: PlantEntry): KeyFact[] {
  return [
    { icon: Sun, label: "Light", value: p.light },
    { icon: PlantMark, label: "CO₂", value: p.co2 },
    { icon: Thermometer, label: "Temp", value: `${p.tempRange} °C` },
  ];
}

function shrimpKeyFacts(s: ShrimpEntry): KeyFact[] {
  const facts: KeyFact[] = [
    { icon: Thermometer, label: "Temp", value: `${s.tempRange} °C` },
    { icon: Droplets, label: "pH", value: s.phRange },
    { icon: Users, label: "Colony", value: `${s.colonyMin}+` },
  ];
  if (s.plantSafe) {
    facts.push({
      icon: Leaf,
      label: "Plant-safe",
      value: s.plantSafe,
      tone: safetyTone(s.plantSafe),
    });
  }
  if (s.fishTankSafeWith) {
    facts.push({
      icon: FishMark,
      label: "Tank-mate safe",
      value: s.fishTankSafeWith,
      tone: safetyTone(s.fishTankSafeWith),
    });
  }
  return facts;
}

function mossKeyFacts(m: MossEntry): KeyFact[] {
  return [
    { icon: Thermometer, label: "Temp", value: `${m.tempRange} °C` },
    { icon: Sun, label: "Light", value: m.light },
    { icon: Sprout, label: "CO₂", value: m.co2 },
  ];
}
