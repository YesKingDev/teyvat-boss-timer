"use client";

import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-panel p-6 shadow-2xl shadow-black/50"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="confirm-dialog-title"
          className="font-display text-lg font-semibold text-ink"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-description"
          className="mt-2 text-sm leading-relaxed text-muted"
        >
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-white/25 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-danger/90 px-4 py-2.5 text-sm font-bold text-[#2a0b0b] transition hover:bg-danger active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
