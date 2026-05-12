"""Build the enriched Fin & Stem seed catalogue (v2).

Sheets:
  README              — guide to schema and licensing
  Fish                — 10 fish, summary + deep detail columns
  Plants              — 10 plants, summary + deep detail columns
  Shrimp              — 10 shrimp, summary + deep detail columns
  Mosses              — 10 mosses, summary + deep detail columns
  Images              — 5 image slots per species (40 species × 5 = 200 rows)
                        pre-populated with Wikipedia + Commons category URLs;
                        scrape_images.py / fetch_images.py fills in the rest.

Output: aquascaping-catalogue-seed.xlsx
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

from species_detail import FISH_DETAIL, PLANT_DETAIL, SHRIMP_DETAIL, MOSS_DETAIL

wb = Workbook()

HEADER_FILL = PatternFill("solid", start_color="1F4E78")
HEADER_FONT = Font(name="Arial", bold=True, color="FFFFFF", size=11)
SECTION_FILL = PatternFill("solid", start_color="2E75B6")  # lighter section header
SECTION_FONT = Font(name="Arial", bold=True, color="FFFFFF", size=10)
BODY_FONT = Font(name="Arial", size=10)
ALT_FILL = PatternFill("solid", start_color="F2F7FB")
WRAP = Alignment(wrap_text=True, vertical="top")
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
THIN = Side(style="thin", color="BFBFBF")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)


def style_sheet(ws, headers, col_widths):
    for i, w in enumerate(col_widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.row_dimensions[1].height = 42
    for col, h in enumerate(headers, 1):
        c = ws.cell(row=1, column=col, value=h)
        c.fill = HEADER_FILL
        c.font = HEADER_FONT
        c.alignment = CENTER
        c.border = BORDER
    ws.freeze_panes = "C2"


def write_rows(ws, rows, tall_rows=False):
    for r_idx, row in enumerate(rows, start=2):
        fill = ALT_FILL if r_idx % 2 == 0 else None
        for c_idx, val in enumerate(row, start=1):
            cell = ws.cell(row=r_idx, column=c_idx, value=val)
            cell.font = BODY_FONT
            cell.alignment = WRAP
            cell.border = BORDER
            if fill:
                cell.fill = fill
        ws.row_dimensions[r_idx].height = 240 if tall_rows else 60


# ----------------------------------------------------------------------------
# README sheet
# ----------------------------------------------------------------------------
ws = wb.active
ws.title = "README"
ws.column_dimensions["A"].width = 22
ws.column_dimensions["B"].width = 120

intro = [
    ("Fin & Stem — Seed Catalogue (v2)", ""),
    ("", ""),
    ("Purpose", "Reference-grade seed dataset for the Next.js + Payload CMS catalogue site. Each sheet maps 1:1 to a Payload collection. Each column maps to a field."),
    ("What's new in v2", "Per-species deep detail columns added after the summary block. Habitat, sexing, breeding, color forms/grades, diseases, tank setup, named good/bad tank mates, etymology, common misconceptions, pro tips, common mistakes, price range, etc."),
    ("Reading the sheets", "Columns up to and including 'Care Summary' are the original 'profile-book' summary fields shown prominently on each species page. Columns after that are the deep-reference body content — render on the detail page below the summary block."),
    ("Image sourcing", "See the 'Images' sheet. Each species gets 5 image slots pre-populated with its Wikipedia article URL and its Commons category URL. Run `fetch_images.py` locally (it needs internet access to the Wikimedia APIs) and it will fill in fileUrl / license / author / attribution for each slot. The catalogue tools in this folder cannot reach Wikimedia from a sandboxed environment, so the scrape is intentionally a local one-shot."),
    ("Image licensing rule", "Wikimedia Commons images are CC-BY-SA, CC-BY, or CC0. Commercial use is allowed if attribution is rendered. EVERY image render on the site MUST include: author · license · link to the Commons file page. For CC-BY-SA, any modified/cropped version must also be CC-BY-SA."),
    ("Schema notes", "Numeric ranges (temp, pH, dGH, TDS, lifespan, adult size) are stored as 'min–max' strings for readability. Split them into two numeric fields (e.g. tempMinC, tempMaxC) at Payload import time so you can build range-overlap filters."),
    ("Difficulty scale", "1 = Beginner. 2 = Easy. 3 = Intermediate. 4 = Advanced. 5 = Expert."),
    ("Light scale", "Low / Medium / High — measured in PAR at substrate (rough guide: Low ≤ 30 PAR, Medium 30–60, High ≥ 60)."),
    ("CO2 scale", "None / Optional / Recommended / Required."),
    ("Sheets in this file", "README, Fish (10), Plants (10), Shrimp (10), Mosses (10), Images (200 rows = 40 species × 5 slots)."),
    ("Source files", "build_catalogue_v2.py builds this xlsx. species_detail.py contains the deep detail content. fetch_images.py fetches images from Wikimedia."),
]
for r, (k, v) in enumerate(intro, start=1):
    a = ws.cell(row=r, column=1, value=k)
    b = ws.cell(row=r, column=2, value=v)
    a.font = Font(name="Arial", bold=(r == 1), size=14 if r == 1 else 10)
    b.font = Font(name="Arial", size=10)
    b.alignment = Alignment(wrap_text=True, vertical="top")
    if r > 1:
        ws.row_dimensions[r].height = 50
ws.merge_cells("A1:B1")
ws["A1"].alignment = Alignment(horizontal="left", vertical="center")


# ----------------------------------------------------------------------------
# FISH SHEET
# ----------------------------------------------------------------------------

# --- Summary columns (kept verbatim from v1)
fish_summary_headers = [
    "ID", "Slug", "Common Name", "Scientific Name", "Family", "Origin",
    "Adult Size (cm)", "Min Tank Size (L)", "Water Column",
    "Temperament", "Schooling", "Min Group Size",
    "Diet", "Feeding Notes",
    "Temp (°C)", "pH", "dGH", "Lifespan (yrs)",
    "Difficulty (1-5)", "Plant Safe", "Shrimp Safe", "Breeding Difficulty",
    "Care Summary",
]
# --- Deep detail columns (NEW)
fish_detail_headers = [
    "Habitat (Natural)", "Wild Diet", "Sexing", "Breeding Detail",
    "Color Forms / Variants", "Common Diseases", "Tank Setup",
    "Good Tank Mates", "Bad Tank Mates", "Quarantine", "Conservation Status",
    "Price Range (USD)", "Etymology", "Common Misconceptions", "Pro Tips",
]
fish_headers = fish_summary_headers + fish_detail_headers

fish_summary = [
    [
        "fish-001", "neon-tetra", "Neon Tetra", "Paracheirodon innesi",
        "Characidae", "Upper Amazon basin, South America",
        "3.5–4 cm", "60 L", "Mid",
        "Peaceful", "Yes", 10,
        "Omnivore", "Crushed flake, micro pellets, daphnia, baby brine shrimp. Eats 1–2x daily.",
        "20–26", "5.5–7.0", "1–8", "5–8",
        2, "Yes", "Yes (with adults; may eat shrimplets)", "Hard",
        "Hardy beginner classic. Looks dull in bright tanks — dark substrate and floating plants bring out the neon stripe. Keep in groups of 10+ for natural shoaling behaviour.",
    ],
    [
        "fish-002", "cardinal-tetra", "Cardinal Tetra", "Paracheirodon axelrodi",
        "Characidae", "Upper Orinoco and Rio Negro basins",
        "4–5 cm", "75 L", "Mid",
        "Peaceful", "Yes", 8,
        "Omnivore", "Micro pellets, frozen daphnia, baby brine shrimp, finely crushed flake.",
        "23–27", "4.5–6.5", "1–6", "4–6",
        3, "Yes", "Mostly (may eat shrimplets)", "Hard",
        "Brighter and slightly more demanding than the neon — prefers soft, warm, acidic water. Stunning in a dark-substrate Amazon biotope.",
    ],
    [
        "fish-003", "ember-tetra", "Ember Tetra", "Hyphessobrycon amandae",
        "Characidae", "Rio das Mortes basin, Brazil",
        "2 cm", "40 L", "Mid",
        "Peaceful", "Yes", 8,
        "Omnivore", "Micro pellets, crushed flake, baby brine shrimp. Small mouth — keep food fine.",
        "23–29", "5.5–7.0", "1–10", "2–4",
        2, "Yes", "Yes (adults safe with adult shrimp)", "Medium",
        "Excellent nano-tank fish. Glowing orange colour pops against green plants and dark wood. Tolerates a wide pH range once acclimated.",
    ],
    [
        "fish-004", "chili-rasbora", "Chili Rasbora", "Boraras brigittae",
        "Cyprinidae", "Southwestern Borneo blackwater swamps",
        "1.7–2 cm", "30 L", "Mid to Top",
        "Peaceful", "Yes", 10,
        "Micropredator", "Powder fry food, micro pellets, baby brine shrimp, microworms.",
        "24–28", "4.0–6.5", "1–4", "3–4",
        3, "Yes", "Yes (adults and adult shrimp)", "Hard",
        "True nano fish — shines in a planted blackwater scape with botanicals and tannins. Easily out-competed by larger tank mates; best as a species-only display.",
    ],
    [
        "fish-005", "harlequin-rasbora", "Harlequin Rasbora", "Trigonostigma heteromorpha",
        "Cyprinidae", "Thailand, Malaysia, Sumatra",
        "4–5 cm", "60 L", "Mid",
        "Peaceful", "Yes", 8,
        "Omnivore", "Flake, micro pellets, frozen bloodworms, daphnia.",
        "22–28", "5.5–7.5", "2–12", "5–8",
        1, "Yes", "Mostly (may eat shrimplets)", "Medium",
        "Bulletproof beginner schooler. The black wedge marking is iconic. Pairs well with rummynose tetras and corydoras in a community planted tank.",
    ],
    [
        "fish-006", "celestial-pearl-danio", "Celestial Pearl Danio", "Danio margaritatus",
        "Cyprinidae", "Hopong area, Myanmar",
        "2–2.5 cm", "40 L", "Mid to Bottom",
        "Peaceful (males spar)", "Yes (loose shoal)", 6,
        "Micropredator", "Micro pellets, baby brine shrimp, daphnia, microworms.",
        "20–24", "6.5–7.5", "2–10", "3–5",
        2, "Yes", "Yes (adult shrimp)", "Medium",
        "Cooler-water nano gem — keep below 25 °C for best colour and lifespan. Males display brightest with females present and dense plant cover.",
    ],
    [
        "fish-007", "otocinclus", "Otocinclus (Common)", "Otocinclus vittatus",
        "Loricariidae", "Northern and central South America",
        "3.5–5 cm", "60 L", "Bottom (grazes everywhere)",
        "Peaceful", "Yes", 6,
        "Herbivore (algae)", "Soft green algae, blanched zucchini, courgette, Repashy Soilent Green. Will starve in a clean new tank.",
        "20–26", "6.0–7.5", "2–10", "3–5",
        3, "Yes", "Yes", "Very hard (rarely bred in captivity)",
        "Best biofilm/algae eater for planted tanks. Only add to a tank with established biofilm and soft green algae. Sensitive to stress — acclimate slowly.",
    ],
    [
        "fish-008", "sparkling-gourami", "Sparkling Gourami", "Trichopsis pumila",
        "Osphronemidae", "Southeast Asia (Mekong, Chao Phraya)",
        "3.5–4 cm", "40 L", "Mid to Top",
        "Peaceful (mild male sparring)", "Loose group", 4,
        "Micropredator", "Micro pellets, daphnia, mosquito larvae, brine shrimp.",
        "22–28", "6.0–7.5", "2–10", "4–5",
        2, "Yes", "Mostly", "Medium (bubble-nester)",
        "Labyrinth fish — surface access required. Makes audible 'croaks' from the swim-bladder, especially during courtship. Calm slow currents preferred.",
    ],
    [
        "fish-009", "pygmy-corydoras", "Pygmy Corydoras", "Corydoras pygmaeus",
        "Callichthyidae", "Madeira River basin, Brazil",
        "2.5–3 cm", "40 L", "Mid (unusual for cory)",
        "Peaceful", "Yes", 8,
        "Omnivore (sinking)", "Sinking micro pellets, crushed flake on the substrate, baby brine shrimp, bloodworms.",
        "22–26", "6.0–7.5", "2–10", "3–4",
        2, "Yes", "Yes (adult shrimp)", "Medium",
        "Unlike most corys, swims mid-water in tight shoals. Soft, fine sand substrate protects barbels. Combine with chili rasboras or ember tetras for a stunning nano scape.",
    ],
    [
        "fish-010", "ram-cichlid", "German Blue Ram", "Mikrogeophagus ramirezi",
        "Cichlidae", "Orinoco basin, Venezuela & Colombia",
        "5–7 cm", "75 L (pair)", "Mid to Bottom",
        "Peaceful (territorial when breeding)", "Pair", 2,
        "Omnivore", "Quality flake, micro pellets, frozen brine shrimp, bloodworms.",
        "26–30", "5.0–7.0", "1–8", "2–3",
        4, "Yes", "Risky with dwarf shrimp", "Medium",
        "Centrepiece dwarf cichlid for a planted Amazon-style scape. Demands warm, clean, soft water; sensitive to nitrate. A flat stone makes a perfect spawning site.",
    ],
    [
        "fish-011", "rummynose-tetra", "Rummynose Tetra", "Hemigrammus rhodostomus",
        "Characidae", "Lower Amazon basin, Brazil",
        "4.5–5.5 cm", "75 L", "Mid",
        "Peaceful", "Yes (tight shoal)", 10,
        "Omnivore", "Crushed flake, micro pellets, frozen daphnia, baby brine shrimp.",
        "22–27", "5.5–7.0", "2–8", "5–8",
        3, "Yes", "Mostly (may eat shrimplets)", "Hard",
        "The benchmark schooling fish — moves as a single organism. Bright red nose is a real-time water-quality gauge: fades when stressed, glows when content. Wants clean, slightly soft water and the company of 10+ of its own kind.",
    ],
    [
        "fish-012", "honey-gourami", "Honey Gourami", "Trichogaster chuna",
        "Osphronemidae", "India, Bangladesh, Nepal",
        "4–5 cm", "60 L", "Mid to Top",
        "Peaceful", "Pair or trio", 2,
        "Omnivore", "Micro pellets, flake, frozen daphnia, mosquito larvae. Smaller mouth than other gouramis — keep food fine.",
        "22–28", "6.0–7.5", "4–15", "4–8",
        1, "Yes", "Yes (adults)", "Medium (bubble-nester)",
        "The truly peaceful gourami — unlike the unpredictable dwarf gourami it's often mistaken for. Males turn buttercup-orange in breeding colour; females stay pale beige. Labyrinth organ means surface access is mandatory.",
    ],
    [
        "fish-013", "apistogramma-cacatuoides", "Cockatoo Dwarf Cichlid", "Apistogramma cacatuoides",
        "Cichlidae", "Upper Amazon basin, Peru & Brazil",
        "6–8 cm (male), 4–5 cm (female)", "75 L (pair)", "Mid to Bottom",
        "Peaceful (territorial when breeding)", "Harem (1 male, 2–3 females)", 2,
        "Carnivore", "Frozen bloodworms, brine shrimp, micro pellets. Live food triggers breeding behaviour.",
        "24–28", "5.5–7.5", "2–15", "3–5",
        3, "Yes", "Risky with dwarf shrimp", "Easy",
        "Far more forgiving than rams and just as charismatic. Males flare extended dorsal rays like a cockatoo crest. Harem-breeding species — give each female her own cave (half coconut shell, terracotta pot).",
    ],
    [
        "fish-014", "kuhli-loach", "Kuhli Loach", "Pangio kuhlii",
        "Cobitidae", "Java, Sumatra, Malay Peninsula",
        "8–10 cm", "75 L", "Bottom",
        "Peaceful", "Yes (loose group)", 6,
        "Omnivore (sinking, nocturnal)", "Sinking pellets after lights-out, frozen bloodworms, micro wafers. Outcompeted by upper-level feeders — drop food directly to the substrate.",
        "24–28", "5.5–7.0", "2–10", "10+",
        2, "Yes", "Yes (adults safe with adult shrimp)", "Very hard (rarely bred in captivity)",
        "Tiny black-banded eels that hide all day and party all night. Soft fine sand is non-negotiable — they bury themselves into it. Tight-fit lid required: they will find any 2 mm gap and escape.",
    ],
    [
        "fish-015", "sterbai-corydoras", "Sterbai Corydoras", "Corydoras sterbai",
        "Callichthyidae", "Rio Guaporé basin, Brazil & Bolivia",
        "6–7 cm", "75 L", "Bottom",
        "Peaceful", "Yes", 6,
        "Omnivore (sinking)", "Sinking pellets, catfish wafers, frozen bloodworms. Hugely enthusiastic eaters — feed enough.",
        "24–30", "6.0–7.5", "3–15", "5–10",
        2, "Yes", "Yes (adult shrimp)", "Medium",
        "The heat-tolerant cory — the only one that genuinely thrives alongside discus and rams at 28 °C+. White spots on a dark body, orange pectoral spines. Soft sand substrate is essential.",
    ],
    [
        "fish-016", "cherry-barb", "Cherry Barb", "Puntius titteya",
        "Cyprinidae", "Sri Lanka",
        "4–5 cm", "60 L", "Mid",
        "Peaceful", "Yes (loose shoal)", 6,
        "Omnivore", "Flake, micro pellets, frozen daphnia and bloodworms. Will graze biofilm.",
        "23–27", "6.0–7.5", "2–18", "4–7",
        1, "Yes", "Mostly (may eat shrimplets)", "Medium",
        "The peaceful barb — none of the fin-nipping baggage of tiger or rosy barbs. Males flush deep crimson in spawning colour; females stay pale gold. Wide parameter tolerance makes it a bulletproof community pick.",
    ],
    [
        "fish-017", "endler-livebearer", "Endler's Livebearer", "Poecilia wingei",
        "Poeciliidae", "Laguna de Patos, Venezuela",
        "2.5–4 cm", "40 L", "Mid to Top",
        "Peaceful", "Loose group", 6,
        "Omnivore", "Crushed flake, micro pellets, baby brine shrimp, blanched veg.",
        "22–28", "7.0–8.5", "8–25", "2–3",
        1, "Yes", "Yes (adult shrimp)", "Very easy",
        "True wild-type Endlers (N-class) are a different species from common guppies — keep them apart or they hybridise. Hard alkaline water lovers. Breed prolifically: stock all-male groups if you don't want a population explosion.",
    ],
    [
        "fish-018", "marbled-hatchetfish", "Marbled Hatchetfish", "Carnegiella strigata",
        "Gasteropelecidae", "Amazon basin, Peru & Brazil",
        "3.5–4.5 cm", "75 L", "Top (strictly surface)",
        "Peaceful", "Yes", 6,
        "Micropredator (insectivore)", "Floating micro pellets, flake, fruit flies, mosquito larvae. Will not feed off the bottom.",
        "24–28", "5.0–6.5", "1–8", "3–5",
        3, "Yes", "Yes", "Very hard",
        "True surface specialist — the keeled chest houses enlarged pectoral muscles that let them 'fly' over the water to escape predators. Tight lid is non-negotiable: any opening becomes an exit. Best in a heavily planted blackwater tank with floating plants for cover.",
    ],
    [
        "fish-019", "white-cloud-mountain-minnow", "White Cloud Mountain Minnow", "Tanichthys albonubes",
        "Cyprinidae", "White Cloud Mountain, Guangdong, China",
        "3.5–4 cm", "40 L", "Mid to Top",
        "Peaceful", "Yes", 6,
        "Omnivore", "Crushed flake, micro pellets, daphnia, baby brine shrimp. Excellent at picking off mosquito larvae.",
        "16–24", "6.0–8.0", "4–18", "5–7",
        1, "Yes", "Yes (adult shrimp)", "Easy",
        "The unheated-tank classic. Once thought extinct in the wild — most stock is captive-bred. Cooler-water nano fish that displays brightest at 18–22 °C. Long-fin and 'meteor' variants exist; wild type stays most vigorous.",
    ],
    [
        "fish-020", "diamond-tetra", "Diamond Tetra", "Moenkhausia pittieri",
        "Characidae", "Lake Valencia basin, Venezuela",
        "5–6 cm", "100 L", "Mid",
        "Peaceful", "Yes", 6,
        "Omnivore", "Flake, micro pellets, frozen daphnia, bloodworms, occasional plant matter.",
        "24–28", "6.0–7.5", "4–15", "4–6",
        2, "Yes", "Mostly (may eat shrimplets)", "Medium",
        "Iridescent silver-gold scales catch every angle of light. Plain juveniles transform into sparkling adults over 6–9 months. Males develop extended dorsal and anal rays. A planted-tank classic in the AGA showroom tradition.",
    ],
    [
        "fish-021", "reticulated-hillstream-loach", "Reticulated Hillstream Loach", "Sewellia lineolata",
        "Balitoridae", "Central and southern Vietnam",
        "5–7 cm", "75 L", "Bottom (sticks to surfaces)",
        "Peaceful", "Loose group", 4,
        "Herbivore (biofilm and algae)", "Soft green algae, biofilm, Repashy Soilent Green, blanched zucchini, sinking veg wafers. Needs strong oxygenated flow to feed.",
        "20–24", "6.5–7.5", "4–15", "8–10",
        3, "Yes", "Yes", "Medium",
        "Built like a tiny stingray and adapted for whitewater streams. Needs powerheads creating real river-current flow and high dissolved oxygen. Smooth river rock and broad plant leaves are their grazing surfaces. Pair with kuhli loaches and otocinclus for a 'river bottom' community.",
    ],
    [
        "fish-022", "threadfin-rainbowfish", "Threadfin Rainbowfish", "Iriatherina werneri",
        "Melanotaeniidae", "Northern Australia, southern New Guinea",
        "4–5 cm", "60 L", "Mid to Top",
        "Peaceful", "Yes", 6,
        "Micropredator", "Micro pellets, daphnia, baby brine shrimp, microworms. Tiny mouth — keep food fine.",
        "24–30", "6.5–7.5", "5–15", "3–4",
        3, "Yes", "Yes (adult shrimp)", "Medium",
        "The peacock of nano rainbowfish. Males display extended threadlike dorsal and anal rays, fanned out in territorial display every few minutes. Wants warm tropical water and absolutely no boisterous tank mates — they retract and refuse to display.",
    ],
    [
        "fish-023", "lemon-tetra", "Lemon Tetra", "Hyphessobrycon pulchripinnis",
        "Characidae", "Lower Amazon basin, Brazil",
        "4–5 cm", "75 L", "Mid",
        "Peaceful", "Yes", 8,
        "Omnivore", "Flake, micro pellets, frozen daphnia, bloodworms.",
        "23–28", "5.5–7.5", "2–15", "5–8",
        1, "Yes", "Mostly (may eat shrimplets)", "Medium",
        "Buttery yellow body with black-and-yellow accented dorsal and anal fins. Brighter under dim lighting and dark substrate; washes out under bright lights. Long-lived and forgiving — a classic community starter tetra.",
    ],
    [
        "fish-024", "clown-killifish", "Clown Killifish", "Epiplatys annulatus",
        "Nothobranchiidae", "Coastal Sierra Leone, Guinea, Liberia",
        "3–3.5 cm", "30 L", "Top",
        "Peaceful", "Loose group", 4,
        "Micropredator", "Microworms, baby brine shrimp, fruit flies, powder fry food. Will not pick from the substrate — feed at the surface.",
        "22–26", "4.5–6.5", "1–6", "3–4",
        3, "Yes", "Yes (adults only — will hunt shrimplets)", "Easy",
        "Tiny surface-dwelling killifish — black-and-cream barred body with a fan-shaped tail that glows orange in males. Strict surface dweller; needs dense floating plants and dim tannin-stained blackwater. Breed continuously among Java moss.",
    ],
    [
        "fish-025", "pearl-gourami", "Pearl Gourami", "Trichopodus leerii",
        "Osphronemidae", "Southeast Asia (Malay Peninsula, Sumatra, Borneo)",
        "10–12 cm", "150 L", "Mid to Top",
        "Peaceful", "Pair or trio", 2,
        "Omnivore", "Flake, pellets, frozen bloodworms, mosquito larvae, blanched veg.",
        "24–28", "5.5–7.5", "2–15", "4–8",
        2, "Yes", "Mostly (may eat very small shrimp)", "Medium (bubble-nester)",
        "The centrepiece gourami — fully grown males develop coppery throats, extended pelvic feelers, and pearl-spotted bodies. Genuinely peaceful when kept as 1 male + 2 females. Needs a tall tank for vertical territorial display and surface access for the labyrinth organ.",
    ],
    [
        "fish-026", "forktail-blue-eye", "Forktail Blue-Eye", "Pseudomugil furcatus",
        "Pseudomugilidae", "Papua New Guinea",
        "4–5 cm", "60 L", "Mid to Top",
        "Peaceful", "Yes", 6,
        "Micropredator", "Micro pellets, baby brine shrimp, daphnia, mosquito larvae.",
        "23–27", "6.5–7.5", "5–15", "2–3",
        2, "Yes", "Yes (adult shrimp)", "Easy",
        "Tiny rainbowfish with electric blue eyes and yellow-edged forked tail. Males spar constantly with fins flared but never harm each other — pure display. Excellent for nano planted scapes with cherry shrimp and otocinclus.",
    ],
    [
        "fish-027", "bristlenose-pleco", "Bristlenose Pleco", "Ancistrus cf. cirrhosus",
        "Loricariidae", "Amazon and Orinoco basins, South America",
        "10–15 cm", "100 L", "Bottom",
        "Peaceful", "Solitary or pair", 1,
        "Omnivore (algae-leaning)", "Algae wafers, blanched zucchini, courgette, soft green algae, occasional protein (frozen bloodworms). Driftwood is essential — they rasp it for cellulose.",
        "20–28", "6.0–7.5", "2–20", "10–15",
        2, "Yes", "Yes", "Easy",
        "The 'bushy nose' pleco — males develop branched tentacle-like bristles on their head. Practical algae crew that actually eats algae (unlike common plecos). Stays small enough for a 100 L planted tank. Requires driftwood for digestion and cave for territorial security.",
    ],
    [
        "fish-028", "black-neon-tetra", "Black Neon Tetra", "Hyphessobrycon herbertaxelrodi",
        "Characidae", "Paraguay River basin, Brazil",
        "3–4 cm", "60 L", "Mid",
        "Peaceful", "Yes", 8,
        "Omnivore", "Crushed flake, micro pellets, frozen daphnia, baby brine shrimp.",
        "22–28", "5.5–7.5", "2–12", "5",
        1, "Yes", "Mostly (may eat shrimplets)", "Medium",
        "Despite the name, not closely related to the common neon — different genus, different river basin. White-and-black horizontal striping with a greenish iridescence. Hardier and more tolerant than the standard neon, ideal for community tanks with stable parameters.",
    ],
    [
        "fish-029", "siamese-algae-eater", "Siamese Algae Eater", "Crossocheilus oblongus",
        "Cyprinidae", "Mainland Southeast Asia (Thailand, Malaysia, Indonesia)",
        "12–15 cm", "150 L", "Bottom (grazes everywhere)",
        "Peaceful (becomes mildly territorial as adult)", "Loose group", 4,
        "Omnivore (heavy algae grazer)", "Algae, biofilm, blanched veg, sinking pellets, occasional protein. Will eat dreaded black beard algae — one of very few fish that do.",
        "24–28", "6.5–7.5", "5–15", "8–10",
        2, "Yes", "Yes (adults safe with adult shrimp)", "Very hard",
        "The legendary BBA eater. True Crossocheilus oblongus has a single solid black horizontal stripe extending into the tail; lookalikes (false SAEs, flying foxes) have either broken stripes or coloured fins. Buy from a knowledgeable source — misidentification is rampant in chain stores.",
    ],
    [
        "fish-030", "dwarf-pencilfish", "Dwarf Pencilfish", "Nannostomus marginatus",
        "Lebiasinidae", "Western Guyana, Suriname, lower Amazon basin",
        "3–3.5 cm", "60 L", "Mid to Top",
        "Peaceful", "Yes (loose shoal)", 6,
        "Micropredator", "Micro pellets, baby brine shrimp, daphnia, microworms. Tiny upturned mouth — feed small floating or slow-sinking foods.",
        "22–28", "5.0–7.0", "1–8", "3–5",
        3, "Yes", "Yes (adult shrimp)", "Medium",
        "The smallest pencilfish. Three horizontal black-and-red stripes against a pale gold body. Holds itself horizontally, hovering mid-water rather than swimming actively. Loves blackwater conditions and dense plant cover. Goes pale at night — a distinctive 'sleep colour' that surprises new keepers.",
    ],
    [
        "fish-031", "dwarf-puffer", "Dwarf Puffer", "Carinotetraodon travancoricus",
        "Tetraodontidae", "Western Ghats rivers and pools, India (Kerala)",
        "2.5–3.5 cm", "40 L (single); 75 L for a small group", "Mid",
        "Semi-aggressive", "Solitary or harem (1M:2F+)", 1,
        "Carnivore (snail specialist)", "Live/frozen snails (ramshorn, MTS), frozen bloodworms, mysis shrimp, blackworms. Beak-wearing requires hard-shelled food — pellets rejected.",
        "22–28", "6.5–7.5", "5–15", "4–5",
        4, "Yes", "No (will eat shrimp)", "Medium",
        "The smallest freshwater puffer — pea-sized with full puffer personality. Recognises and interacts with keepers. Snail-only diet means a parallel snail culture tank is essentially required. Each puffer has a temperament; some are docile, others territorial — observe individuals before adding tank mates.",
    ],
    [
        "fish-032", "apistogramma-agassizii", "Agassiz's Dwarf Cichlid", "Apistogramma agassizii",
        "Cichlidae", "Amazon basin, Brazil, Peru, Colombia",
        "5–9 cm (male), 4–5 cm (female)", "75 L (pair)", "Mid to Bottom",
        "Peaceful (territorial when breeding)", "Harem (1 male, 2–3 females)", 2,
        "Carnivore", "Frozen bloodworms, brine shrimp, micro pellets. Live food triggers spawning behaviour.",
        "24–28", "5.0–7.0", "1–10", "3–5",
        3, "Yes", "Risky with dwarf shrimp", "Easy",
        "The classic Amazon apisto, distinct from cacatuoides by its lyre-shaped 'sword' tail. Males come in numerous regional colour forms: 'Red Tail', 'Fire Red', 'Double Red', 'Tefé Blue'. Soft acidic water for best colour and breeding. Pairs beautifully with cardinal tetras for a complete Amazon biotope.",
    ],
    [
        "fish-033", "black-phantom-tetra", "Black Phantom Tetra", "Hyphessobrycon megalopterus",
        "Characidae", "Bolivia, Brazil (Mato Grosso), Paraguay",
        "4–5 cm", "75 L", "Mid",
        "Peaceful (males spar)", "Yes", 6,
        "Omnivore", "Flake, micro pellets, frozen daphnia, bloodworms.",
        "22–28", "5.5–7.5", "2–15", "4–5",
        1, "Yes", "Mostly (may eat shrimplets)", "Medium",
        "Smoky grey-black body with a distinctive black shoulder spot ringed in iridescent blue. Males develop extended dorsal and anal fin extensions; females stay rounder with a red-and-black anal fin tip. Males perform fascinating fin-flaring displays to each other without real aggression.",
    ],
    [
        "fish-034", "glowlight-tetra", "Glowlight Tetra", "Hemigrammus erythrozonus",
        "Characidae", "Essequibo River basin, Guyana",
        "3.5–4 cm", "60 L", "Mid",
        "Peaceful", "Yes", 8,
        "Omnivore", "Crushed flake, micro pellets, frozen daphnia, baby brine shrimp.",
        "22–28", "5.5–7.0", "1–8", "4–6",
        1, "Yes", "Mostly (may eat shrimplets)", "Medium",
        "A horizontal neon-orange stripe glows against a translucent body — like a softer, warmer version of a neon tetra. Looks spectacular against dark substrate and tannin-stained water. More peaceful than rummynose, less demanding than cardinal.",
    ],
]

# Detail column order corresponding to fish_detail_headers
_FISH_DETAIL_KEYS = [
    "habitat", "wildDiet", "sexing", "breeding",
    "colorForms", "diseases", "tankSetup",
    "goodTankMates", "badTankMates", "quarantine", "conservation",
    "priceRange", "etymology", "misconceptions", "proTips",
]


def merge_detail(summary_rows, detail_dict, keys):
    """Append detail columns to each summary row by ID lookup."""
    out = []
    for row in summary_rows:
        sp_id = row[0]
        d = detail_dict.get(sp_id, {})
        extra = [d.get(k, "") for k in keys]
        out.append(list(row) + extra)
    return out


fish_rows = merge_detail(fish_summary, FISH_DETAIL, _FISH_DETAIL_KEYS)

ws = wb.create_sheet("Fish")
fish_widths = (
    [10, 22, 22, 28, 20, 32, 14, 14, 14, 22, 12, 8, 16, 38, 12, 12, 10, 12, 12, 12, 18, 18, 60]
    + [50] * len(fish_detail_headers)
)
style_sheet(ws, fish_headers, fish_widths)
write_rows(ws, fish_rows, tall_rows=True)

# ----------------------------------------------------------------------------
# PLANTS SHEET
# ----------------------------------------------------------------------------
plant_summary_headers = [
    "ID", "Slug", "Common Name", "Scientific Name", "Family", "Origin",
    "Plant Type", "Position", "Max Height (cm)",
    "Light", "CO2", "Growth Rate",
    "Temp (°C)", "pH", "dGH",
    "Difficulty (1-5)", "Substrate", "Propagation",
    "Care Summary",
]
plant_detail_headers = [
    "Habitat (Natural)", "Variants / Cultivars", "Emersed Form", "Flowering",
    "Fertilization", "Trimming", "Common Deficiencies",
    "Algae Issues", "Misidentification Risks", "Price Range (USD)", "Pro Tips",
]
plant_headers = plant_summary_headers + plant_detail_headers

plant_summary = [
    [
        "plant-001", "anubias-nana", "Anubias Barteri Nana", "Anubias barteri var. nana",
        "Araceae", "West Africa (Cameroon)",
        "Rhizome / Epiphyte", "Foreground to Midground", "10–15",
        "Low to Medium", "None to Optional", "Slow",
        "22–28", "6.0–7.5", "2–15",
        1, "Attach to wood or stone — never bury rhizome", "Rhizome division",
        "Almost impossible to kill. Tie or glue to hardscape, never bury the rhizome. Susceptible to Anubias rot if rhizome is damaged; trim brown leaves at the base.",
    ],
    [
        "plant-002", "java-fern", "Java Fern", "Microsorum pteropus",
        "Polypodiaceae", "Southeast Asia",
        "Rhizome / Epiphyte", "Midground to Background", "15–35",
        "Low to Medium", "None to Optional", "Slow",
        "20–28", "5.5–7.5", "2–15",
        1, "Attach to wood or stone — never bury rhizome", "Rhizome division and plantlets on leaves",
        "Sturdy and forgiving. Produces baby ferns on leaf tips that can be detached and replanted. Black spots can indicate nutrient deficiency or melt — increase trace dosing.",
    ],
    [
        "plant-003", "amazon-sword", "Amazon Sword", "Echinodorus bleheri",
        "Alismataceae", "Brazil",
        "Rosette / Heavy Root Feeder", "Background", "40–50",
        "Medium", "Optional", "Medium to Fast",
        "22–28", "6.5–7.5", "3–18",
        2, "Nutrient-rich substrate + root tabs essential", "Runners and adventitious plantlets",
        "Statement background plant. Heavy root feeder — root tabs are non-negotiable. Single plant fills a 60 cm tank corner within 6 months.",
    ],
    [
        "plant-004", "cryptocoryne-wendtii", "Cryptocoryne Wendtii", "Cryptocoryne wendtii",
        "Araceae", "Sri Lanka",
        "Rosette / Root Feeder", "Midground", "15–25",
        "Low to Medium", "None to Optional", "Slow to Medium",
        "22–28", "6.0–8.0", "2–15",
        2, "Nutrient-rich substrate + root tabs", "Runners",
        "Goes through a famous 'crypt melt' when first planted or moved — leaves dissolve, the plant regrows from the roots stronger than before. Don't pull it out.",
    ],
    [
        "plant-005", "vallisneria-spiralis", "Vallisneria Spiralis", "Vallisneria spiralis",
        "Hydrocharitaceae", "Europe, Asia, Africa",
        "Rosette / Runner", "Background", "40–80",
        "Low to Medium", "None to Optional", "Fast",
        "18–28", "6.5–8.0", "5–25",
        1, "Sand or gravel with root tabs", "Runners",
        "Carpets the back of a tank in long, curving ribbons. Sensitive to liquid carbon (Excel/Easy Carbo) — will melt. Snip runners to control spread.",
    ],
    [
        "plant-006", "hygrophila-polysperma", "Dwarf Hygrophila", "Hygrophila polysperma",
        "Acanthaceae", "India, Bangladesh, Bhutan",
        "Stem", "Midground to Background", "30–50",
        "Low to High", "Optional", "Very Fast",
        "20–28", "6.0–7.5", "2–15",
        1, "Any — water column feeder", "Cuttings (top and side shoots)",
        "Nutrient sponge — use it to outcompete algae in new tanks. Banned/invasive in several US states (check local rules before sourcing).",
    ],
    [
        "plant-007", "bucephalandra", "Bucephalandra (mixed)", "Bucephalandra sp.",
        "Araceae", "Borneo (rheophytic)",
        "Rhizome / Epiphyte", "Foreground to Midground", "5–20",
        "Low to Medium", "Optional", "Slow",
        "22–28", "6.0–7.5", "2–10",
        2, "Attach to wood or stone — never bury rhizome", "Rhizome division",
        "Premium hardscape plant — over 200 named cultivars. Flowers underwater. Sensitive to large water-parameter swings; established rhizomes are nearly bulletproof.",
    ],
    [
        "plant-008", "dwarf-hairgrass", "Dwarf Hairgrass", "Eleocharis parvula",
        "Cyperaceae", "Worldwide temperate / subtropical",
        "Carpet / Runner", "Foreground", "5–10",
        "Medium to High", "Recommended", "Medium",
        "20–28", "6.0–7.5", "2–10",
        3, "Fine, nutrient-rich substrate + root tabs", "Runners",
        "Best beginner carpet plant. Trim short after planting to encourage horizontal runners. CO₂ dramatically speeds carpet formation.",
    ],
    [
        "plant-009", "monte-carlo", "Monte Carlo", "Micranthemum tweediei",
        "Linderniaceae", "Argentina",
        "Carpet / Stem", "Foreground", "3–5",
        "Medium to High", "Recommended", "Medium",
        "20–26", "6.0–7.5", "1–10",
        3, "Fine, nutrient-rich substrate", "Cuttings spread horizontally",
        "Easier than HC 'Cuba' with similarly tiny round leaves. Plant in tiny clumps 2–3 cm apart for fastest carpet. Pearls heavily under CO₂.",
    ],
    [
        "plant-010", "rotala-rotundifolia", "Rotala Rotundifolia", "Rotala rotundifolia",
        "Lythraceae", "Southeast Asia",
        "Stem", "Midground to Background", "30–60",
        "Medium to High", "Recommended", "Fast",
        "22–28", "5.5–7.5", "2–12",
        2, "Nutrient-rich + water column dosing", "Cuttings",
        "Bushy red/pink background plant under high light. The basis of most 'Dutch street' aquascapes. Stem tops replant readily — pinch and replant for density.",
    ],
    [
        "plant-011", "ludwigia-repens", "Ludwigia Repens", "Ludwigia repens",
        "Onagraceae", "Central America to southern USA",
        "Stem", "Midground to Background", "25–50",
        "Medium to High", "Optional", "Fast",
        "18–28", "5.5–8.0", "3–18",
        2, "Any — water column feeder, root tabs accelerate red colour", "Cuttings",
        "The easiest red stem plant. Green-pink under medium light, deep red under high light + iron. More forgiving than Rotala — tolerates harder water and skipping CO₂. Top-and-replant for density.",
    ],
    [
        "plant-012", "staurogyne-repens", "Staurogyne Repens", "Staurogyne repens",
        "Acanthaceae", "Rio Cristalino basin, Brazil",
        "Stem (creeping)", "Foreground to Midground", "5–10",
        "Medium", "Optional", "Slow to Medium",
        "20–28", "6.0–7.5", "2–15",
        2, "Nutrient-rich substrate + root tabs help", "Cuttings (lateral shoots)",
        "The easiest 'carpet without CO₂' plant. Compact rosette of small bright-green leaves that branches and creeps horizontally when trimmed. Much more forgiving than Monte Carlo or HC Cuba — great low-tech alternative.",
    ],
    [
        "plant-013", "hc-cuba", "Dwarf Baby Tears (HC Cuba)", "Hemianthus callitrichoides 'Cuba'",
        "Linderniaceae", "Cuba",
        "Carpet / Stem", "Foreground", "1–3",
        "High", "Required", "Medium",
        "20–26", "5.5–7.0", "1–10",
        5, "Fine, active nutrient-rich substrate (ADA Amazonia or similar)", "Cuttings / runners spread horizontally",
        "The smallest aquatic plant in the hobby. Forms a fine-textured emerald carpet that pearls aggressively under CO₂. High-tech only — without CO₂ and 60+ PAR it melts. Dry-start method is the most reliable path to a complete carpet.",
    ],
    [
        "plant-014", "pogostemon-helferi", "Pogostemon Helferi (Downoi)", "Pogostemon helferi",
        "Lamiaceae", "Thailand, Myanmar",
        "Rosette / Stem", "Foreground to Midground", "5–12",
        "Medium to High", "Recommended", "Medium",
        "22–28", "6.0–7.5", "2–15",
        3, "Nutrient-rich substrate + root tabs essential", "Side shoots from base",
        "'Little star' in Thai — the curly star-shaped leaves are unmistakable. A statement midground plant that bridges foreground and background. Demands stable parameters; CO₂ keeps the compact star shape. Lithophyte tendency — attach to porous stone like Bucephalandra.",
    ],
    [
        "plant-015", "salvinia-natans", "Floating Watermoss (Salvinia)", "Salvinia natans",
        "Salviniaceae", "Europe, Asia, Africa (warm temperate)",
        "Floating", "Floating", "2–5",
        "Low to High", "None", "Very Fast",
        "18–30", "6.0–8.0", "2–20",
        1, "None — floats on surface, draws nutrients from water column", "Division (snap apart at nodes)",
        "The fastest-growing floating plant. Two oval leaves above water trap a layer of water for absorption; root-like submerged leaf hangs below for shrimp and fry cover. Skim weekly or it doubles in a week. Hates dripping surface water — keep glass lids dry above it.",
    ],
    [
        "plant-016", "bacopa-caroliniana", "Bacopa Caroliniana", "Bacopa caroliniana",
        "Plantaginaceae", "Southeastern USA",
        "Stem", "Midground to Background", "20–40",
        "Low to High", "Optional", "Medium",
        "18–28", "6.0–8.0", "3–18",
        1, "Any — root and water column feeder", "Cuttings",
        "Bombproof stem plant for the low-tech tank. Crush a leaf and you'll smell lemon — the trade name 'lemon bacopa' is literal. Yellow-green under low light, copper-orange under high light. Forgives missed dosing weeks.",
    ],
    [
        "plant-017", "cryptocoryne-parva", "Cryptocoryne Parva", "Cryptocoryne parva",
        "Araceae", "Sri Lanka",
        "Rosette", "Foreground", "3–8",
        "Medium", "Optional", "Very slow",
        "22–28", "6.0–7.5", "2–15",
        3, "Nutrient-rich substrate + root tabs", "Runners (very slow)",
        "The smallest Cryptocoryne and the only true 'foreground crypt'. Forms tight rosettes of upright pencil-thin leaves. Painfully slow but bulletproof once established. Plant individuals 2 cm apart for a foreground 'lawn' that takes a year to form.",
    ],
    [
        "plant-018", "limnophila-sessiliflora", "Asian Ambulia", "Limnophila sessiliflora",
        "Plantaginaceae", "South and Southeast Asia",
        "Stem", "Background", "30–60",
        "Low to High", "Optional", "Very Fast",
        "20–28", "5.5–7.5", "2–15",
        1, "Any — heavy water column feeder", "Cuttings (top and lateral shoots)",
        "Feathery whorls of bright green leaves. Grows several centimetres per week — a 'nutrient sponge' for cycling new tanks and outcompeting algae. Banned/invasive in parts of the USA and Australia; check local regulations before sourcing.",
    ],
    [
        "plant-019", "glossostigma-elatinoides", "Glossostigma", "Glossostigma elatinoides",
        "Phrymaceae", "New Zealand, southeastern Australia",
        "Carpet / Stem", "Foreground", "1–3",
        "High", "Required", "Fast",
        "20–26", "5.5–7.0", "1–10",
        4, "Fine, active nutrient-rich substrate (ADA Amazonia or similar)", "Cuttings / runners spread horizontally",
        "The original aquascaping carpet, popularised by Takashi Amano. Tiny paddle-shaped leaves form a dense bright-green mat. Sister species to HC Cuba but slightly larger leaves and a touch more forgiving. CO₂ is non-negotiable; needs high light to stay flat — under-lit Glosso grows vertically.",
    ],
    [
        "plant-020", "lilaeopsis-brasiliensis", "Micro Sword", "Lilaeopsis brasiliensis",
        "Apiaceae", "South America (Brazil, Argentina)",
        "Carpet / Grass-like", "Foreground", "3–7",
        "Medium to High", "Optional", "Slow to Medium",
        "20–28", "6.0–7.5", "2–15",
        3, "Nutrient-rich substrate + root tabs", "Runners",
        "Tight bright-green grass-like carpet — looks like a miniature lawn. Sister species L. mauritiana grows slightly taller. Patient growers are rewarded with one of the most natural-looking foregrounds available. Skip CO₂ at the cost of speed, not appearance.",
    ],
    [
        "plant-021", "marsilea-hirsuta", "Four-Leaf Clover", "Marsilea hirsuta",
        "Marsileaceae", "Northern Australia",
        "Carpet / Stem", "Foreground", "2–8",
        "Low to High", "Optional", "Slow",
        "18–28", "5.5–7.5", "2–15",
        2, "Nutrient-rich substrate + root tabs", "Runners",
        "A genuine aquatic fern that looks like miniature four-leaf clovers. Shapeshifts based on conditions: low light produces tall single-leaf shoots; high light produces flat compact clover-form carpets. The low-tech alternative to HC Cuba and Glosso — slower but dramatically easier.",
    ],
    [
        "plant-022", "amazon-frogbit", "Amazon Frogbit", "Limnobium laevigatum",
        "Hydrocharitaceae", "Central and South America",
        "Floating", "Floating", "3–8",
        "Low to High", "None", "Fast",
        "20–30", "6.0–8.0", "2–20",
        1, "None — floats on surface, draws nutrients from water column", "Daughter plants on runners",
        "Lily-pad-shaped leaves with long trailing roots — the classic 'shrimp nursery' floater. Larger than Salvinia; covers surface in big circular leaves. Easy to overdo: cover 50% of surface max or it shades out everything below. Pulls nitrate aggressively.",
    ],
    [
        "plant-023", "hygrophila-pinnatifida", "Hygrophila Pinnatifida", "Hygrophila pinnatifida",
        "Acanthaceae", "Western India (rheophyte)",
        "Rhizome / Stem (creeping)", "Midground", "10–20",
        "Medium to High", "Recommended", "Medium",
        "22–28", "6.0–7.5", "2–15",
        3, "Attach to wood or stone — crawls horizontally via rhizome", "Side shoots from rhizome",
        "A rheophyte stem that behaves more like Bucephalandra — attaches to hardscape via creeping rhizome and stays low. Bronze-red leaves with deeply lobed edges. Pairs beautifully with Anubias and Buce on driftwood. Needs flow to prevent detritus on the underside.",
    ],
    [
        "plant-024", "aponogeton-crispus", "Aponogeton Crispus", "Aponogeton crispus",
        "Aponogetonaceae", "Sri Lanka",
        "Bulb / Rosette", "Background", "30–50",
        "Medium", "Optional", "Fast",
        "22–28", "6.0–7.5", "2–15",
        1, "Sand or fine gravel — plant bulb half-exposed", "Bulb division, occasional flower-stalk plantlets",
        "Sold as a dormant brown bulb that explodes into wavy translucent green leaves within days. Goes through dormancy cycles (3–4 months active growth, then leaf dieback, then regrowth) — let the bulb rest, don't compost it. Cheap, dramatic, beginner-friendly.",
    ],
    [
        "plant-025", "lobelia-cardinalis-mini", "Lobelia Cardinalis 'Mini'", "Lobelia cardinalis 'Small Form'",
        "Campanulaceae", "Eastern North America (selectively bred dwarf form)",
        "Stem (rosette-like)", "Midground", "5–15",
        "Medium to High", "Recommended", "Slow",
        "20–26", "5.5–7.5", "2–15",
        2, "Nutrient-rich substrate + root tabs", "Cuttings (lateral shoots)",
        "Compact dwarf cultivar of the bog wildflower. Glossy round leaves with deep red undersides — the colour shows when planted in clusters viewed from above. Slow but rewarding midground accent; pinch top shoots to encourage horizontal branching.",
    ],
    [
        "plant-026", "sagittaria-subulata", "Dwarf Sagittaria", "Sagittaria subulata",
        "Alismataceae", "Eastern USA, naturalised globally",
        "Rosette / Runner", "Midground to Background", "10–30",
        "Low to High", "Optional", "Fast",
        "18–28", "6.0–8.5", "5–25",
        1, "Sand or gravel + root tabs", "Runners",
        "Narrow strap-like grass that spreads via prolific runners. The hard-water-loving alternative to Vallisneria — tolerates anything from pH 6 to pH 8.5 and 5 to 25 dGH. Bombproof beginner background plant. Will carpet open foreground spaces if given enough light.",
    ],
    [
        "plant-027", "ludwigia-super-red", "Ludwigia 'Super Red'", "Ludwigia palustris 'Super Red'",
        "Onagraceae", "Selectively bred from L. palustris (global temperate)",
        "Stem", "Midground to Background", "15–40",
        "High", "Recommended", "Medium",
        "20–28", "5.5–7.5", "2–15",
        2, "Nutrient-rich substrate + iron-rich water dosing", "Cuttings",
        "The premium red stem plant. Stays deep crimson-burgundy from top to bottom under high light and iron — unlike standard Ludwigia which only colours up at the tops. Less demanding than the rotala reds. The fastest path to a 'Dutch street' red wall.",
    ],
    [
        "plant-028", "pearlweed", "Pearlweed", "Hemianthus glomeratus",
        "Linderniaceae", "Eastern and southern USA, Cuba",
        "Stem (creeping or vertical)", "Foreground to Midground", "5–25",
        "Medium to High", "Optional", "Fast",
        "20–28", "5.5–7.5", "2–15",
        2, "Any — water column feeder", "Cuttings",
        "Often mislabelled HC Cuba. Tiny round leaves on slender stems — under high light + CO₂ stays low and creates a fuzzy carpet; under low light grows tall and stem-like. Pearls heavily under CO₂ (hence the name). A more forgiving foreground option than true HC.",
    ],
    [
        "plant-029", "chain-sword", "Chain Sword", "Helanthium tenellum",
        "Alismataceae", "South and Central America",
        "Rosette / Runner", "Foreground to Midground", "5–12",
        "Medium to High", "Optional", "Medium",
        "20–28", "6.0–7.5", "2–15",
        2, "Nutrient-rich substrate + root tabs", "Runners (chain effect)",
        "A dwarf Echinodorus that spreads via prolific runners — each runner produces a new daughter plant a few centimetres away, forming a 'chain'. Previously classified as Echinodorus tenellus. Bright grass-like foreground that fills in faster than crypt parva and demands far less than HC.",
    ],
    [
        "plant-030", "needle-hairgrass", "Needle Hairgrass", "Eleocharis acicularis",
        "Cyperaceae", "Worldwide temperate",
        "Carpet / Runner", "Foreground to Midground", "10–20",
        "Medium to High", "Optional", "Medium",
        "18–26", "6.0–7.5", "2–15",
        2, "Fine nutrient-rich substrate + root tabs", "Runners",
        "The taller sister of dwarf hairgrass — needle-thin blades reach 10–20 cm. Forms a 'grass field' look behind a foreground rather than a flat carpet. Tolerates cooler water than parvula; pairs with white clouds and hillstream loaches in unheated tanks.",
    ],
    [
        "plant-031", "cryptocoryne-lutea", "Cryptocoryne Lutea", "Cryptocoryne lutea",
        "Araceae", "Sri Lanka",
        "Rosette", "Midground", "10–25",
        "Low to Medium", "None to Optional", "Slow",
        "22–28", "6.0–8.0", "2–18",
        2, "Nutrient-rich substrate + root tabs", "Runners",
        "The hard-water crypt. Tolerates alkaline conditions where most other Cryptocoryne species suffer. Medium-green slender leaves with a hint of bronze. The most forgiving Cryptocoryne after wendtii. Less prone to crypt melt during planting changes.",
    ],
    [
        "plant-032", "java-fern-windelov", "Java Fern 'Windelov'", "Microsorum pteropus 'Windelov'",
        "Polypodiaceae", "Selectively bred cultivar (originated in Denmark)",
        "Rhizome / Epiphyte", "Midground to Background", "15–25",
        "Low to Medium", "None to Optional", "Slow",
        "20–28", "5.5–7.5", "2–15",
        1, "Attach to wood or stone — never bury rhizome", "Daughter plantlets on leaf tips, rhizome division",
        "The 'lacy' Java fern. Tropica's selectively bred cultivar with intricately split, crown-like leaf tips that look like miniature antlers. Same bombproof care as standard Java fern with dramatically more visual character.",
    ],
    [
        "plant-033", "bolbitis-heudelotii", "African Water Fern", "Bolbitis heudelotii",
        "Dryopteridaceae", "Central and West Africa",
        "Rhizome / Epiphyte", "Midground to Background", "15–40",
        "Low to Medium", "Recommended", "Slow",
        "20–26", "5.5–7.0", "1–8",
        3, "Attach to wood or stone — never bury rhizome", "Rhizome division",
        "Stunning dark-green feathery fronds with deeply divided leaves. Slower than Java fern but more ornamental. Needs flow for healthy growth — stagnant water causes detritus collection on the fronds. Pairs beautifully with Anubias on a single piece of driftwood.",
    ],
    [
        "plant-034", "ranunculus-inundatus", "Ranunculus Inundatus", "Ranunculus inundatus",
        "Ranunculaceae", "Eastern Australia",
        "Rosette / Runner", "Midground", "5–15",
        "Medium to High", "Recommended", "Medium",
        "20–26", "5.5–7.5", "2–12",
        3, "Nutrient-rich substrate + root tabs", "Runners",
        "Distinctive umbrella-shaped leaves on slender stems — unmistakable silhouette. Spreads via underground runners. Demands stable parameters and good light to produce the iconic umbrella form; under poor conditions reverts to simple paddle-shaped leaves. One of the most architecturally striking midground plants.",
    ],
]

_PLANT_DETAIL_KEYS = [
    "habitatNatural", "variants", "emersedForm", "flowering",
    "fertilization", "trimming", "deficiencies",
    "algaeIssues", "misidentification", "priceRange", "proTips",
]
plant_rows = merge_detail(plant_summary, PLANT_DETAIL, _PLANT_DETAIL_KEYS)

ws = wb.create_sheet("Plants")
plant_widths = (
    [10, 22, 22, 30, 18, 26, 22, 22, 14, 16, 18, 14, 12, 12, 10, 12, 32, 22, 60]
    + [50] * len(plant_detail_headers)
)
style_sheet(ws, plant_headers, plant_widths)
write_rows(ws, plant_rows, tall_rows=True)

# ----------------------------------------------------------------------------
# SHRIMP SHEET
# ----------------------------------------------------------------------------
shrimp_summary_headers = [
    "ID", "Slug", "Common Name", "Scientific Name", "Origin",
    "Adult Size (cm)", "Min Tank Size (L)", "Colony Min",
    "Diet", "Feeding Notes",
    "Temp (°C)", "pH", "dGH", "TDS (ppm)",
    "Lifespan (yrs)", "Difficulty (1-5)", "Breeding",
    "Algae Eater Rating (1-5)", "Plant Safe", "Fish-Tank Safe With",
    "Care Summary",
]
shrimp_detail_headers = [
    "Habitat (Natural)", "Color Grades / Variants", "Sexing", "Molting",
    "Lifecycle", "Common Diseases", "Tank Setup",
    "Good Tank Mates", "Bad Tank Mates", "Price Range (USD)",
    "Pro Tips", "Common Mistakes",
]
shrimp_headers = shrimp_summary_headers + shrimp_detail_headers

shrimp_summary = [
    [
        "shrimp-001", "cherry-shrimp", "Red Cherry Shrimp", "Neocaridina davidi",
        "Taiwan (selectively bred)",
        "2.5–3 cm", "20 L", 10,
        "Omnivore / detritivore", "Biofilm, algae, blanched veg, sinking pellets, calcium-rich food for shell.",
        "18–28", "6.5–8.0", "6–15", "150–250",
        1.5, 1, "Very easy — colony breeds without intervention",
        4, "Yes", "Nano fish only — chili rasbora, ember tetra, otocinclus",
        "The perfect beginner shrimp. Stable parameters matter more than perfect numbers. Calcium for moulting (cuttlebone, GH+, mineral stones) is essential.",
    ],
    [
        "shrimp-002", "amano-shrimp", "Amano Shrimp", "Caridina multidentata",
        "Japan, Korea, Taiwan",
        "4–5 cm", "40 L", 5,
        "Omnivore (heavy algae grazer)", "Hair algae, biofilm, blanched zucchini, sinking pellets, leftover fish food.",
        "20–27", "6.5–8.0", "6–15", "150–300",
        "2–3", 2, "Larvae need brackish water — almost never bred in home tanks",
        5, "Yes", "Most community fish — outgrow most predators",
        "The classic 'algae crew' shrimp Takashi Amano used. Larger and more visible than Neos. Will outgrow risk of being eaten by small tetras.",
    ],
    [
        "shrimp-003", "crystal-red-shrimp", "Crystal Red Shrimp", "Caridina cantonensis 'CRS'",
        "Selectively bred from Hong Kong wild stock",
        "2.5–3 cm", "30 L", 10,
        "Omnivore / detritivore", "Specialised CRS foods (Shirakura, Mosura), biofilm, blanched spinach.",
        "20–24", "5.8–6.8", "3–6", "100–160",
        1.5, 4, "Medium — requires stable soft, acidic water",
        3, "Yes", "Species-only or with otocinclus only",
        "Premium 'caridina' shrimp. Active soil (ADA Amazonia, UNS Controsoil) lowers pH and is effectively required. RO water + remineraliser is standard.",
    ],
    [
        "shrimp-004", "ghost-shrimp", "Ghost / Glass Shrimp", "Palaemonetes paludosus",
        "Eastern and Southern United States",
        "3–5 cm", "40 L", 6,
        "Omnivore / scavenger", "Pretty much anything — pellets, flake, blanched veg, frozen foods.",
        "20–28", "7.0–8.0", "5–15", "200–400",
        "1–2", 1, "Easy in fresh water (some sources say brackish for larvae)",
        2, "Yes", "Most community fish — semi-aggressive, may pester slower fish",
        "Cheap and disposable in big pet stores but a legitimate keeper species. Larger ghost shrimp can occasionally nip small fish or other shrimp.",
    ],
    [
        "shrimp-005", "blue-dream-shrimp", "Blue Dream Shrimp", "Neocaridina davidi 'Blue Dream'",
        "Selectively bred (Neocaridina lineage)",
        "2.5–3 cm", "20 L", 10,
        "Omnivore / detritivore", "Biofilm, algae, blanched veg, sinking pellets, calcium supplements.",
        "18–28", "6.5–8.0", "6–15", "150–250",
        1.5, 1, "Very easy — same as Red Cherries",
        4, "Yes", "Nano fish only — same as Red Cherry",
        "A deep solid-blue Neocaridina line. Care is identical to Red Cherry. Keep separated from other Neocaridina colour morphs to prevent reversion to wild grey.",
    ],
    [
        "shrimp-006", "yellow-shrimp", "Yellow Neocaridina", "Neocaridina davidi 'Yellow'",
        "Selectively bred (Neocaridina lineage)",
        "2.5–3 cm", "20 L", 10,
        "Omnivore / detritivore", "Biofilm, algae, blanched veg, sinking pellets.",
        "18–28", "6.5–8.0", "6–15", "150–250",
        1.5, 1, "Very easy",
        4, "Yes", "Nano fish only",
        "High-visibility colour — pops against dark substrate and green plants. Same easy care as Red Cherry.",
    ],
    [
        "shrimp-007", "bee-shrimp", "Bee Shrimp (wild)", "Caridina cantonensis",
        "Southern China, Hong Kong",
        "2.5–3 cm", "30 L", 10,
        "Omnivore / detritivore", "Biofilm, specialised caridina foods, blanched spinach.",
        "20–24", "5.8–6.8", "3–6", "100–160",
        1.5, 3, "Medium",
        3, "Yes", "Species-only",
        "The ancestor of CRS, Crystal Black, Taiwan Bees. Markings are less crisp than CRS but care is identical. Good gateway from Neocaridina to Caridina-keeping.",
    ],
    [
        "shrimp-008", "bamboo-shrimp", "Bamboo / Wood Shrimp", "Atyopsis moluccensis",
        "Southeast Asia",
        "8–10 cm", "75 L", 1,
        "Filter feeder", "Catches microscopic particles in fans — powdered fry food, suspended algae, micron particulates in the current.",
        "22–28", "7.0–7.5", "6–15", "200–400",
        "2–3", 2, "Larvae need brackish — not practical at home",
        2, "Yes", "Peaceful community fish only",
        "Huge, gentle, fascinating shrimp. Needs strong flow and suspended food to filter — starves in a clean tank. Sits on hardscape and waves its fans into the current.",
    ],
    [
        "shrimp-009", "snowball-shrimp", "Snowball Shrimp", "Neocaridina palmata var.",
        "Selectively bred (China)",
        "2.5–3 cm", "20 L", 10,
        "Omnivore / detritivore", "Biofilm, algae, blanched veg, sinking pellets.",
        "18–28", "7.0–8.0", "6–15", "180–280",
        1.5, 1, "Very easy — eggs are white like snowballs",
        4, "Yes", "Nano fish only",
        "Translucent white body with iconic white egg saddle. Same Neocaridina care profile as cherries; prefers slightly harder water than Caridina lines.",
    ],
    [
        "shrimp-010", "blue-bolt-shrimp", "Blue Bolt Shrimp", "Caridina cantonensis 'Blue Bolt'",
        "Selectively bred (Taiwan Bee line)",
        "2.5–3 cm", "30 L", 10,
        "Omnivore / detritivore", "Specialised caridina foods, biofilm, blanched spinach.",
        "20–24", "5.8–6.5", "3–6", "100–150",
        1.5, 4, "Medium — soft, acidic, very stable water",
        3, "Yes", "Species-only",
        "Taiwan Bee line with gradient blue/white head-to-tail. Pricier and more sensitive than CRS. Active soil + RO + remineraliser is the standard setup.",
    ],
]

_SHRIMP_DETAIL_KEYS = [
    "habitatNatural", "colorGrades", "sexing", "molting",
    "lifecycle", "diseases", "tankSetup",
    "goodTankMates", "badTankMates", "priceRange",
    "proTips", "commonMistakes",
]
shrimp_rows = merge_detail(shrimp_summary, SHRIMP_DETAIL, _SHRIMP_DETAIL_KEYS)

ws = wb.create_sheet("Shrimp")
shrimp_widths = (
    [10, 22, 22, 32, 28, 14, 14, 10, 22, 38, 12, 12, 10, 12, 12, 12, 28, 14, 12, 38, 60]
    + [50] * len(shrimp_detail_headers)
)
style_sheet(ws, shrimp_headers, shrimp_widths)
write_rows(ws, shrimp_rows, tall_rows=True)

# ----------------------------------------------------------------------------
# MOSSES SHEET
# ----------------------------------------------------------------------------
moss_summary_headers = [
    "ID", "Slug", "Common Name", "Scientific Name", "Family", "Origin",
    "Type", "Attachment", "Typical Use",
    "Light", "CO2", "Growth Rate",
    "Temp (°C)", "pH", "Difficulty (1-5)",
    "Trimming", "Care Summary",
]
moss_detail_headers = [
    "Habitat (Natural)", "Identification Notes", "Emersed Form", "Tying Technique",
    "Tank Setup", "Algae Issues", "Sister Species", "Variants",
    "Price Range (USD)", "Pro Tips", "Common Mistakes",
]
moss_headers = moss_summary_headers + moss_detail_headers

moss_summary = [
    [
        "moss-001", "java-moss", "Java Moss", "Taxiphyllum barbieri",
        "Hypnaceae", "Southeast Asia",
        "Moss", "Wood, stone, mesh, free-floating", "General use — walls, trees, caves, shrimp tanks",
        "Low to Medium", "None to Optional", "Fast",
        "18–30", "5.5–8.0", 1,
        "Every 2–4 weeks once established",
        "The default beginner moss. Tolerates almost anything but messy when left untrimmed. The shrimplet nursery of choice — dense fronds trap food and biofilm.",
    ],
    [
        "moss-002", "christmas-moss", "Christmas Moss", "Vesicularia montagnei",
        "Hypnaceae", "Asia (tropical)",
        "Moss", "Wood, stone, mesh", "Trees, walls — denser/tidier than Java",
        "Medium", "Optional", "Medium",
        "20–28", "5.5–7.5", 2,
        "Every 3–4 weeks — trim flat to encourage branching",
        "Triangular 'christmas-tree' frond pattern is its signature. Needs slightly higher light than Java to keep that pattern; otherwise reverts to a stringy mess.",
    ],
    [
        "moss-003", "flame-moss", "Flame Moss", "Taxiphyllum 'Flame'",
        "Hypnaceae", "Asia",
        "Moss", "Wood, stone — grows vertically", "Tall, flame-like accents on driftwood",
        "Medium", "Recommended", "Slow to Medium",
        "20–26", "5.5–7.5", 3,
        "Trim sides to keep the upward 'flame' shape",
        "Grows straight up in twisting columns — a distinctive look. Sensitive to high temperatures; struggles above 26 °C long-term.",
    ],
    [
        "moss-004", "weeping-moss", "Weeping Moss", "Vesicularia ferriei",
        "Hypnaceae", "China",
        "Moss", "Wood, stone — droops downward", "Tree canopies, drooping branches",
        "Medium", "Recommended", "Medium",
        "20–26", "5.5–7.5", 3,
        "Trim ends every 4–6 weeks to maintain weeping shape",
        "Grows downward — perfect for the 'weeping willow' tree look on tall driftwood. Needs steady CO₂ and decent flow to weep properly without trapping detritus.",
    ],
    [
        "moss-005", "peacock-moss", "Peacock Moss", "Taxiphyllum sp. 'Peacock'",
        "Hypnaceae", "Asia",
        "Moss", "Wood, stone, mesh", "Mid-density carpets and feathery rocks",
        "Medium", "Recommended", "Slow to Medium",
        "20–26", "5.5–7.5", 3,
        "Every 4–6 weeks",
        "Feathery, slightly iridescent green. Slower than Java/Christmas — patient growers are rewarded with one of the most ornamental mosses available.",
    ],
    [
        "moss-006", "spiky-moss", "Spiky Moss", "Taxiphyllum sp. 'Spiky'",
        "Hypnaceae", "Asia",
        "Moss", "Wood, stone, mesh", "Bushy walls and stone accents",
        "Medium", "Optional", "Medium",
        "18–28", "5.5–7.5", 2,
        "Every 3–4 weeks",
        "Taller, more pointed fronds than Christmas moss — bushier overall look. A great all-rounder when you want a textured moss surface without weeping.",
    ],
    [
        "moss-007", "mini-christmas-moss", "Mini Christmas Moss", "Vesicularia sp.",
        "Hypnaceae", "Asia",
        "Moss", "Wood, stone, fine mesh", "Bonsai trees, small-scale scapes, nano walls",
        "Medium", "Recommended", "Slow",
        "20–26", "5.5–7.5", 3,
        "Every 4–6 weeks with sharp scissors",
        "A more compact Christmas moss with smaller fronds — best moss for nano bonsai trees and miniature aquascapes. Slow but worth the wait.",
    ],
    [
        "moss-008", "riccia-fluitans", "Riccia / Crystalwort", "Riccia fluitans",
        "Ricciaceae", "Worldwide temperate",
        "Liverwort (treated as moss)", "Tied under mesh; floats otherwise", "Bright green carpets that pearl heavily",
        "High", "Required", "Fast",
        "20–26", "6.0–7.5", 4,
        "Trim weekly — buoyant fronds break free if too long",
        "Amano popularised it as a substrate carpet — but it has no roots, so it must be tied under stainless mesh. Pearls oxygen aggressively under CO₂ and high light.",
    ],
    [
        "moss-009", "phoenix-moss", "Phoenix Moss / Fissidens", "Fissidens fontanus",
        "Fissidentaceae", "Eastern North America",
        "Moss", "Wood, stone (slow to attach)", "Detailed hardscape feature moss",
        "Medium", "Recommended", "Very slow",
        "18–26", "6.0–7.5", 3,
        "Rarely — just remove detritus carefully",
        "A premium feature moss — small, fern-like fronds that hug stone. Slow growth means it stays compact and ornamental for months between trims.",
    ],
    [
        "moss-010", "sussewassertang", "Süßwassertang / Mini Pellia", "Lomariopsis lineata",
        "Lomariopsidaceae", "Tropical (origin unclear; first found in aquarium trade)",
        "Aquatic fern gametophyte (treated as moss)", "Wedge into crevices or tie under mesh", "Crevice fillers and lush dark green carpets",
        "Low to Medium", "Optional", "Medium",
        "20–26", "5.5–7.5", 2,
        "Trim with scissors every 4–6 weeks",
        "Technically the gametophyte stage of an aquatic fern, not a true moss. Forms dark green ruffled mats. Hardy and undemanding — a stealth favourite among aquascapers.",
    ],
]

_MOSS_DETAIL_KEYS = [
    "habitatNatural", "identificationNotes", "emersedForm", "tying",
    "tankSetup", "algaeIssues", "sisterSpecies", "variants",
    "priceRange", "proTips", "commonMistakes",
]
moss_rows = merge_detail(moss_summary, MOSS_DETAIL, _MOSS_DETAIL_KEYS)

ws = wb.create_sheet("Mosses")
moss_widths = (
    [10, 22, 24, 30, 18, 26, 22, 28, 30, 16, 18, 14, 12, 12, 12, 28, 60]
    + [50] * len(moss_detail_headers)
)
style_sheet(ws, moss_headers, moss_widths)
write_rows(ws, moss_rows, tall_rows=True)

# ----------------------------------------------------------------------------
# IMAGES SHEET — 5 slots per species, 40 species = 200 rows
# ----------------------------------------------------------------------------
images_headers = [
    "Species ID", "Category", "Common Name", "Scientific Name",
    "Image #",
    "Wikipedia URL (article)",
    "Commons Category URL (gallery)",
    "Commons File Title",
    "Direct Image URL",
    "Description Page URL",
    "License (short)",
    "License URL",
    "Author / Photographer",
    "Credit",
    "Attribution Required",
    "Caption (Mike to write)",
    "Use On Page",
    "Notes",
]

# Source-of-truth list (matches fetch_images.py)
SPECIES_LIST = [
    ("fish-001", "Fish", "Neon Tetra", "Paracheirodon innesi", "https://en.wikipedia.org/wiki/Neon_tetra"),
    ("fish-002", "Fish", "Cardinal Tetra", "Paracheirodon axelrodi", "https://en.wikipedia.org/wiki/Cardinal_tetra"),
    ("fish-003", "Fish", "Ember Tetra", "Hyphessobrycon amandae", "https://en.wikipedia.org/wiki/Ember_tetra"),
    ("fish-004", "Fish", "Chili Rasbora", "Boraras brigittae", "https://en.wikipedia.org/wiki/Boraras_brigittae"),
    ("fish-005", "Fish", "Harlequin Rasbora", "Trigonostigma heteromorpha", "https://en.wikipedia.org/wiki/Harlequin_rasbora"),
    ("fish-006", "Fish", "Celestial Pearl Danio", "Danio margaritatus", "https://en.wikipedia.org/wiki/Celestial_pearl_danio"),
    ("fish-007", "Fish", "Otocinclus", "Otocinclus vittatus", "https://en.wikipedia.org/wiki/Otocinclus"),
    ("fish-008", "Fish", "Sparkling Gourami", "Trichopsis pumila", "https://en.wikipedia.org/wiki/Trichopsis_pumila"),
    ("fish-009", "Fish", "Pygmy Corydoras", "Corydoras pygmaeus", "https://en.wikipedia.org/wiki/Corydoras_pygmaeus"),
    ("fish-010", "Fish", "German Blue Ram", "Mikrogeophagus ramirezi", "https://en.wikipedia.org/wiki/Mikrogeophagus_ramirezi"),
    ("fish-011", "Fish", "Rummynose Tetra", "Hemigrammus rhodostomus", "https://en.wikipedia.org/wiki/Rummy-nose_tetra"),
    ("fish-012", "Fish", "Honey Gourami", "Trichogaster chuna", "https://en.wikipedia.org/wiki/Honey_gourami"),
    ("fish-013", "Fish", "Cockatoo Dwarf Cichlid", "Apistogramma cacatuoides", "https://en.wikipedia.org/wiki/Apistogramma_cacatuoides"),
    ("fish-014", "Fish", "Kuhli Loach", "Pangio kuhlii", "https://en.wikipedia.org/wiki/Kuhli_loach"),
    ("fish-015", "Fish", "Sterbai Corydoras", "Corydoras sterbai", "https://en.wikipedia.org/wiki/Corydoras_sterbai"),
    ("fish-016", "Fish", "Cherry Barb", "Puntius titteya", "https://en.wikipedia.org/wiki/Cherry_barb"),
    ("fish-017", "Fish", "Endler's Livebearer", "Poecilia wingei", "https://en.wikipedia.org/wiki/Endler%27s_livebearer"),
    ("fish-018", "Fish", "Marbled Hatchetfish", "Carnegiella strigata", "https://en.wikipedia.org/wiki/Marbled_hatchetfish"),
    ("fish-019", "Fish", "White Cloud Mountain Minnow", "Tanichthys albonubes", "https://en.wikipedia.org/wiki/White_Cloud_Mountain_minnow"),
    ("fish-020", "Fish", "Diamond Tetra", "Moenkhausia pittieri", "https://en.wikipedia.org/wiki/Diamond_tetra"),
    ("fish-021", "Fish", "Reticulated Hillstream Loach", "Sewellia lineolata", "https://en.wikipedia.org/wiki/Sewellia_lineolata"),
    ("fish-022", "Fish", "Threadfin Rainbowfish", "Iriatherina werneri", "https://en.wikipedia.org/wiki/Threadfin_rainbowfish"),
    ("fish-023", "Fish", "Lemon Tetra", "Hyphessobrycon pulchripinnis", "https://en.wikipedia.org/wiki/Lemon_tetra"),
    ("fish-024", "Fish", "Clown Killifish", "Epiplatys annulatus", "https://en.wikipedia.org/wiki/Banded_panchax"),
    ("fish-025", "Fish", "Pearl Gourami", "Trichopodus leerii", "https://en.wikipedia.org/wiki/Pearl_gourami"),
    ("fish-026", "Fish", "Forktail Blue-Eye", "Pseudomugil furcatus", "https://en.wikipedia.org/wiki/Pseudomugil_furcatus"),
    ("fish-027", "Fish", "Bristlenose Pleco", "Ancistrus cirrhosus", "https://en.wikipedia.org/wiki/Ancistrus"),
    ("fish-028", "Fish", "Black Neon Tetra", "Hyphessobrycon herbertaxelrodi", "https://en.wikipedia.org/wiki/Black_neon_tetra"),
    ("fish-029", "Fish", "Siamese Algae Eater", "Crossocheilus oblongus", "https://en.wikipedia.org/wiki/Siamese_algae_eater"),
    ("fish-030", "Fish", "Dwarf Pencilfish", "Nannostomus marginatus", "https://en.wikipedia.org/wiki/Nannostomus_marginatus"),
    ("fish-031", "Fish", "Dwarf Puffer", "Carinotetraodon travancoricus", "https://en.wikipedia.org/wiki/Dwarf_pufferfish"),
    ("fish-032", "Fish", "Agassiz's Dwarf Cichlid", "Apistogramma agassizii", "https://en.wikipedia.org/wiki/Apistogramma_agassizii"),
    ("fish-033", "Fish", "Black Phantom Tetra", "Hyphessobrycon megalopterus", "https://en.wikipedia.org/wiki/Black_phantom_tetra"),
    ("fish-034", "Fish", "Glowlight Tetra", "Hemigrammus erythrozonus", "https://en.wikipedia.org/wiki/Glowlight_tetra"),
    ("plant-001", "Plant", "Anubias Barteri Nana", "Anubias barteri", "https://en.wikipedia.org/wiki/Anubias_barteri"),
    ("plant-002", "Plant", "Java Fern", "Microsorum pteropus", "https://en.wikipedia.org/wiki/Java_fern"),
    ("plant-003", "Plant", "Amazon Sword", "Echinodorus grisebachii", "https://en.wikipedia.org/wiki/Echinodorus_grisebachii"),
    ("plant-004", "Plant", "Cryptocoryne Wendtii", "Cryptocoryne wendtii", "https://en.wikipedia.org/wiki/Cryptocoryne_wendtii"),
    ("plant-005", "Plant", "Vallisneria Spiralis", "Vallisneria spiralis", "https://en.wikipedia.org/wiki/Vallisneria_spiralis"),
    ("plant-006", "Plant", "Dwarf Hygrophila", "Hygrophila polysperma", "https://en.wikipedia.org/wiki/Hygrophila_polysperma"),
    ("plant-007", "Plant", "Bucephalandra", "Bucephalandra sp.", "https://en.wikipedia.org/wiki/Bucephalandra"),
    ("plant-008", "Plant", "Dwarf Hairgrass", "Eleocharis parvula", "https://en.wikipedia.org/wiki/Eleocharis_parvula"),
    ("plant-009", "Plant", "Monte Carlo", "Micranthemum tweediei", "https://en.wikipedia.org/wiki/Micranthemum_tweediei"),
    ("plant-010", "Plant", "Rotala Rotundifolia", "Rotala rotundifolia", "https://en.wikipedia.org/wiki/Rotala_rotundifolia"),
    ("plant-011", "Plant", "Ludwigia Repens", "Ludwigia repens", "https://en.wikipedia.org/wiki/Ludwigia_repens"),
    ("plant-012", "Plant", "Staurogyne Repens", "Staurogyne repens", "https://en.wikipedia.org/wiki/Staurogyne_repens"),
    ("plant-013", "Plant", "Dwarf Baby Tears", "Hemianthus callitrichoides", "https://en.wikipedia.org/wiki/Hemianthus_callitrichoides"),
    ("plant-014", "Plant", "Pogostemon Helferi", "Pogostemon helferi", "https://en.wikipedia.org/wiki/Pogostemon"),
    ("plant-015", "Plant", "Salvinia Natans", "Salvinia natans", "https://en.wikipedia.org/wiki/Salvinia_natans"),
    ("plant-016", "Plant", "Bacopa Caroliniana", "Bacopa caroliniana", "https://en.wikipedia.org/wiki/Bacopa_caroliniana"),
    ("plant-017", "Plant", "Cryptocoryne Parva", "Cryptocoryne parva", "https://en.wikipedia.org/wiki/Cryptocoryne_parva"),
    ("plant-018", "Plant", "Asian Ambulia", "Limnophila sessiliflora", "https://en.wikipedia.org/wiki/Limnophila_sessiliflora"),
    ("plant-019", "Plant", "Glossostigma", "Glossostigma elatinoides", "https://en.wikipedia.org/wiki/Glossostigma_elatinoides"),
    ("plant-020", "Plant", "Micro Sword", "Lilaeopsis brasiliensis", "https://en.wikipedia.org/wiki/Lilaeopsis_brasiliensis"),
    ("plant-021", "Plant", "Four-Leaf Clover", "Marsilea hirsuta", "https://en.wikipedia.org/wiki/Marsilea_hirsuta"),
    ("plant-022", "Plant", "Amazon Frogbit", "Limnobium laevigatum", "https://en.wikipedia.org/wiki/Limnobium_laevigatum"),
    ("plant-023", "Plant", "Hygrophila Pinnatifida", "Hygrophila pinnatifida", "https://en.wikipedia.org/wiki/Hygrophila_pinnatifida"),
    ("plant-024", "Plant", "Aponogeton Crispus", "Aponogeton crispus", "https://en.wikipedia.org/wiki/Aponogeton_crispus"),
    ("plant-025", "Plant", "Lobelia Cardinalis", "Lobelia cardinalis", "https://en.wikipedia.org/wiki/Lobelia_cardinalis"),
    ("plant-026", "Plant", "Dwarf Sagittaria", "Sagittaria subulata", "https://en.wikipedia.org/wiki/Sagittaria_subulata"),
    ("plant-027", "Plant", "Ludwigia Super Red", "Ludwigia palustris", "https://en.wikipedia.org/wiki/Ludwigia_palustris"),
    ("plant-028", "Plant", "Pearlweed", "Hemianthus glomeratus", "https://en.wikipedia.org/wiki/Micranthemum"),
    ("plant-029", "Plant", "Chain Sword", "Helanthium tenellum", "https://en.wikipedia.org/wiki/Echinodorus_tenellus"),
    ("plant-030", "Plant", "Needle Hairgrass", "Eleocharis acicularis", "https://en.wikipedia.org/wiki/Eleocharis_acicularis"),
    ("plant-031", "Plant", "Cryptocoryne Lutea", "Cryptocoryne lutea", "https://en.wikipedia.org/wiki/Cryptocoryne_lutea"),
    ("plant-032", "Plant", "Java Fern Windelov", "Microsorum pteropus", "https://en.wikipedia.org/wiki/Java_fern"),
    ("plant-033", "Plant", "African Water Fern", "Bolbitis heudelotii", "https://en.wikipedia.org/wiki/Bolbitis_heudelotii"),
    ("plant-034", "Plant", "Ranunculus Inundatus", "Ranunculus inundatus", "https://en.wikipedia.org/wiki/Ranunculus_inundatus"),
    ("shrimp-001", "Shrimp", "Red Cherry Shrimp", "Neocaridina davidi", "https://en.wikipedia.org/wiki/Neocaridina_davidi"),
    ("shrimp-002", "Shrimp", "Amano Shrimp", "Caridina multidentata", "https://en.wikipedia.org/wiki/Caridina_multidentata"),
    ("shrimp-003", "Shrimp", "Crystal Red Shrimp", "Caridina cantonensis", "https://en.wikipedia.org/wiki/Caridina_cantonensis"),
    ("shrimp-004", "Shrimp", "Ghost Shrimp", "Palaemonetes paludosus", "https://en.wikipedia.org/wiki/Palaemonetes_paludosus"),
    ("shrimp-005", "Shrimp", "Blue Dream Shrimp", "Neocaridina davidi", "https://en.wikipedia.org/wiki/Neocaridina_davidi"),
    ("shrimp-006", "Shrimp", "Yellow Neocaridina", "Neocaridina davidi", "https://en.wikipedia.org/wiki/Neocaridina_davidi"),
    ("shrimp-007", "Shrimp", "Bee Shrimp", "Caridina cantonensis", "https://en.wikipedia.org/wiki/Caridina_cantonensis"),
    ("shrimp-008", "Shrimp", "Bamboo Shrimp", "Atyopsis moluccensis", "https://en.wikipedia.org/wiki/Atyopsis_moluccensis"),
    ("shrimp-009", "Shrimp", "Snowball Shrimp", "Neocaridina", "https://en.wikipedia.org/wiki/Neocaridina"),
    ("shrimp-010", "Shrimp", "Blue Bolt Shrimp", "Caridina cantonensis", "https://en.wikipedia.org/wiki/Caridina_cantonensis"),
    ("moss-001", "Moss", "Java Moss", "Taxiphyllum barbieri", "https://en.wikipedia.org/wiki/Java_moss"),
    ("moss-002", "Moss", "Christmas Moss", "Vesicularia montagnei", "https://en.wikipedia.org/wiki/Vesicularia_montagnei"),
    ("moss-003", "Moss", "Flame Moss", "Taxiphyllum sp.", "https://en.wikipedia.org/wiki/Taxiphyllum"),
    ("moss-004", "Moss", "Weeping Moss", "Vesicularia ferriei", "https://en.wikipedia.org/wiki/Vesicularia_ferriei"),
    ("moss-005", "Moss", "Peacock Moss", "Taxiphyllum sp.", "https://en.wikipedia.org/wiki/Taxiphyllum"),
    ("moss-006", "Moss", "Spiky Moss", "Taxiphyllum sp.", "https://en.wikipedia.org/wiki/Taxiphyllum"),
    ("moss-007", "Moss", "Mini Christmas Moss", "Vesicularia sp.", "https://en.wikipedia.org/wiki/Vesicularia"),
    ("moss-008", "Moss", "Riccia / Crystalwort", "Riccia fluitans", "https://en.wikipedia.org/wiki/Riccia_fluitans"),
    ("moss-009", "Moss", "Phoenix Moss / Fissidens", "Fissidens fontanus", "https://en.wikipedia.org/wiki/Fissidens_fontanus"),
    ("moss-010", "Moss", "Süßwassertang", "Lomariopsis lineata", "https://en.wikipedia.org/wiki/Lomariopsis_lineata"),
]

USE_ON_PAGE = ["Lead (hero)", "Detail 1", "Detail 2", "Detail 3", "Gallery / spare"]

image_rows = []
for sp_id, category, common, sci, wiki_url in SPECIES_LIST:
    commons_cat = f"https://commons.wikimedia.org/wiki/Category:{sci.replace(' ', '_')}"
    for slot in range(1, 6):  # 5 slots
        image_rows.append([
            sp_id, category, common, sci,
            slot,
            wiki_url,
            commons_cat,
            "",  # Commons File Title — filled by fetch_images.py
            "",  # Direct Image URL
            "",  # Description Page URL
            "",  # License
            "",  # License URL
            "",  # Author
            "",  # Credit
            "",  # Attribution Required
            "",  # Caption (Mike writes)
            USE_ON_PAGE[slot - 1],
            "Run fetch_images.py locally to populate URL/license/author. Then Mike writes captions." if slot == 1 else "",
        ])

ws = wb.create_sheet("Images")
img_widths = [12, 10, 24, 30, 8, 50, 55, 35, 60, 55, 18, 40, 30, 40, 12, 38, 18, 60]
style_sheet(ws, images_headers, img_widths)
write_rows(ws, image_rows, tall_rows=False)


# Save
import os
out_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "aquascaping-catalogue-seed.xlsx",
)
wb.save(out_path)
print("Saved:", out_path)
print(f"Fish:    {len(fish_rows)} rows, {len(fish_headers)} cols")
print(f"Plants:  {len(plant_rows)} rows, {len(plant_headers)} cols")
print(f"Shrimp:  {len(shrimp_rows)} rows, {len(shrimp_headers)} cols")
print(f"Mosses:  {len(moss_rows)} rows, {len(moss_headers)} cols")
print(f"Images:  {len(image_rows)} rows, {len(images_headers)} cols")
