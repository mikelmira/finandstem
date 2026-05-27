import { SectionShell, SectionHeading } from "@/components/sections/section-shell";

interface EthosProps {
  eyebrow: string;
  title: string;
  body: string;
  points: ReadonlyArray<string>;
}

/**
 * Ethos — the "what this site is" section on the homepage.
 *
 * Background is a looping underwater video (autoplay, muted, no audio).
 * A dark gradient overlay sits between the video and the content so the
 * white heading + glass card stay legible. The video is hidden for users
 * with `prefers-reduced-motion` via the Tailwind `motion-reduce:hidden`
 * utility — the section falls back to the dark overlay alone.
 *
 * Layout: two-column on lg+ (heading on the left, glass-card list on
 * the right); single column stacked on mobile.
 */
export function Ethos({ eyebrow, title, body, points }: EthosProps) {
  return (
    <SectionShell className="relative isolate overflow-hidden border-t border-border/60">
      {/* Background video — covers the whole section, sits below all
          content. Autoplays muted on loop. */}
      <video
        aria-hidden
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 -z-30 size-full object-cover motion-reduce:hidden"
      >
        <source src="/videos/underwater-loop.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay — base layer that is always present, even
          when the video is hidden by prefers-reduced-motion. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-b from-[var(--abyss)]/85 via-[var(--abyss)]/70 to-[var(--abyss)]/90"
      />
      {/* Top/bottom feather strips so the section blends back into the
          cream-paper background of the surrounding page. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-16 bg-gradient-to-b from-background to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-t from-background to-transparent"
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Heading — text colour forced to white so it reads on the
            video / overlay regardless of how SectionHeading styles
            its children. */}
        <div className="[&_*]:!text-white [&_p]:!text-white/90">
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={body} />
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
