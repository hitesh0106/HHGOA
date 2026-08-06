"use client";

import * as React from "react";
import { SiteNav } from "@/components/sections/site-nav";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Examples } from "@/components/sections/examples";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { Studio } from "@/features/studio";

/**
 * Single-page composition. No routing — everything lives on `/` per the
 * project spec. Smooth-scroll anchors connect hero CTAs to the studio.
 */
export default function Home() {
  const studioRef = React.useRef<HTMLDivElement>(null);

  const scrollToStudio = React.useCallback(() => {
    const el = document.getElementById("studio");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const scrollToExamples = React.useCallback(() => {
    const el = document.getElementById("examples");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <SiteNav onStart={scrollToStudio} />

      <main className="flex-1">
        <Hero onStart={scrollToStudio} onSeeExamples={scrollToExamples} />
        <Features />
        <div ref={studioRef}>
          <Studio />
        </div>
        <Examples />
        <Faq />
      </main>

      <Footer />
    </div>
  );
}
