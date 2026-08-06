"use client";

import * as React from "react";
import { cn, getInitials } from "@/lib/utils";
import { PalmFrond, MonsteraLeaf, Sparkle, PalmLeaf } from "@/components/decor/tropical";

interface BuilderIdCardProps {
  /** Cropped square avatar data URL. */
  avatarUrl: string | null;
  name: string;
  role: string;
  builderTitle: string;
  initials?: string;
  className?: string;
}

/**
 * 1080×1080 Builder ID card composition. Premium tropical identity card.
 *
 * Layout:
 *   - Ivory background with subtle tropical mesh
 *   - Top: "BUILDER ID" badge + "HH Goa 2026" wordmark
 *   - Left: large circular avatar with golden ring + palm leaf
 *   - Right: Builder Title (serif, gold gradient), Name, Role, badge chips
 *   - Bottom: decorative divider + hashtag + edition mark
 *   - Floating palm decorations in corners
 */
export const BuilderIdCard = React.forwardRef<
  HTMLDivElement,
  BuilderIdCardProps
>(function BuilderIdCard(
  { avatarUrl, name, role, builderTitle, initials },
  ref
) {
  const fallback = initials || getInitials(name) || "B";
  const displayName = name || "Your Name";
  const displayRole = role || "Stack / Role";
  const displayTitle = builderTitle || "Builder of Tomorrow";

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: 1080,
        height: 1080,
        background:
          "linear-gradient(160deg, oklch(0.985 0.012 90) 0%, oklch(0.96 0.02 90) 45%, oklch(0.94 0.025 80) 100%)",
        colorScheme: "light",
      }}
    >
      {/* Mesh gradient overlays */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 18% 12%, oklch(0.62 0.10 165 / 0.16) 0%, transparent 70%), radial-gradient(50% 40% at 88% 8%, oklch(0.83 0.16 85 / 0.20) 0%, transparent 70%), radial-gradient(60% 50% at 78% 92%, oklch(0.68 0.19 25 / 0.14) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.30 0.06 165) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Decorative palms in corners */}
      <PalmFrond
        className="absolute -left-20 -top-24 w-[420px]"
        style={{
          color: "oklch(0.42 0.11 165)",
          opacity: 0.95,
          filter: "drop-shadow(0 18px 36px oklch(0.42 0.11 165 / 0.25))",
          transform: "rotate(-18deg)",
        }}
      />
      <MonsteraLeaf
        className="absolute -bottom-16 -right-20 w-[400px]"
        style={{
          color: "oklch(0.42 0.11 165)",
          opacity: 0.85,
          filter: "drop-shadow(0 18px 36px oklch(0.42 0.11 165 / 0.22))",
          transform: "rotate(160deg)",
        }}
      />
      <PalmLeaf
        className="absolute -right-8 top-[36%] w-[140px]"
        style={{
          color: "oklch(0.62 0.10 165)",
          opacity: 0.6,
          transform: "rotate(40deg)",
        }}
      />

      {/* Sparkles */}
      <Sparkle
        className="absolute right-[10%] top-[14%] h-4 w-4"
        style={{ color: "oklch(0.68 0.19 25)", opacity: 0.85 }}
      />
      <Sparkle
        className="absolute left-[12%] bottom-[20%] h-3 w-3"
        style={{ color: "oklch(0.83 0.16 85)", opacity: 0.8 }}
      />
      <Sparkle
        className="absolute right-[18%] bottom-[14%] h-5 w-5"
        style={{ color: "oklch(0.83 0.16 85)", opacity: 0.75 }}
      />

      {/* Card content frame */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ padding: 64 }}
      >
        {/* Top header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Emerald badge with "BUILDER ID" */}
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: "linear-gradient(135deg, oklch(0.42 0.11 165), oklch(0.30 0.08 165))",
                boxShadow: "0 8px 20px oklch(0.42 0.11 165 / 0.35)",
              }}
            >
              <span
                className="grid h-5 w-5 place-items-center rounded-full"
                style={{ background: "oklch(0.83 0.16 85)" }}
              >
                <Sparkle className="h-3 w-3 text-emerald-deep" />
              </span>
              <span
                className="font-sans text-[14px] font-bold uppercase tracking-[0.20em] text-ivory"
              >
                Builder ID
              </span>
            </div>
          </div>

          {/* HH Goa 2026 wordmark */}
          <div className="text-right">
            <p
              className="font-serif text-[20px] tracking-[0.16em] text-emerald-deep"
              style={{ fontWeight: 600 }}
            >
              HH Goa
            </p>
            <p
              className="font-sans text-[12px] uppercase tracking-[0.32em] text-gold-deep"
              style={{ marginTop: 2 }}
            >
              2026 · Builders Edition
            </p>
          </div>
        </div>

        {/* Main content: avatar + identity */}
        <div className="flex flex-1 flex-col items-center justify-center gap-10" style={{ paddingTop: 24, paddingBottom: 24 }}>
          {/* Avatar */}
          <div className="relative">
            {/* Gold glow */}
            <div
              aria-hidden
              className="absolute -inset-6 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.83 0.16 85 / 0.35) 0%, oklch(0.83 0.16 85 / 0) 70%)",
              }}
            />
            {/* Gold ring */}
            <div
              className="relative grid place-items-center rounded-full"
              style={{
                width: 340,
                height: 340,
                padding: 10,
                background:
                  "conic-gradient(from 30deg, oklch(0.85 0.16 85), oklch(0.68 0.16 80), oklch(0.85 0.16 85), oklch(0.68 0.16 80), oklch(0.85 0.16 85))",
                boxShadow:
                  "0 24px 56px oklch(0.42 0.11 165 / 0.30), inset 0 0 0 1px oklch(0.985 0.012 90 / 0.5)",
              }}
            >
              <div
                className="grid h-full w-full place-items-center overflow-hidden rounded-full"
                style={{
                  background: "oklch(0.42 0.11 165)",
                  border: "3px solid oklch(0.985 0.012 90)",
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="grid h-full w-full place-items-center"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.62 0.10 165), oklch(0.42 0.11 165))",
                    }}
                  >
                    <span
                      className="font-serif text-[120px] text-ivory"
                      style={{ fontWeight: 700 }}
                    >
                      {fallback}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Small palm leaf decoration on avatar */}
            <PalmLeaf
              className="absolute -right-10 -top-6 w-[100px]"
              style={{
                color: "oklch(0.42 0.11 165)",
                opacity: 0.85,
                transform: "rotate(28deg)",
                filter: "drop-shadow(0 8px 16px oklch(0.42 0.11 165 / 0.3))",
              }}
            />
          </div>

          {/* Builder Title */}
          <div className="text-center" style={{ maxWidth: 880 }}>
            <p
              className="font-sans text-[14px] font-semibold uppercase tracking-[0.34em] text-emerald"
              style={{ marginBottom: 12 }}
            >
              Builder Title
            </p>
            <h2
              className="font-serif text-[64px] leading-[1.05]"
              style={{
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, oklch(0.30 0.08 165) 0%, oklch(0.55 0.13 165) 45%, oklch(0.68 0.16 80) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              {displayTitle}
            </h2>
          </div>

          {/* Name + Role */}
          <div className="text-center">
            <h3
              className="font-serif text-[44px] text-emerald-deep"
              style={{ fontWeight: 600, lineHeight: 1.1 }}
            >
              {displayName}
            </h3>
            <p
              className="font-sans text-[20px] tracking-[0.18em] uppercase text-muted-foreground"
              style={{ marginTop: 8 }}
            >
              {displayRole}
            </p>
          </div>
        </div>

        {/* Bottom footer */}
        <div>
          {/* Divider */}
          <div
            aria-hidden
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.62 0.10 165 / 0.5), oklch(0.83 0.16 85 / 0.7), oklch(0.62 0.10 165 / 0.5), transparent)",
              marginBottom: 18,
            }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-3 py-1 font-sans text-[12px] font-semibold uppercase tracking-wider"
                style={{
                  background: "oklch(0.42 0.11 165 / 0.10)",
                  color: "oklch(0.30 0.08 165)",
                }}
              >
                Verified Builder
              </span>
              <span
                className="rounded-full px-3 py-1 font-sans text-[12px] font-semibold uppercase tracking-wider"
                style={{
                  background: "oklch(0.83 0.16 85 / 0.18)",
                  color: "oklch(0.55 0.13 80)",
                }}
              >
                Goa · 2026
              </span>
            </div>
            <p
              className="font-sans text-[14px] tracking-[0.24em] uppercase"
              style={{ color: "oklch(0.55 0.13 165)" }}
            >
              #FrameInGoa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
