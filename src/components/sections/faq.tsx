import { SectionShell, SectionHeading } from "@/components/sections/section-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqProps {
  eyebrow: string;
  title: string;
  items: ReadonlyArray<{ q: string; a: string }>;
}

export function Faq({ eyebrow, title, items }: FaqProps) {
  return (
    <SectionShell className="relative isolate border-t border-border/60">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="glass glass-edge rounded-2xl px-6 sm:px-8">
          <Accordion className="w-full">
            {items.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className="border-b border-border/50 last:border-b-0"
              >
                <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline sm:text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </SectionShell>
  );
}
