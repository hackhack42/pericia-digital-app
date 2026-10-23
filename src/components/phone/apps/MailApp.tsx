"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AppShell, { PinButton } from "../AppShell";
import { useCase } from "@/components/game/context";
import type { Mail } from "@/game/types";

export default function MailApp() {
  const caseData = useCase();
  const [open, setOpen] = useState<Mail | null>(null);

  if (open) {
    return (
      <AppShell
        title="Caixa de Entrada"
        onBack={() => setOpen(null)}
        right={open.evidenceId ? <PinButton evidenceId={open.evidenceId} /> : undefined}
        headerBlack
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
          <div className="text-lg font-semibold leading-snug">{open.subject}</div>
          <div className="mt-3 flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-neutral-500 to-neutral-700 flex items-center justify-center font-bold">
              {open.from[0]}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-[14px]">{open.from}</div>
              <div className="text-[12px] text-neutral-400 truncate">
                {open.address} · para marina@estudiomd.com.br
              </div>
            </div>
            <span className="ml-auto text-[11px] text-neutral-400 shrink-0">{open.time}</span>
          </div>
          <p className="py-4 text-[14px] leading-relaxed text-neutral-300 whitespace-pre-line font-[350]">
            {open.body}
          </p>
        </motion.div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Entrada" right={<span className="text-[12px] text-[#0a84ff]">Editar</span>}>
      <div className="divide-y divide-white/5">
        {caseData.mails.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setOpen(m)}
            className="w-full text-left px-4 py-3.5 active:bg-white/5"
          >
            <div className="flex items-baseline gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0a84ff] shrink-0 translate-y-[-1px]" />
              <span className="font-semibold text-[15px] truncate">{m.from}</span>
              <span className="ml-auto text-[11px] text-neutral-400 shrink-0">{m.time}</span>
            </div>
            <div className="pl-4">
              <div className="text-[14px] text-neutral-200 truncate">{m.subject}</div>
              <p className="text-[13px] text-neutral-400 line-clamp-2">{m.preview}</p>
              {m.evidenceId && <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#c9a86a]" />}
            </div>
          </motion.button>
        ))}
      </div>
    </AppShell>
  );
}
