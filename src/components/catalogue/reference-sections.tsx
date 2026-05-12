import type { DetailSection } from "@/data/species-detail";

interface ReferenceSectionsProps {
  sections: DetailSection[];
}

export function ReferenceSections({ sections }: ReferenceSectionsProps) {
  if (sections.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 md:grid-cols-2">
      {sections.map((s) => (
        <article
          key={s.key}
          className="glass flex flex-col gap-2 bg-background p-6 sm:p-7"
        >
          <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
            {s.label}
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
            {s.body}
          </p>
        </article>
      ))}
    </div>
  );
}
