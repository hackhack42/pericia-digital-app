import { NextRequest, NextResponse } from "next/server";
import { sendFeedback } from "@/lib/email";
import { agentFromCookie, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tipo, mensagem, caso, nota } = body;

  if (!mensagem?.trim() || mensagem.trim().length < 5) {
    return NextResponse.json({ error: "Mensagem muito curta." }, { status: 400 });
  }
  if (!tipo) {
    return NextResponse.json({ error: "Tipo obrigatório." }, { status: 400 });
  }

  const agent = agentFromCookie(req.cookies.get(COOKIE_NAME));
  const nome = agent?.nome ?? "Anônimo";
  const matricula = agent?.matricula ?? "—";

  const ok = await sendFeedback({ nome, matricula, tipo, mensagem, caso, nota });
  return NextResponse.json({ ok });
}
