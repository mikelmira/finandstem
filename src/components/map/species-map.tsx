"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ImageOff, Minus, Plus, RotateCcw } from "lucide-react";
import type { CatalogueCategory } from "@/types/catalogue";

export interface MapPinSpecies {
  slug: string;
  category: CatalogueCategory;
  categoryLabel: string;
  commonName: string;
  scientificName: string;
  href: string;
  image: string | null;
}

export interface MapPin {
  id: string;
  label: string;
  x: number;
  y: number;
  count: number;
  species: MapPinSpecies[];
}

interface Props {
  width: number;
  height: number;
  countriesPath: string;
  graticulePath: string;
  pins: MapPin[];
}

interface Transform {
  k: number;
  x: number;
  y: number;
}

const MIN_K = 1;
const MAX_K = 9;

export function SpeciesMap({ width, height, countriesPath, graticulePath, pins }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [t, setT] = useState<Transform>({ k: 1, x: 0, y: 0 });
  const [selected, setSelected] = useState<string | null>(null);
  const drag = useRef<{ px: number; py: number; tx: number; ty: number } | null>(null);
  const moved = useRef(false);

  const selectedPin = useMemo(
    () => pins.find((p) => p.id === selected) ?? null,
    [pins, selected],
  );

  /** Client px per SVG unit, from the rendered width. */
  function ratio() {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect ? width / rect.width : 1;
  }

  function clampT(next: Transform): Transform {
    const k = Math.min(MAX_K, Math.max(MIN_K, next.k));
    // Keep the map from being dragged entirely off-screen.
    const maxPan = width; // generous
    const x = Math.min(maxPan, Math.max(-width * (k - 1) - maxPan, next.x));
    const y = Math.min(maxPan, Math.max(-height * (k - 1) - maxPan, next.y));
    return { k, x, y };
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, tx: t.x, ty: t.y };
    moved.current = false;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const r = ratio();
    const dx = (e.clientX - drag.current.px) * r;
    const dy = (e.clientY - drag.current.py) * r;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved.current = true;
    setT((prev) => clampT({ ...prev, x: drag.current!.tx + dx, y: drag.current!.ty + dy }));
  }

  function onPointerUp() {
    drag.current = null;
  }

  function zoomAround(factor: number, cx?: number, cy?: number) {
    setT((prev) => {
      const k2 = Math.min(MAX_K, Math.max(MIN_K, prev.k * factor));
      const px = cx ?? width / 2;
      const py = cy ?? height / 2;
      const gx = (px - prev.x) / prev.k;
      const gy = (py - prev.y) / prev.k;
      return clampT({ k: k2, x: px - k2 * gx, y: py - k2 * gy });
    });
  }

  // Non-passive wheel listener so zooming the map does not also scroll the page.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function handler(e: WheelEvent) {
      e.preventDefault();
      const rect = svg!.getBoundingClientRect();
      const r = width / rect.width;
      const cx = (e.clientX - rect.left) * r;
      const cy = (e.clientY - rect.top) * r;
      setT((prev) => {
        const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
        const k2 = Math.min(MAX_K, Math.max(MIN_K, prev.k * factor));
        const gx = (cx - prev.x) / prev.k;
        const gy = (cy - prev.y) / prev.k;
        return clampT({ k: k2, x: cx - k2 * gx, y: cy - k2 * gy });
      });
    }
    svg.addEventListener("wheel", handler, { passive: false });
    return () => svg.removeEventListener("wheel", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  function reset() {
    setT({ k: 1, x: 0, y: 0 });
    setSelected(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Map */}
      <div className="glass glass-edge relative overflow-hidden rounded-2xl">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="block w-full h-auto touch-none select-none"
          style={{ cursor: drag.current ? "grabbing" : "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          role="img"
          aria-label="Interactive world map of aquarium species origins"
        >
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="color-mix(in oklab, var(--abyss) 22%, transparent)"
          />
          <g transform={`translate(${t.x} ${t.y}) scale(${t.k})`}>
            <path
              d={graticulePath}
              fill="none"
              stroke="color-mix(in oklab, var(--foreground) 6%, transparent)"
              strokeWidth={0.5 / t.k}
            />
            <path
              d={countriesPath}
              fill="color-mix(in oklab, var(--moss) 38%, transparent)"
              stroke="color-mix(in oklab, var(--brand) 35%, transparent)"
              strokeWidth={0.45 / t.k}
              strokeLinejoin="round"
            />
            {pins.map((p) => {
              const baseR = Math.min(9, 3 + Math.sqrt(p.count) * 1.6);
              const r = baseR / t.k;
              const isSel = p.id === selected;
              return (
                <g
                  key={p.id}
                  transform={`translate(${p.x} ${p.y})`}
                  style={{ cursor: "pointer" }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!moved.current) setSelected(p.id);
                  }}
                >
                  <circle
                    r={r * 1.9}
                    fill={
                      isSel
                        ? "color-mix(in oklab, var(--brand) 35%, transparent)"
                        : "color-mix(in oklab, var(--brand) 18%, transparent)"
                    }
                  />
                  <circle
                    r={r}
                    fill="color-mix(in oklab, var(--brand) 78%, transparent)"
                    stroke="var(--background)"
                    strokeWidth={1.4 / t.k}
                  />
                  <title>{`${p.label} — ${p.count} species`}</title>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Zoom controls */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          <MapButton label="Zoom in" onClick={() => zoomAround(1.4)}>
            <Plus className="size-4" aria-hidden />
          </MapButton>
          <MapButton label="Zoom out" onClick={() => zoomAround(1 / 1.4)}>
            <Minus className="size-4" aria-hidden />
          </MapButton>
          <MapButton label="Reset view" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden />
          </MapButton>
        </div>

        <p className="pointer-events-none absolute bottom-2 left-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Drag to pan · scroll to zoom · click a pin
        </p>
      </div>

      {/* Species panel */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-background/60 p-5 backdrop-blur">
          {selectedPin ? (
            <>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--brand)]">
                {selectedPin.count} species
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {selectedPin.label}
              </h2>
              <ul className="mt-4 flex max-h-[28rem] flex-col gap-2 overflow-y-auto pr-1">
                {selectedPin.species.map((s) => (
                  <li key={`${s.category}-${s.slug}`}>
                    <Link
                      href={s.href}
                      className="press group flex items-center gap-3 rounded-lg border border-border/60 bg-background/50 p-2 transition-colors hover:border-[var(--brand)]/40"
                    >
                      <span className="flex-none overflow-hidden rounded-md bg-secondary/40">
                        {s.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={s.image}
                            alt={s.commonName}
                            loading="lazy"
                            width={40}
                            height={40}
                            className="size-10 object-cover"
                          />
                        ) : (
                          <span className="flex size-10 items-center justify-center text-muted-foreground">
                            <ImageOff className="size-4" aria-hidden />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-[var(--brand)]">
                          {s.commonName}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {s.categoryLabel} · <span className="italic">{s.scientificName}</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-foreground">Click a pin</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Each pin marks a region species come from. Click one to see every
                fish, plant, shrimp and snail native to that part of the world.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function MapButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="press flex size-8 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground/80 backdrop-blur transition-colors hover:border-[var(--brand)]/40 hover:text-[var(--brand)]"
    >
      {children}
    </button>
  );
}
