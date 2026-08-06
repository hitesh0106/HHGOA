"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Twitter,
  Loader2,
  Check,
  Sparkles,
  RotateCcw,
  Link2,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { APP_CONFIG, buildTwitterShareUrl } from "@/constants";
import { buildShareUrl } from "@/lib/share";
import { cn } from "@/lib/utils";
import type { GenerateResult } from "@/types";

interface ActionButtonsProps {
  isGenerating: boolean;
  hasGenerated: boolean;
  result: GenerateResult | null;
  onGenerate: () => void;
  onDownload: () => void;
  /** Builder data for the Copy Link feature. */
  shareData?: { name: string; role: string; builderTitle: string };
  className?: string;
}

/**
 * Action cluster: Generate → Download + Share to X + Copy Link + Regenerate.
 */
export function ActionButtons({
  isGenerating,
  hasGenerated,
  result,
  onGenerate,
  onDownload,
  shareData,
  className,
}: ActionButtonsProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = React.useCallback(() => {
    const url = buildTwitterShareUrl(APP_CONFIG.shareText);
    window.open(url, "_blank", "noopener,noreferrer,width=620,height=540");
    toast.success("Opened X — paste your PNG and post!", {
      description: "Tip: attach the hh-goa-builder-card.png you just downloaded.",
    });
  }, []);

  const handleCopyLink = React.useCallback(async () => {
    if (!shareData) {
      toast.error("Fill in your name and role first.");
      return;
    }
    const url = buildShareUrl(shareData);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Share link copied!", {
        description: "Paste it anywhere to show off your Builder ID.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: open the URL in a new window so the user can copy manually.
      window.open(url, "_blank", "noopener,noreferrer");
      toast.info("Opened share link in a new tab — copy the URL to share.");
    }
  }, [shareData]);

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      <AnimatePresence mode="wait">
        {!hasGenerated ? (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="w-full sm:w-auto"
          >
            <Button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="group relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep px-8 text-base font-semibold text-ivory shadow-tropical-lg transition-all hover:shadow-tropical-lg disabled:cursor-not-allowed sm:w-auto"
            >
              <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), oklch(0.83 0.16 85 / 0.35) 0%, transparent 60%)",
                  }}
                />
              </span>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                  Generate PNG
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="download"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap"
          >
            <Button
              type="button"
              onClick={onDownload}
              className="group relative h-14 flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep px-8 text-base font-semibold text-ivory shadow-tropical-lg transition-all hover:shadow-tropical-lg sm:flex-none"
            >
              <Download className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
              Download PNG
            </Button>
            <Button
              type="button"
              onClick={handleShare}
              variant="outline"
              className="group relative h-14 flex-1 overflow-hidden rounded-2xl border-2 border-emerald/25 bg-card px-8 text-base font-semibold text-emerald-deep transition-all hover:border-emerald/45 hover:bg-emerald/5 sm:flex-none"
            >
              <Twitter className="mr-2 h-5 w-5 transition-transform group-hover:-rotate-6" />
              Share to X
            </Button>
            <Button
              type="button"
              onClick={handleCopyLink}
              variant="outline"
              className="group relative h-14 flex-1 overflow-hidden rounded-2xl border-2 border-emerald/25 bg-card px-6 text-base font-semibold text-emerald-deep transition-all hover:border-emerald/45 hover:bg-emerald/5 sm:flex-none"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-5 w-5 text-emerald" />
                  Copied!
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Copy Link
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onGenerate}
              variant="ghost"
              className="h-14 rounded-2xl text-emerald-deep hover:bg-emerald/10 sm:px-4"
              aria-label="Regenerate image"
              title="Regenerate"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {hasGenerated && result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 self-center rounded-full bg-emerald/10 px-3 py-1.5 text-xs font-medium text-emerald-deep"
        >
          <Check className="h-3.5 w-3.5 text-emerald" />
          {result.width}×{result.height} PNG · {result.durationMs} ms
        </motion.div>
      )}
    </div>
  );
}
