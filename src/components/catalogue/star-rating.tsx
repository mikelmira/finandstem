import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** Integer rating, 1–5. Values outside the range are clamped. */
  value: number;
  /** Total stars to draw. Defaults to 5. */
  outOf?: number;
  /** Star size in pixels. Defaults to 16. */
  size?: number;
  /** Optional label rendered to the right of the stars (e.g. "Top tier"). */
  label?: string;
  className?: string;
}

/**
 * Star-rating display — used for the Clean-up crew score on snails and
 * shrimp. Renders `value` filled stars followed by `outOf - value`
 * outlined stars. Includes a screen-reader-friendly text equivalent
 * and an optional human-readable label suffix.
 */
export function StarRating({
  value,
  outOf = 5,
  size = 16,
  label,
  className,
}: StarRatingProps) {
  const safe = Math.max(0, Math.min(outOf, Math.round(value)));
  const stars = Array.from({ length: outOf }, (_, i) => i < safe);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[var(--brand)]",
        className,
      )}
      aria-label={`${safe} out of ${outOf}${label ? ` — ${label}` : ""}`}
      role="img"
    >
      <span className="inline-flex items-center gap-0.5">
        {stars.map((filled, i) => (
          <Star
            key={i}
            aria-hidden
            width={size}
            height={size}
            className={cn(
              "shrink-0",
              filled
                ? "fill-current text-[var(--brand)]"
                : "fill-none text-muted-foreground/30",
            )}
            strokeWidth={1.5}
          />
        ))}
      </span>
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
      {!label && (
        <span className="text-sm font-medium text-foreground">
          {safe} / {outOf}
        </span>
      )}
    </span>
  );
}

/**
 * Map a 1–5 algae-grazing score to a short human-readable tier label.
 * Used as the suffix beside the stars so the rating is meaningful
 * on its own (a 3/5 with no context is ambiguous; "Solid grazer" isn't).
 */
export function cleanupCrewLabel(rating: number): string {
  const r = Math.max(1, Math.min(5, Math.round(rating)));
  switch (r) {
    case 5:
      return "Top tier";
    case 4:
      return "Strong";
    case 3:
      return "Solid";
    case 2:
      return "Light help";
    case 1:
      return "Incidental";
    default:
      return "";
  }
}
