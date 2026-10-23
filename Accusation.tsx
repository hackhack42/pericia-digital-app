"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, Lock, Fingerprint, ChevronRight, ChevronLeft, Check, FileSignature } from "lucide-react";
import { useGame, useCase } from "./context";
import { METHODS } from "@/game/methods";
import { addressed } from "@/game/profile";
import { sfx } from "@/lib/audio";
import { useAuth } from "@/components/auth/AuthContext";
import { recordCase } from "@/game/career";

type Step = 0 | 1 | 2 | 3 | 4;

export default function Accusation({ onOutcome }: { onOutcome: (result: string) => void }) {
  const {
    sessionId,
    evidence,
    setAttempts,
    setSolved,
    pushToast,
    profile,
    elapsed,
    phoneUnlocked,
    bankUnlocked,
    hints,
    pinTries,
    attempts,
  } = useGame();
  const { syncCareer } = useAuth();
  const caseData = useCase();
  const SUSPECTS = caseData.suspects;
  const MOTIVES = caseData.motives;
  const EVIDENCE = caseData.evidence;
  const METHOD_OPTS = caseData.methods ?? METHODS[caseData.id] ?? [];

  const [step, setStep] = useState<Step>(0);
  const [suspect, setSuspect] = useState<string | null>(null);
  const [method, setMethod] = useState<string | null>(null);
  const [motive, setMotive] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const ready = evidence.length >= 3;

  const toggleEvidence = (id: string) => {
    sfx.tap();
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const submit = async () => {
    if (!sessionId || loading) return;
    setLoading(true);
    sfx.tap();
    try {
      const res = await fetch("/api/accuse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sessionId, suspect, motive, method, evidence: selected }),
      });
      const data = await res.json();
      if (data.attempts !== undefined) setAttempts(data.attempts);
      if (data.result === "perfect") setSolved(true);
      syncCareer().catch(()=>{});

      // registra na ficha funcional (XP, reputação, medalhas)
      const outcome = (data.result ?? "wrong") as "perfect" | "weak" | "wrong";
      const r = recordCase({
        caseId: caseData.id,
        outcome,
        elapsed,
        hints,
        pinTries,
        attempts: (data.attempts ?? attempts) || 1,
        evidence: selected.length,
        at: new Date().toISOString(),
      });
      if (r.xpGain) {
        pushToast(
          outcome === "perfect" ? "Ficha atualizada" : "Corregedoria registrou",
          `${r.xpGain > 0 ? "+" : ""}${r.xpGain} XP · reputação ${r.repDelta > 0 ? "+" : ""}${r.repDelta}`
        );
      }
      r.newMedals.forEach((m, i) =>
        window.setTimeout(() => pushToast("Condecoração desbloqueada", m), 1200 + i * 900)
      );
      if (profile?.name) {
        const dispositivos: string[] = [];
        if (phoneUnlocked) dispositivos.push(`${caseData.id}:celular`);
        if (bankUnlocked) dispositivos.push(`${caseData.id}:banco`);
        fetch("/api/progresso", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: profile.name,
            casoId: caseData.id,
            dispositivos,
            pistas: evidence,
            tempo: elapsed,
            concluido: data.result === "perfect",
          }),
        }).catch(() => {});
      }
      onOutcome(data.result ?? "wrong");
      if (data.result !== "perfect") {
        pushToast("Relatório protocolado", "Você pode reabrir a investigação a qualquer momento.");
      }
    } catch {
      pushToast("Erro", "Não foi possível protocolar o relatório.");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="rounded-lg border border-dashed border-[#8f1f1f]/40 bg-[#8f1f1f]/5 p-6 text-center">
        <Lock className="w-6 h-6 text-[#8f1f1f] mx-auto mb-3" />
        <p className="text-[13px] text-neutral-300 leading-relaxed">
          O promotor recusou abrir o formulário.
          <br />
          <span className="text-neutral-400">
            Anexe pelo menos <span className="text-[#c9a86a] font-semibold">3 provas</span> antes de
            emitir o relatório.
          </span>
        </p>
        <div className="mt-3 text-[11px] uppercase tracking-widest text-neutral-400">
          {evidence.length}/3 provas
        </div>
      </div>
    );
  }

  const steps = [
    { n: 1, label: "Culpado", ok: !!suspect },
    { n: 2, label: "Método", ok: !!method },
    { n: 3, label: "Motivação", ok: !!motive },
    { n: 4, label: "Prova", ok: selected.length > 0 },
    { n: 5, label: "Assinar", ok: true },
  ];

  const canNext =
    (step === 0 && !!suspect) ||
    (step === 1 && !!method) ||
    (step === 2 && !!motive) ||
    (step === 3 && selected.length > 0) ||
    step === 4;

  const Option = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={() => {
        sfx.tap();
        onClick();
      }}
      className={`w-full text-left rounded-lg px-3.5 py-3 text-[13px] border transition-colors ${
        active
          ? "border-[#8f1f1f] bg-[#8f1f1f]/15 text-white"
          : "border-white/10 bg-black/30 text-neutral-300 hover:border-white/25"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div>
      {/* cabeçalho do formulário */}
      <div className="rounded-lg border border-[#c9a86a]/30 bg-[#17150f] p-3.5 mb-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#c9a86a] mb-1">
          <FileSignature className="w-3.5 h-3.5" /> Relatório de perícia · mandado
        </div>
        <p className="text-[12px] text-neutral-300 leading-snug">
          Preencha o termo. Requerente: <b className="text-white">{addressed(profile)}</b> · Caso nº{" "}
          {caseData.no}.
        </p>
      </div>

      {/* trilha de etapas */}
      <div className="flex items-center gap-1 mb-5">
        {steps.map((s, i) => (
          <button
            key={s.n}
            onClick={() => i <= step && setStep(i as Step)}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div
              className={`w-full h-1 rounded-full ${
                i < step ? "bg-[#c9a86a]" : i === step ? "bg-[#8f1f1f]" : "bg-white/10"
              }`}
            />
            <span
              className={`text-[8.5px] uppercase tracking-wider ${
                i === step ? "text-[#8f1f1f] font-bold" : i < step ? "text-[#c9a86a]" : "text-neutral-500"
              }`}
            >
              {s.ok && i < step ? <Check className="w-3 h-3 inline" /> : s.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.18 }}
          className="min-h-[230px]"
        >
          {step === 0 && (
            <>
              <h3 className="font-elite text-lg text-white mb-3">1 · Quem é o culpado?</h3>
              <div className="grid grid-cols-3 gap-2">
                {SUSPECTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      sfx.tap();
                      setSuspect(s.id);
                    }}
                    className={`rounded-lg p-2 border transition-all ${
                      suspect === s.id
                        ? "border-[#8f1f1f] bg-[#8f1f1f]/15 scale-[1.02]"
                        : "border-white/10 bg-black/30 hover:border-white/25"
                    }`}
                  >
                    <img
                      src={s.avatar}
                      alt={s.name}
                      className={`w-full aspect-square object-cover rounded-sm mb-1.5 transition ${
                        suspect === s.id ? "grayscale-0" : "grayscale-[35%]"
                      }`}
                    />
                    <div className={`text-[11px] font-semibold leading-tight ${suspect === s.id ? "text-white" : "text-neutral-400"}`}>
                      {s.name}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h3 className="font-elite text-lg text-white mb-3">2 · Qual foi a arma / método?</h3>
              <div className="space-y-2">
                {METHOD_OPTS.map((m) => (
                  <Option key={m.id} active={method === m.id} onClick={() => setMethod(m.id)}>
                    {m.label}
                  </Option>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="font-elite text-lg text-white mb-3">3 · Qual foi a motivação?</h3>
              <div className="space-y-2">
                {MOTIVES.map((m) => (
                  <Option key={m.id} active={motive === m.id} onClick={() => setMotive(m.id)}>
                    {m.label}
                  </Option>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="font-elite text-lg text-white mb-1">4 · Provas irrefutáveis</h3>
              <p className="text-[11.5px] text-neutral-400 mb-3">
                Selecione tudo que sustenta a acusação (local, conhecimento e motivo).
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto nice-scroll pr-1">
                {evidence.map((id) => {
                  const e = EVIDENCE[id];
                  if (!e) return null;
                  const on = selected.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggleEvidence(id)}
                      className={`w-full text-left rounded-lg px-3.5 py-2.5 border transition-all flex items-center gap-3 ${
                        on ? "border-[#c9a86a] bg-[#c9a86a]/10" : "border-white/10 bg-black/30 hover:border-white/25"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${
                          on ? "bg-[#c9a86a] border-[#c9a86a]" : "border-neutral-500"
                        }`}
                      >
                        {on && <Fingerprint className="w-3 h-3 text-black" />}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold truncate">{e.title}</div>
                        <div className="text-[11px] text-neutral-400 truncate">{e.source}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h3 className="font-elite text-lg text-white mb-3">5 · Conferir e assinar</h3>
              <div className="rounded-lg border border-[#c9a86a]/25 bg-black/40 divide-y divide-white/5 text-[12.5px]">
                {[
                  ["Indiciado(a)", SUSPECTS.find((s) => s.id === suspect)?.name ?? "—"],
                  ["Método", METHOD_OPTS.find((m) => m.id === method)?.label ?? "—"],
                  ["Motivação", MOTIVES.find((m) => m.id === motive)?.label ?? "—"],
                  ["Provas", `${selected.length} item(ns) anexado(s)`],
                  ["Requerente", addressed(profile)],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 px-3.5 py-2.5">
                    <span className="text-neutral-400 w-24 shrink-0">{k}</span>
                    <span className="text-neutral-100 flex-1">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-neutral-400 mt-3 leading-relaxed">
                Ao assinar, o inquérito é remetido ao Ministério Público. Uma acusação frágil pode
                ser arquivada — e uma acusação injusta tem consequências.
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mt-5">
        {step > 0 && (
          <button
            onClick={() => {
              sfx.tap();
              setStep((s) => (s - 1) as Step);
            }}
            className="rounded-lg border border-white/15 text-neutral-300 px-4 py-3 text-[12px] uppercase tracking-widest flex items-center gap-1.5 hover:bg-white/5"
          >
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={() => {
              sfx.tap();
              setStep((s) => (s + 1) as Step);
            }}
            disabled={!canNext}
            className="flex-1 rounded-lg bg-[#c9a86a] disabled:bg-white/5 disabled:text-neutral-500 text-black py-3 text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors"
          >
            Avançar <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={submit}
            disabled={loading}
            className="flex-1 rounded-lg bg-[#8f1f1f] hover:bg-[#a52424] py-4 font-elite text-base tracking-[0.2em] uppercase flex items-center justify-center gap-3 text-white shadow-[0_10px_40px_-10px_rgba(143,31,31,0.7)] disabled:opacity-50"
          >
            <Gavel className="w-5 h-5" />
            {loading ? "Protocolando…" : "Emitir mandado"}
          </motion.button>
        )}
      </div>
    </div>
  );
}
