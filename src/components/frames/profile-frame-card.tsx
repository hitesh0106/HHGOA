"use client";

import * as React from "react";
import { cn, getInitials } from "@/lib/utils";
import { PalmFrond, MonsteraLeaf, Sparkle } from "@/components/decor/tropical";

interface ProfileFrameCardProps {
  /** Cropped square avatar data URL. */
  avatarUrl: string | null;
  name: string;
  /** Optional fallback initials shown when no avatar is set. */
  initials?: string;
  className?: string;
}

/**
 * 1080×1080 Profile Frame composition. This DOM node is what html-to-image
 * rasterises, so it must be pixel-perfect at the target resolution. We render
 * it inside a fixed 1080×1080 box and scale visually with CSS transforms in
 * the parent.
 *
 * Layout:
 *   - Full-bleed tropical gradient background
 *   - Soft mesh / dot pattern overlay
 *   - Two big palm fronds in the upper corners
 *   - Monstera leaf bottom-right
 *   - Circular avatar with a thick golden ring + thin emerald outline
 *   - "HH GOA 2026" wordmark in premium serif at the bottom
 *   - Small hashtag chip
 */
export const ProfileFrameCard = React.forwardRef<
  HTMLDivElement,
  ProfileFrameCardProps
>(function ProfileFrameCard({ avatarUrl, name, initials, className }, ref) {
  const fallback = initials || getInitials(name) || "B";

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-emerald-deep",
        className
      )}
      style={{
        width: 1080,
        height: 1080,
        // Use the CSS variables defined on :root — html-to-image needs them
        // resolved at the root, so we set them inline as fallbacks.
        colorScheme: "light",
      }}
    >
      {/* Base gradient */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 80% at 50% 8%, oklch(0.55 0.13 165) 0%, oklch(0.32 0.09 165) 45%, oklch(0.20 0.05 165) 100%)",
        }}
      />

      {/* Warm sun glow top right */}
      <div
        aria-hidden
        className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.85 0.16 85 / 0.85) 0%, oklch(0.85 0.16 85 / 0) 70%)",
        }}
      />
      {/* Coral glow bottom left */}
      <div
        aria-hidden
        className="absolute -bottom-40 -left-32 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.19 25 / 0.6) 0%, oklch(0.68 0.19 25 / 0) 70%)",
        }}
      />

      {/* Dot pattern overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.985 0.012 90 / 0.55) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Palm frond top-left */}
      <PalmFrond
        className="absolute -left-16 -top-20 w-[460px] text-emerald-soft opacity-90"
        style={{
          filter: "drop-shadow(0 20px 40px oklch(0.10 0.04 165 / 0.45))",
          transform: "rotate(-14deg)",
        }}
      />
      {/* Palm frond top-right (flipped) */}
      <PalmFrond
        className="absolute -right-16 -top-12 w-[360px] text-emerald opacity-75"
        style={{
          filter: "drop-shadow(0 16px 32px oklch(0.10 0.04 165 / 0.40))",
          transform: "scaleX(-1) rotate(-22deg)",
        }}
      />

      {/* Monstera leaf bottom right */}
      <MonsteraLeaf
        className="absolute -bottom-12 -right-16 w-[360px] text-emerald"
        style={{
          filter: "drop-shadow(0 18px 36px oklch(0.10 0.04 165 / 0.45))",
          transform: "rotate(18deg)",
          opacity: 0.85,
        }}
      />

      {/* Small palm frond bottom-left */}
      <PalmFrond
        className="absolute -bottom-20 -left-12 w-[300px] text-emerald-deep"
        style={{
          opacity: 0.55,
          transform: "rotate(190deg)",
        }}
      />

      {/* Sparkles */}
      <Sparkle
        className="absolute right-[26%] top-[18%] h-5 w-5 text-gold"
        style={{ opacity: 0.85, filter: "drop-shadow(0 0 12px oklch(0.83 0.16 85 / 0.7))" }}
      />
      <Sparkle
        className="absolute left-[22%] top-[36%] h-3 w-3 text-coral"
        style={{ opacity: 0.8 }}
      />
      <Sparkle
        className="absolute right-[18%] bottom-[34%] h-4 w-4 text-gold"
        style={{ opacity: 0.7 }}
      />

      {/* Top wordmark */}
      <div className="absolute left-1/2 top-[7%] -translate-x-1/2 text-center">
        <p
          className="font-serif text-[26px] tracking-[0.34em] text-gold"
          style={{ letterSpacing: "0.34em", fontFeatureSettings: '"smcp"' }}
        >
          BUILDER · GOA · 2026
        </p>
        <div
          aria-hidden
          className="mx-auto mt-2 h-px w-[140px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.83 0.16 85 / 0.8), transparent)",
          }}
        />
      </div>

      {/* Avatar with golden ring */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          {/* Outer glow */}
          <div
            aria-hidden
            className="absolute -inset-12 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.83 0.16 85 / 0.35) 0%, oklch(0.83 0.16 85 / 0) 70%)",
            }}
          />

          {/* Outer emerald ring */}
          <div
            className="relative grid place-items-center rounded-full"
            style={{
              width: 620,
              height: 620,
              padding: 14,
              background:
                "conic-gradient(from 220deg, oklch(0.62 0.10 165), oklch(0.30 0.06 165), oklch(0.62 0.10 165), oklch(0.30 0.06 165), oklch(0.62 0.10 165))",
              boxShadow:
                "0 30px 80px oklch(0.10 0.04 165 / 0.6), inset 0 0 0 1px oklch(0.985 0.012 90 / 0.18)",
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
                  "conic-gradient(from 30deg, oklch(0.85 0.16 85), oklch(0.68 0.16 80), oklch(0.85 0.16 85), oklch(0.68 0.16 80), oklch(0.85 0.16 85))",
                boxShadow: "inset 0 0 0 2px oklch(0.985 0.012 90 / 0.4)",
              }}
            >
              {/* Inner emerald hairline */}
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
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
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
                      className="font-serif text-[180px] text-ivory"
                      style={{ fontWeight: 700 }}
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
                  "linear-gradient(135deg, oklch(0.85 0.16 85), oklch(0.68 0.16 80))",
                boxShadow:
                  "0 8px 20px oklch(0.10 0.04 165 / 0.5), inset 0 1px 0 oklch(0.985 0.012 90 / 0.5)",
              }}
            >
              <Sparkle className="h-3 w-3 text-emerald-deep" />
              <span
                className="font-serif text-[18px] font-bold uppercase tracking-[0.18em] text-emerald-deep"
              >
                HH Goa
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom name + role */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-center">
        {name ? (
          <h2
            className="font-serif text-[44px] leading-tight text-ivory"
            style={{ fontWeight: 600 }}
          >
            {name}
          </h2>
        ) : (
          <h2
            className="font-serif text-[40px] leading-tight text-ivory/80"
            style={{ fontWeight: 500 }}
          >
            Your Name Here
          </h2>
        )}
        <div
          aria-hidden
          className="mx-auto mt-3 h-px w-[180px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.83 0.16 85 / 0.7), transparent)",
          }}
        />
        <p
          className="mt-3 font-sans text-[18px] tracking-[0.28em] uppercase text-gold"
        >
          Builder · 2026
        </p>
      </div>

      {/* Hashtag chip */}
      <div className="absolute bottom-[3%] left-1/2 -translate-x-1/2">
        <span
          className="rounded-full px-4 py-1.5 font-sans text-[14px] tracking-wider text-ivory"
          style={{
            background: "oklch(0.985 0.012 90 / 0.08)",
            border: "1px solid oklch(0.985 0.012 90 / 0.18)",
            backdropFilter: "blur(6px)",
          }}
        >
          #FrameInGoa
        </span>
      </div>
    </div>
  );
});
