/**
 * Geographic regions referenced in species origin strings.
 *
 * Each region has approximate centre coordinates (lng/lat) and a friendly
 * label. The parser walks an origin string and returns every region that
 * matches one of the keyword patterns, dedupes them, and that's what gets
 * rendered as markers on the OriginMap.
 *
 * Coordinates are intentionally approximate, they're meant to drop a pin
 * "around here" on a world map, not pinpoint a stream.
 */

export interface OriginRegion {
  /** Stable id used as a React key + keyword for dedupe. */
  id: string;
  /** Display label shown on the map legend + tooltip. */
  label: string;
  /** [longitude, latitude], d3-geo / GeoJSON order. */
  coords: [number, number];
}

interface Pattern {
  /** Keywords matched case-insensitively. First-match wins per region. */
  keywords: string[];
  region: OriginRegion;
}

const PATTERNS: Pattern[] = [
  // South America — specific basins / countries
  {
    keywords: ["upper amazon"],
    region: {
      id: "upper-amazon",
      label: "Upper Amazon basin",
      coords: [-74, -5],
    },
  },
  {
    keywords: ["lower amazon", "amazon basin"],
    region: {
      id: "amazon-basin",
      label: "Amazon basin",
      coords: [-60, -3],
    },
  },
  {
    keywords: ["rio negro"],
    region: {
      id: "rio-negro",
      label: "Rio Negro",
      coords: [-65, -1],
    },
  },
  {
    keywords: ["orinoco"],
    region: {
      id: "orinoco",
      label: "Orinoco basin",
      coords: [-67, 6],
    },
  },
  {
    keywords: ["rio das mortes"],
    region: {
      id: "rio-das-mortes",
      label: "Rio das Mortes, Brazil",
      coords: [-52, -13],
    },
  },
  {
    keywords: ["madeira river"],
    region: {
      id: "madeira",
      label: "Madeira basin",
      coords: [-61, -5],
    },
  },
  {
    keywords: ["paraguay river", "paraguay"],
    region: {
      id: "paraguay",
      label: "Paraguay River basin",
      coords: [-58, -23],
    },
  },
  {
    keywords: ["rio guaporé", "guapore"],
    region: {
      id: "guapore",
      label: "Rio Guaporé",
      coords: [-62, -12],
    },
  },
  {
    keywords: ["rio cristalino", "cristalino"],
    region: {
      id: "cristalino",
      label: "Rio Cristalino, Brazil",
      coords: [-55, -10],
    },
  },
  {
    keywords: ["lake valencia"],
    region: {
      id: "lake-valencia",
      label: "Lake Valencia, Venezuela",
      coords: [-67, 10],
    },
  },
  {
    keywords: ["laguna de patos"],
    region: {
      id: "laguna-patos",
      label: "Laguna de Patos, Venezuela",
      coords: [-64, 10],
    },
  },
  {
    keywords: ["essequibo"],
    region: {
      id: "essequibo",
      label: "Essequibo basin, Guyana",
      coords: [-58, 5],
    },
  },
  {
    keywords: ["western guyana", "suriname"],
    region: {
      id: "guianas",
      label: "Western Guyana / Suriname",
      coords: [-58, 4],
    },
  },
  {
    keywords: ["bolivia"],
    region: {
      id: "bolivia",
      label: "Bolivia",
      coords: [-65, -17],
    },
  },
  {
    keywords: ["peru"],
    region: {
      id: "peru",
      label: "Peru",
      coords: [-75, -10],
    },
  },
  {
    keywords: ["colombia"],
    region: {
      id: "colombia",
      label: "Colombia",
      coords: [-73, 4],
    },
  },
  {
    keywords: ["venezuela"],
    region: {
      id: "venezuela",
      label: "Venezuela",
      coords: [-66, 8],
    },
  },
  {
    keywords: ["guyana"],
    region: {
      id: "guyana",
      label: "Guyana",
      coords: [-58, 5],
    },
  },
  {
    keywords: ["brazil"],
    region: {
      id: "brazil",
      label: "Brazil",
      coords: [-52, -10],
    },
  },
  {
    keywords: ["argentina"],
    region: {
      id: "argentina",
      label: "Argentina",
      coords: [-64, -38],
    },
  },
  // Central America / Caribbean
  {
    keywords: ["cuba"],
    region: { id: "cuba", label: "Cuba", coords: [-78, 22] },
  },
  {
    keywords: ["central america"],
    region: {
      id: "central-america",
      label: "Central America",
      coords: [-89, 15],
    },
  },
  // North America
  {
    keywords: [
      "eastern usa",
      "eastern and southern united states",
      "eastern and southern usa",
      "southeastern usa",
      "eastern north america",
    ],
    region: {
      id: "eastern-usa",
      label: "Eastern USA",
      coords: [-82, 33],
    },
  },
  {
    keywords: ["central america to southern usa"],
    region: {
      id: "americas-warm",
      label: "Central America → southern USA",
      coords: [-90, 25],
    },
  },
  // Africa
  {
    keywords: ["cameroon"],
    region: {
      id: "cameroon",
      label: "Cameroon",
      coords: [12, 6],
    },
  },
  {
    keywords: ["west africa", "western africa"],
    region: {
      id: "west-africa",
      label: "West Africa",
      coords: [3, 8],
    },
  },
  {
    keywords: ["sierra leone", "guinea", "liberia"],
    region: {
      id: "upper-guinea",
      label: "Upper Guinea coast",
      coords: [-11, 8],
    },
  },
  {
    keywords: ["central and west africa", "central africa"],
    region: {
      id: "central-africa",
      label: "Central Africa",
      coords: [15, 0],
    },
  },
  // Asia
  {
    keywords: ["sri lanka"],
    region: {
      id: "sri-lanka",
      label: "Sri Lanka",
      coords: [81, 7],
    },
  },
  {
    keywords: ["western ghats", "kerala"],
    region: {
      id: "western-ghats",
      label: "Western Ghats, India",
      coords: [75, 12],
    },
  },
  {
    keywords: ["india"],
    region: {
      id: "india",
      label: "India",
      coords: [78, 22],
    },
  },
  {
    keywords: ["bangladesh"],
    region: {
      id: "bangladesh",
      label: "Bangladesh",
      coords: [90, 23],
    },
  },
  {
    keywords: ["bhutan"],
    region: {
      id: "bhutan",
      label: "Bhutan",
      coords: [90, 27],
    },
  },
  {
    keywords: ["nepal"],
    region: {
      id: "nepal",
      label: "Nepal",
      coords: [84, 28],
    },
  },
  {
    keywords: ["hopong", "myanmar"],
    region: {
      id: "myanmar",
      label: "Myanmar",
      coords: [96, 21],
    },
  },
  {
    keywords: ["white cloud mountain", "guangdong"],
    region: {
      id: "guangdong",
      label: "Guangdong, China",
      coords: [113, 23],
    },
  },
  {
    keywords: ["hong kong"],
    region: {
      id: "hong-kong",
      label: "Hong Kong",
      coords: [114, 22],
    },
  },
  {
    keywords: ["southern china"],
    region: {
      id: "southern-china",
      label: "Southern China",
      coords: [110, 25],
    },
  },
  {
    keywords: ["china"],
    region: { id: "china", label: "China", coords: [105, 35] },
  },
  {
    keywords: ["taiwan"],
    region: { id: "taiwan", label: "Taiwan", coords: [121, 23] },
  },
  {
    keywords: ["japan"],
    region: { id: "japan", label: "Japan", coords: [138, 36] },
  },
  {
    keywords: ["korea"],
    region: { id: "korea", label: "Korea", coords: [128, 36] },
  },
  {
    keywords: ["mekong", "chao phraya"],
    region: {
      id: "mekong-chao",
      label: "Mekong / Chao Phraya",
      coords: [104, 14],
    },
  },
  {
    keywords: ["central and southern vietnam", "vietnam"],
    region: {
      id: "vietnam",
      label: "Vietnam",
      coords: [108, 14],
    },
  },
  {
    keywords: ["thailand"],
    region: {
      id: "thailand",
      label: "Thailand",
      coords: [101, 15],
    },
  },
  {
    keywords: ["malaysia", "malay peninsula"],
    region: {
      id: "malay-peninsula",
      label: "Malay Peninsula",
      coords: [102, 4],
    },
  },
  {
    keywords: ["sumatra"],
    region: {
      id: "sumatra",
      label: "Sumatra",
      coords: [102, 0],
    },
  },
  {
    keywords: ["java"],
    region: { id: "java", label: "Java", coords: [110, -7] },
  },
  {
    keywords: ["borneo"],
    region: {
      id: "borneo",
      label: "Borneo",
      coords: [114, 1],
    },
  },
  {
    keywords: ["indonesia"],
    region: {
      id: "indonesia",
      label: "Indonesia",
      coords: [118, -2],
    },
  },
  {
    keywords: ["mainland southeast asia"],
    region: {
      id: "mainland-se-asia",
      label: "Mainland Southeast Asia",
      coords: [105, 12],
    },
  },
  {
    keywords: ["southeast asia"],
    region: {
      id: "southeast-asia",
      label: "Southeast Asia",
      coords: [110, 5],
    },
  },
  {
    keywords: ["south and southeast asia"],
    region: {
      id: "south-and-se-asia",
      label: "South & Southeast Asia",
      coords: [95, 15],
    },
  },
  // Oceania
  // Continental fallbacks — only fire when no more specific pattern matched
  {
    keywords: ["south america"],
    region: {
      id: "south-america",
      label: "South America",
      coords: [-58, -10],
    },
  },
  {
    keywords: ["new zealand"],
    region: {
      id: "new-zealand",
      label: "New Zealand",
      coords: [172, -41],
    },
  },
  {
    keywords: ["northern australia"],
    region: {
      id: "northern-australia",
      label: "Northern Australia",
      coords: [134, -15],
    },
  },
  {
    keywords: ["eastern australia"],
    region: {
      id: "eastern-australia",
      label: "Eastern Australia",
      coords: [148, -28],
    },
  },
  {
    keywords: ["southeastern australia"],
    region: {
      id: "se-australia",
      label: "Southeastern Australia",
      coords: [147, -36],
    },
  },
  {
    keywords: ["australia"],
    region: {
      id: "australia",
      label: "Australia",
      coords: [135, -25],
    },
  },
  {
    keywords: ["papua new guinea", "new guinea"],
    region: {
      id: "png",
      label: "Papua New Guinea",
      coords: [144, -6],
    },
  },
];

/**
 * Parse an origin string and return every distinct region matched.
 *
 * Patterns are listed most-specific first. As each pattern matches, the
 * matched keyword is stripped from the working string so generic patterns
 * cannot re-claim the same characters: "Upper Amazon basin, Brazil" gives
 * [upper-amazon, brazil] rather than [upper-amazon, amazon-basin, brazil].
 */
export function regionsFromOrigin(origin: string): OriginRegion[] {
  if (!origin) return [];
  let working = origin.toLowerCase();
  const seen = new Set<string>();
  const out: OriginRegion[] = [];
  for (const p of PATTERNS) {
    for (const k of p.keywords) {
      if (!working.includes(k)) continue;
      if (seen.has(p.region.id)) break;
      seen.add(p.region.id);
      out.push(p.region);
      // Strip the matched keyword + any nearby spaces so a more generic
      // pattern can't re-claim the same characters.
      working = working.split(k).join(" ");
      break;
    }
  }
  return out;
}
