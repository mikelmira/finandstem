import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { site } from "@/lib/site";
import { breadcrumbsJsonLd, organizationEntity, organizationRef } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Tldr } from "@/components/seo/tldr";
import { Faq } from "@/components/seo/faq";

const PAGE_PATH = "/aquascaping-design";
const PAGE_URL = `${site.url}${PAGE_PATH}`;
const PAGE_TITLE =
  "Aquascaping Design and Composition: Styles, Layout and How to Plan a Scape";
const PAGE_DESCRIPTION =
  "The composition principles behind a great aquascape, the rule of thirds, focal points, depth and the three classic layout shapes, plus the main styles, Nature Aquarium, Iwagumi, Dutch, Jungle, Walstad and biotope.";

const TLDR =
  "A good aquascape is designed, not just planted. A handful of principles do most of the work: put your focal point off-centre on a rule-of-thirds line, pick one of the three classic layout shapes (triangular, concave or convex), build front-to-back depth with smaller materials and finer plants toward the rear, and leave open space so the eye has somewhere to rest. Odd numbers of rocks look more natural than even. Then choose a style that fits your taste and skill, from the minimalist Iwagumi to the plant-packed Dutch, and let it guide your plant and hardscape choices.";

const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Focal point on a third",
    body: "Place the main feature, the tallest rock or the gap the eye is drawn to, about a third of the way across, not dead centre. Centred layouts feel static; off-centre feels alive.",
  },
  {
    title: "Build depth",
    body: "Use larger, coarser materials and taller plants at the front and finer, smaller ones toward the back, and slope the substrate up toward the rear. It tricks a shallow tank into looking deep.",
  },
  {
    title: "Leave negative space",
    body: "Open sand, a clear swimming channel, or empty water above the scape gives the busy planting somewhere to breathe. Cramming every corner reads as clutter.",
  },
  {
    title: "Use odd numbers",
    body: "Groups of three, five or seven rocks or plant clusters look more natural than pairs or fours, which the eye reads as deliberate and symmetrical.",
  },
];

const STYLES: {
  name: string;
  summary: string;
  build: string;
  href?: string;
  hrefLabel?: string;
}[] = [
  {
    name: "Nature Aquarium",
    summary:
      "Takashi Amano's style, and the one most people picture: natural-looking layouts of stone and wood, lush but balanced planting, and a strong sense of a real landscape shrunk into glass.",
    build:
      "Start with a considered hardscape, plant in drifts that echo nature, and keep it trimmed. CO2 and good light make the carpets and reds work.",
    href: "/history-of-aquascaping",
    hrefLabel: "the history of the Nature Aquarium",
  },
  {
    name: "Iwagumi",
    summary:
      "The purest, hardest style: stone only, no wood, usually a single carpeting plant. All the drama comes from rock placement, so there is nowhere to hide a mistake.",
    build:
      "An odd number of stones, one clearly the main stone, set on a rule-of-thirds line, over a low carpet like Monte Carlo or dwarf hairgrass.",
    href: "/hardscape",
    hrefLabel: "aquascaping stones",
  },
  {
    name: "Dutch",
    summary:
      "No hardscape at all, just dense, sculpted rows and terraces of colourful stem plants, like an underwater flower bed. It is about plant health, contrast and disciplined trimming.",
    build:
      "Group stems by species in bold streets, contrast leaf colour and texture, and stagger heights. Demands strong dosing and regular trimming.",
    href: "/plants",
    hrefLabel: "stem plants",
  },
  {
    name: "Jungle",
    summary:
      "Wild, full and low-maintenance, the opposite of the manicured styles. Big leaves, floating plants and a slightly overgrown feel. Forgiving for beginners.",
    build:
      "Large-leaf plants like swords and crypts, a tangle of stems, and floaters up top. Let it fill in rather than fighting for neatness.",
    href: "/plants",
    hrefLabel: "easy jungle plants",
  },
  {
    name: "Walstad / low-tech",
    summary:
      "A method as much as a look: heavily planted, no CO2, minimal filtration, using soil and plant mass to balance the tank. Slow, natural and cheap to run.",
    build:
      "A capped soil substrate, lots of hardy fast plants from day one, low light and gentle stocking. Patience over gadgets.",
    href: "/substrates",
    hrefLabel: "substrates",
  },
  {
    name: "Biotope",
    summary:
      "Recreates one real habitat faithfully, only the plants, fish, hardscape and water a specific river or stream would actually have. As much research as aquascaping.",
    build:
      "Pick a location, match the species and materials to it, and resist adding anything that wouldn't live there. Blackwater Amazon and Southeast Asian streams are popular.",
    href: "/fish",
    hrefLabel: "fish by origin",
  },
];

const FAQS = [
  {
    question: "What is the rule of thirds in aquascaping?",
    answer:
      "Imagine the tank split into thirds horizontally and vertically. Placing your focal point, the main rock or the key gap, on one of those lines or their intersections looks more natural and dynamic than centring it. It is the single most useful composition rule.",
  },
  {
    question: "What are the three aquascaping layout types?",
    answer:
      "Triangular, where the scape slopes from a high side down to a low one; concave, a U-shape that dips in the middle to open a central view; and convex, an island or mound that rises in the middle with open sides. Most layouts are a version of one of these.",
  },
  {
    question: "Which aquascaping style is best for beginners?",
    answer:
      "Jungle or a low-tech Walstad-style tank. Both are forgiving, need no CO2, and look good slightly overgrown. Iwagumi and Dutch look simple but are the hardest to pull off well.",
  },
  {
    question: "How do I make a small tank look deep?",
    answer:
      "Slope the substrate up toward the back, use larger materials and coarser textures at the front and finer ones behind, keep the tallest plants at the rear, and leave open foreground space. Perspective does the rest.",
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
    "aquascaping design",
    "aquascaping composition",
    "rule of thirds aquascape",
    "aquascaping styles",
    "iwagumi",
    "dutch aquascape",
    "nature aquarium layout",
  ],
  other: { "article:author": `${site.url}/about` },
};

export default function AquascapingDesignPage() {
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
              about: "Aquascaping design and composition",
            },
            breadcrumbsJsonLd(
              [
                { name: "Home", href: "/" },
                { name: "Aquascaping design" },
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
        id="aquascaping-design-jsonld"
      />

      <article className="mx-auto w-full max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Aquascaping design" },
          ]}
          className="mb-8"
        />

        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Design guide
          </p>
          <h1 className="text-display-tight mt-3 text-balance text-3xl leading-[1.2] sm:text-4xl md:text-5xl">
            Aquascaping design and composition
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            The difference between a planted tank and an aquascape is design. Here
            are the composition principles that do the heavy lifting, the classic
            layout shapes, and the styles they build into.
          </p>
        </header>

        <figure className="mb-10 overflow-hidden rounded-3xl border border-border">
          <Image
            src="/images/aquascaping/nature-aquarium-example.webp"
            alt="A Nature Aquarium style aquascape with driftwood, ferns, mosses and a stream, planted above and below the waterline"
            width={1400}
            height={800}
            className="w-full"
            priority
          />
          <figcaption className="px-4 py-2 text-xs text-muted-foreground">
            A Nature Aquarium style layout: off-centre focal points, depth from
            front to back, and open water to breathe. Photo: Dileepkumardr, CC0,
            via Wikimedia Commons.
          </figcaption>
        </figure>

        <Tldr body={TLDR} subject="Aquascaping design" />

        <Section title="Put the focal point off-centre">
          <p className="text-pretty leading-relaxed text-foreground/90">
            Split the tank into thirds each way. The strongest place for your main
            feature, the tallest stone, the mouth of a valley, the specimen plant,
            is on one of those lines or where they cross, not in the middle. It is
            the oldest trick in composition and it works every time.
          </p>
          <figure className="mt-6">
            <RuleOfThirdsDiagram />
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              The rule of thirds: place the focal point on a third line, not
              centred.
            </figcaption>
          </figure>
        </Section>

        <Section title="Pick a layout shape">
          <p className="text-pretty leading-relaxed text-foreground/90">
            Almost every scape is a version of one of three shapes. Choosing one
            before you place a single rock keeps the layout coherent.
          </p>
          <figure className="mt-6">
            <LayoutShapesDiagram />
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              Triangular, concave and convex, the three foundations of an
              aquascape layout.
            </figcaption>
          </figure>
        </Section>

        <Section title="The principles that do the work">
          <div className="grid gap-3 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-border bg-background/60 p-4 backdrop-blur"
              >
                <p className="font-medium text-foreground">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="The main aquascaping styles">
          <div className="flex flex-col gap-3">
            {STYLES.map((s) => (
              <div
                key={s.name}
                className="rounded-2xl border border-border bg-background/60 p-5 backdrop-blur"
              >
                <h3 className="text-lg font-medium text-foreground">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {s.summary}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground/80">How it's built.</span>{" "}
                  {s.build}
                </p>
                {s.href && (
                  <Link
                    href={s.href}
                    className="press mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-[var(--brand)]/40 underline-offset-4 transition-colors hover:text-[var(--brand)]"
                  >
                    {s.hrefLabel}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Section>

        <section className="mt-12">
          <Faq items={FAQS} />
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Build your scape
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {[
              { label: "Choose stones and wood", href: "/hardscape" },
              { label: "Pick plants by position", href: "/plants" },
              { label: "Compare substrates", href: "/substrates" },
              { label: "Plan the whole tank", href: "/planner" },
              { label: "The history of the styles", href: "/history-of-aquascaping" },
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

/** Rule-of-thirds grid with an off-centre focal point. Theme-aware. */
function RuleOfThirdsDiagram() {
  return (
    <svg
      viewBox="0 0 600 300"
      role="img"
      aria-label="A tank divided into thirds horizontally and vertically, with the focal point placed on the left-hand third line rather than the centre."
      className="w-full rounded-2xl border border-border bg-background/60 p-3"
    >
      <rect x="20" y="20" width="560" height="260" rx="8" fill="var(--background)" stroke="var(--border)" strokeWidth="1.5" />
      {/* third lines */}
      {[20 + 560 / 3, 20 + (560 * 2) / 3].map((x) => (
        <line key={x} x1={x} y1="20" x2={x} y2="280" stroke="var(--brand)" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="5 5" />
      ))}
      {[20 + 260 / 3, 20 + (260 * 2) / 3].map((y) => (
        <line key={y} x1="20" y1={y} x2="580" y2={y} stroke="var(--brand)" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="5 5" />
      ))}
      {/* focal point at left-third / lower-third intersection */}
      <circle cx={20 + 560 / 3} cy={20 + (260 * 2) / 3} r="14" fill="var(--brand)" />
      <text x={20 + 560 / 3} y={20 + (260 * 2) / 3 - 24} textAnchor="middle" fontSize="12" fill="var(--foreground)">
        focal point
      </text>
    </svg>
  );
}

/** Three classic layout shapes. Theme-aware. */
function LayoutShapesDiagram() {
  const shapes: { label: string; path: string }[] = [
    // triangular: high left, sloping down to the right
    { label: "Triangular", path: "M0,90 L0,40 L110,90 Z" },
    // concave: U-shape, high sides, low centre
    { label: "Concave", path: "M0,90 L0,45 L30,80 L80,80 L110,45 L110,90 Z" },
    // convex: island/mound, high centre
    { label: "Convex", path: "M0,90 L30,70 L55,42 L80,70 L110,90 Z" },
  ];
  return (
    <svg
      viewBox="0 0 600 150"
      role="img"
      aria-label="Three layout shapes: triangular sloping from one high side, concave dipping in the middle, and convex mounding in the middle."
      className="w-full rounded-2xl border border-border bg-background/60 p-3"
    >
      {shapes.map((s, i) => {
        const ox = 30 + i * 190;
        return (
          <g key={s.label} transform={`translate(${ox}, 20)`}>
            <rect x="0" y="0" width="110" height="90" rx="6" fill="var(--background)" stroke="var(--border)" strokeWidth="1.5" />
            <path d={s.path} fill="var(--brand)" fillOpacity="0.18" stroke="var(--brand)" strokeWidth="1.5" />
            <text x="55" y="118" textAnchor="middle" fontSize="13" fill="var(--foreground)">
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
