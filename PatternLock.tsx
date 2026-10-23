"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { sfx } from "@/lib/audio";

/** Grid 3x3 — índices 0..8. Desenho por mouse/toque, com rastro SVG. */
export default function PatternLock({
  expected,
  onSuccess,
  onFail,
  size = 250,
}: {
  expected: number[];
  onSuccess: () => void;
  onFail: () => void;
  size?: number;
}) {
  const [path, setPath] = useState<number[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const ref = useRef<SVGSVGElement>(null);
  const drawing = useRef(false);

  const pad = size * 0.16;
  const step = (size - pad * 2) / 2;
  const pos = (i: number) => ({
    x: pad + (i % 3) * step,
    y: pad + Math.floor(i / 3) * step,
  });

  const nodeAt = (x: number, y: number) => {
    for (let i = 0; i < 9; i++) {
      const p = pos(i);
      if (Math.hypot(p.x - x, p.y - y) < size * 0.09) return i;
    }
    return -1;
  };

  const local = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return {
      x: ((e.clientX - r.left) / r.width) * size,
      y: ((e.clientY - r.top) / r.height) * size,
    };
  };

  const finish = useCallback(() => {
    drawing.current = false;
    setCursor(null);
    if (path.length < 3) {
      setPath([]);
      return;
    }
    const ok = path.length === expected.length && path.every((v, i) => v === expected[i]);
    if (ok) {
      setStatus("ok");
      sfx.unlock();
      window.setTimeout(onSuccess, 420);
    } else {
      setStatus("err");
      sfx.error();
      if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
      onFail();
      window.setTimeout(() => {
        setPath([]);
        setStatus("idle");
      }, 650);
    }
  }, [path, expected, onSuccess, onFail]);

  const color = status === "ok" ? "#30d158" : status === "err" ? "#ff453a" : "#c9a86a";

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={`touch-none select-none ${status === "err" ? "animate-shake" : ""}`}
      onPointerDown={(e) => {
        if (status !== "idle") return;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        drawing.current = true;
        const { x, y } = local(e);
        const n = nodeAt(x, y);
        if (n >= 0) {
          setPath([n]);
          sfx.key();
        }
        setCursor({ x, y });
      }}
      onPointerMove={(e) => {
        if (!drawing.current || status !== "idle") return;
        const { x, y } = local(e);
        setCursor({ x, y });
        const n = nodeAt(x, y);
        if (n >= 0 && !path.includes(n)) {
          setPath((p) => [...p, n]);
          sfx.key();
          if (navigator.vibrate) navigator.vibrate(12);
        }
      }}
      onPointerUp={finish}
      onPointerLeave={() => drawing.current && finish()}
      role="application"
      aria-label="Padrão de desbloqueio"
    >
      {/* linhas do traçado */}
      {path.map((n, i) => {
        if (i === 0) return null;
        const a = pos(path[i - 1]);
        const b = pos(n);
        return (
          <line
            key={`l${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })}
      {/* linha até o cursor */}
      {cursor && path.length > 0 && status === "idle" && (
        <line
          x1={pos(path[path.length - 1]).x}
          y1={pos(path[path.length - 1]).y}
          x2={cursor.x}
          y2={cursor.y}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.45}
        />
      )}
      {/* nós */}
      {Array.from({ length: 9 }).map((_, i) => {
        const p = pos(i);
        const on = path.includes(i);
        return (
          <g key={i}>
            {on && (
              <motion.circle
                initial={{ r: 4, opacity: 0.8 }}
                animate={{ r: size * 0.055, opacity: 0.18 }}
                cx={p.x}
                cy={p.y}
                fill={color}
              />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={size * 0.028}
              fill={on ? color : "rgba(255,255,255,0.25)"}
              stroke={on ? color : "rgba(255,255,255,0.35)"}
              strokeWidth={1.5}
            />
          </g>
        );
      })}
    </svg>
  );
}
