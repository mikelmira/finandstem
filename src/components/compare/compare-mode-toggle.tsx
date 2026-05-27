"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Fish, Beaker } from "lucide-react";
import { cn } from "@/lib/utils";
import { writeCompareMode, type CompareMode } from "@/lib/compare-storage";

interface CompareModeToggleProps {
  mode: CompareMode;
}

/**
 * Two-button pill segment at the top of the compare page. Switching
 * mode clears the selection (we drop `ids` from the URL) so the
 * user is never left with a stale selection of the wrong type.
 *
 * The current mode is also written to localStorage so other detail
 * pages know which collection the user is currently comparing in.
 */
export function CompareModeToggle({ mode }: CompareModeToggleProps) {
  const router = useRouter();

  // Mirror the URL-driven mode into localStorage.
  React.useEffect(() => {
    writeCompareMode(mode);
  }, [mode]);

  const setMode = (next: CompareMode) => {
    if (next === mode) return;
    // Clear ids on mode change so we never carry stale selections
    // across modes.
    router.replace(`/compare?mode=${next}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        role="radiogroup"
        aria-label="Compare mode"
        className="glass glass-edge inline-flex w-fit items-center gap-1 rounded-full p-1"
      >
        <ModeButton
          active={mode === "livestock"}
          icon={<Fish className="size-4" aria-hidden />}
          label="Livestock"
          onClick={() => setMode("livestock")}
        />
        <ModeButton
          active={mode === "substrate"}
          icon={<Beaker className="size-4" aria-hidden />}
          label="Substrate"
          onClick={() => setMode("substrate")}
        />
      </div>
      <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm">
        Compare livestock against each other, or substrates against each
        other. Mixing the two does not produce useful comparisons.
      </p>
    </div>
  );
}

function ModeButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "press inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
        active
          ? "bg-[var(--brand)] text-white shadow-sm"
          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
