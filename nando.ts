import type { CaseData } from "../types";

export const nandoCase: CaseData = {
  id: "nando",
  no: "0810",
  title: "Rastro do Asfalto",
  tagline: "Foi registrado como acidente de trânsito. O retrovisor da última foto discorda.",
  difficulty: 1,
  pin: "1107",
  pinHints: [
    "Ele não usava data de aniversário: usava o número da moto, que era a vida dele.",
    "A ex-namorada lembra: a placa terminava em 1107, e ele dizia que era “a sorte do asfalto”.",
    "1107. Quatro dígitos.",
  ],
  lockTime: "02:09",
  lockDate: "sábado, 10 de agosto",
  victim: {
    name: "Fernando “Nando” Brito",
    age: 19,
    role: "entregador de aplicativo",
    photo: "/people/m10.webp",
    line1: "Moto Fazer 250, placa final 1107 · participava de rachas noturnos na marginal.",
    line2: "Atropelado e arremessado na Av. das Indústrias. O veículo não parou. Registrado como acidente comum.",
  },
  briefing: [
    "RELATÓRIO Nº 0810 — DELEGACIA DE ACIDENTES · CASO INTRODUTÓRIO",
    "Vítima: Fernando Brito, 19, conhecido como Nando, entregador de aplicativo.",
    "Colisão seguida de fuga na Av. das Indústrias, por volta das 2h10 da madrugada.",
    "A versão oficial fala em “perda de controle em alta velocidade”. A família não aceita.",
    "A moto tem marcas de tinta azul na lateral esquerda — tinta que não é dela.",
    "A telemetria do app de entregas registrou a queda: de 80 km/h a 0 em menos de um segundo.",
    "O celular dele sobreviveu ao impacto, dentro da bolsa térmica. Está BLOQUEADO.",
    "Caso introdutório: você vai precisar do dossiê, de uma foto e de um pouco de zoom.",
  ],
  timeline: [
    ["01:20", "Discussão com a ex-namorada na lanchonete do posto."],
    ["01:48", "Mensagem no grupo de racha: desafio valendo a moto."],
    ["02:06", "Nando sai do posto. Telemetria mostra aceleração até 80 km/h."],
    ["02:09", "Última foto do celular — registro em movimento."],
    ["02:10", "Telemetria: 80 km/h → 0 km/h. Fim do trajeto."],
    ["02:31", "Ônibus da linha madrugadora passa pelo ponto e aciona o socorro."],
  ],
  evidence: {
    msg_grupo_desafio: { id: "msg_grupo_desafio", title: "Desafio valendo a moto", desc: "Grupo de racha: um desafio anônimo propõe disputa valendo a propriedade da moto de Nando. Gustavo aceita e cobra.", source: "Telegram" },
    msg_gustavo_divida: { id: "msg_gustavo_divida", title: "A aposta não paga", desc: "Gustavo cobra R$ 6 mil de uma aposta perdida por Nando duas semanas antes: “ou paga, ou entrega a chave da moto”.", source: "Mensagens" },
    msg_camila_briga: { id: "msg_camila_briga", title: "Briga na lanchonete", desc: "Camila discute com Nando por mensagem minutos antes, mas encerra dizendo que vai embora de carona com a prima.", source: "Mensagens" },
    photo_retrovisor: { id: "photo_retrovisor", title: "O retrovisor — 02:09", desc: "Última foto, feita em movimento. Ampliando o retrovisor direito aparece um carro colado atrás com o adesivo do clube de Gustavo no para-brisa.", source: "Fotos" },
    gps_telemetria: { id: "gps_telemetria", title: "Telemetria: 80 → 0", desc: "Registro do app de entregas: velocidade cai de 80 km/h para 0 em 0,8 s, com desvio lateral brusco à esquerda — padrão de colisão, não de frenagem.", source: "Mapas" },
    exif_local: { id: "exif_local", title: "GPS da última foto", desc: "Metadados: a foto foi feita 400 m antes do ponto do impacto, às 02:09:41 — 19 segundos antes da parada brusca.", source: "Fotos" },
    note_apostas: { id: "note_apostas", title: "Caderno de apostas", desc: "Nota da vítima: “devo 6 mil pro Gustavo. ele tá cobrando feio. sexta eu pago metade ou vendo o escapamento”.", source: "Notas" },
    bank_aposta: { id: "bank_aposta", title: "PIX da aposta", desc: "App do banco: PIX de R$ 3.000 enviado a Gustavo às 23h40 da véspera — metade da dívida. Ele devolveu o valor no dia seguinte ao crime.", source: "Banco" },
    cloud_search: { id: "cloud_search", title: "Nuvem dele: as buscas", desc: "Backup de Gustavo: “funilaria 24h sem boletim”, “quanto tempo some marca de tinta em colisão”, “câmera da avenida das indústrias existe?”.", source: "Anexo nuvem" },
    cloud_note: { id: "cloud_note", title: "Nuvem dele: a mensagem apagada", desc: "Mensagem apagada do grupo: “ele vai pagar hoje de um jeito ou de outro. ninguém me passa pra trás na frente de todo mundo.”", source: "Anexo nuvem" },
  },
  conversations: [
    {
      id: "grupo", name: "Telegram · RACHA ZL", sub: "grupo · 48 membros", time: "01:48", unread: 4,
      messages: [
        { id: "g1", from: "them", text: "FINAL DE SEMANA: pista da av. das indústrias, 2h. quem tiver coragem aparece 🏁", time: "09/08 · 20:10" },
        { id: "g2", from: "them", text: "desafio anônimo lançado: GUSTAVO x NANDO. valendo a FAZER 250 do nando 😳", time: "09/08 · 23:50", evidenceId: "msg_grupo_desafio" },
        { id: "g3", from: "me", text: "eu não apostei minha moto, gente. para com isso", time: "10/08 · 00:02" },
        { id: "g4", from: "them", text: "GUSTAVO: aceito. e ele ainda me deve 6 mil da outra. hoje a gente acerta tudo", time: "10/08 · 01:48" },
        { id: "g5", from: "me", text: "não vou correr hoje. tô trabalhando, tenho 3 entrega ainda", time: "10/08 · 01:52" },
        { id: "g6", from: "them", text: "GUSTAVO: então não corre. eu te encontro na avenida de qualquer jeito 🙂", time: "10/08 · 01:55" },
      ],
    },
    {
      id: "gustavo", name: "Gustavo Veiga", sub: "rival de racha", avatar: "/people/m9.webp", time: "01:58", unread: 1,
      messages: [
        { id: "gv1", from: "them", text: "cadê meus 6 mil, moleque. tá me enrolando faz duas semanas", time: "08/08 · 19:02", evidenceId: "msg_gustavo_divida" },
        { id: "gv2", from: "me", text: "mando 3 hoje e o resto dia 20, juro", time: "09/08 · 23:30" },
        { id: "gv3", from: "them", text: "3 não resolve. ou paga tudo, ou entrega a chave da moto. tô falando sério", time: "09/08 · 23:45" },
        { id: "gv4", from: "them", text: "te vi saindo do posto agora. para na av. das indústrias que a gente resolve isso olho no olho", time: "10/08 · 01:58" },
        { id: "gv5", from: "them", kind: "deleted", text: "para a moto. PARA A MOTO", time: "10/08 · 02:08" },
      ],
    },
    {
      id: "camila", name: "Camila", sub: "ex-namorada", avatar: "/people/f10.webp", time: "01:31",
      messages: [
        { id: "cm1", from: "them", text: "você não pode continuar nessa vida de racha, nando. um dia você não volta", time: "10/08 · 01:20", evidenceId: "msg_camila_briga" },
        { id: "cm2", from: "me", text: "não vou correr hoje, já falei. tô só trabalhando", time: "10/08 · 01:24" },
        { id: "cm3", from: "them", text: "então por que o gustavo tá te chamando pra avenida?? ME RESPONDE", time: "10/08 · 01:26" },
        { id: "cm4", from: "them", text: "cansei. vou embora de carona com a minha prima. boa sorte com a sua vida, fernando", time: "10/08 · 01:31" },
      ],
    },
  ],
  calls: [
    { id: "c1", name: "Gustavo Veiga", sub: "celular", type: "missed", time: "10/08 · 02:04" },
    { id: "c2", name: "Gustavo Veiga", sub: "celular", type: "missed", time: "10/08 · 02:07" },
    { id: "c3", name: "Camila", sub: "celular", type: "in", time: "10/08 · 01:22", duration: "4:40" },
    { id: "c4", name: "Mãe", sub: "casa", type: "out", time: "09/08 · 21:10", duration: "7:02" },
    { id: "c5", name: "Suporte do app de entregas", sub: "comercial", type: "out", time: "09/08 · 18:40", duration: "2:12" },
  ],
  photos: [
    { id: "p1", url: "https://images.pexels.com/photos/31954808/pexels-photo-31954808.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", caption: "—", date: "10/08 · 02:09", location: "Av. das Indústrias, 400 m antes do nº 1820", evidenceId: "photo_retrovisor", exif: { camera: "Samsung Galaxy A54 · f/1.8", taken: "10/08 · 02:09:41", gps: "Av. das Indústrias — sentido centro", coords: "-23.51188, -46.49207", note: "AMPLIAÇÃO DO RETROVISOR DIREITO: veículo colado atrás, para-brisa com adesivo circular do clube “Asfalto Norte”. Registro feito 19 s antes da parada brusca." } },
    { id: "p2", url: "https://images.pexels.com/photos/40098533/pexels-photo-40098533.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", caption: "Meu parceiro de entrega noturna 🐶", date: "02/08 · 23:10", location: "Casa — Itaquera" },
    { id: "p3", url: "https://images.pexels.com/photos/4774367/pexels-photo-4774367.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", caption: "Escapamento novo. Paguei em 6x 😅", date: "28/07 · 16:40", location: "Oficina do Téo" },
  ],
  notes: [
    { id: "n1", title: "contas do mês", body: "devo 6 mil pro gustavo.\nele tá cobrando feio, na frente dos outros.\nsexta eu pago metade ou vendo o escapamento.\nparar de apostar. SÉRIO dessa vez.", updated: "08/08 · 20:10", evidenceId: "note_apostas" },
    { id: "n2", title: "senhas", body: "celular: o final da placa (1107, a sorte do asfalto)\nbanco: os 4 finais da oficina do Téo (tô lá toda semana mesmo)\nnão esquecer: revisão da moto dia 22", updated: "15/07 · 09:00" },
    { id: "n3", title: "metas", body: "juntar pra CNH categoria A definitiva\nvender a moto antiga\nsair dos rachas antes do fim do ano", updated: "01/08 · 08:12" },
  ],
  mails: [
    { id: "e1", from: "App Entrega Já", address: "suporte@entregaja.com.br", subject: "Resumo de telemetria — corrida #88412", preview: "Velocidade máxima 81 km/h; parada brusca registrada às 02:10:00…", body: "Olá, Fernando!\n\nResumo da corrida #88412:\n— Distância: 7,2 km\n— Velocidade máxima: 81 km/h\n— EVENTO: parada brusca às 02:10:00 (81 km/h → 0 km/h em 0,8 s), com desvio lateral à esquerda de 2,4 m\n— Status: corrida interrompida automaticamente\n\nSe você sofreu um acidente, acione o suporte de emergência.", time: "10/08 · 02:11", evidenceId: "gps_telemetria" },
    { id: "e2", from: "Oficina do Téo", address: "teo@oficinadoteo.com.br", subject: "Orçamento — escapamento esportivo", preview: "Parcelado em 6x, conforme combinamos…", body: "E aí, Nando!\n\nEscapamento esportivo parcelado em 6x de R$ 230. Primeira parcela dia 10.\n\nQualquer coisa me chama.\n\nTéo — Oficina do Téo · (11) 2555-0638", time: "28/07 · 17:02" },
  ],
  history: [
    { id: "h1", title: "aposta de racha dívida é legal?", url: "google.com/search?q=divida+de+aposta+racha", time: "08/08 · 20:30" },
    { id: "h2", title: "como vender escapamento usado", url: "motomercado.br/pecas", time: "08/08 · 20:40" },
    { id: "h3", title: "cnh categoria a renovação preço", url: "detran.sp.gov.br/cnh", time: "01/08 · 08:20" },
    { id: "h4", title: "clube asfalto norte adesivo oficial", url: "asfaltonorte.club/loja", time: "20/07 · 22:10" },
  ],
  bank: {
    password: "0638",
    hint: "Não é a placa (isso é o celular). A nota “contas do mês” fala no número da oficina. O e-mail do Téo traz o telefone — use os 4 finais.",
    holder: "FERNANDO BRITO — BANCO DIGITAL ····3390",
    balance: "R$ 412,80",
    txns: [
      { id: "t1", desc: "PIX enviado — GUSTAVO VEIGA (metade da aposta)", date: "09/08 · 23:40", amount: "-R$ 3.000,00", out: true, evidenceId: "bank_aposta" },
      { id: "t2", desc: "PIX recebido — GUSTAVO VEIGA (devolução, sem descrição)", date: "11/08 · 08:02", amount: "+R$ 3.000,00", out: false },
      { id: "t3", desc: "App Entrega Já — repasse semanal", date: "08/08 · 06:00", amount: "+R$ 740,20", out: false },
      { id: "t4", desc: "Oficina do Téo — parcela 1/6 escapamento", date: "10/08 · 09:00", amount: "-R$ 230,00", out: true },
    ],
  },
  suspects: [
    { id: "gustavo", name: "Gustavo Veiga", role: "Rival de racha · 23 anos", avatar: "/people/m9.webp", bio: "Cobrava R$ 6 mil de uma aposta e lançou o desafio valendo a moto de Nando. Levou o carro a uma funilaria no sábado de manhã, sem boletim de ocorrência." },
    { id: "camila", name: "Camila Nunes", role: "Ex-namorada · 20 anos", avatar: "/people/f10.webp", bio: "Discutiu com Nando na lanchonete do posto minutos antes e foi embora de carona com a prima." },
    { id: "arnaldo", name: "Arnaldo Pires", role: "Motorista de ônibus · 58 anos", avatar: "/people/m5.webp", bio: "Cumpria o itinerário da linha madrugadora na avenida. Foi ele quem parou o ônibus e acionou o socorro." },
  ],
  interrogations: {
    gustavo: [
      { id: "q1", q: "Onde você estava às 2h10?", a: "Indo pra casa. Passei na avenida, sim, mas o moleque nem parou pra conversar. Segui reto. Soube do acidente de manhã, pelo grupo." },
      { id: "q2", q: "Você mandou ele parar a moto às 02:08.", a: "Mandei parar pra CONVERSAR. Sobre dinheiro. Isso não é crime, é cobrança. Ele tava me devendo na frente de quarenta pessoas no grupo.", requiresEvidence: "msg_gustavo_divida" },
      { id: "q3", q: "Por que você devolveu os R$ 3 mil no dia seguinte?", a: "…Por respeito. O cara morreu, ué. Não ia ficar com dinheiro de defunto. Isso mostra que eu sou gente boa, não o contrário.", requiresEvidence: "bank_aposta" },
      { id: "q4", q: "A última foto dele mostra seu adesivo no retrovisor, colado atrás.", a: "(Fica muito tempo em silêncio.) Aquele adesivo tem em trinta carros do clube. Trinta! …Que foto é essa? Vocês conseguiram ampliar? Eu… eu quero um advogado.", requiresEvidence: "photo_retrovisor" },
    ],
    camila: [
      { id: "q1", q: "Vocês discutiram pouco antes.", a: "Discutimos, como discutíamos todo fim de semana: eu pedindo pra ele largar os rachas e ele jurando que ia largar. Saí de lá de carona com a minha prima, 1h35. Chorando, mas viva — e ele também estava, quando eu saí.", requiresEvidence: "msg_camila_briga" },
      { id: "q2", q: "Qual era o final da placa da moto dele?", a: "1107. Ele falava que era a sorte do asfalto, tatuou até no capacete. Usava esse número em tudo, senha de celular, de banco, de tudo. Eu vivia brigando por isso também." },
      { id: "q3", q: "O que você sabe sobre o Gustavo?", a: "Que ele humilhou o Nando no grupo a semana inteira por causa de dinheiro. E que o carro dele é um Civic azul, rebaixado, com aquele adesivo redondo do clube no para-brisa. Azul, detetive. Igual a tinta na moto." },
    ],
    arnaldo: [
      { id: "q1", q: "O que o senhor viu?", a: "Eu vi a moto caída e um carro escuro acelerando lá na frente, já longe. Parei o ônibus atravessado, liguei pro resgate e fiquei com o menino. Ele ainda respirava quando eu cheguei, moço." },
      { id: "q2", q: "O senhor cumpria o itinerário normal?", a: "A linha 4712, madrugadora, todo dia há onze anos. Tem GPS da viação, catraca, cartão de ponto e dezoito passageiros naquele horário. Eu dirijo um ônibus, não um projétil." },
      { id: "q3", q: "Descreva o carro que acelerou.", a: "Claro ou azul, baixo, barulhento. Não peguei placa — a vista não é mais a mesma. Mas ele não freou, isso eu garanto. Quem bate sem querer freia. Aquele ali acelerou." },
    ],
  },
  cloud: {
    owner: "G. Veiga",
    items: [
      { id: "i1", kind: "search", label: "Buscas recuperadas — 10/08, manhã", detail: "“funilaria 24h sem boletim” · “quanto tempo some marca de tinta em colisão” · “câmera da avenida das indústrias existe?”", evidenceId: "cloud_search" },
      { id: "i2", kind: "photo", label: "Foto — lataria do Civic azul", detail: "Imagem do para-choque dianteiro direito amassado, com risco de tinta preta, enviada a uma funilaria às 09:12 de 10/08." },
      { id: "i3", kind: "note", label: "Mensagem apagada do grupo", detail: "ele vai pagar hoje de um jeito ou de outro. ninguém me passa pra trás na frente de todo mundo.", evidenceId: "cloud_note" },
    ],
  },
  motives: [
    { id: "aposta", label: "Cobrar à força a dívida de aposta e a humilhação pública no grupo" },
    { id: "ciume", label: "Ciúme do relacionamento com a ex-namorada" },
    { id: "acidente", label: "Acidente de trânsito sem intenção" },
    { id: "moto", label: "Tomar a posse da moto apostada" },
  ],
  methods: [
    { id: "colisao", label: "Colisão intencional com o veículo após perseguição" },
    { id: "obstaculo", label: "Obstáculo colocado na pista" },
    { id: "sabotagem", label: "Sabotagem no freio da motocicleta" },
    { id: "perda", label: "Perda de controle em alta velocidade, sem terceiros" },
  ],
  web: [
    { id: "w1", title: "Entregador de 19 anos morre em colisão seguida de fuga", source: "Agora Zona Leste", url: "agorazl.com/nando-brito", body: "Fernando Brito, 19, morreu na Av. das Indústrias na madrugada de sábado. O caso foi inicialmente registrado como acidente de trânsito. A família contesta e aponta marcas de tinta azul na lateral da moto.", keywords: ["fernando", "nando", "brito", "entregador", "atropelamento", "colisão", "colisao"] },
    { id: "w2", title: "Clube Asfalto Norte — identidade visual", source: "asfaltonorte.club", url: "asfaltonorte.club/loja", body: "O adesivo oficial circular, com borda prateada e tipografia itálica, é exclusivo para associados ativos. Atualmente o clube tem 31 membros cadastrados na capital.", keywords: ["asfalto norte", "adesivo", "clube", "gustavo", "civic"] },
    { id: "w3", title: "Telemetria de aplicativos vira prova em acidentes", source: "Direito & Trânsito", url: "direitotransito.br/telemetria", body: "Registros de velocidade e desvio lateral captados por apps de entrega têm sido aceitos como prova pericial. Uma queda de 80 km/h a zero em menos de um segundo, com desvio lateral, indica impacto — frenagens produzem curva de desaceleração suave.", keywords: ["telemetria", "gps", "velocidade", "app", "prova"] },
  ],
  hints: [
    "A senha é o final da placa da moto. A ex-namorada responde isso na segunda pergunta do interrogatório.",
    "1107. Depois abra a Galeria e selecione a última foto, feita em movimento.",
    "Toque no botão ⓘ dessa foto: os metadados descrevem o que aparece ampliado no retrovisor direito.",
    "No Telegram, leia o grupo RACHA ZL do começo ao fim — o desafio e a cobrança estão lá.",
    "Arnaldo tem GPS da viação e dezoito passageiros; Camila saiu de carona às 1h35. Risque os dois.",
    "A tríade: a dívida cobrada publicamente, a telemetria de 80 a 0 com desvio lateral e o adesivo no retrovisor.",
  ],
  epilogues: {
    perfect: {
      title: "CASO ENCERRADO",
      text: [
        "A perícia ampliou o retrovisor da última foto em laboratório: o adesivo circular do Asfalto Norte apareceu nítido no para-brisa do carro colado atrás, a 19 segundos do impacto.",
        "O Civic azul estava numa funilaria em Guarulhos desde as 9h de sábado, sem boletim de ocorrência. A tinta do para-choque bateu com a da lateral da moto.",
        "Gustavo Veiga foi indiciado por homicídio com dolo eventual. O grupo RACHA ZL foi dissolvido na semana seguinte por decisão judicial.",
        "A mãe de Nando levou a moto para a oficina do Téo, mandou consertar e deixou parada na garagem. Disse que não aguentaria vendê-la — mas também não aguentaria vê-la amassada.",
      ],
    },
    weak: {
      title: "ARQUIVADO COMO ACIDENTE",
      text: [
        "Você apontou o responsável, mas sem a dívida, sem a telemetria e sem o adesivo ampliado, o caso voltou à gaveta como “perda de controle em alta velocidade”.",
        "O Civic foi reparado, vendido e levado para outro estado em menos de um mês.",
        "Reabra o caso: a foto das 02:09 continua no aparelho, esperando um zoom.",
      ],
    },
    wrong: {
      title: "INQUÉRITO ANULADO",
      text: [
        "O motorista de ônibus tinha GPS da viação e dezoito passageiros; a ex-namorada, uma prima e um horário. A acusação não durou uma audiência.",
        "O verdadeiro autor postou no grupo, dois dias depois, uma homenagem com a foto do Nando e a legenda “descansa, parceiro”.",
        "Reabra o dossiê e olhe o retrovisor.",
      ],
    },
  },
};
