import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/sections/section-shell";
import { PhotoCredit } from "@/components/sections/photo-credit";
import { PillButton } from "@/components/ui/pill-button";
import { WaveMark } from "@/components/wave-mark";
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

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  stats,
  backgroundImage,
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Photographic background — desaturated and warmly tinted so the
          image sits behind the page like a vintage botanical plate
          rather than competing with the cream paper foreground. */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0 -z-30">
            <Image
              src={backgroundImage.src}
              alt={backgroundImage.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover [filter:saturate(0.7)_sepia(0.18)]"
            />
          </div>
          {/* Warm cream wash — softens the photo into the page. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-20 bg-background/55"
          />
          {/* Bottom fade so the next section transitions cleanly */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 -z-20 h-72 bg-gradient-to-b from-transparent to-background"
          />
        </>
      )}

      {/* Atmospheric overlays */}
      <div
        className={cn(
          "brand-aurora absolute inset-0 -z-10",
          backgroundImage && "opacity-50 mix-blend-overlay",
        )}
        aria-hidden
      />
      {!backgroundImage && (
        <div className="bg-grid absolute inset-0 -z-10 opacity-60" aria-hidden />
      )}
      <div
        className="absolute inset-x-0 top-0 -z-10 h-px bg-border/60"
        aria-hidden
      />

      {/* Oversized wordmark bleed */}
      {!backgroundImage && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[-2vw] -z-10 flex justify-center overflow-hidden"
          aria-hidden
        >
          <span className="wordmark-bleed text-[28vw] leading-none whitespace-nowrap sm:text-[26vw] md:text-[22vw] lg:text-[18vw] xl:text-[16rem]">
            Fin & Stem
          </span>
        </div>
      )}

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-20 pb-32 sm:px-8 sm:pt-28 sm:pb-40 md:pt-32 md:pb-48">
        {/* Paper content card — sits as a herbarium plate on the cream
            page, or as a label card over a desaturated photo. */}
        <div className="glass glass-edge glass-strong relative animate-rise rounded-3xl p-8 sm:p-10 md:p-14 lg:max-w-3xl bg-grain">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/70 text-[var(--brand)] backdrop-blur">
              <WaveMark className="size-5" />
            </span>
            <Eyebrow className="!text-foreground/70">{eyebrow}</Eyebrow>
          </div>

          <h1 className="mt-6 text-display-tight text-balance text-[2.5rem] sm:text-[3.25rem] md:text-[4rem] lg:text-[4.75rem]">
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            {subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <PillButton href={primaryCta.href} size="lg">
              {primaryCta.label}
            </PillButton>
            {secondaryCta && (
              <PillButton
                href={secondaryCta.href}
                variant="ghost"
                size="lg"
              >
                {secondaryCta.label}
              </PillButton>
            )}
          </div>
        </div>

        {stats && stats.length > 0 && (
          <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/70 sm:mt-20 sm:grid-cols-3 bg-border/60">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass flex flex-col gap-1 p-6 sm:p-7"
              >
                <dd className="text-display text-3xl sm:text-4xl text-foreground">
                  {stat.value}
                </dd>
                <dt className="text-sm leading-relaxed text-muted-foreground">
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
