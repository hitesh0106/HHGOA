"use client";

import * as React from "react";
import { cn, getInitials } from "@/lib/utils";
import { PalmFrond, Sparkle } from "@/components/decor/tropical";
import { MapPin, Waves, Trees } from "lucide-react";
import type { TeamMember } from "@/types";

interface TeamFrameCardProps {
  teamName: string;
  teamTagline?: string;
  college?: string;
  members: TeamMember[];
  className?: string;
}

/**
 * 1080×1080 Official HH Goa Expedition Team Pass
 * Ultra-Large High-Legibility Fonts & Maximized Photo Frames:
 *   · Header Title: 38px Font-Black
 *   · Member Photos: 260×310px (3-member) / 340×400px (2-member)
 *   · Member Names: 36px Font-Black
 *   · Member Titles: 18px Font-Bold
 *   · Team Name: 64px Font-Black
 *   · Footer & Badges: 16px–18px Font-Black
 */
export const TeamFrameCard = React.forwardRef<
  HTMLDivElement,
  TeamFrameCardProps
>(function TeamFrameCard(
  { teamName, teamTagline, college, members, className },
  ref
) {
  const displayTeamName = teamName?.trim() || "TEAM ALPHA";
  const displaySubtext = teamTagline?.trim() || college?.trim() || "Official Goa Expedition Team";

  const memberList = members && members.length >= 2 ? members : [
    { id: "1", name: "Aria Mehra", role: "AI · LLMs", builderTitle: "Prompt Architect" },
    { id: "2", name: "Sam Chen", role: "Frontend · UX", builderTitle: "Pixel Crafter" },
  ];

  const count = memberList.length;

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
        <filter id="team-paper-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#team-paper-noise)" />
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

        {/* Top-Right Palm Frond with Soft Shadow ONLY */}
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

        {/* ============ HEADER: ULTRA PROMINENT FONTS ============ */}
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
                Official Team Pass · 2026
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
                {count} BUILDERS PASS
              </p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-dashed border-[#0D3B2E] bg-[#0D3B2E] font-mono text-[14px] font-black text-[#E5A93C]">
              ★
            </div>
          </div>
        </div>

        {/* ============ MIDDLE SECTION: EXPANDED MEMBER ARCH CARDS ============ */}
        <div className="relative z-10 my-auto py-3">
          <div
            className={cn(
              "grid gap-8 items-start justify-center",
              count === 2 ? "grid-cols-2 max-w-[920px] mx-auto" : "grid-cols-3"
            )}
          >
            {memberList.map((m, idx) => {
              const avatar = m.avatarUrl;
              const mName = m.name?.trim() || `Teammate ${idx + 1}`;
              const mRole = m.role?.trim() || "Builder";
              const mTitle = m.builderTitle?.trim() || "AI Architect";
              const initials = getInitials(mName) || `M${idx + 1}`;

              const avatarHeight = count === 2 ? 380 : 310;
              const avatarWidth = count === 2 ? 320 : 260;

              return (
                <div
                  key={m.id || idx}
                  className="flex flex-col items-center text-center"
                >
                  {/* Arch Photo Container */}
                  <div
                    className="relative grid place-items-center overflow-hidden border-4 border-[#0D3B2E] bg-[#C85A32] mb-4"
                    style={{
                      width: avatarWidth,
                      height: avatarHeight,
                      borderRadius: "140px 140px 22px 22px",
                      boxShadow: "7px 7px 0px #0D3B2E",
                    }}
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={mName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-[#0D3B2E] text-[#E5A93C]">
                        <span className="font-serif text-[80px] font-black">{initials}</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-[#0D3B2E]/92 py-2 text-center border-t-2 border-[#E5A93C]">
                      <span className="font-mono text-[14px] font-black uppercase tracking-wider text-[#E5A93C]">
                        {mRole}
                      </span>
                    </div>
                  </div>

                  {/* Member Name */}
                  <h3 className="font-serif text-[36px] font-black text-[#0D3B2E] leading-tight">
                    {mName}
                  </h3>

                  {/* Member Title */}
                  <span className="mt-1 font-mono text-[18px] font-bold text-[#C85A32]">
                    ⚡ {mTitle}
                  </span>

                  {/* Twitter Handle */}
                  {m.twitter && (
                    <span className="font-mono text-[15px] font-extrabold text-[#1c3529] mt-1 bg-[#1c3529]/10 px-3 py-0.5 rounded-md border border-[#1c3529]/20">
                      𝕏 {m.twitter.startsWith("@") ? m.twitter : `@${m.twitter}`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ BOTTOM HERO FOOTER: ULTRA LARGE TEAM NAME ============ */}
        <div className="relative z-10 border-t-2 border-[#0D3B2E] pt-4 pb-1">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="rounded-md border-2 border-[#0D3B2E] bg-[#E5A93C] px-3.5 py-1 font-mono text-[14px] font-black uppercase text-[#0D3B2E] shadow-[2px_2px_0px_#0D3B2E]">
                  {count} BUILDERS TEAM
                </span>
                <span className="font-mono text-[16px] text-[#C85A32] font-black">
                  {displaySubtext}
                </span>
              </div>
              <h1 className="font-serif text-[64px] font-black text-[#0D3B2E] uppercase leading-none tracking-tight">
                {displayTeamName}
              </h1>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="rounded-xl border-2 border-[#0D3B2E] bg-[#0D3B2E] px-5 py-2 font-mono text-[18px] font-black text-[#FDFBF7] shadow-[3px_3px_0px_#E5A93C]">
                #FrameInGoa
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t-2 border-[#0D3B2E]/20 pt-2.5 font-mono text-[16px] font-black text-[#0D3B2E]">
            <div className="flex items-center gap-2.5">
              <Trees className="h-5 w-5" />
              <Waves className="h-5 w-5 text-[#C85A32]" />
              <MapPin className="h-5 w-5 text-[#E5A93C]" />
              <span>OFFICIAL HACKATHON TEAM</span>
            </div>
            <div className="flex items-center">
              <span>HHGOA.COM</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});
