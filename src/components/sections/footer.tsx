"use client";

import * as React from "react";
import { TreePalm } from "lucide-react";
import { APP_CONFIG } from "@/constants";

interface FooterProps {
  onReset?: () => void;
  className?: string;
}

/**
 * Premium minimal footer — Apple / Linear / Vercel inspired.
 *
 * Layout:
 *   Left:  🌴 © 2026 HH-GOA. ALL RIGHTS RESERVED.
 *   Right: HHGOA.COM · #FrameInGoa
 *
 * Font: IBM Plex Mono · 14px · uppercase · 0.08em tracking
 * Background: dark forest green (#0F4A3A)
 * Height: 72-80px · thin top border
 * Mobile: stacks vertically with proper spacing.
 */
export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={`w-full shrink-0 border-t-2 border-[#1c3529] bg-[#0F4A3A] ${className ?? ""}`}
      style={{ minHeight: 72 }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] flex-col items-center justify-center gap-3 px-8 py-4 sm:flex-row sm:justify-between sm:px-12 md:h-[80px]">
        {/* Left section */}
        <div className="flex items-center gap-2.5">
          <TreePalm
            className="h-4 w-4 shrink-0 text-[#FFC83D]"
            strokeWidth={2}
            aria-hidden="true"
          />
          <span
            className="font-mono text-[13px] uppercase leading-none tracking-[0.08em] text-white/75 sm:text-sm"
            style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
          >
            © 2026 HH-GOA. ALL RIGHTS RESERVED.
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <a
            href="https://hhgoa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[13px] uppercase leading-none tracking-[0.08em] text-white/75 transition-colors hover:text-white sm:text-sm"
            style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
          >
            HHGOA.COM
          </a>
          <span
            className="hidden h-3 w-px bg-white/20 sm:inline-block"
            aria-hidden="true"
          />
          <span
            className="font-mono text-[13px] uppercase leading-none tracking-[0.08em] text-[#FFC83D] sm:text-sm"
            style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
          >
            #{APP_CONFIG.hashtag}
          </span>
        </div>
      </div>
    </footer>
  );
}
