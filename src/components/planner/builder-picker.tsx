"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_META, type CatalogueCategory } from "@/types/catalogue";

export interface BuilderOption {
  value: string;
  label: string;
  scientific: string;
  category: CatalogueCategory;
}

interface BuilderPickerProps {
  options: ReadonlyArray<BuilderOption>;
  selected: string[];
  tankL?: number;
}

export function BuilderPicker({
  options,
  selected,
  tankL,
}: BuilderPickerProps) {
  const router = useRouter();
  const search = useSearchParams();
  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selectedSet = new Set(selected);

  function pushIds(ids: string[]) {
    const sp = new URLSearchParams(search?.toString() ?? "");
    if (ids.length === 0) sp.delete("species");
    else sp.set("species", ids.join(","));
    const qs = sp.toString();
    router.replace(qs ? `/planner?${qs}` : "/planner", { scroll: false });
  }

  function add(value: string) {
    if (selectedSet.has(value)) return;
    pushIds([...selected, value]);
    setQuery("");
  }

  function updateTank(next: number | undefined) {
    const sp = new URLSearchParams(search?.toString() ?? "");
    if (next === undefined || Number.isNaN(next)) sp.delete("tank");
    else sp.set("tank", String(next));
    const qs = sp.toString();
    router.replace(qs ? `/planner?${qs}` : "/planner", { scroll: false });
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? options.filter(
        (o) =>
          (o.label.toLowerCase().includes(q) ||
            o.scientific.toLowerCase().includes(q)) &&
          !selectedSet.has(o.value),
      )
    : options.filter((o) => !selectedSet.has(o.value));

  return (
    <div className="flex flex-col gap-4" ref={containerRef}>
      {/* Tank size — optional helper input */}
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="builder-tank"
          className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
        >
          Tank size (optional)
        </label>
        <div className="flex items-center gap-2">
          <input
            id="builder-tank"
            type="number"
            inputMode="numeric"
            min={10}
            max={1000}
            step={5}
            placeholder="e.g. 60"
            value={tankL ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") updateTank(undefined);
              else {
                const n = Number(v);
                if (!Number.isNaN(n)) updateTank(n);
              }
            }}
            className="w-24 rounded-full border border-border bg-background/70 px-3 py-1.5 text-sm placeholder:text-muted-foreground/60 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
          />
          <span className="text-xs text-muted-foreground">L</span>
          <span className="text-[11px] text-muted-foreground/70">
            tells us whether the species you&rsquo;ve added actually fit
          </span>
        </div>
      </div>

      {/* Species typeahead */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          autoComplete="off"
          placeholder="Add a fish, plant, shrimp, or moss…"
          value={query}
          onFocus={() => setFocused(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setFocused(true);
          }}
          className="w-full rounded-xl border border-border bg-background/70 py-2.5 pl-10 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
        />
        {focused && filtered.length > 0 && (
          <ul
            role="listbox"
            className="animate-drop-in absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-border bg-background/95 p-1 shadow-lg backdrop-blur"
          >
            {filtered.slice(0, 30).map((o, i) => (
              <li key={o.value} style={{ ["--i" as string]: Math.min(i, 8) }}>
                <button
                  type="button"
                  onClick={() => add(o.value)}
                  className={cn(
                    "press group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 hover:translate-x-0.5 hover:bg-foreground/5",
                  )}
                >
                  <Plus
                    className="size-3.5 text-muted-foreground transition-colors group-hover:text-[var(--brand)]"
                    aria-hidden
                  />
                  <span className="flex w-full items-center justify-between gap-3">
                    <span>
                      <span className="font-medium transition-colors group-hover:text-[var(--brand)]">
                        {o.label}
                      </span>
                      <span className="ml-2 text-xs italic text-muted-foreground">
                        {o.scientific}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full border border-border/65 bg-background/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {CATEGORY_META[o.category].singular}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
