import { pgTable, uuid, text, jsonb, boolean, integer, timestamp } from "drizzle-orm/pg-core";

/** Contas de agente (login). */
export const agents = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  matricula: text("matricula").notNull().unique(),
  nome: text("nome").notNull(),
  genero: text("genero").notNull().default("n"),
  avatarDataUrl: text("avatar_data_url"),
  passwordHash: text("password_hash").notNull(),
  xp: integer("xp").notNull().default(0),
  reputation: integer("reputation").notNull().default(60),
  medals: jsonb("medals").$type<string[]>().notNull().default([]),
  records: jsonb("records").$type<unknown[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Agent = typeof agents.$inferSelect;

export const gameSessions = pgTable("game_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: text("case_id").notNull().default("marina"),
  evidence: jsonb("evidence").$type<string[]>().notNull().default([]),
  answered: jsonb("answered").$type<Record<string, string[]>>().notNull().default({}),
  chat: jsonb("chat")
    .$type<Record<string, { sent: string[]; suspicion: number }>>()
    .notNull()
    .default({}),
  phoneUnlocked: boolean("phone_unlocked").notNull().default(false),
  hints: integer("hints").notNull().default(0),
  caseLost: boolean("case_lost").notNull().default(false),
  attempts: integer("attempts").notNull().default(0),
  solved: boolean("solved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type GameSession = typeof gameSessions.$inferSelect;

/** Progresso agregado por jogador — suporte a sincronização/multiplayer. */
export const progressosJogadores = pgTable("progressos_jogadores", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuarioId: text("usuario_id").notNull(),
  casoId: text("caso_id").notNull(),
  dispositivosDesbloqueados: text("dispositivos_desbloqueados").array(),
  pistasEncontradas: text("pistas_encontradas").array(),
  tempoJogadoSegundos: integer("tempo_jogado_segundos").default(0),
  concluido: boolean("concluido").default(false),
  criadoEm: timestamp("criado_em", { withTimezone: true }).defaultNow(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).defaultNow(),
});

export type ProgressoJogador = typeof progressosJogadores.$inferSelect;
