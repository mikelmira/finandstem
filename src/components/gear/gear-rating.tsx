import { Circle, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

/** Five icons, the first `value` filled. Price uses coins, metrics use dots. */
export function RatingIcons({
  value,
  kind,
  label,
  size = "sm",
}: {
  value: number;
  kind: "price" | "metric";
  label: string;
  size?: "sm" | "md";
}) {
  const Icon = kind === "price" ? Coins : Circle;
  const cls = size === "sm" ? "size-3" : "size-4";
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${label}: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          aria-hidden
          className={cn(
            cls,
            n <= value
              ? kind === "price"
                ? "text-amber-600"
                : "fill-[var(--brand)] text-[var(--brand)]"
              : "text-muted-foreground/30",
          )}
        />
      ))}
    </span>
  );
}
