import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";
import { Difficulty } from "@/components/catalogue/difficulty";
import { getImage } from "@/data";

interface EntryCardProps {
  entry: CatalogueEntry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);

  return (
    <Link
      href={`${meta.path}/${entry.slug}`}
      className="glass glass-edge lift group relative flex flex-col overflow-hidden rounded-2xl transition-colors duration-300 hover:border-[var(--brand)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageOff
              className="size-8 text-muted-foreground/40"
              aria-hidden
            />
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[var(--abyss)]/55 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--abyss)]/65 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/85 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur transition-transform duration-300 group-hover:-translate-y-0.5">
          {meta.singular}
        </span>
        <ArrowUpRight
          className="absolute right-3 top-3 size-6 rounded-full bg-background/85 p-1 text-foreground transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-[8deg] group-hover:bg-[var(--brand)]/95 group-hover:text-[var(--brand-foreground)]"
          aria-hidden
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-6 sm:p-6">
        <div>
          <h3 className="text-display-tight text-xl sm:text-2xl">
            {entry.commonName}
          </h3>
          <p className="mt-1 text-sm italic text-muted-foreground">
            {entry.scientificName}
          </p>
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
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
