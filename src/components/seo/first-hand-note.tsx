import { Sparkles } from "lucide-react";
import { site } from "@/lib/site";

interface FirstHandNoteProps {
  note: string;
  speciesName: string;
}

/**
 * First-hand "Mike's tank" callout — rendered immediately after the
 * TL;DR on species pages where `entry.keptByAuthor` is true.
 *
 * This block is what makes the page rank for the experience axis of
 * Google's E-E-A-T: a primary-source paragraph that nothing scraped
 * from Wikipedia or FishBase can match. It pairs with the `reviewedBy`
 * property emitted on the schema.org Article when keptByAuthor.
 */
export function FirstHandNote({ note, speciesName }: FirstHandNoteProps) {
  const firstName = site.owner.name.split(" ")[0];
  return (
    <aside
      aria-labelledby="first-hand-heading"
      className="glass glass-edge rounded-2xl border-l-4 border-[var(--brand)] p-6 sm:p-7"
    >
      <header className="flex items-center gap-2">
        <Sparkles className="size-4 text-[var(--brand)]" aria-hidden />
        <h2
          id="first-hand-heading"
          className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--brand)]"
        >
          {firstName}&rsquo;s tank
        </h2>
      </header>
      <p className="mt-4 text-base leading-relaxed text-foreground/90">{note}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        First-hand observation from keeping {speciesName} — not a research
        summary.
      </p>
    </aside>
  );
}
