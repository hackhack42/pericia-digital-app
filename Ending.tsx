"use client";

import { motion } from "framer-motion";
import { RotateCcw, FolderOpen, Stamp, Clock, KeyRound, Lightbulb, Target, Pin, ShieldCheck, FileWarning, Fingerprint } from "lucide-react";
import { useCase, useGame } from "./context";
import { addressed } from "@/game/profile";
import { useEffect } from "react";
import { sfx } from "@/lib/audio";

const STYLES: Record<string, { accent: string; ring: string; label: string; spin?: boolean }> = {
  perfect: { accent: "#c9a86a", ring: "border-[#c9a86a]", label: "veredito do júri técnico" },
  weak: { accent: "#d18f3c", ring: "border-[#d18f3c]", label: "ministério público" },
  wrong: { accent: "#d14c3c", ring: "border-[#d14c3c]", label: "poder judiciário" },
};

export default function Ending({
  result,
  attempts,
  evidenceCount,
  onClose,
  onRestart,
}: {
  result: "perfect" | "weak" | "wrong";
  attempts: number;
  evidenceCount: number;
  onClose: () => void;
  onRestart: () => void;
}) {
  const caseData = useCase();
  const { profile, elapsed, pinTries, hints, evidence } = useGame();
  const epi = caseData.epilogues[result];
  const st = STYLES[result];
  const bgClass = result === "perfect" ? "bg-[#08120b]" : result === "weak" ? "bg-[#141005]" : "bg-[#140505]";
  const borderClass = result === "perfect" ? "border-[#30d158]/30" : result === "weak" ? "border-[#e0a63c]/30" : "border-[#ff453a]/30";


  useEffect(() => {
    if (result === "perfect") sfx.solved();
    else sfx.alarm();
  }, [result]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const totalEvidence = Object.keys(caseData.evidence).length;
  const precision =
    result === "perfect"
      ? Math.max(40, 100 - hints * 6 - pinTries * 3 - Math.max(0, attempts - 1) * 12)
      : result === "weak"
        ? 55 - hints * 4
        : 20;

  const stats = [
    { icon: Clock, label: "Tempo decorrido", value: `${mm}:${ss}` },
    { icon: Pin, label: "Provas anexadas", value: `${evidenceCount}/${totalEvidence}` },
    { icon: KeyRound, label: "Erros de senha", value: String(pinTries) },
    { icon: Lightbulb, label: "Dicas usadas", value: String(hints) },
    { icon: Target, label: "Tentativas de acusação", value: String(attempts) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md overflow-y-auto nice-scroll"
    >
      <div className="min-h-full flex items-center justify-center p-6">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.15 }}
          className={`paper max-w-2xl w-full rounded-xl p-6 md:p-12 relative border-t-8 shadow-2xl ${borderClass} ${bgClass}`}
        >
          {/* stamp */}
          <motion.div
            initial={{ scale: 2.4, opacity: 0, rotate: -14 }}
            animate={{ scale: 1, opacity: 1, rotate: -8 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 16 }}
            className={`absolute -top-6 right-6 md:right-10 border-4 ${st.ring} px-5 py-2.5 font-elite text-xl md:text-2xl tracking-[0.25em] uppercase`}
            style={{ color: st.accent, textShadow: "0 0 24px rgba(0,0,0,0.6)" }}
          >
            {epi.title}
          </motion.div>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-6">
            <Stamp className="w-4 h-4" /> {st.label} · caso nº 2471
          </div>

          <p className="text-[12px] text-neutral-400 mb-3">
            Termo de encerramento assinado por{" "}
            <b className="text-[#c9a86a]">{addressed(profile)}</b>.
          </p>

          <h2 className="font-elite text-2xl md:text-3xl text-white leading-tight mb-6 pr-4 sm:pr-24">
            {result === "perfect"
              ? "A verdade coube em 3% de bateria."
              : result === "weak"
                ? "Certa suspeita. Frágil demais."
                : "A pessoa errada pagou."}
          </h2>

          <div className="space-y-4 mb-8 bg-black/40 p-5 rounded-lg border border-white/5">
            {epi.text.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.45 }}
                className="flex gap-3"
              >
                <span className="text-xl leading-none mt-1" style={{ color: st.accent }}>❝</span>
                <p className="text-[14px] md:text-[15px] leading-relaxed text-neutral-200">
                  {p}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
            className="mt-8 pt-6 border-t border-white/10"
          >
            <div className="flex items-baseline justify-between mb-3">
              <span className="redacted text-[10px] tracking-[0.25em] uppercase text-[#c9a86a]">
                Relatório de desempenho
              </span>
              <span className="text-[11px] text-neutral-400">
                caso nº {caseData.no} · {caseData.victim.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-lg border border-white/10 bg-black/30 p-2.5 text-center">
                  <s.icon className="w-3.5 h-3.5 mx-auto mb-1 text-[#c9a86a]" />
                  <div className="text-[15px] font-bold text-white tabular-nums">{s.value}</div>
                  <div className="text-[9px] uppercase tracking-wider text-neutral-400 leading-tight mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 shrink-0">
                Precisão
              </span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ background: st.accent }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, precision))}%` }}
                  transition={{ delay: 2.7, duration: 0.9 }}
                />
              </div>
              <span className="text-[13px] font-bold tabular-nums" style={{ color: st.accent }}>
                {Math.min(100, Math.max(0, precision))}%
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.9 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            {result !== "perfect" && (
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-[#c9a86a]/50 text-[#c9a86a] py-3.5 text-[12px] font-bold uppercase tracking-widest hover:bg-[#c9a86a]/10 transition-colors flex items-center justify-center gap-2"
              >
                <FolderOpen className="w-4 h-4" /> Reabrir investigação
              </button>
            )}
            <button
              onClick={onRestart}
              className={`flex-1 rounded-lg py-3.5 text-[12px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                result === "perfect"
                  ? "bg-[#c9a86a] text-black hover:bg-[#d9bc82]"
                  : "border border-white/20 text-neutral-300 hover:bg-white/5"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              {result === "perfect" ? "Jogar novamente" : "Recomeçar do zero"}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
