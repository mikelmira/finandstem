# Fin & Stem — Scientific Illustration Brief

A brief for an illustrator commissioned to produce per-species line
drawings for the Fin & Stem catalogue.

---

## 1. The project

Fin & Stem is a planted-aquarium reference site — a modern field
guide for aquascapers. The visual direction is **warm cream
parchment / herbarium**: deep forest-green ink on aged paper, with a
bold modern sans-serif (Bricolage Grotesque) for headlines and
editorial chrome.

The illustrations sit as a small annotation card overlapping the
bottom-left corner of each species' hero photograph — reading as a
field-guide margin sketch beside the live specimen. They are also
used as the species' identity glyph in browse cards and pillar
modules at smaller sizes.

Live site: <https://finandstem.com>
GitHub: <https://github.com/mikelmira/finandstem>

---

## 2. Style direction

### Reference visuals

Closest matches to the look we want:

| Reference | Why |
|---|---|
| **Ernst Haeckel** "Kunstformen der Natur" plates | Confident outline + light interior shading; reads as scientific not decorative |
| **Biodiversity Heritage Library** (Victorian field guide plates) | The platonic ideal of "field-guide drawing" |
| Modern botanical illustrators (e.g. **Katie Scott**, **Cristina Daura**) | Updated take on the same lineage |
| Tropica plant database (their drawings, not photos) | The proportion / framing language we're closest to |
| The **Plantralia** mobile-app concept on Behance | The plate-on-cream context this drops into |

### Visual qualities we want

- **Confident, hand-drawn quality.** Slight irregularity is good — these aren't CAD diagrams.
- **Stroke-based**, not filled blocks of colour. Think pen-and-ink, not flat illustration.
- **Anatomically correct** — the silhouette should read as the actual species, not a generic fish/plant shape.
- **Recognisable at small sizes.** They'll appear as small as 24 px in some UI surfaces, so silhouette clarity > detail density.
- **Hierarchy via stroke weight + opacity.** Primary outline = full opacity; veining, scales, gill cover, secondary fins = 0.4–0.6 opacity.
- **Single colour.** All ink in one colour, which the site re-tints via CSS. No multi-colour palettes inside a drawing.

### Anti-patterns

- ❌ Cartoon eyes, big smiles, anthropomorphic features.
- ❌ Decorative flourishes that aren't anatomy (no bubbles, plant frames, etc.).
- ❌ Heavy black fills — the page is cream and the ink is dark green, but the *drawing* should feel breathable.
- ❌ Photoreal shading or gradient colouring.
- ❌ Generic clip-art fish/plant icons. Each species should look like its species.

---

## 3. Technical specs

### Format

- **Deliverable**: one `.svg` file per species, hand-coded paths or exported cleanly from Figma / Illustrator / Affinity Designer / Procreate (vector pipeline).
- No embedded raster (`<image>` tags). Pure vector paths.
- `stroke="currentColor"` on all strokes so the site theme tints them.
- `fill="none"` on outline paths; `fill="currentColor"` only for filled details (eye pupils, small accent dots).
- Stroke-width **1.5** as the baseline (will scale via CSS). Secondary detail can be **1**.
- `stroke-linecap="round"` and `stroke-linejoin="round"` throughout.
- Use `opacity="0.4"`–`"0.6"` on secondary detail lines.

### ViewBox standards

To swap cleanly into the existing components, please match these viewBoxes:

| Category | viewBox | Approx. usage |
|---|---|---|
| Fish | `0 0 200 120` | All body shapes — fill the canvas as appropriate, centred vertically |
| Plants | `0 0 120 180` | Substrate at the bottom (y ≈ 168), plant rising upward |
| Shrimp | `0 0 200 120` | Profile view, body filling most of the canvas |
| Moss | `0 0 160 110` | Substrate strip at bottom (y ≈ 90), fronds rising |

### File size

- Each SVG ≤ 30 KB uncompressed.
- Round all coordinates to 1 decimal place (`172.0` is fine; `172.183027` is not).
- Strip Illustrator/Figma metadata before delivery (run through SVGO with default settings).

### Naming

- File name = the species slug (lowercased, hyphenated). Examples:
  - `neon-tetra.svg`
  - `anubias-nana.svg`
  - `cherry-shrimp.svg`
  - `java-moss.svg`
- Slug list is in section 7 below — please use the exact slugs.

---

## 4. What to include per category

### Fish — profile (side) view

Required:
- Confident body outline including caudal (tail) fin
- Eye with visible pupil
- Operculum (gill cover) line — subtle, secondary opacity
- Dorsal fin (top, mid-body)
- Pectoral fin (behind operculum)
- Pelvic fin (belly, mid-body)
- Anal fin (belly, near tail)
- Mouth indication

Encouraged when characteristic:
- Lateral stripe / spot / vertical bars at secondary opacity
- Barbels for catfish / loaches
- Thread filament fins for gouramis
- Adipose fin for catfish / characins
- Scales suggested through subtle texture (NOT detailed all over — a small region only)

Omit:
- Background, bubbles, plants
- Water surface

### Plants — full plant, substrate-attached or floating

Required:
- Root system or rhizome (visible at the substrate line)
- Stem(s) or central crown
- All major leaves (typical leaf count for the species, not exaggerated)
- Substrate line or attachment point

Encouraged:
- Leaf veining at secondary opacity
- Leaf-edge detail (serration, waviness) where species-characteristic
- Daughter plant / runner where the species reproduces visibly that way
- Flower / spathe where the species shows them above the substrate

Omit:
- Water column, bubbles, other species
- Soil texture beyond a simple horizon line

### Shrimp — profile (side) view

Required:
- Body in characteristic C-curve or extended posture
- Rostrum (spike from head)
- Eye
- Antennae (1 long, 1 shorter pair typical of dwarf shrimp)
- Walking legs (3–5 visible)
- Swimmerets (pleopods) under the abdomen
- Tail fan (uropods + telson)
- Body segments suggested via subtle dorsal lines

Encouraged when characteristic:
- Saddle / markings on the back (e.g. Crystal Red banding) at secondary opacity
- Egg cluster ("berry") under the abdomen for adult females — optional

### Mosses & liverworts — a representative cluster

Required:
- Substrate or attachment surface
- Cluster of 5–10 fronds / leaflets showing the species' characteristic shape
- Soft dome / cushion silhouette (most mosses grow this way)
- Tip detail showing leaflet arrangement

Encouraged:
- A separate close-up "detail" element off to the side showing one frond enlarged (à la Victorian plates) — optional

---

## 5. Scope & phasing

There are **88 species** in the current catalogue. We don't need every drawing on day one. Recommended phasing:

### Phase 1 — Body-type templates (13 drawings)

These already exist in code as fallback silhouettes; the goal is to replace them with high-quality versions so every species gets at least a "matched body type" drawing immediately.

| Template | Body type | Representative species |
|---|---|---|
| `fish-slim.svg` | Slim torpedo | Neon Tetra |
| `fish-stocky.svg` | Stocky perciform | Cherry Barb |
| `fish-gourami.svg` | Laterally compressed + thread ventrals | Honey Gourami |
| `fish-eel.svg` | Elongated tube | Kuhli Loach |
| `fish-catfish.svg` | Bottom-dweller with barbels | Pygmy Corydoras |
| `fish-livebearer.svg` | Small body + fan tail | Endler's Livebearer |
| `plant-stem.svg` | Vertical stem with paired leaves | Rotala rotundifolia |
| `plant-rosette.svg` | Broad lanceolate leaves from a central crown | Amazon Sword |
| `plant-rhizome.svg` | Horizontal rhizome with upright leaves | Anubias Barteri Nana |
| `plant-carpet.svg` | Short upright shoots from a horizontal runner | Monte Carlo |
| `plant-floating.svg` | Leaves at surface + hanging roots | Amazon Frogbit |
| `plant-grass.svg` | Long strap blades from a tight crown | Vallisneria Spiralis |
| `moss-default.svg` | Frond cluster on a substrate | Java Moss |
| `shrimp-default.svg` | C-curve dwarf shrimp profile | Red Cherry Shrimp |

**Phase 1 = ~14 drawings** and every species in the catalogue gets a matched silhouette overnight.

### Phase 2 — Per-species (74 additional drawings)

One unique drawing per species, gradually filling in alongside the templates. Order of priority below in section 7.

### Brand marks (4 drawings)

Tiny 32×32 icons used in eyebrow rows, browse cards, pills. Currently exist as basic SVG placeholders — we'd accept a polished pass on these too, but they're lower priority than the plates.

| Mark | Slug |
|---|---|
| Fish glyph | `mark-fish.svg` |
| Plant glyph | `mark-plant.svg` |
| Shrimp glyph | `mark-shrimp.svg` |
| Moss glyph | `mark-moss.svg` |

These should be **bolder** than the plates (single-stroke silhouette, no interior detail) — they need to read at 16 px.

---

## 6. Delivery checklist

- [ ] One SVG per species, named with the slug from the species list (section 7).
- [ ] All paths use `stroke="currentColor"`, no hard-coded hex colours.
- [ ] No embedded raster, no Illustrator/Figma metadata, no clipPaths unless essential.
- [ ] ViewBox matches the category standard.
- [ ] File ≤ 30 KB each.
- [ ] Visually tested at 24 px, 80 px, and 280 px — silhouette legible at all three.
- [ ] Delivered in a zip + an index `index.md` mapping slug → species name → file path.

---

## 7. Full species list

The slug is the canonical file name. Scientific name in italics is for the illustrator's reference.

### Fish (34 species)

| Priority | Slug | Common name | Scientific name | Body type |
|---|---|---|---|---|
| ★ | `neon-tetra` | Neon Tetra | *Paracheirodon innesi* | slim |
| ★ | `cardinal-tetra` | Cardinal Tetra | *Paracheirodon axelrodi* | slim |
| ★ | `ember-tetra` | Ember Tetra | *Hyphessobrycon amandae* | slim |
| ★ | `chili-rasbora` | Chili Rasbora | *Boraras brigittae* | slim |
| ★ | `harlequin-rasbora` | Harlequin Rasbora | *Trigonostigma heteromorpha* | slim |
| ★ | `celestial-pearl-danio` | Celestial Pearl Danio | *Danio margaritatus* | slim |
| ★ | `pygmy-corydoras` | Pygmy Corydoras | *Corydoras pygmaeus* | catfish |
| ★ | `otocinclus` | Otocinclus (Common) | *Otocinclus vittatus* | catfish |
| ★ | `honey-gourami` | Honey Gourami | *Trichogaster chuna* | gourami |
| ★ | `cherry-barb` | Cherry Barb | *Puntius titteya* | stocky |
| ★ | `kuhli-loach` | Kuhli Loach | *Pangio kuhlii* | eel |
| ★ | `endler-livebearer` | Endler's Livebearer | *Poecilia wingei* | livebearer |
| | `rummynose-tetra` | Rummynose Tetra | *Hemigrammus rhodostomus* | slim |
| | `sparkling-gourami` | Sparkling Gourami | *Trichopsis pumila* | gourami |
| | `pearl-gourami` | Pearl Gourami | *Trichopodus leerii* | gourami |
| | `ram-cichlid` | German Blue Ram | *Mikrogeophagus ramirezi* | stocky |
| | `apistogramma-cacatuoides` | Cockatoo Dwarf Cichlid | *Apistogramma cacatuoides* | stocky |
| | `apistogramma-agassizii` | Agassiz's Dwarf Cichlid | *Apistogramma agassizii* | stocky |
| | `sterbai-corydoras` | Sterbai Corydoras | *Corydoras sterbai* | catfish |
| | `bristlenose-pleco` | Bristlenose Pleco | *Ancistrus cirrhosus* | catfish |
| | `siamese-algae-eater` | Siamese Algae Eater | *Crossocheilus oblongus* | slim |
| | `reticulated-hillstream-loach` | Reticulated Hillstream Loach | *Sewellia lineolata* | catfish |
| | `marbled-hatchetfish` | Marbled Hatchetfish | *Carnegiella strigata* | stocky |
| | `white-cloud-mountain-minnow` | White Cloud Mountain Minnow | *Tanichthys albonubes* | slim |
| | `diamond-tetra` | Diamond Tetra | *Moenkhausia pittieri* | slim |
| | `threadfin-rainbowfish` | Threadfin Rainbowfish | *Iriatherina werneri* | slim |
| | `lemon-tetra` | Lemon Tetra | *Hyphessobrycon pulchripinnis* | slim |
| | `clown-killifish` | Clown Killifish | *Epiplatys annulatus* | slim |
| | `forktail-blue-eye` | Forktail Blue-Eye | *Pseudomugil furcatus* | slim |
| | `black-neon-tetra` | Black Neon Tetra | *Hyphessobrycon herbertaxelrodi* | slim |
| | `dwarf-pencilfish` | Dwarf Pencilfish | *Nannostomus marginatus* | slim |
| | `dwarf-puffer` | Dwarf Puffer | *Carinotetraodon travancoricus* | stocky |
| | `black-phantom-tetra` | Black Phantom Tetra | *Hyphessobrycon megalopterus* | slim |
| | `glowlight-tetra` | Glowlight Tetra | *Hemigrammus erythrozonus* | slim |

### Plants (34 species)

| Priority | Slug | Common name | Scientific name | Body type |
|---|---|---|---|---|
| ★ | `anubias-nana` | Anubias Barteri Nana | *Anubias barteri var. nana* | rhizome |
| ★ | `java-fern` | Java Fern | *Microsorum pteropus* | rhizome |
| ★ | `amazon-sword` | Amazon Sword | *Echinodorus bleheri* | rosette |
| ★ | `cryptocoryne-wendtii` | Cryptocoryne Wendtii | *Cryptocoryne wendtii* | rosette |
| ★ | `vallisneria-spiralis` | Vallisneria Spiralis | *Vallisneria spiralis* | grass |
| ★ | `dwarf-hairgrass` | Dwarf Hairgrass | *Eleocharis parvula* | grass |
| ★ | `monte-carlo` | Monte Carlo | *Micranthemum tweediei* | carpet |
| ★ | `rotala-rotundifolia` | Rotala Rotundifolia | *Rotala rotundifolia* | stem |
| ★ | `bucephalandra` | Bucephalandra (mixed) | *Bucephalandra sp.* | rhizome |
| ★ | `salvinia-natans` | Floating Watermoss | *Salvinia natans* | floating |
| | `hygrophila-polysperma` | Dwarf Hygrophila | *Hygrophila polysperma* | stem |
| | `ludwigia-repens` | Ludwigia Repens | *Ludwigia repens* | stem |
| | `staurogyne-repens` | Staurogyne Repens | *Staurogyne repens* | stem |
| | `hc-cuba` | Dwarf Baby Tears (HC Cuba) | *Hemianthus callitrichoides 'Cuba'* | carpet |
| | `pogostemon-helferi` | Pogostemon Helferi (Downoi) | *Pogostemon helferi* | rosette |
| | `bacopa-caroliniana` | Bacopa Caroliniana | *Bacopa caroliniana* | stem |
| | `cryptocoryne-parva` | Cryptocoryne Parva | *Cryptocoryne parva* | rosette |
| | `limnophila-sessiliflora` | Asian Ambulia | *Limnophila sessiliflora* | stem |
| | `glossostigma-elatinoides` | Glossostigma | *Glossostigma elatinoides* | carpet |
| | `lilaeopsis-brasiliensis` | Micro Sword | *Lilaeopsis brasiliensis* | carpet |
| | `marsilea-hirsuta` | Four-Leaf Clover | *Marsilea hirsuta* | carpet |
| | `amazon-frogbit` | Amazon Frogbit | *Limnobium laevigatum* | floating |
| | `hygrophila-pinnatifida` | Hygrophila Pinnatifida | *Hygrophila pinnatifida* | rhizome |
| | `aponogeton-crispus` | Aponogeton Crispus | *Aponogeton crispus* | rosette |
| | `lobelia-cardinalis-mini` | Lobelia Cardinalis 'Mini' | *Lobelia cardinalis 'Small Form'* | stem |
| | `sagittaria-subulata` | Dwarf Sagittaria | *Sagittaria subulata* | grass |
| | `ludwigia-super-red` | Ludwigia 'Super Red' | *Ludwigia palustris 'Super Red'* | stem |
| | `pearlweed` | Pearlweed | *Hemianthus glomeratus* | stem |
| | `chain-sword` | Chain Sword | *Helanthium tenellum* | rosette |
| | `needle-hairgrass` | Needle Hairgrass | *Eleocharis acicularis* | grass |
| | `cryptocoryne-lutea` | Cryptocoryne Lutea | *Cryptocoryne lutea* | rosette |
| | `java-fern-windelov` | Java Fern 'Windelov' | *Microsorum pteropus 'Windelov'* | rhizome |
| | `bolbitis-heudelotii` | African Water Fern | *Bolbitis heudelotii* | rhizome |
| | `ranunculus-inundatus` | Ranunculus Inundatus | *Ranunculus inundatus* | rosette |

### Shrimp (10 species)

| Priority | Slug | Common name | Scientific name |
|---|---|---|---|
| ★ | `cherry-shrimp` | Red Cherry Shrimp | *Neocaridina davidi var. rili* |
| ★ | `amano-shrimp` | Amano Shrimp | *Caridina multidentata* |
| ★ | `crystal-red-shrimp` | Crystal Red Shrimp | *Caridina cantonensis* |
| | `ghost-shrimp` | Ghost / Glass Shrimp | *Palaemonetes paludosus* |
| | `blue-dream-shrimp` | Blue Dream Shrimp | *Neocaridina davidi 'Blue Dream'* |
| | `yellow-shrimp` | Yellow Neocaridina | *Neocaridina davidi 'Yellow'* |
| | `bee-shrimp` | Bee Shrimp (wild) | *Caridina cantonensis* |
| | `bamboo-shrimp` | Bamboo / Wood Shrimp | *Atyopsis moluccensis* |
| | `snowball-shrimp` | Snowball Shrimp | *Neocaridina zhangjiajiensis* |
| | `blue-bolt-shrimp` | Blue Bolt Shrimp | *Caridina cantonensis 'Blue Bolt'* |

> Note: most freshwater dwarf shrimp share a near-identical silhouette
> — the colour is what differentiates them in life. Since our drawings
> are single-colour, several entries (cherry / yellow / blue dream /
> snowball, all *Neocaridina davidi*) can share one master drawing,
> tinted by CSS at the page level. Bamboo and Amano shrimp warrant
> unique drawings (different body shapes).

### Mosses (10 species)

| Priority | Slug | Common name | Scientific name |
|---|---|---|---|
| ★ | `java-moss` | Java Moss | *Taxiphyllum barbieri* |
| ★ | `christmas-moss` | Christmas Moss | *Vesicularia montagnei* |
| ★ | `riccia-fluitans` | Riccia / Crystalwort | *Riccia fluitans* |
| | `flame-moss` | Flame Moss | *Taxiphyllum 'Flame'* |
| | `weeping-moss` | Weeping Moss | *Vesicularia ferriei* |
| | `peacock-moss` | Peacock Moss | *Taxiphyllum 'Peacock'* |
| | `spiky-moss` | Spiky Moss | *Taxiphyllum 'Spiky'* |
| | `mini-christmas-moss` | Mini Christmas Moss | *Vesicularia montagnei 'Mini'* |
| | `phoenix-moss` | Phoenix Moss / Fissidens | *Fissidens fontanus* |
| | `sussewassertang` | Süßwassertang / Mini Pellia | *Lomariopsis lineata* |

---

## 8. Questions to flag to the illustrator

- We're comfortable with **stylistic interpretation** as long as the silhouette is anatomically faithful. The drawings don't have to be hyper-detailed — Victorian field-guide engravings are a closer reference than scientific monographs.
- If a species has multiple colour morphs (e.g. cherry shrimp comes in red / yellow / blue / snow) and the silhouettes are identical, one master drawing is fine.
- The illustrator is welcome to add **one species-characteristic detail** beyond the basic anatomy (a stripe, a spot, a barbel, a flower spathe) — but keep it at secondary opacity.

## 9. Budget hint

If you want a rough range to negotiate: a competent botanical/scientific illustrator on Behance or Working Not Working bills **~$60–150 per drawing** for single-colour SVG outline work, more if they're doing original watercolour-to-vector. Phase 1 (14 drawings) should land in the **$1k–2k** range; full Phase 2 (74 additional) at **$5k–10k** depending on artist seniority.

---

*Last updated: May 14, 2026 · Brief written for Fin & Stem catalogue
illustration commission.*
