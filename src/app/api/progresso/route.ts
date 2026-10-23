import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { progressosJogadores } from "@/db/schema";
import { and, eq } from "drizzle-orm";

/** Salva/atualiza o progresso agregado do jogador (sync entre dispositivos). */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { usuarioId, casoId, dispositivos, pistas, tempo, concluido } = body ?? {};
  if (!usuarioId || !casoId) {
    return NextResponse.json({ error: "usuarioId e casoId são obrigatórios" }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(progressosJogadores)
    .where(
      and(eq(progressosJogadores.usuarioId, usuarioId), eq(progressosJogadores.casoId, casoId))
    );

  const values = {
    dispositivosDesbloqueados: Array.isArray(dispositivos) ? dispositivos : [],
    pistasEncontradas: Array.isArray(pistas) ? pistas : [],
    tempoJogadoSegundos: typeof tempo === "number" ? Math.floor(tempo) : 0,
    concluido: !!concluido,
    atualizadoEm: new Date(),
  };

  const [row] = existing
    ? await db
        .update(progressosJogadores)
        .set(values)
        .where(eq(progressosJogadores.id, existing.id))
        .returning()
    : await db
        .insert(progressosJogadores)
        .values({ usuarioId, casoId, ...values })
        .returning();

  return NextResponse.json(row);
}

export async function GET(req: NextRequest) {
  const usuarioId = req.nextUrl.searchParams.get("usuarioId");
  if (!usuarioId) return NextResponse.json({ error: "missing usuarioId" }, { status: 400 });
  const rows = await db
    .select()
    .from(progressosJogadores)
    .where(eq(progressosJogadores.usuarioId, usuarioId));
  return NextResponse.json({ progressos: rows });
}
