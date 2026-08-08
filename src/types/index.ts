/**
 * Type definitions for the HH Goa 2026 Builder Identity Generator.
 */

/** The generation modes the user can choose between. */
export type GeneratorMode = "profile-frame" | "builder-id" | "team-frame";

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

/** Form values for a single Builder ID card. */
export interface BuilderFormValues {
  name: string;
  role: string;
  builderTitle: string;
  twitter?: string;
  builderId?: string;
}

/** Team Member data structure. */
export interface TeamMember {
  id: string;
  builderId?: string;
  name: string;
  role: string;
  builderTitle: string;
  twitter?: string;
  photo?: PhotoState | null;
  avatarUrl?: string | null;
  cropArea?: CroppedAreaPixels | null;
  isConfirmed?: boolean;
}

/** Form values for Team Frame mode. */
export interface TeamFormValues {
  teamName: string;
  teamTagline?: string;
  college?: string;
  members: TeamMember[];
}

/** Persisted form draft in localStorage. */
export interface PersistedDraft {
  name: string;
  role: string;
  builderTitle: string;
  builderId?: string;
  mode: GeneratorMode;
  /** Small data-URL thumbnail of the last uploaded photo. */
  photoThumb?: string;
  /** Team frame draft data */
  teamName?: string;
  teamTagline?: string;
  college?: string;
  teamMembers?: {
    id: string;
    name: string;
    role: string;
    builderTitle: string;
    photoThumb?: string;
  }[];
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
