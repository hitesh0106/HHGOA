/**
 * Encode/decode builder and team share data with clean, human-readable URL query parameters.
 */

import {
  saveAvatar,
  saveTeamAvatars,
  loadAvatar,
  loadTeamAvatars,
} from "./share-storage";

export interface TeamMemberShareData {
  n: string; // name
  r: string; // role
  t: string; // builderTitle
}

export interface ShareData {
  m?: "builder-id" | "team-frame" | "profile-frame";
  n?: string; // name
  r?: string; // role
  t?: string; // builderTitle
  // Team Frame fields
  tn?: string; // teamName
  tt?: string; // teamTagline
  c?: string;  // college
  tm?: TeamMemberShareData[]; // team members
}

/**
 * Encode ShareData → clean base64 string.
 */
export function encodeShareData(data: ShareData): string {
  const json = JSON.stringify(data);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decode URL search params or base64 string → ShareData. Returns null on failure.
 */
export function decodeShareDataFromUrl(searchParams: URLSearchParams): ShareData | null {
  // 1. Check for clean query parameters first (e.g. ?team=Zedda or ?name=Hitesh)
  const team = searchParams.get("team") || searchParams.get("tn");
  const name = searchParams.get("name") || searchParams.get("n");
  const mode = searchParams.get("mode") || searchParams.get("m");
  const share = searchParams.get("share");

  if (team || mode === "team") {
    const tmList: TeamMemberShareData[] = [];
    for (let i = 1; i <= 3; i++) {
      const mName = searchParams.get(`m${i}`) || "";
      const mRole = searchParams.get(`r${i}`) || "";
      const mTitle = searchParams.get(`t${i}`) || "";
      if (mName || mRole || mTitle) {
        tmList.push({ n: mName, r: mRole, t: mTitle });
      }
    }
    return {
      m: "team-frame",
      tn: team || "Team Pass",
      tt: searchParams.get("tagline") || searchParams.get("tt") || "",
      c: searchParams.get("college") || searchParams.get("c") || "",
      tm: tmList.length > 0 ? tmList : [
        { n: searchParams.get("m1") || "", r: searchParams.get("r1") || "", t: searchParams.get("t1") || "" },
        { n: searchParams.get("m2") || "", r: searchParams.get("r2") || "", t: searchParams.get("t2") || "" },
      ],
    };
  }

  if (name) {
    return {
      m: "builder-id",
      n: name,
      r: searchParams.get("role") || searchParams.get("r") || "Builder",
      t: searchParams.get("title") || searchParams.get("t") || "AI Architect",
    };
  }

  // 2. Fallback to base64 ?share= param
  if (share) {
    return decodeShareData(share);
  }

  return null;
}

/**
 * Decode URL-safe base64 → ShareData. Returns null on failure.
 */
export function decodeShareData(encoded: string): ShareData | null {
  try {
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    if (pad) b64 += "=".repeat(4 - pad);
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json) as ShareData;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      m: parsed.m || "builder-id",
      n: typeof parsed.n === "string" ? parsed.n : "",
      r: typeof parsed.r === "string" ? parsed.r : "",
      t: typeof parsed.t === "string" ? parsed.t : "",
      tn: typeof parsed.tn === "string" ? parsed.tn : "",
      tt: typeof parsed.tt === "string" ? parsed.tt : "",
      c: typeof parsed.c === "string" ? parsed.c : "",
      tm: Array.isArray(parsed.tm) ? parsed.tm : [],
    };
  } catch {
    return null;
  }
}

/**
 * Store single avatar data URL using IndexedDB + LocalStorage fallback.
 */
export function storeAvatarForShare(encodedKey: string, avatarUrl: string): void {
  void saveAvatar(encodedKey, avatarUrl);
}

/**
 * Store team avatars array using IndexedDB + LocalStorage fallback.
 */
export function storeTeamAvatarsForShare(encodedKey: string, avatarUrls: (string | null)[]): void {
  void saveTeamAvatars(encodedKey, avatarUrls);
}

/**
 * Retrieve single avatar data URL asynchronously/synchronously.
 */
export async function getAvatarForShareAsync(key: string): Promise<string | null> {
  return loadAvatar(key);
}

/**
 * Retrieve team avatars array asynchronously/synchronously.
 */
export async function getTeamAvatarsForShareAsync(key: string): Promise<(string | null)[]> {
  return loadTeamAvatars(key);
}

/**
 * Synchronous fallback wrapper for getAvatarForShare.
 */
export function getAvatarForShare(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const val = window.localStorage.getItem(`hh-goa:avatar:${key}`);
    return val || null;
  } catch {
    return null;
  }
}

/**
 * Synchronous fallback wrapper for getTeamAvatarsForShare.
 */
export function getTeamAvatarsForShare(key: string): (string | null)[] {
  if (typeof window === "undefined") return [];
  try {
    const val = window.localStorage.getItem(`hh-goa:team-avatars:${key}`);
    if (!val) return [];
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Build a clean, short human-readable share URL for given data.
 */
export function buildShareUrl(data: ShareData): string {
  if (typeof window === "undefined") return "";
  const origin = window.location.origin;
  const path = window.location.pathname;

  if (data.m === "team-frame") {
    const params = new URLSearchParams();
    params.set("team", data.tn || "Pass");
    if (data.c) params.set("college", data.c);
    if (data.tt) params.set("tagline", data.tt);
    (data.tm || []).forEach((m, idx) => {
      if (m.n) params.set(`m${idx + 1}`, m.n);
      if (m.r) params.set(`r${idx + 1}`, m.r);
      if (m.t) params.set(`t${idx + 1}`, m.t);
    });
    return `${origin}${path}?${params.toString()}`;
  }

  const params = new URLSearchParams();
  params.set("name", data.n || "Builder");
  if (data.r) params.set("role", data.r);
  if (data.t) params.set("title", data.t);

  return `${origin}${path}?${params.toString()}`;
}
