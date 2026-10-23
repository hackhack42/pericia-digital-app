"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, TrendingUp, Clock, Target, Lightbulb, ShieldAlert, Trash2 } from "lucide-react";
import {
  loadCareer,
  rankOf,
  nextRank,
  rankProgress,
  stats,
  MEDALS,
  saveCareer,
  EMPTY_CAREER,
  LOW_REP,
  type Career,
} from "@/game/career";
import { CASES } from "@/game/cases";
import { addressed, type DetectiveProfile } from "@/game/profile";
import { sfx } from "@/lib/audio";

export default function Dashboard({
  open,
  onClose,
  profile,
}: {
  open: boolean;
  onClose: () => void;
  profile: DetectiveProfile | null;
}) {
  const [career, setCareer] = useState<Career>(EMPTY_CAREER);

  useEffect(() => {
    if (open) setCareer(loadCareer());
  }, [open]);

  const rank = rankOf(career.xp);
  const nxt = nextRank(career.xp);
  const prog = rankProgress(career.xp);
  const s = stats(career);

  const repColor =
    career.reputation < LOW_REP ? "#ff453a" : career.reputation < 70 ? "#e0a63c" : "#79d17a";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[86] bg-black/90 backdrop-blur-md overflow-y-auto nice-scroll"
        >
          <div className="min-h-full flex items-start sm:items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="paper w-full max-w-3xl rounded-xl p-5 sm:p-8 my-4 relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#c9a86a] mb-4">
                <Award className="w-4 h-4" /> ficha funcional
              </div>

              {/* identificação + patente */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <div className="min-w-0 flex-1">
                  <div className="font-elite text-2xl sm:text-3xl text-white leading-tight">
                    {addressed(profile)}
                  </div>
                  <div className="text-[13px] font-semibold mt-1" style={{ color: rank.color }}>
                    {rank.name}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[28px] font-bold text-white tabular-nums leading-none">
                    {career.xp}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-neutral-400">XP total</div>
                </div>
              </div>

              {/* barra de patente */}
              <div className="mb-2">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                  <span>Progresso de patente</span>
                  <span>{nxt ? `próxima: ${nxt.name} (${nxt.min} XP)` : "patente máxima"}</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: rank.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${prog}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* reputação */}
              <div className="mb-6">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5 mt-4">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3 h-3" /> Reputação na corregedoria
                  </span>
                  <span style={{ color: repColor }}>{career.reputation}/100</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: repColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${career.reputation}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
                {career.reputation < LOW_REP && (
                  <p className="text-[11.5px] text-red-300/90 mt-2 leading-snug">
                    Reputação crítica: a chefia limitou seus recursos de apoio a 2 dicas por caso.
                    Resolva um caso corretamente para recuperar.
                  </p>
                )}
              </div>

              {/* métricas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {[
                  { icon: Target, label: "Taxa de acerto", value: `${s.accuracy}%` },
                  { icon: TrendingUp, label: "Casos resolvidos", value: `${s.uniqueSolved}/${Object.keys(CASES).length}` },
                  { icon: Clock, label: "Tempo médio", value: s.avgTime ? `${Math.floor(s.avgTime / 60)}min` : "—" },
                  { icon: Lightbulb, label: "Dicas por caso", value: String(s.avgHints) },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg border border-white/10 bg-black/30 p-3 text-center">
                    <m.icon className="w-4 h-4 mx-auto mb-1 text-[#c9a86a]" />
                    <div className="text-[17px] font-bold text-white tabular-nums">{m.value}</div>
                    <div className="text-[9px] uppercase tracking-wider text-neutral-400 leading-tight mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                {[
                  ["Condenações", s.solved, "#79d17a"],
                  ["Arquivados", s.weak, "#e0a63c"],
                  ["Inocentes acusados", s.wrong, "#ff453a"],
                ].map(([l, v, c]) => (
                  <div key={String(l)} className="rounded-lg border border-white/10 bg-black/20 py-2.5">
                    <div className="text-[20px] font-bold tabular-nums" style={{ color: String(c) }}>
                      {String(v)}
                    </div>
                    <div className="text-[9.5px] uppercase tracking-wider text-neutral-400">{String(l)}</div>
                  </div>
                ))}
              </div>

              {/* medalhas */}
              <div className="mb-6">
                <div className="redacted text-[10px] tracking-[0.25em] uppercase text-[#c9a86a] border-b border-[#c9a86a]/25 pb-2 mb-3">
                  Condecorações ({career.medals.length}/{MEDALS.length})
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MEDALS.map((m) => {
                    const got = career.medals.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        title={m.desc}
                        className={`rounded-lg border p-2.5 text-center transition ${
                          got ? "border-[#c9a86a]/50 bg-[#c9a86a]/10" : "border-white/8 bg-black/20 opacity-45"
                        }`}
                      >
                        <div className="text-xl mb-0.5" style={{ filter: got ? "none" : "grayscale(1)" }}>
                          {m.icon}
                        </div>
                        <div className={`text-[10.5px] font-semibold leading-tight ${got ? "text-[#c9a86a]" : "text-neutral-400"}`}>
                          {m.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* histórico */}
              {career.records.length > 0 && (
                <div>
                  <div className="redacted text-[10px] tracking-[0.25em] uppercase text-[#c9a86a] border-b border-[#c9a86a]/25 pb-2 mb-3">
                    Histórico recente
                  </div>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto nice-scroll pr-1">
                    {career.records.slice(0, 12).map((r, i) => {
                      const c = CASES[r.caseId];
                      const col =
                        r.outcome === "perfect" ? "#79d17a" : r.outcome === "weak" ? "#e0a63c" : "#ff453a";
                      return (
                        <div key={i} className="flex items-center gap-2.5 rounded-lg bg-black/25 px-3 py-2">
                          <span className="w-1.5 h-8 rounded-full shrink-0" style={{ background: col }} />
                          <div className="min-w-0 flex-1">
                            <div className="text-[12.5px] text-neutral-100 truncate">
                              {c?.title ?? r.caseId}
                            </div>
                            <div className="text-[10.5px] text-neutral-400">
                              {r.outcome === "perfect"
                                ? "Condenação"
                                : r.outcome === "weak"
                                  ? "Arquivado por prova frágil"
                                  : "Inocente acusado"}{" "}
                              · {Math.floor(r.elapsed / 60)}min · {r.hints} dica(s)
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      if (!confirm("Apagar toda a ficha funcional? Isso zera patente, XP e medalhas.")) return;
                      saveCareer(EMPTY_CAREER);
                      setCareer(EMPTY_CAREER);
                      sfx.error();
                    }}
                    className="mt-3 flex items-center gap-1.5 text-[10.5px] uppercase tracking-widest text-neutral-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" /> zerar ficha funcional
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
