/**
 * Color utilities for safe CSS color manipulation.
 *
 * Why: html2canvas crashes with "addColorStop: non-finite double value" when
 * gradients receive malformed 8-digit hex (e.g. `#6C5CE7CC`) on some browsers.
 * Always use rgba() instead of hex+alpha string concatenation.
 */

const HEX_RE = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** Parse "RR", "GG", "BB" hex pair → 0-255 int */
const pair = (s: string) => parseInt(s, 16);

/**
 * Convert a hex color (#RGB / #RRGGBB / #RRGGBBAA) to an `rgba(r,g,b,a)` string.
 *
 * @param hex     Hex string with or without leading `#`.
 * @param alpha   0-1 opacity. If omitted, uses the alpha embedded in 8-digit
 *                hex, otherwise 1.
 * @param fallback Returned when input is not a valid hex (default: original input).
 */
export function hexToRgba(hex: string, alpha?: number, fallback?: string): string {
  if (typeof hex !== 'string') return fallback ?? '';
  const raw = hex.trim();
  if (!HEX_RE.test(raw)) return fallback ?? raw;

  let h = raw.replace('#', '');
  // Expand shorthand #RGB → #RRGGBB
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');

  const r = pair(h.slice(0, 2));
  const g = pair(h.slice(2, 4));
  const b = pair(h.slice(4, 6));
  let a = alpha;
  if (a === undefined) {
    a = h.length === 8 ? pair(h.slice(6, 8)) / 255 : 1;
  }

  if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b) || !Number.isFinite(a)) {
    return fallback ?? raw;
  }
  // Clamp alpha and trim trailing zeros
  const aClamped = Math.max(0, Math.min(1, a));
  return `rgba(${r},${g},${b},${+aClamped.toFixed(3)})`;
}

/** Convert a 2-char hex alpha suffix like "CC", "20", "08" to a 0-1 number. */
export function hexAlphaToFloat(hexAlpha: string): number {
  const n = parseInt(hexAlpha, 16);
  return Number.isFinite(n) ? n / 255 : 1;
}
