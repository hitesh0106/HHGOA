"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SiteNavProps {
  className?: string;
}

/**
 * Minimal sticky nav with official Hacker House Goa logo on the left
 * and dark-contrast 2:47 PM STUDIO badge on the top right.
 */
export function SiteNav({ className }: SiteNavProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.location ? window.scrollY > 16 : false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#FCF9F2]/90 backdrop-blur-md border-b-2 border-[#1c3529] shadow-[0_4px_12px_rgba(28,53,41,0.08)]"
          : "bg-[#FCF9F2]/60 backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto flex h-16 sm:h-20 max-w-6xl items-center justify-between px-4 sm:px-8">
        {/* Official Hacker House Goa Logo */}
        <a
          href="#studio"
          className="group flex items-center gap-2.5 sm:gap-3 rounded-full px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a726]"
          aria-label="HH Goa 2026 Builder Generator — home"
        >
          <span className="relative grid h-9 w-9 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-xl border-2 border-[#1c3529] shadow-[2px_2px_0px_#d9a726] transition-transform duration-300 group-hover:-rotate-6">
            <img
              src="/hh-logo.png"
              alt="Hacker House Goa"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-base sm:text-lg tracking-wide text-[#1c3529] font-black">
              HH Goa <span className="text-[#e04b77]">2026</span>
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c3529]/70 mt-0.5">
              Builder Studio
            </span>
          </span>
        </a>

        {/* Top Right: High-Contrast Dark Badge for 2:47 PM STUDIO */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border-2 border-[#1c3529] bg-[#1c3529] px-2.5 sm:px-3.5 py-1.5 shadow-[2px_2px_0px_#d9a726] transition-transform duration-200 hover:scale-105">
            <img
              src="/studio-badge.png"
              alt="2:47 PM STUDIO"
              className="h-6 sm:h-8 w-auto object-contain brightness-125 contrast-125 filter"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
