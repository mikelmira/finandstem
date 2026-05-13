import { Droplets, Fish, Thermometer, Users, Sun, Sprout } from "lucide-react";
import type {
  CatalogueEntry,
  FishEntry,
  PlantEntry,
  ShrimpEntry,
  MossEntry,
} from "@/types/catalogue";

interface KeyFact {
  icon: typeof Thermometer;
  label: string;
  value: string;
}

interface HeroKeyFactsProps {
  entry: CatalogueEntry;
}

/**
 * Three at-a-glance pills shown in the hero so a reader can triage
 * "does this even fit my tank?" without scrolling. The three picks
 * are the parameters most likely to disqualify a species:
 *
 *   • fish    → temp · pH · min tank
 *   • plants  → light · CO₂ · position
 *   • shrimp  → temp · pH · colony min
 *   • mosses  → temp · light · attachment
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
          className="glass glass-edge flex items-center gap-2 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2"
        >
          <f.icon
            className="size-3.5 shrink-0 text-[var(--brand)] sm:size-4"
            strokeWidth={1.75}
            aria-hidden
          />
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

function pickFacts(entry: CatalogueEntry): KeyFact[] {
  if (entry.category === "fish") return fishKeyFacts(entry as FishEntry);
  if (entry.category === "plants") return plantKeyFacts(entry as PlantEntry);
  if (entry.category === "shrimp") return shrimpKeyFacts(entry as ShrimpEntry);
  return mossKeyFacts(entry as MossEntry);
}

function fishKeyFacts(f: FishEntry): KeyFact[] {
  return [
    { icon: Thermometer, label: "Temp", value: `${f.tempRange} °C` },
    { icon: Droplets, label: "pH", value: f.phRange },
    {
      icon: Fish,
      label: "Min tank",
      value: f.minTankSize,
    },
  ];
}

function plantKeyFacts(p: PlantEntry): KeyFact[] {
  return [
    { icon: Sun, label: "Light", value: p.light },
    { icon: Sprout, label: "CO₂", value: p.co2 },
    { icon: Thermometer, label: "Temp", value: `${p.tempRange} °C` },
  ];
}

function shrimpKeyFacts(s: ShrimpEntry): KeyFact[] {
  return [
    { icon: Thermometer, label: "Temp", value: `${s.tempRange} °C` },
    { icon: Droplets, label: "pH", value: s.phRange },
    {
      icon: Users,
      label: "Colony",
      value: `${s.colonyMin}+`,
    },
  ];
}

function mossKeyFacts(m: MossEntry): KeyFact[] {
  return [
    { icon: Thermometer, label: "Temp", value: `${m.tempRange} °C` },
    { icon: Sun, label: "Light", value: m.light },
    { icon: Sprout, label: "CO₂", value: m.co2 },
  ];
}
