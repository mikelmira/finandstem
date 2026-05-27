"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealTextProps {
  /** The full paragraph to reveal word-by-word as the user scrolls. */
  text: string;
  /** Optional eyebrow rendered above the paragraph. */
  eyebrow?: string;
  /** Extra class for the wrapper. */
  className?: string;
}

/**
 * Scroll-driven word-by-word highlight, Apple/Linear-style reveal.
 *
 * Structure: an outer section taller than the viewport, with the text
 * stuck to the centre via `sticky top-0`. As the section scrolls past
 * the viewport, we measure how far through that scroll range the user
 * is (0 → 1) and use that progress to brighten each word in sequence.
 *
 * Each word's opacity is a small lerp window so neighbouring words
 * blend rather than snapping. Respects prefers-reduced-motion by
 * skipping the scroll listener entirely and rendering everything at
 * full brightness immediately.
 */
export function ScrollRevealText({
  text,
  eyebrow,
  className,
}: ScrollRevealTextProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  // Detect reduced-motion once on mount.
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Scroll-progress driver. Throttled via requestAnimationFrame so
  // we don't run the calculation more than once per frame.
  React.useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) {
        // Section shorter than viewport — just snap to fully revealed
        // once the section's top reaches the top of the viewport.
        setProgress(r.top <= 0 ? 1 : 0);
        return;
      }
      const scrolled = -r.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
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
  }, [reducedMotion]);

  // Split into words. Keep punctuation glued to its word so the
  // visible spacing matches the original sentence.
  const words = React.useMemo(() => text.split(/(\s+)/), [text]);

  // Compute brightness per word. We treat the array of *non-whitespace*
  // tokens as the units that should brighten — whitespace passes
  // through as-is so the rendered paragraph keeps its natural flow.
  const visibleWords = words.filter((w) => /\S/.test(w));
  const litFloat = progress * visibleWords.length;

  // Helper: given a word's index in the visibleWords list, return an
  // opacity 0.18 (dim baseline) → 1.0 (fully lit). Uses a 1.4-word
  // window so the leading word fades in smoothly while the previous
  // word is still finishing.
  let wordIndex = 0;
  function opacityFor(token: string): number | null {
    if (!/\S/.test(token)) return null;
    const i = wordIndex++;
    const delta = litFloat - i;
    const lit = Math.max(0, Math.min(1, delta / 1.4));
    return 0.18 + 0.82 * lit;
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        // Tall outer so we have scroll room for the inner sticky
        // text. ~180vh feels right at typical line length — gives
        // the reveal enough scroll range without making the page
        // feel padded with empty space.
        "relative h-[180vh] border-t border-border/60",
        className,
      )}
      aria-label="What Fin & Stem is"
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">
          {eyebrow && (
            <p
              className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[var(--brand)]"
              style={{ opacity: 0.4 + 0.6 * progress }}
            >
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full bg-[var(--brand)]"
              />
              {eyebrow}
            </p>
          )}
          {/* Visually hidden full sentence for screen readers, the
              animated version below is decorative for them. */}
          <span className="sr-only">{text}</span>
          <p
            aria-hidden
            className="text-display-tight text-balance text-2xl leading-[1.35] text-foreground sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.25]"
          >
            {words.map((token, i) => {
              const opacity = opacityFor(token);
              if (opacity === null) {
                // Whitespace token — render verbatim so the natural
                // word spacing survives.
                return <React.Fragment key={i}>{token}</React.Fragment>;
              }
              return (
                <span
                  key={i}
                  className="transition-opacity duration-200 ease-out"
                  style={{ opacity }}
                >
                  {token}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
