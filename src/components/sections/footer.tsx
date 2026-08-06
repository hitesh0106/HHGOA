"use client";

import * as React from "react";
import { Sparkle } from "lucide-react";
import { APP_CONFIG } from "@/constants";
import { SandWave } from "@/components/decor/tropical";

interface FooterProps {
  onReset?: () => void;
  className?: string;
}

/**
 * Minimal tropical footer — three lines only:
 *  · 2026 HH-GOA. ALL RIGHTS RESERVED.
 *  · HHGOA.COM
 *  · #FrameInGoa
 */
export function Footer({ onReset, className }: FooterProps) {
  return (
    <footer
      className={`relative isolate mt-auto overflow-hidden bg-emerald-deep text-ivory ${className ?? ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.985 0.012 90) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center sm:px-8 sm:py-12">
        {/* Brand mark */}
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-gold to-gold-deep text-emerald-deep shadow-gold-glow">
          <Sparkle className="h-4 w-4" />
        </span>

        {/* Three lines */}
        <div className="flex flex-col items-center gap-2 font-sans text-sm tracking-[0.18em] uppercase text-ivory/80">
          <p className="font-medium">
            2026 HH-GOA. ALL RIGHTS RESERVED.
          </p>
          <a
            href="https://hhgoa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-base tracking-wide text-gold transition-colors hover:text-gold-soft"
          >
            HHGOA.COM
          </a>
          <p className="font-medium text-gold">#{APP_CONFIG.hashtag}</p>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-2 text-xs text-ivory/50 transition-colors hover:text-coral"
          >
            Clear saved data
          </button>
        )}
      </div>

      <SandWave className="absolute -top-px left-0 h-8 w-full text-ivory opacity-20" />
    </footer>
  );
}
