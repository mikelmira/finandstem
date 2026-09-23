import Link from "next/link";
import { ArrowRight, Flame, Lightbulb, Wind, Box, CloudFog } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  gearHref,
  recommendedFlow,
  recommendedHeaterW,
  typicalLengthForLitres,
} from "@/lib/gear/match";
import { classifyFlow, lightTo5, co2To3, LIGHT_SCALE_LABELS } from "@/lib/catalogue/tank-standards";

interface GearForTankProps {
  tankL?: number;
  filterLph?: number;
  light?: "Low" | "Medium" | "High" | null;
  co2?: "None" | "Optional" | "Recommended" | "Required" | null;
}

/**
 * Planner panel that turns the tank size (and what the chosen plants
 * need) into direct links to matching products in the gear catalogue.
 */
export function GearForTank({ tankL, filterLph, light, co2 }: GearForTankProps) {
  if (!tankL) return null;
  const flow = recommendedFlow(tankL);
  const heat = recommendedHeaterW(tankL);
  const len = typicalLengthForLitres(tankL);
  const verdict = filterLph ? classifyFlow(tankL, filterLph) : null;
  const lightLevel = lightTo5(light ?? null);
  const co2Level = co2To3(co2 ?? null);

  const rows: { icon: LucideIcon; title: string; note: string; href: string; flag?: string }[] = [
    {
      icon: Wind,
      title: "Filters",
      note: `Rated ${flow.min}–${flow.max} L/h for ${tankL} L`,
      href: gearHref("filters", { tankL }),
      flag:
        verdict && (verdict.kind === "starve" || verdict.kind === "low")
          ? "Your filter looks weak"
          : verdict && verdict.kind === "blast"
            ? "Your filter looks strong"
            : undefined,
    },
    {
      icon: Lightbulb,
      title: "Lights",
      note: lightLevel
        ? `${LIGHT_SCALE_LABELS[lightLevel]} light for a ~${len} cm tank`
        : `Made for a ~${len} cm tank`,
      href: gearHref("lights", { lengthCm: len }),
    },
    {
      icon: Flame,
      title: "Heaters",
      note: `About ${heat.min}–${heat.max} W`,
      href: gearHref("heaters", { tankL }),
    },
  ];
  if (co2Level && co2Level >= 2) {
    rows.push({
      icon: CloudFog,
      title: "CO2",
      note: co2Level === 3 ? "Your plants need injected CO2" : "CO2 would help these plants",
      href: gearHref("co2", { tankL }),
    });
  }
  rows.push({
    icon: Box,
    title: "Tanks",
    note: `Around ${tankL} L`,
    href: gearHref("aquariums", { tankL }),
  });

  return (
    <div className="glass glass-edge rounded-2xl p-5 sm:p-6">
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
        Gear that fits {tankL} L
      </h2>
      <ul className="mt-3 flex flex-col gap-2">
        {rows.map((r) => (
          <li key={r.title}>
            <Link
              href={r.href}
              className="press group flex items-center gap-3 rounded-xl border border-border bg-background/60 px-3 py-2.5 transition-colors hover:border-[var(--brand)]/40"
            >
              <r.icon className="size-4 flex-none text-[var(--brand)]" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-medium">
                  {r.title}
                  {r.flag && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                      {r.flag}
                    </span>
                  )}
                </span>
                <span className="block text-[11px] text-muted-foreground">{r.note}</span>
              </span>
              <ArrowRight className="size-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
