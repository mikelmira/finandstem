import type { GearCategory } from "@/types/gear";
import type { DisplayField } from "@/lib/gear/fields";

export interface GearCategoryMeta {
  id: GearCategory;
  label: string;
  singular: string;
  /** One line for hub cards. */
  tagline: string;
  /** TL;DR, the direct answer to "how do I choose one". */
  intro: string;
  howToChoose: string[];
  subtypes: Record<string, string>;
  /** Fields shown on cards (as a range across models). */
  cardFields: DisplayField[];
  /** Rows of the compare table and the model table, in order. */
  tableFields: DisplayField[];
  faqs: { question: string; answer: string }[];
  related: { label: string; href: string }[];
}

export const GEAR_CATEGORY_ORDER: ReadonlyArray<GearCategory> = [
  "aquariums",
  "filters",
  "lights",
  "co2",
  "heaters",
  "hardscape",
  "pumps",
  "air-pumps",
  "sterilisers",
  "cooling",
  "plumbing",
  "stands",
];

export const GEAR_CATEGORIES: Record<GearCategory, GearCategoryMeta> = {
  aquariums: {
    id: "aquariums",
    label: "Aquariums",
    singular: "aquarium",
    tagline: "Rimless, framed and all-in-one tanks, with real dimensions and volumes.",
    intro:
      "Pick the tank around the scape you want, not the other way round. Footprint matters more than litres for a planted tank: a long, shallow tank gives you depth for perspective and lets light reach the carpet, while a tall tank needs a stronger light and longer arms for trimming. Rimless low-iron glass looks best but costs more and needs a level, flat stand. Framed tanks with a lid are cheaper, evaporate less and are safer with jumpers. All-in-one tanks hide the filter in a rear chamber, which is tidy but limits your filter choice. Check glass thickness against height, check the volume you will actually have once substrate and hardscape go in (roughly 15 to 20 percent less), and make sure the floor and stand can carry about 1.2 kg per litre.",
    howToChoose: [
      "Decide the footprint first. 60 × 30 cm and 90 × 45 cm are the two most common scaping sizes, and most lights, stands and lids are made for them.",
      "Allow 15 to 20 percent less water than the stated volume once substrate and hardscape are in.",
      "Rimless tanks need a perfectly level stand and usually a leveling mat. Framed tanks are more forgiving.",
      "Taller than 45 cm means stronger light, longer tools and more effort to maintain the foreground.",
    ],
    subtypes: {
      rimless: "Rimless",
      framed: "Framed",
      "all-in-one": "All-in-one",
      desktop: "Desktop / nano",
      "with-cabinet": "With cabinet",
    },
    cardFields: ["volumeL", "dimensions"],
    tableFields: ["volumeL", "dimensions", "glassMm", "weightKg"],
    faqs: [
      {
        question: "What size aquarium is best for a first planted tank?",
        answer:
          "Somewhere between 45 and 90 litres. A 60 × 30 cm tank (around 55 to 65 litres) is the classic starting point: big enough to stay stable, small enough that water changes and trimming stay quick, and every light, stand and filter maker has products sized for it.",
      },
      {
        question: "Is a rimless tank worth it?",
        answer:
          "If the tank is on show, usually yes. Low-iron glass and no frame make the scape the focus. The trade-offs are price, more evaporation without a lid, and the need for a flat, level stand with a mat underneath.",
      },
      {
        question: "How much does a full aquarium weigh?",
        answer:
          "Plan on roughly 1.2 kg per litre of stated volume once you add glass, substrate, rock and water. A 120 litre tank lands around 140 to 150 kg, so use a proper stand and avoid weak floors.",
      },
      {
        question: "Does glass thickness matter?",
        answer:
          "Yes, mainly with height. Makers size the glass for the tank, but as a rough guide 4 to 5 mm suits small nanos, 6 mm is typical at 30 to 36 cm tall, 8 mm around 45 cm and 10 mm or more beyond that.",
      },
    ],
    related: [
      { label: "Stocking by tank size", href: "/tanks" },
      { label: "Aquarium volume calculator", href: "/calculators/aquarium-volume" },
      { label: "Nano aquarium guide", href: "/guides/nano-aquarium-guide" },
      { label: "Set up a planted tank", href: "/guides/how-to-set-up-a-planted-aquarium" },
    ],
  },
  filters: {
    id: "filters",
    label: "Filters",
    singular: "filter",
    tagline: "Canister, hang-on-back and internal filters, matched to your tank's flow needs.",
    intro:
      "For a planted tank, aim for a filter rated at roughly 5 to 10 times your tank volume per hour. That sounds high, but makers rate flow with an empty filter and no hoses, so real flow with media in it is often a third lower. A canister is the usual choice for scapes over 45 litres because the hardware lives in the cabinet and you can fit lily pipes, an inline CO2 diffuser and an inline heater. Hang-on-back filters are simple and cheap for small tanks, and internal or sponge filters suit shrimp and quarantine tanks. Look at media volume as well as flow, since more media means a more stable tank, and check the hose size matches the pipes or inline gear you want to use.",
    howToChoose: [
      "Target a rated flow of 5 to 10 times tank volume per hour. For a 60 litre tank that is about 300 to 600 L/h.",
      "More media volume means steadier water. Canisters win here.",
      "Match the hose diameter (12/16 or 16/22 mm are common) to your lily pipes, CO2 reactor or inline heater.",
      "Shrimp tanks need a guarded intake: a pre-filter sponge on the inlet or a sponge filter.",
    ],
    subtypes: {
      canister: "Canister",
      "hang-on-back": "Hang-on-back",
      internal: "Internal",
      sponge: "Sponge",
      top: "Top filter",
    },
    cardFields: ["flowLph", "tankRange"],
    tableFields: ["flowLph", "tankRange", "powerW", "mediaL", "hoseMm", "heaterW", "headM", "dimensions"],
    faqs: [
      {
        question: "What size filter do I need for my aquarium?",
        answer:
          "Aim for a rated flow of about 5 to 10 times the tank volume per hour. A 60 litre planted tank wants roughly 300 to 600 L/h, a 120 litre tank 600 to 1,200 L/h. Use the tank-size filter on this page to see which models land in that window.",
      },
      {
        question: "Why is my filter weaker than the box says?",
        answer:
          "Rated flow is measured with an empty filter and no hoses. Media, hose length, height to the tank and a dirty pre-filter all cut it, often by 30 to 50 percent. That is why we match on a band that goes a little above 10 times turnover.",
      },
      {
        question: "Canister or hang-on-back for a planted tank?",
        answer:
          "Canister for most tanks over 45 litres: more media, quieter, hidden in the cabinet and compatible with lily pipes and inline CO2. A hang-on-back is fine for small or budget tanks, but it agitates the surface, which drives off CO2.",
      },
      {
        question: "Is too much flow a problem?",
        answer:
          "It can be. Slow swimmers like bettas and pygmy fish struggle, and a jet across the surface wastes injected CO2. Point the outlet along the long wall, use a spray bar or lily pipe, and throttle back with the tap if fish are being pushed around.",
      },
    ],
    related: [
      { label: "Filtration explained", href: "/equipment/filtration" },
      { label: "Circulation and flow", href: "/equipment/circulation-and-flow" },
      { label: "Tank planner (flow check)", href: "/planner" },
      { label: "Lily pipes and skimmers", href: "/gear/plumbing" },
    ],
  },
  lights: {
    id: "lights",
    label: "Lights",
    singular: "light",
    tagline: "Planted-tank LEDs sized to your tank length, with power and spectrum.",
    intro:
      "Buy a light for your tank length first and your plants second. Most aquarium LEDs are sold to fit a tank size (a 60 cm light for a 60 cm tank), and the fixture should be the same length or slightly shorter so the ends of the tank are not in shadow. How much light you need depends on your plants: anubias, ferns and crypts are happy in low light, while carpets and red stems want high light and, realistically, CO2 to go with it. RGB and WRGB lights make reds and greens pop and let you tune the colour, while plain white lights are cheaper and still grow plants well. App control and a built-in sunrise and sunset are worth having, because a steady 6 to 8 hour photoperiod is one of the best defences against algae.",
    howToChoose: [
      "Match the light to your tank length. The light should be as long as the tank or a little shorter.",
      "Low light for epiphytes and crypts, medium for most stem plants, high only with CO2 and good fertilising.",
      "WRGB and RGB lights show off colours; white-only lights grow plants just as well for less money.",
      "A timer or app with ramping makes a 6 to 8 hour photoperiod effortless.",
    ],
    subtypes: {
      bar: "Bar / clip-on",
      "clip-on": "Clip-on",
      pendant: "Pendant",
      stand: "Stand-mounted",
      paludarium: "Paludarium",
    },
    cardFields: ["fitsRange", "powerW"],
    tableFields: ["fitsRange", "lengthCm", "powerW", "lumens", "kelvin"],
    faqs: [
      {
        question: "What size light do I need for my aquarium?",
        answer:
          "One made for your tank length. Lights are sold to fit tank sizes, so a 60 cm tank takes a 60 cm light. Slightly shorter is fine, longer usually means buying legs or a hanging kit.",
      },
      {
        question: "How much light do aquarium plants need?",
        answer:
          "Low-light plants like anubias and java fern are fine at about 15 to 30 PAR at the substrate. Most stem plants like 30 to 50. Carpets and red plants want 50 or more, and at that level you really need injected CO2 to avoid algae.",
      },
      {
        question: "Is a WRGB light better for plants?",
        answer:
          "For growth, not dramatically. The extra red and blue channels mostly change how the tank looks, making reds richer and greens deeper. A good white LED grows plants well; WRGB is about presentation and control.",
      },
      {
        question: "How many hours should aquarium lights be on?",
        answer:
          "Six to eight hours at full intensity is a good target for a planted tank. Start at six on a new tank and add time only once plants are growing and algae stays away.",
      },
    ],
    related: [
      { label: "Lighting explained", href: "/equipment/lighting" },
      { label: "Low-tech vs high-tech", href: "/guides/low-tech-vs-high-tech-planted-tank" },
      { label: "Low-light plants", href: "/guides/low-light-aquarium-plants-no-co2" },
      { label: "Algae ID", href: "/algae" },
    ],
  },
  co2: {
    id: "co2",
    label: "CO2",
    singular: "CO2 product",
    tagline: "Regulators, diffusers, drop checkers and complete kits.",
    intro:
      "Pressurised CO2 is the single biggest upgrade for plant growth, and the parts are simpler than they look: a cylinder holds the gas, a regulator drops the pressure and a solenoid turns it off at night, a needle valve and bubble counter let you set the rate, and a diffuser or reactor dissolves it into the water. A drop checker then tells you roughly how much is in the tank. Dual-stage regulators hold a steadier output as the cylinder empties, which avoids the dreaded end-of-tank dump. Match the diffuser to your tank size, or go inline on the canister outlet for a cleaner look. Always put a check valve between the tank and the regulator.",
    howToChoose: [
      "Start with the regulator. Dual-stage with a solenoid is the safe long-term choice.",
      "Match the cylinder fitting to the regulator (paintball, CGA320 or disposable cartridge).",
      "Size the diffuser to the tank, or fit an inline diffuser on the canister outlet.",
      "A drop checker is cheap insurance. Aim for lime green by lights-on.",
    ],
    subtypes: {
      kit: "Complete kit",
      regulator: "Regulator",
      diffuser: "Diffuser",
      "drop-checker": "Drop checker",
      "bubble-counter": "Bubble counter",
      cylinder: "Cylinder",
      controller: "Controller",
    },
    cardFields: ["tankRange"],
    tableFields: ["tankRange", "hoseMm", "dimensions", "weightKg"],
    faqs: [
      {
        question: "Do I need a CO2 system for a planted tank?",
        answer:
          "No, plenty of beautiful tanks run without it on low-light plants. You need CO2 when you want high light, dense carpets or demanding red stems. Without it, strong light mostly grows algae.",
      },
      {
        question: "Single-stage or dual-stage regulator?",
        answer:
          "Dual-stage if you can. A single-stage regulator can release a burst of gas as the cylinder runs low, which can gas fish overnight. Dual-stage holds a steady output right to the end.",
      },
      {
        question: "Which CO2 diffuser should I buy?",
        answer:
          "One rated for your tank volume, placed low near the filter outlet so the mist circulates. On larger tanks an inline diffuser or reactor on the canister outlet dissolves more gas and keeps the glass clear.",
      },
      {
        question: "How do I know how much CO2 is in my tank?",
        answer:
          "Use a drop checker with 4 dKH reference solution. Blue means too little, lime green is about right (around 30 ppm) and yellow means too much. Watch the fish as well: gasping at the surface means turn it down.",
      },
    ],
    related: [
      { label: "CO2 injection explained", href: "/equipment/co2-injection" },
      { label: "CO2 calculator", href: "/calculators/co2" },
      { label: "Low-tech vs high-tech", href: "/guides/low-tech-vs-high-tech-planted-tank" },
      { label: "Water chemistry", href: "/water-chemistry" },
    ],
  },
  heaters: {
    id: "heaters",
    label: "Heaters",
    singular: "heater",
    tagline: "Glass, inline and smart heaters, sized by watts per litre.",
    intro:
      "Most tropical planted tanks sit at 23 to 26 °C, and the rule of thumb for a heater is about 1 watt per litre in a normally heated room. Go up towards 1.5 W/L if the room gets cold in winter, and on big tanks consider two smaller heaters instead of one large one, so a stuck heater cannot cook the tank and a dead one does not leave it freezing. Glass heaters are cheap and reliable, inline heaters sit on the canister return hose so nothing is visible in the tank, and electronic or app heaters show the actual temperature and warn you if something goes wrong. Mount a heater where water flows past it, and use a separate thermometer to check it.",
    howToChoose: [
      "About 1 W per litre in a normal room; up to 1.5 W/L in a cold one.",
      "Tanks over 200 litres: two heaters of half the size each are safer than one.",
      "Inline heaters keep the tank clean but need the right hose size for your filter.",
      "Put the heater in the flow and check it with a separate thermometer.",
    ],
    subtypes: {
      glass: "Glass",
      inline: "Inline",
      titanium: "Titanium",
      preset: "Preset",
      smart: "Electronic / app",
    },
    cardFields: ["heaterW", "tankRange"],
    tableFields: ["heaterW", "tankRange", "lengthCm", "hoseMm"],
    faqs: [
      {
        question: "What size heater do I need?",
        answer:
          "Roughly 1 watt per litre. A 60 litre tank takes a 50 to 75 W heater, a 120 litre tank 100 to 150 W. If your room drops below about 18 °C in winter, size up.",
      },
      {
        question: "Do planted tanks need a heater?",
        answer:
          "If you keep tropical fish or shrimp, yes, unless your room holds a steady 23 °C or more year round. Many plants actually prefer the cooler end, so a heated tank does not need to run hot.",
      },
      {
        question: "Are inline heaters better?",
        answer:
          "They are tidier and heat evenly because all the filtered water passes through them. They need a canister with the matching hose size and a little more care when you service the filter.",
      },
      {
        question: "Where should the heater go?",
        answer:
          "Near the filter outlet or intake where water moves past it, angled so it is not buried in substrate. Poor flow around a heater causes hot and cold spots.",
      },
    ],
    related: [
      { label: "Heaters explained", href: "/equipment/heaters" },
      { label: "Cooling fans and chillers", href: "/gear/cooling" },
      { label: "Stocking by tank size", href: "/tanks" },
    ],
  },
  cooling: {
    id: "cooling",
    label: "Cooling",
    singular: "cooling unit",
    tagline: "Fans and chillers for tanks that run too warm.",
    intro:
      "Planted tanks tend to overheat in summer and under strong lights, and warm water holds less oxygen and less CO2 just when plants and fish need more. A clip-on fan blowing across the surface is the cheap fix: evaporation can pull the temperature down 2 to 4 °C, at the cost of topping up more often. A chiller is the serious option for hot climates, shrimp tanks and cold-water plants. It sits inline on the canister and holds a set temperature, but it costs more, needs space and ventilation, and uses real power.",
    howToChoose: [
      "A fan is enough if the tank only creeps 2 to 3 °C over target on hot days.",
      "Size a chiller by tank volume and how far below room temperature you need to go.",
      "Chillers need airflow around them; a closed cabinet will defeat them.",
      "Top up with RO or dechlorinated water when using fans, evaporation concentrates minerals.",
    ],
    subtypes: { chiller: "Chiller", fan: "Cooling fan" },
    cardFields: ["tankRange", "powerW"],
    tableFields: ["tankRange", "powerW", "flowLph", "heaterW", "dimensions"],
    faqs: [
      {
        question: "How do I cool down a hot aquarium?",
        answer:
          "Turn the lights down or shorten the photoperiod, open the lid, and point a fan across the surface. That usually buys 2 to 4 °C. If the room itself is hot for months, a chiller is the reliable answer.",
      },
      {
        question: "Do cooling fans really work?",
        answer:
          "Yes, through evaporation. The trade-off is water loss, often a litre or more a day on a medium tank, so top up regularly with clean water.",
      },
      {
        question: "What temperature is too hot for a planted tank?",
        answer:
          "Most tropical fish cope to about 28 °C, but many plants and Caridina shrimp start to struggle above 26 °C, and oxygen drops as it warms. Aim to keep summer peaks below 28 °C.",
      },
      {
        question: "Do I need a chiller for shrimp?",
        answer:
          "For Caridina in a warm climate, often yes. Neocaridina are much more tolerant and usually manage with a fan.",
      },
    ],
    related: [
      { label: "Heaters", href: "/gear/heaters" },
      { label: "Freshwater shrimp guide", href: "/freshwater-shrimp-guide" },
      { label: "Heaters explained", href: "/equipment/heaters" },
    ],
  },
  pumps: {
    id: "pumps",
    label: "Pumps",
    singular: "pump",
    tagline: "Return pumps, powerheads and wavemakers for flow and circulation.",
    intro:
      "Extra flow fixes a lot of planted-tank problems. Dead spots behind hardscape collect debris and grow algae, and CO2 and fertiliser only reach plants that water actually moves past. A small circulation pump or wavemaker placed to push water along the long wall solves that without upgrading the filter. Return pumps are for sumps and DIY builds, where the rated flow and the head (how high the pump can lift) both matter. Choose a pump with adjustable flow if you can, so you can tune it for the fish.",
    howToChoose: [
      "For circulation, add enough to reach roughly 10 times turnover with the filter included.",
      "Check the head figure for return pumps; flow drops sharply as height increases.",
      "Adjustable or DC pumps let you dial flow down for gentle fish.",
      "Guard intakes in shrimp tanks.",
    ],
    subtypes: { "water-pump": "Water / return pump", circulation: "Circulation / wavemaker" },
    cardFields: ["flowLph", "powerW"],
    tableFields: ["flowLph", "headM", "powerW", "tankRange", "dimensions"],
    faqs: [
      {
        question: "Do planted tanks need a circulation pump?",
        answer:
          "Not always, but it helps in tanks over about 90 litres or with dense hardscape. If you see debris settling in one area or algae on plants far from the outlet, add circulation.",
      },
      {
        question: "What does pump head mean?",
        answer:
          "It is the height the pump can push water to, at which point flow reaches zero. A pump rated at 1,000 L/h and 1.5 m head might only move half that when lifting water a metre.",
      },
      {
        question: "Where should I place a wavemaker?",
        answer:
          "Usually at one end, pointing along the long wall so the water rolls around the tank, and away from delicate plants and resting spots.",
      },
      {
        question: "Can I use a pump instead of a filter?",
        answer:
          "No. A pump moves water but does not host bacteria or catch debris. It adds flow on top of a filter.",
      },
    ],
    related: [
      { label: "Circulation and flow", href: "/equipment/circulation-and-flow" },
      { label: "Filters", href: "/gear/filters" },
    ],
  },
  "air-pumps": {
    id: "air-pumps",
    label: "Air pumps",
    singular: "air pump",
    tagline: "Mains and battery air pumps for sponge filters and oxygen at night.",
    intro:
      "In a CO2-injected tank an air stone during the day drives off the CO2 you are paying for, but at night it is useful: running an air pump when the lights go off lifts oxygen while plants are not producing any. Air pumps also run sponge filters in shrimp and fry tanks, and a battery or AC/DC pump keeps oxygen going during power cuts. Choose one with a little more output than you think you need and an adjustable valve, and look for a low noise rating if it sits in a living room.",
    howToChoose: [
      "Size by tank volume and how many sponge filters or stones it runs.",
      "An AC/DC or battery model keeps fish alive through power cuts.",
      "Put it on a timer to run at night in CO2 tanks.",
      "Mount it above the water line or use a check valve.",
    ],
    subtypes: { "air-pump": "Mains", battery: "Battery / AC-DC" },
    cardFields: ["airLpm", "tankRange"],
    tableFields: ["airLpm", "outlets", "powerW", "tankRange", "dimensions"],
    faqs: [
      {
        question: "Does a planted tank need an air pump?",
        answer:
          "Not necessarily. Healthy plants make plenty of oxygen by day. An air pump is handy at night, in heavily stocked tanks, for sponge filters and as a power-cut backup.",
      },
      {
        question: "Will an air stone remove CO2?",
        answer:
          "Yes, surface agitation drives CO2 out. Run the air stone only when the lights are off if you inject CO2.",
      },
      {
        question: "How big an air pump do I need?",
        answer:
          "Use the maker's tank rating as a guide and size up if you run several outlets or deep tanks, since output drops with depth.",
      },
      {
        question: "Why does my air pump need a check valve?",
        answer:
          "If the pump sits below the water line and the power cuts, water can siphon back down the airline into it. A one-way check valve stops that.",
      },
    ],
    related: [
      { label: "Filters (sponge)", href: "/gear/filters" },
      { label: "CO2 injection explained", href: "/equipment/co2-injection" },
    ],
  },
  sterilisers: {
    id: "sterilisers",
    label: "UV & sterilisers",
    singular: "steriliser",
    tagline: "UV clarifiers and electrolytic units for green water and algae.",
    intro:
      "A UV clarifier kills free-floating algae and bacteria as water passes a UV-C lamp, which is why it clears green water in days. It does nothing for algae growing on plants, glass or hardscape, and it does not fix the cause, which is usually too much light or unbalanced nutrients. Electrolytic units like Twinstar and Chihiros Doctor work differently, using a small current to discourage algae spores. Treat any of them as a helper while you fix light, CO2 and nutrients, not as a cure.",
    howToChoose: [
      "Size the lamp wattage and flow to your tank; too much flow through a UV cuts its effect.",
      "Plan to replace UV-C lamps about once a year.",
      "Electrolytic units suit nano and medium tanks and need regular cleaning.",
      "Fix the cause of algae alongside, see the algae ID guide.",
    ],
    subtypes: { uv: "UV clarifier", electrolytic: "Electrolytic" },
    cardFields: ["tankRange", "uvW"],
    tableFields: ["tankRange", "uvW", "flowLph", "powerW", "dimensions"],
    faqs: [
      {
        question: "Does a UV steriliser get rid of algae?",
        answer:
          "It clears green water (algae floating in the water). It does not remove hair, spot or black beard algae growing on surfaces.",
      },
      {
        question: "Is UV safe for plants and fish?",
        answer:
          "Yes, the light stays inside the unit. Some keepers note it can break down a little of the iron from liquid fertilisers, so dose in the morning and see how your plants respond.",
      },
      {
        question: "Do electrolytic algae devices work?",
        answer:
          "Many keepers report fewer algae problems in nano tanks with them, but results vary and they work best alongside good light and nutrient balance.",
      },
      {
        question: "How long should I run a UV clarifier?",
        answer:
          "For green water, continuously for a week or two while you correct the cause. Some people then run it permanently as prevention.",
      },
    ],
    related: [
      { label: "Algae ID", href: "/algae" },
      { label: "Clear aquarium water", href: "/guides/how-to-get-clear-aquarium-water" },
    ],
  },
  plumbing: {
    id: "plumbing",
    label: "Lily pipes & skimmers",
    singular: "pipe or skimmer",
    tagline: "Glass and metal lily pipes, surface skimmers and inflow/outflow sets.",
    intro:
      "Lily pipes replace the chunky green or grey pipes that come with a canister filter, and they change how the tank looks and flows. The outflow spreads water in a gentle fan, the inflow sits discreetly in a corner, and both come in clear glass or stainless steel. A surface skimmer pulls off the oily film that builds up on the water, which improves gas exchange and keeps light clear. The main thing to check is the hose size: lily pipes are made for specific filter hose diameters.",
    howToChoose: [
      "Match the pipe to your filter hose inner diameter (13, 17 mm and so on).",
      "Glass looks cleanest but needs cleaning; stainless steel is tougher.",
      "Poppy-style outflows break the surface a little; violet-style keep it calmer for CO2.",
      "Skimmers remove surface film, which helps oxygen exchange.",
    ],
    subtypes: { "lily-pipe": "Lily pipe", "surface-skimmer": "Surface skimmer" },
    cardFields: ["hoseMm", "tankRange"],
    tableFields: ["hoseMm", "tankRange", "flowLph", "powerW", "dimensions"],
    faqs: [
      {
        question: "What is a lily pipe?",
        answer:
          "A replacement inflow and outflow pipe for a canister filter, usually in glass or stainless steel. The outflow spreads water evenly and looks far neater than stock pipes.",
      },
      {
        question: "What size lily pipe do I need?",
        answer:
          "One made for your filter's hose inner diameter. Hose sizes are usually written as inner/outer, for example 12/16 mm, and the lily pipe needs to match the inner figure.",
      },
      {
        question: "Why is there a film on my tank surface?",
        answer:
          "It is a mix of proteins and oils from food and plants. It blocks gas exchange and light, and a surface skimmer or an outflow that ripples the surface slightly clears it.",
      },
      {
        question: "Do glass lily pipes need cleaning?",
        answer:
          "Yes, every few weeks, as algae and biofilm coat them. A pipe brush and a soak in diluted hydrogen peroxide or a lily pipe cleaner does the job.",
      },
    ],
    related: [
      { label: "Filters", href: "/gear/filters" },
      { label: "Circulation and flow", href: "/equipment/circulation-and-flow" },
    ],
  },
  stands: {
    id: "stands",
    label: "Stands & cabinets",
    singular: "stand",
    tagline: "Cabinets and stands with the footprint they are built for.",
    intro:
      "A stand has two jobs: carry a lot of weight evenly and keep the tank perfectly level. Buy one made for your tank's footprint, never one smaller than the tank, and check it can carry about 1.2 kg per litre of the tank's volume. A cabinet with space for a canister, CO2 cylinder and cables keeps the setup tidy, and doors that open wide make filter maintenance much easier. Rimless tanks especially need a flat, rigid top.",
    howToChoose: [
      "Match the stand to the tank footprint exactly, or slightly larger.",
      "Check the rated load against 1.2 kg per litre of tank volume.",
      "Leave room inside for the canister, CO2 cylinder and a power strip above the floor.",
      "Level it before the tank goes on, and use a mat under rimless tanks.",
    ],
    subtypes: { cabinet: "Cabinet", stand: "Open stand" },
    cardFields: ["dimensions"],
    tableFields: ["dimensions", "fitsRange", "weightKg"],
    faqs: [
      {
        question: "Can I put an aquarium on regular furniture?",
        answer:
          "Only small nanos. Furniture is not built for a concentrated load of 70 kg or more and can sag, which cracks tanks. Use a proper aquarium stand for anything above about 30 litres.",
      },
      {
        question: "How do I level an aquarium stand?",
        answer:
          "Put a spirit level on the top in both directions and shim the feet until it reads true, then check again once the empty tank is on it.",
      },
      {
        question: "What goes inside an aquarium cabinet?",
        answer:
          "Usually the canister filter, the CO2 cylinder and regulator, and the power board. Keep the board high and add drip loops to every cable.",
      },
      {
        question: "Does a rimless tank need a mat?",
        answer:
          "Most makers recommend one. The mat takes up tiny unevenness in the stand so the glass is supported evenly.",
      },
    ],
    related: [
      { label: "Aquariums", href: "/gear/aquariums" },
      { label: "Set up a planted tank", href: "/guides/how-to-set-up-a-planted-aquarium" },
    ],
  },
  paludarium: {
    id: "paludarium",
    label: "Paludarium & wabi-kusa",
    singular: "paludarium product",
    tagline: "Enclosures, misting systems and fans for emersed and terrestrial scapes.",
    intro:
      "Paludariums and wabi-kusa setups grow plants out of the water, which needs high humidity, gentle air movement and a way to keep the plants wet. Glass enclosures with a front opening make planting and misting easy, misting systems keep humidity up without daily hand spraying, and small circulation fans stop stale, mouldy air. Most emersed-grown aquarium plants, mosses and ferns do well in these setups, and they are a great way to use the same plants you grow underwater.",
    howToChoose: [
      "Pick an enclosure with ventilation you can control; sealed glass gets mouldy.",
      "A timed misting system saves daily hand spraying.",
      "A small fan keeps air moving and plants healthier.",
      "Choose plants that grow emersed: mosses, ferns, bucephalandra, crypts, many stems.",
    ],
    subtypes: { enclosure: "Enclosure", misting: "Misting", fan: "Fan" },
    cardFields: ["dimensions", "volumeL"],
    tableFields: ["dimensions", "volumeL", "powerW", "flowLph"],
    faqs: [
      {
        question: "What is a paludarium?",
        answer:
          "A tank that combines a water section with a land or wall section where plants grow emersed. They often include a waterfall or mist and suit mosses, ferns and bog plants.",
      },
      {
        question: "What is wabi-kusa?",
        answer:
          "A ball of substrate planted with emersed aquatic plants, kept in a shallow dish of water or a glass container. It is simple, compact and looks great on a desk.",
      },
      {
        question: "Do paludariums need misting?",
        answer:
          "Most do, unless the enclosure is humid enough from the water section alone. A timed mister makes it hands off.",
      },
      {
        question: "Which aquarium plants grow out of water?",
        answer:
          "Many are grown emersed on farms anyway: most mosses, java fern, anubias, bucephalandra, crypts, hydrocotyle and many stem plants.",
      },
    ],
    related: [
      { label: "Aquatic moss guide", href: "/aquatic-moss-guide" },
      { label: "Attaching plants to wood and rock", href: "/guides/attaching-plants-to-driftwood-and-rock" },
    ],
  },
  tools: {
    id: "tools",
    label: "Tools",
    singular: "tool",
    tagline: "Tweezers, scissors, scrapers and cleaning tools for planting and upkeep.",
    intro:
      "Good tools make planting and trimming far quicker and kinder to plants. Long tweezers push small plants into the substrate without uprooting them, curved scissors trim carpets flat, wave scissors reach stems from above, and a sharp glass scraper keeps the front panel clear. Stainless steel lasts; buy lengths that suit your tank depth so your hand stays out of the water.",
    howToChoose: [
      "Tweezers and scissors about as long as your tank is tall.",
      "Curved scissors for carpets, straight or spring for stems.",
      "Use a plastic scraper blade on acrylic, metal on glass.",
      "Rinse in fresh water and dry after use.",
    ],
    subtypes: {
      tweezers: "Tweezers",
      scissors: "Scissors",
      scraper: "Glass scraper",
      "substrate-tool": "Substrate tool",
      "gravel-cleaner": "Gravel cleaner",
      "magnet-cleaner": "Magnet cleaner",
    },
    cardFields: ["lengthCm"],
    tableFields: ["lengthCm", "weightKg", "powerW", "flowLph"],
    faqs: [
      {
        question: "What tools do I need for aquascaping?",
        answer:
          "A pair of long tweezers, a pair of scissors (curved if you grow a carpet) and a glass scraper cover most jobs. Add a sand flattener and a gravel vacuum as you go.",
      },
      {
        question: "How long should aquascaping tweezers be?",
        answer:
          "Roughly the height of your tank. 25 to 30 cm suits most 30 to 45 cm tall tanks.",
      },
      {
        question: "Will scissors rust?",
        answer:
          "Stainless tools resist rust but not forever. Rinse in fresh water and dry them after each use.",
      },
      {
        question: "Can I use a razor blade on my tank?",
        answer:
          "On glass, yes, held flat. Never on acrylic, and keep it away from silicone seams.",
      },
    ],
    related: [
      { label: "Trimming and propagating", href: "/guides/how-to-trim-and-propagate-aquarium-plants" },
      { label: "How to plant an aquarium", href: "/guides/how-to-plant-an-aquarium" },
      { label: "Maintenance routine", href: "/aquarium-maintenance" },
    ],
  },
  feeders: {
    id: "feeders",
    label: "Auto feeders",
    singular: "feeder",
    tagline: "Automatic feeders for holidays and routine.",
    intro:
      "An automatic feeder is useful for holidays and for keeping portions consistent. In a planted tank the risk is overfeeding, since uneaten food feeds algae, so set small portions and test it for a week while you are home. Dry flake and small pellets work best; keep the feeder away from lid condensation so food does not clump.",
    howToChoose: [
      "Test portions for a week before you leave.",
      "Keep the food dry: away from condensation, with a vent or fan if needed.",
      "Most healthy adult fish are fine without food for a long weekend.",
      "Pick one with a manual feed button and clear portion control.",
    ],
    subtypes: { "auto-feeder": "Auto feeder" },
    cardFields: ["capacityMl"],
    tableFields: ["capacityMl", "dimensions", "powerW"],
    faqs: [
      {
        question: "Do I need an automatic feeder for a weekend away?",
        answer:
          "Usually not. Healthy adult fish cope fine for two or three days. For a week or more, a tested auto feeder is safer than asking someone to guess portions.",
      },
      {
        question: "Can automatic feeders overfeed?",
        answer:
          "Yes, and in a planted tank that means algae. Start with the smallest portion and adjust.",
      },
      {
        question: "Why does food clump in my feeder?",
        answer:
          "Humidity from the tank. Mount it away from the lid gap, or choose a model with an air vent or fan.",
      },
      {
        question: "What food works in an auto feeder?",
        answer:
          "Dry flakes, granules and small pellets. Avoid frozen or gel foods.",
      },
    ],
    related: [{ label: "Maintenance routine", href: "/aquarium-maintenance" }],
  },
  hardscape: {
    id: "hardscape",
    label: "Hardscape",
    singular: "hardscape",
    tagline: "Real stone, wood and bonsai pieces, with what each does to your water.",
    intro:
      "Hardscape is the skeleton of a scape, and the material matters as much as the shape. Calcareous stones like Seiryu slowly raise pH and hardness, which suits a hard-water community but works against soft-water shrimp. Dragon stone, lava rock and most slates are inert. Wood releases tannins that tint the water and nudge pH down, and many pieces float until they are soaked. Pick one stone type and one wood type for a coherent look, buy a few more pieces than you think, and arrange them dry before the tank is filled.",
    howToChoose: [
      "Check the effect on water: calcareous stone raises hardness, wood lowers pH slightly.",
      "Stick to one stone and one wood type for a natural look.",
      "Buy a spread of sizes: a main stone, a few supports and small accent pieces.",
      "Soak wood before use and scrub stone to clear dust.",
    ],
    subtypes: {
      stone: "Stone",
      wood: "Wood",
      "sand-gravel": "Sand & gravel",
      bonsai: "Bonsai tree",
      set: "Hardscape set",
    },
    cardFields: [],
    tableFields: ["dimensions", "weightKg"],
    faqs: [
      {
        question: "Which aquarium rocks raise pH?",
        answer:
          "Calcareous stones such as Seiryu, Texas holey rock and many limestones. A drop of acid fizzing on the stone is the quick test. Dragon stone, lava rock and slate are generally inert.",
      },
      {
        question: "Why does driftwood turn the water brown?",
        answer:
          "Tannins leaching out of the wood. They are harmless and many fish like them. Soaking and boiling the wood first, water changes and activated carbon all reduce the tint.",
      },
      {
        question: "How much hardscape do I need?",
        answer:
          "More than you expect. As a rough guide for a rock scape, allow about 1 kg of stone per 5 to 6 litres of tank, and buy a mix of large, medium and small pieces.",
      },
      {
        question: "How do I stop driftwood floating?",
        answer:
          "Soak it for days or weeks until waterlogged, boil smaller pieces, or weigh it down with stone or tie it to a slate base.",
      },
    ],
    related: [
      { label: "Hardscape types", href: "/hardscape" },
      { label: "Aquarium hardscape guide", href: "/aquarium-hardscape-guide" },
      { label: "Aquascaping design", href: "/aquascaping-design" },
    ],
  },
};

export function gearCategoryMeta(id: string): GearCategoryMeta | undefined {
  return (GEAR_CATEGORIES as Record<string, GearCategoryMeta>)[id];
}
