"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import type {
  SpeciesRecord,
  Continent,
  Biotope,
  FinderPreset,
} from "@/lib/catalogue/species-index";
import { CONTINENT_LABELS, BIOTOPE_LABELS } from "@/lib/catalogue/species-index";
import type { CatalogueCategory } from "@/types/catalogue";

interface Props {
  records: SpeciesRecord[];
  presets: FinderPreset[];
}

const CATEGORIES: { key: CatalogueCategory; label: string }[] = [
  { key: "fish", label: "Fish" },
  { key: "plants", label: "Plants" },
  { key: "shrimp", label: "Shrimp" },
  { key: "snails", label: "Snails" },
  { key: "mosses", label: "Mosses" },
];

interface Param {
  on: boolean;
  val: number;
}

export function SpeciesFinder({ records, presets }: Props) {
  const [cats, setCats] = useState<Set<CatalogueCategory>>(new Set());
  const [continent, setContinent] = useState<Continent | "all">("all");
  const [biotope, setBiotope] = useState<Biotope | "all">("all");
  const [ph, setPh] = useState<Param>({ on: false, val: 7 });
  const [gh, setGh] = useState<Param>({ on: false, val: 8 });
  const [temp, setTemp] = useState<Param>({ on: false, val: 25 });
  const [flow, setFlow] = useState<"all" | "high" | "low">("all");
  const [activePreset, setActivePreset] = useState<string | null>(null);

  function toggleCat(k: CatalogueCategory) {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  function applyPreset(p: FinderPreset) {
    if (activePreset === p.id) {
      clearAll();
      return;
    }
    setActivePreset(p.id);
    setContinent(p.continents?.[0] ?? "all");
    setBiotope(p.biotopes?.[0] ?? "all");
    setPh(p.ph !== undefined ? { on: true, val: p.ph } : { on: false, val: 7 });
    setGh(p.gh !== undefined ? { on: true, val: p.gh } : { on: false, val: 8 });
    setTemp(p.temp !== undefined ? { on: true, val: p.temp } : { on: false, val: 25 });
    setFlow(p.biotopes?.includes("river") ? "high" : "all");
  }

  function clearAll() {
    setCats(new Set());
    setContinent("all");
    setBiotope("all");
    setPh({ on: false, val: 7 });
    setGh({ on: false, val: 8 });
    setTemp({ on: false, val: 25 });
    setFlow("all");
    setActivePreset(null);
  }

  const results = useMemo(() => {
    return records.filter((r) => {
      if (cats.size > 0 && !cats.has(r.category)) return false;
      if (continent !== "all" && !r.continents.includes(continent)) return false;
      if (biotope !== "all" && !r.biotopes.includes(biotope)) return false;
      if (ph.on) {
        if (!r.ph) return false;
        if (ph.val < r.ph.min || ph.val > r.ph.max) return false;
      }
      if (gh.on) {
        if (!r.gh) return false;
        if (gh.val < r.gh.min || gh.val > r.gh.max) return false;
      }
      if (temp.on) {
        if (!r.temp) return false;
        if (temp.val < r.temp.min || temp.val > r.temp.max) return false;
      }
      if (flow === "high" && !r.flowHigh) return false;
      if (flow === "low" && !r.flowLow) return false;
      return true;
    });
  }, [records, cats, continent, biotope, ph, gh, temp, flow]);

  const anyFilter =
    cats.size > 0 ||
    continent !== "all" ||
    biotope !== "all" ||
    ph.on ||
    gh.on ||
    temp.on ||
    flow !== "all";

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      {/* Filters */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-background/60 p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Filters
            </h2>
            {anyFilter && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Presets */}
          <p className="mt-4 text-xs font-medium text-foreground/80">Start with a tank type</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.blurb}
                onClick={() => applyPreset(p)}
                className={
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                  (activePreset === p.id
                    ? "border-[var(--brand)] bg-[var(--brand)]/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-[var(--brand)]/40 hover:text-foreground")
                }
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Category */}
          <Fieldset label="Species type">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => toggleCat(c.key)}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                    (cats.has(c.key)
                      ? "border-[var(--brand)] bg-[var(--brand)]/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-[var(--brand)]/40")
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </Fieldset>

          {/* Region */}
          <Fieldset label="Region of origin">
            <select
              value={continent}
              onChange={(e) => {
                setContinent(e.target.value as Continent | "all");
                setActivePreset(null);
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">Anywhere</option>
              {(Object.keys(CONTINENT_LABELS) as Continent[]).map((c) => (
                <option key={c} value={c}>
                  {CONTINENT_LABELS[c]}
                </option>
              ))}
            </select>
          </Fieldset>

          {/* Biotope */}
          <Fieldset label="Water / biotope">
            <select
              value={biotope}
              onChange={(e) => {
                setBiotope(e.target.value as Biotope | "all");
                setActivePreset(null);
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">Any</option>
              {(Object.keys(BIOTOPE_LABELS) as Biotope[]).map((b) => (
                <option key={b} value={b}>
                  {BIOTOPE_LABELS[b]}
                </option>
              ))}
            </select>
          </Fieldset>

          {/* Water parameters */}
          <Slider
            label="pH"
            param={ph}
            min={4}
            max={9}
            step={0.1}
            fmt={(v) => v.toFixed(1)}
            onToggle={(on) => {
              setPh((p) => ({ ...p, on }));
              setActivePreset(null);
            }}
            onChange={(val) => {
              setPh((p) => ({ ...p, val }));
              setActivePreset(null);
            }}
          />
          <Slider
            label="GH (°dGH)"
            param={gh}
            min={0}
            max={25}
            step={1}
            fmt={(v) => String(v)}
            onToggle={(on) => {
              setGh((p) => ({ ...p, on }));
              setActivePreset(null);
            }}
            onChange={(val) => {
              setGh((p) => ({ ...p, val }));
              setActivePreset(null);
            }}
          />
          <Slider
            label="Temperature (°C)"
            param={temp}
            min={15}
            max={30}
            step={1}
            fmt={(v) => `${v}°`}
            onToggle={(on) => {
              setTemp((p) => ({ ...p, on }));
              setActivePreset(null);
            }}
            onChange={(val) => {
              setTemp((p) => ({ ...p, val }));
              setActivePreset(null);
            }}
          />

          {/* Flow */}
          <Fieldset label="Flow">
            <div className="flex gap-2">
              {(["all", "high", "low"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFlow(f);
                    setActivePreset(null);
                  }}
                  className={
                    "flex-1 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors " +
                    (flow === f
                      ? "border-[var(--brand)] bg-[var(--brand)]/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-[var(--brand)]/40")
                  }
                >
                  {f === "all" ? "Any" : f}
                </button>
              ))}
            </div>
          </Fieldset>
        </div>
      </aside>

      {/* Results */}
      <section>
        <p className="mb-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{results.length}</span>{" "}
          {results.length === 1 ? "species" : "species"} match
          {anyFilter ? " your filters" : " (showing everything, add a filter to narrow it down)"}.
        </p>
        {results.length === 0 ? (
          <div className="rounded-2xl border border-border bg-background/60 p-8 text-center text-sm text-muted-foreground">
            No species match every filter. Try loosening the water values or the
            region, real species tolerate a range, so a very specific combination
            can exclude everything.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((r) => (
              <li key={`${r.category}-${r.slug}`}>
                <Link
                  href={r.href}
                  className="press group flex h-full gap-3 rounded-xl border border-border bg-background/60 p-3 backdrop-blur transition-colors hover:border-[var(--brand)]/40"
                >
                  <span className="relative flex-none overflow-hidden rounded-lg bg-secondary/40" style={{ width: 64, height: 64 }}>
                    {r.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.image}
                        alt={r.commonName}
                        loading="lazy"
                        width={64}
                        height={64}
                        className="size-16 object-cover"
                      />
                    ) : (
                      <span className="flex size-16 items-center justify-center text-muted-foreground">
                        <ImageOff className="size-5" aria-hidden />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-[var(--brand)]">
                        {r.commonName}
                      </span>
                    </span>
                    <span className="block truncate text-xs italic text-muted-foreground">
                      {r.scientificName}
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">
                      {r.categoryLabel}
                      {r.ph ? ` · pH ${r.ph.min}–${r.ph.max}` : ""}
                      {r.temp ? ` · ${r.temp.min}–${r.temp.max}°C` : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Fieldset({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-medium text-foreground/80">{label}</p>
      {children}
    </div>
  );
}

function Slider({
  label,
  param,
  min,
  max,
  step,
  fmt,
  onToggle,
  onChange,
}: {
  label: string;
  param: Param;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
  onToggle: (on: boolean) => void;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-5">
      <label className="flex items-center justify-between text-xs font-medium text-foreground/80">
        <span className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={param.on}
            onChange={(e) => onToggle(e.target.checked)}
            className="size-3.5 accent-[var(--brand)]"
          />
          {label}
        </span>
        <span className={param.on ? "text-[var(--brand)]" : "text-muted-foreground"}>
          {param.on ? fmt(param.val) : "any"}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={param.val}
        disabled={!param.on}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--brand)] disabled:opacity-40"
      />
    </div>
  );
}
