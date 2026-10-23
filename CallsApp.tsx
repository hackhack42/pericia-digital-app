"use client";

import { motion } from "framer-motion";
import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Info } from "lucide-react";
import AppShell, { PinButton } from "../AppShell";
import { useCase } from "@/components/game/context";

export default function CallsApp() {
  const caseData = useCase();
  return (
    <AppShell title="Recentes">
      <div className="divide-y divide-white/5">
        {caseData.calls.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 px-4 py-3"
          >
            {c.type === "in" ? (
              <PhoneIncoming className="w-4 h-4 text-neutral-400 shrink-0" />
            ) : c.type === "out" ? (
              <PhoneOutgoing className="w-4 h-4 text-neutral-400 shrink-0" />
            ) : (
              <PhoneMissed className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className={`font-semibold text-[15px] truncate ${c.type === "missed" ? "text-red-400" : ""}`}>
                {c.name}
              </div>
              <div className="text-[12px] text-neutral-400">
                {c.sub ?? "celular"}
                {c.duration ? ` · ${c.duration} min` : ""}
              </div>
            </div>
            <span className="text-[11px] text-neutral-400 shrink-0">{c.time}</span>
            {c.evidenceId ? (
              <PinButton evidenceId={c.evidenceId} />
            ) : (
              <Info className="w-4 h-4 text-neutral-700 shrink-0" />
            )}
          </motion.div>
        ))}
      </div>
      <p className="px-4 pt-4 text-[11px] text-neutral-400">
        Registro telefônico exportado pela perícia em 15/10 às 09:12.
      </p>
    </AppShell>
  );
}
