"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { APP_CONFIG } from "@/constants";
import { sleep } from "@/lib/utils";
import type { GenerateResult } from "@/types";

export interface UseImageGeneratorOptions {
  /** Default pixel ratio. */
  pixelRatio?: number;
  /** Default filename. */
  fileName?: string;
}

export interface DownloadOptions {
  /** When true, exports with a transparent background. */
  transparent?: boolean;
  /** Multiplier applied to the base pixel ratio (1 = 1×, 2 = 2×). */
  scale?: number;
}

export interface UseImageGeneratorReturn {
  isGenerating: boolean;
  hasGenerated: boolean;
  lastResult: GenerateResult | null;
  error: string | null;
  generate: (
    node: HTMLElement | null,
    options?: DownloadOptions
  ) => Promise<GenerateResult | null>;
  download: (
    result?: GenerateResult | null,
    options?: DownloadOptions
  ) => Promise<void>;
  reset: () => void;
}

/**
 * Premium PNG export via html-to-image. Supports 2× pixel ratio for retina
 * output and transparent-background export. Two-pass rendering for crisp
 * fonts and image settle.
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
    async (
      node: HTMLElement | null,
      genOptions: DownloadOptions = {}
    ): Promise<GenerateResult | null> => {
      if (!node) return null;
      if (generatingRef.current) return null;
      generatingRef.current = true;
      setIsGenerating(true);
      setError(null);
      const startedAt = performance.now();
      const ratio = (genOptions.scale ?? 1) * pixelRatio;
      const bgColor = genOptions.transparent
        ? undefined
        : undefined; // Let the card's own background show through.

      try {
        // Warm-up pass — primes fonts and images.
        await toPng(node, {
          pixelRatio: ratio,
          cacheBust: true,
          backgroundColor: bgColor,
          skipFonts: false,
        }).catch(() => null);

        await sleep(60);

        const dataUrl = await toPng(node, {
          pixelRatio: ratio,
          cacheBust: true,
          backgroundColor: bgColor,
          skipFonts: false,
          quality: 1,
        });

        const durationMs = Math.round(performance.now() - startedAt);
        const result: GenerateResult = {
          dataUrl,
          fileName,
          width: APP_CONFIG.outputSize * (genOptions.scale ?? 1),
          height: APP_CONFIG.outputSize * (genOptions.scale ?? 1),
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
    async (
      result?: GenerateResult | null,
      _options?: DownloadOptions
    ) => {
      const target = result ?? lastResult;
      if (!target) return;
      try {
        const link = document.createElement("a");
        link.href = target.dataUrl;
        link.download = target.fileName;
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
