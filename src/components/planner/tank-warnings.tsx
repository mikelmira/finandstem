import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TankWarning } from "@/lib/catalogue/tank-builder";

interface TankWarningsProps {
  warnings: TankWarning[];
  hasSelection: boolean;
}

const SEVERITY: Record<
  TankWarning["severity"],
  { icon: LucideIcon; card: string; chip: string; iconBg: string; label: string }
> = {
  danger: {
    icon: AlertTriangle,
    card: "border-rose-400/45",
    chip: "border-rose-400/55 bg-rose-400/15 text-rose-200",
    iconBg: "bg-rose-400/15 text-rose-200",
    label: "Conflict",
  },
  warn: {
    icon: AlertCircle,
    card: "border-amber-400/40",
    chip: "border-amber-400/55 bg-amber-400/15 text-amber-200",
    iconBg: "bg-amber-400/15 text-amber-200",
    label: "Watch",
  },
  info: {
    icon: Info,
    card: "border-sky-400/40",
    chip: "border-sky-400/55 bg-sky-400/12 text-sky-200",
    iconBg: "bg-sky-400/15 text-sky-200",
    label: "Tip",
  },
};

export function TankWarnings({
  warnings,
  hasSelection,
}: TankWarningsProps) {
  if (!hasSelection) return null;

  if (warnings.length === 0) {
    return (
      <section
        className="flex flex-col gap-4"
        aria-labelledby="tank-warnings"
      >
        <header className="flex flex-col gap-1">
          <h2
            id="tank-warnings"
            className="text-display-tight text-2xl sm:text-3xl"
          >
            Compatibility check
          </h2>
        </header>
        <article className="glass glass-edge animate-fade-up flex items-start gap-3 rounded-2xl border border-emerald-400/40 p-5">
          <span
            aria-hidden
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300"
          >
            <CheckCircle2 className="size-4" strokeWidth={1.85} />
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-foreground">
              Everything looks compatible
            </h3>
            <p className="text-sm leading-relaxed text-foreground/85">
              The selected species share an overlapping temperature, pH,
              and hardness window. No predator / prey conflicts detected
              in the catalogue.
            </p>
          </div>
        </article>
      </section>
    );
  }

  // Sort so danger comes first, then warn, then info
  const order = { danger: 0, warn: 1, info: 2 } as const;
  const sorted = [...warnings].sort(
    (a, b) => order[a.severity] - order[b.severity],
  );

  return (
    <section
      className="flex flex-col gap-5"
      aria-labelledby="tank-warnings"
    >
      <header className="flex items-baseline justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2
            id="tank-warnings"
            className="text-display-tight text-2xl sm:text-3xl"
          >
            Compatibility check
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            {sorted.length} {sorted.length === 1 ? "thing" : "things"} to
            review before you commit to this stocking plan.
          </p>
        </div>
      </header>

      <div className="stagger flex flex-col gap-3">
        {sorted.map((w, i) => {
          const meta = SEVERITY[w.severity];
          const Icon = meta.icon;
          return (
            <article
              key={`${w.title}-${i}`}
              style={{ ["--i" as string]: Math.min(i, 6) }}
              className={cn(
                "glass animate-fade-up rounded-2xl border p-5 sm:p-6",
                meta.card,
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex size-9 shrink-0 items-center justify-center rounded-full",
                    meta.iconBg,
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.85} />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
                        meta.chip,
                      )}
                    >
                      {meta.label}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                      {w.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {w.body}
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
