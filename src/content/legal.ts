export const legal = {
  privacy: {
    title: "Privacy",
    lastUpdated: "2026-05-12",
    intro:
      "Fin & Stem is a reference site. This page describes what data we collect, why, and what your rights are.",
    sections: [
      {
        heading: "What we collect",
        body: "Pageview-level analytics that don't set tracking cookies, and any details you submit through the contact form. We don't require an account, we don't track you across sessions, and we don't sell, rent, or share your data with third parties.",
      },
      {
        heading: "Analytics",
        body: "We default to cookieless analytics (Vercel Web Analytics, Plausible, or Cloudflare Web Analytics). If we ever add Google Analytics or another cookie-based tool, it sits behind explicit opt-in via a consent banner and does not load until you accept.",
      },
      {
        heading: "Contact form",
        body: "Form submissions go to our email — only to reply to you. We don't add you to any list automatically, and we delete inquiries 12 months after the last reply.",
      },
      {
        heading: "Your rights",
        body: "You can request access to, correction of, or deletion of any data we hold by writing to mikee@dsg.co.za — we'll process it within 14 days. POPIA (South Africa) and GDPR (EU) rights apply where you live.",
      },
      {
        heading: "Cookies",
        body: "We don't set any tracking cookies. Essential cookies (e.g. a session cookie if a future feature requires one) are disclosed here at the point of introduction.",
      },
      {
        heading: "Affiliate disclosure",
        body: "If equipment pages include affiliate links in future, they will be flagged inline and disclosed on every page they appear. The price you pay is unaffected.",
      },
      {
        heading: "Changes",
        body: "If we materially change what we collect, we'll update the last-reviewed date at the top of this page.",
      },
      {
        heading: "Contact",
        body: "Privacy questions go to mikee@dsg.co.za.",
      },
    ],
  },
  terms: {
    title: "Terms",
    lastUpdated: "2026-05-12",
    intro:
      "By using this site you agree to the following. Deliberately short — we don't want to hide anything behind boilerplate.",
    sections: [
      {
        heading: "About the site",
        body: "Fin & Stem is an informational reference site for the planted freshwater aquarium. Content is provided as-is for hobbyist use.",
      },
      {
        heading: "Accuracy",
        body: "We work hard to be accurate. Care numbers (temperature, pH, hardness, tank size, group size) are based on the sources we cite and our own experience. They are working ranges, not guarantees. Use judgement, observe your tank, and consult a vet for anything medical.",
      },
      {
        heading: "Trademarks & brands",
        body: "Manufacturer and product names referenced on the site (Tropica, ADA, Chihiros, Twinstar, Eheim, Oase, Fluval, etc.) are the trademarks of their respective owners and used here only to identify the products being discussed.",
      },
      {
        heading: "Open data & licensing",
        body: "Some data and imagery is drawn from open sources — FishBase, GBIF, Wikidata, Wikimedia Commons — and used under their respective licenses (typically CC0, CC-BY, CC-BY-SA). Attribution is rendered alongside each image. Original photography, writing, and the database structure itself are © Fin & Stem.",
      },
      {
        heading: "Affiliate links",
        body: "Where active, affiliate links are disclosed on every page that uses them. We only recommend products we'd use ourselves. We may earn a commission at no cost to you.",
      },
      {
        heading: "User-generated content",
        body: "Comments, submitted photos, and similar user-generated features are not currently enabled. If they launch in future, content guidelines will be published here first.",
      },
      {
        heading: "Liability",
        body: "To the extent permitted by law, Fin & Stem is not liable for losses arising from following advice on the site. Aquascaping involves live animals; you accept responsibility for their welfare.",
      },
      {
        heading: "Governing law",
        body: "South African law applies to these terms. Disputes are heard in the courts of South Africa unless otherwise required by your local consumer-protection laws.",
      },
      {
        heading: "Changes",
        body: "We may update these terms. Material changes will be reflected in the last-reviewed date at the top of the page.",
      },
    ],
  },
} as const;
