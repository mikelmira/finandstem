import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import type { FeatureCollection, Geometry } from "geojson";
import type { Topology, GeometryCollection } from "topojson-specification";
import { regionsFromOrigin } from "@/lib/catalogue/origin-regions";
import { cn } from "@/lib/utils";

interface OriginMapProps {
  origin: string;
  /** Pixel width of the rendered SVG. Height auto-scales 1:2. */
  width?: number;
  className?: string;
}

const WIDTH = 800;
const HEIGHT = 410;

// Build the projection + path generator once at module load. d3 functions are
// pure, no mutation across renders.
const projection = geoNaturalEarth1()
  .scale(155)
  .translate([WIDTH / 2, HEIGHT / 2 + 4]);
const pathGen = geoPath(projection);

// Pre-compute the world background (countries + graticule) once at build time
// so server renders are cheap.
const topo = worldData as unknown as Topology<{
  countries: GeometryCollection;
}>;
const countries = feature(
  topo,
  topo.objects.countries,
) as unknown as FeatureCollection<Geometry>;
const countriesPath = pathGen(countries) ?? "";
const graticulePath = pathGen(geoGraticule10()) ?? "";

export function OriginMap({ origin, width, className }: OriginMapProps) {
  const regions = regionsFromOrigin(origin);
  if (regions.length === 0) return null;

  // Project every marker once for use in SVG + tooltip rendering.
  const markers = regions
    .map((r) => {
      const xy = projection(r.coords);
      if (!xy) return null;
      const [x, y] = xy;
      return { region: r, x, y };
    })
    .filter((m): m is { region: (typeof regions)[number]; x: number; y: number } =>
      m !== null,
    );

  return (
    <figure
      className={cn(
        "glass glass-edge relative overflow-hidden rounded-2xl",
        className,
      )}
      aria-label={`World map showing the native range of ${origin}`}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={width ?? "100%"}
        height={width ? Math.round((width * HEIGHT) / WIDTH) : "auto"}
        role="img"
        aria-hidden="true"
        className="block w-full h-auto"
      >
        {/* Ocean — subtle deep-water tint */}
        <rect
          x={0}
          y={0}
          width={WIDTH}
          height={HEIGHT}
          fill="color-mix(in oklab, var(--abyss) 22%, transparent)"
        />

        {/* Lat/long graticule */}
        <path
          d={graticulePath}
          fill="none"
          stroke="color-mix(in oklab, var(--foreground) 6%, transparent)"
          strokeWidth={0.5}
        />

        {/* Continents */}
        <path
          d={countriesPath}
          fill="color-mix(in oklab, var(--moss) 38%, transparent)"
          stroke="color-mix(in oklab, var(--brand) 35%, transparent)"
          strokeWidth={0.45}
          strokeLinejoin="round"
        />

        {/* Connecting lines between markers when there are 2+ regions */}
        {markers.length > 1 && (
          <g>
            {markers.slice(1).map((m, i) => {
              const prev = markers[i];
              return (
                <line
                  key={`${prev.region.id}-${m.region.id}`}
                  x1={prev.x}
                  y1={prev.y}
                  x2={m.x}
                  y2={m.y}
                  stroke="color-mix(in oklab, var(--brand) 55%, transparent)"
                  strokeWidth={0.9}
                  strokeDasharray="2 3"
                />
              );
            })}
          </g>
        )}

        {/* Markers — pulsing outer ring + solid dot */}
        {markers.map((m) => (
          <g key={m.region.id} transform={`translate(${m.x} ${m.y})`}>
            <circle
              r={11}
              fill="color-mix(in oklab, var(--brand) 22%, transparent)"
            />
            <circle
              r={6}
              fill="color-mix(in oklab, var(--brand) 70%, transparent)"
              stroke="var(--background)"
              strokeWidth={1.5}
            />
            <circle r={2.5} fill="var(--background)" />
          </g>
        ))}
      </svg>

      {/* Legend — accessible plain text */}
      <figcaption className="border-t border-border/50 bg-background/40 px-5 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-foreground/85">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            Native range
          </span>
          {markers.map((m) => (
            <span
              key={m.region.id}
              className="inline-flex items-center gap-1.5"
            >
              <span
                aria-hidden
                className="size-2 rounded-full bg-[var(--brand)]"
              />
              {m.region.label}
            </span>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}
