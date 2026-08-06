"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Maximize2, Eye } from "lucide-react";
import { ProfileFrameCard } from "@/components/frames/profile-frame-card";
import { BuilderIdCard } from "@/components/frames/builder-id-card";
import type { GeneratorMode } from "@/types";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  mode: GeneratorMode;
  avatarUrl: string | null;
  name: string;
  role: string;
  builderTitle: string;
  isGenerating: boolean;
  /** Forwarded so the parent can hand the node to html-to-image. */
  renderRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

/**
 * Live preview with a single 1080×1080 render node. The same DOM node is
 * visually scaled down for the user AND captured by html-to-image at full
 * resolution (CSS transforms do not affect html-to-image's output size —
 * it reads the layout box, not the painted box).
 */
export function LivePreview({
  mode,
  avatarUrl,
  name,
  role,
  builderTitle,
  isGenerating,
  renderRef,
  className,
}: LivePreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.42);

  // Measure the visible container and compute the scale factor so the
  // 1080×1080 render node always fits perfectly.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const width = el.clientWidth;
      if (width > 0) {
        // 1080 is the native render size.
        setScale(width / 1080);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-[480px] sm:max-w-[540px]"
      >
        <motion.div
          layout
          className="relative aspect-square w-full overflow-hidden rounded-3xl border border-emerald/15 bg-emerald-deep/5 shadow-tropical-lg"
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        >
          {/* The 1080x1080 render node. Scaled visually but laid out at
              native size — html-to-image captures this exact node. */}
          <div
            style={{
              width: 1080,
              height: 1080,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="absolute left-0 top-0"
          >
            <div ref={renderRef} className="relative">
              {mode === "profile-frame" ? (
                <ProfileFrameCard
                  avatarUrl={avatarUrl}
                  name={name}
                />
              ) : (
                <BuilderIdCard
                  avatarUrl={avatarUrl}
                  name={name}
                  role={role}
                  builderTitle={builderTitle}
                />
              )}
            </div>
          </div>

          {/* Premium frame chrome */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              boxShadow:
                "inset 0 1px 0 oklch(0.985 0.012 90 / 0.6), inset 0 -1px 0 oklch(0.42 0.11 165 / 0.18)",
            }}
          />
        </motion.div>

        {/* HUD: live indicator */}
        <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-emerald-deep/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ivory backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          Live
        </div>

        {/* HUD: resolution */}
        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-emerald-deep/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ivory backdrop-blur">
          <Maximize2 className="h-2.5 w-2.5" />
          1080 × 1080
        </div>

        {/* Generating overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 grid place-items-center rounded-3xl bg-emerald-deep/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-3 rounded-2xl bg-card/95 px-7 py-6 shadow-tropical-lg"
              >
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
                  <Loader2 className="relative h-8 w-8 animate-spin text-emerald" />
                </div>
                <p className="font-serif text-lg text-emerald-deep">
                  Rendering PNG…
                </p>
                <p className="text-xs text-muted-foreground">
                  Crisp 1080×1080 retina export
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
