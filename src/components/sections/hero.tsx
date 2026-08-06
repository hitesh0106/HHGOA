"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { FloatingDecorations } from "@/components/decor/floating-decorations";
import { SandWave, Sparkle as SparkleSvg } from "@/components/decor/tropical";
import { MOTION } from "@/constants";

interface HeroProps {
  onStart: () => void;
}

/**
 * Premium hero: large display heading, animated mesh gradient, parallax
 * floating decorations, scroll indicator. Mobile-first.
 */
export function Hero({ onStart }: HeroProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms — decorations drift at different rates.
  const decorY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const decorY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative isolate overflow-hidden bg-mesh-luxe"
      aria-label="HH Goa 2026 Builder ID Generator"
    >
      <FloatingDecorations hero />

      {/* Top-down parallax gold orb */}
      <motion.div
        aria-hidden
        style={{ y: decorY1 }}
        className="pointer-events-none absolute -top-32 right-1/3 h-72 w-72 rounded-full opacity-40 blur-3xl"
      >
        <div className="h-full w-full rounded-full bg-gradient-to-br from-gold/60 to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8 md:py-28"
      >
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
          HH Goa · 2026 · Builders Pass
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: MOTION.ease, delay: 0.08 }}
          className="mt-7 max-w-4xl font-display text-5xl leading-[1.02] tracking-tight text-emerald-deep sm:text-6xl md:text-7xl lg:text-[88px]"
          style={{ fontWeight: 700 }}
        >
          Build Your{" "}
          <span className="text-gradient-luxe">HH Goa</span>
          <br />
          <span className="text-gradient-gold">Builder ID</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: MOTION.ease, delay: 0.18 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
        >
          Upload a photo, pick your stack, and instantly generate a{" "}
          <span className="font-medium text-emerald-deep">premium event badge</span>{" "}
          with QR code, unique ID, and a random Builder Title. Download the PNG
          and share to <span className="font-medium text-emerald-deep">X</span> with{" "}
          <span className="font-medium text-emerald-deep">#FrameInGoa</span>.
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
            className="group relative inline-flex h-14 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-emerald to-emerald-deep px-8 text-base font-semibold text-ivory shadow-luxe-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, oklch(0.84 0.14 80 / 0.35) 0%, transparent 60%)",
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
            <SparkleSvg className="h-3 w-3 text-gold" />
            100+ Builder Titles
          </span>
          <span className="hidden h-3 w-px bg-border sm:inline-block" />
          <span>QR + Unique ID on every card</span>
          <span className="hidden h-3 w-px bg-border sm:inline-block" />
          <span>No login · No upload · Local only</span>
        </motion.div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.button
        type="button"
        onClick={onStart}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-emerald-deep/70 transition-colors hover:text-emerald-deep"
        aria-label="Scroll to studio"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Scroll to build
        </span>
        <span className="relative flex h-9 w-5 items-start justify-center rounded-full border-2 border-emerald-deep/40 p-1">
          <span className="animate-scroll-dot h-1.5 w-1.5 rounded-full bg-emerald-deep/70" />
        </span>
        <motion.span
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-3 w-3" />
        </motion.span>
      </motion.button>

      <SandWave className="absolute bottom-0 left-0 h-10 w-full text-emerald-soft" />
    </section>
  );
}
