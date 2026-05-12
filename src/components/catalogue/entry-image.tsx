import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageAttribution } from "@/types/catalogue";

interface EntryImageProps {
  image: ImageAttribution;
  priority?: boolean;
  className?: string;
  ratio?: "video" | "wide" | "square" | "tall";
  showAttribution?: boolean;
}

const RATIO_CLASS: Record<NonNullable<EntryImageProps["ratio"]>, string> = {
  video: "aspect-[16/10]",
  wide: "aspect-[21/9]",
  square: "aspect-square",
  tall: "aspect-[4/5]",
};

export function EntryImage({
  image,
  priority = false,
  className,
  ratio = "video",
  showAttribution = true,
}: EntryImageProps) {
  return (
    <figure
      className={cn(
        "glass glass-edge relative overflow-hidden rounded-2xl bg-muted",
        className,
      )}
    >
      <div className={cn("relative w-full", RATIO_CLASS[ratio])}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent"
        />
      </div>
      {showAttribution && (
        <figcaption className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-4 text-[11px] leading-snug text-white sm:p-5">
          <span className="max-w-[70%] text-white/85">
            {image.author && image.author !== "Unknown" ? (
              <>
                Photo by{" "}
                <span className="font-medium text-white">{image.author}</span>
              </>
            ) : (
              "Wikimedia Commons"
            )}
            {image.license && (
              <>
                {" · "}
                {image.licenseUrl ? (
                  <a
                    href={image.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    {image.license}
                  </a>
                ) : (
                  image.license
                )}
              </>
            )}
          </span>
          {image.descriptionUrl && (
            <a
              href={image.descriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 font-medium text-white backdrop-blur transition-colors hover:bg-black/70"
            >
              Commons
              <ExternalLink className="size-3" aria-hidden />
            </a>
          )}
        </figcaption>
      )}
    </figure>
  );
}
