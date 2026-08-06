"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { APP_CONFIG } from "@/constants";
import { sleep, triggerDownload } from "@/lib/utils";
import type { GenerateResult } from "@/types";

export interface UseImageGeneratorOptions {
  /** Pixel filter scale — pass >1 to render at retina resolution. */
  pixelRatio?: number;
  /** Optional filename override. */
  fileName?: string;
}

export interface UseImageGeneratorReturn {
  isGenerating: boolean;
  hasGenerated: boolean;
  lastResult: GenerateResult | null;
  error: string | null;
  generate: (node: HTMLElement | null) => Promise<GenerateResult | null>;
  download: (result?: GenerateResult | null) => Promise<void>;
  reset: () => void;
}

/**
 * Wraps html-to-image for premium PNG export. We deliberately render at
 * 2× pixel ratio to guarantee retina-quality 1080×1080 output without
 * raster artifacts, then return both the data URL and a download helper.
 */
export function useImageGenerator(
  options: UseImageGeneratorOptions = {}
): UseImageGeneratorReturn {
  const { pixelRatio = 2, fileName = APP_CONFIG.downloadFileName } = options;
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [lastResult, setLastResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const generatingRef = useRef(false);

  const generate = useCallback(
    async (node: HTMLElement | null): Promise<GenerateResult | null> => {
      if (!node) return null;
      if (generatingRef.current) return null;
      generatingRef.current = true;
      setIsGenerating(true);
      setError(null);
      const startedAt = performance.now();

      try {
        // Two-pass approach: first pass warms up fonts/images, second pass
        // guarantees all web fonts have settled for crisp output.
        await toPng(node, {
          pixelRatio,
          cacheBust: true,
          backgroundColor: undefined,
          skipFonts: false,
        }).catch(() => null);

        // Small breath for layout/animation settle.
        await sleep(60);

        const dataUrl = await toPng(node, {
          pixelRatio,
          cacheBust: true,
          backgroundColor: undefined,
          skipFonts: false,
          quality: 1,
        });

        const durationMs = Math.round(performance.now() - startedAt);
        const result: GenerateResult = {
          dataUrl,
          fileName,
          width: APP_CONFIG.outputSize,
          height: APP_CONFIG.outputSize,
          durationMs,
        };
        setLastResult(result);
        setHasGenerated(true);
        return result;
      } catch (err) {
        console.error("[useImageGenerator] generation failed", err);
        const message =
          err instanceof Error
            ? err.message
            : "Image generation failed. Please try again.";
        setError(message);
        return null;
      } finally {
        setIsGenerating(false);
        generatingRef.current = false;
      }
    },
    [pixelRatio, fileName]
  );

  const download = useCallback(
    async (result?: GenerateResult | null) => {
      const target = result ?? lastResult;
      if (!target) return;
      try {
        triggerDownload(target.dataUrl, target.fileName);
      } catch (err) {
        console.error("[useImageGenerator] download failed", err);
        setError(
          err instanceof Error
            ? err.message
            : "Download failed. Please try again."
        );
      }
    },
    [lastResult]
  );

  const reset = useCallback(() => {
    setHasGenerated(false);
    setLastResult(null);
    setError(null);
  }, []);

  return {
    isGenerating,
    hasGenerated,
    lastResult,
    error,
    generate,
    download,
    reset,
  };
}
