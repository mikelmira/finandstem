"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import type { GearCard as GearCardData, GearCategory } from "@/types/gear";
import { GEAR_CATEGORIES } from "@/lib/gear/categories";
import {
  CATEGORY_QUERY,
  hasQuery,
  parseGearQuery,
  productFit,
  recommendedFlow,
  recommendedHeaterW,
  typicalLengthForLitres,
  type Fit,
  type GearQuery,
} from "@/lib/gear/match";
import { GearCard } from "@/components/gear/gear-card";
import { SORT_FIELDS, sortKey } from "@/lib/gear/sorts";
import { ChipToggle } from "@/components/filters/filter-primitives";
import { AccordionSection } from "@/components/ui/accordion-section";
import { cn } from "@/lib/utils";
import { METRIC, TECH_HELP, TECH_LABEL } from "@/lib/gear/ratings";

const TANK_PRESETS = [20, 30, 45, 60, 90, 120, 180, 240, 350];
const LENGTH_PRESETS = [30, 36, 45, 60, 75, 90, 120, 150];

/** "fit" | "name" | "price-low" | "price-high" | "metric" | "<field>-asc" | "<field>-desc" */
type Sort = string;

function explain(category: GearCategory, q: GearQuery): string | null {
  if (!hasQuery(q)) return null;
  const parts: string[] = [];
  if (category === "filters" && q.tankL) {
    const f = recommendedFlow(q.tankL);
    parts.push(
      `For a ${q.tankL} L planted tank we look for a rated flow of about ${f.min}–${Math.round(q.tankL * 12)} L/h (5–12× turnover) and a maker rating that covers ${q.tankL} L. Rated flow is measured with an empty filter, real flow with media is lower, so a little headroom is good.`,
    );
  }
  if ((category === "filters" || category === "pumps") && (q.flowMin || q.flowMax)) {
    parts.push(
      `Flow window: ${q.flowMin ?? 0}${q.flowMax ? `–${q.flowMax}` : "+"} L/h rated.`,
    );
  }
  if (category === "heaters" && q.tankL) {
    const w = recommendedHeaterW(q.tankL);
    parts.push(
      `About 1 W per litre in a normal room, so roughly ${w.min}–${w.max} W for ${q.tankL} L, or a heater whose maker rating covers ${q.tankL} L.`,
    );
  }
  if (category === "lights" && q.lengthCm) {
    parts.push(
      `Lights made for a ${q.lengthCm} cm tank, or fixtures a little shorter than ${q.lengthCm} cm.`,
    );
  }
  if (category === "aquariums" && (q.tankL || q.lengthCm)) {
    parts.push(
      `Tanks within about 15 percent of ${q.tankL ? `${q.tankL} L` : ""}${q.tankL && q.lengthCm ? " and " : ""}${q.lengthCm ? `${q.lengthCm} cm long` : ""}.`,
    );
  }
  if (category === "stands" && q.lengthCm) {
    parts.push(`Stands with a top at least ${q.lengthCm} cm long, but not much longer.`);
  }
  if (["co2", "cooling", "air-pumps", "sterilisers", "plumbing"].includes(category) && q.tankL) {
    parts.push(`Products the maker rates for a ${q.tankL} L tank.`);
  }
  return parts.join(" ") || null;
}

export function GearIndexClient({
  category,
  cards,
}: {
  category: GearCategory;
  cards: GearCardData[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const meta = GEAR_CATEGORIES[category];
  const inputs = CATEGORY_QUERY[category];

  const q = parseGearQuery(sp ?? new URLSearchParams());
  const brands = (sp?.get("brand") ?? "").split(",").filter(Boolean);
  const types = (sp?.get("type") ?? "").split(",").filter(Boolean);
  const text = sp?.get("q") ?? "";
  const tech = sp?.get("tech") === "low" || sp?.get("tech") === "high" ? (sp.get("tech") as "low" | "high") : null;
  const onlyFit = sp?.get("fit") !== "all";
  const sort = (sp?.get("sort") as Sort) || "fit";

  function update(patch: Record<string, string | null>) {
    const next = new URLSearchParams(sp?.toString() ?? "");
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const allBrands = React.useMemo(
    () => Array.from(new Set(cards.map((c) => c.brand))).sort(),
    [cards],
  );
  const allTypes = React.useMemo(
    () => Object.keys(meta.subtypes).filter((t) => cards.some((c) => c.subtype === t)),
    [cards, meta.subtypes],
  );

  // Only offer the tech filter where products actually differ.
  const techSplits = cards.some((c) => c.tech && c.tech.length === 1);

  const querying = hasQuery(q);
  const needle = text.trim().toLowerCase();
  const rows = cards
    .filter((c) => brands.length === 0 || brands.includes(c.brand))
    .filter((c) => types.length === 0 || types.includes(c.subtype))
    .filter((c) => !tech || !c.tech || c.tech.includes(tech))
    .filter(
      (c) =>
        !needle ||
        `${c.brand} ${c.name} ${c.summary} ${c.models.map((m) => m.name).join(" ")}`
          .toLowerCase()
          .includes(needle),
    )
    .map((c) => {
      const r = querying ? productFit(category, c.models, q) : { fit: null as Fit | null, models: [] as string[] };
      return { card: c, fit: r.fit, models: r.models };
    });

  const matched = rows.filter((r) => r.fit === "ideal" || r.fit === "workable");
  const unrated = rows.filter((r) => r.fit === null);
  // "No rating" is not "doesn't fit": keep unrated products, listed after matches.
  const visible = querying && onlyFit ? rows.filter((r) => r.fit !== "no") : rows;

  const rank = (f: Fit | null) => (f === "ideal" ? 0 : f === "workable" ? 1 : f === null ? 2 : 3);
  visible.sort((a, b) => {
    if (sort === "name") return `${a.card.brand} ${a.card.name}`.localeCompare(`${b.card.brand} ${b.card.name}`);
    if (sort === "price-low" || sort === "price-high") {
      const av = a.card.ratings?.price ?? 3;
      const bv = b.card.ratings?.price ?? 3;
      return sort === "price-low" ? av - bv : bv - av;
    }
    if (sort === "metric") return (b.card.ratings?.metric ?? 0) - (a.card.ratings?.metric ?? 0);
    const m = /^([A-Za-z]+)-(asc|desc)$/.exec(sort);
    const sf = m ? SORT_FIELDS[category].find((f) => f.field === m[1]) : undefined;
    if (sf && m) {
      const dir = m[2] as "asc" | "desc";
      const av = sortKey(a.card, sf, dir);
      const bv = sortKey(b.card, sf, dir);
      if (av === null && bv === null) return 0;
      if (av === null) return 1; // missing figures always last
      if (bv === null) return -1;
      return dir === "asc" ? av - bv : bv - av;
    }
    return rank(a.fit) - rank(b.fit) || `${a.card.brand} ${a.card.name}`.localeCompare(`${b.card.brand} ${b.card.name}`);
  });

  const explanation = explain(category, q);

  return (
    <div className="flex flex-col gap-6">
      {/* Controls: search and sort always visible, the rest in accordions */}
      <div className="flex flex-col gap-3">
        <div className="glass glass-edge rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
            <SearchField
              key={text}
              initial={text}
              placeholder={`Search ${meta.label.toLowerCase()} or model`}
              onCommit={(v) => update({ q: v || null })}
            />
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Sort
              <select
                value={sort}
                onChange={(e) => update({ sort: e.target.value === "fit" ? null : e.target.value })}
                className="rounded-lg border border-border bg-background/70 px-2 py-1.5 text-sm text-foreground"
              >
                <option value="fit">Best match</option>
                <option value="name">Name (A to Z)</option>
                <option value="price-low">Price: budget first</option>
                <option value="price-high">Price: premium first</option>
                <option value="metric">{METRIC[category].label}: best first</option>
                {SORT_FIELDS[category].map((f) => (
                  <optgroup key={f.field} label={f.label}>
                    <option value={`${f.field}-asc`}>{f.words[0]}</option>
                    <option value={`${f.field}-desc`}>{f.words[1]}</option>
                  </optgroup>
                ))}
              </select>
            </label>
          </div>

        </div>
        {inputs.length > 0 && (
          <AccordionSection eyebrow="Fit check" title="Match to your tank" defaultOpen={querying}>
            <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:gap-8">
              {inputs.includes("tank") && (
                <NumberField
                  key={`tank-${q.tankL ?? ""}`}
                  label="Tank volume"
                  unit="L"
                  value={q.tankL}
                  presets={TANK_PRESETS}
                  onChange={(v) => update({ tank: v ? String(v) : null })}
                />
              )}
              {inputs.includes("flow") && (
                <FlowField
                  key={`flow-${q.flowMin ?? ""}-${q.flowMax ?? ""}`}
                  min={q.flowMin}
                  max={q.flowMax}
                  suggestion={q.tankL ? recommendedFlow(q.tankL) : undefined}
                  onChange={(a, b) =>
                    update({ flow: a || b ? (b ? `${a ?? 0}-${b}` : String(a)) : null })
                  }
                />
              )}
              {inputs.includes("length") && (
                <NumberField
                  key={`len-${q.lengthCm ?? ""}`}
                  label="Tank length"
                  unit="cm"
                  value={q.lengthCm}
                  presets={LENGTH_PRESETS}
                  onChange={(v) => update({ length: v ? String(v) : null })}
                  hint={
                    !q.lengthCm && q.tankL
                      ? `A ${q.tankL} L tank is usually about ${typicalLengthForLitres(q.tankL)} cm long`
                      : undefined
                  }
                />
              )}
            </div>
          </AccordionSection>
        )}
        {(techSplits || allTypes.length > 1 || allBrands.length > 1) && (
          <AccordionSection
            eyebrow="Filters"
            title={techSplits ? "Type, brand and tech level" : "Type and brand"}
            defaultOpen={Boolean(tech || types.length || brands.length)}
          >
            <div className="flex flex-col gap-4">
        {techSplits && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Tech level
            </span>
            {(["low", "high"] as const).map((t) => (
              <ChipToggle
                key={t}
                selected={tech === t}
                onSelect={(on) => update({ tech: on ? t : null })}
              >
                {TECH_LABEL[t]}
              </ChipToggle>
            ))}
            <span className="ml-1 text-[11px] text-muted-foreground/80">{TECH_HELP}</span>
          </div>
        )}
        {allTypes.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Type
            </span>
            {allTypes.map((t) => (
              <ChipToggle
                key={t}
                selected={types.includes(t)}
                onSelect={(on) =>
                  update({
                    type: (on ? [...types, t] : types.filter((x) => x !== t)).join(",") || null,
                  })
                }
              >
                {meta.subtypes[t]}
              </ChipToggle>
            ))}
          </div>
        )}
        {allBrands.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Brand
            </span>
            {allBrands.map((b) => (
              <ChipToggle
                key={b}
                selected={brands.includes(b)}
                onSelect={(on) =>
                  update({
                    brand: (on ? [...brands, b] : brands.filter((x) => x !== b)).join(",") || null,
                  })
                }
              >
                {b}
              </ChipToggle>
            ))}
          </div>
        )}
            </div>
          </AccordionSection>
        )}
      </div>

      {/* Result summary */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {querying ? (
              <>
                <span className="font-medium text-foreground">{matched.length}</span> of {rows.length}{" "}
                {meta.label.toLowerCase()} fit
                {unrated.length > 0 && (
                  <> · {unrated.length} without a maker rating listed after</>
                )}
              </>
            ) : (
              <>
                <span className="font-medium text-foreground">{rows.length}</span>{" "}
                {rows.length === 1 ? meta.singular : meta.label.toLowerCase()}
              </>
            )}
          </p>
          <div className="flex items-center gap-3">
            {querying && (
              <button
                type="button"
                onClick={() => update({ fit: onlyFit ? "all" : null })}
                className="text-xs font-medium text-[var(--brand)] hover:underline"
              >
                {onlyFit ? "Show everything" : "Show only matches"}
              </button>
            )}
            {(querying || brands.length || types.length || text || tech) && (
              <button
                type="button"
                onClick={() => router.replace(pathname, { scroll: false })}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" aria-hidden /> Reset
              </button>
            )}
          </div>
        </div>
        {explanation && (
          <p className="rounded-xl border border-[var(--brand)]/25 bg-[var(--brand)]/5 px-4 py-3 text-sm leading-relaxed text-foreground/85">
            {explanation}
          </p>
        )}
      </div>

      {visible.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((r, i) => (
            <li key={r.card.id}>
              <GearCard card={r.card} fit={r.fit} fitModels={r.models} priority={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nothing matches those settings. Try a wider range or{" "}
          <button type="button" onClick={() => update({ fit: "all" })} className="font-medium text-[var(--brand)] hover:underline">
            show everything
          </button>
          .
        </div>
      )}
    </div>
  );
}

function NumberField({
  label,
  unit,
  value,
  presets,
  onChange,
  hint,
}: {
  label: string;
  unit: string;
  value?: number;
  presets: number[];
  onChange: (v: number | undefined) => void;
  hint?: string;
}) {
  const [draft, setDraft] = React.useState(value ? String(value) : "");
  const commit = () => {
    const n = Number(draft);
    onChange(draft && Number.isFinite(n) && n > 0 ? Math.round(n) : undefined);
  };
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            className="w-20 rounded-lg border border-border bg-background/70 px-2 py-1.5 text-sm focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
            aria-label={`${label} in ${unit}`}
          />
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(value === p ? undefined : p)}
            className={cn(
              "press rounded-full border px-2 py-0.5 text-[11px] transition-colors",
              value === p
                ? "border-[var(--brand)]/60 bg-[var(--brand)]/15 text-foreground"
                : "border-border text-muted-foreground hover:border-[var(--brand)]/40 hover:text-foreground",
            )}
          >
            {p}
          </button>
        ))}
      </div>
      {hint && <span className="text-[11px] text-muted-foreground/80">{hint}</span>}
    </div>
  );
}

function FlowField({
  min,
  max,
  suggestion,
  onChange,
}: {
  min?: number;
  max?: number;
  suggestion?: { min: number; max: number };
  onChange: (min?: number, max?: number) => void;
}) {
  const [a, setA] = React.useState(min ? String(min) : "");
  const [b, setB] = React.useState(max ? String(max) : "");
  const commit = () => {
    const na = Number(a);
    const nb = Number(b);
    onChange(a && na > 0 ? Math.round(na) : undefined, b && nb > 0 ? Math.round(nb) : undefined);
  };
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Flow needed
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={a}
          placeholder="from"
          onChange={(e) => setA(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          className="w-20 rounded-lg border border-border bg-background/70 px-2 py-1.5 text-sm"
          aria-label="Minimum flow in litres per hour"
        />
        <span className="text-xs text-muted-foreground">to</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={b}
          placeholder="to"
          onChange={(e) => setB(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          className="w-20 rounded-lg border border-border bg-background/70 px-2 py-1.5 text-sm"
          aria-label="Maximum flow in litres per hour"
        />
        <span className="text-xs text-muted-foreground">L/h</span>
        {suggestion && !min && !max && (
          <button
            type="button"
            onClick={() => onChange(suggestion.min, suggestion.max)}
            className="press rounded-full border border-[var(--brand)]/40 bg-[var(--brand)]/5 px-2 py-0.5 text-[11px] text-foreground"
          >
            Use {suggestion.min}–{suggestion.max}
          </button>
        )}
      </div>
    </div>
  );
}

function SearchField({
  initial,
  placeholder,
  onCommit,
}: {
  initial: string;
  placeholder: string;
  onCommit: (v: string) => void;
}) {
  const [draft, setDraft] = React.useState(initial);
  return (
    <label className="relative flex-1">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit(draft);
        }}
        onBlur={() => draft !== initial && onCommit(draft)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background/70 py-2 pl-9 pr-3 text-sm focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
      />
    </label>
  );
}
