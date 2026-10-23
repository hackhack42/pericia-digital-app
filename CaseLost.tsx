"use client";

import { motion } from "framer-motion";
import { Skull, RotateCcw, LibraryBig } from "lucide-react";
import { useCase } from "./context";

export default function CaseLost({
  onRestart,
  onCases,
}: {
  onRestart: () => void;
  onCases: () => void;
}) {
  const caseData = useCase();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[88] bg-black/90 backdrop-blur-md overflow-y-auto nice-scroll"
    >
      <div className="min-h-full flex items-center justify-center p-5">
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="w-full max-w-lg rounded-xl border border-red-500/40 bg-[#140a0a] p-6 md:p-9 relative"
        >
          <motion.div
            initial={{ scale: 2, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: -7, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 180, damping: 14 }}
            className="absolute -top-5 right-6 border-4 border-red-600/80 text-red-500 font-elite text-lg md:text-xl tracking-[0.25em] uppercase px-4 py-2"
          >
            CASO PERDIDO
          </motion.div>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-red-400/70 mb-5">
            <Skull className="w-4 h-4" /> disfarce queimado · caso nº {caseData.no}
          </div>

          <h2 className="font-elite text-2xl md:text-3xl text-white leading-tight mb-5">
            Você escreveu uma frase que a vítima jamais escreveria.
          </h2>

          <div className="space-y-3 text-[14px] leading-relaxed text-neutral-300">
            <p>
              Do outro lado, a dúvida virou certeza em dois segundos. O telefone foi desligado, o
              advogado foi chamado e toda a vantagem da CBI — a de que ninguém sabia da morte —
              evaporou numa única mensagem.
            </p>
            <p className="border-l-2 border-[#c9a86a]/60 pl-4 text-[#e9d9b8] italic">
              Jane: “Eu avisei: no disfarce, a gente não pergunta o que a vítima já sabia, não
              ameaça, não se identifica e nunca, jamais, fala da morte. Uma frase. Foi só uma
              frase.”
            </p>
            <p>
              O inquérito segue sem a confissão — e, sem ela, esse assassino não é preso. Recomece
              o caso do zero e faça diferente.
            </p>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRestart}
              className="flex-1 rounded-lg bg-[#8f1f1f] hover:bg-[#a52424] py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Recomeçar este caso
            </button>
            <button
              onClick={onCases}
              className="flex-1 rounded-lg border border-white/20 text-neutral-300 hover:bg-white/5 py-3.5 text-[12px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <LibraryBig className="w-4 h-4" /> Escolher outro caso
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
