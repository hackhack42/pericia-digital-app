/** SERVER ONLY — monta a persona enviada à IA a partir dos dados do caso. */
import type { CaseData, ChatThread } from "./types";
import { SOLUTIONS } from "./solutions";
import type { AiPersona } from "./ai";

/** Termos que a IA jamais pode escrever (senhas do caso). */
export function forbiddenTerms(c: CaseData): string[] {
  return [c.pin, c.bank.password];
}

/** Fatos públicos que qualquer envolvido comentaria. */
export function publicFacts(c: CaseData): string[] {
  return [
    `Caso: ${c.title}.`,
    `Vítima: ${c.victim.name}, ${c.victim.age} anos, ${c.victim.role}.`,
    ...c.timeline.slice(0, 4).map(([t, d]) => `${t} — ${d}`),
  ];
}

/** Persona para a conversa por mensagens (modo disfarce / linha CBI). */
export function personaFromThread(c: CaseData, t: ChatThread): AiPersona {
  const suspect = c.suspects.find((s) => s.id === t.id);
  const solution = SOLUTIONS[c.id];
  const guilty = solution?.suspect === t.id;

  // O que o personagem sabe: o conteúdo das falas previstas para ele.
  const knows = t.options
    .filter((o) => o.risk <= 1)
    .map((o) => o.reply)
    .slice(0, 10);

  // O que ele esconde: as falas de maior risco (revelações sensíveis).
  const hides = t.options
    .filter((o) => o.risk >= 2)
    .map((o) => o.reply)
    .slice(0, 6);

  return {
    name: t.name,
    role: suspect?.role ? `${suspect.role} — ${t.sub}` : t.sub,
    persona:
      (suspect?.bio ? `${suspect.bio} ` : "") +
      `Escreve por mensagem de celular, de forma natural e curta.`,
    knows: knows.length ? knows : [t.intro],
    hides: guilty
      ? [
          ...hides,
          "Qualquer envolvimento direto na morte da vítima — você nega, justifica ou desconversa, e jamais confessa.",
        ]
      : hides,
    guilty,
  };
}

/** Persona para o interrogatório livre na sala da CBI. */
export function personaFromSuspect(c: CaseData, suspectId: string): AiPersona | null {
  const s = c.suspects.find((x) => x.id === suspectId);
  if (!s) return null;
  const solution = SOLUTIONS[c.id];
  const guilty = solution?.suspect === suspectId;
  const qs = c.interrogations[suspectId] ?? [];

  return {
    name: s.name,
    role: s.role,
    persona: `${s.bio} Sob interrogatório, mantém o próprio estilo: responde curto, com personalidade.`,
    // Sabe as respostas que já daria num interrogatório (sem as travadas por prova).
    knows: qs.filter((q) => !q.requiresEvidence).map((q) => `Sobre "${q.q}": ${q.a}`),
    hides: qs.filter((q) => q.requiresEvidence).map((q) => `Sobre "${q.q}": ${q.a}`),
    guilty,
  };
}
