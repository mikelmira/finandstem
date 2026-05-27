"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Scale, Check, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CatalogueCategory } from "@/types/catalogue";
import {
  appendCompareId,
  readCompareIds,
  writeCompareIds,
  COMPARE_MAX,
} from "@/lib/compare-storage";

interface CompareButtonProps {
  category: CatalogueCategory;
  slug: string;
  commonName: string;
  className?: string;
}

export function CompareButton({
  category,
  slug,
  commonName,
  className,
}: CompareButtonProps) {
  const router = useRouter();
  const id = `${category}:${slug}`;
  const [present, setPresent] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const current = readCompareIds();
    setPresent(current.includes(id));
    setHydrated(true);
  }, [id]);

  function onClick() {
    const current = readCompareIds();
    const next = present ? current : appendCompareId(current, id);
    writeCompareIds(next);
    const qs = encodeURIComponent(next.join(","));
    router.push(next.length ? `/compare?ids=${qs}` : "/compare");
  }

  const label = present
    ? "In your compare"
    : hydrated
      ? "Add to compare"
      : "Compare";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        present
          ? `${commonName} is in your comparison, open compare page`
          : `Add ${commonName} to comparison (up to ${COMPARE_MAX})`
      }
      className={cn(
        "press group inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5",
        present
          ? "border-emerald-600/45 bg-emerald-500/15 text-emerald-800 hover:shadow-[0_10px_24px_-12px_color-mix(in_oklab,rgb(110_231_183)_60%,transparent)]"
          : "border-border bg-background/70 text-foreground hover:border-[var(--brand)]/45 hover:text-[var(--brand)] hover:shadow-[0_10px_24px_-12px_color-mix(in_oklab,var(--brand)_50%,transparent)]",
        className,
      )}
    >
      {present ? (
        <Check className="size-3.5" aria-hidden strokeWidth={2.2} />
      ) : (
        <Scale
          className="size-3.5 transition-transform duration-300 group-hover:-rotate-6"
          aria-hidden
          strokeWidth={1.9}
        />
      )}
      <span>{label}</span>
      <ArrowUpRight
        className="size-3.5 -mr-0.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden
      />
    </button>
  );
}
