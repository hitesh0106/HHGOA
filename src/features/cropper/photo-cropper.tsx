"use client";

import * as React from "react";
import Cropper, { type Point, type Area } from "react-easy-crop";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Move, RotateCcw, RotateCw, Maximize2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn, clamp } from "@/lib/utils";
import type { PhotoState } from "@/types";

interface PhotoCropperProps {
  photo: PhotoState;
  onCropComplete: (croppedAreaPixels: Area) => void;
  className?: string;
  /** Aspect ratio — 1 = square (used for both modes). */
  aspect?: number;
}

/**
 * Premium photo cropper with zoom + rotate + reset controls. Built on top
 * of react-easy-crop. The crop area is always square so the output fits
 * perfectly into the circular frame / square Builder ID layout.
 *
 * Rotation is achieved by rotating the underlying image element via CSS —
 * react-easy-crop exposes a `transform` prop on the media element so the
 * crop overlay still aligns with the visible (rotated) image.
 */
export function PhotoCropper({
  photo,
  onCropComplete,
  className,
  aspect = 1,
}: PhotoCropperProps) {
  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const lastAreaRef = React.useRef<Area | null>(null);

  // Reset when the photo changes.
  React.useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    lastAreaRef.current = null;
  }, [photo.src]);

  const handleCropComplete = React.useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      lastAreaRef.current = croppedAreaPixels;
      onCropComplete(croppedAreaPixels);
    },
    [onCropComplete]
  );

  const handleReset = React.useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  }, []);

  const zoomIn = React.useCallback(() => {
    setZoom((z) => clamp(+(z + 0.1).toFixed(2), 1, 3));
  }, []);
  const zoomOut = React.useCallback(() => {
    setZoom((z) => clamp(+(z - 0.1).toFixed(2), 1, 3));
  }, []);

  const rotateLeft = React.useCallback(() => {
    setRotation((r) => (r - 90 + 360) % 360);
  }, []);
  const rotateRight = React.useCallback(() => {
    setRotation((r) => (r + 90) % 360);
  }, []);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl border border-emerald/15 bg-emerald-deep/95 shadow-luxe"
        role="region"
        aria-label="Photo cropper — drag to reposition, use controls to zoom and rotate"
      >
        <Cropper
          image={photo.src}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          showGrid
          objectFit="horizontal-cover"
          restrictPosition
          cropShape="rect"
          classes={{
            containerClassName: "bg-emerald-deep",
            cropAreaClassName:
              "border-2 border-gold/70 shadow-[0_0_0_9999px_oklch(0.18_0.04_165/0.55)]",
            mediaClassName: "object-cover",
          }}
          transform={{
            scale: zoom,
            rotate: rotation,
          }}
        />

        {/* Subtle vignette overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow:
              "inset 0 0 60px oklch(0.18 0.04 165 / 0.35), inset 0 0 0 1px oklch(0.84 0.14 80 / 0.18)",
          }}
        />

        {/* Top-right HUD: orientation + rotation badge */}
        <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2">
          {rotation !== 0 && (
            <span className="rounded-full bg-emerald-deep/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ivory backdrop-blur">
              {rotation}°
            </span>
          )}
          <span className="rounded-full bg-emerald-deep/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ivory backdrop-blur">
            {photo.orientation}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={zoomOut}
          aria-label="Zoom out"
          className="h-9 w-9 shrink-0 border-emerald/25 bg-card text-emerald-deep hover:bg-emerald/10 hover:text-emerald-deep"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <div className="flex flex-1 min-w-[140px] items-center gap-3">
          <Move className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.05}
            onValueChange={(v) => setZoom(v[0])}
            aria-label="Zoom level"
            className="flex-1 [&_[role=slider]]:bg-gold [&_[role=slider]]:border-emerald-deep [&_[role=slider]]:shadow-gold-glow [&>span:first-child]:bg-emerald/20"
          />
          <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={zoomIn}
          aria-label="Zoom in"
          className="h-9 w-9 shrink-0 border-emerald/25 bg-card text-emerald-deep hover:bg-emerald/10 hover:text-emerald-deep"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={rotateLeft}
          aria-label="Rotate 90° left"
          className="h-9 w-9 shrink-0 border-emerald/25 bg-card text-emerald-deep hover:bg-emerald/10 hover:text-emerald-deep"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={rotateRight}
          aria-label="Rotate 90° right"
          className="h-9 w-9 shrink-0 border-emerald/25 bg-card text-emerald-deep hover:bg-emerald/10 hover:text-emerald-deep"
        >
          <RotateCw className="h-4 w-4" />
        </Button>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            aria-label="Reset crop and rotation"
            className="gap-1.5 text-emerald-deep hover:bg-emerald/10 hover:text-emerald-deep"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </motion.div>
      </div>

      <p className="text-xs text-muted-foreground">
        Drag to move · Pinch or slider to zoom · Rotate buttons to spin · Reset to recenter
      </p>
    </div>
  );
}
