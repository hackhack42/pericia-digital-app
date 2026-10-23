import { sendGameover } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameSessions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { SOLUTIONS, type AccuseResult } from "@/game/solutions";
import { CORRECT_METHOD } from "@/game/methods";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, suspect, motive, method, evidence } = body ?? {};
  if (!id || !suspect || !motive || !Array.isArray(evidence)) {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  const [session] = await db
    .select()
    .from(gameSessions)
    .where(eq(gameSessions.id, id));
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });

  const solution = SOLUTIONS[session.caseId] ?? SOLUTIONS.marina;

  const selected: string[] = evidence.filter((e: unknown) => typeof e === "string");
  const hasAllKeys = solution.keyEvidence.every((k) => selected.includes(k));

  const methodOk = !method || method === CORRECT_METHOD[session.caseId];

  let result: AccuseResult;
  if (suspect !== solution.suspect) {
    result = "wrong";
  } else if (motive === solution.motive && hasAllKeys && methodOk) {
    result = "perfect";
  } else {
    result = "weak";
  }

  const [row] = await db
    .update(gameSessions)
    .set({
      attempts: sql`${gameSessions.attempts} + 1`,
      solved: result === "perfect" ? true : session.solved,
      updatedAt: new Date(),
    })
    .where(eq(gameSessions.id, id))
    .returning();

  return NextResponse.json({
    result,
    attempts: row.attempts,
    solved: row.solved,
    methodOk,
  });
}
