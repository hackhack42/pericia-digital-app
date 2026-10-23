"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookPen, X, Plus, Trash2, Pin } from "lucide-react";
import { useCase, useGame } from "./context";
import { sfx } from "@/lib/audio";

export type NoteCard = { id: string; text: string; color: number; pinned?: boolean };

const COLORS = ["#c9a86a", "#6ea8ff", "#79d17a", "#e08a5a", "#c47ae0"];

export default function Notepad() {
  const caseData = useCase();
  const { evidence } = useGame();
  const storeKey = `caso2471_notas_${caseData.id}`;

  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState<NoteCard[]>([]);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) setCards(JSON.parse(raw));
      else setCards([]);
    } catch {
      setCards([]);
    }
  }, [storeKey]);

  const persist = (next: NoteCard[]) => {
    setCards(next);
    localStorage.setItem(storeKey, JSON.stringify(next));
  };

  const add = (text: string, pinned = false) => {
    const t = text.trim();
    if (!t) return;
    sfx.tap();
    persist([
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text: t, color: cards.length % COLORS.length, pinned },
      ...cards,
    ]);
    setDraft("");
  };

  const remove = (id: string) => persist(cards.filter((c) => c.id !== id));

  // atalho: fixar provas do dossiê
  const pinEvidence = (title: string) => add(`📌 ${title}`, true);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          sfx.tap();
          setTimeout(() => inputRef.current?.focus(), 250);
        }}
        title="Anotações do perito"
        className="fixed bottom-20 right-4 lg:bottom-5 lg:right-5 z-[72] w-12 h-12 rounded-full bg-[#171512] border border-[#c9a86a]/50 text-[#c9a86a] shadow-xl flex items-center justify-center active:scale-90 transition-transform hover:bg-[#1f1c16]"
      >
        <NotebookPen className="w-5 h-5" />
        {cards.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#c9a86a] text-black text-[10px] font-bold flex items-center justify-center">
            {cards.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[74] bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-[75] w-full sm:w-[420px] bg-[#12110e] border-l border-[#c9a86a]/25 shadow-2xl flex flex-col"
            >
              <header className="h-14 shrink-0 px-4 flex items-center gap-2 border-b border-[#c9a86a]/20">
                <NotebookPen className="w-4 h-4 text-[#c9a86a]" />
                <span className="redacted text-[11px] tracking-[0.25em] uppercase text-[#c9a86a]">
                  Anotações do perito
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="ml-auto w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </header>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  add(draft);
                }}
                className="p-3 flex gap-2 border-b border-white/10"
              >
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Hipótese, senha, horário, nome…"
                  className="flex-1 rounded-lg border border-white/15 bg-[#1a1814] px-4 py-3 sm:py-2 text-[16px] sm:text-[13px] outline-none placeholder:text-neutral-400 focus:border-[#c9a86a]/60"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="w-12 h-12 sm:w-10 sm:h-10 rounded-lg bg-[#c9a86a] text-black flex items-center justify-center disabled:opacity-30 active:scale-90 transition shrink-0"
                  aria-label="Adicionar"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>

              {evidence.length > 0 && (
                <div className="px-3 py-2 border-b border-white/10">
                  <div className="text-[9.5px] uppercase tracking-widest text-neutral-400 mb-1.5">
                    Fixar prova do dossiê
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {evidence.map((id) => {
                      const e = caseData.evidence[id];
                      if (!e) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => pinEvidence(e.title)}
                          className="shrink-0 rounded-full border border-[#c9a86a]/35 px-2.5 py-1 text-[10.5px] text-[#c9a86a] hover:bg-[#c9a86a]/10 flex items-center gap-1"
                        >
                          <Pin className="w-3 h-3" /> {e.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto nice-scroll p-3">
                {cards.length === 0 ? (
                  <p className="text-[12.5px] text-neutral-400 text-center py-10 leading-relaxed px-4">
                    Seu quadro está vazio.<br />
                    Anote senhas testadas, horários que não batem e suspeitas — tudo fica salvo
                    neste caso.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    {cards.map((c, i) => (
                      <motion.div
                        key={c.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -1 : 1 }}
                        className="group relative rounded-sm p-3 pt-4 text-[12.5px] leading-snug shadow-lg break-words"
                        style={{
                          background: `${COLORS[c.color % COLORS.length]}1a`,
                          borderLeft: `3px solid ${COLORS[c.color % COLORS.length]}`,
                          color: "#e7e5e0",
                        }}
                      >
                        <span
                          className="absolute -top-1.5 left-3 w-3 h-3 rounded-full shadow"
                          style={{ background: COLORS[c.color % COLORS.length] }}
                        />
                        {c.text}
                        <button
                          onClick={() => remove(c.id)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
                          aria-label="Apagar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
