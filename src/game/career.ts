/** Carreira do perito — reputação, XP, patentes e medalhas (localStorage). */

export const CAREER_KEY = "caso2471_carreira";

export type CaseOutcome = "perfect" | "weak" | "wrong";

export type CaseRecord = {
  caseId: string;
  outcome: CaseOutcome;
  elapsed: number;
  hints: number;
  pinTries: number;
  attempts: number;
  evidence: number;
  at: string;
};

export type Career = {
  xp: number;
  reputation: number; // 0..100
  records: CaseRecord[];
  medals: string[];
};

export const EMPTY_CAREER: Career = { xp: 0, reputation: 60, records: [], medals: [] };

/* ---------------- Patentes ---------------- */
export type Rank = { id: number; name: string; min: number; color: string };

export const RANKS: Rank[] = [
  { id: 1, name: "Estagiário de Perícia", min: 0, color: "#8e8e93" },
  { id: 2, name: "Perito Junior", min: 100, color: "#6ea8ff" },
  { id: 3, name: "Perito Pleno", min: 250, color: "#79d17a" },
  { id: 4, name: "Perito Senior", min: 450, color: "#c9a86a" },
  { id: 5, name: "Chefe de Perícia Digital", min: 700, color: "#e0a63c" },
];

export function rankOf(xp: number): Rank {
  let r: Rank = RANKS[0];
  for (const x of RANKS) if (xp >= x.min) r = x;
  return r;
}

export function nextRank(xp: number) {
  return RANKS.find((r) => r.min > xp) ?? null;
}

export function rankProgress(xp: number) {
  const cur = rankOf(xp);
  const nxt = nextRank(xp);
  if (!nxt) return 100;
  return Math.round(((xp - cur.min) / (nxt.min - cur.min)) * 100);
}

/* ---------------- Medalhas ---------------- */
export const MEDALS: { id: string; name: string; desc: string; icon: string }[] = [
  { id: "primeiro", name: "Primeiro Inquérito", desc: "Encerrou seu primeiro caso com condenação.", icon: "🎖️" },
  { id: "limpo", name: "Ficha Limpa", desc: "Três condenações seguidas sem erro.", icon: "🏅" },
  { id: "sem_dica", name: "Olhar Clínico", desc: "Resolveu um caso sem usar nenhuma dica.", icon: "👁️" },
  { id: "rapido", name: "Mão Rápida", desc: "Resolveu um caso em menos de 12 minutos.", icon: "⚡" },
  { id: "primeira", name: "Tiro Certeiro", desc: "Condenação na primeira tentativa de mandado.", icon: "🎯" },
  { id: "cofre", name: "Arrombador de Cofres", desc: "Abriu o cofre oculto de um aparelho.", icon: "🔐" },
  { id: "arquivista", name: "Arquivista", desc: "Encerrou cinco casos diferentes.", icon: "📚" },
  { id: "chefe", name: "Chefe de Perícia", desc: "Alcançou a patente máxima.", icon: "👑" },
];

/* ---------------- Persistência ---------------- */
export function loadCareer(): Career {
  if (typeof window === "undefined") return EMPTY_CAREER;
  try {
    const raw = localStorage.getItem(CAREER_KEY);
    if (!raw) return EMPTY_CAREER;
    const c = JSON.parse(raw);
    return {
      xp: Number(c.xp) || 0,
      reputation: typeof c.reputation === "number" ? c.reputation : 60,
      records: Array.isArray(c.records) ? c.records : [],
      medals: Array.isArray(c.medals) ? c.medals : [],
    };
  } catch {
    return EMPTY_CAREER;
  }
}

export function saveCareer(c: Career) {
  localStorage.setItem(CAREER_KEY, JSON.stringify(c));
}

export function grantMedal(id: string): Career {
  const c = loadCareer();
  if (!c.medals.includes(id)) {
    c.medals.push(id);
    saveCareer(c);
  }
  return c;
}

/* ---------------- Registro de resultado ---------------- */
export function recordCase(rec: CaseRecord): { career: Career; xpGain: number; repDelta: number; newMedals: string[] } {
  const c = loadCareer();
  let xpGain = 0;
  let repDelta = 0;

  if (rec.outcome === "perfect") {
    xpGain = 120 - Math.min(40, rec.hints * 8) - Math.min(20, (rec.attempts - 1) * 10);
    xpGain = Math.max(45, xpGain);
    repDelta = 12;
  } else if (rec.outcome === "weak") {
    xpGain = 30;
    repDelta = -6;
  } else {
    xpGain = 5;
    repDelta = -16;
  }

  c.xp = Math.max(0, c.xp + xpGain);
  c.reputation = Math.max(0, Math.min(100, c.reputation + repDelta));
  c.records = [rec, ...c.records].slice(0, 60);

  const before = new Set(c.medals);
  const solved = c.records.filter((r) => r.outcome === "perfect");
  const add = (id: string) => !c.medals.includes(id) && c.medals.push(id);

  if (rec.outcome === "perfect") {
    add("primeiro");
    if (rec.hints === 0) add("sem_dica");
    if (rec.elapsed > 0 && rec.elapsed < 720) add("rapido");
    if (rec.attempts <= 1) add("primeira");
    if (new Set(solved.map((r) => r.caseId)).size >= 5) add("arquivista");
    const last3 = c.records.slice(0, 3);
    if (last3.length === 3 && last3.every((r) => r.outcome === "perfect")) add("limpo");
  }
  if (rankOf(c.xp).id === 5) add("chefe");

  saveCareer(c);
  const newMedals = c.medals.filter((m) => !before.has(m));
  return { career: c, xpGain, repDelta, newMedals };
}

/* ---------------- Estatísticas ---------------- */
export function stats(c: Career) {
  const total = c.records.length;
  const solved = c.records.filter((r) => r.outcome === "perfect").length;
  const weak = c.records.filter((r) => r.outcome === "weak").length;
  const wrong = c.records.filter((r) => r.outcome === "wrong").length;
  const uniqueSolved = new Set(c.records.filter((r) => r.outcome === "perfect").map((r) => r.caseId)).size;
  const accuracy = total ? Math.round((solved / total) * 100) : 0;
  const avgHints = total ? +(c.records.reduce((a, r) => a + r.hints, 0) / total).toFixed(1) : 0;
  const avgTime = solved
    ? Math.round(c.records.filter((r) => r.outcome === "perfect").reduce((a, r) => a + r.elapsed, 0) / solved)
    : 0;
  return { total, solved, weak, wrong, uniqueSolved, accuracy, avgHints, avgTime };
}

/* ---------------- Dificuldade adaptativa ---------------- */
export const LOW_REP = 35;
export const HIGH_REP = 70;

/** Recursos de apoio limitados quando a reputação está no chão. */
export function hintBudget(c: Career, total: number) {
  if (c.reputation < LOW_REP) return 2;
  if (c.reputation < HIGH_REP) return Math.max(3, Math.ceil(total * 0.7));
  return total;
}

/** Mensagem da chefia conforme a reputação. */
export function bossMessage(c: Career): { tone: "pressure" | "neutral" | "praise"; text: string } | null {
  const rank = rankOf(c.xp);
  if (c.reputation < LOW_REP) {
    return {
      tone: "pressure",
      text:
        "CORREGEDORIA: Sua reputação está em nível crítico. Dois mandados mal fundamentados e você volta ao arquivo morto. " +
        "Recursos de apoio ficam restritos até você limpar essa ficha — só duas dicas por caso.",
    };
  }
  if (c.reputation >= HIGH_REP && rank.id >= 3) {
    return {
      tone: "praise",
      text: `DELEGADO: Sua ficha impressiona, ${rank.name}. Liberei os casos de alta complexidade para você — aparelhos com criptografia reforçada e pistas cruzadas.`,
    };
  }
  if (c.records.length === 0) return null;
  return {
    tone: "neutral",
    text: "DELEGADO: Continue assim. Fundamente bem cada mandado e a corregedoria não vai encher o seu saco.",
  };
}

/** Caso bloqueado por patente insuficiente? */
export function caseLocked(c: Career, minRank?: number) {
  if (!minRank) return null;
  const r = rankOf(c.xp);
  if (r.id >= minRank) return null;
  const need = RANKS.find((x) => x.id === minRank);
  return need ? `Requer patente: ${need.name}` : null;
}
