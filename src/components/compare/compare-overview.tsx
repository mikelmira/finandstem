import {
  Thermometer,
  Droplet,
  FlaskConical,
  AlertTriangle,
  ShieldCheck,
  CircleAlert,
  Info,
  Sparkles,
  Box,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CatalogueEntry } from "@/types/catalogue";
import {
  buildTank,
  temperatureContributions,
  phContributions,
  dghContributions,
  type TankBuilderResult,
  type TankWarning,
} from "@/lib/catalogue/tank-builder";
import { MultiRangeBar } from "@/components/charts/multi-range-bar";
import { cn } from "@/lib/utils";

interface CompareOverviewProps {
  entries: CatalogueEntry[];
}

interface ScoreBand {
  letter: string;
  label: string;
  summary: string;
  tone: "emerald" | "brand" | "amber" | "orange" | "rose";
  ring: string;
  text: string;
  chip: string;
}

const BANDS: ScoreBand[] = [
  {
    letter: "A",
    label: "Excellent fit",
    summary: "Every key parameter overlaps and no major conflicts surfaced.",
    tone: "emerald",
    ring: "ring-emerald-300/50",
    text: "text-emerald-800",
    chip: "border-emerald-600/45 bg-emerald-500/15 text-emerald-800",
  },
  {
    letter: "B",
    label: "Good fit",
    summary: "Workable as-is, only minor advisories to plan around.",
    tone: "brand",
    ring: "ring-[var(--brand)]/55",
    text: "text-foreground",
    chip: "border-[var(--brand)]/45 bg-[var(--brand)]/15 text-foreground",
  },
  {
    letter: "C",
    label: "Workable with care",
    summary: "A few warnings, pick equipment and stocking carefully.",
    tone: "amber",
    ring: "ring-amber-400/55",
    text: "text-amber-800",
    chip: "border-amber-500/45 bg-amber-500/15 text-amber-800",
  },
  {
    letter: "D",
    label: "Multiple conflicts",
    summary: "Real tension in this combination, likely needs a swap.",
    tone: "orange",
    ring: "ring-orange-400/55",
    text: "text-orange-200",
    chip: "border-orange-400/45 bg-orange-400/12 text-orange-200",
  },
  {
    letter: "F",
    label: "Major conflicts",
    summary: "These species shouldn't share a tank, drop the outliers.",
    tone: "rose",
    ring: "ring-rose-400/55",
    text: "text-rose-800",
    chip: "border-rose-500/50 bg-rose-500/15 text-rose-800",
  },
];

function bandFor(score: number): ScoreBand {
  if (score >= 90) return BANDS[0];
  if (score >= 75) return BANDS[1];
  if (score >= 60) return BANDS[2];
  if (score >= 40) return BANDS[3];
  return BANDS[4];
}

function scoreFor(warnings: TankWarning[]): number {
  let score = 100;
  for (const w of warnings) {
    if (w.severity === "danger") score -= 30;
    else if (w.severity === "warn") score -= 10;
    else if (w.severity === "info") score -= 1;
  }
  return Math.max(0, Math.min(100, score));
}

export function CompareOverview({ entries }: CompareOverviewProps) {
  const ids = entries.map((e) => `${e.category}:${e.slug}`);
  const result = buildTank({ ids });
  const score = scoreFor(result.warnings);
  const band = bandFor(score);

  const dangerCount = result.warnings.filter((w) => w.severity === "danger").length;
  const warnCount = result.warnings.filter((w) => w.severity === "warn").length;
  const infoCount = result.warnings.filter((w) => w.severity === "info").length;

  const tempSpecies = temperatureContributions(result.selection);
  const phSpecies = phContributions(result.selection);
  const dghSpecies = dghContributions(result.selection);

  return (
    <section
      aria-labelledby="compare-overview-heading"
      className="flex flex-col gap-6"
    >
      <h2 id="compare-overview-heading" className="sr-only">
        Group compatibility overview
      </h2>

      <ScoreCard
        score={score}
        band={band}
        entryCount={entries.length}
        dangerCount={dangerCount}
        warnCount={warnCount}
        infoCount={infoCount}
        result={result}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {tempSpecies.length >= 2 && (
          <ChartCard icon={Thermometer} title="Temperature">
            <MultiRangeBar
              label=""
              unit="°C"
              scale={{ min: 15, max: 32 }}
              ticks={[15, 20, 25, 30]}
              precision={0}
              species={tempSpecies}
              intersection={result.requirements.temp}
            />
          </ChartCard>
        )}
        {phSpecies.length >= 2 && (
          <ChartCard icon={Droplet} title="pH">
            <MultiRangeBar
              label=""
              scale={{ min: 4, max: 8.5 }}
              ticks={[4, 5, 6, 7, 8]}
              precision={1}
              species={phSpecies}
              intersection={result.requirements.ph}
            />
          </ChartCard>
        )}
        {dghSpecies.length >= 2 && (
          <ChartCard icon={FlaskConical} title="Hardness">
            <MultiRangeBar
              label=""
              unit="dGH"
              scale={{ min: 0, max: 25 }}
              ticks={[0, 5, 10, 15, 20, 25]}
              precision={0}
              species={dghSpecies}
              intersection={result.requirements.dgh}
            />
          </ChartCard>
        )}
      </div>

      {result.warnings.length > 0 && <WarningList warnings={result.warnings} />}
    </section>
  );
}

function ScoreCard({
  score,
  band,
  entryCount,
  dangerCount,
  warnCount,
  infoCount,
  result,
}: {
  score: number;
  band: ScoreBand;
  entryCount: number;
  dangerCount: number;
  warnCount: number;
  infoCount: number;
  result: TankBuilderResult;
}) {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  const minTank = result.requirements.minTankL;
  const paramsOk =
    Boolean(result.requirements.temp) &&
    Boolean(result.requirements.ph) &&
    (dghCount(result) === 0 || Boolean(result.requirements.dgh));

  return (
    <div className="glass glass-edge animate-fade-up flex flex-col gap-6 rounded-2xl p-6 sm:flex-row sm:items-center sm:p-7">
      {/* Radial score */}
      <div className="relative flex shrink-0 items-center justify-center">
        <svg
          viewBox="0 0 120 120"
          className={cn("size-32 -rotate-90", band.ring && "drop-shadow-[0_0_18px_color-mix(in_oklab,var(--brand)_30%,transparent)]")}
          aria-hidden
        >
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="color-mix(in oklab, var(--foreground) 10%, transparent)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            strokeLinecap="round"
            strokeWidth="10"
            stroke={
              band.tone === "emerald"
                ? "rgb(110 231 183)"
                : band.tone === "brand"
                  ? "var(--brand)"
                  : band.tone === "amber"
                    ? "rgb(252 211 77)"
                    : band.tone === "orange"
                      ? "rgb(253 186 116)"
                      : "rgb(252 165 165)"
            }
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 600ms cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "text-display-tight text-3xl font-semibold leading-none sm:text-4xl",
              band.text,
            )}
          >
            {score}
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            / 100
          </span>
        </div>
      </div>

      {/* Verdict + stats */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
              band.chip,
            )}
          >
            <Sparkles className="size-3.5" aria-hidden />
            Grade {band.letter}
          </span>
          <h3 className="text-display-tight text-2xl sm:text-3xl">
            {band.label}
          </h3>
        </div>
        <p className="text-sm text-foreground/85 sm:text-base">{band.summary}</p>
        <dl className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <Stat
            icon={ShieldCheck}
            label="Species"
            value={`${entryCount}`}
            tone="brand"
          />
          <Stat
            icon={Box}
            label="Min tank"
            value={minTank !== null ? `${minTank} L` : ", "}
            tone={
              minTank === null ? "muted" : minTank >= 100 ? "amber" : "brand"
            }
          />
          <Stat
            icon={CircleAlert}
            label="Conflicts"
            value={`${dangerCount}`}
            tone={dangerCount > 0 ? "rose" : "brand"}
          />
          <Stat
            icon={paramsOk ? ShieldCheck : AlertTriangle}
            label="Params"
            value={paramsOk ? "All overlap" : "Mismatch"}
            tone={paramsOk ? "brand" : "rose"}
          />
        </dl>
        {(dangerCount > 0 || warnCount > 0 || infoCount > 0) && (
          <p className="text-[11px] text-muted-foreground">
            {dangerCount > 0 && (
              <span className="text-rose-800">
                {dangerCount} conflict{dangerCount === 1 ? "" : "s"}
              </span>
            )}
            {dangerCount > 0 && (warnCount > 0 || infoCount > 0) && " · "}
            {warnCount > 0 && (
              <span className="text-amber-800">
                {warnCount} warning{warnCount === 1 ? "" : "s"}
              </span>
            )}
            {warnCount > 0 && infoCount > 0 && " · "}
            {infoCount > 0 && (
              <span className="text-sky-800">
                {infoCount} note{infoCount === 1 ? "" : "s"}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

function dghCount(result: TankBuilderResult): number {
  let n = 0;
  for (const a of result.selection.all) {
    if ("dghRange" in a.entry && (a.entry as { dghRange?: string }).dghRange) {
      n += 1;
    }
  }
  return n;
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "brand" | "amber" | "rose" | "muted";
}) {
  const toneClass =
    tone === "rose"
      ? "border-rose-500/50 bg-rose-500/15 text-rose-800"
      : tone === "amber"
        ? "border-amber-500/45 bg-amber-500/15 text-amber-800"
        : tone === "muted"
          ? "border-border bg-background/60 text-muted-foreground"
          : "border-[var(--brand)]/40 bg-[var(--brand)]/12 text-foreground";
  return (
    <div className={cn("flex items-center gap-2 rounded-xl border px-3 py-2", toneClass)}>
      <Icon className="size-3.5 shrink-0" strokeWidth={1.8} aria-hidden />
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] opacity-80">
          {label}
        </span>
        <span className="truncate text-sm font-semibold">{value}</span>
      </div>
    </div>
  );
}

function ChartCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="glass glass-edge animate-fade-up flex flex-col gap-4 rounded-2xl p-5">
      <header className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex size-7 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]"
        >
          <Icon className="size-3.5" strokeWidth={1.9} />
        </span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </header>
      {children}
    </article>
  );
}

const SEVERITY: Record<
  TankWarning["severity"],
  { icon: LucideIcon; chip: string; bar: string }
> = {
  danger: {
    icon: CircleAlert,
    chip: "border-rose-500/50 bg-rose-500/15 text-rose-800",
    bar: "bg-rose-400/70",
  },
  warn: {
    icon: AlertTriangle,
    chip: "border-amber-500/45 bg-amber-500/15 text-amber-800",
    bar: "bg-amber-400/70",
  },
  info: {
    icon: Info,
    chip: "border-sky-500/45 bg-sky-500/15 text-sky-800",
    bar: "bg-sky-400/70",
  },
};

function WarningList({ warnings }: { warnings: TankWarning[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        What to plan for
      </h3>
      <ul className="stagger flex flex-col gap-2">
        {warnings.map((w, i) => {
          const meta = SEVERITY[w.severity];
          const Icon = meta.icon;
          return (
            <li
              key={`${w.severity}-${w.title}`}
              style={{ ["--i" as string]: Math.min(i, 8) }}
              className="animate-fade-up glass glass-edge relative flex gap-3 overflow-hidden rounded-2xl p-4"
            >
              <span
                aria-hidden
                className={cn("absolute inset-y-0 left-0 w-1", meta.bar)}
              />
              <span
                className={cn(
                  "mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border",
                  meta.chip,
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.9} aria-hidden />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{w.title}</span>
                <span className="text-xs text-foreground/85 leading-relaxed">
                  {w.body}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
