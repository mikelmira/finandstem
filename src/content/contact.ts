export const contact = {
  hero: {
    eyebrow: "Contact",
    title: "Get in touch.",
    subtitle:
      "Spotted a wrong number? Have a species we should add? Run a shop or brand and want to talk? Three ways below.",
  },
  feedback: {
    eyebrow: "Catalogue feedback",
    title: "Found an error or a gap.",
    body: "Care numbers are working ranges based on the sources we cite — but real tanks beat documentation. If something here doesn't match your experience, or there's a species you'd like profiled, tell us. We'd rather be corrected than wrong.",
    fields: {
      name: { label: "Name", placeholder: "Your name" },
      email: { label: "Email", placeholder: "you@email.com" },
      organisation: {
        label: "Tank context (optional)",
        placeholder: 'e.g. "60L low-tech, 6 months running"',
      },
      topic: {
        label: "What kind of feedback?",
        options: ["Care correction", "Species request", "Other"],
      },
      message: {
        label: "Details",
        placeholder:
          "What did you see, what does your tank suggest, and where would you point us to verify?",
      },
    },
    submitLabel: "Send feedback",
  },
  partnership: {
    eyebrow: "Partnership / press",
    title: "Brand, shop, supplier, or media.",
    body: "We're selective. Sponsored content fits if it's something we'd already recommend. Affiliate relationships are open with most major hobby brands. Press / interviews welcome — we'll be candid about what we do and don't know.",
    fields: {
      name: { label: "Name", placeholder: "Olivia Rhye" },
      email: { label: "Email", placeholder: "olivia@brand.com" },
      organisation: { label: "Organisation", placeholder: "Brand or publication" },
      topic: {
        label: "What's this about?",
        options: ["Partnership", "Press / interview", "Other"],
      },
      message: {
        label: "Message",
        placeholder: "A few sentences on what you have in mind.",
      },
    },
    submitLabel: "Send",
  },
  direct: {
    eyebrow: "Direct",
    title: "Or just email.",
    body: "If forms aren't your thing, write directly. We read everything.",
    email: "mikee@dsg.co.za",
  },
} as const;
