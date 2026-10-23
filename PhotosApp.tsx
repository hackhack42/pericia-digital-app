"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info, Satellite } from "lucide-react";
import AppShell, { PinButton } from "../AppShell";
import { useCase } from "@/components/game/context";
import { exifFor } from "@/game/derive";
import { sfx } from "@/lib/audio";
import type { Photo } from "@/game/types";

/** Print forense do PIX — renderizado como documento. */
function PixScreenshot() {
  return (
    <div className="w-full max-w-[300px] mx-auto rounded-2xl bg-[#0f2318] border border-[#32c76b]/30 p-5 text-left shadow-2xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#32c76b] flex items-center justify-center text-black font-black text-xs">PIX</div>
        <div>
          <div className="text-[13px] font-semibold text-[#d9ffe8]">Comprovante de transferência</div>
          <div className="text-[10px] text-[#8fd9ac]">Banco Meridional · conta PJ 0042-1</div>
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-3 tracking-tight">R$ 48.000,00</div>
      <div className="space-y-2 text-[12px]">
        <div className="flex justify-between gap-3">
          <span className="text-[#8fd9ac]">De</span>
          <span className="text-[#eafff2] text-right">ESTÚDIO MD FOTOGRAFIA LTDA</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-[#8fd9ac]">Para</span>
          <span className="text-[#eafff2] text-right font-semibold">CAMILA SANTOS · CPF •••.448.•••-••</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-[#8fd9ac]">Data</span>
          <span className="text-[#eafff2]">12/09 · 15:02</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-[#8fd9ac]">Descrição</span>
          <span className="text-[#eafff2]">(vazio)</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#32c76b]/20 text-[10px] text-[#8fd9ac] font-mono">
        ID E00441***20240912150***MD48K
      </div>
    </div>
  );
}

export default function PhotosApp() {
  const caseData = useCase();
  const [open, setOpen] = useState<Photo | null>(null);
  const [exifOpen, setExifOpen] = useState(false);
  const visible = caseData.photos.filter((p) => !p.hidden);

  if (open) {
    return (
      <AppShell
        title={open.date}
        onBack={() => {
          setOpen(null);
          setExifOpen(false);
        }}
        right={
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sfx.tap();
                setExifOpen((v) => !v);
              }}
              title="Metadados EXIF"
              className={`w-7 h-7 rounded-full border flex items-center justify-center ${
                exifOpen ? "border-[#c9a86a] text-[#c9a86a] bg-[#c9a86a]/10" : "border-white/20 text-neutral-300"
              }`}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            {open.evidenceId ? <PinButton evidenceId={open.evidenceId} /> : null}
          </div>
        }
        headerBlack
      >
        <div className="p-4">
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden bg-black border border-white/10"
          >
            {open.kind === "pix" ? (
              <div className="py-8 px-4 bg-[#0a0f0c]">
                <PixScreenshot />
              </div>
            ) : (
              <img src={open.url} alt={open.caption} className="w-full h-auto object-cover max-h-[420px]" />
            )}
          </motion.div>
          <div className="mt-4 space-y-1 px-1">
            {open.caption !== "—" && (
              <div className="text-[15px] text-neutral-200">{open.caption}</div>
            )}
            <div className="flex items-center gap-1.5 text-[12px] text-neutral-400">
              <MapPin className="w-3.5 h-3.5" /> {open.location}
            </div>
            <div className="text-[12px] text-neutral-400">{open.date}</div>
            {exifOpen && (() => {
              const ex = exifFor(caseData, open, 0);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-lg border border-[#c9a86a]/30 bg-black/40 p-3"
                >
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#c9a86a] mb-2">
                    <Satellite className="w-3 h-3" /> Metadados EXIF
                  </div>
                  {[
                    ["Câmera", ex.camera],
                    ["Lente", ex.lens ?? "—"],
                    ["ISO", ex.iso ?? "—"],
                    ["Capturada em", ex.taken],
                    ["Local", ex.gps ?? "—"],
                    ["Coordenadas GPS", ex.coords ?? "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 text-[12px] py-0.5">
                      <span className="text-neutral-400">{k}</span>
                      <span className="text-neutral-200 text-right font-mono text-[11.5px]">{v}</span>
                    </div>
                  ))}
                  {ex.note && <p className="text-[11.5px] text-[#c9a86a] pt-2 leading-snug">{ex.note}</p>}
                </motion.div>
              );
            })()}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Fotos">
      <div className="px-4 py-2 flex gap-4 text-[13px] border-b border-white/5">
        <span className="text-neutral-400">Anos</span>
        <span className="text-neutral-400">Meses</span>
        <span className="text-white font-semibold border-b-2 border-white pb-1">Todas</span>
      </div>
      <div className="grid grid-cols-3 gap-[3px] p-[3px]">
        {visible.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => {
              sfx.tap();
              setOpen(p);
            }}
            className="relative aspect-square overflow-hidden bg-[#16161a] group"
          >
            {p.kind === "pix" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0f2318]">
                <div className="text-center">
                  <div className="text-[#32c76b] font-black text-lg">R$</div>
                  <div className="text-[9px] text-[#8fd9ac] px-2 font-mono">PIX · 48.000,00</div>
                </div>
              </div>
            ) : (
              <img src={p.url} alt={p.caption} className="w-full h-full object-cover group-active:opacity-70" />
            )}
            {p.evidenceId && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#c9a86a] shadow" />
            )}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>{null}</AnimatePresence>
      <p className="px-4 py-3 text-[11px] text-neutral-400">{visible.length} itens visíveis · pode haver arquivos ocultos no aparelho</p>
    </AppShell>
  );
}
