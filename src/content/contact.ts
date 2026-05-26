export const contact = {
  hero: {
    eyebrow: "Contact",
    title: "Help make Fin & Stem better.",
    subtitle:
      "Spotted a wrong number? Have a species we should add? Run a shop or a community and want to collaborate? The catalogue gets stronger every time an aquascaper writes in — three ways below.",
  },
  feedback: {
    eyebrow: "Catalogue feedback",
    title: "Found an error or a gap.",
    body: "Care numbers are working ranges based on the sources we cite — but real tanks beat documentation. If something here doesn't match what you see in your own tank, or there's a species we should profile, tell us. Corrections from aquascapers anywhere in the world are how this reference improves.",
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
    body: "Fin & Stem partners with people who share the same care for the underwater world — shops who treat livestock properly, growers who put plant health first, photographers, biologists, and journalists. Tell us what you have in mind and we'll be candid about whether it fits.",
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
    body: "If forms aren't your thing, write directly. Every email gets read, and corrections from real tanks always win against documentation.",
    email: "mikee@dsg.co.za",
  },
} as const;
