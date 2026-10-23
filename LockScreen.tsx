"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Delete, Lock, ShieldQuestion, Lightbulb, Keyboard } from "lucide-react";
import { useGame, useCase } from "@/components/game/context";
import { sfx } from "@/lib/audio";
import { Wallpaper } from "./PhoneFrame";
import PatternLock from "./PatternLock";
import { Fingerprint } from "lucide-react";
import { useKeypad } from "./useKeypad";

export default function LockScreen() {
  const caseData = useCase();
  const { setPhoneUnlocked, sessionId, pushToast, addPinTry, pinTries, elapsed } = useGame();
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);
  const [hintLevel, setHintLevel] = useState(-1); // -1: fechado

  const press = (d: string) => {
    if (wrong) return;
    sfx.key();
    const next = (code + d).slice(0, 4);
    setCode(next);
    if (next.length === 4) {
      if (next === caseData.pin) {
        window.setTimeout(() => {
          setPhoneUnlocked(true);
          if (sessionId) {
            fetch("/api/session", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: sessionId, phoneUnlocked: true }),
            }).catch(() => {});
          }
          sfx.unlock();
          pushToast("Celular desbloqueado", `Extração autorizada · última atividade ${caseData.lockTime}`);
        }, 260);
      } else {
        sfx.error();
        addPinTry();
        setWrong(true);
        window.setTimeout(() => {
          setCode("");
          setWrong(false);
        }, 520);
      }
    }
  };

  const usesPattern = !!caseData.pattern?.length;
  const [mode, setMode] = useState<"pattern" | "pin">(usesPattern ? "pattern" : "pin");
  const stuck = elapsed >= 120 || pinTries >= 3;
  const [offered, setOffered] = useState(false);
  useEffect(() => {
    if (stuck && !offered && hintLevel === -1) setOffered(true);
  }, [stuck, offered, hintLevel]);

  useKeypad({
    onDigit: press,
    onBackspace: () => setCode((c) => c.slice(0, -1)),
    onClear: () => setCode(""),
    enabled: !wrong && mode === "pin",
  });

  const unlock = () => {
    setPhoneUnlocked(true);
    if (sessionId) {
      fetch("/api/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sessionId, phoneUnlocked: true }),
      }).catch(() => {});
    }
    pushToast("Celular desbloqueado", `Extração autorizada · última atividade ${caseData.lockTime}`);
  };

  return (
    <div className="absolute inset-0 z-20">
      <Wallpaper blur />
      <div className="absolute inset-0 backdrop-blur-xl bg-black/35" />
      <div className="relative h-full flex flex-col items-center pt-16 sm:pt-20 pb-8 px-4 sm:px-6 overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center text-white">
          <div className="flex items-center gap-1.5 text-white/80 text-xs tracking-widest uppercase mb-3">
            <Lock className="w-3.5 h-3.5" /> Apreensão nº {caseData.no}
          </div>
          <div className="text-[60px] leading-none font-semibold tracking-tight drop-shadow-lg flicker">
            {caseData.lockTime}
          </div>
          <div className="text-sm text-white/70 mt-2">{caseData.lockDate}</div>
        </div>

        <div className="flex-1" />

        {mode === "pattern" ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[11px] text-white/70 mb-2">
              <Fingerprint className="w-3.5 h-3.5" /> desenhe o padrão de desbloqueio
            </div>
            <PatternLock
              expected={caseData.pattern ?? []}
              onSuccess={unlock}
              onFail={addPinTry}
              size={240}
            />
            <div className="text-[11px] text-white/65 mt-1 h-5">
              {pinTries > 0 ? `${Math.max(0, 5 - pinTries)} tentativa(s) antes do bloqueio temporário` : ""}
            </div>
            {caseData.patternHint && hintLevel >= 0 && (
              <p className="mt-2 max-w-[290px] text-center text-[11.5px] text-[#e9d9b8] leading-snug">
                {caseData.patternHint}
              </p>
            )}
          </div>
        ) : (
        <>
        <div className={`flex gap-4 mb-4 ${wrong ? "animate-shake" : ""}`}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 ${
                code.length > i ? "bg-white border-white scale-110" : "border-white/60 bg-transparent"
              }`}
            />
          ))}
        </div>
        <div className={`h-5 text-xs mb-1 ${wrong ? "text-red-400" : "text-white/65"}`}>
          {wrong ? "Código incorreto" : "Digite o código"}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/60 mb-3">
          <Keyboard className="w-3 h-3" /> use o teclado do computador
        </div>

        <div className="grid grid-cols-3 gap-x-5 gap-y-2.5">
          {["1","2","3","4","5","6","7","8","9","","0"].map((d, i) =>
            d === "" ? (
              <div key={i} />
            ) : (
              <motion.button
                key={d}
                whileTap={{ scale: 0.88 }}
                onClick={() => press(d)}
                className="w-[18vw] h-[18vw] max-w-[70px] max-h-[70px] rounded-full bg-white/10 backdrop-blur-md text-white text-2xl font-light flex items-center justify-center hover:bg-white/20 transition-colors border border-white/5"
              >
                {d}
              </motion.button>
            )
          )}
          <button
            onClick={() => setCode((c) => c.slice(0, -1))}
            className="w-[18vw] h-[18vw] max-w-[70px] max-h-[70px] rounded-full text-white/80 flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Apagar"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>
        </>
        )}

        {usesPattern && (
          <button
            onClick={() => {
              sfx.tap();
              setMode((m) => (m === "pattern" ? "pin" : "pattern"));
            }}
            className="mt-3 text-[11px] text-[#9fd0ff] underline underline-offset-2"
          >
            {mode === "pattern" ? "usar código numérico" : "usar padrão de desenho"}
          </button>
        )}

        {offered && hintLevel === -1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-[#c9a86a]/40 bg-black/60 backdrop-blur px-3.5 py-2.5 max-w-[300px] text-center"
          >
            <p className="text-[11.5px] text-[#e9d9b8] leading-snug">
              {pinTries >= 3
                ? "Três tentativas sem sucesso."
                : "Você está nisso há um tempo."}{" "}
              Quer acionar o analista sênior?
            </p>
          </motion.div>
        )}

        <button
          onClick={() => {
            sfx.tap();
            setHintLevel((l) => Math.min(l + 1, caseData.pinHints.length - 1));
          }}
          disabled={hintLevel >= caseData.pinHints.length - 1}
          className="mt-4 flex items-center gap-1.5 text-xs text-white/60 hover:text-white/90 transition-colors disabled:opacity-40"
        >
          <ShieldQuestion className="w-3.5 h-3.5" />
          {hintLevel === -1
            ? offered
              ? "Solicitar ajuda do analista sênior"
              : "Não faço ideia da senha"
            : hintLevel < caseData.pinHints.length - 1
              ? "Preciso de mais uma pista"
              : "Sem mais pistas"}
        </button>

        <AnimatePresence>
          {hintLevel >= 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 rounded-2xl bg-black/50 backdrop-blur-md border border-[#c9a86a]/30 p-3.5 text-left space-y-2 max-w-[300px]"
            >
              {caseData.pinHints.slice(0, hintLevel + 1).map((h, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[12px] text-[#e9d9b8] leading-snug flex gap-2"
                >
                  <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#c9a86a]" />
                  {h}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
