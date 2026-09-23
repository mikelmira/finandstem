import type { GearProduct } from "@/types/gear";
import { GEAR_CATEGORIES } from "@/lib/gear/categories";
import { fieldRange, formatNumber } from "@/lib/gear/fields";
import { recommendedFlow } from "@/lib/gear/match";

/**
 * Product FAQs built from the product's own data, so every answer is a
 * fact we actually hold. Generic questions only appear when the data can
 * answer them.
 */
export function gearFaqs(
  p: GearProduct,
  alternatives: ReadonlyArray<GearProduct>,
): { question: string; answer: string }[] {
  const meta = GEAR_CATEGORIES[p.category];
  const title = `${p.brand} ${p.name}`;
  const out: { question: string; answer: string }[] = [];
  const models = p.models;
  const tank = fieldRange(models, "tankMaxL");
  const flow = fieldRange(models, "flowLph");

  if (p.category === "filters" && flow) {
    const best = models
      .filter((m) => m.flowLph)
      .map((m) => {
        const f = m.flowLph as number;
        return `${m.name} (${formatNumber(f)} L/h, suits roughly ${formatNumber(Math.round(f / 12))}–${formatNumber(Math.round(f / 5))} L)`;
      });
    out.push({
      question: `What size tank is the ${title} good for?`,
      answer: `Using the 5 to 12 times turnover rule for planted tanks: ${best.join("; ")}.${tank ? ` The maker rates the range for tanks up to ${formatNumber(tank.max)} L.` : ""} Real flow with media and hoses is lower than the rated figure, so pick the bigger model if you are between sizes.`,
    });
  } else if (tank) {
    out.push({
      question: `What size tank is the ${title} for?`,
      answer:
        models.length > 1
          ? `The maker rates it by model: ${models
              .filter((m) => m.tankMaxL)
              .map((m) => `${m.name} up to ${formatNumber(m.tankMaxL as number)} L`)
              .join(", ")}.`
          : `The maker rates it for tanks up to ${formatNumber(tank.max)} L${models[0].tankMinL ? ` (from ${formatNumber(models[0].tankMinL)} L)` : ""}.`,
    });
  }

  if (p.category === "lights") {
    const fits = models.filter((m) => m.fitsLengthMinCm || m.fitsLengthMaxCm);
    if (fits.length) {
      out.push({
        question: `What size tank does the ${title} fit?`,
        answer: `It comes in ${fits.length === 1 ? "one size" : `${fits.length} sizes`}: ${fits
          .map((m) => {
            const a = m.fitsLengthMinCm ?? m.fitsLengthMaxCm;
            const b = m.fitsLengthMaxCm ?? m.fitsLengthMinCm;
            return `${m.name} for ${a === b ? `${a} cm` : `${a}–${b} cm`} tanks`;
          })
          .join(", ")}. Choose the one that matches your tank length.`,
      });
    }
    const watts = fieldRange(models, "powerW");
    if (watts) {
      out.push({
        question: `How much power does the ${title} use?`,
        answer:
          watts.min === watts.max
            ? `About ${formatNumber(watts.min)} W at full output.`
            : `From about ${formatNumber(watts.min)} W on the smallest model to ${formatNumber(watts.max)} W on the largest, at full output. Most planted tanks run lights below full power.`,
      });
    }
  }

  if (p.category === "heaters") {
    const w = fieldRange(models, "heaterW");
    if (w) {
      out.push({
        question: `What wattage is the ${title}?`,
        answer: `${w.min === w.max ? `${formatNumber(w.min)} W` : `${formatNumber(w.min)} to ${formatNumber(w.max)} W across the range`}. As a rule of thumb that covers roughly ${formatNumber(Math.round(w.min / 1.5))}–${formatNumber(w.max)} L in a normally heated room, at about 1 W per litre.`,
      });
    }
  }

  if (p.category === "aquariums") {
    const vol = fieldRange(models, "volumeL");
    if (vol) {
      out.push({
        question: `How many litres is the ${title}?`,
        answer: `${models
          .filter((m) => m.volumeL)
          .map((m) => `${m.name}: ${formatNumber(m.volumeL as number)} L`)
          .join(", ")}. Expect about 15 to 20 percent less water once substrate and hardscape are in.`,
      });
      const mid = models.find((m) => m.volumeL) ?? models[0];
      if (mid.volumeL) {
        const f = recommendedFlow(mid.volumeL);
        out.push({
          question: `What filter do I need for the ${title}?`,
          answer: `For the ${mid.name} (${formatNumber(mid.volumeL)} L), look for a filter rated at roughly ${f.min}–${f.max} L/h. Our filter matcher lists the ones that fit.`,
        });
      }
    }
  }

  if (p.category === "hardscape") {
    const effect = p.specs["Effect on water"];
    if (effect) {
      out.push({
        question: `Does ${p.name} affect water chemistry?`,
        answer: `${effect}.`.replace(/\.\.$/, "."),
      });
    }
    const prep = p.specs["Prep"];
    if (prep) {
      out.push({ question: `How do I prepare ${p.name} before use?`, answer: prep });
    }
  }

  out.push({
    question: `Who is the ${title} best for?`,
    answer: p.bestFor || p.summary,
  });
  if (p.watchOut) {
    out.push({
      question: `Is there anything to watch out for with the ${title}?`,
      answer: p.watchOut,
    });
  }
  if (alternatives.length) {
    out.push({
      question: `What are the alternatives to the ${title}?`,
      answer: `Other ${meta.label.toLowerCase()} worth comparing: ${alternatives
        .map((a) => `${a.brand} ${a.name}`)
        .join(", ")}. Add any of them to the compare table to see the specs side by side.`,
    });
  }
  if (out.length < 4 && models.length > 1) {
    out.push({
      question: `What sizes does the ${title} come in?`,
      answer: `${models.length} options: ${models.map((m) => m.name).join(", ")}.`,
    });
  }
  if (out.length < 4) {
    out.push({
      question: `How do I compare the ${title} with similar products?`,
      answer: `Tap Compare on this page and on any other ${meta.singular} you are considering, then open the compare table. It lines up every published spec side by side and lets you pick the size of each product.`,
    });
  }
  if (out.length < 4) {
    out.push({
      question: `Where do these ${title} specs come from?`,
      answer:
        p.specSource === "manufacturer"
          ? "From the maker's published specifications. Makers revise products, so confirm on the product page before buying."
          : p.specSource === "retailer"
            ? `From ${p.sourceName ?? "a major retailer"}'s listing, cross-checked where we could. Confirm current figures before buying.`
            : "From the maker's widely published figures. Confirm current specs before buying.",
    });
  }
  return out;
}
