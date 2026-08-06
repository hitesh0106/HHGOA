"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Zap, Smartphone, UserX, Download, type LucideIcon } from "lucide-react";
import { FEATURES, MOTION } from "@/constants";

const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  smartphone: Smartphone,
  "user-x": UserX,
  download: Download,
};

interface FeaturesProps {
  className?: string;
}

/**
 * Feature grid with 4 cards: Fast, Mobile Friendly, No Login, Instant Download.
 */
export function Features({ className }: FeaturesProps) {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className={className}
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
            Built for builders
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: MOTION.ease, delay: 0.05 }}
            className="mt-3 font-serif text-3xl tracking-tight text-emerald-deep sm:text-4xl md:text-5xl"
            style={{ fontWeight: 600 }}
            id="features-heading"
          >
            Why you'll actually use it
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: MOTION.ease, delay: 0.1 }}
            className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Every interaction was designed for the moment you decide to ship —
            fast, mobile-first, and respectful of your time and data.
          </motion.p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => {
            const Icon = ICONS[feature.icon] ?? Zap;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: MOTION.ease, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl border border-emerald/12 bg-card p-6 shadow-tropical transition-all hover:shadow-tropical-lg"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-gold/30 via-coral-soft/20 to-emerald-soft/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep text-ivory shadow-tropical transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-emerald-deep">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
