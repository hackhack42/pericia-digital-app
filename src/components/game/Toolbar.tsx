"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Type,
  Settings2,
  Download,
  Upload,
  UserCog,
  Check,
} from "lucide-react";
import { isMuted, setMuted, sfx, initAudio, startHum, stopHum } from "@/lib/audio";
import { useAuth } from "@/components/auth/AuthContext";
import { LogOut, RefreshCw } from "lucide-react";

const FONT_KEY = "caso2471_fonte";
const SIZES = [
  { id: "sm", label: "A", scale: 1, name: "Padrão" },
  { id: "md", label: "A", scale: 1.12, name: "Grande" },
  { id: "lg", label: "A", scale: 1.25, name: "Máximo" },
];

export default function Toolbar({
  onExport,
  onImport,
  onProfile,
  onFeedback,
}: {
  onExport: () => void;
  onImport: (file: File) => void;
  onProfile: () => void;
  onFeedback?: () => void;
}) {
  const { agent, logout, syncCareer } = useAuth();
  const [syncing, setSyncing] = React.useState(false);

  const sync = async () => {
    setSyncing(true);
    await syncCareer();
    sfx.evidence();
    setSyncing(false);
  };
  const [fs, setFs] = useState(false);
  const [mute, setMute] = useState(false);
  const [size, setSize] = useState("sm");
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initAudio();
    setMute(isMuted());
    const s = localStorage.getItem(FONT_KEY) ?? "sm";
    setSize(s);
    applyFont(s);
    if (!isMuted()) startHum();
    const onFs = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault();
        toggleFs();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const applyFont = (id: string) => {
    const s = SIZES.find((x) => x.id === id) ?? SIZES[0];
    document.documentElement.style.fontSize = `${16 * s.scale}px`;
  };

  const [fsMsg, setFsMsg] = useState("");

  const toggleFs = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      setFsMsg("");
    } catch {
      // navegador/iframe bloqueou: orienta o usuário
      setFsMsg("Tela cheia bloqueada aqui. Use F11 no computador.");
      window.setTimeout(() => setFsMsg(""), 3500);
    }
  };

  const toggleMute = () => {
    const v = !mute;
    setMute(v);
    setMuted(v);
    if (v) stopHum();
    else {
      startHum();
      sfx.tap();
    }
  };

  const changeFont = (id: string) => {
    setSize(id);
    localStorage.setItem(FONT_KEY, id);
    applyFont(id);
    sfx.tap();
  };

  const Btn = ({
    onClick,
    title,
    children,
    active,
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    active?: boolean;
  }) => (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`w-10 h-10 sm:w-9 sm:h-9 rounded-lg border flex items-center justify-center transition-all active:scale-90 ${
        active
          ? "border-[#c9a86a]/70 text-[#c9a86a] bg-[#c9a86a]/15"
          : "border-white/20 text-neutral-200 bg-black/50 hover:text-white hover:border-[#c9a86a]/60 hover:bg-[#c9a86a]/10"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-1.5 relative z-[85]">
      <Btn onClick={toggleMute} title={mute ? "Ativar som" : "Silenciar"} active={!mute}>
        {mute ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
      </Btn>
      <Btn onClick={toggleFs} title="Modo imersivo (F11)" active={fs}>
        {fs ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </Btn>
      <Btn onClick={() => setOpen((v) => !v)} title="Preferências" active={open}>
        <Settings2 className="w-4 h-4" />
      </Btn>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[86]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              className="absolute right-0 top-12 z-[87] w-72 rounded-xl border border-[#c9a86a]/30 bg-[#12110e] shadow-2xl p-3.5 space-y-3.5"
            >
              <div>
                <div className="text-[9.5px] uppercase tracking-widest text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5" /> Tamanho do texto
                </div>
                <div className="flex gap-1.5">
                  {SIZES.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => changeFont(s.id)}
                      className={`flex-1 rounded-md border py-1.5 transition-colors ${
                        size === s.id
                          ? "border-[#c9a86a] bg-[#c9a86a]/10 text-[#c9a86a]"
                          : "border-white/10 text-neutral-400 hover:border-white/30"
                      }`}
                      style={{ fontSize: `${11 + i * 3}px` }}
                      title={s.name}
                    >
                      {s.label}
                      {size === s.id && <Check className="w-3 h-3 inline ml-1 -mt-0.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 space-y-1.5">
                <button
                  onClick={() => {
                    onExport();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-[12.5px] text-neutral-300 hover:bg-white/5"
                >
                  <Download className="w-4 h-4 text-[#c9a86a]" /> Exportar progresso (.json)
                </button>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-[12.5px] text-neutral-300 hover:bg-white/5"
                >
                  <Upload className="w-4 h-4 text-[#c9a86a]" /> Importar progresso
                </button>
                <button
                  onClick={() => {
                    onProfile();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-[12.5px] text-neutral-300 hover:bg-white/5"
                >
                  <UserCog className="w-4 h-4 text-[#c9a86a]" /> Perfil do agente
                </button>
                <button
                  onClick={() => { onFeedback?.(); setOpen(false); }}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-[12.5px] text-neutral-300 hover:bg-white/5"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-[#c9a86a]">💬</span> Enviar feedback
                </button>
                {agent && (
                  <>
                    <button
                      onClick={() => { sync(); setOpen(false); }}
                      disabled={syncing}
                      className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-[12.5px] text-neutral-300 hover:bg-white/5 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 text-[#c9a86a] ${syncing ? "animate-spin" : ""}`} />
                      {syncing ? "Sincronizando…" : `Sincronizar carreira`}
                    </button>
                    <div className="border-t border-white/10 my-1" />
                    <button
                      onClick={() => { logout(); setOpen(false); }}
                      className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-[12.5px] text-red-300 hover:bg-red-950/30"
                    >
                      <LogOut className="w-4 h-4" /> Sair ({agent.matricula})
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {fsMsg && (
        <div className="absolute right-0 top-12 z-[88] w-56 rounded-lg border border-amber-500/40 bg-[#1a1608] px-3 py-2 text-[11.5px] text-amber-200 shadow-xl">
          {fsMsg}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onImport(f);
          e.target.value = "";
          setOpen(false);
        }}
      />
    </div>
  );
}
