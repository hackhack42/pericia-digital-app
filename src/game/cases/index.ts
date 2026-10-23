import type { CaseData } from "../types";
import { faceFor } from "../faces";
import { tutorialCase } from "./tutorial";
import { marinaCase } from "./marina";
import { otavioCase } from "./otavio";
import { laraCase } from "./lara";
import { vivianCase } from "./vivian";
import { danteCase } from "./dante";
import { ingridCase } from "./ingrid";
import { matheusCase } from "./matheus";
import { igorCase } from "./igor";
import { chloeCase } from "./chloe";
import { tcheloCase } from "./tchelo";
import { rostovaCase } from "./rostova";
import { nandoCase } from "./nando";
import { arthurCase } from "./arthur";
import { wilsonCase } from "./wilson";
import { iqueCase } from "./ique";
import { kaueCase } from "./kaue";
import { arquivo13Case } from "./arquivo13";

/**
 * Normaliza todos os retratos: gênero coerente com o nome e
 * nenhuma foto repetida dentro do mesmo caso.
 */
function assignFaces(cases: Record<string, CaseData>): Record<string, CaseData> {
  for (const [caseId, c] of Object.entries(cases)) {
    const used = new Set<string>();
    const salt = caseId.length * 3;

    // vítima primeiro (garante a foto do card)
    c.victim.photo = faceFor(c.victim.name, used, salt);

    // suspeitos
    c.suspects.forEach((s) => {
      s.avatar = faceFor(s.name, used, salt + 1);
    });

    // conversas: tenta casar pelo nome do suspeito
    c.conversations.forEach((conv) => {
      const suspect = c.suspects.find((s) => s.name.toLowerCase() === conv.name.toLowerCase());
      if (suspect) {
        conv.avatar = suspect.avatar;
      } else if (conv.avatar) {
        conv.avatar = faceFor(conv.name, used, salt + 2);
      }
    });

    // posts sociais
    c.social?.forEach((post) => {
      const suspect = c.suspects.find((s) => s.name.toLowerCase() === post.author.toLowerCase());
      if (suspect) post.avatar = suspect.avatar;
      else if (post.avatar) post.avatar = faceFor(post.author, used, salt + 3);
    });

    // conversas ao vivo (aba Conversa Ativa)
    c.chats?.forEach((thread) => {
      const suspect = c.suspects.find((s) => s.name.toLowerCase() === thread.name.toLowerCase());
      if (suspect) thread.avatar = suspect.avatar;
      else if (thread.avatar) thread.avatar = faceFor(thread.name, used, salt + 4);
    });
  }
  return cases;
}

const RAW_CASES: Record<string, CaseData> = {
  tutorial: tutorialCase,
  nando: nandoCase,
  marina: marinaCase,
  otavio: otavioCase,
  tchelo: tcheloCase,
  igor: igorCase,
  matheus: matheusCase,
  lara: laraCase,
  chloe: chloeCase,
  vivian: vivianCase,
  dante: danteCase,
  ingrid: ingridCase,
  rostova: rostovaCase,
  arthur: arthurCase,
  wilson: wilsonCase,
  ique: iqueCase,
  kaue: kaueCase,
  arquivo13: arquivo13Case,
};

export const CASES: Record<string, CaseData> = assignFaces(RAW_CASES);

export const CASE_LIST: CaseData[] = [
  CASES.tutorial, CASES.nando, CASES.marina, CASES.wilson, CASES.otavio,
  CASES.tchelo, CASES.igor, CASES.ique, CASES.matheus, CASES.lara,
  CASES.chloe, CASES.vivian, CASES.dante, CASES.kaue, CASES.ingrid,
  CASES.rostova, CASES.arthur, CASES.arquivo13,
];

export function getCase(id: string): CaseData {
  return CASES[id] ?? marinaCase;
}

export const CLOUD_UNLOCK_AT = 6;
