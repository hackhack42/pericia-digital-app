"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Trash2, ShieldAlert } from "lucide-react";
import AppShell, { PinButton } from "../AppShell";
import { useCase } from "@/components/game/context";
import { loadRead, markRead } from "@/game/readState";
import type { Conversation, Msg } from "@/game/types";
import { sfx } from "@/lib/audio";

function Avatar({ name, src, size = 44 }: { name: string; src?: string; size?: number }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover grayscale-[35%] contrast-105"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-b from-neutral-500 to-neutral-700 flex items-center justify-center text-white font-semibold"
    >
      {name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
    </div>
  );
}

/** Player de áudio corrompido: waveform animada + transcrição com lacunas. */
function AudioBubble({ m }: { m: Msg }) {
  const caseData = useCase();
  const [playing, setPlaying] = useState(false);
  const [heard, setHeard] = useState(false);

  useEffect(() => {
    if (loadRead(caseData.id, "audio").includes(m.id)) {
      setHeard(true);
      setPlaying(true);
    }
  }, [caseData.id, m.id]);
  const bars = 28;
  return (
    <div className="w-[230px] rounded-2xl bg-[#26262a] px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => {
            sfx.tap();
            setPlaying((v) => !v);
            if (!heard) {
              setHeard(true);
              markRead(caseData.id, "audio", m.id);
            }
          }}
          className={`w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 ${
            heard ? "bg-[#3a3a3f]" : "bg-[#0a84ff]"
          }`}
          aria-label="Reproduzir"
        >
          <Play className="w-3.5 h-3.5" />
        </button>
        <div className="flex items-end gap-[2px] h-7 flex-1">
          {Array.from({ length: bars }).map((_, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-sm bg-neutral-500"
              animate={
                playing
                  ? { height: [`${15 + ((i * 29) % 70)}%`, `${10 + ((i * 53) % 85)}%`, `${20 + ((i * 17) % 60)}%`] }
                  : { height: `${15 + ((i * 29) % 70)}%` }
              }
              transition={playing ? { duration: 0.6, repeat: Infinity, delay: i * 0.02 } : undefined}
            />
          ))}
        </div>
        <span className="text-[10px] text-neutral-400 tabular-nums shrink-0">{m.duration}</span>
        {heard && <span className="text-[9px] text-[#c9a86a] shrink-0">ouvido</span>}
      </div>
      {playing && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2.5 pt-2.5 border-t border-white/10">
          <div className="flex items-start gap-1.5 text-[10px] uppercase tracking-wider text-amber-400 mb-1.5">
            <ShieldAlert className="w-3 h-3 shrink-0 mt-0.5" />
            <span className="leading-tight">
              Arquivo de áudio corrompido durante a extração. Exibindo transcrição do sistema:
            </span>
          </div>
          <p className="text-[12.5px] text-neutral-300 leading-relaxed font-mono tracking-tight">
            {m.transcript?.split(/(\[.*?\])/).map((part, i) => 
              part.startsWith("[") && part.endsWith("]") ? (
                <span key={i} className="inline-block bg-red-950/40 text-red-400 border border-red-500/30 px-1 py-0.5 mx-0.5 rounded text-[9px] uppercase tracking-widest">{part.slice(1, -1)}</span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}

/** Mensagem apagada pelo usuário e recuperada pela perícia. */
function DeletedBubble({ m, isMe }: { m: Msg; isMe: boolean }) {
  const caseData = useCase();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (loadRead(caseData.id, "deleted").includes(m.id)) setShown(true);
  }, [caseData.id, m.id]);

  if (!shown) {
    return (
      <button
        onClick={() => {
          sfx.tap();
          setShown(true);
          markRead(caseData.id, "deleted", m.id);
        }}
        className={`max-w-[80%] rounded-2xl border border-dashed px-3.5 py-2.5 text-left transition-colors ${
          isMe ? "border-[#0a84ff]/50 hover:bg-[#0a84ff]/10" : "border-neutral-600 hover:bg-white/5"
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11.5px] text-neutral-400 italic">
          <Trash2 className="w-3.5 h-3.5" /> Mensagem apagada pelo usuário
        </div>
        <div className="text-[10px] uppercase tracking-wider text-[#c9a86a] mt-1">
          toque para recuperar
        </div>
      </button>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`max-w-[78%] px-3.5 py-2 text-[14px] leading-snug rounded-2xl border border-dashed ${
        isMe ? "bg-[#0a84ff]/25 border-[#0a84ff]/60 text-white rounded-br-md" : "bg-[#26262a] border-neutral-600 text-neutral-100 rounded-bl-md"
      }`}
    >
      {m.text}
      <div className="text-[9.5px] uppercase tracking-wider text-[#c9a86a] mt-1">
        recuperada pela perícia
      </div>
    </motion.div>
  );
}

export default function MessagesApp() {
  const caseData = useCase();
  const [open, setOpen] = useState<Conversation | null>(null);
  const [opened, setOpened] = useState<string[]>([]);

  useEffect(() => {
    setOpened(loadRead(caseData.id, "notif"));
  }, [caseData.id]);

  if (open) {
    return (
      <AppShell
        title={
          <span className="flex items-center justify-center gap-2">
            <Avatar name={open.name} src={open.avatar} size={26} />
            <span className="flex flex-col leading-tight">
              <span>{open.name}</span>
              <span className="text-[10px] font-normal text-neutral-400">{open.sub}</span>
            </span>
          </span>
        }
        onBack={() => setOpen(null)}
        headerBlack
      >
        <div className="px-3 py-4 space-y-1.5">
          {open.messages.map((m, i) => {
            const isMe = m.from === "me";
            const showTime =
              i === 0 || open.messages[i - 1].time.split("·")[0] !== m.time.split("·")[0];
            return (
              <div key={m.id}>
                {showTime && (
                  <div className="text-center text-[10px] text-neutral-400 py-2">{m.time}</div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.5) }}
                  className={`flex items-end gap-1.5 ${isMe ? "flex-row-reverse" : ""}`}
                >
                  {m.kind === "audio" ? (
                    <AudioBubble m={m} />
                  ) : m.kind === "deleted" ? (
                    <DeletedBubble m={m} isMe={isMe} />
                  ) : (
                    <div
                      className={`max-w-[74%] px-3.5 py-2 text-[14px] leading-snug whitespace-pre-line ${
                        isMe
                          ? "bg-[#0a84ff] text-white rounded-2xl rounded-br-md"
                          : "bg-[#26262a] text-neutral-100 rounded-2xl rounded-bl-md"
                      }`}
                    >
                      {m.text}
                    </div>
                  )}
                  {m.evidenceId && <PinButton evidenceId={m.evidenceId} />}
                </motion.div>
              </div>
            );
          })}
        </div>
        <div className="sticky bottom-0 px-3 pb-3 bg-gradient-to-t from-black via-black/90 to-transparent pt-6">
          <div className="rounded-full border border-white/15 bg-[#161618] text-neutral-400 text-sm px-4 py-2 flex items-center gap-2">
            Mensagem bloqueada — dispositivo em custódia
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Mensagens">
      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 bg-[#1c1c1e] rounded-xl px-3 py-2 text-neutral-400 text-sm mb-2">
          <Search className="w-4 h-4" /> Buscar
        </div>
        <AnimatePresence>
          {caseData.conversations.map((c, i) => {
            const last = c.messages[c.messages.length - 1];
            return (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  sfx.tap();
                  setOpened(markRead(caseData.id, "notif", `n-${c.id}`));
                  setOpen(c);
                }}
                className="w-full flex items-center gap-3 px-2 py-3 border-b border-white/5 text-left active:bg-white/5 rounded-lg"
              >
                <Avatar name={c.name} src={c.avatar} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-[15px] truncate">{c.name}</span>
                    <span className="text-[11px] text-neutral-400 shrink-0">{c.time}</span>
                  </div>
                  <p className="text-[13px] text-neutral-400 truncate">
                    {last.from === "me" ? "Você: " : ""}
                    {last.kind === "audio" ? "🎤 Mensagem de voz" : last.kind === "deleted" ? "mensagem apagada" : last.text}
                  </p>
                </div>
                {c.unread && !opened.includes(`n-${c.id}`) ? (
                  <span className="w-5 h-5 rounded-full bg-[#0a84ff] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {c.unread}
                  </span>
                ) : null}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
