"use client";

/**
 * Local draft persistence. Persists the minimum form fields plus a tiny
 * thumbnail of the last photo so a refresh picks up where the user left off.
 * All on-device — no network calls.
 */

import { APP_CONFIG } from "@/constants";
import type { BuilderLevel, GeneratorMode, PersistedDraft } from "@/types";

const EMPTY_DRAFT: PersistedDraft = {
  name: "",
  role: "",
  college: "",
  github: "",
  xHandle: "",
  builderTitle: "",
  builderLevel: "gold",
  badge: "",
  mode: "builder-id",
  updatedAt: 0,
};

function isBuilderLevel(v: unknown): v is BuilderLevel {
  return v === "bronze" || v === "silver" || v === "gold" || v === "platinum";
}

function safeRead(): PersistedDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(APP_CONFIG.storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedDraft>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      role: typeof parsed.role === "string" ? parsed.role : "",
      college: typeof parsed.college === "string" ? parsed.college : "",
      github: typeof parsed.github === "string" ? parsed.github : "",
      xHandle: typeof parsed.xHandle === "string" ? parsed.xHandle : "",
      builderTitle:
        typeof parsed.builderTitle === "string" ? parsed.builderTitle : "",
      builderLevel: isBuilderLevel(parsed.builderLevel)
        ? parsed.builderLevel
        : "gold",
      badge: typeof parsed.badge === "string" ? parsed.badge : "",
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
  if (next.photoThumb === "") next.photoThumb = undefined;
  safeWrite(next);
  return next;
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(APP_CONFIG.storageKey);
    // Also clear any older draft keys from previous versions.
    window.localStorage.removeItem("hh-goa-2026:draft:v1");
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
