"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CATEGORY_META, type CatalogueEntry } from "@/types/catalogue";
import { AnchorPicker } from "@/components/compatibility/anchor-picker";
import { MatchCard } from "@/components/compatibility/match-card";
import { allNorm, type NormalizedEntry } from "@/lib/catalogue/normalize";
import {
  buildCompatibility,
  findAnchor,
  type MatchReason,
} from "@/lib/catalogue/compatibility";

// Fish/plants/shrimp/mosses only — snails aren't in the parameter cross-reference.
const ANCHOR_OPTIONS = allNorm
  .filter(
    (n): n is typeof n & { category: "fish" | "plants" | "shrimp" | "mosses" } =>
      n.category !== "snails",
  )
  .map((n) => ({
    value: `${n.category}:${n.slug}`,
    label: n.commonName,
    scientific: n.scientificName,
    category: n.category,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

/**
 * Client-side compatibility tool. The page is fully static; this reads the
 * anchor from the URL and computes matches in the browser, so there is no
 * per-request server work.
 */
export function CompatibilityClient() {
  const searchParams = useSearchParams();
  const anchor = findAnchor(searchParams?.get("anchor") ?? undefined);

  return (
    <>
      <div className="glass glass-edge mb-10 rounded-2xl p-5 sm:p-6">
        <AnchorPicker
          options={ANCHOR_OPTIONS}
          current={anchor ? `${anchor.category}:${anchor.slug}` : null}
          currentLabel={anchor ? anchor.commonName : null}
        />
        {anchor && <AnchorSummary anchor={anchor} />}
      </div>

      {!anchor ? <EmptyState /> : <CompatibilityResults anchor={anchor} />}
    </>
  );
}

function AnchorSummary({ anchor }: { anchor: NormalizedEntry }) {
  const meta = CATEGORY_META[anchor.category];
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
        {meta.singular} ·{" "}
        <Link
          href={`${meta.path}/${anchor.slug}`}
          className="font-medium text-foreground hover:text-[var(--brand)]"
        >
          {anchor.commonName}
        </Link>
      </span>
      {anchor.tempRange && (
        <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
          {anchor.tempRange.min}–{anchor.tempRange.max} °C
        </span>
      )}
      {anchor.phRange && (
        <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
          pH {anchor.phRange.min}–{anchor.phRange.max}
        </span>
      )}
      {anchor.dghRange && (
        <span className="rounded-full border border-border bg-background/70 px-2.5 py-1">
          {anchor.dghRange.min}–{anchor.dghRange.max} dGH
        </span>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <p className="text-base font-medium">Start by picking an anchor.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Search above for any fish, plant, shrimp or moss. We&rsquo;ll show the
        other three categories filtered by overlapping water parameters and
        tank-mate rules.
      </p>
    </div>
  );
}

function CompatibilityResults({ anchor }: { anchor: NormalizedEntry }) {
  const result = buildCompatibility(anchor);
  const sections: Array<{
    key: "fish" | "plants" | "shrimp" | "mosses";
    matches: Array<{ entry: CatalogueEntry; reasons: MatchReason[] }>;
  }> = [
    { key: "fish", matches: result.fish.map((m) => ({ entry: m.entry.raw, reasons: m.reasons })) },
    { key: "plants", matches: result.plants.map((m) => ({ entry: m.entry.raw, reasons: m.reasons })) },
    { key: "shrimp", matches: result.shrimp.map((m) => ({ entry: m.entry.raw, reasons: m.reasons })) },
    { key: "mosses", matches: result.mosses.map((m) => ({ entry: m.entry.raw, reasons: m.reasons })) },
  ];

  const ordered = [
    sections.find((s) => s.key === anchor.category),
    ...sections.filter((s) => s.key !== anchor.category),
  ].filter((s): s is (typeof sections)[number] => s !== undefined);

  return (
    <div className="flex flex-col gap-10">
      {ordered.map((section) => {
        const meta = CATEGORY_META[section.key];
        return (
          <section key={section.key}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-display-tight text-2xl sm:text-3xl">{meta.label}</h2>
              <span className="text-xs text-muted-foreground">
                {section.matches.length} match
                {section.matches.length === 1 ? "" : "es"}
              </span>
            </div>
            {section.matches.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Nothing in the catalogue overlaps this anchor&rsquo;s parameters yet.
              </p>
            ) : (
              <div className="stagger mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {section.matches.map((m, i) => (
                  <MatchCard
                    key={`${section.key}-${m.entry.slug}`}
                    entry={m.entry}
                    reasons={m.reasons}
                    index={i}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
