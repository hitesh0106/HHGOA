"use client";

import * as React from "react";
import { cn, getInitials } from "@/lib/utils";
import { Sparkle, DotPattern } from "@/components/decor/tropical";
import { BUILDER_LEVELS, APP_CONFIG } from "@/constants";
import type { BuilderLevel } from "@/types";

interface BuilderIdCardProps {
  /** Cropped square avatar data URL. */
  avatarUrl: string | null;
  name: string;
  role: string;
  college: string;
  github: string;
  xHandle: string;
  builderTitle: string;
  builderLevel: BuilderLevel;
  badge: string;
  badgeEmoji: string;
  /** Unique Builder ID number (e.g. "HHG-ABCD-1234"). */
  uniqueId: string;
  /** QR code data URL. */
  qrCodeUrl: string | null;
  className?: string;
}

/**
 * 1080×1080 luxury Builder ID card. Designed to look like a real premium
 * event pass — gradient background, pattern overlays, rounded corners,
 * avatar with level ring, Builder Title, badges, QR code, unique ID number,
 * and HH Goa wordmark.
 *
 * Captured by html-to-image at 2× pixel ratio for retina-quality 2160×2160
 * PNG output.
 */
export const BuilderIdCard = React.forwardRef<
  HTMLDivElement,
  BuilderIdCardProps
>(function BuilderIdCard(
  {
    avatarUrl,
    name,
    role,
    college,
    github,
    xHandle,
    builderTitle,
    builderLevel,
    badge,
    badgeEmoji,
    uniqueId,
    qrCodeUrl,
  },
  ref
) {
  const fallback = getInitials(name) || "B";
  const displayName = name || "Your Name";
  const displayRole = role || "Stack / Role";
  const displayCollege = college || "Your College";
  const displayGithub = github || "your-handle";
  const displayX = xHandle ? (xHandle.startsWith("@") ? xHandle : `@${xHandle}`) : "@your-handle";
  const displayTitle = builderTitle || "Builder of Tomorrow";
  const displayBadge = badge || "Open Source Hero";
  const level = BUILDER_LEVELS[builderLevel];

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        width: 1080,
        height: 1080,
        background:
          "linear-gradient(155deg, #06301E 0%, #0B3A2C 35%, #0F5132 70%, #1A6B47 100%)",
        colorScheme: "light",
        fontFamily: "var(--font-space-grotesk), sans-serif",
      }}
    >
      {/* Mesh gradient overlays for depth */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 18% 12%, oklch(0.62 0.10 165 / 0.28) 0%, transparent 70%), radial-gradient(50% 40% at 88% 8%, oklch(0.84 0.14 80 / 0.22) 0%, transparent 70%), radial-gradient(60% 50% at 78% 92%, oklch(0.72 0.16 12 / 0.16) 0%, transparent 70%)",
        }}
      />
      {/* Dot pattern overlay */}
      <DotPattern
        className="absolute inset-0 h-full w-full text-ivory"
        style={{ opacity: 0.06 }}
      />
      {/* Diagonal hairline pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, oklch(0.985 0.014 95) 0px, oklch(0.985 0.014 95) 1px, transparent 1px, transparent 12px)",
        }}
      />

      {/* Outer thin gold border — premium event pass feel */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[44px] pointer-events-none"
        style={{
          border: "1.5px solid oklch(0.84 0.14 80 / 0.35)",
        }}
      />

      {/* Card content frame */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ padding: 56 }}
      >
        {/* Top header bar */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* HH Goa logo mark */}
            <div
              className="grid place-items-center rounded-2xl"
              style={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, oklch(0.84 0.14 80), oklch(0.68 0.14 75))",
                boxShadow: "0 6px 16px oklch(0.10 0.04 165 / 0.4)",
              }}
            >
              <Sparkle className="h-7 w-7 text-emerald-deep" />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: "0.04em",
                  color: "oklch(0.985 0.014 95)",
                  lineHeight: 1,
                }}
              >
                HH GOA
              </p>
              <p
                style={{
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                  fontSize: 12,
                  letterSpacing: "0.28em",
                  color: "oklch(0.84 0.14 80)",
                  marginTop: 4,
                  textTransform: "uppercase",
                }}
              >
                2026 · Builders
              </p>
            </div>
          </div>

          {/* Builder Level chip */}
          <div
            className="flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: `linear-gradient(135deg, ${level.gradient[0]}, ${level.gradient[1]})`,
              boxShadow: level.glow,
            }}
          >
            <span
              className="rounded-full"
              style={{
                width: 8,
                height: 8,
                background: "oklch(0.985 0.014 95)",
                boxShadow: "0 0 8px oklch(0.985 0.014 95 / 0.7)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.16em",
                color: "oklch(0.10 0.04 165)",
                textTransform: "uppercase",
              }}
            >
              {level.label}
            </span>
          </div>
        </div>

        {/* Card body: avatar + identity */}
        <div
          className="flex flex-1 flex-col items-center justify-center gap-7"
          style={{ paddingTop: 28, paddingBottom: 24 }}
        >
          {/* Avatar with level ring */}
          <div className="relative">
            {/* Glow */}
            <div
              aria-hidden
              className="absolute -inset-6 rounded-full"
              style={{
                background: `radial-gradient(circle, ${level.hex}55 0%, transparent 70%)`,
              }}
            />
            {/* Conic level ring */}
            <div
              className="relative grid place-items-center rounded-full"
              style={{
                width: 320,
                height: 320,
                padding: 8,
                background: `conic-gradient(from 30deg, ${level.gradient[0]}, ${level.gradient[1]}, ${level.gradient[0]}, ${level.gradient[1]}, ${level.gradient[0]})`,
                boxShadow: `0 24px 56px oklch(0.10 0.04 165 / 0.45), inset 0 0 0 1px oklch(0.985 0.014 95 / 0.5), ${level.glow}`,
              }}
            >
              <div
                className="grid h-full w-full place-items-center overflow-hidden rounded-full"
                style={{
                  background: "oklch(0.20 0.05 165)",
                  border: "3px solid oklch(0.985 0.014 95)",
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
                        "linear-gradient(135deg, oklch(0.45 0.11 165), oklch(0.30 0.08 165))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-space-grotesk), sans-serif",
                        fontWeight: 700,
                        fontSize: 120,
                        color: "oklch(0.985 0.014 95)",
                      }}
                    >
                      {fallback}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Fun badge chip overlapping bottom-right */}
            <div
              className="absolute -bottom-2 -right-2 flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                background: "oklch(0.985 0.014 95)",
                boxShadow: "0 8px 20px oklch(0.10 0.04 165 / 0.4)",
              }}
            >
              <span style={{ fontSize: 18 }}>{badgeEmoji}</span>
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "oklch(0.20 0.05 165)",
                  letterSpacing: "0.04em",
                }}
              >
                {displayBadge}
              </span>
            </div>
          </div>

          {/* Builder Title — large gradient serif */}
          <div className="text-center" style={{ maxWidth: 880 }}>
            <p
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.36em",
                color: "oklch(0.84 0.14 80)",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Builder Title
            </p>
            <h2
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 700,
                fontSize: 56,
                lineHeight: 1.05,
                background:
                  "linear-gradient(135deg, oklch(0.985 0.014 95) 0%, oklch(0.92 0.10 85) 50%, oklch(0.84 0.14 80) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              {displayTitle}
            </h2>
          </div>

          {/* Name + Role + College */}
          <div className="text-center">
            <h3
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontWeight: 600,
                fontSize: 44,
                color: "oklch(0.985 0.014 95)",
                lineHeight: 1.1,
              }}
            >
              {displayName}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontSize: 18,
                letterSpacing: "0.16em",
                color: "oklch(0.85 0.06 165)",
                textTransform: "uppercase",
                marginTop: 10,
              }}
            >
              {displayRole}
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 16,
                color: "oklch(0.78 0.04 90)",
                marginTop: 4,
              }}
            >
              {displayCollege}
            </p>
          </div>
        </div>

        {/* Footer row: handles + QR + unique ID */}
        <div>
          {/* Divider */}
          <div
            aria-hidden
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.84 0.14 80 / 0.4), oklch(0.84 0.14 80 / 0.6), oklch(0.84 0.14 80 / 0.4), transparent)",
              marginBottom: 16,
            }}
          />

          <div className="flex items-end justify-between gap-6">
            {/* Left: handles */}
            <div className="flex flex-col gap-2">
              {github && (
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontFamily: "var(--font-ibm-plex-mono), monospace",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      color: "oklch(0.62 0.10 165)",
                      textTransform: "uppercase",
                      width: 64,
                    }}
                  >
                    GitHub
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-ibm-plex-mono), monospace",
                      fontSize: 16,
                      color: "oklch(0.985 0.014 95)",
                    }}
                  >
                    {displayGithub}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    color: "oklch(0.62 0.10 165)",
                    textTransform: "uppercase",
                    width: 64,
                  }}
                >
                  X / 𝕏
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                    fontSize: 16,
                    color: "oklch(0.985 0.014 95)",
                  }}
                >
                  {displayX}
                </span>
              </div>
              {/* Unique ID */}
              <div className="flex items-center gap-2 mt-1">
                <span
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    color: "oklch(0.62 0.10 165)",
                    textTransform: "uppercase",
                    width: 64,
                  }}
                >
                  ID
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.10em",
                    color: "oklch(0.84 0.14 80)",
                  }}
                >
                  {uniqueId}
                </span>
              </div>
            </div>

            {/* Right: QR code */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.24em",
                    color: "oklch(0.62 0.10 165)",
                    textTransform: "uppercase",
                  }}
                >
                  Scan to verify
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk), sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "oklch(0.985 0.014 95)",
                    marginTop: 2,
                  }}
                >
                  #FrameInGoa
                </p>
              </div>
              <div
                className="grid place-items-center rounded-xl p-2"
                style={{
                  background: "oklch(0.985 0.014 95)",
                  width: 116,
                  height: 116,
                  boxShadow: "0 8px 20px oklch(0.10 0.04 165 / 0.4)",
                }}
              >
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Builder ID QR code"
                    style={{ width: 100, height: 100 }}
                  />
                ) : (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      background:
                        "repeating-conic-gradient(oklch(0.20 0.05 165) 0% 25%, oklch(0.985 0.014 95) 0% 50%) 50% / 12px 12px",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
