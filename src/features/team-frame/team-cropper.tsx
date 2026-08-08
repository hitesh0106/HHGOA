"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, UserMinus, CheckCircle2, ImageIcon, Camera, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { UploadZone } from "@/features/upload/upload-zone";
import { PhotoCropper } from "@/features/cropper/photo-cropper";
import { getCroppedAvatarDataUrl } from "@/lib/photo";
import { Button } from "@/components/ui/button";
import type { TeamMember, PhotoState, CroppedAreaPixels } from "@/types";

interface TeamCropperProps {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
  onProceedToForm: () => void;
  className?: string;
}

/**
 * Team photo manager for 2 to 8 teammates.
 * Supports upload, zoom, crop, position, and confirm for every individual teammate.
 */
export function TeamCropper({
  members,
  onChange,
  onProceedToForm,
  className,
}: TeamCropperProps) {
  const [activeCropId, setActiveCropId] = React.useState<string | null>(null);

  const handleAddMember = React.useCallback(() => {
    if (members.length >= 8) {
      toast.error("Maximum 8 team members allowed.");
      return;
    }
    const newMember: TeamMember = {
      id: `member-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: "",
      role: "",
      builderTitle: "",
      isConfirmed: false,
    };
    onChange([...members, newMember]);
    toast.success(`Added Teammate ${members.length + 1}`);
  }, [members, onChange]);

  const handleRemoveMember = React.useCallback(
    (id: string) => {
      if (members.length <= 2) {
        toast.error("Minimum 2 team members required.");
        return;
      }
      const updated = members.filter((m) => m.id !== id);
      onChange(updated);
      toast.info("Teammate removed.");
    },
    [members, onChange]
  );

  const handlePhotoLoaded = React.useCallback(
    (id: string, photo: PhotoState) => {
      const updated = members.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            photo,
            isConfirmed: false,
          };
        }
        return m;
      });
      onChange(updated);
      setActiveCropId(id);
      toast.success("Photo uploaded", {
        description: "Crop and position your teammate's avatar.",
      });
    },
    [members, onChange]
  );

  const handleCropComplete = React.useCallback(
    async (id: string, cropArea: CroppedAreaPixels) => {
      const member = members.find((m) => m.id === id);
      if (!member || !member.photo) return;

      try {
        const url = await getCroppedAvatarDataUrl(member.photo.src, cropArea, 720);
        const updated = members.map((m) => {
          if (m.id === id) {
            return {
              ...m,
              cropArea,
              avatarUrl: url,
            };
          }
          return m;
        });
        onChange(updated);
      } catch (err) {
        console.error("Avatar crop failed", err);
      }
    },
    [members, onChange]
  );

  const handleConfirmPhoto = React.useCallback(
    (id: string) => {
      const updated = members.map((m) => {
        if (m.id === id) {
          return { ...m, isConfirmed: true };
        }
        return m;
      });
      onChange(updated);
      setActiveCropId(null);
      toast.success("Teammate photo confirmed!");
    },
    [members, onChange]
  );

  const handleReCrop = React.useCallback(
    (id: string) => {
      const updated = members.map((m) => {
        if (m.id === id) {
          return { ...m, isConfirmed: false };
        }
        return m;
      });
      onChange(updated);
      setActiveCropId(id);
    },
    [members, onChange]
  );

  return (
    <div className={className}>
      <div className="flex items-center justify-between border-b border-emerald/15 pb-4 mb-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-emerald-deep">
            Teammate Photos ({members.length} / 8)
          </h3>
          <p className="text-xs text-muted-foreground">
            Upload & crop photo for each team member (Min 2, Max 8).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {members.length < 8 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddMember}
              className="h-9 border-emerald/25 bg-card text-xs font-semibold text-emerald-deep hover:bg-emerald/10"
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              Add Teammate
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {members.map((member, index) => {
          const isConfirmed = member.isConfirmed;
          const photo = member.photo;

          return (
            <div
              key={member.id}
              className="rounded-3xl border border-emerald/20 bg-card/60 p-5 shadow-tropical"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald/15 text-xs font-bold text-emerald-deep">
                    {index + 1}
                  </span>
                  <h4 className="font-serif text-base font-bold text-emerald-deep">
                    {member.name || `Teammate ${index + 1}`}
                  </h4>
                </div>

                {members.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-coral-deep transition-colors"
                  >
                    <UserMinus className="h-3.5 w-3.5" />
                    Remove
                  </button>
                )}
              </div>

              {!photo ? (
                /* Upload Photo Step for this member */
                <div>
                  <UploadZone
                    onPhotoLoaded={(p) => handlePhotoLoaded(member.id, p)}
                  />
                </div>
              ) : isConfirmed ? (
                /* ⭐ Photo Ready Compact Card for this member */
                <div className="flex items-center justify-between rounded-2xl border border-emerald/25 bg-emerald/10 p-4 shadow-tropical">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-gold shadow-sm">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt="Cropped preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-emerald text-ivory font-bold text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-deep">
                        ✓ Photo Ready
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cropped & framed
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleReCrop(member.id)}
                    className="h-8 border-emerald/25 bg-card text-xs font-semibold text-emerald-deep hover:bg-emerald/10"
                  >
                    <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
                    Change Photo
                  </Button>
                </div>
              ) : (
                /* Interactive Cropper for this member */
                <div className="flex flex-col gap-4">
                  <PhotoCropper
                    photo={photo}
                    onCropComplete={(cropArea) =>
                      handleCropComplete(member.id, cropArea)
                    }
                  />

                  <Button
                    type="button"
                    onClick={() => handleConfirmPhoto(member.id)}
                    className="h-11 w-full rounded-2xl bg-emerald font-semibold text-ivory shadow-tropical transition-all hover:bg-emerald-deep"
                  >
                    Confirm Teammate {index + 1} Photo →
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Button
          type="button"
          onClick={onProceedToForm}
          className="h-14 w-full rounded-2xl bg-gradient-to-br from-emerald to-emerald-deep text-base font-bold text-ivory shadow-tropical-lg transition-all hover:shadow-tropical-lg"
        >
          <Wand2 className="mr-2 h-5 w-5" />
          Proceed to Team Details →
        </Button>
      </div>
    </div>
  );
}
