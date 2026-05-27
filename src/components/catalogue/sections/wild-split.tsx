import {
  MapPin,
  Bug,
  Leaf,
  ShieldCheck,
  Sun,
  Sprout,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DetailSection } from "@/data/species-detail";
import type { CatalogueEntry } from "@/types/catalogue";
import { OriginMap } from "@/components/charts/origin-map";
import { regionsFromOrigin } from "@/lib/catalogue/origin-regions";

interface WildSplitProps {
  entry: CatalogueEntry;
  sections: DetailSection[];
  className?: string;
}

const SIDE_ICON: Record<string, { icon: LucideIcon; tint: string }> = {
  wildDiet: { icon: Bug, tint: "text-amber-700" },
  conservation: { icon: ShieldCheck, tint: "text-[var(--brand)]" },
  emersedForm: { icon: Sun, tint: "text-amber-800" },
  flowering: { icon: Sprout, tint: "text-[var(--leaf)]" },
};

export function WildSplit({ entry, sections, className }: WildSplitProps) {
  if (sections.length === 0) return null;

  // The habitat section is the visual centrepiece; everything else flows
  // alongside it as smaller iconified facts.
  const habitat = sections.find(
    (s) => s.key === "habitat" || s.key === "habitatNatural",
  );
  const side = sections.filter(
    (s) => s.key !== "habitat" && s.key !== "habitatNatural",
  );
  const mappableRegions = regionsFromOrigin(entry.origin);

  return (
    <section
      className={cn("flex flex-col gap-6", className)}
      aria-labelledby="group-wild"
    >
      <header className="flex flex-col gap-1">
        <h2
          id="group-wild"
          className="text-display-tight text-2xl sm:text-3xl"
        >
          In the wild
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Where it lived before it came home.
        </p>
      </header>

      {/* World map, only shown when we can geo-locate the origin */}
      {mappableRegions.length > 0 && (
        <OriginMap origin={entry.origin} className="animate-fade-up" />
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.45fr_1fr] lg:gap-6">
        {/* Habitat pull-quote */}
        {habitat && (
          <article className="animate-fade-up glass glass-edge relative overflow-hidden rounded-2xl p-7 sm:p-9">
            {/* Subtle leaf-tinted glow in the corner */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 size-60 rounded-full bg-[var(--leaf)]/12 blur-3xl"
            />
            {/* Quote mark accent */}
            <span
              aria-hidden
              className="absolute right-6 top-5 text-7xl leading-none text-[var(--brand)]/20 sm:text-8xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              &ldquo;
            </span>

            <div className="relative flex items-center gap-2">
              <MapPin className="size-4 text-[var(--brand)]" aria-hidden />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
                Origin · {entry.origin}
              </span>
            </div>

            <p className="relative mt-5 text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
              {habitat.body}
            </p>
          </article>
        )}

        {/* Side facts, iconified panels */}
        {side.length > 0 && (
          <div className="stagger flex flex-col gap-3">
            {side.map((s, i) => {
              const info = SIDE_ICON[s.key] ?? {
                icon: Leaf,
                tint: "text-[var(--brand)]",
              };
              const Icon = info.icon;
              return (
                <article
                  key={s.key}
                  style={{ ["--i" as string]: i + 1 }}
                  className="animate-fade-up glass glass-edge group rounded-2xl p-5 transition-colors duration-300 hover:border-[var(--brand)]/35"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={cn(
                        "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground/5",
                        info.tint,
                      )}
                    >
                      <Icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/85">
                        {s.label}
                      </h3>
                      <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                        {s.body}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
