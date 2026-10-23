"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Landmark, Delete, CircleHelp, ArrowDownLeft, ArrowUpRight, Keyboard } from "lucide-react";
import AppShell, { PinButton } from "../AppShell";
import { useCase, useGame } from "@/components/game/context";
import { useKeypad } from "../useKeypad";
import { sfx } from "@/lib/audio";

export default function BankApp() {
  const caseData = useCase();
  const { bankUnlocked, unlockBank, pushToast } = useGame();
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const press = (d: string) => {
    if (wrong) return;
    sfx.key();
    const next = (code + d).slice(0, 4);
    setCode(next);
    if (next.length === 4) {
      if (next === caseData.bank.password) {
        window.setTimeout(() => {
          unlockBank();
          sfx.unlock();
          pushToast("Banco desbloqueado", "Sessão remota autorizada pelo juízo.");
        }, 250);
      } else {
        sfx.error();
        setWrong(true);
        window.setTimeout(() => {
          setCode("");
          setWrong(false);
        }, 520);
      }
    }
  };

  useKeypad({
    onDigit: press,
    onBackspace: () => setCode((c) => c.slice(0, -1)),
    onClear: () => setCode(""),
    enabled: !bankUnlocked && !wrong,
  });

  if (!bankUnlocked) {
    return (
      <AppShell title="Banco Meridional" headerBlack>
        <div className="min-h-full flex flex-col items-center justify-center px-8 py-10 bg-gradient-to-b from-[#101d33] to-[#0b0b0e]">
          <div className="w-16 h-16 rounded-2xl bg-[#0a4d8c] flex items-center justify-center shadow-xl mb-5">
            <Landmark className="w-8 h-8 text-white" />
          </div>
          <div className="text-lg font-bold mb-1">Acesso judicial</div>
          <div className="text-[12px] text-neutral-400 text-center mb-6">
            Dígito de segurança configurado pelo titular.
          </div>

          <div className={`flex gap-3.5 mb-5 ${wrong ? "animate-shake" : ""}`}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  code.length > i ? "bg-white border-white scale-110" : "border-white/40"
                }`}
              />
            ))}
          </div>
          <div className={`h-5 text-[12px] mb-1 ${wrong ? "text-red-400" : "text-white/65"}`}>
            {wrong ? "Senha incorreta" : "Senha de 4 dígitos"}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-white/60 mb-4">
            <Keyboard className="w-3 h-3" /> use o teclado do computador
          </div>

          <div className="grid grid-cols-3 gap-x-5 gap-y-2.5 mb-6">
            {["1","2","3","4","5","6","7","8","9","","0"].map((d, i) =>
              d === "" ? (
                <div key={i} />
              ) : (
                <motion.button
                  key={d}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => press(d)}
                  className="w-14 h-14 rounded-full bg-white/10 backdrop-blur text-white text-xl font-light flex items-center justify-center hover:bg-white/20 border border-white/5"
                >
                  {d}
                </motion.button>
              )
            )}
            <button
              onClick={() => setCode((c) => c.slice(0, -1))}
              className="w-14 h-14 rounded-full text-white/80 flex items-center justify-center hover:bg-white/10"
              aria-label="Apagar"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setShowHint((v) => !v)}
            className="flex items-center gap-1.5 text-[12px] text-[#7ec8ff]"
          >
            <CircleHelp className="w-4 h-4" />
            {showHint ? caseData.bank.hint : "Como descubro essa senha?"}
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Banco Meridional" headerBlack>
      <div className="bg-gradient-to-b from-[#0a4d8c] to-[#10233c] px-5 pt-6 pb-7">
        <div className="flex items-center gap-2 text-white/80 text-[11px] uppercase tracking-widest mb-1">
          <Lock className="w-3 h-3" /> sessão judicial · extrato completo
        </div>
        <div className="text-white/70 text-[12px]">{caseData.bank.holder}</div>
        <div className="text-white text-3xl font-bold tracking-tight mt-1">{caseData.bank.balance}</div>
        <div className="text-white/60 text-[11px] mt-1">saldo registrado na data da apreensão</div>
      </div>
      <div className="p-3 space-y-1.5">
        {caseData.bank.txns.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 rounded-xl bg-[#141418] px-3.5 py-3"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                t.out ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {t.out ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold leading-snug">{t.desc}</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">{t.date}</div>
            </div>
            <div className={`text-[13px] font-bold shrink-0 ${t.out ? "text-red-400" : "text-emerald-400"}`}>
              {t.amount}
            </div>
            {t.evidenceId && <PinButton evidenceId={t.evidenceId} />}
          </motion.div>
        ))}
      </div>
      <p className="px-4 py-3 text-[11px] text-neutral-400">
        Extrato íntegro liberado por ordem judicial. Confira cada favorecido.
      </p>
    </AppShell>
  );
}
