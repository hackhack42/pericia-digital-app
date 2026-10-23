"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, MapPin, Repeat2, AlertTriangle } from "lucide-react";
import AppShell, { PinButton } from "../AppShell";
import { useCase } from "@/components/game/context";
import { socialFor } from "@/game/derive";
import { sfx } from "@/lib/audio";

export default function SocialApp() {
  const caseData = useCase();
  const posts = socialFor(caseData);
  const [net, setNet] = useState<"instapic" | "tweetfeed">("instapic");
  const list = posts.filter((p) => p.net === net);

  return (
    <AppShell
      title={net === "instapic" ? "InstaPic" : "TweetFeed"}
      right={
        <button
          onClick={() => {
            sfx.tap();
            setNet(net === "instapic" ? "tweetfeed" : "instapic");
          }}
          className="text-[11px] text-[#0a84ff] font-semibold"
        >
          trocar
        </button>
      }
    >
      <div className="flex border-b border-white/10">
        {(["instapic", "tweetfeed"] as const).map((n) => (
          <button
            key={n}
            onClick={() => {
              sfx.tap();
              setNet(n);
            }}
            className={`flex-1 py-2.5 text-[12px] font-semibold capitalize transition-colors ${
              net === n ? "text-white border-b-2 border-[#0a84ff]" : "text-neutral-400"
            }`}
          >
            {n === "instapic" ? "InstaPic" : "TweetFeed"}
          </button>
        ))}
      </div>

      <div className="p-3 space-y-3">
        {list.length === 0 && (
          <p className="text-center text-[12.5px] text-neutral-400 py-10">
            Nenhuma publicação arquivada nesta rede.
          </p>
        )}
        {list.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl bg-[#141418] border border-white/10 overflow-hidden"
          >
            <header className="flex items-center gap-2.5 px-3.5 py-2.5">
              {p.avatar ? (
                <img src={p.avatar} alt={p.author} className="w-9 h-9 rounded-full object-cover grayscale-[25%]" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center text-[11px] font-bold">
                  {p.author[0]}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-[13px] font-semibold truncate">{p.author}</div>
                <div className="text-[11px] text-neutral-400 truncate">
                  {p.handle} · {p.time}
                </div>
              </div>
              {p.evidenceId && (
                <div className="ml-auto">
                  <PinButton evidenceId={p.evidenceId} />
                </div>
              )}
            </header>

            {p.image && net === "instapic" && (
              <img src={p.image} alt="" className="w-full max-h-64 object-cover" />
            )}

            <div className="px-3.5 py-2.5">
              <p className="text-[13.5px] leading-snug text-neutral-100">{p.text}</p>
              {p.place && (
                <div className="flex items-center gap-1 text-[11px] text-[#6ea8ff] mt-1.5">
                  <MapPin className="w-3 h-3" /> {p.place}
                </div>
              )}

              <div className="flex items-center gap-4 mt-2.5 text-neutral-400">
                <span className="flex items-center gap-1 text-[11.5px]">
                  <Heart className="w-3.5 h-3.5" /> {p.likes}
                </span>
                <span className="flex items-center gap-1 text-[11.5px]">
                  <MessageCircle className="w-3.5 h-3.5" /> {p.comments?.length ?? 0}
                </span>
                {net === "tweetfeed" && (
                  <span className="flex items-center gap-1 text-[11.5px]">
                    <Repeat2 className="w-3.5 h-3.5" /> {Math.floor(p.likes / 7)}
                  </span>
                )}
              </div>

              {p.comments && p.comments.length > 0 && (
                <div className="mt-2.5 space-y-1 border-t border-white/5 pt-2">
                  {p.comments.map((c, k) => (
                    <p key={k} className="text-[12px] text-neutral-300">
                      <span className="text-neutral-400">{c.author}</span> {c.text}
                    </p>
                  ))}
                </div>
              )}

              {p.contradiction && (
                <div className="mt-2.5 rounded-lg border border-amber-500/40 bg-amber-950/20 px-3 py-2 flex gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11.5px] text-amber-200/90 leading-snug">{p.contradiction}</p>
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </AppShell>
  );
}
