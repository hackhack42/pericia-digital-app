"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AppShell, { PinButton } from "../AppShell";
import { useCase } from "@/components/game/context";
import type { Note } from "@/game/types";

export default function NotesApp() {
  const caseData = useCase();
  const [open, setOpen] = useState<Note | null>(null);

  if (open) {
    return (
      <AppShell
        title="Nota"
        onBack={() => setOpen(null)}
        right={open.evidenceId ? <PinButton evidenceId={open.evidenceId} /> : undefined}
        headerBlack
      >
        <div className="p-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-[#f5edd8] text-[#3a3125] p-5 shadow-xl rotate-[-0.4deg]"
          >
            <div className="font-hand text-2xl font-bold mb-3">{open.title}</div>
            <div className="font-hand text-xl leading-relaxed whitespace-pre-line">{open.body}</div>
            <div className="mt-5 text-[11px] text-[#8a7a55] font-sans">Editada em {open.updated}</div>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Notas">
      <div className="p-3 space-y-2">
        {caseData.notes.map((n, i) => (
          <motion.button
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setOpen(n)}
            className="w-full text-left rounded-xl bg-[#1c1c1e] p-3.5 active:bg-[#26262a]"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] flex-1 truncate">{n.title}</span>
              {n.evidenceId && <span className="w-2 h-2 rounded-full bg-[#c9a86a] shrink-0" />}
            </div>
            <p className="text-[13px] text-neutral-400 truncate mt-0.5">{n.body}</p>
            <div className="text-[11px] text-neutral-400 mt-1">{n.updated}</div>
          </motion.button>
        ))}
      </div>
    </AppShell>
  );
}
