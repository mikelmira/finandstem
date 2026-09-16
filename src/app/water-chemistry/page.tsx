import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { breadcrumbsJsonLd, organizationEntity, organizationRef } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";

const PAGE_PATH = "/water-chemistry";
const PAGE_URL = `${site.url}${PAGE_PATH}`;
const PAGE_TITLE =
  "Aquarium Water Chemistry: pH, KH, GH, TDS and the Nitrogen Readings Explained";
const PAGE_DESCRIPTION =
  "What pH, KH, GH, TDS, ammonia, nitrite and nitrate actually mean, the target ranges for different tanks, how they interrelate, and how to adjust each one safely.";

const TLDR =
  "Six numbers describe almost everything about your water. Temperature and pH set the basic conditions; KH is the buffer that keeps pH steady; GH is the calcium and magnesium plants and shrimp need; and ammonia, nitrite and nitrate track the nitrogen cycle. The trap is confusing GH and KH, which measure different things. You rarely need to chase a perfect pH; you need stable, sensible parameters that suit the species you keep. Soft-water fish and caridina shrimp want low, gentle numbers, hard-water livebearers and neocaridina want more mineral. Match the tank to the fish, then keep it stable.";

const PARAMETERS: {
  name: string;
  abbrev: string;
  what: string;
  why: string;
  range: string;
  adjust: string;
}[] = [
  {
    name: "Temperature",
    abbrev: "°C",
    what: "How warm the water is, held by a heater on a thermostat.",
    why: "Sets metabolism, oxygen levels and which species can live together. Swings stress fish and trigger disease more than any single wrong value.",
    range: "22 to 26°C suits most community tropicals.",
    adjust: "A reliable heater and, in hot climates, a fan or chiller. Change it slowly, never in jumps.",
  },
  {
    name: "pH",
    abbrev: "pH",
    what: "How acidic or alkaline the water is, on a 0 to 14 scale where 7 is neutral.",
    why: "Species evolved for a range, and extreme or unstable pH stresses them. Stability matters far more than hitting an exact number.",
    range: "6.5 to 7.5 covers most community tanks. Blackwater fish prefer lower, hard-water fish higher.",
    adjust: "Don't chase it with pH-down bottles, which swing it dangerously. Use the water source, KH and CO2 to set it, then leave it stable.",
  },
  {
    name: "Carbonate hardness",
    abbrev: "KH",
    what: "The carbonate and bicarbonate buffer in the water, measured in dKH.",
    why: "KH is what stops pH from crashing. Low KH means an unstable pH that can swing overnight; higher KH holds it steady.",
    range: "3 to 8 dKH is a safe, stable band for most tanks. Caridina shrimp want very low KH.",
    adjust: "Raise it with crushed coral, aragonite or a KH buffer. Lower it by cutting it with RO water.",
  },
  {
    name: "General hardness",
    abbrev: "GH",
    what: "The dissolved calcium and magnesium in the water, measured in dGH.",
    why: "These are minerals plants use and shrimp need to build their shells and molt. Too soft and shrimp fail to molt and plants show deficiencies.",
    range: "4 to 8 dGH suits most planted community tanks; neocaridina shrimp want 6 to 8, caridina lower.",
    adjust: "Raise it with a GH or shrimp remineraliser containing calcium and magnesium. Lower it by cutting with RO water.",
  },
  {
    name: "Total dissolved solids",
    abbrev: "TDS",
    what: "A rough measure of everything dissolved in the water, in ppm, read with a cheap pen meter.",
    why: "Handy for shrimp keepers and RO users to track stability and spot drift, since it moves with hardness and buildup.",
    range: "Species-dependent; caridina shrimp keepers often target 100 to 150 ppm from remineralised RO.",
    adjust: "It follows your remineralisation and water changes. Rising TDS between changes flags evaporation and buildup.",
  },
  {
    name: "Ammonia",
    abbrev: "NH₃",
    what: "The first and most toxic nitrogen waste, from fish and rotting food.",
    why: "Even a small amount burns gills and kills fish. In an established tank it should always read zero.",
    range: "0 ppm, always, in a cycled tank.",
    adjust: "Any reading means a water change now and a look at the cause: overfeeding, overstocking, or an uncycled tank.",
  },
  {
    name: "Nitrite",
    abbrev: "NO₂⁻",
    what: "The second nitrogen stage, still toxic, produced as bacteria break down ammonia.",
    why: "Also lethal to fish. In a cycled tank it reads zero; seeing it means the cycle is incomplete or has crashed.",
    range: "0 ppm in a cycled tank.",
    adjust: "Water changes to protect fish, and let the bacteria catch up. Common during cycling.",
  },
  {
    name: "Nitrate",
    abbrev: "NO₃⁻",
    what: "The end of the nitrogen line, far less toxic, that builds up over time.",
    why: "Tolerable in moderation but a stress and algae driver when it climbs. It is what water changes and plants remove.",
    range: "Keep it under about 20 to 40 ppm; planted tanks often run it as a nutrient around 10 to 20.",
    adjust: "Water changes bring it down; fast plants use it up. Rising nitrate is the normal sign of a working, stocked tank.",
  },
];

const TANK_TYPES: { name: string; ph: string; kh: string; gh: string; note: string }[] = [
  { name: "Community planted", ph: "6.5–7.5", kh: "3–6", gh: "4–8", note: "The flexible middle ground most tetras, rasboras and gouramis are happy in." },
  { name: "Soft / blackwater", ph: "5.5–6.8", kh: "0–3", gh: "1–4", note: "Wild-type tetras, apistogramma and chocolate gouramis; RO water plus botanicals." },
  { name: "Hard-water livebearer", ph: "7.2–8.2", kh: "6–12", gh: "10–20", note: "Guppies, mollies, platies want mineral-rich, harder water." },
  { name: "Neocaridina shrimp", ph: "6.5–7.5", kh: "2–5", gh: "6–8", note: "Cherry-type shrimp; steady GH is critical for molting." },
  { name: "Caridina shrimp", ph: "5.5–6.5", kh: "0–2", gh: "4–6", note: "Crystal and bee shrimp; low KH on active soil, RO remineralised carefully." },
];

const FAQS = [
  {
    question: "What is the difference between GH and KH?",
    answer:
      "GH (general hardness) is the calcium and magnesium in the water, the minerals plants and shrimp need. KH (carbonate hardness) is the buffer that keeps pH stable. They are different measurements: you can have soft water (low GH) that still resists pH swings (higher KH), or vice versa. Test and adjust them separately.",
  },
  {
    question: "What pH should my aquarium be?",
    answer:
      "For most community tanks, anywhere from 6.5 to 7.5 is fine. A stable pH in a sensible range beats a 'perfect' number that swings. Match it to your species: soft-water fish prefer lower, hard-water fish higher.",
  },
  {
    question: "Should I use pH-down products?",
    answer:
      "Generally no. Acid buffers give a temporary drop that rebounds and can swing pH dangerously, which is worse than a stable 'wrong' value. Set pH through your water source, KH and CO2 instead, and keep it steady.",
  },
  {
    question: "Why does my pH crash overnight?",
    answer:
      "Almost always low KH. With little carbonate buffer, acids from the substrate and CO2 pull pH down and it swings. Raise KH a little with crushed coral or a buffer to stabilise it.",
  },
  {
    question: "How do I soften hard tap water?",
    answer:
      "Mix or replace it with RO (reverse osmosis) water, then remineralise back to the GH your fish or shrimp want. That gives you full control over both hardness and buffering, rather than fighting the tap.",
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
    "aquarium water parameters",
    "gh vs kh aquarium",
    "aquarium ph kh gh",
    "aquarium water chemistry",
    "tds aquarium",
    "safe ammonia nitrite nitrate levels",
  ],
  other: { "article:author": `${site.url}/about` },
};

export default function WaterChemistryPage() {
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
              about: "Aquarium water chemistry",
            },
            breadcrumbsJsonLd(
              [
                { name: "Home", href: "/" },
                { name: "Water chemistry" },
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
        id="water-chemistry-jsonld"
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Water chemistry" },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Reference
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            Aquarium water chemistry, explained
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Six numbers describe almost everything about your water. Here is what
            each one means, the ranges different tanks want, and how they fit
            together, starting with the two everyone confuses.
          </p>
        </header>

        <Tldr body={TLDR} subject="Aquarium water chemistry" />

        <Section title="GH and KH are not the same thing">
          <p className="text-pretty leading-relaxed text-foreground/90">
            This is the single most common mix-up, so it is worth clearing up
            first. General hardness and carbonate hardness both have "hardness" in
            the name, but they measure different things and you adjust them
            separately.
          </p>
          <figure className="mt-6">
            <GhKhDiagram />
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              GH is the minerals plants and shrimp use. KH is the buffer that
              holds pH steady. Different jobs, measured separately.
            </figcaption>
          </figure>
        </Section>

        <Section title="The parameters, one by one">
          <div className="flex flex-col gap-3">
            {PARAMETERS.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-border bg-background/60 p-5 backdrop-blur"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-medium text-foreground">{p.name}</h3>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium text-[var(--brand)]">
                    {p.abbrev}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {p.what}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground/80">Why it matters.</span>{" "}
                  {p.why}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground/80">Typical range.</span>{" "}
                  {p.range}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground/80">Adjusting it.</span>{" "}
                  {p.adjust}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Target ranges by tank type">
          <p className="mb-4 text-pretty leading-relaxed text-foreground/90">
            There is no universal 'correct' water. Pick the row that matches what
            you want to keep, then set the tank to it and hold it steady.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-background/60 text-left">
                  <th className="px-4 py-3 font-medium text-foreground">Tank type</th>
                  <th className="px-4 py-3 font-medium text-foreground">pH</th>
                  <th className="px-4 py-3 font-medium text-foreground">KH</th>
                  <th className="px-4 py-3 font-medium text-foreground">GH</th>
                </tr>
              </thead>
              <tbody>
                {TANK_TYPES.map((t) => (
                  <tr key={t.name} className="border-t border-border/60 align-top">
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{t.name}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                        {t.note}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground/90">{t.ph}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground/90">{t.kh}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground/90">{t.gh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="How they fit together">
          <p className="text-pretty leading-relaxed text-foreground/90">
            The parameters pull on each other. KH props up pH, so if you inject
            CO2 (which forms a weak acid and lowers pH) you need enough KH to keep
            that drop steady rather than a crash. GH and KH move together in most
            tap water but can be set independently with RO water and remineralisers.
            Temperature affects how much oxygen the water holds and how fast
            everything, including the nitrogen cycle, runs. And ammonia, nitrite
            and nitrate are the running score of that cycle: the first two should
            sit at zero, and nitrate is what you export with water changes. Change
            any of them slowly. Fish handle a steady value they weren't born for
            far better than a sudden swing toward the 'right' one.
          </p>
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
              { label: "How to cycle a tank (the nitrogen readings)", href: "/aquarium-cycling" },
              { label: "CO2 injection and the pH drop", href: "/equipment/co2-injection" },
              { label: "CO2 and pH drop-checker calculator", href: "/calculators/co2" },
              { label: "Fertiliser dosing calculator", href: "/calculators/fertiliser-dosing" },
              { label: "Plant deficiencies (GH, calcium, magnesium)", href: "/deficiencies" },
              { label: "Freshwater shrimp (GH and molting)", href: "/shrimp" },
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

/** Original GH-vs-KH explainer diagram. Theme-aware via CSS vars. */
function GhKhDiagram() {
  return (
    <svg
      viewBox="0 0 720 220"
      role="img"
      aria-label="GH is dissolved calcium and magnesium that plants and shrimp use. KH is the carbonate buffer that keeps pH stable. They are measured separately."
      className="w-full rounded-2xl border border-border bg-background/60 p-3"
    >
      {/* GH card */}
      <g>
        <rect x="20" y="30" width="320" height="160" rx="14" fill="var(--background)" stroke="var(--brand)" strokeWidth="1.5" />
        <text x="40" y="62" fontSize="18" fontWeight="600" fill="var(--foreground)">GH</text>
        <text x="78" y="62" fontSize="13" fill="var(--muted-foreground)">general hardness</text>
        <text x="40" y="92" fontSize="14" fill="var(--foreground)">Calcium + magnesium</text>
        <text x="40" y="118" fontSize="12.5" fill="var(--muted-foreground)">The minerals plants take up and</text>
        <text x="40" y="136" fontSize="12.5" fill="var(--muted-foreground)">shrimp use to build shells and molt.</text>
        <text x="40" y="168" fontSize="12" fill="var(--brand)">Raise with a remineraliser, lower with RO</text>
      </g>

      {/* KH card */}
      <g>
        <rect x="380" y="30" width="320" height="160" rx="14" fill="var(--background)" stroke="var(--brand)" strokeWidth="1.5" />
        <text x="400" y="62" fontSize="18" fontWeight="600" fill="var(--foreground)">KH</text>
        <text x="438" y="62" fontSize="13" fill="var(--muted-foreground)">carbonate hardness</text>
        <text x="400" y="92" fontSize="14" fill="var(--foreground)">Carbonate buffer</text>
        <text x="400" y="118" fontSize="12.5" fill="var(--muted-foreground)">Holds pH steady and stops it</text>
        <text x="400" y="136" fontSize="12.5" fill="var(--muted-foreground)">crashing overnight. Not a plant nutrient.</text>
        <text x="400" y="168" fontSize="12" fill="var(--brand)">Raise with crushed coral or a buffer</text>
      </g>
    </svg>
  );
}
