import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { PreparedImage } from "@/lib/wikimedia";

interface ImageGalleryProps {
  images: PreparedImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  if (images.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((img) => (
        <figure
          key={img.url}
          className="glass glass-edge group relative overflow-hidden rounded-xl bg-muted"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              unoptimized
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 to-transparent"
            />
          </div>
          <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 text-[10px] leading-snug text-white/90">
            <span className="max-w-[70%] truncate">
              {img.author !== "Unknown" ? img.author : "Wikimedia"}
              {img.license && (
                <span className="text-white/70">{" · " + img.license}</span>
              )}
            </span>
            {img.descriptionUrl && (
              <a
                href={img.descriptionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 rounded-full bg-black/60 px-2 py-0.5 font-medium text-white backdrop-blur transition-colors hover:bg-black/80"
                aria-label="View on Wikimedia Commons"
              >
                Source
                <ExternalLink className="size-2.5" aria-hidden />
              </a>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
