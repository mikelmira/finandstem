import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { CrumbItem } from "@/lib/seo";

interface BreadcrumbsProps {
  items: ReadonlyArray<CrumbItem>;
  className?: string;
}

/**
 * Visible breadcrumb navigation. Pair with breadcrumbsJsonLd() in the page's
 * JSON-LD graph for the BreadcrumbList structured data Google needs to render
 * site-link-style breadcrumbs in SERPs.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={
        "flex items-center text-sm text-muted-foreground" +
        (className ? ` ${className}` : "")
      }
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li
              key={`${item.name}-${idx}`}
              className="flex items-center gap-1.5"
              {...(isLast ? { "aria-current": "page" } : {})}
            >
              {idx === 0 && item.href === "/" ? (
                <Link
                  href={item.href}
                  className="press inline-flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  <Home className="size-3.5" aria-hidden />
                  <span className="sr-only">{item.name}</span>
                </Link>
              ) : item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="press transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={
                    isLast ? "font-medium text-foreground" : undefined
                  }
                >
                  {item.name}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  className="size-3.5 text-muted-foreground/60"
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
