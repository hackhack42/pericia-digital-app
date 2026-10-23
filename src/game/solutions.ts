// SERVER-ONLY — nunca importar em componentes de cliente.
export const SOLUTIONS: Record<
  string,
  { suspect: string; motive: string; keyEvidence: string[] }
> = {
  tutorial: {
    suspect: "ivan",
    motive: "denuncia",
    keyEvidence: ["msg_ivan_ameaca", "note_estoque", "photo_portao"],
  },
  marina: {
    suspect: "camila",
    motive: "desvio",
    keyEvidence: ["msg_camila_meeting", "msg_camila_meds", "photo_transfer"],
  },
  otavio: {
    suspect: "beatriz",
    motive: "testamento",
    keyEvidence: ["msg_beatriz_cha", "msg_pai_remedio", "bank_divida"],
  },
  lara: {
    suspect: "bianca",
    motive: "canal",
    keyEvidence: ["msg_bianca_mirante", "msg_lara_trena", "bank_sinal"],
  },
  vivian: {
    suspect: "rhodes",
    motive: "silenciar",
    keyEvidence: ["note_gatilho", "bank_hush", "chat_rhodes_hora"],
  },
  dante: {
    suspect: "renata",
    motive: "auditoria",
    keyEvidence: ["chat_renata_dentro", "chat_renata_log", "bank_venda"],
  },
  ingrid: {
    suspect: "soren",
    motive: "segredo",
    keyEvidence: ["chat_soren_maleta", "note_documentario", "bank_soren"],
  },
  matheus: {
    suspect: "bruno",
    motive: "sociedade",
    keyEvidence: ["chat_bruno_bancada", "chat_bruno_caneta", "bank_bruno"],
  },
  igor: {
    suspect: "lucas",
    motive: "carteira",
    keyEvidence: ["note_remoto", "log_fechadura", "bank_saque"],
  },
  chloe: {
    suspect: "felipe",
    motive: "desvio",
    keyEvidence: ["msg_felipe_multa", "bank_desvio", "agenda_post"],
  },
  tchelo: {
    suspect: "jair",
    motive: "caixa2",
    keyEvidence: ["msg_jair_comissao", "vault_planilha", "trash_alcapao"],
  },
  rostova: {
    suspect: "victor",
    motive: "patente",
    keyEvidence: ["vault_laudos", "bank_patente", "log_app"],
  },
  nando: {
    suspect: "gustavo",
    motive: "aposta",
    keyEvidence: ["msg_gustavo_divida", "gps_telemetria", "photo_retrovisor"],
  },
  arthur: {
    suspect: "clara",
    motive: "falsificacao",
    keyEvidence: ["note_diario", "vault_replica", "log_wifi"],
  },
  wilson: {
    suspect: "denis",
    motive: "carga",
    keyEvidence: ["msg_denis_auditoria", "photo_guardacorpo", "log_ponto"],
  },
  ique: {
    suspect: "bento",
    motive: "carga",
    keyEvidence: ["msg_bento_sociedade", "note_carga", "bank_fardos"],
  },
  kaue: {
    suspect: "ravi",
    motive: "aposta",
    keyEvidence: ["msg_ravi_aposta", "vault_laudo", "bank_aposta"],
  },
  arquivo13: {
    suspect: "galvao",
    motive: "encobrir",
    keyEvidence: ["msg_galvao_bloqueio", "vault_laudos", "bank_galvao"],
  },
};

export type AccuseResult = "perfect" | "weak" | "wrong";
