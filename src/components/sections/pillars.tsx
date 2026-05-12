import Link from "next/link";
import { ArrowUpRight, Fish, Leaf, Mountain, Sprout } from "lucide-react";
import { SectionShell, SectionHeading } from "@/components/sections/section-shell";
import { Badge } from "@/components/ui/badge";
import { fish, plants, shrimp, mosses } from "@/data";

interface PillarsProps {
  eyebrow: string;
  title: string;
  items: ReadonlyArray<{
    title: string;
    slug: string;
    body: string;
    sources: string;
  }>;
}

const PILLAR_META: Record<
  string,
  { href: string; icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>; count: number }
> = {
  fish: { href: "/fish", icon: Fish, count: fish.length },
  plants: { href: "/plants", icon: Leaf, count: plants.length },
  shrimp: { href: "/shrimp", icon: Mountain, count: shrimp.length },
  mosses: { href: "/mosses", icon: Sprout, count: mosses.length },
};

export function Pillars({ eyebrow, title, items }: PillarsProps) {
  return (
    <SectionShell className="relative isolate border-t border-border/60">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-grid opacity-50"
      />
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((p) => {
          const m = PILLAR_META[p.slug] ?? PILLAR_META.fish;
          const Icon = m.icon;
          return (
            <Link
              key={p.slug}
              href={m.href}
              className="glass glass-edge lift group relative flex flex-col gap-5 rounded-2xl p-7 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)] ring-1 ring-inset ring-[var(--brand)]/15">
                  <Icon className="size-5" aria-hidden />
                </span>
                <ArrowUpRight
                  className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
                  aria-hidden
                />
              </div>
              <div>
                <h3 className="text-display-tight text-2xl sm:text-3xl">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {p.body}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-xs">
                <Badge
                  variant="secondary"
                  className="rounded-full bg-background/60 font-normal backdrop-blur"
                >
                  {m.count} species
                </Badge>
                <span className="text-muted-foreground">{p.sources}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </SectionShell>
  );
}
