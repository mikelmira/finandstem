"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CatalogueCategory } from "@/types/catalogue";
import {
  appendPlannerId,
  plannerHasId,
  readPlannerIds,
  writePlannerIds,
} from "@/lib/planner-storage";

interface PlanButtonProps {
  category: CatalogueCategory;
  slug: string;
  commonName: string;
  className?: string;
}

/**
 * "Add to tank" button, mirrors the CompareButton pattern but
 * persists to the planner storage and navigates to /planner.
 *
 * When clicked:
 *   • If the species is already in the planner, just navigate to
 *     /planner with the existing selection (so the user can review
 *     it). The button label shows "In your tank".
 *   • Otherwise append the id, persist, and navigate with the new
 *     selection in the URL so the server-rendered page reflects it.
 */
export function PlanButton({
  category,
  slug,
  commonName,
  className,
}: PlanButtonProps) {
  const router = useRouter();
  const id = `${category}:${slug}`;
  const [present, setPresent] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const current = readPlannerIds();
    setPresent(plannerHasId(current, id));
    setHydrated(true);
  }, [id]);

  function onClick() {
    const current = readPlannerIds();
    const next = present ? current : appendPlannerId(current, id);
    writePlannerIds(next);
    const qs = encodeURIComponent(next.join(","));
    router.push(next.length ? `/planner?species=${qs}` : "/planner");
  }

  const label = present
    ? "In your tank"
    : hydrated
      ? "Add to tank"
      : "Plan a tank";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        present
          ? `${commonName} is already in your tank, open the planner`
          : `Add ${commonName} to your tank planner`
      }
      className={cn(
        "press group inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5",
        present
          ? "border-[var(--brand)]/45 bg-[var(--brand)]/15 text-[var(--brand)] hover:shadow-[0_10px_24px_-12px_color-mix(in_oklab,var(--brand)_55%,transparent)]"
          : "border-border bg-background/70 text-foreground hover:border-[var(--brand)]/45 hover:text-[var(--brand)] hover:shadow-[0_10px_24px_-12px_color-mix(in_oklab,var(--brand)_50%,transparent)]",
        className,
      )}
    >
      {present ? (
        <Check className="size-3.5" aria-hidden strokeWidth={2.2} />
      ) : (
        <Plus
          className="size-3.5 transition-transform duration-300 group-hover:rotate-90"
          aria-hidden
          strokeWidth={2.2}
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
