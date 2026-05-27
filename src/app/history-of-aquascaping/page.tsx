import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Quote,
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
import { AuthorByline } from "@/components/seo/author-byline";
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
    title: `${PAGE_TITLE} — ${site.name}`,
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
      breadcrumbsJsonLd([
        { name: "Home", href: "/" },
        { name: "History" },
      ]),
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: history.faqs.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      },
    ],
  };
}

export default function HistoryOfAquascapingPage() {
  const { hero, tldr, chapters, timeline, faqs, sources } = history;
  const wordCount = chapters.reduce(
    (acc, c) => acc + c.body.join(" ").split(/\s+/).filter(Boolean).length,
    0,
  );
  const readingTimeMin = Math.max(1, Math.round(wordCount / 220));

  return (
    <>
      <JsonLd data={jsonLd()} id="history-jsonld" />

      {/* Hero — full-bleed image with overlay + breadcrumb + headline */}
      <section className="relative isolate min-h-[80vh] overflow-hidden border-b border-border/60">
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

        <div className="relative mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col px-6 pt-24 pb-20 sm:px-8 sm:pt-28 sm:pb-24">
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
            <div className="mt-6 text-white/85 [&_*]:!text-white/85">
              <AuthorByline
                updatedAt={hero.updatedAt}
                readingTimeMin={readingTimeMin}
              />
            </div>
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

      {/* TL;DR — single editorial paragraph with a drop cap and brand rule */}
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

      {/* Chapters — alternating layout. Even-numbered chapters get the figure
          on the right; odd chapters get it below the prose. Image always
          sized 4:5 portrait or 3:2 landscape based on aspect of the source. */}
      {chapters.map((chapter, i) => (
        <Chapter key={chapter.number} chapter={chapter} flip={i % 2 === 1} />
      ))}

      {/* Timeline strip — horizontal scroll on mobile, grid on desktop */}
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

      {/* Footer CTA */}
      <SectionShell className="border-t border-border/60">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-display-tight text-2xl leading-[1.2] sm:text-3xl">
            Build your own corner of this story.
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Every species in the catalogue is cross-referenced for compatibility —
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
        {/* Chapter header — number + eyebrow + title */}
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

        {/* Body — prose on one side, figure on the other on desktop when present.
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

            {/* Pull quote — only when supplied */}
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

            {/* Iwagumi stones grid — 2x2 cards inline with the prose */}
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
