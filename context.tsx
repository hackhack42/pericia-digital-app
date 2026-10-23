"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { CLOUD_UNLOCK_AT } from "@/game/cases";
import type { CaseData } from "@/game/types";
import { loadProfile, type DetectiveProfile } from "@/game/profile";
import { sfx } from "@/lib/audio";

type Toast = { id: number; title: string; desc: string };

export type ChatState = Record<string, { sent: string[]; suspicion: number }>;

export type HydratePayload = {
  caseId: string;
  evidence: string[];
  answered: Record<string, string[]>;
  phoneUnlocked: boolean;
  solved: boolean;
  attempts: number;
  hints: number;
  chat?: ChatState;
  caseLost?: boolean;
};

type GameCtx = {
  sessionId: string | null;
  caseData: CaseData | null;
  startSession: (sessionId: string, caseData: CaseData) => void;
  hydrateSession: (p: HydratePayload) => void;
  evidence: string[];
  collect: (id: string) => void;
  hasEvidence: (id: string) => boolean;
  answered: Record<string, string[]>;
  answer: (suspectId: string, qId: string) => void;
  phoneUnlocked: boolean;
  setPhoneUnlocked: (v: boolean) => void;
  solved: boolean;
  setSolved: (v: boolean) => void;
  attempts: number;
  setAttempts: (v: number) => void;
  hints: number;
  revealHint: () => void;
  chat: ChatState;
  setChatState: (threadId: string, sent: string[], suspicion: number) => void;
  caseLost: boolean;
  loseCase: () => void;
  profile: DetectiveProfile | null;
  setProfile: (p: DetectiveProfile | null) => void;
  /** segundos decorridos no caso atual */
  elapsed: number;
  /** tentativas de senha erradas */
  pinTries: number;
  addPinTry: () => void;
  /** instante em que o caso foi aberto (ms) */
  startedAt: number | null;
  cloudUnlocked: boolean;
  bankUnlocked: boolean;
  unlockBank: () => void;
  toasts: Toast[];
  pushToast: (title: string, desc: string) => void;
  dismissToast: (id: number) => void;
  reset: () => void;
};

const Ctx = createContext<GameCtx | null>(null);
export const caseKey = (caseId: string) => `caso2471_${caseId}`;

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [answered, setAnswered] = useState<Record<string, string[]>>({});
  const [phoneUnlocked, setPhoneUnlocked] = useState(false);
  const [solved, setSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [chat, setChat] = useState<ChatState>({});
  const [caseLost, setCaseLost] = useState(false);
  const [bankUnlocked, setBankUnlocked] = useState(false);
  const [profile, _setProfile] = useState<DetectiveProfile | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [pinTries, setPinTries] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  React.useEffect(() => {
    _setProfile(loadProfile());
  }, []);

  React.useEffect(() => {
    if (!startedAt) return;
    const t = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(t);
  }, [startedAt]);

  const persist = useCallback(
    (patch: Record<string, unknown>) => {
      const id = sessionId;
      if (!id) return;
      fetch("/api/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      }).catch(() => {});
    },
    [sessionId]
  );

  const pushToast = useCallback((title: string, desc: string) => {
    const id = ++toastId.current;
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(/aviso|cuidado|perdid|erro|alerta|último/i.test(title) ? [40, 60, 40] : 18);
    }
    setToasts((t) => [...t, { id, title, desc }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3600);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const startSession = useCallback(
    (id: string, data: CaseData) => {
      setSessionId(id);
      setCaseData(data);
      localStorage.setItem(caseKey(data.id), id);
      localStorage.setItem("caso2471_last_case", data.id);
      setBankUnlocked(localStorage.getItem(`caso2471_bank_${data.id}`) === "1");
      setStartedAt(Date.now());
      setElapsed(0);
      setPinTries(0);
    },
    []
  );

  const setProfile = useCallback((p: DetectiveProfile | null) => _setProfile(p), []);
  const addPinTry = useCallback(() => setPinTries((n) => n + 1), []);

  const unlockBank = useCallback(() => {
    setBankUnlocked(true);
    if (caseData) localStorage.setItem(`caso2471_bank_${caseData.id}`, "1");
  }, [caseData]);

  const collect = useCallback(
    (id: string) => {
      setEvidence((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        persist({ evidence: next });
        const meta = caseData?.evidence[id];
        if (meta) {
          sfx.evidence();
          pushToast("Prova anexada ao dossiê", meta.title);
        }
        if (next.length === CLOUD_UNLOCK_AT && caseData) {
          window.setTimeout(
            () =>
              pushToast(
                "PERÍCIA INFORMA",
                `Backup em nuvem do celular de ${caseData.cloud.owner} desbloqueado. Veja o dossiê.`
              ),
            1400
          );
        }
        return next;
      });
    },
    [persist, pushToast, caseData]
  );

  const hasEvidence = useCallback((id: string) => evidence.includes(id), [evidence]);

  const answer = useCallback(
    (suspectId: string, qId: string) => {
      setAnswered((prev) => {
        const list = prev[suspectId] ?? [];
        if (list.includes(qId)) return prev;
        const next = { ...prev, [suspectId]: [...list, qId] };
        persist({ answered: next });
        return next;
      });
    },
    [persist]
  );

  const setChatState = useCallback(
    (threadId: string, sent: string[], suspicion: number) => {
      setChat((prev) => ({ ...prev, [threadId]: { sent, suspicion } }));
    },
    []
  );

  const loseCase = useCallback(() => setCaseLost(true), []);

  const revealHint = useCallback(() => {
    setHints((h) => {
      const next = Math.min(h + 1, caseData?.hints.length ?? 0);
      persist({ hints: next });
      return next;
    });
  }, [persist, caseData]);

  const hydrateSession = useCallback((payload: HydratePayload) => {
    setEvidence(payload.evidence ?? []);
    setAnswered(payload.answered ?? {});
    setPhoneUnlocked(!!payload.phoneUnlocked);
    setSolved(!!payload.solved);
    setAttempts(payload.attempts ?? 0);
    setHints(payload.hints ?? 0);
    setChat(payload.chat ?? {});
  }, []);

  const reset = useCallback(() => {
    if (caseData) {
      localStorage.removeItem(caseKey(caseData.id));
      localStorage.removeItem("caso2471_last_case");
    }
    setSessionId(null);
    setCaseData(null);
    setEvidence([]);
    setAnswered({});
    setPhoneUnlocked(false);
    setSolved(false);
    setAttempts(0);
    setHints(0);
    setChat({});
    setCaseLost(false);
    setBankUnlocked(false);
    setStartedAt(null);
    setElapsed(0);
    setPinTries(0);
    setToasts([]);
  }, [caseData]);

  const value: GameCtx = {
    sessionId,
    caseData,
    startSession,
    hydrateSession,
    evidence,
    collect,
    hasEvidence,
    answered,
    answer,
    phoneUnlocked,
    setPhoneUnlocked,
    solved,
    setSolved,
    attempts,
    setAttempts,
    hints,
    revealHint,
    chat,
    setChatState,
    caseLost,
    loseCase,
    profile,
    setProfile,
    elapsed,
    pinTries,
    addPinTry,
    startedAt,
    cloudUnlocked: evidence.length >= CLOUD_UNLOCK_AT,
    bankUnlocked,
    unlockBank,
    toasts,
    pushToast,
    dismissToast,
    reset,
  };

  (value as unknown as { _hydrate: (s: HydratePayload) => void })._hydrate = (s) => {
    setEvidence(s.evidence ?? []);
    setAnswered(s.answered ?? {});
    setPhoneUnlocked(!!s.phoneUnlocked);
    setSolved(!!s.solved);
    setAttempts(s.attempts ?? 0);
    setHints(s.hints ?? 0);
    setChat(s.chat ?? {});
    setCaseLost(!!s.caseLost);
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

/** Dados do caso atual (lança erro se nenhum caso ativo). */
export function useCase(): CaseData {
  const { caseData } = useGame();
  if (!caseData) throw new Error("nenhum caso ativo");
  return caseData;
}

export function useHydrate() {
  const ctx = useContext(Ctx);
  return (ctx as unknown as { _hydrate: (s: HydratePayload) => void })._hydrate;
}
