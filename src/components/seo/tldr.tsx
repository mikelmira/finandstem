import { Sparkles } from "lucide-react";

interface TldrProps {
  /** 100–300-word direct answer. */
  body: string;
  /** Subject of the page (used in heading + sr-only label). */
  subject: string;
}

/**
 * TL;DR, the answer-engine-friendly direct-answer block.
 *
 * Ranks well for "what is X" queries in AI overviews because it leads with the
 * answer in a single tightly-scoped block. Keep body between 100–300 words.
 * The block is rendered as a <section> with a stable id ("tldr") so it can be
 * deep-linked and so JSON-LD can reference it as the mainEntity content.
 */
export function Tldr({ body, subject }: TldrProps) {
  return (
    <section
      id="tldr"
      aria-labelledby="tldr-heading"
      className="glass glass-edge rounded-2xl p-6 sm:p-7"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-[var(--brand)]" aria-hidden />
        <h2
          id="tldr-heading"
          className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--brand)]"
        >
          TL;DR, {subject}
        </h2>
      </div>
      <div className="mt-4 space-y-3 text-base leading-relaxed text-foreground/90">
        {body
          .split(/\n\n+/)
          .map((para) => para.trim())
          .filter(Boolean)
          .map((para, i) => (
            <p key={i}>{para}</p>
          ))}
      </div>
    </section>
  );
}
