import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { builds, findBuild } from "@/data/builds";
import { site } from "@/lib/site";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { Tldr } from "@/components/seo/tldr";
import { AuthorByline } from "@/components/seo/author-byline";
import { buildJournalJsonLd } from "@/lib/seo";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return builds.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const build = findBuild(slug);
  if (!build) return {};

  const url = `${site.url}/builds/${build.slug}`;
  return {
    title: build.title,
    description: build.tagline,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: site.name,
      title: build.title,
      description: build.tagline,
      locale: "en",
      publishedTime: build.publishedAt,
      modifiedTime: build.updatedAt,
      images: build.heroImage
        ? [{ url: build.heroImage.startsWith("http") ? build.heroImage : `${site.url}${build.heroImage}` }]
        : undefined,
    },
  };
}

export default async function BuildJournalPage({ params }: RouteParams) {
  const { slug } = await params;
  const build = findBuild(slug);
  if (!build) notFound();

  const readingTimeMin = Math.max(
    1,
    Math.round(
      (build.tldr.split(/\s+/).length +
        build.steps.reduce((acc, s) => acc + s.description.split(/\s+/).length, 0)) /
        220,
    ),
  );

  return (
    <>
      <JsonLd data={buildJournalJsonLd(build)} id={`build-jsonld-${build.slug}`} />
      <PageHero
        eyebrow={build.style ?? "Build journal"}
        title={build.title}
        subtitle={build.tagline}
        breadcrumb={[
          { label: "Build journals", href: "/builds" },
          { label: build.title },
        ]}
      />

      <SectionShell>
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          <AuthorByline
            updatedAt={build.updatedAt}
            readingTimeMin={readingTimeMin}
          />

          <Tldr body={build.tldr} subject={build.title} />

          {build.heroImage && (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl">
              <Image
                src={build.heroImage}
                alt={build.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          {build.supplies.length > 0 && (
            <section
              aria-labelledby="supplies-heading"
              className="rounded-2xl border border-border/60 bg-background/40 p-6 sm:p-8"
            >
              <h2
                id="supplies-heading"
                className="text-display-tight text-2xl"
              >
                Supplies &amp; equipment
              </h2>
              <ul className="mt-5 flex flex-col gap-2">
                {build.supplies.map((s) => (
                  <li key={s.name} className="flex items-baseline justify-between gap-4">
                    <span className="font-medium text-foreground">{s.name}</span>
                    {s.category && (
                      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {s.category}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {build.steps.length > 0 && (
            <section aria-labelledby="timeline-heading">
              <h2
                id="timeline-heading"
                className="text-display-tight text-3xl"
              >
                Timeline
              </h2>
              <ol className="mt-6 flex flex-col gap-8">
                {build.steps.map((step, i) => (
                  <li key={i} className="rounded-2xl border border-border/60 bg-background/40 p-6 sm:p-8">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--brand)]">
                      Step {i + 1}
                      {step.date && (
                        <span className="ml-2 text-muted-foreground">
                          <time dateTime={step.date}>
                            {new Date(step.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </time>
                        </span>
                      )}
                    </p>
                    <h3 className="text-display-tight mt-3 text-2xl">
                      {step.title}
                    </h3>
                    {step.image && (
                      <div className="relative mt-5 aspect-[16/10] w-full overflow-hidden rounded-xl">
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 768px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <p className="mt-5 text-base leading-relaxed text-foreground/90">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div>
            <Link
              href="/builds"
              className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All build journals
            </Link>
          </div>
        </div>
      </SectionShell>
    </>
  );
}
