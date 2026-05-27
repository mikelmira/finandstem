"use client";

import * as React from "react";
import { EntryCard } from "@/components/catalogue/entry-card";
import { cn } from "@/lib/utils";
import type { CatalogueEntry } from "@/types/catalogue";

interface FeaturedSliderProps {
  entries: ReadonlyArray<CatalogueEntry>;
}

/**
 * Horizontal-on-vertical scroll carousel. Apple-product-page pattern.
 *
 * The outer section is taller than the viewport (a few hundred vh).
 * The inner pane is `position: sticky` so it pins to the top of the
 * viewport while the section scrolls. As the user scrolls down
 * through the section, the card row inside the pinned pane
 * translates from right to left — so cards enter from the right
 * edge, drift across the viewport, and exit on the left. Once the
 * last card has reached its target position the section ends and
 * normal scrolling resumes.
 *
 * All cards are stretched to a uniform height via flex `items-stretch`
 * — `EntryCard` already lays out as `flex h-full flex-col` so each
 * slot fills the same height regardless of body length.
 *
 * Mobile: native horizontal swipe in a scroll-snap row instead. The
 * vertical-scroll trick is desktop / wide-viewport only because on a
 * narrow phone there's no headroom for a tall sticky section.
 */
export function FeaturedSlider({ entries }: FeaturedSliderProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = React.useState(0);
  const [isWide, setIsWide] = React.useState(false);

  // Decide whether to use the parallax-style scroll (wide screens)
  // or the native swipe fallback (touch / narrow viewports).
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsWide(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Scroll-progress driver for the desktop horizontal slide.
  React.useEffect(() => {
    if (!isWide) {
      setTranslate(0);
      return;
    }
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setTranslate(0);
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const overshoot = track.scrollWidth - window.innerWidth + 128; // gutter
      if (overshoot <= 0) {
        setTranslate(0);
        return;
      }
      const total = r.height - window.innerHeight;
      const scrolled = -r.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      setTranslate(progress * overshoot);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isWide, entries.length]);

  return (
    <section
      ref={sectionRef}
      // Outer scroll-driver. Tall enough to give the inner track a
      // smooth horizontal ride from first to last card. Drop to a
      // single viewport height on mobile where we use native swipe.
      className={cn("relative mt-10", isWide && "h-[280vh]")}
      aria-label="Beginner-friendly species"
    >
      <div
        className={cn(
          isWide
            ? "sticky top-0 flex h-screen items-center overflow-hidden"
            : "",
        )}
      >
        <div
          ref={trackRef}
          className={cn(
            // Equal-height row, `items-stretch` is the flex default
            // but called out here to make the intent explicit.
            "flex items-stretch gap-5",
            isWide
              ? // Desktop: cards enter from off-screen right and we
                // translate the whole row leftward via JS. Padding-left
                // matches the page gutter so the first card sits in
                // line with the section heading above it.
                "pl-6 sm:pl-8 will-change-transform"
              : // Mobile: native scroll-snap swipe. Smooth, no JS.
                "snap-x snap-mandatory overflow-x-auto pb-4 scroll-smooth pl-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
          style={
            isWide
              ? { transform: `translate3d(${-translate}px, 0, 0)` }
              : undefined
          }
        >
          {entries.map((entry) => (
            <div
              key={`${entry.category}-${entry.slug}`}
              className={cn(
                "shrink-0 snap-start",
                // Same width on every breakpoint so cards stay
                // consistent. `flex` keeps EntryCard at h-full so
                // they line up to the tallest in the row.
                "flex w-[78%] sm:w-[44%]",
                isWide && "lg:w-[400px]",
              )}
            >
              <EntryCard entry={entry} />
            </div>
          ))}
          {/* Trailing spacer so the last card can land with right-side
              breathing room when the track finishes translating. */}
          <div className="w-6 shrink-0 sm:w-8" aria-hidden />
        </div>
      </div>
    </section>
  );
}
