"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_META, type CatalogueCategory } from "@/types/catalogue";

export interface CompareOption {
  value: string;
  label: string;
  scientific: string;
  category: CatalogueCategory;
}

interface ComparePickerProps {
  options: ReadonlyArray<CompareOption>;
  /** Current selection in `category:slug` form. */
  selected: string[];
  /** Maximum number of species the comparison can hold. */
  max?: number;
}

export function ComparePicker({
  options,
  selected,
  max = 4,
}: ComparePickerProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selectedSet = new Set(selected);

  function add(value: string) {
    if (selectedSet.has(value) || selected.length >= max) return;
    const next = [...selected, value].join(",");
    router.replace(`/compare?ids=${encodeURIComponent(next)}`, {
      scroll: false,
    });
    setQuery("");
  }

  function remove(value: string) {
    const next = selected.filter((s) => s !== value).join(",");
    if (next) {
      router.replace(`/compare?ids=${encodeURIComponent(next)}`, {
        scroll: false,
      });
    } else {
      router.replace(`/compare`, { scroll: false });
    }
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

  const canAdd = selected.length < max;

  return (
    <div className="flex flex-col gap-4" ref={containerRef}>
      <div className="flex flex-wrap items-center gap-2">
        {selected.length === 0 && (
          <span className="text-xs text-muted-foreground">
            No species selected yet — add up to {max}.
          </span>
        )}
        {selected.map((value) => {
          const opt = options.find((o) => o.value === value);
          if (!opt) return null;
          return (
            <span
              key={value}
              className="press inline-flex items-center gap-1.5 rounded-full border border-[var(--brand)]/40 bg-[var(--brand)]/12 px-3 py-1 text-xs font-medium text-foreground"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {CATEGORY_META[opt.category].singular}
              </span>
              <span>·</span>
              <span>{opt.label}</span>
              <button
                type="button"
                onClick={() => remove(value)}
                className="ml-1 inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                aria-label={`Remove ${opt.label} from comparison`}
              >
                <X className="size-3" aria-hidden />
              </button>
            </span>
          );
        })}
      </div>

      {canAdd && (
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            autoComplete="off"
            placeholder="Add a species — search by name or scientific…"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            className="w-full rounded-xl border border-border bg-background/70 py-2.5 pl-10 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
          />
          {open && filtered.length > 0 && (
            <ul
              role="listbox"
              className="animate-drop-in absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-border bg-background/95 p-1 shadow-lg backdrop-blur"
            >
              {filtered.slice(0, 30).map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => {
                      add(o.value);
                      setOpen(false);
                    }}
                    className="press group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 hover:translate-x-0.5 hover:bg-foreground/5"
                  >
                    <Plus className="size-3.5 text-muted-foreground transition-colors group-hover:text-[var(--brand)]" aria-hidden />
                    <span className="flex w-full items-center justify-between gap-3">
                      <span>
                        <span className="font-medium transition-colors group-hover:text-[var(--brand)]">
                          {o.label}
                        </span>
                        <span className="ml-2 text-xs italic text-muted-foreground">
                          {o.scientific}
                        </span>
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {CATEGORY_META[o.category].singular}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!canAdd && (
        <span className={cn("text-xs text-muted-foreground")}>
          Comparison is full ({max} species). Remove one to add another.
        </span>
      )}
    </div>
  );
}
