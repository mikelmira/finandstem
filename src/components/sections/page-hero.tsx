import Image from "next/image";
import { Eyebrow } from "@/components/sections/section-shell";
import { PhotoCredit } from "@/components/sections/photo-credit";
import { cn } from "@/lib/utils";
import type { AtmosphereImage } from "@/data/atmosphere";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  backgroundImage?: AtmosphereImage;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/60">
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
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-[oklch(0.14_0.025_195/0.78)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 -z-20 h-48 bg-gradient-to-b from-transparent to-background"
          />
        </>
      )}

      <div
        className={cn(
          "brand-aurora absolute inset-0 -z-10",
          backgroundImage ? "opacity-40 mix-blend-overlay" : "opacity-90",
        )}
        aria-hidden
      />
      {!backgroundImage && (
        <>
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

      <div className="mx-auto w-full max-w-6xl px-6 pt-20 pb-16 sm:px-8 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24">
        <div className="glass glass-edge animate-rise max-w-3xl rounded-3xl p-8 sm:p-10 md:p-12">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-display-tight mt-5 text-balance text-4xl sm:text-5xl md:text-[3.5rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {backgroundImage && <PhotoCredit image={backgroundImage} />}
    </section>
  );
}
