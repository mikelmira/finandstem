/**
 * Shared client-side storage for the comparison set.
 *
 * The /compare page treats the URL `?ids=` param as canonical (so URLs stay
 * shareable), but species detail pages need to know what is *already* in the
 * comparison when the user clicks "Compare". localStorage bridges that gap.
 */

export const COMPARE_MAX = 4;
const STORAGE_KEY = "finstem.compare.ids";

/** Safe to call from SSR — returns [] when window is unavailable. */
export function readCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    return [];
  }
}

export function writeCompareIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* storage full or disabled — comparison just won't persist */
  }
}

/**
 * Add an id and return the new array (FIFO drop when at COMPARE_MAX).
 * If `id` is already present, the existing array is returned unchanged.
 */
export function appendCompareId(current: string[], id: string): string[] {
  if (current.includes(id)) return current;
  const next = [...current, id];
  if (next.length > COMPARE_MAX) next.splice(0, next.length - COMPARE_MAX);
  return next;
}
