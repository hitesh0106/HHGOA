"use client";

import * as React from "react";
import { SiteNav } from "@/components/sections/site-nav";
import { Hero } from "@/components/sections/hero";
import { Footer } from "@/components/sections/footer";
import { Studio } from "@/features/studio";
import { ShareView } from "@/features/share/share-view";
import { decodeShareData } from "@/lib/share";

/**
 * Single-page app with two views:
 *
 * 1. GENERATOR (default) — Hero + Studio (upload → crop → generate → download → share)
 * 2. SHARE VIEW (?share=<encoded>) — Premium showcase page when someone opens a copied link
 *
 * The share param contains base64-encoded builder data (name, role, title).
 */
export default function Home() {
  const [shareData, setShareData] = React.useState<
    ReturnType<typeof decodeShareData> | null
  >(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const checkShare = () => {
      const params = new URLSearchParams(window.location.search);
      const share = params.get("share");
      if (share) {
        const decoded = decodeShareData(share);
        if (decoded) {
          setShareData(decoded);
          return;
        }
      }
      setShareData(null);
    };
    checkShare();
    // Listen for browser back/forward so the view switches correctly.
    window.addEventListener("popstate", checkShare);
    return () => window.removeEventListener("popstate", checkShare);
  }, []);

  const handleBackToGenerator = React.useCallback(() => {
    // Clear the share param and switch to generator view.
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("share");
      window.history.pushState({}, "", url.toString());
    }
    setShareData(null);
    // Scroll to top.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Share view — premium showcase page
  if (shareData) {
    return (
      <div className="relative flex min-h-screen flex-col bg-background">
        <SiteNav />
        <main className="flex-1">
          <ShareView data={shareData} onBackToGenerator={handleBackToGenerator} />
        </main>
        <Footer />
      </div>
    );
  }

  // Generator view — default
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <Studio />
      </main>
      <Footer />
    </div>
  );
}
