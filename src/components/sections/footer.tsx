"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart, Github, Twitter, Sparkle } from "lucide-react";
import { APP_CONFIG } from "@/constants";
import { PalmFrond, SandWave } from "@/components/decor/tropical";

interface FooterProps {
  onReset?: () => void;
  className?: string;
}

/**
 * Sticky-pinned tropical footer. Includes edition mark, links and a
 * subtle "Built with care" credit. No external network calls.
 */
export function Footer({ onReset, className }: FooterProps) {
  return (
    <footer
      className={`relative isolate mt-auto overflow-hidden bg-emerald-deep text-ivory ${className ?? ""}`}
    >
      <PalmFrond
        className="absolute -left-16 -top-16 w-72 text-emerald opacity-50"
        style={{ transform: "rotate(-20deg)" }}
      />
      <PalmFrond
        className="absolute -right-16 -bottom-16 w-72 text-emerald opacity-40"
        style={{ transform: "rotate(160deg)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.985 0.012 90) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand block */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-gold to-gold-deep text-emerald-deep shadow-gold-glow">
                <Sparkle className="h-4 w-4" />
              </span>
              <div>
                <p className="font-serif text-lg tracking-wide">
                  HH Goa 2026
                </p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/60">
                  Builder Identity Studio
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70">
              An independent Builder Identity generator inspired by the HH Goa
              2026 builder/hacker/startup festival mood. The palette, layout,
              illustration style and typography are original creations made for
              this project — not affiliated with any official HH Goa property.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                Build
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ivory/80">
                <li>
                  <a
                    href="#hero"
                    className="transition-colors hover:text-gold"
                  >
                    Upload Photo
                  </a>
                </li>
                <li>
                  <a
                    href="#studio"
                    className="transition-colors hover:text-gold"
                  >
                    Open Studio
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                Connect
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ivory/80">
                <li>
                  <a
                    href={`https://twitter.com/${APP_CONFIG.twitterHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                  >
                    <Twitter className="h-3.5 w-3.5" />
                    Follow on X
                  </a>
                </li>
                <li>
                  <a
                    href="https://hhgoa.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Inspiration
                  </a>
                </li>
                {onReset && (
                  <li>
                    <button
                      type="button"
                      onClick={onReset}
                      className="inline-flex items-center gap-2 text-ivory/60 transition-colors hover:text-coral"
                    >
                      Clear saved data
                    </button>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                Edition
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ivory/80">
                <li>Goa · 2026</li>
                <li>1080 × 1080 PNG</li>
                <li>{APP_CONFIG.hashtag}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ivory/10 pt-6 text-xs text-ivory/60 sm:flex-row">
          <p className="inline-flex items-center gap-1.5">
            Built with
            <Heart className="h-3 w-3 fill-coral text-coral" />
            for the builder community · 100% client-side
          </p>
          <p>
            © {new Date().getFullYear()} HH Goa Builder Studio · Independent
            project
          </p>
        </div>
      </div>

      <SandWave className="absolute -top-px left-0 h-8 w-full text-ivory opacity-20" />
    </footer>
  );
}
