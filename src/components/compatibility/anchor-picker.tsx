"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_META } from "@/types/catalogue";

interface AnchorOption {
  value: string;
  label: string;
  scientific: string;
  category: "fish" | "plants" | "shrimp" | "mosses";
}

interface AnchorPickerProps {
  options: ReadonlyArray<AnchorOption>;
  current: string | null;
  currentLabel: string | null;
}

export function AnchorPicker({
  options,
  current,
  currentLabel,
}: AnchorPickerProps) {
  const router = useRouter();
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

  const q = query.trim().toLowerCase();
  const filtered = q
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(q) ||
          o.scientific.toLowerCase().includes(q),
      )
    : options;

  function pick(value: string) {
    setQuery("");
    setFocused(false);
    router.push(`/compatibility?anchor=${encodeURIComponent(value)}`);
  }

  function clear() {
    setQuery("");
    router.push("/compatibility");
  }

  return (
    <div className="relative" ref={containerRef}>
      <label
        htmlFor="anchor-search"
        className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
      >
        Pick an anchor
      </label>
      <div className="relative mt-2">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id="anchor-search"
          type="search"
          autoComplete="off"
          placeholder={
            currentLabel ? currentLabel : "Search a fish, plant, shrimp or moss…"
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          className="w-full rounded-xl border border-border bg-background/80 py-2.5 pl-10 pr-10 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/25"
        />
        {current && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            aria-label="Clear anchor"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>

      {focused && filtered.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-border bg-background/95 p-1 shadow-lg backdrop-blur"
        >
          {filtered.slice(0, 30).map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => pick(o.value)}
                className={cn(
                  "flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-foreground/5",
                  o.value === current && "bg-[var(--brand)]/10",
                )}
              >
                <span className="flex w-full items-center justify-between gap-3">
                  <span className="font-medium">{o.label}</span>
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {CATEGORY_META[o.category].singular}
                  </span>
                </span>
                <span className="text-xs italic text-muted-foreground">
                  {o.scientific}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
