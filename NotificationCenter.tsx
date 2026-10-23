"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Wifi, Bluetooth, Moon, Flashlight, BatteryLow, ChevronUp, CheckCheck, BellOff } from "lucide-react";
import { useCase } from "@/components/game/context";
import { notificationsFor } from "@/game/derive";
import { loadRead, markRead, markAllRead } from "@/game/readState";
import { sfx } from "@/lib/audio";
import { useThreat } from "@/components/game/threat";

export default function NotificationCenter({
  open,
  onClose,
  battery,
}: {
  open: boolean;
  onClose: () => void;
  battery: number;
}) {
  const caseData = useCase();
  const threat = useThreat();
  const all = notificationsFor(caseData);
  const [read, setRead] = useState<string[]>([]);

  useEffect(() => {
    if (open) setRead(loadRead(caseData.id, "notif"));
  }, [open, caseData.id]);

  const notes = all.filter((n) => !read.includes(n.id));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-[58] bg-black/50"
          />
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.4, bottom: 0 }}
            onDragEnd={(_, info) => info.offset.y < -60 && onClose()}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute inset-x-0 top-0 z-[59] max-h-[88%] overflow-y-auto no-scrollbar rounded-b-[2.2rem] bg-[#0d0d11]/95 backdrop-blur-2xl border-b border-white/10 pt-12 pb-5 px-3.5"
          >
            {/* central de controle */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { icon: Plane, label: "Avião", on: threat.active ? threat.airplane : true, act: true },
                { icon: Wifi, label: "Wi-Fi", on: false, act: false },
                { icon: Bluetooth, label: "BT", on: false, act: false },
                { icon: Moon, label: "Foco", on: true, act: false },
              ].map((t) => (
                <button
                  key={t.label}
                  onClick={() => {
                    if (!t.act) return;
                    if (threat.active) threat.toggleAirplane();
                    else sfx.tap();
                  }}
                  className={`rounded-2xl py-3 flex flex-col items-center gap-1 border transition-all ${
                    t.on
                      ? "bg-[#0a84ff]/20 border-[#0a84ff]/50 text-[#9fd0ff]"
                      : "bg-white/5 border-white/10 text-neutral-400"
                  } ${t.act && threat.active ? "hover:brightness-125 active:scale-95 ring-1 ring-[#0a84ff]/30" : ""}`}
                >
                  <t.icon className="w-4 h-4" />
                  <span className="text-[9.5px] uppercase tracking-wider">{t.label}</span>
                </button>
              ))}
            </div>

            {threat.active && (
              <div className="mb-3 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-2.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-300">
                    Rastreamento remoto
                  </span>
                  <span
                    className="ml-auto text-[12px] font-bold tabular-nums"
                    style={{ color: threat.trace >= 70 ? "#ff453a" : threat.trace >= 40 ? "#e0a63c" : "#30d158" }}
                  >
                    {Math.round(threat.trace)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-black/50 overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ background: threat.trace >= 70 ? "#ff453a" : threat.trace >= 40 ? "#e0a63c" : "#30d158" }}
                    animate={{ width: `${threat.trace}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-3 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-2.5">
              <BatteryLow className={`w-4 h-4 ${battery <= 5 ? "text-red-400" : "text-amber-400"}`} />
              <span className="text-[11.5px] text-neutral-300 flex-1">
                Bateria do dispositivo apreendido
              </span>
              <span className={`text-[12px] font-bold tabular-nums ${battery <= 5 ? "text-red-400" : "text-amber-400"}`}>
                {battery}%
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2 px-1">
              <Flashlight className="w-3 h-3 text-[#c9a86a]" />
              <span className="text-[9.5px] uppercase tracking-[0.2em] text-[#c9a86a]">
                Notificações preservadas ({notes.length})
              </span>
              {notes.length > 0 && (
                <button
                  onClick={() => {
                    sfx.tap();
                    setRead(markAllRead(caseData.id, "notif", all.map((n) => n.id)));
                  }}
                  className="ml-auto flex items-center gap-1 text-[9.5px] uppercase tracking-wider text-neutral-400 hover:text-white"
                >
                  <CheckCheck className="w-3 h-3" /> limpar todas
                </button>
              )}
            </div>

            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {notes.map((n, i) => (
                  <motion.button
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 220, height: 0, marginBottom: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => {
                      sfx.tap();
                      setRead(markRead(caseData.id, "notif", n.id));
                    }}
                    className={`w-full text-left rounded-2xl px-3.5 py-2.5 border backdrop-blur active:scale-[0.98] transition-transform ${
                      n.urgent
                        ? "bg-[#8f1f1f]/15 border-[#8f1f1f]/40"
                        : "bg-white/[0.07] border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9.5px] uppercase tracking-wider text-neutral-400">
                        {n.app}
                      </span>
                      <span className="ml-auto text-[10px] text-neutral-400">{n.time}</span>
                    </div>
                    <div className="text-[13px] font-semibold text-white leading-snug">{n.title}</div>
                    <p className="text-[12px] text-neutral-300 leading-snug line-clamp-2">{n.text}</p>
                    <div className="text-[9px] uppercase tracking-wider text-neutral-500 mt-1">
                      toque para dispensar
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>

              {notes.length === 0 && (
                <div className="py-10 flex flex-col items-center gap-2 text-neutral-500">
                  <BellOff className="w-6 h-6" />
                  <span className="text-[12px]">Nenhuma notificação pendente</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-1 pt-4 text-neutral-500">
              <ChevronUp className="w-4 h-4" />
              <span className="text-[10px]">arraste para cima para fechar</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
