# Gear catalogue curation rules

These rules turn raw supplier dumps (`scripts/gear/.build/input/<group>.json`) into curated product files (`scripts/gear/curated/<group>.json`). The curated files are the source of truth that `scripts/gear/build.py` turns into `src/data/gear.generated.ts` and webp images.

Fin & Stem is a planted-aquarium (freshwater aquascaping) reference site. The gear catalogue helps a reader pick the right main piece of equipment or hardscape for **their** tank, and compare products side by side. It is not a shop and never reads like one.

## 1. What to keep

Keep only **main items** a person chooses when building or upgrading a freshwater planted tank:

| category id | what goes in | subtype values |
|---|---|---|
| `aquariums` | Glass tanks, rimless tanks, all-in-one tanks, aquarium + cabinet sets, tanks with built-in filtration | `rimless`, `framed`, `all-in-one`, `desktop`, `with-cabinet` |
| `filters` | Canister, hang-on-back, internal, sponge, top filters, thermo filters (filter with heater built in), filters with UV built in | `canister`, `hang-on-back`, `internal`, `sponge`, `top` |
| `lights` | Freshwater/planted LED lights (bar, clip-on, pendant, stand-mounted, paludarium lights) | `bar`, `clip-on`, `pendant`, `stand`, `paludarium` |
| `co2` | Complete CO2 kits, regulators (incl. solenoids), diffusers/atomisers/reactors, drop checkers, bubble counters, cylinders, pH controllers | `kit`, `regulator`, `diffuser`, `drop-checker`, `bubble-counter`, `cylinder`, `controller` |
| `heaters` | Glass, titanium, inline, preset, electronic/app heaters | `glass`, `inline`, `titanium`, `preset`, `smart` |
| `cooling` | Chillers, cooling fans, chiller/heater units | `chiller`, `fan` |
| `pumps` | Return / water pumps, powerheads, circulation pumps, wavemakers (freshwater aquarium sized) | `water-pump`, `circulation` |
| `air-pumps` | Aquarium air pumps (mains, AC/DC, battery backup) | `air-pump`, `battery` |
| `sterilisers` | UV clarifiers/sterilisers, electrolytic sterilisers (e.g. Twinstar Nano / Algae Inhibitor) | `uv`, `electrolytic` |
| `plumbing` | Lily pipes (inflow/outflow), metal flow pipes, surface skimmers, complete inflow/outflow sets | `lily-pipe`, `surface-skimmer` |
| `stands` | Aquarium cabinets and stands sold on their own | `cabinet`, `stand` |
| `paludarium` | Paludarium/wabi-kusa enclosures and systems, misting systems, terrarium fans, glass pots meant for planting | `enclosure`, `misting`, `fan` |
| `tools` | Tweezers, scissors, glass scrapers/razors, substrate tools, gravel cleaners/siphons, magnet cleaners, electric gravel washers | `tweezers`, `scissors`, `scraper`, `substrate-tool`, `gravel-cleaner`, `magnet-cleaner` |
| `feeders` | Automatic fish feeders | `auto-feeder` |
| `hardscape` | Aquascaping stone, wood, decorative sand/gravel (inert), bonsai driftwood trees, pre-built hardscape sets | `stone`, `wood`, `sand-gravel`, `bonsai`, `set` |

## 2. What to exclude (do not output these at all)

**Owner rules (2026-09-23), these override the table above:** no hand tools (tweezers, scissors, scrapers, gravel cleaners, magnet cleaners), no feeders or food containers, and nothing made for terrariums, paludariums, wabi-kusa or reptiles. The `tools`, `feeders` and `paludarium` categories and the `lights/paludarium` subtype are dropped by `build.py`. Multiple listings or photos of the same product always become one product page. If you are unsure what a photo shows, leave it out.

- **Livestock**: any plant, moss, tissue culture, macroalgae, fish, shrimp, snail. Also plastic/artificial plants.
- **Consumables**: fertilisers, water conditioners/treatments, bacteria, food, filter media (pads, foam, sponges, carbon, ceramic rings, wool, bio balls, cartridges), test kits, salts, adhesives/glue, essential oils, sprays.
- **Spare parts**: o-rings, seals, gaskets, impellers, shafts, pump heads, pump covers, canister bodies sold as parts, clips, suction cups, hoses/tubing, connectors, taps, elbows, T-junctions, reducers, spray bars, intake strainers, replacement bulbs/UV lamps/LED tubes, power supplies, cables, remotes, controllers sold as add-ons, hanging kits, light stands/arms/brackets sold separately, lids, flap sets, mats, replacement blades, check valves, CO2 tubing, adapters, splitters, manifold blocks, drainage pieces, magnet parts.
- **Small accessories**: thermometers, air stones, TDS meters, cleaning cloths, towels, sponges, brushes, buckets, cable ties, cameras, smart sockets, monitors, books, backgrounds/posters, light shades/reflectors sold separately.
- **Reef/marine-only gear**: protein skimmers, dosing pumps, refugium lights, reef lights, marine-labelled items, reef systems, ATOs, needle-wheel pumps.
- **Non-aquascaping animals**: turtle/reptile/cricket/terrarium-for-reptile tanks, reptile lamps, reptile sand, breeding boxes, snail catchers, turtle ladders.
- **Pond, pool and industrial**: pond pumps, garden/fountain pumps, swimming-pool pumps, self-priming centrifugal circulation pumps, roots blowers, vortex/whirl "charging" aerators, bubble-bath pumps.
- **Bundles and kits** that just combine products already listed separately (tank + lid, tank + stand, light + shade kits, tool kits, starter kits). The individual products stay.
- **Active substrates / aqua soils** (ADA Amazonia, Power Sand, UNS Controsoil, Oase ScaperLine Soil, etc.). These live in the site's existing `/substrates` section, not in gear. Inert decorative sands and gravels DO go in hardscape.
- Anything titled only in Chinese or so vague you cannot tell what it is.

When unsure whether something is a main item, ask: *would a reader planning a tank compare this against rivals before buying it?* A Twinstar light: yes. A spare impeller: no.

## 3. Grouping into products and models

- One **product** = one product line/series a reader would think of as "a thing" (e.g. "Eheim Professionel 5e", "Chihiros WRGB II Pro", "Twinstar S Series Ver.5", "Seiryu Stone").
- Its **models** = the sizes/variants that differ in specs (e.g. Professionel 5e 350 / 450 / 700; WRGB II Pro 60 / 80 / 90 / 120; Seiryu Stone S / M / L). Colour-only variants are not separate models; mention colours in `specs`.
- Merge duplicate listings of the same product (e.g. "Aquarium Only" vs "Aquarium and Cabinet", identical titles, retailer vs official store listings of the same light). Keep the best images from either.
- A single-size product still gets one model.

## 4. Output schema

Write a JSON array to `scripts/gear/curated/<group>.json`. Each element:

```jsonc
{
  "id": "eheim-professionel-5e",        // kebab-case, globally unique: brand + product name. ASCII only.
  "brand": "Eheim",                     // Canonical brand: ADA, Boyu, Chihiros, DOOA, Dophin, Eheim, Juwel, Oase, Qanvee, SunSun, Twinstar, UNS
  "name": "Professionel 5e",            // Product name WITHOUT the brand
  "category": "filters",                // from the table in §1
  "subtype": "canister",                // from the table in §1
  "summary": "…",                       // 2–3 sentences, our own words, see §6
  "highlights": ["…", "…", "…"],        // 3–5 short factual points in our own words
  "bestFor": "…",                       // one sentence: which tank/keeper it suits and why
  "watchOut": "…",                      // optional one sentence: honest caveat (noise, size, needs a controller, etc.)
  "specs": { "Hose size": "16/22 mm", "Control": "App via WiFi" },   // product-level facts shared by all models (string values)
  "models": [
    {
      "name": "450",                    // model label as the maker uses it
      "sku": "2076",                    // optional
      "flowLph": 1050, "tankMaxL": 450, "powerW": 20, "mediaL": 4.8,
      "extra": { "Pump head": "2.3 m" } // optional strings for anything without a standard field
    }
  ],
  "priceFrom": 245.0,                   // optional, lowest listed price in source currency
  "currency": "GBP",                    // optional, with priceFrom
  "hardscapeType": "seiryu-stone",      // hardscape only, optional: matching slug from the site's hardscape guide (list below)
  "images": ["/Users/mikeelmira/Downloads/…/x_1.jpg", "…"], // absolute source paths, best first, max 4 (hardscape max 5)
  "sourceUrl": "https://…",             // the product page the data came from
  "sourceName": "Charterhouse Aquatics",// retailer or maker name
  "specSource": "manufacturer" | "retailer" | "knowledge" // where the spec numbers came from
}
```

### Standard numeric model fields (numbers only, metric, omit when unknown)

| field | meaning |
|---|---|
| `flowLph` | Rated pump flow in litres/hour (convert GPH × 3.785) |
| `headM` | Max pump head in metres |
| `powerW` | Electrical power draw in watts |
| `tankMinL`, `tankMaxL` | Manufacturer's recommended tank volume range in litres |
| `volumeL` | Aquarium's own water volume in litres (aquariums/paludariums) |
| `lengthCm`, `widthCm`, `heightCm` | Product's own external dimensions (for a tank: tank size; for a light: fixture length) |
| `glassMm` | Glass thickness |
| `mediaL` | Filter media volume in litres |
| `airLpm` | Air output in litres/minute (convert L/h ÷ 60) |
| `outlets` | Number of air outlets |
| `heaterW` | Heater wattage (heaters, thermo filters, chiller/heater units) |
| `uvW` | UV lamp wattage |
| `lumens` | Light output in lumens |
| `kelvin` | Colour temperature (single number; ranges go in extra) |
| `fitsLengthMinCm`, `fitsLengthMaxCm` | Tank length range a light (or cover/stand) is made for |
| `hoseMm` | Hose inner diameter in mm (number; for "12/16" put 12 and the full string in specs) |
| `weightKg` | Weight (useful for hardscape pieces, stands' load goes in extra) |
| `capacityMl` | Feeder food capacity |

Anything else useful (PAR at depth, spectrum channels, pressure, max working pressure, cooling capacity, noise dB, cable length, stand load, size bands like "15–20 cm") goes into `extra` as label → string.

**Never invent a number.** If the source does not give it and you are not certain from well-established manufacturer data, leave it out. `specSource: "knowledge"` is only for widely published maker specs you are confident in (e.g. Eheim Classic 250 = 440 L/h, up to 250 L). Put a light's recommended tank length in `fitsLength*` only when the maker states it or it is obvious from the model name (Twinstar 600S = 60 cm).

## 5. Finding specs

- Shopify retailers (Glass Aqua `shop.glassaqua.com`, Charterhouse `www.charterhouse-aquatics.com`, Twinstar official `twinstarstore.kr`): fetch `<sourceUrl>.json` (e.g. `https://shop.glassaqua.com/products/<handle>.json`). The `product.body_html` field holds the description and spec table. Use `curl -s -m 20 "<url>.json"` and parse with python. Variants in the JSON give per-model titles, SKUs and prices.
- SunSun and DOOA: the `specs` field in the input already holds the spec table.
- Dophin (KW Zone): fetch the `source_url` HTML and extract the description text.
- Boyu: the product pages only list model codes in text; spec tables are images. The images in the input list (usually the last 1–2) are often spec/size tables. Look at them with the Read tool when a product is worth including and read off the numbers.
- ADA (image files only, no data): use well-established ADA specs you are confident about; otherwise give fewer specs.
- Be polite to servers: fetch sequentially, not in parallel bursts.

## 6. Writing rules (important)

- **Our own words.** Specs are facts and fine to copy; retailer or maker marketing copy is not. Never paste description sentences.
- No em dashes (—) anywhere. Use commas, full stops or brackets.
- Conversational, practical, specific. Like a knowledgeable friend explaining it at their tank. Mixed sentence lengths.
- Value first, never salesy. No "buy now", "best ever", "premium quality", superlatives or hype. Honest about trade-offs.
- Focus on what matters to a planted-tank keeper: does it fit my tank size, how much flow/light, noise, heat, maintenance, how it looks in a scape, is it CO2/shrimp friendly.
- Brand is "Fin & Stem" voice; never mention Mike or any person.
- British/International spelling (litres, colour, aluminium).

## 7. Images

- Only product photos of the item itself (or it installed in a tank). Skip logos, banners, size charts with no product in them, certificates, generic lifestyle shots of fish, and images of other products.
- It is fine if a tank photo has plants/fish in it. What we never do is list livestock as a product.
- Order best first: clean product shot first. Max 4 (hardscape 5).
- If a file looks suspicious (wrong product, shared site banner), open it with the Read tool to check. You do not need to view every image; spot-check the first image of each product type and anything odd.
- Every kept product needs at least 1 image. If none are usable, drop the product.

## 8. Hardscape type slugs (for `hardscapeType`)

`seiryu-stone`, `dragon-stone` (Ohko), `lava-rock`, `pagoda-stone`, `petrified-wood`, `slate`, `texas-holey-rock`, `spider-wood`, `manzanita`, `mopani-wood`, `malaysian-driftwood`, `cholla-wood`. Only set it when the product clearly is that material. For hardscape `specs`, include (when known) "Effect on water" (e.g. "Inert", "Raises pH and hardness slightly", "Releases tannins, lowers pH slightly"), "Colour", "Texture", "Buoyancy" (wood: "Sinks", "Soak before use"), "Prep". Models are the size/weight options.

## 9. Final check before you finish

- Valid JSON (run `python3 -c "import json;json.load(open('<file>'))"`).
- No em dashes: `grep -c "—" <file>` must be 0.
- Every image path exists.
- ids unique, categories/subtypes only from §1.
- Report back: counts per category, anything you were unsure about, and anything you excluded that the user might want (one line each).
