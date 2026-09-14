/**
 * Plant nutrient deficiencies, diagnosed the way you actually diagnose them in a
 * tank: by which nutrient it is, whether that nutrient is mobile (which decides
 * if old or new leaves show it first), and what the damage looks like.
 *
 * Each entry links to real plants from the catalogue that show the deficiency
 * early or clearly, so a reader can compare against a species they keep. The
 * plant slugs must exist in src/data/plants.ts; they are resolved and linked at
 * render time via findNorm, the same way the algae hub links to its grazers.
 *
 * CO2 is included even though carbon is not a mineral nutrient, because low or
 * unstable CO2 limits plants and mimics a deficiency more often than anything
 * else, and people search for it the same way.
 */

export type NutrientKind = "macronutrient" | "micronutrient" | "other";

/** Where symptoms appear first, which is the single most useful diagnostic. */
export type SymptomLocation = "old" | "new" | "all";

export interface DeficiencyPlant {
  /** Plant slug in src/data/plants.ts. */
  slug: string;
  /** Why this plant is a good indicator of the deficiency. */
  note: string;
}

export interface Deficiency {
  slug: string;
  /** Display name, e.g. "Nitrogen Deficiency". */
  name: string;
  /** The element with symbol, e.g. "Nitrogen (N)". */
  element: string;
  aliases: string[];
  kind: NutrientKind;
  /** Nutrient mobility. Mobile nutrients strip from old leaves first. */
  mobile: boolean;
  showsOn: SymptomLocation;
  /** One-line "how to recognise it". */
  spot: string;
  tldr: string;
  /** What the damage looks like. */
  appearance: string;
  causes: string[];
  fix: string[];
  prevention: string;
  /** What it is easily mistaken for, and how to tell them apart. */
  confusedWith: string;
  relatedPlants: DeficiencyPlant[];
  faqs: { question: string; answer: string }[];
}

export const SYMPTOM_LOCATION_LABEL: Record<SymptomLocation, string> = {
  old: "Older, lower leaves first",
  new: "New growth at the tips first",
  all: "Across the whole plant",
};

export const DEFICIENCIES: ReadonlyArray<Deficiency> = [
  {
    slug: "nitrogen-deficiency",
    name: "Nitrogen Deficiency",
    element: "Nitrogen (N)",
    aliases: ["low nitrate", "nitrate deficiency"],
    kind: "macronutrient",
    mobile: true,
    showsOn: "old",
    spot: "Older, lower leaves fade to pale yellow evenly and go see-through, while the tips stay green.",
    tldr: "Nitrogen is mobile, so a plant robs its old leaves to feed new growth when it runs short. The lower, older leaves turn uniformly pale yellow and then translucent while the new tips stay green. Fast-growing stems show it first. It usually means nitrate has bottomed out, often in a lightly stocked tank with no dosing. Add nitrogen through an all-in-one fertiliser or a nitrate dose, and feed a little more as the plant mass grows. In a few plants a mild shortage deepens reds, which is why some aquascapers run nitrogen lean on purpose.",
    appearance:
      "The oldest leaves, lowest on the stem or oldest in a rosette, lose colour evenly across the whole leaf rather than between the veins. Pale green becomes yellow, then the leaf thins to translucent and rots away. New growth at the top stays green because the plant is moving its nitrogen up there. Overall growth slows and stems look leggy.",
    causes: [
      "Nitrate has dropped close to zero, common in lightly stocked tanks with no dosing",
      "A heavy, fast-growing plant mass using more than the tank supplies",
      "Large or frequent water changes stripping nitrate faster than it rebuilds",
      "A new tank, before the fish load and feeding have caught up",
    ],
    fix: [
      "Test nitrate. If it sits at or near zero, that confirms it.",
      "Dose nitrogen. An all-in-one fertiliser is the simplest route, or dose potassium nitrate to bring nitrate into the 10 to 20 ppm range.",
      "Feed the fish a little more, since fish waste is a real nitrogen source in low-tech tanks.",
      "Trim the worst old leaves once clean new growth is coming in.",
      "Re-test after a week and adjust to hold a steady low level rather than chasing zero.",
    ],
    prevention:
      "Dose to keep nitrate in a steady range rather than letting it hit zero between water changes, and raise the dose as the plants fill in. In a low-tech tank, a sensible fish load and regular feeding often supplies enough on its own.",
    confusedWith:
      "Magnesium also hits older leaves, but it yellows between the veins and leaves the veins green, while nitrogen fades the whole leaf evenly. Potassium shows as pinholes rather than a smooth fade.",
    relatedPlants: [
      { slug: "rotala-rotundifolia", note: "A fast stem that pales from the lower leaves up as soon as nitrate runs short, so it works as an early warning." },
      { slug: "water-wisteria", note: "Hungry and fast, its lower leaves yellow and drop quickly when nitrogen is low." },
      { slug: "hygrophila-polysperma", note: "A fast grower whose older leaves fade first, easy to read as a nitrogen gauge." },
      { slug: "ludwigia-super-red", note: "Runs deeper red under lean nitrogen, the flip side some aquascapers use on purpose." },
    ],
    faqs: [
      { question: "How much nitrate should a planted tank have?", answer: "A common target is around 10 to 20 ppm for a tank with active growth. The exact number matters less than keeping it steady rather than swinging to zero." },
      { question: "Can too little nitrogen make my plants redder?", answer: "Yes, in some species. Running nitrogen lean shifts the balance toward red pigments, which is a deliberate technique. Push it too far and you get pale, dying old leaves instead of colour." },
      { question: "My new leaves are green but the old ones are yellow, is that nitrogen?", answer: "Very likely, if the yellowing is even across the whole old leaf. Nitrogen is mobile, so the plant sacrifices old leaves first." },
      { question: "Will a water change fix it?", answer: "No, water changes usually lower nitrate. The fix is to add nitrogen and then hold a steady level." },
    ],
  },
  {
    slug: "phosphorus-deficiency",
    name: "Phosphorus Deficiency",
    element: "Phosphorus (P)",
    aliases: ["low phosphate", "phosphate deficiency"],
    kind: "macronutrient",
    mobile: true,
    showsOn: "old",
    spot: "Older leaves darken with purple or bronze tints, and green spot algae creeps onto the glass and slow leaves.",
    tldr: "Phosphorus is mobile, so shortages show on older leaves. They dull, darken and can pick up purple or reddish-bronze tones, and growth slows. The reliable tank-wide tell is green spot algae appearing on the glass and on old, slow leaves like anubias, which is your cue that phosphate has bottomed out. Add phosphate, usually through an all-in-one fertiliser, and the spot algae eases as the plants get fed. Lightly stocked tanks and tanks full of fast plants run out of phosphate most often.",
    appearance:
      "Older leaves lose their fresh green and take on a dark, dull, sometimes purple or bronze cast. Growth slows and leaves can look small. On the glass and on old, slow-growing leaves you get hard little green dots, green spot algae, which is the most reliable sign that phosphate is limiting.",
    causes: [
      "Phosphate has dropped near zero, common in light-stock tanks with no dosing",
      "Heavy uptake from a large, fast-growing plant mass",
      "Some substrates and media bind phosphate out of the water",
      "A new tank still settling into a nutrient rhythm",
    ],
    fix: [
      "Test phosphate if you have a kit. A working range is around 1 ppm.",
      "Dose phosphate through an all-in-one, or a small dose of monopotassium phosphate.",
      "Scrape the green spot algae now, since it will not lift once it hardens.",
      "Let nerite snails graze what is left on the glass and hardscape.",
      "Hold a steady low phosphate level rather than letting it swing to zero.",
    ],
    prevention:
      "Dose phosphate alongside nitrogen and potassium instead of letting it hit zero. Watch the glass, because returning green spot algae is your earliest signal that phosphate is running short.",
    confusedWith:
      "Green spot algae also appears under strong light on slow leaves, so treat low phosphate and light together. The purple leaf tint can look like a lean-nutrient red, but here it comes with dulling and slow growth, not vigour.",
    relatedPlants: [
      { slug: "anubias-barteri", note: "Slow leaves collect green spot algae first when phosphate is low, an easy visual cue." },
      { slug: "anubias-nana", note: "Same story on a smaller leaf, the spots show clearly on old growth." },
      { slug: "java-fern", note: "Old fronds pick up green spot algae when phosphate bottoms out." },
      { slug: "amazon-sword", note: "Large old leaves dull and darken, and spot algae settles on them." },
    ],
    faqs: [
      { question: "Does phosphate cause algae?", answer: "It is mostly a myth for planted tanks. Low phosphate is a common cause of green spot algae, not high phosphate. Starving phosphate to fight algae usually backfires." },
      { question: "What phosphate level should I aim for?", answer: "Around 1 ppm is a comfortable working level for a growing planted tank. Steady matters more than exact." },
      { question: "Green spot algae keeps returning on my glass, why?", answer: "It is the classic sign of low phosphate, often combined with strong light on slow surfaces. Raise phosphate and it eases." },
      { question: "Do I need a separate phosphate dose?", answer: "Not if your all-in-one already includes it. Only add extra phosphate if testing shows it bottoming out." },
    ],
  },
  {
    slug: "potassium-deficiency",
    name: "Potassium Deficiency",
    element: "Potassium (K)",
    aliases: ["low potassium", "pinholes in leaves"],
    kind: "macronutrient",
    mobile: true,
    showsOn: "old",
    spot: "Small pinholes in the leaves, often ringed with yellow, on older and middle-aged growth.",
    tldr: "Potassium has a signature that is hard to miss once you know it: tiny holes that start as yellow or clear spots and open into pinholes, mostly on older and middle leaves, sometimes with yellow edges. It is mobile, so it pulls from old growth first. Larger-leaved plants like swords and crypts show the holes most clearly. Potassium is cheap and very hard to overdose, so the fix is simply to add more, through an all-in-one fertiliser or a potassium sulphate dose.",
    appearance:
      "Pinholes with yellow halos appear on older and middle leaves, and leaf edges can yellow or brown. The holes start as spots inside the leaf and open outward, which is what tells them apart from chewing damage. Larger, flatter leaves show the pattern most clearly.",
    causes: [
      "Potassium not dosed, and it is used in large amounts",
      "A heavy plant mass drawing it down fast",
      "Soft or RO water with little added potassium",
      "Relying on fish waste, which supplies little potassium",
    ],
    fix: [
      "Dose potassium through an all-in-one, or add potassium sulphate.",
      "Be generous, since potassium is very hard to overdose in a planted tank.",
      "Leave holed leaves in place until clean new growth arrives, then trim them, because holes do not heal.",
      "Re-check new growth after a week or two for clean, hole-free leaves.",
    ],
    prevention:
      "Keep potassium in the regular dosing as a staple, not an afterthought. Soft and RO-based tanks especially need it added, since the source water brings almost none.",
    confusedWith:
      "Snail or fish damage chews from the leaf edge or leaves ragged gaps, while potassium pinholes start as spots inside the leaf with a yellow ring. Cryptocoryne melt drops whole leaves rather than making neat holes.",
    relatedPlants: [
      { slug: "amazon-sword", note: "Big flat leaves show potassium pinholes textbook-clearly." },
      { slug: "echinodorus-red-flame", note: "Broad leaves make the ringed pinholes easy to spot." },
      { slug: "cryptocoryne-wendtii", note: "Older leaves develop yellow-edged holes when potassium runs low." },
      { slug: "hygrophila-corymbosa", note: "Large leaves pit with pinholes as an early potassium signal." },
    ],
    faqs: [
      { question: "Can you overdose potassium?", answer: "It is very hard to in a planted tank. Potassium has a wide safe range, which is why generous dosing is the usual fix for pinholes." },
      { question: "Are the holes from snails or potassium?", answer: "Snails chew from the edge and leave ragged gaps. Potassium pinholes start as spots inside the leaf, often with a yellow ring." },
      { question: "Will the holed leaves recover?", answer: "No, existing damage stays. Fix the potassium, wait for clean new growth, then trim the old leaves." },
    ],
  },
  {
    slug: "iron-deficiency",
    name: "Iron Deficiency",
    element: "Iron (Fe)",
    aliases: ["low iron", "trace deficiency", "interveinal chlorosis"],
    kind: "micronutrient",
    mobile: false,
    showsOn: "new",
    spot: "New leaves at the tips come in pale, yellowing between green veins, and red plants fade to yellow-green.",
    tldr: "Iron is immobile, so a shortage shows on new growth, not old. The newest leaves emerge pale, yellowing between the veins while the veins stay green, and red plants are the loudest alarm, washing out to yellow-green. It usually means not enough trace or micro fertiliser, or dosing it at the wrong time relative to other nutrients. Add a trace or all-in-one fertiliser with iron. Reds also need strong light and CO2 to hold colour, so iron alone is not always the whole story.",
    appearance:
      "The newest leaves come in pale, with yellowing between the veins while the veins themselves stay green. Red and orange plants lose their colour to a washed-out yellow-green, and tips can look bleached. Older leaves lower down usually stay fine, which is the giveaway that it is iron rather than nitrogen or magnesium.",
    causes: [
      "Too little trace or iron dosing for the plant mass",
      "Iron precipitating out before plants can use it",
      "High light and CO2 driving demand past the trace supply",
      "A red-heavy layout that needs more iron than a green one",
    ],
    fix: [
      "Dose an all-in-one or a dedicated trace mix that contains iron.",
      "If you use dry salts, dose micros separately from macros, since they can react and drop out together.",
      "Make sure light and CO2 are strong enough, because reds will not hold colour on iron alone.",
      "Check the newest leaves after a week or two for fresh, evenly green growth.",
    ],
    prevention:
      "Dose trace and iron consistently, and dose more in a high-light or red-heavy tank. Splitting micro and macro dosing to different times helps the iron stay available.",
    confusedWith:
      "Other micronutrient shortages such as manganese look almost identical on new growth, which is why a complete trace mix is the usual fix rather than iron alone. Calcium also hits new leaves, but it twists and deforms them rather than yellowing between the veins.",
    relatedPlants: [
      { slug: "ludwigia-super-red", note: "Reds wash out to yellow-green first when iron or trace runs short, the classic indicator." },
      { slug: "rotala-macrandra", note: "A demanding red that pales fast without enough iron, light and CO2." },
      { slug: "alternanthera-reineckii-mini", note: "Loses its pink-red underside to pale green when trace is low." },
      { slug: "rotala-hra", note: "Its orange-red tips fade first, an early iron and CO2 gauge." },
      { slug: "red-tiger-lotus", note: "New leaves come in pale rather than deep red when iron is short." },
    ],
    faqs: [
      { question: "Does dosing iron make plants red?", answer: "Iron helps reds show, but light and CO2 matter just as much. Iron on its own will not turn a plant red in a dim, low-CO2 tank." },
      { question: "Should I dose iron or a full trace mix?", answer: "A full trace mix is safer, because deficiencies in other micros look the same on new growth. Dedicated iron is a top-up, not a substitute for trace." },
      { question: "Why are only my new leaves affected?", answer: "Iron is immobile, so the plant cannot move it from old leaves to new ones. New growth shows the shortage first." },
    ],
  },
  {
    slug: "magnesium-deficiency",
    name: "Magnesium Deficiency",
    element: "Magnesium (Mg)",
    aliases: ["low magnesium", "low GH"],
    kind: "macronutrient",
    mobile: true,
    showsOn: "old",
    spot: "Older leaves yellow between the veins while the veins stay green.",
    tldr: "Magnesium is mobile, so like iron it yellows between the veins, but on old leaves rather than new. The veins stay green while the tissue between them fades to yellow, starting low on the plant. It turns up most in soft or RO water with little added magnesium, and it usually travels with a low general hardness. Raise magnesium with a GH booster or remineraliser that includes it, or a small Epsom salt dose, and keep GH in a sensible range.",
    appearance:
      "Older, lower leaves yellow between the veins while the veins stay green, the same interveinal pattern as iron but on old growth instead of new. New tips look fine. It often shows across several older leaves at once in soft water.",
    causes: [
      "Soft or RO water with little magnesium",
      "Low general hardness overall",
      "A calcium-to-magnesium balance skewed too far toward calcium",
      "Heavy uptake in a fast-growing tank",
    ],
    fix: [
      "Raise magnesium with a GH booster or remineraliser that includes calcium and magnesium.",
      "Or dose a small amount of Epsom salt, which is magnesium sulphate.",
      "Check that GH sits in a workable range, a few dGH for most planted tanks.",
      "Aim for a calcium to magnesium ratio around 3:1 to 4:1.",
    ],
    prevention:
      "Remineralise RO water with a product that includes magnesium, and keep GH in range rather than letting it drift toward zero. Test GH now and then in soft-water tanks.",
    confusedWith:
      "Iron looks the same, interveinal yellowing, but iron hits new leaves and magnesium hits old ones, so check where it starts. Nitrogen fades old leaves evenly rather than between the veins.",
    relatedPlants: [
      { slug: "amazon-sword", note: "Large old leaves show interveinal yellowing clearly when magnesium is low." },
      { slug: "cryptocoryne-wendtii", note: "Older leaves yellow between the veins in soft, low-GH water." },
      { slug: "vallisneria-spiralis", note: "Older blades pale between the veins when magnesium and GH are low." },
    ],
    faqs: [
      { question: "Is it iron or magnesium?", answer: "Both yellow between the veins. Iron affects new leaves, magnesium affects old leaves. Where it starts tells you which." },
      { question: "How much Epsom salt should I add?", answer: "A small dose goes a long way. Start low, re-test GH, and adjust. It is easier to add more than to reverse an overdose." },
      { question: "What Ca to Mg ratio should I aim for?", answer: "Around 3:1 to 4:1 calcium to magnesium is a common target when remineralising RO water." },
    ],
  },
  {
    slug: "calcium-deficiency",
    name: "Calcium Deficiency",
    element: "Calcium (Ca)",
    aliases: ["low calcium", "twisted new growth", "low GH"],
    kind: "macronutrient",
    mobile: false,
    showsOn: "new",
    spot: "New growth comes in twisted, stunted or hooked, with curled or deformed tips.",
    tldr: "Calcium is immobile and it builds cell walls, so a shortage wrecks new growth. The newest leaves and tips come in twisted, crinkled, stunted or hooked, sometimes with dead patches at the growing point. It shows in soft or RO water with too little calcium, usually alongside low general hardness. Raise calcium with a GH booster or remineraliser that includes it, and keep GH in range. Because it looks like other new-growth problems, check GH before assuming it is calcium.",
    appearance:
      "New leaves and growing tips come in deformed: twisted, crinkled, hooked or stunted, sometimes with browning or death right at the growing point. Older leaves lower down stay normal, which points to an immobile nutrient like calcium.",
    causes: [
      "Soft or RO water with little calcium",
      "Low general hardness overall",
      "A calcium-to-magnesium balance skewed too far toward magnesium",
      "RO water used without proper remineralisation",
    ],
    fix: [
      "Raise calcium with a GH booster or remineraliser that includes it.",
      "Bring GH into a workable range for planted tanks.",
      "Keep the calcium to magnesium ratio balanced, around 3:1 to 4:1.",
      "Expect new growth after the fix to come in normal, while the old deformed growth stays as it is.",
    ],
    prevention:
      "Remineralise RO water to a sensible GH with both calcium and magnesium included, rather than adding one and forgetting the other. Test GH in soft-water tanks.",
    confusedWith:
      "Calcium and low CO2 both stunt and deform new growth. If GH is fine, suspect CO2; if GH is very low, suspect calcium. Boron shortage also twists tips but is rare in aquariums.",
    relatedPlants: [
      { slug: "pogostemon-stellatus-octopus", note: "Fast new growth twists and stunts when calcium and GH are low." },
      { slug: "rotala-macrandra", note: "A demanding stem whose tips deform in very soft, low-calcium water." },
      { slug: "ludwigia-super-red", note: "New tops come in crinkled and hooked when calcium is short." },
    ],
    faqs: [
      { question: "Is my twisted new growth calcium or CO2?", answer: "Check GH. If GH is healthy, suspect low or unstable CO2. If GH is very low, calcium is the likely cause." },
      { question: "Will the deformed leaves straighten out?", answer: "No, damaged growth stays deformed. Fix the calcium and judge success by the next new leaves." },
      { question: "Do hard-water tanks get calcium deficiency?", answer: "Rarely. It is almost always a soft-water or RO problem where calcium was never added back." },
    ],
  },
  {
    slug: "co2-deficiency",
    name: "CO2 (Carbon) Deficiency",
    element: "Carbon (CO₂)",
    aliases: ["low CO2", "carbon limitation", "unstable CO2"],
    kind: "other",
    mobile: false,
    showsOn: "all",
    spot: "Stunted, small new growth and creeping algae despite good fertiliser, the most common cause of a struggling high-light tank.",
    tldr: "This is not a mineral shortage, but low or unstable CO2 limits plants more often than any nutrient, so it belongs here. Plants slow down, new growth comes in small and deformed, demanding species stall, and algae such as green spot, green dust and black beard move in because the plants are too weak to compete. It is usually not enough CO2, CO2 that swings during the day, or poor flow leaving dead spots. Raise and stabilise CO2, get flow moving it everywhere, and use a drop checker to confirm a good level by lights-on.",
    appearance:
      "New growth comes in small, pale or deformed, overall growth crawls, and the demanding species stall or melt while easy plants like anubias and java fern hang on. Algae builds on leaves and glass, often green spot, green dust or black beard, because weak plants stop out-competing it. It slows and shrinks the whole tank rather than targeting one colour or leaf age.",
    causes: [
      "Not enough CO2 injected for the light and plant load",
      "CO2 not turned on early enough before the lights",
      "Poor flow leaving some plants in dead spots with no CO2",
      "Light too strong for the CO2 being supplied",
      "Surface agitation off-gassing the CO2 as fast as it goes in",
    ],
    fix: [
      "Raise injection gradually, watching the fish for signs of stress.",
      "Turn CO2 on one to two hours before the lights so it is at level by lights-on.",
      "Use a drop checker and aim for lime green when the lights come on.",
      "Improve flow so CO2 reaches every corner of the tank.",
      "If you cannot add more CO2, lower the light to match what you can supply.",
      "Treat liquid carbon as a mild supplement only, not a replacement for gas.",
    ],
    prevention:
      "Run CO2 on a timer that leads the lights, keep the drop checker lime green through the photoperiod, and match your light level to the CO2 you can actually deliver.",
    confusedWith:
      "Low CO2 and calcium both stunt new growth. If GH is fine and algae is spreading, suspect CO2. Nutrient deficiencies usually target a colour or a leaf age, while CO2 slows and shrinks everything at once.",
    relatedPlants: [
      { slug: "hc-cuba", note: "A carpet that needs steady CO2, it stunts and melts first when carbon is low." },
      { slug: "monte-carlo", note: "Grows leggy and pale, then stalls, when CO2 is short." },
      { slug: "dwarf-hairgrass", note: "Thin and slow to carpet without enough CO2." },
      { slug: "rotala-macrandra", note: "A demanding red that stunts and deforms first when CO2 swings." },
      { slug: "alternanthera-reineckii-mini", note: "Small, crumpled new growth signals unstable CO2." },
      { slug: "eriocaulon-cinereum", note: "A CO2-hungry species that shows carbon problems early." },
    ],
    faqs: [
      { question: "Can low CO2 cause algae?", answer: "Yes. When plants are carbon-starved they stop growing and stop out-competing algae, so green spot, green dust and black beard move in. Stable CO2 is one of the strongest algae controls there is." },
      { question: "Is liquid carbon a substitute for pressurised CO2?", answer: "No. It is a mild supplement and a spot algae treatment at best. Demanding plants need injected gas." },
      { question: "What colour should my drop checker be?", answer: "Lime green by the time the lights come on. Blue means too little CO2, yellow means too much and a risk to the fish." },
      { question: "Is it a nutrient problem or CO2?", answer: "Nutrient shortages usually target a colour or a leaf age. CO2 slows and shrinks the whole tank and brings algae with it." },
    ],
  },
];

export function getDeficiency(slug: string): Deficiency | undefined {
  return DEFICIENCIES.find((d) => d.slug === slug);
}
