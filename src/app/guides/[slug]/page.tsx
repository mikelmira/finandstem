import type { Metadata } from "next";
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
        : undefined,
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

        {fm.heroImage && (
          <div className="relative my-8 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/60">
            <Image
              src={fm.heroImage}
              alt={fm.heroAlt ?? fm.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
            />
          </div>
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
