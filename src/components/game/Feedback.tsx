"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Star, MessageSquarePlus, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { useGame } from "./context";
import { sfx } from "@/lib/audio";

const TIPOS = [
  { id: "bug", label: "🐛 Bug / erro" },
  { id: "sugestao", label: "💡 Sugestão" },
  { id: "elogio", label: "❤️ Elogio" },
  { id: "caso", label: "🗂️ Sobre um caso" },
  { id: "outro", label: "📝 Outro" },
];

export default function Feedback({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { agent } = useAuth();
  const { caseData } = useGame();
  const [tipo, setTipo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo || !mensagem.trim()) { setErr("Preencha o tipo e a mensagem."); return; }
    setLoading(true); setErr("");
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, mensagem, nota: nota || undefined, caso: caseData?.title }),
    });
    setLoading(false);
    if (res.ok) { sfx.evidence(); setDone(true); }
    else setErr("Falha ao enviar. Tente novamente.");
  };

  const reset = () => { setTipo(""); setMensagem(""); setNota(0); setDone(false); setErr(""); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[88] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}>
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
            className="paper w-full max-w-md rounded-xl p-6 relative">
            <button onClick={onClose} aria-label="Fechar"
              className="absolute top-3 right-3 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#c9a86a] mb-4">
              <MessageSquarePlus className="w-4 h-4" /> Feedback
            </div>

            {done ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-elite text-xl text-white mb-2">Obrigado!</h3>
                <p className="text-[13px] text-neutral-300 leading-relaxed mb-5">
                  Sua mensagem chegou em {process.env.NEXT_PUBLIC_FEEDBACK_LABEL ?? "perciadigital@gmail.com"}.
                  {agent ? ` Valeu, ${agent.nome.split(" ")[0]}!` : ""}
                </p>
                <button onClick={() => { reset(); onClose(); }}
                  className="rounded-lg bg-[#8f1f1f] text-white px-6 py-2.5 text-[12px] font-bold uppercase tracking-widest">
                  Fechar
                </button>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Tipo</label>
                  <div className="flex flex-wrap gap-2">
                    {TIPOS.map(t => (
                      <button key={t.id} type="button"
                        onClick={() => { setTipo(t.id); sfx.tap(); }}
                        className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
                          tipo === t.id ? "border-[#c9a86a] bg-[#c9a86a]/15 text-white" : "border-white/15 text-neutral-400 hover:border-white/30"}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {tipo === "caso" && caseData && (
                  <div className="rounded-lg border border-[#c9a86a]/25 bg-black/30 px-3.5 py-2.5 text-[12.5px] text-neutral-300">
                    📂 Caso atual: <b className="text-[#c9a86a]">{caseData.title}</b>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Nota (opcional)</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button"
                        onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                        onClick={() => { setNota(n); sfx.tap(); }}
                        className="text-2xl transition-transform hover:scale-110">
                        <Star className={`w-7 h-7 ${n <= (hover || nota) ? "text-[#c9a86a] fill-[#c9a86a]" : "text-neutral-600"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Mensagem</label>
                  <textarea value={mensagem} onChange={e => setMensagem(e.target.value)} rows={4}
                    placeholder="Conte o que aconteceu, o que você achou ou o que poderia melhorar…"
                    className="w-full rounded-lg border border-white/12 bg-black/40 px-3.5 py-3 text-[14px] text-white outline-none placeholder:text-neutral-500 focus:border-[#c9a86a]/60 resize-none" />
                </div>

                {err && <p className="text-[12px] text-red-400">{err}</p>}

                <button type="submit" disabled={loading}
                  className="w-full rounded-lg bg-[#8f1f1f] hover:bg-[#a52424] disabled:opacity-50 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2">
                  {loading ? "Enviando…" : <><Send className="w-4 h-4" /> Enviar feedback</>}
                </button>

                {agent && (
                  <p className="text-[10.5px] text-neutral-500 text-center">
                    Enviando como {agent.nome} ({agent.matricula})
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
