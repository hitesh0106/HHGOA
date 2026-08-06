"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";
import { FloatingDecorations } from "@/components/decor/floating-decorations";
import { SandWave } from "@/components/decor/tropical";
import { MOTION } from "@/constants";

interface HeroProps {
  onStart: () => void;
}

/**
 * Hero section: large serif heading, subtitle, single primary CTA, decorative
 * floating palms. Designed mobile-first. Drops straight into the studio —
 * no marketing sections, no extra CTAs.
 */
export function Hero({ onStart }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-mesh-tropical"
      aria-label="HH Goa 2026 Builder Identity Generator"
    >
      <FloatingDecorations hero />

      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8 md:py-28">
        {/* Edition chip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: MOTION.ease }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-deep backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          Builders · Goa · 2026
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: MOTION.ease, delay: 0.08 }}
          className="mt-7 max-w-4xl font-serif text-5xl leading-[1.02] tracking-tight text-emerald-deep sm:text-6xl md:text-7xl lg:text-[88px]"
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
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
        >
          Upload your photo and create your Builder Identity in seconds. Choose a
          circular <span className="font-medium text-emerald-deep">Profile Frame</span> or a
          premium <span className="font-medium text-emerald-deep">Builder ID card</span>,
          styled with an original tropical palette.
        </motion.p>

        {/* CTA — single, focused */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: MOTION.ease, delay: 0.28 }}
          className="mt-9"
        >
          <motion.button
            type="button"
            onClick={onStart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={MOTION.spring}
            className="group relative inline-flex h-14 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-emerald to-emerald-deep px-8 text-base font-semibold text-ivory shadow-tropical-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, oklch(0.83 0.16 85 / 0.35) 0%, transparent 60%)",
              }}
            />
            <Sparkles className="relative h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="relative">Upload Photo & Build</span>
            <ArrowRight className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-soft" />
            100+ Builder Titles
          </span>
          <span className="hidden h-3 w-px bg-border sm:inline-block" />
          <span>1080 × 1080 retina PNG</span>
          <span className="hidden h-3 w-px bg-border sm:inline-block" />
          <span>No login · No upload · Local only</span>
        </motion.div>
      </div>

      <SandWave className="absolute bottom-0 left-0 h-10 w-full text-emerald-soft" />
    </section>
  );
}
