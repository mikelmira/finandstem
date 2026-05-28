import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Quote,
  Trophy,
  ExternalLink as ExternalLinkIcon,
} from "lucide-react";

import { site } from "@/lib/site";
import {
  breadcrumbsJsonLd,
  organizationEntity,
  personEntity,
} from "@/lib/seo";
import { history, type HistoryImage } from "@/content/history";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Faq } from "@/components/seo/faq";
import { Sources } from "@/components/seo/sources";
import { cn } from "@/lib/utils";

const PAGE_PATH = "/history-of-aquascaping";
const PAGE_TITLE = "A History of Aquascaping";
const PAGE_DESCRIPTION =
  "Dutch origins in the 1930s, Takashi Amano's Nature Aquarium revolution, the Iwagumi style, the IAPLC contest, and the global hobby today.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${site.url}${PAGE_PATH}` },
  openGraph: {
    type: "article",
    url: `${site.url}${PAGE_PATH}`,
    siteName: site.name,
    title: `${PAGE_TITLE}, ${site.name}`,
    description: PAGE_DESCRIPTION,
    locale: "en",
    publishedTime: history.hero.publishedAt,
    modifiedTime: history.hero.updatedAt,
    images: [
      {
        url: `${site.url}${history.hero.heroImage.src}`,
        alt: history.hero.heroImage.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  keywords: [
    "history of aquascaping",
    "Takashi Amano biography",
    "ADA Aqua Design Amano",
    "Nature Aquarium",
    "Iwagumi style",
    "Dutch aquarium",
    "IAPLC contest",
    "AGA aquascaping contest",
    "Amano shrimp",
  ],
};

function jsonLd() {
  const url = `${site.url}${PAGE_PATH}`;
  const wordCount = history.chapters.reduce(
    (acc, c) => acc + c.body.join(" ").split(/\s+/).filter(Boolean).length,
    0,
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        datePublished: history.hero.publishedAt,
        dateModified: history.hero.updatedAt,
        inLanguage: "en",
        wordCount,
        author: personEntity(),
        publisher: organizationEntity(),
        articleSection: "Reference",
        image: [`${site.url}${history.hero.heroImage.src}`],
        keywords:
          "history of aquascaping, Takashi Amano, ADA, Nature Aquarium, Iwagumi, IAPLC, Dutch aquarium, Amano shrimp",
      },
      breadcrumbsJsonLd(
        [
          { name: "Home", href: "/" },
          { name: "History" },
        ],
        url,
      ),
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: history.faqs.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${url}#contests`,
        name: "Major international aquascaping contests",
        itemListElement: history.contests.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "EventSeries",
            name: c.name,
            alternateName: c.acronym,
            startDate: c.founded,
            organizer: { "@type": "Organization", name: c.host },
            url: c.url,
            image: `${site.url}${c.image.src}`,
            description: c.blurb,
          },
        })),
      },
    ],
  };
}

export default function HistoryOfAquascapingPage() {
  const {
    hero,
    tldr,
    chapters,
    florestasGallery,
    studios,
    contests,
    timeline,
    faqs,
    sources,
  } = history;

  return (
    <>
      <JsonLd data={jsonLd()} id="history-jsonld" />

      {/* Hero, full-bleed image with overlay + breadcrumb + headline */}
      <section className="relative isolate min-h-[90vh] overflow-hidden border-b border-border/60 md:min-h-[80vh]">
        <div className="absolute inset-0 -z-30">
          <Image
            src={hero.heroImage.src}
            alt={hero.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-gradient-to-b from-black/65 via-black/30 to-black/80"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-20 h-40 bg-gradient-to-b from-transparent to-background"
        />

        <div className="relative mx-auto flex min-h-[90vh] w-full max-w-5xl flex-col px-6 pt-24 pb-20 sm:px-8 sm:pt-28 sm:pb-24 md:min-h-[80vh]">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "History" }]}
            tone="light"
            className="mb-6"
          />

          <div className="animate-rise mt-auto max-w-4xl">
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/85">
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full bg-[var(--brand)]"
              />
              {hero.eyebrow}
            </p>
            <h1 className="text-display-tight mt-5 text-balance text-5xl leading-[1.2] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.55)] sm:text-6xl md:text-7xl lg:text-[5.25rem]">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-lg md:text-xl">
              {hero.subtitle}
            </p>
          </div>
        </div>

        {/* Caption strip pinned to the bottom-right of the hero, attributing
            the photographer of the Florestas Submersas image. */}
        <figcaption className="pointer-events-none absolute bottom-3 right-4 z-10 hidden max-w-xs text-right text-[10px] text-white/75 sm:block">
          {hero.heroImage.caption} ·{" "}
          <span className="text-white/55">
            Photo {hero.heroImage.author} · {hero.heroImage.license}
          </span>
        </figcaption>
      </section>

      {/* TL;DR, single editorial paragraph with a drop cap and brand rule */}
      <SectionShell className="!pt-14 sm:!pt-20" containerClassName="max-w-3xl">
        <div className="relative">
          <span
            aria-hidden
            className="absolute -top-3 left-0 inline-block h-px w-12 bg-[var(--brand)]"
          />
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
            The short answer
          </p>
          <p className="drop-cap mt-5 text-pretty text-lg leading-relaxed text-foreground/90 sm:text-xl">
            {tldr}
          </p>
        </div>
      </SectionShell>

      {/* Chapters, alternating layout. Even-numbered chapters get the figure
          on the right; odd chapters get it below the prose. Image always
          sized 4:5 portrait or 3:2 landscape based on aspect of the source. */}
      {chapters.map((chapter, i) => (
        <Chapter key={chapter.number} chapter={chapter} flip={i % 2 === 1} />
      ))}

      {/* Florestas Submersas gallery, three views of Amano's largest work,
          linking out to ADA's official project page. */}
      <SectionShell className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
            Inside Florestas Submersas
          </p>
          <h2 className="text-display-tight mt-4 text-balance text-3xl leading-[1.2] sm:text-4xl">
            ADA's biggest Nature Aquarium, in three views
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {florestasGallery.intro}
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {florestasGallery.images.map((img) => (
              <li key={img.src} className="group flex flex-col gap-3">
                <a
                  href={img.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${img.alt} on Wikimedia Commons`}
                  className="relative block aspect-[4/5] overflow-hidden rounded-2xl border border-border/60"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </a>
                {img.caption && (
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {img.caption}
                  </p>
                )}
                <a
                  href={img.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/85 transition-colors hover:text-[var(--brand)]"
                >
                  Photo: {img.author} · {img.license}
                  <ExternalLinkIcon className="size-3" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <a
            href={florestasGallery.href}
            target="_blank"
            rel="noopener noreferrer"
            className="press mt-8 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            {florestasGallery.hrefLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </SectionShell>

      {/* Contests, three big international competitions with images + links */}
      <SectionShell className="border-t border-border/60">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--brand)]/12 text-[var(--brand)]">
              <Trophy className="size-4" aria-hidden />
            </span>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
              The three big contests
            </p>
          </div>
          <h2 className="text-display-tight mt-5 text-balance text-3xl leading-[1.2] sm:text-4xl">
            Where aquascaping is judged each year
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            The IAPLC, AGA, and CIPS contests collectively receive more than
            three thousand entries from over eighty countries every year. Each
            one is open to entrants from anywhere in the world and each one
            sets visual trends that ripple through the hobby for the next twelve
            months.
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {contests.map((c) => (
              <li
                key={c.slug}
                className="glass glass-edge group flex flex-col overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[5/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={c.image.src}
                    alt={c.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
                      Est. {c.founded} · {c.acronym}
                    </p>
                    <h3 className="text-display-tight mt-2 text-pretty text-xl leading-snug">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Host: {c.host}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {c.blurb}
                  </p>

                  <dl className="grid grid-cols-2 gap-3 border-t border-border/50 pt-4">
                    {c.stats.map((s) => (
                      <div key={s.label}>
                        <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          {s.label}
                        </dt>
                        <dd className="text-display-tight mt-0.5 text-lg text-foreground">
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit the ${c.name} official site`}
                    className="press mt-auto inline-flex items-center justify-between gap-1.5 rounded-full bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--brand)]/20 transition-all hover:-translate-y-0.5"
                  >
                    Visit official site
                    <ArrowUpRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </a>

                  <a
                    href={c.image.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/85 transition-colors hover:text-[var(--brand)]"
                  >
                    Photo: {c.image.author} · {c.image.license}
                    <ExternalLinkIcon className="size-3" aria-hidden />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>

      {/* Timeline strip, horizontal scroll on mobile, grid on desktop */}
      <SectionShell className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
            Timeline
          </p>
          <h2 className="text-display-tight mt-4 text-balance text-3xl leading-[1.2] sm:text-4xl">
            A century and a half in nine dates
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            The milestones that took aquascaping from a Victorian parlour curiosity
            to a global creative discipline.
          </p>
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.map((event) => (
              <li
                key={event.year}
                className="glass glass-edge group relative flex flex-col gap-2 rounded-2xl p-5 transition-colors hover:border-[var(--brand)]/40"
              >
                <span className="text-display-tight text-3xl text-[var(--brand)] sm:text-4xl">
                  {event.year}
                </span>
                <h3 className="text-base font-semibold tracking-tight">
                  {event.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {event.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </SectionShell>

      {/* FAQ */}
      <SectionShell containerClassName="max-w-3xl">
        <Faq items={faqs} />
      </SectionShell>

      {/* Sources */}
      <SectionShell className="!pt-0" containerClassName="max-w-3xl">
        <Sources items={sources} />
      </SectionShell>

      {/* Studios & associations, the three organisations that shaped the hobby */}
      <SectionShell className="!pt-0">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--brand)]/12 text-[var(--brand)]">
              <Building2 className="size-4" aria-hidden />
            </span>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
              Studios & associations
            </p>
          </div>
          <h2 className="text-display-tight mt-5 text-balance text-3xl leading-[1.2] sm:text-4xl">
            The organisations that built the discipline
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            One Japanese studio, one Dutch society, one American association, 
            most of the rules, styles, products, and contests aquascapers use
            today trace back to these three.
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((s) => (
              <li key={s.slug}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-edge lift group flex h-full flex-col gap-3 rounded-2xl p-6 no-underline transition-colors hover:border-[var(--brand)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
                      Est. {s.founded}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {s.country}
                    </span>
                  </div>
                  <h3 className="text-display-tight text-lg leading-snug text-foreground transition-colors group-hover:text-[var(--brand)]">
                    {s.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.blurb}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-[var(--brand)] transition-colors group-hover:text-foreground">
                    Visit website
                    <ArrowUpRight
                      className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </SectionShell>

      {/* Footer CTA */}
      <SectionShell className="border-t border-border/60">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-display-tight text-2xl leading-[1.2] sm:text-3xl">
            Build your own corner of this story.
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Every species in the catalogue is cross-referenced for compatibility, 
            so you can put together the Nature Aquarium, Iwagumi, or biotope
            you've been thinking about.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/planted-tank-guide"
              className="press inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--brand)]/20 transition-all hover:-translate-y-0.5"
            >
              The planted-tank pillar
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/compatibility"
              className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
            >
              Open the compatibility tool
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </SectionShell>
    </>
  );
}

interface ChapterProps {
  chapter: (typeof history.chapters)[number];
  /** When true, swap the prose/figure column order on desktop. */
  flip: boolean;
}

function Chapter({ chapter, flip }: ChapterProps) {
  const hasFigure = Boolean(chapter.figure);
  return (
    <SectionShell
      className={cn("!pt-0", chapter.number === "01" && "!pt-12 sm:!pt-16")}
    >
      <article className="mx-auto max-w-5xl">
        {/* Chapter header, number + eyebrow + title */}
        <header className="grid grid-cols-1 gap-6 border-b border-border/40 pb-6 sm:grid-cols-[80px_1fr] sm:items-end">
          <div className="flex items-baseline gap-3 sm:flex-col sm:items-start sm:gap-1">
            <span className="text-display-tight text-4xl text-[var(--brand)] sm:text-5xl">
              {chapter.number}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {chapter.eyebrow}
            </span>
          </div>
          <h2 className="text-display-tight text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            {chapter.title}
          </h2>
        </header>

        {/* Body, prose on one side, figure on the other on desktop when present.
            On mobile the figure stacks after the prose. */}
        <div
          className={cn(
            "mt-10 grid grid-cols-1 gap-10",
            hasFigure && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14",
          )}
        >
          <div
            className={cn(
              "space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg",
              hasFigure && flip && "lg:order-2",
            )}
          >
            {chapter.body.map((para, i) => (
              <p key={i} className="text-pretty">
                {para}
              </p>
            ))}

            {/* Pull quote, only when supplied */}
            {chapter.pullQuote && (
              <blockquote className="relative my-8 border-l-4 border-[var(--brand)] bg-[var(--brand)]/8 py-5 pl-6 pr-5">
                <Quote
                  className="absolute -left-3 -top-3 size-6 rounded-full bg-background p-1 text-[var(--brand)]"
                  aria-hidden
                />
                <p className="text-display-tight text-balance text-xl leading-snug text-foreground sm:text-2xl">
                  &ldquo;{chapter.pullQuote}&rdquo;
                </p>
              </blockquote>
            )}

            {/* Iwagumi stones grid, 2x2 cards inline with the prose */}
            {chapter.grid && (
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {chapter.grid.map((cell) => (
                  <li
                    key={cell.name}
                    className="glass glass-edge rounded-2xl p-5"
                  >
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--brand)]">
                      {cell.role}
                    </p>
                    <p className="mt-2 text-display-tight text-lg text-foreground">
                      {cell.name}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {cell.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {chapter.figure && (
            <Figure
              image={chapter.figure}
              className={cn(flip ? "lg:order-1" : "")}
            />
          )}
        </div>
      </article>
    </SectionShell>
  );
}

interface FigureProps {
  image: HistoryImage;
  className?: string;
}

function Figure({ image, className }: FigureProps) {
  return (
    <figure className={cn("group flex flex-col gap-3", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 lg:aspect-[4/5]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
        />
      </div>
      {image.caption && (
        <figcaption className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {image.caption}
        </figcaption>
      )}
      <a
        href={image.source}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/85 transition-colors hover:text-[var(--brand)]"
      >
        Photo: {image.author} · {image.license}
        <ExternalLinkIcon className="size-3" aria-hidden />
      </a>
    </figure>
  );
}
