import type { Metadata } from "next";
import { legal } from "@/content/legal";
import { LegalSection } from "@/components/sections/legal-section";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What data Fin & Stem collects, how we use it, and your rights, including POPIA and GDPR.",
};

export default function PrivacyPage() {
  return (
    <LegalSection
      {...legal.privacy}
      breadcrumb={[{ label: "Legal" }, { label: "Privacy" }]}
    />
  );
}
