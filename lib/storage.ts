import { STORAGE_KEY } from "./config";
import type { TimerMap } from "./types";

/**
 * Load timers from localStorage. Returns an empty map when storage is
 * unavailable (SSR, private mode) or contains corrupted data.
 */
export function loadTimers(): TimerMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const clean: TimerMap = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        clean[id] = value;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

/** Persist timers. Failures (quota, private mode) are silently ignored. */
export function saveTimers(timers: TimerMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
  } catch {
    // Storage unavailable — timers simply won't persist.
  }
}

/** Remove all stored timers. */
export function clearTimers(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable.
  }
}
