import data from "@/data/topic-images.generated.json";
import { cn } from "@/lib/utils";

export interface TopicImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  author: string;
  license: string;
  licenseUrl?: string | null;
  sourceUrl?: string | null;
  context?: string | null;
}

const IMAGES = data as unknown as Record<string, TopicImage[]>;

/** Verified, attributed photos for a topic, e.g. topicImages("algae", "hair-algae"). */
export function topicImages(group: string, slug: string): TopicImage[] {
  return IMAGES[`${group}:${slug}`] ?? [];
}

/**
 * Photo(s) for an algae, disease, deficiency or similar topic page, with the
 * author, licence and source link that the open licence requires.
 */
export function TopicFigure({
  group,
  slug,
  className,
}: {
  group: string;
  slug: string;
  className?: string;
}) {
  const images = topicImages(group, slug);
  if (images.length === 0) return null;
  return (
    <div className={cn(images.length > 1 ? "grid gap-4 sm:grid-cols-2" : "", className)}>
      {images.map((img, i) => (
        <figure key={img.src}>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              loading={i === 0 ? "eager" : "lazy"}
              className={cn(
                "w-full object-cover",
                images.length > 1 ? "aspect-[4/3]" : "max-h-[28rem]",
              )}
            />
          </div>
          <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {img.alt}. Photo: {img.author}
            {" · "}
            {img.licenseUrl ? (
              <a
                href={img.licenseUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {img.license}
              </a>
            ) : (
              img.license
            )}
            {img.sourceUrl && (
              <>
                {" · "}
                <a
                  href={img.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Wikimedia Commons
                </a>
              </>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
