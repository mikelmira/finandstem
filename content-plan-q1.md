# Fin & Stem — Q1 Content Plan: The First 9 Articles

**Sequenced for compounding internal-link equity.** Article 1 sets the compatibility-question pattern. Articles 2–6 each link back to articles already published (so by the time the reader hits Article 9, every paragraph has natural sideways links). Publish in this order.

Each brief is self-contained: a content-research-writer session opens the brief, drafts the article in `src/content/guides/<slug>.mdx`, and ships it.

**House rules (apply to every brief):**
- ≥2 external links to primary or authority sources. Authority allow-list: `fishbase.se`, `gbif.org`, `en.wikipedia.org`, `seriouslyfish.com`, `2hraquarist.com`, `tropica.com`, `iucnredlist.org`, `flowgrow.de`, `aquasabi.com`, `projectpiaba.org`, peer-reviewed papers via `pubmed.ncbi.nlm.nih.gov` or `doi.org`.
- ≥3 internal links per the rules in `seo/internal-linking-rules.md`. Use `<SpeciesCard />` for the highest-relevance catalogue cards inline.
- Every article links **up** to one of the six pillars.
- Every article links **to the compatibility tool** at least once, with the anchor pre-set when relevant.
- Every article has 4+ FAQs in frontmatter so `FAQPage` JSON-LD fires.
- TL;DR 100–150 words at the top, self-contained answer.
- Length target: 800–1,500 words unless noted.
- House style: practical, confident, friendly — Mike's voice. See `skills/content-research-writer/SKILL.md` §"Fin & Stem house style".

---

## Article 1 — Can Neon Tetras Live With Cherry Shrimp?

**Slug:** `can-neon-tetras-live-with-cherry-shrimp`
**Kind:** `compatibility`
**Target query:** `can neon tetras live with cherry shrimp`
**Search intent:** Compatibility / decision-making
**Audience:** Beginner-to-intermediate; already has a planted tank, considering adding the other species
**Pillar:** `/aquarium-fish-guide`
**Length:** 1,000–1,200 words

### TL;DR (150 words)

Adult Neon Tetras (*Paracheirodon innesi*, ~3.5 cm) and adult Red Cherry Shrimp (*Neocaridina davidi*, ~2.5 cm) coexist in a planted tank without predation. The pairing fails for one specific reason: newly hatched shrimplets are within Neon Tetra prey size and get eaten if there's nowhere to hide. If you don't care about a growing shrimp colony, it's a good combination — both species enjoy soft, slightly acidic, warm water with dense planting. If you want shrimp to breed, you need thick moss cover (Java Moss is the classic choice) for the shrimplets to mature in, or you swap the Neons for a less predatory fish like Otocinclus. Stocking ratio matters too: keep Neon density low and shrimp density high if you want both populations to thrive.

### Outline

1. **The short answer** — yes for adults, no for shrimplet survival without cover
2. **What the science says** — Neon prey size from FishBase data; Neocaridina breeding cycle
3. **What I've observed in my tank** — Mike's first-hand observation (placeholder until kept-status confirmed)
4. **The shrimplet survival trick** — moss density, lighting, low-flow refugia
5. **Better fish for a breeding shrimp colony** — link to Otocinclus, Pygmy Corydoras, Sparkling Gourami
6. **Stocking ratios that work** — concrete numbers per tank size
7. **What about other tetras?** — Cardinal, Ember, Chili — same logic, different sizes
8. **FAQ**

### External links (≥2 required)

- **FishBase — *Paracheirodon innesi*** → https://www.fishbase.se/summary/Paracheirodon-innesi (cited for adult size + diet)
- **FishBase — *Neocaridina davidi*** → https://www.fishbase.se/summary/Neocaridina-davidi (cited for adult shrimp size + breeding)
- **Wikipedia — Neon tetra** → https://en.wikipedia.org/wiki/Neon_tetra (cited for native range + behaviour)
- **2HR Aquarist — shrimp keeping basics** → https://www.2hraquarist.com/blogs/freshwater-aquarium-shrimps-guide (cited for biotope rationale)

### Internal links

- **Pillar:** `<PillarLink href="/aquarium-fish-guide">complete guide to aquarium fish</PillarLink>`
- **Catalogue:**
  - `<SpeciesCard slug="neon-tetra" />`
  - `<SpeciesCard slug="cherry-shrimp" />`
  - `<SpeciesCard slug="java-moss" />` (the moss-cover recommendation)
  - `<SpeciesCard slug="otocinclus" />` (the better alternative)
  - `<SpeciesCard slug="pygmy-corydoras" />` (another safer option)
  - `<SpeciesCard slug="ember-tetra" />` (the next-question fish)
- **Tool:** `/compatibility?anchor=fish:neon-tetra` ("Find every species compatible with Neon Tetra")
- **Other guide (forward-link placeholder):** `/guides/best-fish-for-30-litre-planted-tank` (Article 3)

### FAQs (frontmatter)

1. Will Neon Tetras eat baby shrimp? (Yes — describe size threshold)
2. How many Neons can I keep with shrimp in a 40 L tank?
3. Do shrimp do better with Otocinclus or Neon Tetras?
4. What moss is best for hiding baby shrimp?

---

## Article 2 — Neon Tetra vs Cardinal Tetra: The Real Differences

**Slug:** `neon-tetra-vs-cardinal-tetra`
**Kind:** `comparison`
**Target query:** `neon tetra vs cardinal tetra`
**Search intent:** Comparison / decision
**Audience:** Beginner buyers picking between the two
**Pillar:** `/aquarium-fish-guide`
**Length:** 900–1,100 words

### TL;DR (140 words)

Neon Tetras (*Paracheirodon innesi*) and Cardinal Tetras (*Paracheirodon axelrodi*) look alike at a glance — small blue-and-red schooling fish — but the visual tell is the red stripe: the Neon's red runs from mid-body to tail only; the Cardinal's red runs the full length from snout to tail. Cardinals are slightly larger (4–5 cm vs 3.5–4 cm), prefer warmer, softer, more acidic water (the wild Rio Negro is pH 4.5), and are more demanding to keep long-term. Neons are hardier, cheaper, and bred globally; Cardinals are still largely wild-caught from sustainable Project Piaba operations in Brazil. Pick Neons for a first community tank; pick Cardinals for a dedicated soft-water blackwater scape where their colour will pop against tannins and dark wood.

### Outline

1. **The short answer** — visual difference + which to pick when
2. **Side-by-side comparison table** — size, water params, lifespan, price, source
3. **Visual telling them apart** — the red-stripe trick + photos
4. **Water parameter differences** — Neons tolerate harder water; Cardinals need soft/acidic
5. **Which is hardier? Which lives longer?** — honest data
6. **Wild vs farmed sourcing** — Project Piaba context for Cardinals
7. **Best tank scape for each**
8. **Can they live together?** — yes, with caveats on parameters
9. **FAQ**

### External links

- **FishBase — Neon Tetra** → https://www.fishbase.se/summary/Paracheirodon-innesi
- **FishBase — Cardinal Tetra** → https://www.fishbase.se/summary/Paracheirodon-axelrodi
- **Project Piaba** (sustainable wild Cardinal harvest) → https://www.projectpiaba.org/
- **Seriously Fish — Cardinal Tetra** → https://www.seriouslyfish.com/species/paracheirodon-axelrodi/

### Internal links

- **Pillar:** `/aquarium-fish-guide`
- **Catalogue:**
  - `<SpeciesCard slug="neon-tetra" />`
  - `<SpeciesCard slug="cardinal-tetra" />`
  - `<SpeciesCard slug="ember-tetra" />` (the third popular option)
  - `<SpeciesCard slug="rotala-rotundifolia" />` (good plant pairing for both)
- **Tool:** `/compare?species=fish:neon-tetra,fish:cardinal-tetra` (drops directly into the Compare tool with both pre-loaded)
- **Other guides:**
  - `/guides/can-neon-tetras-live-with-cherry-shrimp` (Article 1)
  - `/guides/best-fish-for-30-litre-planted-tank` (Article 3, forward)

### FAQs

1. How do you tell a Neon Tetra from a Cardinal Tetra?
2. Are Cardinal Tetras harder to keep than Neon Tetras?
3. Can Neon and Cardinal Tetras school together?
4. Which is more colourful?
5. Why are Cardinals more expensive?

---

## Article 3 — Best Fish for a 30 Litre Planted Tank

**Slug:** `best-fish-for-30-litre-planted-tank`
**Kind:** `list`
**Target query:** `best fish for 30 litre planted tank` (and variants: "30L nano fish", "best fish for 8 gallon planted tank")
**Search intent:** Buying decision / shortlist
**Audience:** Beginner setting up a nano tank
**Pillar:** `/aquarium-fish-guide`
**Length:** 1,200–1,500 words

### TL;DR (150 words)

A 30-litre planted tank is a nano — you have one fish slot, not several. The best fit is a single small schooling species kept in numbers (6–10+), not a mixed community. Top picks: Chili Rasbora (*Boraras brigittae*, 1.7 cm, blackwater) for the most species-appropriate match; Ember Tetra (*Hyphessobrycon amandae*, 2 cm) for the most beginner-friendly colour pop; Celestial Pearl Danio (*Danio margaritatus*, 2.5 cm) for cooler water and males-displaying interest; Pygmy Corydoras (*Corydoras pygmaeus*, 2.5 cm) for the rare mid-water school-of-corys behaviour. Avoid Neon Tetras here — they need 60 L minimum to school properly. The other half of the stocking is invertebrate: a colony of 10+ Cherry Shrimp coexists with any of the above (with shrimplet caveats from Article 1).

### Outline

1. **The short answer** — one species, kept in numbers, plus shrimp
2. **Why 30 L is one-school territory** — bioload math + footprint reality
3. **My top 4 picks** — Chili Rasbora, Ember Tetra, CPD, Pygmy Cory — each with `<SpeciesCard />` and why-this-fits paragraph
4. **The shrimp partner** — Cherry Shrimp colony alongside any of the four
5. **Plant pairings** — Java Moss, Anubias Nana, Cryptocoryne Wendtii for nano scapes
6. **What NOT to put in a 30 L** — Neon Tetras, Cardinal Tetras, Bettas in a community (controversial — explain), Goldfish (always)
7. **Sample stockings** — three concrete builds with quantities and cost estimates
8. **Where to go next** — link to planner tool with 30L pre-loaded
9. **FAQ**

### External links

- **FishBase — *Boraras brigittae*** → https://www.fishbase.se/summary/Boraras-brigittae
- **Seriously Fish — Celestial Pearl Danio** → https://www.seriouslyfish.com/species/danio-margaritatus/
- **2HR Aquarist — nano tank lighting** → https://www.2hraquarist.com/blogs/freshwater-aquarium-plants-guide

### Internal links

- **Pillar:** `/aquarium-fish-guide`
- **Catalogue (heavy):**
  - `<SpeciesCard slug="chili-rasbora" />`
  - `<SpeciesCard slug="ember-tetra" />`
  - `<SpeciesCard slug="celestial-pearl-danio" />`
  - `<SpeciesCard slug="pygmy-corydoras" />`
  - `<SpeciesCard slug="cherry-shrimp" />`
  - `<SpeciesCard slug="java-moss" />`
  - `<SpeciesCard slug="anubias-nana" />`
  - `<SpeciesCard slug="cryptocoryne-wendtii" />`
- **Tools:**
  - `/planner?tankL=30` (drops user into planner pre-set)
  - `/compatibility?anchor=fish:ember-tetra`
- **Other guides:**
  - `/guides/can-neon-tetras-live-with-cherry-shrimp` (Article 1)
  - `/guides/neon-tetra-vs-cardinal-tetra` (Article 2)
  - `/guides/how-many-ember-tetras-should-you-keep-together` (Article 7, forward)
  - `/guides/low-light-aquarium-plants-no-co2` (Article 8, forward)

### FAQs

1. Can I put Neon Tetras in a 30 L tank?
2. How many Ember Tetras in a 30 litre tank?
3. Can I mix two species of nano fish in 30 L?
4. Will Cherry Shrimp breed with Ember Tetras?
5. Do I need CO₂ for a 30 L planted tank?

---

## Article 4 — Java Moss vs Christmas Moss: Which to Choose

**Slug:** `java-moss-vs-christmas-moss`
**Kind:** `comparison`
**Target query:** `java moss vs christmas moss`
**Search intent:** Comparison / decision
**Audience:** Aquascaper choosing a moss for hardscape attachment
**Pillar:** `/aquatic-moss-guide`
**Length:** 900–1,000 words

### TL;DR (140 words)

Java Moss (*Taxiphyllum barbieri*) and Christmas Moss (*Vesicularia montagnei*) are the two most-asked-about aquarium mosses, and they look similar at a glance. The defining difference is structure: Christmas Moss grows in a distinctive triangular fan pattern reminiscent of a fir tree branch; Java Moss is shaggier and stringier. Christmas Moss is tidier and more ornamental but needs slightly more light and CO₂ to keep its fan pattern; Java Moss tolerates almost anything but goes ragged if left untrimmed. For shrimp-tank nurseries, pick Java — its mess traps biofilm. For an ornamental scape with tied-down moss trees or stone accents, pick Christmas. Cost is similar; both attach to wood or stone via cotton thread or glue and don't need substrate.

### Outline

1. **The short answer** — Christmas for ornamentation, Java for utility
2. **The visual difference** — frond pattern, side-by-side
3. **Care requirement comparison table** — light, CO₂, growth rate, water params, attachment
4. **Trimming difference** — Java tolerates neglect; Christmas needs flat trimming to keep fans
5. **Best use cases** — moss tree (Christmas), shrimp nursery (Java), wall (either), carpet (Java)
6. **Cousins worth knowing** — Flame Moss, Weeping Moss, Mini Christmas
7. **How to attach moss to wood and stone**
8. **FAQ**

### External links

- **Flowgrow — *Taxiphyllum barbieri*** → https://www.flowgrow.de/db/aquaticplants/taxiphyllum-barbieri
- **Flowgrow — *Vesicularia montagnei*** → https://www.flowgrow.de/db/aquaticplants/vesicularia-montagnei
- **Wikipedia — Java moss** → https://en.wikipedia.org/wiki/Java_moss

### Internal links

- **Pillar:** `/aquatic-moss-guide`
- **Catalogue:**
  - `<SpeciesCard slug="java-moss" />`
  - `<SpeciesCard slug="christmas-moss" />`
  - `<SpeciesCard slug="flame-moss" />`
  - `<SpeciesCard slug="weeping-moss" />`
  - `<SpeciesCard slug="mini-christmas-moss" />`
  - `<SpeciesCard slug="cherry-shrimp" />` (in the shrimp-nursery context)
- **Tool:** `/compare?species=mosses:java-moss,mosses:christmas-moss`
- **Other guides:**
  - `/guides/can-neon-tetras-live-with-cherry-shrimp` (Article 1 — moss-cover recommendation)
  - `/guides/best-fish-for-30-litre-planted-tank` (Article 3)

### FAQs

1. Which moss is easier — Java or Christmas?
2. Can you grow Christmas Moss without CO₂?
3. How do you attach moss to driftwood?
4. Will moss grow on aquarium glass?
5. Do shrimp prefer Java Moss or Christmas Moss?

---

## Article 5 — Neocaridina vs Caridina Shrimp: Which Should You Start With?

**Slug:** `neocaridina-vs-caridina-shrimp`
**Kind:** `comparison`
**Target query:** `neocaridina vs caridina`
**Search intent:** Buying decision (which kind of shrimp to keep)
**Audience:** Beginner-to-intermediate shrimp keeper
**Pillar:** `/freshwater-shrimp-guide`
**Length:** 1,100–1,300 words

### TL;DR (150 words)

The two genera of dwarf freshwater shrimp dominate the hobby. *Neocaridina davidi* — Cherry Shrimp, Blue Dream, Yellow, Snowball — tolerates a wide pH range (6.5–8.0), hard tap water, and forgiving parameter swings. *Caridina cantonensis* — Crystal Red, Bee, Blue Bolt, Taiwan Bee morphs — demands soft, acidic, low-TDS water (pH 5.8–6.8, KH near zero) sustained by an active soil substrate like ADA Amazonia. For a first shrimp tank, start with Neocaridina (specifically Red Cherries) — they breed in plain dechlorinated tap water and the colour pops against any substrate. Move to Caridina only once you've kept a stable Neocaridina colony for at least six months and want to invest in RO water plus remineraliser. Both genera have wild lineages but live exclusively as captive-bred colour lines in the hobby today.

### Outline

1. **The short answer** — Neo for beginners, Caridina for committed keepers
2. **Genus comparison table** — origin, water params, substrate, equipment cost, lifespan, ease
3. **Why water chemistry diverges** — soft-water rheophilic vs harder-water generalist
4. **The Neocaridina colour spectrum** — Cherry, Blue Dream, Yellow, Snowball, Painted Fire Red
5. **The Caridina colour spectrum** — CRS grades, Bee, Blue Bolt, Taiwan Bee morphs
6. **First-tank setup for Neocaridina** — equipment, substrate, cycle time
7. **First-tank setup for Caridina** — RO + remineraliser, active soil, sponge filter
8. **What I started with and why** — Mike's first-hand note (placeholder)
9. **Can they live together?** — no, parameter mismatch
10. **FAQ**

### External links

- **GBIF — *Neocaridina davidi*** → https://www.gbif.org/species/2225929 (cited for taxonomy / distribution)
- **GBIF — *Caridina cantonensis*** → https://www.gbif.org/species/2225751
- **2HR Aquarist — shrimp keeping basics** → https://www.2hraquarist.com/blogs/freshwater-aquarium-shrimps-guide
- **Wikipedia — *Neocaridina davidi*** → https://en.wikipedia.org/wiki/Neocaridina_davidi

### Internal links

- **Pillar:** `/freshwater-shrimp-guide`
- **Catalogue (heavy):**
  - `<SpeciesCard slug="cherry-shrimp" />`
  - `<SpeciesCard slug="blue-dream-shrimp" />`
  - `<SpeciesCard slug="yellow-shrimp" />`
  - `<SpeciesCard slug="snowball-shrimp" />`
  - `<SpeciesCard slug="crystal-red-shrimp" />`
  - `<SpeciesCard slug="bee-shrimp" />`
  - `<SpeciesCard slug="blue-bolt-shrimp" />`
  - `<SpeciesCard slug="amano-shrimp" />` (the third option — neither genus)
- **Tools:**
  - `/compare?species=shrimp:cherry-shrimp,shrimp:crystal-red-shrimp`
  - `/compatibility?anchor=shrimp:cherry-shrimp`
- **Other guides:**
  - `/guides/can-neon-tetras-live-with-cherry-shrimp` (Article 1)
  - `/guides/java-moss-vs-christmas-moss` (Article 4 — moss cover for shrimp)

### FAQs

1. Are Neocaridina or Caridina shrimp easier?
2. Can you keep Neocaridina and Caridina shrimp together?
3. Do Caridina shrimp need RO water?
4. What's the cheapest shrimp to start with?
5. Will Cherry Shrimp and Crystal Red Shrimp interbreed?

---

## Article 6 — Do Otocinclus Really Eat Algae? What to Know Before You Buy

**Slug:** `do-otocinclus-eat-algae`
**Kind:** `faq` (with strong misconception-correcting angle)
**Target query:** `do otocinclus eat algae`
**Search intent:** Buying research / dispelling myth
**Audience:** Beginner with an algae problem considering Otos
**Pillar:** `/aquarium-fish-guide`
**Length:** 800–1,000 words

### TL;DR (150 words)

Otocinclus eat *diatoms* — soft brown algae and biofilm — not the algae most aquarists actually want gone. They will not touch hair algae, black beard algae, green spot algae, or cyanobacteria. They starve in a clean, newly-cycled tank because there's no biofilm yet to graze on. If you're buying Otos to fix an algae problem in a 2-month-old tank: don't. Buy them after 3 months of tank maturity, in groups of 6+, only when soft brown film is visible on glass and leaves. Even then, supplement with Repashy Soilent Green and blanched zucchini — they need calories beyond what algae alone provides. Otocinclus are excellent peaceful tankmates for shrimp and small fish, but they're a maintenance tool, not an algae solution. The actual fix for a hair algae or BBA outbreak is light and CO₂ balance, not a hungry catfish.

### Outline

1. **The short answer** — they eat the right algae at the wrong time
2. **The algae types Otos eat** — diatoms, biofilm — photo identification
3. **The algae types Otos DON'T eat** — hair algae, BBA, GSA, cyano — with photos
4. **Why Otos starve in new tanks** — biofilm cycle math
5. **When to actually buy them** — 3-month-old planted tank minimum
6. **How many to buy** — group dynamics; 6+ recommended
7. **Supplementing their diet** — Repashy, zucchini, blanched veg
8. **Better algae solutions for common problems** — Amano Shrimp for hair algae, parameter fix for BBA, link to a future algae-diagnosis pillar section
9. **Mike's tank notes** (first-hand placeholder)
10. **FAQ**

### External links

- **Seriously Fish — *Otocinclus vittatus*** → https://www.seriouslyfish.com/species/otocinclus-vittatus/
- **FishBase — *Otocinclus vittatus*** → https://www.fishbase.se/summary/Otocinclus-vittatus
- **2HR Aquarist — algae diagnosis** → https://www.2hraquarist.com/blogs/algae-control

### Internal links

- **Pillar:** `/aquarium-fish-guide`
- **Catalogue:**
  - `<SpeciesCard slug="otocinclus" />`
  - `<SpeciesCard slug="amano-shrimp" />` (the actual hair-algae crew)
  - `<SpeciesCard slug="cherry-shrimp" />` (the biofilm crew alongside Otos)
  - `<SpeciesCard slug="pygmy-corydoras" />` (good Oto tankmate)
- **Tool:** `/compatibility?anchor=fish:otocinclus`
- **Other guides:**
  - `/guides/best-fish-for-30-litre-planted-tank` (Article 3 — Otos as nano stocking option)
  - `/guides/stocking-a-60-litre-community-planted-tank` (Article 9, forward — Otos in community)

### FAQs

1. Will Otocinclus eat hair algae?
2. How long should a tank be set up before adding Otocinclus?
3. How many Otocinclus per tank?
4. Do Otocinclus need to be fed anything besides algae?
5. Are Otocinclus and Cherry Shrimp safe together?

---

## Article 7 — How Many Ember Tetras Should You Keep Together?

**Slug:** `how-many-ember-tetras-to-keep-together`
**Kind:** `faq`
**Target query:** `how many ember tetras together`
**Search intent:** Specific stocking question
**Audience:** Beginner buying Embers
**Pillar:** `/aquarium-fish-guide`
**Length:** 800–950 words

### TL;DR (140 words)

Ember Tetras (*Hyphessobrycon amandae*) are obligate schoolers. The bare minimum is 6; the visual sweet spot is 10–15; in a 40 L+ planted tank, 20+ becomes a fully natural shoal that displays the species' colour and behaviour. Below 6, Embers stress, lose colour, hide constantly, and become disease-prone. The 2 cm adult size means even a 30 L nano comfortably holds 10 fish — bioload is low. Females are noticeably plumper than the slimmer, more orange males; in a school of 10+ you'll see natural pair-formation behaviour and occasional spawning if the tank is mature and lightly stocked. Keep them in groups, not pairs.

### Outline

1. **The short answer** — minimum 6, ideal 10–15
2. **Why 6 is the absolute floor** — schooling stress signals
3. **What 10–15 looks like in a real tank** — behavioural transformation
4. **How tank size scales the recommendation** — 30 L vs 60 L vs 100 L
5. **Sexing Ember Tetras** — male vs female visual differences
6. **Tank mates for an Ember school** — Pygmy Corydoras, Cherry Shrimp, Otocinclus
7. **What goes wrong if you keep too few** — diseases, colour loss, early death
8. **FAQ**

### External links

- **FishBase — *Hyphessobrycon amandae*** → https://www.fishbase.se/summary/Hyphessobrycon-amandae
- **Seriously Fish — Ember Tetra** → https://www.seriouslyfish.com/species/hyphessobrycon-amandae/
- **Aquarium Co-Op — Ember Tetra care** → https://www.aquariumcoop.com/blogs/aquarium/ember-tetra

### Internal links

- **Pillar:** `/aquarium-fish-guide`
- **Catalogue:**
  - `<SpeciesCard slug="ember-tetra" />`
  - `<SpeciesCard slug="pygmy-corydoras" />`
  - `<SpeciesCard slug="otocinclus" />`
  - `<SpeciesCard slug="cherry-shrimp" />`
- **Tools:**
  - `/compatibility?anchor=fish:ember-tetra`
  - `/planner?species=fish:ember-tetra`
- **Other guides:**
  - `/guides/best-fish-for-30-litre-planted-tank` (Article 3)
  - `/guides/neon-tetra-vs-cardinal-tetra` (Article 2 — for the third-option comparison)
  - `/guides/can-neon-tetras-live-with-cherry-shrimp` (Article 1)

### FAQs

1. Can I keep just 4 Ember Tetras?
2. How many Ember Tetras in a 20 L tank?
3. Do Ember Tetras school with other tetras?
4. How do you tell male Ember Tetras from female?
5. Are Ember Tetras good beginner fish?

---

## Article 8 — Low-Light Aquarium Plants That Don't Need CO₂

**Slug:** `low-light-aquarium-plants-no-co2`
**Kind:** `list`
**Target query:** `low light aquarium plants no co2`
**Search intent:** Buying / shortlist
**Audience:** Beginner with a low-tech tank
**Pillar:** `/planted-tank-guide`
**Length:** 1,200–1,500 words

### TL;DR (150 words)

A planted aquarium without CO₂ injection — a "low-tech" or "Walstad-style" tank — works beautifully with the right plants. The selection rules: pick rhizome epiphytes (Anubias, Java Fern, Bucephalandra), rosette plants (Cryptocoryne species), and hardy stem plants (Hygrophila polysperma, Rotala) that adapt to whatever conditions arrive. Avoid demanding carpet plants like Hemianthus callitrichoides — they melt without CO₂. Avoid red colour-line stems — they stay green without strong light and pressurised CO₂. The trade-off is growth speed, not survival: a low-tech tank trims monthly rather than weekly and reaches "filled in" at 6 months rather than 6 weeks. Lighting target: 30 PAR at substrate for 6–8 hours per day. Substrate: any inert sand or gravel with root tabs for the rosette plants.

### Outline

1. **The short answer** — pick from rhizome + rosette + hardy stems
2. **What "low light, no CO₂" actually means** — PAR and photoperiod
3. **Top 6 plants for low-tech tanks** — Java Fern, Anubias Nana, Cryptocoryne Wendtii, Vallisneria, Hygrophila Polysperma, Bucephalandra — each with `<SpeciesCard />` and a paragraph
4. **The mosses worth growing** — Java Moss, Christmas Moss (less ornamental without CO₂)
5. **What NOT to attempt** — Monte Carlo, HC Cuba, Rotala in red, Dwarf Hairgrass without CO₂
6. **Substrate options for a low-tech tank**
7. **Lighting recommendations** — sensible nano lights and photoperiod
8. **A complete low-tech 60 L stocking** — Mike's preferred starter setup
9. **FAQ**

### External links

- **Tropica — low-light plants list** → https://tropica.com/en/plants/easy/ (cited as a comprehensive low-tech plant filter)
- **Flowgrow — *Anubias barteri var. nana*** → https://www.flowgrow.de/db/aquaticplants/anubias-barteri-var-nana
- **2HR Aquarist — low-tech tank methodology** → https://www.2hraquarist.com/blogs/freshwater-aquarium-plants-guide

### Internal links

- **Pillar:** `/planted-tank-guide`
- **Catalogue (heavy):**
  - `<SpeciesCard slug="anubias-nana" />`
  - `<SpeciesCard slug="java-fern" />`
  - `<SpeciesCard slug="cryptocoryne-wendtii" />`
  - `<SpeciesCard slug="vallisneria-spiralis" />`
  - `<SpeciesCard slug="hygrophila-polysperma" />`
  - `<SpeciesCard slug="bucephalandra" />`
  - `<SpeciesCard slug="java-moss" />`
  - `<SpeciesCard slug="christmas-moss" />`
- **Tool:** `/plants?co2=none,optional&light=low,medium` (drops user into filtered catalogue)
- **Other guides:**
  - `/guides/best-fish-for-30-litre-planted-tank` (Article 3)
  - `/guides/java-moss-vs-christmas-moss` (Article 4)
  - `/guides/stocking-a-60-litre-community-planted-tank` (Article 9, forward)

### FAQs

1. Can you grow plants in an aquarium without CO₂?
2. What's the easiest aquarium plant for beginners?
3. Do low-tech tanks need root tabs?
4. How long should aquarium lights be on for low-tech plants?
5. Can a low-tech tank look as good as a high-tech one?

---

## Article 9 — Stocking a 60 Litre Community Planted Tank

**Slug:** `stocking-a-60-litre-community-planted-tank`
**Kind:** `setup`
**Target query:** `60 litre community tank stocking` (and "15 gallon community tank")
**Search intent:** Setup planning / complete stocking
**Audience:** Beginner-to-intermediate setting up their first proper community
**Pillar:** `/aquarium-fish-guide`
**Length:** 1,400–1,800 words

### TL;DR (150 words)

A 60-litre tank is the sweet spot where you stop being a nano keeper and start being a real community aquarist — small enough to maintain in 20 minutes a week, large enough to keep multiple species without bioload stress. The classic three-layer community: a top-water schooling species (Ember Tetras or Harlequin Rasboras, 8–10 fish), a centrepiece group like Sparkling Gouramis (3 fish) or Otocinclus (6 fish), a bottom-dwelling cory school (6 Pygmy Corydoras), and a Cherry Shrimp colony (10+) to graze. Total: ~30 fish + shrimp in 60 L. Plant heavily — Anubias and Java Fern on hardscape, Cryptocoryne Wendtii in the midground, Vallisneria for the back wall. Soft-to-moderate water (pH 6.5–7.5, dGH 4–10), 24–26 °C, sponge filter or gentle canister. Total setup cost ~$200–350.

### Outline

1. **The short answer** — three species + shrimp, planted heavily
2. **Why 60 L is the sweet spot** — bioload math + maintenance time
3. **The three-layer stocking model** — top, mid, bottom water column thinking
4. **My recommended community** — full stocking list with `<SpeciesCard />` for each
   - Top: Ember Tetras x 10
   - Mid: Sparkling Gouramis x 3
   - Bottom: Pygmy Corydoras x 6
   - Crew: Cherry Shrimp x 10+
5. **The plant scape** — what to put where, with `<SpeciesCard />` for each plant
6. **Equipment basics** — filter, light, heater, what NOT to buy
7. **Water parameter targets** — common middle-ground for the species combo
8. **The 6-week setup timeline** — week 1 hardscape, week 2 plants, week 4 cycle, week 6 fish
9. **Where to go next** — link to planner with 60 L preset
10. **FAQ**

### External links

- **FishBase — *Trichopsis pumila*** (Sparkling Gourami) → https://www.fishbase.se/summary/Trichopsis-pumila
- **FishBase — *Corydoras pygmaeus*** → https://www.fishbase.se/summary/Corydoras-pygmaeus
- **Seriously Fish — Harlequin Rasbora** → https://www.seriouslyfish.com/species/trigonostigma-heteromorpha/
- **2HR Aquarist — community-tank stocking** → https://www.2hraquarist.com/blogs/aquarium-fish-guide

### Internal links

- **Pillar:** `/aquarium-fish-guide`
- **Catalogue (very heavy — this is a stocking guide):**
  - `<SpeciesCard slug="ember-tetra" />`
  - `<SpeciesCard slug="harlequin-rasbora" />` (top-water alternative)
  - `<SpeciesCard slug="sparkling-gourami" />`
  - `<SpeciesCard slug="pygmy-corydoras" />`
  - `<SpeciesCard slug="otocinclus" />` (centrepiece alternative)
  - `<SpeciesCard slug="cherry-shrimp" />`
  - `<SpeciesCard slug="anubias-nana" />`
  - `<SpeciesCard slug="java-fern" />`
  - `<SpeciesCard slug="cryptocoryne-wendtii" />`
  - `<SpeciesCard slug="vallisneria-spiralis" />`
  - `<SpeciesCard slug="java-moss" />`
- **Tools:**
  - `/planner?tankL=60`
  - `/compatibility?anchor=fish:ember-tetra`
- **Other guides (every previous one in this plan):**
  - `/guides/best-fish-for-30-litre-planted-tank` (Article 3 — for nano alternative)
  - `/guides/can-neon-tetras-live-with-cherry-shrimp` (Article 1)
  - `/guides/how-many-ember-tetras-to-keep-together` (Article 7)
  - `/guides/low-light-aquarium-plants-no-co2` (Article 8)
  - `/guides/do-otocinclus-eat-algae` (Article 6)
  - `/guides/neocaridina-vs-caridina-shrimp` (Article 5)
  - `/guides/java-moss-vs-christmas-moss` (Article 4)
  - `/guides/neon-tetra-vs-cardinal-tetra` (Article 2)

### FAQs

1. How many fish can I put in a 60 litre planted tank?
2. Do I need CO₂ for a 60 L community planted tank?
3. Can I have Neon Tetras AND Cherry Shrimp in 60 L?
4. What size filter for a 60 litre tank?
5. How long does it take to cycle a 60 L tank with plants?
6. What's the easiest community to start with?

---

## Publishing cadence

| Week | Articles to ship |
|---|---|
| 1 | 1 — Neon Tetras + Cherry Shrimp |
| 2 | 2 — Neon vs Cardinal |
| 3 | 3 — Best Fish for 30 L |
| 4 | 4 — Java Moss vs Christmas Moss |
| 5 | 5 — Neocaridina vs Caridina |
| 6 | 6 — Do Otocinclus Eat Algae |
| 7 | 7 — How Many Ember Tetras |
| 8 | 8 — Low-Light Plants No CO₂ |
| 9 | 9 — Stocking 60 L Community |

One per week is the realistic cadence with the content-research-writer skill. If Mike has more capacity, double up to two per week — articles 4 (moss vs moss) and 7 (Ember Tetras count) are the shortest and easiest to draft alongside another.

## Why this sequence

- **Article 1 establishes the compatibility-question pattern** — every subsequent article can link back to it as the canonical answer for "do X and Y coexist".
- **Articles 2 and 4 are species-vs-species comparisons** — the lowest-competition, highest-conversion query type.
- **Article 3 is the tank-size stocking guide** — the natural hub for nano-fish queries; links naturally to every fish article.
- **Article 5 (Neocaridina vs Caridina) is the shrimp-pillar anchor** — every future shrimp article references it.
- **Article 6 corrects a popular misconception** — these articles outperform on AI Overviews because they directly answer a misunderstood question.
- **Article 7 is a single-species deep-FAQ** — establishes the pattern for the next 20 species-specific FAQ articles you'll write.
- **Article 8 is the plant-side equivalent of Article 3** — anchors plant queries.
- **Article 9 is the community-tank capstone** — pulls in every previous article as a sideways link. By the time it ships, the internal link graph is mature.

## Distribution checklist (per article)

For every article after publication:

- [ ] Submit URL to Google Search Console "Request Indexing"
- [ ] Submit URL to Bing Webmaster Tools "Submit URL"
- [ ] Post once to r/Aquascape OR r/PlantedTank OR r/shrimptank (rotate; don't spam) — lead with the question, link only if discussion warrants
- [ ] Email link to one aquascaping creator who has covered the topic (start a citation conversation)
- [ ] Cross-link from any earlier article that mentioned this topic
- [ ] Add to newsletter when 3+ articles are ready to feature in one issue

## Sources reference

Common external sources used across multiple articles (so you don't re-research each time):

| Source | URL pattern | Best for |
|---|---|---|
| FishBase | `https://www.fishbase.se/summary/Genus-species` | Fish biology, size, distribution, diet |
| GBIF | `https://www.gbif.org/species/` | Species taxonomy, occurrences |
| Wikipedia | `https://en.wikipedia.org/wiki/Common_name` | Taxonomy, history, naming etymology |
| Seriously Fish | `https://www.seriouslyfish.com/species/genus-species/` | Detailed fish profiles, behaviour, breeding |
| Flowgrow | `https://www.flowgrow.de/db/aquaticplants/scientific-name` | Plant care, parameters, growth rate |
| Tropica | `https://tropica.com/en/plants/` | Plant catalogue, difficulty filtering |
| 2HR Aquarist | `https://www.2hraquarist.com/blogs/` | Planted-tank methodology, dosing, algae |
| Aquasabi Wiki | `https://www.aquasabi.com/aquascaping-wiki_` | Aquascape design principles |
| Project Piaba | `https://www.projectpiaba.org/` | Cardinal Tetra sustainable harvest |
| IUCN Red List | `https://www.iucnredlist.org/` | Conservation status |
| Aquarium Co-Op | `https://www.aquariumcoop.com/blogs/aquarium/` | Practical keeping experience |

All eleven of these are on the authority allow-list in `src/components/mdx/external-link.tsx` — links to them won't get `rel="nofollow"`.

---

*Updated: May 26, 2026. Maintained by Mike. Use with `skills/content-research-writer/SKILL.md`.*
