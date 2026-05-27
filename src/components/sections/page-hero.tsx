import Image from "next/image";
import { PhotoCredit } from "@/components/sections/photo-credit";
import {
  Breadcrumb,
  type BreadcrumbItem,
} from "@/components/sections/breadcrumb";
import { cn } from "@/lib/utils";
import type { AtmosphereImage } from "@/data/atmosphere";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  backgroundImage?: AtmosphereImage;
  /** Trail rendered above the eyebrow. "Home" is prepended automatically. */
  breadcrumb?: ReadonlyArray<BreadcrumbItem>;
}

/**
 * PageHero, the shared full-bleed hero used by every non-homepage page.
 *
 * Pattern matches the species detail hero (entry-detail.tsx): the
 * background photo runs edge-to-edge with a dark dual gradient
 * (heavier at top + bottom for legibility against the floating
 * header pill and the page content below it). The eyebrow, breadcrumb,
 * H1, and subtitle sit directly on the photo as white text with a
 * drop-shadow, no card, no glass wrapper.
 *
 * Without a backgroundImage the hero falls back to a tinted brand
 * gradient with the title block in normal foreground text. The
 * "with photo" pattern is the canonical one across the site.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
  breadcrumb,
}: PageHeroProps) {
  const hasPhoto = Boolean(backgroundImage);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-border/60",
        hasPhoto ? "min-h-[90vh] md:min-h-[60vh]" : "",
      )}
    >
      {/* Background photo + dark overlay (when a photo is provided) */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0 -z-30">
            <Image
              src={backgroundImage.src}
              alt={backgroundImage.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          {/* Dual gradient, heavier at the top (so the floating header pill
              reads cleanly) and at the bottom (so the H1 has contrast),
              lighter through the middle so the photo stays present. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-gradient-to-b from-black/60 via-black/25 to-black/70"
          />
          {/* Final fade into the page background so the next section
              transitions cleanly without a hard edge. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 -z-20 h-32 bg-gradient-to-b from-transparent to-background"
          />
        </>
      )}

      {/* Fallback decorative layers when no photo is set, keep the
          brand aurora wash and the oversized wordmark behind the text. */}
      {!hasPhoto && (
        <>
          <div
            className="brand-aurora absolute inset-0 -z-10 opacity-90"
            aria-hidden
          />
          <div className="bg-grid absolute inset-0 -z-10 opacity-50" aria-hidden />
          <div
            className="pointer-events-none absolute inset-x-0 -bottom-6 -z-10 flex justify-center overflow-hidden sm:-bottom-4"
            aria-hidden
          >
            <span className="wordmark-bleed text-[24vw] leading-none whitespace-nowrap md:text-[18vw] xl:text-[12rem]">
              {eyebrow}
            </span>
          </div>
        </>
      )}

      <div
        className={cn(
          "relative mx-auto flex w-full max-w-6xl flex-col px-6 sm:px-8",
          hasPhoto
            ? "min-h-[90vh] md:min-h-[60vh] pt-24 pb-16 sm:pt-28 sm:pb-20"
            : "pt-20 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24",
        )}
      >
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb
            items={breadcrumb}
            tone={hasPhoto ? "light" : undefined}
            className="mb-6"
          />
        )}

        {/* Title block pushed toward the bottom of the photo when a
            background image is set (matches the species hero); centered
            naturally when no photo. */}
        <div
          className={cn(
            "animate-rise max-w-3xl",
            hasPhoto && "mt-auto",
          )}
        >
          <p
            className={cn(
              "text-xs font-medium uppercase tracking-[0.22em]",
              hasPhoto
                ? "inline-flex items-center gap-2 text-white/85"
                : "text-[var(--brand)]",
            )}
          >
            {hasPhoto && (
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full bg-[var(--brand)]"
              />
            )}
            {eyebrow}
          </p>

          <h1
            className={cn(
              "text-display-tight mt-5 text-balance leading-[1.2]",
              hasPhoto
                ? "text-4xl text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl lg:text-[4.5rem]"
                : "text-4xl text-foreground sm:text-5xl md:text-[3.5rem]",
            )}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={cn(
                "mt-5 text-pretty text-base leading-relaxed sm:text-lg md:text-xl",
                hasPhoto
                  ? "max-w-2xl text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
                  : "text-muted-foreground",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {backgroundImage && <PhotoCredit image={backgroundImage} />}
    </section>
  );
}
