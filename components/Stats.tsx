interface StatsProps {
  active: number;
  available: number;
  total: number;
  mounted: boolean;
}

export function Stats({ active, available, total, mounted }: StatsProps) {
  const items = [
    { label: "Active Timers", value: active, accent: "text-gold" },
    { label: "Available Bosses", value: available, accent: "text-emerald-300" },
    { label: "Total Bosses", value: total, accent: "text-ink" },
  ];
  return (
    <section
      aria-label="Boss statistics"
      className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-panel/60 px-6 py-5 backdrop-blur-sm"
        >
          <p
            className={`font-display text-3xl font-semibold tabular-nums ${item.accent}`}
          >
            {mounted ? item.value : "—"}
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            {item.label}
          </p>
        </div>
      ))}
    </section>
  );
}
