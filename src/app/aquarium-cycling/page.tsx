import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Beaker, Fish, Sprout } from "lucide-react";

import { site } from "@/lib/site";
import { breadcrumbsJsonLd, organizationEntity, organizationRef } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";
import { ProductNote } from "@/components/recommend/product-note";

const PAGE_PATH = "/aquarium-cycling";
const PAGE_URL = `${site.url}${PAGE_PATH}`;
const PAGE_TITLE = "How to Cycle a Planted Aquarium: The Complete Start-Here Guide";
const PAGE_DESCRIPTION =
  "Cycling grows the bacteria that turn toxic ammonia into harmless nitrate before you add fish. Fishless, fish-in and plant-heavy silent cycling, what the test numbers should do, and how to speed it up.";

const TLDR =
  "Cycling is growing the bacteria that turn fish waste, ammonia, into nitrite and then into far less harmful nitrate, before you add any livestock. Until that colony exists, ammonia and nitrite spike and burn fish. You can cycle fishless by dosing ammonia and waiting, which is safest, fish-in with a few hardy fish and daily water changes, which is riskier, or run a plant-heavy silent cycle where fast-growing plants soak up the ammonia so the spike barely shows. Most tanks take three to six weeks. It is done when the tank clears an ammonia dose to zero ammonia and zero nitrite within 24 hours. Seeded filter media or a bottled bacteria starter speeds it up a lot.";

const FISHLESS_STEPS: { name: string; text: string }[] = [
  {
    name: "Set the tank up fully and get it warm",
    text: "Fill it, plant it, run the filter and heater, and hold the temperature around 26 to 28°C. Warmth speeds the bacteria. Dechlorinate the water first, since chlorine kills the very bacteria you are trying to grow.",
  },
  {
    name: "Add an ammonia source",
    text: "Dose bottled ammonia to about 2 ppm, or drop in a small pinch of fish food to rot. This is the food the bacteria colony feeds on. Test and top back up to roughly 2 ppm if it falls.",
  },
  {
    name: "Seed it with bacteria",
    text: "Add a bottled starter culture, or better, a handful of media or a sponge squeezed out from an established, healthy tank. Live seed media is the single biggest shortcut there is.",
  },
  {
    name: "Test every few days and wait",
    text: "Watch ammonia rise then fall as nitrite appears, then watch nitrite fall as nitrate climbs. This nitrite phase is the long one. Keep the ammonia topped up so the colony does not starve.",
  },
  {
    name: "Confirm the tank can clear a full dose in 24 hours",
    text: "Dose ammonia back to 2 ppm and test the next day. When both ammonia and nitrite read zero after 24 hours, the cycle is complete and stable.",
  },
  {
    name: "Do a big water change, then stock slowly",
    text: "Change a large amount of water to bring the built-up nitrate down, then add fish a few at a time so the colony can grow into the new load.",
  },
];

const SILENT_STEPS: { name: string; text: string }[] = [
  {
    name: "Plant heavily from day one",
    text: "Fill a good share of the tank with fast growers, floating plants, stems and hornwort, which eat ammonia directly. The more plant mass, the less ammonia ever reaches the water.",
  },
  {
    name: "Go easy on livestock at first",
    text: "Add just a few hardy animals, or none, so the waste stays within what the plants can absorb. A shrimp or snail cleanup crew suits this well.",
  },
  {
    name: "Test and watch for any spike",
    text: "Keep testing ammonia and nitrite. In a truly plant-heavy tank they often barely register, which is the whole point, but test so you catch it if the plants can't keep up.",
  },
  {
    name: "Grow the stocking in slowly",
    text: "As the plants establish and the filter bacteria build quietly in the background, add livestock gradually rather than all at once.",
  },
];

const FISH_IN_POINTS: string[] = [
  "Use only a few small, hardy fish, and never a full stocking.",
  "Test ammonia and nitrite daily. Any reading above zero means a water change now.",
  "Do partial water changes, often daily, to keep ammonia and nitrite near zero the whole time.",
  "Feed lightly, since every bit of food becomes ammonia the fish have to survive.",
  "A dechlorinator that detoxifies ammonia and nitrite buys the fish time between changes.",
  "Expect it to take longer and demand more of you than a fishless cycle, because you are protecting live fish the entire time.",
];

const TEST_STAGES: { label: string; body: string }[] = [
  {
    label: "Week 1",
    body: "Ammonia climbs. Nitrite and nitrate still near zero. The first bacteria are only just waking up.",
  },
  {
    label: "Weeks 2 to 3",
    body: "Ammonia starts dropping as nitrite spikes. This is the halfway mark and the slowest, most patience-testing stage.",
  },
  {
    label: "Weeks 3 to 5",
    body: "Nitrite falls toward zero and nitrate steadily rises. Nitrate going up is the good sign you are waiting for.",
  },
  {
    label: "Done",
    body: "A fresh ammonia dose reads zero ammonia and zero nitrite 24 hours later. Big water change, then stock slowly.",
  },
];

const SPEED_TIPS: string[] = [
  "Seed with mature media. A squeezed sponge or a scoop of substrate from a healthy established tank carries the live bacteria and can cut weeks off.",
  "Use a quality bottled bacteria starter if you have no mature tank to borrow from.",
  "Keep it warm, around 26 to 28°C, since the bacteria multiply faster in warm water.",
  "Keep the ammonia fed but not sky-high, since very high ammonia actually stalls the colony.",
  "Add plenty of surface area, more filter media and porous hardscape give the bacteria more to colonise.",
  "Don't do water changes during a fishless cycle unless ammonia climbs past about 5 ppm, since changes just slow the feeding.",
];

const MISTAKES: string[] = [
  "Chasing a fast cycle and adding a full stocking at once, then crashing it.",
  "Rinsing filter media in tap water, which chlorine sterilises, wiping out the colony.",
  "Doing constant water changes during a fishless cycle, which starves the bacteria.",
  "Trusting a bottle of bacteria to make the tank instantly safe without testing.",
  "Reading a nitrite reading as failure, when it is actually the normal middle stage.",
  "Skipping the test kit entirely, which is the only way to actually know where you are.",
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
    "how to cycle an aquarium",
    "aquarium cycling",
    "fishless cycle",
    "nitrogen cycle aquarium",
    "silent cycle planted tank",
    "cycle a fish tank",
  ],
  other: { "article:author": `${site.url}/about` },
};

const FAQS = [
  {
    question: "How long does it take to cycle an aquarium?",
    answer:
      "Usually three to six weeks for a fishless cycle from scratch. Seeding with mature media or a bacteria starter can bring that down to one to two weeks. A plant-heavy silent cycle can be ready sooner because the plants absorb ammonia directly.",
  },
  {
    question: "How do I know when the cycle is finished?",
    answer:
      "Dose ammonia to about 2 ppm and test 24 hours later. When both ammonia and nitrite read zero, and nitrate has risen, the bacteria colony can handle a full day's waste and the tank is cycled.",
  },
  {
    question: "Can I cycle with plants and skip the wait?",
    answer:
      "A heavily planted tank with fast growers can run a silent cycle, where the plants soak up ammonia so it barely spikes. It still helps to stock slowly and keep testing, since the filter bacteria are still building quietly in the background.",
  },
  {
    question: "Will a bottle of bacteria instantly cycle my tank?",
    answer:
      "It helps, sometimes a lot, but results vary by product and freshness. Treat it as a head start, not a guarantee, and keep testing until the tank actually clears an ammonia dose in 24 hours.",
  },
  {
    question: "Is a nitrite reading bad?",
    answer:
      "No, it is the normal middle stage. Ammonia is converted to nitrite first, then a second group of bacteria converts nitrite to nitrate. Seeing nitrite means the cycle is progressing, not failing.",
  },
];

export default function AquariumCyclingPage() {
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
              about: "Aquarium nitrogen cycle",
            },
            breadcrumbsJsonLd(
              [
                { name: "Home", href: "/" },
                { name: "How to cycle an aquarium" },
              ],
              PAGE_URL,
            ),
            {
              "@type": "HowTo",
              "@id": `${PAGE_URL}#howto`,
              name: "How to cycle a planted aquarium (fishless)",
              description:
                "Grow the nitrifying bacteria that make a tank safe for fish, without livestock, by dosing ammonia and waiting for the colony to establish.",
              step: FISHLESS_STEPS.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: s.name,
                text: s.text,
              })),
            },
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
        id="cycling-jsonld"
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "How to cycle an aquarium" },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Start here
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            How to cycle a planted aquarium
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            The single most important thing to get right before fish go in, and
            the reason most week-two disasters happen. Here is what cycling is,
            the three ways to do it, and how to read the test kit that tells you
            when it is safe.
          </p>
        </header>

        <Tldr body={TLDR} subject="Cycling an aquarium" />

        <Section title="What cycling actually is">
          <p className="text-pretty leading-relaxed text-foreground/90">
            Fish produce ammonia through their gills and their waste, and
            leftover food rots into more of it. Ammonia is highly toxic, and in a
            brand-new tank there is nothing to deal with it. Cycling is the weeks
            you spend growing two groups of bacteria: the first turns ammonia into
            nitrite, which is also toxic, and the second turns nitrite into
            nitrate, which is far less harmful and gets removed by water changes
            and taken up by plants. Once both colonies are established and living
            in your filter and substrate, the tank processes waste continuously
            and quietly. That is a cycled tank, and it is what keeps fish alive.
          </p>
          <figure className="mt-6">
            <NitrogenCycleDiagram />
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              The nitrogen cycle: bacteria convert toxic ammonia to nitrite, then
              to far less toxic nitrate, which plants and water changes remove.
            </figcaption>
          </figure>
        </Section>

        <Section title="The three ways to cycle">
          <div className="grid gap-3 sm:grid-cols-3">
            <Method
              icon={Beaker}
              title="Fishless"
              body="Dose ammonia yourself and wait. No animals at risk, and you can grow a big colony before stocking. The safest route, and the one to pick if you can wait."
            />
            <Method
              icon={Fish}
              title="Fish-in"
              body="Cycle with a few hardy fish already in the tank, using daily testing and water changes to keep them safe. Riskier and more work, for when fish are already in."
            />
            <Method
              icon={Sprout}
              title="Silent (plant-heavy)"
              body="Pack the tank with fast plants that eat ammonia directly, so the spike barely shows. Great for planted tanks, still stock slowly and keep testing."
            />
          </div>
        </Section>

        <Section title="Fishless cycle, step by step">
          <p className="mb-4 text-pretty leading-relaxed text-foreground/90">
            The safest and most controllable method. No fish suffer while the
            bacteria build.
          </p>
          <Steps steps={FISHLESS_STEPS} />
          <ProductNote
            productIds={["apt-start", "apt-balance"]}
            heading="Giving a new tank a head start"
          />
        </Section>

        <Section title="The plant-heavy silent cycle">
          <p className="mb-4 text-pretty leading-relaxed text-foreground/90">
            The planted-tank advantage. Fast-growing plants take up ammonia as
            food, so a heavily planted tank can skip most of the visible spike.
          </p>
          <Steps steps={SILENT_STEPS} />
        </Section>

        <Section title="Fish-in cycle, safely">
          <p className="mb-4 text-pretty leading-relaxed text-foreground/90">
            If fish are already in the tank, you cannot wait, so the job becomes
            protecting them while the bacteria catch up.
          </p>
          <ul className="flex flex-col gap-2">
            {FISH_IN_POINTS.map((p) => (
              <li key={p} className="flex gap-2.5 leading-relaxed text-foreground/90">
                <span
                  className="mt-2 size-1.5 flex-none rounded-full bg-[var(--brand)]"
                  aria-hidden
                />
                {p}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="What the test numbers should do">
          <p className="mb-4 text-pretty leading-relaxed text-foreground/90">
            A liquid test kit for ammonia, nitrite and nitrate is not optional,
            it is the only way to see the cycle happening. Here is the shape to
            expect.
          </p>
          <ol className="flex flex-col gap-3">
            {TEST_STAGES.map((s) => (
              <li
                key={s.label}
                className="flex gap-4 rounded-xl border border-border bg-background/60 p-4 backdrop-blur"
              >
                <span className="flex-none text-sm font-semibold text-[var(--brand)]">
                  {s.label}
                </span>
                <span className="text-sm leading-relaxed text-foreground/90">
                  {s.body}
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="How to speed it up">
          <ul className="flex flex-col gap-2">
            {SPEED_TIPS.map((t) => (
              <li key={t} className="flex gap-2.5 leading-relaxed text-foreground/90">
                <span
                  className="mt-2 size-1.5 flex-none rounded-full bg-[var(--brand)]"
                  aria-hidden
                />
                {t}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Common mistakes">
          <ul className="flex flex-col gap-2">
            {MISTAKES.map((m) => (
              <li key={m} className="flex gap-2.5 leading-relaxed text-foreground/90">
                <span
                  className="mt-2 size-1.5 flex-none rounded-full bg-[var(--brand)]"
                  aria-hidden
                />
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
            Once you're cycled
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {[
              { label: "Understand the numbers: pH, KH, GH and more", href: "/water-chemistry" },
              { label: "Keep it healthy: the maintenance routine", href: "/aquarium-maintenance" },
              { label: "Pick fast plants that speed a silent cycle", href: "/plants" },
              { label: "Choose hardy first fish", href: "/fish" },
              { label: "Something already going wrong? Fish & shrimp health", href: "/diseases" },
              { label: "Plants looking off? Deficiency ID", href: "/deficiencies" },
              { label: "Diagnose new-tank algae", href: "/algae" },
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

function Steps({ steps }: { steps: { name: string; text: string }[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {steps.map((s, i) => (
        <li key={s.name} className="flex gap-3">
          <span
            className="mt-0.5 inline-flex size-6 flex-none items-center justify-center rounded-full bg-[var(--brand)]/12 text-xs font-semibold text-[var(--brand)]"
            aria-hidden
          >
            {i + 1}
          </span>
          <span className="leading-relaxed text-foreground/90">
            <span className="font-medium text-foreground">{s.name}.</span>{" "}
            {s.text}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Method({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4 backdrop-blur">
      <Icon className="size-5 text-[var(--brand)]" aria-hidden />
      <p className="mt-2 font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

/** Original inline diagram of the aquarium nitrogen cycle. Theme-aware via CSS vars. */
function NitrogenCycleDiagram() {
  const stages = [
    { x: 20, title: "Ammonia", formula: "NH₃ / NH₄⁺", tag: "toxic", danger: true },
    { x: 300, title: "Nitrite", formula: "NO₂⁻", tag: "toxic", danger: true },
    { x: 580, title: "Nitrate", formula: "NO₃⁻", tag: "far less toxic", danger: false },
  ];
  return (
    <svg
      viewBox="0 0 760 250"
      role="img"
      aria-label="Diagram of the aquarium nitrogen cycle: fish waste and food become ammonia, bacteria convert it to nitrite, then to nitrate, which plants and water changes remove."
      className="w-full rounded-2xl border border-border bg-background/60 p-3"
    >
      {/* input label */}
      <text x="105" y="30" textAnchor="middle" fontSize="12" fill="var(--muted-foreground)">
        Fish waste + food
      </text>
      <line x1="105" y1="38" x2="105" y2="78" stroke="var(--brand)" strokeWidth="2" markerEnd="url(#nc-arrow)" />

      {/* stage boxes */}
      {stages.map((s) => (
        <g key={s.title}>
          <rect
            x={s.x}
            y={80}
            width={160}
            height={78}
            rx={12}
            fill="var(--background)"
            stroke={s.danger ? "var(--destructive)" : "var(--brand)"}
            strokeWidth="1.5"
          />
          <text x={s.x + 80} y={112} textAnchor="middle" fontSize="17" fontWeight="600" fill="var(--foreground)">
            {s.title}
          </text>
          <text x={s.x + 80} y={134} textAnchor="middle" fontSize="13" fill="var(--muted-foreground)">
            {s.formula}
          </text>
          <text
            x={s.x + 80}
            y={178}
            textAnchor="middle"
            fontSize="11"
            fill={s.danger ? "var(--destructive)" : "var(--brand)"}
          >
            {s.tag}
          </text>
        </g>
      ))}

      {/* conversion arrows between stages */}
      {[
        { x1: 180, x2: 300, label: "bacteria" },
        { x1: 460, x2: 580, label: "bacteria" },
      ].map((a) => (
        <g key={a.x1}>
          <line x1={a.x1} y1={119} x2={a.x2 - 6} y2={119} stroke="var(--brand)" strokeWidth="2" markerEnd="url(#nc-arrow)" />
          <text x={(a.x1 + a.x2) / 2} y={108} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
            {a.label}
          </text>
        </g>
      ))}

      {/* output label */}
      <line x1="660" y1="158" x2="660" y2="200" stroke="var(--brand)" strokeWidth="2" markerEnd="url(#nc-arrow)" />
      <text x="660" y="222" textAnchor="middle" fontSize="12" fill="var(--muted-foreground)">
        Water changes + plant uptake
      </text>

      <defs>
        <marker id="nc-arrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--brand)" />
        </marker>
      </defs>
    </svg>
  );
}
