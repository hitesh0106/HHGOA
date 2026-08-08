"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  Shuffle,
  Camera,
  ImageIcon,
  Users,
  School,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AtSign,
} from "lucide-react";
import { toast } from "sonner";
import { UploadZone } from "@/features/upload/upload-zone";
import { PhotoCropper } from "@/features/cropper/photo-cropper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCroppedAvatarDataUrl } from "@/lib/photo";
import { generateBuilderTitle } from "@/lib/title-generator";
import type { TeamMember, PhotoState, CroppedAreaPixels } from "@/types";
import { cn } from "@/lib/utils";

interface TeamWizardProps {
  members: TeamMember[];
  teamName: string;
  teamTagline: string;
  college: string;
  onChangeMembers: (members: TeamMember[]) => void;
  onChangeTeamInfo: (info: { teamName: string; teamTagline: string; college: string }) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasGenerated: boolean;
  className?: string;
}

/**
 * Adaptive Guided Wizard for Team Frame (2 or 3 Members).
 *
 * Asks "How many team members? (2 or 3)".
 * Adapts steps automatically:
 *   - 2 Members: Member 1 → Member 2 → Team Info → Generate
 *   - 3 Members: Member 1 → Member 2 → Member 3 → Team Info → Generate
 */
export function TeamWizard({
  members,
  teamName,
  teamTagline,
  college,
  onChangeMembers,
  onChangeTeamInfo,
  onGenerate,
  isGenerating,
  hasGenerated,
  className,
}: TeamWizardProps) {
  const [totalMembers, setTotalMembers] = React.useState<2 | 3>(
    members.length === 3 ? 3 : 2
  );

  const [activeStep, setActiveStep] = React.useState<number>(1);

  React.useEffect(() => {
    if (members.length !== totalMembers) {
      const updated: TeamMember[] = Array.from({ length: totalMembers }, (_, i) => {
        return (
          members[i] || {
            id: `m-${i + 1}`,
            name: "",
            role: "",
            builderTitle: "",
            twitter: "",
            isConfirmed: false,
          }
        );
      });
      onChangeMembers(updated);
    }
  }, [totalMembers, members, onChangeMembers]);

  const teamInfoStep = totalMembers + 1;
  const currentMemberIndex = activeStep <= totalMembers ? activeStep - 1 : 0;
  const currentMember = members[currentMemberIndex] || {
    id: `m-${activeStep}`,
    name: "",
    role: "",
    builderTitle: "",
    twitter: "",
    isConfirmed: false,
  };

  const handleMemberCountChange = (count: 2 | 3) => {
    setTotalMembers(count);
    if (activeStep > count + 1) {
      setActiveStep(count + 1);
    }
    toast.info(`Switched to ${count}-Member Team Pass`);
  };

  const handlePhotoLoaded = (photo: PhotoState) => {
    const updated = [...members];
    updated[currentMemberIndex] = {
      ...currentMember,
      photo,
      isConfirmed: false,
    };
    onChangeMembers(updated);
    toast.success(`Member ${activeStep} photo loaded`, {
      description: "Adjust crop and click Confirm Photo.",
    });
  };

  const handleCropComplete = async (cropArea: CroppedAreaPixels) => {
    if (!currentMember.photo) return;
    try {
      const url = await getCroppedAvatarDataUrl(currentMember.photo.src, cropArea, 720);
      const updated = [...members];
      updated[currentMemberIndex] = {
        ...currentMember,
        cropArea,
        avatarUrl: url,
      };
      onChangeMembers(updated);
    } catch (err) {
      console.error("Avatar crop failed", err);
    }
  };

  const handleConfirmPhoto = () => {
    const updated = [...members];
    updated[currentMemberIndex] = {
      ...currentMember,
      isConfirmed: true,
    };
    onChangeMembers(updated);
    toast.success(`Member ${activeStep} photo confirmed!`);
  };

  const handleReCrop = () => {
    const updated = [...members];
    updated[currentMemberIndex] = {
      ...currentMember,
      isConfirmed: false,
    };
    onChangeMembers(updated);
  };

  const handleMemberFieldChange = (field: keyof TeamMember, value: string) => {
    const updated = [...members];
    const m = { ...currentMember, [field]: value };
    if (field === "role" && value.trim() && !m.builderTitle) {
      m.builderTitle = generateBuilderTitle(value);
    }
    updated[currentMemberIndex] = m;
    onChangeMembers(updated);
  };

  const handleRegenerateTitle = () => {
    const updated = [...members];
    const newTitle = generateBuilderTitle(currentMember.role || "Builder", currentMember.builderTitle);
    updated[currentMemberIndex] = {
      ...currentMember,
      builderTitle: newTitle,
    };
    onChangeMembers(updated);
  };

  const handleNextStep = () => {
    if (activeStep <= totalMembers) {
      if (!currentMember.isConfirmed && currentMember.photo) {
        handleConfirmPhoto();
      }
      if (activeStep < totalMembers) {
        setActiveStep((prev) => prev + 1);
        toast.success(`Saved Member ${activeStep}. Proceeding to Member ${activeStep + 1} of ${totalMembers}.`);
      } else {
        setActiveStep(teamInfoStep);
        toast.success(`All ${totalMembers} teammates completed! Enter Team Info.`);
      }
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* ============ TEAM MEMBER COUNT SELECTOR ============ */}
      <div className="rounded-xl border-2 border-[#1c3529] bg-[#FFFFFF] p-4 shadow-[4px_4px_0px_#1c3529]">
        <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-[#1c3529] mb-3">
          <span>How many team members?</span>
          <span className="rounded-md border border-[#1c3529] bg-[#e04b77] px-2 py-0.5 text-white font-bold">
            {totalMembers} Members Selected
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleMemberCountChange(2)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border-2 border-[#1c3529] p-3 font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#1c3529]",
              totalMembers === 2
                ? "bg-[#d9a726] text-[#1c3529]"
                : "bg-[#FCF9F2] text-[#1c3529] hover:bg-[#FFFFFF]"
            )}
          >
            <Users className="h-4 w-4 text-[#1c3529]" />
            2 Members
          </button>

          <button
            type="button"
            onClick={() => handleMemberCountChange(3)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border-2 border-[#1c3529] p-3 font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#1c3529]",
              totalMembers === 3
                ? "bg-[#d9a726] text-[#1c3529]"
                : "bg-[#FCF9F2] text-[#1c3529] hover:bg-[#FFFFFF]"
            )}
          >
            <Users className="h-4 w-4 text-[#1c3529]" />
            3 Members
          </button>
        </div>

        {/* Progress Bar Segment */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-deep mb-1.5">
            <span>Wizard Progress</span>
            <span className="text-gold">
              {activeStep <= totalMembers ? `Member ${activeStep} of ${totalMembers}` : "Team Info"}
            </span>
          </div>

          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${totalMembers + 1}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: totalMembers + 1 }, (_, i) => i + 1).map((stepNum) => {
              const isDone = activeStep > stepNum || (stepNum <= totalMembers && members[stepNum - 1]?.name?.trim().length > 0 && members[stepNum - 1]?.isConfirmed);
              const isCurrent = activeStep === stepNum;

              return (
                <button
                  key={stepNum}
                  type="button"
                  onClick={() => setActiveStep(stepNum)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    isCurrent
                      ? "bg-gold shadow-gold-glow"
                      : isDone
                        ? "bg-emerald"
                        : "bg-emerald/15"
                  )}
                  title={stepNum <= totalMembers ? `Member ${stepNum}` : "Team Info"}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ MEMBER STEPS (1..totalMembers) ============ */}
      <AnimatePresence mode="wait">
        {activeStep <= totalMembers && (
          <motion.div
            key={`step-${activeStep}-${totalMembers}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="flex flex-col gap-6"
          >
            {/* Step Header */}
            <div className="flex items-center justify-between border-b border-emerald/15 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald">
                  Member {activeStep} of {totalMembers}
                </span>
                <h3 className="font-serif text-xl font-bold text-emerald-deep mt-0.5">
                  {currentMember.name ? `Editing: ${currentMember.name}` : `Teammate ${activeStep} Details`}
                </h3>
              </div>

              {activeStep > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevStep}
                  className="text-xs font-semibold text-muted-foreground hover:text-emerald-deep"
                >
                  <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                  Previous
                </Button>
              )}
            </div>

            {/* Photo Step: Upload vs Cropper vs Photo Ready */}
            {!currentMember.photo ? (
              <div className="flex flex-col gap-3 rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-deep">
                  <Camera className="h-4 w-4 text-emerald" />
                  Upload Teammate {activeStep} Photo
                </div>
                <UploadZone onPhotoLoaded={handlePhotoLoaded} />
              </div>
            ) : !currentMember.isConfirmed ? (
              <div className="flex flex-col gap-4 rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-emerald-deep">Crop & Position</p>
                    <p className="text-xs text-muted-foreground">Drag to move · Pinch to zoom</p>
                  </div>
                  <UploadZone onPhotoLoaded={handlePhotoLoaded} compact />
                </div>

                <PhotoCropper
                  photo={currentMember.photo}
                  onCropComplete={handleCropComplete}
                />

                <Button
                  type="button"
                  onClick={handleConfirmPhoto}
                  className="h-11 w-full rounded-2xl bg-emerald font-semibold text-ivory shadow-tropical hover:bg-emerald-deep"
                >
                  Confirm Teammate {activeStep} Photo →
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-emerald/25 bg-emerald/10 p-4 shadow-tropical">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-gold shadow-sm">
                    {currentMember.avatarUrl ? (
                      <img src={currentMember.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-emerald font-bold text-ivory text-xs">✓</div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-deep">✓ Teammate {activeStep} Photo Ready</p>
                    <p className="text-xs text-muted-foreground">Cropped & framed perfectly</p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReCrop}
                  className="h-8 border-emerald/25 bg-card text-xs font-semibold text-emerald-deep hover:bg-emerald/10"
                >
                  <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
                  Change Photo
                </Button>
              </div>
            )}

            {/* Member Details Form */}
            {currentMember.photo && currentMember.isConfirmed && (
              <div className="rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical flex flex-col gap-4">
                <h4 className="font-serif text-base font-bold text-emerald-deep flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald" />
                  Teammate {activeStep} Identity
                </h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep">
                      Builder Name
                    </label>
                    <Input
                      value={currentMember.name || ""}
                      onChange={(e) => handleMemberFieldChange("name", e.target.value)}
                      placeholder="e.g. Alex Mehra"
                      maxLength={36}
                      className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-emerald-soft" />
                      Stack / Role
                    </label>
                    <Input
                      value={currentMember.role || ""}
                      onChange={(e) => handleMemberFieldChange("role", e.target.value)}
                      placeholder="e.g. AI · PyTorch"
                      maxLength={40}
                      className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                    />
                  </div>
                </div>

                {/* Twitter / X Handle Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep flex items-center gap-1">
                    <AtSign className="h-3 w-3 text-[#C85A32]" />
                    Twitter / X Handle
                  </label>
                  <Input
                    value={currentMember.twitter || ""}
                    onChange={(e) => handleMemberFieldChange("twitter", e.target.value)}
                    placeholder="e.g. @alex_builds"
                    maxLength={30}
                    className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                  />
                </div>

                {/* AI Builder Title */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-deep">
                      Builder Title
                    </span>
                    <button
                      type="button"
                      onClick={handleRegenerateTitle}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-deep hover:bg-emerald/20"
                    >
                      <Shuffle className="h-3 w-3" />
                      Generate Another
                    </button>
                  </div>

                  <div className="relative flex items-center gap-2 rounded-xl border border-gold/40 bg-gradient-to-br from-gold/10 via-coral-soft/5 to-emerald-soft/5 px-3 py-2">
                    <input
                      value={currentMember.builderTitle || ""}
                      onChange={(e) => handleMemberFieldChange("builderTitle", e.target.value)}
                      placeholder="Title (e.g. Prompt Architect)"
                      className="w-full bg-transparent font-serif text-sm font-bold text-emerald-deep outline-none"
                      maxLength={40}
                    />
                  </div>
                </div>

                {/* Save & Continue */}
                <div className="mt-2">
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="h-12 w-full rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep text-sm font-bold text-ivory shadow-tropical hover:shadow-tropical-lg"
                  >
                    {activeStep < totalMembers ? (
                      <>
                        Save & Add Next Teammate (Member {activeStep + 1} of {totalMembers})
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Save & Continue to Team Info
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ============ TEAM INFO STEP (Step totalMembers + 1) ============ */}
        {activeStep === teamInfoStep && (
          <motion.div
            key="team-info-step"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center justify-between border-b border-emerald/15 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald">
                  Final Step
                </span>
                <h3 className="font-serif text-xl font-bold text-emerald-deep mt-0.5">
                  Team Details & Pass Generation
                </h3>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveStep(totalMembers)}
                className="text-xs font-semibold text-muted-foreground hover:text-emerald-deep"
              >
                <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                Back to Member {totalMembers}
              </Button>
            </div>

            {/* Team Details Inputs */}
            <div className="rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical flex flex-col gap-4">
              <h4 className="font-serif text-base font-bold text-emerald-deep flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald" />
                Team Details
              </h4>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep">
                  Team Name
                </label>
                <Input
                  value={teamName}
                  onChange={(e) =>
                    onChangeTeamInfo({
                      teamName: e.target.value,
                      teamTagline,
                      college,
                    })
                  }
                  placeholder="e.g. Neural Ninjas"
                  maxLength={40}
                  className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep flex items-center gap-1">
                    <School className="h-3 w-3 text-emerald-soft" />
                    College / University (Optional)
                  </label>
                  <Input
                    value={college}
                    onChange={(e) =>
                      onChangeTeamInfo({
                        teamName,
                        teamTagline,
                        college: e.target.value,
                      })
                    }
                    placeholder="e.g. BITS Pilani"
                    maxLength={48}
                    className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-emerald-deep">
                    Team Tagline (Optional)
                  </label>
                  <Input
                    value={teamTagline}
                    onChange={(e) =>
                      onChangeTeamInfo({
                        teamName,
                        teamTagline: e.target.value,
                        college,
                      })
                    }
                    placeholder="e.g. Shipping AI @ HH Goa"
                    maxLength={48}
                    className="h-11 rounded-xl border-emerald/20 bg-card text-emerald-deep placeholder:text-muted-foreground/60 focus-visible:ring-gold"
                  />
                </div>
              </div>
            </div>

            {/* Summary of Teammates */}
            <div className="rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-deep">
                Completed Teammates ({totalMembers} of {totalMembers})
              </h4>

              <div className={cn("grid gap-2.5", totalMembers === 2 ? "grid-cols-2" : "grid-cols-3")}>
                {members.slice(0, totalMembers).map((m, idx) => (
                  <button
                    key={m.id || idx}
                    type="button"
                    onClick={() => setActiveStep(idx + 1)}
                    className="flex items-center gap-2.5 rounded-2xl border border-emerald/15 bg-card/80 p-3 text-left transition-all hover:border-gold hover:bg-emerald/5"
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gold">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt={m.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-emerald text-[10px] font-bold text-ivory">
                          M{idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-emerald-deep truncate">
                        {m.name || `Member ${idx + 1}`}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {m.twitter ? m.twitter : m.role || "Builder"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button: Generate Team PNG */}
            <div className="mt-2">
              <Button
                type="button"
                onClick={onGenerate}
                disabled={isGenerating}
                className="group relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep px-8 text-base font-bold text-ivory shadow-tropical-lg transition-all hover:shadow-tropical-lg"
              >
                <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                Generate Team PNG 🎉
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
