"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Smartphone, Pin, RotateCcw, BadgeCheck, ScrollText, LibraryBig, FolderOpen } from "lucide-react";
import { useGame } from "./context";
import PhoneFrame from "@/components/phone/PhoneFrame";
import Dossier from "./Dossier";
import Intro from "./Intro";
import Ending from "./Ending";
import CaseLost from "./CaseLost";
import Toolbar from "./Toolbar";
import Notepad from "./Notepad";
import Mural from "./Mural";
import InstallPrompt from "./InstallPrompt";
import { KillSwitchOverlay, PhishingPopup, GlitchOverlay, WipeScreen, useThreat } from "./threat";
import Infiltrado from "./Infiltrado";
import Feedback from "./Feedback";
import EasterEggDisplay, { useEasterEggDetector } from "./EasterEgg";
import type { EasterEgg } from "@/game/easter";
import { useAuth } from "@/components/auth/AuthContext";
import Credential from "./Credential";
import { BootScreen } from "./Skeleton";
import ProfilePanel from "@/components/auth/ProfilePanel";
import { loadProfile, saveProfile, addressed, type DetectiveProfile } from "@/game/profile";
import { getCase } from "@/game/cases";
import { caseKey } from "./context";
import { CASE_LIST } from "@/game/cases";
import { sfx } from "@/lib/audio";

function Toasts() {
  const { toasts, dismissToast } = useGame();
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[95] flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-md h-0 overflow-visible">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            onClick={() => dismissToast(t.id)}
            className="pointer-events-auto w-full rounded-lg bg-[#171512]/95 border border-[#c9a86a]/40 border-l-4 border-l-[#c9a86a] px-4 py-3 shadow-2xl cursor-pointer"
          >
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#c9a86a] font-bold">{t.title}</div>
            <div className="text-[13px] text-neutral-200 mt-0.5">{t.desc}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Exporta todo o progresso (sessões + notas + perfil) para um arquivo. */
function exportProgress(profile: DetectiveProfile | null) {
  const data: Record<string, unknown> = { v: 1, exportadoEm: new Date().toISOString(), perfil: profile };
  const casos: Record<string, { sessao?: string; banco?: boolean; notas?: unknown }> = {};
  for (const c of CASE_LIST) {
    const sessao = localStorage.getItem(`caso2471_${c.id}`) ?? undefined;
    const banco = localStorage.getItem(`caso2471_bank_${c.id}`) === "1" || undefined;
    const notasRaw = localStorage.getItem(`caso2471_notas_${c.id}`);
    if (sessao || banco || notasRaw) {
      casos[c.id] = { sessao, banco, notas: notasRaw ? JSON.parse(notasRaw) : undefined };
    }
  }
  data.casos = casos;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pericia-digital-progresso-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function importProgress(file: File): Promise<boolean> {
  try {
    const data = JSON.parse(await file.text());
    if (!data || typeof data !== "object") return false;
    if (data.perfil?.name) saveProfile(data.perfil);
    const casos = data.casos ?? {};
    for (const [id, v] of Object.entries(casos as Record<string, { sessao?: string; banco?: boolean; notas?: unknown }>)) {
      if (v.sessao) localStorage.setItem(`caso2471_${id}`, v.sessao);
      if (v.banco) localStorage.setItem(`caso2471_bank_${id}`, "1");
      if (v.notas) localStorage.setItem(`caso2471_notas_${id}`, JSON.stringify(v.notas));
    }
    return true;
  } catch {
    return false;
  }
}

export default function GameShell() {
  const [booting, setBooting] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [activeEgg, setActiveEgg] = useState<EasterEgg | null>(null);
  
  const [stage, setStage] = useState<"intro" | "game">("intro");
  const [mobileTab, setMobileTab] = useState<"phone" | "dossier">("phone");
  const [outcome, setOutcome] = useState<"perfect" | "weak" | "wrong" | null>(null);
  
  const game = useGame();
  const threat = useThreat();
  const { agent, syncCareer } = useAuth();
  
  useEasterEggDetector(setActiveEgg);

  useEffect(() => {
    const p = loadProfile();
    if (p) game.setProfile(p);
    else setNeedsProfile(true);
    const t = window.setTimeout(() => setBooting(false), 1500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (agent?.nome) {
      game.setProfile({ name: agent.nome, gender: (agent.genero as "f" | "m" | "n") ?? "n" });
      setNeedsProfile(false);
    }
  }, [agent?.nome, agent?.genero, game]);

  // Retoma automaticamente o último caso aberto após um refresh
  useEffect(() => {
    if (!agent?.nome || !game.sessionId) return;
    const last = localStorage.getItem("caso2471_last_case");
    if (!last) return;
    const id = localStorage.getItem(caseKey(last));
    if (!id || game.caseData) return;

    const data = getCase(last);
    fetch(`/api/session?id=${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((row) => {
        game.startSession(row.id, data);
        game.hydrateSession?.({
          caseId: data.id,
          evidence: row.evidence ?? [],
          answered: row.answered ?? {},
          phoneUnlocked: row.phoneUnlocked ?? false,
          solved: row.solved ?? false,
          attempts: row.attempts ?? 0,
          hints: row.hints ?? 0,
          chat: row.chat ?? {},
        });
        setStage("game");
      })
      .catch(() => localStorage.removeItem("caso2471_last_case"));
  }, [agent?.nome, game.sessionId, game.caseData, game]);

  const toolbar = (
    <Toolbar
      onExport={() => exportProgress(game.profile)}
      onImport={async (f) => {
        const ok = await importProgress(f);
        game.pushToast(
          ok ? "Progresso importado" : "Arquivo inválido",
          ok ? "Recarregando o terminal…" : "Não consegui ler esse arquivo de progresso."
        );
        if (ok) window.setTimeout(() => window.location.reload(), 1200);
      }}
      onProfile={() => setProfileOpen(true)}
      onFeedback={() => setFeedbackOpen(true)}
    />
  );

  if (booting) return <BootScreen />;

  if (needsProfile) {
    return (
      <Credential
        onDone={(p) => {
          game.setProfile(p);
          setNeedsProfile(false);
        }}
      />
    );
  }

  const caseData = game.caseData;

  return (
    <>
      <Toasts />
      <InstallPrompt />
      <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
      <Feedback open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <EasterEggDisplay egg={activeEgg} onClose={() => setActiveEgg(null)} />

      <AnimatePresence>
        {game.caseLost && !outcome && (
          <CaseLost
            onRestart={() => {
              game.reset();
              syncCareer().catch(()=>{});
              setOutcome(null);
              setStage("intro");
              sfx.tap();
            }}
            onCases={() => {
              game.reset();
              syncCareer().catch(()=>{});
              setStage("intro");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {outcome && (
          <Ending
            result={outcome}
            attempts={game.attempts}
            evidenceCount={game.evidence.length}
            onClose={() => setOutcome(null)}
            onRestart={() => {
              game.reset();
              syncCareer().catch(()=>{});
              setOutcome(null);
              setStage("intro");
              sfx.tap();
            }}
          />
        )}
      </AnimatePresence>

      {stage === "intro" ? (
        <>
          <div className="fixed top-3 right-3 z-[80]">{toolbar}</div>
          <button onClick={() => setFeedbackOpen(true)} className="fixed bottom-4 left-4 z-[80] flex items-center gap-2 rounded-full border border-[#c9a86a]/40 bg-[#171512] px-3.5 py-2.5 text-[12px] font-semibold text-[#c9a86a] hover:bg-[#1f1c16] shadow-xl">
            💬 Feedback
          </button>
          <Intro onStart={() => setStage("game")} />
        </>
      ) : (
      caseData && (
        <div className="h-dvh w-full flex flex-col bg-[#0a0a0c] overflow-hidden">
          <header className="h-14 sm:h-12 shrink-0 border-b border-white/10 bg-black/60 backdrop-blur flex items-center px-3 sm:px-4 gap-3 sm:gap-4 z-40">
            <div className="flex items-center gap-2.5 min-w-0">
              <ScrollText className="w-4 h-4 text-[#c9a86a] shrink-0" />
              <span className="redacted text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-neutral-400 truncate">
                <span className="text-[#c9a86a]">nº {caseData.no}</span>
                <span className="hidden sm:inline"> · {caseData.title}</span>
              </span>
            </div>
            
            {agent && (
              <div className="hidden xl:flex items-center gap-2.5 shrink-0 min-w-0">
                {agent.avatarDataUrl ? (
                  <img src={agent.avatarDataUrl} alt={agent.nome} className="w-8 h-8 rounded-full object-cover border border-white/15" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-black/35 border border-white/15 flex items-center justify-center text-[#c9a86a] text-[10px] font-bold">
                    {agent.nome.trim().charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="redacted text-[10px] tracking-widest uppercase text-neutral-400 truncate">
                  {agent.matricula} · {addressed(game.profile)}
                </span>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {toolbar}
              {game.solved && (
                <span className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-400 border border-emerald-500/40 rounded-full px-2.5 py-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> Resolvido
                </span>
              )}
              <span className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                <Pin className="w-3.5 h-3.5 text-[#c9a86a]" />
                {game.evidence.length} prova(s)
              </span>
              <button
                onClick={() => { syncCareer().catch(()=>{}); setStage("intro"); }}
                title="Voltar ao arquivo de casos"
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-200 transition-colors border border-white/10 rounded-full px-3 py-1.5"
              >
                <LibraryBig className="w-3 h-3" /> <span className="hidden sm:inline">Outros casos</span>
              </button>
              <button
                onClick={() => {
                  game.reset();
                  syncCareer().catch(()=>{});
                  setOutcome(null);
                  setStage("intro");
                  sfx.tap();
                }}
                title="Arquivar caso e apagar progresso"
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-400 transition-colors border border-white/10 rounded-full px-3 py-1.5"
              >
                <RotateCcw className="w-3 h-3" /> <span className="hidden sm:inline">Recomeçar</span>
              </button>
            </div>
          </header>

          <div className="flex-1 flex min-h-0">
            <aside className="hidden lg:block w-[440px] shrink-0 paper border-r border-[#c9a86a]/15 relative z-30">
              <Dossier onOutcome={(r) => setOutcome(r as "perfect" | "weak" | "wrong")} />
            </aside>
            {mobileTab === "dossier" && (
              <div className="lg:hidden flex-1 min-h-0 paper">
                <Dossier onOutcome={(r) => setOutcome(r as "perfect" | "weak" | "wrong")} />
              </div>
            )}
            <main className={`${mobileTab === "dossier" ? "hidden lg:flex" : "flex"} flex-1 relative items-center justify-center overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(201,168,106,0.07),transparent_60%),radial-gradient(ellipse_at_80%_110%,rgba(143,31,31,0.06),transparent_50%)]" />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="hidden lg:block absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none px-4"
              >
                <div className="redacted text-[10px] tracking-[0.3em] uppercase text-neutral-600">
                  Evidência nº 01 — celular de {caseData.victim.name} · perícia autorizada
                </div>
              </motion.div>
              <div className="relative w-full h-full lg:w-auto lg:h-auto lg:py-4">
                <PhoneFrame />
              </div>
            </main>
          </div>

          <nav className="lg:hidden shrink-0 border-t border-white/10 bg-black/90 backdrop-blur flex z-[60]">
            {([
              { id: "phone" as const, label: "Celular", icon: Smartphone },
              { id: "dossier" as const, label: "Dossiê", icon: FolderOpen },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setMobileTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3.5 text-[11px] min-h-[56px] uppercase tracking-widest transition-colors relative ${
                  mobileTab === t.id ? "text-[#c9a86a]" : "text-neutral-400"
                }`}
              >
                <t.icon className="w-5 h-5" />
                {t.label}
                {t.id === "dossier" && game.evidence.length > 0 && (
                  <span className="absolute top-1.5 right-[28%] min-w-4 h-4 px-1 rounded-full bg-[#8f1f1f] text-white text-[9px] font-bold flex items-center justify-center">
                    {game.evidence.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <Notepad />
          <Mural />
          <Infiltrado />

          <KillSwitchOverlay />
          <PhishingPopup />
          <GlitchOverlay />
          <WipeScreen
            onRestart={() => {
              threat.resetThreat();
              game.reset();
              setOutcome(null);
              setStage("intro");
            }}
            onCases={() => {
              threat.resetThreat();
              game.reset();
              setStage("intro");
            }}
          />
        </div>
      )
    )}
    </>
  );
}
