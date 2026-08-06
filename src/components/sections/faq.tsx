"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS, MOTION } from "@/constants";
import { Sparkle } from "@/components/decor/tropical";

interface FaqProps {
  className?: string;
}

/**
 * FAQ accordion. Single-open for focus. Each item is keyboard navigable
 * via the underlying Radix primitive.
 */
export function Faq({ className }: FaqProps) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className={className}
    >
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: MOTION.ease }}
            className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-emerald"
          >
            Questions
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: MOTION.ease, delay: 0.05 }}
            className="mt-3 font-serif text-3xl tracking-tight text-emerald-deep sm:text-4xl"
            style={{ fontWeight: 600 }}
            id="faq-heading"
          >
            Frequently asked
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: MOTION.ease, delay: 0.1 }}
          className="mt-10"
        >
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="w-full"
          >
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={`item-${i}`}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-emerald/12 bg-card px-5 shadow-tropical data-[state=open]:shadow-tropical-lg mb-3"
              >
                <AccordionTrigger className="text-left font-serif text-base text-emerald-deep hover:no-underline sm:text-lg">
                  <span className="flex items-center gap-3">
                    <Sparkle className="h-3.5 w-3.5 shrink-0 text-gold" />
                    {item.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
