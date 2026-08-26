// Pure timer utilities. All countdowns are derived from stored timestamps
// (`defeatedAt + duration - now`) so they never drift and survive reloads.

/** Milliseconds remaining until the boss respawns (<= 0 means available). */
export function getRemainingMs(
  defeatedAt: number,
  respawnMinutes: number,
  now: number,
): number {
  return defeatedAt + respawnMinutes * 60_000 - now;
}

/** Format remaining milliseconds as HH:MM:SS (hours may exceed 24 for weekly bosses). */
export function formatCountdown(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** Fraction (0..1) of the respawn duration that has elapsed. */
export function getElapsedFraction(
  defeatedAt: number,
  respawnMinutes: number,
  now: number,
): number {
  if (respawnMinutes <= 0) return 1;
  const fraction = (now - defeatedAt) / (respawnMinutes * 60_000);
  return Math.min(1, Math.max(0, fraction));
}
