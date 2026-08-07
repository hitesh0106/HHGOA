"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Download,
  Twitter,
  Link2,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderIdCard } from "@/components/frames/builder-id-card";
import { useImageGenerator } from "@/hooks/use-image-generator";
import { APP_CONFIG, buildTwitterShareUrl, MOTION } from "@/constants";
import { cn } from "@/lib/utils";
import { FloatingDecorations } from "@/components/decor/floating-decorations";
import { getAvatarForShare } from "@/lib/share";
import type { ShareData } from "@/lib/share";

interface ShareViewProps {
  data: ShareData;
  className?: string;
  onBackToGenerator: () => void;
}

/**
 * Premium public Builder ID showcase page — 2-column layout.
 *
 * LEFT (60%): Large Builder ID card with floating shadow.
 * RIGHT (40%): Badge → Name → Stack → Title → Description → Event info →
 *              Actions → Divider → CTA.
 *
 * NO top nav, NO footer, NO back button. The focus stays on the Builder ID.
 * Mobile-first: stacks vertically on small screens.
 */
export function ShareView({ data, onBackToGenerator, className }: ShareViewProps) {
  const renderRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.46);
  const [copied, setCopied] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const {
    isGenerating,
    generate,
    download,
  } = useImageGenerator({ pixelRatio: 1 });

  const name = data.n || "Builder";
  const role = data.r || "Builder";
  const builderTitle = data.t || "Builder of Tomorrow";

  // Retrieve the stored avatar from localStorage (if the share link was
  // opened on the same browser where it was generated).
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("share");
    if (encoded) {
      const stored = getAvatarForShare(encoded);
      if (stored) setAvatarUrl(stored);
    }
  }, []);

  // Measure container and compute scale for the visible card.
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
    }, 400);
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
    <div
      className={cn(
        "relative isolate min-h-screen overflow-hidden bg-mesh-tropical",
        className
      )}
    >
      <FloatingDecorations />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[60%_40%] lg:gap-16">
          {/* ============ LEFT COLUMN (60%) — Large Builder ID card ============ */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: MOTION.ease }}
            className="mx-auto w-full max-w-[560px]"
          >
            <div
              ref={containerRef}
              className="relative aspect-square w-full overflow-hidden rounded-[2rem] shadow-tropical-lg"
              style={{ boxShadow: "0 30px 80px rgba(15, 81, 50, 0.25), 0 12px 32px rgba(15, 81, 50, 0.15)" }}
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
                  avatarUrl={avatarUrl}
                  name={name}
                  role={role}
                  builderTitle={builderTitle}
                />
              </div>
            </div>
          </motion.div>

          {/* ============ RIGHT COLUMN (40%) — Profile details ============ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: MOTION.ease, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            {/* 1. Small badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald/20 bg-card/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-deep backdrop-blur">
              <Sparkles className="h-3 w-3 text-gold" />
              <span>BUILDER ID CARD</span>
              <span className="text-emerald/40">•</span>
              <span className="text-gold">#{APP_CONFIG.hashtag}</span>
            </div>

            {/* 2. Large Builder Name */}
            <h1
              className="font-serif text-4xl leading-[1.05] tracking-tight text-emerald-deep sm:text-5xl"
              style={{ fontWeight: 600 }}
            >
              {name}
            </h1>

            {/* 3. Stack / Role */}
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {role}
            </p>

            {/* 4. Builder Title */}
            <p className="font-serif text-2xl text-gradient-tropical sm:text-3xl">
              {builderTitle}
            </p>

            {/* 5. Short description */}
            <p className="text-base leading-relaxed text-muted-foreground">
              {name} just built their HH Goa 2026 Builder ID.
            </p>

            {/* 6. Event information */}
            <div className="flex items-center gap-2 text-sm text-emerald-deep/70">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="font-medium">
                See you in Goa • 28–31 Oct 2026
              </span>
            </div>

            {/* 7. Action buttons — horizontal row */}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/* Share to X — primary */}
              <Button
                type="button"
                onClick={handleShare}
                className="h-12 flex-1 rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep px-6 text-sm font-semibold text-ivory shadow-tropical-lg transition-all hover:shadow-tropical-lg sm:flex-none"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Share to X
              </Button>
              {/* Download PNG — secondary */}
              <Button
                type="button"
                onClick={handleDownload}
                disabled={isGenerating}
                className="h-12 flex-1 rounded-2xl bg-card px-6 text-sm font-semibold text-emerald-deep shadow-tropical transition-all hover:bg-emerald/5 disabled:opacity-60 sm:flex-none"
              >
                {isGenerating ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald/30 border-t-emerald" />
                    Preparing…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </>
                )}
              </Button>
              {/* Copy Link — outline */}
              <Button
                type="button"
                onClick={handleCopyLink}
                variant="outline"
                className="h-12 flex-1 rounded-2xl border-2 border-emerald/25 bg-transparent px-6 text-sm font-semibold text-emerald-deep transition-all hover:border-emerald/45 hover:bg-emerald/5 sm:flex-none"
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
            </div>

            {/* 8. Divider */}
            <div className="divider-luxe my-2" />

            {/* 9. CTA */}
            <div>
              <p className="font-serif text-xl text-emerald-deep">
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
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============ HIDDEN EXPORT TARGET (clean, no overlays) ============ */}
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
            avatarUrl={avatarUrl}
            name={name}
            role={role}
            builderTitle={builderTitle}
          />
        </div>
      </div>
    </div>
  );
}
