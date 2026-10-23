import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCase } from "@/game/cases";
import { normalize } from "@/game/chatEngine";
import { generateReply, aiEnabled } from "@/game/ai";
import { personaFromSuspect, publicFacts, forbiddenTerms } from "@/game/personas";
import type { Question } from "@/game/types";

/** Conectivos puros — não carregam assunto. */
const WEAK = new Set([
  "a","o","as","os","de","da","do","das","dos","e","em","um","uma","que","para","pra","por","com",
  "no","na","nos","nas","se","eu","voce","vocês","voces","ele","ela","me","te","meu","minha","seu",
  "sua","ao","mais","mas","ja","la","isso","esse","essa","foi","era","ser","ter","tem","the","is",
  "senhor","senhora","entao","então","agora","aqui","favor","diga","conta","contar","pode","podia",
  "quero","preciso","sobre","mesmo","ainda","tudo","nada","muito","qual","quais",
]);

/** Casa a pergunta livre do jogador com um tópico conhecido do interrogatório. */
function matchQuestion(msg: string, questions: Question[]): { q: Question; score: number } | null {
  const n = normalize(msg);
  const words = n.split(" ").filter((w) => w.length > 2 && !WEAK.has(w));
  if (words.length === 0) return null;

  // bigramas do jogador (capturam "onde estava", "que horas", "quem tinha")
  const meaningful = (a: string, b: string) => !WEAK.has(a) || !WEAK.has(b);
  const bigrams = new Set<string>();
  const raw = n.split(" ").filter(Boolean);
  for (let i = 0; i < raw.length - 1; i++) {
    if (meaningful(raw[i], raw[i + 1])) bigrams.add(`${raw[i]} ${raw[i + 1]}`);
  }

  let best: Question | null = null;
  let bestScore = 0;

  for (const q of questions) {
    const qn = normalize(q.q);
    const an = normalize(q.a);
    const qRaw = qn.split(" ").filter(Boolean);
    const qWords = new Set(qRaw.filter((w) => w.length > 2 && !WEAK.has(w)));
    const qBigrams = new Set<string>();
    for (let i = 0; i < qRaw.length - 1; i++) {
      if (meaningful(qRaw[i], qRaw[i + 1])) qBigrams.add(`${qRaw[i]} ${qRaw[i + 1]}`);
    }

    let score = 0;
    for (const w of words) {
      if (qWords.has(w)) score += 3;
      else if (w.length > 4 && an.includes(w)) score += 1;
    }
    // bigrama em comum vale muito (frases feitas de interrogatório)
    for (const b of bigrams) if (qBigrams.has(b)) score += 4;

    if (score > bestScore) {
      bestScore = score;
      best = q;
    }
  }
  return best && bestScore >= 4 ? { q: best, score: bestScore } : null;
}

/** Respostas de desvio, no personagem, quando a IA está indisponível. */
function deflect(name: string, seed: number, kind: "unknown" | "locked"): string {
  const unknown = [
    "Isso não tem nada a ver com o que aconteceu. Pergunte outra coisa.",
    "Não vejo relevância nenhuma nessa pergunta, detetive.",
    "Eu poderia responder, mas duvido que ajude vocês em alguma coisa.",
    "Essa pergunta é curiosidade sua ou faz parte do inquérito?",
    "Não sei. E se soubesse, não vejo por que isso importaria agora.",
  ];
  const locked = [
    "Eu não vou comentar isso sem que vocês me mostrem algo concreto.",
    "Vocês estão insinuando, não perguntando. Traga um documento e conversamos.",
    "Isso é especulação. Se tivessem prova disso, já teriam colocado na mesa.",
    "Não respondo a suposições, detetive. Me mostre o que vocês têm.",
  ];
  const arr = kind === "locked" ? locked : unknown;
  return `${arr[Math.abs(seed) % arr.length]}${kind === "locked" ? "" : ` — ${name.split(" ")[0]} desvia o olhar.`}`.replace(
    / — .* desvia o olhar\.$/,
    ""
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, suspectId, message, history } = body ?? {};
  if (!id || !suspectId || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  const [session] = await db.select().from(gameSessions).where(eq(gameSessions.id, id));
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });

  const caseData = getCase(session.caseId);
  const persona = personaFromSuspect(caseData, suspectId);
  if (!persona) return NextResponse.json({ error: "suspeito inexistente" }, { status: 404 });

  const questions = caseData.interrogations[suspectId] ?? [];
  const match = matchQuestion(message, questions);

  let locked: string | undefined;
  let answered: string | undefined;
  let guide: string;

  if (match) {
    const { q } = match;
    if (q.requiresEvidence && !session.evidence.includes(q.requiresEvidence)) {
      // Tópico sensível sem prova em mãos: ele desconversa.
      locked = caseData.evidence[q.requiresEvidence]?.title;
      guide =
        `O agente tocou num assunto delicado, mas NÃO apresentou nenhuma prova. ` +
        `Negue com calma, dê uma explicação banal e não revele nada do que você esconde.`;
    } else {
      answered = q.id;
      guide =
        `Transmita exatamente este conteúdo, com suas próprias palavras, mantendo todos os fatos: "${q.a}"`;
    }
  } else {
    guide =
      `Você não tem informação sobre isso. Responda no personagem, em 1 a 2 frases, sem inventar fatos novos, ` +
      `desviando ou devolvendo a pergunta.`;
  }

  let reply: string | null = null;
  let aiUsed = false;
  if (aiEnabled()) {
    const hist = Array.isArray(history)
      ? (history as { role: "player" | "character"; text: string }[]).slice(-8)
      : [];
    reply = await generateReply(
      persona,
      {
        mode: "interrogation",
        caseTitle: caseData.title,
        victimName: caseData.victim.name,
        publicFacts: publicFacts(caseData),
        playerEvidence: session.evidence.map((e) => caseData.evidence[e]?.title ?? e),
        suspicion: 0,
        history: hist,
      },
      message,
      forbiddenTerms(caseData),
      guide
    );
    aiUsed = !!reply;
  }

  // Fallback determinístico (IA fora do ar, sem cota ou resposta bloqueada).
  if (!reply) {
    const seed = message.length * 7 + (message.charCodeAt(0) || 0);
    if (answered && match) reply = match.q.a;
    else if (locked) reply = deflect(persona.name, seed, "locked");
    else reply = deflect(persona.name, seed, "unknown");
  }

  // Persiste o tópico respondido (libera a prova/registro no dossiê).
  let nextAnswered = session.answered;
  if (answered) {
    const list = session.answered?.[suspectId] ?? [];
    if (!list.includes(answered)) {
      nextAnswered = { ...(session.answered ?? {}), [suspectId]: [...list, answered] };
      await db
        .update(gameSessions)
        .set({ answered: nextAnswered, updatedAt: new Date() })
        .where(eq(gameSessions.id, id));
    }
  }

  return NextResponse.json({
    reply,
    ai: aiUsed,
    answeredId: answered,
    lockedEvidence: locked,
    answered: nextAnswered,
  });
}
