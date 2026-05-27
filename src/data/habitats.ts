/**
 * Natural habitat snippet per species, a short sentence describing
 * where each one is found in the wild ("slow blackwater stream",
 * "leaf-littered forest pool", "fast oxygen-rich Himalayan stream").
 * Surfaced on the species profile so the reader can picture the
 * water this species evolved for, which is the cleanest hint at
 * what to recreate in the tank.
 *
 * Keep entries to a single short sentence (8-15 words). Where the
 * cultivar/colour-morph is bred from a wild ancestor, name the
 * ancestor's habitat so the keeper still gets the picture.
 */
export const HABITATS: Record<string, string> = {
  /* ── FISH ─────────────────────────────────────────────────────── */
  "neon-tetra": "Slow blackwater forest streams of the Amazon basin",
  "cardinal-tetra": "Tannin-stained streams of the upper Rio Negro, Brazil",
  "ember-tetra": "Quiet leaf-littered forest pools of the Araguaia basin",
  "chili-rasbora": "Tea-coloured peat-swamp pools of Borneo",
  "harlequin-rasbora": "Slow tropical streams and peat swamps of Sumatra",
  "celestial-pearl-danio":
    "Tiny grass-edged ponds and rice paddies of Myanmar",
  otocinclus: "Slow vegetated streams of the Amazon basin",
  "sparkling-gourami":
    "Stagnant rice paddies and roadside ditches of Vietnam",
  "pygmy-corydoras": "Sandy forest stream margins of the Madeira basin",
  "ram-cichlid": "Warm shallow llanos pools of the Orinoco basin",
  "rummynose-tetra": "Soft acidic igapó forest streams of the Rio Negro",
  "honey-gourami": "Slow weedy ponds and ditches of the Ganges plain",
  "apistogramma-cacatuoides":
    "Leaf-littered Amazonian forest streams and floodplains",
  "kuhli-loach": "Forest streams and peat-swamp creeks of Borneo",
  "sterbai-corydoras": "Shallow flooded forest of the Guaporé river basin",
  "cherry-barb": "Densely vegetated lowland streams of Sri Lanka",
  "endler-livebearer":
    "Hyper-warm coastal lagoons of north-east Venezuela",
  "marbled-hatchetfish": "Surface of slow shaded Amazon tributaries",
  "white-cloud-mountain-minnow":
    "Cool fast-flowing mountain streams near Guangzhou",
  "diamond-tetra": "Vegetated shore margins of Lake Valencia, Venezuela",
  "reticulated-hillstream-loach":
    "Fast oxygen-rich Himalayan foothill streams",
  "threadfin-rainbowfish":
    "Calm tannin-stained creeks of Cape York, Australia",
  "lemon-tetra": "Calm flooded forest of the Tapajós basin",
  "clown-killifish": "Small forest pools and rivulets of West Africa",
  "pearl-gourami": "Acidic lowland swamps and peat bogs of Borneo",
  "forktail-blue-eye": "Shallow rainforest streams of West Papua",
  "bristlenose-pleco": "Fast oxygenated rivers of the Amazon basin",
  "black-neon-tetra": "Slow soft-water streams of the Paraguay basin",
  "siamese-algae-eater":
    "Fast-flowing forest streams across mainland Indochina",
  "dwarf-pencilfish": "Tiny blackwater rivulets of the upper Rio Negro",
  "dwarf-puffer": "Slow weedy rivers of the Western Ghats, India",
  "apistogramma-agassizii":
    "Leaf-littered shallows along the Amazon mainstem",
  "black-phantom-tetra": "Slow forest streams of central Brazil",
  "glowlight-tetra": "Quiet tannin-stained streams of Guyana",
  guppy: "Warm shallow ponds and ditches of Trinidad and Venezuela",
  platy: "Slow weedy springs and pools of southern Mexico",
  "sailfin-molly": "Brackish coastal marshes of the Gulf of Mexico",
  swordtail: "Fast highland streams of Mexico and Honduras",
  "zebra-danio": "Cool seasonal streams and rice paddies of South Asia",
  "tiger-barb": "Clear forest streams of Sumatra and Borneo",
  "black-skirt-tetra":
    "Slow tributaries of the Paraguay and Guaporé rivers",
  "bronze-corydoras":
    "Slow vegetated rivers across most of South America",
  angelfish: "Slow forested backwaters of the Amazon and Orinoco",
  "red-tail-shark":
    "Clear forest streams of central Thailand (extinct in the wild)",

  /* ── PLANTS ───────────────────────────────────────────────────── */
  "anubias-nana": "Rocky margins of West African forest streams",
  "java-fern": "Splash-zone of rainforest waterfalls in Southeast Asia",
  "amazon-sword": "Marshes and slow margins of the Amazon basin",
  "cryptocoryne-wendtii": "Shaded lowland forest streams of Sri Lanka",
  "vallisneria-spiralis":
    "Slow rivers and lakes across the temperate world",
  "hygrophila-polysperma": "Marshes and pond edges across tropical Asia",
  bucephalandra: "Rocks in fast-flowing forest streams of Borneo",
  "dwarf-hairgrass":
    "Damp shorelines of temperate ponds and seasonal ditches",
  "monte-carlo": "Boggy clearings and stream banks of Argentina",
  "rotala-rotundifolia":
    "Wet rice paddies and roadside ditches of South Asia",
  "ludwigia-repens": "Swampy ditches and pond edges of the Americas",
  "staurogyne-repens": "Riverbanks of the Cristalino basin, Brazil",
  "hc-cuba":
    "Damp seasonal seepage zones of Cuba and Central America",
  "pogostemon-helferi":
    "Damp banks of Salween-basin streams in Myanmar",
  "salvinia-natans": "Still warm ponds and ditches worldwide",
  "bacopa-caroliniana":
    "Coastal swamps and marshes of the southern USA",
  "cryptocoryne-parva":
    "Heavily shaded mountain streams of Sri Lanka",
  "limnophila-sessiliflora":
    "Flooded rice paddies and marshes of tropical Asia",
  "glossostigma-elatinoides":
    "Damp lake margins of New Zealand and Tasmania",
  "lilaeopsis-brasiliensis":
    "Marshes and stream banks of southern Brazil",
  "marsilea-hirsuta": "Seasonally flooded grasslands of Australia",
  "amazon-frogbit": "Calm sun-warmed waterways of the Amazon basin",
  "hygrophila-pinnatifida":
    "Streams and rice fields of the Western Ghats, India",
  "aponogeton-crispus": "Seasonally flooded lowland pools of Sri Lanka",
  "lobelia-cardinalis-mini":
    "Wet meadows and stream banks of North America",
  "sagittaria-subulata": "Brackish tidal marshes of the eastern USA",
  "ludwigia-super-red":
    "Cultivated red form of Ludwigia, wild kin in tropical American swamps",
  pearlweed: "Damp wooded streams and bogs of Eurasia",
  "chain-sword": "Marshy floodplains of Central and South America",
  "needle-hairgrass":
    "Damp shorelines of temperate ponds and seasonal pools",
  "cryptocoryne-lutea": "Heavily shaded forest streams of Sri Lanka",
  "java-fern-windelov":
    "Cultivar of Java fern, wild kin in Southeast Asian streams",
  "bolbitis-heudelotii":
    "Rocks in fast-flowing rivers of West Africa",
  "ranunculus-inundatus":
    "Boggy roadside pools of south-eastern Australia",
  "hygrophila-corymbosa":
    "Marshes and pond edges of tropical Asia",
  "water-wisteria":
    "Marshes and swampy pools of South and Southeast Asia",
  "brazilian-pennywort":
    "Slow-moving swamps and ditches of South America",
  "bacopa-monnieri":
    "Damp coastal mud flats and marshes worldwide",
  "anubias-barteri":
    "Rocks and roots in West African forest streams",
  cabomba:
    "Slow vegetated rivers and ponds across the Americas",
  anacharis: "Slow temperate ponds and ditches of North America",
  "red-tiger-lotus": "Slow weedy backwaters of the Nile basin",
  "cryptocoryne-balansae":
    "Fast-flowing limestone rivers of Indochina",
  "hydrocotyle-japan":
    "Cultivar of pennywort, wild kin on damp South-East Asian stream edges",

  /* ── SHRIMP ───────────────────────────────────────────────────── */
  "cherry-shrimp":
    "Cool weedy streams of Taiwan and southern China",
  "amano-shrimp": "Cool clear streams of Japan and Taiwan",
  "crystal-red-shrimp":
    "Bred from Bee shrimp, wild kin in southern Chinese streams",
  "ghost-shrimp": "Vegetated rivers and lakes of the southern USA",
  "blue-dream-shrimp":
    "Bred from Cherry shrimp, wild kin in Taiwanese streams",
  "yellow-shrimp":
    "Bred from Cherry shrimp, wild kin in Taiwanese streams",
  "bee-shrimp": "Soft acidic streams of southern China",
  "bamboo-shrimp": "Fast clear rivers of Southeast Asia",
  "snowball-shrimp":
    "Bred from Neocaridina, wild kin in Eastern Chinese streams",
  "blue-bolt-shrimp":
    "Bred from Caridina, wild kin in Chinese mountain streams",

  /* ── MOSSES ───────────────────────────────────────────────────── */
  "java-moss":
    "Tropical stream margins and waterfalls of Southeast Asia",
  "christmas-moss": "Wet rocks and roots in shaded Asian streams",
  "flame-moss":
    "Damp shaded banks of Southeast Asian streams",
  "weeping-moss":
    "Wet vertical surfaces in Chinese mountain streams",
  "peacock-moss":
    "Shaded splash zones of subtropical Asian streams",
  "spiky-moss":
    "Stream-side rocks in tropical Asian rainforest",
  "mini-christmas-moss":
    "Smaller-leaf cultivar of Christmas moss",
  "riccia-fluitans": "Calm sun-lit ponds and ditches worldwide",
  "phoenix-moss":
    "Wet rocks in fast-flowing Southeast Asian streams",
  sussewassertang:
    "A liverwort gametophyte, origin uncertain; cultivated worldwide",
};

/**
 * Look up the habitat sentence for a species slug. Falls back to a
 * generic phrase derived from the entry's category + origin so the
 * card always renders something useful, even for species we haven't
 * filled in yet.
 */
export function getHabitat(slug: string, fallback?: string): string {
  return HABITATS[slug] ?? fallback ?? "Native range unspecified";
}
