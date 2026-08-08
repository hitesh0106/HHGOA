"use client";

import * as React from "react";
import { SiteNav } from "@/components/sections/site-nav";
import { Footer } from "@/components/sections/footer";
import { Studio } from "@/features/studio";
import { ShareView } from "@/features/share/share-view";
import { decodeShareDataFromUrl } from "@/lib/share";

/**
 * Single-page app with two views:
 *
 * 1. GENERATOR (default) — Studio (upload → crop → generate → download → share)
 * 2. SHARE VIEW (?team=Zedda or ?name=Hitesh or ?share=...) — Showcase page
 */
export default function Home() {
  const [shareData, setShareData] = React.useState<
    ReturnType<typeof decodeShareDataFromUrl> | null
  >(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const checkShare = () => {
      const params = new URLSearchParams(window.location.search);
      const decoded = decodeShareDataFromUrl(params);
      setShareData(decoded);
    };
    checkShare();
    window.addEventListener("popstate", checkShare);
    return () => window.removeEventListener("popstate", checkShare);
  }, []);

  const handleBackToGenerator = React.useCallback(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.search = "";
      window.history.pushState({}, "", url.toString());
    }
    setShareData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Share view — public showcase page
  if (shareData) {
    return (
      <div className="relative min-h-screen bg-background">
        <ShareView data={shareData} onBackToGenerator={handleBackToGenerator} />
      </div>
    );
  }

  // Generator view — default
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <SiteNav />
      {/* Header Spacer to guarantee content starts cleanly below sticky navbar */}
      <div className="h-16 sm:h-20 shrink-0" aria-hidden="true" />
      <main className="flex-1 flex flex-col justify-between">
        <Studio />
      </main>
      <Footer />
    </div>
  );
}
