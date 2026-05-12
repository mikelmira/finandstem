import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";
import { getImage } from "@/data";
import type { MatchReason } from "@/lib/catalogue/compatibility";

interface MatchCardProps {
  entry: CatalogueEntry;
  reasons: MatchReason[];
  index?: number;
}

export function MatchCard({ entry, reasons, index = 0 }: MatchCardProps) {
  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);
  return (
    <Link
      href={`${meta.path}/${entry.slug}`}
      style={{ ["--i" as string]: index }}
      className="glass glass-edge lift animate-fade-up group flex gap-4 overflow-hidden rounded-2xl p-3 transition-colors duration-300 hover:border-[var(--brand)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
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
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold transition-colors duration-300 group-hover:text-[var(--brand)]">
            {entry.commonName}
          </h3>
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {meta.singular}
          </span>
        </div>
        <p className="truncate text-xs italic text-muted-foreground">
          {entry.scientificName}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {reasons.map((r, i) => (
            <span
              key={r.badge}
              title={r.description}
              style={{
                transitionDelay: `${i * 40}ms`,
              }}
              className="inline-flex items-center rounded-full border border-[var(--brand)]/35 bg-[var(--brand)]/10 px-2 py-0.5 text-[10px] font-medium text-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[var(--brand)]/65 group-hover:bg-[var(--brand)]/18"
            >
              {r.badge}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
