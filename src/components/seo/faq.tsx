import type { FaqItem } from "@/lib/species-faq";

interface FaqProps {
  items: ReadonlyArray<FaqItem>;
  heading?: string;
}

/**
 * FAQ list rendered as a native <details> stack for accessibility + zero JS.
 *
 * Pair with FAQPage JSON-LD via speciesPageJsonLd() so the same Q/A appears
 * in both the human-readable DOM and the structured data, Google's FAQ
 * rich-result requires both, and AI assistants score pages much higher when
 * the answers are present verbatim in the HTML.
 */
export function Faq({ items, heading = "Frequently asked questions" }: FaqProps) {
  if (items.length === 0) return null;
  return (
    <section
      aria-labelledby="faq-heading"
      className="rounded-2xl border border-border/60 bg-background/60 p-6 sm:p-8"
    >
      <h2
        id="faq-heading"
        className="text-display-tight text-2xl sm:text-3xl"
      >
        {heading}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Direct answers to the questions search engines and AI assistants surface
        most often about this species.
      </p>
      <div className="mt-6 divide-y divide-border/60 rounded-xl border border-border/60 bg-background/60">
        {items.map((item, i) => (
          <details
            key={i}
            className="group p-5 [&_summary]:cursor-pointer [&_summary]:list-none"
            {...(i === 0 ? { open: true } : {})}
          >
            <summary className="flex items-start justify-between gap-4">
              <span className="text-base font-medium text-foreground">
                {item.question}
              </span>
              <span
                aria-hidden
                className="mt-1 inline-flex size-6 flex-none items-center justify-center rounded-full border border-border bg-background text-xs text-muted-foreground transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85 sm:text-base">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
