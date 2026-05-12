import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DetailSection } from "@/data/species-detail";

interface ProTipsCalloutProps {
  sections: DetailSection[];
  className?: string;
}

export function ProTipsCallout({ sections, className }: ProTipsCalloutProps) {
  const proTips = sections.find((s) => s.key === "proTips");
  const etymology = sections.find((s) => s.key === "etymology");
  if (!proTips && !etymology) return null;

  return (
    <section
      className={cn("flex flex-col gap-5", className)}
      aria-labelledby="group-protips"
    >
      <header className="flex flex-col gap-1">
        <h2
          id="group-protips"
          className="text-display-tight text-2xl sm:text-3xl"
        >
          Pro tips
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Hard-won lessons from the tank.
        </p>
      </header>

      <div
        className="glass glass-edge relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 80% at 100% 0%, color-mix(in oklab, var(--brand) 18%, transparent) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 0% 100%, color-mix(in oklab, var(--leaf) 14%, transparent) 0%, transparent 65%)",
        }}
      >
        {proTips && (
          <div className="flex gap-4">
            <span
              aria-hidden
              className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand)]/20 text-[var(--brand)] sm:inline-flex"
            >
              <Sparkles className="size-5" strokeWidth={2} />
            </span>
            <p className="text-base leading-relaxed text-foreground/95 sm:text-lg">
              {proTips.body}
            </p>
          </div>
        )}

        {etymology && (
          <div className="mt-6 flex flex-col gap-2 border-t border-border/50 pt-5">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
              Etymology
            </span>
            <p className="text-sm leading-relaxed text-foreground/85">
              {etymology.body}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
