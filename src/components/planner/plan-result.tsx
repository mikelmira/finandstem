import Link from "next/link";
import Image from "next/image";
import {
  Fish,
  Leaf,
  Sprout,
  Shell,
  ImageOff,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";
import { getImage } from "@/data";
import { styleLabel, type TankPlan, type PlanSuggestion } from "@/lib/catalogue/tank-plan";

interface PlanResultProps {
  plan: TankPlan;
}

interface RoleSection {
  key: string;
  title: string;
  icon: LucideIcon;
  tone: "fish" | "plants" | "shrimp" | "moss";
  picks: Array<PlanSuggestion<{ raw: CatalogueEntry }> | undefined>;
}

const TONE_CHIP: Record<RoleSection["tone"], string> = {
  fish: "border-sky-400/45 bg-sky-400/12 text-sky-200",
  plants: "border-[var(--brand)]/45 bg-[var(--brand)]/12 text-foreground",
  shrimp: "border-rose-400/35 bg-rose-400/10 text-rose-200",
  moss: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
};

export function PlanResult({ plan }: PlanResultProps) {
  const sections: RoleSection[] = [
    {
      key: "fish",
      title: "Fish",
      icon: Fish,
      tone: "fish",
      picks: [
        plan.fish.schooler && tagPick(plan.fish.schooler, "Schooler"),
        plan.fish.centrepiece && tagPick(plan.fish.centrepiece, "Centrepiece"),
        plan.fish.bottom && tagPick(plan.fish.bottom, "Bottom dweller"),
        plan.fish.algaeCrew && tagPick(plan.fish.algaeCrew, "Algae crew"),
      ],
    },
    {
      key: "plants",
      title: "Plants",
      icon: Leaf,
      tone: "plants",
      picks: [
        plan.plants.foreground && tagPick(plan.plants.foreground, "Foreground"),
        plan.plants.midground && tagPick(plan.plants.midground, "Midground"),
        plan.plants.background && tagPick(plan.plants.background, "Background"),
        plan.plants.floating && tagPick(plan.plants.floating, "Floating"),
      ],
    },
    {
      key: "shrimp-moss",
      title: "Shrimp & moss",
      icon: Shell,
      tone: "shrimp",
      picks: [
        plan.shrimp && tagPick(plan.shrimp, "Shrimp colony"),
        plan.moss && tagPick(plan.moss, "Moss"),
      ],
    },
  ];

  // Total species count for the hero number
  const totalPicks = sections.reduce(
    (n, s) => n + s.picks.filter(Boolean).length,
    0,
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Hero summary */}
      <header className="glass glass-edge animate-fade-up flex flex-col gap-4 rounded-2xl p-6 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            A {styleLabel(plan.request.style).toLowerCase()} plan for {plan.request.tankL} L
          </h2>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            {totalPicks} suggestions
          </span>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">
          These picks fit the tank size, parameter overlap, and difficulty
          level you chose. Each is a documented choice from the catalogue —
          tap any species to see its full profile.
        </p>
        {plan.warnings.length > 0 && (
          <ul className="flex flex-col gap-2">
            {plan.warnings.map((w) => (
              <li
                key={w}
                className="flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/8 px-3 py-2 text-xs text-foreground/90"
              >
                <AlertTriangle
                  className="mt-0.5 size-3.5 shrink-0 text-amber-300"
                  aria-hidden
                />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        )}
      </header>

      {/* Role sections */}
      {sections
        .filter((s) => s.picks.some(Boolean))
        .map((section) => (
          <section
            key={section.key}
            className="flex flex-col gap-5"
            aria-labelledby={`plan-${section.key}`}
          >
            <header className="flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-full",
                  section.tone === "plants"
                    ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                    : "bg-foreground/5 text-foreground/85",
                )}
              >
                <section.icon className="size-4" strokeWidth={1.85} />
              </span>
              <h3
                id={`plan-${section.key}`}
                className="text-display-tight text-xl sm:text-2xl"
              >
                {section.title}
              </h3>
            </header>
            <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2">
              {section.picks
                .filter((p): p is TaggedPick => p !== undefined)
                .map((pick, i) => (
                  <PickCard
                    key={pick.tag}
                    pick={pick}
                    toneClass={TONE_CHIP[section.tone]}
                    index={i}
                  />
                ))}
            </div>
          </section>
        ))}
    </div>
  );
}

type TaggedPick = PlanSuggestion<{ raw: CatalogueEntry }> & { tag: string };

function tagPick(
  pick: PlanSuggestion<{ raw: CatalogueEntry }>,
  tag: string,
): TaggedPick {
  return { ...pick, tag };
}

function PickCard({
  pick,
  toneClass,
  index,
}: {
  pick: TaggedPick;
  toneClass: string;
  index: number;
}) {
  const entry = pick.entry.raw;
  const meta = CATEGORY_META[entry.category];
  const img = getImage(entry.slug);
  return (
    <Link
      href={`${meta.path}/${entry.slug}`}
      style={{ ["--i" as string]: index }}
      className="glass glass-edge lift animate-fade-up group flex gap-4 overflow-hidden rounded-2xl p-3 transition-colors duration-300 hover:border-[var(--brand)]/40"
    >
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
        {img ? (
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="100px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff
              className="size-6 text-muted-foreground/40"
              aria-hidden
            />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
              toneClass,
            )}
          >
            {pick.tag}
          </span>
          {pick.qty && (
            <span className="text-[11px] text-muted-foreground">
              {pick.qty}
            </span>
          )}
          <Sprout className="ml-auto hidden size-3.5 text-muted-foreground/40 group-hover:text-[var(--brand)] sm:inline" aria-hidden />
          <ArrowUpRight
            className="size-3.5 text-muted-foreground/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
            aria-hidden
          />
        </div>
        <h4 className="text-sm font-semibold leading-tight transition-colors duration-300 group-hover:text-[var(--brand)]">
          {entry.commonName}
        </h4>
        <p className="truncate text-xs italic text-muted-foreground">
          {entry.scientificName}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {pick.reasons.slice(0, 3).map((r) => (
            <span
              key={r}
              className="inline-flex items-center rounded-full border border-border/65 bg-background/55 px-2 py-0.5 text-[10px] text-foreground/85"
            >
              {r}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
