import { Box, Droplet, Scissors, Anchor, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DetailSection } from "@/data/species-detail";

interface CareStepsProps {
  sections: DetailSection[];
  className?: string;
}

const STEP_ICON: Record<string, LucideIcon> = {
  tankSetup: Box,
  fertilization: Droplet,
  trimming: Scissors,
  tying: Anchor,
  quarantine: Shield,
};

export function CareSteps({ sections, className }: CareStepsProps) {
  if (sections.length === 0) return null;

  return (
    <section
      className={cn("flex flex-col gap-6", className)}
      aria-labelledby="group-care"
    >
      <header className="flex flex-col gap-1">
        <h2
          id="group-care"
          className="text-display-tight text-2xl sm:text-3xl"
        >
          How to care for it
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          The practical routine — read top to bottom.
        </p>
      </header>

      <ol className="stagger relative flex flex-col">
        {/* Vertical connector line — runs behind the icons */}
        <span
          aria-hidden
          className="absolute left-[27px] top-6 bottom-6 w-px bg-[var(--brand)]/25 sm:left-[35px]"
        />

        {sections.map((s, i) => {
          const Icon = STEP_ICON[s.key] ?? Box;
          return (
            <li
              key={s.key}
              style={{ ["--i" as string]: Math.min(i, 5) }}
              className="animate-fade-up relative flex gap-4 py-4 first:pt-0 sm:gap-6"
            >
              {/* Icon disc with step number */}
              <div className="relative shrink-0">
                <span className="glass glass-edge relative inline-flex size-14 items-center justify-center rounded-full bg-background/85 text-[var(--brand)] sm:size-[70px]">
                  <Icon className="size-5 sm:size-6" strokeWidth={1.75} />
                </span>
                <span
                  aria-hidden
                  className="absolute -right-1 -top-1 inline-flex size-6 items-center justify-center rounded-full border border-[var(--brand)]/55 bg-background text-[10px] font-semibold tabular-nums text-foreground sm:size-7 sm:text-xs"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Step body */}
              <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground sm:text-base sm:tracking-[0.14em]">
                  {s.label}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                  {s.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
