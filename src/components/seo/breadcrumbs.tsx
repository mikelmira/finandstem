import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { CrumbItem } from "@/lib/seo";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  items: ReadonlyArray<CrumbItem>;
  className?: string;
  /**
   * `"light"` renders the breadcrumb in white/light tones so it reads
   * legibly when sitting on top of a dark hero photo. Defaults to the
   * standard muted-foreground colour used on plain backgrounds.
   */
  tone?: "default" | "light";
}

/**
 * Visible breadcrumb navigation. Pair with breadcrumbsJsonLd() in the page's
 * JSON-LD graph for the BreadcrumbList structured data Google needs to render
 * site-link-style breadcrumbs in SERPs.
 */
export function Breadcrumbs({ items, className, tone = "default" }: BreadcrumbsProps) {
  const isLight = tone === "light";
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center text-sm",
        isLight ? "text-white/75" : "text-muted-foreground",
        className,
      )}
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
                  className={cn(
                    "press inline-flex items-center gap-1 transition-colors",
                    isLight ? "hover:text-white" : "hover:text-foreground",
                  )}
                >
                  <Home className="size-3.5" aria-hidden />
                  <span className="sr-only">{item.name}</span>
                </Link>
              ) : item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "press transition-colors",
                    isLight ? "hover:text-white" : "hover:text-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={cn(
                    "font-medium",
                    isLast && (isLight ? "text-white" : "text-foreground"),
                  )}
                >
                  {item.name}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  className={cn(
                    "size-3.5",
                    isLight ? "text-white/50" : "text-muted-foreground/60",
                  )}
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
