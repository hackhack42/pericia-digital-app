"use client";

/** Estado de leitura persistido por caso (notificações, mídias recuperadas, etc.). */

const key = (caseId: string, bucket: string) => `caso2471_read_${bucket}_${caseId}`;

export function loadRead(caseId: string, bucket: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key(caseId, bucket));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markRead(caseId: string, bucket: string, id: string): string[] {
  const cur = loadRead(caseId, bucket);
  if (cur.includes(id)) return cur;
  const next = [...cur, id];
  localStorage.setItem(key(caseId, bucket), JSON.stringify(next));
  return next;
}

export function markAllRead(caseId: string, bucket: string, ids: string[]): string[] {
  const next = Array.from(new Set([...loadRead(caseId, bucket), ...ids]));
  localStorage.setItem(key(caseId, bucket), JSON.stringify(next));
  return next;
}

export function clearRead(caseId: string) {
  if (typeof window === "undefined") return;
  ["notif", "deleted", "audio"].forEach((b) =>
    localStorage.removeItem(key(caseId, b))
  );
}
