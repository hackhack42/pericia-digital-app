/**
 * Motor de diálogo do jogo (server-side).
 *
 * Não usa respostas prontas em sequência: interpreta o texto livre do jogador,
 * mantém o estado mental do personagem (suspeita, assuntos já tocados, tom da
 * conversa) e COMPÕE a resposta — abertura + núcleo + sondagem — variando
 * conforme esse estado. Se houver uma chave de LLM no ambiente, a rota pode
 * delegar a redação final; sem chave, este motor responde sozinho.
 */
import type { ChatThread, ChatOption, ChatVoice } from "./types";

export const BURN_LIMIT = 4;

export type EngineState = {
  sent: string[];
  suspicion: number;
  /** quantas mensagens já foram trocadas (para variar o tom) */
  turns: number;
};

export type EngineResult = {
  reply: string;
  topicId?: string;
  evidenceId?: string;
  jane?: string;
  suspicionDelta: number;
  /** disfarce queimado → caso perdido */
  blown: boolean;
  reason?: string;
};

/* ------------------------------------------------------------------ */
/* utilidades                                                          */
/* ------------------------------------------------------------------ */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOP = new Set([
  "a","o","as","os","de","da","do","das","dos","e","em","um","uma","que","para","pra","por","com",
  "no","na","nos","nas","se","eu","voce","vc","ele","ela","me","te","meu","minha","seu","sua","ao",
  "mais","mas","ja","la","isso","esse","essa","foi","era","ser","ter","tem","the","is","you",
]);

const tokens = (s: string) => normalize(s).split(" ").filter((t) => t.length > 2 && !STOP.has(t));

/** escolhe um item de forma estável a partir de uma semente (varia sem ser aleatório puro) */
function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/* ------------------------------------------------------------------ */
/* detecção de deslizes fatais                                         */
/* ------------------------------------------------------------------ */
const FATAL_PATTERNS: { re: RegExp; reason: string }[] = [
  { re: /\b(esta|ta|foi|morreu|morta|morto|falecid|obito|cadaver|corpo|assassinad)\w*\b.*\b(vivian|ela|vitima)\b|\b(vivian|ela)\b.*\b(morreu|morta|assassinad)\w*/, reason: "Você revelou que a vítima está morta." },
  { re: /\b(morri|estou morta|to morta|ela morreu|ele morreu|a vitima)\b/, reason: "Você revelou a morte da vítima." },
  { re: /\b(cbi|fbi|policia|policial|delegacia|detetive|investigador|agente federal|perito|pericia)\b/, reason: "Você se identificou como polícia." },
  { re: /\b(sou (da|do|o|a) \w+|aqui (e|eh) (a|o) \w*(policia|cbi|agente))\b/, reason: "Você entregou que não é a vítima." },
  { re: /\b(lisbon|patrick jane|cho|rigsby|van pelt)\b/, reason: "Você citou a equipe da CBI." },
  { re: /\b(voce (a )?matou|vc matou|assassino|voce e o assassino|confessa|confesse)\b/, reason: "Você acusou o suspeito diretamente." },
  { re: /\b(quem (e|eh) voce|nao sou (a|o) \w+|estou fingindo|disfarce)\b/, reason: "Você quebrou o personagem." },
];

const GREETING = /\b(oi|ola|olaa|bom dia|boa tarde|boa noite|ei|hey|alo|opa|tudo bem|td bem|como vai|obrigad|valeu|desculp|amor|querid)\b/;
const AGGRESSIVE = /\b(mentira|mentiroso|cala|idiota|monstro|desgracad|maldit|responde logo|fala logo|para de|chega de)\b/;

const DEFAULT_VOICE: ChatVoice = {
  smallTalk: [
    "Hm. Você está diferente hoje. Mais curta nas palavras.",
    "Certo… e além disso? Você não escreveria só isso a esta hora.",
    "Tudo bem. Mas não foi por isso que você me escreveu.",
  ],
  confused: [
    "Não sei bem o que você quer dizer com isso.",
    "Você está falando por metades. Isso não é do seu feitio.",
    "Essa frase não me diz nada. Seja mais clara.",
  ],
  repeat: [
    "Você já me perguntou isso. Literalmente a mesma coisa.",
    "De novo? Eu acabei de responder.",
    "Está tudo bem com você? Você está se repetindo.",
  ],
  pressed: [
    "Esse tom não combina com você.",
    "Calma. Você nunca falou comigo assim.",
    "Por que você está me tratando como suspeito?",
  ],
  alarmed: [
    "Espera. Tem alguma coisa errada aí.",
    "Você está estranha. Muito estranha.",
    "Quem está com o seu telefone?",
  ],
};

/* aberturas que mudam conforme o estado emocional */
const OPENERS_CALM = ["", "", "Certo. ", "Entendo. ", "Hm. "];
const OPENERS_TENSE = ["Olha… ", "Vou responder, mas repare no que você está perguntando. ", "Tudo bem. ", ""];
const PROBES = [
  "",
  "",
  " E você, está sentada?",
  " Me responda com calma.",
  " Você está sozinha aí?",
];

/* ------------------------------------------------------------------ */
/* casamento de assunto                                                */
/* ------------------------------------------------------------------ */
function scoreTopic(msg: string, msgTokens: string[], o: ChatOption): number {
  const nmsg = ` ${msg} `;
  let score = 0;
  for (const k of o.keywords) {
    const nk = normalize(k);
    if (!nk) continue;
    if (nmsg.includes(` ${nk} `) || nmsg.includes(nk)) {
      score = Math.max(score, nk.includes(" ") ? nk.length * 2 : nk.length);
    }
  }
  // reforço por sobreposição de tokens com o texto sugerido
  if (o.text) {
    const ot = new Set(tokens(o.text));
    let overlap = 0;
    for (const t of msgTokens) if (ot.has(t)) overlap++;
    if (overlap >= 2) score += overlap * 2;
  }
  return score;
}

/* ------------------------------------------------------------------ */
/* motor                                                               */
/* ------------------------------------------------------------------ */
export function runChatTurn(
  thread: ChatThread,
  rawMessage: string,
  state: EngineState
): EngineResult {
  const msg = normalize(rawMessage);
  const msgTokens = tokens(rawMessage);
  const seed = hash(msg + state.turns);
  const voice: ChatVoice = { ...DEFAULT_VOICE, ...(thread.voice ?? {}) };
  const impersonating = thread.mode === "impersonate";

  if (!msg) {
    return { reply: pick(voice.confused, seed), suspicionDelta: 0, blown: false };
  }

  /* 1. deslizes fatais (só valem no disfarce) */
  if (impersonating) {
    for (const f of FATAL_PATTERNS) {
      if (f.re.test(msg)) {
        return {
          reply: "…",
          suspicionDelta: BURN_LIMIT,
          blown: true,
          reason: f.reason,
        };
      }
    }
    for (const t of thread.taboo ?? []) {
      if (t.keywords.some((k) => msg.includes(normalize(k)))) {
        return {
          reply: "…espera. Por que VOCÊ está me perguntando isso?",
          suspicionDelta: BURN_LIMIT,
          blown: true,
          reason: t.reason,
        };
      }
    }
  }

  /* 2. melhor assunto */
  let best: ChatOption | null = null;
  let bestScore = 0;
  for (const o of thread.options) {
    const s = scoreTopic(msg, msgTokens, o);
    if (s > bestScore) {
      bestScore = s;
      best = o;
    }
  }

  const matched = best && bestScore >= 3 ? best : null;

  /* 3. assunto repetido */
  if (matched && state.sent.includes(matched.id)) {
    const delta = impersonating ? 1 : 0;
    return {
      reply: `${pick(voice.repeat, seed)} ${matched.reply.slice(0, 90)}…`,
      topicId: matched.id,
      suspicionDelta: delta,
      blown: state.suspicion + delta >= BURN_LIMIT && impersonating,
      reason: "Você se repetiu até levantar suspeita.",
    };
  }

  /* 4. assunto ainda bloqueado (falta contexto na conversa) */
  if (matched && (matched.requires ?? []).some((r) => !state.sent.includes(r))) {
    const delta = impersonating ? 1 : 0;
    return {
      reply:
        "Você está pulando etapas. Essa conversa não começa por aí — volte ao que estávamos tratando.",
      suspicionDelta: delta,
      blown: state.suspicion + delta >= BURN_LIMIT && impersonating,
      reason: "Você pulou o assunto e soou falsa.",
    };
  }

  /* 5. sem assunto: amenidade, agressão ou ruído */
  if (!matched) {
    const greeting = GREETING.test(msg);
    const aggressive = AGGRESSIVE.test(msg);
    const tense = state.suspicion >= BURN_LIMIT - 2;

    let line: string;
    let delta: number;

    if (aggressive) {
      line = pick(voice.pressed, seed);
      delta = impersonating ? 2 : 0;
    } else if (greeting && msgTokens.length <= 4) {
      line = pick(voice.smallTalk, seed);
      delta = 0;
    } else if (tense) {
      line = pick(voice.alarmed, seed);
      delta = impersonating ? 1 : 0;
    } else {
      line = pick(voice.confused, seed);
      delta = impersonating ? 1 : 0;
    }

    const blown = impersonating && state.suspicion + delta >= BURN_LIMIT;
    return {
      reply: blown ? "…" : line,
      suspicionDelta: delta,
      blown,
      reason: blown ? "O personagem percebeu que não é a vítima falando." : undefined,
    };
  }

  /* 6. resposta composta */
  const risk = matched.risk ?? 0;
  const delta = impersonating ? risk : 0;
  const after = state.suspicion + delta;
  const blown = impersonating && after >= BURN_LIMIT;

  if (blown) {
    return {
      reply: "…",
      topicId: matched.id,
      suspicionDelta: delta,
      blown: true,
      reason: "A pergunta foi arriscada demais e derrubou o disfarce.",
    };
  }

  const opener = after >= 2 ? pick(OPENERS_TENSE, seed) : pick(OPENERS_CALM, seed);
  const probe = impersonating && state.turns >= 2 && risk === 0 ? pick(PROBES, seed >> 3) : "";
  const reply = `${opener}${matched.reply}${probe}`.trim();

  return {
    reply,
    topicId: matched.id,
    evidenceId: matched.evidenceId,
    jane: matched.jane,
    suspicionDelta: delta,
    blown: false,
  };
}
