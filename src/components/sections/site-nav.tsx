"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkle, Github, Twitter, Menu, X } from "lucide-react";
import { APP_CONFIG } from "@/constants";
import { cn } from "@/lib/utils";

interface SiteNavProps {
  onStart: () => void;
  className?: string;
}

/**
 * Sticky glassy top nav. Brand mark + primary CTA only — the page is
 * intentionally lean (just the generator), so there are no section links.
 */
export function SiteNav({ onStart, className }: SiteNavProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
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

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href={`https://twitter.com/${APP_CONFIG.twitterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow on X"
            className="grid h-9 w-9 place-items-center rounded-full text-emerald-deep/80 transition-colors hover:bg-emerald/8 hover:text-emerald-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href="https://hhgoa.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View inspiration source"
            className="grid h-9 w-9 place-items-center rounded-full text-emerald-deep/80 transition-colors hover:bg-emerald/8 hover:text-emerald-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Github className="h-4 w-4" />
          </a>
          <motion.button
            type="button"
            onClick={onStart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="ml-1 inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-br from-emerald to-emerald-deep px-4 text-sm font-semibold text-ivory shadow-tropical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            <Sparkle className="h-3.5 w-3.5" />
            Build yours
          </motion.button>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-full text-emerald-deep transition-colors hover:bg-emerald/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden"
          >
            <div className="glass-tropical border-t border-emerald/10 px-5 py-4">
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onStart();
                  }}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald to-emerald-deep px-4 text-sm font-semibold text-ivory shadow-tropical"
                >
                  <Sparkle className="h-4 w-4" />
                  Build yours
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
