import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { allEntries, getImage } from "@/data";
import { CATEGORY_META, type CatalogueCategory } from "@/types/catalogue";

interface SpeciesCardProps {
  /** Catalogue slug — must match one entry in src/data. */
  slug: string;
  /**
   * Disambiguator. Two different categories can theoretically share a slug;
   * passing the category guarantees the right card is rendered.
   */
  category?: CatalogueCategory;
}

/**
 * Inline catalogue card for MDX guides. Drops into the prose with a single
 * tag — `<SpeciesCard slug="neon-tetra" />` — and renders the photo, name,
 * scientific binomial, and a one-line origin pull.
 *
 * Links to the canonical species page so internal anchor text reads naturally
 * ("the neon tetra") while still earning crawl equity for the linked page.
 *
 * Renders a visible error in dev when the slug isn't found so typos surface
 * immediately rather than silently breaking the article.
 */
export function SpeciesCard({ slug, category }: SpeciesCardProps) {
  const entry =
    category != null
      ? allEntries.find((e) => e.slug === slug && e.category === category)
      : allEntries.find((e) => e.slug === slug);

  if (!entry) {
    return (
      <span className="my-2 inline-block rounded-md border border-destructive/40 bg-destructive/5 px-2 py-1 text-xs text-destructive">
        SpeciesCard: no catalogue entry for slug &quot;{slug}&quot;
      </span>
    );
  }

  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);

  return (
    <Link
      href={`${meta.path}/${entry.slug}`}
      data-mdx="species-card"
      className="glass glass-edge lift group my-6 flex items-stretch overflow-hidden rounded-2xl no-underline transition-colors hover:border-[var(--brand)]/40"
    >
      <div className="relative aspect-square w-28 shrink-0 overflow-hidden bg-muted sm:w-36">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 112px, 144px"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff
              className="size-6 text-muted-foreground/40"
              aria-hidden
            />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1.5 p-4 sm:p-5">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
          {meta.singular}
          {entry.keptByAuthor && (
            <span
              aria-label="Mike keeps this species"
              className="rounded-full bg-[var(--brand)]/10 px-1.5 py-0.5 text-[9px] tracking-[0.18em] text-[var(--brand)]"
            >
              Kept
            </span>
          )}
        </span>
        <h3 className="text-display-tight text-lg leading-tight sm:text-xl">
          {entry.commonName}
        </h3>
        <p className="text-xs italic text-muted-foreground">
          {entry.scientificName}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
          {entry.origin}
        </p>
      </div>
      <span className="flex shrink-0 items-center pr-4 sm:pr-5">
        <ArrowUpRight
          className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
          aria-hidden
        />
      </span>
    </Link>
  );
}
