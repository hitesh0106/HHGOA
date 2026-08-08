"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { FloatingDecorations } from "@/components/decor/floating-decorations";
import { SandWave } from "@/components/decor/tropical";
import { MOTION } from "@/constants";

/**
 * Calm, premium hero — Apple "less is more" philosophy.
 *
 * Contains ONLY:
 *   · Large heading
 *   · Short subtitle
 *
 * No edition chip, no CTA button, no meta row, no marketing badges.
 * The upload area + form live in the Studio section below.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-mesh-tropical"
      aria-label="HH Goa 2026 Builder Identity Generator"
    >
      <FloatingDecorations hero />

      <div className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8 md:py-32">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: MOTION.ease, delay: 0.08 }}
          className="max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight text-emerald-deep sm:text-6xl md:text-7xl"
          style={{ fontWeight: 600 }}
        >
          HH Goa 2026
          <br />
          <span className="text-gradient-tropical">Builder Identity</span>{" "}
          <span className="text-gradient-gold">Generator</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: MOTION.ease, delay: 0.18 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Upload a photo and generate your Builder ID in seconds.
        </motion.p>
      </div>

      <SandWave className="absolute bottom-0 left-0 h-10 w-full text-emerald-soft" />
    </section>
  );
}
