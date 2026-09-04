import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionShell, SectionHeading } from "@/components/sections/section-shell";
import { BackgroundVideo } from "@/components/sections/background-video";

interface EthosProps {
  eyebrow: string;
  title: string;
  body: string;
  points: ReadonlyArray<string>;
}

/**
 * Ethos, the "what this site is" section on the homepage.
 *
 * Full-bleed looping underwater video as the background. No
 * gradient overlays, the heading and body text rely on
 * `drop-shadow` for legibility across whatever frame the video
 * happens to be on. Glass card on the right already adapts to any
 * backdrop.
 *
 * Layout sizes the section to 90vh on desktop and ~70vh on mobile
 * (clamped so the section never collapses below content height on
 * small screens). Two-column grid on lg+ centred vertically inside
 * the section; single column stacked on mobile.
 *
 * Video is hidden when `prefers-reduced-motion: reduce` is set; the
 * section then falls back to the cream paper background.
 */
export function Ethos({ eyebrow, title, body, points }: EthosProps) {
  return (
    <SectionShell
      className="relative isolate flex min-h-[70vh] items-center overflow-hidden border-t border-border/60 lg:min-h-[90vh]"
      bleed
      containerClassName="py-16 sm:py-20 lg:py-24"
    >
      {/* Dark fallback so the white text stays legible before the video
          loads (or when reduced-motion or a slow connection skips it). */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-br from-[#08171f] via-[#0b2029] to-[#0d2833]"
      />
      {/* Background video, lazy-loaded once the section nears the viewport so
          it never sits in the initial page load. */}
      <BackgroundVideo
        src="/videos/underwater-loop.mp4"
        className="absolute inset-0 -z-10 size-full object-cover motion-reduce:hidden"
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Heading column, text colour forced to white with a
            drop-shadow so it stays legible on any video frame,
            without resorting to an overlay. */}
        <div className="[&_h2]:!text-white [&_h2]:drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)] [&_p]:!text-white/95 [&_p]:drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] [&_span]:!text-white/85">
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={body} />
          <div className="mt-8">
            <Link
              href="/history-of-aquascaping"
              className="press inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--brand)]/30 transition-all hover:-translate-y-0.5"
            >
              Read the history of aquascaping
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
        <ul className="glass glass-edge space-y-4 rounded-2xl p-7 sm:p-8">
          {points.map((point, i) => (
            <li key={point} className="flex gap-3.5 text-sm sm:text-base">
              <span
                aria-hidden
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] font-mono text-xs text-[var(--brand)]"
              >
                {i + 1}
              </span>
              <span className="pt-1 leading-relaxed text-foreground/90">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
