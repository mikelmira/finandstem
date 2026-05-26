import Link from "next/link";
import { PenLine } from "lucide-react";
import { site } from "@/lib/site";

interface AuthorBylineProps {
  updatedAt?: string;
  className?: string;
}

/**
 * Author byline with rel="author" link to /about.
 *
 * Google's E-E-A-T signals weight authored content above unattributed pages.
 * Always render this on any indexable Article-typed page (species, guides,
 * pillar pages). The matching <Person> entity is emitted by personEntity()
 * in lib/seo.ts.
 */
export function AuthorByline({
  updatedAt,
  className,
}: AuthorBylineProps) {
  return (
    <div
      className={
        "flex flex-wrap items-center gap-2 text-xs text-muted-foreground" +
        (className ? ` ${className}` : "")
      }
    >
      <span className="inline-flex items-center gap-1.5">
        <PenLine className="size-3.5" aria-hidden />
        Written by{" "}
        <Link
          href="/about"
          rel="author"
          className="font-medium text-foreground transition-colors hover:text-[var(--brand)]"
        >
          {site.owner.name}
        </Link>
      </span>
      {updatedAt && (
        <>
          <span aria-hidden>·</span>
          <span>
            Updated{" "}
            <time dateTime={updatedAt}>
              {new Date(updatedAt).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </span>
        </>
      )}
      <span aria-hidden>·</span>
      <span>Editorially independent. Image credits below.</span>
    </div>
  );
}
