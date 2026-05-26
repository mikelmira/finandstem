import { ExternalLink, BookOpen } from "lucide-react";
import type { SourceItem } from "@/lib/seo";

interface SourcesProps {
  items: ReadonlyArray<SourceItem>;
  heading?: string;
}

/**
 * Sources / further reading block.
 *
 * Required by the SEO acceptance criteria: every catalogue and guide page
 * lists primary references. We use this for both transparency (E-E-A-T) and
 * to give crawlers explicit outbound links to the canonical species pages on
 * Wikipedia / FishBase / Tropica, which helps Google connect Fin & Stem's
 * entry to the wider knowledge graph.
 */
export function Sources({ items, heading = "Sources & further reading" }: SourcesProps) {
  if (items.length === 0) return null;
  return (
    <section
      aria-labelledby="sources-heading"
      className="rounded-2xl border border-border/60 bg-background/40 p-6 sm:p-7"
    >
      <div className="flex items-center gap-2">
        <BookOpen className="size-4 text-muted-foreground" aria-hidden />
        <h2
          id="sources-heading"
          className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
        >
          {heading}
        </h2>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="press group inline-flex items-center gap-2 text-sm text-foreground/85 transition-colors hover:text-[var(--brand)]"
            >
              <span className="underline-offset-2 group-hover:underline">
                {item.label}
              </span>
              <ExternalLink
                className="size-3.5 text-muted-foreground/70"
                aria-hidden
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
