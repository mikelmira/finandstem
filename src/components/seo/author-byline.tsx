interface AuthorBylineProps {
  /** ISO 8601 timestamp shown as a `<time>` element. */
  updatedAt?: string;
  /** Estimated reading time, in minutes. Shown as "N min read". */
  readingTimeMin?: number;
  className?: string;
}

/**
 * Page meta line: optional last-updated timestamp and reading-time estimate.
 *
 * No personal byline is shown. Article authorship is attributed to the Fin &
 * Stem organisation in the JSON-LD (`organizationRef()` in lib/seo.ts), so the
 * rendered text and the structured data stay in agreement. Renders nothing
 * when there is no date or reading time to show.
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

  const showReadingTime = readingTimeMin !== undefined && readingTimeMin > 0;

  if (!updatedDisplay && !showReadingTime) {
    return null;
  }

  return (
    <p
      className={
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground" +
        (className ? ` ${className}` : "")
      }
    >
      {updatedDisplay && (
        <span>
          Updated <time dateTime={updatedAt}>{updatedDisplay}</time>
        </span>
      )}
      {updatedDisplay && showReadingTime && <span aria-hidden>·</span>}
      {showReadingTime && <span>{readingTimeMin} min read</span>}
    </p>
  );
}
