"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { BossGrid } from "./BossGrid";
import { ConfirmDialog } from "./ConfirmDialog";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { RegionFilters } from "./RegionFilters";
import { SearchBar } from "./SearchBar";
import { ALL_REGIONS, LOCAL_BOSSES } from "@/lib/bosses";
import { fetchWeeklyBosses, weeklyBossImageUrl } from "@/lib/genshin-api";
import {
  getServerTimersSnapshot,
  getTimersSnapshot,
  removeTimer,
  resetTimers,
  setTimer,
  subscribeTimers,
} from "@/lib/timer-store";
import { getRemainingMs } from "@/lib/timers";
import type { ApiStatus, Boss } from "@/lib/types";

const noopSubscribe = () => () => {};

export function Dashboard() {
  const [bosses, setBosses] = useState<Boss[]>(LOCAL_BOSSES);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("loading");
  const [now, setNow] = useState(() => Date.now());
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [resetOpen, setResetOpen] = useState(false);

  const timers = useSyncExternalStore(
    subscribeTimers,
    getTimersSnapshot,
    getServerTimersSnapshot,
  );

  // True only after hydration; lets us hide timer state during SSR.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  // Single 1s clock driving all countdowns.
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Fetch weekly bosses from the API; the curated dataset already covers
  // them offline, so failure simply flips the header status.
  useEffect(() => {
    let cancelled = false;
    fetchWeeklyBosses()
      .then((apiBosses) => {
        if (cancelled) return;
        const byId = new Map(apiBosses.map((b) => [b.id, b]));
        setBosses(
          LOCAL_BOSSES.map((boss) => {
            const api = byId.get(boss.id);
            if (!api) return boss;
            return {
              ...boss,
              name: api.name || boss.name,
              image: weeklyBossImageUrl(boss.id),
              source: "api" as const,
            };
          }),
        );
        setApiStatus("connected");
      })
      .catch(() => {
        if (!cancelled) setApiStatus("offline");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDefeat = useCallback((id: string) => {
    setTimer(id, Date.now());
  }, []);

  const handleClear = useCallback((id: string) => {
    removeTimer(id);
  }, []);

  const handleReset = useCallback(() => {
    resetTimers();
    setResetOpen(false);
  }, []);

  const visibleBosses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bosses.filter(
      (boss) =>
        (region === "All" || boss.region === region) &&
        (!q || boss.name.toLowerCase().includes(q)),
    );
  }, [bosses, query, region]);

  const { activeCount, availableCount } = useMemo(() => {
    if (!mounted) return { activeCount: 0, availableCount: bosses.length };
    const bossById = new Map(bosses.map((b) => [b.id, b]));
    let active = 0;
    for (const [id, defeatedAt] of Object.entries(timers)) {
      const boss = bossById.get(id);
      if (!boss) continue;
      if (getRemainingMs(defeatedAt, boss.respawnMinutes, now) > 0) active += 1;
    }
    return { activeCount: active, availableCount: bosses.length - active };
  }, [mounted, timers, now, bosses]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header status={apiStatus} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 sm:px-6">
        <Hero
          active={activeCount}
          available={availableCount}
          total={bosses.length}
          mounted={mounted}
        />
        <section
          aria-label="Search and filters"
          className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="lg:w-80">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <RegionFilters
            regions={["All", ...ALL_REGIONS]}
            active={region}
            onChange={setRegion}
          />
        </section>
        <BossGrid
          bosses={visibleBosses}
          timers={timers}
          now={now}
          mounted={mounted}
          onDefeat={handleDefeat}
          onClear={handleClear}
        />
      </main>
      <Footer onResetRequest={() => setResetOpen(true)} />
      <ConfirmDialog
        open={resetOpen}
        title="Reset all timers?"
        description="Every saved boss timer will be cleared and all bosses will show as available. This cannot be undone."
        confirmLabel="Reset all"
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  );
}
