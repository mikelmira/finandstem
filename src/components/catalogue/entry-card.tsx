import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";
import { Difficulty } from "@/components/catalogue/difficulty";
import { WaveMark } from "@/components/wave-mark";
import { getImage } from "@/data";
import { allEntries } from "@/data";

interface EntryCardProps {
  entry: CatalogueEntry;
}

/**
 * Entry card — restyled as a field-guide postage-stamp specimen card.
 *
 * Top row: brand mark left, big numeric right (entry's index within
 * its category, padded to two digits — feels like a catalog plate).
 *
 * Middle: title + scientific name in serif, then the careSummary as
 * the specimen's body text.
 *
 * Bottom: a half-bleed cover image with the category eyebrow over
 * the photo, plus difficulty and origin meta.
 */
export function EntryCard({ entry }: EntryCardProps) {
  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);
  const index = computeIndex(entry);

  return (
    <Link
      href={`${meta.path}/${entry.slug}`}
      className="glass glass-edge lift group relative flex flex-col overflow-hidden rounded-2xl transition-colors duration-300 hover:border-[var(--brand)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Stamp row — brand mark + category eyebrow + numeral */}
      <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <WaveMark
            className="size-5 text-[var(--brand)]"
            aria-hidden
          />
          {meta.singular}
        </span>
        <span
          aria-hidden
          className="stamp-numeral text-base sm:text-lg"
        >
          {index}
        </span>
      </div>

      {/* Title block */}
      <div className="flex flex-col gap-1 px-5 pt-3 pb-4 sm:px-6">
        <h3 className="text-display-tight text-2xl sm:text-[1.65rem]">
          {entry.commonName}
        </h3>
        <p className="text-sm italic text-muted-foreground">
          {entry.scientificName}
        </p>
      </div>

      {/* Cover image — half-bleed, like the illustration plate on a
          field-guide entry. */}
      <div className="relative aspect-[5/3] w-full overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff
              className="size-8 text-muted-foreground/40"
              aria-hidden
            />
          </div>
        )}
        {/* Subtle bottom scrim to seat any caption legibility — kept
            because we still allow image scrims as functional overlays. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--abyss)]/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <ArrowUpRight
          className="absolute right-3 top-3 size-7 rounded-full bg-card/95 p-1.5 text-foreground shadow-[0_2px_6px_-2px_color-mix(in_oklab,var(--moss)_30%,transparent)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-[8deg] group-hover:bg-[var(--brand)] group-hover:text-[var(--brand-foreground)]"
          aria-hidden
        />
      </div>

      {/* Body — the editorial entry text. Hidden line-clamp keeps every
          card the same height. */}
      <div className="flex flex-1 flex-col gap-3 px-5 pt-4 pb-5 sm:px-6 sm:pb-6">
        <p className="line-clamp-3 text-sm leading-relaxed text-foreground/80">
          {entry.careSummary}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
          <Difficulty level={entry.difficulty} />
          <span className="truncate text-right text-[11px]">{entry.origin}</span>
        </div>
      </div>
    </Link>
  );
}

/**
 * Stable 1-based index of this entry within its category — used as
 * the stamp-numeral in the top-right corner. Pads to 2 digits so it
 * always reads as a catalogue plate number (`01`, `12`, etc.).
 */
function computeIndex(entry: CatalogueEntry): string {
  const same = allEntries.filter((e) => e.category === entry.category);
  const i = same.findIndex((e) => e.slug === entry.slug);
  return String(i + 1).padStart(2, "0");
}
