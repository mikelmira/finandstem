"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EntryCard } from "@/components/catalogue/entry-card";
import { cn } from "@/lib/utils";
import type { CatalogueEntry } from "@/types/catalogue";

interface FeaturedSliderProps {
  entries: ReadonlyArray<CatalogueEntry>;
}

/**
 * Horizontal scroll-snap carousel of EntryCards.
 *
 * Layout: the track aligns its left edge with the page content gutter
 * (so the first card sits directly under the section heading), but
 * extends all the way to the right edge of the viewport so trailing
 * cards bleed off-screen as a "more to scroll" affordance.
 *
 * Mobile (touch): native swipe via `overflow-x-auto snap-x
 * snap-mandatory`.
 * Desktop (pointer): same scroll track plus prev / next arrow
 * buttons that scroll one card at a time. Buttons disable
 * themselves at the track ends. Edge fades hide at the boundaries.
 */
export function FeaturedSlider({ entries }: FeaturedSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  // Update arrow disabled state based on scroll position. Throttled
  // via requestAnimationFrame so we don't trigger React renders on
  // every scroll tick.
  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = el.scrollWidth - el.clientWidth;
        setAtStart(el.scrollLeft <= 4);
        setAtEnd(el.scrollLeft >= max - 4);
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [entries.length]);

  const scrollByCard = React.useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card =
      el.querySelector<HTMLElement>("[data-slide]") ?? el.firstElementChild;
    const step = card instanceof HTMLElement ? card.offsetWidth + 20 : 320;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  return (
    <div className="relative mt-12">
      {/* Slider controls, desktop only. Touch users get native swipe. */}
      <div className="mx-auto mb-6 hidden w-full max-w-6xl items-center justify-end gap-2 px-6 sm:flex sm:px-8">
        <SliderButton
          dir="prev"
          disabled={atStart}
          onClick={() => scrollByCard(-1)}
        />
        <SliderButton
          dir="next"
          disabled={atEnd}
          onClick={() => scrollByCard(1)}
        />
      </div>

      {/* Track, left-aligned at the page gutter, no right cap so the
          card row bleeds off-screen. The arbitrary `pl-` value matches
          the SectionShell content gutter: 1.5rem (px-6) below sm,
          2rem (px-8) at sm+, and on wider viewports it grows to
          centre-align the leftmost card with the max-w-6xl content. */}
      <div
        ref={trackRef}
        className={cn(
          "flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-6 scroll-smooth",
          "pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] sm:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]",
          // Hide scrollbar visually, keyboard access still works.
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        aria-label="Beginner-friendly species"
      >
        {entries.map((entry) => (
          <div
            key={`${entry.category}-${entry.slug}`}
            data-slide
            className="flex w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[400px]"
          >
            <EntryCard entry={entry} />
          </div>
        ))}
        {/* Trailing spacer so the last card can park with some right
            breathing room when scrolled to the end. */}
        <div className="w-6 shrink-0 sm:w-8" aria-hidden />
      </div>
    </div>
  );
}

interface SliderButtonProps {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}

function SliderButton({ dir, disabled, onClick }: SliderButtonProps) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous species" : "Next species"}
      className={cn(
        "press inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-all duration-200",
        "hover:border-[var(--brand)]/45 hover:text-[var(--brand)]",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
