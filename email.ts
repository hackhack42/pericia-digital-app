/** Serviço de email via Nodemailer + Gmail SMTP — server-only. */
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const FROM = `"Perícia Digital" <${process.env.GMAIL_USER}>`;
const TO = process.env.FEEDBACK_TO ?? "perciadigital@gmail.com";

export type FeedbackPayload = {
  nome: string;
  matricula: string;
  tipo: string;
  mensagem: string;
  caso?: string;
  nota?: number;
};

export async function sendFeedback(f: FeedbackPayload): Promise<boolean> {
  // Salva no console se SMTP não estiver configurado
  console.log("[FEEDBACK]", JSON.stringify(f));
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS || process.env.GMAIL_APP_PASS === "042615aA@gmail") {
    console.warn("[email] Configure GMAIL_APP_PASS com uma Senha de App do Google (16 chars) para enviar emails reais.");
    return true; // não quebra a UX
  }
  try {
    await transporter.sendMail({
      from: FROM,
      to: TO,
      subject: `[Perícia Digital] Feedback — ${f.tipo} — ${f.matricula}`,
      html: `
        <div style="font-family:monospace;background:#0a0a0c;color:#e7e5e0;padding:32px;border-radius:12px;max-width:600px">
          <img src="cid:logo" style="width:120px;margin-bottom:20px" alt="Perícia Digital"/>
          <h2 style="color:#c9a86a;font-size:22px;margin-bottom:4px">📋 Novo Feedback</h2>
          <p style="color:#9a958e;font-size:13px;margin-bottom:24px">${new Date().toLocaleString("pt-BR")}</p>
          
          <table style="width:100%;border-collapse:collapse">
            ${row("Agente", f.nome)}
            ${row("Matrícula", f.matricula)}
            ${row("Tipo", f.tipo)}
            ${f.caso ? row("Caso", f.caso) : ""}
            ${f.nota !== undefined ? row("Nota", `${f.nota}/5 ${"⭐".repeat(f.nota)}`) : ""}
          </table>
          
          <div style="margin-top:20px;padding:16px;background:#17150f;border-left:3px solid #c9a86a;border-radius:4px">
            <p style="color:#9a958e;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px">Mensagem</p>
            <p style="color:#e7e5e0;font-size:14px;line-height:1.6;margin:0">${f.mensagem.replace(/\n/g, "<br>")}</p>
          </div>
          
          <p style="color:#3a3735;font-size:11px;margin-top:24px">Perícia Digital · Sistema de Investigação Criminal</p>
        </div>
      `,
    });
    return true;
  } catch (e) {
    console.error("[email] sendFeedback error:", e);
    return false;
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(sendFeedback as any).__guarded = true;

export async function sendWelcome(nome: string, matricula: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: FROM,
      to: TO,
      subject: `[Perícia Digital] Novo agente — ${matricula}`,
      html: `
        <div style="font-family:monospace;background:#0a0a0c;color:#e7e5e0;padding:32px;border-radius:12px;max-width:600px">
          <h2 style="color:#c9a86a">🆕 Novo agente registrado</h2>
          ${row("Nome", nome)}
          ${row("Matrícula", matricula)}
          ${row("Data", new Date().toLocaleString("pt-BR"))}
        </div>
      `,
    });
  } catch {
    /* silent */
  }
}

export async function sendGameover(matricula: string, caseName: string): Promise<void> {
  try {
    await transporter.sendMail({
      from: FROM,
      to: TO,
      subject: `[Perícia Digital] Caso resolvido — ${caseName} por ${matricula}`,
      html: `
        <div style="font-family:monospace;background:#0a0a0c;color:#e7e5e0;padding:32px;border-radius:12px;max-width:600px">
          <h2 style="color:#30d158">✅ Caso encerrado com condenação</h2>
          ${row("Agente", matricula)}
          ${row("Caso", caseName)}
          ${row("Data", new Date().toLocaleString("pt-BR"))}
        </div>
      `,
    });
  } catch {
    /* silent */
  }
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 12px 8px 0;color:#9a958e;font-size:12px;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:8px 0;color:#e7e5e0;font-size:14px">${value}</td>
    </tr>
  `;
}
