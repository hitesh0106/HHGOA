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
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_CONFIG, buildTwitterShareUrl } from "@/constants";
import { cn, triggerDownload } from "@/lib/utils";
import { useRipple } from "@/hooks/use-ripple";
import type { GenerateResult } from "@/types";

interface ActionButtonsProps {
  isGenerating: boolean;
  hasGenerated: boolean;
  result: GenerateResult | null;
  onGenerate: () => void;
  onDownload: (options?: { transparent?: boolean; scale?: number }) => void;
  className?: string;
}

/**
 * Premium action cluster: Generate / Download (with 2× + transparent
 * options) / Share to X. Includes ripple effects and animated transitions
 * between states.
 */
export function ActionButtons({
  isGenerating,
  hasGenerated,
  result,
  onGenerate,
  onDownload,
  className,
}: ActionButtonsProps) {
  const generateRipple = useRipple();
  const downloadRipple = useRipple();

  const handleShare = React.useCallback(() => {
    const url = buildTwitterShareUrl(APP_CONFIG.shareText);
    window.open(url, "_blank", "noopener,noreferrer,width=620,height=540");
    toast.success("Opened X — paste your PNG and post!", {
      description: `Caption includes ${APP_CONFIG.hashtag}.`,
    });
  }, []);

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
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
              onClick={(e) => {
                generateRipple.onClick(e);
                onGenerate();
              }}
              disabled={isGenerating}
              className="group relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep px-8 text-base font-semibold text-ivory shadow-luxe-lg transition-all hover:shadow-luxe-xl disabled:cursor-not-allowed sm:w-auto"
            >
              <generateRipple.renderRipples />
              <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), oklch(0.84 0.14 80 / 0.35) 0%, transparent 60%)",
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
                  <Sparkles className="relative mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                  <span className="relative">Generate Builder ID</span>
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
            className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch"
          >
            {/* Download split button — primary + dropdown for 2x / transparent */}
            <div className="flex overflow-hidden rounded-2xl shadow-luxe-lg">
              <Button
                type="button"
                onClick={(e) => {
                  downloadRipple.onClick(e);
                  onDownload();
                }}
                className="group relative h-14 flex-1 overflow-hidden rounded-none bg-gradient-to-br from-emerald to-emerald-deep px-7 text-base font-semibold text-ivory transition-all hover:shadow-luxe-xl sm:flex-none"
              >
                <downloadRipple.renderRipples />
                <Download className="relative mr-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                <span className="relative">Download PNG</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    className="h-14 rounded-none border-l border-emerald-deep/40 bg-emerald-deep px-3 text-ivory hover:bg-emerald-deep/90"
                    aria-label="More download options"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => onDownload({ scale: 1 })}
                    className="cursor-pointer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Standard (1× · 1080)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDownload({ scale: 2 })}
                    className="cursor-pointer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Retina (2× · 2160)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDownload({ transparent: true })}
                    className="cursor-pointer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Transparent BG
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Share to X */}
            <Button
              type="button"
              onClick={handleShare}
              variant="outline"
              className="group relative h-14 flex-1 overflow-hidden rounded-2xl border-2 border-emerald/25 bg-card px-7 text-base font-semibold text-emerald-deep transition-all hover:border-emerald/45 hover:bg-emerald/5 sm:flex-none"
            >
              <Twitter className="mr-2 h-5 w-5 transition-transform group-hover:-rotate-6" />
              Share to X
            </Button>

            {/* Regenerate */}
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
