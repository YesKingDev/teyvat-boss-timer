"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <label htmlFor="boss-search" className="sr-only">
        Search bosses
      </label>
      <input
        id="boss-search"
        type="search"
        placeholder="Search bosses..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        className="h-12 w-full rounded-xl border border-white/10 bg-panel/80 pl-11 pr-4 text-ink placeholder:text-muted/70 transition focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/25"
      />
    </div>
  );
}
