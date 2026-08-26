import { clearTimers, loadTimers, saveTimers } from "./storage";
import type { TimerMap } from "./types";

// Minimal external store for boss timers, backed by localStorage and
// consumed via useSyncExternalStore. Keeps localStorage as the single
// source of truth so timers survive reloads and browser restarts.

let state: TimerMap | null = null;
const listeners = new Set<() => void>();

// Stable empty snapshot for SSR/hydration: useSyncExternalStore requires
// getServerSnapshot to return a cached value, never a fresh object.
const EMPTY_TIMERS: TimerMap = {};

function ensureLoaded(): TimerMap {
  if (state === null) state = loadTimers();
  return state;
}

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeTimers(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTimersSnapshot(): TimerMap {
  return ensureLoaded();
}

/** Snapshot used during SSR/hydration (localStorage not available). */
export function getServerTimersSnapshot(): TimerMap {
  return EMPTY_TIMERS;
}

export function setTimer(id: string, defeatedAt: number): void {
  const next = { ...ensureLoaded(), [id]: defeatedAt };
  state = next;
  saveTimers(next);
  emit();
}

export function removeTimer(id: string): void {
  const next = { ...ensureLoaded() };
  delete next[id];
  state = next;
  saveTimers(next);
  emit();
}

export function resetTimers(): void {
  state = {};
  clearTimers();
  emit();
}
