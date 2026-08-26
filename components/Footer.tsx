"use client";

interface FooterProps {
  onResetRequest: () => void;
}

export function Footer({ onResetRequest }: FooterProps) {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p className="text-xs text-muted">
          Unofficial fan-made tool · Not affiliated with HoYoverse
        </p>
        <button
          type="button"
          onClick={onResetRequest}
          className="rounded-lg px-2 py-1 text-xs font-medium text-muted underline-offset-4 transition hover:text-danger hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
        >
          Reset all timers
        </button>
      </div>
    </footer>
  );
}
