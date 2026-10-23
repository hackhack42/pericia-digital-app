"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  ShieldAlert,
  VenetianMask,
  BadgeCheck,
  Skull,
  Sparkles,
  Lock,
  Lightbulb,
} from "lucide-react";
import AppShell from "../AppShell";
import { useCase, useGame } from "@/components/game/context";
import type { ChatThread } from "@/game/types";
import { sfx } from "@/lib/audio";
import { useThreat } from "@/components/game/threat";

const BURN_LIMIT = 4;

type Bubble =
  | { kind: "them"; text: string }
  | { kind: "me"; text: string }
  | { kind: "evidence"; text: string }
  | { kind: "jane"; text: string }
  | { kind: "dead"; text: string };

function Avatar({ name, src, size = 40 }: { name: string; src?: string; size?: number }) {
  if (src) {
    return (
      <img src={src} alt={name} style={{ width: size, height: size }} className="rounded-full object-cover grayscale-[30%]" />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-b from-[#1d4ed8] to-[#0b2d6b] flex items-center justify-center text-white text-[11px] font-black shrink-0"
    >
      CBI
    </div>
  );
}

function Thread({ thread, onBack }: { thread: ChatThread; onBack: () => void }) {
  const caseData = useCase();
  const { sessionId, chat, setChatState, collect, loseCase, caseLost, pushToast } = useGame();
  const { airplane, active: threatOn } = useThreat();
  const offline = threatOn && airplane;
  const state = chat[thread.id] ?? { sent: [], suspicion: 0 };

  const [log, setLog] = useState<Bubble[]>([{ kind: "them", text: thread.intro }]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dead = (caseLost && thread.mode === "impersonate") || offline;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log.length, typing]);

  useEffect(() => {
    if (!dead) inputRef.current?.focus();
  }, [dead]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || typing || dead || !sessionId) return;
    setDraft("");
    setLog((l) => [...l, { kind: "me", text }]);
    setTyping(true);

    try {
      const history = log
        .filter((b) => b.kind === "me" || b.kind === "them")
        .slice(-8)
        .map((b) => ({ role: b.kind === "me" ? "player" : "character", text: b.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sessionId, threadId: thread.id, message: text, history }),
      });
      const data = await res.json();
      // tempo de "pensar" proporcional ao tamanho da resposta
      const delay = Math.min(2200, 650 + (data.reply?.length ?? 40) * 9);
      await new Promise((r) => setTimeout(r, delay));
      setTyping(false);

      if (data.error && !data.caseLost) {
        setLog((l) => [...l, { kind: "them", text: "…" }]);
        return;
      }

      sfx.message();
      const next: Bubble[] = [{ kind: "them", text: data.reply || "…" }];
      if (data.evidenceId) {
        collect(data.evidenceId);
        next.push({
          kind: "evidence",
          text: caseData.evidence[data.evidenceId]?.title ?? "prova anexada",
        });
      }
      if (data.jane) next.push({ kind: "jane", text: data.jane });

      if (data.caseLost) {
        sfx.alarm();
        next.push({ kind: "dead", text: `${data.reason ?? ""} ${data.burnedText ?? ""}`.trim() });
        loseCase();
      } else if (typeof data.suspicion === "number") {
        setChatState(thread.id, state.sent, data.suspicion);
        if (data.suspicion >= BURN_LIMIT - 1) {
          pushToast("ÚLTIMO AVISO", "Mais um deslize e o caso inteiro é perdido.");
        }
      }
      setLog((l) => [...l, ...next]);
    } catch {
      setTyping(false);
      setLog((l) => [
        ...l,
        {
          kind: "jane",
          text: "Falha na rede do terminal — a mensagem não saiu. Verifique a conexão e tente de novo; nada do seu progresso foi perdido.",
        },
      ]);
    }
  };

  const suspicion = state.suspicion;
  const tips = thread.options.filter((o) => o.text && !state.sent.includes(o.id)).slice(0, 4);

  return (
    <AppShell
      title={
        <span className="flex items-center justify-center gap-2">
          <Avatar name={thread.name} src={thread.avatar} size={24} />
          <span className="flex flex-col leading-tight text-left">
            <span>{thread.name}</span>
            <span className="text-[9.5px] font-normal text-neutral-400">
              {typing ? "digitando…" : thread.sub}
            </span>
          </span>
        </span>
      }
      onBack={onBack}
      headerBlack
    >
      <div
        className={`px-4 py-2.5 border-b text-[11px] leading-snug flex items-start gap-2 ${
          thread.mode === "impersonate"
            ? "bg-[#2a1410] border-[#8f1f1f]/40 text-[#ffbdae]"
            : "bg-[#0b1d33] border-[#0a84ff]/30 text-[#9fd0ff]"
        }`}
      >
        {thread.mode === "impersonate" ? (
          <VenetianMask className="w-4 h-4 shrink-0 mt-0.5" />
        ) : (
          <BadgeCheck className="w-4 h-4 shrink-0 mt-0.5" />
        )}
        <span>
          {thread.mode === "impersonate" ? (
            <>
              <b>Escreva com suas palavras, como a vítima escreveria.</b> Um deslize —
              revelar a morte, se identificar, ser agressivo ou falar bobagem — e o{" "}
              <b>caso inteiro é perdido</b>.
            </>
          ) : (
            <>
              <b>Linha segura da CBI.</b> Fale à vontade, sem disfarce e sem risco.
            </>
          )}
        </span>
      </div>

      {thread.mode === "impersonate" && (
        <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
          <ShieldAlert className={`w-3.5 h-3.5 ${suspicion >= 3 ? "text-red-500" : "text-neutral-400"}`} />
          <span className="text-[10px] uppercase tracking-widest text-neutral-400">Suspeita</span>
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className={`h-full ${suspicion >= 3 ? "bg-red-500" : suspicion >= 2 ? "bg-amber-400" : "bg-emerald-500"}`}
              initial={false}
              animate={{ width: `${Math.min(100, (suspicion / BURN_LIMIT) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-neutral-400 tabular-nums">
            {suspicion}/{BURN_LIMIT}
          </span>
        </div>
      )}

      <div className="p-3.5 space-y-2.5">
        <div className="rounded-lg bg-[#171512] border border-[#c9a86a]/25 px-3 py-2.5 text-[12px] text-[#e9d9b8] leading-snug flex gap-2">
          <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#c9a86a]" />
          {thread.briefing}
        </div>

        {offline && (
          <div className="rounded-lg border border-[#0a84ff]/40 bg-[#0b1d33] px-3.5 py-2.5 text-[12px] text-[#9fd0ff] leading-snug">
            <b>Modo avião ativo.</b> As mensagens não saem enquanto a conexão estiver cortada —
            mas a memória do aparelho está protegida.
          </div>
        )}

        {log.map((b, i) => {
          if (b.kind === "me") {
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#0a84ff] px-3.5 py-2.5 text-[13.5px] leading-snug text-white whitespace-pre-line">
                  {b.text}
                </div>
              </motion.div>
            );
          }
          if (b.kind === "them") {
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
                <Avatar name={thread.name} src={thread.avatar} size={26} />
                <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-[#26262a] px-3.5 py-2.5 text-[13.5px] leading-snug text-neutral-100 whitespace-pre-line">
                  {b.text}
                </div>
              </motion.div>
            );
          }
          if (b.kind === "evidence") {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto flex items-center gap-1.5 rounded-full border border-[#c9a86a]/50 bg-[#c9a86a]/10 px-3 py-1 text-[10px] uppercase tracking-wider text-[#c9a86a] font-bold text-center"
              >
                <BadgeCheck className="w-3.5 h-3.5 shrink-0" /> prova anexada: {b.text}
              </motion.div>
            );
          }
          if (b.kind === "jane") {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg border-l-2 border-[#c9a86a] bg-[#171512] px-3 py-2 text-[12px] text-[#e9d9b8] leading-snug italic"
              >
                {b.text}
              </motion.div>
            );
          }
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg border border-red-500/50 bg-red-950/40 px-3.5 py-3 text-[12.5px] text-red-200 leading-snug flex gap-2"
            >
              <Skull className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <b className="uppercase tracking-wider">Disfarce queimado.</b> {b.text}
              </span>
            </motion.div>
          );
        })}

        {typing && (
          <div className="flex items-end gap-2">
            <Avatar name={thread.name} src={thread.avatar} size={26} />
            <div className="rounded-2xl rounded-bl-md bg-[#26262a] px-4 py-3 flex gap-1">
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

      <div className="sticky bottom-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-5 px-3 pb-3 space-y-2">
        {showTips && tips.length > 0 && !dead && (
          <div className="rounded-lg border border-[#c9a86a]/30 bg-[#141210] p-2.5 space-y-1.5">
            <div className="text-[10px] uppercase tracking-widest text-[#c9a86a] font-bold">
              Jane sugere assuntos (escreva do seu jeito)
            </div>
            {tips.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setDraft(t.text);
                  setShowTips(false);
                  inputRef.current?.focus();
                }}
                className="block w-full text-left text-[12px] text-neutral-300 hover:text-white leading-snug"
              >
                › {t.text}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={send} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTips((v) => !v)}
            disabled={dead}
            className="w-11 h-11 sm:w-10 sm:h-10 rounded-full border border-[#c9a86a]/40 text-[#c9a86a] flex items-center justify-center shrink-0 disabled:opacity-30"
            aria-label="Sugestões"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              sfx.type();
            }}
            disabled={dead || typing}
            placeholder={offline ? "Offline — modo avião" : dead ? "Caso perdido" : "Escreva sua mensagem…"}
            className="flex-1 rounded-full border border-white/15 bg-[#161618] px-4 py-2.5 text-[16px] sm:text-[13.5px] outline-none placeholder:text-neutral-400 focus:border-[#0a84ff]/60 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={dead || typing || !draft.trim()}
            className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-[#0a84ff] text-white flex items-center justify-center disabled:opacity-30 active:scale-90 transition shrink-0"
            aria-label="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}

export default function ChatApp() {
  const caseData = useCase();
  const { chat, caseLost } = useGame();
  const [open, setOpen] = useState<ChatThread | null>(null);
  const threads = caseData.chats ?? [];

  if (open) return <Thread thread={open} onBack={() => setOpen(null)} />;

  return (
    <AppShell title="Conversa Ativa">
      <div className="px-4 pt-4 pb-2">
        <div
          className={`rounded-xl border p-3.5 text-[12px] leading-relaxed flex gap-2 ${
            caseLost
              ? "border-red-500/40 bg-red-950/30 text-red-200"
              : "border-[#c9a86a]/30 bg-[#171512] text-[#e9d9b8]"
          }`}
        >
          {caseLost ? <Skull className="w-4 h-4 shrink-0 mt-0.5" /> : <VenetianMask className="w-4 h-4 shrink-0 mt-0.5 text-[#c9a86a]" />}
          <span>
            {caseLost ? (
              <>
                <b>O disfarce caiu e o caso foi perdido.</b> O suspeito se blindou e a CBI ficou sem
                a confissão. Recomece o caso pelo topo da tela.
              </>
            ) : (
              <>
                Ninguém sabe que a vítima morreu. <b>Converse digitando livremente</b> — eles leem,
                pensam e respondem. Uma frase fora do personagem e <b>o caso acaba ali</b>.
              </>
            )}
          </span>
        </div>
      </div>
      <div className="px-3 pb-4 space-y-2">
        {threads.map((t) => {
          const st = chat[t.id] ?? { sent: [], suspicion: 0 };
          const dead = caseLost && t.mode === "impersonate";
          return (
            <button
              key={t.id}
              onClick={() => setOpen(t)}
              className="w-full flex items-center gap-3 rounded-xl bg-[#141418] px-3.5 py-3 text-left active:bg-[#1c1c20]"
            >
              <Avatar name={t.name} src={t.avatar} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[14.5px] truncate">{t.name}</span>
                  {t.mode === "impersonate" ? (
                    <span className="text-[9px] uppercase tracking-wider text-[#ffbdae] border border-[#8f1f1f]/50 rounded px-1.5 py-0.5 shrink-0">
                      disfarce
                    </span>
                  ) : (
                    <span className="text-[9px] uppercase tracking-wider text-[#9fd0ff] border border-[#0a84ff]/40 rounded px-1.5 py-0.5 shrink-0">
                      CBI
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-neutral-400 truncate">
                  {dead ? "— caso perdido —" : st.sent.length > 0 ? `${st.sent.length} assunto(s) extraído(s)` : t.intro}
                </p>
              </div>
              {dead ? <Lock className="w-4 h-4 text-red-500/70 shrink-0" /> : <span className="w-2 h-2 rounded-full bg-[#30d158] shrink-0" />}
            </button>
          );
        })}
      </div>
    </AppShell>
  );
}
