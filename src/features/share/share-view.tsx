"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Download,
  Twitter,
  Sparkles,
  Users,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuilderIdCard } from "@/components/frames/builder-id-card";
import { TeamFrameCard } from "@/components/frames/team-frame-card";
import { useImageGenerator } from "@/hooks/use-image-generator";
import { APP_CONFIG, buildTwitterShareUrl, MOTION } from "@/constants";
import { cn } from "@/lib/utils";
import { FloatingDecorations } from "@/components/decor/floating-decorations";
import {
  getAvatarForShare,
  getTeamAvatarsForShare,
  getAvatarForShareAsync,
  getTeamAvatarsForShareAsync,
} from "@/lib/share";
import type { ShareData } from "@/lib/share";
import type { TeamMember } from "@/types";

interface ShareViewProps {
  data: ShareData;
  className?: string;
  onBackToGenerator: () => void;
}

type ShareTab = "team" | "m-0" | "m-1" | "m-2";

/**
 * Premium public Builder ID & Team Frame showcase page — 2-column layout.
 * Includes:
 *   · Tab Switcher Bar for Team Frame (Team Pass vs M1 ID, M2 ID, M3 ID)
 *   · Download PNG & Share to X actions (Copy Link button removed as requested)
 */
export function ShareView({ data, onBackToGenerator, className }: ShareViewProps) {
  const renderRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.46);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [teamAvatars, setTeamAvatars] = React.useState<(string | null)[]>([]);
  const [activeTab, setActiveTab] = React.useState<ShareTab>("team");

  const {
    isGenerating,
    generate,
    download,
  } = useImageGenerator({ pixelRatio: 1 });

  const isTeam = data.m === "team-frame";
  const name = data.n || "Builder";
  const role = data.r || "Builder";
  const builderTitle = data.t || "Builder of Tomorrow";

  const teamName = data.tn || "Team Pass";
  const teamTagline = data.tt || "";
  const college = data.c || "";

  const members: TeamMember[] = (data.tm || []).map((m, i) => ({
    id: `m-${i}`,
    name: m.n || `Teammate ${i + 1}`,
    role: m.r || "Builder",
    builderTitle: m.t || "AI Architect",
    avatarUrl: teamAvatars[i] || null,
  }));

  // Retrieve stored avatars from IndexedDB & localStorage
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    async function loadAvatars() {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get("share");
      const team = params.get("team") || params.get("tn") || teamName;
      const builderName = params.get("name") || params.get("n") || name;

      // 1. Team avatars retrieval
      let storedTeamAvatars: (string | null)[] = [];
      if (team) {
        storedTeamAvatars = await getTeamAvatarsForShareAsync(`team:${team}`);
      }
      if ((!storedTeamAvatars || storedTeamAvatars.length === 0) && encoded) {
        storedTeamAvatars = await getTeamAvatarsForShareAsync(encoded);
      }
      if (!storedTeamAvatars || storedTeamAvatars.length === 0) {
        storedTeamAvatars = await getTeamAvatarsForShareAsync("last-team-avatars");
      }
      if (!storedTeamAvatars || storedTeamAvatars.length === 0) {
        storedTeamAvatars = getTeamAvatarsForShare(encoded || "");
      }
      if (!cancelled && storedTeamAvatars && storedTeamAvatars.length > 0) {
        setTeamAvatars(storedTeamAvatars);
      }

      // 2. Single builder avatar retrieval
      let storedAvatar: string | null = null;
      if (builderName) {
        storedAvatar = await getAvatarForShareAsync(`builder:${builderName}`);
      }
      if (!storedAvatar && encoded) {
        storedAvatar = await getAvatarForShareAsync(encoded);
      }
      if (!storedAvatar) {
        storedAvatar = await getAvatarForShareAsync("last-avatar");
      }
      if (!storedAvatar) {
        storedAvatar = getAvatarForShare(encoded || "");
      }
      if (!cancelled && storedAvatar) {
        setAvatarUrl(storedAvatar);
      }
    }

    void loadAvatars();
    return () => {
      cancelled = true;
    };
  }, [teamName, name]);

  // Measure container and compute scale for visible card.
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

  // Auto-generate the PNG on mount so Download button is ready.
  React.useEffect(() => {
    const t = setTimeout(() => {
      void generate(renderRef.current);
    }, 400);
    return () => clearTimeout(t);
  }, [generate, activeTab]);

  const handleDownload = React.useCallback(async () => {
    const result = await generate(renderRef.current);
    if (result) {
      await download(result);
      toast.success("Download started", {
        description: `Saved as ${isTeam && activeTab === "team" ? "hh-goa-team-pass.png" : APP_CONFIG.downloadFileName}`,
      });
    } else {
      toast.error("Could not generate the image. Please try again.");
    }
  }, [generate, download, isTeam, activeTab]);

  const handleShare = React.useCallback(() => {
    const text = isTeam
      ? `🚀 Excited to build at HH Goa 2026!\n\nJust created our Team Pass for ${teamName || "our team"}.\n\nHH Goa 2026, let's build something worth remembering. 🌴⚡\n\n#FrameInGoa #HHGoa2026`
      : APP_CONFIG.shareText;
    const url = buildTwitterShareUrl(text);
    window.open(url, "_blank", "noopener,noreferrer,width=620,height=540");
    toast.success("Opened X — post with #FrameInGoa!");
  }, [isTeam, teamName]);

  // Determine active displayed node (Team Pass or Teammate 1/2/3 individual Builder ID)
  const getActiveCardNode = () => {
    if (!isTeam) {
      return (
        <BuilderIdCard
          avatarUrl={avatarUrl}
          name={name}
          role={role}
          builderTitle={builderTitle}
        />
      );
    }

    if (activeTab === "team") {
      return (
        <TeamFrameCard
          teamName={teamName}
          teamTagline={teamTagline}
          college={college}
          members={members}
        />
      );
    }

    const memberIndex = activeTab === "m-0" ? 0 : activeTab === "m-1" ? 1 : 2;
    const targetMember = members[memberIndex] || {
      name: `Teammate ${memberIndex + 1}`,
      role: "Builder",
      builderTitle: "AI Architect",
      avatarUrl: null,
    };

    return (
      <BuilderIdCard
        avatarUrl={targetMember.avatarUrl || null}
        name={targetMember.name}
        role={targetMember.role}
        builderTitle={targetMember.builderTitle}
      />
    );
  };

  return (
    <div
      className={cn(
        "relative isolate min-h-screen overflow-hidden bg-mesh-tropical",
        className
      )}
    >
      <FloatingDecorations />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[60%_40%] lg:gap-16">
          
          {/* ============ LEFT COLUMN (60%) — Large Card Poster + Tab Switcher ============ */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: MOTION.ease }}
            className="mx-auto flex w-full max-w-[560px] flex-col gap-4"
          >
            {/* 1. Requirement 1: Tab Switcher Bar in Public Share View for Team Frame */}
            {isTeam && (
              <div className="flex items-center justify-center gap-2 rounded-full border-2 border-[#1c3529] bg-[#FCF9F2] p-1.5 shadow-[3px_3px_0px_#1c3529]">
                <button
                  type="button"
                  onClick={() => setActiveTab("team")}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-black uppercase transition-all",
                    activeTab === "team"
                      ? "bg-[#1c3529] text-[#d9a726] shadow-sm"
                      : "text-[#1c3529] hover:bg-[#1c3529]/10"
                  )}
                >
                  <Users className="h-4 w-4" />
                  <span>Team Pass</span>
                </button>

                {members.map((m, idx) => {
                  const tabKey: ShareTab = idx === 0 ? "m-0" : idx === 1 ? "m-1" : "m-2";
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveTab(tabKey)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3.5 py-2 font-mono text-xs font-black uppercase transition-all",
                        activeTab === tabKey
                          ? "bg-[#1c3529] text-[#FCF9F2] shadow-sm"
                          : "text-[#1c3529] hover:bg-[#1c3529]/10"
                      )}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>M{idx + 1} ID</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div
              ref={containerRef}
              className="relative aspect-square w-full overflow-hidden rounded-[2rem] border-3 border-[#1c3529] shadow-[8px_8px_0px_#1c3529]"
            >
              <div
                style={{
                  width: 1080,
                  height: 1080,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
                className="absolute left-0 top-0"
              >
                {getActiveCardNode()}
              </div>
            </div>
          </motion.div>

          {/* ============ RIGHT COLUMN (40%) — Details ============ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: MOTION.ease, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-[#1c3529] bg-[#FCF9F2] px-3.5 py-1.5 text-[11px] font-mono font-black uppercase tracking-[0.18em] text-[#1c3529] shadow-[2px_2px_0px_#1c3529]">
              <Sparkles className="h-3.5 w-3.5 text-[#d9a726]" />
              <span>{isTeam ? "OFFICIAL TEAM PASS" : "SOLO BUILDER PASS"}</span>
              <span className="text-[#1c3529]/40">•</span>
              <span className="text-[#e04b77]">#{APP_CONFIG.hashtag}</span>
            </div>

            {/* Title / Name */}
            <h1
              className="font-serif text-4xl leading-[1.05] tracking-tight text-[#1c3529] sm:text-5xl font-black"
            >
              {isTeam ? teamName : name}
            </h1>

            {/* Subtext */}
            <p className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-[#e04b77]">
              {isTeam ? (college || teamTagline || "HH Goa 2026 Team") : role}
            </p>

            {!isTeam && (
              <p className="font-serif text-2xl text-[#1c3529] sm:text-3xl font-bold">
                ⚡ {builderTitle}
              </p>
            )}

            {/* Members summary if team */}
            {isTeam && members.length > 0 && (
              <div className="flex flex-wrap gap-2 my-1">
                {members.map((m, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#1c3529] bg-[#FCF9F2] px-3 py-1 font-mono text-xs font-bold text-[#1c3529]"
                  >
                    <Users className="h-3 w-3 text-[#d9a726]" />
                    {m.name || `Teammate ${idx + 1}`} ({m.role || "Builder"})
                  </span>
                ))}
              </div>
            )}

            {/* Short description */}
            <p className="text-base leading-relaxed text-[#1c3529]/80 font-medium">
              {isTeam
                ? `${teamName} just created their official HH Goa 2026 Team Pass!`
                : `${name} just built their HH Goa 2026 Builder ID.`}
            </p>

            {/* Event information */}
            <div className="flex items-center gap-2 font-mono text-sm text-[#1c3529] font-bold">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#d9a726]" />
              <span>See you in Goa • 28–31 Oct 2026</span>
            </div>

            {/* Action buttons — Copy Link button removed as requested */}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                onClick={handleShare}
                className="h-12 flex-1 rounded-xl border-2 border-[#1c3529] bg-[#1c3529] px-6 font-mono text-sm font-bold uppercase text-[#FCF9F2] shadow-[3px_3px_0px_#d9a726] hover:bg-[#1c3529]/90 sm:flex-none"
              >
                <Twitter className="mr-2 h-4 w-4 text-[#d9a726]" />
                Share to X
              </Button>

              <Button
                type="button"
                onClick={handleDownload}
                disabled={isGenerating}
                className="h-12 flex-1 rounded-xl border-2 border-[#1c3529] bg-[#d9a726] px-6 font-mono text-sm font-bold uppercase text-[#1c3529] shadow-[3px_3px_0px_#1c3529] hover:bg-[#d9a726]/90 disabled:opacity-60 sm:flex-none"
              >
                {isGenerating ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#1c3529]/30 border-t-[#1c3529]" />
                    Preparing…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-[#1c3529]/10 my-2" />

            {/* CTA */}
            <div>
              <p className="font-serif text-xl font-bold text-[#1c3529]">
                {isTeam ? "Want your own Team Frame?" : "Want your own Builder ID?"}
              </p>
              <p className="mt-1 text-sm text-[#1c3529]/70 font-medium">
                Generate your official HH Goa 2026 pass in seconds.
              </p>
              <Button
                type="button"
                onClick={onBackToGenerator}
                className="mt-4 h-12 rounded-xl border-2 border-[#1c3529] bg-[#e04b77] px-6 font-mono text-sm font-bold uppercase text-[#FCF9F2] shadow-[4px_4px_0px_#1c3529] hover:bg-[#e04b77]/90"
              >
                <Sparkles className="mr-2 h-4 w-4 text-[#d9a726]" />
                {isTeam ? "Create Your Own Team Frame" : "Create Your Own Builder ID"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============ HIDDEN EXPORT TARGET ============ */}
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
          {getActiveCardNode()}
        </div>
      </div>
    </div>
  );
}
