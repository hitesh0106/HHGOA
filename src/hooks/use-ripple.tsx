"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Returns props to spread on a button to enable premium ripple-on-click.
 * Each click spawns a single ripple element that auto-removes after the
 * animation completes.
 *
 * Usage:
 *   const { onClick, ripples } = useRipple();
 *   <button onClick={onClick} className="ripple-container">
 *     {ripples.map(r => <span key={r.id} className="ripple-effect" ... />)}
 *     Label
 *   </button>
 */
export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id, x, y, size }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 700);
    },
    []
  );

  const renderRipples = useCallback(
    (className?: string) => (
      <span
        aria-hidden="true"
        className={cn(
          "ripple-container pointer-events-none absolute inset-0",
          className
        )}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="ripple-effect"
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
            }}
          />
        ))}
      </span>
    ),
    [ripples]
  );

  return { onClick, ripples, renderRipples };
}
