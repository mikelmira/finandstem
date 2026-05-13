import Link from "next/link";
import { Wand2, Layers, GitCompareArrows, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionShell } from "@/components/sections/section-shell";
import { cn } from "@/lib/utils";

interface Tool {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
  ctaLabel: string;
}

const TOOLS: Tool[] = [
  {
    href: "/planner",
    eyebrow: "Tank Planner",
    title: "Build your tank, check the fit.",
    body: "Add the fish, plants, shrimp, and mosses you're considering. We surface the temperature, pH, hardness, light, and CO₂ the combined tank needs — and flag every predator-prey or parameter conflict before you commit.",
    icon: Wand2,
    ctaLabel: "Open the planner",
  },
  {
    href: "/compatibility",
    eyebrow: "Compatibility",
    title: "What else fits this tank?",
    body: "Pick any species as an anchor. We surface every fish, plant, shrimp, and moss in the catalogue whose water and tank-mate rules overlap.",
    icon: Layers,
    ctaLabel: "Pick an anchor",
  },
  {
    href: "/compare",
    eyebrow: "Compare",
    title: "Line up to four species, side by side.",
    body: "Direct parameter table. Temperature, pH, hardness, tank size, light, CO₂, and tank-mate safety in one row each. Spot the conflicts at a glance.",
    icon: GitCompareArrows,
    ctaLabel: "Start a comparison",
  },
];

export function ToolsBand() {
  return (
    <SectionShell>
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
          Tools
        </span>
        <h2 className="text-display-tight mt-3 text-balance text-3xl sm:text-4xl">
          The catalogue, plus the cross-references no-one else builds.
        </h2>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          The species data is the foundation. The tools are what make it
          a planning resource rather than a lookup table.
        </p>
      </div>

      <ul className="stagger grid grid-cols-1 gap-4 md:grid-cols-3">
        {TOOLS.map((t, i) => (
          <li key={t.href} style={{ ["--i" as string]: i }}>
            <Link
              href={t.href}
              className={cn(
                "glass glass-edge lift animate-fade-up group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-6 transition-colors duration-300 hover:border-[var(--brand)]/40 sm:p-7",
              )}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-[var(--brand)]/8 blur-3xl transition-opacity duration-500 group-hover:bg-[var(--brand)]/16"
              />

              <div className="relative flex items-center justify-between">
                <span
                  aria-hidden
                  className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)] transition-transform duration-300 group-hover:rotate-[8deg]"
                >
                  <t.icon className="size-5" strokeWidth={1.85} />
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {t.eyebrow}
                </span>
              </div>

              <h3 className="relative text-display-tight text-xl sm:text-2xl">
                {t.title}
              </h3>
              <p className="relative text-sm leading-relaxed text-foreground/85 sm:text-base">
                {t.body}
              </p>

              <span className="relative mt-auto inline-flex items-center gap-1 text-sm font-medium text-[var(--brand)]">
                {t.ctaLabel}
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
