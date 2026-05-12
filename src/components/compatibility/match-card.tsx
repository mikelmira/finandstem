import Link from "next/link";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";
import { getImage } from "@/data";
import type { MatchReason } from "@/lib/catalogue/compatibility";

interface MatchCardProps {
  entry: CatalogueEntry;
  reasons: MatchReason[];
}

export function MatchCard({ entry, reasons }: MatchCardProps) {
  const meta = CATEGORY_META[entry.category];
  const image = getImage(entry.slug);
  return (
    <Link
      href={`${meta.path}/${entry.slug}`}
      className="glass glass-edge lift group flex gap-4 overflow-hidden rounded-2xl p-3"
    >
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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
          <h3 className="truncate text-sm font-semibold">{entry.commonName}</h3>
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {meta.singular}
          </span>
        </div>
        <p className="truncate text-xs italic text-muted-foreground">
          {entry.scientificName}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {reasons.map((r) => (
            <span
              key={r.badge}
              title={r.description}
              className="inline-flex items-center rounded-full border border-[var(--brand)]/35 bg-[var(--brand)]/10 px-2 py-0.5 text-[10px] font-medium text-foreground"
            >
              {r.badge}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
