"use client";

import { BossCard } from "./BossCard";
import type { Boss, TimerMap } from "@/lib/types";

interface BossGridProps {
  bosses: Boss[];
  timers: TimerMap;
  now: number;
  mounted: boolean;
  onDefeat: (id: string) => void;
  onClear: (id: string) => void;
}

export function BossGrid({
  bosses,
  timers,
  now,
  mounted,
  onDefeat,
  onClear,
}: BossGridProps) {
  if (bosses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-panel/40 px-6 py-16 text-center">
        <p className="font-display text-lg text-ink">No bosses found</p>
        <p className="mt-2 text-sm text-muted">
          Try a different search term or region filter.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bosses.map((boss) => (
        <li key={boss.id}>
          <BossCard
            boss={boss}
            defeatedAt={timers[boss.id]}
            now={now}
            mounted={mounted}
            onDefeat={onDefeat}
            onClear={onClear}
          />
        </li>
      ))}
    </ul>
  );
}
