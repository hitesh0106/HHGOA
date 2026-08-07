"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Download, Twitter, Link2, Check, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderIdCard } from "@/components/frames/builder-id-card";
import { useImageGenerator } from "@/hooks/use-image-generator";
import { APP_CONFIG, buildTwitterShareUrl } from "@/constants";
import { cn } from "@/lib/utils";
import { FloatingDecorations } from "@/components/decor/floating-decorations";
import type { ShareData } from "@/lib/share";

interface ShareViewProps {
  data: ShareData;
  className?: string;
  onBackToGenerator: () => void;
}

/**
 * Premium public Builder ID showcase page.
 *
 * When someone opens a `?share=...` link, they see this page — a clean
 * digital profile with:
 *   · Large Builder ID card (initials avatar since photo can't be in URL)
 *   · Builder Name + Stack + Title
 *   · HH Goa branding + event dates
 *   · Download PNG + Share/Repost to X + Copy Link buttons
 *   · "Create Your Own Builder ID" CTA
 *
 * No editing controls. No form fields. No upload UI. Just a showcase.
 */
export function ShareView({ data, onBackToGenerator, className }: ShareViewProps) {
  const renderRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.46);
  const [copied, setCopied] = React.useState(false);
  const {
    isGenerating,
    generate,
    download,
  } = useImageGenerator({ pixelRatio: 1 });

  const name = data.n || "Builder";
  const role = data.r || "Builder";
  const builderTitle = data.t || "Builder of Tomorrow";

  // Measure container and compute scale for the visible preview.
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

  // Auto-generate the PNG on mount so the Download button is ready.
  React.useEffect(() => {
    const t = setTimeout(() => {
      void generate(renderRef.current);
    }, 300);
    return () => clearTimeout(t);
  }, [generate]);

  const handleDownload = React.useCallback(async () => {
    const result = await generate(renderRef.current);
    if (result) {
      await download(result);
      toast.success("Download started", {
        description: `Saved as ${APP_CONFIG.downloadFileName}`,
      });
    } else {
      toast.error("Could not generate the image. Please try again.");
    }
  }, [generate, download]);

  const handleShare = React.useCallback(() => {
    const url = buildTwitterShareUrl(APP_CONFIG.shareText);
    window.open(url, "_blank", "noopener,noreferrer,width=620,height=540");
    toast.success("Opened X — post with #FrameInGoa!");
  }, []);

  const handleCopyLink = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy. Copy the URL from your browser's address bar.");
    }
  }, []);

  return (
    <div className={cn("relative isolate min-h-screen overflow-hidden bg-mesh-tropical", className)}>
      <FloatingDecorations />

      <div className="relative mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
        {/* Back link */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onBackToGenerator}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-emerald-deep/70 transition-colors hover:text-emerald-deep"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Generator
        </motion.button>

        {/* Card + details wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[480px] sm:max-w-[540px]"
        >
          {/* Scaled preview of the Builder ID card */}
          <div
            ref={containerRef}
            className="relative aspect-square w-full overflow-hidden rounded-3xl border border-emerald/15 shadow-tropical-lg"
          >
            <div
              style={{
                width: 1080,
                height: 1080,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
              className="absolute left-0 top-0"
            >
              <BuilderIdCard
                avatarUrl={null}
                name={name}
                role={role}
                builderTitle={builderTitle}
              />
            </div>
          </div>

          {/* Profile details below card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <h1
              className="font-serif text-3xl tracking-tight text-emerald-deep sm:text-4xl"
              style={{ fontWeight: 600 }}
            >
              {name}
            </h1>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-muted-foreground">
              {role}
            </p>
            <p className="mt-4 font-serif text-xl text-gradient-tropical sm:text-2xl">
              {builderTitle}
            </p>

            {/* HH Goa branding + event dates */}
            <div className="mt-6 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-emerald-deep/60">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-gold" />
                HH Goa 2026
              </span>
              <span className="h-3 w-px bg-emerald/20" />
              <span>Goa · Builders Edition</span>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="h-12 flex-1 rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep px-6 text-sm font-semibold text-ivory shadow-tropical-lg transition-all hover:shadow-tropical-lg disabled:opacity-60 sm:flex-none"
            >
              {isGenerating ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
                  Preparing…
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PNG
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={handleShare}
              variant="outline"
              className="h-12 flex-1 rounded-2xl border-2 border-emerald/25 bg-card px-6 text-sm font-semibold text-emerald-deep transition-all hover:border-emerald/45 hover:bg-emerald/5 sm:flex-none"
            >
              <Twitter className="mr-2 h-4 w-4" />
              Share to X
            </Button>
            <Button
              type="button"
              onClick={handleCopyLink}
              variant="outline"
              className="h-12 flex-1 rounded-2xl border-2 border-emerald/25 bg-card px-6 text-sm font-semibold text-emerald-deep transition-all hover:border-emerald/45 hover:bg-emerald/5 sm:flex-none"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-emerald" />
                  Copied!
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10 rounded-2xl border border-emerald/15 bg-card/70 p-6 text-center shadow-tropical"
          >
            <p className="font-serif text-lg text-emerald-deep">
              Want your own Builder ID?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a photo and generate one in seconds.
            </p>
            <Button
              type="button"
              onClick={onBackToGenerator}
              className="mt-4 h-11 rounded-full bg-gradient-to-br from-emerald to-emerald-deep px-6 text-sm font-semibold text-ivory shadow-tropical"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Create Your Own Builder ID
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* ============ HIDDEN EXPORT TARGET (clean, no overlays) ============
          Off-screen full-size 1080×1080 node for pixel-perfect PNG export.
          Contains ONLY the card artwork — no preview scaling, no shadows,
          no editor chrome. */}
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
          <BuilderIdCard
            avatarUrl={null}
            name={name}
            role={role}
            builderTitle={builderTitle}
          />
        </div>
      </div>
    </div>
  );
}
