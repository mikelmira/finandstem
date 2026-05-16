import * as React from "react";
import { cn } from "@/lib/utils";
import { getHabitat } from "@/data/habitats";
import type {
  FishEntry,
  MossEntry,
  PlantEntry,
  ShrimpEntry,
} from "@/types/catalogue";

/* ──────────────────────────────────────────────────────────────────
   Profile — a field-guide-style list of categorical facts about the
   species. Each entry is a label / value pair sitting directly on
   the cream paper background — no glass card chrome, no graphics,
   just the information. Items lay out in a two-column grid on md+
   so the section reads as a clean reference table.
   ────────────────────────────────────────────────────────────────── */

interface ProfileItemProps {
  label: string;
  value: string;
  helper?: string;
  className?: string;
}

function ProfileItem({ label, value, helper, className }: ProfileItemProps) {
  return (
    <div
      className={cn(
        "animate-fade-up flex flex-col gap-1 border-b border-border/40 pb-4 last:border-b-0",
        className,
      )}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <p className="text-sm font-semibold leading-tight text-foreground sm:text-base">
        {value}
      </p>
      {helper && (
        <p className="text-[11px] leading-snug text-muted-foreground/80">
          {helper}
        </p>
      )}
    </div>
  );
}

const PROFILE_GRID =
  "stagger grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2";

/* ──────────────────────────────────────────────────────────────────
   Per-category composed profile grids.
   ────────────────────────────────────────────────────────────────── */

export function ProfileCards({
  entry,
}: {
  entry: FishEntry | PlantEntry | ShrimpEntry | MossEntry;
}) {
  if (entry.category === "fish") return <FishProfile entry={entry} />;
  if (entry.category === "plants") return <PlantProfile entry={entry} />;
  if (entry.category === "shrimp") return <ShrimpProfile entry={entry} />;
  return <MossProfile entry={entry} />;
}

function FishProfile({ entry: f }: { entry: FishEntry }) {
  // Water column, schooling, and temperament now live in the Parameters
  // block / hero pill row, so they're not repeated here.
  return (
    <div className={PROFILE_GRID}>
      <ProfileItem label="Family" value={f.family} />
      <ProfileItem
        label="Diet"
        value={cap(f.diet)}
        helper={f.feedingNotes}
      />
      <ProfileItem label="Lifespan" value={`${f.lifespan} yrs`} />
      <ProfileItem
        label="Breeding"
        value={cap(f.breedingDifficulty)}
      />
      <ProfileItem
        label="Habitat"
        value={getHabitat(f.slug, f.origin)}
        helper={f.origin}
      />
    </div>
  );
}

function PlantProfile({ entry: p }: { entry: PlantEntry }) {
  return (
    <div className={PROFILE_GRID}>
      <ProfileItem label="Family" value={p.family} />
      <ProfileItem label="Type" value={p.plantType} />
      <ProfileItem label="Position" value={p.position} />
      <ProfileItem label="Substrate" value={p.substrate} />
      <ProfileItem label="Propagation" value={p.propagation} />
      <ProfileItem
        label="Habitat"
        value={getHabitat(p.slug, p.origin)}
        helper={p.origin}
      />
    </div>
  );
}

function ShrimpProfile({ entry: s }: { entry: ShrimpEntry }) {
  return (
    <div className={PROFILE_GRID}>
      <ProfileItem
        label="Colony minimum"
        value={`${s.colonyMin}+`}
      />
      <ProfileItem
        label="Diet"
        value={cap(s.diet)}
        helper={s.feedingNotes}
      />
      <ProfileItem
        label="Algae grazing"
        value={`${s.algaeEaterRating} / 5`}
      />
      <ProfileItem label="Breeding" value={cap(s.breeding)} />
      <ProfileItem label="Lifespan" value={`${s.lifespan} yrs`} />
      <ProfileItem
        label="Habitat"
        value={getHabitat(s.slug, s.origin)}
        helper={s.origin}
      />
    </div>
  );
}

function MossProfile({ entry: m }: { entry: MossEntry }) {
  return (
    <div className={PROFILE_GRID}>
      <ProfileItem label="Family" value={m.family} />
      <ProfileItem label="Type" value={m.type} />
      <ProfileItem label="Attachment" value={m.attachment} />
      <ProfileItem label="Typical use" value={m.typicalUse} />
      <ProfileItem label="Trimming" value={m.trimming} />
      <ProfileItem
        label="Habitat"
        value={getHabitat(m.slug, m.origin)}
        helper={m.origin}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────────── */

function cap(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
