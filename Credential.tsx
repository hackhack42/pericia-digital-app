"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Fingerprint } from "lucide-react";
import { saveProfile, type Gender, type DetectiveProfile } from "@/game/profile";
import { sfx, initAudio } from "@/lib/audio";

const OPTIONS: { id: Gender; label: string; example: string }[] = [
  { id: "f", label: "Feminino", example: "Sra. / bem-vinda" },
  { id: "m", label: "Masculino", example: "Sr. / bem-vindo" },
  { id: "n", label: "Prefiro não dizer", example: "Agente / bem-vindo(a)" },
];

export default function Credential({ onDone }: { onDone: (p: DetectiveProfile) => void }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    const p: DetectiveProfile = { name: n, gender };
    initAudio();
    saveProfile(p);
    sfx.unlock();
    onDone(p);
  };

  const first = name.trim().split(/\s+/)[0] || "…";
  const honor = gender === "f" ? "Sra." : gender === "m" ? "Sr." : "Agente";

  return (
    <div className="relative min-h-dvh w-full flex items-center justify-center px-5 py-10 bg-[#08080a] overflow-y-auto nice-scroll">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(201,168,106,0.10),transparent_65%)] pointer-events-none" />

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative paper w-full max-w-md rounded-xl p-7 md:p-9"
      >
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#c9a86a] mb-5">
          <Fingerprint className="w-4 h-4" /> credencial de acesso
        </div>

        <h1 className="font-elite text-2xl md:text-3xl text-white leading-tight mb-2">
          Identifique-se, investigador.
        </h1>
        <p className="text-[13px] text-neutral-400 leading-relaxed mb-6">
          A equipe precisa saber como chamar você no rádio e nos relatórios.
        </p>

        <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
          Nome
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={() => sfx.type()}
          autoFocus
          maxLength={28}
          placeholder="Ex.: Julia, Daniel, Alex…"
          className="w-full rounded-lg border border-white/15 bg-[#1a1814] px-3.5 py-3 text-[16px] sm:text-[15px] outline-none placeholder:text-neutral-400 focus:border-[#c9a86a]/70 mb-5"
        />

        <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
          Tratamento
        </label>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setGender(o.id);
                sfx.tap();
              }}
              className={`rounded-lg border px-2 py-2.5 text-left transition-colors ${
                gender === o.id
                  ? "border-[#c9a86a] bg-[#c9a86a]/10"
                  : "border-white/10 bg-black/30 hover:border-white/25"
              }`}
            >
              <div className={`text-[12px] font-semibold ${gender === o.id ? "text-[#c9a86a]" : "text-neutral-300"}`}>
                {o.label}
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5">{o.example}</div>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-[#c9a86a]/25 bg-black/40 p-3.5 mb-6">
          <div className="text-[9.5px] uppercase tracking-widest text-neutral-400 mb-1">Prévia</div>
          <p className="text-[13.5px] text-[#e9d9b8] leading-snug">
            LISBON: “Vamos lá, <b className="text-white">Detetive {first}</b>. O caso é seu.”
          </p>
          <p className="text-[13.5px] text-[#e9d9b8] leading-snug mt-1">
            JANE: “Seja bem-{gender === "f" ? "vinda" : gender === "m" ? "vindo" : "vindo(a)"},{" "}
            <b className="text-white">
              {honor} {first}
            </b>
            . Tome um chá antes de começar.”
          </p>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full rounded-lg bg-[#8f1f1f] hover:bg-[#a52424] disabled:opacity-40 py-4 font-elite text-base uppercase tracking-[0.25em] text-white transition-all flex items-center justify-center gap-3 shadow-[0_18px_50px_-12px_rgba(143,31,31,0.6)]"
        >
          <BadgeCheck className="w-5 h-5" /> Emitir credencial
        </button>
        <p className="text-[10.5px] text-neutral-400 text-center mt-3">
          Fica salvo só no seu navegador. Dá para trocar depois no cabeçalho.
        </p>
      </motion.form>
    </div>
  );
}
