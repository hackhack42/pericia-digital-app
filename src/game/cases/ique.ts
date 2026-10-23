import type { CaseData } from "../types";

export const iqueCase: CaseData = {
  id: "ique",
  no: "1407",
  title: "Maré Vermelha",
  tagline: "Disseram que o mar levou. O mar não tira o colete salva-vidas de ninguém.",
  difficulty: 2,
  minRank: 3,
  pin: "0612",
  pinHints: [
    "Pescador não decora aniversário: decora o dia em que comprou o próprio barco.",
    "O sócio diz com inveja: a Santa Luzia foi registrada em 6 de dezembro.",
    "06/12 → 0612.",
  ],
  lockTime: "04:52",
  lockDate: "quarta-feira, 14 de julho",
  victim: {
    name: "Henrique “Iquê” Salomão",
    age: 47,
    role: "mestre de pesca · barco Santa Luzia",
    photo: "/people/m9.webp",
    line1: "Registrou a Santa Luzia em 06/12 · 24 anos de mar, nunca saiu sem colete.",
    line2: "Corpo recuperado a 6 milhas da costa. Sem colete. A lancha voltou sozinha ao atracadouro.",
  },
  briefing: [
    "RELATÓRIO Nº 1407 — DELEGACIA DO LITORAL NORTE",
    "Vítima: Henrique Salomão, 47, o “Iquê”, mestre de pesca e dono do barco Santa Luzia.",
    "Corpo recuperado por outra embarcação a 6 milhas da costa, às 11h de 14/07.",
    "A Capitania registrou como afogamento acidental: “queda durante manobra noturna”.",
    "PROBLEMA 1: ele não usava o colete — e o colete dele estava pendurado, seco, na cabine.",
    "PROBLEMA 2: há hematoma occipital compatível com golpe, anterior à submersão.",
    "PROBLEMA 3: a Santa Luzia atracou sozinha às 5h40, com o motor desligado por terceiros.",
    "O celular estava num saco plástico selado, no bolso da capa. BLOQUEADO e funcionando.",
  ],
  timeline: [
    ["03:10", "Santa Luzia deixa o atracadouro. Duas pessoas a bordo, segundo o vigia."],
    ["04:05", "Iquê fotografa a rede sendo recolhida — carga incomum."],
    ["04:52", "Última atividade do celular: foto do painel de navegação."],
    ["05:02", "GPS náutico registra parada de 11 minutos a 6 milhas — fora de qualquer pesqueiro."],
    ["05:40", "O barco atraca sozinho. Motor desligado manualmente no cais."],
    ["11:00", "Corpo recuperado pela embarcação Marisol."],
  ],
  evidence: {
    msg_bento_sociedade: { id: "msg_bento_sociedade", title: "Rompimento da sociedade", desc: "Iquê avisou o sócio Bento que ia desfazer a sociedade e denunciar “a carga que não é peixe”.", source: "Mensagens" },
    msg_dalva_seguro: { id: "msg_dalva_seguro", title: "Seguro da embarcação", desc: "A esposa Dalva lembra que o seguro do barco cobre perda total e morte do mestre — mas é ela quem insiste em vender tudo e sair do mar.", source: "Mensagens" },
    msg_tiao_briga: { id: "msg_tiao_briga", title: "Briga no atracadouro", desc: "Tião, marinheiro dispensado, ameaçou “afundar a Santa Luzia com o dono dentro” depois de ser demitido.", source: "Mensagens" },
    note_carga: { id: "note_carga", title: "A carga que não é peixe", desc: "Nota da vítima: “3 fardos lacrados na rede, de novo. isso não é pescado. domingo eu falo com a Capitania.”", source: "Notas" },
    photo_rede: { id: "photo_rede", title: "Foto da rede — 04:05", desc: "Rede recolhida com três fardos plásticos lacrados entre o pescado. Nenhum deles consta no manifesto de carga.", source: "Fotos" },
    photo_painel: { id: "photo_painel", title: "Última foto — 04:52", desc: "Painel de navegação com a posição e a rota. O destino inserido NÃO é o pesqueiro habitual da Santa Luzia.", source: "Fotos" },
    gps_parada: { id: "gps_parada", title: "Parada de 11 minutos", desc: "Registro do GPS náutico: parada completa de 11 min a 6 milhas, em água de 40 m, sem rede lançada. Depois, rota direta ao cais.", source: "Mapas" },
    exif_coords: { id: "exif_coords", title: "GPS da última foto", desc: "Metadados: a foto das 04:52 foi feita exatamente no ponto da parada — e o corpo foi recuperado a 300 m dali.", source: "Fotos" },
    bank_fardos: { id: "bank_fardos", title: "Pagamentos por fora", desc: "App do banco: Bento recebeu R$ 62 mil em quatro depósitos de um “entreposto” de Santos, nas mesmas datas das pescarias noturnas.", source: "Banco" },
    vault_manifesto: { id: "vault_manifesto", title: "Manifestos no cofre", desc: "Arquivo oculto: quatro manifestos de carga fotografados, todos com peso declarado menor que o desembarcado.", source: "Cofre" },
    cloud_search: { id: "cloud_search", title: "Nuvem dele: as buscas", desc: "Backup de Bento: “corpo boia depois de quanto tempo”, “colete salva-vidas obrigatório fiscalização”, “piloto automático barco voltar sozinho”.", source: "Anexo nuvem" },
    cloud_note: { id: "cloud_note", title: "Nuvem dele: o roteiro", desc: "Nota apagada: “sair 3h. parar nas 6 milhas. tirar o colete antes. piloto automático pro cais e descer na boia do mário.”", source: "Anexo nuvem" },
  },
  conversations: [
    {
      id: "bento", name: "Bento Caiçara", sub: "sócio · 40% da Santa Luzia", avatar: "/people/m3.webp", time: "22:40", unread: 1,
      messages: [
        { id: "b1", from: "me", text: "Bento, eu vi os fardos. Três, de novo, na rede. Isso não é pescado e você sabe.", time: "11/07 · 20:10" },
        { id: "b2", from: "them", text: "É encomenda de entreposto, Iquê. Peixe fresco pra Santos. Você virou fiscal agora?", time: "11/07 · 20:22" },
        { id: "b3", from: "me", text: "Peixe lacrado em plástico preto? Domingo eu procuro a Capitania. E vou desfazer a sociedade.", time: "11/07 · 20:30", evidenceId: "msg_bento_sociedade" },
        { id: "b4", from: "them", text: "Você vai acabar com o barco, comigo e com você mesmo. Pensa na Dalva.", time: "11/07 · 20:34" },
        { id: "b5", from: "them", text: "Quarta a gente sai junto, 3h, só nós dois. Eu te mostro de onde vem a carga e você decide com calma.", time: "13/07 · 22:40" },
      ],
    },
    {
      id: "dalva", name: "Dalva", sub: "esposa", avatar: "/people/f8.webp", time: "23:10",
      messages: [
        { id: "dv1", from: "them", text: "Iquê, vende esse barco. A gente abre a peixaria na vila e dorme em casa todo dia.", time: "09/07 · 21:40", evidenceId: "msg_dalva_seguro" },
        { id: "dv2", from: "me", text: "A Santa Luzia é o que eu tenho de mais meu, mulher. Mas depois de domingo talvez não tenha jeito mesmo.", time: "09/07 · 22:02" },
        { id: "dv3", from: "them", text: "Depois de domingo? Tá acontecendo alguma coisa que eu não sei?", time: "09/07 · 22:05" },
        { id: "dv4", from: "them", text: "Leva o colete, velho teimoso. E me manda mensagem quando chegar no pesqueiro.", time: "13/07 · 23:10" },
      ],
    },
    {
      id: "tiao", name: "Tião Barreto", sub: "marinheiro dispensado", avatar: "/people/m10.webp", time: "18:30",
      messages: [
        { id: "t1", from: "them", text: "Você me dispensou por causa de UMA bebedeira, depois de nove anos no teu convés.", time: "02/07 · 17:40" },
        { id: "t2", from: "them", text: "Eu afundo a Santa Luzia com o dono dentro, Iquê. Anota aí.", time: "02/07 · 17:44", evidenceId: "msg_tiao_briga" },
        { id: "t3", from: "me", text: "Procura ajuda, Tião. Quando você parar, eu te chamo de volta. Palavra de mestre.", time: "02/07 · 18:10" },
        { id: "t4", from: "them", text: "…desculpa, chefe. Tô internado na clínica desde segunda. 28 dias. Obrigado por não desistir de mim.", time: "08/07 · 18:30" },
      ],
    },
  ],
  calls: [
    { id: "c1", name: "Bento Caiçara", sub: "celular", type: "in", time: "13/07 · 22:38", duration: "3:12" },
    { id: "c2", name: "Capitania dos Portos", sub: "comercial", type: "out", time: "12/07 · 09:40", duration: "8:04" },
    { id: "c3", name: "Dalva", sub: "casa", type: "missed", time: "14/07 · 06:20" },
    { id: "c4", name: "Entreposto Maré Alta", sub: "comercial", type: "in", time: "10/07 · 16:02", duration: "2:40" },
  ],
  photos: [
    { id: "p1", url: "https://images.pexels.com/photos/4061283/pexels-photo-4061283.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", caption: "—", date: "14/07 · 04:52", location: "6 milhas da costa — fora do pesqueiro", evidenceId: "photo_painel", exif: { camera: "Samsung Galaxy A34 · f/1.8", taken: "14/07 · 04:52:08", gps: "Oceano Atlântico — 6,0 MN da costa", coords: "-23.92114, -45.98220", note: "Mesmo ponto da parada de 11 minutos registrada no GPS náutico. O corpo foi recuperado a 300 m daqui." } },
    { id: "p2", url: "https://images.pexels.com/photos/31954808/pexels-photo-31954808.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", caption: "Três fardos de novo. Isso não é peixe.", date: "14/07 · 04:05", location: "Convés da Santa Luzia", evidenceId: "photo_rede" },
    { id: "p3", kind: "pix", caption: "Oculta — manifestos de carga fotografados", date: "12/07 · 10:02", location: "Pasta protegida", hidden: true, evidenceId: "vault_manifesto", exif: { camera: "Captura", taken: "12/07 · 10:02", note: "Quatro manifestos com peso declarado inferior ao desembarcado, todos assinados pelo sócio." } },
  ],
  notes: [
    { id: "n1", title: "a carga", body: "3 fardos lacrados na rede, de novo.\nisso não é pescado.\no Bento assina o manifesto por mim quando eu não tô no cais.\ndomingo eu falo com a Capitania. e desfaço a sociedade.", updated: "11/07 · 21:00", evidenceId: "note_carga" },
    { id: "n2", title: "senhas", body: "celular: o dia que registrei a Santa Luzia (06/12, chorei no cartório)\nbanco: o prefixo do rádio da Santa Luzia\ncofre do celular: o comprimento do barco em pés", updated: "06/12 · 18:00" },
    { id: "n3", title: "regra do mar", body: "colete SEMPRE. 24 anos, nenhum dia sem.\nquem tira colete no mar tá pedindo pra virar estatística.", updated: "02/02 · 05:00" },
  ],
  mails: [
    { id: "e1", from: "Capitania dos Portos", address: "denuncias@capitania.mar.br", subject: "Protocolo de denúncia 4471 — agendamento", preview: "Sua denúncia sobre carga não declarada foi protocolada. Atendimento presencial: domingo, 10h…", body: "Sr. Henrique Salomão,\n\nSua denúncia sobre carga não declarada em embarcação pesqueira foi protocolada sob o nº 4471.\n\nAtendimento presencial agendado: domingo, 10h, com apresentação do material fotográfico e dos manifestos.\n\nRecomendamos discrição até a data.\n\nEmbarcação: SANTA LUZIA · indicativo de rádio PP-4406\n\nCapitania dos Portos", time: "12/07 · 10:10" },
    { id: "e2", from: "Seguros Atlântico", address: "sinistros@segatlantico.com.br", subject: "Apólice 77-SL — coberturas", preview: "Perda total da embarcação e morte do mestre, com beneficiários em sociedade…", body: "Prezado Sr. Salomão,\n\nConfirmamos as coberturas da apólice 77-SL:\n— Perda total da embarcação: R$ 340.000\n— Morte do mestre em serviço: R$ 200.000\n— Beneficiários: cônjuge (60%) e sócio (40%), conforme contrato social\n\nSeguros Atlântico", time: "01/06 · 08:00" },
  ],
  history: [
    { id: "h1", title: "como denunciar carga não declarada em barco de pesca", url: "google.com/search?q=denunciar+carga+nao+declarada", time: "11/07 · 21:20" },
    { id: "h2", title: "dissolução de sociedade embarcação pesqueira", url: "jus.com.br/sociedade-pesca", time: "11/07 · 21:40" },
    { id: "h3", title: "tábua de marés julho litoral norte", url: "marinha.mil.br/mares", time: "13/07 · 20:02" },
  ],
  bank: {
    password: "4406",
    hint: "Não é a data do registro (isso é o celular). A nota diz: “o prefixo do rádio da Santa Luzia”. O e-mail da Capitania traz o indicativo da embarcação.",
    holder: "HENRIQUE SALOMÃO — BANCO DO LITORAL ····2208",
    balance: "R$ 18.340,90",
    txns: [
      { id: "t1", desc: "RELATÓRIO CRUZADO — Entreposto Maré Alta → B. CAIÇARA (4 depósitos)", date: "10/07 · 16:30", amount: "-R$ 62.000,00", out: true, evidenceId: "bank_fardos" },
      { id: "t2", desc: "Venda de pescado — Peixaria Dois Irmãos", date: "12/07 · 11:00", amount: "+R$ 8.400,00", out: false },
      { id: "t3", desc: "Seguros Atlântico — parcela da apólice 77-SL", date: "01/07 · 06:00", amount: "-R$ 980,00", out: true },
      { id: "t4", desc: "Clínica Reviver — internação T. Barreto (pago por Iquê)", date: "05/07 · 09:00", amount: "-R$ 2.400,00", out: true },
    ],
  },
  vault: { code: "38", hint: "A nota diz: o comprimento do barco em pés. A Santa Luzia tem 38 pés." },
  suspects: [
    { id: "bento", name: "Bento Caiçara", role: "Sócio · 45 anos", avatar: "/people/m3.webp", bio: "Detém 40% da Santa Luzia, assina os manifestos quando Iquê não está no cais e recebeu R$ 62 mil de um entreposto nas noites das pescarias irregulares." },
    { id: "dalva", name: "Dalva Salomão", role: "Esposa · 44 anos", avatar: "/people/f8.webp", bio: "Queria vender o barco e abrir uma peixaria. É beneficiária de 60% do seguro de morte do mestre." },
    { id: "tiao", name: "Tião Barreto", role: "Marinheiro dispensado · 52 anos", avatar: "/people/m10.webp", bio: "Nove anos de convés até ser dispensado por embriaguez. Ameaçou afundar o barco com o dono dentro — e depois pediu desculpas." },
  ],
  interrogations: {
    bento: [
      { id: "q1", q: "O senhor saiu com ele naquela madrugada?", a: "Saí até o cais e voltei. Ele preferiu ir sozinho, estava de mau humor desde domingo. O vigia pode ter confundido — de longe, todo pescador de capa parece o mesmo." },
      { id: "q2", q: "O vigia diz que viu duas pessoas a bordo.", a: "Então o vigia precisa de óculos. Eu dormi em casa. Sozinho, infelizmente — viúvo não tem álibi, detetive, tem solidão.", requiresEvidence: "gps_parada" },
      { id: "q3", q: "Sessenta e dois mil de um entreposto de Santos.", a: "Venda de pescado fora da nota. Todo mundo no cais faz isso, da Bahia ao Chuí. É sonegação, no máximo. Multa. Não é… o que o senhor está insinuando.", requiresEvidence: "bank_fardos" },
      { id: "q4", q: "Ele fotografou os fardos e protocolou denúncia na Capitania.", a: "(Fica branco.) Ele protocolou? …Ele me disse que ia pensar. Ele me disse que ia PENSAR. (Longa pausa.) Eu quero meu advogado.", requiresEvidence: "note_carga" },
    ],
    dalva: [
      { id: "q1", q: "A senhora queria que ele vendesse o barco.", a: "Queria há oito anos. Eu queria ele em casa, não em dinheiro. Agora eu tenho o dinheiro e não tenho ele — é exatamente o oposto do que eu pedi a vida inteira.", requiresEvidence: "msg_dalva_seguro" },
      { id: "q2", q: "Onde a senhora estava?", a: "No posto de saúde da vila, plantão de enfermagem das 19h às 7h. Vinte pacientes, duas colegas e o livro de ocorrências com a minha letra de hora em hora." },
      { id: "q3", q: "Ele saía sem colete?", a: "NUNCA. Em 24 anos, nenhum dia. Ele brigava com todo mundo no cais por causa disso. Quando me disseram que acharam o colete seco na cabine, eu soube na hora que tinha alguém naquele barco." },
    ],
    tiao: [
      { id: "q1", q: "O senhor ameaçou afundar o barco.", a: "Ameacei, bêbado, no meio do cais, na frente de todo mundo. Vergonha da minha vida. Dois dias depois ele pagou minha internação do próprio bolso, detetive. Do próprio bolso.", requiresEvidence: "msg_tiao_briga" },
      { id: "q2", q: "Onde o senhor estava em 14 de julho?", a: "Na Clínica Reviver, em regime fechado, dia 11 de 28. Tem ficha, enfermeira, assinatura de três em três horas. Eu tava lá dentro tentando virar gente de novo por causa dele." },
      { id: "q3", q: "O que o senhor sabe da carga?", a: "Sei que tem uns três anos que aparece fardo lacrado na rede quando a saída é de madrugada. E sei que quem combina a saída de madrugada é o sócio, não o mestre. O Iquê odiava sair no escuro." },
    ],
  },
  cloud: {
    owner: "B. Caiçara",
    items: [
      { id: "i1", kind: "search", label: "Buscas recuperadas — 12 a 13/07", detail: "“corpo boia depois de quanto tempo” · “colete salva-vidas obrigatório fiscalização” · “piloto automático barco voltar sozinho”", evidenceId: "cloud_search" },
      { id: "i2", kind: "photo", label: "Foto — boia do Mário", detail: "Imagem de uma boia de amarração a 800 m do cais, feita às 05:31 de 14/07 — ponto de desembarque discreto." },
      { id: "i3", kind: "note", label: "Nota apagada — “quarta”", detail: "sair 3h. parar nas 6 milhas. tirar o colete antes. piloto automático pro cais e descer na boia do mário. chegar em casa antes do sol.", evidenceId: "cloud_note" },
    ],
  },
  motives: [
    { id: "carga", label: "Impedir a denúncia da carga não declarada e o fim da sociedade" },
    { id: "seguro", label: "Receber o seguro de morte do mestre" },
    { id: "demissao", label: "Vingança pela dispensa do convés" },
    { id: "barco", label: "Ficar com a posse integral da Santa Luzia" },
  ],
  methods: [
    { id: "golpe_mar", label: "Golpe na nuca e lançamento ao mar sem colete, com retorno por piloto automático" },
    { id: "afogamento", label: "Afogamento acidental durante manobra" },
    { id: "naufragio", label: "Sabotagem do casco" },
    { id: "veneno", label: "Envenenamento antes da saída" },
  ],
  web: [
    { id: "w1", title: "Mestre de pesca é encontrado morto a 6 milhas da costa", source: "Jornal do Litoral", url: "jornaldolitoral.br/santa-luzia", body: "Henrique Salomão, 47, dono do barco Santa Luzia, foi encontrado por outra embarcação. A Capitania trata como afogamento acidental. Pescadores do cais estranham: “o Iquê não tirava o colete nem pra dormir”.", keywords: ["henrique", "iquê", "ique", "salomão", "salomao", "pescador", "santa luzia", "afogamento"] },
    { id: "w2", title: "Entreposto Maré Alta é alvo de fiscalização", source: "Costa Notícias", url: "costanoticias.br/mare-alta", body: "O entreposto de Santos aparece em pagamentos a tripulantes de três embarcações do litoral norte. A fiscalização apura uso de redes de pesca para transporte de carga lacrada não declarada.", keywords: ["entreposto", "maré alta", "mare alta", "carga", "fardos", "santos"] },
    { id: "w3", title: "Piloto automático: como um barco volta sozinho ao cais", source: "Náutica Prática", url: "nauticapratica.br/piloto", body: "Sistemas de navegação permitem programar rota de retorno e manter rumo sem tripulação ativa. O registro do GPS, porém, preserva paradas, tempos e desvios — inclusive aqueles sem justificativa de pesca.", keywords: ["piloto automático", "piloto automatico", "gps", "náutico", "nautico", "rota"] },
  ],
  hints: [
    "A senha é a data do registro do barco. O sócio cita isso logo no começo do interrogatório.",
    "06/12 → 0612. Depois leia as Notas: ele anotou o que viu na rede e o que pretendia fazer.",
    "Nas Fotos, toque no ⓘ da última imagem: as coordenadas batem com a parada de 11 minutos no GPS náutico.",
    "O cofre da Calculadora pede o comprimento do barco em pés: 38.",
    "Dalva tem plantão de 12 horas com livro de ocorrências e Tião estava internado em regime fechado. Risque os dois.",
    "A tríade: o rompimento da sociedade com denúncia à Capitania, a nota sobre a carga e os R$ 62 mil do entreposto.",
  ],
  epilogues: {
    perfect: {
      title: "CASO ENCERRADO",
      text: [
        "Bento Caiçara foi preso na boia do Mário, onde deixava o bote que usava para descer antes do cais. O bote ainda tinha areia do convés da Santa Luzia.",
        "O GPS náutico contou a história inteira: saída às 3h10 com duas pessoas, parada de 11 minutos a 6 milhas em água de 40 metros sem rede lançada, e rota direta de volta em piloto automático.",
        "Os três fardos foram apreendidos num galpão do entreposto em Santos, dois dias depois. Nenhum deles tinha peixe.",
        "Dalva vendeu a Santa Luzia e abriu a peixaria na vila, como queria havia oito anos. Pôs o nome do barco na fachada e o colete dele, seco, numa moldura atrás do balcão.",
      ],
    },
    weak: {
      title: "ARQUIVADO COMO AFOGAMENTO",
      text: [
        "Você apontou o sócio certo, mas sem a denúncia na Capitania, sem a nota da carga e sem o dinheiro do entreposto, prevaleceu a versão da “queda durante manobra noturna”.",
        "O seguro pagou a parte dele em quarenta dias. A Santa Luzia voltou a sair de madrugada em agosto.",
        "Reabra o caso: o GPS náutico guarda os onze minutos.",
      ],
    },
    wrong: {
      title: "INQUÉRITO ANULADO",
      text: [
        "A viúva tinha plantão de doze horas com livro de ocorrências; o marinheiro, internação em regime fechado com assinatura de três em três horas. A acusação não resistiu.",
        "O verdadeiro autor recebeu os 40% do seguro, comprou a parte da viúva e rebatizou o barco.",
        "Reabra o dossiê — e olhe o colete seco.",
      ],
    },
  },
};
