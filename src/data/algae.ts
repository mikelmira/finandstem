/**
 * Common aquarium algae, for the identification hub and per-type fix pages.
 *
 * Written from standard planted-tank experience. Each type carries the cues
 * people actually use to tell them apart (colour, texture, where it grows),
 * the real causes, a fix that works, and which catalogue species graze it so
 * the pages link back into the crew that helps.
 */

export type AlgaeColor = "green" | "brown" | "black" | "blue-green" | "clear";
export type AlgaeForm =
  | "spots"
  | "film"
  | "dust"
  | "hair"
  | "fuzz"
  | "clumps"
  | "slime";
export type AlgaeLocation =
  | "glass"
  | "plants"
  | "hardscape"
  | "substrate"
  | "water"
  | "surface";
export type AlgaeSeverity = "harmless" | "nuisance" | "stubborn";

export interface AlgaeEater {
  category: "fish" | "shrimp" | "snails";
  slug: string;
}

export interface AlgaeType {
  slug: string;
  name: string;
  aliases: string[];
  color: AlgaeColor;
  forms: AlgaeForm[];
  locations: AlgaeLocation[];
  severity: AlgaeSeverity;
  /** One-line "how to spot it". */
  spot: string;
  tldr: string;
  appearance: string;
  causes: string[];
  /** Ordered fix steps. */
  fix: string[];
  prevention: string;
  eatenBy: AlgaeEater[];
  eatenByNote?: string;
  faqs: { question: string; answer: string }[];
}

const f = (category: AlgaeEater["category"], slug: string): AlgaeEater => ({
  category,
  slug,
});

export const ALGAE: ReadonlyArray<AlgaeType> = [
  {
    slug: "green-spot-algae",
    name: "Green Spot Algae",
    aliases: ["GSA", "green dot algae"],
    color: "green",
    forms: ["spots"],
    locations: ["glass", "plants", "hardscape"],
    severity: "nuisance",
    spot: "Hard little green dots on the glass and on old, slow-growing leaves.",
    tldr: "Green spot algae shows up as small, firm green dots stuck to the glass and to slow leaves like anubias. It is one of the tidier problems to have, and it usually points at low phosphate rather than too much of anything. Bump your phosphate dosing up a touch, keep the glass scraped, and let nerite snails rasp what is left. On plant leaves it is mostly cosmetic, so trim the worst leaves and move on.",
    appearance:
      "Small, round, deep green dots, hard enough that they need a scrape or a blade to shift. They cling to the glass and to the oldest leaves on slow growers.",
    causes: [
      "Low phosphate (PO4) in the water column, the most common trigger",
      "Strong light landing on slow-growing leaves and bare glass",
      "Old leaves that have been sitting under light for weeks",
    ],
    fix: [
      "Raise phosphate dosing slightly and keep it steady, this alone clears most cases over a few weeks.",
      "Scrape the glass with a blade or a firm pad; a credit card edge works on thin glass.",
      "Trim the worst-affected old leaves rather than fighting to clean them.",
      "Add a couple of nerite snails, they graze hard green spot off glass better than anything.",
    ],
    prevention:
      "Keep phosphate topped up and don't run light brighter or longer than the plants can use. A tank that is dosed steadily rarely gets much of it.",
    eatenBy: [f("snails", "zebra-nerite-snail"), f("snails", "horned-nerite-snail")],
    faqs: [
      {
        question: "Is green spot algae bad for my tank?",
        answer:
          "No, it is harmless to fish, shrimp and plants. It is mostly a look problem on the glass and old leaves, and it is one of the easier types to keep in check.",
      },
      {
        question: "Why do I keep getting green spot algae on the glass?",
        answer:
          "Almost always low phosphate. Raise your phosphate dosing a little and hold it steady, and the dots slow right down. Scraping plus a nerite snail handles the rest.",
      },
    ],
  },
  {
    slug: "green-dust-algae",
    name: "Green Dust Algae",
    aliases: ["GDA"],
    color: "green",
    forms: ["dust", "film"],
    locations: ["glass"],
    severity: "nuisance",
    spot: "A fine green haze on the glass that wipes off, then comes back within days.",
    tldr: "Green dust algae is the fine green film that coats the glass and returns almost as soon as you clean it. The trick most people get wrong is wiping it too early. It has a life cycle, so if you leave it alone for around three to four weeks it matures, releases spores and sloughs off on its own. Do one big wipe and water change at that point rather than scrubbing every few days, and it usually breaks the cycle for good.",
    appearance:
      "A soft, even green dust or haze across the glass, often worst on the brightest pane. It smears rather than scrapes, and it grows back fast after cleaning.",
    causes: [
      "A young tank finding its balance",
      "Cleaning too often, which resets the algae's life cycle and keeps it coming",
      "Bright light on bare glass",
    ],
    fix: [
      "Leave the glass alone for three to four weeks and let the algae complete its cycle.",
      "Once it starts sloughing off in sheets, wipe the whole pane and do a large water change the same day.",
      "Clean the filter and vacuum any loose debris so the spores go with the water.",
      "If it returns, repeat the full cycle rather than wiping little and often.",
    ],
    prevention:
      "Resist the urge to wipe every couple of days on a new tank. Let the tank mature, keep dosing steady, and it tends to sort itself out.",
    eatenBy: [],
    eatenByNote:
      "Nothing really eats green dust algae. It is about riding out its life cycle, not adding a clean-up crew.",
    faqs: [
      {
        question: "Should I wipe green dust algae off or leave it?",
        answer:
          "Leave it for about three to four weeks, then do one big wipe and water change once it matures and starts falling off. Wiping every few days just keeps the cycle going.",
      },
      {
        question: "How is green dust algae different from green spot algae?",
        answer:
          "Green dust is a soft haze that smears off and regrows fast. Green spot is hard little dots you have to scrape. They have different causes and different fixes, so it is worth telling them apart.",
      },
    ],
  },
  {
    slug: "black-beard-algae",
    name: "Black Beard Algae",
    aliases: ["BBA", "black brush algae"],
    color: "black",
    forms: ["fuzz", "clumps"],
    locations: ["hardscape", "plants", "glass"],
    severity: "stubborn",
    spot: "Dark grey to black tufts on leaf edges, hardscape and equipment, worst where flow hits.",
    tldr: "Black beard algae is the dark, bristly stuff that grows in tufts on leaf edges, wood, and inflow pipes, usually where flow is strongest. It is one of the most hated types because it clings hard, and it is almost always a CO2 problem. Unstable or low CO2 combined with too much organic waste is what feeds it. Get CO2 steady, keep the water clean, and spot treat the tufts with liquid carbon or diluted hydrogen peroxide. A Siamese algae eater is one of the few fish that will actually eat it.",
    appearance:
      "Short dark tufts, grey-green to nearly black, with a bristly beard-like texture. It anchors on hard edges: leaf margins, driftwood, rocks, spray bars and filter intakes.",
    causes: [
      "Fluctuating or low CO2, the number one cause",
      "A build-up of organic waste and detritus",
      "Slow or dead flow spots where debris settles",
    ],
    fix: [
      "Get CO2 stable and sufficient, a steady level matters more than a high one; check the drop checker stays green all day.",
      "Improve flow so no corner stagnates, and clean the filter to cut organic waste.",
      "Spot treat tufts with liquid carbon or 3% hydrogen peroxide, dosed onto the algae with the pump off for a few minutes.",
      "Add a Siamese algae eater, which is one of the few fish that eats softened black beard algae.",
      "Remove heavily coated leaves and hardscape and treat them out of the tank.",
    ],
    prevention:
      "Keep CO2 rock steady day to day, stay on top of filter cleaning and water changes, and make sure flow reaches every corner. BBA hates a stable, clean tank.",
    eatenBy: [f("fish", "siamese-algae-eater"), f("shrimp", "amano-shrimp")],
    faqs: [
      {
        question: "What causes black beard algae?",
        answer:
          "Unstable or low CO2 is the main driver, usually alongside a build-up of organic waste and some dead flow spots. Fix the CO2 and the flow and you take away what it lives on.",
      },
      {
        question: "How do I get rid of black beard algae for good?",
        answer:
          "Stabilise CO2, clean up organics and flow, spot treat the tufts with liquid carbon or peroxide, and let a Siamese algae eater graze the rest. It takes a few weeks but it does not come back if the CO2 stays steady.",
      },
    ],
  },
  {
    slug: "hair-algae",
    name: "Hair Algae",
    aliases: ["thread algae", "green hair algae"],
    color: "green",
    forms: ["hair"],
    locations: ["plants", "hardscape", "substrate"],
    severity: "nuisance",
    spot: "Long soft green strands you can twirl around a toothbrush.",
    tldr: "Hair algae is the long green strands that drape off plants and hardscape and wrap around a toothbrush when you twirl it. It usually means too much light for the amount of CO2 and nutrients the plants can use, and a spike of ammonia from a new tank or a disturbed substrate often kicks it off. Pull out what you can by hand, dial the light back, keep dosing steady, and let amano shrimp finish it. They are the best hair algae crew there is.",
    appearance:
      "Fine to coarse green threads, sometimes several centimetres long, hanging off leaf tips, moss and wood. Soft enough to wind around a stick.",
    causes: [
      "Too much light for the CO2 and nutrients on offer",
      "An ammonia spike from a new tank, a big trim, or a disturbed substrate",
      "Nutrient imbalance, often after skipping water changes",
    ],
    fix: [
      "Twirl and pull out as much as you can by hand, a toothbrush makes quick work of it.",
      "Cut the photoperiod back to around six hours and lower the intensity if you can.",
      "Get back on steady dosing and weekly water changes to even out nutrients.",
      "Add amano shrimp, they graze hair algae harder than almost anything; young cherry shrimp help too.",
    ],
    prevention:
      "Match light to what your plants can actually use, keep dosing and water changes regular, and avoid stirring up the substrate. A stable, moderately lit tank rarely gets a hair algae outbreak.",
    eatenBy: [f("shrimp", "amano-shrimp"), f("fish", "siamese-algae-eater"), f("shrimp", "cherry-shrimp")],
    faqs: [
      {
        question: "What eats hair algae?",
        answer:
          "Amano shrimp are the best by a distance, they will strip a tank of it. Siamese algae eaters help, and a colony of cherry shrimp will graze the softer strands.",
      },
      {
        question: "Why did hair algae appear suddenly?",
        answer:
          "Usually an ammonia spike, from a new tank, a heavy trim, or a substrate that got stirred up. Combine that with strong light and it takes off fast. Manual removal plus less light and steady dosing turns it around.",
      },
    ],
  },
  {
    slug: "staghorn-algae",
    name: "Staghorn Algae",
    aliases: ["staghorn"],
    color: "green",
    forms: ["fuzz", "hair"],
    locations: ["plants", "hardscape"],
    severity: "stubborn",
    spot: "Stiff grey-green strands that branch like tiny antlers and feel tough.",
    tldr: "Staghorn algae grows as stiff grey-green strands that fork like little antlers, usually on leaf edges and hardscape. It behaves a lot like black beard algae and comes from the same place: unstable CO2 and a dirty tank with too many organics. The fix is the same too. Stabilise CO2, clean up the flow and waste, and spot treat with liquid carbon or peroxide. It turns pink or white as it dies, which is the sign the treatment is working.",
    appearance:
      "Tough, wiry strands, grey-green and often forked or branched like a stag's antlers. It does not wipe off easily and feels coarse between the fingers.",
    causes: [
      "Unstable or low CO2",
      "High organic waste and detritus",
      "Poor circulation",
    ],
    fix: [
      "Stabilise CO2 and make sure it stays steady through the whole photoperiod.",
      "Clean the filter, improve flow, and stay on top of water changes to cut organics.",
      "Spot treat with liquid carbon or 3% hydrogen peroxide; it goes pink or white as it dies.",
      "Manually remove treated strands once they weaken.",
    ],
    prevention:
      "Same as black beard algae, keep CO2 steady and the tank clean with good flow. Staghorn cannot get going in those conditions.",
    eatenBy: [],
    eatenByNote:
      "Little will eat living staghorn. Spot treatment and stable CO2 do the work; a Siamese algae eater may pick at strands once they soften.",
    faqs: [
      {
        question: "Is staghorn algae the same as black beard algae?",
        answer:
          "They are close cousins with the same causes and the same fix. Staghorn is stiffer and branches like antlers, black beard is softer and more like a bristly tuft. Stabilise CO2 and clean the tank and both go.",
      },
    ],
  },
  {
    slug: "blue-green-algae",
    name: "Blue-Green Algae",
    aliases: ["cyanobacteria", "BGA", "slime algae"],
    color: "blue-green",
    forms: ["slime", "film"],
    locations: ["substrate", "plants", "glass"],
    severity: "stubborn",
    spot: "A slimy blue-green sheet that peels off in one piece and smells musty.",
    tldr: "Blue-green algae is not actually algae, it is cyanobacteria, and it looks like a slimy dark green or blue-green sheet that peels off in one piece and smells earthy or musty. It usually takes hold where nitrate is low, flow is poor, and detritus has built up, often along the substrate at the front glass. Nothing eats it, so the fix is a physical clean-up, a three-day blackout, more flow, and often a nitrate boost. In a stubborn case an erythromycin-based treatment clears it, but fix the root cause or it returns.",
    appearance:
      "A smooth, slimy film in dark green to blue-green, sometimes with a reddish tinge. It sheets over substrate, glass and plants and lifts off in slippery pieces. The musty smell is the giveaway.",
    causes: [
      "Low or zero nitrate",
      "Poor circulation and dead spots",
      "Accumulated detritus in the substrate, often at the front of the tank",
    ],
    fix: [
      "Siphon off as much as you can and do a large water change.",
      "Do a three-day full blackout: cover the tank completely, with the filter running but the lights and CO2 off.",
      "Improve flow so nowhere stagnates, and keep the substrate surface clean.",
      "Dose nitrate back up if it is sitting at zero, cyanobacteria thrives when nitrate bottoms out.",
      "For a stubborn return, an erythromycin-based product clears it, but only alongside fixing flow and nitrate.",
    ],
    prevention:
      "Don't let nitrate hit zero, keep flow strong everywhere, and vacuum detritus before it piles up. Cyanobacteria needs a stagnant, nutrient-starved corner to start.",
    eatenBy: [],
    eatenByNote:
      "Nothing eats cyanobacteria, and you would not want it to. This one is beaten with a blackout, clean-up and flow, not a clean-up crew.",
    faqs: [
      {
        question: "Is blue-green algae dangerous?",
        answer:
          "It can be. Cyanobacteria can release toxins and it smothers plants and starves the tank of oxygen if it spreads. It is worth dealing with promptly rather than leaving it.",
      },
      {
        question: "How do I get rid of blue-green algae?",
        answer:
          "Siphon it out, do a three-day blackout, boost flow, and bring nitrate back up if it is at zero. That clears most cases. A stubborn one may need an erythromycin treatment, but fix the flow and nitrate or it comes straight back.",
      },
    ],
  },
  {
    slug: "brown-algae",
    name: "Brown Algae (Diatoms)",
    aliases: ["diatoms", "silica algae", "new tank brown algae"],
    color: "brown",
    forms: ["dust", "film"],
    locations: ["glass", "plants", "substrate", "hardscape"],
    severity: "harmless",
    spot: "A brown dusty coating on a new tank that wipes off with a finger.",
    tldr: "Brown algae, really diatoms, is the brown dusty film that coats the glass, plants and substrate in the first weeks of a new tank. It is harmless and almost a rite of passage. It feeds on the silicates and ammonia of a fresh setup, and it fades on its own as the tank matures and those settle. You can wipe it off easily, and otocinclus and nerite snails graze it happily. If it shows up in an established tank, check for a source of excess silicate or a stalled cycle.",
    appearance:
      "A soft brown or tan dust over every surface, thickest on the glass and slow leaves. It wipes away with a fingertip and does not cling like green spot.",
    causes: [
      "A new tank still cycling, with silicates and ammonia present",
      "Low light in the early weeks",
      "Occasionally, high silicate source water in an established tank",
    ],
    fix: [
      "Give it time, most new-tank diatoms clear on their own within a few weeks as the tank matures.",
      "Wipe the glass and gently rinse affected leaves during water changes.",
      "Add otocinclus or a nerite snail, they graze diatoms enthusiastically.",
      "In an established tank, check whether your source water is high in silicate.",
    ],
    prevention:
      "There is not much to prevent on a new tank, it comes with the territory. Letting the tank mature fully before adding a big bioload keeps it brief.",
    eatenBy: [f("fish", "otocinclus"), f("snails", "zebra-nerite-snail"), f("shrimp", "amano-shrimp")],
    faqs: [
      {
        question: "Will brown algae go away on its own?",
        answer:
          "Usually yes. In a new tank diatoms fade within a few weeks as it matures and silicates settle. A few otocinclus or a nerite snail speed it along, and wiping keeps the glass clear in the meantime.",
      },
      {
        question: "Why is brown algae in my established tank?",
        answer:
          "In an older tank it often points at high silicate in your source water, or a stalled cycle after a filter clean. Check both, and the diatoms usually clear once the cause is sorted.",
      },
    ],
  },
  {
    slug: "green-water",
    name: "Green Water",
    aliases: ["algae bloom", "pea soup", "free-floating algae"],
    color: "green",
    forms: ["film"],
    locations: ["water"],
    severity: "stubborn",
    spot: "The whole tank turns cloudy green, like pea soup, and you can't see the back glass.",
    tldr: "Green water is a bloom of single-celled algae floating in the water, turning the whole tank pea-soup green. It comes from an ammonia spike, too much light, or direct sunlight on the tank. The frustrating part is that water changes barely help, since the algae is in the water itself and just regrows. What actually clears it is a blackout of several days, a UV steriliser, or a diatom filter. Fix the root cause too, usually the light or an ammonia source, or it blooms straight back.",
    appearance:
      "A uniform green cloudiness throughout the water, mild at first then thick enough to hide the back of the tank. Surfaces may stay fairly clean while the water itself is green.",
    causes: [
      "An ammonia spike, from a new tank or an overstocked one",
      "Too much light, or direct sunlight hitting the tank",
      "Excess nutrients with nothing to use them",
    ],
    fix: [
      "Black the tank out completely for four to five days, filter running, lights off, and cover it so no light gets in.",
      "Run a UV steriliser or a diatom filter if you have access to one, either clears green water fast.",
      "Fix the trigger: shade the tank from sunlight, cut the photoperiod, and deal with any ammonia source.",
      "Do a water change after the bloom clears to export the dead algae, not before.",
    ],
    prevention:
      "Keep the tank out of direct sun, don't overlight it, and make sure it is fully cycled before stocking. Green water almost always traces back to light or ammonia.",
    eatenBy: [],
    eatenByNote:
      "Fish and shrimp can't graze green water since it floats. Daphnia will eat it, and a UV steriliser or blackout is the reliable fix.",
    faqs: [
      {
        question: "Why don't water changes fix green water?",
        answer:
          "Because the algae is suspended in the water, not stuck to surfaces, so fresh water just gives it room to bloom again. A blackout, UV steriliser or diatom filter is what actually clears it.",
      },
      {
        question: "How long does a blackout take to clear green water?",
        answer:
          "Four to five days of complete darkness usually does it. Keep the filter running, cover the tank so no light sneaks in, and do a water change once the water clears.",
      },
    ],
  },
  {
    slug: "fuzz-algae",
    name: "Fuzz Algae",
    aliases: ["green fuzz algae"],
    color: "green",
    forms: ["fuzz"],
    locations: ["plants", "hardscape"],
    severity: "nuisance",
    spot: "Short soft green fuzz, a few millimetres long, on leaf edges and wood.",
    tldr: "Fuzz algae is short green fuzz, only a few millimetres long, that coats leaf edges and hardscape in a young tank. It is a mild imbalance rather than a real problem, and it usually fades as the tank settles. Keep CO2 and nutrients steady, do your water changes, and let amano shrimp and otocinclus graze it. It rarely needs anything drastic, and a stable tank grows out of it within a few weeks.",
    appearance:
      "A short, soft green fuzz, like a fine carpet on leaf margins, wood and slower plants. Much shorter than hair algae and softer than beard algae.",
    causes: [
      "A young tank still balancing CO2 and nutrients",
      "Minor CO2 fluctuation",
      "Slightly too much light for a new setup",
    ],
    fix: [
      "Keep CO2 and dosing steady, most fuzz algae fades as the tank matures.",
      "Stay on weekly water changes to keep nutrients even.",
      "Add amano shrimp and otocinclus, they graze fuzz off leaves and wood.",
      "Trim any badly coated old leaves.",
    ],
    prevention:
      "Give a new tank time to settle, keep dosing and CO2 steady, and don't overlight it early on.",
    eatenBy: [f("shrimp", "amano-shrimp"), f("fish", "otocinclus"), f("shrimp", "cherry-shrimp")],
    faqs: [
      {
        question: "Is fuzz algae a sign of a problem?",
        answer:
          "Not usually. It is a mild imbalance in a young tank and it tends to clear on its own as things stabilise. Steady CO2 and dosing plus a few amano shrimp keep it under control.",
      },
    ],
  },
  {
    slug: "cladophora",
    name: "Cladophora Algae",
    aliases: ["blanket weed", "coarse green algae"],
    color: "green",
    forms: ["hair", "clumps"],
    locations: ["hardscape", "plants", "substrate"],
    severity: "stubborn",
    spot: "Coarse, branching green threads that feel rough and can smell musty, often in tangled clumps.",
    tldr: "Cladophora is a coarse, branching green algae that grows in tough tangled clumps, quite different from soft hair algae. It often arrives hitchhiking on plants or wood, and it is stubborn once established because it anchors hard and grows back from fragments. Manual removal is the main tool, backed by spot treatment with hydrogen peroxide. Get every piece out, since even a small fragment regrows, and quarantine new plants so it does not come in again.",
    appearance:
      "Rough green threads that branch and mat together into clumps. Coarser and tougher than hair algae, sometimes with a faint musty smell. Not to be confused with a marimo moss ball, which is the same genus in a harmless form.",
    causes: [
      "Introduced on new plants, wood or a moss ball",
      "Once present, it spreads from fragments",
      "Excess light and nutrients help it along",
    ],
    fix: [
      "Manually remove every clump you can reach, and get out fragments too since they regrow.",
      "Spot treat anchored patches with 3% hydrogen peroxide, pump off, then rinse.",
      "Remove and treat affected hardscape out of the tank where you can.",
      "Keep light moderate and dosing steady so it has less to feed on while you clear it.",
    ],
    prevention:
      "Quarantine and inspect new plants, wood and moss balls before they go in, this is how cladophora almost always arrives. Remove any stray strand you spot early.",
    eatenBy: [],
    eatenByNote:
      "No fish or shrimp reliably clears cladophora, it is too coarse. Manual removal and spot treatment are the real fix.",
    faqs: [
      {
        question: "Is cladophora the same as a marimo moss ball?",
        answer:
          "They are the same genus, but the nuisance form grows in loose spreading strands rather than a neat ball. The loose form is stubborn and worth removing; the moss ball is harmless.",
      },
      {
        question: "How do I get rid of cladophora?",
        answer:
          "Manual removal is the main tool, get every fragment out, and spot treat anchored patches with hydrogen peroxide. It is persistent, so keep at it and quarantine new plants so it does not return.",
      },
    ],
  },
  {
    slug: "surface-film",
    name: "Surface Film",
    aliases: ["surface scum", "biofilm", "protein film"],
    color: "clear",
    forms: ["film"],
    locations: ["surface"],
    severity: "harmless",
    spot: "An oily, slightly rainbow film sitting still on the water surface.",
    tldr: "Surface film is the oily-looking skin that forms on a still water surface, sometimes with a faint rainbow sheen. It is biofilm and protein rather than true algae, and it builds up when the surface is calm and organics are high. It is harmless but it looks off and it cuts gas exchange, so it is worth clearing. A surface skimmer solves it permanently, and in the meantime more surface agitation or a quick skim with a paper towel lifts it straight off.",
    appearance:
      "A thin, still film across the top of the water, sometimes dull and greasy, sometimes with a light rainbow sheen. It sits where there is no surface movement.",
    causes: [
      "A still water surface with little agitation",
      "A build-up of proteins and organics, often from feeding",
      "Low flow reaching the surface",
    ],
    fix: [
      "Add surface agitation: angle the filter outflow up, or add a small powerhead or skimmer.",
      "Lay a paper towel flat on the surface and lift it, it pulls the film off in one go.",
      "Fit a surface skimmer for a permanent fix.",
      "Cut back on overfeeding to reduce the organics feeding it.",
    ],
    prevention:
      "Keep some surface movement going and don't overfeed. A tank with decent surface agitation rarely films over.",
    eatenBy: [],
    eatenByNote:
      "This is biofilm, not algae, so there is no clean-up crew for it. Surface agitation or a skimmer is the answer.",
    faqs: [
      {
        question: "Is surface film harmful?",
        answer:
          "It is harmless in itself, but it cuts gas exchange at the surface, which can lower oxygen. It is easy to clear with surface agitation or a skimmer, so it is worth dealing with.",
      },
    ],
  },
];

export function getAlgae(slug: string): AlgaeType | undefined {
  return ALGAE.find((a) => a.slug === slug);
}
