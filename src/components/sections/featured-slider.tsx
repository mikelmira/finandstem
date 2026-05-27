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
 * Horizontal slider of EntryCards. Uses native scroll-snap on the
 * container so flicking and swiping just work — no JS for the
 * actual paging. The prev/next buttons on top scroll programmatically
 * by one card-width when clicked, and disable themselves at the
 * track ends. Buttons are hidden on touch-only / small screens
 * because the native swipe already covers that case.
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
    // First child is the slide spacer; pick the first real card's
    // width to scroll by exactly one card + gap.
    const card =
      el.querySelector<HTMLElement>("[data-slide]") ?? el.firstElementChild;
    const step = card instanceof HTMLElement ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  return (
    <div className="relative mt-10">
      {/* Slider controls — desktop only. Touch users get native swipe. */}
      <div className="absolute -top-14 right-0 hidden items-center gap-2 sm:flex">
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

      {/* The scroll track — flex row with snap on each slide. */}
      <div
        ref={trackRef}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scroll-smooth",
          // Hide scrollbar visually but keep accessibility intact —
          // these will be available via keyboard tab + arrow.
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        aria-label="Beginner-friendly species"
      >
        {entries.map((entry) => (
          <div
            key={`${entry.category}-${entry.slug}`}
            data-slide
            className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[23%]"
          >
            <EntryCard entry={entry} />
          </div>
        ))}
      </div>

      {/* Edge fades — visual cue that there's more content to scroll. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent transition-opacity",
          atStart ? "opacity-0" : "opacity-100",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent transition-opacity",
          atEnd ? "opacity-0" : "opacity-100",
        )}
      />
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
        "press inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-all duration-200",
        "hover:border-[var(--brand)]/45 hover:text-[var(--brand)]",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground",
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
