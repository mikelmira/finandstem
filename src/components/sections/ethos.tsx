import { SectionShell, SectionHeading } from "@/components/sections/section-shell";

interface EthosProps {
  eyebrow: string;
  title: string;
  body: string;
  points: ReadonlyArray<string>;
}

export function Ethos({ eyebrow, title, body, points }: EthosProps) {
  return (
    <SectionShell className="relative isolate border-t border-border/60">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={body} />
        <ul className="glass glass-edge space-y-4 rounded-2xl p-7 sm:p-8">
          {points.map((point, i) => (
            <li key={point} className="flex gap-3.5 text-sm sm:text-base">
              <span
                aria-hidden
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] font-mono text-xs text-[var(--brand)]"
              >
                {i + 1}
              </span>
              <span className="pt-1 leading-relaxed text-foreground/90">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
