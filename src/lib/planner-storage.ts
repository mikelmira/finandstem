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

/** Safe to call from SSR, returns [] when window is unavailable. */
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
    /* storage full or disabled, selection just won't persist */
  }
  emitPlannerChange();
}

// ── useSyncExternalStore bridge ─────────────────────────────────────
// Mirrors compare-storage: PlanButtons subscribe to the planner set so
// several on one page stay in sync, and cross-tab edits arrive via the
// `storage` event.

type Listener = () => void;
const listeners = new Set<Listener>();

function emitPlannerChange(): void {
  snapshotRaw = undefined; // invalidate cache
  for (const l of listeners) l();
}

export function subscribeToPlannerIds(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) emitPlannerChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// getSnapshot must return a referentially-stable value while the
// underlying data is unchanged, so cache by the raw JSON string.
let snapshotRaw: string | null | undefined;
let snapshotIds: string[] = [];
const EMPTY_IDS: string[] = [];

export function getPlannerIdsSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshotIds = readPlannerIds();
  }
  return snapshotIds;
}

export function getPlannerIdsServerSnapshot(): string[] {
  return EMPTY_IDS;
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
