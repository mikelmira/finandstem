import Link from "next/link";
import { PenLine } from "lucide-react";
import { site } from "@/lib/site";

interface AuthorBylineProps {
  /** ISO 8601 timestamp shown as a `<time>` element after the byline. */
  updatedAt?: string;
  /** Estimated reading time, in minutes. Shown as "N min read". */
  readingTimeMin?: number;
  className?: string;
}

/**
 * Author byline with `rel="author"` link to /about, optional last-updated
 * timestamp, and optional reading-time estimate.
 *
 * Visible-DOM equivalent of the Person + Article `author` / `dateModified`
 * JSON-LD properties: Google rewards pages where the structured data and
 * the rendered text agree. The matching <Person> entity is emitted by
 * `personEntity()` in lib/seo.ts.
 */
export function AuthorByline({
  updatedAt,
  readingTimeMin,
  className,
}: AuthorBylineProps) {
  const updatedDisplay = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : undefined;

  return (
    <p
      className={
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground" +
        (className ? ` ${className}` : "")
      }
    >
      <span className="inline-flex items-center gap-1.5">
        <PenLine className="size-3.5" aria-hidden />
        By{" "}
        <Link
          href="/about"
          rel="author"
          className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)] hover:decoration-[var(--brand)]"
        >
          {site.owner.name}
        </Link>
      </span>
      {updatedDisplay && (
        <>
          <span aria-hidden>·</span>
          <span>
            Updated <time dateTime={updatedAt}>{updatedDisplay}</time>
          </span>
        </>
      )}
      {readingTimeMin !== undefined && readingTimeMin > 0 && (
        <>
          <span aria-hidden>·</span>
          <span>{readingTimeMin} min read</span>
        </>
      )}
    </p>
  );
}
