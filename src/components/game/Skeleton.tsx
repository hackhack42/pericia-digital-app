"use client";

import { motion } from "framer-motion";
import { ScanLine } from "lucide-react";

const STEPS = [
  "Escaneando memória ROM…",
  "Reconstruindo setores apagados…",
  "Decifrando índice de arquivos…",
  "Verificando integridade (hash)…",
  "Montando partição em modo leitura…",
];

export function ForensicLoader({ label, lines = 4 }: { label?: string; lines?: number }) {
  return (
    <div className="p-4 space-y-3" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#c9a86a]">
        <ScanLine className="w-3.5 h-3.5 animate-pulse" />
        <motion.span
          key={label}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          {label ?? STEPS[0]}
        </motion.span>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/[0.06] relative overflow-hidden shrink-0">
              <Shimmer delay={i * 0.12} />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 rounded bg-white/[0.06] relative overflow-hidden" style={{ width: `${60 + ((i * 13) % 35)}%` }}>
                <Shimmer delay={i * 0.12} />
              </div>
              <div className="h-2 rounded bg-white/[0.04] relative overflow-hidden" style={{ width: `${35 + ((i * 17) % 40)}%` }}>
                <Shimmer delay={i * 0.12 + 0.05} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Shimmer({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      animate={{ x: ["-100%", "200%"] }}
      transition={{ duration: 1.5, repeat: Infinity, delay, ease: "linear" }}
    />
  );
}

/** Tela cheia de boot do terminal. */
export function BootScreen({ step = 0 }: { step?: number }) {
  return (
    <div className="h-dvh w-full bg-[#08080a] flex flex-col items-center justify-center gap-5 px-6">
      <motion.div
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="font-elite text-[#c9a86a] tracking-[0.35em] text-xs sm:text-sm uppercase text-center"
      >
        {STEPS[step % STEPS.length]}
      </motion.div>
      <div className="w-full max-w-xs h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-[#c9a86a]"
          animate={{ width: ["5%", "92%"] }}
          transition={{ duration: 2.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
