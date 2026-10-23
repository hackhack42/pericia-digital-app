"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserX, AlertTriangle, ShieldOff } from "lucide-react";
import { useGame } from "./context";
import { sfx } from "@/lib/audio";

const MSGS = [
  { title: "🕵️ Interferência detectada", msg: "Alguém acrescentou informações falsas ao dossiê. Revise suas provas — nem tudo que você coletou pode ser confiável.", action: "Desconsiderar" },
  { title: "📡 Sinal interceptado", msg: "O agente infiltrado acessou sua linha segura. As respostas da equipe CBI nas próximas horas podem estar comprometidas.", action: "Entendido" },
  { title: "⚠️ Alerta interno", msg: "Registramos um acesso não autorizado ao terminal às 03:17. Alguém está monitorando sua investigação por dentro.", action: "Reportar" },
  { title: "🗑️ Arquivo adulterado", msg: "Um dos relatórios do dossiê foi modificado. Não sabemos qual. Confira as datas com atenção.", action: "Ok" },
  { title: "📞 Chamada interceptada", msg: "A ligação entre você e a equipe foi interceptada. O conteúdo pode ter sido alterado antes de chegar ao seu terminal.", action: "Continuar" },
  { title: "🔑 Chave comprometida", msg: "A chave de acesso do agente PD-2026-0000 foi usada no seu terminal. Esse agente não existe no sistema.", action: "Ignorar" },
];

export default function Infiltrado() {
  const game = useGame();
  const [msg, setMsg] = useState<typeof MSGS[0] | null>(null);
  const fired = useRef(new Set<number>());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!game.phoneUnlocked || !game.caseData) return;

    const schedule = () => {
      const delay = (4 + Math.random() * 4) * 60 * 1000;
      timerRef.current = setTimeout(() => {
        const idx = Math.floor(Math.random() * MSGS.length);
        if (!fired.current.has(idx)) {
          fired.current.add(idx);
          setMsg(MSGS[idx]);
          sfx.alarm();
          if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([60, 40, 120]);
        }
        schedule();
      }, delay);
    };

    schedule();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [game.phoneUnlocked, game.caseData]);

  useEffect(() => {
    const count = game.evidence.length;
    if (count !== 5 && count !== 8) return;
    const t = setTimeout(() => {
      const idx = Math.floor(Math.random() * MSGS.length);
      setMsg(MSGS[idx]);
      sfx.error();
    }, 8000);
    return () => clearTimeout(t);
  }, [game.evidence.length]);

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="fixed bottom-24 right-4 z-[82] w-[300px] sm:w-[320px] rounded-xl border border-red-500/40 bg-[#160808]/97 shadow-2xl overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-red-800 via-red-500 to-red-800 overflow-hidden">
            <motion.div
              className="h-full bg-red-400 origin-left"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 10, ease: "linear" }}
              onAnimationComplete={() => setMsg(null)}
            />
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-950 border border-red-500/40 flex items-center justify-center shrink-0">
                <UserX className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">{msg.title}</div>
                <div className="text-[9px] uppercase tracking-widest text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" /> agente infiltrado · ativo
                </div>
              </div>
            </div>
            <p className="text-[12.5px] text-neutral-300 leading-snug mb-3">{msg.msg}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setMsg(null)}
                className="flex-1 rounded-lg border border-red-500/40 text-red-300 py-2 text-[11px] font-bold uppercase tracking-wider hover:bg-red-950/30"
              >
                <ShieldOff className="w-3.5 h-3.5 inline mr-1" /> {msg.action}
              </button>
              <button
                onClick={() => setMsg(null)}
                className="rounded-lg border border-white/10 text-neutral-400 px-3 py-2 text-[11px] hover:bg-white/5"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
