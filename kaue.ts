import type { CaseData } from "../types";

export const kaueCase: CaseData = {
  id: "kaue",
  no: "1808",
  title: "Jogo Limpo",
  tagline: "Morreu ao vivo para 40 mil espectadores. Ninguém viu nada: todos estavam olhando para o jogo.",
  difficulty: 3,
  minRank: 4,
  pin: "0117",
  pinHints: [
    "Pro player não guarda aniversário: guarda o recorde. A senha é o número que o consagrou.",
    "O técnico diz com orgulho: 117 abates numa única partida, o recorde que nunca foi batido. Ele escrevia com zero na frente.",
    "0117.",
  ],
  lockTime: "01:12",
  lockDate: "sexta-feira, 18 de agosto",
  victim: {
    name: "Kauê “ZEROO” Medina",
    age: 22,
    role: "jogador profissional · equipe Vanta Esports",
    photo: "/people/m4.webp",
    line1: "Recorde histórico de 117 abates numa partida · usava “0117” em tudo.",
    line2: "Morreu na própria cadeira, durante transmissão ao vivo, com 41 mil espectadores assistindo.",
  },
  briefing: [
    "RELATÓRIO Nº 1808 — DIVISÃO DE CRIMES CIBERNÉTICOS",
    "Vítima: Kauê Medina, 22, conhecido como ZEROO, jogador profissional da Vanta Esports.",
    "Morreu durante transmissão ao vivo na gaming house, às 01h14 de 18/08.",
    "A live continuou nove minutos com o corpo na cadeira antes de alguém entrar no quarto.",
    "Laudo: parada cardíaca por overdose de estimulante — dose 9x acima da terapêutica.",
    "A equipe alega “uso recreativo de energético e suplemento”. A família não aceita.",
    "O frasco de suplemento dele estava aberto na mesa. O lacre foi violado e recolado.",
    "O celular estava ao lado do teclado, BLOQUEADO, com o VOD da transmissão ainda aberto.",
  ],
  timeline: [
    ["22:00", "Início da transmissão. Partida classificatória para o mundial."],
    ["00:40", "Kauê toma a dose do suplemento no ar — visível no VOD."],
    ["01:12", "Última atividade do celular: print do saldo da carteira de apostas."],
    ["01:14", "Colapso durante a partida. A live segue."],
    ["01:23", "O técnico entra no quarto e desliga a transmissão."],
    ["01:31", "Resgate acionado — 17 minutos após o colapso."],
  ],
  evidence: {
    msg_ravi_aposta: { id: "msg_ravi_aposta", title: "Aposta contra a própria equipe", desc: "Ravi, o técnico, pressionava Kauê a “jogar devagar” na classificatória — havia dinheiro apostado contra a Vanta.", source: "Mensagens" },
    msg_duda_contrato: { id: "msg_duda_contrato", title: "Saída para a rival", desc: "A empresária Duda negociava a transferência de Kauê para uma equipe rival por R$ 3,8 mi, deixando a Vanta sem o atleta.", source: "Mensagens" },
    msg_leo_banco: { id: "msg_leo_banco", title: "Reserva no banco", desc: "Léo, reserva há dois anos, só entraria em quadra se Kauê saísse — e reclamava disso publicamente.", source: "Mensagens" },
    note_suplemento: { id: "note_suplemento", title: "O suplemento", desc: "Nota da vítima: “1 dose antes da partida, NUNCA mais. o Ravi que prepara e deixa no frigobar do quarto.”", source: "Notas" },
    note_recusa: { id: "note_recusa", title: "A recusa", desc: "Nota da vítima: “ele quer que eu jogue mal de propósito. não vou. depois do mundial eu denuncio tudo pra liga.”", source: "Notas" },
    photo_carteira: { id: "photo_carteira", title: "Último print — 01:12", desc: "Print do saldo da carteira de apostas do técnico, enviado a Kauê por engano: R$ 240 mil apostados CONTRA a Vanta.", source: "Fotos" },
    vod_dose: { id: "vod_dose", title: "A dose no VOD", desc: "Trecho da transmissão às 00:40: Kauê bebe do frasco e faz careta — “tá mais amargo hoje”, diz no ar, rindo.", source: "Sistema" },
    bank_aposta: { id: "bank_aposta", title: "R$ 240 mil contra a equipe", desc: "App de apostas: 240 mil em “Vanta não classifica”, em sete entradas feitas na semana da partida, da conta do técnico.", source: "Banco" },
    vault_laudo: { id: "vault_laudo", title: "Laudo do frasco no cofre", desc: "Arquivo oculto: foto do lacre violado do frasco e do pó branco no fundo, feita por Kauê dois dias antes.", source: "Cofre" },
    log_frigobar: { id: "log_frigobar", title: "Acesso ao frigobar", desc: "Fechadura inteligente do quarto: única abertura entre 19h e a partida foi às 21:52, com a credencial do técnico.", source: "Casa inteligente" },
    cloud_search: { id: "cloud_search", title: "Nuvem dele: as buscas", desc: "Backup de Ravi: “dose letal de estimulante esportivo”, “exame antidoping detecta depois de quanto tempo”, “apostar contra o próprio time é crime?”.", source: "Anexo nuvem" },
    cloud_note: { id: "cloud_note", title: "Nuvem dele: a conta", desc: "Nota apagada: “se ele não jogar devagar, ele não joga. 9x a dose. o frasco fica na mesa, ninguém separa energético de suplemento.”", source: "Anexo nuvem" },
  },
  conversations: [
    {
      id: "ravi", name: "Ravi Katz", sub: "técnico · Vanta Esports", avatar: "/people/m3.webp", time: "21:40", unread: 1,
      messages: [
        { id: "r1", from: "them", text: "ZEROO, hoje a gente joga a classificatória com calma. Sem herói. Entende o que eu tô dizendo?", time: "15/08 · 14:02" },
        { id: "r2", from: "me", text: "Não entendo não, coach. Explica melhor essa de “sem herói”.", time: "15/08 · 14:10" },
        { id: "r3", from: "them", text: "Tem gente de fora com dinheiro em cima dessa partida. Se a gente não classificar, ninguém chora e todo mundo ganha.", time: "15/08 · 14:14", evidenceId: "msg_ravi_aposta" },
        { id: "r4", from: "me", text: "Você tá me pedindo pra entregar partida? Depois do mundial eu levo isso pra liga, Ravi.", time: "15/08 · 14:30" },
        { id: "r5", from: "them", text: "Deixei seu suplemento no frigobar do quarto, dose certa. Boa live hoje, campeão.", time: "17/08 · 21:40" },
      ],
    },
    {
      id: "duda", name: "Duda Ferraz", sub: "empresária", avatar: "/people/f10.webp", time: "19:02",
      messages: [
        { id: "d1", from: "them", text: "A proposta da rival subiu: 3,8 milhões por 3 anos. Você sai da Vanta em janeiro.", time: "16/08 · 11:00", evidenceId: "msg_duda_contrato" },
        { id: "d2", from: "me", text: "Fecha. Mas eu não saio antes de denunciar o que tá acontecendo aqui dentro.", time: "16/08 · 11:20" },
        { id: "d3", from: "them", text: "Denuncia DEPOIS de assinar, pelo amor de Deus. Com contrato na mão você vira testemunha protegida; sem ele, você vira fofoca.", time: "16/08 · 11:24" },
        { id: "d4", from: "them", text: "Boa sorte hoje. Tô no voo pra Lisboa, pouso 7h da manhã. Me manda o resultado quando eu ligar o celular.", time: "17/08 · 19:02" },
      ],
    },
    {
      id: "leo", name: "Léo Hanzo", sub: "reserva da equipe", avatar: "/people/m10.webp", time: "20:30",
      messages: [
        { id: "l1", from: "them", text: "mano, dois anos no banco. dois. eu treino igual você e jogo scrim contra bot", time: "10/08 · 23:40", evidenceId: "msg_leo_banco" },
        { id: "l2", from: "me", text: "Se eu sair em janeiro a vaga é sua, Léo. Eu mesmo vou falar com a diretoria.", time: "10/08 · 23:52" },
        { id: "l3", from: "them", text: "sério?? mano eu te amo kkkk desculpa o chilique", time: "10/08 · 23:55" },
        { id: "l4", from: "them", text: "boa sorte hoje! tô indo pro aniversário da minha irmã em campinas, assisto pelo celular 💜", time: "17/08 · 20:30" },
      ],
    },
  ],
  calls: [
    { id: "c1", name: "Ravi Katz", sub: "interno", type: "in", time: "17/08 · 21:38", duration: "1:40" },
    { id: "c2", name: "Duda Ferraz", sub: "celular", type: "out", time: "16/08 · 11:30", duration: "22:14" },
    { id: "c3", name: "Liga Nacional — ouvidoria", sub: "comercial", type: "out", time: "16/08 · 15:02", duration: "0:38" },
    { id: "c4", name: "Mãe", sub: "casa", type: "in", time: "17/08 · 18:10", duration: "12:40" },
  ],
  photos: [
    { id: "p1", kind: "pix", caption: "—", date: "18/08 · 01:12", location: "Gaming house — quarto 3", evidenceId: "photo_carteira", exif: { camera: "Captura de tela", taken: "18/08 · 01:12:40", note: "Print da carteira de apostas do técnico, recebido por engano no grupo da equipe: R$ 240.000 em “Vanta não classifica”." } },
    { id: "p2", url: "https://images.pexels.com/photos/17100545/pexels-photo-17100545.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", caption: "Setup pronto pra classificatória 🏆", date: "17/08 · 21:10", location: "Gaming house — quarto 3" },
    { id: "p3", url: "https://images.pexels.com/photos/4774367/pexels-photo-4774367.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", caption: "Oculta — lacre violado do frasco", date: "16/08 · 08:40", location: "Pasta protegida", hidden: true, evidenceId: "vault_laudo", exif: { camera: "iPhone 13 · f/1.6", taken: "16/08 · 08:40", note: "Lacre do frasco de suplemento rompido e recolado, com resíduo de pó branco no fundo. Fotografado dois dias antes da morte." } },
  ],
  notes: [
    { id: "n1", title: "suplemento", body: "1 dose antes da partida, NUNCA mais que isso.\no Ravi que prepara e deixa no frigobar do quarto.\ndesde segunda tá com gosto diferente. amargo.\ntirar foto do frasco e mostrar pra Duda.", updated: "16/08 · 08:45", evidenceId: "note_suplemento" },
    { id: "n2", title: "o que eu vou fazer", body: "ele quer que eu jogue mal de propósito. não vou.\ntem dinheiro de fora apostado contra a gente.\ndepois do mundial eu denuncio tudo pra liga.\nassinar com a rival antes (a Duda tem razão).", updated: "16/08 · 15:10", evidenceId: "note_recusa" },
    { id: "n3", title: "senhas", body: "celular: o recorde (0117, 117 abates, o dia mais louco da minha vida)\nbanco: o valor da proposta da rival, em milhares\ncofre: o recorde sem o zero", updated: "02/03 · 16:00" },
  ],
  mails: [
    { id: "e1", from: "Liga Nacional de Esports", address: "ouvidoria@lne.gg", subject: "Protocolo de denúncia 88-2211", preview: "Recebemos seu contato sobre manipulação de resultado. Audiência reservada agendada…", body: "Prezado Kauê Medina,\n\nRecebemos seu contato sobre suspeita de manipulação de resultado envolvendo membro da comissão técnica.\n\nAudiência reservada agendada para 21/08, com sigilo garantido ao denunciante.\n\nRecomendamos preservar mensagens e comprovantes.\n\nOuvidoria — LNE", time: "16/08 · 15:20" },
    { id: "e2", from: "Vanta Esports — Diretoria", address: "diretoria@vanta.gg", subject: "Classificatória de hoje", preview: "Lembramos que a não classificação aciona a cláusula de redução salarial da comissão técnica…", body: "Equipe,\n\nLembramos que a não classificação de hoje aciona a cláusula de redução salarial de 40% da comissão técnica a partir de setembro.\n\nContamos com o profissionalismo de todos.\n\nDiretoria — Vanta Esports", time: "17/08 · 12:00" },
  ],
  history: [
    { id: "h1", title: "manipulação de resultado esports punição liga", url: "google.com/search?q=manipulacao+resultado+esports", time: "16/08 · 14:40" },
    { id: "h2", title: "suplemento estimulante dose máxima diária", url: "nutriesporte.br/estimulantes", time: "16/08 · 08:50" },
    { id: "h3", title: "contrato pro player rescisão antecipada", url: "esportslaw.br/rescisao", time: "16/08 · 11:40" },
  ],
  bank: {
    password: "3800",
    hint: "Não é o recorde (isso é o celular). A nota de contrato fala no valor da proposta da rival: R$ 3,8 milhões → 3800.",
    holder: "KAUÊ MEDINA — BANCO DIGITAL ····1170",
    balance: "R$ 84.120,00",
    txns: [
      { id: "t1", desc: "RELATÓRIO CRUZADO — R. KATZ · 7 entradas em “Vanta não classifica”", date: "17/08 · 20:10", amount: "-R$ 240.000,00", out: true, evidenceId: "bank_aposta" },
      { id: "t2", desc: "Vanta Esports — salário agosto", date: "05/08 · 06:00", amount: "+R$ 38.000,00", out: false },
      { id: "t3", desc: "Duda Ferraz — assessoria (comissão)", date: "05/08 · 10:00", amount: "-R$ 3.800,00", out: true },
      { id: "t4", desc: "Nutri Esporte — suplemento (compra da equipe)", date: "01/08 · 09:00", amount: "-R$ 640,00", out: true },
    ],
  },
  vault: { code: "117", hint: "A nota diz: o recorde sem o zero. Foram 117 abates." },
  suspects: [
    { id: "ravi", name: "Ravi Katz", role: "Técnico · 38 anos", avatar: "/people/m3.webp", bio: "Preparava pessoalmente o suplemento da equipe e tinha a única credencial usada no quarto antes da partida. Apostou R$ 240 mil contra o próprio time." },
    { id: "duda", name: "Duda Ferraz", role: "Empresária · 35 anos", avatar: "/people/f10.webp", bio: "Negociava a transferência de Kauê por R$ 3,8 mi. Ganhava comissão com ele vivo e jogando — e estava num voo para Lisboa." },
    { id: "leo", name: "Léo Hanzo", role: "Reserva · 20 anos", avatar: "/people/m10.webp", bio: "Dois anos no banco. Assumiria a vaga titular com a saída de Kauê — que já havia prometido indicá-lo à diretoria." },
  ],
  interrogations: {
    ravi: [
      { id: "q1", q: "Quem preparou o suplemento daquela noite?", a: "Eu, como preparo há três anos para os cinco jogadores. Mesma marca, mesma medida, mesmo copo. Se deu algo errado, foi o fabricante ou foi ele misturando com energético, o que eu PROIBIA." },
      { id: "q2", q: "A fechadura do quarto registra só a sua entrada, às 21:52.", a: "Óbvio, fui deixar o frasco no frigobar. Faço isso toda partida. Isso me torna atencioso, não assassino.", requiresEvidence: "log_frigobar" },
      { id: "q3", q: "O senhor pediu que ele jogasse mal.", a: "Eu pedi JOGO CONSERVADOR. É vocabulário técnico, detetive. O menino era afobado, morria no primeiro minuto todo jogo. Isso virou crime agora?", requiresEvidence: "msg_ravi_aposta" },
      { id: "q4", q: "Duzentos e quarenta mil apostados contra a sua própria equipe.", a: "(Longa pausa. Ele tira os óculos.) Eu ia perder 40% do salário se a gente classificasse… não, espera, se a gente NÃO classificasse. (Percebe o erro.) …Eu quero meu advogado.", requiresEvidence: "bank_aposta" },
    ],
    duda: [
      { id: "q1", q: "A senhora lucrava com a transferência dele.", a: "Lucrava 10% de 3,8 milhões. Faça a conta do que eu perdi quando ele morreu: tudo. Empresária não mata atleta, detetive — atleta morto não renova contrato.", requiresEvidence: "msg_duda_contrato" },
      { id: "q2", q: "Onde a senhora estava?", a: "A onze mil metros de altitude, sobre o Atlântico. Voo noturno para Lisboa, decolagem 23h40, pouso 7h. Cartão de embarque, imigração e o wi-fi de bordo com meu login." },
      { id: "q3", q: "Ele comentou algo sobre a equipe?", a: "Comentou que iam pedir pra ele entregar a partida. Eu falei: assina com a rival primeiro, denuncia depois. Se ele tivesse me ouvido, talvez estivesse vivo — mas ele era um menino honesto demais pra esperar." },
    ],
    leo: [
      { id: "q1", q: "A vaga de titular era sua se ele saísse.", a: "Era, e ele mesmo tinha prometido falar com a diretoria por mim. O ZEROO foi a única pessoa naquela casa que me tratou como jogador e não como enfeite de banco.", requiresEvidence: "msg_leo_banco" },
      { id: "q2", q: "Onde você estava na madrugada?", a: "Em Campinas, aniversário da minha irmã, com umas sessenta pessoas e vídeo de parabéns onde eu apareço às 00h50. Eu tava assistindo a live pelo celular na festa, chefe. Eu vi… eu vi ele cair." },
      { id: "q3", q: "O que você sabe do suplemento?", a: "Que o coach preparava e deixava no quarto de cada um. E que na segunda o ZEROO reclamou no grupo que o dele tava amargo. A gente riu. Ninguém riu depois." },
    ],
  },
  cloud: {
    owner: "R. Katz",
    items: [
      { id: "i1", kind: "search", label: "Buscas recuperadas — 14 a 17/08", detail: "“dose letal de estimulante esportivo” · “exame antidoping detecta depois de quanto tempo” · “apostar contra o próprio time é crime?”", evidenceId: "cloud_search" },
      { id: "i2", kind: "photo", label: "Captura — carteira de apostas", detail: "Print do saldo com sete entradas em “Vanta não classifica”, total de R$ 240.000, feito às 20:08 de 17/08." },
      { id: "i3", kind: "note", label: "Nota apagada — “sexta”", detail: "se ele não jogar devagar, ele não joga. 9x a dose. o frasco fica na mesa, ninguém separa energético de suplemento. a live cuida do resto.", evidenceId: "cloud_note" },
    ],
  },
  motives: [
    { id: "aposta", label: "Garantir os R$ 240 mil apostados contra a própria equipe e silenciar a denúncia à liga" },
    { id: "vaga", label: "Abrir a vaga de titular na equipe" },
    { id: "comissao", label: "Lucrar com a transferência milionária" },
    { id: "doping", label: "Encobrir um esquema de doping na gaming house" },
  ],
  methods: [
    { id: "overdose", label: "Estimulante em dose 9x no frasco de suplemento deixado no frigobar" },
    { id: "energetico", label: "Mistura acidental de energético com suplemento" },
    { id: "cardiaco", label: "Arritmia congênita não diagnosticada" },
    { id: "injecao", label: "Injeção aplicada antes da transmissão" },
  ],
  web: [
    { id: "w1", title: "Pro player morre ao vivo durante classificatória; 41 mil assistiam", source: "GG Report", url: "ggreport.gg/zeroo", body: "Kauê “ZEROO” Medina, 22, da Vanta Esports, morreu durante transmissão ao vivo. A live seguiu por nove minutos. A organização fala em “mal súbito” e suspendeu as atividades da gaming house.", keywords: ["kauê", "kaue", "zeroo", "medina", "esports", "vanta", "live", "morte"] },
    { id: "w2", title: "Liga investiga manipulação de resultado em classificatória", source: "Esports Legal", url: "esportslegal.br/manipulacao", body: "A ouvidoria confirma ter recebido denúncia de manipulação envolvendo membro de comissão técnica dias antes da partida. Apostas de integrantes contra as próprias equipes configuram fraude esportiva e estelionato.", keywords: ["manipulação", "manipulacao", "aposta", "liga", "fraude", "técnico", "tecnico"] },
    { id: "w3", title: "Estimulantes em gaming houses: a linha fina entre suplemento e droga", source: "Saúde & Performance", url: "saudeperformance.br/estimulantes", body: "Formulações de estimulante usadas por atletas de alta performance têm janela terapêutica estreita. Doses múltiplas podem causar arritmia fatal em minutos — e frascos manipulados por terceiros são risco documentado.", keywords: ["suplemento", "estimulante", "overdose", "dose", "frasco"] },
  ],
  hints: [
    "A senha é o número do recorde dele. O técnico cita no interrogatório com orgulho.",
    "0117. Depois leia as duas Notas: ele escreveu quem preparava o suplemento e o que pretendia denunciar.",
    "O cofre da Calculadora pede o recorde sem o zero: 117. Lá está a foto do lacre violado.",
    "Pergunte quem tinha credencial para entrar no quarto antes da partida — a fechadura registrou uma única abertura.",
    "Duda estava num voo transatlântico e Léo aparece num vídeo de parabéns às 00h50. Risque os dois.",
    "A tríade: o pedido para entregar a partida, a foto do lacre violado no cofre e os R$ 240 mil apostados contra a equipe.",
  ],
  epilogues: {
    perfect: {
      title: "CASO ENCERRADO",
      text: [
        "Ravi Katz foi preso na própria gaming house, enquanto dava entrevista sobre “luto e saúde mental no esporte eletrônico”.",
        "O frasco tinha nove vezes a dose terapêutica e o lacre recolado — exatamente como Kauê fotografou dois dias antes e guardou no cofre do celular, sem contar a ninguém.",
        "As sete apostas somavam R$ 240 mil em “Vanta não classifica”. O print chegou ao celular da vítima por engano, no grupo da equipe, 22 minutos antes de ela morrer.",
        "A Liga baniu o técnico por tempo indeterminado e criou o protocolo ZEROO: nenhum membro de comissão técnica pode manipular suplementação individual de atleta. Léo Hanzo estreou como titular em setembro, com 117 escrito na camisa.",
      ],
    },
    weak: {
      title: "ARQUIVADO COMO MAL SÚBITO",
      text: [
        "Você apontou o responsável, mas sem o pedido de entregar a partida, sem o lacre violado e sem as apostas, o caso virou “uso recreativo de estimulante por atleta jovem”.",
        "A Vanta fez uma homenagem emocionada no mundial. O técnico subiu ao palco e dedicou a campanha a ele.",
        "Reabra o caso: a foto do lacre continua no cofre do aparelho.",
      ],
    },
    wrong: {
      title: "INQUÉRITO ANULADO",
      text: [
        "A empresária estava sobre o Atlântico com cartão de embarque e imigração; o reserva aparece num vídeo de parabéns a 90 km dali. A defesa agradeceu a facilidade.",
        "O verdadeiro autor seguiu na função, recebeu os R$ 240 mil quarenta e oito horas depois e trocou de equipe na temporada seguinte.",
        "Reabra o dossiê.",
      ],
    },
  },
};
