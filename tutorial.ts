import type { CaseData } from "../types";

export const tutorialCase: CaseData = {
  id: "tutorial",
  no: "000",
  title: "Treinamento: O Bilhete",
  tagline: "CASO 0 · Dois minutos para aprender a cruzar o dossiê com o celular. Sem mistério — só método.",
  difficulty: 1,
  hintLabel: "Analista sênior orienta",
  pin: "4012",
  pinHints: [
    "Analista: “As respostas sempre estão nas fotos ou nos documentos. Olhe a primeira foto do dossiê.”",
    "Analista: “A placa amarela no portão do depósito tem o número do local.”",
    "Analista: “4012. Pode digitar pelo teclado do seu computador, se preferir.”",
  ],
  lockTime: "19:12",
  lockDate: "quarta-feira, 5 de março",
  victim: {
    name: "Hugo Peçanha",
    age: 44,
    role: "gerente de um depósito de materiais",
    photo: "/people/m9.webp",
    line1: "Nascimento: 03/04/1981 · Trabalhava no Depósito Trilho Azul há 12 anos.",
    line2: "Caso de TREINAMENTO. Sobreviveu: foi encontrado desacordado e já está estável no hospital.",
  },
  briefing: [
    "CBI — MÓDULO DE TREINAMENTO · CASO 000",
    "Este é um exercício. Nenhuma vítima real, nenhuma pressão.",
    "Hugo Peçanha, 44, foi encontrado desacordado no depósito onde trabalha. Está estável.",
    "Seu objetivo: aprender as três ferramentas do terminal em 2 minutos.",
    "1) O DOSSIÊ (à esquerda) guarda dados da vítima — inclusive datas.",
    "2) O CELULAR só abre com um código de 4 dígitos que está no dossiê.",
    "3) As PROVAS são anexadas tocando no alfinete dourado dentro dos apps.",
    "Depois é só ir à aba Acusar e apontar o responsável. Vamos ao trabalho.",
  ],
  timeline: [
    ["18:40", "Hugo faz a última ronda do turno."],
    ["19:12", "Última atividade do celular: foto do portão dos fundos."],
    ["19:20", "Um colega escuta uma discussão no pátio."],
    ["19:35", "Hugo é encontrado caído ao lado do estoque."],
  ],
  evidence: {
    msg_ivan_ameaca: { id: "msg_ivan_ameaca", title: "Ameaça do colega", desc: "Ivan foi flagrado desviando mercadoria e escreveu: “se você abrir a boca amanhã, eu acabo com você”.", source: "Mensagens" },
    note_estoque: { id: "note_estoque", title: "A denúncia pronta", desc: "Nota da vítima: “amanhã eu entrego as notas fiscais adulteradas do Ivan pra diretoria”.", source: "Notas" },
    photo_portao: { id: "photo_portao", title: "Foto do portão — 19:12", desc: "Portão dos fundos aberto por dentro, oito minutos antes da agressão.", source: "Fotos" },
  },
  conversations: [
    {
      id: "ivan", name: "Ivan Doria", sub: "colega de depósito", avatar: "/people/m3.webp", time: "18:55", unread: 1,
      messages: [
        { id: "i1", from: "them", text: "Fiquei sabendo que você conferiu as notas de fevereiro.", time: "05/03 · 18:40" },
        { id: "i2", from: "me", text: "Confiei em você por dez anos, Ivan. Dez.", time: "05/03 · 18:48" },
        { id: "i3", from: "them", text: "Se você abrir a boca amanhã, eu acabo com você. Falo sério.", time: "05/03 · 18:55", evidenceId: "msg_ivan_ameaca" },
      ],
    },
    {
      id: "rose", name: "Rose (esposa)", sub: "família", time: "19:00",
      messages: [
        { id: "r1", from: "them", text: "Lembra que dia 3 de abril eu quero festa, hein. Você faz 45!", time: "01/03 · 20:10" },
        { id: "r2", from: "me", text: "03/04 tá marcado. Uso essa data até como senha, amor 😅", time: "01/03 · 20:14" },
        { id: "r3", from: "them", text: "Isso é péssimo pra segurança, Hugo!!", time: "01/03 · 20:15" },
      ],
    },
  ],
  calls: [
    { id: "t1", name: "Ivan Doria", sub: "celular", type: "missed", time: "05/03 · 19:05" },
    { id: "t2", name: "Rose", sub: "casa", type: "out", time: "05/03 · 18:30", duration: "4:12" },
  ],
  photos: [
    { id: "f1", url: "https://images.pexels.com/photos/36826094/pexels-photo-36826094.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", caption: "—", date: "05/03 · 19:12", location: "Depósito Trilho Azul — fundos", evidenceId: "photo_portao" },
  ],
  notes: [
    { id: "n1", title: "amanhã", body: "levar as notas fiscais adulteradas do Ivan pra diretoria.\nfevereiro inteiro bate errado.\nnão é briga pessoal, é roubo.", updated: "05/03 · 18:20", evidenceId: "note_estoque" },
    { id: "n2", title: "senhas", body: "celular: o número aqui do depósito (a placa grande no portão)\nkkk a Rose vive reclamando disso", updated: "01/03 · 20:16" },
  ],
  mails: [
    { id: "e1", from: "Diretoria Trilho Azul", address: "diretoria@trilhoazul.com.br", subject: "Reunião quinta, 9h", preview: "Confirmado o horário para você apresentar as divergências do estoque…", body: "Hugo,\n\nConfirmado: quinta-feira, 9h, para você apresentar as divergências de estoque de fevereiro.\n\nTraga a documentação.\n\nDiretoria — Trilho Azul", time: "05/03 · 17:02" },
  ],
  history: [
    { id: "h1", title: "como denunciar desvio de mercadoria empresa", url: "google.com/search?q=denunciar+desvio", time: "05/03 · 18:10" },
  ],
  bank: {
    password: "0304",
    hint: "No treinamento, a senha do banco é a mesma do celular: o aniversário da vítima (dia e mês).",
    holder: "HUGO PEÇANHA — BANCO POPULAR ····0012",
    balance: "R$ 4.902,33",
    txns: [
      { id: "b1", desc: "Salário — Depósito Trilho Azul", date: "05/03 · 06:00", amount: "+R$ 3.900,00", out: false },
      { id: "b2", desc: "Padaria do Zé", date: "05/03 · 07:12", amount: "-R$ 18,50", out: true },
    ],
  },
  suspects: [
    { id: "ivan", name: "Ivan Doria", role: "Colega de depósito · 39 anos", avatar: "/people/m3.webp", bio: "Responsável pelo recebimento de mercadorias. Hugo descobriu notas fiscais adulteradas em nome dele e marcou reunião com a diretoria." },
    { id: "rose", name: "Rose Peçanha", role: "Esposa · 42 anos", avatar: "/people/f8.webp", bio: "Casada com Hugo há 18 anos. Estava em casa preparando o jantar, com a vizinha, quando tudo aconteceu." },
  ],
  interrogations: {
    ivan: [
      { id: "q1", q: "Onde você estava às 19h20?", a: "No pátio. Tava… conversando. Alto, admito. Mas eu não encostei nele." },
      { id: "q2", q: "Você ameaçou o Hugo por mensagem.", a: "Eu escrevi besteira, tava desesperado. Se ele entregasse aquelas notas eu perdia tudo. …Tá, eu empurrei ele. Eu não queria que ele caísse daquele jeito.", requiresEvidence: "msg_ivan_ameaca" },
    ],
    rose: [
      { id: "q1", q: "Onde a senhora estava?", a: "Em casa, com a vizinha, fazendo jantar. Ela ficou comigo das 18h até a polícia ligar." },
      { id: "q2", q: "O que o Hugo usa como senha?", a: "O número lá do depósito onde ele trabalha. Ele falava que era o número da sorte. Fica numa placa amarela no portão. Quatro mil e doze, acho." },
    ],
  },
  cloud: { owner: "—", items: [] },
  motives: [
    { id: "denuncia", label: "Impedir a denúncia do desvio de mercadoria à diretoria" },
    { id: "ciume", label: "Ciúme doméstico" },
  ],
  web: [
    { id: "w1", title: "Gerente é agredido em depósito na zona industrial", source: "Jornal da Cidade", url: "jornaldacidade.com/deposito", body: "Um gerente de 44 anos foi encontrado desacordado no Depósito Trilho Azul. Ele passa bem. A empresa informou que apura divergências internas de estoque.", keywords: ["hugo", "pecanha", "peçanha", "deposito", "depósito", "agredido"] },
  ],
  chats: [],
  hints: [
    "Analista: “Comece pela aba Dossiê. Tudo que você precisa para abrir o celular está lá — inclusive a data de nascimento.”",
    "Analista: “Digite 0304 no teclado do celular (ou no teclado do seu computador).”",
    "Analista: “Abra Mensagens e Notas. Onde aparecer o alfinete dourado, toque: aquilo vira prova no seu dossiê.”",
    "Analista: “Com 3 provas no dossiê, a aba Acusar libera. Aponte o Ivan, motivo: impedir a denúncia.”",
  ],
  epilogues: {
    perfect: {
      title: "TREINAMENTO CONCLUÍDO",
      text: [
        "Você cruzou o dossiê com o aparelho, anexou as provas certas e fechou o exercício. É exatamente esse o método.",
        "Ivan Doria confessou o empurrão quando confrontado com a própria ameaça escrita. Hugo recebeu alta três dias depois e apresentou as notas à diretoria.",
        "Agora vá para os casos de verdade — lá, ninguém recebe alta.",
      ],
    },
    weak: {
      title: "TREINAMENTO INCOMPLETO",
      text: [
        "Você acertou o responsável, mas sem as provas o relatório não se sustenta. Volte, anexe os três itens com alfinete e tente outra vez.",
      ],
    },
    wrong: {
      title: "TREINAMENTO REPROVADO",
      text: [
        "A esposa tinha uma testemunha ao lado dela a noite inteira. Leia os interrogatórios antes de acusar — é para isso que eles existem.",
        "Refaça o exercício: o método é sempre dossiê → celular → provas → acusação.",
      ],
    },
  },
};
