/**
 * Shared client-side storage for the comparison set.
 *
 * The /compare page treats the URL `?ids=` and `?mode=` params as
 * canonical (so URLs stay shareable), but species/substrate detail
 * pages need to know what is *already* in the comparison when the
 * user clicks "Compare". localStorage bridges that gap.
 *
 * The compare tool has two mutually-exclusive modes:
 *   · "livestock"  fish, plants, shrimp, mosses, snails
 *   · "substrate"  substrates only
 *
 * Selections from one mode are never mixed with the other. Switching
 * mode clears the selection.
 */

export const COMPARE_MAX = 4;
const IDS_KEY = "finstem.compare.ids";
const MODE_KEY = "finstem.compare.mode";

export type CompareMode = "livestock" | "substrate";

const VALID_MODES: ReadonlySet<CompareMode> = new Set([
  "livestock",
  "substrate",
]);

/** Safe to call from SSR, returns "livestock" when window is unavailable. */
export function readCompareMode(): CompareMode {
  if (typeof window === "undefined") return "livestock";
  try {
    const v = window.localStorage.getItem(MODE_KEY);
    return v && VALID_MODES.has(v as CompareMode)
      ? (v as CompareMode)
      : "livestock";
  } catch {
    return "livestock";
  }
}

export function writeCompareMode(mode: CompareMode): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MODE_KEY, mode);
  } catch {
    /* storage full or disabled */
  }
}

/** Safe to call from SSR, returns [] when window is unavailable. */
export function readCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(IDS_KEY);
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
    window.localStorage.setItem(IDS_KEY, JSON.stringify(ids));
  } catch {
    /* storage full or disabled, comparison just won't persist */
  }
  emitCompareChange();
}

// ── useSyncExternalStore bridge ─────────────────────────────────────
// Lets components subscribe to the comparison set reactively (multiple
// CompareButtons on one page stay in sync, and cross-tab edits arrive
// via the `storage` event).

type Listener = () => void;
const listeners = new Set<Listener>();

function emitCompareChange(): void {
  snapshotRaw = undefined; // invalidate cache
  for (const l of listeners) l();
}

export function subscribeToCompareIds(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === IDS_KEY || e.key === null) emitCompareChange();
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

export function getCompareIdsSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(IDS_KEY);
  } catch {
    raw = null;
  }
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshotIds = readCompareIds();
  }
  return snapshotIds;
}

export function getCompareIdsServerSnapshot(): string[] {
  return EMPTY_IDS;
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

/**
 * Which mode an id belongs to, based on its `category:slug` prefix.
 * Livestock ids look like "fish:neon-tetra"; substrate ids look like
 * "substrate:ada-amazonia-v2". Returns null for unparseable input.
 */
export function modeForId(id: string): CompareMode | null {
  const colon = id.indexOf(":");
  if (colon < 1) return null;
  const prefix = id.slice(0, colon);
  return prefix === "substrate" ? "substrate" : "livestock";
}

/** Filter an id list down to entries that match the given mode. */
export function filterIdsByMode(ids: string[], mode: CompareMode): string[] {
  return ids.filter((id) => modeForId(id) === mode);
}
