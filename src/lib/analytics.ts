/**
 * Placeholder analytics helper. The real wiring lands at milestone M4, see
 * docs/TRACKING_PLAN.md. No provider SDKs are pulled in yet on purpose, so
 * the proposal site stays light and we don't ship cookies pre-consent.
 */

export type AnalyticsEvent =
  | { name: "signup_submit"; source: "hero" | "footer" | "contact" }
  | { name: "contact_submit"; topic: "partnership" | "press" | "other" }
  | { name: "section_view"; section: string }
  | { name: "outbound_click"; href: string }
  | { name: "cta_click"; cta: string; section: string };

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") {

    console.debug("[analytics:placeholder]", event);
  }
  // Real provider call goes here in M4 (Vercel Analytics / GA4 / Plausible).
}
