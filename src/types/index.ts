/**
 * Type definitions for the HH Goa 2026 Builder ID Generator.
 */

/** The two generation modes the user can choose between. */
export type GeneratorMode = "profile-frame" | "builder-id";

/** Supported photo formats. */
export type AcceptedPhotoType = "image/jpeg" | "image/png" | "image/webp" | "image/heic" | "image/heif";

/** Natural image orientation detected from intrinsic dimensions. */
export type PhotoOrientation = "portrait" | "landscape" | "square";

/** State held for an uploaded photo while it is being cropped. */
export interface PhotoState {
  /** Object URL or data URL for the source image. */
  src: string;
  /** Intrinsic pixel width of the source. */
  width: number;
  /** Intrinsic pixel height of the source. */
  height: number;
  /** Detected orientation. */
  orientation: PhotoOrientation;
  /** Original file name (used for download fallback naming). */
  fileName: string;
  /** Original MIME type. */
  mimeType: string;
  /** When the photo was loaded (epoch ms). */
  loadedAt: number;
}

/** Builder Levels (gamified rarity). */
export type BuilderLevel = "bronze" | "silver" | "gold" | "platinum";

/** Form values for the Builder ID card. */
export interface BuilderFormValues {
  name: string;
  role: string;
  college: string;
  github: string;
  xHandle: string;
  builderTitle: string;
  builderLevel: BuilderLevel;
  badge: string;
}

/** Persisted form draft in localStorage. */
export interface PersistedDraft {
  name: string;
  role: string;
  college: string;
  github: string;
  xHandle: string;
  builderTitle: string;
  builderLevel: BuilderLevel;
  badge: string;
  mode: GeneratorMode;
  /** Small data-URL thumbnail of the last uploaded photo. */
  photoThumb?: string;
  updatedAt: number;
}

/** Result returned by the image generator. */
export interface GenerateResult {
  /** PNG data URL. */
  dataUrl: string;
  /** Suggested file name. */
  fileName: string;
  /** Width in px. */
  width: number;
  /** Height in px. */
  height: number;
  /** Generation time in ms. */
  durationMs: number;
}

/** Crop area produced by react-easy-crop. */
export interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Builder Level definition with rarity styling. */
export interface LevelDefinition {
  id: BuilderLevel;
  label: string;
  /** Tailwind-compatible gradient stops. */
  gradient: [string, string];
  /** Hex color used for SVG fills / QR accents. */
  hex: string;
  glow: string;
  rarity: string;
}

/** A random fun badge definition. */
export interface BadgeDefinition {
  id: string;
  label: string;
  emoji: string;
}
