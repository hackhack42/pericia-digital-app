import { GameProvider } from "@/components/game/context";
import { ThreatProvider } from "@/components/game/threat";
import { AuthProvider } from "@/components/auth/AuthContext";
import AuthGate from "@/components/auth/AuthGate";

export default function Page() {
  return (
    <AuthProvider>
      <GameProvider>
        <ThreatProvider>
          <main className="grain">
            <AuthGate />
          </main>
        </ThreatProvider>
      </GameProvider>
    </AuthProvider>
  );
}
