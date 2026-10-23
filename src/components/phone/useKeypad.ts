"use client";

import { useEffect } from "react";

/**
 * Permite digitar os códigos usando o teclado físico do computador.
 * Aceita dígitos (incluindo teclado numérico), Backspace/Delete e Escape.
 */
export function useKeypad(opts: {
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onClear?: () => void;
  enabled?: boolean;
}) {
  const { onDigit, onBackspace, onClear, enabled = true } = opts;

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        onDigit(e.key);
      } else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        onBackspace();
      } else if (e.key === "Escape") {
        onClear?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDigit, onBackspace, onClear, enabled]);
}
