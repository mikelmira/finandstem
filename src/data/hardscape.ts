/**
 * Aquascaping hardscape, stone and wood, by type.
 *
 * The reason this exists: almost nothing on the web lays out what each stone
 * or wood actually does to your water. Some stones are calcareous and push pH
 * and hardness up, which quietly wrecks a soft-water shrimp tank; most wood is
 * inert but leaches tannins that tint the water and nudge pH down. These are
 * well-established effects, written plainly so people can choose hardscape
 * that matches the tank they want.
 */

export type HardscapeCategory = "stone" | "wood";
export type ChemEffect = "lowers" | "neutral" | "raises";
export type TanninLevel = "none" | "low" | "moderate" | "high";
export type Buoyancy = "sinks" | "soak-first" | "floats";

export interface HardscapeType {
  slug: string;
  name: string;
  aliases: string[];
  category: HardscapeCategory;
  /** Effect on pH. */
  phEffect: ChemEffect;
  /** Effect on general/carbonate hardness. */
  hardnessEffect: ChemEffect;
  /** Tannin release (wood). Stone is "none". */
  tannins: TanninLevel;
  /** Wood only; null for stone. */
  buoyancy: Buoyancy | null;
  /** One-line "how to recognise it". */
  spot: string;
  tldr: string;
  appearance: string;
  /** What it does to the water. */
  water: string;
  /** How to prepare it before it goes in. */
  prep: string;
  /** How it's used in a scape. */
  scaping: string;
  faqs: { question: string; answer: string }[];
}

export const HARDSCAPE: ReadonlyArray<HardscapeType> = [
  {
    slug: "seiryu-stone",
    name: "Seiryu Stone",
    aliases: ["blue dragon stone"],
    category: "stone",
    phEffect: "raises",
    hardnessEffect: "raises",
    tannins: "none",
    buoyancy: null,
    spot: "Blue-grey rock with sharp ridges and bright white calcite veins.",
    tldr: "Seiryu is the classic Iwagumi stone, blue-grey with dramatic white veins and sharp jagged edges. The catch that catches a lot of people out is that it is calcareous, so it slowly raises pH and hardness. That is fine for a tank aimed at harder, higher pH water, but it works against soft-water plants and shrimp, and it is worth knowing before you build a whole scape on it. A splash of aquarium-safe acid will fizz on it, which is the quick test.",
    appearance:
      "Angular blue-grey stone with pale calcite seams running through it, and crisp ridged edges that read well in a minimalist scape.",
    water:
      "It contains calcium carbonate, so it dissolves slowly and pushes pH and general hardness up over time. The effect is stronger in soft, low-buffered water. If you are aiming for a soft-water shrimp or blackwater tank, seiryu will fight you; for a harder community it is fine. Test with a drop of acid, it fizzes.",
    prep:
      "Scrub it under running water to clear dust and loose grit. No soaking needed, but rinse well so you are not dumping fine sediment into the tank.",
    scaping:
      "The go-to stone for Iwagumi and mountain scapes. Its strong lines suit a spare, rocky layout with a carpet foreground. Bury the base so stones look rooted rather than dropped on the substrate.",
    faqs: [
      {
        question: "Does Seiryu stone raise pH?",
        answer:
          "Yes. It is calcareous, so it slowly lifts pH and hardness, most noticeably in soft water. That suits a harder-water community but works against soft-water shrimp and blackwater setups.",
      },
      {
        question: "Is Seiryu stone safe for shrimp?",
        answer:
          "For Neocaridina in harder water it is usually fine. For Caridina, which want soft, acidic water, the hardness it adds is a problem, so most soft-water shrimp keepers pick an inert stone like Dragon stone instead.",
      },
    ],
  },
  {
    slug: "dragon-stone",
    name: "Dragon Stone",
    aliases: ["Ohko stone", "Ohko"],
    category: "stone",
    phEffect: "neutral",
    hardnessEffect: "neutral",
    tannins: "none",
    buoyancy: null,
    spot: "Tan-brown rock full of holes and honeycombed hollows.",
    tldr: "Dragon stone, or Ohko, is the tan-brown stone riddled with holes and craggy hollows. It is inert, so it leaves your water chemistry alone, which makes it the safe default for planted and shrimp tanks where seiryu would cause trouble. The texture is perfect for tucking moss and small plants into, and it looks great aged. Give it a good rinse first, since the softer clay can shed fine grit.",
    appearance:
      "Warm brown clay stone, deeply pitted with holes and channels. The texture catches light and takes moss and small epiphytes beautifully.",
    water:
      "Inert. It does not measurably change pH or hardness, so it suits soft-water tanks, shrimp and blackwater scapes without any of the buffering that seiryu brings.",
    prep:
      "Rinse and gently brush off loose clay and dust, it can crumble a little at the surface. No soaking or boiling required.",
    scaping:
      "A favourite for planted layouts and nano scapes. The holes are made for wedging moss, bucephalandra and small crypts, and it ages into a natural, weathered look.",
    faqs: [
      {
        question: "Does Dragon stone affect water parameters?",
        answer:
          "No. Dragon stone is inert, so it leaves pH and hardness alone. That is why it is the usual pick for soft-water and shrimp tanks where a calcareous stone would cause problems.",
      },
    ],
  },
  {
    slug: "lava-rock",
    name: "Lava Rock",
    aliases: ["volcanic rock"],
    category: "stone",
    phEffect: "neutral",
    hardnessEffect: "neutral",
    tannins: "none",
    buoyancy: null,
    spot: "Dark red-black rock, very light for its size and full of tiny pores.",
    tldr: "Lava rock is the dark, lightweight, porous stone you have seen in a hundred tanks, and it earns its place. It is inert, so it does not touch your water, and its open pores make it superb for growing beneficial bacteria and for gluing moss and epiphytes onto. It is cheap and easy to stack. The one downside is that the surface can be sharp, so handle it with care around delicate fish.",
    appearance:
      "Matte dark red to near-black, riddled with tiny gas holes, and surprisingly light. Rough to the touch.",
    water:
      "Inert, no effect on pH or hardness. As a bonus, the huge internal surface area hosts beneficial bacteria, so it doubles as biological media.",
    prep:
      "Rinse thoroughly to clear dust from the pores. It is inert and ready to go once clean.",
    scaping:
      "Great as a hidden base layer to build height cheaply, and excellent for attaching moss, anubias and bucephalandra since roots grip the rough surface. Round off any blade-sharp edges near active fish.",
    faqs: [
      {
        question: "Is lava rock good for aquariums?",
        answer:
          "Yes. It is inert, cheap, light and porous, which makes it great for building up a scape, growing bacteria and attaching plants. Just rinse it well and watch for sharp edges.",
      },
    ],
  },
  {
    slug: "pagoda-stone",
    name: "Pagoda Stone",
    aliases: ["pagoda rock", "calcite stone"],
    category: "stone",
    phEffect: "raises",
    hardnessEffect: "raises",
    tannins: "none",
    buoyancy: null,
    spot: "Layered brown stone with flat stacked tiers, like little pagodas.",
    tldr: "Pagoda stone has a distinctive layered, stacked look, like flat brown tiers piled up. It is mildly calcareous, so it can nudge pH and hardness upward, less aggressively than seiryu but enough to matter in a soft-water tank. In a harder community it is a striking, characterful stone. Test a piece with acid if you are unsure, and rinse the loose sediment out of the layers before it goes in.",
    appearance:
      "Sandy-brown stone with flat horizontal layers and fossil-like lines, stacking into tiered, temple-like shapes.",
    water:
      "Mildly calcareous. It can raise pH and hardness slowly, weaker than seiryu but real, and more noticeable in soft water. Fine for harder-water tanks, less ideal for soft-water shrimp.",
    prep:
      "Rinse well and brush sediment out of the layers, which trap grit. No soaking needed.",
    scaping:
      "The tiered shape suits ledges, steps and stratified rock layouts. Works well where you want strong horizontal lines.",
    faqs: [
      {
        question: "Does pagoda stone raise hardness?",
        answer:
          "Mildly, yes. It is somewhat calcareous, so it lifts pH and hardness slowly, less than seiryu but enough to matter in a soft-water tank. Test with acid if you are unsure.",
      },
    ],
  },
  {
    slug: "petrified-wood",
    name: "Petrified Wood",
    aliases: ["fossil wood stone"],
    category: "stone",
    phEffect: "neutral",
    hardnessEffect: "neutral",
    tannins: "none",
    buoyancy: null,
    spot: "Stone that looks like wood, with grain patterns but rock-hard and heavy.",
    tldr: "Petrified wood is exactly what it sounds like, ancient wood turned to stone, so it carries wood-like grain but behaves like rock. It is inert and heavy, giving you the look of driftwood with none of the tannins, floating or decay. It is a premium hardscape and priced like one, but for a scape where you want wood tones without staining the water, it is unbeatable.",
    appearance:
      "Rock with visible wood grain and bark-like texture, in browns and greys, hard and dense.",
    water:
      "Inert. No tannins, no pH or hardness shift. It gives the wood look while leaving the water completely alone.",
    prep:
      "Rinse and it is ready. No soaking or boiling, since it will not float or leach.",
    scaping:
      "Use it where you want driftwood character in clear water, or to blend a stone-and-wood scape. It sinks straight away, which makes placement easy.",
    faqs: [
      {
        question: "Does petrified wood release tannins?",
        answer:
          "No. It is fully mineralised stone, so it gives you the wood look with none of the tannins, staining or floating that real driftwood brings.",
      },
    ],
  },
  {
    slug: "slate",
    name: "Slate",
    aliases: ["slate rock"],
    category: "stone",
    phEffect: "neutral",
    hardnessEffect: "neutral",
    tannins: "none",
    buoyancy: null,
    spot: "Flat grey layered stone that splits into thin sheets.",
    tldr: "Slate is flat, grey, layered stone that splits into thin sheets, which makes it handy for jobs other rock cannot do. It is inert, so no effect on water, and its flat faces are ideal for ledges, caves, and as a base to glue plants or stack a wall. It is cheap and widely available. Not the most dramatic stone on its own, but a workhorse for structure.",
    appearance:
      "Grey to charcoal flat stone in thin layered slabs, sometimes with rusty streaks.",
    water: "Inert. No change to pH or hardness.",
    prep: "Rinse off dust. Ready to use, it sinks and does not leach.",
    scaping:
      "Perfect for flat ledges, cave roofs, and tiled backgrounds, or as a hidden flat base to seat other stones. Epoxy or superglue holds plants to the smooth faces.",
    faqs: [
      {
        question: "Is slate aquarium safe?",
        answer:
          "Yes, ordinary slate is inert and safe. Rinse it first, and check it does not have metallic ore veins, which are rare but worth a glance.",
      },
    ],
  },
  {
    slug: "texas-holey-rock",
    name: "Texas Holey Rock",
    aliases: ["holey limestone", "honeycomb limestone"],
    category: "stone",
    phEffect: "raises",
    hardnessEffect: "raises",
    tannins: "none",
    buoyancy: null,
    spot: "Pale cream stone full of large smooth holes and tunnels.",
    tldr: "Texas holey rock is pale, cream-coloured limestone riddled with large smooth holes. Because it is limestone, it strongly raises pH and hardness, which is the whole point in the tanks it is made for: African cichlid and hard-water setups that want that buffered, alkaline water. In a soft-water planted or shrimp tank it is the wrong tool, since it pushes chemistry hard in the opposite direction.",
    appearance:
      "Off-white to cream stone with big rounded holes and tunnels bored through it, light and chalky.",
    water:
      "Strongly calcareous. It raises pH and hardness noticeably and buffers the water alkaline, ideal for African cichlids and hard-water tanks, wrong for soft-water scapes.",
    prep: "Scrub and rinse well. No soaking needed.",
    scaping:
      "A staple of African cichlid tanks, where the holes double as territories and hiding spots. Its buffering is a feature there, not a bug.",
    faqs: [
      {
        question: "Does Texas holey rock raise pH?",
        answer:
          "Strongly, yes. It is limestone, so it lifts pH and hardness and holds the water alkaline. That suits African cichlids and hard-water tanks, but not soft-water planted or shrimp setups.",
      },
    ],
  },
  {
    slug: "spider-wood",
    name: "Spider Wood",
    aliases: ["azalea root", "redmoor root"],
    category: "wood",
    phEffect: "lowers",
    hardnessEffect: "neutral",
    tannins: "moderate",
    buoyancy: "soak-first",
    spot: "Fine pale branching root wood that splits into thin twisting fingers.",
    tldr: "Spider wood is the pale, finely branching root wood that fans out into thin twisting fingers, and it is one of the most popular scaping woods for good reason. It creates instant structure and looks fantastic with moss tied along it. Two things to expect: it floats until it waterlogs, so soak it or weigh it down for a week or two, and it grows a white biofilm at first, which is harmless and vanishes once shrimp and otos graze it. It leaches mild tannins that tint the water lightly.",
    appearance:
      "Light tan branching root, thin and twiggy, splitting into fine tips. Reads as delicate, wintry branchwork in a scape.",
    water:
      "Chemically close to inert, but it leaches moderate tannins early on, which tint the water a light tea colour and nudge pH down a touch, more so in soft, low-buffered water. The staining fades over weeks and with water changes.",
    prep:
      "Soak it submerged for one to two weeks, or weigh it down, until it waterlogs and sinks. Boiling speeds this up and cuts the initial tannins. Expect a white biofilm bloom for the first couple of weeks.",
    scaping:
      "Brilliant for branchy, tree-like layouts and for draping moss, bucephalandra and anubias. Glue or tie plants along the branches before it goes in while it is easy to handle.",
    faqs: [
      {
        question: "Why is my spider wood growing white fuzz?",
        answer:
          "That white fuzz is a harmless biofilm that new wood grows as it breaks down at the surface. It clears on its own within a couple of weeks, and shrimp, otocinclus and snails graze it happily.",
      },
      {
        question: "How do I stop spider wood floating?",
        answer:
          "Soak it fully submerged for one to two weeks until it waterlogs, or weigh it down with stone in the meantime. Boiling it first speeds up the soaking and reduces the early tannins.",
      },
    ],
  },
  {
    slug: "manzanita",
    name: "Manzanita Wood",
    aliases: ["manzanita branch"],
    category: "wood",
    phEffect: "lowers",
    hardnessEffect: "neutral",
    tannins: "low",
    buoyancy: "soak-first",
    spot: "Smooth, hard, reddish branching wood with a clean fine taper.",
    tldr: "Manzanita is a premium scaping wood, hard and dense with smooth reddish branches that taper cleanly. Keepers love it because it leaches very little tannin, so the water stays clear, and its fine branching gives elegant tree structures. It needs soaking to sink like most wood, but it barely stains and does not soften or decay for years. If you want branchwork without the tea-coloured water, this is the pick.",
    appearance:
      "Smooth, hard branches in warm reddish-brown, tapering to fine tips. Cleaner and denser than spider wood.",
    water:
      "Very low tannin release, so it keeps the water close to clear with only a faint early tint. Effectively inert on hardness, with a slight pH nudge down at most.",
    prep:
      "Soak to waterlog and sink, which can take a week or two given how dense it is. Little to no boiling needed since it stains so little.",
    scaping:
      "Ideal for clean, elegant branch layouts where you want the wood shape to show without cloudy or stained water. Holds moss and epiphytes well.",
    faqs: [
      {
        question: "Does manzanita wood stain the water?",
        answer:
          "Very little. It is one of the lowest-tannin scaping woods, so the water stays close to clear. That is a big part of why it is prized for competition scapes.",
      },
    ],
  },
  {
    slug: "mopani-wood",
    name: "Mopani Wood",
    aliases: ["African driftwood"],
    category: "wood",
    phEffect: "lowers",
    hardnessEffect: "neutral",
    tannins: "high",
    buoyancy: "sinks",
    spot: "Heavy, dense two-tone wood, dark and light, with a sandblasted look.",
    tldr: "Mopani is heavy, dense two-tone driftwood, often sandblasted into smooth two-colour shapes. It sinks readily, which is convenient, but it releases a lot of tannins, so expect strong tea-coloured water for a while. Boil and soak it hard before it goes in if you want clearer water, or lean into the blackwater look. It is durable and characterful, and the tannins are harmless, even beneficial for soft-water fish.",
    appearance:
      "Dense, chunky wood in contrasting dark and pale tones, often with a smooth sandblasted surface.",
    water:
      "High tannin release. It stains the water a strong tea colour and lowers pH modestly, especially in soft water. The tannins are harmless and even welcomed in blackwater and soft-water tanks. Staining fades over months.",
    prep:
      "Boil it if the piece fits, then soak for one to two weeks, changing the water, to leach out the worst of the tannins before it goes in. It sinks on its own, so no weighing needed.",
    scaping:
      "Suits chunky, bold centrepieces and blackwater biotopes where the tannin tint is part of the look. Its density makes it easy to place since it stays put.",
    faqs: [
      {
        question: "How do I reduce tannins from mopani wood?",
        answer:
          "Boil it if it fits a pot, then soak it for one to two weeks with regular water changes before it goes in the tank. Activated carbon in the filter also pulls out tannins once it is running. Or just enjoy the blackwater tint, it is harmless.",
      },
    ],
  },
  {
    slug: "malaysian-driftwood",
    name: "Malaysian Driftwood",
    aliases: ["Malaysian bogwood"],
    category: "wood",
    phEffect: "lowers",
    hardnessEffect: "neutral",
    tannins: "moderate",
    buoyancy: "sinks",
    spot: "Dense dark brown wood that sinks on its own, gnarled and solid.",
    tldr: "Malaysian driftwood is dense, dark and gnarled, and its big selling point is that it sinks straight away with no soaking needed to keep it down. It leaches a fair amount of tannins early on, tinting the water, which fades with time and water changes. It is a solid, affordable workhorse wood, less delicate than spider wood but great for chunky natural layouts and for wedging into a substrate.",
    appearance:
      "Solid dark brown wood, gnarled and heavy, without the fine branching of spider or manzanita.",
    water:
      "Moderate tannin release, tinting the water and nudging pH down early on, fading over weeks. No meaningful effect on hardness.",
    prep:
      "It sinks on its own, so no waterlogging needed. A soak or boil first reduces the initial tannin tint if you want clearer water sooner.",
    scaping:
      "A dependable choice for natural, chunky layouts and for anchoring into the substrate. Pairs well with anubias and java fern tied into its crevices.",
    faqs: [
      {
        question: "Does Malaysian driftwood need soaking?",
        answer:
          "Not to make it sink, it is dense enough to sink on its own. Soaking or boiling first just reduces the early tannin tint, which is optional depending on whether you want clear or tea-coloured water.",
      },
    ],
  },
  {
    slug: "cholla-wood",
    name: "Cholla Wood",
    aliases: ["cholla cactus wood"],
    category: "wood",
    phEffect: "lowers",
    hardnessEffect: "neutral",
    tannins: "moderate",
    buoyancy: "soak-first",
    spot: "Hollow tube of wood full of natural holes, light and honeycombed.",
    tldr: "Cholla wood is the hollow, honeycombed skeleton of a cactus, and shrimp keepers adore it. As it slowly softens and decays over months it grows the biofilm that shrimp graze constantly, and the holes make perfect hiding and grazing spots for shrimplets. It leaches moderate tannins and needs a soak to sink. It is not a permanent structural piece, since it breaks down, but as a shrimp tank staple it is hard to beat.",
    appearance:
      "Pale hollow tubes riddled with natural holes, light and brittle. Looks like honeycombed driftwood.",
    water:
      "Moderate tannins early on, tinting the water lightly and lowering pH a touch. As it decays it adds a little organic load, so it suits established, well-maintained tanks.",
    prep:
      "Soak it for a few days to a week to sink and to start the biofilm. No boiling needed, and it will break down over months, which is normal.",
    scaping:
      "A shrimp tank favourite for grazing and cover rather than a structural centrepiece. Tie moss around it for an even better shrimp nursery.",
    faqs: [
      {
        question: "Is cholla wood good for shrimp?",
        answer:
          "Very. It grows the biofilm shrimp graze on, and its holes shelter shrimplets. It slowly breaks down over months, which is normal, so treat it as a consumable rather than a permanent piece.",
      },
    ],
  },
];

export function getHardscape(slug: string): HardscapeType | undefined {
  return HARDSCAPE.find((h) => h.slug === slug);
}
