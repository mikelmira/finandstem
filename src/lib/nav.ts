import type * as React from "react";
import {
  BookOpen,
  Bug,
  Calculator,
  Columns3,
  Compass,
  Container,
  Droplets,
  Filter,
  FlaskConical,
  GitCompareArrows,
  Globe2,
  History,
  Layers,
  Leaf,
  LibraryBig,
  Mountain,
  Palette,
  RefreshCw,
  Search,
  Sparkles,
  Stethoscope,
  Wand2,
  Wrench,
} from "lucide-react";
import {
  FishMark,
  PlantMark,
  ShrimpMark,
  MossMark,
  SnailMark,
} from "@/components/icons/species-icons";

/**
 * The site's primary navigation, grouped into dropdowns. This is the single
 * source of truth for the desktop header and the mobile drawer, so a new
 * page only needs adding here once.
 */
export interface NavItem {
  label: string;
  href: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
  /** Optional footer link inside the panel ("All guides", etc.). */
  footer?: { label: string; href: string };
}

export const NAV_GROUPS: ReadonlyArray<NavGroup> = [
  {
    id: "species",
    label: "Species",
    items: [
      { label: "Fish", href: "/fish", description: "Schoolers, centrepieces, dwarf cichlids, algae crew.", Icon: FishMark },
      { label: "Plants", href: "/plants", description: "Carpets, midground, stems, floaters and bulbs.", Icon: PlantMark },
      { label: "Shrimp", href: "/shrimp", description: "Neocaridina, Caridina and the filter-feeders.", Icon: ShrimpMark },
      { label: "Mosses", href: "/mosses", description: "Java, Christmas, Flame, Fissidens and more.", Icon: MossMark },
      { label: "Snails", href: "/snails", description: "Nerites, mystery snails, assassins and the clean-up crew.", Icon: SnailMark },
    ],
  },
  {
    id: "setup",
    label: "Gear & Setup",
    items: [
      { label: "Gear catalogue", href: "/gear", description: "Filters, lights, CO2, tanks and more, matched to your tank.", Icon: Wrench },
      { label: "Hardscape", href: "/hardscape", description: "Stones and wood, and what they do to your water.", Icon: Mountain },
      { label: "Substrates", href: "/substrates", description: "Aquasoils and inert substrates compared.", Icon: Layers },
      { label: "Equipment explained", href: "/equipment", description: "How to size lighting, filtration, CO2 and heating.", Icon: Sparkles },
      { label: "Compare gear", href: "/gear/compare", description: "Put up to four products side by side.", Icon: Columns3 },
    ],
  },
  {
    id: "learn",
    label: "Learn",
    items: [
      { label: "Guides and articles", href: "/guides", description: "In-depth how-tos, comparisons and care guides.", Icon: BookOpen },
      { label: "Planted tank guide", href: "/planted-tank-guide", description: "Light, CO2, substrate and dosing in plain English.", Icon: Leaf },
      { label: "Cycling a tank", href: "/aquarium-cycling", description: "Get the nitrogen cycle running before livestock.", Icon: RefreshCw },
      { label: "Water chemistry", href: "/water-chemistry", description: "pH, GH, KH and TDS, and how to change them.", Icon: Droplets },
      { label: "Aquascaping design", href: "/aquascaping-design", description: "Composition, layouts and the main styles.", Icon: Palette },
      { label: "Maintenance routine", href: "/aquarium-maintenance", description: "What to do daily, weekly and monthly.", Icon: FlaskConical },
      { label: "Glossary", href: "/glossary", description: "Every aquascaping term, explained.", Icon: LibraryBig },
      { label: "History of aquascaping", href: "/history-of-aquascaping", description: "From Victorian tanks to Nature Aquarium.", Icon: History },
    ],
  },
  {
    id: "help",
    label: "Problems",
    items: [
      { label: "Algae ID", href: "/algae", description: "Identify the algae and fix the cause.", Icon: Search },
      { label: "Plant deficiencies", href: "/deficiencies", description: "Yellow, holey or stunted leaves, diagnosed.", Icon: Leaf },
      { label: "Fish and shrimp health", href: "/diseases", description: "Spot disease early and treat it safely.", Icon: Stethoscope },
      { label: "Cloudy water", href: "/guides/how-to-get-clear-aquarium-water", description: "Why water goes cloudy or green, and the fix.", Icon: Bug },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      { label: "Tank planner", href: "/planner", description: "Plan stocking, water and gear for your tank.", Icon: Wand2 },
      { label: "Species finder", href: "/species-finder", description: "Filter every species by your water and tank.", Icon: Compass },
      { label: "Species world map", href: "/species-map", description: "Where every species comes from, on a map.", Icon: Globe2 },
      { label: "Compatibility", href: "/compatibility", description: "Pick a species, see everything it works with.", Icon: Filter },
      { label: "Compare species", href: "/compare", description: "Line up species or substrates side by side.", Icon: GitCompareArrows },
      { label: "Stocking by tank size", href: "/tanks", description: "Best fish, shrimp and plants per volume.", Icon: Container },
      { label: "Calculators", href: "/calculators", description: "Volume, substrate, CO2 and fertiliser dosing.", Icon: Calculator },
    ],
  },
];

/** Links that sit directly in the bar, outside any dropdown. */
export const NAV_FLAT: ReadonlyArray<{ label: string; href: string }> = [
  { label: "About", href: "/about" },
];

/** True when `pathname` belongs to `href` (exact, or a nested page). */
export function navActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
