"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plane, WifiOff } from "lucide-react";
import { useGame, useCase } from "@/components/game/context";
import LockScreen from "./LockScreen";
import HomeScreen from "./HomeScreen";
import NotificationCenter from "./NotificationCenter";
import MessagesApp from "./apps/MessagesApp";
import CallsApp from "./apps/CallsApp";
import PhotosApp from "./apps/PhotosApp";
import NotesApp from "./apps/NotesApp";
import MailApp from "./apps/MailApp";
import BrowserApp from "./apps/BrowserApp";
import BankApp from "./apps/BankApp";
import ChatApp from "./apps/ChatApp";
import SocialApp from "./apps/SocialApp";
import CalculatorApp from "./apps/CalculatorApp";
import SettingsApp from "./apps/SettingsApp";
import VpnApp from "./apps/VpnApp";
import { TraceBadge, useThreat } from "@/components/game/threat";
import { sfx } from "@/lib/audio";

export const APP_COMPONENTS: Record<string, React.ComponentType> = {
  chat: ChatApp,
  messages: MessagesApp,
  calls: CallsApp,
  photos: PhotosApp,
  notes: NotesApp,
  mail: MailApp,
  browser: BrowserApp,
  bank: BankApp,
  social: SocialApp,
  calc: CalculatorApp,
  settings: SettingsApp,
  vpn: VpnApp,
};

function StatusBar({ battery, clock }: { battery: number; clock: string }) {
  const low = battery <= 5;
  const { active, airplane } = useThreat();
  return (
    <div className="absolute top-0 inset-x-0 z-40 h-[52px] flex items-end justify-between px-5 pb-2 text-white pointer-events-none gap-2">
      <span className="text-[13px] font-semibold tracking-wide drop-shadow tabular-nums shrink-0">{clock}</span>
      {active && <TraceBadge />}
      <div className="flex items-center gap-1.5 drop-shadow shrink-0">
        {!active && <Plane className="w-3.5 h-3.5" strokeWidth={2.4} />}
        {active && airplane && <Plane className="w-3.5 h-3.5 text-[#0a84ff]" strokeWidth={2.4} />}
        <WifiOff className="w-3.5 h-3.5" strokeWidth={2.4} />
        <div className="flex items-center gap-1">
          <div className="w-6 h-[11px] rounded-[3px] border border-white/60 p-[1.5px] flex">
            <motion.div
              className={`h-full rounded-[1.5px] ${low ? "bg-red-500" : "bg-amber-400"}`}
              animate={{ width: `${Math.max(3, battery)}%` }}
            />
          </div>
          <span className={`text-[10px] font-medium tabular-nums ${low ? "text-red-400" : "text-amber-300"}`}>
            {battery}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function Wallpaper({ blur = false }: { blur?: boolean }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${blur ? "scale-110" : ""}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#101319] via-[#141020] to-[#1d0f14]" />
      <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-[#3d2c4e] opacity-50 blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-[#571f2c] opacity-40 blur-3xl" />
      <div className="absolute -bottom-24 left-8 w-80 h-80 rounded-full bg-[#1d3a4a] opacity-40 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
  );
}

export default function PhoneFrame() {
  const { phoneUnlocked, elapsed } = useGame();
  const caseData = useCase();
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [tray, setTray] = useState(false);

  // bateria consome com o tempo de investigação (de 9% a 1%)
  const battery = Math.max(1, 9 - Math.floor(elapsed / 240));

  // relógio parado na hora do crime, com segundos vivos
  const [clock, setClock] = useState(caseData.lockTime);
  useEffect(() => {
    const [hh, mm] = caseData.lockTime.split(":").map(Number);
    const t = window.setInterval(() => {
      setClock(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
    }, 30000);
    setClock(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
    return () => window.clearInterval(t);
  }, [caseData.lockTime]);

  const ActiveApp = openApp ? APP_COMPONENTS[openApp] : null;

  const goHome = () => {
    if (openApp) {
      sfx.tap();
      setOpenApp(null);
    }
  };

  return (
    <div className="relative w-full h-full lg:aspect-[400/860] lg:max-w-[92vw] lg:h-[min(844px,90dvh)]">
      {/* mesa de perícia (desktop) */}
      <div className="hidden lg:block absolute -inset-24 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(201,168,106,0.09),transparent_62%)] blur-xl" />
        <div className="absolute inset-x-[-40%] bottom-[-18%] h-[55%] bg-[linear-gradient(180deg,rgba(28,24,20,0.9),rgba(10,9,8,1))] [transform:perspective(600px)rotateX(62deg)] opacity-80" />
      </div>

      {/* botões laterais */}
      <div className="hidden lg:block absolute -left-[3px] top-[18%] w-[3px] h-8 rounded-l-md bg-neutral-600" />
      <div className="hidden lg:block absolute -left-[3px] top-[25%] w-[3px] h-12 rounded-l-md bg-neutral-600" />
      <div className="hidden lg:block absolute -left-[3px] top-[32%] w-[3px] h-12 rounded-l-md bg-neutral-600" />
      <div className="hidden lg:block absolute -right-[3px] top-[28%] w-[3px] h-16 rounded-r-md bg-neutral-600" />

      <div className="relative h-full w-full border-0 bg-black p-0 lg:rounded-[3.4rem] lg:border lg:border-neutral-700/80 lg:bg-gradient-to-b lg:from-neutral-800 lg:via-black lg:to-neutral-900 lg:p-[10px] lg:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]">
        <div className="hidden lg:block absolute inset-0 rounded-[3.4rem] shadow-[inset_0_0_2px_rgba(255,255,255,0.25)] pointer-events-none" />

        <div className="relative h-full w-full overflow-hidden rounded-none lg:rounded-[2.7rem] bg-black">
          <Wallpaper />

          <div className="hidden lg:flex absolute top-[11px] left-1/2 -translate-x-1/2 z-50 w-[110px] h-[30px] bg-black rounded-full items-center justify-end pr-3 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0e1620] shadow-[inset_0_0_2px_rgba(80,120,160,0.8)]" />
          </div>

          <StatusBar battery={battery} clock={clock} />

          {/* zona de gesto: puxar para baixo abre notificações */}
          {phoneUnlocked && (
            <motion.div
              className="absolute top-0 inset-x-0 h-[52px] z-[57]"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.5}
              onDragEnd={(_, info) => {
                if (info.offset.y > 40) {
                  sfx.tap();
                  setTray(true);
                }
              }}
              onDoubleClick={() => setTray(true)}
            />
          )}

          {!phoneUnlocked ? (
            <LockScreen />
          ) : (
            <>
              <HomeScreen onOpen={setOpenApp} />
              <AnimatePresence>
                {ActiveApp && (
                  <motion.div
                    key={openApp}
                    initial={{ y: "100%", scale: 0.96 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: "100%", scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 340, damping: 34 }}
                    className="absolute inset-0 z-30"
                  >
                    <ActiveApp />
                  </motion.div>
                )}
              </AnimatePresence>
              <NotificationCenter open={tray} onClose={() => setTray(false)} battery={battery} />
            </>
          )}

          {/* barra de gestos — arraste para cima ou clique para ir ao início */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => info.offset.y < -35 && goHome()}
            onClick={goHome}
            className="absolute bottom-0 inset-x-0 z-[55] h-9 flex items-end justify-center pb-[7px] cursor-pointer"
            role="button"
            aria-label="Ir para o início"
          >
            <div className="w-36 h-5 flex items-center justify-center group">
              <div className="w-32 h-[5px] rounded-full bg-white/70 group-hover:bg-white group-active:scale-90 transition" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
