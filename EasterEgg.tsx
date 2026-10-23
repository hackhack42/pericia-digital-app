"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Sparkles } from "lucide-react";
import type { EasterEgg } from "@/game/easter";
import { checkDate, checkKonami, checkMatricula } from "@/game/easter";
import { useAuth } from "@/components/auth/AuthContext";
import { sfx } from "@/lib/audio";

type Props = { onEgg?: (egg: EasterEgg) => void };

export function useEasterEggDetector(onEgg: (egg: EasterEgg) => void) {
  const { agent } = useAuth();
  const fired = useRef(new Set<string>());

  useEffect(() => {
    // Checa data (ex.: aniversário da Júlia)
    const dateEgg = checkDate();
    if (dateEgg && !fired.current.has(dateEgg.id)) {
      fired.current.add(dateEgg.id);
      setTimeout(() => onEgg(dateEgg), 3000);
    }

    // Checa matrícula admin
    if (agent?.matricula) {
      const matEgg = checkMatricula(agent.matricula);
      if (matEgg && !fired.current.has(matEgg.id)) {
        fired.current.add(matEgg.id);
        setTimeout(() => onEgg(matEgg), 2000);
      }
    }

    // Konami code listener
    const onKey = (e: KeyboardEvent) => {
      if (checkKonami(e.key) && !fired.current.has("konami")) {
        import("@/game/easter").then(({ EASTER_EGGS }) => {
          const egg = EASTER_EGGS.find((x) => x.id === "konami");
          if (egg) { fired.current.add("konami"); onEgg(egg); }
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [agent?.matricula, onEgg]);
}

function Confetti({ count = 60 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#c9a86a", "#ff6b9d", "#6ee7b7", "#60a5fa", "#f59e0b", "#a78bfa"][i % 6],
    delay: Math.random() * 1.2,
    duration: 2 + Math.random() * 2,
    rotate: Math.random() * 720,
    size: 6 + Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[99] overflow-hidden">
      {items.map((p) => (
        <motion.div key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{ position: "absolute", top: 0, width: p.size, height: p.size, borderRadius: Math.random() > 0.5 ? "50%" : "2px", background: p.color }}
        />
      ))}
    </div>
  );
}

function Hearts() {
  const items = Array.from({ length: 20 }, (_, i) => ({
    id: i, x: 10 + Math.random() * 80, delay: Math.random() * 2, size: 16 + Math.random() * 24,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-[99] overflow-hidden">
      {items.map((h) => (
        <motion.div key={h.id}
          initial={{ y: "110vh", x: `${h.x}vw`, opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3 + Math.random(), delay: h.delay, ease: "easeOut" }}
          style={{ position: "absolute", bottom: 0 }}>
          <Heart style={{ width: h.size, height: h.size, color: "#ff6b9d", fill: "#ff6b9d" }} />
        </motion.div>
      ))}
    </div>
  );
}

function RainbowOverlay() {
  return (
    <motion.div className="fixed inset-0 pointer-events-none z-[98]"
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 3, repeat: 5 }}
      style={{
        background: "linear-gradient(135deg,#ff6b9d44,#c9a86a44,#6ee7b744,#60a5fa44,#a78bfa44)",
        backgroundSize: "400% 400%",
      }} />
  );
}

export default function EasterEggDisplay({ egg, onClose }: { egg: EasterEgg | null; onClose: () => void }) {
  useEffect(() => {
    if (!egg) return;
    sfx.solved();
    const t = setTimeout(onClose, 12000);
    return () => clearTimeout(t);
  }, [egg, onClose]);

  return (
    <>
      {egg?.effect === "confetti" && <Confetti />}
      {egg?.effect === "love" && <Hearts />}
      {egg?.effect === "rainbow" && <RainbowOverlay />}

      <AnimatePresence>
        {egg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="fixed inset-0 z-[98] flex items-center justify-center p-6"
            onClick={onClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              animate={egg.effect === "shake" ? { x: [-4, 4, -4, 4, 0] } : egg.effect === "rainbow" ? {} : {}}
              transition={{ duration: 0.4 }}
              className="pointer-events-auto relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: egg.effect === "love"
                  ? "linear-gradient(135deg,#1a0812,#2a1020)"
                  : "linear-gradient(135deg,#17150f,#0f0d09)",
                border: `1px solid ${egg.effect === "love" ? "#ff6b9d55" : egg.effect === "rainbow" ? "#c9a86a55" : "#c9a86a33"}`,
              }}
            >
              <div className="p-5">
                <button onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#c9a86a] mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> easter egg desbloqueado
                </div>

                <h3 className="font-elite text-xl text-white leading-tight mb-3">{egg.title}</h3>
                <p className="text-[13.5px] text-neutral-200 leading-relaxed">{egg.message}</p>

                {egg.effect === "love" && (
                  <div className="flex justify-center mt-3">
                    <Heart className="w-8 h-8 text-pink-400 fill-pink-400 animate-pulse" />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
