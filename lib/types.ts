export type Region =
  | "Mondstadt"
  | "Liyue"
  | "Inazuma"
  | "Sumeru"
  | "Fontaine"
  | "Natlan";

export type BossType = "Normal Boss" | "Weekly Boss";

/**
 * Where the boss data comes from:
 * - "api":    name/artwork verified against genshin.jmp.blue
 * - "local":  curated fallback dataset (API has no data for these bosses)
 */
export type BossDataSource = "api" | "local";

export interface Boss {
  id: string;
  name: string;
  region: Region;
  element?: string;
  type: BossType;
  /** Minutes after defeat until the boss becomes available again. */
  respawnMinutes: number;
  /** Remote artwork (API-backed), if available for this boss. */
  image?: string;
  /** Local artwork used when no API image exists or it fails to load. */
  fallbackImage: string;
  source: BossDataSource;
}

/** Map of boss id -> defeated-at timestamp (ms since epoch). */
export type TimerMap = Record<string, number>;

export type ApiStatus = "loading" | "connected" | "offline";
