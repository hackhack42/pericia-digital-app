export type EvidenceItem = { id: string; title: string; desc: string; source: string };

export type Msg = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  evidenceId?: string;
  /** tipo especial de mensagem */
  kind?: "audio" | "deleted" | "image";
  /** duração do áudio (ex.: "0:14") */
  duration?: string;
  /** transcrição com lacunas de corrupção */
  transcript?: string;
  /** url da imagem (kind=image) */
  url?: string;
};

export type Conversation = {
  id: string;
  name: string;
  sub: string;
  avatar?: string;
  time: string;
  unread?: number;
  messages: Msg[];
};

export type Call = {
  id: string;
  name: string;
  sub?: string;
  type: "in" | "out" | "missed";
  time: string;
  duration?: string;
  evidenceId?: string;
};

export type Exif = {
  camera: string;
  lens?: string;
  iso?: string;
  taken: string;
  gps?: string;
  coords?: string;
  note?: string;
};

export type Photo = {
  id: string;
  url?: string;
  kind?: "pix";
  caption: string;
  date: string;
  location: string;
  evidenceId?: string;
  exif?: Exif;
  /** só aparece dentro do cofre da calculadora */
  hidden?: boolean;
  /** recuperada da lixeira forense */
  deleted?: boolean;
};

export type Note = { id: string; title: string; body: string; updated: string; evidenceId?: string };

export type Mail = {
  id: string;
  from: string;
  address: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  evidenceId?: string;
};

export type HistoryItem = { id: string; title: string; url: string; time: string; evidenceId?: string };

export type BankTxn = {
  id: string;
  desc: string;
  date: string;
  amount: string;
  out: boolean;
  evidenceId?: string;
};

export type BankData = {
  password: string;
  hint: string;
  holder: string;
  balance: string;
  txns: BankTxn[];
};

export type Suspect = { id: string; name: string; role: string; avatar: string; bio: string };

export type Question = { id: string; q: string; a: string; requiresEvidence?: string };

export type CloudItem = {
  id: string;
  kind: "search" | "note" | "photo";
  label: string;
  detail: string;
  evidenceId?: string;
};

export type Motive = { id: string; label: string };

export type SocialPost = {
  id: string;
  net: "instapic" | "tweetfeed";
  author: string;
  handle: string;
  avatar?: string;
  time: string;
  text: string;
  image?: string;
  place?: string;
  likes: number;
  comments?: { author: string; text: string }[];
  evidenceId?: string;
  /** contradiz outra prova — destaque investigativo */
  contradiction?: string;
};

export type PhoneNotification = {
  id: string;
  app: string;
  title: string;
  text: string;
  time: string;
  urgent?: boolean;
};

export type TrashItem = {
  id: string;
  type: "foto" | "mensagem" | "documento" | "audio";
  label: string;
  /** fragmentos embaralhados que o jogador reordena/reconstrói */
  fragments: string[];
  recovered: string;
  evidenceId?: string;
};

/** Uma fala que o detetive pode enviar numa conversa ao vivo. */
export type ChatOption = {
  id: string;
  /** O que você escreve. */
  text: string;
  /** Palavras-chave aceitas quando o jogador digita no teclado. */
  keywords: string[];
  /** Resposta do interlocutor. */
  reply: string;
  /** Risco de queimar o disfarce (0 = seguro, 3 = queima na hora). */
  risk: 0 | 1 | 2 | 3;
  /** Só aparece depois que estas falas forem enviadas. */
  requires?: string[];
  /** Prova desbloqueada pela resposta. */
  evidenceId?: string;
  /** Comentário do Jane depois da resposta. */
  jane?: string;
};

/** Voz do personagem — usada para compor respostas variáveis. */
export type ChatVoice = {
  /** Reações a cumprimentos/amenidades. */
  smallTalk: string[];
  /** Quando não entende / assunto fora do radar. */
  confused: string[];
  /** Quando o jogador insiste num assunto já respondido. */
  repeat: string[];
  /** Quando o jogador é agressivo/direto demais. */
  pressed: string[];
  /** Quando a suspeita está alta (penúltimo aviso). */
  alarmed: string[];
};

export type ChatThread = {
  id: string;
  /** "impersonate" = você escreve pelo celular da vítima, fingindo ser ela. */
  mode: "impersonate" | "direct";
  name: string;
  sub: string;
  avatar?: string;
  /** Mensagem que já estava na tela, sem resposta. */
  intro: string;
  introTime: string;
  /** Aviso do Jane ao abrir a conversa. */
  briefing: string;
  /** Mensagem quando o disfarce cai. */
  burned: string;
  /** Assuntos que o personagem conhece (texto livre é casado com `keywords`). */
  options: ChatOption[];
  /** Personalidade para respostas fora do roteiro. */
  voice?: ChatVoice;
  /** Coisas que a vítima JÁ sabia — perguntar queima o disfarce na hora. */
  taboo?: { keywords: string[]; reason: string }[];
};

export type WebArticle = {
  id: string;
  title: string;
  source: string;
  url: string;
  body: string;
  keywords: string[];
};

export type CaseData = {
  id: string;
  no: string;
  title: string;
  tagline: string;
  difficulty: 1 | 2 | 3;
  pin: string;
  pinHints: string[];
  lockTime: string;
  lockDate: string;
  victim: { name: string; age: number; role: string; photo: string; line1: string; line2: string };
  briefing: string[];
  timeline: [string, string][];
  evidence: Record<string, EvidenceItem>;
  conversations: Conversation[];
  calls: Call[];
  photos: Photo[];
  notes: Note[];
  mails: Mail[];
  history: HistoryItem[];
  bank: BankData;
  suspects: Suspect[];
  interrogations: Record<string, Question[]>;
  cloud: { owner: string; items: CloudItem[] };
  motives: Motive[];
  web: WebArticle[];
  hints: string[];
  /** Conversas ao vivo (app Mensagens Ativas). Opcional por caso. */
  chats?: ChatThread[];
  /** Rótulo do painel de dicas (ex.: "Patrick Jane sussurra"). */
  hintLabel?: string;
  /** Padrão de desbloqueio (índices 0..8 no grid 3x3). Se houver, substitui o PIN. */
  pattern?: number[];
  /** Pista visual do padrão (mancha na tela / rascunho). */
  patternHint?: string;
  /** Cofre escondido no app Calculadora. */
  vault?: { code: string; hint: string };
  /** Posts de redes sociais. */
  social?: SocialPost[];
  /** Notificações da gaveta superior. */
  notifications?: PhoneNotification[];
  /** Arquivos deletados recuperáveis na perícia. */
  trash?: TrashItem[];
  /** Opções de método/arma no mandado. */
  methods?: Motive[];
  /** Patente mínima exigida para abrir o caso (1..5). */
  minRank?: number;
  epilogues: Record<"perfect" | "weak" | "wrong", { title: string; text: string[] }>;
};
