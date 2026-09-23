import type { Metadata } from "next";
import { atmosphere } from "@/data/atmosphere";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { breadcrumbsJsonLd, organizationEntity, organizationRef } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";

const PAGE_PATH = "/aquarium-maintenance";
const PAGE_URL = `${site.url}${PAGE_PATH}`;
const PAGE_TITLE = "Aquarium Maintenance: The Weekly Routine That Keeps a Tank Healthy";
const PAGE_DESCRIPTION =
  "A simple maintenance schedule for a planted tank, daily, weekly and monthly, plus how to do a water change, service a filter without crashing the cycle, and trim plants.";

const TLDR =
  "A healthy tank is mostly a tank with a steady routine. The backbone is a weekly water change of around a third, a quick glass clean, a filter rinse when flow drops, and regular plant trimming. Feed lightly, test now and then, and top up evaporation with fresh water rather than more tank water. The one rule that catches people out is never rinsing filter media in tap water, since chlorine kills the beneficial bacteria you spent weeks growing. Small and consistent beats a big cleanout every few months, which does more harm than good.";

const SCHEDULE: { when: string; tasks: string[] }[] = [
  {
    when: "Daily",
    tasks: [
      "Feed lightly, only what's eaten in a couple of minutes.",
      "Glance at the fish and count them, spotting trouble early is half the battle.",
      "Check the heater and filter are running.",
    ],
  },
  {
    when: "Weekly",
    tasks: [
      "Change roughly 25 to 50% of the water with dechlorinated, temperature-matched water.",
      "Scrape the glass and wipe off any algae before it hardens.",
      "Trim fast stems and remove dying leaves.",
      "Dose fertiliser for the week if you're not doing it daily.",
    ],
  },
  {
    when: "Every 2 to 4 weeks",
    tasks: [
      "Rinse filter media in old tank water when flow noticeably drops, never in tap water.",
      "Test ammonia, nitrite, nitrate, and GH/KH if you keep shrimp.",
      "Clean the impeller and intake if flow is weak.",
    ],
  },
  {
    when: "As needed",
    tasks: [
      "Top up evaporation with fresh, dechlorinated water, not more tank water, since minerals stay behind when water evaporates.",
      "Replace or top up root tabs for heavy root feeders.",
      "Gently vacuum open substrate in the fish areas, leaving planted zones alone.",
    ],
  },
];

const WATER_CHANGE_STEPS: string[] = [
  "Prepare replacement water: dechlorinate it, and match the temperature to the tank by feel or thermometer.",
  "Unplug the heater if the water level will drop below it, to avoid it running dry.",
  "Siphon out the planned amount, using the siphon to lift waste off open substrate and out from under decor.",
  "Refill slowly so you don't uproot plants or stress fish, pouring onto a plate or your hand to break the flow.",
  "Plug the heater back in, and dose any remineraliser or fertiliser the fresh water needs.",
];

const FILTER_POINTS: string[] = [
  "Only clean media when flow drops, not on a fixed schedule, since a filter is a living bacteria colony.",
  "Rinse sponges and biomedia in a bucket of old tank water, swishing gently. Tap-water chlorine sterilises them.",
  "Never replace all the media at once. If a cartridge must go, add the new one alongside the old for a few weeks first.",
  "Clean the mechanical stage (floss, coarse sponge) more often; leave the biological media as undisturbed as possible.",
];

const MISTAKES: string[] = [
  "The big cleanout: stripping and scrubbing everything at once, which wipes out the bacteria and crashes the tank.",
  "Rinsing filter media under the tap, the single fastest way to lose your cycle.",
  "Topping up evaporation with tank water instead of fresh, which lets minerals and TDS creep up over time.",
  "Overfeeding, which is behind most algae and water-quality problems.",
  "Skipping water changes because the water looks clear, when nitrate and hardness are climbing invisibly.",
];

const FAQS = [
  {
    question: "How often should I do a water change?",
    answer:
      "For most planted community tanks, around a quarter to a half of the water weekly is a good rhythm. High-tech tanks with heavy dosing often do larger weekly changes; low-tech, lightly stocked tanks can sometimes go longer. Consistency matters more than the exact amount.",
  },
  {
    question: "Can I clean my filter with tap water?",
    answer:
      "No. Chlorine and chloramine in tap water kill the beneficial bacteria living in the media, which can crash your cycle. Always rinse filter media in a bucket of old tank water instead.",
  },
  {
    question: "Do I need to vacuum the substrate in a planted tank?",
    answer:
      "Only the open, unplanted areas where waste collects. Digging through planted substrate disturbs roots and the beneficial bacteria and can release trapped gases. In heavily planted tanks the plants and cleanup crew handle most of it.",
  },
  {
    question: "Why top up evaporation with fresh water, not tank water?",
    answer:
      "Only pure water evaporates; the minerals stay behind. Topping up with more tank water would concentrate them further, slowly raising hardness and TDS. Fresh dechlorinated water keeps things stable.",
  },
];

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: site.name,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    locale: "en",
    authors: [`${site.url}/about`],
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESCRIPTION },
  keywords: [
    "aquarium maintenance",
    "aquarium maintenance schedule",
    "how to do a water change",
    "clean aquarium filter",
    "planted tank maintenance",
  ],
  other: { "article:author": `${site.url}/about` },
};

export default function AquariumMaintenancePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": `${PAGE_URL}#article`,
              mainEntityOfPage: PAGE_URL,
              url: PAGE_URL,
              headline: PAGE_TITLE,
              description: PAGE_DESCRIPTION,
              inLanguage: "en",
              author: organizationRef(),
              publisher: organizationEntity(),
              articleSection: "Guides",
              about: "Aquarium maintenance",
            },
            breadcrumbsJsonLd(
              [
                { name: "Home", href: "/" },
                { name: "Aquarium maintenance" },
              ],
              PAGE_URL,
            ),
            {
              "@type": "FAQPage",
              "@id": `${PAGE_URL}#faq`,
              mainEntity: FAQS.map((q) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: { "@type": "Answer", text: q.answer },
              })),
            },
          ],
        }}
        id="maintenance-jsonld"
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Aquarium maintenance" },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Guide
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            Aquarium maintenance routine
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            A healthy tank is mostly a tank with a steady routine. Here is the
            weekly rhythm that keeps water clean and plants growing, and the one
            or two habits that quietly cause most problems.
          </p>
        </header>

        <figure className="mb-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/60">
            <Image
              src={atmosphere.aquascapeWide.src}
              alt={atmosphere.aquascapeWide.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-2 text-xs text-muted-foreground">
            Photo:{" "}
            <a
              href={atmosphere.aquascapeWide.source}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline underline-offset-2 hover:text-foreground"
            >
              {atmosphere.aquascapeWide.photographer}
            </a>{" "}
            · Unsplash
          </figcaption>
        </figure>

        <Tldr body={TLDR} subject="Aquarium maintenance" />

        <Section title="The routine at a glance">
          <div className="grid gap-3 sm:grid-cols-2">
            {SCHEDULE.map((block) => (
              <div
                key={block.when}
                className="rounded-2xl border border-border bg-background/60 p-5 backdrop-blur"
              >
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                  {block.when}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {block.tasks.map((t) => (
                    <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                      <span className="mt-2 size-1.5 flex-none rounded-full bg-[var(--brand)]" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="How to do a water change">
          <ol className="flex flex-col gap-3">
            {WATER_CHANGE_STEPS.map((step, i) => (
              <li key={step} className="flex gap-3 leading-relaxed text-foreground/90">
                <span
                  className="mt-0.5 inline-flex size-6 flex-none items-center justify-center rounded-full bg-[var(--brand)]/12 text-xs font-semibold text-[var(--brand)]"
                  aria-hidden
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Filter maintenance, without crashing the cycle">
          <ul className="flex flex-col gap-2">
            {FILTER_POINTS.map((p) => (
              <li key={p} className="flex gap-2.5 leading-relaxed text-foreground/90">
                <span className="mt-2 size-1.5 flex-none rounded-full bg-[var(--brand)]" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Common mistakes">
          <ul className="flex flex-col gap-2">
            {MISTAKES.map((m) => (
              <li key={m} className="flex gap-2.5 leading-relaxed text-foreground/90">
                <span className="mt-2 size-1.5 flex-none rounded-full bg-[var(--brand)]" aria-hidden />
                {m}
              </li>
            ))}
          </ul>
        </Section>

        <section className="mt-12">
          <Faq items={FAQS} />
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Related
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {[
              { label: "How to cycle a tank", href: "/aquarium-cycling" },
              { label: "Water chemistry and what to test", href: "/water-chemistry" },
              { label: "Fix and prevent algae", href: "/algae" },
              { label: "Fertiliser dosing calculator", href: "/calculators/fertiliser-dosing" },
            ].map((r) => (
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
      </article>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-display-tight mb-4 text-2xl sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}
