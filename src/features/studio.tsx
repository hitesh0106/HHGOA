"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { UploadZone } from "@/features/upload/upload-zone";
import { ModeSelector } from "@/features/builder-id/mode-selector";
import { PhotoCropper } from "@/features/cropper/photo-cropper";
import { BuilderForm } from "@/features/builder-id/builder-form";
import { TeamWizard } from "@/features/team-frame/team-wizard";
import { LivePreview } from "@/features/share/live-preview";
import { ActionButtons } from "@/features/share/action-buttons";
import { useImageGenerator } from "@/hooks/use-image-generator";
import { usePersistedDraft } from "@/hooks/use-persisted-draft";
import { getCroppedAvatarDataUrl } from "@/lib/photo";
import { triggerConfetti } from "@/lib/confetti";
import { FloatingDecorations } from "@/components/decor/floating-decorations";
import { Button } from "@/components/ui/button";
import {
  Camera,
  ImageIcon,
  Wand2,
  CheckCircle2,
  Trash2,
  Layers,
  Sparkles,
} from "lucide-react";
import type { Area } from "react-easy-crop";
import type { GeneratorMode, PhotoState, TeamMember } from "@/types";
import { cn } from "@/lib/utils";

interface StudioProps {
  className?: string;
}

type Step = "upload" | "configure" | "preview";

export function Studio({ className }: StudioProps) {
  const { draft, update, clearAll } = usePersistedDraft();

  const [step, setStep] = React.useState<Step>("upload");
  const [photo, setPhoto] = React.useState<PhotoState | null>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [cropArea, setCropArea] = React.useState<Area | null>(null);
  const [mode, setMode] = React.useState<GeneratorMode>(draft.mode ?? "builder-id");

  const [isPhotoConfirmed, setIsPhotoConfirmed] = React.useState(false);

  // Single person Builder ID form state
  const [name, setName] = React.useState(draft.name ?? "");
  const [role, setRole] = React.useState(draft.role ?? "");
  const [builderTitle, setBuilderTitle] = React.useState(draft.builderTitle ?? "");
  const [twitter, setTwitter] = React.useState("");

  // Team Frame State (2 or 3 members guided wizard)
  const [teamName, setTeamName] = React.useState("");
  const [teamTagline, setTeamTagline] = React.useState("");
  const [college, setCollege] = React.useState("");
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([
    { id: "m-1", name: "", role: "", builderTitle: "", twitter: "", isConfirmed: false },
    { id: "m-2", name: "", role: "", builderTitle: "", twitter: "", isConfirmed: false },
  ]);

  const renderRef = React.useRef<HTMLDivElement>(null);
  const {
    isGenerating,
    hasGenerated,
    lastResult,
    generate,
    download,
    reset: resetGenerator,
  } = useImageGenerator({ pixelRatio: 1 });

  // Whenever crop area or photo changes in single mode, regenerate avatar data URL.
  React.useEffect(() => {
    let cancelled = false;
    async function regenerate() {
      if (!photo || !cropArea) {
        setAvatarUrl(null);
        return;
      }
      try {
        const url = await getCroppedAvatarDataUrl(photo.src, cropArea, 720);
        if (!cancelled) setAvatarUrl(url);
      } catch (err) {
        console.error("[Studio] avatar regen failed", err);
        if (!cancelled) setAvatarUrl(null);
      }
    }
    void regenerate();
    return () => {
      cancelled = true;
    };
  }, [photo, cropArea]);

  // Persist draft on changes
  React.useEffect(() => {
    update({ mode });
  }, [mode, update]);
  React.useEffect(() => {
    update({ name });
  }, [name, update]);
  React.useEffect(() => {
    update({ role });
  }, [role, update]);
  React.useEffect(() => {
    update({ builderTitle });
  }, [builderTitle, update]);

  const handlePhotoLoaded = React.useCallback((p: PhotoState) => {
    setPhoto(p);
    setIsPhotoConfirmed(false);
    setStep("configure");
    resetGenerator();
    toast.success("Photo loaded", {
      description: "Adjust crop and click Confirm Photo.",
    });
  }, [resetGenerator]);

  const handleCropComplete = React.useCallback((area: Area) => {
    setCropArea(area);
  }, []);

  const handleModeChange = React.useCallback((m: GeneratorMode) => {
    setMode(m);
    setStep("configure");
    resetGenerator();
  }, [resetGenerator]);

  const handleFormChange = React.useCallback(
    (values: { name: string; role: string; builderTitle: string; twitter?: string }) => {
      setName((prev) => (prev === values.name ? prev : values.name));
      setRole((prev) => (prev === values.role ? prev : values.role));
      setBuilderTitle((prev) =>
        prev === values.builderTitle ? prev : values.builderTitle
      );
      setTwitter((prev) => (prev === (values.twitter ?? "") ? prev : values.twitter ?? ""));
    },
    []
  );

  const handleGenerate = React.useCallback(async () => {
    if (mode !== "team-frame" && !photo) {
      toast.error("Upload a photo first.");
      return;
    }
    if (mode === "builder-id" && (!name.trim() || !role.trim())) {
      toast.error("Add your name and role", {
        description: "Both fields are required for the Builder ID card.",
      });
      return;
    }
    if (mode === "team-frame" && !teamName.trim()) {
      toast.error("Enter your Team Name.");
      return;
    }

    const result = await generate(renderRef.current);
    if (result) {
      setStep("preview");
      triggerConfetti();
      toast.success("PNG ready 🎉", {
        description: mode === "team-frame"
          ? `Official Team Pass for ${teamName} generated!`
          : `Builder ID for ${name} generated!`,
      });
    } else {
      toast.error("Could not generate the image. Please try again.");
    }
  }, [photo, mode, name, role, teamName, generate]);

  const handleDownload = React.useCallback(async () => {
    await download();
    toast.success("Download started", {
      description: mode === "team-frame" ? "Saved as hh-goa-team-pass.png" : "Saved as hh-goa-builder-card.png",
    });
  }, [download, mode]);

  const handleResetAll = React.useCallback(() => {
    clearAll();
    setPhoto(null);
    setAvatarUrl(null);
    setCropArea(null);
    setName("");
    setRole("");
    setBuilderTitle("");
    setTeamName("");
    setTeamTagline("");
    setCollege("");
    setTeamMembers([
      { id: "m-1", name: "", role: "", builderTitle: "", isConfirmed: false },
      { id: "m-2", name: "", role: "", builderTitle: "", isConfirmed: false },
    ]);
    setIsPhotoConfirmed(false);
    setMode("builder-id");
    setStep("upload");
    resetGenerator();
    toast.success("Saved data cleared");
  }, [clearAll, resetGenerator]);

  return (
    <section id="studio" className={cn("relative pt-8 pb-12 sm:pt-10 sm:pb-16 flex-1 flex flex-col justify-between", className)}>
      <FloatingDecorations />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl text-emerald-deep sm:text-4xl"
          >
            {hasGenerated
              ? mode === "team-frame"
                ? "Your Official Team Frame is Ready"
                : "Your Builder Identity is Ready"
              : "Build your Identity or Team Pass"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-2 text-base text-muted-foreground"
          >
            {hasGenerated
              ? "Download your PNG artwork, share to X, or copy your public showcase link."
              : "Choose your mode: Single Builder ID or 2/3 Teammate Guided Pass. Everything updates live in real time."}
          </motion.p>
        </div>

        {/* ============ FINISHED RESULT VIEW (When generated) ============ */}
        {hasGenerated ? (
          <div className="mt-10 mx-auto max-w-2xl flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-4 py-2 mb-6">
                <CheckCircle2 className="h-4 w-4 text-emerald" />
                <span className="text-sm font-bold text-emerald-deep">
                  Official {mode === "team-frame" ? "Team Pass" : "Builder ID"} Generated
                </span>
              </div>

              {/* Large 1080x1080 Card Preview */}
              <div className="w-full max-w-[500px]">
                <LivePreview
                  mode={mode}
                  avatarUrl={avatarUrl}
                  name={name}
                  role={role}
                  builderTitle={builderTitle}
                  twitter={twitter}
                  teamName={teamName}
                  teamTagline={teamTagline}
                  college={college}
                  teamMembers={teamMembers}
                  isGenerating={isGenerating}
                  renderRef={renderRef}
                />
              </div>

              {/* Action Cluster: Download, Share to X, Copy Link */}
              <div className="mt-8 w-full max-w-[500px]">
                <ActionButtons
                  isGenerating={isGenerating}
                  hasGenerated={hasGenerated}
                  result={lastResult}
                  onGenerate={handleGenerate}
                  onDownload={handleDownload}
                  mode={mode}
                  shareData={{ name, role, builderTitle }}
                  teamName={teamName}
                  teamTagline={teamTagline}
                  college={college}
                  teamMembers={teamMembers}
                  avatarUrl={avatarUrl}
                />
              </div>

              {/* Bottom CTA */}
              <div className="mt-10 w-full border-t border-emerald/15 pt-8 text-center flex flex-col items-center gap-3">
                <p className="font-serif text-2xl font-bold text-emerald-deep">
                  Want your own {mode === "team-frame" ? "Team Frame" : "Builder ID"}?
                </p>
                <p className="text-sm text-muted-foreground">
                  Generate your official HH Goa 2026 pass in seconds.
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    type="button"
                    onClick={handleResetAll}
                    className="h-12 rounded-full bg-gradient-to-br from-emerald to-emerald-deep px-8 text-sm font-bold text-ivory shadow-tropical"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Your Own {mode === "team-frame" ? "Team Frame" : "Builder ID"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetGenerator();
                      setStep("configure");
                    }}
                    className="h-12 rounded-full border-2 border-emerald/25 bg-card px-6 text-sm font-bold text-emerald-deep hover:bg-emerald/5"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Edit Details
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* ============ EDITOR VIEW (Before generated) ============ */
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
            {/* LEFT: controls & form — Desktop: Left (lg:order-1) | Mobile: Below Preview (order-2) */}
            <div className="order-2 flex flex-col gap-6 lg:order-1">
              {/* Mode Selector is ALWAYS accessible at top left */}
              <div className="mb-2">
                <StepHeader
                  icon={<Layers className="h-4 w-4" />}
                  label="Mode"
                  title="Choose your mode"
                  subtitle="Switch instantly between Single Builder ID and Team Frame (2 or 3 members)."
                />
                <ModeSelector
                  value={mode}
                  onChange={handleModeChange}
                  className="mt-4"
                />
              </div>

              <AnimatePresence mode="wait">
                {/* ============ MODE 1: SINGLE BUILDER ID ============ */}
                {mode !== "team-frame" && (
                  <motion.div
                    key="single-builder-mode"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col gap-6"
                  >
                    {step === "upload" || !photo ? (
                      <div key="upload-step-container">
                        <StepHeader
                          icon={<Camera className="h-4 w-4" />}
                          label="Step 1"
                          title="Upload your photo"
                          subtitle="Drag & drop, browse, or use your camera. HEIC supported."
                        />
                        <UploadZone onPhotoLoaded={handlePhotoLoaded} className="mt-4" />
                      </div>
                    ) : (
                      <div key="configure-step-container" className="flex flex-col gap-6">
                        {/* Photo Editor vs Photo Ready state */}
                        {!isPhotoConfirmed ? (
                          <div className="flex flex-col gap-4 rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical">
                            <div className="flex items-center justify-between gap-3">
                              <StepHeader
                                icon={<ImageIcon className="h-4 w-4" />}
                                label="Step 1: Photo"
                                title="Crop & position"
                                subtitle="Drag to move · Pinch or slider to zoom"
                              />
                              <UploadZone
                                onPhotoLoaded={handlePhotoLoaded}
                                compact
                              />
                            </div>

                            <PhotoCropper
                              photo={photo}
                              onCropComplete={handleCropComplete}
                            />

                            <button
                              type="button"
                              onClick={() => setIsPhotoConfirmed(true)}
                              className="h-12 w-full rounded-2xl bg-emerald font-semibold text-ivory shadow-tropical transition-all hover:bg-emerald-deep"
                            >
                              Confirm Photo & Continue →
                            </button>
                          </div>
                        ) : (
                          /* ⭐ Photo Ready Compact Card */
                          <div className="flex items-center justify-between rounded-2xl border border-emerald/25 bg-emerald/10 p-4 shadow-tropical">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald text-ivory shadow-sm">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-emerald-deep">✓ Photo Ready</p>
                                <p className="text-xs text-muted-foreground">Cropped & framed perfectly</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsPhotoConfirmed(false)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald/25 bg-card px-3 py-1.5 text-xs font-semibold text-emerald-deep transition-all hover:bg-emerald/10"
                            >
                              <ImageIcon className="h-3.5 w-3.5" />
                              Change Photo
                            </button>
                          </div>
                        )}

                        {/* Builder Form — SHOWN AFTER PHOTO IS CONFIRMED */}
                        {isPhotoConfirmed && (
                          <div className="flex flex-col gap-6">
                            {mode === "builder-id" && (
                              <div className="overflow-hidden">
                                <StepHeader
                                  icon={<Wand2 className="h-4 w-4" />}
                                  label="Identity"
                                  title="Your builder details"
                                  subtitle="All fields update the live preview instantly."
                                />
                                <BuilderForm
                                  initialName={name}
                                  initialRole={role}
                                  initialTitle={builderTitle}
                                  initialTwitter={twitter}
                                  onChange={handleFormChange}
                                  className="mt-4"
                                />
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-4">
                              <ActionButtons
                                isGenerating={isGenerating}
                                hasGenerated={hasGenerated}
                                result={lastResult}
                                onGenerate={handleGenerate}
                                onDownload={handleDownload}
                                shareData={{ name, role, builderTitle }}
                                avatarUrl={avatarUrl}
                              />
                            </div>

                            {/* Clear saved data */}
                            <div className="flex items-center justify-end">
                              <button
                                type="button"
                                onClick={handleResetAll}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-coral-deep"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Clear saved data
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ============ MODE 2: TEAM FRAME MODE (2 OR 3 MEMBER GUIDED WIZARD) ============ */}
                {mode === "team-frame" && (
                  <motion.div
                    key="team-frame-mode"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-6"
                  >
                    <TeamWizard
                      members={teamMembers}
                      teamName={teamName}
                      teamTagline={teamTagline}
                      college={college}
                      onChangeMembers={setTeamMembers}
                      onChangeTeamInfo={({ teamName: tn, teamTagline: tt, college: col }) => {
                        setTeamName(tn);
                        setTeamTagline(tt);
                        setCollege(col);
                      }}
                      onGenerate={handleGenerate}
                      isGenerating={isGenerating}
                      hasGenerated={hasGenerated}
                    />

                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleResetAll}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-coral-deep"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear saved data
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT: Live Sticky Preview — Desktop: Right (lg:order-2) | Mobile: Top (order-1) */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
              <div className="relative">
                <StepHeader
                  icon={<Wand2 className="h-4 w-4" />}
                  label="Live preview"
                  title={mode === "team-frame" ? "Your Team Frame" : "Your builder identity"}
                  subtitle="Updates instantly · 1080×1080 retina export"
                />

                <div className="mt-4">
                  <LivePreview
                    mode={mode}
                    avatarUrl={avatarUrl}
                    name={name}
                    role={role}
                    builderTitle={builderTitle}
                    twitter={twitter}
                    teamName={teamName}
                    teamTagline={teamTagline}
                    college={college}
                    teamMembers={teamMembers}
                    isGenerating={isGenerating}
                    renderRef={renderRef}
                  />
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Tap Generate PNG when you're happy with the preview.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StepHeader({
  icon,
  label,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald/10 text-emerald">
          {icon}
        </span>
        {label}
      </div>
      <h3 className="mt-2 font-serif text-xl text-emerald-deep sm:text-2xl">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
