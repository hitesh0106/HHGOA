"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PalmFrond, PalmLeaf, TropicalSun, Sparkle, MonsteraLeaf } from "./tropical";

interface FloatingDecorationsProps {
  className?: string;
  /** Render the bigger hero-sized fronds. */
  hero?: boolean;
  /** Reduced motion safe mode. */
  reduced?: boolean;
}

/**
 * Ambient floating tropical elements positioned around the page. Purely
 * decorative (aria-hidden). Each element has its own subtle animation so
 * the composition never feels static.
 */
export function FloatingDecorations({
  className,
  hero = false,
  reduced = false,
}: FloatingDecorationsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {/* Top-left big palm frond */}
      <motion.div
        className="absolute -left-10 -top-10 sm:-left-20 sm:-top-16"
        initial={{ opacity: 0, rotate: -20 }}
        animate={
          reduced
            ? { opacity: 0.7, rotate: -12 }
            : {
                opacity: 0.85,
                rotate: -12,
                y: [0, -16, 0],
              }
        }
        transition={
          reduced
            ? { duration: 0.6 }
            : {
                opacity: { duration: 0.8 },
                rotate: { duration: 0.8 },
                y: {
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      >
        <PalmFrond
          className={cn(
            "text-emerald-soft drop-shadow-[0_8px_24px_oklch(0.42_0.11_165/0.18)]",
            hero ? "w-64 sm:w-80 md:w-96" : "w-48 sm:w-56"
          )}
        />
      </motion.div>

      {/* Top-right medium palm leaf */}
      <motion.div
        className="absolute right-0 top-8 sm:right-8"
        initial={{ opacity: 0, rotate: 30 }}
        animate={
          reduced
            ? { opacity: 0.6, rotate: 24 }
            : {
                opacity: 0.7,
                rotate: 24,
                y: [0, -12, 0],
              }
        }
        transition={
          reduced
            ? { duration: 0.6 }
            : {
                opacity: { duration: 0.8 },
                rotate: { duration: 0.8 },
                y: {
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                },
              }
        }
      >
        <PalmLeaf
          className={cn(
            "text-emerald drop-shadow-[0_8px_24px_oklch(0.42_0.11_165/0.18)]",
            hero ? "w-32 sm:w-40" : "w-20 sm:w-28"
          )}
        />
      </motion.div>

      {/* Bottom-right big monstera leaf */}
      <motion.div
        className="absolute -bottom-12 -right-12 sm:-bottom-16 sm:-right-16"
        initial={{ opacity: 0, rotate: 18 }}
        animate={
          reduced
            ? { opacity: 0.55, rotate: 14 }
            : {
                opacity: 0.6,
                rotate: 14,
                y: [0, -10, 0],
              }
        }
        transition={
          reduced
            ? { duration: 0.6 }
            : {
                opacity: { duration: 0.8 },
                rotate: { duration: 0.8 },
                y: {
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                },
              }
        }
      >
        <MonsteraLeaf
          className={cn(
            "text-emerald drop-shadow-[0_8px_24px_oklch(0.42_0.11_165/0.18)]",
            hero ? "w-48 sm:w-64" : "w-32 sm:w-40"
          )}
        />
      </motion.div>

      {/* Bottom-left small palm frond */}
      <motion.div
        className="absolute -bottom-8 left-4 sm:left-8"
        initial={{ opacity: 0, rotate: 200 }}
        animate={
          reduced
            ? { opacity: 0.4, rotate: 195 }
            : {
                opacity: 0.45,
                rotate: 195,
                y: [0, -8, 0],
              }
        }
        transition={
          reduced
            ? { duration: 0.6 }
            : {
                opacity: { duration: 0.8 },
                rotate: { duration: 0.8 },
                y: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                },
              }
        }
      >
        <PalmFrond className="w-32 sm:w-40 text-emerald-deep opacity-50" />
      </motion.div>

      {/* Floating sun in upper right */}
      <motion.div
        className="absolute right-1/4 top-1/3 hidden md:block"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={
          reduced
            ? { opacity: 0.4, scale: 0.9 }
            : {
                opacity: 0.45,
                scale: 0.9,
                y: [0, -8, 0],
              }
        }
        transition={
          reduced
            ? { duration: 0.6 }
            : {
                opacity: { duration: 0.8 },
                scale: { duration: 0.8 },
                y: {
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      >
        <TropicalSun className="w-28 lg:w-36" />
      </motion.div>

      {/* Sparkles */}
      <motion.span
        className="absolute left-[20%] top-[18%] text-gold"
        initial={{ opacity: 0, scale: 0 }}
        animate={
          reduced
            ? { opacity: 0.7, scale: 1 }
            : {
                opacity: [0, 0.9, 0],
                scale: [0, 1, 0.6],
              }
        }
        transition={
          reduced
            ? { duration: 0.5 }
            : {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <Sparkle className="w-3 h-3" />
      </motion.span>
      <motion.span
        className="absolute right-[18%] top-[60%] text-coral"
        initial={{ opacity: 0, scale: 0 }}
        animate={
          reduced
            ? { opacity: 0.7, scale: 1 }
            : {
                opacity: [0, 0.8, 0],
                scale: [0, 1.1, 0.5],
              }
        }
        transition={
          reduced
            ? { duration: 0.5 }
            : {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }
        }
      >
        <Sparkle className="w-4 h-4" />
      </motion.span>
      <motion.span
        className="absolute left-[60%] top-[28%] text-emerald-soft"
        initial={{ opacity: 0, scale: 0 }}
        animate={
          reduced
            ? { opacity: 0.7, scale: 1 }
            : {
                opacity: [0, 0.7, 0],
                scale: [0, 0.9, 0.4],
              }
        }
        transition={
          reduced
            ? { duration: 0.5 }
            : {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }
        }
      >
        <Sparkle className="w-2.5 h-2.5" />
      </motion.span>
    </div>
  );
}
