"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, CloudDownload, Check, ScanLine, FileText, Image as ImgIcon, Mic } from "lucide-react";
import AppShell, { PinButton } from "../AppShell";
import { useCase, useGame } from "@/components/game/context";
import { trashFor } from "@/game/derive";
import { sfx } from "@/lib/audio";
import type { TrashItem } from "@/game/types";

/** Minigame: reordenar fragmentos para reconstruir o arquivo. */
function Recovery({ item, onDone }: { item: TrashItem; onDone: () => void }) {
  const { collect, pushToast } = useGame();
  const shuffled = [...item.fragments].sort((a, b) => (a.length % 3) - (b.length % 3));
  const [pool, setPool] = useState<string[]>(shuffled);
  const [slots, setSlots] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const place = (f: string) => {
    sfx.key();
    setPool((p) => p.filter((x) => x !== f));
    setSlots((s) => {
      const next = [...s, f];
      if (next.length === item.fragments.length) {
        const ok = next.join(" ") === item.fragments.join(" ");
        window.setTimeout(() => {
          if (ok) {
            sfx.unlock();
            if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
            setDone(true);
            if (item.evidenceId) collect(item.evidenceId);
            onDone();
          } else {
            sfx.error();
            pushToast("Reconstrução falhou", "Os setores não casaram. Reordene os fragmentos.");
            setPool(shuffled);
            setSlots([]);
          }
        }, 250);
      }
      return next;
    });
  };

  if (done) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3.5">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-300 mb-1.5">
          <Check className="w-3.5 h-3.5" /> arquivo restaurado
        </div>
        <p className="text-[12.5px] text-neutral-100 leading-snug">{item.recovered}</p>
        {item.evidenceId && (
          <div className="mt-2">
            <PinButton evidenceId={item.evidenceId} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-3.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#c9a86a] mb-2">
        <ScanLine className="w-3.5 h-3.5 animate-pulse" /> remontar setores na ordem correta
      </div>
      <div className="min-h-[52px] rounded-md border border-dashed border-white/15 bg-black/40 p-2 mb-2.5 text-[12.5px] text-neutral-100 leading-snug">
        {slots.length === 0 ? (
          <span className="text-neutral-500">toque nos fragmentos abaixo…</span>
        ) : (
          slots.join(" ")
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pool.map((f) => (
          <button
            key={f}
            onClick={() => place(f)}
            className="rounded-md border border-[#c9a86a]/40 bg-[#c9a86a]/5 px-2.5 py-1.5 text-[11.5px] text-neutral-200 hover:bg-[#c9a86a]/15"
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

const ICON = { foto: ImgIcon, mensagem: FileText, documento: FileText, audio: Mic };

export default function SettingsApp() {
  const caseData = useCase();
  const { cloudUnlocked, evidence } = useGame();
  const items = trashFor(caseData);
  const [active, setActive] = useState<string | null>(null);
  const [recovered, setRecovered] = useState<string[]>([]);

  return (
    <AppShell title="Ajustes">
      <div className="p-3 space-y-4">
        <section className="rounded-xl bg-[#141418] border border-white/10 overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-[#c9a86a]" />
            <span className="text-[12.5px] font-semibold">Lixeira forense</span>
            <span className="ml-auto text-[10px] text-neutral-400">
              {recovered.length}/{items.length} restaurados
            </span>
          </div>
          <div className="p-3 space-y-2.5">
            <p className="text-[11.5px] text-neutral-400 leading-snug">
              Setores marcados como livres ainda contêm dados. Remonte os fragmentos para
              recuperar cada arquivo.
            </p>
            {items.map((it) => {
              const Icon = ICON[it.type] ?? FileText;
              const isOpen = active === it.id;
              const ok = recovered.includes(it.id);
              return (
                <div key={it.id}>
                  <button
                    onClick={() => {
                      sfx.tap();
                      setActive(isOpen ? null : it.id);
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 border text-left transition-colors ${
                      ok
                        ? "border-emerald-500/30 bg-emerald-950/15"
                        : "border-white/10 bg-black/30 hover:border-white/25"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${ok ? "text-emerald-400" : "text-neutral-400"}`} />
                    <span className="flex-1 text-[12.5px] truncate">{it.label}</span>
                    {ok ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-[#c9a86a] shrink-0">
                        restaurar
                      </span>
                    )}
                  </button>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-2">
                      <Recovery
                        item={it}
                        onDone={() => setRecovered((r) => (r.includes(it.id) ? r : [...r, it.id]))}
                      />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl bg-[#141418] border border-white/10 overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center gap-2">
            <CloudDownload className="w-4 h-4 text-[#c9a86a]" />
            <span className="text-[12.5px] font-semibold">Backup em nuvem</span>
          </div>
          <div className="p-3.5">
            {cloudUnlocked ? (
              <p className="text-[12.5px] text-emerald-300 leading-snug">
                Backup de <b>{caseData.cloud.owner}</b> quebrado pela perícia. Os itens
                recuperados estão no seu dossiê, aba Provas.
              </p>
            ) : (
              <p className="text-[12.5px] text-neutral-400 leading-snug">
                A quebra do backup em nuvem exige mais material probatório.{" "}
                <span className="text-[#c9a86a]">
                  Faltam {Math.max(0, 6 - evidence.length)} prova(s).
                </span>
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl bg-[#141418] border border-white/10 p-3.5">
          <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
            Sobre o dispositivo
          </div>
          {[
            ["Titular", caseData.victim.name],
            ["Caso", `nº ${caseData.no}`],
            ["Extração", "lógica + sistema de arquivos"],
            ["Estado", "somente leitura (lacrado)"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 text-[12px] py-0.5">
              <span className="text-neutral-400">{k}</span>
              <span className="text-neutral-200 text-right">{v}</span>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
