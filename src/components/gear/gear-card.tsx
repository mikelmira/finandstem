import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GearCard as GearCardData } from "@/types/gear";
import { GEAR_CATEGORIES } from "@/lib/gear/categories";
import { DISPLAY_LABEL, displayValue, formatRange, type DisplayField } from "@/lib/gear/fields";
import type { Fit } from "@/lib/gear/match";
import { GearCompareButton } from "@/components/gear/gear-compare-button";
import { cn } from "@/lib/utils";

function cardValue(card: GearCardData, field: DisplayField): string | null {
  if (field === "tankRange") {
    const mins = card.models.map((m) => m.tankMinL).filter((v): v is number => !!v);
    const maxs = card.models.map((m) => m.tankMaxL).filter((v): v is number => !!v);
    if (maxs.length) {
      const hi = Math.max(...maxs);
      return mins.length ? `${Math.min(...mins)}–${hi} L` : `up to ${hi} L`;
    }
    return null;
  }
  if (field === "fitsRange") {
    const lo = card.models.map((m) => m.fitsLengthMinCm ?? m.fitsLengthMaxCm).filter((v): v is number => !!v);
    const hi = card.models.map((m) => m.fitsLengthMaxCm ?? m.fitsLengthMinCm).filter((v): v is number => !!v);
    if (lo.length) {
      const a = Math.min(...lo);
      const b = Math.max(...hi);
      return a === b ? `${a} cm tanks` : `${a}–${b} cm tanks`;
    }
    const len = formatRange(card.models, "lengthCm");
    return len ? `${len} long` : null;
  }
  if (field === "dimensions") {
    if (card.models.length === 1) return displayValue(card.models[0], "dimensions");
    const len = formatRange(card.models, "lengthCm");
    return len ? `${len} long` : null;
  }
  return formatRange(card.models, field);
}

export const FIT_LABEL: Record<Exclude<Fit, "no">, string> = {
  ideal: "Good fit",
  workable: "Could work",
};

export function GearCard({
  card,
  fit,
  fitModels,
  showCompare = true,
  priority = false,
}: {
  card: GearCardData;
  fit?: Fit | null;
  fitModels?: string[];
  showCompare?: boolean;
  priority?: boolean;
}) {
  const meta = GEAR_CATEGORIES[card.category];
  const href = `/gear/${card.category}/${card.id}`;
  const facts = meta.cardFields
    .map((f) => ({ label: DISPLAY_LABEL[f], value: cardValue(card, f) }))
    .filter((f): f is { label: string; value: string } => Boolean(f.value));
  const sizes = card.models.length;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--brand)]/40 hover:shadow-md">
      <Link href={href} className="flex flex-1 flex-col" aria-label={`${card.brand} ${card.name}`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
          {card.image ? (
            // Plain <img>: product shots are pre-sized webp, no optimiser needed.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.image.thumb}
              alt={`${card.brand} ${card.name}`}
              width={card.image.width}
              height={card.image.height}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : null}
          {fit && fit !== "no" && (
            <span
              className={cn(
                "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]",
                fit === "ideal"
                  ? "bg-emerald-600 text-white"
                  : "bg-amber-500/90 text-white",
              )}
            >
              {FIT_LABEL[fit]}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--brand)]">
            {card.brand} · {meta.subtypes[card.subtype] ?? card.subtype}
          </p>
          <h3 className="text-base font-semibold leading-snug text-foreground">
            {card.name}
          </h3>
          {facts.length > 0 && (
            <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1">
              {facts.slice(0, 2).map((f) => (
                <div key={f.label}>
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="text-sm font-medium text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {fitModels && fitModels.length > 0 ? (
            <p className="text-xs text-emerald-800">
              Fits: {fitModels.slice(0, 4).join(", ")}
              {fitModels.length > 4 ? ` +${fitModels.length - 4}` : ""}
            </p>
          ) : (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {card.bestFor || card.summary}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>
              {sizes} {sizes === 1 ? "model" : "models"}
            </span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </div>
        </div>
      </Link>
      {showCompare && (
        <div className="absolute right-3 top-3">
          <GearCompareButton
            category={card.category}
            item={{ id: card.id, name: `${card.brand} ${card.name}`, thumb: card.image?.thumb }}
          />
        </div>
      )}
    </article>
  );
}
