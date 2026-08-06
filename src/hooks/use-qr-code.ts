"use client";

import { useEffect, useState } from "react";
import { qrToDataUrl } from "@/lib/qr";

/**
 * Generate a QR code as a PNG data URL entirely client-side (no network
 * calls). The QR encodes a verification URL containing the builder's
 * unique ID. Falls back to null if the input is empty.
 */
export function useQrCode(content: string | null, size = 240): {
  qrUrl: string | null;
  isLoading: boolean;
} {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!content || typeof window === "undefined") {
      setQrUrl(null);
      return;
    }
    setIsLoading(true);
    // Defer to next tick so the UI can paint first.
    const t = setTimeout(() => {
      try {
        const url = qrToDataUrl(content, { size });
        setQrUrl(url);
      } catch (err) {
        console.error("[useQrCode] generation failed", err);
        setQrUrl(null);
      } finally {
        setIsLoading(false);
      }
    }, 50);
    return () => clearTimeout(t);
  }, [content, size]);

  return { qrUrl, isLoading };
}
