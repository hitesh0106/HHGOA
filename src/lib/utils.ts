import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format bytes into a human readable string. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024))
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

/** Clamp a number between min and max. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Detect orientation from intrinsic image dimensions. */
export function detectOrientation(
  width: number,
  height: number
): "portrait" | "landscape" | "square" {
  if (width === height) return "square";
  if (width > height) return "landscape";
  return "portrait";
}

/** Compute initials from a name. */
export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "B";
  const parts = trimmed.split(/\s+/).filter(Boolean).slice(0, 2);
  const letters = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return letters || "B";
}

/** Promise-based image loader. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/** Convert a File to a data URL. */
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/** Resize an image data URL into a small thumbnail data URL (used for localStorage). */
export async function makeThumbnail(
  src: string,
  maxSize = 96
): Promise<string> {
  try {
    const img = await loadImage(src);
    const canvas = document.createElement("canvas");
    const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.7);
  } catch {
    return "";
  }
}

/** Simple deterministic pseudo-random number generator (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick a random item from an array, optionally avoiding a previous value. */
export function pickRandom<T>(items: readonly T[], avoid?: T): T {
  if (items.length === 0) throw new Error("pickRandom: empty array");
  if (items.length === 1) return items[0];
  let pick = items[Math.floor(Math.random() * items.length)];
  let guard = 0;
  while (avoid !== undefined && pick === avoid && guard < 8) {
    pick = items[Math.floor(Math.random() * items.length)];
    guard++;
  }
  return pick;
}

/** Sleep helper. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Trigger a download of a data URL or blob URL. */
export function triggerDownload(url: string, fileName: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
