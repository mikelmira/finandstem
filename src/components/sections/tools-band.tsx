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
    body: "Add the fish, plants, shrimp, mosses, and snails you're considering. We surface the temperature, pH, hardness, light, and CO₂ the combined tank needs — and flag every predator-prey or parameter conflict before you commit.",
    icon: Wand2,
    ctaLabel: "Open the planner",
    image: atmosphere.aquascapeWide,
  },
  {
    href: "/compatibility",
    eyebrow: "Compatibility",
    title: "What else fits this tank?",
    body: "Pick any species as an anchor. We surface every fish, plant, shrimp, and moss in the catalogue whose water and tank-mate rules overlap.",
    icon: Layers,
    ctaLabel: "Pick an anchor",
    image: atmosphere.driftwoodMoss,
  },
  {
    href: "/compare",
    eyebrow: "Compare",
    title: "Line up to four species, side by side.",
    body: "Direct parameter table. Temperature, pH, hardness, tank size, light, CO₂, and tank-mate safety in one row each. Spot the conflicts at a glance.",
    icon: GitCompareArrows,
    ctaLabel: "Start a comparison",
    image: atmosphere.nanoTank,
  },
];

/**
 * Scroll-stack tool cards.
 *
 * The three cards stack vertically inside an outer section that has
 * scroll room (~75vh per card). Each card is `position: sticky` with a
 * staggered `top` value so successive cards land slightly below the
 * previous, building a deck-of-cards look as the user scrolls. Once
 * the third card has reached its sticky position the section ends and
 * normal page scrolling resumes.
 *
 * Each card is full-width (no 3-column split) with a 5:4 image plate
 * on the left and the prose/CTA on the right; stacks vertically on
 * mobile.
 *
 * No JS — pure CSS sticky positioning. Works the same on every modern
 * browser; reduced-motion users still see the cards stack because the
 * effect is driven by document scroll, not animation.
 */
export function ToolsBand() {
  return (
    <SectionShell className="relative">
      <div className="mb-12 max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
          Tools
        </span>
        <h2 className="text-display-tight mt-3 text-balance text-3xl sm:text-4xl">
          The catalogue, plus the cross-references no-one else builds.
        </h2>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          The species data is the foundation. The tools are what make it
          a planning resource rather than a lookup table.
        </p>
      </div>

      {/* Scroll-stack track. The cards inside are sticky, so the natural
          height of this container is what carries the scroll distance.
          Each card slot is sized so that the previous card has time to
          settle into its sticky position before the next one rises up.
      */}
      <ol className="relative">
        {TOOLS.map((tool, i) => (
          <li
            key={tool.href}
            className="relative"
            // Per-card sticky offset — stagger by 14px per card so the
            // tops of the previous cards remain visible as a deck.
            style={{ ["--stack-i" as string]: i }}
          >
            <ToolCard tool={tool} index={i} total={TOOLS.length} />
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

interface ToolCardProps {
  tool: Tool;
  index: number;
  total: number;
}

function ToolCard({ tool, index, total }: ToolCardProps) {
  const isLast = index === total - 1;
  return (
    <div
      // Each slot reserves ~75vh of scroll distance so the next card has
      // room to climb into view. The very last card needs no scroll
      // distance after it — it just settles at the top and the section
      // ends.
      className={isLast ? "" : "pb-[55vh] sm:pb-[60vh]"}
    >
      <div
        className="sticky"
        // Stagger top by 14px per card so peeks layer cleanly.
        style={{ top: `calc(6rem + ${index * 14}px)` }}
      >
        <Link
          href={tool.href}
          className="glass glass-edge lift group block overflow-hidden rounded-3xl shadow-[0_24px_60px_-30px_color-mix(in_oklab,var(--abyss)_45%,transparent)] transition-colors duration-300 hover:border-[var(--brand)]/40"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            {/* Image plate */}
            <div className="relative aspect-[5/4] w-full overflow-hidden bg-muted lg:aspect-auto">
              <Image
                src={tool.image.src}
                alt={tool.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
              {/* Vignette so the icon chip + eyebrow badge read on bright
                  frames. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-tr from-[var(--abyss)]/35 via-transparent to-transparent"
              />
              {/* Icon chip — top-left */}
              <span
                aria-hidden
                className="absolute left-5 top-5 inline-flex size-12 items-center justify-center rounded-full bg-background/85 text-[var(--brand)] backdrop-blur transition-transform duration-300 group-hover:rotate-[8deg]"
              >
                <tool.icon className="size-5" strokeWidth={1.85} />
              </span>
              {/* Eyebrow chip — bottom-left over the photo */}
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
              {/* Numeric stamp — keeps the eye registering the deck order */}
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
      </div>
    </div>
  );
}
