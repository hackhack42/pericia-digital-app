"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Users,
  Pin,
  MessagesSquare,
  Gavel,
  Lock,
  CloudOff,
  ShieldCheck,
  Search,
  StickyNote,
  Camera,
  Paperclip,
  Lightbulb,
  Send,
} from "lucide-react";
import { useGame, useCase } from "./context";
import type { Suspect } from "@/game/types";
import Accusation from "./Accusation";
import { sfx } from "@/lib/audio";
import { loadCareer, hintBudget, LOW_REP } from "@/game/career";

type TabId = "dossie" | "suspeitos" | "evidencias" | "interrogatorio" | "dicas" | "acusar";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dossie", label: "Dossiê", icon: FileText },
  { id: "suspeitos", label: "Suspeitos", icon: Users },
  { id: "evidencias", label: "Provas", icon: Pin },
  { id: "interrogatorio", label: "Interrogar", icon: MessagesSquare },
  { id: "dicas", label: "Dicas", icon: Lightbulb },
  { id: "acusar", label: "Acusar", icon: Gavel },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="redacted text-[11px] tracking-[0.25em] uppercase text-[#c9a86a] border-b border-[#c9a86a]/25 pb-2 mb-4">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function DossieTab() {
  const caseData = useCase();
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex gap-4">
          <div className="relative shrink-0">
            <img
              src={caseData.victim.photo}
              alt={caseData.victim.name}
              className="w-28 h-36 object-cover rounded-sm border border-white/20 contrast-105 grayscale-[20%]"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rotate-[-4deg] bg-[#8f1f1f] text-white text-[9px] font-bold tracking-widest px-2 py-0.5">
              VÍTIMA
            </div>
          </div>
          <div className="min-w-0 text-[13px] leading-relaxed text-neutral-300">
            <div className="font-elite text-xl text-white mb-1">{caseData.victim.name}</div>
            <div>{caseData.victim.age} anos · {caseData.victim.role}</div>
            <div className="text-[#c9a86a]">{caseData.victim.line1}</div>
            <div className="mt-2 text-neutral-400 italic">{caseData.victim.line2}</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 rotate-6 border-2 border-[#8f1f1f]/70 text-[#8f1f1f]/80 font-elite text-[10px] px-2 py-1 tracking-[0.2em]">
          CONFIDENCIAL
        </div>
      </div>

      <div>
        <SectionTitle>Resumo do relatório</SectionTitle>
        <ul className="space-y-2 text-[13px] text-neutral-300 leading-relaxed">
          {caseData.briefing.slice(3, 9).map((l, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[#c9a86a] mt-0.5">▸</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <SectionTitle>Linha do tempo</SectionTitle>
        <div className="space-y-3 text-[12.5px]">
          {caseData.timeline.map(([t, d]) => (
            <div key={t} className="flex gap-3">
              <span className="font-elite text-[#c9a86a] w-24 shrink-0">{t}</span>
              <span className="text-neutral-300">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function SuspeitosTab({ onInterrogate }: { onInterrogate: (id: string) => void }) {
  const caseData = useCase();
  return (
    <div className="space-y-4">
      {caseData.suspects.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="rounded-lg border border-white/10 bg-black/30 p-4"
        >
          <div className="flex gap-3.5">
            <img src={s.avatar} alt={s.name} className="w-16 h-16 object-cover rounded-sm border border-white/15 grayscale-[15%]" />
            <div className="min-w-0">
              <div className="font-semibold text-[15px]">{s.name}</div>
              <div className="text-[11px] uppercase tracking-widest text-[#c9a86a]">{s.role}</div>
              <p className="text-[12.5px] text-neutral-400 mt-1.5 leading-snug">{s.bio}</p>
            </div>
          </div>
          <button
            onClick={() => onInterrogate(s.id)}
            className="mt-3 w-full rounded-md border border-[#c9a86a]/40 text-[#c9a86a] text-[12px] font-semibold uppercase tracking-widest py-2 hover:bg-[#c9a86a]/10 transition-colors"
          >
            Interrogar
          </button>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function EvidenciasTab() {
  const caseData = useCase();
  const { evidence, cloudUnlocked, collect, hasEvidence } = useGame();

  return (
    <div>
      {evidence.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#c9a86a]/30 p-6 text-center">
          <Pin className="w-6 h-6 text-[#c9a86a]/60 mx-auto mb-3" />
          <p className="text-[13px] text-neutral-400 leading-relaxed">
            Nenhuma prova anexada ainda.<br />
            Explore o celular da vítima e toque em{" "}
            <span className="text-[#c9a86a] font-semibold">“Anexar prova”</span> nos itens relevantes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {evidence.map((id, i) => {
            const e = caseData.evidence[id];
            if (!e) return null;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, rotate: 0, y: 12 }}
                animate={{ opacity: 1, rotate: i % 2 === 0 ? -0.6 : 0.6, y: 0 }}
                className="relative rounded-sm bg-[#1c1a15] border border-[#c9a86a]/25 p-4 pt-5 shadow-lg"
              >
                <span className="absolute -top-2 left-6 w-4 h-4 rounded-full bg-gradient-to-b from-red-500 to-red-800 shadow-md border border-red-900" />
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-[14px] text-white">{e.title}</span>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 shrink-0">{e.source}</span>
                </div>
                <p className="text-[12.5px] text-neutral-300 leading-snug">{e.desc}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <SectionTitle>Anexo — iCloud de {caseData.cloud.owner}</SectionTitle>
        {!cloudUnlocked ? (
          <div className="rounded-lg border border-dashed border-white/15 p-5 text-center text-neutral-400 text-[12.5px]">
            <CloudOff className="w-5 h-5 mx-auto mb-2 text-neutral-400" />
            A perícia ainda trabalha na quebra do backup em nuvem.
            <br />
            <span className="text-[#c9a86a]">{Math.max(0, 6 - evidence.length)} prova(s) restante(s) para liberação.</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" /> Backup quebrado pela perícia
            </div>
            {caseData.cloud.items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-4"
              >
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-emerald-300/80 mb-1.5">
                  {item.kind === "search" ? <Search className="w-3.5 h-3.5" /> : item.kind === "note" ? <StickyNote className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                  {item.label}
                </div>
                <p className="text-[13px] text-neutral-200 leading-snug">{item.detail}</p>
                {item.evidenceId && !hasEvidence(item.evidenceId) && (
                  <button
                    onClick={() => collect(item.evidenceId!)}
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#c9a86a]/50 text-[#c9a86a] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider hover:bg-[#c9a86a]/10"
                  >
                    <Paperclip className="w-3.5 h-3.5" /> Anexar ao dossiê
                  </button>
                )}
                {item.evidenceId && hasEvidence(item.evidenceId) && (
                  <div className="mt-2 text-[11px] text-[#c9a86a] flex items-center gap-1">
                    <Pin className="w-3 h-3" /> No dossiê
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function InterrogatorioTab({ suspectId, setSuspectId }: { suspectId: string; setSuspectId: (id: string) => void }) {
  const caseData = useCase();
  const { sessionId, answered, answer, hasEvidence, collect, pushToast } = useGame();
  const suspect: Suspect = caseData.suspects.find((s) => s.id === suspectId) ?? caseData.suspects[0];
  const questions = caseData.interrogations[suspect.id] ?? [];
  const asked = answered[suspect.id] ?? [];

  const [log, setLog] = useState<Record<string, { role: "player" | "character"; text: string }[]>>({});
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const convo = log[suspect.id] ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [convo.length, busy]);

  const ask = async (text: string) => {
    const msg = text.trim();
    if (!msg || busy || !sessionId) return;
    setDraft("");
    setBusy(true);
    setLog((l) => ({ ...l, [suspect.id]: [...(l[suspect.id] ?? []), { role: "player", text: msg }] }));
    try {
      const res = await fetch("/api/interrogate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sessionId,
          suspectId: suspect.id,
          message: msg,
          history: convo,
        }),
      });
      const data = await res.json();
      sfx.message();
      setLog((l) => ({
        ...l,
        [suspect.id]: [...(l[suspect.id] ?? []), { role: "character", text: data.reply ?? "…" }],
      }));
      if (data.answeredId) {
        answer(suspect.id, data.answeredId);
        const q = questions.find((x) => x.id === data.answeredId);
        if (q?.requiresEvidence) collect(q.requiresEvidence);
      }
      if (data.lockedEvidence) {
        pushToast("Ele desconversou", `Confronte-o com a prova: “${data.lockedEvidence}”.`);
      }
    } catch {
      pushToast("Falha de rede", "A sala de interrogatório perdeu conexão. Tente perguntar de novo.");
      setLog((l) => ({
        ...l,
        [suspect.id]: [
          ...(l[suspect.id] ?? []),
          { role: "character", text: "[transmissão interrompida — repita a pergunta]" },
        ],
      }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {caseData.suspects.map((s) => (
          <button
            key={s.id}
            onClick={() => setSuspectId(s.id)}
            className={`rounded-lg p-2 border transition-colors ${
              s.id === suspect.id ? "border-[#c9a86a] bg-[#c9a86a]/10" : "border-white/10 bg-black/30 hover:border-white/30"
            }`}
          >
            <img src={s.avatar} alt={s.name} className="w-full aspect-square object-cover rounded-sm mb-1.5 grayscale-[10%]" />
            <div className={`text-[11px] font-semibold leading-tight ${s.id === suspect.id ? "text-[#c9a86a]" : "text-neutral-300"}`}>
              {s.name.split(" ")[0]}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-white/10 bg-black/30 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 bg-white/[0.03]">
          <img src={suspect.avatar} alt={suspect.name} className="w-9 h-9 rounded-full object-cover" />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold truncate">{suspect.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-400">
              {busy ? "pensando…" : "Sala 2 · gravando"}
            </div>
          </div>
          <span className="ml-auto text-[9px] uppercase tracking-wider text-emerald-400/80 border border-emerald-500/30 rounded px-1.5 py-0.5 shrink-0">
            ao vivo
          </span>
        </div>

        <div className="p-3.5 space-y-2.5 max-h-[46vh] overflow-y-auto nice-scroll">
          {convo.length === 0 && (
            <p className="text-[12.5px] text-neutral-400 italic text-center py-4 leading-relaxed">
              Pergunte o que quiser, com suas palavras. Ele responde ao vivo — e desconversa se você
              tocar num assunto sensível sem ter a prova na mão.
            </p>
          )}
          {convo.map((m, i) =>
            m.role === "player" ? (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                <div className="max-w-[85%] rounded-xl rounded-br-sm bg-[#c9a86a] text-black px-3.5 py-2.5 text-[13px] font-medium">
                  {m.text}
                </div>
              </motion.div>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex">
                <div className="max-w-[85%] rounded-xl rounded-bl-sm bg-[#26262a] px-3.5 py-2.5 text-[13px] text-neutral-200 leading-relaxed">
                  {m.text}
                </div>
              </motion.div>
            )
          )}
          {busy && (
            <div className="flex">
              <div className="rounded-xl rounded-bl-sm bg-[#26262a] px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-neutral-400"
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
          className="border-t border-white/10 p-2.5 flex items-center gap-2"
        >
          <input
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              sfx.type();
            }}
            disabled={busy}
            placeholder="Faça sua pergunta…"
            className="flex-1 rounded-full border border-white/15 bg-[#161618] px-4 py-3 sm:py-2 text-[16px] sm:text-[13px] outline-none placeholder:text-neutral-400 focus:border-[#c9a86a]/60"
          />
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            className="w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-[#c9a86a] text-black flex items-center justify-center disabled:opacity-30 active:scale-90 transition shrink-0"
            aria-label="Perguntar"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-white/10 p-3 space-y-2">
          <div className="text-[9.5px] uppercase tracking-widest text-neutral-400 mb-1">
            Roteiro sugerido (clique para perguntar)
          </div>
          {questions.map((q) => {
            const locked = q.requiresEvidence && !hasEvidence(q.requiresEvidence);
            const done = asked.includes(q.id);
            return (
              <button
                key={q.id}
                onClick={() => ask(q.q)}
                disabled={busy}
                className={`w-full text-left rounded-lg px-3 py-2.5 text-[12.5px] border transition-colors flex items-center gap-2 disabled:opacity-50 ${
                  done
                    ? "border-white/5 text-neutral-400"
                    : locked
                      ? "border-white/10 text-neutral-400 hover:border-white/25"
                      : "border-[#c9a86a]/40 text-neutral-100 hover:bg-[#c9a86a]/10"
                }`}
              >
                {locked ? (
                  <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                ) : done ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                ) : null}
                <span className="flex-1">{q.q}</span>
                {locked && <span className="text-[10px] uppercase tracking-wider text-neutral-400">requer prova</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function DicasTab() {
  const caseData = useCase();
  const { hints, revealHint } = useGame();
  const [career] = useState(() => loadCareer());
  const budget = hintBudget(career, caseData.hints.length);
  const total = Math.min(caseData.hints.length, budget);
  const restricted = career.reputation < LOW_REP;

  return (
    <div>
      <div className="rounded-lg border border-[#c9a86a]/25 bg-[#c9a86a]/5 p-4 mb-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#c9a86a] font-bold mb-1.5">
          <Lightbulb className="w-4 h-4" /> {caseData.hintLabel ?? "Pitaco do investigador veterano"}
        </div>
        <p className="text-[12.5px] text-neutral-400 leading-relaxed">
          Cada dica revela um degrau da escada — sem entregar o filme de graça (quase). Use só se
          travar de verdade.
        </p>
      </div>

      {restricted && (
        <div className="rounded-lg border border-red-500/40 bg-red-950/20 p-3.5 mb-4 text-[12px] text-red-200 leading-snug">
          <b className="uppercase tracking-wider text-[10px]">Corregedoria</b>
          <br />
          Sua reputação está crítica. O apoio da equipe foi reduzido a{" "}
          <b>{budget} dicas</b> neste caso. Encerre um inquérito corretamente para restabelecer os
          recursos.
        </div>
      )}

      {hints === 0 ? (
        <div className="rounded-lg border border-dashed border-white/15 p-6 text-center text-[13px] text-neutral-400">
          Nenhuma dica solicitada ainda. O caso anda sozinho, detetive?
        </div>
      ) : (
        <div className="space-y-3 mb-5">
          {caseData.hints.slice(0, hints).map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 rounded-lg border border-white/10 bg-black/30 p-3.5"
            >
              <span className="font-elite text-[#c9a86a] text-lg leading-none shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-[13px] text-neutral-200 leading-snug">{h}</p>
            </motion.div>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          sfx.tap();
          revealHint();
        }}
        disabled={hints >= total}
        className="mt-4 w-full rounded-lg border border-[#c9a86a]/50 text-[#c9a86a] py-3 text-[12px] font-bold uppercase tracking-widest hover:bg-[#c9a86a]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Lightbulb className="w-4 h-4" />
        {hints >= total ? "Todas as dicas reveladas" : `Revelar dica ${hints + 1} de ${total}`}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export default function Dossier({ onOutcome }: { onOutcome: (result: string) => void }) {
  const caseData = useCase();
  const [tab, setTab] = useState<TabId>("dossie");
  const [suspectId, setSuspectId] = useState(caseData.suspects[0]?.id ?? "");
  const { evidence } = useGame();

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-[#c9a86a]/20">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[9px] sm:text-[8.5px] uppercase tracking-widest min-h-[44px] justify-center sm:tracking-widest transition-colors relative ${
              tab === t.id ? "text-[#c9a86a]" : "text-neutral-400 hover:text-neutral-300"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
            {t.id === "evidencias" && evidence.length > 0 && (
              <span className="absolute top-1.5 right-[10%] min-w-4 h-4 px-1 rounded-full bg-[#8f1f1f] text-white text-[9px] font-bold flex items-center justify-center">
                {evidence.length}
              </span>
            )}
            {tab === t.id && <motion.div layoutId="tabline" className="absolute -bottom-px inset-x-2 h-[2px] bg-[#c9a86a]" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto nice-scroll p-4 sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {tab === "dossie" && <DossieTab />}
            {tab === "suspeitos" && (
              <SuspeitosTab
                onInterrogate={(id) => {
                  setSuspectId(id);
                  setTab("interrogatorio");
                }}
              />
            )}
            {tab === "evidencias" && <EvidenciasTab />}
            {tab === "interrogatorio" && <InterrogatorioTab suspectId={suspectId} setSuspectId={setSuspectId} />}
            {tab === "dicas" && <DicasTab />}
            {tab === "acusar" && <Accusation onOutcome={onOutcome} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
