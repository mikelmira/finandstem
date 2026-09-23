/**
 * Client-side storage for the gear compare tray.
 *
 * Gear comparisons are always within one category (a filter table and a
 * light table have different rows), so the tray holds a category plus up
 * to GEAR_COMPARE_MAX items. Adding an item from another category starts
 * a fresh tray. The /gear/compare URL (`?c=&ids=`) stays canonical and
 * shareable; this store just remembers picks while the reader browses.
 */
import type { GearCategory } from "@/types/gear";

export const GEAR_COMPARE_MAX = 4;
const KEY = "finstem.gear-compare";

export interface GearTrayItem {
  id: string;
  name: string;
  thumb?: string;
}

export interface GearTray {
  category: GearCategory | null;
  items: GearTrayItem[];
}

const EMPTY: GearTray = { category: null, items: [] };

function read(): GearTray {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const v = JSON.parse(raw) as GearTray;
    if (!v || !Array.isArray(v.items)) return EMPTY;
    return v;
  } catch {
    return EMPTY;
  }
}

type Listener = () => void;
const listeners = new Set<Listener>();
let cacheRaw: string | null | undefined;
let cache: GearTray = EMPTY;

function emit() {
  cacheRaw = undefined;
  for (const l of listeners) l();
}

export function writeGearTray(tray: GearTray): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(tray));
  } catch {
    /* storage disabled, tray just won't persist */
  }
  emit();
}

export function subscribeGearTray(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getGearTraySnapshot(): GearTray {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    cache = read();
  }
  return cache;
}

export function getGearTrayServerSnapshot(): GearTray {
  return EMPTY;
}

export function toggleGearTray(
  tray: GearTray,
  category: GearCategory,
  item: GearTrayItem,
): GearTray {
  if (tray.category !== category) return { category, items: [item] };
  if (tray.items.some((i) => i.id === item.id)) {
    const items = tray.items.filter((i) => i.id !== item.id);
    return { category: items.length ? category : null, items };
  }
  const items = [...tray.items, item];
  if (items.length > GEAR_COMPARE_MAX) items.splice(0, items.length - GEAR_COMPARE_MAX);
  return { category, items };
}

export function compareHref(category: GearCategory, ids: string[]): string {
  return `/gear/compare?c=${category}&ids=${ids.map(encodeURIComponent).join(",")}`;
}
