"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteNavProps {
  className?: string;
}

/**
 * Minimal sticky nav — logo only.
 * No social icons, no CTAs, no mobile menu.
 * Apple / Linear inspired.
 */
export function SiteNav({ className }: SiteNavProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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
          ? "glass-tropical border-b border-emerald/10 shadow-tropical"
          : "bg-transparent",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-8">
        {/* Logo only */}
        <a
          href="#hero"
          className="group flex items-center gap-2 rounded-full px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          aria-label="HH Goa 2026 Builder Generator — home"
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald to-emerald-deep text-ivory shadow-tropical transition-transform duration-300 group-hover:-rotate-6">
            <Sparkle className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-gold shadow-gold-glow" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-base tracking-wide text-emerald-deep">
              HH Goa <span className="text-gradient-gold">2026</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Builder Studio
            </span>
          </span>
        </a>
      </div>
    </motion.header>
  );
}
