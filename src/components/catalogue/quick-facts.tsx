import { cn } from "@/lib/utils";

export interface QuickFact {
  label: string;
  value: React.ReactNode;
  /** Optional supporting hint shown beneath the value. */
  helper?: string;
}

interface QuickFactsProps {
  facts: ReadonlyArray<QuickFact>;
  className?: string;
}

export function QuickFacts({ facts, className }: QuickFactsProps) {
  if (facts.length === 0) return null;
  return (
    <dl
      className={cn(
        "stagger grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {facts.map((f, i) => (
        <div
          key={f.label}
          style={{ ["--i" as string]: Math.min(i, 7) }}
          className="animate-fade-up glass glass-edge group flex flex-col gap-1 rounded-xl p-4 transition-colors duration-300 hover:border-[var(--brand)]/35"
        >
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {f.label}
          </dt>
          <dd className="text-sm font-medium leading-tight text-foreground sm:text-base">
            {f.value || "—"}
          </dd>
          {f.helper && (
            <p className="text-[11px] leading-snug text-muted-foreground/80">
              {f.helper}
            </p>
          )}
        </div>
      ))}
    </dl>
  );
}
