/**
 * Builder ID Registry & Persistence Manager.
 *
 * Stores generated individual Builder IDs locally so they can be looked up
 * and combined into a HH Goa Team Frame.
 */

export interface SavedBuilderProfile {
  builderId: string; // e.g. "HH26-HITESH-X7K2"
  name: string;
  role: string;
  builderTitle: string;
  avatarUrl: string | null;
  createdAt: number;
}

const STORAGE_KEY = "hh-goa:builder-registry:v1";
const CURRENT_USER_KEY = "hh-goa:current-user-builder:v1";

/** Sample pre-registered Builders available out-of-the-box for quick testing. */
const SAMPLE_BUILDERS: SavedBuilderProfile[] = [
  {
    builderId: "HH26-ALEX-9K82",
    name: "Alex Rivera",
    role: "AI · LLM Architect",
    builderTitle: "Prompt Architect",
    avatarUrl: null,
    createdAt: Date.now() - 86400000,
  },
  {
    builderId: "HH26-SAM-3F91",
    name: "Sam Chen",
    role: "Frontend · UX Craftsman",
    builderTitle: "Pixel Crafter",
    avatarUrl: null,
    createdAt: Date.now() - 43200000,
  },
  {
    builderId: "HH26-RAHUL-7B4D",
    name: "Rahul Verma",
    role: "DevOps · Cloud Infrastructure",
    builderTitle: "Cloud Orchestrator",
    avatarUrl: null,
    createdAt: Date.now() - 21600000,
  },
];

/** Generate a clean, unique Builder ID code (e.g. HH26-HITESH-X7K2). */
export function generateUniqueBuilderId(name: string): string {
  const cleanName = name
    ? name.trim().split(/\s+/)[0].toUpperCase().replace(/[^A-Z]/g, "")
    : "BUILDER";
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HH26-${cleanName || "BUILDER"}-${randomSuffix}`;
}

/** Save a generated Builder ID profile to localStorage. */
export function saveBuilderProfile(profile: SavedBuilderProfile): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getAllSavedBuilders();
    const filtered = existing.filter((b) => b.builderId !== profile.builderId);
    const updated = [profile, ...filtered];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error("[BuilderRegistry] failed to save profile", err);
  }
}

/** Retrieve all saved Builder profiles. */
export function getAllSavedBuilders(): SavedBuilderProfile[] {
  if (typeof window === "undefined") return SAMPLE_BUILDERS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SAMPLE_BUILDERS;
    const parsed = JSON.parse(raw) as SavedBuilderProfile[];
    if (!Array.isArray(parsed)) return SAMPLE_BUILDERS;
    // Merge with sample builders so samples are always available for testing
    const sampleIds = new Set(parsed.map((b) => b.builderId));
    const merged = [...parsed];
    for (const sample of SAMPLE_BUILDERS) {
      if (!sampleIds.has(sample.builderId)) {
        merged.push(sample);
      }
    }
    return merged;
  } catch {
    return SAMPLE_BUILDERS;
  }
}

/** Look up a Builder ID profile by its unique code (case-insensitive). */
export function findBuilderById(builderId: string): SavedBuilderProfile | null {
  if (!builderId || !builderId.trim()) return null;
  const targetCode = builderId.trim().toUpperCase();
  const all = getAllSavedBuilders();
  return all.find((b) => b.builderId.toUpperCase() === targetCode) || null;
}

/** Get the current user's most recently generated Builder ID profile. */
export function getCurrentUserBuilder(): SavedBuilderProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedBuilderProfile;
  } catch {
    return null;
  }
}
