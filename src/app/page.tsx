import { home } from "@/content/home";
import { fish, plants, shrimp, mosses } from "@/data";
import { atmosphere } from "@/data/atmosphere";
import { Hero } from "@/components/sections/hero";
import { Pillars } from "@/components/sections/pillars";
import { FeaturedEntries } from "@/components/sections/featured-entries";
import { Ethos } from "@/components/sections/ethos";
import { Faq } from "@/components/sections/faq";

export default function Page() {
  const total = fish.length + plants.length + shrimp.length + mosses.length;
  return (
    <>
      <Hero
        eyebrow={home.hero.eyebrow}
        title={home.hero.title}
        subtitle={home.hero.subtitle}
        primaryCta={home.hero.primaryCta}
        secondaryCta={home.hero.secondaryCta}
        backgroundImage={atmosphere.aquascapeWide}
        stats={[
          {
            value: total.toString(),
            label: "Species profiled across four pillars",
          },
          {
            value: "4",
            label: "Pillars — fish · plants · shrimp · mosses",
          },
          {
            value: "Free",
            label: "No paywall, no signup, no ads",
          },
        ]}
      />
      <Pillars {...home.pillars} />
      <FeaturedEntries />
      <Ethos {...home.ethos} />
      <Faq {...home.faq} />
    </>
  );
}
