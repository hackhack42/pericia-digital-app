"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import AuthScreen from "./AuthScreen";
import GameShell from "@/components/game/GameShell";
import { BootScreen } from "@/components/game/Skeleton";

/**
 * Exibe a tela de loading → login → jogo.
 * Após autenticação sincroniza a carreira a cada 5 minutos.
 */
export default function AuthGate() {
  const { agent, loading, login, syncCareer } = useAuth();

  useEffect(() => {
    if (!agent) return;
    const t = window.setInterval(syncCareer, 5 * 60 * 1000);
    return () => window.clearInterval(t);
  }, [agent, syncCareer]);

  if (loading) return <BootScreen step={1} />;
  if (!agent) return <AuthScreen onAuth={login} />;
  return <GameShell />;
}
