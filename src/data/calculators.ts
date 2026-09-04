/**
 * Metadata for the aquascaping calculators. The interactive tool for each is a
 * client component matched by `component` in the /calculators/[slug] route.
 */

export type CalculatorComponent =
  | "tank-volume"
  | "substrate"
  | "co2"
  | "dosing";

export interface CalculatorMeta {
  slug: string;
  component: CalculatorComponent;
  name: string;
  spot: string;
  intro: string;
  faqs: { question: string; answer: string }[];
  related?: { label: string; href: string }[];
}

export const CALCULATORS: ReadonlyArray<CalculatorMeta> = [
  {
    slug: "aquarium-volume",
    component: "tank-volume",
    name: "Aquarium Volume Calculator",
    spot: "Work out how many litres and gallons your tank actually holds.",
    intro:
      "The volume printed on a tank is often the nominal size, not what it really holds once you account for glass thickness and the fact you never fill it to the brim. Measure the inside dimensions and this gives you the true glass volume, the equivalent in US and imperial gallons, and a realistic water volume after substrate and hardscape. Use that realistic figure for dosing and stocking, since that is the water your fish and ferts actually sit in.",
    faqs: [
      {
        question: "How do I calculate aquarium volume in litres?",
        answer:
          "Multiply length by width by height in centimetres, then divide by 1000. So a 60 by 30 by 36 cm tank is 64.8 litres of glass volume. Measure the inside of the glass, and knock off around 15% for substrate, hardscape and the gap at the top to get the real water volume.",
      },
      {
        question: "Why is my tank's real volume less than the label says?",
        answer:
          "Two reasons. Tank sizes are often rounded up or quoted as the nominal size, and you never fill to the very top, plus substrate and hardscape displace water. The realistic figure this gives you, roughly 85% of the glass volume, is the one to use for dosing and stocking.",
      },
    ],
    related: [
      { label: "Stocking by tank size", href: "/tanks" },
      { label: "Plan a full tank", href: "/planner" },
    ],
  },
  {
    slug: "substrate",
    component: "substrate",
    name: "Substrate Calculator",
    spot: "How much aquasoil, sand or gravel you need for your tank.",
    intro:
      "Buy too little substrate and you are back at the shop mid-scape; buy too much and you have a spare bag gathering dust. Enter your tank footprint and how deep you want the bed and this works out the litres you need, plus a rough weight so you know how many bags to carry home. A planted tank usually wants five to eight centimetres, sloping deeper at the back, so round up and allow a little extra for the slope.",
    faqs: [
      {
        question: "How much substrate do I need for my aquarium?",
        answer:
          "Multiply the tank length by width by your chosen depth in centimetres and divide by 1000 for the litres. A 60 by 30 cm footprint at 6 cm deep needs about 10.8 litres. Round up and add a bit for a back-to-front slope, which most scapes want.",
      },
      {
        question: "How deep should aquarium substrate be?",
        answer:
          "Around 5 to 8 cm for a planted tank, deeper at the back for depth and to root taller plants, shallower at the front. Carpets need at least 3 to 4 cm to root into. Too shallow and roots struggle, too deep and the lower layer can go anaerobic.",
      },
    ],
    related: [
      { label: "Compare substrates", href: "/substrates" },
      { label: "Aquarium volume calculator", href: "/calculators/aquarium-volume" },
    ],
  },
  {
    slug: "co2",
    component: "co2",
    name: "CO2 and Drop Checker Calculator",
    spot: "Estimate dissolved CO2 from your pH and KH, and read the safe range.",
    intro:
      "CO2 is the biggest lever for demanding plants and also the fastest way to harm fish if you overdo it. This estimates the dissolved CO2 in your tank from its pH and carbonate hardness, and tells you whether you are short, in the 25 to 30 ppm sweet spot, or pushing into dangerous territory. It pairs with a drop checker rather than replacing it, since the drop checker's fixed reference fluid sidesteps the buffering quirks that can throw the pH and KH method off.",
    faqs: [
      {
        question: "How do you calculate dissolved CO2 in an aquarium?",
        answer:
          "The usual approximation is CO2 in mg per litre equals 3 times your KH in dKH times 10 to the power of (7 minus pH). It assumes carbonate is the main buffer, so tannins, phosphate buffers and some substrates can throw it off. Treat it as a guide and confirm with a drop checker.",
      },
      {
        question: "What is a safe CO2 level for a planted tank?",
        answer:
          "Most high-tech planted tanks aim for around 25 to 30 ppm, where a 4 dKH drop checker sits green. Above roughly 40 ppm you risk fish gasping and suffocating, so cut the injection back and add surface agitation if you see that.",
      },
    ],
    related: [
      { label: "How to run CO2 safely", href: "/equipment/co2-injection" },
      { label: "Browse aquarium plants", href: "/plants" },
    ],
  },
  {
    slug: "fertiliser-dosing",
    component: "dosing",
    name: "Fertiliser Dosing Calculator",
    spot: "Turn dry salts into ppm, or a target level into grams to weigh out.",
    intro:
      "Dry dosing is cheap and precise once you know the numbers, and this does the numbers for you. Pick a salt, enter your tank's water volume, and either say how many grams you are adding to see the ppm it lifts each nutrient, or set a target and get the grams to weigh out. The yields come straight from the molar masses, so potassium nitrate reads as 61% nitrate and 39% potassium by weight, and so on. Rough weekly targets are shown to aim at.",
    faqs: [
      {
        question: "How do I calculate dry fertiliser dosing for a planted tank?",
        answer:
          "Each salt yields a fixed amount of each nutrient by weight. Potassium nitrate, for example, is about 613 mg of nitrate and 387 mg of potassium per gram, so the ppm rise is that figure times the grams added, divided by your tank litres. This calculator runs both directions for the common salts.",
      },
      {
        question: "What are the EI dosing targets?",
        answer:
          "Estimated Index aims for generous, non-limiting nutrients, roughly 10 to 30 ppm nitrate, 1 to 3 ppm phosphate, 10 to 30 ppm potassium and 5 to 10 ppm magnesium across a week, split over several doses with a large water change at the end. They are starting points, not gospel, so tune to your tank.",
      },
    ],
    related: [
      { label: "Aquarium lighting and plant demand", href: "/equipment/lighting" },
      { label: "Browse aquarium plants", href: "/plants" },
    ],
  },
];

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}
