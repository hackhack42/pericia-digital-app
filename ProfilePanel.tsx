"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Save,
  BadgeCheck,
  Fingerprint,
  IdCard,
  Mail,
  Shield,
  UserRound,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { addressed, type Gender } from "@/game/profile";
import { loadCareer, rankOf, stats } from "@/game/career";
import { sfx } from "@/lib/audio";

const GENDER_OPTIONS: { id: Gender; label: string }[] = [
  { id: "f", label: "Feminino" },
  { id: "m", label: "Masculino" },
  { id: "n", label: "Prefiro não dizer" },
];

export default function ProfilePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { agent, updateProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [nome, setNome] = useState(agent?.nome ?? "");
  const [genero, setGenero] = useState<Gender>((agent?.genero as Gender) ?? "n");
  const [avatar, setAvatar] = useState<string | null>(agent?.avatarDataUrl ?? null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const career = useMemo(() => loadCareer(), [open, agent?.xp, agent?.reputation]);
  const rank = rankOf(career.xp);
  const st = stats(career);

  if (!agent) return null;

  const save = async () => {
    setSaving(true);
    setMsg("");
    const res = await updateProfile({ nome: nome.trim(), genero, avatarDataUrl: avatar });
    setSaving(false);
    if (!res.ok) {
      sfx.error();
      setMsg(res.error ?? "Erro ao salvar.");
      return;
    }
    sfx.unlock();
    setMsg("Perfil atualizado.");
  };

  const onFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(String(reader.result));
      sfx.tap();
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[87] bg-black/90 backdrop-blur-md overflow-y-auto nice-scroll"
        >
          <div className="min-h-full flex items-start sm:items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="paper w-full max-w-4xl rounded-xl p-5 sm:p-8 relative my-4"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#c9a86a] mb-5">
                <IdCard className="w-4 h-4" /> perfil do agente
              </div>

              <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-5 lg:gap-7">
                {/* cartão / credencial */}
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#c9a86a]/30 bg-[#15130f] overflow-hidden shadow-2xl">
                    <div className="h-28 bg-[radial-gradient(ellipse_at_center,rgba(201,168,106,0.12),transparent_70%),linear-gradient(180deg,#17120b,#0f0d09)] border-b border-[#c9a86a]/20 flex items-center justify-center">
                      <img src="/logo.svg" alt="Perícia Digital" className="h-16 object-contain opacity-90" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <button
                          onClick={() => inputRef.current?.click()}
                          className="relative shrink-0 group"
                          title="Alterar foto"
                        >
                          {avatar ? (
                            <img src={avatar} alt={nome || agent.nome} className="w-20 h-20 rounded-xl object-cover border border-white/15" />
                          ) : (
                            <div className="w-20 h-20 rounded-xl bg-black/35 border border-white/15 flex items-center justify-center text-[#c9a86a]">
                              <UserRound className="w-9 h-9" />
                            </div>
                          )}
                          <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#c9a86a] text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <Camera className="w-4 h-4" />
                          </span>
                        </button>
                        <div className="min-w-0">
                          <div className="font-elite text-xl text-white leading-tight truncate">{nome || agent.nome}</div>
                          <div className="text-[11px] uppercase tracking-widest text-[#c9a86a] mt-0.5">
                            {agent.matricula}
                          </div>
                          <div className="text-[12px] text-neutral-300 mt-1">{addressed({ name: nome || agent.nome, gender: genero })}</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-[12px]">
                        {[
                          [Fingerprint, "Patente", rank.name],
                          [Shield, "Reputação", `${career.reputation}/100`],
                          [BadgeCheck, "XP", String(career.xp)],
                          [Mail, "Condenações", `${st.solved}/${st.total || 0}`],
                        ].map(([Icon, label, value], i) => {
                          const Cmp = Icon as typeof Fingerprint;
                          return (
                            <div key={i} className="flex items-center gap-2.5 rounded-lg bg-black/25 px-3 py-2">
                              <Cmp className="w-4 h-4 text-[#c9a86a] shrink-0" />
                              <span className="text-neutral-400 w-24 shrink-0">{String(label)}</span>
                              <span className="text-neutral-100 font-medium">{String(value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onFile(file);
                      e.target.value = "";
                    }}
                  />
                </div>

                {/* formulário / infos */}
                <div className="space-y-5">
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="redacted text-[10px] tracking-[0.25em] uppercase text-[#c9a86a] border-b border-[#c9a86a]/25 pb-2 mb-4">
                      Informações da credencial
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                          Nome do agente
                        </label>
                        <input
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          className="w-full rounded-lg border border-white/12 bg-black/40 px-3.5 py-3 text-[16px] sm:text-[14px] text-white outline-none placeholder:text-neutral-500 focus:border-[#c9a86a]/60"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                          Tratamento nos relatórios
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {GENDER_OPTIONS.map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => {
                                setGenero(g.id);
                                sfx.tap();
                              }}
                              className={`rounded-lg border px-2 py-2.5 text-left transition-colors ${
                                genero === g.id
                                  ? "border-[#c9a86a] bg-[#c9a86a]/10"
                                  : "border-white/10 bg-black/30 hover:border-white/25"
                              }`}
                            >
                              <div className={`text-[11px] font-semibold ${genero === g.id ? "text-[#c9a86a]" : "text-neutral-300"}`}>
                                {g.label}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid sm:grid-cols-2 gap-3 text-[12px]">
                      <div className="rounded-lg bg-black/25 p-3">
                        <div className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1">Matrícula</div>
                        <div className="font-mono text-[13px] text-[#c9a86a]">{agent.matricula}</div>
                      </div>
                      <div className="rounded-lg bg-black/25 p-3">
                        <div className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1">Conta</div>
                        <div className="text-neutral-100">Sincronização em nuvem ativa</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="redacted text-[10px] tracking-[0.25em] uppercase text-[#c9a86a] border-b border-[#c9a86a]/25 pb-2 mb-4">
                      Prévia nos relatórios
                    </div>
                    <div className="space-y-2 text-[13.5px] text-[#e9d9b8] leading-snug">
                      <p>LISBON: “Vamos lá, <b className="text-white">{addressed({ name: nome || agent.nome, gender: genero })}</b>. O caso é seu.”</p>
                      <p>JANE: “<b className="text-white">{addressed({ name: nome || agent.nome, gender: genero }, "formal")}</b>, eu faria um chá antes de abrir esse aparelho.”</p>
                    </div>
                  </div>

                  {msg && (
                    <div className={`rounded-lg px-3.5 py-2.5 text-[12.5px] ${msg === "Perfil atualizado." ? "border border-emerald-500/30 bg-emerald-950/20 text-emerald-200" : "border border-red-500/40 bg-red-950/20 text-red-200"}`}>
                      {msg}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={save}
                      disabled={saving || !nome.trim()}
                      className="flex-1 rounded-lg bg-[#8f1f1f] hover:bg-[#a52424] disabled:opacity-50 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2"
                    >
                      {saving ? <><Save className="w-4 h-4 animate-pulse" /> Salvando…</> : <><Save className="w-4 h-4" /> Salvar perfil</>}
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 rounded-lg border border-white/15 text-neutral-300 hover:bg-white/5 py-3.5 text-[12px] font-bold uppercase tracking-widest"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
