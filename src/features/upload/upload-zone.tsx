"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImagePlus, Camera, Sparkles, X, AlertCircle, Loader2 } from "lucide-react";
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

/**
 * Drag & drop + file picker + mobile camera upload zone. Handles HEIC
 * conversion in-browser. Toasts surface validation errors and conversions.
 */
export function UploadZone({ onPhotoLoaded, className, compact = false }: UploadZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const {
    photo,
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
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-card px-4 py-2 text-sm font-medium text-emerald-deep shadow-tropical transition-all hover:shadow-tropical-lg hover:border-emerald/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
          className
        )}
      >
        {isConverting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4 transition-transform group-hover:-rotate-6" />
        )}
        {isConverting ? "Converting HEIC…" : "Change photo"}
        <input
          ref={inputRef}
          type="file"
          accept={APP_CONFIG.acceptedExtensions.join(",")}
          onChange={onInputChange}
          className="sr-only"
        />
      </button>
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
          "group relative flex min-h-[260px] sm:min-h-[320px] cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4",
          dragActive
            ? "border-emerald bg-emerald/8 shadow-tropical-lg scale-[1.005]"
            : "border-emerald/25 bg-card/70 hover:border-emerald/45 hover:bg-card hover:shadow-tropical"
        )}
      >
        {/* Animated ring */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--gold) 14%, transparent) 0%, transparent 60%)",
          }}
        />

        <AnimatePresence mode="wait">
          {isConverting ? (
            <motion.div
              key="converting"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-gold/30" />
                <div className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald to-emerald-deep text-ivory shadow-tropical">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              </div>
              <div>
                <p className="font-serif text-lg text-emerald-deep">Converting HEIC…</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hang tight, this only takes a moment.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-5"
            >
              <motion.div
                animate={
                  dragActive
                    ? { scale: 1.08, y: -4 }
                    : { scale: 1, y: 0 }
                }
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                className="relative"
              >
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-gold/40 via-coral/30 to-emerald-soft/40 blur-xl" />
                <div className="relative grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald to-emerald-deep text-ivory shadow-tropical-lg transition-transform duration-300 group-hover:scale-105">
                  <Upload className="h-9 w-9" strokeWidth={2.4} />
                  <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-gold text-emerald-deep shadow-gold-glow">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                </div>
              </motion.div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-xl sm:text-2xl text-emerald-deep">
                  {dragActive ? "Drop to upload" : "Drag & drop your photo"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  or{" "}
                  <span className="font-medium text-emerald underline-offset-4 group-hover:underline">
                    browse files
                  </span>{" "}
                  · JPG · PNG · WEBP · HEIC
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-ivory shadow-tropical transition-all hover:bg-emerald-deep hover:shadow-tropical-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  <ImagePlus className="h-4 w-4" />
                  Upload photo
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cameraInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald/25 bg-card px-5 py-2.5 text-sm font-semibold text-emerald-deep transition-all hover:border-emerald/45 hover:bg-emerald/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  <Camera className="h-4 w-4" />
                  Use camera
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Max {Math.round(APP_CONFIG.maxUploadBytes / (1024 * 1024))} MB ·
                Everything stays on your device
              </p>
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
          capture="environment"
          onChange={onInputChange}
          className="sr-only"
        />
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            key={`err-${errorKey}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 flex items-start gap-2 rounded-xl border border-coral/30 bg-coral-soft/30 p-3 text-sm text-coral-deep"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={() => {}}
              className="text-coral-deep/70 hover:text-coral-deep"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
