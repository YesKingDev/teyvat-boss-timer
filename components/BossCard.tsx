"use client";

import Image from "next/image";
import { memo, useState } from "react";
import {
  formatCountdown,
  getElapsedFraction,
  getRemainingMs,
} from "@/lib/timers";
import type { Boss } from "@/lib/types";

interface BossCardProps {
  boss: Boss;
  defeatedAt: number | undefined;
  now: number;
  mounted: boolean;
  onDefeat: (id: string) => void;
  onClear: (id: string) => void;
}

function BossCardBase({
  boss,
  defeatedAt,
  now,
  mounted,
  onDefeat,
  onClear,
}: BossCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasTimer = mounted && typeof defeatedAt === "number";
  const remainingMs = hasTimer
    ? getRemainingMs(defeatedAt, boss.respawnMinutes, now)
    : 0;
  const available = !hasTimer || remainingMs <= 0;
  const progress = hasTimer
    ? getElapsedFraction(defeatedAt, boss.respawnMinutes, now)
    : 0;
  const metaLine = [boss.element, boss.type].filter(Boolean).join(" · ");
  const imageSrc =
    !imageFailed && boss.image ? boss.image : boss.fallbackImage;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-panel/80 shadow-lg shadow-black/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
        available
          ? "border-emerald-300/15 hover:border-emerald-300/40 hover:shadow-[0_10px_44px_-10px_rgb(52_211_153/0.3)]"
          : "border-gold/20 hover:border-gold/45 hover:shadow-[0_10px_44px_-10px_rgb(232_200_120/0.3)]"
      }`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={`Artwork of ${boss.name}`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={() => setImageFailed(true)}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-panel via-panel/15 to-transparent"
          aria-hidden="true"
        />
        <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/90 backdrop-blur">
          {boss.region}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-md border bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur ${
            boss.source === "api"
              ? "border-gold/40 text-gold"
              : "border-white/10 text-muted"
          }`}
          title={
            boss.source === "api"
              ? "Name and artwork verified against genshin.jmp.blue"
              : "Curated local data (API has no entry for this boss)"
          }
        >
          {boss.source === "api" ? "API" : "Local"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-semibold leading-snug text-ink">
            {boss.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted">{metaLine}</p>
        </div>

        <div className="mt-auto">
          {available ? (
            <div className="flex min-h-[4.75rem] items-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold tracking-[0.18em] text-emerald-300">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-300"
                  aria-hidden="true"
                />
                AVAILABLE
              </span>
            </div>
          ) : (
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-muted">
                RESPAWNS IN
              </p>
              <p
                className="mt-1 font-mono text-3xl font-semibold tabular-nums text-gold"
                role="timer"
                aria-label={`${boss.name} respawns in ${formatCountdown(remainingMs)}`}
              >
                {formatCountdown(remainingMs)}
              </p>
              <div
                className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/5"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold transition-[width] duration-1000 ease-linear"
                  style={{ width: `${(progress * 100).toFixed(1)}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            {available ? (
              <button
                type="button"
                onClick={() => onDefeat(boss.id)}
                aria-label={`Mark ${boss.name} as defeated now`}
                className="flex-1 rounded-xl bg-gradient-to-b from-[#f1dca8] to-gold-deep px-4 py-2.5 text-sm font-bold text-[#231a08] transition hover:brightness-110 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Defeated Now
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onDefeat(boss.id)}
                  aria-label={`Restart the respawn timer for ${boss.name}`}
                  className="flex-1 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold/20 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  Restart Timer
                </button>
                <button
                  type="button"
                  onClick={() => onClear(boss.id)}
                  aria-label={`Clear the respawn timer for ${boss.name}`}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-white/25 hover:text-ink active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export const BossCard = memo(BossCardBase);
