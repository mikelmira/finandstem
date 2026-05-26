import type { Metadata } from "next";
import { legal } from "@/content/legal";
import { LegalSection } from "@/components/sections/legal-section";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Fin & Stem site terms — accuracy, trademarks, open data licensing, and liability.",
};

export default function TermsPage() {
  return (
    <LegalSection
      {...legal.terms}
      breadcrumb={[{ label: "Legal" }, { label: "Terms" }]}
    />
  );
}
