"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { EXAMPLES, MOTION } from "@/constants";
import { Sparkle } from "@/components/decor/tropical";
import { cn } from "@/lib/utils";

interface ExamplesProps {
  className?: string;
}

/**
 * Examples section — shows what Builder ID cards look like in different
 * configurations. Purely visual (no real avatars; initials rendered with
 * tropical gradients).
 */
export function Examples({ className }: ExamplesProps) {
  return (
    <section
      id="examples"
      aria-labelledby="examples-heading"
      className={cn("relative overflow-hidden", className)}
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: MOTION.ease }}
            className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-emerald"
          >
            Builder identities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: MOTION.ease, delay: 0.05 }}
            className="mt-3 font-serif text-3xl tracking-tight text-emerald-deep sm:text-4xl md:text-5xl"
            style={{ fontWeight: 600 }}
            id="examples-heading"
          >
            Real builders, original titles
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: MOTION.ease, delay: 0.1 }}
            className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            A peek at the kind of Builder ID cards you can generate. Every title
            is pulled from a pool of 100+ originals — none copied, all hand-crafted
            for the HH Goa builder/hacker/startup vibe.
          </motion.p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLES.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: MOTION.ease, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border border-emerald/12 bg-card p-6 shadow-tropical transition-all hover:shadow-tropical-lg"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-gold/25 via-coral-soft/20 to-emerald-soft/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="relative flex items-center gap-4">
                <div
                  className={cn(
                    "grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br font-serif text-xl font-bold text-ivory shadow-tropical",
                    ex.gradient
                  )}
                >
                  {ex.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg text-emerald-deep">
                    {ex.name}
                  </p>
                  <p className="truncate text-xs uppercase tracking-wider text-muted-foreground">
                    {ex.role}
                  </p>
                </div>
                <Sparkle className="h-3.5 w-3.5 shrink-0 text-gold opacity-70 transition-opacity group-hover:opacity-100" />
              </div>

              <div className="relative mt-5 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-coral-soft/6 to-emerald-soft/6 px-4 py-3">
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-emerald">
                  Builder Title
                </p>
                <p className="mt-1 font-serif text-lg leading-tight text-emerald-deep">
                  {ex.builderTitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
