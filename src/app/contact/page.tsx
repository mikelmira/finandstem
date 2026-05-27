import type { Metadata } from "next";
import { contact } from "@/content/contact";
import { atmosphere } from "@/data/atmosphere";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell, Eyebrow } from "@/components/sections/section-shell";
import { ContactForm } from "@/components/sections/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Catalogue feedback, partnership requests, or just email — three ways to get in touch with Fin & Stem.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        {...contact.hero}
        backgroundImage={atmosphere.dwarfGourami}
        breadcrumb={[{ label: "Contact" }]}
      />

      {/* Feedback */}
      <SectionShell className="border-t border-border/60">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="max-w-lg">
            <Eyebrow>{contact.feedback.eyebrow}</Eyebrow>
            <h2 className="text-display-tight mt-4 text-balance text-3xl sm:text-4xl">
              {contact.feedback.title}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              {contact.feedback.body}
            </p>
          </div>
          <ContactForm
            fields={contact.feedback.fields}
            submitLabel={contact.feedback.submitLabel}
          />
        </div>
      </SectionShell>

      {/* Partnership */}
      <SectionShell className="border-t border-border/60 bg-muted/30">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="max-w-lg">
            <Eyebrow>{contact.partnership.eyebrow}</Eyebrow>
            <h2 className="text-display-tight mt-4 text-balance text-3xl sm:text-4xl">
              {contact.partnership.title}
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              {contact.partnership.body}
            </p>
          </div>
          <ContactForm
            fields={contact.partnership.fields}
            submitLabel={contact.partnership.submitLabel}
          />
        </div>
      </SectionShell>

      {/* Other ways to reach us */}
      <SectionShell
        className="border-t border-border/60"
        containerClassName="max-w-3xl"
      >
        <Eyebrow>{contact.direct.eyebrow}</Eyebrow>
        <h2 className="text-display-tight mt-4 text-balance text-2xl sm:text-3xl">
          {contact.direct.title}
        </h2>
        <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
          {contact.direct.body}
        </p>
      </SectionShell>
    </>
  );
}
