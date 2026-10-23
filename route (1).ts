import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  verifyPassword,
  signToken,
  COOKIE_NAME,
  COOKIE_OPTS,
  type AgentPayload,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { matricula, password, remember } = await req.json();
  if (!matricula || !password) {
    return NextResponse.json({ error: "Matrícula e senha obrigatórias." }, { status: 400 });
  }

  const [agent] = await db
    .select()
    .from(agents)
    .where(eq(agents.matricula, matricula.trim().toUpperCase()));

  if (!agent) {
    return NextResponse.json({ error: "Matrícula não encontrada." }, { status: 401 });
  }

  const ok = await verifyPassword(password, agent.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const payload: AgentPayload = {
    id: agent.id,
    matricula: agent.matricula,
    nome: agent.nome,
    genero: agent.genero,
    avatarDataUrl: agent.avatarDataUrl ?? null,
  };

  const token = signToken(payload);
  const res = NextResponse.json({ ok: true, agent: payload });
  const opts = remember === false
      ? { ...COOKIE_OPTS, maxAge: 60 * 60 * 24 } // 1 dia
      : COOKIE_OPTS;
  res.cookies.set(COOKIE_NAME, token, opts);
  return res;
}
