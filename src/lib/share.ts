/**
 * Encode/decode builder share data to/from URL-safe base64.
 *
 * The share link encodes name, role, and builderTitle into a compact
 * URL param so a recipient opening the link sees a showcase page with
 * those details. Photos cannot be embedded (too large for a URL), so
 * the showcase uses an initials-based avatar.
 */

export interface ShareData {
  n: string; // name
  r: string; // role
  t: string; // builderTitle
}

/**
 * Encode ShareData → URL-safe base64 string.
 */
export function encodeShareData(data: ShareData): string {
  const json = JSON.stringify(data);
  // btoa works on Latin-1 strings. Use encodeURIComponent to handle UTF-8.
  const b64 = btoa(unescape(encodeURIComponent(json)));
  // URL-safe: replace +/ with -_ and strip padding.
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decode URL-safe base64 → ShareData. Returns null on failure.
 */
export function decodeShareData(encoded: string): ShareData | null {
  try {
    // Restore standard base64.
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    // Re-pad.
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
 * Build a full share URL for the given builder data.
 * Uses window.location.origin so it works on any deployment.
 */
export function buildShareUrl(data: ShareData): string {
  if (typeof window === "undefined") return "";
  const encoded = encodeShareData(data);
  return `${window.location.origin}${window.location.pathname}?share=${encoded}`;
}
