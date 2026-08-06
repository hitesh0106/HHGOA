"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
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
 * Live preview with TWO render nodes:
 *
 * 1. VISIBLE PREVIEW — scaled down 1080×1080 card with HUD overlays (Live
 *    indicator, resolution badge) for the user to see while editing.
 *
 * 2. HIDDEN EXPORT TARGET — a full-size 1080×1080 node positioned off-screen
 *    (left: -99999px) that contains ONLY the card artwork with ZERO editor
 *    overlays. html-to-image captures THIS node, so the exported PNG is
 *    always a clean poster — never a screenshot of the editor.
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

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const width = el.clientWidth;
      if (width > 0) setScale(width / 1080);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const card = mode === "profile-frame" ? (
    <ProfileFrameCard avatarUrl={avatarUrl} name={name} />
  ) : (
    <BuilderIdCard
      avatarUrl={avatarUrl}
      name={name}
      role={role}
      builderTitle={builderTitle}
    />
  );

  return (
    <div className={cn("relative", className)}>
      {/* ============ VISIBLE PREVIEW (with editor HUD) ============ */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-[480px] sm:max-w-[540px]"
      >
        <motion.div
          layout
          className="relative aspect-square w-full overflow-hidden rounded-3xl border border-emerald/15 bg-emerald-deep/5 shadow-tropical-lg"
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        >
          {/* Scaled card preview */}
          <div
            style={{
              width: 1080,
              height: 1080,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="absolute left-0 top-0"
          >
            {/* NOTE: This inner div does NOT carry renderRef. The visible
                preview is for the user only — it has HUD overlays that must
                never end up in the exported PNG. */}
            {card}
          </div>

          {/* Frame chrome */}
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
                  Crisp 1080×1080 export
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ============ HIDDEN EXPORT TARGET (clean, no overlays) ============
          This is what html-to-image captures. It is laid out at the full
          1080×1080 native resolution and positioned off-screen so it never
          interferes with the visible layout. It contains ONLY the card
          artwork — no HUD, no borders, no shadows, no editor controls. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -99999,
          top: 0,
          width: 1080,
          height: 1080,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div ref={renderRef} className="relative">
          {card}
        </div>
      </div>
    </div>
  );
}
