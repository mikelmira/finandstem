import { home } from "@/content/home";
import { fish, plants, shrimp, mosses } from "@/data";
import { atmosphere } from "@/data/atmosphere";
import { Hero } from "@/components/sections/hero";
import { ScrollRevealText } from "@/components/sections/scroll-reveal-text";
import { Pillars } from "@/components/sections/pillars";
import { FeaturedEntries } from "@/components/sections/featured-entries";
import { Ethos } from "@/components/sections/ethos";
import { Faq } from "@/components/sections/faq";
import { ToolsBand } from "@/components/sections/tools-band";
import { JsonLd } from "@/components/seo/json-ld";
import { homePageJsonLd } from "@/lib/seo";

export default function Page() {
  const total = fish.length + plants.length + shrimp.length + mosses.length;
  return (
    <>
      <JsonLd data={homePageJsonLd()} id="home-jsonld" />
      <Hero
        eyebrow={home.hero.eyebrow}
        title={home.hero.title}
        primaryCta={{ label: "Plan a tank", href: "/planner" }}
        secondaryCta={{ label: "Browse catalogue", href: "/fish" }}
        backgroundImage={atmosphere.aquascapeWide}
        stats={[
          {
            value: total.toString(),
            label: "Species profiled across four pillars",
          },
          {
            value: "3",
            label: "Planning tools, Planner · Compare · Compatibility",
          },
        ]}
      />
      <ScrollRevealText
        eyebrow="What this is"
        text={home.hero.subtitle}
      />
      <Pillars {...home.pillars} />
      <ToolsBand />
      <FeaturedEntries />
      <Ethos {...home.ethos} />
      <Faq {...home.faq} />
    </>
  );
}
