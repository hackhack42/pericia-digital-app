"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Globe2, Plane, RefreshCw, Loader2, Zap } from "lucide-react";
import AppShell from "../AppShell";
import { useThreat, SERVERS } from "@/components/game/threat";
import { sfx } from "@/lib/audio";

export default function VpnApp() {
  const { active, trace, airplane, toggleAirplane, renewVpn, server, lastRenewAgo } = useThreat();
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<string | null>(null);

  const steps = [
    "Encerrando túnel atual…",
    "Negociando handshake…",
    "Gerando par de chaves…",
    "Mascarando IP de origem…",
  ];

  useEffect(() => {
    if (!busy) return;
    const t = window.setInterval(() => setStep((s) => s + 1), 420);
    return () => window.clearInterval(t);
  }, [busy]);

  const renew = (srv: string) => {
    if (busy) return;
    setPick(srv);
    setBusy(true);
    setStep(0);
    sfx.tap();
    window.setTimeout(() => {
      renewVpn(srv);
      setBusy(false);
      setPick(null);
    }, 1800);
  };

  if (!active) {
    return (
      <AppShell title="VPN Policial">
        <div className="p-6 text-center">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <p className="text-[13px] text-neutral-300 leading-relaxed">
            Nenhuma ameaça ativa neste caso.
          </p>
          <p className="text-[12px] text-neutral-400 mt-2 leading-relaxed">
            Em dispositivos de alta complexidade, o grupo criminoso tenta localizar o terminal que
            está acessando o aparelho. Nesses casos, este app passa a ser obrigatório.
          </p>
        </div>
      </AppShell>
    );
  }

  const danger = trace >= 70;
  const color = danger ? "#ff453a" : trace >= 40 ? "#e0a63c" : "#30d158";

  return (
    <AppShell title="VPN Policial">
      <div className="p-4 space-y-4">
        {/* medidor */}
        <div
          className="rounded-2xl border p-4"
          style={{ borderColor: `${color}55`, background: `${color}10` }}
        >
          <div className="flex items-center gap-2 mb-3">
            {danger ? (
              <ShieldAlert className="w-5 h-5 animate-pulse" style={{ color }} />
            ) : (
              <ShieldCheck className="w-5 h-5" style={{ color }} />
            )}
            <span className="text-[11px] uppercase tracking-widest" style={{ color }}>
              Rastreamento remoto
            </span>
            <span className="ml-auto text-[22px] font-bold tabular-nums" style={{ color }}>
              {Math.round(trace)}%
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-black/50 overflow-hidden mb-2">
            <motion.div className="h-full" style={{ background: color }} animate={{ width: `${trace}%` }} />
          </div>
          <p className="text-[11.5px] leading-snug" style={{ color: danger ? "#ffbdae" : "#9a958e" }}>
            {danger
              ? "CRÍTICO: eles estão triangulando este terminal. Renove a chave AGORA ou as provas serão apagadas remotamente."
              : airplane
                ? "Modo avião ativo — o rastreamento está congelado, mas o aparelho está offline."
                : `Chave renovada há ${lastRenewAgo}s. Ao chegar a 100%, ocorre apagamento remoto e o caso é perdido.`}
          </p>
        </div>

        {/* status do túnel */}
        <div className="rounded-xl bg-[#141418] border border-white/10 p-3.5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
            <Globe2 className="w-3.5 h-3.5" /> túnel ativo
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[13px] text-emerald-300">{server}</span>
            <span className="text-[11px] text-neutral-400">AES-256 · WireGuard</span>
          </div>
        </div>

        {/* seleção de nó */}
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#c9a86a] mb-2">
            Renovar chave — escolha um novo nó
          </div>
          <div className="space-y-2">
            {SERVERS.map((s) => {
              const current = s === server;
              const loading = busy && pick === s;
              return (
                <button
                  key={s}
                  onClick={() => renew(s)}
                  disabled={busy || current}
                  className={`w-full flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
                    current
                      ? "border-emerald-500/40 bg-emerald-950/20 opacity-60"
                      : "border-white/12 bg-black/30 hover:border-[#c9a86a]/60 active:scale-[0.99]"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 text-[#c9a86a] animate-spin shrink-0" />
                  ) : (
                    <Zap className={`w-4 h-4 shrink-0 ${current ? "text-emerald-400" : "text-[#c9a86a]"}`} />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[12.5px] truncate">{s}</div>
                    <div className="text-[10.5px] text-neutral-400">
                      {loading ? steps[Math.min(step, steps.length - 1)] : current ? "nó em uso" : "latência baixa · livre"}
                    </div>
                  </div>
                  {!current && !loading && (
                    <RefreshCw className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* kill switch */}
        <button
          onClick={() => toggleAirplane()}
          className={`w-full rounded-xl border py-3.5 flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-widest transition-colors ${
            airplane
              ? "border-[#0a84ff] bg-[#0a84ff]/20 text-[#9fd0ff]"
              : "border-white/15 text-neutral-300 hover:bg-white/5"
          }`}
        >
          <Plane className="w-4 h-4" />
          {airplane ? "Modo avião ATIVO — tocar para religar" : "Kill switch · modo avião"}
        </button>

        <p className="text-[11px] text-neutral-400 leading-relaxed">
          O modo avião congela a memória do aparelho e interrompe o rastreamento, mas derruba o
          navegador e as conversas ao vivo. Use durante as tentativas de exclusão remota.
        </p>
      </div>
    </AppShell>
  );
}
