/**
 * Photo handling utilities — validation, robust HEIC/HEIF conversion (including iPhone Live Photos),
 * cropping, and pixel-perfect crop extraction. All browser-side, no network calls.
 */

import { APP_CONFIG } from "@/constants";
import { detectOrientation, fileToDataUrl, loadImage } from "@/lib/utils";
import type { PhotoOrientation, PhotoState } from "@/types";

type Heic2AnyFn = (options: {
  blob: Blob;
  toType?: string;
  quality?: number;
  multiple?: boolean;
}) => Promise<Blob | Blob[]>;

let _heic2anyCache: Heic2AnyFn | null = null;

async function getHeic2Any(): Promise<Heic2AnyFn> {
  if (_heic2anyCache) return _heic2anyCache;
  try {
    const mod = (await import("heic2any")) as unknown as Record<string, unknown>;
    const fn = (typeof mod === "function" ? mod : mod?.default) as unknown as Heic2AnyFn;
    if (typeof fn !== "function") {
      throw new Error("heic2any module function not found");
    }
    _heic2anyCache = fn;
    return _heic2anyCache;
  } catch (err) {
    console.warn("[getHeic2Any] import failed", err);
    throw err;
  }
}

export interface PhotoLoadResult {
  photo: PhotoState;
  /** True if a HEIC -> JPEG conversion happened. */
  converted: boolean;
}

/**
 * Validate a file against the accepted types and size limits.
 * Returns a human-readable error string, or null when valid.
 */
export function validatePhotoFile(file: File): string | null {
  const name = file.name.toLowerCase();
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif");

  const accepted = new Set<string>(APP_CONFIG.acceptedMimeTypes);
  const extMatch = APP_CONFIG.acceptedExtensions.some((ext) =>
    name.endsWith(ext)
  );

  if (!accepted.has(file.type) && !isHeic && !extMatch) {
    return "Unsupported file. Please upload a JPG, PNG, WEBP or HEIC image.";
  }

  if (file.size > APP_CONFIG.maxUploadBytes) {
    return `Image too large. Max size is ${Math.round(
      APP_CONFIG.maxUploadBytes / (1024 * 1024)
    )} MB.`;
  }

  if (file.size === 0) {
    return "That file appears to be empty.";
  }

  return null;
}

/**
 * Inspect file header magic bytes to detect if a file is actually JPEG/PNG/WEBP
 * (e.g. iOS exports or renamed files with .heic extension).
 */
export async function isStandardImageHeader(file: File): Promise<boolean> {
  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const arr = new Uint8Array(buffer);
    // JPEG (FF D8 FF)
    if (arr[0] === 0xff && arr[1] === 0xd8 && arr[2] === 0xff) return true;
    // PNG (89 50 4E 47)
    if (arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4e && arr[3] === 0x47) return true;
    // WEBP (RIFF...WEBP)
    if (arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46) return true;
  } catch {
    // Ignore buffer read errors
  }
  return false;
}

/**
 * Convert HEIC/HEIF files to JPEG using heic2any with ArrayBuffer.
 * Supports iPhone Live Photos, Burst Photos, and Multi-frame HEIC containers via `multiple: true`.
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = await getHeic2Any();
  const buffer = await file.arrayBuffer();
  const cleanBlob = new Blob([buffer], { type: "image/heic" });

  try {
    // 1. First attempt with multiple: true (handles iPhone Live Photos & Burst mode)
    const result = await heic2any({
      blob: cleanBlob,
      toType: "image/jpeg",
      quality: 0.92,
      multiple: true,
    });

    const blob = Array.isArray(result) ? result[0] : result;
    if (!blob || !(blob instanceof Blob)) {
      throw new Error("Invalid blob result from heic2any");
    }

    const newName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    // 2. Fallback attempt with single frame mode
    try {
      const result = await heic2any({
        blob: cleanBlob,
        toType: "image/jpeg",
        quality: 0.88,
      });
      const blob = Array.isArray(result) ? result[0] : result;
      const newName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
      return new File([blob], newName, { type: "image/jpeg" });
    } catch {
      throw new Error(
        "We could not convert that HEIC photo. Try exporting as JPG from your Photos app or snap a selfie with Use Camera."
      );
    }
  }
}

/**
 * Load a File into a PhotoState object.
 * Priority pipeline:
 *  1. createImageBitmap (Hardware-accelerated native browser decode)
 *  2. Header Magic Byte Inspection (for JPEGs/PNGs named .heic)
 *  3. Native HTMLImageElement Decode (Safari / macOS / iOS)
 *  4. heic2any WASM Decoder
 */
export async function loadPhotoFromFile(file: File): Promise<PhotoLoadResult> {
  const name = file.name.toLowerCase();
  const isHeicExt = name.endsWith(".heic") || name.endsWith(".heif");
  const isHeicMime = file.type === "image/heic" || file.type === "image/heif";
  const isHeic = isHeicExt || isHeicMime;

  // 1. Try createImageBitmap first (Hardware-accelerated native decode on macOS, iOS, Windows 11, Android)
  if (typeof window !== "undefined" && "createImageBitmap" in window) {
    try {
      const bitmap = await createImageBitmap(file);
      if (bitmap && bitmap.width > 0 && bitmap.height > 0) {
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(bitmap, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          const photo: PhotoState = {
            src: dataUrl,
            width: bitmap.width,
            height: bitmap.height,
            orientation: detectOrientation(bitmap.width, bitmap.height),
            fileName: file.name,
            mimeType: "image/png",
            loadedAt: Date.now(),
          };
          return { photo, converted: isHeic };
        }
      }
    } catch {
      // createImageBitmap not supported for this specific file format on this browser; proceed to fallbacks
    }
  }

  // 2. Check if file is actually a standard JPEG/PNG/WEBP disguised as .heic
  const isStandard = await isStandardImageHeader(file);
  if (isStandard) {
    try {
      const dataUrl = await fileToDataUrl(file);
      const img = await loadImage(dataUrl);
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const photo: PhotoState = {
          src: dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          orientation: detectOrientation(img.naturalWidth, img.naturalHeight),
          fileName: file.name,
          mimeType: file.type || "image/jpeg",
          loadedAt: Date.now(),
        };
        return { photo, converted: false };
      }
    } catch {
      // Continue to HEIC handling
    }
  }

  // 3. Try native HTMLImageElement decoding (works natively on Safari / iOS / macOS)
  if (isHeic) {
    try {
      const dataUrl = await fileToDataUrl(file);
      const img = await loadImage(dataUrl);
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const photo: PhotoState = {
          src: dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          orientation: detectOrientation(img.naturalWidth, img.naturalHeight),
          fileName: file.name,
          mimeType: file.type || "image/heic",
          loadedAt: Date.now(),
        };
        return { photo, converted: false };
      }
    } catch {
      // Native decoding not supported on this browser/file; fallback to WASM converter
    }
  }

  // 4. Fallback to WASM converter if HEIC and native decode failed
  let working = file;
  let converted = false;

  if (isHeic) {
    working = await convertHeicToJpeg(file);
    converted = true;
  }

  const dataUrl = await fileToDataUrl(working);
  const img = await loadImage(dataUrl);

  const orientation: PhotoOrientation = detectOrientation(
    img.naturalWidth,
    img.naturalHeight
  );

  const photo: PhotoState = {
    src: dataUrl,
    width: img.naturalWidth,
    height: img.naturalHeight,
    orientation,
    fileName: working.name,
    mimeType: working.type,
    loadedAt: Date.now(),
  };

  return { photo, converted };
}

/**
 * Detect the natural orientation of an image data URL.
 */
export async function detectPhotoOrientation(
  src: string
): Promise<PhotoOrientation> {
  const img = await loadImage(src);
  return detectOrientation(img.naturalWidth, img.naturalHeight);
}

/**
 * Produce the cropped image as a Canvas, given the source image and the
 * pixel crop area produced by react-easy-crop.
 */
export async function getCroppedCanvas(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  outputSize?: number
): Promise<HTMLCanvasElement> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  const targetSize = outputSize ?? Math.max(pixelCrop.width, pixelCrop.height);
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D canvas context");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetSize,
    targetSize
  );
  return canvas;
}

/**
 * Get a square crop data URL — used as the circular avatar source for the
 * Profile Frame and Builder ID card.
 */
export async function getCroppedAvatarDataUrl(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  outputSize = 720
): Promise<string> {
  const canvas = await getCroppedCanvas(imageSrc, pixelCrop, outputSize);
  return canvas.toDataURL("image/png");
}

/** Create a Canvas at fixed output dimensions and return its data URL. */
export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  type = "image/png",
  quality?: number
): string {
  return canvas.toDataURL(type, quality);
}
