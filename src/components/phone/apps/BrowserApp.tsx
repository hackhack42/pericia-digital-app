"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, Loader2, ChevronLeft, BookOpenText, Newspaper } from "lucide-react";
import AppShell, { PinButton } from "../AppShell";
import { useCase } from "@/components/game/context";
import { ForensicLoader } from "@/components/game/Skeleton";
import { sfx } from "@/lib/audio";
import { useThreat } from "@/components/game/threat";
import type { WebArticle } from "@/game/types";

const norm = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

type WikiResult = { title: string; snippet: string; url: string };
type WikiPage = { title: string; extract: string; url: string; thumb: string | null };

export default function BrowserApp() {
  const caseData = useCase();
  const { airplane, active: threatOn } = useThreat();
  const [tab, setTab] = useState<"buscar" | "historico">("buscar");
  const [q, setQ] = useState("");
  const [draftQ, setDraftQ] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wiki, setWiki] = useState<WikiResult[]>([]);
  const [local, setLocal] = useState<WebArticle[]>([]);
  const [openPage, setOpenPage] = useState<WikiPage | null>(null);
  const [openArticle, setOpenArticle] = useState<WebArticle | null>(null);
  const [pageLoading, setPageLoading] = useState(false);

  // termos sugeridos: suspeitos, vítima e palavras-chave dos portais do caso
  const vocabulary = useMemo(() => {
    const v = new Set<string>();
    caseData.suspects.forEach((s) => v.add(s.name));
    v.add(caseData.victim.name);
    caseData.web.forEach((a) => a.keywords.forEach((k) => k.length > 3 && v.add(k)));
    return Array.from(v);
  }, [caseData]);

  const suggestions = useMemo(() => {
    const q = norm(draftQ.trim());
    if (q.length < 2) return [];
    return vocabulary.filter((t) => norm(t).includes(q) && norm(t) !== q).slice(0, 5);
  }, [draftQ, vocabulary]);

  const search = async (override?: string) => {
    if (threatOn && airplane) return;
    const query = (override ?? draftQ).trim();
    setQ(query);
    if (query.length < 2) return;
    setLoading(true);
    setSearched(true);
    setOpenPage(null);
    setOpenArticle(null);
    const low = query.toLowerCase();
    setLocal(
      caseData.web.filter(
        (a) =>
          a.keywords.some((k) => low.includes(k) || k.includes(low)) ||
          a.title.toLowerCase().includes(low) ||
          a.body.toLowerCase().includes(low)
      )
    );
    try {
      const res = await fetch(`/api/wsearch?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setWiki(data.results ?? []);
    } catch {
      setWiki([]);
    }
    setLoading(false);
  };

  const openWiki = async (title: string) => {
    setPageLoading(true);
    setOpenArticle(null);
    try {
      const res = await fetch(`/api/wsearch?title=${encodeURIComponent(title)}`);
      const data = await res.json();
      if (!data.error) setOpenPage(data);
    } catch {
      /* ignore */
    }
    setPageLoading(false);
  };

  /* -------- artigo/wiki aberto -------- */
  if (openArticle || openPage || pageLoading) {
    const art = openArticle;
    const pg = openPage;
    return (
      <AppShell
        title={art ? art.source : "pt.wikipedia.org"}
        onBack={() => {
          setOpenArticle(null);
          setOpenPage(null);
        }}
        headerBlack
      >
        {pageLoading ? (
          <div className="flex justify-center pt-20 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : art ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#c9a86a] mb-2 flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5" /> {art.source}
            </div>
            <h2 className="text-xl font-bold leading-snug mb-1">{art.title}</h2>
            <div className="text-[11px] text-neutral-400 mb-4">{art.url}</div>
            <p className="text-[14.5px] leading-relaxed text-neutral-200 whitespace-pre-line">{art.body}</p>
          </motion.div>
        ) : pg ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-neutral-400 mb-2">
              <BookOpenText className="w-3.5 h-3.5" /> Wikipédia, a enciclopédia livre
            </div>
            <h2 className="text-xl font-bold leading-snug mb-4">{pg.title}</h2>
            {pg.thumb && (
              <img src={pg.thumb} alt={pg.title} className="w-24 h-24 object-cover rounded-lg float-right ml-3 mb-2 border border-white/10" />
            )}
            <p className="text-[14px] leading-relaxed text-neutral-300">{pg.extract}</p>
            <div className="clear-both" />
            <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-neutral-400">
              Conteúdo real carregado ao vivo de pt.wikipedia.org — use para pesquisar medicamentos,
              leis e contextos do caso.
            </div>
          </motion.div>
        ) : null}
      </AppShell>
    );
  }

  return (
    <AppShell title="Safari">
      {threatOn && airplane && (
        <div className="mx-3 mt-3 rounded-lg border border-[#0a84ff]/40 bg-[#0b1d33] px-3.5 py-2.5 text-[12px] text-[#9fd0ff] leading-snug">
          <b>Modo avião ativo.</b> O navegador está offline — a memória do aparelho está congelada,
          mas não há conexão. Desative no app VPN ou na central de controle para pesquisar.
        </div>
      )}
      {/* barra de busca */}
      <div className="sticky top-0 z-10 bg-[#0b0b0e]/95 backdrop-blur px-3 pt-3 pb-2 border-b border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className="flex items-center gap-2 bg-[#1c1c1e] rounded-xl pl-3 pr-1 py-1.5"
        >
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            value={draftQ}
            onChange={(e) => {
              setDraftQ(e.target.value);
              sfx.type();
            }}
            placeholder="Busque suspeitos, remédios, locais…"
            className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-neutral-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#0a84ff] text-white text-[12px] font-semibold px-4 py-2 sm:py-1.5 active:opacity-80 min-h-[36px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ir"}
          </button>
        </form>
        {suggestions.length > 0 && (
          <div className="mt-2 rounded-lg border border-white/10 bg-[#141418] overflow-hidden">
            {suggestions.map((sug) => (
              <button
                key={sug}
                onClick={() => {
                  setDraftQ(sug);
                  search(sug);
                }}
                className="w-full text-left px-3 py-2 text-[12.5px] text-neutral-300 hover:bg-white/5 flex items-center gap-2"
              >
                <Search className="w-3 h-3 text-neutral-400 shrink-0" /> {sug}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-4 mt-2 px-1 text-[12px]">
          <button
            onClick={() => setTab("buscar")}
            className={tab === "buscar" ? "text-white font-semibold border-b-2 border-[#0a84ff] pb-1" : "text-neutral-400 pb-1"}
          >
            Investigar na web
          </button>
          <button
            onClick={() => setTab("historico")}
            className={tab === "historico" ? "text-white font-semibold border-b-2 border-[#0a84ff] pb-1" : "text-neutral-400 pb-1"}
          >
            Histórico da vítima
          </button>
        </div>
      </div>

      {tab === "historico" ? (
        <div className="px-3 pt-3">
          {caseData.history.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 py-3 border-b border-white/5"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1c1c1e] flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] truncate">{h.title}</div>
                <div className="text-[11px] text-neutral-400 truncate">{h.url} · {h.time}</div>
              </div>
              {h.evidenceId && <PinButton evidenceId={h.evidenceId} />}
            </motion.div>
          ))}
          <p className="px-1 pt-4 text-[11px] text-neutral-400">
            Cache exportado pela perícia. Compare-o com o que VOCÊ descobre na aba “Investigar”.
          </p>
        </div>
      ) : !searched ? (
        <div className="px-5 pt-10 text-center">
          <Globe className="w-10 h-10 text-neutral-700 mx-auto mb-4" />
          <p className="text-[13px] text-neutral-400 leading-relaxed">
            Este navegador está <span className="text-white font-semibold">conectado de verdade</span>:
            buscas consultam a Wikipédia ao vivo e os portais do caso.
          </p>
          <p className="text-[12px] text-neutral-400 mt-3 leading-relaxed">
            Investigue os suspeitos pelo nome. Confira álibis em sites de notícias. Pesquise os
            medicamentos e leis que aparecerem pelo caminho.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {["suspeitos", ...caseData.suspects.map((s) => s.name), caseData.victim.name].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setDraftQ(s);
                  search(s);
                }}
                className="rounded-full border border-white/15 text-[12px] text-neutral-300 px-3 py-1.5 hover:bg-white/5"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="pb-4">
          <AnimatePresence>
            {loading ? (
              <ForensicLoader label="Consultando fontes abertas…" lines={3} />
            ) : (
              <>
                {local.length === 0 && wiki.length === 0 && (
                  <div className="mx-4 mt-4 rounded-lg border border-dashed border-amber-500/40 bg-amber-950/15 p-4">
                    <div className="text-[11px] uppercase tracking-widest text-amber-300/90 font-bold mb-1">
                      Nada relevante para a investigação
                    </div>
                    <p className="text-[12.5px] text-neutral-300 leading-snug">
                      “{q}” não retornou nada ligado a este caso. Tente o nome de um suspeito, da
                      vítima, de um local citado no dossiê ou de um medicamento/objeto da perícia.
                    </p>
                  </div>
                )}
                {local.length > 0 && (
                  <div className="pt-3">
                    <div className="px-4 pb-1 text-[10px] uppercase tracking-[0.25em] text-[#c9a86a]">
                      Portais do caso
                    </div>
                    {local.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setOpenArticle(a);
                          setOpenPage(null);
                        }}
                        className="w-full text-left px-4 py-3 border-b border-white/5 active:bg-white/5"
                      >
                        <div className="text-[11px] text-emerald-400/80">{a.url}</div>
                        <div className="text-[15px] text-[#6ea8ff] leading-snug">{a.title}</div>
                        <div className="text-[12px] text-neutral-400 line-clamp-2 mt-0.5">{a.body}</div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="pt-3">
                  <div className="px-4 pb-1 text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                    Web real · Wikipédia
                  </div>
                  {wiki.length === 0 ? (
                    <p className="px-4 py-3 text-[12px] text-neutral-400">
                      Nenhum resultado na enciclopédia para “{q}”.
                    </p>
                  ) : (
                    wiki.map((w) => (
                      <button
                        key={w.title}
                        onClick={() => openWiki(w.title)}
                        className="w-full text-left px-4 py-3 border-b border-white/5 active:bg-white/5 flex items-center gap-2"
                      >
                        <ChevronLeft className="w-3 h-3 text-neutral-400 rotate-180 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[11px] text-emerald-400/80">pt.wikipedia.org</div>
                          <div className="text-[15px] text-[#6ea8ff] leading-snug">{w.title}</div>
                          {w.snippet && (
                            <div className="text-[12px] text-neutral-400 line-clamp-2 mt-0.5">{w.snippet}</div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </AppShell>
  );
}
