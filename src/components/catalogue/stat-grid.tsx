import { cn } from "@/lib/utils";

export interface Stat {
  label: string;
  value: React.ReactNode;
  helper?: string;
}

interface StatGridProps {
  stats: ReadonlyArray<Stat>;
  className?: string;
}

export function StatGrid({ stats, className }: StatGridProps) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className="glass flex flex-col gap-1 bg-background p-4 sm:p-5"
        >
          <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {s.label}
          </dt>
          <dd className="text-base font-medium leading-tight text-foreground sm:text-lg">
            {s.value || ", "}
          </dd>
          {s.helper && (
            <p className="text-[11px] leading-snug text-muted-foreground/80">
              {s.helper}
            </p>
          )}
        </div>
      ))}
    </dl>
  );
}
