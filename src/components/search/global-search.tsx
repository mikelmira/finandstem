"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Sparkles, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/client-hooks";
import { CATEGORY_META, type CatalogueCategory } from "@/types/catalogue";
import { IMAGE_ATTRIBUTION } from "@/data/image-attribution";

export interface SearchOption {
  category: CatalogueCategory;
  slug: string;
  commonName: string;
  scientificName: string;
  origin: string;
}

interface GlobalSearchProps {
  options: ReadonlyArray<SearchOption>;
}

export function GlobalSearch({ options }: GlobalSearchProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const mounted = useHydrated();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Cmd+K / Ctrl+K to open, Esc to close
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // (activeIndex is reset to 0 in the input's onChange handler below
  // and clamped against the results length when navigating.)

  // Focus input when opening
  React.useEffect(() => {
    if (open) {
      // Use rAF so the input is mounted
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const q = query.trim().toLowerCase();
  const results = React.useMemo(() => {
    if (!q) return options.slice(0, 16);
    return options
      .filter(
        (o) =>
          o.commonName.toLowerCase().includes(q) ||
          o.scientificName.toLowerCase().includes(q) ||
          o.origin.toLowerCase().includes(q),
      )
      .slice(0, 40);
  }, [options, q]);

  function go(option: SearchOption) {
    const meta = CATEGORY_META[option.category];
    setOpen(false);
    setQuery("");
    router.push(`${meta.path}/${option.slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) go(results[activeIndex]);
    }
  }

  return (
    <>
      {/* Trigger button, visible on every page from the header */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the catalogue"
        className="press group inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background/60 px-3 text-xs text-muted-foreground transition-all duration-200 hover:border-[var(--brand)]/40 hover:text-foreground sm:gap-3 sm:pl-3 sm:pr-1.5"
      >
        <Search className="size-3.5" aria-hidden />
        <span className="hidden sm:inline">Search species…</span>
        <span className="hidden items-center gap-0.5 rounded-md border border-border bg-background/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </span>
      </button>

      {/* Modal */}
      {open && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search the Fin & Stem catalogue"
          className="fixed inset-0 z-[100] flex items-start justify-center bg-[var(--abyss)]/65 px-4 pt-[10vh] backdrop-blur-sm animate-fade-up"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="glass glass-edge animate-drop-in w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl">
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
              <Search
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search by common name, scientific name, or origin…"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                aria-autocomplete="list"
                autoComplete="off"
              />
              <span className="hidden items-center gap-1 rounded-md border border-border bg-background/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
                ESC
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="press inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground sm:hidden"
                aria-label="Close search"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            {/* Results */}
            <ul
              role="listbox"
              className="max-h-[60vh] overflow-y-auto p-2"
            >
              {results.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No species match &ldquo;{query}&rdquo;. Try a different
                  spelling or scientific name.
                </li>
              ) : (
                results.map((o, i) => (
                  <ResultRow
                    key={`${o.category}-${o.slug}`}
                    option={o}
                    active={i === activeIndex}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => go(o)}
                  />
                ))
              )}
            </ul>

            {/* Footer hints */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 bg-background/70 px-4 py-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <kbd className="inline-flex items-center rounded-md border border-border bg-background/70 px-1.5 py-0.5 text-[10px] font-medium">
                  ↑↓
                </kbd>
                navigate
              </span>
              <span className="inline-flex items-center gap-2">
                <kbd className="inline-flex items-center rounded-md border border-border bg-background/70 px-1.5 py-0.5 text-[10px] font-medium">
                  ⏎
                </kbd>
                open
              </span>
              <Link
                href="/planner"
                onClick={() => setOpen(false)}
                className="link-underline inline-flex items-center gap-1 text-[var(--brand)]"
              >
                <Sparkles className="size-3" aria-hidden />
                Try the Tank Planner
              </Link>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function ResultRow({
  option,
  active,
  onMouseEnter,
  onClick,
}: {
  option: SearchOption;
  active: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}) {
  const meta = CATEGORY_META[option.category];
  const img = IMAGE_ATTRIBUTION[option.slug];
  return (
    <li>
      <button
        type="button"
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        className={cn(
          "press group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-150",
          active
            ? "bg-[var(--brand)]/12"
            : "hover:bg-foreground/5",
        )}
      >
        <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
          {img ? (
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center">
              <ImageOff
                className="size-4 text-muted-foreground/40"
                aria-hidden
              />
            </span>
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {option.commonName}
          </span>
          <span className="truncate text-xs italic text-muted-foreground">
            {option.scientificName}
          </span>
        </span>
        <span className="shrink-0 rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {meta.singular}
        </span>
      </button>
    </li>
  );
}
