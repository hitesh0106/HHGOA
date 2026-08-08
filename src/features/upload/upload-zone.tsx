"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImagePlus, Camera, Sparkles, X, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
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
                  onClick={(e) => {
                    e.stopPropagation();
                    cameraInputRef.current?.click();
                  }}
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
