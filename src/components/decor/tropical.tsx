"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Original tropical SVG decorations. Hand-crafted paths — not copied from
 * any existing brand. Designed to evoke Goa palm leaves + festival warmth
 * using the project's emerald / gold / coral palette.
 */

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/** Stylised palm frond — used as a corner decoration. */
export const PalmFrond = React.forwardRef<SVGSVGElement, SvgProps>(
  function PalmFrond({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn("pointer-events-none", className)}
        {...props}
      >
        <defs>
          <linearGradient id="palm-grad" x1="20" y1="40" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--emerald-soft)" />
            <stop offset="0.55" stopColor="var(--emerald)" />
            <stop offset="1" stopColor="var(--emerald-deep)" />
          </linearGradient>
          <linearGradient id="palm-grad-2" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--gold)" />
            <stop offset="1" stopColor="var(--emerald)" />
          </linearGradient>
        </defs>
        {/* central rib */}
        <path
          d="M30 170 C 70 130, 110 90, 175 25"
          stroke="url(#palm-grad-2)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* leaflets */}
        {Array.from({ length: 9 }).map((_, i) => {
          const t = i / 8;
          const baseX = 30 + (175 - 30) * t;
          const baseY = 170 + (25 - 170) * t;
          const len = 70 - t * 28;
          const angle = -28 - t * 22;
          return (
            <g key={i} transform={`translate(${baseX} ${baseY}) rotate(${angle})`}>
              <path
                d={`M0 0 Q ${len * 0.4} ${-len * 0.18}, ${len} ${-len * 0.04} Q ${len * 0.5} ${len * 0.04}, 0 0 Z`}
                fill="url(#palm-grad)"
                opacity={0.85}
              />
            </g>
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const t = i / 7;
          const baseX = 30 + (175 - 30) * t;
          const baseY = 170 + (25 - 170) * t;
          const len = 60 - t * 24;
          const angle = 150 + t * 26;
          return (
            <g key={`b-${i}`} transform={`translate(${baseX} ${baseY}) rotate(${angle})`}>
              <path
                d={`M0 0 Q ${len * 0.4} ${-len * 0.18}, ${len} ${-len * 0.04} Q ${len * 0.5} ${len * 0.04}, 0 0 Z`}
                fill="url(#palm-grad)"
                opacity={0.7}
              />
            </g>
          );
        })}
      </svg>
    );
  }
);

/** Single elegant palm leaf, more vertical — used as a standalone decor. */
export const PalmLeaf = React.forwardRef<SVGSVGElement, SvgProps>(
  function PalmLeaf({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 120 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn("pointer-events-none", className)}
        {...props}
      >
        <defs>
          <linearGradient id="leaf-grad" x1="20" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--emerald-soft)" />
            <stop offset="0.6" stopColor="var(--emerald)" />
            <stop offset="1" stopColor="var(--emerald-deep)" />
          </linearGradient>
        </defs>
        <path
          d="M60 10 C 30 60, 18 110, 40 180"
          stroke="var(--gold-deep)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        {Array.from({ length: 7 }).map((_, i) => {
          const y = 30 + i * 22;
          const len = 38 - Math.abs(i - 3) * 4;
          return (
            <g key={i}>
              <path
                d={`M${50 - i * 1.5} ${y} Q ${50 + len * 0.5} ${y - 8}, ${50 + len} ${y - 4} Q ${50 + len * 0.5} ${y + 4}, ${50 - i * 1.5} ${y} Z`}
                fill="url(#leaf-grad)"
                opacity={0.92 - i * 0.04}
              />
              <path
                d={`M${50 - i * 1.5} ${y} Q ${50 - len * 0.5} ${y - 8}, ${50 - len} ${y - 4} Q ${50 - len * 0.5} ${y + 4}, ${50 - i * 1.5} ${y} Z`}
                fill="url(#leaf-grad)"
                opacity={0.78 - i * 0.04}
              />
            </g>
          );
        })}
      </svg>
    );
  }
);

/** Tropical sun / orb with subtle radial glow. */
export const TropicalSun = React.forwardRef<SVGSVGElement, SvgProps>(
  function TropicalSun({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn("pointer-events-none", className)}
        {...props}
      >
        <defs>
          <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="1" />
            <stop offset="55%" stopColor="var(--gold-deep)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--coral)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sun-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF6D7" />
            <stop offset="60%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--gold-deep)" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#sun-grad)" />
        <circle cx="100" cy="100" r="44" fill="url(#sun-core)" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12;
          return (
            <rect
              key={i}
              x="98"
              y="22"
              width="4"
              height="14"
              rx="2"
              fill="var(--gold)"
              transform={`rotate(${angle} 100 100)`}
              opacity="0.78"
            />
          );
        })}
      </svg>
    );
  }
);

/** Subtle dotted texture overlay. */
export const DotPattern = React.forwardRef<SVGSVGElement, SvgProps>(
  function DotPattern({ className, ...props }, ref) {
    const id = React.useId();
    return (
      <svg
        ref={ref}
        aria-hidden="true"
        className={cn("pointer-events-none", className)}
        {...props}
      >
        <defs>
          <pattern
            id={id}
            x="0"
            y="0"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    );
  }
);

/** Tiny wave/sand line — used as a section divider decoration. */
export const SandWave = React.forwardRef<SVGSVGElement, SvgProps>(
  function SandWave({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 400 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={cn("pointer-events-none", className)}
        {...props}
      >
        <path
          d="M0 22 C 50 4, 120 4, 200 22 S 350 40, 400 22"
          stroke="var(--emerald-soft)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M0 32 C 60 18, 130 18, 200 32 S 340 46, 400 32"
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
    );
  }
);

/** Small SVG sparkle / star. */
export const Sparkle = React.forwardRef<SVGSVGElement, SvgProps>(
  function Sparkle({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn("pointer-events-none", className)}
        {...props}
      >
        <path
          d="M12 0 C 13 7, 17 11, 24 12 C 17 13, 13 17, 12 24 C 11 17, 7 13, 0 12 C 7 11, 11 7, 12 0 Z"
          fill="currentColor"
        />
      </svg>
    );
  }
);

/** Monstera-style leaf silhouette — used in card decorations. */
export const MonsteraLeaf = React.forwardRef<SVGSVGElement, SvgProps>(
  function MonsteraLeaf({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 160 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn("pointer-events-none", className)}
        {...props}
      >
        <defs>
          <linearGradient id="monstera-grad" x1="20" y1="20" x2="140" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--emerald-soft)" />
            <stop offset="1" stopColor="var(--emerald-deep)" />
          </linearGradient>
        </defs>
        <path
          d="M80 12 C 130 30, 150 80, 140 140 C 130 180, 90 195, 80 195 C 70 195, 30 180, 20 140 C 10 80, 30 30, 80 12 Z"
          fill="url(#monstera-grad)"
        />
        <path
          d="M80 12 L 80 195"
          stroke="var(--emerald-deep)"
          strokeWidth="2"
          opacity="0.4"
        />
        {/* Notches */}
        <path
          d="M80 60 L 110 80 L 80 80 Z"
          fill="var(--ivory)"
          opacity="0.92"
        />
        <path
          d="M80 80 L 50 95 L 80 95 Z"
          fill="var(--ivory)"
          opacity="0.92"
        />
        <path
          d="M80 95 L 115 115 L 80 115 Z"
          fill="var(--ivory)"
          opacity="0.92"
        />
        <path
          d="M80 115 L 45 135 L 80 135 Z"
          fill="var(--ivory)"
          opacity="0.92"
        />
      </svg>
    );
  }
);
