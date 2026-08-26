import type { ApiStatus } from "@/lib/types";

const STATUS_META: Record<
  ApiStatus,
  { label: string; dotClass: string; pillClass: string }
> = {
  loading: {
    label: "Connecting…",
    dotClass: "bg-muted animate-pulse-soft",
    pillClass: "border-white/10 text-muted",
  },
  connected: {
    label: "API Connected",
    dotClass: "bg-emerald-400",
    pillClass: "border-emerald-300/25 text-emerald-300",
  },
  offline: {
    label: "Offline Fallback",
    dotClass: "bg-amber-400",
    pillClass: "border-amber-300/25 text-amber-300",
  },
};

function Logo() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="64" height="64" rx="14" fill="#0D121C" />
      <rect
        x="17"
        y="17"
        width="30"
        height="30"
        transform="rotate(45 32 32)"
        fill="none"
        stroke="#E8C878"
        strokeWidth="3"
      />
      <rect
        x="26"
        y="26"
        width="12"
        height="12"
        transform="rotate(45 32 32)"
        fill="#E8C878"
      />
    </svg>
  );
}

export function Header({ status }: { status: ApiStatus }) {
  const meta = STATUS_META[status];
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold tracking-[0.28em] text-gold">
              TEYVAT TOOLS
            </p>
            <p className="text-xs text-muted">Boss Timer</p>
          </div>
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full border bg-panel/60 px-3 py-1.5 text-xs font-medium ${meta.pillClass}`}
          role="status"
        >
          <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} aria-hidden="true" />
          {meta.label}
        </div>
      </div>
    </header>
  );
}
