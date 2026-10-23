"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, X, Link2, Unlink, Trash2, Info } from "lucide-react";
import { useCase, useGame } from "./context";
import { sfx } from "@/lib/audio";

type Node = { id: string; kind: "suspect" | "evidence"; label: string; sub: string; x: number; y: number; img?: string };
type Wire = { a: string; b: string };

const W = 1000;
const H = 620;

export default function Mural() {
  const caseData = useCase();
  const { evidence } = useGame();
  const [open, setOpen] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [linkFrom, setLinkFrom] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const key = `caso2471_mural_${caseData.id}`;

  /* carrega e sincroniza nós com as provas atuais */
  useEffect(() => {
    let saved: { nodes: Node[]; wires: Wire[] } = { nodes: [], wires: [] };
    try {
      const raw = localStorage.getItem(key);
      if (raw) saved = JSON.parse(raw);
    } catch {
      /* ignore */
    }

    const base: Node[] = caseData.suspects.map((s, i) => ({
      id: `s-${s.id}`,
      kind: "suspect",
      label: s.name,
      sub: s.role,
      img: s.avatar,
      x: 90 + i * 300,
      y: 60,
    }));

    const evNodes: Node[] = evidence.map((id, i) => {
      const e = caseData.evidence[id];
      return {
        id: `e-${id}`,
        kind: "evidence" as const,
        label: e?.title ?? id,
        sub: e?.source ?? "",
        x: 70 + (i % 4) * 230,
        y: 300 + Math.floor(i / 4) * 130,
      };
    });

    const merged = [...base, ...evNodes].map((n) => {
      const prev = saved.nodes?.find((p) => p.id === n.id);
      return prev ? { ...n, x: prev.x, y: prev.y } : n;
    });

    setNodes(merged);
    setWires((saved.wires ?? []).filter((w) => merged.some((n) => n.id === w.a) && merged.some((n) => n.id === w.b)));
  }, [open, evidence, caseData, key]);

  const persist = (n: Node[], w: Wire[]) =>
    localStorage.setItem(key, JSON.stringify({ nodes: n, wires: w }));

  const toggleLink = (id: string) => {
    if (!linkFrom) {
      setLinkFrom(id);
      sfx.tap();
      return;
    }
    if (linkFrom === id) {
      setLinkFrom(null);
      return;
    }
    const exists = wires.find(
      (w) => (w.a === linkFrom && w.b === id) || (w.a === id && w.b === linkFrom)
    );
    const next = exists
      ? wires.filter((w) => w !== exists)
      : [...wires, { a: linkFrom, b: id }];
    setWires(next);
    persist(nodes, next);
    sfx.evidence();
    setLinkFrom(null);
  };

  const pos = (id: string) => nodes.find((n) => n.id === id);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          sfx.tap();
        }}
        title="Mural do Caso"
        className="fixed bottom-36 right-4 lg:bottom-[5.5rem] lg:right-5 z-[72] w-12 h-12 rounded-full bg-[#171512] border border-[#c9a86a]/50 text-[#c9a86a] shadow-xl flex items-center justify-center active:scale-90 transition-transform hover:bg-[#1f1c16]"
      >
        <Network className="w-5 h-5" />
        {wires.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#8f1f1f] text-white text-[10px] font-bold flex items-center justify-center">
            {wires.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[84] bg-[#0a0908]/97 backdrop-blur-sm flex flex-col"
          >
            <header className="h-14 shrink-0 px-4 flex items-center gap-2 border-b border-[#c9a86a]/20">
              <Network className="w-4 h-4 text-[#c9a86a]" />
              <span className="redacted text-[11px] tracking-[0.25em] uppercase text-[#c9a86a]">
                Mural do Caso nº {caseData.no}
              </span>
              <span className="hidden sm:flex items-center gap-1.5 ml-3 text-[11px] text-neutral-400">
                <Info className="w-3.5 h-3.5" />
                {linkFrom ? "Agora toque no outro cartão para ligar o fio" : "Toque em 🔗 e depois em outro cartão para conectar"}
              </span>
              {wires.length > 0 && (
                <button
                  onClick={() => {
                    setWires([]);
                    persist(nodes, []);
                    sfx.tap();
                  }}
                  className="ml-auto flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-red-400 border border-white/10 rounded-full px-2.5 py-1"
                >
                  <Trash2 className="w-3 h-3" /> limpar fios
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className={`${wires.length > 0 ? "" : "ml-auto"} w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white`}
                aria-label="Fechar mural"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <div className="flex-1 overflow-auto nice-scroll p-4">
              <div
                ref={boardRef}
                className="relative mx-auto rounded-lg"
                style={{
                  width: W,
                  height: H,
                  backgroundImage:
                    "url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.15\'/%3E%3C/svg%3E'), radial-gradient(ellipse at center, #3e3222 0%, #1f1810 100%)",
                  boxShadow: "inset 0 0 120px rgba(0,0,0,0.9)",
                  border: "8px solid #14110a",
                  borderRadius: "4px"
                }}
              >
                <svg className="absolute inset-0 pointer-events-none" width={W} height={H}>
                  {wires.map((w, i) => {
                    const a = pos(w.a);
                    const b = pos(w.b);
                    if (!a || !b) return null;
                    const ax = a.x + 85;
                    const ay = a.y + 45;
                    const bx = b.x + 85;
                    const by = b.y + 45;
                    const sag = Math.abs(bx - ax) * 0.18 + 22;
                    return (
                      <path
                        key={i}
                        d={`M ${ax} ${ay} Q ${(ax + bx) / 2} ${(ay + by) / 2 + sag} ${bx} ${by}`}
                        stroke="#cc3333"
                        strokeWidth={3}
                        fill="none"
                        opacity={0.85}
                      />
                    );
                  })}
                </svg>

                {nodes.map((n) => (
                  <motion.div
                    key={n.id}
                    drag
                    dragMomentum={false}
                    dragConstraints={boardRef}
                    onDragEnd={(_, info) => {
                      const next = nodes.map((x) =>
                        x.id === n.id
                          ? { ...x, x: Math.max(0, x.x + info.offset.x), y: Math.max(0, x.y + info.offset.y) }
                          : x
                      );
                      setNodes(next);
                      persist(next, wires);
                    }}
                    style={{ left: n.x, top: n.y }}
                    className={`absolute w-[170px] cursor-grab active:cursor-grabbing rounded-sm p-2.5 shadow-xl ${
                      n.kind === "suspect"
                        ? "bg-[#1d1a14] border border-[#c9a86a]/40"
                        : "bg-[#17150f] border border-white/15"
                    } ${linkFrom === n.id ? "ring-2 ring-[#8f1f1f]" : ""}`}
                  >
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-b from-red-500 to-red-800 border border-red-900 shadow" />
                    {n.kind === "suspect" && n.img && (
                      <img src={n.img} alt="" className="w-full h-16 object-cover rounded-sm mb-1.5 grayscale-[30%]" />
                    )}
                    <div className="text-[11.5px] font-semibold text-white leading-tight">{n.label}</div>
                    <div className="text-[9.5px] uppercase tracking-wider text-neutral-400 mt-0.5 leading-tight">
                      {n.sub}
                    </div>
                    <button
                      onClick={() => toggleLink(n.id)}
                      className={`mt-1.5 w-full rounded border text-[9.5px] uppercase tracking-wider py-1 flex items-center justify-center gap-1 ${
                        linkFrom === n.id
                          ? "border-[#8f1f1f] text-[#ff8f8f] bg-[#8f1f1f]/20"
                          : "border-white/15 text-neutral-400 hover:text-[#c9a86a] hover:border-[#c9a86a]/40"
                      }`}
                    >
                      {linkFrom === n.id ? <Unlink className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
                      {linkFrom === n.id ? "ligando…" : "conectar"}
                    </button>
                  </motion.div>
                ))}

                {nodes.length <= caseData.suspects.length && (
                  <div className="absolute inset-x-0 bottom-10 text-center text-[12.5px] text-neutral-400 px-10">
                    Anexe provas no celular — elas aparecem aqui automaticamente para você conectar
                    aos suspeitos.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
