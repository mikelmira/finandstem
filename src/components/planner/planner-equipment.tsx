"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowRight, Check, Info, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { gearHref, productFit, typicalLengthForLitres, type GearQuery } from "@/lib/gear/match";
import {
  PLANNER_SLOTS,
  gearVerdicts,
  parsePickedGear,
  serialisePickedGear,
  type GearVerdict,
  type PickedGear,
  type PlannerGear,
  type PlannerSlot,
} from "@/lib/gear/planner-gear";
import { co2To3, lightTo5 } from "@/lib/catalogue/tank-standards";

let cache: Promise<PlannerGear[]> | null = null;
function loadGear(): Promise<PlannerGear[]> {
  if (!cache) cache = fetch("/gear-data/planner.json").then((r) => (r.ok ? r.json() : []));
  return cache;
}

interface Props {
  tankL?: number;
  light: "Low" | "Medium" | "High" | null;
  co2: "None" | "Optional" | "Recommended" | "Required" | null;
}

/**
 * "Your equipment": pick the actual filter, light, heater, CO2 and fertiliser
 * from the gear catalogue and see how each suits this tank and these plants.
 * Picks live in the URL (?gear=), so a planned tank can be shared.
 */
export function PlannerEquipment({ tankL, light, co2 }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const picked = parsePickedGear(sp?.get("gear") ?? null);
  const [gear, setGear] = React.useState<PlannerGear[] | null>(null);

  React.useEffect(() => {
    let live = true;
    loadGear().then((d) => live && setGear(d));
    return () => {
      live = false;
    };
  }, []);

  const lightNeed = lightTo5(light);
  const co2Need = co2To3(co2);
  const hasCo2 = picked.some((p) => p.slot === "co2");

  function push(next: PickedGear[], filterLph?: number | null) {
    const q = new URLSearchParams(sp?.toString() ?? "");
    if (next.length) q.set("gear", serialisePickedGear(next));
    else q.delete("gear");
    if (filterLph !== undefined) {
      if (filterLph) q.set("filter", String(filterLph));
    }
    const s = q.toString();
    router.replace(s ? `/planner?${s}` : "/planner", { scroll: false });
  }

  function choose(slot: PlannerSlot, product: PlannerGear, modelName?: string) {
    const model = product.models.find((m) => m.name === modelName) ?? bestModel(product, tankL) ?? product.models[0];
    const next = [...picked.filter((p) => p.slot !== slot), { slot, id: product.id, model: model.name }];
    push(next, slot === "filters" ? model.flowLph ?? null : undefined);
  }

  function remove(slot: PlannerSlot) {
    push(picked.filter((p) => p.slot !== slot));
  }

  return (
    <div className="glass glass-edge rounded-2xl p-5 sm:p-6">
      <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">Your equipment</h2>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Pick what you have or are considering. We check each one against your tank
        {lightNeed ? " and plants" : ""}.
      </p>
      {!tankL && (
        <p className="mt-3 text-[11px] text-muted-foreground/80">Choose a tank size first for fit checks.</p>
      )}
      <div className="mt-4 flex flex-col gap-3">
        {PLANNER_SLOTS.map(({ slot, label, singular, plural }) => {
          const pick = picked.find((p) => p.slot === slot);
          const product = pick && gear?.find((g) => g.id === pick.id);
          const model = product?.models.find((m) => m.name === pick?.model) ?? product?.models[0];
          if (product && model) {
            const verdicts = gearVerdicts(product, model, { tankL, lightNeed, co2Need, hasCo2 });
            return (
              <div key={slot} className="rounded-xl border border-border bg-background/60 p-3">
                <div className="flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.thumb} alt="" className="size-12 flex-none rounded-lg bg-white object-contain p-1" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                    <Link
                      href={`/gear/${product.category}/${product.id}`}
                      className="text-sm font-medium leading-snug hover:text-[var(--brand)]"
                    >
                      {product.brand} {product.name}
                    </Link>
                    {product.models.length > 1 && (
                      <select
                        value={model.name}
                        onChange={(e) => choose(slot, product, e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-border bg-background/70 px-2 py-1 text-xs"
                        aria-label={`${label} model`}
                      >
                        {product.models.map((m) => (
                          <option key={m.name} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(slot)}
                    aria-label={`Remove ${label.toLowerCase()}`}
                    className="rounded-full p-1 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
                {verdicts.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1">
                    {verdicts.map((v) => (
                      <VerdictLine key={v.text} v={v} />
                    ))}
                  </ul>
                )}
              </div>
            );
          }
          const query = slotQuery(slot, tankL);
          return (
            <div key={slot}>
              <SlotPicker
                label={label}
                singular={singular}
                options={(gear ?? []).filter((g) => g.category === slot)}
                loading={!gear}
                tankL={tankL}
                onPick={(g) => choose(slot, g)}
              />
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2 px-1">
                {slot === "co2" && co2Need === 3 ? (
                  <span className="text-[11px] text-amber-800">Your plants need injected CO2</span>
                ) : slot === "co2" && co2Need === 2 ? (
                  <span className="text-[11px] text-muted-foreground">CO2 would help these plants</span>
                ) : (
                  <span />
                )}
                <Link href={gearHref(slot, query)} className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--brand)] hover:underline">
                  Browse {plural}{tankL && slot !== "fertilisers" ? (slot === "co2" ? " that fits" : " that fit") : ""}
                  <ArrowRight className="size-3" aria-hidden />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function slotQuery(slot: PlannerSlot, tankL?: number): GearQuery {
  if (!tankL) return {};
  if (slot === "lights") return { lengthCm: typicalLengthForLitres(tankL) };
  if (slot === "fertilisers") return {};
  return { tankL };
}

/** The model that best fits this tank, for a sensible default. */
function bestModel(product: PlannerGear, tankL?: number) {
  if (!tankL) return undefined;
  const r = productFit(product.category, product.models, slotQuery(product.category, tankL));
  return product.models.find((m) => r.models.includes(m.name));
}

function VerdictLine({ v }: { v: GearVerdict }) {
  const Icon = v.tone === "good" || v.tone === "ok" ? Check : v.tone === "info" ? Info : AlertTriangle;
  return (
    <li
      className={cn(
        "flex items-start gap-1.5 text-[11px] leading-snug",
        v.tone === "good" && "text-emerald-800",
        v.tone === "ok" && "text-emerald-700",
        v.tone === "info" && "text-muted-foreground",
        v.tone === "warn" && "text-amber-800",
        v.tone === "bad" && "text-rose-800",
      )}
    >
      <Icon className="mt-0.5 size-3 flex-none" aria-hidden />
      <span>{v.text}</span>
    </li>
  );
}

function SlotPicker({
  label,
  singular,
  options,
  loading,
  tankL,
  onPick,
}: {
  label: string;
  singular: string;
  options: PlannerGear[];
  loading: boolean;
  tankL?: number;
  onPick: (g: PlannerGear) => void;
}) {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const needle = q.trim().toLowerCase();
  const ranked = options
    .filter((o) => !needle || `${o.brand} ${o.name}`.toLowerCase().includes(needle))
    .map((o) => {
      const fit = tankL ? productFit(o.category, o.models, slotQuery(o.category, tankL)).fit : null;
      return { o, rank: fit === "ideal" ? 0 : fit === "workable" ? 1 : fit === null ? 2 : 3 };
    })
    .sort((a, b) => a.rank - b.rank || `${a.o.brand} ${a.o.name}`.localeCompare(`${b.o.brand} ${b.o.name}`))
    .slice(0, 40);

  return (
    <div ref={ref} className="relative">
      <label className="relative block">
        <span className="sr-only">Choose a {singular}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={loading ? "Loading gear…" : `${label}: search or pick`}
          disabled={loading}
          className="w-full rounded-xl border border-border bg-background/70 py-2 pl-8 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
        />
      </label>
      {open && ranked.length > 0 && (
        <ul role="listbox" className="animate-drop-in absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-border bg-card p-1 shadow-xl">
          {ranked.map(({ o, rank }) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => {
                  onPick(o);
                  setQ("");
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-foreground/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.thumb} alt="" className="size-7 flex-none rounded bg-white object-contain" />
                <span className="min-w-0 flex-1 truncate">
                  {o.brand} {o.name}
                </span>
                {tankL && rank <= 1 && (
                  <span className="flex-none rounded-full bg-emerald-600/12 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800">
                    {rank === 0 ? "Fits" : "Could work"}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
