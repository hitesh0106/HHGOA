"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

/**
 * Thin wrapper around Sonner's Toaster. We intentionally skip the
 * `next-themes` hook so the toaster renders without requiring a
 * ThemeProvider at the root. The app is single-theme (light) for now.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
