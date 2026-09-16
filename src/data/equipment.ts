/**
 * Equipment how-to guides. Deliberately educational, not a product database:
 * these teach how to choose and size gear using the general rules that hold
 * across brands (PAR bands, turnover multipliers, watts per litre), rather
 * than quoting specific product specs that would need a manufacturer source.
 */

export interface EquipmentSection {
  heading: string;
  body: string;
}

export interface QuickRefRow {
  label: string;
  value: string;
}

export interface EquipmentGuide {
  slug: string;
  name: string;
  spot: string;
  tldr: string;
  sections: EquipmentSection[];
  quickRef?: { title: string; note?: string; rows: QuickRefRow[] };
  faqs: { question: string; answer: string }[];
  related?: { label: string; href: string }[];
}

export const EQUIPMENT: ReadonlyArray<EquipmentGuide> = [
  {
    slug: "lighting",
    name: "Aquarium Lighting",
    spot: "How much light your plants actually need, and why brighter isn't better.",
    tldr: "Light drives plant growth, but it drives algae just as hard, so the goal is to match light to what your plants and CO2 can keep up with, not to fit the brightest fixture you can find. Low-light plants like anubias, java fern, crypts and mosses want modest light and no CO2. Demanding carpets and red stems want strong light plus CO2, or they melt and hand the extra light to algae instead. Run six to eight hours on a timer and adjust from there.",
    sections: [
      {
        heading: "How much light you need",
        body: "Plant demand is usually described in PAR, the amount of usable light reaching the substrate. Easy plants are happy in low light, most stems and easy carpets want medium, and demanding carpets and reds need high light and the CO2 to match. If you give high light without CO2 and nutrients to back it, the plants can't use the extra and algae takes it instead. When in doubt, start lower and raise it slowly.",
      },
      {
        heading: "Photoperiod",
        body: "Six to eight hours a day suits most planted tanks, on a timer so it stays consistent. Longer does not mean more growth, it mostly means more algae. If you get algae, shorten the day before you reach for anything else. A consistent schedule matters more than the exact length.",
      },
      {
        heading: "Depth and spread",
        body: "Light falls off fast with depth, so a tall tank needs a stronger fixture to reach the same PAR at the substrate as a shallow one. Spread matters too: a single spotlight leaves dark corners where plants sulk and algae settles. Aim for even coverage across the whole footprint.",
      },
      {
        heading: "Colour temperature and spectrum",
        body: "Colour temperature, measured in Kelvin, is about how the tank looks and how well plants show their colour, not really about growth. Plants grow across a wide spectrum, so this is mostly aesthetic. Around 6500K is a clean, natural daylight that suits most planted tanks and makes greens and reds pop. Warmer, lower-Kelvin light looks yellow; cooler, higher-Kelvin light looks blue and clinical. A fixture with a bit of red and blue in the mix flatters plant colour, which is why full-spectrum planted lights look richer than a plain white shop light.",
      },
    ],
    quickRef: {
      title: "Light demand by plant type",
      note: "Rough PAR at the substrate. Pair high light with CO2.",
      rows: [
        { label: "Low (anubias, java fern, crypts, mosses)", value: "~15 to 30 PAR, no CO2 needed" },
        { label: "Medium (most stems, easy carpets)", value: "~30 to 50 PAR" },
        { label: "High (demanding carpets, red stems)", value: "50+ PAR, CO2 required" },
        { label: "Colour temperature", value: "~6500K for a natural planted look" },
        { label: "Photoperiod", value: "6 to 8 hours on a timer" },
      ],
    },
    faqs: [
      {
        question: "Is too much light bad for a planted tank?",
        answer:
          "Yes. Light the plants can't use, because they're short on CO2 or nutrients, goes straight to feeding algae. Match light to your plants and CO2, and start lower rather than higher.",
      },
      {
        question: "How long should aquarium lights be on?",
        answer:
          "Six to eight hours a day on a timer suits most planted tanks. Longer mostly grows more algae, not more plant. If algae appears, shorten the photoperiod first.",
      },
    ],
    related: [
      { label: "Browse aquarium plants", href: "/plants" },
      { label: "The complete planted-tank guide", href: "/planted-tank-guide" },
    ],
  },
  {
    slug: "filtration",
    name: "Aquarium Filtration",
    spot: "How much filter flow you need, and which filter type suits your tank.",
    tldr: "Filtration does two jobs: it moves water so nothing stagnates, and it houses the bacteria that process waste. For a planted community, aim for a turnover of roughly four to six times the tank volume per hour, more for a heavily stocked or hillstream tank, less for a gentle shrimp setup. Rated flow is optimistic once media is in, so size up a little. Sponge filters suit shrimp and nano tanks, canisters suit larger planted tanks, and a HOB is the easy middle ground.",
    sections: [
      {
        heading: "How much flow",
        body: "Turnover is the filter's rated litres per hour divided by the tank volume. Four to six times the tank volume per hour is a good target for a planted community. A shrimp or nano tank can run gentler, around three to five times, while a messy or high-flow tank wants eight to ten. Remember rated figures assume an empty filter, so real turnover drops by a third or so once it is full of media.",
      },
      {
        heading: "Filter types",
        body: "Sponge filters are cheap, gentle and shrimp-safe, ideal for nano and breeding tanks. Hang-on-back filters are easy to service and fine for small to mid community tanks. Canisters hide under the tank, hold the most media and push the most water, which makes them the go-to for larger planted tanks. Internal filters are a compact backup option.",
      },
      {
        heading: "Biological media is what matters",
        body: "The mechanical floss and the chemical media are secondary. The heart of a filter is the biological media, the porous surface where bacteria live and process ammonia. Never rinse all of it at once or replace it wholesale, or you knock back the colony and risk an ammonia spike. Rinse it gently in old tank water and only when flow drops.",
      },
      {
        heading: "How to layer the media",
        body: "Water should hit the coarsest mechanical stage first and the finest last, so debris is caught progressively without clogging everything at once. In a canister that means coarse sponge, then finer sponge or floss, then the bulk of the biological media, with any chemical media like carbon last and only when you actually need it. Getting the order right keeps flow up and means you can rinse the mechanical stages often while leaving the biological media undisturbed.",
      },
    ],
    quickRef: {
      title: "Turnover targets",
      note: "Filter flow as a multiple of tank volume per hour. Rated flow drops with media.",
      rows: [
        { label: "Shrimp / nano (gentle)", value: "3 to 5x per hour" },
        { label: "Planted community", value: "4 to 6x per hour" },
        { label: "Heavily stocked / hillstream", value: "8 to 10x per hour" },
        { label: "Reality check", value: "Real flow is ~30% below the rated figure once full" },
      ],
    },
    faqs: [
      {
        question: "What size filter do I need?",
        answer:
          "Aim for a filter rated at four to six times your tank volume per hour for a planted community, and size up a little because real flow drops once the filter is full of media. The tank planner works out the range for your exact volume.",
      },
      {
        question: "How often should I clean my filter?",
        answer:
          "Only when the flow noticeably drops, and never all the media at once. Rinse the biological media gently in old tank water so you keep the bacteria alive. Cleaning too thoroughly can trigger an ammonia spike.",
      },
    ],
    related: [
      { label: "Plan a tank and its filter flow", href: "/planner" },
      { label: "Stocking by tank size", href: "/tanks" },
    ],
  },
  {
    slug: "co2-injection",
    name: "CO2 Injection",
    spot: "Whether you actually need CO2, and how to run it safely if you do.",
    tldr: "CO2 is the single biggest lever for demanding plants, but it is optional, not compulsory. A low-tech tank of anubias, ferns, crypts and mosses grows fine without it. Carpets, red stems and fast lush growth really want it. If you inject, use a drop checker and aim for green, ramp the bubble rate up slowly over days, turn the gas on an hour or two before the lights and off before lights out, and never let it climb far enough to gas the fish. Stability matters more than a high number.",
    sections: [
      {
        heading: "Do you need CO2",
        body: "No, for a low-tech tank built around easy plants. Yes, if you want a tight carpet, deep reds, or fast dense growth. The honest middle path is to pick plants that suit whether you will inject or not, rather than fighting demanding plants in a tank with no CO2, which is a reliable route to algae and melt.",
      },
      {
        heading: "Methods",
        body: "Pressurised CO2 from a cylinder and regulator is the proper way, steady and controllable. DIY yeast bottles are cheap but drift and run out, so they suit only small tanks. Liquid carbon products are not true CO2 and give a modest boost at best, though they double as a spot treatment for algae. For anything beyond easy plants, pressurised is the one that works.",
      },
      {
        heading: "The parts of a CO2 system",
        body: "A pressurised setup is a chain of parts, each doing one job. The cylinder holds the gas. The regulator steps the high tank pressure down to a usable working pressure, and its built-in solenoid is the electric valve that lets a timer switch the gas on and off. A needle valve fine-tunes the flow, and a bubble counter lets you see and set the rate in bubbles per second. A check valve stops water siphoning back up the line when the gas is off. Finally a diffuser or inline reactor dissolves the CO2 into the water, and a drop checker hangs in the tank as your gauge. Buy a regulator with the solenoid and needle valve already integrated, it saves a lot of fiddling.",
      },
      {
        heading: "Setting it up, step by step",
        body: "Screw the regulator onto the cylinder with its sealing washer and check it is snug. Fit the bubble counter and check valve in line, then run tubing to the diffuser low in the tank, under good flow so the mist spreads. Put the solenoid on the same timer as, or just ahead of, the lights. Fill the drop checker with 4 dKH reference fluid and hang it away from the diffuser so it reads the tank, not the bubbles. Open the needle valve slowly to a slow bubble rate to start, then leave it a day before adjusting. Always turn a fresh cylinder on gently and check every joint for leaks with soapy water.",
      },
      {
        heading: "Dialling it in",
        body: "A drop checker with 4 dKH reference fluid is your gauge, though it lags by an hour or so, so read it against the clock. Blue means too little CO2, green is the sweet spot, and yellow means too much, which is dangerous for livestock. Start low, raise the bubble rate a little each day, and watch the fish. If they gasp at the surface, back off at once and add surface agitation.",
      },
    ],
    quickRef: {
      title: "The CO2 chain, in order",
      note: "Gas flows from the cylinder through each part to the tank.",
      rows: [
        { label: "Cylinder", value: "Holds the pressurised CO2" },
        { label: "Regulator + solenoid", value: "Drops pressure; the timer switches it on and off" },
        { label: "Needle valve + bubble counter", value: "Set and see the bubble rate" },
        { label: "Check valve", value: "Stops water siphoning back up the line" },
        { label: "Diffuser or reactor", value: "Dissolves the gas into the water" },
        { label: "Drop checker", value: "Blue = low, green = target, yellow = danger" },
        { label: "Timing", value: "On 1 to 2h before lights, off ~1h before lights out" },
      ],
    },
    faqs: [
      {
        question: "Do I need CO2 for a planted tank?",
        answer:
          "Not for easy low-light plants like anubias, java fern, crypts and mosses. You do need it for carpets, red stems and fast lush growth. Pick plants that suit whichever way you go.",
      },
      {
        question: "Is CO2 dangerous for fish?",
        answer:
          "It can be if you overdo it. Too much CO2 starves fish of oxygen, which is why the drop checker turning yellow is a warning. Ramp up slowly, keep it green, and turn it off before lights out.",
      },
    ],
    related: [
      { label: "CO2 and pH drop-checker calculator", href: "/calculators/co2" },
      { label: "How KH, pH and CO2 relate", href: "/water-chemistry" },
      { label: "Circulation and flow", href: "/equipment/circulation-and-flow" },
      { label: "Low-light plants that need no CO2", href: "/guides/low-light-aquarium-plants-no-co2" },
    ],
  },
  {
    slug: "heaters",
    name: "Aquarium Heaters",
    spot: "What wattage heater you need and how to set the temperature.",
    tldr: "As a rule of thumb, budget around one to one and a half watts of heater per litre for a tank in a normal room, more if the room runs cold. Set the temperature to the overlap of your species, which for most community tropicals sits around 24 to 26 degrees. Always check it with a separate thermometer rather than trusting the dial, place the heater where flow carries the warmth around, and on a bigger tank two smaller heaters give you a safety net if one fails.",
    sections: [
      {
        heading: "Wattage",
        body: "Around one to one and a half watts per litre covers most tanks in a heated room. A cold room, a big temperature gap, or a large tank pushes you toward the higher end. Undersizing means the heater runs constantly and still loses the battle on a cold night; a little oversized is safer.",
      },
      {
        heading: "Temperature by species",
        body: "Set the tank to the overlap of everyone in it. Most community tropicals are happy at 24 to 26 degrees. Some species want cooler or warmer water, so check before mixing, and lean on the planner or the species pages to find a temperature band that suits the whole stocking.",
      },
      {
        heading: "Placement and redundancy",
        body: "Put the heater where water flows past it, near the filter outflow or inflow, so the warmth spreads instead of pooling. Verify the real temperature with an independent thermometer, since built-in dials drift. On a larger tank, two heaters that each cover about half the load mean a stuck-on or stuck-off failure is far less likely to cook or chill the tank.",
      },
    ],
    quickRef: {
      title: "Heater sizing",
      rows: [
        { label: "Normal room", value: "~1 to 1.5 watts per litre" },
        { label: "Cold room or large tank", value: "Toward the higher end, or two heaters" },
        { label: "Community tropical temperature", value: "24 to 26 C" },
        { label: "Always", value: "Verify with a separate thermometer" },
      ],
    },
    faqs: [
      {
        question: "What wattage heater do I need?",
        answer:
          "Budget around one to one and a half watts per litre for a normal room, more if the room is cold or the tank is large. Rounding up a little is safer than undersizing.",
      },
      {
        question: "What temperature should a tropical tank be?",
        answer:
          "Most community tropicals sit happily at 24 to 26 degrees. Set the tank to the overlap of all your species, and check the real temperature with a separate thermometer rather than the heater dial.",
      },
    ],
    related: [
      { label: "Browse fish and their temperature ranges", href: "/fish" },
      { label: "Plan a tank", href: "/planner" },
    ],
  },
  {
    slug: "circulation-and-flow",
    name: "Circulation & Flow",
    spot: "Why moving water to every corner matters, and how to kill dead spots.",
    tldr: "Flow does more than the filter alone. It carries CO2, nutrients and heat to every plant and stops waste settling into dead spots where black beard algae and anaerobic pockets form. You want gentle, even movement that reaches all corners, not a wind tunnel that pins the fish and flattens the plants. A little surface agitation or a skimmer keeps the film off the top and gas exchange up, and a small powerhead fixes dead corners in a bigger tank. In a CO2 tank especially, good flow is what actually delivers the gas to the leaves.",
    sections: [
      {
        heading: "Why flow matters",
        body: "The filter's job is not just to clean, it is to move water. Even circulation spreads CO2, nutrients and warmth to every plant and keeps detritus suspended long enough to reach the filter instead of rotting in a corner. Where flow is weak, waste settles, oxygen drops, and black beard algae and cyanobacteria move in. The goal is gentle, even movement everywhere, not brute force. Too much flow is its own problem: fish fight the current, carpets lift, and delicate plants get battered.",
      },
      {
        heading: "Surface agitation and skimmers",
        body: "A little movement at the surface breaks up the oily film that can form there and drives gas exchange, pulling oxygen in, which matters most at night when plants stop producing it. A surface skimmer, or simply angling the outflow up toward the surface, handles this. The trade-off in a CO2 tank is that surface agitation also off-gasses CO2, so you balance the two: enough movement for oxygen and a clean surface, not so much that you can't hold a stable CO2 level.",
      },
      {
        heading: "Finding and fixing dead spots",
        body: "Watch where detritus settles and where algae favours one corner, those are your dead spots. Aim the filter outflow to push water along the back glass so it sweeps around the tank in a gentle loop, rather than firing straight across. A spray bar spreads flow more evenly than a single nozzle. In a larger or awkwardly shaped tank, a small powerhead or wavemaker aimed at the stagnant area clears it without cranking up the whole tank.",
      },
    ],
    quickRef: {
      title: "Reading your flow",
      rows: [
        { label: "The goal", value: "Gentle, even movement to every corner" },
        { label: "Detritus or BBA in one spot", value: "A dead spot, aim flow there" },
        { label: "Fish struggling, plants flattened", value: "Too much flow, ease it off" },
        { label: "Oily film on the surface", value: "Add agitation or a skimmer" },
        { label: "CO2 tanks", value: "More surface agitation off-gasses CO2, balance it" },
      ],
    },
    faqs: [
      {
        question: "Why is algae only in one corner of my tank?",
        answer:
          "That corner almost certainly has weak flow. Detritus settles and black beard algae or cyanobacteria take hold where water is stagnant. Aim your outflow to sweep that area, or add a small powerhead, and it usually clears.",
      },
      {
        question: "Do I need a surface skimmer?",
        answer:
          "It is not essential, but it keeps the surface film off and improves gas exchange, which helps oxygen levels. Angling the filter outflow up at the surface does much the same job for free.",
      },
      {
        question: "Can I have too much flow?",
        answer:
          "Yes. If fish are pinned against the glass or struggle to swim, carpets lift, or delicate plants get battered, the flow is too strong. Aim for gentle movement everywhere rather than raw power.",
      },
    ],
    related: [
      { label: "Filtration and turnover", href: "/equipment/filtration" },
      { label: "Running CO2 (flow delivers the gas)", href: "/equipment/co2-injection" },
      { label: "Black beard algae in low-flow spots", href: "/algae/black-beard-algae" },
      { label: "Plan a tank", href: "/planner" },
    ],
  },
];

export function getEquipmentGuide(slug: string): EquipmentGuide | undefined {
  return EQUIPMENT.find((e) => e.slug === slug);
}
