/**
 * Editorial content for /history-of-aquascaping.
 *
 * This is a feature page rather than a guide — it has its own layout
 * (chapter eyebrows, drop cap, figure-text rhythm, timeline strip) and
 * lives on its own URL outside `/guides/[slug]`. The content is the
 * same arc as the original history-of-aquascaping.mdx article, restructured
 * into chapters + images so the page can render as a magazine piece.
 */

export interface HistoryImage {
  src: string;
  alt: string;
  author: string;
  license: string;
  licenseUrl?: string;
  source: string;
  caption?: string;
}

export interface HistoryChapter {
  /** Two-digit chapter number — `01`, `02`, …  */
  number: string;
  eyebrow: string;
  title: string;
  /** Paragraphs of body prose. */
  body: string[];
  /** Optional inline figure shown beside / after the chapter prose. */
  figure?: HistoryImage;
  /** Optional pull-quote callout shown between paragraphs. */
  pullQuote?: string;
  /** Optional structured grid (used for the Iwagumi stones). */
  grid?: ReadonlyArray<{ name: string; role: string; body: string }>;
}

export interface TimelineEvent {
  year: string;
  title: string;
  body: string;
}

export interface HistoryFaq {
  question: string;
  answer: string;
}

export interface HistorySource {
  label: string;
  url: string;
}

export interface ContestStat {
  label: string;
  value: string;
}

export interface Studio {
  slug: string;
  name: string;
  founded: string;
  country: string;
  blurb: string;
  url: string;
}

export interface Contest {
  slug: string;
  name: string;
  acronym: string;
  founded: string;
  host: string;
  blurb: string;
  stats: ReadonlyArray<ContestStat>;
  url: string;
  image: HistoryImage;
}

const hero: HistoryImage = {
  src: "/images/history/florestas-submersas-hero.webp",
  alt: "Florestas Submersas — Takashi Amano's 160,000-litre Nature Aquarium installation at Oceanário de Lisboa",
  author: "Marco Albuquerque",
  license: "Public domain",
  source:
    "https://commons.wikimedia.org/wiki/File:Florestas_Submersas_by_Takashi_Amano_(31995078117).jpg",
  caption:
    "Florestas Submersas — the 160,000-litre Nature Aquarium Takashi Amano installed at Oceanário de Lisboa in April 2015, his final major project.",
};

const florestasWide: HistoryImage = {
  src: "/images/history/florestas-submersas-wide.webp",
  alt: "Wide view of the Florestas Submersas installation at the Lisbon Oceanarium",
  author: "Pierre Goiffon",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  source: "https://commons.wikimedia.org/wiki/File:Oceanario_2018_1.jpg",
  caption:
    "Visitors at Florestas Submersas in 2018. The piece remains the largest Nature Aquarium installation in the world.",
};

const iwagumi: HistoryImage = {
  src: "/images/history/iwagumi-scape.webp",
  alt: "An Iwagumi-style planted aquarium with stones arranged in odd-numbered groups",
  author: "Moritz Holzinger",
  license: "CC BY-SA 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  source: "https://commons.wikimedia.org/wiki/File:Iwagumi_Scape.jpg",
  caption:
    "A textbook Iwagumi layout — odd-numbered stones, a single carpeting plant, a tight school of small fish.",
};

const natureStyle: HistoryImage = {
  src: "/images/history/nature-style-aquascape.webp",
  alt: "Nature Aquarium style planted tank with driftwood, mosses, and stem plants in asymmetric composition",
  author: "Duc Viet Bui",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  source:
    "https://commons.wikimedia.org/wiki/File:Nature_style_aquascape.png",
  caption:
    "A Nature Aquarium in the Amano tradition — driftwood as the spine, mosses softening the stones, stem plants in the back third.",
};

const agaContestWinner: HistoryImage = {
  src: "/images/history/aga-contest-winner.webp",
  alt: "Cho Jaesun's top-ten aquascape at the AGA International Aquascaping Contest 2020",
  author: "Aquagarden",
  license: "CC BY-SA 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  source: "https://commons.wikimedia.org/wiki/File:Cho_Jaesun_2020_AGA_Top_10.jpg",
  caption:
    "Cho Jaesun, 2020 AGA International Aquascaping Contest, top-ten finisher. Contemporary contest scapes lean on layered planting and forced perspective.",
};

const shrimpTank: HistoryImage = {
  src: "/images/history/planted-shrimp-tank.webp",
  alt: "A modern planted aquarium with Neocaridina shrimp foraging across the substrate",
  author: "Snehayan",
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0",
  source:
    "https://commons.wikimedia.org/wiki/File:Live_planted_aquarium_with_neocaridina_shrimp.jpg",
  caption:
    "A planted tank stocked with dwarf shrimp — the algae-control standard Amano established in the 1980s with Caridina multidentata.",
};

const iaplcEntry: HistoryImage = {
  src: "/images/history/iaplc-2021-entry.webp",
  alt: "Time — a 2021 IAPLC entry by Cho Jaesun, photographed for the contest archive",
  author: "Cho Jaesun (조재선)",
  license: "CC BY-SA 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  source: "https://commons.wikimedia.org/wiki/File:2021_IAPLC_Time.jpg",
  caption:
    "\"Time\" — a 2021 IAPLC entry by Cho Jaesun. The IAPLC receives over 1,500 entries from more than 70 countries each year.",
};

const florestasDetail: HistoryImage = {
  src: "/images/history/florestas-submersas-detail.webp",
  alt: "A detail of Takashi Amano's Florestas Submersas installation at Oceanário de Lisboa",
  author: "Marco Albuquerque",
  license: "Public domain",
  source:
    "https://commons.wikimedia.org/wiki/File:Florestas_Submersas_by_Takashi_Amano_(31995077867).jpg",
  caption: "A detail of Florestas Submersas — driftwood, dense planting, deep light.",
};

const florestasFish: HistoryImage = {
  src: "/images/history/florestas-submersas-fish.webp",
  alt: "Schooling fish swimming over aquatic plants inside Amano's Florestas Submersas",
  author: "Pierre Goiffon",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  source: "https://commons.wikimedia.org/wiki/File:Oceanario_2018_5.jpg",
  caption: "Schooling fish move through the planted hardscape — the installation is a true ecosystem.",
};

const florestasSchool: HistoryImage = {
  src: "/images/history/florestas-submersas-school.webp",
  alt: "Silhouetted sword plants and a school of yellow-tailed fish in deep water — Florestas Submersas at the Lisbon Oceanarium",
  author: "Andrey Filippov",
  license: "CC BY 2.0",
  licenseUrl: "https://creativecommons.org/licenses/by/2.0",
  source: "https://commons.wikimedia.org/wiki/File:Lisboa,_Portugal_(48813838571).jpg",
  caption:
    "A deeper view — silhouetted sword plants on the left, yellow-tailed fish moving through the open water column.",
};

const dutchCommunityTank: HistoryImage = {
  src: "/images/history/dutch-style-community-tank.webp",
  alt: "A densely planted community aquarium with Vallisneria — close to the Dutch NBAT style",
  author: "Damitr",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  source: "https://commons.wikimedia.org/wiki/File:Fish_Aquarium_with_Vallisneria.jpg",
  caption:
    "A densely planted community tank in the Dutch tradition — Vallisneria streets, mixed species, fish chosen to complement the plants.",
};

const internationalContestScape: HistoryImage = {
  src: "/images/history/international-contest-scape.webp",
  alt: "A contest aquascape — placed at the IIAC 2021 and RFLAC 2021 international competitions",
  author: "Cho Jaesun (조재선)",
  license: "CC BY-SA 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
  source:
    "https://commons.wikimedia.org/wiki/File:Positive_nihilism-2,_2021_IIAC_R.25,_RFLAC_R.14.jpg",
  caption:
    "\"Positive Nihilism\" — a finalist at the IIAC 2021 and RFLAC 2021 contests. The CIPS / CIAC circuit in China has driven much of the contemporary contest aesthetic.",
};

const triangleDesign: HistoryImage = {
  src: "/images/history/triangle-design.webp",
  alt: "A triangular composition aquascape — a contest-style evolution of the Nature Aquarium",
  author: "Brudinho5",
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
  source:
    "https://commons.wikimedia.org/wiki/File:Aquascape_im_Triangel_Design.jpg",
  caption:
    "Triangular composition — one of the standard layouts inherited from Japanese garden design and refined by ADA-trained aquascapers.",
};

export const history = {
  hero: {
    eyebrow: "History",
    title: "A history of aquascaping",
    subtitle:
      "From Dutch gardens in the 1930s to Takashi Amano's Nature Aquarium revolution to the global contest circuit today — the full story of how a glass box of water became an art form.",
    publishedAt: "2026-05-26T12:00:00.000Z",
    updatedAt: "2026-05-26T12:00:00.000Z",
    heroImage: hero,
  },

  tldr: "Aquascaping began in the Netherlands in the 1930s, was formalised into the Dutch style by 1956, and was transformed into a global creative discipline by the Japanese photographer Takashi Amano in the 1980s and 1990s. Amano's company Aqua Design Amano (ADA, founded 1982) created the Nature Aquarium style that blends Dutch planting with Japanese garden aesthetics, invented the minimalist Iwagumi rock-formation style, popularised carbon dioxide injection, and discovered the algae-eating freshwater shrimp that now bears his name. The International Aquatic Plants Layout Contest, launched by ADA in 2001, turned the hobby into a global sport with thousands of entries from over 70 countries every year. Amano died in 2015 at age 61, but his influence shapes nearly every planted aquarium built today.",

  chapters: [
    {
      number: "01",
      eyebrow: "Before aquascaping",
      title: "The Victorian aquarium",
      body: [
        "Keeping fish indoors in glass containers predates aquascaping by centuries, but it took the Victorians to make it a respectable pastime. The first stable aquariums appeared in London in the 1850s after Philip Henry Gosse coined the term \"aquarium\" in 1854 and the London Zoo opened the first public Fish House. By the late 1800s, brass-framed slate-bottomed tanks were a middle-class fixture in European parlours.",
        "These early aquariums were not aquascapes. The standard arrangement was a few fish in clear water with some rocks and maybe a sparse plant or two. Filtration was minimal, lighting was whatever the room offered, and the goal was the animal, not the scene. Plants were ornamental afterthoughts, often plastic by the 1920s when those became cheap.",
        "That changed in the Netherlands.",
      ],
    },
    {
      number: "02",
      eyebrow: "The Dutch beginning",
      title: "NBAT and the 1930s",
      body: [
        "The Nederlandse Bond Aqua Terra (NBAT, the Dutch Society for Aquarists) was founded in 1930. At its peak the society had more than 24,000 members. The NBAT's magazine became the place where Dutch aquarists shared ideas about plant arrangement, and over the following two decades a recognisable visual style emerged from those pages.",
        "The Dutch innovation was treating the aquarium as a garden. Instead of a few token plants behind a feature rock, Dutch aquarists planted densely across the entire substrate, arranging different species into \"plant streets\" (recht straat) with deliberate colour and height contrast. Fish were chosen to complement the planting rather than the other way around. The result looked unlike anything that had come before: an underwater garden organised with the formality of a Dutch landscape painting.",
        "For the first twenty years, the style developed informally through the magazine. In 1956 the NBAT published the first formal set of guidelines that defined the Dutch Aquascape, and from 1964 the society ran the annual \"Huiskeuring\" (national aquarium championship) where judges visited entrants' homes to inspect aquariums in person rather than relying on photographs.",
        "The rules were strict. A Dutch tank needed at least ten plant species per 100 litres. Stems were arranged in straight or curving streets running diagonally from front to back. Coloured plants were placed at the focal point. Each species occupied a defined block of space and was not allowed to grow into another's territory. The aesthetic was formal, controlled, almost architectural.",
        "This was the first place in the history of fishkeeping where the arrangement of the plants became the point of the tank.",
      ],
      figure: dutchCommunityTank,
      pullQuote:
        "Dutch aquarists planted densely across the entire substrate, arranging different species into plant streets with deliberate colour and height contrast.",
    },
    {
      number: "03",
      eyebrow: "The Japanese revolution",
      title: "Takashi Amano arrives",
      body: [
        "Takashi Amano was born in Niigata, Japan in 1954. By the time he turned fishtank arranger he had already had an unusual life. He competed as a professional keirin track cyclist from 1974, winning over 1,000 races and earning more than one million pounds before retiring in 1990. Throughout his cycling career he was also a serious nature photographer, travelling to the rainforests of Brazil, Gabon, and Borneo with a large-format film camera to document untouched wilderness.",
        "Amano started Aqua Design Amano Co., Ltd. in 1982 to sell aquatic-plant-growing equipment. The retail brand \"Aqua Design Amano\" appeared in 1984 when he opened his eponymous aquarium store in Terao. The Western Dutch tradition was unknown in Japan at the time, and Amano spent the early 1980s developing his own approach by combining what he could learn about Dutch planting with principles drawn from Japanese garden design.",
        "The synthesis was the Nature Aquarium style. Where the Dutch style organised plants like a formal garden, Amano organised plants like a forest. He used asymmetric compositions inspired by the Japanese aesthetic principles of wabi-sabi (beauty in imperfection) and ma (the meaningful use of empty space). He treated driftwood and stone as the bones of the scene and arranged plants to reinforce the natural impression rather than divide the tank into species blocks. Open foreground, dense midground, soft background. A clear focal point following the rule of thirds. Hardscape that suggested an underwater landscape rather than decoration in a tank.",
        "The photographic side of his work mattered as much as the tanks themselves. Amano photographed his aquascapes with the same large-format technique he used in the rainforest, producing high-resolution prints that read like landscape photography of impossibly small places. Those photographs sold the style to the world.",
      ],
      figure: natureStyle,
      pullQuote:
        "Where the Dutch organised plants like a formal garden, Amano organised plants like a forest.",
    },
    {
      number: "04",
      eyebrow: "ADA",
      title: "Aqua Design Amano and the Nature Aquarium",
      body: [
        "ADA grew from a small Niigata startup into the most influential brand in the planted-aquarium world. The company's product range expanded across substrate (Aqua Soil Amazonia, the first widely available active aquasoil), lighting (the ADA Solar series), CO₂ systems (the ADA Beetle series), and aquarium glass (Cube Garden, the first widely available rimless tank).",
        "Amano's first major book Glass no Naka no Daishizen (Nature Aquarium in the Glass) was published in 1992. The three-volume Nature Aquarium World series followed from TFH Publications in 1994, translated into seven languages. The books showed Western aquarists what was possible with a planted tank for the first time and made Amano a household name in the hobby.",
        "The ADA pavilion and the Nature Aquarium Gallery in Niigata became a pilgrimage site for serious aquascapers worldwide. After his death in 2015 the gallery continued operating as a memorial to his work.",
        "ADA's commercial influence cannot be overstated. The active aquasoil category, the rimless tank, the inline CO₂ diffuser, the lily pipe glass return, the specialist aquascape scissor and pinsette, the modern lily-pad floating plant fertiliser system: all originated or were popularised by ADA. Competitor companies (Tropica in Europe, UNS in the United States, ChiHiros and Twinstar in lighting) built their product ranges in dialogue with what ADA shipped first.",
      ],
      figure: florestasWide,
    },
    {
      number: "05",
      eyebrow: "Iwagumi",
      title: "Rocks and Japanese aesthetics",
      body: [
        "The Iwagumi style is Amano's most pure expression of Japanese garden principles in aquarium form. The word means \"rock formation\" in Japanese and the style was first published in the mid-1980s.",
        "A traditional Iwagumi uses an odd number of stones (almost always three or five) arranged according to a strict compositional logic borrowed from Japanese stone gardens. Each stone has a specific name and role:",
        "Iwagumi tanks typically use a single carpeting plant — historically dwarf hairgrass or Riccia fluitans — as the only vegetation, with a single small schooling fish species (often cardinal tetras, rummynose tetras, or harlequin rasboras) as the only livestock. The effect is meditative, minimal, and difficult to execute well.",
        "The Iwagumi has remained the signature style of the Nature Aquarium tradition for forty years and is still the layout most frequently associated with Takashi Amano's name.",
      ],
      figure: iwagumi,
      grid: [
        {
          name: "Oyaishi",
          role: "Primary stone",
          body: "The largest and most striking of the group. Placed at the focal point following the rule of thirds. Sets the direction and energy of the whole composition.",
        },
        {
          name: "Fukuishi",
          role: "Secondary stone",
          body: "The second-largest stone, placed on one side of the Oyaishi. Echoes the colour and texture of the primary stone and balances it visually.",
        },
        {
          name: "Soeishi",
          role: "Accent stone",
          body: "A supporting stone placed near the Oyaishi and Fukuishi to reinforce the primary stone's strength.",
        },
        {
          name: "Suteishi",
          role: "Sacrificial stone",
          body: "A small stone often partially covered by plants. Its role is to tie the composition together without standing out.",
        },
      ],
    },
    {
      number: "06",
      eyebrow: "The Amano shrimp",
      title: "Solving the algae problem",
      body: [
        "In the early 1980s, while developing the Nature Aquarium method, Amano discovered that a small freshwater shrimp from Japanese streams was an exceptional algae grazer. He began stocking the species into his demo tanks and the species rapidly became standard in the hobby worldwide.",
        "The shrimp was originally classified as Caridina japonica (described scientifically in 1892) and was reclassified to Caridina multidentata in 2006 when researchers determined that the species had actually been described first in 1860 under the latter name. The common name \"Amano shrimp\" was adopted by English-speaking aquarists in the early 1990s in recognition of Amano's role in popularising the species. It remains the standard common name today.",
        "What made Amano shrimp matter was that they solved the algae problem that had blocked the spread of dense planted tanks in the West. Heavily lit, densely planted, fertilised aquariums grow plants but also grow algae, and there was no good biological control before Amano shrimp arrived. With 6 to 10 Amano shrimp per 60 litres, hair algae and biofilm stay under control without chemical intervention. Within a decade of Amano's discovery, the species became a default stocking choice for any aquarist attempting the Nature Aquarium style.",
      ],
      figure: {
        src: "/images/atmosphere/amano-macro.webp",
        alt: "Close-up of an Amano shrimp grazing on driftwood",
        author: "Mate Molnar",
        license: "Unsplash",
        source: "https://unsplash.com/photos/Nti1SPucduY",
        caption:
          "Caridina multidentata — better known as the Amano shrimp, named for the man who put it in nearly every planted tank in the world.",
      },
    },
    {
      number: "07",
      eyebrow: "Pressurised CO₂",
      title: "The high-tech planted tank",
      body: [
        "Amano was also the first to popularise pressurised carbon dioxide injection in freshwater aquariums. CO₂ had been used by botanical research aquariums earlier, but the equipment was expensive, finicky, and unavailable to hobbyists. ADA productised it.",
        "The argument was simple. Plants photosynthesise faster with more dissolved CO₂, and faster plant growth outcompetes algae for nutrients. A tank with 25 to 35 ppm dissolved CO₂, balanced lighting, and regular fertilisation grows plants several times faster than a low-tech setup and stays cleaner doing it. The ADA Beetle counter and disposable CO₂ cartridge system put pressurised CO₂ within reach of any committed hobbyist for the first time.",
        "The whole modern high-tech planted tank tradition — intense lighting, pressurised CO₂, full Estimative Index dosing, weekly trimming of stem walls — descends from the CO₂ systems Amano shipped in the late 1980s and early 1990s. The 2HR Aquarist methodology, the Tropica Specialised dosing line, the Dutch revival of the 2000s and 2010s, all assume the equipment Amano made common.",
      ],
    },
    {
      number: "08",
      eyebrow: "The contest era",
      title: "Aquascaping becomes a global sport",
      body: [
        "The International Aquatic Plants Layout Contest (IAPLC) launched in 2001 with 557 entries from 19 countries. ADA hosted it as a way to recognise the best aquascapes from around the world in a single annual competition. The contest grew exponentially.",
        "By 2025 the IAPLC received 1,533 entries from 77 countries and regions, making it the largest planted aquarium contest in history. Submissions are judged on layout, plant condition, photographic quality, and overall artistic impression. Grand prize winners come from every continent. Japan, Vietnam, Thailand, Brazil, and Italy have all produced multiple top-ten finishers. Takayuki Fukada (Japan) won the top prize in 2015 and 2016, one of the few aquascapers to win consecutive years.",
        "The IAPLC changed how aquascaping evolved. Because the contest is judged primarily from photographs, aquascapers began designing layouts that would photograph well rather than necessarily be sustainable long-term ecosystems. Mountain dioramas with cliffs of dragon stone, forest layouts with miniature trees of moss-covered driftwood, and underwater roadways with bonsai-style perspective all emerged as a contest aesthetic distinct from the everyday Nature Aquarium tradition.",
        "Two other major international contests sit alongside the IAPLC. The Aquatic Gardeners Association in the United States actually ran the first such contest in 2000 — one year before the IAPLC — and its public archive of every submission since then is the most complete visual record of the planted-aquarium tradition. The CIPS International Aquascaping Contest in China, founded in 2017, has grown rapidly alongside China's emergence as the largest single market for aquascaping products. Together the three contests receive more than three thousand entries every year from over eighty countries.",
      ],
    },
    {
      number: "09",
      eyebrow: "Modern styles",
      title: "Beyond Nature Aquarium",
      body: [
        "The Nature Aquarium style remains the dominant visual tradition, but several distinct schools have emerged since the 1990s.",
        "Jungle style is a deliberately wilder take on the planted tank. Where the Nature Aquarium prizes balance and clear focal points, jungle scapes embrace overgrowth, dense layered planting, and a sense of tropical chaos. Vallisneria, large swords, broad-leaf hygrophila, and floating plants dominate. The style is forgiving of imperfect trimming and well suited to low-tech tanks.",
        "Biotope aquariums attempt to recreate a specific natural habitat. The plants, fish, hardscape, and substrate all match what would actually be found in a defined geographic location: the Rio Negro in Brazil, Lake Tanganyika, peat swamps of Borneo, or temperate streams of Vietnam. Biotope aquascapes are judged on accuracy to the source habitat rather than visual composition.",
        "Diorama aquariums are the contest-driven extreme of the Nature Aquarium tradition. Mountain ranges built from dragon stone, ancient forests built from moss-covered manzanita branches, underwater valleys lit to suggest sunrise. Diorama scapes prioritise the photograph above all else and often use forced perspective tricks that only work from a single viewing angle.",
        "Wabi-kusa is a separate Amano invention. A ball of substrate wrapped in mesh and planted with emersed aquatic plants, kept in a partially filled glass vessel. Hardscape-only layouts strip the aquascape down to stones, wood, and substrate without any living plants — the aesthetic borrows directly from Japanese karesansui (dry landscape) gardens.",
      ],
      figure: triangleDesign,
    },
    {
      number: "10",
      eyebrow: "August 2015",
      title: "The death of Takashi Amano",
      body: [
        "Takashi Amano died on 4 August 2015 at the age of 61 from complications of pneumonia. His final major project was the world's largest Nature Aquarium installation at the Oceanário de Lisboa in Portugal, a 160,000-litre planted aquarium that opened in April 2015. ADA completed the installation and operates it as a permanent tribute.",
        "The hobby Amano shaped continued without him but visibly slowed in its rate of innovation. ADA has continued to grow under his successors, the IAPLC has continued to expand, and a new generation of aquascapers including Dennis Wong (founder of 2HR Aquarist), George Farmer in the UK, James Findley in the US, and Oliver Knott in Germany have carried different parts of his legacy forward. None has displaced Amano as the gravitational figure of the discipline.",
      ],
    },
    {
      number: "11",
      eyebrow: "Today",
      title: "The hobby Amano left us",
      body: [
        "The hobby Amano helped invent is now a global subculture with measurable economic weight. Aquascaping supply companies including ADA, Tropica, Aquasabi, Dennerle, ChiHiros, Twinstar, UNS, and dozens of regional brands support a market that runs into the billions of dollars annually. The IAPLC, AGA, and CIPS contests collectively receive more than three thousand entries per year from over eighty countries.",
        "A modern planted aquarium uses substrate, lighting, CO₂ systems, fertilisation regimes, and tank styles that all trace directly to choices Amano and ADA made between 1982 and 2015. The Nature Aquarium aesthetic dominates retail aquarium photography. The Iwagumi remains the canonical demonstration tank in aquarium shops worldwide. The Amano shrimp is still the algae crew of choice in nearly every planted tank that has one.",
        "The hobby's two main directions today both build on Amano's foundation. High-tech planted tanks with pressurised CO₂ and intense lighting pursue the photographic-quality scapes of the IAPLC tradition. Low-tech and Walstad-style tanks (Diana Walstad's 1999 book Ecology of the Planted Aquarium established the alternative) take the Nature Aquarium aesthetic and adapt it for keepers without CO₂ systems. Both halves of the modern hobby would have been unrecognisable in the Dutch aquarium world of the 1950s.",
      ],
    },
  ] satisfies ReadonlyArray<HistoryChapter>,

  florestasGallery: {
    intro:
      "Florestas Submersas opened at the Oceanário de Lisboa in April 2015 and remains the largest Nature Aquarium installation ever built. 160,000 litres, 78 metres of viewing glass, more than 40 plant species, schooling fish, and Amano's signature use of driftwood as the structural spine of the scene. It was his final major project — he died four months later. ADA still maintains the installation as a permanent tribute.",
    href: "https://www.adana.co.jp/en/lisbon/",
    hrefLabel: "Read ADA's project page for Florestas Submersas",
    images: [florestasDetail, florestasFish, florestasSchool] as ReadonlyArray<HistoryImage>,
  },

  studios: [
    {
      slug: "ada",
      name: "Aqua Design Amano (ADA)",
      founded: "1982",
      country: "Niigata, Japan",
      blurb:
        "Takashi Amano's company. Originator of the Nature Aquarium style, Iwagumi, the modern rimless tank, active aquasoil, the lily pipe, and pressurised CO₂ for the hobbyist. The Nature Aquarium Gallery in Niigata is still open to visitors.",
      url: "https://www.adana.co.jp/en/",
    },
    {
      slug: "nbat",
      name: "Nederlandse Bond Aqua Terra (NBAT)",
      founded: "1930",
      country: "Netherlands",
      blurb:
        "The Dutch Society for Aquarists. Codified the original Dutch Aquascape rules in 1956 and ran the annual home-inspection Huiskeuring contest from 1964. The first organisation to treat plant arrangement as the discipline.",
      url: "https://www.nbat.nl",
    },
    {
      slug: "aga",
      name: "Aquatic Gardeners Association",
      founded: "1985",
      country: "United States",
      blurb:
        "The first Western organisation dedicated to planted aquariums. Launched the international AGA Aquascaping Contest in 2000 — one year before the IAPLC — and still hosts every submission since then in a public online archive.",
      url: "https://www.aquatic-gardeners.org",
    },
  ] satisfies ReadonlyArray<Studio>,

  contests: [
    {
      slug: "iaplc",
      name: "International Aquatic Plants Layout Contest",
      acronym: "IAPLC",
      founded: "2001",
      host: "Aqua Design Amano (ADA), Japan",
      blurb:
        "The largest planted-aquarium contest in the world. Founded by Takashi Amano and ADA in 2001 with 557 entries from 19 countries, the IAPLC has grown into the gravitational centre of the global hobby. Submissions are judged on layout, plant condition, photographic quality, and overall artistic impression — which has reshaped the visual language of aquascaping itself.",
      stats: [
        { label: "Founded", value: "2001" },
        { label: "2025 entries", value: "1,533" },
        { label: "Countries", value: "77" },
        { label: "Host", value: "ADA, Japan" },
      ],
      url: "https://iaplc.com/e/",
      image: iaplcEntry,
    },
    {
      slug: "aga",
      name: "AGA International Aquascaping Contest",
      acronym: "AGA",
      founded: "2000",
      host: "Aquatic Gardeners Association, USA",
      blurb:
        "The first international aquascaping contest in history — predating the IAPLC by one year. Run by the Aquatic Gardeners Association (founded 1985, the first Western planted-aquarium organisation). Free to enter, and every submission since 2000 lives on the AGA archive in perpetuity, making it the most complete historical record of planted-aquarium design over the past 25 years.",
      stats: [
        { label: "Founded", value: "2000" },
        { label: "2025 entries", value: "426" },
        { label: "Countries", value: "52" },
        { label: "Host", value: "AGA, USA" },
      ],
      url: "https://showcase.aquatic-gardeners.org/",
      image: agaContestWinner,
    },
    {
      slug: "cips",
      name: "CIPS International Aquascaping Contest",
      acronym: "CIAC",
      founded: "2017",
      host: "China International Pet Show / CFAA",
      blurb:
        "The newest of the big three. Launched in 2017 by the China International Pet Show with the China Fisheries Association Aquascaping, the CIAC has scaled rapidly alongside the boom in Chinese aquascaping. CIPS also runs separate marine (CMAC) and biotope (CBAC) contests, making it the broadest contest portfolio in the world.",
      stats: [
        { label: "Founded", value: "2017" },
        { label: "2025 entries", value: "680" },
        { label: "Countries", value: "28" },
        { label: "Host", value: "CIPS / CFAA, China" },
      ],
      url: "https://ciacen.cipscom.com/sc.htm",
      image: internationalContestScape,
    },
  ] satisfies ReadonlyArray<Contest>,

  timeline: [
    {
      year: "1854",
      title: "Term coined",
      body: "Philip Henry Gosse coins the word \"aquarium\". London opens the first public Fish House.",
    },
    {
      year: "1930",
      title: "NBAT founded",
      body: "The Nederlandse Bond Aqua Terra forms in the Netherlands. Dutch-style aquarium ideas start spreading in its magazine.",
    },
    {
      year: "1956",
      title: "Dutch rules",
      body: "NBAT publishes the first formal Dutch Aquascape guidelines — the first set of aquascaping rules ever written.",
    },
    {
      year: "1982",
      title: "ADA founded",
      body: "Takashi Amano starts Aqua Design Amano Co., Ltd. in Niigata, Japan.",
    },
    {
      year: "1992",
      title: "Nature Aquarium book",
      body: "Glass no Naka no Daishizen publishes. Three-volume English-language edition follows from TFH in 1994.",
    },
    {
      year: "2001",
      title: "IAPLC launches",
      body: "ADA launches the International Aquatic Plants Layout Contest with 557 entries from 19 countries.",
    },
    {
      year: "2015",
      title: "Amano dies",
      body: "Takashi Amano dies at 61, four months after opening the world's largest Nature Aquarium at the Oceanário de Lisboa.",
    },
    {
      year: "2025",
      title: "Global sport",
      body: "The IAPLC receives 1,533 entries from 77 countries. AGA, CIPS, and IAPLC together exceed 3,000 entries.",
    },
  ] satisfies ReadonlyArray<TimelineEvent>,

  faqs: [
    {
      question: "Who invented modern aquascaping?",
      answer:
        "Takashi Amano (1954 to 2015) is widely credited with founding modern aquascaping. The Japanese photographer and former pro cyclist founded Aqua Design Amano (ADA) in 1982, developed the Nature Aquarium style by blending Dutch planting techniques with Japanese garden aesthetics, and launched the International Aquatic Plants Layout Contest in 2001 which turned the hobby into a global sport.",
    },
    {
      question: "Where did aquascaping start?",
      answer:
        "In the Netherlands. The Dutch aquarium style was formalised by the Nederlandse Bond Aqua Terra (NBAT, founded 1930) and gave the world the first set of aquascaping rules in 1956. The Dutch style focused on dense plant arrangements in \"streets\" or \"rows\" with strict colour and height contrast. Modern Japanese aquascaping built on this foundation roughly fifty years later.",
    },
    {
      question: "What is the most famous aquascaping competition?",
      answer:
        "The International Aquatic Plants Layout Contest (IAPLC) is the largest and most prestigious. Founded by Takashi Amano and ADA in 2001 with 557 entries from 19 countries, by 2025 it received 1,533 entries from 77 countries and regions. The AGA International Aquascaping Contest (since 2000) and the CIPS International Aquascaping Contest (since 2017) are the other major global contests.",
    },
    {
      question: "What is the Iwagumi style?",
      answer:
        "Iwagumi is a Japanese aquascaping style developed by Takashi Amano in the mid-1980s based on the principles of Japanese rock gardens. The word means \"rock formation\" in Japanese. A traditional Iwagumi uses an odd number of stones (usually three or five) named Oyaishi (primary), Fukuishi (secondary), Soeishi (accent), and Suteishi (supporting), arranged according to the rule of thirds.",
    },
    {
      question: "Why is it called Amano shrimp?",
      answer:
        "Caridina multidentata was nicknamed \"Amano shrimp\" after Takashi Amano popularised the species in the early 1980s when he discovered its exceptional ability to eat algae in planted aquariums. The species was formerly classified as Caridina japonica and reclassified in 2006. The common name stuck and is now used worldwide.",
    },
    {
      question: "When did aquascaping become a global hobby?",
      answer:
        "The 1990s and 2000s. Amano's first photo book Glass no Naka no Daishizen (Nature Aquarium in the Glass) was published in 1992 and translated into seven languages. His three-volume Nature Aquarium World series (TFH Publications, 1994) reached an English-speaking audience. The launch of the IAPLC in 2001 then turned aquascaping from a regional interest into a global competitive art form.",
    },
  ] satisfies ReadonlyArray<HistoryFaq>,

  sources: [
    { label: "Wikipedia: Takashi Amano", url: "https://en.wikipedia.org/wiki/Takashi_Amano" },
    {
      label: "ADA Aqua Design Amano: official founder profile",
      url: "https://www.adana.co.jp/en/contents/takashiamano/",
    },
    { label: "Wikipedia: Aquascaping", url: "https://en.wikipedia.org/wiki/Aquascaping" },
    {
      label: "International Aquatic Plants Layout Contest (IAPLC)",
      url: "https://iaplc.com/e/",
    },
    {
      label: "AGA International Aquascaping Contest archive",
      url: "https://showcase.aquatic-gardeners.org/",
    },
    {
      label: "Wikipedia: Caridina multidentata (Amano shrimp)",
      url: "https://en.wikipedia.org/wiki/Caridina_multidentata",
    },
    {
      label: "CIPS International Aquascaping Contest (CIAC)",
      url: "https://ciacen.cipscom.com/sc.htm",
    },
    {
      label: "The Green Machine: The Power of ADA",
      url: "https://thegreenmachineonline.com/blog/the-power-ada-history-takashi-amano-ada/",
    },
    {
      label: "TFH Magazine: The Enduring Legacy of Takashi Amano",
      url: "https://www.tfhmagazine.com/articles/aquatic-plants/enduring-legacy-of-takashi-amano",
    },
    {
      label: "ADA: The World's Largest Nature Aquarium Project at Oceanário de Lisboa",
      url: "https://www.adana.co.jp/en/lisbon/",
    },
    {
      label: "Aquascaping Love: Dutch Aquarium history",
      url: "https://aquascapinglove.com/basics/the-dutch-aquarium/",
    },
    {
      label: "Aquasabi wiki: Iwagumi",
      url: "https://www.aquasabi.com/aquascaping-wiki_aquascaping_iwagumi",
    },
  ] satisfies ReadonlyArray<HistorySource>,
} as const;
