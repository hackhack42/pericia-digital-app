"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fingerprint,
  BadgeCheck,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  LogIn,
  Shield,
  AlertCircle,
} from "lucide-react";
import { sfx, initAudio } from "@/lib/audio";
import type { AgentPayload } from "@/lib/auth";
import { useAuth } from "./AuthContext";

const GENDER_OPTIONS = [
  { id: "f", label: "Agente (fem.)", example: "Detetiva / bem-vinda" },
  { id: "m", label: "Agente (masc.)", example: "Detetive / bem-vindo" },
  { id: "n", label: "Prefiro não dizer", example: "Agente / bem-vindo(a)" },
];

export default function AuthScreen({ onAuth }: { onAuth: (a: AgentPayload) => void }) {
  const { remembered } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [nome, setNome] = useState("");
  const [genero, setGenero] = useState("n");
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  const [phase, setPhase] = useState<"logo" | "form">("logo");

  // preenche a matrícula lembrada
  useEffect(() => {
    const r = remembered();
    if (r?.matricula) setMatricula(r.matricula);
  }, []);

  // primeiro: animação da logo, depois o formulário
  useEffect(() => {
    const t = setTimeout(() => setPhase("form"), 1800);
    return () => clearTimeout(t);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    initAudio();
    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = tab === "login"
        ? { matricula: matricula.trim(), password, remember }
        : { nome: nome.trim(), genero, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        sfx.error();
        setError(data.error ?? "Erro ao autenticar.");
        return;
      }
      sfx.unlock();
      if (tab === "register") {
        setHint(`Sua matrícula: ${data.agent.matricula} — anote para entrar em outros dispositivos.`);
        await new Promise((r) => setTimeout(r, 2200));
      }
      onAuth(data.agent);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh w-full bg-[#100e08] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* fundo lona */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "repeating-linear-gradient(45deg,#c9a86a11 0,#c9a86a11 1px,transparent 1px,transparent 14px)" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,168,106,0.08),transparent_65%)]" />

      <AnimatePresence mode="wait">
        {phase === "logo" && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08, y: -40 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-6"
          >
            <img
              src="/logo.svg"
              alt="Perícia Digital"
              className="w-72 sm:w-96 max-w-full drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="redacted text-[10px] uppercase tracking-[0.4em] text-[#c9a86a]/70"
            >
              iniciando terminal forense…
            </motion.div>
          </motion.div>
        )}

        {phase === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="w-full max-w-md"
          >
            {/* logo pequena */}
            <div className="flex items-center justify-center gap-3 mb-7">
              <img src="/logo.svg" alt="Perícia Digital" className="w-16 h-16 object-contain" />
              <div>
                <div className="font-elite text-2xl text-[#c9a86a] tracking-wide">PERÍCIA</div>
                <div className="font-elite text-sm text-[#c9a86a]/70 tracking-[0.3em]">DIGITAL</div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#c9a86a]/25 bg-[#12100b]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* abas */}
              <div className="flex border-b border-[#c9a86a]/20">
                {(["login", "register"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setError(""); sfx.tap(); }}
                    className={`flex-1 py-4 flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-widest transition-colors ${
                      tab === t
                        ? "text-[#c9a86a] bg-[#c9a86a]/8"
                        : "text-neutral-500 hover:text-neutral-300"
                    }`}
                  >
                    {t === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {t === "login" ? "Entrar" : "Novo agente"}
                    {tab === t && (
                      <motion.div layoutId="authtab" className="absolute bottom-0 h-0.5 w-16 bg-[#c9a86a]" />
                    )}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="p-6 space-y-4">
                {tab === "register" && (
                  <>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                        Nome completo
                      </label>
                      <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex.: Julia Mendes"
                        required
                        className="w-full rounded-lg border border-white/12 bg-black/40 px-3.5 py-3 text-[16px] sm:text-[14px] text-white outline-none placeholder:text-neutral-600 focus:border-[#c9a86a]/60 transition-colors"
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
                            onClick={() => { setGenero(g.id); sfx.tap(); }}
                            className={`rounded-lg border px-2 py-2.5 text-left transition-colors ${
                              genero === g.id
                                ? "border-[#c9a86a] bg-[#c9a86a]/10"
                                : "border-white/10 bg-black/30 hover:border-white/25"
                            }`}
                          >
                            <div className={`text-[11px] font-semibold ${genero === g.id ? "text-[#c9a86a]" : "text-neutral-300"}`}>
                              {g.label}
                            </div>
                            <div className="text-[10px] text-neutral-500 mt-0.5">{g.example}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {tab === "login" && remembered() && (
                  <div className="flex items-center gap-2 rounded-lg border border-[#c9a86a]/25 bg-[#c9a86a]/5 px-3 py-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#c9a86a]">último acesso</span>
                    <span className="text-[12px] text-white font-medium truncate">{remembered()?.nome}</span>
                    <button type="button" onClick={() => setMatricula(remembered()?.matricula ?? "")}
                      className="ml-auto text-[10.5px] text-[#c9a86a] underline underline-offset-2 shrink-0">
                      usar
                    </button>
                  </div>
                )}

                {tab === "login" && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                      Matrícula
                    </label>
                    <input
                      value={matricula}
                      onChange={(e) => {
                        // máscara automática: PD-2026-0426
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        let out = "";
                        if (digits.length > 0) out = "PD";
                        if (digits.length > 0) out += "-" + digits.slice(0, 4);
                        if (digits.length > 4) out += "-" + digits.slice(4, 8);
                        setMatricula(out || "PD-");
                      }}
                      onFocus={() => { if (!matricula) setMatricula("PD-"); }}
                      placeholder="PD-2026-0426"
                      inputMode="numeric"
                      autoComplete="username"
                      required
                      autoFocus
                      className="w-full rounded-lg border border-white/12 bg-black/40 px-3.5 py-3 text-[16px] text-white font-mono tracking-wider outline-none placeholder:text-neutral-600 focus:border-[#c9a86a]/60 transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                    Senha {tab === "register" && <span className="text-neutral-600">(mín. 6 caracteres)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-lg border border-white/12 bg-black/40 px-3.5 py-3 pr-11 text-[16px] sm:text-[14px] text-white outline-none placeholder:text-neutral-600 focus:border-[#c9a86a]/60 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2.5 text-[12.5px] text-red-200"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
                    </motion.div>
                  )}
                  {hint && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 rounded-lg border border-[#c9a86a]/40 bg-[#c9a86a]/8 px-3 py-2.5 text-[12.5px] text-[#e9d9b8]"
                    >
                      <BadgeCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#c9a86a]" /> {hint}
                    </motion.div>
                  )}
                </AnimatePresence>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border border-white/25 bg-black/40 accent-[#c9a86a]" />
                  <span className="text-[12.5px] text-neutral-300">Manter conectado por 90 dias</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#8f1f1f] hover:bg-[#a52424] disabled:opacity-50 py-4 font-elite text-[15px] uppercase tracking-[0.25em] text-white transition-all shadow-[0_12px_40px_-10px_rgba(143,31,31,0.6)] flex items-center justify-center gap-2.5"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Autenticando…</>
                  ) : tab === "login" ? (
                    <><Fingerprint className="w-5 h-5" /> Acessar terminal</>
                  ) : (
                    <><Shield className="w-5 h-5" /> Criar credencial</>
                  )}
                </button>

                <p className="text-[10.5px] text-neutral-600 text-center leading-relaxed">
                  {tab === "login"
                    ? "A matrícula e o progresso ficam salvos no servidor — acesse de qualquer dispositivo."
                    : "Ao criar a conta, você recebe uma matrícula única (ex.: PD-2024-0042). Anote-a para entrar em outros dispositivos."}
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
