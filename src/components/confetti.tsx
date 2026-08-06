"use client";

import * as React from "react";

interface ConfettiProps {
  /** When true, fires a burst of confetti pieces. */
  fire: boolean;
  /** Number of pieces to emit. */
  count?: number;
  /** Duration in ms before pieces fade. */
  durationMs?: number;
}

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
  size: number;
  shape: "rect" | "circle" | "triangle";
}

const COLORS = [
  "#F5C04A", // gold
  "#E8A93A", // gold-deep
  "#FF6B6B", // coral
  "#2E8B57", // emerald-soft
  "#1A6B47", // emerald
  "#06301E", // forest
  "#FFE7A0", // gold-soft
  "#46C7A6", // platinum
];

const SHAPES: Piece["shape"][] = ["rect", "circle", "triangle"];

/**
 * Lightweight confetti burst. Pure CSS animation — no canvas, no physics
 * library. Mount this once near the root and toggle `fire` to trigger.
 */
export function Confetti({ fire, count = 80, durationMs = 2400 }: ConfettiProps) {
  const [pieces, setPieces] = React.useState<Piece[]>([]);

  React.useEffect(() => {
    if (!fire) return;
    const next: Piece[] = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 100,
      delay: Math.random() * 200,
      duration: durationMs + Math.random() * 600,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      size: 8 + Math.random() * 8,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    }));
    setPieces(next);
    const t = setTimeout(() => setPieces([]), durationMs + 600);
    return () => clearTimeout(t);
  }, [fire, count, durationMs]);

  if (pieces.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.shape === "rect" ? p.size * 1.4 : p.size,
            background:
              p.shape === "triangle" ? "transparent" : p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "rect" ? 2 : 0,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.duration}ms`,
            transform: `rotate(${p.rotation}deg)`,
            borderLeft:
              p.shape === "triangle"
                ? `${p.size / 2}px solid transparent`
                : undefined,
            borderRight:
              p.shape === "triangle"
                ? `${p.size / 2}px solid transparent`
                : undefined,
            borderBottom:
              p.shape === "triangle"
                ? `${p.size}px solid ${p.color}`
                : undefined,
            backgroundClip: "border-box",
          }}
        />
      ))}
    </div>
  );
}
