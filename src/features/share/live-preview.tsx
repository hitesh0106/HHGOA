"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Users, User } from "lucide-react";
import { ProfileFrameCard } from "@/components/frames/profile-frame-card";
import { BuilderIdCard } from "@/components/frames/builder-id-card";
import { TeamFrameCard } from "@/components/frames/team-frame-card";
import type { GeneratorMode, TeamMember } from "@/types";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  mode: GeneratorMode;
  avatarUrl: string | null;
  name: string;
  role: string;
  builderTitle: string;
  twitter?: string;
  // Team Frame properties
  teamName?: string;
  teamTagline?: string;
  college?: string;
  teamMembers?: TeamMember[];
  isGenerating: boolean;
  /** Forwarded so the parent can hand the node to html-to-image. */
  renderRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export function LivePreview({
  mode,
  avatarUrl,
  name,
  role,
  builderTitle,
  twitter = "",
  teamName = "",
  teamTagline = "",
  college = "",
  teamMembers = [],
  isGenerating,
  renderRef,
  className,
}: LivePreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.42);

  // For Team Frame mode: allow toggling preview between Combined Team Pass and Individual Member IDs
  const [activeTeamTab, setActiveTeamTab] = React.useState<"team" | number>("team");

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const width = el.clientWidth;
      if (width > 0) setScale(width / 1080);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Determine card node based on mode and active tab
  let card: React.ReactNode;
  if (mode === "team-frame") {
    if (activeTeamTab === "team") {
      card = (
        <TeamFrameCard
          teamName={teamName}
          teamTagline={teamTagline}
          college={college}
          members={teamMembers}
        />
      );
    } else {
      const m = teamMembers[activeTeamTab as number];
      card = m ? (
        <BuilderIdCard
          avatarUrl={m.avatarUrl || null}
          name={m.name || `Teammate ${(activeTeamTab as number) + 1}`}
          role={m.role || "Builder"}
          builderTitle={m.builderTitle || "AI Architect"}
          twitter={m.twitter}
        />
      ) : (
        <TeamFrameCard
          teamName={teamName}
          teamTagline={teamTagline}
          college={college}
          members={teamMembers}
        />
      );
    }
  } else if (mode === "profile-frame") {
    card = <ProfileFrameCard avatarUrl={avatarUrl} name={name} />;
  } else {
    card = (
      <BuilderIdCard
        avatarUrl={avatarUrl}
        name={name}
        role={role}
        builderTitle={builderTitle}
        twitter={twitter}
      />
    );
  }

  return (
    <div className={cn("relative flex flex-col gap-3", className)}>
      {/* Team Frame Mode Tabs: Toggle between Team Pass and Individual Member Passes */}
      {mode === "team-frame" && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border-2 border-[#1c3529] bg-[#FFFFFF] p-1.5 shadow-[3px_3px_0px_#1c3529]">
          <button
            type="button"
            onClick={() => setActiveTeamTab("team")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border-2 border-[#1c3529] px-3 py-1.5 font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#1c3529]",
              activeTeamTab === "team"
                ? "bg-[#1c3529] text-[#FCF9F2]"
                : "bg-[#FCF9F2] text-[#1c3529] hover:bg-[#FFFFFF]"
            )}
          >
            <Users className="h-3.5 w-3.5 text-[#d9a726]" />
            Team Pass
          </button>

          {teamMembers.map((m, idx) => (
            <button
              key={m.id || idx}
              type="button"
              onClick={() => setActiveTeamTab(idx)}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border-2 border-[#1c3529] px-3 py-1.5 font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#1c3529]",
                activeTeamTab === idx
                  ? "bg-[#1c3529] text-[#FCF9F2]"
                  : "bg-[#FCF9F2] text-[#1c3529] hover:bg-[#FFFFFF]"
              )}
            >
              <User className="h-3 w-3" />
              {m.name ? m.name.split(" ")[0] : `M${idx + 1}`} ID
            </button>
          ))}
        </div>
      )}

      {/* ============ VISIBLE PREVIEW (with editor HUD) ============ */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-[480px] sm:max-w-[540px]"
      >
        <motion.div
          layout
          className="relative aspect-square w-full overflow-hidden rounded-3xl border border-emerald/15 bg-emerald-deep/5 shadow-tropical-lg"
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        >
          {/* Scaled card preview */}
          <div
            style={{
              width: 1080,
              height: 1080,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="absolute left-0 top-0"
          >
            {card}
          </div>

          {/* Frame chrome */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              boxShadow:
                "inset 0 1px 0 oklch(0.985 0.012 90 / 0.6), inset 0 -1px 0 oklch(0.42 0.11 165 / 0.18)",
            }}
          />
        </motion.div>

        {/* HUD: live indicator */}
        <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-emerald-deep/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ivory backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          Live
        </div>

        {/* HUD: resolution */}
        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-emerald-deep/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ivory backdrop-blur">
          1080 × 1080
        </div>

        {/* Generating overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 grid place-items-center rounded-3xl bg-emerald-deep/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center gap-3 rounded-2xl bg-card/95 px-7 py-6 shadow-tropical-lg"
              >
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
                  <Loader2 className="relative h-8 w-8 animate-spin text-emerald" />
                </div>
                <p className="font-serif text-lg text-emerald-deep">
                  Rendering PNG…
                </p>
                <p className="text-xs text-muted-foreground">
                  Crisp 1080×1080 export
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ============ HIDDEN EXPORT TARGET (clean, no overlays) ============ */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -99999,
          top: 0,
          width: 1080,
          height: 1080,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div ref={renderRef} className="relative">
          {card}
        </div>
      </div>
    </div>
  );
}
