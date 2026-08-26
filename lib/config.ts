// Central configuration for boss respawn behaviour.
//
// In-game mechanics (as of current game versions):
// - Normal overworld bosses reappear roughly 3 minutes after being defeated.
// - Weekly bosses can be challenged once per week (weekly reset, Mondays).
//
// The data model supports per-boss custom durations via `Boss.respawnMinutes`;
// these defaults only apply when a boss does not define its own value.

export const DEFAULT_RESPAWN_MINUTES = 3;

export const WEEKLY_RESPAWN_MINUTES = 7 * 24 * 60; // 7 days

export const STORAGE_KEY = "teyvat-boss-timers-v1";

export const API_BASE_URL = "https://genshin.jmp.blue";

export const API_TIMEOUT_MS = 6000;
