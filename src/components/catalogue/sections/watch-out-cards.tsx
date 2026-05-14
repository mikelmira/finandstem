import {
  Stethoscope,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Bug,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DetailSection } from "@/data/species-detail";

interface WatchOutCardsProps {
  sections: DetailSection[];
  className?: string;
}

type Severity = "danger" | "warn" | "info";

interface WatchMeta {
  icon: LucideIcon;
  severity: Severity;
  pill: string;
}

const WATCH_META: Record<string, WatchMeta> = {
  diseases: { icon: Stethoscope, severity: "danger", pill: "Health" },
  deficiencies: {
    icon: AlertTriangle,
    severity: "warn",
    pill: "Nutrition",
  },
  algaeIssues: { icon: Sparkles, severity: "warn", pill: "Algae" },
  misconceptions: {
    icon: AlertCircle,
    severity: "info",
    pill: "Often wrong",
  },
  commonMistakes: {
    icon: Bug,
    severity: "warn",
    pill: "Common mistakes",
  },
};

const SEVERITY_CLASS: Record<
  Severity,
  { card: string; chip: string; icon: string }
> = {
  danger: {
    card: "border-rose-400/35 hover:border-rose-500/55",
    chip: "border-rose-500/50 bg-rose-500/15 text-rose-800",
    icon: "bg-rose-500/18 text-rose-700",
  },
  warn: {
    card: "border-amber-400/35 hover:border-amber-500/55",
    chip: "border-amber-500/45 bg-amber-500/15 text-amber-800",
    icon: "bg-amber-500/18 text-amber-700",
  },
  info: {
    card: "border-sky-400/35 hover:border-sky-500/55",
    chip: "border-sky-500/45 bg-sky-500/15 text-sky-800",
    icon: "bg-sky-500/18 text-sky-700",
  },
};

export function WatchOutCards({
  sections,
  className,
}: WatchOutCardsProps) {
  if (sections.length === 0) return null;

  return (
    <section
      className={cn("flex flex-col gap-6", className)}
      aria-labelledby="group-watch"
    >
      <header className="flex flex-col gap-1">
        <h2
          id="group-watch"
          className="text-display-tight text-2xl sm:text-3xl"
        >
          Things to watch for
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Failure modes, in order of how dramatic the fix is.
        </p>
      </header>

      <div className="stagger grid grid-cols-1 gap-3 md:grid-cols-2">
        {sections.map((s, i) => {
          const meta = WATCH_META[s.key] ?? {
            icon: AlertTriangle,
            severity: "warn" as Severity,
            pill: s.label,
          };
          const sev = SEVERITY_CLASS[meta.severity];
          const Icon = meta.icon;
          return (
            <article
              key={s.key}
              style={{ ["--i" as string]: Math.min(i, 4) }}
              className={cn(
                "animate-fade-up glass relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-colors duration-300",
                sev.card,
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex size-9 shrink-0 items-center justify-center rounded-full",
                    sev.icon,
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.85} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
                        sev.chip,
                      )}
                    >
                      {meta.pill}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {s.label}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                    {s.body}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
