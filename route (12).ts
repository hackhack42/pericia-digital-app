import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameSessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  let caseId = "marina";
  try {
    const body = await req.json();
    if (body?.caseId && typeof body.caseId === "string") caseId = body.caseId;
  } catch {
    /* empty body ok */
  }
  const [row] = await db.insert(gameSessions).values({ caseId }).returning();
  return NextResponse.json(row);
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  const [row] = await db.select().from(gameSessions).where(eq(gameSessions.id, id));
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, evidence, answered, phoneUnlocked, solved, hints, chat } = body ?? {};
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (Array.isArray(evidence)) patch.evidence = evidence;
  if (answered && typeof answered === "object") patch.answered = answered;
  if (chat && typeof chat === "object") patch.chat = chat;
  if (typeof phoneUnlocked === "boolean") patch.phoneUnlocked = phoneUnlocked;
  if (typeof solved === "boolean") patch.solved = solved;
  if (typeof hints === "number") patch.hints = hints;

  const [row] = await db
    .update(gameSessions)
    .set(patch)
    .where(eq(gameSessions.id, id))
    .returning();
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(row);
}
