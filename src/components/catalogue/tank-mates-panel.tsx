import Link from "next/link";
import { Check, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DetailSection } from "@/data/species-detail";
import type { CatalogueEntry } from "@/types/catalogue";

interface TankMatesPanelProps {
  entry: CatalogueEntry;
  good?: DetailSection;
  bad?: DetailSection;
  /** Compatibility-tool deep link, e.g. ?anchor=fish:neon-tetra */
  compatHref: string;
  className?: string;
}

interface SafetyRow {
  label: string;
  raw: string;
  tone: "good" | "warn" | "danger";
}

function safetyTone(value: string): SafetyRow["tone"] {
  const v = value.toLowerCase();
  if (v.startsWith("no") || v.includes("risky") || v.includes("not safe"))
    return "danger";
  if (v.includes("mostly") || v.includes("adult") || v.includes("caution"))
    return "warn";
  return "good";
}

function getSafetyRows(entry: CatalogueEntry): SafetyRow[] {
  const rows: SafetyRow[] = [];
  if ("plantSafe" in entry && entry.plantSafe) {
    rows.push({
      label: "Plant-safe",
      raw: entry.plantSafe,
      tone: safetyTone(entry.plantSafe),
    });
  }
  if ("shrimpSafe" in entry && entry.shrimpSafe) {
    rows.push({
      label: "Shrimp-safe",
      raw: entry.shrimpSafe,
      tone: safetyTone(entry.shrimpSafe),
    });
  }
  if ("fishTankSafeWith" in entry && entry.fishTankSafeWith) {
    rows.push({
      label: "Tank-mate safe with",
      raw: entry.fishTankSafeWith,
      tone: safetyTone(entry.fishTankSafeWith),
    });
  }
  return rows;
}

const TONE_CLASS: Record<SafetyRow["tone"], string> = {
  good: "border-[color-mix(in_oklab,var(--brand)_45%,transparent)] bg-[color-mix(in_oklab,var(--brand)_14%,transparent)]",
  warn: "border-amber-500/45 bg-amber-500/15",
  danger: "border-rose-500/50 bg-rose-500/15",
};

const TONE_DOT: Record<SafetyRow["tone"], string> = {
  good: "bg-[var(--brand)]",
  warn: "bg-amber-400",
  danger: "bg-rose-400",
};

export function TankMatesPanel({
  entry,
  good,
  bad,
  compatHref,
  className,
}: TankMatesPanelProps) {
  const safety = getSafetyRows(entry);
  const hasContent = safety.length > 0 || good || bad;
  if (!hasContent) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Safety chip row */}
      {safety.length > 0 && (
        <div className="stagger flex flex-wrap gap-2">
          {safety.map((s, i) => (
            <span
              key={s.label}
              style={{ ["--i" as string]: i }}
              className={cn(
                "animate-fade-up inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
                TONE_CLASS[s.tone],
              )}
            >
              <span
                className={cn("size-1.5 rounded-full", TONE_DOT[s.tone])}
                aria-hidden
              />
              <span className="font-medium uppercase tracking-[0.14em] text-foreground/85">
                {s.label}
              </span>
              <span className="text-foreground/85">·</span>
              <span className="text-foreground">{s.raw}</span>
            </span>
          ))}
        </div>
      )}

      {/* Good / bad tank mates side-by-side */}
      {(good || bad) && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {good && (
            <article className="glass glass-edge animate-fade-up rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-[var(--brand)]/18 text-[var(--brand)]">
                  <Check className="size-4" aria-hidden strokeWidth={2.5} />
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                  Good tank mates
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                {good.body}
              </p>
            </article>
          )}
          {bad && (
            <article
              className="glass glass-edge animate-fade-up rounded-2xl p-5 sm:p-6"
              style={{ ["--i" as string]: 1 }}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-rose-500/18 text-rose-700">
                  <X className="size-4" aria-hidden strokeWidth={2.5} />
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                  Avoid
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                {bad.body}
              </p>
            </article>
          )}
        </div>
      )}

      {/* Cross-reference shortcut */}
      <Link
        href={compatHref}
        className="press group inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)]/45 hover:text-foreground"
      >
        See full compatibility cross-reference
        <ArrowUpRight
          className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </div>
  );
}
