"use client";

interface RegionFiltersProps {
  regions: string[];
  active: string;
  onChange: (region: string) => void;
}

export function RegionFilters({ regions, active, onChange }: RegionFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter bosses by region"
      className="flex flex-wrap gap-2"
    >
      {regions.map((region) => {
        const isActive = region === active;
        return (
          <button
            key={region}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(region)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
              isActive
                ? "border-gold/60 bg-gold/15 text-gold"
                : "border-white/10 bg-panel/60 text-muted hover:border-white/25 hover:text-ink"
            }`}
          >
            {region}
          </button>
        );
      })}
    </div>
  );
}
