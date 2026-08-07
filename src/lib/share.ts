/**
 * Encode/decode builder share data to/from URL-safe base64.
 *
 * The share link encodes name, role, and builderTitle into a compact
 * URL param. The cropped avatar photo is stored in localStorage (keyed
 * by the encoded share string) so it can be retrieved when the share
 * link is opened in another tab on the same browser.
 *
 * Cross-device/cross-browser sharing gracefully falls back to initials.
 */

export interface ShareData {
  n: string; // name
  r: string; // role
  t: string; // builderTitle
}

const AVATAR_PREFIX = "hh-goa:avatar:";

/**
 * Encode ShareData → URL-safe base64 string.
 */
export function encodeShareData(data: ShareData): string {
  const json = JSON.stringify(data);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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
      n: typeof parsed.n === "string" ? parsed.n : "",
      r: typeof parsed.r === "string" ? parsed.r : "",
      t: typeof parsed.t === "string" ? parsed.t : "",
    };
  } catch {
    return null;
  }
}

/**
 * Store the cropped avatar data URL in localStorage, keyed by the encoded
 * share string. This allows the photo to appear when the share link is
 * opened in another tab on the same browser.
 *
 * Uses a small JPEG to stay within localStorage quota.
 */
export function storeAvatarForShare(encoded: string, avatarUrl: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AVATAR_PREFIX + encoded, avatarUrl);
  } catch {
    // Quota exceeded or private mode — silently ignore. The share link
    // will still work, just without the photo.
  }
}

/**
 * Retrieve the stored avatar data URL for the given encoded share string.
 * Returns null if not found (e.g. different browser/device).
 */
export function getAvatarForShare(encoded: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const val = window.localStorage.getItem(AVATAR_PREFIX + encoded);
    return val || null;
  } catch {
    return null;
  }
}

/**
 * Build a full share URL for the given builder data.
 * Uses window.location.origin so it works on any deployment.
 */
export function buildShareUrl(data: ShareData): string {
  if (typeof window === "undefined") return "";
  const encoded = encodeShareData(data);
  return `${window.location.origin}${window.location.pathname}?share=${encoded}`;
}
