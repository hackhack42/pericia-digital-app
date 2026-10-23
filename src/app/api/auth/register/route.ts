import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  signToken,
  genMatricula,
  validatePassword,
  COOKIE_NAME,
  COOKIE_OPTS,
  type AgentPayload,
} from "@/lib/auth";
import { sendWelcome } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { nome, genero, password } = await req.json();

  if (!nome?.trim() || nome.trim().length < 2) {
    return NextResponse.json({ error: "Nome muito curto." }, { status: 400 });
  }
  const pwErr = validatePassword(password);
  if (pwErr) return NextResponse.json({ error: pwErr }, { status: 400 });

  const total = await db.select().from(agents);
  const matricula = genMatricula(total.length + 1);

  const existing = await db.select().from(agents).where(eq(agents.matricula, matricula));
  if (existing.length > 0) {
    return NextResponse.json({ error: "Tente novamente." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const [agent] = await db
    .insert(agents)
    .values({ matricula, nome: nome.trim(), genero: genero ?? "n", passwordHash })
    .returning();

  const payload: AgentPayload = {
    id: agent.id,
    matricula: agent.matricula,
    nome: agent.nome,
    genero: agent.genero,
    avatarDataUrl: agent.avatarDataUrl ?? null,
  };

  const token = signToken(payload);
  sendWelcome(agent.nome, agent.matricula).catch(() => {});
  const res = NextResponse.json({ ok: true, agent: payload });
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTS);
  return res;
}
