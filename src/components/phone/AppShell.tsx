"use client";

import React from "react";
import { ChevronLeft, Pin, Check } from "lucide-react";
import { useGame, useCase } from "@/components/game/context";

/** Botão-alfinete para anexar item como prova. */
export function PinButton({ evidenceId, tone = "light" }: { evidenceId: string; tone?: "light" | "dark" }) {
  const { hasEvidence, collect } = useGame();
  const caseData = useCase();
  const collected = hasEvidence(evidenceId);
  const meta = caseData.evidence[evidenceId];

  if (collected) {
    return (
      <span
        title={meta?.title}
        className="inline-flex items-center gap-1 rounded-full bg-[#c9a86a]/15 border border-[#c9a86a]/40 text-[#c9a86a] px-2 py-1 text-[11px] sm:text-[10px] font-semibold px-3 py-1.5 min-h-[32px] uppercase tracking-wider shrink-0"
      >
        <Check className="w-3 h-3" /> No dossiê
      </span>
    );
  }
  return (
    <button
      title={`Anexar como prova: ${meta?.title ?? ""}`}
      onClick={(e) => {
        e.stopPropagation();
        collect(evidenceId);
      }}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] sm:text-[10px] font-semibold px-3 py-1.5 min-h-[32px] uppercase tracking-wider shrink-0 transition-colors ping-soft ${
        tone === "dark"
          ? "bg-black/70 text-[#c9a86a] border border-[#c9a86a]/50 hover:bg-black"
          : "bg-[#c9a86a]/10 text-[#c9a86a] border border-[#c9a86a]/40 hover:bg-[#c9a86a]/20"
      }`}
    >
      <Pin className="w-3 h-3" /> Anexar prova
    </button>
  );
}

export default function AppShell({
  title,
  onBack,
  right,
  children,
  headerBlack = false,
}: {
  title: React.ReactNode;
  onBack?: () => void;
  right?: React.ReactNode;
  children: React.ReactNode;
  headerBlack?: boolean;
}) {
  return (
    <div className="absolute inset-0 bg-[#0b0b0e] flex flex-col text-neutral-100">
      <div className="pt-[52px]" />
      <div className={`h-14 sm:h-12 flex items-center gap-2 px-3 sm:px-2 border-b border-white/10 ${headerBlack ? "bg-black" : "bg-[#111114]"}`}>
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center text-[#0a84ff] text-[16px] sm:text-[15px] px-2 py-2 -ml-2 active:opacity-60 min-h-[44px]"
          >
            <ChevronLeft className="w-7 h-7 sm:w-6 sm:h-6 -mr-1" strokeWidth={2.4} />
            Voltar
          </button>
        ) : (
          <div className="w-16 sm:w-14" />
        )}
        <div className="flex-1 text-center font-semibold text-[15px] truncate">{title}</div>
        <div className="min-w-14 flex justify-end pr-2">{right}</div>
      </div>
      <div className="flex-1 overflow-y-auto nice-scroll overscroll-contain pb-10">{children}</div>
    </div>
  );
}
