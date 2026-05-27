import Image from "next/image";
import { cn } from "@/lib/utils";
import { PhotoCredit } from "@/components/sections/photo-credit";
import { PillButton } from "@/components/ui/pill-button";
import type { AtmosphereImage } from "@/data/atmosphere";

interface HeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  stats?: ReadonlyArray<{ value: string; label: string }>;
  backgroundImage?: AtmosphereImage;
}

/**
 * Homepage Hero — full-bleed background photo with the title block
 * sitting directly on top. No card, no glass wrapper. Matches the
 * pattern used on every species detail page.
 *
 * The hero is intentionally tall (min-h-[78vh]) so the H1 + subtitle +
 * CTAs all sit comfortably with breathing room around them. Stats
 * grid sits at the bottom as a glass strip — translucent enough that
 * the photo still reads behind it, opaque enough that the numbers
 * stay legible.
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  stats,
  backgroundImage,
}: HeroProps) {
  const hasPhoto = Boolean(backgroundImage);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        hasPhoto ? "min-h-[78vh]" : "",
      )}
    >
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
          {/* Dark dual gradient so white H1 + subtitle read on any image.
              Slightly stronger top than bottom because the floating
              header pill sits in that band. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-gradient-to-b from-black/60 via-black/30 to-black/70"
          />
          {/* Bottom fade so the next section transitions cleanly. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 -z-20 h-40 bg-gradient-to-b from-transparent to-background"
          />
        </>
      )}

      {!hasPhoto && (
        <>
          <div
            className="brand-aurora absolute inset-0 -z-10 opacity-90"
            aria-hidden
          />
          <div className="bg-grid absolute inset-0 -z-10 opacity-60" aria-hidden />
          {/* Oversized wordmark bleed for the no-photo fallback. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-[-2vw] -z-10 flex justify-center overflow-hidden"
            aria-hidden
          >
            <span className="wordmark-bleed text-[28vw] leading-none whitespace-nowrap sm:text-[26vw] md:text-[22vw] lg:text-[18vw] xl:text-[16rem]">
              Fin &amp; Stem
            </span>
          </div>
        </>
      )}

      <div
        className={cn(
          "relative mx-auto flex w-full max-w-6xl flex-col px-6 sm:px-8",
          hasPhoto
            ? "min-h-[78vh] pt-28 pb-16 sm:pt-32 sm:pb-20"
            : "pt-20 pb-32 sm:pt-28 sm:pb-40 md:pt-32 md:pb-48",
        )}
      >
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
              "text-display-tight mt-6 text-balance",
              hasPhoto
                ? "text-[2.5rem] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.55)] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.75rem]"
                : "text-[2.5rem] text-foreground sm:text-[3.25rem] md:text-[4rem] lg:text-[4.75rem]",
            )}
          >
            {title}
          </h1>

          <p
            className={cn(
              "mt-6 max-w-2xl text-pretty text-base leading-relaxed sm:text-lg md:text-xl",
              hasPhoto
                ? "text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
                : "text-muted-foreground",
            )}
          >
            {subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <PillButton href={primaryCta.href} size="lg">
              {primaryCta.label}
            </PillButton>
            {secondaryCta && (
              <PillButton href={secondaryCta.href} variant="ghost" size="lg">
                {secondaryCta.label}
              </PillButton>
            )}
          </div>
        </div>

        {stats && stats.length > 0 && (
          <dl
            className={cn(
              "mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-3",
              hasPhoto
                ? "border border-white/15 bg-white/8 backdrop-blur-md"
                : "border border-border/70 bg-border/60",
            )}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "flex flex-col gap-1 p-6 sm:p-7",
                  hasPhoto ? "bg-black/25 backdrop-blur-md" : "glass",
                )}
              >
                <dd
                  className={cn(
                    "text-display text-3xl sm:text-4xl",
                    hasPhoto ? "text-white" : "text-foreground",
                  )}
                >
                  {stat.value}
                </dd>
                <dt
                  className={cn(
                    "text-sm leading-relaxed",
                    hasPhoto ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        )}
      </div>

      {backgroundImage && <PhotoCredit image={backgroundImage} />}
    </section>
  );
}
