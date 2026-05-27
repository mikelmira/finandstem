"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Wand2,
  Layers,
  GitCompareArrows,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionShell } from "@/components/sections/section-shell";
import { atmosphere, type AtmosphereImage } from "@/data/atmosphere";

interface Tool {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
  ctaLabel: string;
  image: AtmosphereImage;
}

const TOOLS: ReadonlyArray<Tool> = [
  {
    href: "/planner",
    eyebrow: "Tank Planner",
    title: "Build your tank, check the fit.",
    body: "Add the fish, plants, shrimp, mosses, and snails you're considering. We surface the temperature, pH, hardness, light, and CO₂ the combined tank needs, and flag every predator-prey or parameter conflict before you commit.",
    icon: Wand2,
    ctaLabel: "Open the planner",
    image: atmosphere.schoolDriftwood,
  },
  {
    href: "/compatibility",
    eyebrow: "Compatibility",
    title: "What else fits this tank?",
    body: "Pick any species as an anchor. We surface every fish, plant, shrimp, and moss in the catalogue whose water and tank-mate rules overlap.",
    icon: Layers,
    ctaLabel: "Pick an anchor",
    image: atmosphere.cichlidsTank,
  },
  {
    href: "/compare",
    eyebrow: "Compare",
    title: "Line up to four species, side by side.",
    body: "Direct parameter table. Temperature, pH, hardness, tank size, light, CO₂, and tank-mate safety in one row each. Spot the conflicts at a glance.",
    icon: GitCompareArrows,
    ctaLabel: "Start a comparison",
    image: atmosphere.twoTetras,
  },
];

/**
 * Scroll-jacked tool cards.
 *
 * As the user scrolls into the section, the page "freezes" (a sticky
 * inner pane pins to the viewport) and the cards rise from the
 * bottom one by one, each new card covering the previous. Once the
 * last card has settled into place the sticky pane releases and
 * normal scrolling resumes.
 *
 * Mechanics:
 *   · Outer section is N × 100vh tall so there's scroll room for N
 *     card transitions.
 *   · The sticky pane fills the viewport (h-screen, top-0) and
 *     contains the heading + all cards.
 *   · Each card's translateY is computed from the section's scroll
 *     progress: card i rises from translateY(110vh) at p = i/N
 *     to translateY(0) at p = (i + 1)/N. Cards stack via z-index.
 *
 * Reduced-motion users skip the animation and see the cards laid out
 * in a static column, same content, same order.
 */
export function ToolsBand() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const paneRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  // Scroll-jacking is heavy on phones (the tall outer section
  // sandwiches a small viewport, and the absolute-positioned cards
  // need horizontal headroom to read). Disable below the tablet
  // breakpoint and fall back to a plain vertical stack.
  const [isWide, setIsWide] = React.useState(false);

  React.useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wideMq = window.matchMedia("(min-width: 768px)");
    setReducedMotion(motionMq.matches);
    setIsWide(wideMq.matches);
    const onMotion = () => setReducedMotion(motionMq.matches);
    const onWide = (e: MediaQueryListEvent) => setIsWide(e.matches);
    motionMq.addEventListener("change", onMotion);
    wideMq.addEventListener("change", onWide);
    return () => {
      motionMq.removeEventListener("change", onMotion);
      wideMq.removeEventListener("change", onWide);
    };
  }, []);

  // Scroll-jacking only runs when the user is on a tablet+ viewport
  // AND hasn't asked for reduced motion. Anything else falls back to
  // the static stack.
  const useScrollStack = isWide && !reducedMotion;

  React.useEffect(() => {
    if (!useScrollStack) return;
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) {
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
  }, [useScrollStack]);

  // Mobile / reduced-motion fallback — render a simple static stack
  // with the same heading + card content, no scroll-jacking.
  if (!useScrollStack) {
    return (
      <SectionShell className="relative">
        <ToolsHeading />
        <ol className="mt-10 grid grid-cols-1 gap-6">
          {TOOLS.map((tool, i) => (
            <li key={tool.href}>
              <ToolCard tool={tool} index={i} total={TOOLS.length} />
            </li>
          ))}
        </ol>
      </SectionShell>
    );
  }

  const total = TOOLS.length;
  // Only the cards AFTER the first need a rise window — the first
  // card sits in its resting position from the start. So the section
  // needs (N - 1) × 110vh of scroll room.
  const risers = Math.max(1, total - 1);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${risers * 110}vh` }}
      aria-label="Tools"
    >
      <div
        ref={paneRef}
        className="sticky top-0 flex h-screen flex-col overflow-hidden"
      >
        <div className="mx-auto w-full max-w-6xl px-6 pt-24 sm:px-8 sm:pt-28">
          <ToolsHeading compact />
        </div>

        {/* Card stack arena. `flex-1` fills the rest of the sticky
            pane after the heading, and the inner cards are positioned
            absolutely with `inset-0` so they all share the *same*
            width AND height, matching the arena exactly. */}
        <div className="relative mx-auto mt-6 w-full max-w-6xl flex-1 px-6 pb-10 sm:px-8">
          <div className="relative h-full">
            {TOOLS.map((tool, i) => {
              // First card has no interaction — it sits at rest from
              // the start. Subsequent cards rise during their slice
              // of progress, [(i-1)/risers, i/risers].
              let translatePct = 0;
              if (i > 0) {
                const local = Math.max(
                  0,
                  Math.min(1, progress * risers - (i - 1)),
                );
                // Ease-out so the card lands with weight, not a snap.
                const eased = 1 - Math.pow(1 - local, 2);
                translatePct = (1 - eased) * 110;
              }
              return (
                <div
                  key={tool.href}
                  className="absolute inset-0 will-change-transform"
                  style={{
                    transform: `translate3d(0, ${translatePct}%, 0)`,
                    zIndex: i + 1,
                  }}
                >
                  <ToolCard tool={tool} index={i} total={total} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolsHeading({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "max-w-2xl" : "mb-12 max-w-2xl"}>
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
        Tools
      </span>
      <h2 className="text-display-tight mt-3 text-balance text-3xl sm:text-4xl">
        The catalogue, plus the cross-references no-one else builds.
      </h2>
      <p className="mt-4 text-base text-muted-foreground sm:text-lg">
        The species data is the foundation. The tools are what make it a
        planning resource rather than a lookup table.
      </p>
    </div>
  );
}

interface ToolCardProps {
  tool: Tool;
  index: number;
  total: number;
}

function ToolCard({ tool, index, total }: ToolCardProps) {
  return (
    <Link
      href={tool.href}
      className="glass glass-edge lift group block h-full w-full overflow-hidden rounded-3xl shadow-[0_24px_60px_-30px_color-mix(in_oklab,var(--abyss)_45%,transparent)] transition-colors duration-300 hover:border-[var(--brand)]/40"
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* Image plate */}
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-muted lg:aspect-auto lg:h-full">
          <Image
            src={tool.image.src}
            alt={tool.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-tr from-[var(--abyss)]/35 via-transparent to-transparent"
          />
          <span
            aria-hidden
            className="absolute left-5 top-5 inline-flex size-12 items-center justify-center rounded-full bg-background/85 text-[var(--brand)] backdrop-blur transition-transform duration-300 group-hover:rotate-[8deg]"
          >
            <tool.icon className="size-5" strokeWidth={1.85} />
          </span>
          <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur">
            <span
              aria-hidden
              className="inline-block size-1.5 rounded-full bg-[var(--brand)]"
            />
            {tool.eyebrow}
          </span>
        </div>

        {/* Prose column */}
        <div className="flex flex-col gap-5 p-7 sm:p-10 lg:p-12">
          <span
            aria-hidden
            className="text-display-tight text-3xl text-[var(--brand)]/70 sm:text-4xl"
          >
            {String(index + 1).padStart(2, "0")}
            <span className="text-muted-foreground/50">
              &nbsp;/&nbsp;{String(total).padStart(2, "0")}
            </span>
          </span>

          <h3 className="text-display-tight text-balance text-2xl leading-snug sm:text-3xl md:text-4xl">
            {tool.title}
          </h3>
          <p className="text-pretty text-base leading-relaxed text-foreground/85 sm:text-lg">
            {tool.body}
          </p>

          <span className="press mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--brand)]/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[var(--brand)]/35">
            {tool.ctaLabel}
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
