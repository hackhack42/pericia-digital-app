/**
 * Sincroniza a carreira local (localStorage) com o banco do agente logado.
 * Estratégia: merge conservador — o maior XP vence; registros são concatenados (sem duplicata).
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { agentFromCookie, COOKIE_NAME } from "@/lib/auth";
import type { Career } from "@/game/career";

export async function POST(req: NextRequest) {
  const agent = agentFromCookie(req.cookies.get(COOKIE_NAME));
  if (!agent) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const local: Career = await req.json();

  const [row] = await db.select().from(agents).where(eq(agents.id, agent.id));
  if (!row) return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });

  // merge
  const remote: Career = {
    xp: row.xp,
    reputation: row.reputation,
    medals: (row.medals as string[]) ?? [],
    records: (row.records as Career["records"]) ?? [],
  };

  const mergedXp = Math.max(remote.xp, local.xp);
  const mergedRep = Math.max(remote.reputation, local.reputation);
  const mergedMedals = Array.from(new Set([...remote.medals, ...local.medals]));

  // registros: remote + locais que não existem no remote (por timestamp)
  const remoteTimes = new Set(remote.records.map((r) => r.at));
  const newRecs = local.records.filter((r) => !remoteTimes.has(r.at));
  const mergedRecords = [...remote.records, ...newRecs]
    .sort((a, b) => (b.at ?? "").localeCompare(a.at ?? ""))
    .slice(0, 60);

  await db
    .update(agents)
    .set({
      xp: mergedXp,
      reputation: mergedRep,
      medals: mergedMedals,
      records: mergedRecords,
      updatedAt: new Date(),
    })
    .where(eq(agents.id, agent.id));

  return NextResponse.json({
    xp: mergedXp,
    reputation: mergedRep,
    medals: mergedMedals,
    records: mergedRecords,
  });
}

export async function GET(req: NextRequest) {
  const agent = agentFromCookie(req.cookies.get(COOKIE_NAME));
  if (!agent) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const [row] = await db.select().from(agents).where(eq(agents.id, agent.id));
  if (!row) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json({
    xp: row.xp,
    reputation: row.reputation,
    medals: row.medals,
    records: row.records,
  });
}
