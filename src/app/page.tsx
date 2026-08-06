"use client";

import * as React from "react";
import { SiteNav } from "@/components/sections/site-nav";
import { Hero } from "@/components/sections/hero";
import { Footer } from "@/components/sections/footer";
import { Studio } from "@/features/studio";

/**
 * Single-page composition focused on the generator flow only:
 * Hero → Studio (upload → crop → generate → download → share to X).
 *
 * No login wall, no marketing fluff — just the tool, start to finish.
 */
export default function Home() {
  const scrollToStudio = React.useCallback(() => {
    const el = document.getElementById("studio");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <SiteNav onStart={scrollToStudio} />

      <main className="flex-1">
        <Hero onStart={scrollToStudio} />
        <Studio />
      </main>

      <Footer />
    </div>
  );
}
