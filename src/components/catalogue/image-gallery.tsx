import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { PreparedImage } from "@/lib/wikimedia";

interface ImageGalleryProps {
  images: PreparedImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  if (images.length === 0) return null;
  return (
    <div className="stagger grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((img, i) => (
        <figure
          key={img.url}
          style={{ ["--i" as string]: Math.min(i, 6) }}
          className="glass glass-edge animate-fade-up group relative overflow-hidden rounded-xl bg-muted transition-all duration-300 hover:border-[var(--brand)]/40 hover:shadow-[0_18px_40px_-18px_color-mix(in_oklab,var(--brand)_30%,transparent)]"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
              unoptimized
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--abyss)]/70 to-transparent transition-opacity duration-300 group-hover:from-[var(--abyss)]/90"
            />
          </div>
          <figcaption className="caption-reveal absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-[10px] leading-snug text-foreground/95">
            <span className="max-w-[70%] truncate">
              {img.author !== "Unknown" ? img.author : "Wikimedia"}
              {img.license && (
                <span className="text-foreground/75">{" · " + img.license}</span>
              )}
            </span>
            {img.descriptionUrl && (
              <a
                href={img.descriptionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex items-center gap-0.5 rounded-full bg-[var(--abyss)]/70 px-2 py-0.5 font-medium text-foreground backdrop-blur transition-all duration-200 hover:bg-[var(--brand)]/90 hover:text-[var(--brand-foreground)]"
                aria-label="View image source"
              >
                Source
                <ExternalLink
                  className="size-2.5 transition-transform duration-200 group-hover:rotate-[8deg]"
                  aria-hidden
                />
              </a>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
