import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A collapsible block built on native <details>, so it works in server and
 * client components, needs no JS, and its content stays in the HTML for
 * search engines even while collapsed.
 */
export function AccordionSection({
  title,
  eyebrow,
  defaultOpen = false,
  className,
  children,
}: {
  title: string;
  eyebrow?: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <details
      className={cn(
        "group rounded-2xl border border-border/60 bg-background/60 [&_summary::-webkit-details-marker]:hidden",
        className,
      )}
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <span className="flex flex-col gap-0.5">
          {eyebrow && (
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--brand)]">{eyebrow}</span>
          )}
          <span className="text-display-tight text-lg sm:text-xl">{title}</span>
        </span>
        <ChevronDown
          className="size-5 flex-none text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">{children}</div>
    </details>
  );
}
