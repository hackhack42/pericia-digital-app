/**
 * Derivação automática de conteúdo de sistema a partir dos dados do caso.
 * Evita reescrever notificações/EXIF/redes/lixeira em 8 casos: tudo é gerado
 * de forma determinística, e cada caso pode sobrescrever pontualmente.
 */
import type {
  CaseData,
  PhoneNotification,
  SocialPost,
  TrashItem,
  Exif,
  Photo,
} from "./types";

const h = (s: string) => {
  let n = 0;
  for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(n);
};

/* ---------------- Notificações ---------------- */
export function notificationsFor(c: CaseData): PhoneNotification[] {
  if (c.notifications?.length) return c.notifications;
  const out: PhoneNotification[] = [];

  c.conversations.forEach((conv) => {
    if (!conv.unread) return;
    const last = conv.messages[conv.messages.length - 1];
    out.push({
      id: `n-${conv.id}`,
      app: "Mensagens",
      title: conv.name,
      text: last?.kind === "audio" ? "🎤 Mensagem de voz" : (last?.text ?? ""),
      time: conv.time ?? "",
      urgent: true,
    });
  });

  c.calls
    .filter((x) => x.type === "missed")
    .slice(0, 3)
    .forEach((call) =>
      out.push({
        id: `n-call-${call.id}`,
        app: "Telefone",
        title: `Chamada perdida — ${call.name}`,
        text: call.sub ?? "celular",
        time: call.time.split("·").pop()?.trim() ?? call.time,
      })
    );

  const mail = c.mails[0];
  if (mail)
    out.push({
      id: "n-mail",
      app: "Mail",
      title: mail.from,
      text: mail.subject,
      time: mail.time.split("·").pop()?.trim() ?? mail.time,
    });

  out.push({
    id: "n-sys",
    app: "Sistema",
    title: "Bateria em nível crítico",
    text: "Conecte o dispositivo a uma fonte de energia.",
    time: c.lockTime,
    urgent: true,
  });

  return out;
}

/* ---------------- EXIF ---------------- */
const CAMERAS = [
  "Apple iPhone 14 Pro · f/1.78",
  "Apple iPhone 13 · f/1.6",
  "Samsung Galaxy S22 · f/1.8",
];

export function exifFor(c: CaseData, p: Photo, index: number): Exif {
  if (p.exif) return p.exif;
  const seed = h(c.id + p.id);
  const lat = (-23.5 - ((seed % 900) / 10000)).toFixed(5);
  const lon = (-46.6 - ((seed % 1300) / 10000)).toFixed(5);
  return {
    camera: CAMERAS[seed % CAMERAS.length],
    lens: index === 0 ? "26 mm (principal)" : "13 mm (ultra-angular)",
    iso: String(100 + (seed % 12) * 100),
    taken: p.date,
    gps: p.location,
    coords: `${lat}, ${lon}`,
    note:
      index === 0
        ? "Metadados íntegros. Horário dentro da janela do crime — item de interesse pericial."
        : undefined,
  };
}

/* ---------------- Cofre da calculadora ---------------- */
export function vaultFor(c: CaseData): { code: string; hint: string; photos: Photo[] } {
  const base = c.vault ?? {
    // padrão: a senha do banco somada — mas aqui usamos o PIN invertido
    code: c.pin.split("").reverse().join(""),
    hint: "Perícia: o titular costumava usar o código do aparelho ao contrário.",
  };
  const hidden = c.photos.filter((p) => p.hidden);
  const fallback: Photo[] =
    hidden.length > 0
      ? hidden
      : [
          {
            id: `vault-${c.id}-1`,
            url: c.photos[0]?.url,
            caption: "Arquivo oculto — recuperado do cofre",
            date: c.photos[0]?.date ?? "—",
            location: "Pasta protegida",
            hidden: true,
            exif: {
              camera: "—",
              taken: c.photos[0]?.date ?? "—",
              note: "Arquivo movido para pasta oculta pelo próprio usuário.",
            },
          },
        ];
  return { ...base, photos: fallback };
}

/* ---------------- Redes sociais ---------------- */
export function socialFor(c: CaseData): SocialPost[] {
  if (c.social?.length) return c.social;
  const posts: SocialPost[] = [];

  c.suspects.forEach((s, i) => {
    const seed = h(c.id + s.id);
    const handle = `@${s.name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12)}`;
    posts.push({
      id: `sp-${s.id}`,
      net: i % 2 === 0 ? "instapic" : "tweetfeed",
      author: s.name,
      handle,
      avatar: s.avatar,
      time: i === 0 ? "há 6 h" : `há ${8 + i * 5} h`,
      text:
        i === 0
          ? `Noite estranha. Dormi cedo, acordei pior. ${c.victim.name.split(" ")[0]}, me liga quando puder.`
          : `Semana pesada. Às vezes a gente só precisa de silêncio e trabalho.`,
      place: i === 0 ? "Em casa" : undefined,
      likes: 40 + (seed % 900),
      comments: [
        { author: "@amiga_rc", text: "tá tudo bem contigo?" },
        { author: "@vizinho.jp", text: "qualquer coisa chama" },
      ],
      contradiction:
        i === 0
          ? "Afirma publicamente ter passado a noite em casa — confronte com os registros do aparelho."
          : undefined,
    });
  });

  posts.push({
    id: "sp-victim",
    net: "instapic",
    author: c.victim.name,
    handle: `@${c.victim.name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12)}`,
    avatar: c.victim.photo,
    time: "há 2 d",
    text: c.photos[0]?.caption && c.photos[0].caption !== "—" ? c.photos[0].caption : "Dias intensos. Em breve conto tudo.",
    image: c.photos.find((p) => p.url && !p.hidden)?.url,
    likes: 300 + (h(c.id) % 2000),
    comments: [{ author: "@seguidor", text: "ansioso pela novidade!" }],
  });

  return posts;
}

/* ---------------- Lixeira forense ---------------- */
export function trashFor(c: CaseData): TrashItem[] {
  if (c.trash?.length) return c.trash;
  const key = Object.keys(c.evidence);
  const cloudEv = key.find((k) => k.startsWith("cloud_")) ?? key[key.length - 1];
  const ev = c.evidence[cloudEv];

  const frag = (text: string) =>
    text
      .split(" ")
      .reduce<string[]>((acc, w, i) => {
        const chunk = Math.floor(i / 4);
        acc[chunk] = `${acc[chunk] ?? ""} ${w}`.trim();
        return acc;
      }, [])
      .slice(0, 4);

  return [
    {
      id: `tr-${c.id}-1`,
      type: "mensagem",
      label: "Mensagem apagada · setor 0x1A4F",
      fragments: frag(ev?.desc ?? "fragmento de dados recuperado do dispositivo"),
      recovered: ev?.desc ?? "Fragmento recuperado.",
      evidenceId: cloudEv,
    },
    {
      id: `tr-${c.id}-2`,
      type: "documento",
      label: "Rascunho descartado · setor 0x22B0",
      fragments: frag(c.notes[0]?.body.slice(0, 120) ?? "anotação parcialmente sobrescrita"),
      recovered: c.notes[0]?.body.slice(0, 160) ?? "Anotação recuperada parcialmente.",
    },
  ];
}
