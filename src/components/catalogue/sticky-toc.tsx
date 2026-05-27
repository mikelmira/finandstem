"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface StickyTocItem {
  id: string;
  label: string;
}

interface StickyTocProps {
  items: ReadonlyArray<StickyTocItem>;
}

/**
 * Right-rail sticky table of contents for the species detail page.
 *
 *   • Desktop only (lg+ breakpoint), the detail page main column
 *     reserves enough room for it via the parent grid.
 *   • Active-section highlighting via IntersectionObserver. The first
 *     visible section wins; once everything's scrolled past, the last
 *     section stays highlighted.
 *   • Smooth-scrolls on click and writes the hash so deep links work.
 */
export function StickyToc({ items }: StickyTocProps) {
  const [activeId, setActiveId] = React.useState<string | null>(
    items[0]?.id ?? null,
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (items.length === 0) return;

    const nodes = items
      .map((it) => document.getElementById(it.id))
      .filter((n): n is HTMLElement => Boolean(n));

    if (nodes.length === 0) return;

    // Pick the active section by recomputing live positions on every
    // scroll. IntersectionObserver's boundingClientRect goes stale
    // between callbacks, so we use it only as a "something changed"
    // trigger and read fresh positions on each scroll tick.
    //
    // Active = the last section whose top is above 25% of the viewport.
    // (i.e. it's been scrolled into the reading zone.)
    const compute = () => {
      const trigger = window.innerHeight * 0.25;
      let active = nodes[0].id;
      for (const n of nodes) {
        const top = n.getBoundingClientRect().top;
        if (top - trigger <= 0) {
          active = n.id;
        } else {
          break;
        }
      }
      setActiveId(active);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      setActiveId(id);
    },
    [],
  );

  return (
    <nav
      aria-label="On this page"
      className="sticky top-28 hidden max-h-[calc(100vh-8rem)] w-full overflow-y-auto lg:block"
    >
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        On this page
      </p>
      <ol className="flex flex-col gap-0.5">
        {items.map((it, i) => {
          const active = activeId === it.id;
          return (
            <li key={it.id} className="relative flex items-stretch">
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 w-px transition-all duration-200",
                  active
                    ? "h-5 bg-[var(--brand)]"
                    : "h-2 bg-border",
                )}
              />
              <a
                href={`#${it.id}`}
                onClick={(e) => onClick(e, it.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "press group flex w-full items-center gap-2.5 rounded-md py-1.5 pl-4 pr-2 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-medium tabular-nums transition-colors",
                    active ? "text-[var(--brand)]" : "text-muted-foreground/60",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-tight">{it.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
