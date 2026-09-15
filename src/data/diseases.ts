/**
 * Fish and shrimp health problems, diagnosed by what you see and treated with
 * the invertebrate-and-plant safety a planted tank needs. Most aquarium
 * "medicines" are written for bare hospital tanks: copper, malachite green and
 * many antibiotics wipe out shrimp, snails and beneficial bacteria, and some
 * harm scaleless fish. Every entry says plainly what is safe in a stocked
 * planted tank and what has to go in a quarantine tank instead.
 *
 * Each entry links to real catalogue species that are especially at risk or
 * especially sensitive to treatment. The slugs must exist in the matching data
 * file; they are resolved and linked at render time via findNorm, the same way
 * the algae and deficiency hubs link out.
 */

export type Affected = "fish" | "shrimp" | "snails";
export type Pathogen =
  | "parasite"
  | "bacterial"
  | "fungal"
  | "environmental"
  | "other";

export interface DiseaseSpecies {
  slug: string;
  category: Affected;
  note: string;
}

export interface Disease {
  slug: string;
  name: string;
  aliases: string[];
  affects: Affected[];
  pathogen: Pathogen;
  contagious: boolean;
  /** One-line "how to recognise it". */
  spot: string;
  tldr: string;
  /** What the problem looks like on the animal. */
  symptoms: string;
  causes: string[];
  /** Ordered treatment steps. */
  treatment: string[];
  prevention: string;
  /** The plant/shrimp/scaleless-fish safety of the usual treatments. */
  safetyNote: string;
  confusedWith: string;
  atRisk: DiseaseSpecies[];
  faqs: { question: string; answer: string }[];
}

export const PATHOGEN_LABEL: Record<Pathogen, string> = {
  parasite: "Parasite",
  bacterial: "Bacterial",
  fungal: "Fungal",
  environmental: "Environmental",
  other: "Other",
};

export const AFFECTED_LABEL: Record<Affected, string> = {
  fish: "Fish",
  shrimp: "Shrimp",
  snails: "Snails",
};

export const DISEASES: ReadonlyArray<Disease> = [
  {
    slug: "ich",
    name: "Ich (White Spot)",
    aliases: ["white spot", "ick", "Ichthyophthirius"],
    affects: ["fish"],
    pathogen: "parasite",
    contagious: true,
    spot: "Grains of white salt scattered over the fins and body, and fish flicking against surfaces.",
    tldr: "Ich is the one nearly everyone meets. It looks like grains of salt stuck to the fins and body, and it usually starts after a chill or a stressed new arrival. The parasite only takes medication during its free-swimming stage, so treatment runs over days, not hours. Raising the temperature speeds its life cycle so the treatment can reach it. The catch in a planted tank is that shrimp and snails hate the usual copper and malachite-green medications, so pick an invert-safe route or move the fish to quarantine.",
    symptoms:
      "White spots the size of salt grains on the fins first, then the body. Fish flick and scratch against hardscape and substrate, clamp their fins, and breathe fast if the gills are hit. Left alone it spreads across the whole fish and through the tank.",
    causes: [
      "A temperature drop or swing that stresses the fish",
      "A new fish added without quarantine bringing the parasite in",
      "Chronic stress from poor water or bullying lowering resistance",
    ],
    treatment: [
      "Raise the temperature slowly to around 28°C to speed the parasite's cycle, if all your fish tolerate it.",
      "Treat with an invert-safe white spot medication, or use the heat-and-salt method in a fish-only tank.",
      "Keep treating for the full course, several days past the last visible spot, since medication only kills the free-swimming stage.",
      "Increase aeration, because warmer water holds less oxygen.",
      "Do the recommended water changes between doses to clear dead parasites.",
    ],
    prevention:
      "Quarantine new fish for two weeks, avoid temperature swings, and keep the tank stable. A calm, well-fed fish shrugs off the odd parasite that a stressed one cannot.",
    safetyNote:
      "Copper and malachite-green medications kill shrimp and snails and harm scaleless fish like loaches and corydoras. In a stocked planted tank use an invert-safe formula at the stated dose, or move affected fish to a bare quarantine tank for stronger treatment.",
    confusedWith:
      "Velvet looks like a finer gold or rust dust rather than distinct salt grains. Breeding tubercles on male fish and the white spots of columnaris are also mistaken for ich, but neither spreads as scattered grains.",
    atRisk: [
      { slug: "kuhli-loach", category: "fish", note: "Scaleless, so it reacts badly to copper and malachite green, use invert-safe or quarantine treatment." },
      { slug: "otocinclus", category: "fish", note: "Delicate and med-sensitive, treat gently and keep oxygen high." },
      { slug: "pygmy-corydoras", category: "fish", note: "A small scaleless catfish that needs the gentler treatment route." },
      { slug: "neon-tetra", category: "fish", note: "A classic early victim, especially just after a temperature drop." },
    ],
    faqs: [
      { question: "Is ich contagious to my whole tank?", answer: "Yes. Once the parasite drops off and reproduces, it targets every fish. Treat the whole tank, not just the spotted fish." },
      { question: "Can I just raise the temperature to cure it?", answer: "Heat speeds the cycle so treatment reaches the parasite faster, but on its own it is unreliable. Pair it with an invert-safe medication or salt in a fish-only tank." },
      { question: "Will ich medication kill my shrimp?", answer: "The common copper and malachite-green ones will. Use a formula labelled shrimp and snail safe, or treat the fish in a separate tank." },
    ],
  },
  {
    slug: "fin-rot",
    name: "Fin Rot",
    aliases: ["tail rot", "fin melt"],
    affects: ["fish"],
    pathogen: "bacterial",
    contagious: false,
    spot: "Fin edges going ragged, milky or red, eating inward toward the body.",
    tldr: "Fin rot is a bacterial infection that takes hold when water quality slips or a fish is stressed or nipped. The fin edges fray and discolour and, untreated, the rot eats back toward the body. It is not really contagious, it is opportunistic, so the real fix is the water, not just a bottle. Clean water and good food reverse mild cases on their own; advanced cases with reddened, receding fins need an antibacterial treatment. Long-finned fish like bettas and angelfish get it most.",
    symptoms:
      "Fin edges look ragged, torn or frayed, often with a white, milky or reddened margin. The fins shrink over days, and in bad cases the rot reaches the body and the fish becomes lethargic.",
    causes: [
      "Poor water quality, high ammonia or nitrite, or overdue water changes",
      "Fin nipping from tankmates leaving damage that gets infected",
      "Chronic stress from crowding, bullying or unstable parameters",
      "A cold or dirty tank lowering the fish's resistance",
    ],
    treatment: [
      "Test the water and fix the basics first: ammonia and nitrite to zero, nitrate down with a water change.",
      "Improve maintenance, clean water is the single biggest lever on mild fin rot.",
      "For advanced or reddening cases, use an antibacterial or antibiotic treatment suited to the fish.",
      "Remove the fin-nipping tankmate if that is the cause.",
      "Feed well, since good nutrition speeds fin regrowth, which grows back clear at first.",
    ],
    prevention:
      "Keep up water changes, avoid known fin-nippers with long-finned fish, and keep the tank stable. Most fin rot is a water-quality problem wearing a costume.",
    safetyNote:
      "Many antibacterial medications knock back your filter's beneficial bacteria and can stress shrimp and snails. Dose in the display tank only with an invert-aware product, or treat the fish in quarantine, and re-check ammonia during and after treatment.",
    confusedWith:
      "Physical fin damage from nipping or sharp decor looks similar but does not spread or discolour once the fish is left alone. Columnaris moves much faster and often hits the mouth and body too.",
    atRisk: [
      { slug: "betta", category: "fish", note: "Long, heavy fins make it the classic fin-rot patient, especially in unheated or dirty tanks." },
      { slug: "angelfish", category: "fish", note: "Long trailing fins are easy targets for nipping and infection." },
      { slug: "guppy", category: "fish", note: "Fancy tails fray quickly in poor water or with nippy tankmates." },
      { slug: "pearl-gourami", category: "fish", note: "Long ventral filaments are prone to damage and rot." },
    ],
    faqs: [
      { question: "Will fin rot heal on its own?", answer: "Mild cases often do once the water is clean and the fish is unstressed. Fins regrow, clear at first, then re-colour. Advanced, reddening cases need medication." },
      { question: "Is fin rot contagious?", answer: "Not really. It is opportunistic, so other fish get it only if the same poor conditions or stress affect them too." },
      { question: "Why does it keep coming back?", answer: "Because the underlying cause, usually water quality or a nipping tankmate, has not been fixed. Treat the tank, not just the fish." },
    ],
  },
  {
    slug: "velvet",
    name: "Velvet (Gold Dust Disease)",
    aliases: ["oodinium", "rust disease", "gold dust"],
    affects: ["fish"],
    pathogen: "parasite",
    contagious: true,
    spot: "A fine gold or rust-coloured dusting over the skin, best seen with a torch held at an angle.",
    tldr: "Velvet is a parasite like ich but finer and more dangerous. Instead of salt grains it lays a fine gold or rust dust over the skin, easiest to see with a torch shone at an angle in a dim room. Fish clamp their fins, go off food, and breathe hard because it attacks the gills early. It moves fast and kills faster than ich, so treat at the first sign. Labyrinth fish like bettas and gouramis and small fish like killifish are hit hardest.",
    symptoms:
      "A fine yellow-gold to rusty sheen over the body, like the fish has been dusted with powder. Clamped fins, rapid gill movement, flicking, loss of appetite, and lethargy. It often hits the gills first, so laboured breathing can come before the dust is obvious.",
    causes: [
      "A new fish or plant introduced without quarantine carrying the parasite",
      "Stress and poor water lowering resistance",
      "A tank that has run warm and bright, which the parasite favours",
    ],
    treatment: [
      "Dim the tank and darken it for the course, since the parasite relies on light to feed.",
      "Raise the temperature slightly if the fish tolerate it to speed its cycle.",
      "Treat with a velvet-specific medication promptly, this one does not wait.",
      "Increase aeration, because gill damage plus warm water starves the fish of oxygen.",
      "Complete the full course past the last visible sign.",
    ],
    prevention:
      "Quarantine everything that goes in the tank, fish and plants, and keep stress low. Velvet almost always arrives on an unquarantined newcomer.",
    safetyNote:
      "Velvet treatments are often copper-based and lethal to shrimp and snails, and harsh on scaleless fish. Treat in a quarantine tank wherever possible; if you must dose the display, use an invert-safe formula and accept it may be less effective.",
    confusedWith:
      "Ich makes distinct salt grains, velvet makes a fine even dust. The gold sheen is subtle, so a torch at an angle in a dark room is the reliable way to tell them apart.",
    atRisk: [
      { slug: "betta", category: "fish", note: "Labyrinth fish are highly susceptible and often the first to show it." },
      { slug: "honey-gourami", category: "fish", note: "Small labyrinth fish hit hard and fast by velvet." },
      { slug: "clown-killifish", category: "fish", note: "Small killifish are very vulnerable, treat at the first dusty sheen." },
      { slug: "endler-livebearer", category: "fish", note: "Small, active fish that decline quickly once the gills are affected." },
    ],
    faqs: [
      { question: "How is velvet different from ich?", answer: "Velvet is a fine gold or rust dust, ich is distinct white salt grains. Velvet is smaller, harder to see, attacks the gills early, and kills faster." },
      { question: "Why should I darken the tank?", answer: "The velvet parasite photosynthesises to feed, so cutting the light weakens it and helps the treatment work." },
      { question: "How fast do I need to act?", answer: "Immediately. Velvet can wipe out a tank in days, much faster than ich, because it damages the gills early." },
    ],
  },
  {
    slug: "columnaris",
    name: "Columnaris (Cotton Mouth)",
    aliases: ["mouth fungus", "cotton mouth", "Flavobacterium"],
    affects: ["fish"],
    pathogen: "bacterial",
    contagious: true,
    spot: "White or grey cottony patches around the mouth and body, and greyish saddle marks, spreading fast.",
    tldr: "Columnaris is a bacterial infection that masquerades as fungus, which is why it is often called mouth fungus. It shows as white or grey fuzzy patches around the mouth, greyish saddle-shaped marks on the back, and frayed fins, and it spreads alarmingly fast, especially in warm water. Because it looks fungal but is bacterial, antifungal treatments fail and waste time you do not have. Treat it as the fast bacterial infection it is, and lower the temperature rather than raising it.",
    symptoms:
      "White to grey cottony growths on the mouth, a greyish saddle mark across the back, ragged fins, and skin lesions. Fish go off food and lethargic. It can kill within a day or two in warm tanks, so speed matters.",
    causes: [
      "High temperature, which accelerates the bacteria",
      "Poor water quality and high organic waste",
      "Stress, injury, or a new fish bringing it in",
      "Crowding that spreads it quickly between fish",
    ],
    treatment: [
      "Lower the temperature, the opposite of ich, since warmth makes columnaris more aggressive.",
      "Use an antibacterial or antibiotic treatment effective against columnaris, not an antifungal.",
      "Improve water quality immediately with a change and clean maintenance.",
      "Isolate affected fish if you can, because it spreads fast.",
      "Act within hours, not days, in a warm tank.",
    ],
    prevention:
      "Keep water clean, avoid overcrowding, quarantine new fish, and don't run the tank hotter than the fish need. Columnaris preys on stressed fish in warm, dirty water.",
    safetyNote:
      "The antibiotics used for columnaris can dent your biofilter and stress inverts. Treat in quarantine when possible and watch ammonia in the display if you dose there. Do not reach for antifungal remedies, they do nothing to this bacterium.",
    confusedWith:
      "True fungus (Saprolegnia) is a genuine cottony growth but grows slowly and usually on injuries or dead tissue. Columnaris spreads fast and hits healthy-looking fish, and it needs antibacterial, not antifungal, treatment.",
    atRisk: [
      { slug: "guppy", category: "fish", note: "Livebearers in warm tanks are frequent columnaris casualties." },
      { slug: "black-molly", category: "fish", note: "Prone in warm, hard water, and it moves fast on them." },
      { slug: "dwarf-gourami", category: "fish", note: "Already disease-prone, and columnaris hits stressed individuals hard." },
      { slug: "angelfish", category: "fish", note: "Warm-water cichlids that can crash quickly once infected." },
    ],
    faqs: [
      { question: "Is it fungus or bacteria?", answer: "Bacteria, despite the cottony look and the mouth-fungus name. Antifungal treatments will not work, use an antibacterial." },
      { question: "Should I raise the temperature like for ich?", answer: "No, do the opposite. Heat makes columnaris far more aggressive, so lower the temperature." },
      { question: "Why is my fish dying so fast?", answer: "Columnaris is one of the fastest killers in the hobby, especially in warm water. Treat within hours of spotting it." },
    ],
  },
  {
    slug: "dropsy",
    name: "Dropsy",
    aliases: ["pinecone disease", "bloat"],
    affects: ["fish"],
    pathogen: "bacterial",
    contagious: false,
    spot: "A swollen belly with scales sticking out like a pinecone, often with bulging eyes.",
    tldr: "Dropsy is not a disease in itself, it is what internal organ failure looks like from the outside. The body swells with fluid until the scales lift and stick out like a pinecone, usually with bulging eyes. It is most often the end stage of an internal bacterial infection, and by the pinecone stage the outlook is poor. Catching the swelling early, before the scales lift, gives the best chance. It is not really contagious, but the poor conditions behind it can affect other fish.",
    symptoms:
      "A rounded, swollen belly, scales that stand out from the body so the fish looks like a pinecone from above, bulging eyes, pale gills, loss of appetite, and lethargy. The pinecone look is the classic late sign.",
    causes: [
      "An internal bacterial infection, the most common trigger",
      "Chronic stress and poor water quality weakening the immune system",
      "Sometimes organ failure, parasites, or old age behind the fluid build-up",
    ],
    treatment: [
      "Isolate the fish in a quarantine tank to treat and to spare its tankmates the stress.",
      "Use an antibacterial or antibiotic treatment aimed at internal infection, ideally in medicated food.",
      "Add aquarium salt in a fish-only quarantine tank to help with fluid balance, if the species tolerates it.",
      "Keep water pristine and stable throughout.",
      "Be realistic, once the scales pinecone, recovery is uncommon, so act at the first swelling.",
    ],
    prevention:
      "Pristine water, good varied food, and low stress. Dropsy is usually the price of chronic poor conditions rather than bad luck, so a well-kept tank rarely sees it.",
    safetyNote:
      "Salt and many antibiotics used for dropsy harm shrimp, snails and plants, so treat in a separate quarantine tank, never dose salt into a planted display.",
    confusedWith:
      "A gravid female full of eggs is round but her scales stay flat. Constipation and general bloat swell the belly without the raised, pineconing scales that mark true dropsy.",
    atRisk: [
      { slug: "betta", category: "fish", note: "A frequent dropsy patient, often from chronic stress in small, unstable tanks." },
      { slug: "angelfish", category: "fish", note: "Internal infections in cichlids can end in dropsy if caught late." },
      { slug: "guppy", category: "fish", note: "Livebearers show dropsy when kept in poor or unstable water." },
    ],
    faqs: [
      { question: "Can dropsy be cured?", answer: "Sometimes, if caught before the scales pinecone and the internal infection is treated early. Once the fish is fully pineconed, recovery is rare." },
      { question: "Is dropsy contagious?", answer: "The dropsy itself is not, but the poor water or stress that caused it can affect other fish, so check your conditions." },
      { question: "My fish is round, is it dropsy?", answer: "Only if the scales stand out like a pinecone when viewed from above. A flat-scaled round belly is more likely eggs or constipation." },
    ],
  },
  {
    slug: "fungal-infection",
    name: "Fungal Infection",
    aliases: ["cotton wool disease", "Saprolegnia", "body fungus"],
    affects: ["fish"],
    pathogen: "fungal",
    contagious: false,
    spot: "Fluffy, cotton-wool tufts, usually white or grey, on an injury, the mouth, or on eggs.",
    tldr: "True fungus shows as soft, fluffy cotton-wool tufts, and unlike the fast-spreading columnaris it grows slowly and almost always on damaged tissue, an old wound, a fin-rot site, or dead eggs. It is opportunistic, so the fish nearly always had an injury or was run down first. Improve the water, treat with an antifungal, and fix whatever caused the original damage. Healthy, unstressed fish in clean water rarely grow fungus.",
    symptoms:
      "White or grey fluffy, cotton-like growths on the skin, fins, mouth or over a wound. It looks softer and more three-dimensional than the flatter patches of columnaris, and it stays local rather than racing across the fish.",
    causes: [
      "An existing injury or wound the fungus colonises",
      "Poor water quality and high organic waste",
      "A fish weakened by another illness or chronic stress",
      "Dead eggs in a spawning tank, which fungus spreads from",
    ],
    treatment: [
      "Clean the water with a change and better maintenance.",
      "Treat with an antifungal remedy suited to the fish.",
      "Address the underlying injury or illness that let it start.",
      "In a fish-only tank, aquarium salt can help; not in a planted or shrimp tank.",
      "Remove dead eggs or organic matter feeding the fungus.",
    ],
    prevention:
      "Keep water clean, treat injuries and fin rot early, and reduce stress. Fungus needs a foothold, so a fish with intact skin in good water rarely gives it one.",
    safetyNote:
      "Antifungal dyes like malachite green stain silicone and harm shrimp, snails and scaleless fish. Use an invert-safe antifungal or treat in quarantine, and never salt a planted display.",
    confusedWith:
      "Columnaris looks fungal but is bacterial, spreads fast and needs antibacterial treatment. If the cottony growth is racing across a healthy fish rather than sitting on a wound, treat it as columnaris, not fungus.",
    atRisk: [
      { slug: "betta", category: "fish", note: "Prone after fin damage or in cool, dirty water where fungus takes hold." },
      { slug: "angelfish", category: "fish", note: "Spawning pairs see egg fungus, and injuries can fungus over." },
      { slug: "bronze-corydoras", category: "fish", note: "Barbels and skin injuries on the bottom can fungus if the substrate is dirty." },
    ],
    faqs: [
      { question: "Is it fungus or columnaris?", answer: "Fungus grows slowly on a wound or dead tissue and stays put. Columnaris spreads fast across healthy skin. When in doubt on a fast-moving case, treat for columnaris." },
      { question: "Where does fungus come from?", answer: "Fungal spores are always in the tank. They only grow on damaged tissue or dead matter, so an injury or poor water is the real cause." },
      { question: "Can I use salt in my planted tank?", answer: "No. Salt harms most plants and inverts. Treat the fish in a separate quarantine tank if you want to use salt." },
    ],
  },
  {
    slug: "swim-bladder-disorder",
    name: "Swim Bladder Disorder",
    aliases: ["SBD", "buoyancy problems", "floating or sinking"],
    affects: ["fish"],
    pathogen: "environmental",
    contagious: false,
    spot: "A fish floating at the top, sinking to the bottom, or swimming sideways or upside down.",
    tldr: "Swim bladder disorder is a buoyancy problem, not one disease, so the fish floats, sinks, tips over or swims upside down while otherwise looking fine. In most planted-tank fish it comes from diet: constipation or gulped air from dry food pressing on the swim bladder. It is not contagious. Fasting for a couple of days, then feeding a little blanched deshelled pea or soaked food, fixes many cases. Deep-bodied fish like fancy shapes and gouramis and bettas get it most, and if an infection or injury is behind it, that needs treating instead.",
    symptoms:
      "The fish struggles to hold its position: floating at the surface, sinking and resting on the bottom, listing to one side, or swimming nose-down or upside down. Appetite and colour often stay normal, which is the clue it is buoyancy rather than a systemic illness.",
    causes: [
      "Constipation from overfeeding or an all-dry-food diet",
      "Gulping air with floating pellets, common in bettas and gouramis",
      "A sudden temperature drop slowing digestion",
      "Less often, an internal infection, injury, or birth defect affecting the bladder",
    ],
    treatment: [
      "Fast the fish for one to three days to clear the gut.",
      "Then feed a small piece of blanched, deshelled pea, or pre-soaked sinking food, to relieve constipation.",
      "Soak dry foods before feeding so they don't expand or carry air into the fish.",
      "Keep the temperature in the fish's proper range to aid digestion.",
      "If it persists with other symptoms, treat for the underlying infection instead of assuming diet.",
    ],
    prevention:
      "Feed a varied diet, don't overfeed, soak or use sinking foods for air-gulpers, and keep the temperature stable. Most swim bladder trouble is a feeding habit, not bad luck.",
    safetyNote:
      "There is usually nothing to medicate, which is good news for a planted tank. Reach for antibacterials only if there are clear signs of infection alongside the buoyancy problem, and then prefer quarantine.",
    confusedWith:
      "Dropsy also affects how a fish sits in the water, but it comes with a swollen, pineconing body. A fish that is otherwise plump and healthy but can't stay level is far more likely a diet-driven swim bladder issue.",
    atRisk: [
      { slug: "betta", category: "fish", note: "Surface feeders that gulp air with floating pellets, so soak the food." },
      { slug: "angelfish", category: "fish", note: "Deep bodies make buoyancy problems more obvious and more common." },
      { slug: "three-spot-gourami", category: "fish", note: "Labyrinth fish that gulp at the surface and can take in air with food." },
    ],
    faqs: [
      { question: "Is swim bladder disorder contagious?", answer: "No. It is a buoyancy problem, usually from diet, not an infection you can catch between fish." },
      { question: "Does the pea trick really work?", answer: "For constipation-driven cases, often yes. Fast first, then feed a small piece of blanched, deshelled pea to help clear the gut." },
      { question: "My fish still can't swim level after a week, now what?", answer: "If fasting and diet changes don't help and there are other symptoms, an internal infection or injury may be the cause, which needs treating in its own right." },
    ],
  },
  {
    slug: "hole-in-the-head",
    name: "Hole in the Head (HLLE)",
    aliases: ["HITH", "HLLE", "head and lateral line erosion"],
    affects: ["fish"],
    pathogen: "other",
    contagious: false,
    spot: "Small pits or eroded holes on the head and along the lateral line, mostly on cichlids.",
    tldr: "Hole in the head shows as small pits and eroded holes on the head and down the lateral line, and it mainly affects cichlids like disc, angels and rams. It is not fully pinned to one cause, but poor water quality, a poor diet low in vitamins and minerals, and activated carbon in some cases all get blamed, and a protozoan is often present. The reliable fix is fixing the tank: pristine water, better varied food, and stability. Caught early it reverses; left long it scars.",
    symptoms:
      "Small white or cream pits on the head, widening into eroded holes, and erosion along the lateral line. Sometimes stringy white waste and loss of appetite. It develops slowly over weeks, unlike the fast infections.",
    causes: [
      "Chronic poor water quality and high nitrate",
      "A poor diet lacking vitamins and minerals",
      "Ongoing stress in sensitive cichlids",
      "A protozoan is often involved, alongside the conditions above",
    ],
    treatment: [
      "Overhaul water quality: frequent water changes and low, stable nitrate.",
      "Upgrade the diet to varied, vitamin-rich foods, and consider vitamin-soaked food.",
      "Reduce stress, review tankmates and territory for the affected cichlid.",
      "If a protozoan is confirmed, treat it with a suitable, invert-aware medication.",
      "Be patient, healing is gradual and early pits recover better than old ones.",
    ],
    prevention:
      "Keep nitrate low with regular water changes and feed a rich, varied diet from the start. HLLE is largely a disease of long-term neglect in otherwise hardy cichlids.",
    safetyNote:
      "Most of the fix is husbandry, which is entirely planted-tank and shrimp safe. If you medicate for a protozoan, choose an invert-aware product or treat the fish in quarantine.",
    confusedWith:
      "Early pitting can look like the sensory pores that are naturally present on a cichlid's head. True HLLE erodes and widens over time, and comes with poor colour and appetite.",
    atRisk: [
      { slug: "discus", category: "fish", note: "The poster child for HLLE, very sensitive to nitrate and diet." },
      { slug: "angelfish", category: "fish", note: "Cichlids prone to head and lateral-line erosion in neglected tanks." },
      { slug: "ram-cichlid", category: "fish", note: "A sensitive dwarf cichlid that shows the pits when water or diet slips." },
      { slug: "keyhole-cichlid", category: "fish", note: "Can develop lateral-line erosion under chronic stress and poor water." },
    ],
    faqs: [
      { question: "Is hole in the head reversible?", answer: "Early cases usually recover once water quality and diet are fixed. Long-standing erosion may leave permanent scars even after it stops progressing." },
      { question: "Does activated carbon cause it?", answer: "It is debated. Some link fine carbon dust to HLLE in sensitive cichlids, but poor water and diet are the better-established causes. Fix those first." },
      { question: "Only my cichlid has it, why?", answer: "Cichlids, especially discus, angels and rams, are far more prone to HLLE than most community fish, so they show it first when conditions slip." },
    ],
  },
  {
    slug: "shrimp-failed-molt",
    name: "Shrimp Molting Problems",
    aliases: ["white ring of death", "failed molt", "molting death syndrome"],
    affects: ["shrimp"],
    pathogen: "environmental",
    contagious: false,
    spot: "A shrimp stuck half-out of its old shell, or dead with a distinct white ring around the middle.",
    tldr: "Shrimp grow by molting, and when the water minerals are off, the molt goes wrong. The tell is the White Ring of Death: a clean white gap around the shrimp's middle where the old shell failed to split properly, usually fatal. It comes down to general hardness and minerals, too soft and the new shell can't form, plus swings from careless water changes. It is not a pathogen, so there is nothing to medicate; you fix the water. Remineralise to the right GH and change water slowly, and molts go back to normal.",
    symptoms:
      "A shrimp trapped half-in and half-out of its old exoskeleton, or a dead shrimp with a bright white ring or gap around the middle of the body. Sometimes failed molts follow a large or fast water change.",
    causes: [
      "General hardness too low, so the new shell can't mineralise",
      "A calcium and magnesium imbalance in the water",
      "Large or rapid water changes swinging the parameters",
      "Sudden GH or TDS shifts from topping up or remineralising carelessly",
    ],
    treatment: [
      "Test GH. For neocaridina aim for roughly 6 to 8 dGH, for caridina lower, and correct with a proper shrimp remineraliser.",
      "Remineralise RO or soft water to a stable GH rather than chasing numbers.",
      "Make water changes small and slow, matched to the tank's temperature and parameters.",
      "Leave a struggling shrimp be, handling makes a stuck molt worse.",
      "Ensure a steady mineral supply so the next molt forms a good shell.",
    ],
    prevention:
      "Hold a stable GH with a remineraliser made for shrimp, change water in small amounts, and avoid sudden swings. Steady minerals are the whole game for healthy molts.",
    safetyNote:
      "This is a water-chemistry fix, not a medication one, so it is entirely safe for a planted shrimp tank. The lever is remineralisation to the right, stable GH.",
    confusedWith:
      "A normal molt leaves a clean, empty, translucent shell (often mistaken for a dead shrimp), which is healthy. The White Ring of Death is a gap in a shrimp that failed to complete the molt, which is the problem.",
    atRisk: [
      { slug: "cherry-shrimp", category: "shrimp", note: "Neocaridina need a steady 6 to 8 dGH, molts fail if it drops too low." },
      { slug: "crystal-red-shrimp", category: "shrimp", note: "Caridina are fussier about minerals and swings, so remineralise carefully." },
      { slug: "blue-dream-shrimp", category: "shrimp", note: "A neocaridina morph with the same GH needs as cherries." },
      { slug: "bee-shrimp", category: "shrimp", note: "Sensitive caridina that show molt problems fast when water is unstable." },
    ],
    faqs: [
      { question: "What is the White Ring of Death?", answer: "A clean white gap around a shrimp's middle where the shell failed to split at the molt line, usually fatal. It points to a general hardness or mineral problem." },
      { question: "I found an empty shell, is my shrimp dead?", answer: "Probably not. A clean, translucent, empty shell is a normal successful molt. A healthy shrimp usually hides for a day afterward while its new shell hardens." },
      { question: "How do I stop failed molts?", answer: "Keep GH stable and in range with a shrimp remineraliser, and make water changes small and slow so you never swing the minerals." },
    ],
  },
  {
    slug: "shrimp-bacterial-infection",
    name: "Shrimp Bacterial Infection",
    aliases: ["shrimp bacterial disease", "internal infection", "shell disease"],
    affects: ["shrimp"],
    pathogen: "bacterial",
    contagious: true,
    spot: "A pink or orange tint deep inside the body (as if partly cooked), or sores and dark spots on the shell.",
    tldr: "Bacterial infections in shrimp are hard to treat and easier to prevent. Internal ones show as an unusual pink or orange colour deep inside a clear-bodied shrimp, almost like it has been lightly cooked, and are usually fatal by the time you see them. Shell infections show as dark eroded spots or sores on the exoskeleton. Both trace back to poor water, overcrowding, or a spike in waste. There is no reliable shrimp-safe cure, so the answer is clean, stable water, removing dead shrimp fast, and not overstocking.",
    symptoms:
      "A pink, orange or milky discolouration inside the normally translucent body for internal infection. For shell disease, dark brown or black eroded patches, pitting, or open sores on the exoskeleton. Affected shrimp go still, stop grazing, and hide.",
    causes: [
      "Poor water quality or a waste spike from overfeeding",
      "Overcrowding raising stress and spreading bacteria",
      "A dead shrimp left to rot and foul the water",
      "Injury to the shell letting infection in",
    ],
    treatment: [
      "Remove affected and dead shrimp promptly to protect the colony.",
      "Do careful, small water changes to improve quality without swinging parameters.",
      "Cut feeding right back to reduce the waste feeding the bacteria.",
      "There is no dependable shrimp-safe medication for internal infection, so focus on the survivors and the water.",
      "For shell sores, clean water and a good molt often let the shrimp shed the damaged shell.",
    ],
    prevention:
      "Don't overstock or overfeed, keep water pristine and stable, and remove dead shrimp the moment you spot them. Prevention is the only reliable tool with shrimp bacteria.",
    safetyNote:
      "The antibiotics that might help are largely untested and risky in a shrimp tank, and copper-based products are lethal. Prioritise water quality and colony management over dosing the display.",
    confusedWith:
      "A shrimp's natural colour or a recent meal can tint the body, and a normal shell has patterns. Look for colour deep inside the flesh (not the shell) for internal infection, and eroded, open patches rather than pigment for shell disease.",
    atRisk: [
      { slug: "cherry-shrimp", category: "shrimp", note: "Overcrowded neocaridina colonies see bacterial issues when water slips." },
      { slug: "crystal-red-shrimp", category: "shrimp", note: "Sensitive caridina that succumb quickly to internal infection in poor water." },
      { slug: "bee-shrimp", category: "shrimp", note: "Delicate and unforgiving of waste spikes and instability." },
    ],
    faqs: [
      { question: "My shrimp looks pink or cooked inside, can I save it?", answer: "Usually not. An internal bacterial infection is generally fatal by the time the colour shows. Remove it and focus on keeping the rest of the colony's water clean." },
      { question: "Can I use fish antibiotics on shrimp?", answer: "It is risky and largely untested, and copper-based products will kill the colony. Water quality and removing sick shrimp are far safer and more reliable." },
      { question: "Is it contagious to the colony?", answer: "It can spread, especially from a rotting dead shrimp. Remove casualties fast and address the water conditions that let it start." },
    ],
  },
  {
    slug: "shrimp-vorticella-scutariella",
    name: "Vorticella & Scutariella (Shrimp Parasites)",
    aliases: ["vorticella", "scutariella japonica", "shrimp fungus"],
    affects: ["shrimp"],
    pathogen: "parasite",
    contagious: true,
    spot: "White fuzzy or thread-like growths on the shrimp's nose, head or shell, sometimes waving in the flow.",
    tldr: "These are the little white growths people mistake for fungus on shrimp. Vorticella looks like a white fuzzy mould on the shell and appendages, while Scutariella japonica shows as tiny white threads on the shrimp's nose and head. Both are external hitchhikers that thrive in mucky water, and both are treatable, unlike internal infections. A salt dip or an invert-safe treatment clears them, and keeping the water clean stops them returning. They usually arrive on new shrimp, so quarantine helps.",
    symptoms:
      "For vorticella, a white fuzzy or f-shaped growth on the shell, legs or rostrum that can wave in the current. For scutariella, small white threads or bristles on the nose and head, sometimes with the shrimp scratching. The shrimp otherwise grazes and behaves normally at first.",
    causes: [
      "Poor water quality and high organic waste feeding the organisms",
      "New shrimp introduced without quarantine bringing them in",
      "An overstocked or under-maintained tank",
    ],
    treatment: [
      "Improve water quality first, since both thrive on organic muck.",
      "For a light case, a brief salt dip outside the tank can knock them off, following a shrimp-safe method.",
      "For scutariella, an invert-safe treatment (for example a suitable planaria and parasite remedy at shrimp doses) clears it.",
      "Repeat as directed, and treat new arrivals in quarantine.",
      "Keep up maintenance so they don't come back.",
    ],
    prevention:
      "Quarantine new shrimp, keep the water clean, and don't overstock. These parasites need mucky conditions and an unquarantined carrier to take hold.",
    safetyNote:
      "Skip copper and harsh fish parasite meds, which kill shrimp. Use a salt dip done carefully outside the display, or a treatment explicitly rated shrimp-safe, and dose to shrimp tolerances, not fish ones.",
    confusedWith:
      "Both are mistaken for a fungal infection. Fungus is unusual on live, healthy shrimp; white growth on the nose is almost always scutariella, and fuzzy shell growth is vorticella, both of which are treatable.",
    atRisk: [
      { slug: "cherry-shrimp", category: "shrimp", note: "Commonly carry vorticella and scutariella in from unquarantined stock." },
      { slug: "crystal-red-shrimp", category: "shrimp", note: "Prone in soft-water tanks with any organic build-up." },
      { slug: "amano-shrimp", category: "shrimp", note: "Often show scutariella threads on the nose when newly imported." },
    ],
    faqs: [
      { question: "Is the white stuff on my shrimp's nose fungus?", answer: "Almost certainly not. White threads on the nose are Scutariella japonica, a treatable external parasite, not fungus." },
      { question: "Will it spread to my other shrimp?", answer: "It can, so treat the tank and quarantine new arrivals. Clean water slows it right down." },
      { question: "Is a salt dip safe for shrimp?", answer: "A short, correctly done dip outside the tank is a common treatment for light cases, but follow a shrimp-specific method carefully, since shrimp are far less salt-tolerant than fish." },
    ],
  },
];

export function getDisease(slug: string): Disease | undefined {
  return DISEASES.find((d) => d.slug === slug);
}
