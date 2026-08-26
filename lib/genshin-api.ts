import { API_BASE_URL, API_TIMEOUT_MS } from "./config";

/**
 * Data layer for the fan-made genshin.jmp.blue API (static game data).
 *
 * Note: the API only exposes *weekly* bosses under /boss/weekly-boss and
 * generic elite enemies under /enemies — normal overworld bosses such as
 * Hypostases or the Oceanid are not available, so those come from the
 * curated local dataset instead (see lib/bosses.ts).
 */

export interface ApiBoss {
  id: string;
  /** Empty string when the detail request failed (caller keeps local name). */
  name: string;
}

async function fetchJson<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${path} (${response.status})`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function extractName(detail: unknown): string {
  if (detail && typeof detail === "object" && "name" in detail) {
    const name = (detail as { name: unknown }).name;
    if (typeof name === "string" && name.trim().length > 0) return name;
  }
  return "";
}

/**
 * Fetch the weekly-boss list and each boss's display name.
 * Individual detail failures degrade gracefully to an empty name.
 * Throws when the API is unreachable or returns an unexpected shape.
 */
export async function fetchWeeklyBosses(): Promise<ApiBoss[]> {
  const list: unknown = await fetchJson<unknown>("/boss/weekly-boss");
  if (!Array.isArray(list)) {
    throw new Error("Unexpected weekly-boss list shape");
  }
  const ids = list.filter((v): v is string => typeof v === "string" && v.length > 0);
  if (ids.length === 0) {
    throw new Error("Weekly-boss list is empty");
  }
  return Promise.all(
    ids.map(async (id): Promise<ApiBoss> => {
      try {
        const detail = await fetchJson<unknown>(`/boss/weekly-boss/${id}`);
        return { id, name: extractName(detail) };
      } catch {
        return { id, name: "" };
      }
    }),
  );
}

/** Direct artwork URL for a weekly boss (webp, served by the API). */
export function weeklyBossImageUrl(id: string): string {
  return `${API_BASE_URL}/boss/weekly-boss/${id}/icon`;
}
