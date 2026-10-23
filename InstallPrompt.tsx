"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MonitorSmartphone, X } from "lucide-react";
import { sfx } from "@/lib/audio";

type DeferredPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "caso2471_install_dismissed";

declare global {
  interface Window {
    deferredInstallPrompt?: DeferredPromptEvent | null;
  }
}

export default function InstallPrompt() {
  const [hasPrompt, setHasPrompt] = useState(false);
  const [banner, setBanner] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    let interval: number | undefined;
    const dismissed = localStorage.getItem(DISMISS_KEY) === "1";

    const check = () => {
      const has = !!window.deferredInstallPrompt;
      setHasPrompt(has);
      if (has && !dismissed) timer = window.setTimeout(() => setBanner(true), 4000);
      if (has && interval) window.clearInterval(interval);
    };

    const onPrompt = (e: Event) => {
      e.preventDefault?.();
      window.deferredInstallPrompt = e as DeferredPromptEvent;
      check();
    };

    const onInstalled = () => {
      setHasPrompt(false);
      setBanner(false);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    interval = window.setInterval(check, 2000);
    timer = window.setTimeout(check, 1500);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (interval) window.clearInterval(interval);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (banner) {
      const t = window.setTimeout(() => setBanner(false), 9000);
      return () => window.clearTimeout(t);
    }
  }, [banner]);

  const install = async () => {
    const p = window.deferredInstallPrompt;
    if (!p) {
      // ensina o caminho manual quando o evento não está disponível
      alert(
        "Para instalar: no Chrome do Android, toque no menu ⋮ → \"Adicionar à tela inicial\".\nNo iOS, toque em Compartilhar → \"Adicionar à Tela de Início\"."
      );
      return;
    }
    sfx.unlock();
    await p.prompt();
    const choice = await p.userChoice;
    if (choice.outcome === "accepted") {
      setBanner(false);
      window.deferredInstallPrompt = null;
    }
  };

  const dismiss = () => {
    setBanner(false);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  return (
    <>
      {hasPrompt && (
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 ml-1.5 align-middle" title="Instalável no dispositivo" />
      )}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="fixed bottom-4 left-4 z-[75] w-[300px] rounded-xl border border-[#c9a86a]/40 bg-[#171512] shadow-2xl p-4"
          >
            <button
              onClick={dismiss}
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full border border-white/15 text-neutral-400 hover:text-white flex items-center justify-center"
              aria-label="Fechar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-2.5 mb-2">
              <MonitorSmartphone className="w-5 h-5 text-[#c9a86a]" />
              <span className="text-[13px] font-semibold text-white leading-tight">
                Instalar a bancada de perícia
              </span>
            </div>
            <p className="text-[12px] text-neutral-300 leading-snug mb-3">
              Leve o arquivo de casos na sua tela inicial, como um app. Funciona em tela cheia, sem
              barra de navegador.
            </p>
            <button
              onClick={install}
              className="w-full rounded-lg bg-[#c9a86a] hover:bg-[#d9bc82] text-black py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors"
            >
              Instalar no dispositivo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
