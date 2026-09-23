"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, X } from "lucide-react";
import type { GearCard, GearCategory, GearModel } from "@/types/gear";
import { GEAR_CATEGORIES, GEAR_CATEGORY_ORDER } from "@/lib/gear/categories";
import { DISPLAY_LABEL, displayValue } from "@/lib/gear/fields";
import { GEAR_COMPARE_MAX, writeGearTray } from "@/lib/gear/compare-storage";
import { useGearTray } from "@/components/gear/gear-compare-button";
import { cn } from "@/lib/utils";

const cache = new Map<GearCategory, Promise<GearCard[]>>();

function loadCategory(c: GearCategory): Promise<GearCard[]> {
  let p = cache.get(c);
  if (!p) {
    p = fetch(`/gear-data/${c}.json`).then((r) => (r.ok ? r.json() : []));
    cache.set(c, p);
  }
  return p;
}

function isCategory(v: string | null): v is GearCategory {
  return !!v && v in GEAR_CATEGORIES;
}

/**
 * Side-by-side gear comparison. URL (`?c=filters&ids=a,b&m=a:450`) is the
 * source of truth so a comparison can be shared; data for the category is
 * fetched from the static /gear-data JSON, so the page itself stays static.
 */
export function GearCompareClient({ counts }: { counts: Partial<Record<GearCategory, number>> }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tray = useGearTray();

  const cParam = sp?.get("c") ?? null;
  const category: GearCategory | null = isCategory(cParam) ? cParam : null;
  const ids = (sp?.get("ids") ?? "").split(",").map(decodeURIComponent).filter(Boolean);
  const modelPicks = Object.fromEntries(
    (sp?.get("m") ?? "")
      .split(",")
      .filter(Boolean)
      .map((s) => {
        const i = s.indexOf(":");
        return [decodeURIComponent(s.slice(0, i)), decodeURIComponent(s.slice(i + 1))];
      }),
  ) as Record<string, string>;

  const [loaded, setLoaded] = React.useState<{ c: GearCategory; data: GearCard[] } | null>(null);
  React.useEffect(() => {
    if (!category) return;
    let live = true;
    loadCategory(category).then((d) => {
      if (live) setLoaded({ c: category, data: d });
    });
    return () => {
      live = false;
    };
  }, [category]);
  const data = loaded && loaded.c === category ? loaded.data : null;

  function push(next: { c?: GearCategory | null; ids?: string[]; m?: Record<string, string> }) {
    const qs = new URLSearchParams();
    const c = next.c === undefined ? category : next.c;
    const list = next.ids ?? ids;
    const m = next.m ?? modelPicks;
    if (c) qs.set("c", c);
    if (c && list.length) qs.set("ids", list.map(encodeURIComponent).join(","));
    const mEntries = Object.entries(m).filter(([k]) => list.includes(k));
    if (mEntries.length)
      qs.set("m", mEntries.map(([k, v]) => `${encodeURIComponent(k)}:${encodeURIComponent(v)}`).join(","));
    const s = qs.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }

  // Empty URL but a tray exists: offer to load it.
  if (!category) {
    return (
      <div className="flex flex-col gap-8">
        {tray.category && tray.items.length > 0 && (
          <div className="glass glass-edge flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
            <p className="text-sm">
              You have {tray.items.length} {GEAR_CATEGORIES[tray.category].label.toLowerCase()} waiting to compare.
            </p>
            <button
              type="button"
              onClick={() => push({ c: tray.category, ids: tray.items.map((i) => i.id) })}
              className="press rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
            >
              Compare them
            </button>
          </div>
        )}
        <div>
          <h2 className="text-display-tight text-2xl sm:text-3xl">What are you comparing?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Comparisons work within one category, so every row lines up.
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {GEAR_CATEGORY_ORDER.filter((c) => (counts[c] ?? 0) > 1).map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => push({ c, ids: [] })}
                  className="press flex w-full flex-col items-start rounded-xl border border-border bg-background/60 px-4 py-3 text-left transition-colors hover:border-[var(--brand)]/40"
                >
                  <span className="font-medium">{GEAR_CATEGORIES[c].label}</span>
                  <span className="text-xs text-muted-foreground">{counts[c]} products</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const meta = GEAR_CATEGORIES[category];
  const byId = new Map((data ?? []).map((d) => [d.id, d]));
  const picked = ids.map((id) => byId.get(id)).filter((x): x is GearCard => Boolean(x));

  const modelOf = (card: GearCard): GearModel =>
    card.models.find((m) => m.name === modelPicks[card.id]) ?? card.models[0];

  const fields = meta.tableFields.filter((f) => picked.some((c) => displayValue(modelOf(c), f)));
  const specKeys = Array.from(new Set(picked.flatMap((c) => Object.keys(c.specs))));
  const extraKeys = Array.from(
    new Set(picked.flatMap((c) => Object.keys(modelOf(c).extra ?? {}))),
  );

  function remove(id: string) {
    const list = ids.filter((x) => x !== id);
    push({ ids: list });
    if (tray.category === category) {
      const items = tray.items.filter((i) => i.id !== id);
      writeGearTray({ category: items.length ? category : null, items });
    }
  }

  function add(id: string) {
    if (!id || ids.includes(id) || ids.length >= GEAR_COMPARE_MAX) return;
    push({ ids: [...ids, id] });
  }

  const addable = (data ?? []).filter((d) => !ids.includes(d.id));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Comparing</span>
        <select
          value={category}
          onChange={(e) => push({ c: e.target.value as GearCategory, ids: [], m: {} })}
          className="rounded-lg border border-border bg-background/70 px-2 py-1.5 text-sm"
          aria-label="Category"
        >
          {GEAR_CATEGORY_ORDER.filter((c) => (counts[c] ?? 0) > 1).map((c) => (
            <option key={c} value={c}>
              {GEAR_CATEGORIES[c].label}
            </option>
          ))}
        </select>
        {ids.length < GEAR_COMPARE_MAX && data && (
          <label className="flex items-center gap-2">
            <Plus className="size-4 text-muted-foreground" aria-hidden />
            <select
              value=""
              onChange={(e) => add(e.target.value)}
              className="max-w-[16rem] rounded-lg border border-border bg-background/70 px-2 py-1.5 text-sm"
              aria-label={`Add a ${meta.singular}`}
            >
              <option value="">Add a {meta.singular}…</option>
              {addable.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.brand} {d.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <Link href={`/gear/${category}`} className="ml-auto text-sm font-medium text-[var(--brand)] hover:underline">
          Browse {meta.label.toLowerCase()}
        </Link>
      </div>

      {!data ? (
        <p className="text-sm text-muted-foreground">Loading {meta.label.toLowerCase()}…</p>
      ) : picked.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Add up to {GEAR_COMPARE_MAX} {meta.label.toLowerCase()} with the menu above, or tick
          &ldquo;Compare&rdquo; on any product card.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
            <colgroup>
              <col className="w-40" />
              {picked.map((c) => (
                <col key={c.id} />
              ))}
            </colgroup>
            <thead>
              <tr className="align-top">
                <th scope="col" className="sr-only">Spec</th>
                {picked.map((c) => (
                  <th key={c.id} scope="col" className="border-l border-border/60 p-4 text-left font-normal">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/gear/${c.category}/${c.id}`} className="group flex flex-col gap-2">
                        {c.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.image.thumb} alt="" className="aspect-[4/3] w-full rounded-xl bg-white object-contain p-2" />
                        )}
                        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--brand)]">{c.brand}</span>
                        <span className="font-semibold leading-snug text-foreground group-hover:text-[var(--brand)]">{c.name}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(c.id)}
                        aria-label={`Remove ${c.brand} ${c.name}`}
                        className="rounded-full p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                      >
                        <X className="size-4" aria-hidden />
                      </button>
                    </div>
                    {c.models.length > 1 && (
                      <select
                        value={modelOf(c).name}
                        onChange={(e) => push({ m: { ...modelPicks, [c.id]: e.target.value } })}
                        className="mt-3 w-full rounded-lg border border-border bg-background/70 px-2 py-1.5 text-sm"
                        aria-label={`Model of ${c.brand} ${c.name}`}
                      >
                        {c.models.map((m) => (
                          <option key={m.name} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Type" cells={picked.map((c) => meta.subtypes[c.subtype] ?? c.subtype)} />
              {fields.map((f) => (
                <Row key={f} label={DISPLAY_LABEL[f]} cells={picked.map((c) => displayValue(modelOf(c), f))} highlight />
              ))}
              {extraKeys.map((k) => (
                <Row key={`x-${k}`} label={k} cells={picked.map((c) => modelOf(c).extra?.[k] ?? null)} />
              ))}
              {specKeys.map((k) => (
                <Row key={`s-${k}`} label={k} cells={picked.map((c) => c.specs[k] ?? null)} />
              ))}
              <Row label="Best for" cells={picked.map((c) => c.bestFor)} prose />
              <Row label="Worth knowing" cells={picked.map((c) => c.watchOut ?? null)} prose />
              <Row label="Sizes" cells={picked.map((c) => c.models.map((m) => m.name).join(", "))} prose />
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs leading-relaxed text-muted-foreground">
        Figures are the makers&rsquo; or a major retailer&rsquo;s published specs. A dash means the
        figure isn&rsquo;t published, not that it&rsquo;s zero. Rated filter and pump flow is measured
        without media or hoses.
      </p>
    </div>
  );
}

function Row({
  label,
  cells,
  highlight,
  prose,
}: {
  label: string;
  cells: (string | null)[];
  highlight?: boolean;
  prose?: boolean;
}) {
  if (cells.every((c) => !c)) return null;
  return (
    <tr className="border-t border-border/60 align-top">
      <th scope="row" className="bg-foreground/[0.02] p-4 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </th>
      {cells.map((c, i) => (
        <td
          key={i}
          className={cn(
            "border-l border-border/60 p-4",
            prose ? "text-sm leading-relaxed text-foreground/85" : "text-foreground",
            highlight && "font-medium",
          )}
        >
          {c ?? <span className="text-muted-foreground/60">–</span>}
        </td>
      ))}
    </tr>
  );
}
