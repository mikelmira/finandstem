# Substrate Profiles + Compare Page Implementation Prompt

This file is one of the longest single artefacts in the project. It contains two halves:

1. **Substrate profiles** (the data source). Fifteen in-depth substrate and aquasoil profiles plus two additive profiles, each with the structured fields needed for a catalogue entry and the long-form prose for a detail page. Use these as the raw material for `src/data/substrates.ts` and the individual detail pages.

2. **Claude Code implementation prompt** (the build instructions). The full session brief at the bottom of this file, designed to be pasted into Claude Code at the repo root. It adds the substrate collection, the listing and detail pages, integrates substrates into the compare tool with mutual exclusivity against livestock, and explicitly excludes substrates from the planner and compatibility tools.

The substrate data here is built around the four product types that matter in planted aquariums in 2026: active aquasoils, inert nutrient-enriched substrates, inert sand and gravel, and additives/base layers.

---

# Part 1: Substrate profiles

## How substrates differ

Three properties decide how a substrate behaves in a planted tank.

**pH and KH effect.** Active aquasoils contain volcanic clays and organic acids that pull minerals out of the water column. They lower pH (typically to the 5.8 to 6.5 range) and lower carbonate hardness (KH) toward zero. Inert substrates do not change water chemistry. A third group of substrates is alkaline (crushed coral, aragonite) and raises pH and KH, but those are not used in planted freshwater tanks and are excluded from this profile set.

**Ammonia release.** Active aquasoils leach ammonia for the first two to six weeks of a new setup. The release feeds plant growth heavily during establishment but means fish and shrimp cannot go in until the cycle completes. Inert substrates release no ammonia.

**Buffering longevity.** Active aquasoils exhaust their pH and KH-lowering capacity over 12 to 24 months in tap-water tanks. RO water with remineraliser extends this window because there is no incoming KH to neutralise. Inert substrates have no buffering capacity at all and never exhaust.

Choosing the right substrate is the most consequential single decision in a planted tank build. The substrate dictates which fish and shrimp can live in the tank long-term, how often the substrate has to be replaced, and how the plants establish in the first six months.

---

## Active aquasoils

### 1. ADA Aqua Soil Amazonia Ver.2

| Field | Value |
|---|---|
| Slug | `ada-amazonia-v2` |
| Brand | Aqua Design Amano (ADA) |
| Category | Active aquasoil |
| Country of origin | Japan |
| Colour | Dark brown to black |
| Grain size | 2 to 5 mm |
| pH target | 5.8 to 6.5 |
| KH effect | Lowers toward 0 to 2 dKH |
| Ammonia release | Strong, 3 to 6 weeks |
| Nutrient content | Very high |
| Buffering longevity | 18 to 24 months (RO), 12 to 18 months (treated tap) |
| Recommended water | RO + remineraliser preferred, soft tap tolerable |
| Typical price USD | $35 to $50 per 9L bag |
| Best for | Caridina shrimp, high-tech planted, ADA-style Nature Aquarium |
| Difficulty | 3 of 5 |

**How it works.** Aqua Soil Amazonia Ver.2 uses rare Japanese black soil with added "Amazonia Supplement" granules that enhance the nitrogen and humic content. The clay pellets are baked at low temperature so they retain shape underwater for years while gradually releasing nutrients to plant roots. After two weeks in a new tank, water tests show pH 5.8 and detectable ammonia around 5 mg/L. After six weeks, ammonia is no longer detectable and pH stabilises at 6.2.

**Best use cases.** The gold standard for Caridina shrimp tanks (Crystal Red, Bee, Blue Bolt morphs) because the active buffering holds pH in the 5.8 to 6.5 range that the genus requires. Also the canonical choice for high-tech planted tanks running CO2 injection and EI dosing where strong root nutrition is the goal.

**Common mistakes.** Adding fish or shrimp before the ammonia cycle completes is the most common failure mode. Topping off with hard tap water exhausts the buffering capacity prematurely and shifts pH back toward neutral within months. Disturbing the substrate releases trapped ammonia into the water column and can cause a mini cycle.

**Pro tips.** A 3 cm layer at the front sloping to 6 cm at the back gives the planted-tank standard depth profile. Cap with a thin layer of inert sand only if a finer aesthetic is preferred; the cap can reduce nutrient flow to roots. The substrate is fragile, so avoid moving plants once established.

**Sources:**
- [ADA: Make and Keep Aqua Soil Amazonia Ver.2](https://www.adana.co.jp/en/aquajournal/makeandkeep_20/)
- [Aquasabi: ADA Aqua Soil Amazonia Ver.2 product page](https://www.aquasabi.com/ADA-Aqua-Soil-Amazonia-Ver2)
- [Spec-Tanks: ADA Amazonia II Substrate Review](https://spec-tanks.com/ada-amazonia-ii-substrate-review/)

---

### 2. ADA Aqua Soil Amazonia Powder Ver.2

| Field | Value |
|---|---|
| Slug | `ada-amazonia-powder-v2` |
| Brand | ADA |
| Category | Active aquasoil |
| Country of origin | Japan |
| Colour | Dark brown to black |
| Grain size | 1 to 2 mm |
| pH target | 5.8 to 6.5 |
| KH effect | Lowers toward 0 to 2 dKH |
| Ammonia release | Strong, 3 to 6 weeks |
| Nutrient content | Very high |
| Buffering longevity | 18 to 24 months (RO), 12 to 18 months (treated tap) |
| Recommended water | RO + remineraliser |
| Typical price USD | $40 to $55 per 9L bag |
| Best for | Carpeting plants (Monte Carlo, dwarf hairgrass, HC Cuba), top dressing |
| Difficulty | 3 of 5 |

**How it works.** Identical chemistry to the standard Amazonia Ver.2 but with finer grain size (around 1 to 2 mm) that suits small-rooted carpet plants and produces a smoother visual surface. Most aquarists layer the powder type over a standard-grain base.

**Best use cases.** A 1 cm cap of powder type over 4 cm of standard Amazonia gives carpet plants a denser planting medium while the larger grains beneath maintain water flow through the substrate. Pure powder layouts work for low-flow nano tanks but compact over time.

**Common mistakes.** Pure powder substrate in deeper layers (more than 3 cm) compacts and develops anaerobic pockets. Mixing powder and standard grain rather than layering reduces the value of using powder at all.

**Pro tips.** Pour powder type onto a damp standard-grain base via a paper funnel so it forms a level top layer without disturbing the underlying soil. The carpet plant gripping behaviour is noticeably better than on standard grain.

**Sources:**
- [Aquasabi: ADA Aqua Soil Amazonia Powder Type Ver.2](https://www.aquasabi.com/ADA-Aqua-Soil-Amazonia-Powder-Ver2)
- [ADA: Aqua Soil product line](https://www.adana.co.jp/en/contents/aquasoil/)

---

### 3. ADA Aqua Soil Africana

| Field | Value |
|---|---|
| Slug | `ada-africana` |
| Brand | ADA |
| Category | Active aquasoil |
| Country of origin | Japan |
| Colour | Reddish brown |
| Grain size | 2 to 5 mm |
| pH target | 5.8 to 6.5 |
| KH effect | Lowers toward 0 to 2 dKH |
| Ammonia release | Moderate, 2 to 4 weeks |
| Nutrient content | Medium-high |
| Buffering longevity | 12 to 18 months |
| Recommended water | Soft tap or RO |
| Typical price USD | $35 to $50 per 9L bag |
| Best for | African biotope tanks, alternative aesthetic to dark substrates |
| Difficulty | 3 of 5 |

**How it works.** Africana uses a different clay source (laterite-rich African soil) that produces a distinctive reddish-brown grain. Chemistry is similar to Amazonia but with slightly lower ammonia release and slightly lower nutrient density. The pH buffering effect is comparable.

**Best use cases.** African biotope tanks (Lake Tanganyika, Lake Malawi if hardness can be raised separately, West African streams) where the reddish substrate matches the natural environment. The colour also pops the green of Anubias and other West African aquatic plants.

**Common mistakes.** Treating Africana as interchangeable with Amazonia. While the buffering profile is similar, Africana releases less ammonia, which means slower initial plant growth in the first two weeks. Heavy root feeders may need supplementation earlier than with Amazonia.

**Pro tips.** Pair with red volcanic stone (Maten stone, Frodo stone) for a coordinated warm-tone hardscape. Works particularly well with red colour-line stem plants because the reddish substrate amplifies their colour by reflection.

**Sources:**
- [Aquasabi: ADA Aqua Soil Africana](https://www.aquasabi.com/ADA-Aqua-Soil-Africana)
- [ADA: Aqua Soil product line](https://www.adana.co.jp/en/contents/aquasoil/)

---

### 4. Tropica Aquarium Soil

| Field | Value |
|---|---|
| Slug | `tropica-aquarium-soil` |
| Brand | Tropica (Denmark) |
| Category | Active aquasoil |
| Country of origin | Denmark |
| Colour | Dark brown |
| Grain size | 2 to 3 mm |
| pH target | 6.0 to 7.0 |
| KH effect | Lowers gently |
| Ammonia release | Light, 1 to 3 weeks |
| Nutrient content | Medium |
| Buffering longevity | 12 to 18 months |
| Recommended water | Tap (broad tolerance) or RO |
| Typical price USD | $25 to $35 per 9L bag |
| Best for | Beginner planted tanks, low-tech, mixed community tanks |
| Difficulty | 2 of 5 |

**How it works.** Tropica Aquarium Soil is the European mass-market answer to ADA Amazonia. The grain is similar in size and behaves similarly but releases much less ammonia in the first weeks. The pH buffering effect is gentler, settling around 6.5 rather than 5.8. The substrate is non-uniform in grain shape, giving a more natural visual texture than the more regular ADA pellets.

**Best use cases.** First planted tanks where the keeper wants nutrient-rich substrate without committing to RO water or a six-week fishless cycle. Mixed community tanks where Neocaridina shrimp share space with plants that benefit from root nutrition. Low-tech tanks where heavy ammonia release would force a fishless cycle the keeper would rather skip.

**Common mistakes.** Expecting Tropica to drop pH as far as Amazonia. It will not. For Caridina shrimp keepers chasing pH 5.8 to 6.5, Tropica buffers too gently and an active soil with stronger acid loading is needed.

**Pro tips.** The lower ammonia release means fish can often be added after two weeks of cycling rather than six. Pairs well with Tropica's complete fertiliser line for a single-brand workflow. The Powder variant exists at finer grain size for carpet plants.

**Sources:**
- [Tropica Aquarium Soil product page](https://tropica.com/en/plants/easy/)
- [2HR Aquarist: substrate guide](https://www.2hraquarist.com/blogs/substrates-overview/substrate-101)

---

### 5. Tropica Aquarium Soil Powder

| Field | Value |
|---|---|
| Slug | `tropica-aquarium-soil-powder` |
| Brand | Tropica |
| Category | Active aquasoil |
| Country of origin | Denmark |
| Colour | Dark brown |
| Grain size | 1 to 2 mm |
| pH target | 6.0 to 7.0 |
| KH effect | Lowers gently |
| Ammonia release | Light, 1 to 3 weeks |
| Nutrient content | Medium |
| Buffering longevity | 12 to 18 months |
| Recommended water | Tap or RO |
| Typical price USD | $30 to $40 per 9L bag |
| Best for | Carpet plants, top dressing, nano tanks |
| Difficulty | 2 of 5 |

**How it works.** Same composition as standard Tropica Aquarium Soil with smaller grain (1 to 2 mm). The smaller grain holds carpet plants more securely and produces a denser-looking substrate surface.

**Best use cases.** Top layer over standard Tropica or another active soil base, or as the only substrate in a nano tank where the visual finish matters. The reduced ammonia release also makes powder type a good choice for shrimp-friendly setups.

**Common mistakes.** Same as ADA powder: compaction in deep layers. Use as a 1 to 2 cm cap rather than a 5 cm pure layer.

**Pro tips.** Often easier to find than ADA powder type in European and US retail. Works well as a starter substrate for keepers who want the powder grain without ADA's price.

**Sources:**
- [Tropica Aquarium Soil Powder](https://tropica.com/en/plants/)

---

### 6. UNS Controsoil

| Field | Value |
|---|---|
| Slug | `uns-controsoil` |
| Brand | Ultum Nature Systems (UNS) |
| Category | Active aquasoil |
| Country of origin | China (made for US market) |
| Colour | Black (also available in brown) |
| Grain size | 2 to 4 mm |
| pH target | 6.0 to 6.8 |
| KH effect | Lowers moderately |
| Ammonia release | Moderate, 2 to 4 weeks |
| Nutrient content | High |
| Buffering longevity | 12 to 18 months |
| Recommended water | Tap or RO |
| Typical price USD | $40 to $55 per 10L bag |
| Best for | Mid-market high-tech planted tanks, US-based aquascapers |
| Difficulty | 2 of 5 |

**How it works.** UNS Controsoil is the American mid-tier active soil designed as a direct competitor to ADA Amazonia at a lower price point. The granules are slightly larger than ADA's, which makes them easier to plant into without breaking up the soil. Ammonia release is moderate, similar to Tropica, and buffering capacity is intermediate between ADA and Tropica.

**Best use cases.** Planted tank builds where ADA Amazonia is unavailable, too expensive, or considered overkill. Strong choice for hobbyists running EI dosing with CO2 in a 60 to 200 litre tank. The larger grain also gives better water flow through the substrate, which reduces anaerobic-pocket risk.

**Common mistakes.** The bag size is 10L rather than ADA's 9L, so volume conversions need attention. Some users report that Controsoil compacts noticeably over time, especially in deeper layers.

**Pro tips.** The brown variant suits warm-tone scapes; the black variant suits the more standard dark Nature Aquarium aesthetic. Pairs well with UNS's own rimless tank line for a coordinated single-brand setup.

**Sources:**
- [UNS Controsoil product page](https://ultumnaturesystems.com/products/controsoil)
- [UKAPS: Fluval Stratum vs UNS Controsoil discussion](https://www.ukaps.org/forum/threads/fluval-stratum-vs-uns-controsoil.72634/)

---

### 7. Fluval Stratum

| Field | Value |
|---|---|
| Slug | `fluval-stratum` |
| Brand | Fluval (Rolf C. Hagen) |
| Category | Active aquasoil |
| Country of origin | China |
| Colour | Black to dark brown |
| Grain size | 2 to 4 mm |
| pH target | 6.5 to 7.2 |
| KH effect | Lowers gently |
| Ammonia release | Very light, 1 to 2 weeks |
| Nutrient content | Low to medium |
| Buffering longevity | 6 to 12 months |
| Recommended water | Tap or RO |
| Typical price USD | $25 to $40 per 10L bag |
| Best for | First planted tank, mass-market availability, low-tech |
| Difficulty | 1 of 5 |

**How it works.** Fluval Stratum (also known as Plant and Shrimp Stratum) uses volcanic mineral granules sourced from Japan but manufactured at scale in China. The substrate releases very little ammonia, has only modest nutrient content, and lowers pH slightly. Its buffering capacity is the weakest of the active soils.

**Best use cases.** A first-time keeper's planted tank substrate in regions where ADA, Tropica, or UNS are hard to find. Available in major chain stores (PetSmart, Petco, Amazon) which makes Stratum the most accessible active soil for new aquarists. Works adequately for shrimp tanks where the keeper does not need the pH locked at 5.8.

**Common mistakes.** Stratum is unusually lightweight and floats when first poured into water. Plants pull out easily and small carpet plants (Monte Carlo, dwarf hairgrass) struggle to grip. Stratum's buffering capacity exhausts faster than ADA or Tropica, often within a year, after which the substrate behaves like inert gravel with some residual nutrients.

**Pro tips.** Wetting Stratum before pouring it into the tank reduces the floating problem. Mixing root tabs in as the substrate is poured extends the useful nutrient life. Not a first choice for a Caridina shrimp tank or any setup that demands long-term low pH.

**Sources:**
- [Aquarium Co-Op forum: Fluval bio-stratum comparison](https://forum.aquariumcoop.com/topic/32482-fluval-bio-stratum-vs-tropica-vs-neo-soil/)
- [2HR Aquarist: substrate overview](https://www.2hraquarist.com/blogs/substrates-overview/substrate-101)

---

### 8. Dennerle Scaper's Soil

| Field | Value |
|---|---|
| Slug | `dennerle-scapers-soil` |
| Brand | Dennerle (Germany) |
| Category | Active aquasoil |
| Country of origin | Germany |
| Colour | Black to very dark brown |
| Grain size | 1 to 4 mm (irregular) |
| pH target | 6.0 to 6.5 |
| KH effect | Lowers strongly, to 0 to 2 dKH |
| Ammonia release | Moderate, 2 to 4 weeks |
| Nutrient content | High |
| Buffering longevity | 12 to 24 months |
| Recommended water | RO + remineraliser preferred |
| Typical price USD | $30 to $45 per 8L bag |
| Best for | Shrimp tanks (especially Caridina), European keepers |
| Difficulty | 3 of 5 |

**How it works.** Scaper's Soil is built around Andosol, a volcanic ash soil from mountainous rainfall regions. It acts as an ion exchanger, stabilising pH at 6.0 to 6.5 and reducing KH toward zero. The substrate also has a "nutrient buffering" function where surplus nutrients are stored and released to plant roots as needed rather than dumping into the water column.

**Best use cases.** Strong choice for Caridina shrimp tanks in Europe where Dennerle's distribution is excellent and ADA is harder to source. The Andosol mineral profile is favoured by some shrimp breeders over Amazonia for breeding-grade Crystal Red and Taiwan Bee lines.

**Common mistakes.** Like other active soils, treating Scaper's Soil as inert and skipping the cycling period leads to ammonia poisoning of livestock added too early. The buffering capacity holds longer than Stratum but still exhausts and requires substrate replacement at 18 to 24 months for serious shrimp setups.

**Pro tips.** The irregular grain shape (1 to 4 mm) makes for a more natural visual texture than uniform grains. Often paired with Dennerle's own root tabs and dosing line.

**Sources:**
- [Dennerle: Scaper's Soil product page](https://dennerle.com/en/products/scapers-soil)
- [Green Aqua: Dennerle Scaper's Soil 8L](https://greenaqua.hu/en/dennerle-scaper-s-soil-altalanos-novenytalaj-8l.html)

---

### 9. Akadama (DIY Japanese clay)

| Field | Value |
|---|---|
| Slug | `akadama` |
| Brand | Various (Japanese bonsai brands) |
| Category | Active aquasoil |
| Country of origin | Japan |
| Colour | Tan to reddish brown |
| Grain size | 2 to 6 mm (sold by size grade) |
| pH target | 6.0 to 6.8 |
| KH effect | Lowers gently |
| Ammonia release | Light, 1 to 2 weeks |
| Nutrient content | Low |
| Buffering longevity | 18 to 36 months |
| Recommended water | RO preferred |
| Typical price USD | $20 to $35 per 14L bag |
| Best for | Budget-conscious shrimp keepers, DIY substrate alternative |
| Difficulty | 3 of 5 |

**How it works.** Akadama is a Japanese clay traditionally used in bonsai cultivation. The clay is processed into uniform granules with high cation exchange capacity, which lowers pH and KH similarly to manufactured aquasoils. The bonsai supply chain produces Akadama in much larger volumes than aquascaping demands, so the price per litre is much lower than purpose-built aquarium soils.

**Best use cases.** Caridina shrimp tanks on a budget, or any planted tank where the keeper is comfortable buying from garden supply rather than aquarium retail. Some experienced shrimp breeders prefer Akadama specifically for its low nutrient content because it forces them to dose minerals deliberately rather than relying on substrate leaching.

**Common mistakes.** Garden-grade Akadama sometimes contains pesticide residue or trace contaminants. Aquarium-safe sources need to be verified before use. The granules can crumble over time, especially if disturbed during planting; gentler grades (Akadama Premium, Double Red Line) hold up longer.

**Pro tips.** Hard Akadama (the "Double Red Line" grade) lasts significantly longer than the softer general-grade product. Akadama also pairs well with Kanuma (another Japanese bonsai clay) for tanks that want even softer water than Akadama alone produces.

**Sources:**
- [Wikipedia: Akadama](https://en.wikipedia.org/wiki/Akadama)
- [2HR Aquarist: substrate guide](https://www.2hraquarist.com/blogs/substrates-overview/substrate-101)

---

## Inert nutrient-enriched substrates

### 10. CaribSea Eco-Complete Planted

| Field | Value |
|---|---|
| Slug | `caribsea-eco-complete` |
| Brand | CaribSea |
| Category | Inert nutrient-enriched |
| Country of origin | United States |
| Colour | Black volcanic basalt |
| Grain size | 2 to 5 mm |
| pH effect | Neutral (slightly buffers up) |
| KH effect | Neutral |
| Ammonia release | None |
| Nutrient content | Medium (pre-loaded with iron, calcium, magnesium, potassium) |
| Buffering longevity | Permanent (no buffering, never exhausts) |
| Recommended water | Tap or RO (any hardness) |
| Typical price USD | $25 to $35 per 9 kg bag |
| Best for | Hard-water keepers, low-tech tanks, livebearer planted tanks |
| Difficulty | 1 of 5 |

**How it works.** Eco-Complete is a black volcanic basalt gravel coated with a mix of micronutrients including iron, calcium, magnesium, and potassium. The substrate itself is inert and does not change water chemistry, but the coating provides slow-release nutrients to plant roots for the first year. After roughly 12 to 18 months, the coating effect diminishes and the substrate behaves like inert gravel that needs root tabs.

**Best use cases.** Hard-water regions where active soils' pH-lowering effect would force the keeper into RO water. Livebearer tanks (mollies, platies, guppies) that prefer harder water and need plants that tolerate it. Low-tech tanks where heavy ammonia release would complicate cycling.

**Common mistakes.** Expecting Eco-Complete to drive plant growth as fast as active soil. It will not. Heavy root feeders (Amazon swords, Cryptocoryne) need supplementary root tabs after the first year. The coating washes off slightly when the substrate is rinsed too thoroughly.

**Pro tips.** Do not rinse Eco-Complete before adding to the tank. The bag's liquid contains beneficial bacteria and dissolved minerals that are intended to seed the substrate. Pour the entire contents in directly.

**Sources:**
- [CaribSea Eco-Complete Planted product page](https://www.caribsea.com/freshwater-substrates/)

---

### 11. Seachem Flourite Black

| Field | Value |
|---|---|
| Slug | `seachem-flourite-black` |
| Brand | Seachem |
| Category | Inert nutrient-enriched |
| Country of origin | United States |
| Colour | Black |
| Grain size | 1 to 2 mm (gravel) |
| pH effect | Neutral |
| KH effect | Neutral |
| Ammonia release | None |
| Nutrient content | Medium (iron-rich clay base) |
| Buffering longevity | Permanent (never exhausts) |
| Recommended water | Tap or RO (any hardness) |
| Typical price USD | $25 to $35 per 7 kg bag |
| Best for | Long-term planted tanks, hard-water regions, planted livebearer tanks |
| Difficulty | 2 of 5 |

**How it works.** Flourite is a porous baked clay gravel manufactured by Seachem. The substrate is naturally iron-rich and the porosity allows plant roots to grip and extract nutrients over time. Unlike active soils, Flourite does not break down or exhaust. A Flourite substrate is essentially permanent.

**Best use cases.** Planted tanks intended to run for five-plus years without substrate replacement. Hard-water aquariums where active soils' pH-lowering effect would be undesirable. Tanks that mix planted scaping with fish species that need alkaline water.

**Common mistakes.** Flourite is notoriously dusty out of the bag. Aggressive rinsing in a bucket before adding to the tank is required, otherwise the tank stays cloudy for days. Even after rinsing, the first water change pulls some residual dust.

**Pro tips.** Mix Flourite Black with a small amount of Flourite Sand (a finer-grain variant) for a smoother visual finish. Pairs well with Seachem's complete liquid fertiliser line for a single-brand workflow.

**Sources:**
- [Seachem Flourite Black product page](https://www.seachem.com/flourite-black.php)
- [Aquarium Co-Op: Flourite review](https://www.aquariumcoop.com/blogs/aquarium/substrate)

---

### 12. Seachem Flourite Black Sand

| Field | Value |
|---|---|
| Slug | `seachem-flourite-black-sand` |
| Brand | Seachem |
| Category | Inert nutrient-enriched |
| Country of origin | United States |
| Colour | Black |
| Grain size | 0.5 to 1 mm (sand) |
| pH effect | Neutral |
| KH effect | Neutral |
| Ammonia release | None |
| Nutrient content | Medium (iron-rich clay base) |
| Buffering longevity | Permanent |
| Recommended water | Tap or RO (any hardness) |
| Typical price USD | $30 to $40 per 7 kg bag |
| Best for | Corydoras and bottom-dwellers, smooth visual finish, planted nano tanks |
| Difficulty | 2 of 5 |

**How it works.** Flourite Black Sand is the fine-grain variant of standard Flourite Black. Same composition and behaviour, smaller grain. The finer grain protects corydoras barbels and produces a smoother visual texture, but the dust problem is amplified.

**Best use cases.** Planted tanks stocked with corydoras catfish or other barbel-bearing species. Display tanks where a smooth substrate finish matters more than the maximum nutrient delivery to plant roots.

**Common mistakes.** Skimping on the pre-rinse. Sand-grade Flourite is much dustier than the gravel variant. Plan for at least 30 minutes of bucket rinsing before adding to the tank.

**Pro tips.** Slope the substrate front-to-back during initial setup; sand-grade substrates settle to a flat plane over time but the initial slope buys visual depth for the first six months.

**Sources:**
- [Seachem Flourite Black Sand product page](https://www.seachem.com/flourite-black-sand.php)

---

## Inert sand and gravel

### 13. Pool filter sand (PFS)

| Field | Value |
|---|---|
| Slug | `pool-filter-sand` |
| Brand | Various (HTH, Pavestone, generic pool supply) |
| Category | Inert sand |
| Country of origin | Various |
| Colour | Tan to pale brown |
| Grain size | 0.4 to 0.6 mm |
| pH effect | Neutral |
| KH effect | Neutral |
| Ammonia release | None |
| Nutrient content | None |
| Buffering longevity | Permanent |
| Recommended water | Any |
| Typical price USD | $10 to $20 per 22 kg bag |
| Best for | Budget-conscious builds, corydoras tanks, natural-look scapes |
| Difficulty | 1 of 5 |

**How it works.** Pool filter sand is silica sand sold for swimming pool filtration. The grain is uniformly sized (around 0.45 mm), pre-washed for clarity, and chemically inert. The cost per kilogram is roughly one tenth that of aquarium-branded sand.

**Best use cases.** Budget planted tanks, especially with root tabs supplementing the nutrient delivery. Corydoras tanks where the soft fine grain protects barbels. Naturalistic scapes that benefit from a pale substrate.

**Common mistakes.** Some pool filter sand is treated with anti-algal chemicals (especially older stock) and is unsafe for aquarium use. Always check the bag and source from pool supply stores where the sand is sold as "filter sand" rather than "pool sand with algaecide".

**Pro tips.** Pre-rinse the sand thoroughly even though it is sold pre-washed. The first water column will still be cloudy for a few hours but clears within a day. Plants need root tabs every three to four months because the substrate provides no nutrients.

**Sources:**
- [Aquarium Co-Op: substrate buying guide](https://www.aquariumcoop.com/blogs/aquarium/substrate)
- [2HR Aquarist: substrate guide](https://www.2hraquarist.com/blogs/substrates-overview/substrate-101)

---

### 14. Black Diamond Blasting Sand

| Field | Value |
|---|---|
| Slug | `black-diamond-blasting-sand` |
| Brand | Black Diamond / various |
| Category | Inert sand (with cautions) |
| Country of origin | United States |
| Colour | Black |
| Grain size | 0.3 to 1.5 mm (sold by grit grade) |
| pH effect | Neutral |
| KH effect | Neutral |
| Ammonia release | None |
| Nutrient content | None |
| Buffering longevity | Permanent |
| Recommended water | Any |
| Typical price USD | $10 to $15 per 22 kg bag |
| Best for | Dark substrate on a tight budget |
| Difficulty | 2 of 5 |

**How it works.** Black Diamond is coal slag, a by-product of coal-fired power generation that is sold as abrasive media for industrial sandblasting. The material is dark black, very cheap, and chemically resistant. Used carefully it works as aquarium substrate.

**Best use cases.** Hobbyists who want a black substrate on a strict budget and accept the caveats. Coldwater tanks (white cloud mountain minnows, hillstream loaches) where the dark substrate looks striking against pale fish.

**Common mistakes and cautions.** Some Black Diamond batches have tested positive for measurable copper and other heavy metals. Copper is fatal to shrimp and harmful to many invertebrates. The grain is also slightly magnetic because of high iron content, which is harmless but unusual. Black Diamond is not recommended for shrimp tanks under any circumstance. For fish-only planted tanks, a thorough rinse (well beyond what would be required for pool filter sand) and a long observation period for any livestock are reasonable precautions.

**Pro tips.** If choosing black sand on a budget, CaribSea Tahitian Moon Sand or a dedicated aquarium-grade black sand from a reputable brand is the safer alternative. The cost difference per bag is small relative to the cost of livestock that might be lost.

**Sources:**
- [The Planted Tank Forum: Black Diamond Blasting Sand discussion](https://www.plantedtank.net/threads/worth-replacing-black-diamond-blasting-sand-for-seachem-flourite.1333707/)

---

### 15. CaribSea Tahitian Moon Sand

| Field | Value |
|---|---|
| Slug | `caribsea-tahitian-moon-sand` |
| Brand | CaribSea |
| Category | Inert sand |
| Country of origin | United States |
| Colour | Deep black |
| Grain size | 0.25 to 1 mm |
| pH effect | Neutral |
| KH effect | Neutral |
| Ammonia release | None |
| Nutrient content | None |
| Buffering longevity | Permanent |
| Recommended water | Any |
| Typical price USD | $25 to $35 per 9 kg bag |
| Best for | Aquarium-grade black sand, shrimp-safe, display tanks |
| Difficulty | 1 of 5 |

**How it works.** Tahitian Moon Sand is a black aragonite-free sand processed specifically for aquarium use. Unlike Black Diamond, it has been tested for shrimp and fish safety and contains no heavy metals or industrial residues. The grain is finer than aquarium gravel but slightly coarser than the finest aragonite sand.

**Best use cases.** Display planted tanks where a clean uniform black substrate is the aesthetic goal and active soil chemistry is not needed. Shrimp tanks where the dark substrate makes the colours pop without any chemistry risk.

**Common mistakes.** Tahitian Moon Sand is finer than most gravels and can compact slightly if a deep layer is used. Keep the layer under 5 cm and stir gently during water changes to prevent anaerobic pockets.

**Pro tips.** Pairs well with white seiryu stones for a high-contrast scape. Pre-rinse to remove residual dust.

**Sources:**
- [CaribSea Tahitian Moon Sand product page](https://www.caribsea.com/)

---

## Additives and base layers

### 16. ADA Power Sand Special

| Field | Value |
|---|---|
| Slug | `ada-power-sand` |
| Brand | ADA |
| Category | Base-layer additive |
| Country of origin | Japan |
| Colour | Pale tan with visible black additives |
| Grain size | 5 to 10 mm (porous pumice base) |
| pH effect | Neutral |
| KH effect | Neutral |
| Ammonia release | Moderate (from pre-loaded nutrients) |
| Nutrient content | Very high (pre-loaded with Bacter 100 and Clear Super additives) |
| Buffering longevity | Functional for the substrate lifetime |
| Recommended water | Used under active soil |
| Typical price USD | $30 to $45 per 6L bag |
| Best for | Premium ADA-style substrate stack |
| Difficulty | 3 of 5 |

**How it works.** Power Sand is a base-layer substrate designed to sit under Aqua Soil. The porous pumice grain creates water and oxygen flow channels beneath the top layer, preventing anaerobic pockets in deep substrate. The pre-loaded Bacter 100 (beneficial bacteria) and Clear Super (humic acids and trace minerals) additives release slowly through the active soil above.

**Best use cases.** ADA-style stacked substrate (Power Sand layer of 2 to 3 cm topped with 5 to 7 cm of Aqua Soil Amazonia). The stack produces longer plant root systems and reduces the need for fertilisation in the first six months.

**Common mistakes.** Treating Power Sand as a standalone substrate. It is too porous and the additives are too concentrated for direct contact with plant roots; the active soil layer above is required.

**Pro tips.** The Special variant is for larger tanks (60 litres and up). The "M" size is for medium tanks. The "S" size is for nano tanks. Matching the size to tank volume affects flow through the base layer.

**Sources:**
- [ADA Power Sand product page](https://www.adana.co.jp/en/contents/powersand/)
- [Aquasabi: ADA Power Sand Special](https://www.aquasabi.com/ADA-Power-Sand-Special)

---

### 17. ADA Bacter 100 / Tourmaline BC

| Field | Value |
|---|---|
| Slug | `ada-bacter-100` |
| Brand | ADA |
| Category | Substrate additive |
| Country of origin | Japan |
| Colour | Pale powder (Bacter 100), black grains (Tourmaline BC) |
| Form | Powder additives sprinkled into substrate layers |
| pH effect | Neutral |
| KH effect | Neutral |
| Ammonia release | None |
| Nutrient content | Beneficial bacteria and trace minerals |
| Buffering longevity | Functional indefinitely once seeded |
| Recommended water | Used during substrate setup |
| Typical price USD | $20 to $40 per 100g jar |
| Best for | ADA-style substrate stack, advanced planted tanks |
| Difficulty | 3 of 5 |

**How it works.** Bacter 100 is a powder of dormant beneficial bacteria that activate when the substrate is wetted. Tourmaline BC is granulated tourmaline mineral that releases trace elements (boron, sodium, potassium) into the substrate over time. Both are sprinkled in thin layers between Power Sand and Aqua Soil during substrate setup.

**Best use cases.** Building the full ADA premium substrate stack (Power Sand + Bacter 100 + Tourmaline BC + Aqua Soil). Diminishing returns set in for budget-conscious tanks; the additives add real value only for high-tech high-performance setups.

**Common mistakes.** Sprinkling additives too thickly. The recommended dose is around one teaspoon per 60 cm of tank length, sprinkled lightly across the substrate before the next layer is added. Excess additive does not improve performance and can cloud the water column for weeks.

**Pro tips.** Skip the additives entirely on a first planted tank build. They make a measurable but small difference in already-good substrate stacks and are not the difference between success and failure.

**Sources:**
- [ADA Bacter 100 product page](https://www.adana.co.jp/en/contents/aquasoil/)
- [Aquasabi: ADA Bacter 100](https://www.aquasabi.com/ADA-Bacter-100)

---

## Comparison cheat sheet

| Substrate | Type | pH | Ammonia | Lifespan | Price | Shrimp-safe |
|---|---|---|---|---|---|---|
| ADA Aqua Soil Amazonia v2 | Active | 5.8 to 6.2 | Strong | 18 to 24 mo | $$$ | Yes (Caridina ideal) |
| ADA Amazonia Powder v2 | Active | 5.8 to 6.2 | Strong | 18 to 24 mo | $$$ | Yes |
| ADA Africana | Active | 5.8 to 6.5 | Moderate | 12 to 18 mo | $$$ | Yes |
| Tropica Aquarium Soil | Active | 6.0 to 7.0 | Light | 12 to 18 mo | $$ | Yes (Neocaridina) |
| Tropica Aquarium Soil Powder | Active | 6.0 to 7.0 | Light | 12 to 18 mo | $$ | Yes |
| UNS Controsoil | Active | 6.0 to 6.8 | Moderate | 12 to 18 mo | $$ | Yes |
| Fluval Stratum | Active | 6.5 to 7.2 | Very light | 6 to 12 mo | $ | Yes (gentle) |
| Dennerle Scaper's Soil | Active | 6.0 to 6.5 | Moderate | 12 to 24 mo | $$ | Yes (Caridina ideal) |
| Akadama | Active | 6.0 to 6.8 | Light | 18 to 36 mo | $ | Yes |
| CaribSea Eco-Complete | Inert nutrient | Neutral | None | Permanent | $$ | Yes |
| Seachem Flourite Black | Inert nutrient | Neutral | None | Permanent | $$ | Yes |
| Seachem Flourite Black Sand | Inert nutrient | Neutral | None | Permanent | $$ | Yes |
| Pool filter sand | Inert | Neutral | None | Permanent | $ | Yes |
| Black Diamond Blasting Sand | Inert | Neutral | None | Permanent | $ | No (copper risk) |
| CaribSea Tahitian Moon Sand | Inert | Neutral | None | Permanent | $$ | Yes |
| ADA Power Sand | Base additive | Neutral | Moderate | Lifetime | $$$ | Used under active soil |
| ADA Bacter 100 / Tourmaline | Additive | Neutral | None | Indefinite | $$ | Used during setup |

---

# Part 2: Claude Code implementation prompt

Copy everything from this divider to the end of the file into Claude Code at the repo root and open as the first task of the session.

---

You are adding substrates to the Fin & Stem catalogue and wiring them into the compare tool with mutual exclusivity against livestock. Substrates must NOT appear in the planner or compatibility tools. Read these files first so the existing patterns are familiar:

1. `src/types/catalogue.ts` for the existing catalogue entry types.
2. `src/data/fish.ts`, `plants.ts`, `shrimp.ts`, `mosses.ts` for the existing data shape.
3. `src/app/compare/page.tsx` and `src/components/compare/*.tsx` for the current compare tool.
4. `src/lib/compare-storage.ts` for the compare selection state.
5. `src/app/planner/page.tsx` and `src/app/compatibility/page.tsx` to understand what must stay unchanged.
6. `prompts/05-substrate-profiles-and-compare.md` (this file) Part 1 for the 17 substrate profiles to seed.

Operating rules:
- Plan Mode first.
- After each major change, run `pnpm typecheck` and `pnpm build`.
- No new libraries beyond what is already in `package.json`.
- Substrates are a new top-level catalogue category alongside fish, plants, shrimp, mosses.
- Substrates must not enter the planner or compatibility tools at any point.

---

## Goal

Add a substrate catalogue and integrate it into the compare tool only. By end of session:

1. A new `Substrate` type is added with the schema below.
2. `src/data/substrates.ts` contains 17 entries seeded from Part 1 of this file.
3. `/substrates` lists the catalogue.
4. `/substrates/[slug]` renders an individual substrate detail page.
5. The compare tool has a mode toggle (Livestock or Substrate) at the top.
6. Picking a substrate disables the livestock pickers and vice versa.
7. The compare table renders substrate-relevant columns when in substrate mode.
8. The planner and compatibility tools continue to work exactly as they do now (no substrate entries surfaced).
9. The sitemap and llms.txt include the new substrate URLs.

---

## Task 1: Type definitions

Create `src/types/substrate.ts`:

```typescript
export type SubstrateCategory =
  | "active-aquasoil"
  | "inert-nutrient"
  | "inert-sand"
  | "additive-or-base-layer";

export type PhEffect = "lowers-strong" | "lowers-gentle" | "neutral" | "raises";
export type KhEffect = "lowers-strong" | "lowers-gentle" | "neutral" | "raises";
export type AmmoniaRelease = "none" | "very-light" | "light" | "moderate" | "strong";

export interface SubstrateEntry {
  /** "substrate-001" style stable identifier. */
  id: string;
  /** URL slug. Unique. */
  slug: string;
  /** Display name including brand if relevant. */
  name: string;
  brand: string;
  category: SubstrateCategory;
  countryOfOrigin: string;
  colour: string;
  /** Grain size as a human-readable range, e.g. "2 to 5 mm". */
  grainSize: string;
  /** Target pH range as a human-readable string, e.g. "5.8 to 6.2". */
  phTarget: string;
  phEffect: PhEffect;
  khEffect: KhEffect;
  ammoniaRelease: AmmoniaRelease;
  /** Free text: "Very high" / "High" / "Medium" / "Low" / "None". */
  nutrientContent: string;
  /** "18 to 24 months", "Permanent", etc. */
  bufferingLongevity: string;
  /** "Tap water tolerable", "RO + remineraliser preferred", etc. */
  recommendedWater: string;
  /** Range string in USD: "$35 to $50 per 9L bag". */
  typicalPriceUsd: string;
  /** 1 to 5. */
  difficulty: number;
  /** Free-text array of typical use cases. */
  bestFor: ReadonlyArray<string>;
  /** Whether this substrate is safe for dwarf shrimp. */
  shrimpSafe: boolean;
  /** Care summary, ~80 to 120 words. */
  careSummary: string;
  /** Long-form sections used by the detail page. */
  sections: {
    howItWorks: string;
    bestUseCases: string;
    commonMistakes: string;
    proTips: string;
  };
  /** Sources cited on the detail page. */
  sources: ReadonlyArray<{ label: string; url: string }>;
  publishedAt: string;
  updatedAt: string;
}
```

Update `src/types/catalogue.ts` to export a discriminated union type that includes Substrate alongside the existing categories, but only for use in compare-tool contexts. The existing `CatalogueEntry` type used by planner and compatibility must NOT include substrates so those tools never see them.

Pattern:

```typescript
// Existing union, untouched:
export type CatalogueEntry = FishEntry | PlantEntry | ShrimpEntry | MossEntry;

// New union, used only by the compare tool:
export type CompareEntry = CatalogueEntry | SubstrateEntry;
```

---

## Task 2: Seed data

Create `src/data/substrates.ts` with all 17 substrate entries from Part 1 of this file. Copy each profile's table into the structured fields and each profile's prose sections into the `sections` field. Use the IDs `substrate-001` through `substrate-017` in the order shown in the cheat sheet table.

Wire the export into `src/data/index.ts`:

```typescript
export { substrates, findSubstrate } from "./substrates";
```

Add a helper `findSubstrate(slug: string): SubstrateEntry | undefined` to the data file.

---

## Task 3: Substrate listing and detail pages

### `src/app/substrates/page.tsx`

A category landing page modelled on `src/app/fish/page.tsx`. Should render a grid of substrate cards with brand, name, category badge, colour, grain size, pH target, and a "Compare" button. Top of the page: an intro block explaining substrate categories (active aquasoil, inert nutrient, inert sand, additive). Right side: filter controls (category, pH effect, shrimp-safe, price range, brand).

Metadata: `alternates: { canonical: "https://finandstem.com/substrates" }`.

JSON-LD: `CollectionPage` + `BreadcrumbList` + `ItemList`.

### `src/app/substrates/[slug]/page.tsx`

A detail page modelled on `src/app/fish/[slug]/page.tsx`. Structure:

1. Hero block with brand, product name, category badge, colour, key spec callout pills (pH target, grain size, ammonia release, lifespan, shrimp-safe yes/no).
2. TL;DR section using the `careSummary` field rendered through the existing `<Tldr />` component.
3. Spec table covering every structured field in the entry type.
4. "How it works" section (from `sections.howItWorks`).
5. "Best use cases" section (from `sections.bestUseCases`).
6. "Common mistakes" section (from `sections.commonMistakes`).
7. "Pro tips" section (from `sections.proTips`).
8. Sources block (existing `<Sources />` component).
9. JSON-LD: `Article` + `BreadcrumbList` + `Product` (the substrate is a product). Use the existing `speciesPageJsonLd` pattern as a template and rename the helper to `substratePageJsonLd` in `src/lib/seo.ts`.

The substrate detail page does NOT show "Featured in builds" or "Compatible species" sections (those are livestock-specific). It does show a "Plants that thrive in this substrate" panel pulling from a small static mapping defined in `src/data/substrate-plant-affinity.ts`. Hand-author the mapping for now using sensible defaults (active soils favour heavy root feeders like Cryptocoryne, Amazon Sword; inert nutrient favours stem plants; inert sand needs root tabs).

---

## Task 4: Compare page mode toggle

The core requirement. The compare page must support two modes that are mutually exclusive:

- **Livestock mode** (current behaviour, default): user can pick fish, plants, shrimp, and mosses, up to 4 entries.
- **Substrate mode** (new): user can pick substrates only, up to 4 entries.

### Step 4a: Mode state

In `src/lib/compare-storage.ts`, add a `mode` field to the persisted state:

```typescript
export type CompareMode = "livestock" | "substrate";

export interface CompareState {
  mode: CompareMode;
  /** Slugs in the form "category:slug" for livestock, "substrate:slug" for substrate. */
  selections: string[];
}
```

Update the storage helpers to read/write `mode`. Default mode is `livestock`.

When the mode changes from livestock to substrate (or vice versa), clear all selections in the same setter so the user is never left with a stale livestock entry in substrate mode.

### Step 4b: Mode toggle UI

Add a mode toggle at the top of `src/app/compare/page.tsx`. A two-button pill segment: "Livestock" and "Substrate". The active mode is highlighted with the brand colour. Below the toggle, a one-sentence explanation: "Compare livestock against each other, or substrates against each other. Mixing the two does not produce useful comparisons."

### Step 4c: Filter the pickers by mode

In `src/components/compare/compare-picker.tsx`, accept a `mode` prop. When `mode === "livestock"` the picker offers all fish, plants, shrimp, and mosses (current behaviour). When `mode === "substrate"` the picker offers only substrates. Reject any selection that does not match the current mode at the storage layer to be safe.

### Step 4d: Mode-aware compare table

In `src/components/compare/compare-table.tsx`, render different columns based on mode.

Livestock mode columns (current behaviour, leave alone):
- Image, Common name, Scientific name, Origin, Temperament/Type, Adult size, Min tank, Temp, pH, dGH, Difficulty, Lifespan, Plant safe, Shrimp safe.

Substrate mode columns (new):
- Image, Brand, Product name, Category, Colour, Grain size, pH target, pH effect, KH effect, Ammonia release, Nutrient content, Buffering longevity, Recommended water, Typical price USD, Shrimp-safe, Difficulty.

The renderer should switch on the active entry type. If a row's entry type does not match the current mode, the row is empty (defensive, but should not happen because the picker filters).

---

## Task 5: Planner and compatibility exclusion

Verify and (if needed) update:

- `src/app/planner/page.tsx` reads only from `fish`, `plants`, `shrimp`, `mosses` data exports. Confirm substrates are not imported. If the planner pulls from a unified `allEntries` array, add a filter to exclude substrates explicitly.
- `src/app/compatibility/page.tsx` reads from the same livestock exports. Confirm substrates are not referenced. The compatibility tool's anchor parameter uses the form `category:slug` where `category` is `fish | plants | shrimp | mosses`. Ensure `substrate` is rejected if it appears in the URL parameter.

Add unit-test-style assertions in a temporary file `src/__exclusion-check.ts` that imports from each tool and confirms no substrate entries leak through. Delete the file after the assertions pass.

---

## Task 6: Navigation

Add `/substrates` to the site navigation in `src/lib/site.ts`:

```typescript
nav: [
  { label: "Fish", href: "/fish" },
  { label: "Plants", href: "/plants" },
  { label: "Shrimp", href: "/shrimp" },
  { label: "Mosses", href: "/mosses" },
  { label: "Substrates", href: "/substrates" }, // NEW
  { label: "Planner", href: "/planner" },
  { label: "Compare", href: "/compare" },
  { label: "Compatibility", href: "/compatibility" },
  { label: "About", href: "/about" },
],
```

And add a Substrates entry under "Catalogue" in `footer.columns`.

---

## Task 7: Sitemap

Update `src/app/sitemap.ts` to include:

```typescript
{ path: "/substrates", priority: 0.9, freq: "weekly" },
```

…in the static paths array, and append substrate detail URLs:

```typescript
...substrates.map((s) => `/substrates/${s.slug}`),
```

…to the entry paths.

---

## Task 8: llms.txt

Add a new section to `public/llms.txt` (or to the source under `seo/llms.txt` if the build regenerates from there):

```
## Substrates

- [/substrates](https://finandstem.com/substrates): Aquarium substrates and aquasoils with structured comparisons by pH effect, ammonia release, nutrient content, and buffering longevity. Catalogue includes ADA, Tropica, UNS, Fluval, Dennerle, Seachem, and CaribSea brands plus inert sand options.
```

---

## Acceptance criteria

Before stopping, verify:

- [ ] `pnpm typecheck` and `pnpm build` pass with zero errors.
- [ ] `pnpm dev` boots without runtime errors.
- [ ] `/substrates` renders a grid with all 17 substrate cards.
- [ ] `/substrates/ada-amazonia-v2` renders the full detail page with hero, TL;DR, spec table, all four prose sections, and sources block.
- [ ] `/substrates/ada-amazonia-v2` source contains `Article` + `BreadcrumbList` + `Product` JSON-LD validated through https://validator.schema.org/.
- [ ] `/compare` shows a Livestock/Substrate mode toggle at the top.
- [ ] Picking a fish in livestock mode then switching to substrate mode clears the fish from the selection.
- [ ] In substrate mode, the picker only offers substrate entries.
- [ ] In substrate mode, the compare table renders substrate-relevant columns and no livestock columns.
- [ ] `/planner` does not show any substrate entries in its picker.
- [ ] `/compatibility` does not show any substrate entries.
- [ ] `/compatibility?anchor=substrate:ada-amazonia-v2` (a deliberately invalid URL) does not crash; it either redirects or renders an empty state.
- [ ] Sitemap and llms.txt both include `/substrates` and the 17 detail URLs.
- [ ] Navigation in the site header includes a "Substrates" link.

---

## What NOT to do this session

- Do not add substrates to the planner or compatibility tools.
- Do not add cross-references between substrates and species (the "Plants that thrive in this substrate" panel is a small static mapping, not a relational compatibility check).
- Do not introduce a new JS library for the mode toggle. Use existing UI primitives in `src/components/ui/`.
- Do not change the visual design of the existing compare page beyond adding the mode toggle.
- Do not deploy.

---

## When you finish

Append a `Session 5: substrates + compare integration` note to `progress/session-05.md` listing:

1. What shipped end-to-end.
2. Anything stubbed (e.g. the substrate-plant affinity mapping starts with a small set of defaults; flag this).
3. Any decisions made without clarification.

Then stop.
