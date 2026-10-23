import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { agentFromCookie, COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const agent = agentFromCookie(req.cookies.get(COOKIE_NAME));
  if (!agent) return NextResponse.json({ agent: null });

  const [row] = await db.select().from(agents).where(eq(agents.id, agent.id));
  if (!row) return NextResponse.json({ agent: null });

  return NextResponse.json({
    agent: {
      id: row.id,
      matricula: row.matricula,
      nome: row.nome,
      genero: row.genero,
      avatarDataUrl: row.avatarDataUrl ?? null,
      xp: row.xp,
      reputation: row.reputation,
      medals: row.medals,
      records: row.records,
    },
  });
}
