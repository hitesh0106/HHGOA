"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Twitter,
  Loader2,
  Check,
  Sparkles,
  RotateCcw,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { APP_CONFIG, buildTwitterShareUrl } from "@/constants";
import {
  buildShareUrl,
  encodeShareData,
  storeAvatarForShare,
  storeTeamAvatarsForShare,
} from "@/lib/share";
import type { ShareData } from "@/lib/share";
import { cn } from "@/lib/utils";
import type { GenerateResult, GeneratorMode, TeamMember } from "@/types";

interface ActionButtonsProps {
  isGenerating: boolean;
  hasGenerated: boolean;
  result: GenerateResult | null;
  onGenerate: () => void;
  onDownload: () => void;
  mode?: GeneratorMode;
  shareData?: { name: string; role: string; builderTitle: string };
  teamName?: string;
  teamTagline?: string;
  college?: string;
  teamMembers?: TeamMember[];
  avatarUrl?: string | null;
  className?: string;
}

export function ActionButtons({
  isGenerating,
  hasGenerated,
  result,
  onGenerate,
  onDownload,
  mode = "builder-id",
  shareData,
  teamName,
  teamTagline,
  college,
  teamMembers,
  avatarUrl,
  className,
}: ActionButtonsProps) {
  const [copied, setCopied] = React.useState(false);

  // Synchronize avatars to localStorage as soon as available
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (mode === "team-frame" && teamMembers && teamMembers.length > 0) {
      const avatars = teamMembers.map((m) => m.avatarUrl || null);
      if (avatars.some((a) => a !== null)) {
        storeTeamAvatarsForShare(`team:${teamName || "pass"}`, avatars);
        storeTeamAvatarsForShare("last-team-avatars", avatars);
      }
    } else if (avatarUrl) {
      storeAvatarForShare(`builder:${shareData?.name || "builder"}`, avatarUrl);
      storeAvatarForShare("last-avatar", avatarUrl);
    }
  }, [mode, teamName, teamMembers, avatarUrl, shareData]);

  const handleShare = React.useCallback(() => {
    const text =
      mode === "team-frame"
        ? `🚀 Excited to build at HH Goa 2026! Just created our Team Pass for ${teamName || "our team"}.\n\n#FrameInGoa`
        : APP_CONFIG.shareText;
    const url = buildTwitterShareUrl(text);
    window.open(url, "_blank", "noopener,noreferrer,width=620,height=540");
    toast.success("Opened X — post with #FrameInGoa!");
  }, [mode, teamName]);

  const handleCopyLink = React.useCallback(async () => {
    let payload: ShareData;

    if (mode === "team-frame") {
      payload = {
        m: "team-frame",
        tn: teamName || "Team Pass",
        tt: teamTagline || "",
        c: college || "",
        tm: (teamMembers || []).map((m) => ({
          n: m.name || "",
          r: m.role || "",
          t: m.builderTitle || "",
        })),
      };
    } else {
      payload = {
        m: mode,
        n: shareData?.name || "",
        r: shareData?.role || "",
        t: shareData?.builderTitle || "",
      };
    }

    const encoded = encodeShareData(payload);

    if (mode === "team-frame") {
      const avatars = (teamMembers || []).map((m) => m.avatarUrl || null);
      storeTeamAvatarsForShare(encoded, avatars);
      storeTeamAvatarsForShare(`team:${teamName || "pass"}`, avatars);
      storeTeamAvatarsForShare("last-team-avatars", avatars);
    } else if (avatarUrl) {
      storeAvatarForShare(encoded, avatarUrl);
      storeAvatarForShare(`builder:${shareData?.name || "builder"}`, avatarUrl);
      storeAvatarForShare("last-avatar", avatarUrl);
    }

    const url = buildShareUrl(payload);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Share link copied!", {
        description: "Open it in a new tab to see your official pass.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
      toast.info("Opened share link in a new tab.");
    }
  }, [mode, shareData, teamName, teamTagline, college, teamMembers, avatarUrl]);

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", className)}>
      <AnimatePresence mode="wait">
        {!hasGenerated ? (
          <motion.div
            key="generate"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="w-full"
          >
            <Button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="group relative h-13 w-full overflow-hidden rounded-xl border-2 border-[#1c3529] bg-[#1c3529] px-8 font-mono text-base font-bold text-[#f3f6f1] shadow-[4px_4px_0px_#d9a726] transition-all hover:bg-[#12241b]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating PNG…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5 text-[#d9a726] transition-transform group-hover:rotate-12" />
                  {mode === "team-frame" ? "Generate Team PNG 🎉" : "Generate PNG 🎉"}
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="generated-actions"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Button
              type="button"
              onClick={onDownload}
              className="h-12 flex-1 rounded-xl border-2 border-[#1c3529] bg-[#d9a726] px-6 font-mono text-sm font-bold text-[#1c3529] shadow-[4px_4px_0px_#1c3529] hover:bg-[#b58617]"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>

            <Button
              type="button"
              onClick={handleShare}
              className="h-12 flex-1 rounded-xl border-2 border-[#1c3529] bg-[#e04b77] px-6 font-mono text-sm font-bold text-white shadow-[4px_4px_0px_#1c3529] hover:bg-[#c0325e]"
            >
              <Twitter className="mr-2 h-4 w-4" />
              Share to X
            </Button>

            <Button
              type="button"
              onClick={handleCopyLink}
              variant="outline"
              className="h-12 flex-1 rounded-xl border-2 border-[#1c3529] bg-[#d4dbcf] px-6 font-mono text-sm font-bold text-[#1c3529] shadow-[4px_4px_0px_#1c3529] hover:bg-[#cad2c6]"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-[#1c3529]" />
                  Copied!
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={onGenerate}
              variant="ghost"
              disabled={isGenerating}
              className="h-12 rounded-xl border-2 border-transparent font-mono text-xs font-bold text-[#1c3529] hover:bg-[#cad2c6] sm:w-auto"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Regenerate
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
