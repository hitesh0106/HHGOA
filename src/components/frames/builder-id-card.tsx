"use client";

import * as React from "react";
import { cn, getInitials } from "@/lib/utils";
import { PalmFrond, Sparkle } from "@/components/decor/tropical";
import { MapPin, Waves, Trees } from "lucide-react";

interface BuilderIdCardProps {
  /** Cropped square avatar data URL. */
  avatarUrl: string | null;
  name: string;
  role: string;
  builderTitle: string;
  twitter?: string;
  builderId?: string;
  initials?: string;
  className?: string;
}

/**
 * 1080×1080 Official HH Goa Expedition Builder Pass
 * Ultra-Large High-Legibility Fonts & Expanded Hero Elements:
 *   · Header Title: 38px Font-Black
 *   · Header Subtitle: 18px Font-Bold
 *   · Ticket Stamp Dates: 18px Font-Black / 15px Subtext
 *   · Arched Photo Frame: 390×460px
 *   · Builder Name: 66px Font-Black
 *   · Role & Twitter Badges: 18px–20px Font-Black
 *   · AI Title Badge: 26px Font-Bold
 *   · Verified Badge & Footer: 17px–18px Font-Black
 */
export const BuilderIdCard = React.forwardRef<
  HTMLDivElement,
  BuilderIdCardProps
>(function BuilderIdCard(
  { avatarUrl, name, role, builderTitle, twitter, initials, className },
  ref
) {
  const fallback = initials || getInitials(name) || "B";
  const displayName = name || "Your Name Here";
  const displayRole = role || "Stack / Role";
  const displayTitle = builderTitle || "AI Architect";
  const formattedTwitter = twitter
    ? twitter.startsWith("@")
      ? twitter
      : `@${twitter}`
    : "";

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-[#FDFBF7] font-sans text-[#0D3B2E]",
        className
      )}
      style={{
        width: 1080,
        height: 1080,
        colorScheme: "light",
      }}
    >
      {/* 3–5% Vintage Paper Grain Texture Overlay */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04] z-30">
        <filter id="paper-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-noise)" />
      </svg>

      {/* Subtle Top-Right Sunlight Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-[450px] w-[450px] rounded-full z-0"
        style={{
          background:
            "radial-gradient(ellipse at 90% 10%, rgba(229, 169, 60, 0.18) 0%, rgba(229, 169, 60, 0.03) 50%, transparent 70%)",
        }}
      />

      {/* Outer Single Luxury Printed Pass Frame */}
      <div className="absolute inset-5 rounded-2xl border-3 border-[#0D3B2E] p-7 flex flex-col justify-between overflow-hidden bg-[#FDFBF7]/98 z-10">

        {/* Faded Passport Stamp Watermark Behind Header (6% Opacity) */}
        <div className="pointer-events-none absolute left-8 top-6 border-2 border-dashed border-[#0D3B2E] p-3 opacity-[0.06] rotate-[-10deg] rounded-lg z-0">
          <p className="font-mono text-[14px] font-black uppercase tracking-widest text-[#0D3B2E]">
            GOA · FROM PARADISE
          </p>
          <p className="font-mono text-[12px] font-bold text-[#C85A32]">INDIA POST · 2026</p>
        </div>

        {/* Single Elegant Top-Right Palm Leaf */}
        <PalmFrond
          className="absolute -right-20 -top-12 w-[520px] text-[#0D3B2E]/[0.08] pointer-events-none z-0"
          style={{
            filter: "drop-shadow(3px 10px 14px rgba(13, 59, 46, 0.15))",
            transform: "rotate(-25deg)",
          }}
        />

        {/* Tiny Decorative Stars */}
        <Sparkle className="absolute top-[12%] right-[22%] h-4 w-4 text-[#E5A93C] opacity-80" />
        <Sparkle className="absolute top-[30%] left-[8%] h-3.5 w-3.5 text-[#C85A32] opacity-70" />
        <Sparkle className="absolute bottom-[24%] right-[10%] h-4 w-4 text-[#E5A93C] opacity-80" />

        {/* ============ HEADER: ULTRA PROMINENT & VISIBLE FONTS ============ */}
        <div className="relative z-10 flex items-center justify-between border-b-2 border-[#0D3B2E] pb-4 pt-1">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-xl border-2 border-[#0D3B2E] bg-[#0D3B2E] text-[#E5A93C] shadow-[2px_2px_0px_#E5A93C]">
              <img src="/hh-logo.png" alt="HH Logo" className="h-8 w-8 rounded object-cover" />
            </div>
            <div>
              <p className="font-serif text-[38px] font-black uppercase tracking-[0.12em] text-[#0D3B2E] leading-none">
                Hacker House Goa
              </p>
              <p className="font-mono text-[18px] font-bold uppercase tracking-[0.20em] text-[#C85A32] mt-1">
                Official Expedition Pass · 2026
              </p>
            </div>
          </div>

          {/* Prominent Ticket Stamp Badge */}
          <div className="flex items-center gap-3.5 rounded-xl border-2 border-[#0D3B2E] bg-[#E5A93C]/25 px-5 py-2.5 shadow-[2px_2px_0px_#0D3B2E]">
            <div className="text-right">
              <p className="font-mono text-[18px] font-black uppercase tracking-wider text-[#0D3B2E]">
                28–31 OCT 2026
              </p>
              <p className="font-mono text-[14px] font-extrabold uppercase tracking-widest text-[#C85A32]">
                GOA INDIA · PASS #026
              </p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-dashed border-[#0D3B2E] bg-[#0D3B2E] font-mono text-[14px] font-black text-[#E5A93C]">
              ★
            </div>
          </div>
        </div>

        {/* ============ HERO CENTERPIECE: ARCHED PHOTO FRAME + BUILDER DETAILS ============ */}
        <div className="relative z-10 my-auto flex flex-col items-center text-center py-2">
          
          {/* HERO ARCHED PHOTO FRAME (Layered Colonial Arch Borders) */}
          <div className="relative mb-5">
            <div
              className="relative grid place-items-center overflow-hidden border-4 border-[#0D3B2E] bg-[#C85A32] p-2"
              style={{
                width: 390,
                height: 460,
                borderRadius: "195px 195px 26px 26px",
                boxShadow: "8px 8px 0px #0D3B2E",
              }}
            >
              <div
                className="relative h-full w-full overflow-hidden border-2 border-[#0D3B2E] bg-[#0D3B2E]"
                style={{
                  borderRadius: "185px 185px 20px 20px",
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-[#0D3B2E] text-[#E5A93C]">
                    <span className="font-serif text-[120px] font-black">{fallback}</span>
                  </div>
                )}

                <div className="absolute bottom-0 inset-x-0 bg-[#0D3B2E]/92 py-2.5 border-t-2 border-[#E5A93C] text-center">
                  <span className="font-mono text-[14px] font-black uppercase tracking-[0.24em] text-[#E5A93C]">
                    Official Builder Badge
                  </span>
                </div>
              </div>
            </div>

            {/* Sun Stamp Badge */}
            <div className="absolute -right-5 -top-3 grid h-16 w-16 place-items-center rounded-full border-2 border-[#0D3B2E] bg-[#E5A93C] text-[#0D3B2E] font-mono text-sm font-black shadow-[3px_3px_0px_#0D3B2E]">
              ☀️ GOA
            </div>
          </div>

          {/* Builder Name */}
          <h2 className="font-serif text-[66px] font-black leading-none tracking-tight text-[#0D3B2E]">
            {displayName}
          </h2>

          {/* Beach Wave Line Accent */}
          <svg className="my-3 h-3.5 w-52 text-[#C85A32]" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M0 10 Q25 0 50 10 T100 10" />
          </svg>

          {/* Role / Stack Tag & Twitter Handle Tag */}
          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-xl border-2 border-[#0D3B2E] bg-[#E5A93C] px-7 py-2 font-mono text-[20px] font-black uppercase tracking-[0.2em] text-[#0D3B2E] shadow-[3px_3px_0px_#0D3B2E]">
              {displayRole}
            </span>
            {formattedTwitter && (
              <span className="rounded-xl border-2 border-[#0D3B2E] bg-[#1c3529] px-5 py-2 font-mono text-[18px] font-extrabold text-[#d9a726] shadow-[3px_3px_0px_#C85A32]">
                𝕏 {formattedTwitter}
              </span>
            )}
          </div>

          {/* AI Title Badge */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border-2 border-[#0D3B2E] bg-[#C85A32] px-7 py-2.5 text-white shadow-[4px_4px_0px_#0D3B2E]">
            <span className="font-serif text-[26px] font-bold tracking-wide">
              ⚡ {displayTitle}
            </span>
          </div>
        </div>

        {/* ============ FOOTER: ULTRA PROMINENT FONTS ============ */}
        <div className="relative z-10 flex items-center justify-between border-t-2 border-[#0D3B2E] pt-4 pb-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-[#0D3B2E]">
              <Trees className="h-5 w-5" />
              <Waves className="h-5 w-5 text-[#C85A32]" />
              <MapPin className="h-5 w-5 text-[#E5A93C]" />
            </div>
            <span className="rounded-md border-2 border-[#0D3B2E] bg-[#0D3B2E] px-4 py-1.5 font-mono text-[17px] font-black uppercase tracking-wider text-[#FDFBF7]">
              VERIFIED BUILDER
            </span>
            <span className="font-mono text-[18px] font-extrabold tracking-wider text-[#C85A32]">
              #FrameInGoa
            </span>
          </div>

          <div className="flex items-center font-mono text-[17px] font-black text-[#0D3B2E]">
            <span>HHGOA.COM</span>
          </div>
        </div>

      </div>
    </div>
  );
});
