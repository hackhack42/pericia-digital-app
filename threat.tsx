"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Plane, Siren, TriangleAlert, Skull, RotateCcw, LibraryBig, Link2Off } from "lucide-react";
import { useGame } from "./context";
import { sfx } from "@/lib/audio";

/* ------------------------------------------------------------------ */
/* Parâmetros                                                          */
/* ------------------------------------------------------------------ */
const TRACE_RATE = 0.26;        // % por segundo (≈ 6,4 min até 100%)
const GRACE_MS = 22_000;        // tempo de paz após desbloquear
const KILL_FIRST_MS = 95_000;   // 1º kill switch
const KILL_EVERY_MS = 165_000;  // intervalo entre kill switches
const KILL_WINDOW_MS = 5_000;   // 5 s para acionar o Modo Avião
const PHISH_FIRST_MS = 68_000;
const PHISH_EVERY_MS = 115_000;

export type Phish = {
  id: number;
  app: string;
  title: string;
  text: string;
  cta: string;
  malicious: boolean;
};

const PHISH_POOL: Omit<Phish, "id">[] = [
  { app: "Operadora", title: "Fatura em atraso", text: "Sua linha será suspensa em 2h. Regularize agora pelo link seguro.", cta: "Regularizar", malicious: true },
  { app: "Sistema", title: "Atualização crítica de segurança", text: "Patch forense v4.21 disponível. Instalar manualmente.", cta: "Instalar", malicious: true },
  { app: "Banco", title: "Acesso suspeito detectado", text: "Confirme sua identidade para manter o extrato liberado.", cta: "Confirmar", malicious: true },
  { app: "iCloud", title: "Backup corrompido", text: "Reautentique a conta para evitar perda dos anexos periciais.", cta: "Reautenticar", malicious: true },
  { app: "CBI · TI", title: "Chave de perícia expirando", text: "Renove a chave de criptografia pelo app VPN do terminal.", cta: "Abrir VPN", malicious: false },
  { app: "Delegacia", title: "Aviso interno", text: "Lembre-se de renovar o túnel seguro a cada 5 minutos.", cta: "Entendido", malicious: false },
];

/* ------------------------------------------------------------------ */
type ThreatCtx = {
  active: boolean;
  trace: number;
  airplane: boolean;
  toggleAirplane: (v?: boolean) => void;
  renewVpn: (server: string) => void;
  server: string;
  lastRenewAgo: number;
  killAlert: { deadline: number } | null;
  glitch: number;        // 0 = limpo, >0 = infectado (segundos restantes)
  wiped: boolean;
  phish: Phish | null;
  answerPhish: (open: boolean) => void;
  resetThreat: () => void;
};

const Ctx = createContext<ThreatCtx | null>(null);

export const SERVERS = [
  "br-sp-forense-01",
  "br-rj-blindado-04",
  "cl-stgo-espelho-02",
  "pt-lis-tunel-07",
  "us-mia-relay-11",
];

export function ThreatProvider({ children }: { children: React.ReactNode }) {
  const { caseData, phoneUnlocked, caseLost, pushToast, evidence } = useGame();

  const highRisk = !!caseData && (caseData.difficulty >= 3 || (caseData.minRank ?? 1) >= 3);
  const active = highRisk && phoneUnlocked && !caseLost;

  const [trace, setTrace] = useState(0);
  const [airplane, setAirplane] = useState(false);
  const [server, setServer] = useState(SERVERS[0]);
  const [lastRenew, setLastRenew] = useState(Date.now());
  const [killAlert, setKillAlert] = useState<{ deadline: number } | null>(null);
  const [glitch, setGlitch] = useState(0);
  const [wiped, setWiped] = useState(false);
  const [phish, setPhish] = useState<Phish | null>(null);
  const [lastRenewAgo, setAgo] = useState(0);

  const startRef = useRef<number>(Date.now());
  const nextKill = useRef<number>(0);
  const nextPhish = useRef<number>(0);
  const phishId = useRef(0);
  const killResolved = useRef(true);

  /* reset ao trocar de caso / bloquear */
  useEffect(() => {
    setTrace(0);
    setAirplane(false);
    setKillAlert(null);
    setGlitch(0);
    setWiped(false);
    setPhish(null);
    setLastRenew(Date.now());
    startRef.current = Date.now();
    nextKill.current = Date.now() + KILL_FIRST_MS;
    nextPhish.current = Date.now() + PHISH_FIRST_MS;
    killResolved.current = true;
  }, [caseData?.id, phoneUnlocked]);

  /* loop principal */
  useEffect(() => {
    if (!active || wiped) return;
    const t = window.setInterval(() => {
      const now = Date.now();
      setAgo(Math.floor((now - lastRenew) / 1000));

      // rastreamento sobe (pausa no modo avião e durante a graça inicial)
      if (!airplane && now - startRef.current > GRACE_MS) {
        setTrace((v) => {
          const next = Math.min(100, v + TRACE_RATE);
          if (v < 70 && next >= 70) {
            sfx.alarm();
            pushToast("RASTREAMENTO EM 70%", "Renove a chave no app VPN antes que localizem este terminal.");
          }
          if (next >= 100) {
            sfx.alarm();
            if (navigator.vibrate) navigator.vibrate([200, 80, 200, 80, 400]);
            setWiped(true);
          }
          return next;
        });
      }

      // glitch decai
      setGlitch((g) => (g > 0 ? g - 1 : 0));

      // kill switch
      if (killAlert) {
        if (now > killAlert.deadline && !killResolved.current) {
          killResolved.current = true;
          setKillAlert(null);
          setTrace((v) => Math.min(100, v + 22));
          setGlitch(6);
          sfx.error();
          pushToast("MEMÓRIA COMPROMETIDA", "Eles apagaram parte do buffer antes de você congelar o aparelho.");
        }
      } else if (!airplane && now > nextKill.current && now - startRef.current > GRACE_MS) {
        killResolved.current = false;
        setKillAlert({ deadline: now + KILL_WINDOW_MS });
        nextKill.current = now + KILL_EVERY_MS;
        sfx.alarm();
        if (navigator.vibrate) navigator.vibrate([90, 50, 90]);
      }

      // phishing
      if (!phish && !killAlert && now > nextPhish.current && now - startRef.current > GRACE_MS) {
        const pick = PHISH_POOL[Math.floor(Math.random() * PHISH_POOL.length)];
        phishId.current += 1;
        setPhish({ ...pick, id: phishId.current });
        nextPhish.current = now + PHISH_EVERY_MS;
        sfx.message();
      }
    }, 1000);
    return () => window.clearInterval(t);
  }, [active, wiped, airplane, killAlert, phish, lastRenew, pushToast]);

  /* dispensa automática do phishing */
  useEffect(() => {
    if (!phish) return;
    const t = window.setTimeout(() => setPhish(null), 14_000);
    return () => window.clearTimeout(t);
  }, [phish]);

  const toggleAirplane = useCallback(
    (v?: boolean) => {
      setAirplane((cur) => {
        const next = v ?? !cur;
        if (next && killAlert && !killResolved.current) {
          killResolved.current = true;
          setKillAlert(null);
          sfx.unlock();
          pushToast("MEMÓRIA CONGELADA", "Modo avião a tempo. As conversas em exclusão foram preservadas.");
        } else {
          sfx.tap();
        }
        return next;
      });
    },
    [killAlert, pushToast]
  );

  const renewVpn = useCallback(
    (srv: string) => {
      setServer(srv);
      setTrace(0);
      setLastRenew(Date.now());
      setGlitch(0);
      sfx.unlock();
      pushToast("Túnel renovado", `Novo nó: ${srv} · rastreamento zerado.`);
    },
    [pushToast]
  );

  const answerPhish = useCallback(
    (open: boolean) => {
      const p = phish;
      setPhish(null);
      if (!p) return;
      if (open && p.malicious) {
        setGlitch(9);
        setTrace((v) => Math.min(100, v + 14));
        sfx.error();
        if (navigator.vibrate) navigator.vibrate([150, 60, 150]);
        pushToast("TERMINAL INFECTADO", "Você abriu um link não verificado. Interface instável e rastreamento acelerado.");
      } else if (open) {
        pushToast("Link verificado", "Era um aviso legítimo da TI. Nenhum dano.");
      } else {
        pushToast("Alerta reportado", "Mensagem encaminhada à TI. Bom reflexo.");
      }
    },
    [phish, pushToast]
  );

  const resetThreat = useCallback(() => {
    setTrace(0);
    setWiped(false);
    setGlitch(0);
    setAirplane(false);
    setKillAlert(null);
    setPhish(null);
    startRef.current = Date.now();
    nextKill.current = Date.now() + KILL_FIRST_MS;
    nextPhish.current = Date.now() + PHISH_FIRST_MS;
  }, []);

  // modo avião derruba a conexão: avisa quando o jogador esquece ligado
  useEffect(() => {
    if (!airplane || !active) return;
    const t = window.setTimeout(
      () => pushToast("Modo avião ativo", "O navegador e as conversas ao vivo estão offline. Desative quando estiver seguro."),
      12_000
    );
    return () => window.clearTimeout(t);
  }, [airplane, active, pushToast]);

  // mais provas = mais interesse do grupo criminoso
  useEffect(() => {
    if (!active || evidence.length === 0) return;
    if (evidence.length % 4 === 0) {
      setTrace((v) => Math.min(100, v + 6));
    }
  }, [evidence.length, active]);

  const value: ThreatCtx = {
    active,
    trace,
    airplane,
    toggleAirplane,
    renewVpn,
    server,
    lastRenewAgo,
    killAlert,
    glitch,
    wiped,
    phish,
    answerPhish,
    resetThreat,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useThreat() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useThreat fora do ThreatProvider");
  return c;
}

/* ------------------------------------------------------------------ */
/* Overlays                                                            */
/* ------------------------------------------------------------------ */
export function KillSwitchOverlay() {
  const { killAlert, toggleAirplane, active } = useThreat();
  const [left, setLeft] = useState(5);

  useEffect(() => {
    if (!killAlert) return;
    const t = window.setInterval(() => {
      setLeft(Math.max(0, Math.ceil((killAlert.deadline - Date.now()) / 1000)));
    }, 100);
    return () => window.clearInterval(t);
  }, [killAlert]);

  if (!active) return null;

  return (
    <AnimatePresence>
      {killAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[92] pointer-events-none flex items-start justify-center pt-20 px-4"
        >
          <motion.div
            animate={{ opacity: [0.25, 0.6, 0.25] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="absolute inset-0 bg-red-900/25"
          />
          <motion.div
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            className="pointer-events-auto relative w-full max-w-sm rounded-xl border-2 border-red-500 bg-[#180a0a] p-5 shadow-[0_0_60px_rgba(255,0,0,0.35)]"
          >
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <Siren className="w-5 h-5 animate-pulse" />
              <span className="font-elite text-sm uppercase tracking-[0.2em]">
                exclusão remota em curso
              </span>
            </div>
            <p className="text-[13px] text-red-100 leading-snug mb-3">
              Alguém está apagando as conversas deste aparelho <b>agora</b>. Corte a conexão para
              congelar a memória.
            </p>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-2 rounded-full bg-red-950 overflow-hidden">
                <motion.div
                  className="h-full bg-red-500"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>
              <span className="font-elite text-2xl text-red-400 tabular-nums w-8 text-center">
                {left}
              </span>
            </div>
            <button
              onClick={() => toggleAirplane(true)}
              className="w-full rounded-lg bg-red-600 hover:bg-red-500 text-white py-3.5 font-elite text-base uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Plane className="w-5 h-5" /> Ativar modo avião
            </button>
            <p className="text-[10.5px] text-red-300/70 text-center mt-2">
              ou puxe a barra de status e toque em “Avião”
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PhishingPopup() {
  const { phish, answerPhish, active } = useThreat();
  if (!active) return null;
  return (
    <AnimatePresence>
      {phish && (
        <motion.div
          key={phish.id}
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-14 left-1/2 -translate-x-1/2 z-[91] w-[92vw] max-w-sm rounded-2xl border border-white/15 bg-[#17171b]/97 backdrop-blur-xl shadow-2xl p-3.5"
        >
          <div className="flex items-center gap-2 mb-1">
            <TriangleAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[9.5px] uppercase tracking-wider text-neutral-400">
              {phish.app}
            </span>
            <span className="ml-auto text-[10px] text-neutral-500">agora</span>
          </div>
          <div className="text-[13.5px] font-semibold text-white leading-snug">{phish.title}</div>
          <p className="text-[12px] text-neutral-300 leading-snug mt-0.5 mb-3">{phish.text}</p>
          <div className="flex gap-2">
            <button
              onClick={() => answerPhish(false)}
              className="flex-1 rounded-lg border border-white/20 text-neutral-300 py-2 text-[11.5px] font-semibold hover:bg-white/5"
            >
              Reportar / ignorar
            </button>
            <button
              onClick={() => answerPhish(true)}
              className="flex-1 rounded-lg bg-[#0a84ff] text-white py-2 text-[11.5px] font-semibold hover:brightness-110"
            >
              {phish.cta}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function GlitchOverlay() {
  const { glitch, active } = useThreat();
  if (!active || glitch <= 0) return null;
  return (
    <div className="fixed inset-0 z-[93] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 glitch-scan opacity-70" />
      <motion.div
        animate={{ opacity: [0, 0.22, 0, 0.12, 0] }}
        transition={{ duration: 0.45, repeat: Infinity }}
        className="absolute inset-0 bg-[#ff0033] mix-blend-screen"
      />
      <motion.div
        animate={{ x: [0, -5, 4, 0], opacity: [0.15, 0.3, 0.1] }}
        transition={{ duration: 0.3, repeat: Infinity }}
        className="absolute inset-0 bg-[#00fff0] mix-blend-screen opacity-10"
      />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/80 border border-red-500/50 px-3.5 py-1.5">
        <Link2Off className="w-3.5 h-3.5 text-red-400" />
        <span className="text-[11px] uppercase tracking-widest text-red-300">
          terminal infectado · {glitch}s
        </span>
      </div>
    </div>
  );
}

export function WipeScreen({ onRestart, onCases }: { onRestart: () => void; onCases: () => void }) {
  const { wiped, active } = useThreat();
  if (!active && !wiped) return null;
  return (
    <AnimatePresence>
      {wiped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[96] bg-black flex items-center justify-center p-5"
        >
          <div className="absolute inset-0 glitch-scan opacity-40" />
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full max-w-lg rounded-xl border-2 border-red-600/70 bg-[#120606] p-6 md:p-9"
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-red-400 mb-5">
              <Skull className="w-4 h-4" /> remote wipe executado
            </div>
            <h2 className="font-elite text-2xl md:text-3xl text-white leading-tight mb-5">
              Eles chegaram ao terminal antes de você.
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed text-neutral-300">
              <p>
                O rastreamento chegou a 100%. Em catorze segundos, o grupo enviou o comando de
                apagamento remoto: mensagens, galeria, backups e o próprio sistema de arquivos do
                aparelho foram zerados.
              </p>
              <p className="border-l-2 border-red-500/60 pl-4 text-red-200 italic">
                Relatório da TI: “A chave de criptografia não era renovada havia mais de seis
                minutos. O túnel caiu e o IP do nosso terminal ficou exposto.”
              </p>
              <p>
                Sem o dispositivo, não há inquérito. O caso precisa recomeçar — e desta vez,{" "}
                <b className="text-white">renove a VPN antes dos 70%</b>.
              </p>
            </div>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onRestart}
                className="flex-1 rounded-lg bg-[#8f1f1f] hover:bg-[#a52424] py-3.5 text-[12px] font-bold uppercase tracking-widest text-white flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Recomeçar este caso
              </button>
              <button
                onClick={onCases}
                className="flex-1 rounded-lg border border-white/20 text-neutral-300 hover:bg-white/5 py-3.5 text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <LibraryBig className="w-4 h-4" /> Escolher outro caso
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Selo compacto para a status bar do aparelho. */
export function TraceBadge() {
  const { active, trace, airplane } = useThreat();
  if (!active) return null;
  const danger = trace >= 70;
  const color = danger ? "#ff453a" : trace >= 40 ? "#e0a63c" : "#30d158";
  return (
    <div className="flex items-center gap-1">
      <ShieldAlert
        className={`w-3 h-3 ${danger ? "animate-pulse" : ""}`}
        style={{ color }}
        strokeWidth={2.6}
      />
      <div className="w-8 h-[6px] rounded-full bg-white/20 overflow-hidden">
        <motion.div className="h-full" style={{ background: color }} animate={{ width: `${trace}%` }} />
      </div>
      <span className="text-[9px] font-semibold tabular-nums" style={{ color }}>
        {Math.round(trace)}%
      </span>
      {airplane && <Plane className="w-3 h-3 text-[#0a84ff]" strokeWidth={2.6} />}
    </div>
  );
}
