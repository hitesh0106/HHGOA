/**
 * Photo handling utilities — validation, robust HEIC/HEIF conversion, cropping, and
 * pixel-perfect crop extraction. All browser-side, no network calls.
 */

import { APP_CONFIG } from "@/constants";
import { detectOrientation, fileToDataUrl, loadImage } from "@/lib/utils";
import type { PhotoOrientation, PhotoState } from "@/types";

type Heic2AnyFn = (options: {
  blob: Blob;
  toType: string;
  quality: number;
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
    console.error("[getHeic2Any] import failed", err);
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
 * Convert HEIC/HEIF files to JPEG using heic2any with ArrayBuffer.
 * Returns a new File object with the JPEG payload.
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    const heic2any = await getHeic2Any();
    const arrayBuffer = await file.arrayBuffer();
    const blobToConvert = new Blob([arrayBuffer], { type: "image/heic" });

    const result = await heic2any({
      blob: blobToConvert,
      toType: "image/jpeg",
      quality: 0.9,
    });
    const blob = Array.isArray(result) ? result[0] : result;
    const newName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
    return new File([blob], newName, { type: "image/jpeg" });
  } catch (err) {
    console.warn("[heic2any] conversion failed", err);
    throw new Error(
      "We could not convert that HEIC photo. Please choose a JPG/PNG photo or snap a selfie with the Use Camera button."
    );
  }
}

/**
 * Load a File into a PhotoState object.
 * First tests native browser decoding (Safari, iOS, macOS), then falls back to WASM conversion.
 */
export async function loadPhotoFromFile(file: File): Promise<PhotoLoadResult> {
  const name = file.name.toLowerCase();
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif");

  // 1. Try native browser decoding first (works 100% natively on Safari, iOS, macOS & systems with codecs)
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
    // Native decoding not supported on this browser/file; fallback to WASM converter
  }

  // 2. Fallback to WASM converter if HEIC and native decode failed
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
