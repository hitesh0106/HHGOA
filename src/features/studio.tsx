"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Camera,
  ImageIcon,
  Wand2,
  CheckCircle2,
  Trash2,
  QrCode,
  Hash,
} from "lucide-react";
import { UploadZone } from "@/features/upload/upload-zone";
import { PhotoCropper } from "@/features/cropper/photo-cropper";
import { BuilderForm } from "@/features/builder-id/builder-form";
import { LivePreview } from "@/features/share/live-preview";
import { ActionButtons } from "@/features/share/action-buttons";
import { useImageGenerator } from "@/hooks/use-image-generator";
import { usePersistedDraft } from "@/hooks/use-persisted-draft";
import { useQrCode } from "@/hooks/use-qr-code";
import { getCroppedAvatarDataUrl } from "@/lib/photo";
import { makeThumbnail, cn, pickRandom } from "@/lib/utils";
import { FloatingDecorations } from "@/components/decor/floating-decorations";
import { Confetti } from "@/components/confetti";
import {
  APP_CONFIG,
  BUILDER_TITLES,
  FUN_BADGES,
  generateBuilderId,
} from "@/constants";
import type { Area } from "react-easy-crop";
import type {
  BuilderFormValues,
  GeneratorMode,
  PhotoState,
} from "@/types";

interface StudioProps {
  className?: string;
}

type Step = "upload" | "configure" | "preview";

/**
 * The Studio — the heart of the app. Single-page flow:
 * Upload → Configure (mode + form) → Preview (Generate → Download → Share).
 *
 * Integrates: photo upload with HEIC conversion + paste, square crop with
 * zoom/rotate, Builder Title randomiser, Builder Level picker, random Fun
 * Badge, QR code (client-side), unique Builder ID, and a confetti burst on
 * successful generation.
 */
export function Studio({ className }: StudioProps) {
  const { draft, update, clearAll } = usePersistedDraft();

  const [step, setStep] = React.useState<Step>("upload");
  const [photo, setPhoto] = React.useState<PhotoState | null>(null);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [cropArea, setCropArea] = React.useState<Area | null>(null);
  const [mode, setMode] = React.useState<GeneratorMode>(
    draft.mode ?? "builder-id"
  );
  const [fireConfetti, setFireConfetti] = React.useState(false);

  // Form state — lifted so the live preview can read it.
  const [values, setValues] = React.useState<BuilderFormValues>({
    name: draft.name ?? "",
    role: draft.role ?? "",
    college: draft.college ?? "",
    github: draft.github ?? "",
    xHandle: draft.xHandle ?? "",
    builderTitle: draft.builderTitle || pickRandom(BUILDER_TITLES),
    builderLevel: draft.builderLevel ?? "gold",
    badge: draft.badge || pickRandom(FUN_BADGES).label,
    badgeEmoji:
      FUN_BADGES.find((b) => b.label === draft.badge)?.emoji ??
      pickRandom(FUN_BADGES).emoji,
  });

  // Unique Builder ID — derived from name + title + badge seed.
  const uniqueId = React.useMemo(
    () =>
      generateBuilderId(
        `${values.name}|${values.builderTitle}|${values.badge}`
      ),
    [values.name, values.builderTitle, values.badge]
  );

  // QR code — encodes a verification URL with the unique ID.
  const verifyUrl = `https://hhgoa.com/builder/${uniqueId}`;
  const { qrUrl: qrCodeUrl } = useQrCode(verifyUrl);

  const renderRef = React.useRef<HTMLDivElement>(null);
  const {
    isGenerating,
    hasGenerated,
    lastResult,
    generate,
    download,
    reset: resetGenerator,
  } = useImageGenerator({ pixelRatio: 1 });

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

  // Persist on changes (debounced via React batching).
  React.useEffect(() => {
    update({ mode });
  }, [mode, update]);
  React.useEffect(() => {
    update({
      name: values.name,
      role: values.role,
      college: values.college,
      github: values.github,
      xHandle: values.xHandle,
      builderTitle: values.builderTitle,
      builderLevel: values.builderLevel,
      badge: values.badge,
    });
  }, [
    values.name,
    values.role,
    values.college,
    values.github,
    values.xHandle,
    values.builderTitle,
    values.builderLevel,
    values.badge,
    update,
  ]);

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

  const handlePhotoLoaded = React.useCallback(
    (p: PhotoState) => {
      setPhoto(p);
      setStep("configure");
      resetGenerator();
      toast.success("Photo loaded", {
        description:
          p.mimeType === "image/jpeg" && /\.heic$/i.test(p.fileName)
            ? "HEIC converted to JPEG automatically."
            : "Crop it just right, then fill in your details.",
      });
    },
    [resetGenerator]
  );

  const handleCropComplete = React.useCallback((area: Area) => {
    setCropArea(area);
  }, []);

  const handleFormChange = React.useCallback((next: BuilderFormValues) => {
    setValues((prev) => {
      // Only update if something actually changed — avoids loop with the
      // form's own watch subscription.
      if (
        prev.name === next.name &&
        prev.role === next.role &&
        prev.college === next.college &&
        prev.github === next.github &&
        prev.xHandle === next.xHandle &&
        prev.builderTitle === next.builderTitle &&
        prev.builderLevel === next.builderLevel &&
        prev.badge === next.badge &&
        prev.badgeEmoji === next.badgeEmoji
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  const handleGenerate = React.useCallback(async () => {
    if (!photo) {
      toast.error("Upload a photo first.");
      return;
    }
    if (mode === "builder-id" && (!values.name.trim() || !values.role.trim())) {
      toast.error("Add your name and stack/role", {
        description: "Both are required for the Builder ID card.",
      });
      return;
    }
    const result = await generate(renderRef.current);
    if (result) {
      setStep("preview");
      setFireConfetti(true);
      // Reset confetti trigger after the burst.
      setTimeout(() => setFireConfetti(false), 100);
      toast.success("Builder ID ready", {
        description: `Rendered in ${result.durationMs} ms · ${result.width}×${result.height}`,
      });
    } else {
      toast.error("Could not generate the image. Please try again.");
    }
  }, [photo, mode, values.name, values.role, generate]);

  const handleDownload = React.useCallback(
    async (opts?: { transparent?: boolean; scale?: number }) => {
      // Re-generate with the requested options, then download.
      const result = await generate(renderRef.current, opts);
      if (result) {
        await download(result);
        toast.success("Download started", {
          description: opts?.transparent
            ? "Transparent PNG saved."
            : opts?.scale === 2
              ? "2× retina PNG saved."
              : "Saved as hh-goa-builder-id.png",
        });
      } else {
        toast.error("Could not generate the image. Please try again.");
      }
    },
    [generate, download]
  );

  const handleResetAll = React.useCallback(() => {
    clearAll();
    setPhoto(null);
    setAvatarUrl(null);
    setCropArea(null);
    setValues({
      name: "",
      role: "",
      college: "",
      github: "",
      xHandle: "",
      builderTitle: pickRandom(BUILDER_TITLES),
      builderLevel: "gold",
      badge: pickRandom(FUN_BADGES).label,
      badgeEmoji: pickRandom(FUN_BADGES).emoji,
    });
    setMode("builder-id");
    setStep("upload");
    resetGenerator();
    toast.success("Saved data cleared");
  }, [clearAll, resetGenerator]);

  return (
    <section
      id="studio"
      aria-label="Builder ID studio"
      className={cn("relative isolate overflow-hidden", className)}
    >
      <FloatingDecorations />
      <Confetti fire={fireConfetti} />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {/* Studio header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-emerald"
          >
            Builder Studio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 font-display text-3xl tracking-tight text-emerald-deep sm:text-4xl md:text-5xl"
            style={{ fontWeight: 700 }}
          >
            Build your Builder ID
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Upload a photo, fill in your details, and watch the live preview
            update in real time. Everything stays on your device.
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
                      ? "bg-emerald text-ivory shadow-luxe"
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
                  {s === "upload" ? "Upload" : s === "configure" ? "Configure" : "Preview"}
                </div>
                {i < 2 && <div className="h-px w-6 bg-emerald/15 sm:w-12" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main two-column layout */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          {/* LEFT: controls */}
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
                    subtitle="Drag & drop, paste from clipboard, or use your camera. HEIC supported."
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
                  <div className="flex items-center justify-between gap-3">
                    <StepHeader
                      icon={<ImageIcon className="h-4 w-4" />}
                      label="Photo"
                      title="Crop & position"
                      subtitle="Drag to move · Pinch or slider to zoom · Rotate to spin"
                    />
                    <UploadZone onPhotoLoaded={handlePhotoLoaded} compact />
                  </div>

                  <PhotoCropper
                    photo={photo}
                    onCropComplete={handleCropComplete}
                  />

                  {/* Builder details form */}
                  <div className="mt-2">
                    <StepHeader
                      icon={<Wand2 className="h-4 w-4" />}
                      label="Identity"
                      title="Your builder details"
                      subtitle="All fields update the preview live."
                    />
                    <BuilderForm
                      initial={values}
                      onChange={handleFormChange}
                      className="mt-4"
                    />
                  </div>

                  {/* Unique ID + QR preview */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald/12 bg-card p-4 shadow-luxe">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald/10 text-emerald">
                        <Hash className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Builder ID
                        </p>
                        <p className="truncate font-mono text-sm font-semibold text-emerald-deep">
                          {uniqueId}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald/12 bg-card p-4 shadow-luxe">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald/10 text-emerald">
                        <QrCode className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          QR Code
                        </p>
                        <p className="truncate font-mono text-sm font-semibold text-emerald-deep">
                          {qrCodeUrl ? "Generated" : "Pending…"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reset all */}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleResetAll}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-rose-deep"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear saved data
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: live preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative">
              <StepHeader
                icon={<Wand2 className="h-4 w-4" />}
                label="Live preview"
                title="Your Builder ID"
                subtitle="Updates instantly · 1080×1080 retina export"
              />

              <div className="mt-4">
                <LivePreview
                  mode={mode}
                  avatarUrl={avatarUrl}
                  values={values}
                  uniqueId={uniqueId}
                  qrCodeUrl={qrCodeUrl}
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
                />
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                {hasGenerated
                  ? "Tap Download to save the PNG, then Share to X to post with #FrameInGoa."
                  : "Tap Generate Builder ID when you're happy with the preview."}
              </p>
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
      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald/10 text-emerald">
          {icon}
        </span>
        {label}
      </div>
      <h3 className="mt-2 font-display text-xl text-emerald-deep sm:text-2xl">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
