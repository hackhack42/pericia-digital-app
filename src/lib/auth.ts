/**
 * Autenticação — server-only.
 * bcryptjs para hash de senha · JWT (jsonwebtoken) para sessão em cookie httpOnly.
 */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const SECRET = process.env.JWT_SECRET ?? "pericia-digital-dev-secret-mude-em-producao";
const SALT_ROUNDS = 10;
export const COOKIE_NAME = "pd_agent";

export type AgentPayload = {
  id: string;
  matricula: string;
  nome: string;
  genero: string;
  avatarDataUrl?: string | null;
};

/* ---- hash / verify ---- */
export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, SALT_ROUNDS);
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

/* ---- JWT ---- */
export function signToken(payload: AgentPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "90d" });
}

export function verifyToken(token: string): AgentPayload | null {
  try {
    return jwt.verify(token, SECRET) as AgentPayload;
  } catch {
    return null;
  }
}

/** Extrai o agente do cookie (pode ser chamado em route handlers). */
export function agentFromCookie(
  cookie: RequestCookie | undefined
): AgentPayload | null {
  if (!cookie?.value) return null;
  return verifyToken(cookie.value);
}

/** Gera a matrícula — ex.: "PD-2024-0042" */
export function genMatricula(id: number): string {
  return `PD-${new Date().getFullYear()}-${String(id).padStart(4, "0")}`;
}

/** Regras de senha: mínimo 6 chars */
export function validatePassword(pw: string): string | null {
  if (!pw || pw.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
  return null;
}

/**
 * O cookie usa `secure: false` porque o preview roda atrás de um proxy que
 * termina TLS: com `secure: true` o navegador descarta o Set-Cookie e a sessão
 * nunca persiste. httpOnly + sameSite=lax seguem protegendo contra XSS/CSRF.
 */
export const COOKIE_OPTS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 90, // 90 dias
  path: "/",
};
