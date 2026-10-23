"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Phone,
  Images,
  NotebookPen,
  Mail,
  Compass,
  Pin,
  Fingerprint,
  Landmark,
  VenetianMask,
  ShieldCheck,
  Hash,
  Settings,
  Camera,
} from "lucide-react";
import { useGame, useCase } from "@/components/game/context";
import { sfx } from "@/lib/audio";
import { useThreat } from "@/components/game/threat";

type AppDef = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  bg: string;
  badge?: number;
};

export default function HomeScreen({ onOpen }: { onOpen: (id: string) => void }) {
  const { evidence } = useGame();
  const caseData = useCase();
  const threat = useThreat();
  const unreadMsgs = caseData.conversations.reduce((acc, c) => acc + (c.unread ?? 0), 0);

  const apps: AppDef[] = [
    { id: "messages", label: "Mensagens", icon: MessageCircle, bg: "from-[#30d158] to-[#1eaf4c]", badge: unreadMsgs || undefined },
    { id: "calls", label: "Ligações", icon: Phone, bg: "from-[#34c759] to-[#1d9c42]" },
    { id: "photos", label: "Fotos", icon: Images, bg: "from-[#ff9f0a] to-[#ff375f]" },
    { id: "notes", label: "Notas", icon: NotebookPen, bg: "from-[#ffd60a] to-[#f5a623]" },
    { id: "mail", label: "Mail", icon: Mail, bg: "from-[#0a84ff] to-[#0060df]", badge: caseData.mails.length },
    { id: "browser", label: "Safari", icon: Compass, bg: "from-[#5ac8fa] to-[#0a84ff]" },
    { id: "bank", label: "Banco", icon: Landmark, bg: "from-[#0a4d8c] to-[#073a6b]" },
  ];

  if (threat.active) {
    apps.push({
      id: "vpn",
      label: "VPN",
      icon: ShieldCheck,
      bg: threat.trace >= 70 ? "from-[#ff453a] to-[#8f1f1f]" : "from-[#0a9d5a] to-[#06603a]",
      badge: threat.trace >= 40 ? Math.round(threat.trace) : undefined,
    });
  }
  apps.push({ id: "social", label: "InstaPic", icon: Camera, bg: "from-[#d6336c] to-[#7048e8]" });
  apps.push({ id: "calc", label: "Calc", icon: Hash, bg: "from-[#4a4a4f] to-[#1c1c1e]" });
  apps.push({ id: "settings", label: "Ajustes", icon: Settings, bg: "from-[#8e8e93] to-[#5a5a5f]" });

  if (caseData.chats?.length) {
    apps.push({
      id: "chat",
      label: "Conversa",
      icon: VenetianMask,
      bg: "from-[#8f1f1f] to-[#5c1111]",
      badge: caseData.chats.length,
    });
  }

  const dock = apps.slice(0, 4);

  const Icon = ({ app }: { app: AppDef }) => (
    <motion.button
      whileTap={{ scale: 0.82 }}
      onClick={() => {
        sfx.tap();
        onOpen(app.id);
      }}
      className="flex flex-col items-center gap-1.5 group"
    >
      <span
        className={`relative w-[56px] h-[56px] rounded-[24%] bg-gradient-to-b ${app.bg} flex items-center justify-center shadow-lg shadow-black/40 group-hover:brightness-110 transition`}
      >
        <app.icon className="w-7 h-7 text-white" strokeWidth={2.1} />
        {app.badge ? (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shadow">
            {app.badge}
          </span>
        ) : null}
      </span>
      <span className="text-[11px] text-white/90 font-medium drop-shadow">{app.label}</span>
    </motion.button>
  );

  return (
    <div className="absolute inset-0 flex flex-col pt-14 pb-6 px-5 overflow-y-auto no-scrollbar">
      {/* case widget */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-5 rounded-3xl bg-black/35 backdrop-blur-xl border border-white/10 p-4 text-white"
      >
        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#c9a86a] mb-1.5">
          <Fingerprint className="w-3.5 h-3.5" /> Perícia Digital · Caso {caseData.no}
        </div>
        <p className="text-[13px] leading-snug text-white/85">
          Puxe a barra de cima para ver notificações. Itens com{" "}
          <Pin className="inline w-3.5 h-3.5 -mt-0.5 text-[#c9a86a]" /> viram prova. A{" "}
          <span className="font-semibold text-white">Calculadora</span> pode esconder um cofre, e
          <span className="font-semibold text-white"> Ajustes</span> tem a lixeira forense.
        </p>
        <div className="mt-2.5 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-[#c9a86a]"
            initial={false}
            animate={{ width: `${Math.min(100, (evidence.length / 12) * 100)}%` }}
          />
        </div>
        <div className="mt-1.5 text-[11px] text-white/70">{evidence.length} prova(s) no dossiê</div>
      </motion.div>

      <div className="grid grid-cols-4 gap-x-3 gap-y-4 px-1">
        {apps.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
          >
            <Icon app={a} />
          </motion.div>
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex justify-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-white" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/35" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-[28px] bg-white/10 backdrop-blur-2xl border border-white/10 py-3 px-3"
      >
        <div className="grid grid-cols-4 gap-x-3">
          {dock.map((a) => (
            <div key={a.id} className="flex justify-center">
              <Icon app={a} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
