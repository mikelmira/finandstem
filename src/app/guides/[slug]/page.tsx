import type { Metadata } from "next";
import { IMAGE_ATTRIBUTION } from "@/data/image-attribution";
import { atmosphere } from "@/data/atmosphere";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { getMDXComponents } from "@/mdx-components";
import { listGuides, getGuide, countWords } from "@/lib/guides";
import { guidePageJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { AuthorByline } from "@/components/seo/author-byline";
import { Faq } from "@/components/seo/faq";
import { Sources } from "@/components/seo/sources";

interface RouteParams {
  params: Promise<{ slug: string }>;
}


export const dynamicParams = false;
export async function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGuide(slug);
  if (!entry) return {};
  const fm = entry.frontmatter;
  const canonical = `${site.url}/guides/${fm.slug}`;
  return {
    title: fm.title,
    description: fm.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: site.name,
      title: fm.title,
      description: fm.description,
      locale: "en",
      authors: [`${site.url}/about`],
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt,
      section: "Guides",
      images: fm.heroImage
        ? [
            {
              url: fm.heroImage.startsWith("http")
                ? fm.heroImage
                : `${site.url}${fm.heroImage}`,
              alt: fm.heroAlt ?? fm.title,
            },
          ]
        : (() => {
            const lead = (fm.heroSpecies ?? fm.relatedSpecies)
              .map((id) => IMAGE_ATTRIBUTION[id.split(":")[1] ?? ""])
              .find(Boolean);
            return lead ? [{ url: `${site.url}${lead.src}`, alt: lead.alt }] : undefined;
          })(),
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.description,
    },
    keywords: [...fm.keywords],
    other: { "article:author": `${site.url}/about` },
  };
}

export default async function GuidePage({ params }: RouteParams) {
  const { slug } = await params;
  const entry = getGuide(slug);
  if (!entry) notFound();

  // Unpublished guides 404 in production. In dev we still render them so
  // authors can preview while drafting.
  if (
    entry.frontmatter.published === false &&
    process.env.NODE_ENV !== "development"
  ) {
    notFound();
  }

  const fm = entry.frontmatter;
  const wordCount = countWords(entry.raw);
  const readingTimeMin = Math.max(1, Math.round(wordCount / 220));
  const faqs = fm.faqs ?? [];
  const sources = fm.sources ?? [];

  return (
    <>
      <JsonLd
        data={guidePageJsonLd({
          guide: fm,
          tldr: fm.description,
          faqs,
          wordCount,
        })}
        id={`guide-jsonld-${fm.slug}`}
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Guides", href: "/guides" },
            { name: fm.title },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            {kindLabel(fm.kind)}
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            {fm.title}
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {fm.description}
          </p>
          <div className="mt-6 border-t border-border/50 pt-5">
            <AuthorByline
              updatedAt={fm.updatedAt}
              readingTimeMin={readingTimeMin}
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Part of our{" "}
              <Link
                href={fm.pillar}
                className="font-medium text-foreground underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)] hover:decoration-[var(--brand)]"
              >
                {pillarLabel(fm.pillar)}
              </Link>
              .
            </p>
          </div>
        </header>

        {fm.heroImage ? (
          <figure className="my-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/60">
              <Image
                src={fm.heroImage}
                alt={fm.heroAlt ?? fm.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            {(() => {
              const credit = Object.values(atmosphere).find((a) => a.src === fm.heroImage);
              return credit ? (
                <figcaption className="mt-2 text-xs text-muted-foreground">
                  Photo:{" "}
                  <a href={credit.source} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2 hover:text-foreground">
                    {credit.photographer}
                  </a>{" "}
                  · Unsplash
                </figcaption>
              ) : null;
            })()}
          </figure>
        ) : (
          (() => {
            const ids =
              fm.heroSpecies ??
              (fm.kind === "comparison" ? fm.relatedSpecies.slice(0, 2) : fm.relatedSpecies);
            const shots = ids
              .map((id) => IMAGE_ATTRIBUTION[id.split(":")[1] ?? ""])
              .filter((a): a is NonNullable<typeof a> => Boolean(a))
              .slice(0, fm.kind === "comparison" || fm.heroSpecies ? 2 : 1);
            if (shots.length === 0) return null;
            return (
              <div className={shots.length > 1 ? "my-8 grid gap-4 sm:grid-cols-2" : "my-8"}>
                {shots.map((a, i) => (
                  <figure key={a.src}>
                    <div
                      className={
                        "relative w-full overflow-hidden rounded-3xl border border-border/60 " +
                        (shots.length > 1 ? "aspect-[4/3]" : "aspect-[16/9]")
                      }
                    >
                      <Image
                        src={a.src}
                        alt={a.alt}
                        fill
                        priority={i === 0}
                        sizes="(max-width: 1024px) 100vw, 768px"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="mt-2 text-xs text-muted-foreground">
                      {a.alt}. Photo: {a.author}
                      {a.license ? ` · ${a.license}` : ""}
                      {a.descriptionUrl && (
                        <>
                          {" · "}
                          <a href={a.descriptionUrl} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2 hover:text-foreground">
                            source
                          </a>
                        </>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>
            );
          })()
        )}

        {/* The article body, MDX compiled at request time, with our shared
            component mapping. The prose wrapper sets sensible defaults that
            the per-element overrides in useMDXComponents fine-tune. */}
        <div className="guide-prose">
          <MDXRemote
            source={entry.raw}
            components={getMDXComponents()}
            options={{
              parseFrontmatter: false,
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: "wrap" }],
                ],
              },
            }}
          />
        </div>

        {faqs.length > 0 && (
          <section className="mt-12">
            <Faq items={faqs} />
          </section>
        )}

        {sources.length > 0 && (
          <section className="mt-10">
            <Sources items={sources} />
          </section>
        )}

        <div className="mt-12">
          <Link
            href="/guides"
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All guides
          </Link>
        </div>
      </article>
    </>
  );
}

function kindLabel(
  kind: string,
): string {
  switch (kind) {
    case "compatibility":
      return "Compatibility";
    case "comparison":
      return "Comparison";
    case "list":
      return "List article";
    case "setup":
      return "Tank setup";
    case "biotope":
      return "Biotope guide";
    case "faq":
    default:
      return "FAQ deep-dive";
  }
}

function pillarLabel(pillar: string): string {
  switch (pillar) {
    case "/planted-tank-guide":
      return "complete planted-aquarium guide";
    case "/aquarium-fish-guide":
      return "complete aquarium-fish guide";
    case "/freshwater-shrimp-guide":
      return "complete freshwater-shrimp guide";
    case "/aquatic-moss-guide":
      return "complete aquatic-moss guide";
    case "/aquarium-hardscape-guide":
      return "complete hardscape guide";
    case "/aquarium-equipment-guide":
      return "complete aquarium-equipment guide";
    default:
      return "pillar guide";
  }
}
