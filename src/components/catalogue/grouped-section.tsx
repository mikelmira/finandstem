import { cn } from "@/lib/utils";
import type { DetailGroup } from "@/lib/catalogue/detail-groups";

interface GroupedSectionProps {
  group: DetailGroup;
  className?: string;
}

export function GroupedSection({ group, className }: GroupedSectionProps) {
  return (
    <section
      className={cn("flex flex-col gap-5", className)}
      aria-labelledby={`group-${group.key}`}
    >
      <header className="flex flex-col gap-1">
        <h2
          id={`group-${group.key}`}
          className="text-display-tight text-2xl sm:text-3xl"
        >
          {group.label}
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          {group.blurb}
        </p>
      </header>

      <div className="stagger grid grid-cols-1 gap-3 md:grid-cols-2">
        {group.sections.map((s, i) => (
          <article
            key={s.key}
            style={{ ["--i" as string]: Math.min(i, 5) }}
            className="glass glass-edge animate-fade-up group rounded-2xl p-5 sm:p-6 transition-colors duration-300 hover:border-[var(--brand)]/35"
          >
            <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
              {s.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
              {s.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
