import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { agentFromCookie, COOKIE_NAME, signToken, COOKIE_OPTS } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const auth = agentFromCookie(req.cookies.get(COOKIE_NAME));
  if (!auth) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { nome, genero, avatarDataUrl } = await req.json();
  const patch: Record<string, unknown> = { updatedAt: new Date() };

  if (typeof nome === "string" && nome.trim().length >= 2) patch.nome = nome.trim();
  if (genero === "f" || genero === "m" || genero === "n") patch.genero = genero;
  if (typeof avatarDataUrl === "string" || avatarDataUrl === null) {
    if (avatarDataUrl && avatarDataUrl.length > 1_500_000) {
      return NextResponse.json({ error: "Imagem muito grande." }, { status: 400 });
    }
    patch.avatarDataUrl = avatarDataUrl;
  }

  const [row] = await db.update(agents).set(patch).where(eq(agents.id, auth.id)).returning();
  if (!row) return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });

  const payload = {
    id: row.id,
    matricula: row.matricula,
    nome: row.nome,
    genero: row.genero,
    avatarDataUrl: row.avatarDataUrl ?? null,
  };

  const token = signToken(payload);
  const res = NextResponse.json({ ok: true, agent: payload });
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTS);
  return res;
}
