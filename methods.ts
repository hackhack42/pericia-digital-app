import type { Motive } from "./types";

/** Opções de método/arma por caso (usadas no Mandado de Prisão). */
export const METHODS: Record<string, Motive[]> = {
  tutorial: [
    { id: "empurrao", label: "Empurrão contra a estrutura do estoque" },
    { id: "objeto", label: "Golpe com objeto contundente" },
    { id: "queda", label: "Queda acidental, sem autoria" },
  ],
  marina: [
    { id: "clonazepam", label: "Clonazepam dissolvido em uísque (depressor + álcool)" },
    { id: "asfixia", label: "Asfixia mecânica" },
    { id: "overdose_acidental", label: "Overdose acidental autoadministrada" },
    { id: "golpe", label: "Golpe contundente na cabeça" },
  ],
  otavio: [
    { id: "digoxina", label: "Overdose de digoxina diluída no chá de boldo" },
    { id: "infarto", label: "Infarto natural, sem intervenção" },
    { id: "veneno_rato", label: "Raticida misturado ao vinho" },
    { id: "sufocamento", label: "Sufocamento com travesseiro" },
  ],
  lara: [
    { id: "grade", label: "Sabotagem da grade do mirante (corte prévio por serra)" },
    { id: "empurrao", label: "Empurrão direto no mirante" },
    { id: "sedativo", label: "Sedação antes da trilha" },
    { id: "acidente", label: "Acidente de trilha, sem autoria" },
  ],
  vivian: [
    { id: "succinilcolina", label: "Injeção de succinilcolina na nuca" },
    { id: "estrangulamento", label: "Estrangulamento com corda de violino" },
    { id: "hipnose", label: "Indução hipnótica ao suicídio" },
    { id: "veneno", label: "Veneno ingerido no camarim" },
  ],
  dante: [
    { id: "afogamento", label: "Afogamento forçado na piscina coberta" },
    { id: "eletrocussao", label: "Eletrocussão pela automação da casa" },
    { id: "queda", label: "Queda acidental no deque molhado" },
    { id: "sedativo", label: "Sedativo no uísque antes do nado" },
  ],
  ingrid: [
    { id: "cola", label: "Epóxi aplicado na trava interna do tanque" },
    { id: "algema", label: "Troca das algemas por um par sem mecanismo" },
    { id: "agua", label: "Aumento do nível de água do tanque" },
    { id: "acidente", label: "Falha mecânica acidental" },
  ],
  matheus: [
    { id: "amendoim", label: "Pasta de amendoim no quinto prato + caneta de adrenalina esvaziada" },
    { id: "faca", label: "Ferimento por faca de cozinha" },
    { id: "gas", label: "Vazamento de gás na cozinha" },
    { id: "contaminacao", label: "Contaminação cruzada acidental" },
  ],
};

/** Método correto por caso (validado no servidor). */
export const CORRECT_METHOD: Record<string, string> = {
  wilson: "guardacorpo",
  ique: "golpe_mar",
  kaue: "overdose",
  arquivo13: "forjado",
  igor: "talio",
  chloe: "carcere",
  tchelo: "barra",
  rostova: "exaustao",
  nando: "colisao",
  arthur: "iot",
  tutorial: "empurrao",
  marina: "clonazepam",
  otavio: "digoxina",
  lara: "grade",
  vivian: "succinilcolina",
  dante: "afogamento",
  ingrid: "cola",
  matheus: "amendoim",
};
