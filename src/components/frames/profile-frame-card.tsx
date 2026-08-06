"use client";

import * as React from "react";
import { cn, getInitials } from "@/lib/utils";
import { PalmFrond, MonsteraLeaf, Sparkle, DotPattern } from "@/components/decor/tropical";
import { BUILDER_LEVELS } from "@/constants";
import type { BuilderLevel } from "@/types";

interface ProfileFrameCardProps {
  /** Cropped square avatar data URL. */
  avatarUrl: string | null;
  name: string;
  builderLevel: BuilderLevel;
  /** Unique Builder ID number. */
  uniqueId: string;
  className?: string;
}

/**
 * 1080×1080 Profile Frame composition — luxury circular avatar with a
 * conic level ring, golden inner ring, palm decorations, HH Goa wordmark,
 * and unique ID chip. Captured by html-to-image at 2× pixel ratio.
 */
export const ProfileFrameCard = React.forwardRef<
  HTMLDivElement,
  ProfileFrameCardProps
>(function ProfileFrameCard({ avatarUrl, name, builderLevel, uniqueId, className }, ref) {
  const fallback = getInitials(name) || "B";
  const level = BUILDER_LEVELS[builderLevel];

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{
        width: 1080,
        height: 1080,
        background:
          "radial-gradient(110% 80% at 50% 8%, #1A6B47 0%, #0F5132 45%, #06301E 100%)",
        colorScheme: "light",
        fontFamily: "var(--font-space-grotesk), sans-serif",
      }}
    >
      {/* Warm sun glow top right */}
      <div
        aria-hidden
        className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.84 0.14 80 / 0.85) 0%, oklch(0.84 0.14 80 / 0) 70%)",
        }}
      />
      {/* Coral glow bottom left */}
      <div
        aria-hidden
        className="absolute -bottom-40 -left-32 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.16 12 / 0.55) 0%, oklch(0.72 0.16 12 / 0) 70%)",
        }}
      />

      {/* Dot pattern */}
      <DotPattern
        className="absolute inset-0 h-full w-full text-ivory"
        style={{ opacity: 0.06 }}
      />

      {/* Palm fronds */}
      <PalmFrond
        className="absolute -left-16 -top-20 w-[460px] text-emerald-soft opacity-90"
        style={{
          filter: "drop-shadow(0 20px 40px oklch(0.10 0.04 165 / 0.45))",
          transform: "rotate(-14deg)",
        }}
      />
      <PalmFrond
        className="absolute -right-16 -top-12 w-[360px] text-emerald opacity-75"
        style={{
          filter: "drop-shadow(0 16px 32px oklch(0.10 0.04 165 / 0.40))",
          transform: "scaleX(-1) rotate(-22deg)",
        }}
      />
      <MonsteraLeaf
        className="absolute -bottom-12 -right-16 w-[360px] text-emerald"
        style={{
          filter: "drop-shadow(0 18px 36px oklch(0.10 0.04 165 / 0.45))",
          transform: "rotate(18deg)",
          opacity: 0.85,
        }}
      />
      <PalmFrond
        className="absolute -bottom-20 -left-12 w-[300px] text-emerald-deep"
        style={{ opacity: 0.55, transform: "rotate(190deg)" }}
      />

      <Sparkle className="absolute right-[26%] top-[18%] h-5 w-5 text-gold" style={{ opacity: 0.85 }} />
      <Sparkle className="absolute left-[22%] top-[36%] h-3 w-3 text-rose" style={{ opacity: 0.8 }} />
      <Sparkle className="absolute right-[18%] bottom-[34%] h-4 w-4 text-gold" style={{ opacity: 0.7 }} />

      {/* Top wordmark */}
      <div className="absolute left-1/2 top-[7%] -translate-x-1/2 text-center">
        <p
          style={{
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontSize: 24,
            letterSpacing: "0.34em",
            color: "oklch(0.84 0.14 80)",
            textTransform: "uppercase",
          }}
        >
          HH Goa · 2026
        </p>
        <div
          aria-hidden
          className="mx-auto mt-2 h-px w-[160px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.84 0.14 80 / 0.8), transparent)",
          }}
        />
      </div>

      {/* Avatar with level ring + gold ring */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-12 rounded-full"
            style={{
              background: `radial-gradient(circle, ${level.hex}55 0%, transparent 70%)`,
            }}
          />

          {/* Outer level ring */}
          <div
            className="relative grid place-items-center rounded-full"
            style={{
              width: 620,
              height: 620,
              padding: 14,
              background: `conic-gradient(from 220deg, ${level.gradient[0]}, ${level.gradient[1]}, ${level.gradient[0]}, ${level.gradient[1]}, ${level.gradient[0]})`,
              boxShadow: `0 30px 80px oklch(0.10 0.04 165 / 0.6), inset 0 0 0 1px oklch(0.985 0.014 90 / 0.18), ${level.glow}`,
            }}
          >
            {/* Gold ring */}
            <div
              className="grid place-items-center rounded-full"
              style={{
                width: "100%",
                height: "100%",
                padding: 8,
                background:
                  "conic-gradient(from 30deg, oklch(0.85 0.14 80), oklch(0.68 0.14 75), oklch(0.85 0.14 80), oklch(0.68 0.14 75), oklch(0.85 0.14 80))",
                boxShadow: "inset 0 0 0 2px oklch(0.985 0.012 90 / 0.4)",
              }}
            >
              <div
                className="grid place-items-center rounded-full overflow-hidden"
                style={{
                  width: "100%",
                  height: "100%",
                  padding: 6,
                  background: "oklch(0.20 0.05 165)",
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name || "Profile avatar"}
                    className="h-full w-full rounded-full object-cover"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="grid h-full w-full place-items-center rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.62 0.10 165), oklch(0.42 0.11 165))",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-space-grotesk), sans-serif",
                        fontWeight: 700,
                        fontSize: 180,
                        color: "oklch(0.985 0.014 95)",
                      }}
                    >
                      {fallback}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top badge: HH Goa wordmark chip */}
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2"
            style={{ zIndex: 4 }}
          >
            <div
              className="flex items-center gap-2 rounded-full px-5 py-2"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.85 0.14 80), oklch(0.68 0.14 75))",
                boxShadow:
                  "0 8px 20px oklch(0.10 0.04 165 / 0.5), inset 0 1px 0 oklch(0.985 0.012 90 / 0.5)",
              }}
            >
              <Sparkle className="h-3 w-3 text-emerald-deep" />
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "0.18em",
                  color: "oklch(0.10 0.04 165)",
                  textTransform: "uppercase",
                }}
              >
                HH Goa
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom name + role */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-center">
        <h2
          style={{
            fontFamily: "var(--font-space-grotesk), sans-serif",
            fontWeight: 600,
            fontSize: 44,
            color: "oklch(0.985 0.014 95)",
            lineHeight: 1.1,
          }}
        >
          {name || "Your Name Here"}
        </h2>
        <div
          aria-hidden
          className="mx-auto mt-3 h-px w-[180px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.84 0.14 80 / 0.7), transparent)",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontSize: 18,
            letterSpacing: "0.28em",
            color: "oklch(0.84 0.14 80)",
            textTransform: "uppercase",
            marginTop: 12,
          }}
        >
          {level.label} Builder · 2026
        </p>
      </div>

      {/* Unique ID chip */}
      <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "oklch(0.985 0.012 90 / 0.08)",
            border: "1px solid oklch(0.985 0.012 90 / 0.18)",
            borderRadius: 9999,
            padding: "6px 14px",
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontSize: 14,
            letterSpacing: "0.16em",
            color: "oklch(0.985 0.012 95)",
            backdropFilter: "blur(6px)",
          }}
        >
          {uniqueId}
        </span>
      </div>
    </div>
  );
});
