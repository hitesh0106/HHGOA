"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadPhotoFromFile, validatePhotoFile } from "@/lib/photo";
import { makeThumbnail } from "@/lib/utils";
import type { PhotoState } from "@/types";

export interface UsePhotoUploadOptions {
  /** Called after a photo is successfully loaded. */
  onLoaded?: (photo: PhotoState) => void;
  /** Called if HEIC conversion or validation fails. */
  onError?: (message: string) => void;
}

export interface UsePhotoUploadReturn {
  photo: PhotoState | null;
  isConverting: boolean;
  error: string | null;
  errorKey: number;
  handleFile: (file: File | undefined | null) => Promise<void>;
  reset: () => void;
  dragActive: boolean;
  setDragActive: (v: boolean) => void;
}

/**
 * Photo upload + HEIC conversion + validation state machine.
 * Used by the UploadZone component.
 */
export function usePhotoUpload(
  options: UsePhotoUploadOptions = {}
): UsePhotoUploadReturn {
  const { onLoaded, onError } = options;
  const [photo, setPhoto] = useState<PhotoState | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  // Clean up any object URL we created.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file) return;

      const validationError = validatePhotoFile(file);
      if (validationError) {
        setError(validationError);
        setErrorKey((k) => k + 1);
        onError?.(validationError);
        return;
      }

      setIsConverting(true);
      setError(null);

      try {
        const { photo: loadedPhoto, converted } = await loadPhotoFromFile(file);

        // Make a tiny thumbnail for localStorage persistence.
        const thumb = await makeThumbnail(loadedPhoto.src, 96).catch(() => "");
        (loadedPhoto as PhotoState & { thumb?: string }).thumb = thumb;

        setPhoto(loadedPhoto);
        onLoaded?.(loadedPhoto);

        if (converted) {
          // Subtle confirmation handled by caller via toast.
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Could not load that image. Try another file.";
        setError(message);
        setErrorKey((k) => k + 1);
        onError?.(message);
      } finally {
        setIsConverting(false);
      }
    },
    [onLoaded, onError]
  );

  const reset = useCallback(() => {
    setPhoto(null);
    setError(null);
    setIsConverting(false);
  }, []);

  return {
    photo,
    isConverting,
    error,
    errorKey,
    handleFile,
    reset,
    dragActive,
    setDragActive,
  };
}
