import { SectionShell } from "@/components/sections/section-shell";
import {
  Breadcrumb,
  type BreadcrumbItem,
} from "@/components/sections/breadcrumb";

interface LegalSectionProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: ReadonlyArray<{ heading: string; body: string }>;
  breadcrumb?: ReadonlyArray<BreadcrumbItem>;
}

export function LegalSection({
  title,
  lastUpdated,
  intro,
  sections,
  breadcrumb,
}: LegalSectionProps) {
  return (
    <SectionShell containerClassName="max-w-3xl">
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb items={breadcrumb} className="mb-6" />
      )}
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last reviewed: {lastUpdated}
      </p>
      <p className="mt-8 text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
        {intro}
      </p>
      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {s.heading}
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              {s.body}
            </p>
          </section>
        ))}
      </div>
    </SectionShell>
  );
}
