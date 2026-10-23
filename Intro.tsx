"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2, FolderOpen, Star, X, Archive, GraduationCap,
  RotateCcw, Lock, Award, ShieldAlert,
} from "lucide-react";
import { CASE_LIST } from "@/game/cases";
import type { CaseData } from "@/game/types";
import { useGame, useHydrate, caseKey } from "./context";
import { greet, addressed } from "@/game/profile";
import { sfx } from "@/lib/audio";
import {
  loadCareer, rankOf, nextRank, rankProgress,
  caseLocked, bossMessage, LOW_REP, RANKS, EMPTY_CAREER, type Career,
} from "@/game/career";
import Dashboard from "./Dashboard";
import { useAuth } from "@/components/auth/AuthContext";

const DIFFS = [
  { id: 0, label: "Todos" },
  { id: 1, label: "⭐ Fácil" },
  { id: 2, label: "⭐⭐ Médio" },
  { id: 3, label: "⭐⭐⭐ Difícil" },
];

export default function Intro({ onStart }: { onStart: () => void }) {
  const game = useGame();
  const { agent } = useAuth();
  const hydrate = useHydrate();
  const [selected, setSelected] = useState<CaseData | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [busy, setBusy] = useState(false);
  const [existing, setExisting] = useState<Record<string, string>>({});
  const [career, setCareer] = useState<Career>(EMPTY_CAREER);
  const [dash, setDash] = useState(false);
  const [diffFilter, setDiffFilter] = useState(0);

  useEffect(() => {
    setCareer(loadCareer());
    const found: Record<string, string> = {};
    for (const c of CASE_LIST) {
      const id = localStorage.getItem(caseKey(c.id));
      if (id) found[c.id] = id;
    }
    setExisting(found);
  }, [dash, selected]);

  useEffect(() => {
    if (!selected) return;
    setVisibleLines(0);
    const t = window.setInterval(() => {
      setVisibleLines((v) => {
        if (v >= selected.briefing.length) { window.clearInterval(t); return v; }
        return v + 1;
      });
    }, 320);
    return () => window.clearInterval(t);
  }, [selected]);

  const enter = async (c: CaseData) => {
    setBusy(true);
    const storedId = existing[c.id];
    try {
      if (storedId) {
        const res = await fetch(`/api/session?id=${storedId}`);
        if (res.ok) {
          const row = await res.json();
          game.reset();
          game.startSession(row.id, c);
          hydrate({ caseId: c.id, evidence: row.evidence ?? [], answered: row.answered ?? {}, phoneUnlocked: row.phoneUnlocked ?? false, solved: row.solved ?? false, attempts: row.attempts ?? 0, hints: row.hints ?? 0, chat: row.chat ?? {} });
          onStart(); return;
        }
        localStorage.removeItem(caseKey(c.id));
      }
      const res = await fetch("/api/session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: c.id }),
      });
      const row = await res.json();
      game.reset();
      game.startSession(row.id, c);
      onStart();
    } catch { /* stay */ } finally { setBusy(false); }
  };

  const archive = (c: CaseData, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = localStorage.getItem(caseKey(c.id));
    if (id) {
      localStorage.removeItem(caseKey(c.id));
      localStorage.removeItem(`caso2471_bank_${c.id}`);
      localStorage.removeItem(`caso2471_notas_${c.id}`);
      localStorage.removeItem(`caso2471_mural_${c.id}`);
      sfx.tap();
      setExisting((prev) => { const next = { ...prev }; delete next[c.id]; return next; });
    }
  };

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, busy]);

  const rank = rankOf(career.xp);
  const nxt = nextRank(career.xp);
  const boss = bossMessage(career);

  return (
    <div className="relative min-h-dvh w-full bg-[#08080a] overflow-x-hidden">
      {/* fundo */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(201,168,106,0.07) 0%, transparent 60%)",
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Logo e título */}
        <div className="text-center mb-10">
          <div className="text-[11px] uppercase tracking-[0.35em] text-[#c9a86a]/70 mb-3">
            Delegacia de Homicídios · Arquivo de Casos Frios
          </div>
          <h1 className="font-elite text-4xl sm:text-6xl text-white leading-tight mb-3">
            PERícia<span className="text-[#8f1f1f]">·</span>DIGITAL
          </h1>
          <p className="text-[13px] text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            <b className="text-[#c9a86a]">{greet(game.profile, 1)}</b>{" "}
            {CASE_LIST.length} celulares lacrados na bancada. Suba na carreira para destravar casos mais complexos.
          </p>
        </div>

        {/* Painel de carreira */}
        <div className="mb-8 rounded-xl border border-white/10 bg-black/40 p-4">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Award className="w-4 h-4 shrink-0" style={{ color: rank.color }} />
            <span className="text-[13px] font-semibold" style={{ color: rank.color }}>{rank.name}</span>
            <span className="text-[11px] text-neutral-400">{career.xp} XP</span>
            <span className="flex items-center gap-1 text-[11px]" style={{
              color: career.reputation < LOW_REP ? "#ff453a" : career.reputation < 70 ? "#e0a63c" : "#79d17a"
            }}>
              <ShieldAlert className="w-3 h-3" /> reputação {career.reputation}
            </span>
            <button onClick={() => { setDash(true); sfx.tap(); }}
              className="ml-auto rounded-full border border-[#c9a86a]/50 text-[#c9a86a] px-3 py-1.5 text-[10px] uppercase tracking-widest hover:bg-[#c9a86a]/10 transition-colors">
              Ficha funcional
            </button>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ background: rank.color, width: `${rankProgress(career.xp)}%` }} />
          </div>
          {nxt && <div className="text-[10.5px] text-neutral-400 mt-1.5">faltam {nxt.min - career.xp} XP para {nxt.name}</div>}
          {boss && (
            <div className={`mt-3 rounded-lg px-3 py-2.5 text-[12px] leading-snug border ${
              boss.tone === "pressure" ? "border-red-500/40 bg-red-950/20 text-red-200"
              : boss.tone === "praise" ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-200"
              : "border-white/10 bg-black/30 text-neutral-300"}`}>
              {boss.text}
            </div>
          )}
        </div>

        {/* Filtro de dificuldade */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 shrink-0">Dificuldade:</span>
          {DIFFS.map(d => (
            <button key={d.id} type="button" onClick={() => setDiffFilter(d.id)}
              className={`rounded-full border px-3.5 py-1.5 text-[11px] transition-colors ${
                diffFilter === d.id
                  ? "border-[#c9a86a] bg-[#c9a86a]/15 text-white"
                  : "border-white/15 text-neutral-400 hover:border-white/30"
              }`}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Divisões por patente */}
        {RANKS.map((tier) => {
          const group = CASE_LIST.filter((c) =>
            (c.minRank ?? 1) === tier.id &&
            (diffFilter === 0 || c.difficulty === diffFilter)
          );
          if (group.length === 0) return null;
          const unlocked = rank.id >= tier.id;
          return (
            <section key={tier.id} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <span className="redacted text-[10px] tracking-[0.25em] uppercase shrink-0"
                  style={{ color: unlocked ? tier.color : "#6b6b70" }}>
                  {tier.id === 1 ? "Arquivo aberto · acesso livre" : `Divisão ${tier.id} · ${tier.name}`}
                </span>
                <div className="flex-1 h-px" style={{ background: unlocked ? `${tier.color}44` : "rgba(255,255,255,0.08)" }} />
                <span className="text-[10px] text-neutral-400 shrink-0 flex items-center gap-1">
                  {!unlocked && <Lock className="w-3 h-3" />}
                  {unlocked ? `${group.length} caso(s)` : `requer ${tier.min} XP`}
                </span>
              </div>

              {/* GRID DE CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {group.map((c, i) => {
                  const lock = caseLocked(career, c.minRank);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-label={`${c.title} — ${c.tagline}`}
                      onClick={() => {
                        if (lock) {
                          game.pushToast("Caso restrito", lock);
                          sfx.error();
                          return;
                        }
                        setSelected(c);   // estado PRIMEIRO
                        sfx.tap();        // som depois (já é seguro)
                      }}
                      className={`relative w-full text-left rounded-xl overflow-hidden border bg-[#0f0e0c] flex flex-col cursor-pointer select-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a86a] ${
                        lock ? "border-white/5 opacity-60" : "border-white/12 hover:border-[#c9a86a]/60 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                      }`}
                      style={{ minHeight: 340 }}
                    >
                      {/* FOTO */}
                      <div className="relative flex-none" style={{ height: 200 }}>
                        <img
                          src={c.victim.photo}
                          alt={c.victim.name}
                          loading="lazy"
                          decoding="async"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          className={lock ? "grayscale opacity-50" : "grayscale-[20%]"}
                        />
                        {/* Gradiente sobre foto */}
                        <div style={{
                          position: "absolute", inset: 0,
                          background: "linear-gradient(to top, #08080a 0%, rgba(8,8,10,0.5) 50%, transparent 100%)"
                        }} />
                        {/* Número do caso */}
                        <div className="absolute top-3 left-3 bg-[#8f1f1f] text-white text-[9px] font-bold tracking-widest px-2 py-1"
                          style={{ transform: "rotate(-2deg)" }}>
                          CASO Nº {c.no}
                        </div>
                        {/* Badge tutorial */}
                        {c.id === "tutorial" && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#1d4ed8] text-white text-[9px] font-bold tracking-widest px-2 py-1 rounded-full">
                            <GraduationCap className="w-3 h-3" /> TUTORIAL
                          </div>
                        )}
                        {/* Em andamento */}
                        {existing[c.id] && c.id !== "tutorial" && !lock && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#c9a86a] text-black text-[9px] font-bold tracking-widest px-2 py-1 rounded-full">
                            <FolderOpen className="w-3 h-3" /> EM ANDAMENTO
                          </div>
                        )}
                        {/* Bloqueado */}
                        {lock && (
                          <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 px-4 text-center pointer-events-none">
                            <Lock className="w-6 h-6 text-neutral-300" />
                            <span className="text-[11px] uppercase tracking-widest text-neutral-200">{lock}</span>
                            <span className="text-[10.5px] text-neutral-500">resolva mais casos para liberar</span>
                          </div>
                        )}
                      </div>

                      {/* TEXTO */}
                      <div className="p-4 flex flex-col flex-1 w-full">
                        <h3 className="font-elite text-[18px] text-white leading-tight mb-1.5">
                          {c.title}
                        </h3>
                        <p className="text-[12px] text-neutral-400 leading-snug mb-4 flex-1"
                          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {c.tagline}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((d) => (
                              <Star key={d} className={`w-3.5 h-3.5 ${d <= c.difficulty ? "text-[#c9a86a] fill-[#c9a86a]" : "text-neutral-700"}`} />
                            ))}
                          </div>
                          {existing[c.id] && !lock && (
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => { e.stopPropagation(); archive(c, e); }}
                              onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); archive(c, e as unknown as React.MouseEvent); } }}
                              className="flex items-center gap-1 text-[10px] text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                              title="Reiniciar"
                            >
                              <RotateCcw className="w-3 h-3" /> Reiniciar
                            </span>
                          )}
                          {!lock && (
                            <span className="text-[11px] text-[#c9a86a] font-semibold">
                              {existing[c.id] ? "Continuar →" : "Abrir →"}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="text-center text-[11px] text-neutral-600 mt-4 pb-8">
          o Safari do jogo faz buscas reais · 15–25 min por caso · progresso salvo automaticamente
        </div>
      </div>

      {/* Dashboard */}
      <Dashboard open={dash} onClose={() => setDash(false)} profile={game.profile} />

      {/* Briefing overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => !busy && setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#12110e] border border-[#c9a86a]/30 rounded-xl shadow-2xl flex flex-col overflow-hidden"
              style={{ maxHeight: "90dvh" }}
            >
              {/* Tarja urgente */}
              <div className="absolute -top-px left-0 right-0 h-1 bg-[#8f1f1f]" />

              {/* Botão fechar */}
              <button onClick={() => setSelected(null)} aria-label="Fechar"
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>

              {/* Conteúdo rolável */}
              <div className="overflow-y-auto flex-1 p-6 pt-8">
                <div className="text-[9px] uppercase tracking-[0.3em] text-[#8f1f1f] font-bold mb-4">URGENTE</div>
                <h2 className="font-elite text-2xl text-white leading-tight mb-1 pr-8">{selected.title}</h2>
                <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-2">
                  {agent?.avatarDataUrl && (
                    <img src={agent.avatarDataUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
                  )}
                  Designado a {addressed(game.profile)}
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#c9a86a] mb-5">
                  caso nº {selected.no} · {selected.victim.name}
                </div>

                <div className="space-y-1.5 text-[13px] leading-relaxed text-neutral-300">
                  {selected.briefing.slice(0, visibleLines).map((l, i) => (
                    <p key={i} className={
                      i === 0 ? "text-[#c9a86a] font-semibold" :
                      i === selected.briefing.length - 1 ? "text-white font-medium mt-3" : ""
                    }>{l}</p>
                  ))}
                  {visibleLines < selected.briefing.length && (
                    <span className="inline-block w-2 h-4 bg-[#c9a86a] animate-pulse ml-1" />
                  )}
                </div>

                {visibleLines < selected.briefing.length && (
                  <button
                    type="button"
                    onClick={() => setVisibleLines(selected.briefing.length)}
                    className="mt-4 text-[10.5px] uppercase tracking-widest text-[#c9a86a] hover:text-white underline underline-offset-4"
                  >
                    revelar o relatório completo
                  </button>
                )}
              </div>

              {/* Rodapé sempre visível com botão */}
              <div className="p-4 border-t border-white/10 bg-black/50 shrink-0">
                <button
                  type="button"
                  onClick={() => { setVisibleLines(selected.briefing.length); enter(selected); }}
                  disabled={busy}
                  className="w-full rounded-lg bg-[#8f1f1f] hover:bg-[#a52424] active:scale-[0.99] disabled:opacity-40 py-4 font-elite text-base uppercase tracking-[0.2em] text-white transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  {busy
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Abrindo inquérito…</>
                    : <><FolderOpen className="w-5 h-5" /> {existing[selected.id] ? "Continuar investigação" : "Aceitar o caso"}</>
                  }
                </button>
                {existing[selected.id] && !busy && (
                  <button onClick={(e) => archive(selected, e)}
                    className="mt-3 w-full text-[11px] uppercase tracking-widest text-neutral-500 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5">
                    <Archive className="w-3.5 h-3.5" /> Arquivar e recomeçar do zero
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
