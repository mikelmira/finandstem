import { Heart, Egg, RefreshCw, CircleDot, Venus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DetailSection } from "@/data/species-detail";

interface BehaviorTimelineProps {
  sections: DetailSection[];
  className?: string;
}

const STAGE_META: Record<
  string,
  { icon: LucideIcon; verb: string }
> = {
  sexing: { icon: Venus, verb: "Telling them apart" },
  breeding: { icon: Heart, verb: "Pairing & spawning" },
  molting: { icon: RefreshCw, verb: "Molting cycle" },
  lifecycle: { icon: Egg, verb: "Life stages" },
};

export function BehaviorTimeline({
  sections,
  className,
}: BehaviorTimelineProps) {
  if (sections.length === 0) return null;

  return (
    <section
      className={cn("flex flex-col gap-6", className)}
      aria-labelledby="group-behavior"
    >
      <header className="flex flex-col gap-1">
        <h2
          id="group-behavior"
          className="text-display-tight text-2xl sm:text-3xl"
        >
          Behavior &amp; breeding
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          How they pair, reproduce, and grow.
        </p>
      </header>

      <ol className="stagger relative grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sections.map((s, i) => {
          const meta = STAGE_META[s.key] ?? {
            icon: CircleDot,
            verb: s.label,
          };
          const Icon = meta.icon;
          const isLast = i === sections.length - 1;

          return (
            <li
              key={s.key}
              style={{ ["--i" as string]: Math.min(i, 3) }}
              className="animate-fade-up relative flex flex-col"
            >
              {/* Top row: number + connector line */}
              <div className="relative flex items-center pb-3">
                <span className="glass glass-edge inline-flex size-10 items-center justify-center rounded-full text-[var(--brand)]">
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                {!isLast && (
                  <span
                    aria-hidden
                    className="ml-3 hidden h-px flex-1 bg-[var(--brand)]/25 sm:block"
                  />
                )}
                <span className="ml-auto text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:ml-3">
                  Stage {i + 1}
                </span>
              </div>

              {/* Card body */}
              <article className="glass glass-edge flex h-full flex-col gap-2 rounded-2xl p-5 transition-colors duration-300 hover:border-[var(--brand)]/35">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                  {meta.verb}
                </span>
                <h3 className="text-sm font-semibold text-foreground">
                  {s.label}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                  {s.body}
                </p>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
