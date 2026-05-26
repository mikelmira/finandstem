import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface PillarLinkProps {
  /** Path to the pillar page, e.g. `/aquarium-fish-guide`. */
  href: string;
  children: React.ReactNode;
}

/**
 * "For the full context, read …" callout used inside MDX articles to
 * link up to the pillar guide the article belongs under. Renders as a
 * visually distinct aside so the link reads as a structured recommendation
 * rather than an inline reference.
 *
 * Pairs with Rule 7 of seo/internal-linking-rules.md — every guide must
 * link up to its pillar with keyword-rich anchor text.
 */
export function PillarLink({ href, children }: PillarLinkProps) {
  return (
    <aside
      data-mdx="pillar-link"
      className="my-6 flex items-start gap-3 rounded-2xl border-l-4 border-[var(--brand)] bg-muted/40 p-5"
    >
      <ArrowUpRight
        className="mt-0.5 size-5 flex-none text-[var(--brand)]"
        aria-hidden
      />
      <p className="m-0 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For the full context, read{" "}
        <Link
          href={href}
          className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)] hover:decoration-[var(--brand)]"
        >
          {children}
        </Link>
        .
      </p>
    </aside>
  );
}
