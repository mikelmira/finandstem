import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import {
  CALCULATORS,
  getCalculator,
  type CalculatorComponent,
} from "@/data/calculators";
import { calculatorPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { AuthorByline } from "@/components/seo/author-byline";
import { Faq } from "@/components/seo/faq";
import { TankVolumeCalculator } from "@/components/calculators/tank-volume-calculator";
import { SubstrateCalculator } from "@/components/calculators/substrate-calculator";
import { Co2Calculator } from "@/components/calculators/co2-calculator";
import { DosingCalculator } from "@/components/calculators/dosing-calculator";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

const COMPONENTS: Record<CalculatorComponent, React.ComponentType> = {
  "tank-volume": TankVolumeCalculator,
  substrate: SubstrateCalculator,
  co2: Co2Calculator,
  dosing: DosingCalculator,
};

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) return {};
  const canonical = `${site.url}/calculators/${slug}`;
  return {
    title: calc.name,
    description: calc.spot,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: site.name,
      title: calc.name,
      description: calc.spot,
      locale: "en",
    },
    twitter: { card: "summary_large_image", title: calc.name, description: calc.spot },
    keywords: [
      calc.name.toLowerCase(),
      `${calc.name.toLowerCase()} free`,
      "aquarium calculator",
      "planted tank calculator",
    ],
  };
}

export default async function CalculatorPage({ params }: RouteParams) {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) notFound();

  const Tool = COMPONENTS[calc.component];
  const others = CALCULATORS.filter((c) => c.slug !== calc.slug);

  return (
    <>
      <JsonLd
        data={calculatorPageJsonLd({
          slug: calc.slug,
          name: calc.name,
          description: calc.spot,
          faqs: calc.faqs,
        })}
        id={`calculator-jsonld-${calc.slug}`}
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Calculators", href: "/calculators" },
            { name: calc.name },
          ]}
          className="mb-8"
        />

        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Calculator
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            {calc.name}
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {calc.spot}
          </p>
          <div className="mt-6 border-t border-border/50 pt-5">
            <AuthorByline />
          </div>
        </header>

        <Tool />

        <section className="mt-10">
          <p className="text-pretty leading-relaxed text-foreground/90">
            {calc.intro}
          </p>
        </section>

        <section className="mt-12">
          <Faq items={calc.faqs} />
        </section>

        {calc.related && calc.related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Related
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {calc.related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="press inline-flex items-center gap-1.5 text-sm font-medium underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)]"
                  >
                    {r.label}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-14">
          <h2 className="text-display-tight text-2xl sm:text-3xl">
            More calculators
          </h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {others.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/calculators/${c.slug}`}
                  className="press flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                >
                  <span>{c.name}</span>
                  <ArrowRight
                    className="size-4 flex-none text-muted-foreground"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12">
          <Link
            href="/calculators"
            className="press inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-[var(--brand)]/40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All calculators
          </Link>
        </div>
      </article>
    </>
  );
}
