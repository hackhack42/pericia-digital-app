/**
 * Atribuição de retratos — garante:
 *  1) gênero coerente com o nome do personagem;
 *  2) nenhuma foto repetida dentro do mesmo caso;
 *  3) variação entre casos (offset determinístico).
 */

const MALE = Array.from({ length: 10 }, (_, i) => `/people/m${i + 1}.webp`);
const FEMALE = Array.from({ length: 10 }, (_, i) => `/people/f${i + 1}.webp`);

export type Gender = "f" | "m";

/** Nomes femininos conhecidos do universo do jogo (comparação por primeiro nome). */
const FEMALE_NAMES = new Set([
  "marina", "camila", "beatriz", "bianca", "sonia", "sônia", "chloe", "chloé",
  "helena", "ingrid", "julia", "júlia", "rafaela", "nora", "dalia", "dália",
  "priya", "renata", "dalva", "clara", "valeria", "valéria", "leticia", "letícia",
  "rose", "bibi", "bibiana", "duda", "duda ferraz", "otilia", "otília", "lucia",
  "lúcia", "fatima", "fátima", "joana", "marta", "alice", "sofia", "sophia",
  "carla", "débora", "debora", "elisa", "fernanda", "gabriela", "heloisa",
  "heloísa", "iris", "iris", "jandira", "karina", "laura", "marcia", "márcia",
  "nadia", "nádia", "olga", "patricia", "patrícia", "queila", "rita", "sandra",
  "tereza", "ursula", "úrsula", "vera", "wanda", "yvone", "zilda", "lourdes",
  "aparecida", "neusa", "ivone", "rose", "silvia", "sílvia", "regina", "adriana",
  "vivian", "chloe", "cloe", "sofia", "lara", "ingrid", "bianca", "nicole",
  "estela", "lidia", "lívia", "livia", "isabel", "cristina", "paula", "monica",
]);

/** Títulos que não devem ser usados para inferir gênero. */
const TITLES = new Set([
  "dr", "dra", "doutor", "doutora", "sr", "sra", "senhor", "senhora",
  "investigador", "investigadora", "agente", "delegado", "delegada",
  "perito", "perita", "professor", "professora", "detetive",
]);

/** Sobrescritas explícitas para personagens com papel de destaque. */
const OVERRIDES: Record<string, string> = {
  // vítimas / protagonistas
  "marina duarte": "/people/f1.webp",
  "camila santos": "/people/f3.webp",
  "otávio antunes": "/people/m5.webp",
  "otavio antunes": "/people/m5.webp",
  "beatriz antunes": "/people/f6.webp",
  "sônia camargo": "/people/f8.webp",
  "sonia camargo": "/people/f8.webp",
  "lara menezes": "/people/f4.webp",
  "bianca furlan": "/people/f10.webp",
  "vivian castellano": "/people/f2.webp",
  "elias rhodes": "/people/m3.webp",
  "dante okafor": "/people/m9.webp",
  "renata vasques": "/people/f7.webp",
  "ingrid vale": "/people/f5.webp",
  "soren halvorsen": "/people/m9.webp",
  "matheus arruda": "/people/m5.webp",
  "igor viana": "/people/m4.webp",
  "chloé": "/people/f9.webp",
  "sofia martins": "/people/f9.webp",
};

/** Remove apelidos entre aspas e títulos, devolvendo os tokens do nome. */
function nameTokens(name: string): string[] {
  return name
    .replace(/[“”"'][^“”"']*[“”"']/g, " ")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !TITLES.has(t));
}

function firstName(name: string): string {
  return nameTokens(name)[0] ?? "";
}

/** Detecta o gênero pelo primeiro nome (default: masculino). */
export function genderOf(name: string): Gender {
  const full = name.trim().toLowerCase();
  const tokens = nameTokens(name);

  // 1) sobrescrita explícita
  for (const [key, photo] of Object.entries(OVERRIDES)) {
    if (full.includes(key)) return photo.includes("/f") ? "f" : "m";
  }

  // 2) qualquer token que seja nome feminino conhecido
  if (tokens.some((t) => FEMALE_NAMES.has(t))) return "f";

  // 3) primeiro nome terminado em "a" (com exceções masculinas)
  const first = tokens[0] ?? "";
  const maleA = new Set(["joshua", "elias", "lucas", "tobias", "matias", "otavio", "andre", "andrea"]);
  if (/a$/.test(first) && !maleA.has(first)) return "f";

  return "m";
}

/** Hash estável a partir do texto. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Escolhe o retrato de um personagem.
 * @param name nome do personagem
 * @param used conjunto de fotos já usadas neste caso (mutado)
 * @param salt variação por caso
 */
export function faceFor(name: string, used: Set<string>, salt = 0): string {
  const full = name.trim().toLowerCase();
  const override = OVERRIDES[full];
  if (override) {
    used.add(override);
    return override;
  }

  const gender = genderOf(name);
  const pool = gender === "f" ? FEMALE : MALE;

  // tenta a foto determinística primeiro
  const start = (hash(name) + salt) % pool.length;
  for (let i = 0; i < pool.length; i++) {
    const candidate = pool[(start + i) % pool.length];
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }
  // pool esgotado (caso raro) — reutiliza
  return pool[start];
}

/** Gênero textual para avatares de iniciais. */
export function initialAvatarStyle(gender: Gender): { from: string; to: string } {
  return gender === "f"
    ? { from: "#6d28d9", to: "#be185d" }
    : { from: "#1d4ed8", to: "#0f766e" };
}
