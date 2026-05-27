import Link from "next/link";
import Image from "next/image";
import { SectionShell, SectionHeading } from "@/components/sections/section-shell";
import { PillButton } from "@/components/ui/pill-button";
import { CATEGORY_MARK } from "@/components/icons/species-icons";
import { fish, plants, shrimp, mosses, snails, getImage } from "@/data";
import type { CatalogueCategory } from "@/types/catalogue";

interface PillarsProps {
  eyebrow: string;
  title: string;
  items: ReadonlyArray<{
    title: string;
    slug: string;
    body: string;
    sources: string;
  }>;
}

/**
 * Each pillar pulls one signature entry from its category as the
 * representative specimen for the card image. Stable picks chosen to
 * read as "the classic" for that pillar; first item is the fallback.
 */
const PILLAR_META: Record<
  string,
  {
    href: string;
    count: number;
    featuredSlug: string;
    featuredAlt: string;
  }
> = {
  fish: {
    href: "/fish",
    count: fish.length,
    featuredSlug: "neon-tetra",
    featuredAlt: "Neon Tetra",
  },
  plants: {
    href: "/plants",
    count: plants.length,
    featuredSlug: "anubias-nana",
    featuredAlt: "Anubias Nana",
  },
  shrimp: {
    href: "/shrimp",
    count: shrimp.length,
    featuredSlug: "cherry-shrimp",
    featuredAlt: "Cherry Shrimp",
  },
  mosses: {
    href: "/mosses",
    count: mosses.length,
    featuredSlug: "java-moss",
    featuredAlt: "Java Moss",
  },
  snails: {
    href: "/snails",
    count: snails.length,
    featuredSlug: "zebra-nerite-snail",
    featuredAlt: "Zebra Nerite Snail",
  },
};

/**
 * Four category cards in a horizontal row (one per pillar). Each
 * carries: stamp-row at the top (count pill + audience pill + brand
 * mark), big serif-sans title, body copy, then a representative
 * specimen photo at the bottom with a Read-more pill tucked into the
 * corner. Mirrors the carousel-of-coloured-cards pattern from set-1
 * image-2.
 */
export function Pillars({ eyebrow, title, items }: PillarsProps) {
  return (
    <SectionShell className="relative isolate border-t border-border/60">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-grid opacity-40"
      />
      <SectionHeading eyebrow={eyebrow} title={title} />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((p) => {
          const m = PILLAR_META[p.slug] ?? PILLAR_META.fish;
          const image = getImage(m.featuredSlug);
          const CategoryMark = CATEGORY_MARK[p.slug as CatalogueCategory] ?? CATEGORY_MARK.fish;
          return (
            <Link
              key={p.slug}
              href={m.href}
              className="glass glass-edge lift group relative flex flex-col overflow-hidden rounded-3xl"
            >
              {/* Top stamp row */}
              <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-[var(--brand)]/25 bg-[var(--brand)]/8 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                    {m.count} species
                  </span>
                </div>
                <CategoryMark className="size-6 shrink-0 text-[var(--brand)] transition-transform duration-300 group-hover:rotate-[8deg]" />
              </div>

              {/* Title + body */}
              <div className="flex flex-1 flex-col gap-2 px-5 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
                <h3 className="text-display-tight text-2xl text-balance sm:text-[1.7rem]">
                  {p.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>

              {/* Specimen photo at the bottom */}
              <div className="relative aspect-[5/4] w-full overflow-hidden">
                {image ? (
                  <Image
                    src={image.src}
                    alt={m.featuredAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
                {/* Hover scrim — readability for the Read-more pill */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--abyss)]/60 to-transparent"
                />
                <div className="absolute bottom-3 right-3">
                  <span
                    className="press inline-flex items-center gap-2 rounded-full bg-card/95 px-3.5 py-1.5 text-[11px] font-medium text-foreground shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--abyss)_30%,transparent)] transition-colors group-hover:bg-[var(--brand)] group-hover:text-[var(--brand-foreground)]"
                    aria-hidden
                  >
                    Read more
                    <span className="flex size-5 items-center justify-center rounded-full bg-foreground/10 text-foreground/90 transition-colors group-hover:bg-[var(--brand-foreground)]/20 group-hover:text-[var(--brand-foreground)]">
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="size-3"
                        aria-hidden
                      >
                        <path
                          d="M3 6h6m0 0L6 3m3 3L6 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>
                </div>
              </div>

              {/* Sources line — subtle taxonomic footer */}
              <div className="border-t border-foreground/8 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70 sm:px-6">
                {p.sources}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <PillButton href="/fish" variant="ghost">
          Browse the full catalogue
        </PillButton>
      </div>
    </SectionShell>
  );
}
