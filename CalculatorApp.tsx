"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ImageIcon, Info } from "lucide-react";
import AppShell, { PinButton } from "../AppShell";
import { useCase, useGame } from "@/components/game/context";
import { vaultFor, exifFor } from "@/game/derive";
import { sfx } from "@/lib/audio";
import { useKeypad } from "../useKeypad";

const KEYS = [
  ["AC", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

export default function CalculatorApp() {
  const caseData = useCase();
  const { pushToast } = useGame();
  const vault = vaultFor(caseData);

  const [display, setDisplay] = useState("0");
  const [opened, setOpened] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sel, setSel] = useState<number | null>(null);

  const press = (k: string) => {
    sfx.key();
    if (k === "AC") return setDisplay("0");
    if (k === "=") {
      if (display.replace(/[^0-9]/g, "") === vault.code) {
        sfx.unlock();
        if (navigator.vibrate) navigator.vibrate([25, 30, 25]);
        setOpened(true);
        pushToast("Cofre aberto", "Pasta oculta encontrada dentro da calculadora.");
        return;
      }
      try {
        const expr = display.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
        // eslint-disable-next-line no-new-func
        const r = Function(`"use strict";return (${expr})`)();
        setDisplay(String(Number.isFinite(r) ? Math.round(r * 1e6) / 1e6 : 0));
      } catch {
        setDisplay("0");
      }
      return;
    }
    setDisplay((d) => (d === "0" && !"+−×÷.".includes(k) ? k : d + k));
  };

  useKeypad({
    onDigit: (d) => press(d),
    onBackspace: () => setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0")),
    onClear: () => setDisplay("0"),
    enabled: !opened,
  });

  if (opened) {
    const photo = sel !== null ? vault.photos[sel] : null;
    if (photo) {
      const exif = exifFor(caseData, photo, 0);
      return (
        <AppShell
          title="Arquivo oculto"
          onBack={() => setSel(null)}
          right={photo.evidenceId ? <PinButton evidenceId={photo.evidenceId} /> : undefined}
          headerBlack
        >
          <div className="p-4">
            {photo.url ? (
              <img src={photo.url} alt={photo.caption} className="w-full rounded-xl border border-white/10" />
            ) : (
              <div className="h-48 rounded-xl bg-[#0f2318] border border-[#32c76b]/30 flex items-center justify-center text-[#32c76b] font-black">
                ARQUIVO
              </div>
            )}
            <div className="mt-3 text-[14px] text-neutral-100">{photo.caption}</div>
            <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#c9a86a] mb-1">
                <Info className="w-3 h-3" /> Metadados EXIF
              </div>
              {[
                ["Câmera", exif.camera],
                ["Capturada em", exif.taken],
                ["Local", exif.gps ?? "—"],
                ["Coordenadas", exif.coords ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 text-[12px]">
                  <span className="text-neutral-400">{k}</span>
                  <span className="text-neutral-200 text-right">{v}</span>
                </div>
              ))}
              {exif.note && <p className="text-[11.5px] text-[#c9a86a] pt-1.5">{exif.note}</p>}
            </div>
          </div>
        </AppShell>
      );
    }
    return (
      <AppShell title="Pasta protegida" headerBlack>
        <div className="p-4">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-2.5 mb-4 text-[12px] text-emerald-200">
            Cofre desbloqueado. {vault.photos.length} arquivo(s) oculto(s) pelo próprio usuário.
          </div>
          <div className="grid grid-cols-2 gap-2">
            {vault.photos.map((p, i) => (
              <button
                key={p.id}
                onClick={() => {
                  sfx.tap();
                  setSel(i);
                }}
                className="relative aspect-square rounded-lg overflow-hidden bg-[#16161a] border border-white/10"
              >
                {p.url ? (
                  <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#32c76b] font-black text-sm">
                    PIX
                  </div>
                )}
                {p.evidenceId && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#c9a86a]" />}
              </button>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Calculadora" headerBlack>
      <div className="flex flex-col h-full px-4 pb-4">
        <div className="flex-1 flex items-end justify-end pb-5 pt-8">
          <motion.div
            key={display}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="text-right text-[46px] font-light text-white truncate max-w-full tabular-nums"
          >
            {display}
          </motion.div>
        </div>

        <div className="space-y-2.5">
          {KEYS.map((row, r) => (
            <div key={r} className="grid grid-cols-4 gap-2.5">
              {row.map((k) => {
                const op = "÷×−+=".includes(k);
                const fn = "AC±%".includes(k);
                return (
                  <motion.button
                    key={k}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => press(k)}
                    className={`h-14 rounded-full text-[20px] font-medium flex items-center justify-center ${
                      k === "0" ? "col-span-2" : ""
                    } ${
                      op
                        ? "bg-[#ff9f0a] text-white"
                        : fn
                          ? "bg-[#a5a5a5] text-black"
                          : "bg-[#333336] text-white"
                    }`}
                  >
                    {k}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowHint((v) => !v)}
          className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 hover:text-neutral-200"
        >
          <Lock className="w-3 h-3" />
          {showHint ? vault.hint : "Perícia: este app pode esconder mais do que contas"}
        </button>
        {showHint && (
          <p className="mt-1.5 text-center text-[10.5px] text-neutral-500 flex items-center justify-center gap-1">
            <ImageIcon className="w-3 h-3" /> digite o código e toque em “=”
          </p>
        )}
      </div>
    </AppShell>
  );
}
