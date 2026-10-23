import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCase } from "@/game/cases";
import { runChatTurn, BURN_LIMIT, type EngineState } from "@/game/chatEngine";
import { generateReply, aiEnabled } from "@/game/ai";
import { personaFromThread, publicFacts, forbiddenTerms } from "@/game/personas";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, threadId, message, history } = body ?? {};
  if (!id || !threadId || typeof message !== "string") {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  const [session] = await db.select().from(gameSessions).where(eq(gameSessions.id, id));
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (session.caseLost) {
    return NextResponse.json({ error: "caso perdido", caseLost: true }, { status: 409 });
  }

  const caseData = getCase(session.caseId);
  const thread = caseData.chats?.find((t) => t.id === threadId);
  if (!thread) return NextResponse.json({ error: "conversa inexistente" }, { status: 404 });

  const prev = session.chat?.[threadId] ?? { sent: [], suspicion: 0 };
  const state: EngineState = {
    sent: prev.sent,
    suspicion: prev.suspicion,
    turns: prev.sent.length,
  };

  // 1) Motor determinístico decide SEMPRE: provas, suspeita e veredito.
  const result = runChatTurn(thread, message, state);

  const nextSent =
    result.topicId && !prev.sent.includes(result.topicId)
      ? [...prev.sent, result.topicId]
      : prev.sent;
  const nextSuspicion = Math.min(BURN_LIMIT, prev.suspicion + result.suspicionDelta);
  const caseLost = result.blown && thread.mode === "impersonate";

  // 2) IA só dá VOZ ao resultado — nunca muda a lógica do jogo.
  let reply = result.reply;
  let ai = false;
  if (!caseLost && aiEnabled() && reply !== "…") {
    const persona = personaFromThread(caseData, thread);
    const hist = Array.isArray(history)
      ? (history as { role: "player" | "character"; text: string }[]).slice(-8)
      : [];
    const generated = await generateReply(
      persona,
      {
        mode: thread.mode === "impersonate" ? "impersonate" : "interrogation",
        caseTitle: caseData.title,
        victimName: caseData.victim.name,
        publicFacts: publicFacts(caseData),
        playerEvidence: session.evidence.map((e) => caseData.evidence[e]?.title ?? e),
        suspicion: nextSuspicion,
        history: hist,
      },
      message,
      forbiddenTerms(caseData),
      result.topicId
        ? `Transmita exatamente este conteúdo, com suas próprias palavras e mantendo todos os fatos: "${result.reply}"`
        : `Você não tem informação sobre o que foi perguntado. Reaja de forma natural e curta, sem inventar fatos novos, no espírito de: "${result.reply}"`
    );
    if (generated) {
      reply = generated;
      ai = true;
    }
  }

  const nextChat = {
    ...(session.chat ?? {}),
    [threadId]: { sent: nextSent, suspicion: nextSuspicion },
  };
  const evidence =
    result.evidenceId && !session.evidence.includes(result.evidenceId)
      ? [...session.evidence, result.evidenceId]
      : session.evidence;

  await db
    .update(gameSessions)
    .set({ chat: nextChat, evidence, caseLost, updatedAt: new Date() })
    .where(eq(gameSessions.id, id));

  return NextResponse.json({
    reply,
    ai,
    jane: result.jane,
    evidenceId: result.evidenceId,
    suspicion: nextSuspicion,
    burnLimit: BURN_LIMIT,
    blown: result.blown,
    caseLost,
    reason: result.reason,
    burnedText: caseLost ? thread.burned : undefined,
  });
}
