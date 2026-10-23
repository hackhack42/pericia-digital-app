import type { CaseData } from "../types";

export const wilsonCase: CaseData = {
  id: "wilson",
  no: "1203",
  title: "Turno da Madrugada",
  tagline: "O vigia caiu do mezanino às 3h47. O relógio de ponto dele bateu saída às 3h50.",
  difficulty: 2,
  minRank: 2,
  pin: "1904",
  pinHints: [
    "Ele não usava a data da promoção no celular — isso é do banco. No aparelho ele punha os anos de casa.",
    "O dossiê diz: 19 anos de casa. E o setor dele era o 04, o mezanino leste.",
    "19 + 04 → 1904.",
  ],
  lockTime: "03:47",
  lockDate: "segunda-feira, 3 de junho",
  victim: {
    name: "Wilson Tapajós",
    age: 56,
    role: "vigilante-chefe do Shopping Alvorada",
    photo: "/people/m5.webp",
    line1: "Vigilante-chefe desde 22/04 · 19 anos de casa, nunca faltou um turno.",
    line2: "Encontrado no piso térreo, abaixo do mezanino leste. Queda de 7 metros durante a ronda das 3h40.",
  },
  briefing: [
    "RELATÓRIO Nº 1203 — DELEGACIA DE HOMICÍDIOS · 2º DISTRITO",
    "Vítima: Wilson Tapajós, 56, vigilante-chefe do Shopping Alvorada.",
    "Encontrado no térreo às 5h10, abaixo do guarda-corpo do mezanino leste.",
    "A empresa registrou como acidente de trabalho: “tontura durante a ronda”.",
    "PROBLEMA 1: o relógio de ponto marcou a SAÍDA dele às 3h50 — três minutos após a queda.",
    "PROBLEMA 2: as câmeras do mezanino ficaram em loop de imagem entre 3h31 e 3h58.",
    "PROBLEMA 3: ele tinha reunião marcada com a auditoria às 9h daquela manhã.",
    "O celular estava no bolso do uniforme, BLOQUEADO, com a tela intacta.",
  ],
  timeline: [
    ["01:15", "Wilson registra no rádio a conferência das docas."],
    ["02:40", "Imagem da doca 4 fotografada pelo celular dele."],
    ["03:31", "Câmeras do mezanino entram em loop (operação feita na sala de monitoramento)."],
    ["03:47", "Última atividade do celular: foto do guarda-corpo solto."],
    ["03:50", "Relógio de ponto registra SAÍDA do crachá de Wilson."],
    ["03:58", "Câmeras voltam ao normal. Mezanino vazio."],
    ["05:10", "Equipe da limpeza encontra o corpo."],
  ],
  evidence: {
    msg_denis_auditoria: { id: "msg_denis_auditoria", title: "Ameaça do supervisor", desc: "Denis pede que Wilson “esqueça” o que viu nas docas e diz que a auditoria “não precisa de herói”.", source: "Mensagens" },
    msg_rosa_ponto: { id: "msg_rosa_ponto", title: "Crachá emprestado", desc: "Rosa, do RH, alerta que o crachá-mestre da supervisão bate ponto em nome de qualquer funcionário.", source: "Mensagens" },
    msg_jonas_divida: { id: "msg_jonas_divida", title: "Colega endividado", desc: "Jonas pedia adiantamentos a Wilson e devia dois meses de aluguel — mas estava de folga médica atestada.", source: "Mensagens" },
    note_docas: { id: "note_docas", title: "O que ele viu nas docas", desc: "Nota da vítima: “carga saindo pela doca 4 às 2h, sem nota. 3ª vez no mês. levar fotos à auditoria segunda, 9h.”", source: "Notas" },
    photo_doca: { id: "photo_doca", title: "Foto da doca 4 — 02:40", desc: "Caminhão sendo carregado às 2h40 com o portão de serviço aberto. Nenhuma ordem de carga registrada no sistema.", source: "Fotos" },
    photo_guardacorpo: { id: "photo_guardacorpo", title: "Última foto — 03:47", desc: "Parafusos do guarda-corpo do mezanino REMOVIDOS, apoiados soltos no encaixe. Ele fotografou a armadilha antes de cair.", source: "Fotos" },
    log_ponto: { id: "log_ponto", title: "Ponto batido após a morte", desc: "Registro de saída às 03:50, três minutos depois da queda, com o crachá-mestre da supervisão — não com o crachá dele.", source: "Sistema" },
    log_cameras: { id: "log_cameras", title: "Loop nas câmeras", desc: "A sala de monitoramento colocou o mezanino em loop das 3h31 às 3h58. A operação exige login de supervisor.", source: "Sistema" },
    bank_carga: { id: "bank_carga", title: "Dinheiro das cargas", desc: "App do banco: Denis recebeu R$ 14 mil em três depósitos de uma transportadora fantasma, nos mesmos dias das saídas sem nota.", source: "Banco" },
    cloud_search: { id: "cloud_search", title: "Nuvem dele: as buscas", desc: "Backup de Denis: “como colocar câmera em loop sem registro”, “queda de 7 metros é fatal?”, “crachá mestre aparece no relatório?”.", source: "Anexo nuvem" },
    cloud_note: { id: "cloud_note", title: "Nuvem dele: o plano", desc: "Nota apagada: “loop às 3h30. soltar os parafusos antes. bater o ponto depois pra parecer que ele saiu andando.”", source: "Anexo nuvem" },
  },
  conversations: [
    {
      id: "denis", name: "Denis Barroso", sub: "supervisor de operações", avatar: "/people/m3.webp", time: "23:40", unread: 1,
      messages: [
        { id: "d1", from: "them", text: "Wilson, soube que você andou fotografando a doca 4 de madrugada.", time: "01/06 · 18:02" },
        { id: "d2", from: "me", text: "Andei. Carga saindo às 2h sem nota, três vezes esse mês. Meu trabalho é olhar, Denis.", time: "01/06 · 18:20" },
        { id: "d3", from: "them", text: "Seu trabalho é bater ronda e ir pra casa. A auditoria não precisa de herói de 56 anos com filho na faculdade.", time: "01/06 · 18:24", evidenceId: "msg_denis_auditoria" },
        { id: "d4", from: "me", text: "Segunda, 9h, eu levo as fotos. Se você quiser falar antes, fale.", time: "01/06 · 18:40" },
        { id: "d5", from: "them", text: "Hoje eu fico até tarde na sala de monitoramento. Passa lá no meio da ronda que a gente conversa como gente grande.", time: "02/06 · 23:40" },
      ],
    },
    {
      id: "rosa", name: "Rosa Bentes", sub: "RH do shopping", avatar: "/people/f8.webp", time: "17:10",
      messages: [
        { id: "r1", from: "me", text: "Rosa, uma dúvida chata: o relógio de ponto distingue crachá do funcionário e crachá-mestre?", time: "30/05 · 16:40" },
        { id: "r2", from: "them", text: "No relatório simples, não. O mestre da supervisão bate em nome de qualquer um e sai igualzinho. Eu já reclamei disso mil vezes.", time: "30/05 · 17:10", evidenceId: "msg_rosa_ponto" },
        { id: "r3", from: "me", text: "Entendi. Guarda essa conversa, por favor.", time: "30/05 · 17:14" },
      ],
    },
    {
      id: "jonas", name: "Jonas Pike", sub: "vigilante · mesma equipe", avatar: "/people/m4.webp", time: "20:02",
      messages: [
        { id: "j1", from: "them", text: "Chefe, me adianta 800? Tô com dois meses de aluguel atrasado, juro que pago no dia 10.", time: "28/05 · 09:10", evidenceId: "msg_jonas_divida" },
        { id: "j2", from: "me", text: "Passo no PIX hoje. Não precisa pagar, precisa resolver a vida.", time: "28/05 · 09:30" },
        { id: "j3", from: "them", text: "Chefe, tô de atestado desde sexta, aquela cirurgia no joelho. Volto dia 12. Qualquer coisa me chama no zap.", time: "02/06 · 20:02" },
      ],
    },
  ],
  calls: [
    { id: "c1", name: "Denis Barroso", sub: "rádio interno", type: "in", time: "03/06 · 03:28", duration: "0:44" },
    { id: "c2", name: "Auditoria Externa — Krauss", sub: "comercial", type: "out", time: "01/06 · 14:02", duration: "12:40" },
    { id: "c3", name: "Rosa Bentes", sub: "ramal 214", type: "out", time: "30/05 · 16:38", duration: "6:20" },
    { id: "c4", name: "Filho — Caio", sub: "celular", type: "in", time: "02/06 · 21:40", duration: "18:02" },
  ],
  photos: [
    { id: "p1", url: "https://images.pexels.com/photos/12616007/pexels-photo-12616007.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", caption: "—", date: "03/06 · 03:47", location: "Shopping Alvorada — mezanino leste", evidenceId: "photo_guardacorpo", exif: { camera: "Motorola Edge · f/1.8", taken: "03/06 · 03:47:22", gps: "Shopping Alvorada — mezanino leste", coords: "-23.58812, -46.63204", note: "Os quatro parafusos do guarda-corpo aparecem soltos no encaixe, sem rosca. A foto é de 1 min antes da queda." } },
    { id: "p2", url: "https://images.pexels.com/photos/36826094/pexels-photo-36826094.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", caption: "Doca 4, de novo. Terceira vez esse mês.", date: "03/06 · 02:40", location: "Shopping Alvorada — doca 4", evidenceId: "photo_doca", exif: { camera: "Motorola Edge · f/1.8", taken: "03/06 · 02:40:10", gps: "Doca de serviço 4", coords: "-23.58830, -46.63251", note: "Carregamento noturno sem ordem de carga correspondente no sistema." } },
  ],
  notes: [
    { id: "n1", title: "doca 4", body: "carga saindo pela doca 4 às 2h, sem nota. 3ª vez no mês.\nsempre com o portão de serviço liberado por login de supervisão.\nlevar as fotos à auditoria segunda, 9h.\nnão comentar com ninguém da operação.", updated: "01/06 · 03:10", evidenceId: "note_docas" },
    { id: "n2", title: "senhas", body: "celular: meus anos de casa (19) + meu setor (04)\nbanco: o dia que virei chefe (22/04, teve churrasco na garagem)\narmário: 19", updated: "22/04 · 20:00" },
  ],
  mails: [
    { id: "e1", from: "Krauss Auditoria", address: "contato@kraussaudit.com.br", subject: "Reunião segunda, 9h — divergências de carga", preview: "Confirmada a reunião para apresentação do material fotográfico…", body: "Sr. Wilson,\n\nConfirmada a reunião de segunda-feira, 9h, para apresentação do material fotográfico sobre as saídas de carga não registradas.\n\nRecomendamos que o senhor não antecipe o conteúdo à gerência de operações antes do nosso encontro.\n\nKrauss Auditoria", time: "01/06 · 14:20" },
    { id: "e2", from: "Alvorada Administração", address: "rh@shoppingalvorada.com.br", subject: "Espelho de ponto — junho", preview: "Entrada 22:00 · Saída 03:50…", body: "ESPELHO DE PONTO — W. TAPAJÓS\n\n03/06\nEntrada: 22:00\nSaída: 03:50\n\nObservação do sistema: registro de saída efetuado em terminal da sala de monitoramento.", time: "03/06 · 06:00", evidenceId: "log_ponto" },
  ],
  history: [
    { id: "h1", title: "denúncia de desvio de carga como proteger testemunha", url: "google.com/search?q=denuncia+desvio+carga", time: "01/06 · 03:40" },
    { id: "h2", title: "guarda-corpo norma altura mezanino", url: "abnt.br/nbr-14718", time: "31/05 · 22:10" },
    { id: "h3", title: "faculdade mensalidade parcelamento junho", url: "unifac.br/financeiro", time: "02/06 · 21:50" },
  ],
  bank: {
    password: "2204",
    hint: "O banco usa o dia em que ele virou vigilante-chefe (22/04) — diferente do celular. O colega cita no interrogatório.",
    holder: "WILSON TAPAJÓS — BANCO POPULAR ····1190",
    balance: "R$ 3.208,44",
    txns: [
      { id: "t1", desc: "RELATÓRIO CRUZADO — Transp. Vega (fantasma) → D. BARROSO", date: "01/06 · 10:00", amount: "-R$ 14.000,00", out: true, evidenceId: "bank_carga" },
      { id: "t2", desc: "Salário — Alvorada Administração", date: "01/06 · 06:00", amount: "+R$ 3.840,00", out: false },
      { id: "t3", desc: "PIX enviado — Jonas Pike (adiantamento)", date: "28/05 · 09:35", amount: "-R$ 800,00", out: true },
      { id: "t4", desc: "Unifac — mensalidade do Caio", date: "02/06 · 08:00", amount: "-R$ 1.190,00", out: true },
    ],
  },
  suspects: [
    { id: "denis", name: "Denis Barroso", role: "Supervisor de operações · 44 anos", avatar: "/people/m3.webp", bio: "Único com login para liberar a doca de serviço, colocar câmeras em loop e usar o crachá-mestre. Recebeu R$ 14 mil de uma transportadora que não existe." },
    { id: "jonas", name: "Jonas Pike", role: "Vigilante · 33 anos", avatar: "/people/m4.webp", bio: "Devia dois meses de aluguel e pedia adiantamentos a Wilson. Estava de atestado médico desde sexta-feira." },
    { id: "rosa", name: "Rosa Bentes", role: "RH · 48 anos", avatar: "/people/f8.webp", bio: "Conhece todas as falhas do sistema de ponto e já havia reclamado delas por escrito à diretoria." },
  ],
  interrogations: {
    denis: [
      { id: "q1", q: "Onde o senhor estava às 3h47?", a: "Na sala de monitoramento, como em toda madrugada de segunda. Trabalho administrativo. Soube da queda pela equipe da limpeza, igual a todo mundo." },
      { id: "q2", q: "As câmeras do mezanino ficaram em loop por 27 minutos.", a: "Instabilidade do gravador. Aquele sistema é de 2016, trava sozinho toda semana. Pode perguntar pra manutenção.", requiresEvidence: "log_cameras" },
      { id: "q3", q: "O ponto dele foi batido às 3h50, do seu terminal.", a: "…O crachá-mestre fica na sala, qualquer supervisor usa. Eu bato ponto de gente esquecida toda semana — é favor, não é crime.", requiresEvidence: "log_ponto" },
      { id: "q4", q: "Catorze mil reais de uma transportadora que não existe.", a: "(Silêncio.) Frete avulso. Eu intermediava carga de terceiros fora do horário, tá? Isso é bico, é no máximo demissão. Não é… (para) Eu quero meu advogado.", requiresEvidence: "bank_carga" },
    ],
    jonas: [
      { id: "q1", q: "Onde você estava naquela madrugada?", a: "Em casa, com a perna pra cima. Cirurgia de menisco na sexta, atestado de 10 dias, e eu moro a 40 minutos de ônibus do shopping. Nem andar direito eu andava." },
      { id: "q2", q: "Você devia dinheiro a ele.", a: "Devia 800 que ele me deu e mandou eu NÃO devolver. O homem pagou a mensalidade do filho dele atrasada pra me adiantar grana, detetive. Eu chorei no velório igual criança.", requiresEvidence: "msg_jonas_divida" },
      { id: "q3", q: "Que códigos ele costumava usar?", a: "No banco, a data que virou chefe: 22 de abril, teve churrasco e tudo. Mas no celular não — ele dizia que data qualquer um descobre. No celular ele punha os 19 anos de casa com o setor dele, o 04. Mil novecentos e quatro, ele falava, “igual ano de história”." },
    ],
    rosa: [
      { id: "q1", q: "A senhora conhece as falhas do relógio de ponto.", a: "Conheço e denunciei três vezes por e-mail, com cópia pra diretoria. O crachá-mestre registra entrada e saída de qualquer funcionário sem distinção no relatório simples. É um convite.", requiresEvidence: "msg_rosa_ponto" },
      { id: "q2", q: "Onde a senhora estava?", a: "Dormindo, como qualquer pessoa do administrativo às quatro da manhã. Meu crachá tem último registro às 18h12 de sexta-feira." },
      { id: "q3", q: "O Wilson comentou algo com a senhora?", a: "Comentou que ia à auditoria na segunda e me pediu pra guardar nossa conversa. Guardei. Foi a última coisa que ele me pediu, e eu guardei." },
    ],
  },
  cloud: {
    owner: "D. Barroso",
    items: [
      { id: "i1", kind: "search", label: "Buscas recuperadas — 01 a 02/06", detail: "“como colocar câmera em loop sem registro” · “queda de 7 metros é fatal?” · “crachá mestre aparece no relatório detalhado?”", evidenceId: "cloud_search" },
      { id: "i2", kind: "photo", label: "Foto — chave allen e parafusos", detail: "Imagem de quatro parafusos sextavados sobre a bancada da sala de monitoramento, feita às 23:58 de 02/06." },
      { id: "i3", kind: "note", label: "Nota apagada — “segunda”", detail: "loop às 3h30. soltar os parafusos antes. chamar ele no rádio pro mezanino. bater o ponto depois pra parecer que ele saiu andando.", evidenceId: "cloud_note" },
    ],
  },
  motives: [
    { id: "carga", label: "Impedir a entrega das fotos do desvio de carga à auditoria" },
    { id: "aluguel", label: "Dívida pessoal com a vítima" },
    { id: "promocao", label: "Disputa pelo cargo de vigilante-chefe" },
    { id: "pessoal", label: "Desavença antiga entre colegas de turno" },
  ],
  methods: [
    { id: "guardacorpo", label: "Remoção dos parafusos do guarda-corpo + câmeras em loop e ponto forjado" },
    { id: "empurrao", label: "Empurrão direto do mezanino" },
    { id: "golpe", label: "Golpe na cabeça antes da queda" },
    { id: "tontura", label: "Mal súbito durante a ronda, sem autoria" },
  ],
  web: [
    { id: "w1", title: "Vigilante morre após queda em shopping na zona norte", source: "Diário da Cidade", url: "diariodacidade.com/alvorada", body: "Wilson Tapajós, 56, vigilante-chefe do Shopping Alvorada há 19 anos, morreu após cair do mezanino leste durante a ronda. A administração fala em acidente de trabalho. A família estranha o registro de saída no ponto.", keywords: ["wilson", "tapajós", "tapajos", "vigilante", "shopping", "alvorada", "queda"] },
    { id: "w2", title: "Transportadora Vega não existe, diz Junta Comercial", source: "Economia Real", url: "economiareal.com/vega", body: "A empresa que aparece em três pagamentos a funcionários do Shopping Alvorada não possui registro ativo, sede ou frota. Especialistas apontam o padrão clássico de “transportadora de papel” usada para lavar fretes irregulares.", keywords: ["vega", "transportadora", "fantasma", "carga", "doca"] },
    { id: "w3", title: "Crachá-mestre: o furo silencioso do controle de ponto", source: "Gestão & RH", url: "gestaorh.br/cracha-mestre", body: "Terminais antigos não diferenciam, no relatório simples, o crachá do funcionário do crachá-mestre da supervisão. Só o log detalhado identifica o terminal de origem do registro.", keywords: ["ponto", "crachá", "cracha", "mestre", "relógio", "relogio"] },
  ],
  hints: [
    "A senha é o dia em que ele virou chefe. O colega Jonas responde isso na terceira pergunta.",
    "O colega Jonas entrega: 19 anos de casa + setor 04 → 1904 no celular. A data da promoção (2204) é do banco.",
    "Compare o horário da última foto (03:47) com o espelho de ponto no Mail (saída 03:50). Mortos não batem ponto.",
    "Só uma função tem login para loop de câmera, portão de doca e crachá-mestre. Pergunte ao RH quem é.",
    "Jonas estava de atestado pós-cirurgia e Rosa tem último crachá na sexta às 18h. Risque os dois.",
    "A tríade: a ameaça do supervisor, a foto do guarda-corpo sem parafusos e o ponto batido depois da morte.",
  ],
  epilogues: {
    perfect: {
      title: "CASO ENCERRADO",
      text: [
        "Os quatro parafusos do guarda-corpo foram encontrados num pote de café na sala de monitoramento, junto com a chave allen.",
        "O log detalhado do ponto apontou o terminal exato: o da sala onde Denis Barroso passou a madrugada inteira sozinho — e de onde o crachá-mestre registrou a saída de um homem já morto no térreo.",
        "A Transportadora Vega não existia. Os R$ 14 mil vieram de três fretes de carga desviada em cinco semanas.",
        "A auditoria aconteceu na segunda-feira, às 9h, como Wilson queria. Quem apresentou as fotos foi o filho dele, Caio, com o celular do pai na mão e a mensalidade da faculdade finalmente paga pelo acordo trabalhista.",
      ],
    },
    weak: {
      title: "ARQUIVADO COMO ACIDENTE DE TRABALHO",
      text: [
        "Você apontou o responsável, mas sem a ameaça escrita, sem a foto do guarda-corpo e sem o ponto forjado, prevaleceu a versão da “tontura durante a ronda”.",
        "O seguro pagou, a doca 4 voltou a operar de madrugada e o guarda-corpo foi consertado na terça-feira.",
        "Reabra o caso: a última foto dele ainda está no aparelho.",
      ],
    },
    wrong: {
      title: "INQUÉRITO ANULADO",
      text: [
        "Um estava de atestado pós-cirúrgico; a outra tinha o último registro de crachá numa sexta-feira à tarde. Nada se sustentou.",
        "O verdadeiro autor foi promovido a gerente de operações em agosto e discursou sobre “segurança patrimonial” no treinamento dos novos vigilantes.",
        "Reabra o dossiê.",
      ],
    },
  },
};
