import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  /** Omit on the trailing crumb, the current page is not a link. */
  href?: string;
}

interface BreadcrumbProps {
  items: ReadonlyArray<BreadcrumbItem>;
  /** Render a slightly lighter set of crumb colours for use over the
   *  brand-aurora hero background. Defaults to the dark on cream tone. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Compact breadcrumb trail, a Home icon, then label crumbs separated
 * by chevrons. The trailing crumb is non-linked and gets the foreground
 * colour to mark "you are here". Emits JSON-LD BreadcrumbList markup
 * so search engines pick the trail up as a rich result.
 *
 * Designed to sit at the top of a hero block (above the eyebrow) on
 * every non-home page.
 */
export function Breadcrumb({
  items,
  tone = "dark",
  className,
}: BreadcrumbProps) {
  if (items.length === 0) return null;
  const baseUrl = site.url.replace(/\/$/, "");
  const crumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    ...items,
  ];
  const lastIndex = crumbs.length - 1;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${baseUrl}${c.href}` } : {}),
    })),
  };

  const linkBase =
    tone === "light"
      ? "text-white/70 hover:text-white"
      : "text-muted-foreground hover:text-foreground";
  const currentBase =
    tone === "light" ? "text-white" : "text-foreground";

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center text-[11px] font-medium uppercase tracking-[0.16em]",
        className,
      )}
    >
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {crumbs.map((c, i) => {
          const isLast = i === lastIndex;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-x-1.5">
              {i === 0 && (
                <Home
                  className={cn(
                    "size-3 sm:size-3.5",
                    tone === "light" ? "text-white/90" : "text-[var(--brand)]",
                  )}
                  strokeWidth={2}
                  aria-hidden
                />
              )}
              {isLast || !c.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "transition-colors",
                    isLast ? currentBase : linkBase,
                  )}
                >
                  {c.label}
                </span>
              ) : (
                <Link
                  href={c.href}
                  className={cn(
                    "press transition-colors",
                    linkBase,
                  )}
                >
                  {c.label}
                </Link>
              )}
              {!isLast && (
                <ChevronRight
                  className={cn(
                    "size-3",
                    tone === "light"
                      ? "text-white/55"
                      : "text-muted-foreground/55",
                  )}
                  strokeWidth={2}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
