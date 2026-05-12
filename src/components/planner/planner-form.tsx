"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Style, Experience } from "@/lib/catalogue/tank-plan";

const STYLE_OPTIONS: ReadonlyArray<{
  value: Style;
  label: string;
  helper: string;
}> = [
  {
    value: "low-tech",
    label: "Low-tech",
    helper: "No CO₂. Hardy plants, easy maintenance.",
  },
  {
    value: "high-tech",
    label: "High-tech",
    helper: "CO₂ injection. Reds, carpets, fast growth.",
  },
  {
    value: "community",
    label: "Community",
    helper: "Mixed fish, plants, and shrimp.",
  },
  {
    value: "shrimp",
    label: "Shrimp colony",
    helper: "Shrimp-first stocking. Minimal predation risk.",
  },
  {
    value: "biotope-amazon",
    label: "Amazon biotope",
    helper: "Cardinal tetras, swords, blackwater feel.",
  },
  {
    value: "biotope-asian",
    label: "Southeast Asian biotope",
    helper: "Rasboras, harlequins, crypts.",
  },
];

const EXPERIENCE_OPTIONS: ReadonlyArray<{
  value: Experience;
  label: string;
  helper: string;
}> = [
  {
    value: "beginner",
    label: "Beginner",
    helper: "First or second planted tank.",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    helper: "Comfortable with cycling, dosing, and basic CO₂.",
  },
  {
    value: "advanced",
    label: "Advanced",
    helper: "RO water, EI dosing, sensitive species OK.",
  },
];

const TANK_PRESETS = [20, 40, 60, 100, 150, 200, 300];

interface PlannerFormProps {
  initial: {
    tankL: number;
    style: Style;
    experience: Experience;
  };
}

export function PlannerForm({ initial }: PlannerFormProps) {
  const router = useRouter();
  const search = useSearchParams();
  const [tankL, setTankL] = React.useState<number>(initial.tankL);
  const [style, setStyle] = React.useState<Style>(initial.style);
  const [experience, setExperience] = React.useState<Experience>(
    initial.experience,
  );

  function generate() {
    const sp = new URLSearchParams(search?.toString() ?? "");
    sp.set("tank", String(tankL));
    sp.set("style", style);
    sp.set("experience", experience);
    router.replace(`/planner?${sp.toString()}`, { scroll: false });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        generate();
      }}
      className="glass glass-edge flex flex-col gap-7 rounded-2xl p-6 sm:p-8"
    >
      {/* Tank size */}
      <div className="flex flex-col gap-3">
        <label
          htmlFor="tank-size"
          className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground"
        >
          <span>Tank size</span>
          <span className="text-foreground">{tankL} L</span>
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {TANK_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setTankL(n)}
              className={cn(
                "press inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                tankL === n
                  ? "border-[var(--brand)]/60 bg-[var(--brand)]/15 text-foreground"
                  : "border-border bg-background/60 text-muted-foreground hover:border-[var(--brand)]/40 hover:text-foreground",
              )}
            >
              {n} L
            </button>
          ))}
          <input
            id="tank-size"
            type="number"
            inputMode="numeric"
            min={10}
            max={1000}
            step={5}
            value={tankL}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) setTankL(n);
            }}
            className="w-24 rounded-full border border-border bg-background/70 px-3 py-1.5 text-sm placeholder:text-muted-foreground/60 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
          />
        </div>
      </div>

      {/* Style */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Style
        </span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {STYLE_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setStyle(o.value)}
              className={cn(
                "press flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all duration-200",
                style === o.value
                  ? "border-[var(--brand)]/60 bg-[var(--brand)]/10 text-foreground"
                  : "border-border bg-background/40 hover:border-[var(--brand)]/35",
              )}
              aria-pressed={style === o.value}
            >
              <span className="text-sm font-semibold">{o.label}</span>
              <span className="text-xs text-muted-foreground">
                {o.helper}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Your experience
        </span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {EXPERIENCE_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setExperience(o.value)}
              className={cn(
                "press flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all duration-200",
                experience === o.value
                  ? "border-[var(--brand)]/60 bg-[var(--brand)]/10 text-foreground"
                  : "border-border bg-background/40 hover:border-[var(--brand)]/35",
              )}
              aria-pressed={experience === o.value}
            >
              <span className="text-sm font-semibold">{o.label}</span>
              <span className="text-xs text-muted-foreground">
                {o.helper}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-5">
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="size-3.5" aria-hidden />
          Saved to the URL — share or bookmark
        </span>
        <button
          type="submit"
          className="press group inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-foreground)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_color-mix(in_oklab,var(--brand)_55%,transparent)]"
        >
          <Wand2
            className="size-4 transition-transform duration-300 group-hover:rotate-[12deg]"
            aria-hidden
          />
          Generate plan
        </button>
      </div>
    </form>
  );
}
