"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { UploadZone } from "@/features/upload/upload-zone";
import { ModeSelector } from "@/features/builder-id/mode-selector";
import { PhotoCropper } from "@/features/cropper/photo-cropper";
import { BuilderForm } from "@/features/builder-id/builder-form";
import { LivePreview } from "@/features/share/live-preview";
import { ActionButtons } from "@/features/share/action-buttons";
import { useImageGenerator } from "@/hooks/use-image-generator";
import { usePersistedDraft } from "@/hooks/use-persisted-draft";
import { getCroppedAvatarDataUrl } from "@/lib/photo";
import { makeThumbnail } from "@/lib/utils";
import { FloatingDecorations } from "@/components/decor/floating-decorations";
import {
  Camera,
  ImageIcon,
  Wand2,
  CheckCircle2,
  Trash2,
  Layers,
} from "lucide-react";
import type { Area } from "react-easy-crop";
import type { GeneratorMode, PhotoState } from "@/types";
import { cn } from "@/lib/utils";

interface StudioProps {
  className?: string;
}

type Step = "upload" | "configure" | "preview";

/**
 * The Studio — the heart of the app. A single-page flow that walks the
 * user through Upload → Mode select → Configure → Preview, all in place
 * on the same page (no routing).
 *
 * Every keystroke and crop change updates the live preview instantly.
 * The persisted draft (name / role / title / mode / thumb) syncs to
 * localStorage on every change so a refresh picks up where you left off.
 */
export function Studio({ className }: StudioProps) {
  const { draft, update, clearAll } = usePersistedDraft();

  const [step, setStep] = React.useState<Step>("upload");
  const [photo, setPhoto] = React.useState<PhotoState | null>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [cropArea, setCropArea] = React.useState<Area | null>(null);
  const [mode, setMode] = React.useState<GeneratorMode>(draft.mode ?? "builder-id");

  // Form state lifted up so the live preview can read it.
  const [name, setName] = React.useState(draft.name ?? "");
  const [role, setRole] = React.useState(draft.role ?? "");
  const [builderTitle, setBuilderTitle] = React.useState(
    draft.builderTitle ?? ""
  );

  const renderRef = React.useRef<HTMLDivElement>(null);
  const {
    isGenerating,
    hasGenerated,
    lastResult,
    generate,
    download,
    reset: resetGenerator,
  } = useImageGenerator({ pixelRatio: 1 });

  // Restore the previous photo thumb on hydration (visual cue only —
  // we cannot restore the full-res original from a 96px thumbnail).
  React.useEffect(() => {
    if (draft.photoThumb) {
      // Don't auto-load the thumb as the working photo — it's too small
      // for a 1080×1080 export. We just visually nudge the user.
    }
  }, [draft.photoThumb]);

  // Whenever the crop area or photo changes, regenerate the avatar data URL.
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

  // Persist on changes.
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

  // When a photo is uploaded, persist a small thumbnail.
  React.useEffect(() => {
    if (!photo) return;
    let cancelled = false;
    void (async () => {
      const thumb = await makeThumbnail(photo.src, 96).catch(() => "");
      if (!cancelled && thumb) update({ photoThumb: thumb });
    })();
    return () => {
      cancelled = true;
    };
  }, [photo, update]);

  const handlePhotoLoaded = React.useCallback((p: PhotoState) => {
    setPhoto(p);
    setStep("configure");
    resetGenerator();
    toast.success("Photo loaded", {
      description: p.mimeType === "image/jpeg" && /\.heic$/i.test(p.fileName)
        ? "HEIC converted to JPEG automatically."
        : "Crop it just right, then choose your style.",
    });
  }, [resetGenerator]);

  const handleCropComplete = React.useCallback((area: Area) => {
    setCropArea(area);
  }, []);

  const handleModeChange = React.useCallback((m: GeneratorMode) => {
    setMode(m);
    resetGenerator();
  }, [resetGenerator]);

  const handleFormChange = React.useCallback(
    (values: { name: string; role: string; builderTitle: string }) => {
      // Only mark stale if values actually changed AND we've already
      // generated. This prevents the form's initial mount + title sync
      // from clearing the freshly-generated state.
      setName((prev) => (prev === values.name ? prev : values.name));
      setRole((prev) => (prev === values.role ? prev : values.role));
      setBuilderTitle((prev) =>
        prev === values.builderTitle ? prev : values.builderTitle
      );
    },
    []
  );

  const handleGenerate = React.useCallback(async () => {
    if (!photo) {
      toast.error("Upload a photo first.");
      return;
    }
    if (mode === "builder-id" && (!name.trim() || !role.trim())) {
      toast.error("Add your name and role", {
        description: "Both fields are required for the Builder ID card.",
      });
      return;
    }
    const result = await generate(renderRef.current);
    if (result) {
      setStep("preview");
      toast.success("PNG ready", {
        description: `Rendered in ${result.durationMs} ms · ${result.width}×${result.height}`,
      });
    } else {
      toast.error("Could not generate the image. Please try again.");
    }
  }, [photo, mode, name, role, generate]);

  const handleDownload = React.useCallback(async () => {
    await download();
    toast.success("Download started", {
      description: "Saved as hh-goa-builder-card.png",
    });
  }, [download]);

  const handleResetAll = React.useCallback(() => {
    clearAll();
    setPhoto(null);
    setAvatarUrl(null);
    setCropArea(null);
    setName("");
    setRole("");
    setBuilderTitle("");
    setMode("builder-id");
    setStep("upload");
    resetGenerator();
    toast.success("Saved data cleared");
  }, [clearAll, resetGenerator]);

  return (
    <section
      id="studio"
      aria-label="Builder identity studio"
      className={cn("relative isolate overflow-hidden", className)}
    >
      <FloatingDecorations />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {/* Studio header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-emerald"
          >
            Studio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 font-serif text-3xl tracking-tight text-emerald-deep sm:text-4xl md:text-5xl"
            style={{ fontWeight: 600 }}
          >
            Build your Builder Identity
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Upload a photo, choose your style, and watch the live preview update
            in real time. Everything stays on your device.
          </motion.p>
        </div>

        {/* Step indicator */}
        <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-2">
          {(["upload", "configure", "preview"] as Step[]).map((s, i) => {
            const active = step === s;
            const completed =
              (s === "upload" && photo) ||
              (s === "configure" && (photo || step === "preview"));
            return (
              <React.Fragment key={s}>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all",
                    active
                      ? "bg-emerald text-ivory shadow-tropical"
                      : completed
                        ? "bg-emerald/10 text-emerald-deep"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full text-[10px]",
                      active
                        ? "bg-gold text-emerald-deep"
                        : completed
                          ? "bg-emerald/20 text-emerald-deep"
                          : "bg-muted-foreground/15"
                    )}
                  >
                    {completed && !active ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  {s === "upload"
                    ? "Upload"
                    : s === "configure"
                      ? "Configure"
                      : "Preview"}
                </div>
                {i < 2 && (
                  <div className="h-px w-6 bg-emerald/15 sm:w-12" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main layout — switches to single-column result view after generation */}
        <div
          className={cn(
            "mt-12 grid gap-8 lg:gap-12",
            hasGenerated
              ? "mx-auto max-w-xl grid-cols-1"
              : "grid-cols-1 lg:grid-cols-[1fr_1.05fr]"
          )}
        >
          {/* LEFT: controls — hidden after generation */}
          {!hasGenerated && (
            <div className="flex flex-col gap-6">
              <AnimatePresence mode="wait">
                {step === "upload" || !photo ? (
                  <motion.div
                    key="upload-step"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <StepHeader
                      icon={<Camera className="h-4 w-4" />}
                      label="Step 1"
                      title="Upload your photo"
                      subtitle="Drag & drop, browse, or use your camera. HEIC supported."
                    />
                    <UploadZone onPhotoLoaded={handlePhotoLoaded} className="mt-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="configure-step"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Compact re-upload */}
                    <div className="flex items-center justify-between gap-3">
                      <StepHeader
                        icon={<ImageIcon className="h-4 w-4" />}
                        label="Photo"
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

                    {/* Mode selector */}
                    <div className="mt-2">
                      <StepHeader
                        icon={<Layers className="h-4 w-4" />}
                        label="Style"
                        title="Choose your style"
                        subtitle="Profile Frame for a circular avatar, Builder ID for a full identity card."
                      />
                      <ModeSelector
                        value={mode}
                        onChange={handleModeChange}
                        className="mt-4"
                      />
                    </div>

                    {/* Conditional builder form */}
                    <AnimatePresence>
                      {mode === "builder-id" && (
                        <motion.div
                          key="builder-form"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <StepHeader
                            icon={<Wand2 className="h-4 w-4" />}
                            label="Identity"
                            title="Your builder details"
                            subtitle="All fields update the preview live."
                          />
                          <BuilderForm
                            initialName={name}
                            initialRole={role}
                            initialTitle={builderTitle}
                            onChange={handleFormChange}
                            className="mt-4"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Reset all */}
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
          )}

          {/* RIGHT: live preview / result */}
          <div className={cn(hasGenerated ? "" : "lg:sticky lg:top-24 lg:self-start")}>
            <div className="relative">
              {!hasGenerated && (
                <StepHeader
                  icon={<Wand2 className="h-4 w-4" />}
                  label="Live preview"
                  title="Your builder identity"
                  subtitle="Updates instantly · 1080×1080 retina export"
                />
              )}

              {hasGenerated && (
                <div className="mb-6 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-4 py-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald" />
                    <span className="text-sm font-semibold text-emerald-deep">
                      Your Builder ID is ready
                    </span>
                  </motion.div>
                </div>
              )}

              <div className="mt-4">
                <LivePreview
                  mode={mode}
                  avatarUrl={avatarUrl}
                  name={name}
                  role={role}
                  builderTitle={builderTitle}
                  isGenerating={isGenerating}
                  renderRef={renderRef}
                />
              </div>

              {/* Action buttons */}
              <div className="mt-6">
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

              {/* Helper text */}
              {!hasGenerated && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Tap Generate PNG when you're happy with the preview.
                </p>
              )}

              {/* Start over button — only after generation */}
              {hasGenerated && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      resetGenerator();
                      setStep("configure");
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-deep transition-colors hover:text-emerald"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Edit details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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
