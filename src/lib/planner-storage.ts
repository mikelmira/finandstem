/**
 * Shared client-side storage for the tank-planner selection.
 *
 * The /planner page treats the URL `?species=` param as canonical (so
 * URLs stay shareable), but species detail pages need to know what's
 * already in the planner when the user clicks "Add to tank".
 * localStorage bridges that gap, mirroring the compare-storage flow.
 *
 * Ids use the planner's full token format: `category:slug` or
 * `category:slug:count`. The helpers here treat the `category:slug`
 * pair as the identity (so two add-clicks on the same species don't
 * insert a duplicate even if a count is set).
 */

const STORAGE_KEY = "finstem.planner.species";

/** Safe to call from SSR — returns [] when window is unavailable. */
export function readPlannerIds(): string[] {
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

export function writePlannerIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* storage full or disabled — selection just won't persist */
  }
}

/** Append an id if a matching `category:slug` isn't already present. */
export function appendPlannerId(current: string[], id: string): string[] {
  const parts = id.split(":");
  if (parts.length < 2) return current;
  const head = `${parts[0]}:${parts[1]}`;
  if (current.some((c) => c.startsWith(head + ":") || c === head)) {
    return current;
  }
  return [...current, id];
}

/** True when the planner already contains a `category:slug` (any count). */
export function plannerHasId(ids: string[], id: string): boolean {
  const parts = id.split(":");
  if (parts.length < 2) return false;
  const head = `${parts[0]}:${parts[1]}`;
  return ids.some((c) => c.startsWith(head + ":") || c === head);
}
