"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AgentPayload } from "@/lib/auth";
import { saveCareer, loadCareer, type Career } from "@/game/career";
import { saveProfile } from "@/game/profile";
import type { Gender } from "@/game/profile";

export type AgentAccount = AgentPayload & {
  xp?: number;
  reputation?: number;
  medals?: string[];
  records?: unknown[];
};

type AuthCtx = {
  agent: AgentAccount | null;
  loading: boolean;
  login: (a: AgentAccount) => void;
  logout: () => void;
  syncCareer: () => Promise<void>;
  updateProfile: (patch: {
    nome?: string;
    genero?: Gender;
    avatarDataUrl?: string | null;
  }) => Promise<{ ok: boolean; error?: string }>;
  remembered: () => { matricula: string; nome: string } | null;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [agent, setAgent] = useState<AgentAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.agent) applyAgent(d.agent);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /** Último agente salvo no dispositivo (para pré-preencher o login). */
  const remembered = (): { matricula: string; nome: string } | null => {
    try {
      const raw = localStorage.getItem("caso2471_last_agent");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  /** Aplica agente no estado e sincroniza o perfil + carreira do servidor. */
  const applyAgent = (a: AgentAccount) => {
    setAgent(a);
    saveProfile({ name: a.nome, gender: (a.genero as Gender) ?? "n" });
    if (typeof a.xp === "number") {
      const local = loadCareer();
      const merged: Career = {
        xp: Math.max(local.xp, a.xp),
        reputation: Math.max(local.reputation, a.reputation ?? 60),
        medals: Array.from(new Set([...local.medals, ...(a.medals ?? [])])),
        records: local.records,
      };
      saveCareer(merged);
    }
  };

  const login = useCallback((a: AgentAccount) => {
    localStorage.setItem("caso2471_last_agent", JSON.stringify({ matricula: a.matricula, nome: a.nome }));
    applyAgent(a);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setAgent(null);
  }, []);

  const syncCareer = useCallback(async () => {
    if (!agent) return;
    const local = loadCareer();
    try {
      const res = await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(local),
      });
      if (res.ok) {
        const merged = await res.json();
        saveCareer(merged);
        setAgent((a) =>
          a
            ? {
                ...a,
                xp: merged.xp,
                reputation: merged.reputation,
                medals: merged.medals,
                records: merged.records,
              }
            : a
        );
      }
    } catch {
      /* offline — mantém local */
    }
  }, [agent]);

  const updateProfile = useCallback(
    async (patch: { nome?: string; genero?: Gender; avatarDataUrl?: string | null }) => {
      if (!agent) return { ok: false, error: "Não autenticado" };
      try {
        const res = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        const data = await res.json();
        if (!res.ok) return { ok: false, error: data.error ?? "Erro ao salvar" };
        applyAgent({ ...agent, ...data.agent });
        return { ok: true };
      } catch {
        return { ok: false, error: "Falha de rede" };
      }
    },
    [agent]
  );

  return (
    <Ctx.Provider value={{ agent, loading, login, logout, syncCareer, updateProfile, remembered }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth fora de AuthProvider");
  return c;
}
