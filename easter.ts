/**
 * Easter eggs do jogo.
 * Ativados por sequências de teclas (Konami-like), cliques ou palavras mágicas.
 */

export type EasterEgg = {
  id: string;
  trigger: "konami" | "keyword" | "date" | "matricula" | "click";
  /** para keyword: palavras que ativam */
  words?: string[];
  /** para date: MM-DD */
  date?: string;
  /** para matricula */
  matricula?: string;
  title: string;
  message: string;
  effect?: "confetti" | "glitch" | "rainbow" | "shake" | "love";
};

export const EASTER_EGGS: EasterEgg[] = [
  // ── Homenagem à Júlia ──────────────────────────────────────────────────
  {
    id: "julia",
    trigger: "keyword",
    words: ["julia", "júlia", "julia araújo", "julia freitas", "julia araujo"],
    title: "💛 Agente especial detectada",
    message:
      "Júlia Araújo Freitas · nascida em 26/08/2003 · a pessoa mais importante do inventor deste jogo. " +
      "Parabéns, amor — isso foi feito pensando em você. Feliz investigação! 🌸",
    effect: "love",
  },
  {
    id: "julia_birthday",
    trigger: "date",
    date: "08-26",
    title: "🎂 Aniversário especial!",
    message:
      "Hoje é dia 26 de agosto — aniversário de Júlia Araújo Freitas! " +
      "O criador deste jogo deixou isso aqui pra você achar. Feliz aniversário! 🎉💛",
    effect: "confetti",
  },
  {
    id: "julia_pin",
    trigger: "keyword",
    words: ["2608", "26082003"],
    title: "🔓 Código do coração",
    message:
      "26/08/2003. Esse número está escondido em algum lugar muito especial do jogo. " +
      "Quem sabe onde?",
    effect: "love",
  },

  // ── Admin / Dev ─────────────────────────────────────────────────────────
  {
    id: "admin",
    trigger: "matricula",
    matricula: "PD-2026-0426",
    title: "👑 Modo desenvolvedor ativo",
    message:
      "Bem-vindo, criador do jogo. Você tem acesso total: todos os casos desbloqueados, " +
      "XP máximo e modo deus ativo. Que a investigação comece!",
    effect: "rainbow",
  },
  {
    id: "konami",
    trigger: "konami",
    title: "🕹️ Código Konami ativado!",
    message:
      "↑↑↓↓←→←→BA — clássico eterno. Você ganhou um bônus secreto: modo neon por 60 segundos.",
    effect: "rainbow",
  },

  // ── Casos ───────────────────────────────────────────────────────────────
  {
    id: "jane",
    trigger: "keyword",
    words: ["patrick jane", "mentalist", "red john"],
    title: "🍵 Patrick Jane diz:",
    message:
      "Você está procurando pistas no lugar errado. As respostas sempre estão onde menos se espera — " +
      "geralmente debaixo do seu nariz, ou numa xícara de chá. Experimente olhar de novo.",
    effect: "glitch",
  },
  {
    id: "lisbon",
    trigger: "keyword",
    words: ["lisbon", "teresa lisbon"],
    title: "🚔 Agente Lisbon:",
    message:
      "Vamos manter isso profissional, detetive. Resolva o caso, escreva o relatório e vá pra casa. " +
      "Sem atalhos. (Mas se o Jane tiver uma teoria maluca, vale ouvir.)",
    effect: "glitch",
  },
  {
    id: "cbi",
    trigger: "keyword",
    words: ["cbi", "california bureau"],
    title: "🏢 CBI Sacramento",
    message:
      "California Bureau of Investigation — Unidade de Crimes Especiais. " +
      "Você está investigando os casos mais complexos do estado. Boa sorte — vai precisar.",
    effect: "glitch",
  },

  // ── Infiltrado ──────────────────────────────────────────────────────────
  {
    id: "infiltrado",
    trigger: "keyword",
    words: ["agente infiltrado", "infiltrado", "traidor"],
    title: "🕵️ Alerta da corregedoria",
    message:
      "ATENÇÃO: relatórios internos indicam que um agente infiltrado pode estar interferindo " +
      "nas investigações ativas. Se você notar informações inconsistentes no dossiê, " +
      "reporte imediatamente. O Arquivo 13 pode estar relacionado.",
    effect: "shake",
  },
  {
    id: "wipe_warning",
    trigger: "keyword",
    words: ["remote wipe", "wipe", "apagamento remoto"],
    title: "⚠️ Sistema de alerta",
    message:
      "Aviso: o grupo criminoso monitorado tem capacidade de executar apagamento remoto. " +
      "Mantenha a VPN ativa e o modo avião disponível. Não subestime a ameaça.",
    effect: "glitch",
  },
];

/** Verifica se algum easter egg de keyword é ativado pela frase digitada. */
export function checkKeyword(text: string): EasterEgg | null {
  const n = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const e of EASTER_EGGS.filter((x) => x.trigger === "keyword")) {
    if (e.words?.some((w) => n.includes(w.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))) return e;
  }
  return null;
}

/** Verifica easter egg por matrícula. */
export function checkMatricula(mat: string): EasterEgg | null {
  return EASTER_EGGS.find((e) => e.trigger === "matricula" && e.matricula === mat) ?? null;
}

/** Verifica easter egg por data (hoje). */
export function checkDate(): EasterEgg | null {
  const today = new Date();
  const mmdd = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return EASTER_EGGS.find((e) => e.trigger === "date" && e.date === mmdd) ?? null;
}

/** Sequência Konami: ↑↑↓↓←→←→ba */
const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a",
];
let konamiProgress = 0;

export function checkKonami(key: string): boolean {
  if (key === KONAMI[konamiProgress]) {
    konamiProgress++;
    if (konamiProgress === KONAMI.length) {
      konamiProgress = 0;
      return true;
    }
  } else {
    konamiProgress = key === KONAMI[0] ? 1 : 0;
  }
  return false;
}
