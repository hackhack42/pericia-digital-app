export type Gender = "f" | "m" | "n";

export type DetectiveProfile = {
  name: string;
  gender: Gender;
};

export const PROFILE_KEY = "caso2471_perfil";

/** "Sra." / "Sr." / "Agente" */
export function honorific(g: Gender): string {
  return g === "f" ? "Sra." : g === "m" ? "Sr." : "Agente";
}

/** "Detetive" / "Detetiva" (uso informal brasileiro) */
export function detectiveWord(g: Gender): string {
  return g === "f" ? "Detetive" : "Detetive";
}

/** Ex.: "Detetive Julia", "Sr. Daniel", "Agente Alex" */
export function addressed(p: DetectiveProfile | null, style: "detective" | "formal" = "detective"): string {
  if (!p?.name) return style === "formal" ? "Detetive" : "Detetive";
  const first = p.name.trim().split(/\s+/)[0];
  return style === "formal" ? `${honorific(p.gender)} ${first}` : `Detetive ${first}`;
}

/** Concordância: "bem-vinda" / "bem-vindo" / "bem-vindo(a)" */
export function gendered(g: Gender, f: string, m: string, n?: string): string {
  return g === "f" ? f : g === "m" ? m : (n ?? m);
}

/** Saudações variadas usadas por Lisbon/Jane. */
export function greet(p: DetectiveProfile | null, seed = 0): string {
  const who = addressed(p);
  const formal = addressed(p, "formal");
  const g = p?.gender ?? "n";
  const options = [
    `Vamos lá, ${who}.`,
    `${formal}, o caso é seu.`,
    `Bom trabalho, ${who}.`,
    `${who}, estamos prontos quando você estiver.`,
    `Seja bem-${gendered(g, "vinda", "vindo", "vindo(a)")}, ${who}.`,
  ];
  return options[Math.abs(seed) % options.length];
}

export function loadProfile(): DetectiveProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p && typeof p.name === "string" && p.name.trim()) {
      return { name: p.name, gender: (p.gender as Gender) ?? "n" };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function saveProfile(p: DetectiveProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}
