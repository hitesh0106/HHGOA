"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  ImagePlus,
  Camera,
  X,
  AlertCircle,
  Loader2,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { usePhotoUpload } from "@/hooks/use-photo-upload";
import { APP_CONFIG } from "@/constants";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onPhotoLoaded: (photo: import("@/types").PhotoState) => void;
  className?: string;
  /** Compact variant used after a photo is loaded (re-upload). */
  compact?: boolean;
}

export function UploadZone({ onPhotoLoaded, className, compact = false }: UploadZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  // Live WebRTC Camera Modal State
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [facingMode, setFacingMode] = React.useState<"user" | "environment">("user");
  const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const {
    isConverting,
    error,
    errorKey,
    handleFile,
    dragActive,
    setDragActive,
  } = usePhotoUpload({
    onLoaded: (p) => {
      onPhotoLoaded(p);
    },
    onError: (msg) => toast.error(msg),
  });

  // Start live camera stream when modal opens
  const startCamera = React.useCallback(async (facing: "user" | "environment" = "user") => {
    setCameraError(null);
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("WebRTC camera failed, falling back to camera input", err);
      setCameraError("Could not access live camera. Use native camera picker below.");
    }
  }, [cameraStream]);

  const stopCamera = React.useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  }, [cameraStream]);

  const handleOpenCamera = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined" && typeof navigator?.mediaDevices?.getUserMedia === "function") {
      setIsCameraOpen(true);
      void startCamera("user");
    } else {
      cameraInputRef.current?.click();
    }
  }, [startCamera]);

  const handleToggleFacingMode = React.useCallback(() => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    void startCamera(next);
  }, [facingMode, startCamera]);

  const handleSnapPhoto = React.useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip horizontally if front selfie camera
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
          stopCamera();
          void handleFile(file);
          toast.success("Photo captured! Now crop your portrait.");
        }
      },
      "image/jpeg",
      0.95
    );
  }, [facingMode, stopCamera, handleFile]);

  const onDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        const name = file.name.toLowerCase();
        const ok = APP_CONFIG.acceptedExtensions.some((ext) => name.endsWith(ext));
        if (!ok) {
          toast.error("Unsupported file. Please drop a JPG, PNG, WEBP or HEIC image.");
          return;
        }
        void handleFile(file);
      }
    },
    [handleFile, setDragActive]
  );

  const onDragOver = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    },
    [setDragActive]
  );

  const onDragLeave = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    },
    [setDragActive]
  );

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "group inline-flex items-center gap-2 rounded-xl border-2 border-[#1c3529] bg-[#d9a726] px-4 py-2 text-xs font-bold text-[#1c3529] shadow-[3px_3px_0px_#1c3529] transition-all hover:bg-[#b58617]",
            className
          )}
        >
          {isConverting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {isConverting ? "Converting HEIC…" : "Change Photo"}
        </button>

        <button
          type="button"
          onClick={handleOpenCamera}
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1c3529] bg-[#FCF9F2] px-3 py-2 text-xs font-bold text-[#1c3529] shadow-[3px_3px_0px_#1c3529] hover:bg-[#EFE9DE]"
        >
          <Camera className="h-4 w-4" />
          Camera
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={APP_CONFIG.acceptedExtensions.join(",")}
          onChange={onInputChange}
          className="sr-only"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={onInputChange}
          className="sr-only"
        />

        {/* Live WebRTC Camera Modal */}
        <AnimatePresence>
          {isCameraOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border-3 border-[#1c3529] bg-[#FCF9F2] p-5 shadow-[8px_8px_0px_#1c3529]"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#1c3529]">
                    <Camera className="h-5 w-5 text-[#d9a726]" />
                    <span>Take Portrait Photo</span>
                  </div>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#1c3529] bg-[#EFE9DE] text-[#1c3529] hover:bg-[#e04b77] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-[#1c3529] bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={cn(
                      "h-full w-full object-cover",
                      facingMode === "user" && "-scale-x-100"
                    )}
                  />
                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white bg-black/90">
                      <AlertCircle className="h-8 w-8 text-[#e04b77] mb-2" />
                      <p className="text-xs font-bold">{cameraError}</p>
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="mt-3 rounded-xl border-2 border-white bg-[#d9a726] px-4 py-2 text-xs font-bold text-[#1c3529]"
                      >
                        Use Native Camera App
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex w-full items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleToggleFacingMode}
                    className="flex items-center gap-1.5 rounded-xl border-2 border-[#1c3529] bg-[#EFE9DE] px-4 py-2.5 text-xs font-bold text-[#1c3529] hover:bg-[#d4cbd9]"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Flip
                  </button>

                  <button
                    type="button"
                    onClick={handleSnapPhoto}
                    disabled={!!cameraError}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#1c3529] bg-[#1c3529] px-6 py-3 font-mono text-sm font-bold text-[#FCF9F2] shadow-[3px_3px_0px_#d9a726] hover:bg-[#12241b] disabled:opacity-50"
                  >
                    <Camera className="h-5 w-5 text-[#d9a726]" />
                    Snap Photo 🎉
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Upload a photo by clicking or dragging a file here"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "group relative flex min-h-[260px] sm:min-h-[300px] cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-[#1c3529] bg-[#FCF9F2] p-8 text-center shadow-[4px_4px_0px_#1c3529] transition-all duration-200",
          dragActive && "bg-[#EFE9DE] scale-[1.005]"
        )}
      >
        <AnimatePresence mode="wait">
          {isConverting ? (
            <motion.div
              key="converting"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-[#1c3529] bg-[#d9a726] text-[#1c3529]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-[#1c3529]">Converting HEIC…</p>
                <p className="mt-1 text-xs font-mono text-[#1c3529]/80">
                  Converting Apple format in-browser...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Yellow Icon Badge */}
              <div className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-[#1c3529] bg-[#d9a726] text-[#1c3529] shadow-[3px_3px_0px_#1c3529]">
                <Upload className="h-8 w-8" strokeWidth={2.4} />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-[#1c3529]">
                  {dragActive ? "Drop Your Portrait Here" : "Drag & Drop Your Portrait Here"}
                </h3>
                <p className="text-xs font-mono text-[#1c3529]/80">
                  Or tap to browse from your device gallery or camera roll.
                </p>
              </div>

              {/* Hot Pink Format Badges */}
              <div className="flex items-center gap-2 font-mono text-xs font-bold">
                <span className="rounded-md border border-[#1c3529] bg-[#c5ccc2] px-2 py-0.5 text-[#1c3529]">JPG</span>
                <span className="rounded-md border border-[#1c3529] bg-[#c5ccc2] px-2 py-0.5 text-[#1c3529]">PNG</span>
                <span className="rounded-md border border-[#1c3529] bg-[#e04b77] px-2.5 py-0.5 text-white">HEIC (iOS)</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1c3529] bg-[#1c3529] px-5 py-2.5 text-xs font-bold text-[#f3f6f1] shadow-[3px_3px_0px_#d9a726] hover:bg-[#12241b]"
                >
                  <ImagePlus className="h-4 w-4" />
                  Browse Files
                </button>
                <button
                  type="button"
                  onClick={handleOpenCamera}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[#1c3529] bg-[#d9a726] px-5 py-2.5 text-xs font-bold text-[#1c3529] shadow-[3px_3px_0px_#1c3529] hover:bg-[#b58617]"
                >
                  <Camera className="h-4 w-4" />
                  Use Camera
                </button>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#1c3529]/80 font-bold mt-1">
                <ShieldCheck className="h-4 w-4 text-[#1c3529]" />
                <span>100% Client-Side • Photo Never Uploaded</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="file"
          accept={APP_CONFIG.acceptedExtensions.join(",")}
          onChange={onInputChange}
          className="sr-only"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={onInputChange}
          className="sr-only"
        />
      </motion.div>

      {/* Live WebRTC Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border-3 border-[#1c3529] bg-[#FCF9F2] p-5 shadow-[8px_8px_0px_#1c3529]"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#1c3529]">
                  <Camera className="h-5 w-5 text-[#d9a726]" />
                  <span>Take Portrait Photo</span>
                </div>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#1c3529] bg-[#EFE9DE] text-[#1c3529] hover:bg-[#e04b77] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-[#1c3529] bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={cn(
                    "h-full w-full object-cover",
                    facingMode === "user" && "-scale-x-100"
                  )}
                />
                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white bg-black/90">
                    <AlertCircle className="h-8 w-8 text-[#e04b77] mb-2" />
                    <p className="text-xs font-bold">{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="mt-3 rounded-xl border-2 border-white bg-[#d9a726] px-4 py-2 text-xs font-bold text-[#1c3529]"
                    >
                      Use Native Camera App
                    </button>
                  </div>
                )}
              </div>

              <div className="flex w-full items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleToggleFacingMode}
                  className="flex items-center gap-1.5 rounded-xl border-2 border-[#1c3529] bg-[#EFE9DE] px-4 py-2.5 text-xs font-bold text-[#1c3529] hover:bg-[#d4cbd9]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Flip
                </button>

                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  disabled={!!cameraError}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#1c3529] bg-[#1c3529] px-6 py-3 font-mono text-sm font-bold text-[#FCF9F2] shadow-[3px_3px_0px_#d9a726] hover:bg-[#12241b] disabled:opacity-50"
                >
                  <Camera className="h-5 w-5 text-[#d9a726]" />
                  Snap Photo 🎉
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            key={`err-${errorKey}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 flex items-start gap-2 rounded-xl border-2 border-[#1c3529] bg-[#e04b77]/20 p-3 text-xs font-bold text-[#1c3529]"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#e04b77]" />
            <span className="flex-1">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
