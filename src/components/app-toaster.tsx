"use client";

import { useEffect, useState } from "react";
import { Toaster as SonnerToaster } from "sonner";

/**
 * Dedicated client Toaster wrapper. Renders Sonner's Toaster at the
 * app root so any toast.success / toast.error call anywhere in the tree
 * can display.
 *
 * Why a wrapper? Sonner's Toaster accesses `document` and `window` at
 * mount, which can race with Next.js SSR. We gate the render on a
 * `mounted` flag set in useEffect so the Toaster only mounts on the
 * client after hydration.
 */
export function AppToaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  if (!mounted) return null;

  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      theme="light"
      toastOptions={{
        style: {
          background: "var(--popover)",
          color: "var(--popover-foreground)",
          border: "1px solid var(--border)",
        },
      }}
    />
  );
}
