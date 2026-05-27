# Plant images — replacements needed

The second-pass audit (`scripts/audit-plant-images-2.py`) deleted 13 plant
images whose Wikimedia files were wrong-subject, terrestrial, or pre-1920
botanical illustrations. The catalogue card and species detail page both
gracefully fall back to an `ImageOff` placeholder when an image is
missing.

These slugs need replacement photos from an aquascaping retailer
(Tropica plant database, Aquasabi shop, Buce Plant, Glass Aqua) — the
retailers block automated scraping, so the replacement has to be done
by hand:

| Slug | Recommended source |
|------|--------------------|
| `monte-carlo` | https://tropica.com/en/plants/ (search Micranthemum tweediei) |
| `chain-sword` | https://tropica.com/en/plants/ (search Helanthium tenellum) |
| `pearlweed` | https://tropica.com/en/plants/ (search Micranthemum micranthemoides or Hemianthus glomeratus) |
| `ludwigia-super-red` | https://tropica.com/en/plants/ (search Ludwigia sp. 'Super Red' or Ludwigia palustris 'Super Red Mini') |
| `marsilea-hirsuta` | https://tropica.com/en/plants/ (search Marsilea hirsuta) |
| `lobelia-cardinalis-mini` | https://tropica.com/en/plants/ (search Lobelia cardinalis 'Mini') |
| `glossostigma-elatinoides` | https://tropica.com/en/plants/ (search Glossostigma elatinoides) |
| `ranunculus-inundatus` | https://tropica.com/en/plants/ (search Ranunculus inundatus) |
| `needle-hairgrass` | https://tropica.com/en/plants/ (search Eleocharis acicularis) |
| `dwarf-hairgrass` | https://tropica.com/en/plants/ (search Eleocharis parvula or 'Mini') |
| `lilaeopsis-brasiliensis` | https://tropica.com/en/plants/ (search Lilaeopsis brasiliensis) |
| `rotala-hra` | https://tropica.com/en/plants/ (search Rotala rotundifolia 'H'ra' — distinct from plain rotundifolia) |
| `java-fern-trident` | https://tropica.com/en/plants/ (search Microsorum pteropus 'Trident') |

**Process for each replacement** (next time):

1. Open the Tropica plant detail page.
2. Right-click → save the hero image into
   `public/images/catalogue/plants/<slug>.jpg`.
3. Open `src/data/image-attribution.ts` and add an entry:
   ```ts
   "<slug>": {
     "alt": "Common Name (Scientific name) — submerged form",
     "author": "Tropica Aquarium Plants",
     "category": "plants",
     "credit": "",
     "descriptionUrl": "<the tropica.com plant page URL>",
     "fileTitle": "",
     "height": <px>,
     "license": "Tropica catalogue",
     "slug": "<slug>",
     "src": "/images/catalogue/plants/<slug>.jpg",
     "width": <px>,
     "wikipediaUrl": ""
   },
   ```
4. `pnpm build` and commit.

The CLAUDE.md project policy explicitly allows retailer-catalogue
photography "where the more obscure species need coverage" — these
fall into that bucket because Wikimedia Commons does not have
photos of these plants in their aquarium-submerged form.

## What's replaced this pass

- `bacopa-monnieri` — new photo from
  https://commons.wikimedia.org/wiki/File:Bacopa_monnieri_aquarium_plant.jpg
  (Izabela1958 · CC BY-SA 4.0). The previous version was the
  Forest & Kim Starr USDA terrestrial mat photo.
