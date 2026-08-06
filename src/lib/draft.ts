"use client";

/**
 * Local draft persistence. We only persist the minimum: name, role, last
 * Builder Title, mode and a small thumbnail of the last photo. All on-device,
 * no network, no analytics. Cleared instantly with clearDraft().
 */

import { APP_CONFIG } from "@/constants";
import type { GeneratorMode, PersistedDraft } from "@/types";

const EMPTY_DRAFT: PersistedDraft = {
  name: "",
  role: "",
  builderTitle: "",
  mode: "builder-id",
  updatedAt: 0,
};

function safeRead(): PersistedDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(APP_CONFIG.storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedDraft;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      role: typeof parsed.role === "string" ? parsed.role : "",
      builderTitle:
        typeof parsed.builderTitle === "string" ? parsed.builderTitle : "",
      mode:
        parsed.mode === "profile-frame" || parsed.mode === "builder-id"
          ? (parsed.mode as GeneratorMode)
          : "builder-id",
      photoThumb:
        typeof parsed.photoThumb === "string" ? parsed.photoThumb : undefined,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : 0,
    };
  } catch {
    return null;
  }
}

function safeWrite(draft: PersistedDraft): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(draft));
  } catch {
    // Storage quota / private mode — silently ignore.
  }
}

export function readDraft(): PersistedDraft {
  return safeRead() ?? EMPTY_DRAFT;
}

export function writeDraft(patch: Partial<PersistedDraft>): PersistedDraft {
  const current = readDraft();
  const next: PersistedDraft = {
    ...current,
    ...patch,
    updatedAt: Date.now(),
  };
  // Don't persist the photo thumb if it's empty string.
  if (next.photoThumb === "") next.photoThumb = undefined;
  safeWrite(next);
  return next;
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(APP_CONFIG.storageKey);
  } catch {
    // ignore
  }
}

export function hasDraft(): boolean {
  const draft = readDraft();
  return Boolean(
    draft.name || draft.role || draft.builderTitle || draft.photoThumb
  );
}
