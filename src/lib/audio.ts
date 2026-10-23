"use client";

/**
 * Áudio 100% sintetizado (WebAudio) — sem arquivos, sem download.
 * Cliques táticos de teclado, erro de acesso, desbloqueio, notificação
 * e um ruído branco sutil de terminal forense.
 */

const MUTE_KEY = "caso2471_mute";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let hum: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
let muted = false;

function ensure(): AudioContext | null {
  // NUNCA pode lançar: qualquer exceção aqui mataria o handler de clique.
  try {
    if (typeof window === "undefined") return null;
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    return ctx;
  } catch {
    ctx = null;
    master = null;
    return null;
  }
}

export function initAudio() {
  try {
    if (typeof window === "undefined") return;
    muted = localStorage.getItem(MUTE_KEY) === "1";
    ensure();
  } catch { /* silencioso */ }
}

export function isMuted() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MUTE_KEY) === "1";
}

export function setMuted(v: boolean) {
  try {
    muted = v;
    localStorage.setItem(MUTE_KEY, v ? "1" : "0");
    if (master) master.gain.setTargetAtTime(v ? 0 : 0.5, ctx?.currentTime ?? 0, 0.05);
    if (v) stopHum();
  } catch { /* silencioso */ }
}

/* ---------- blocos ---------- */
function tone(
  freq: number,
  dur: number,
  type: OscillatorType = "square",
  vol = 0.12,
  slideTo?: number
) {
  try {
  const c = ensure();
  if (!c || !master || muted) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(vol, c.currentTime + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  osc.connect(g);
  g.connect(master);
  osc.start();
  osc.stop(c.currentTime + dur + 0.02);
  } catch { /* áudio nunca quebra a UI */ }
}

function noiseBurst(dur: number, vol = 0.08, hp = 1200) {
  try {
  const c = ensure();
  if (!c || !master || muted) return;
  const frames = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, frames, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filt = c.createBiquadFilter();
  filt.type = "highpass";
  filt.frequency.value = hp;
  const g = c.createGain();
  g.gain.value = vol;
  src.connect(filt);
  filt.connect(g);
  g.connect(master);
  src.start();
  } catch { /* silencioso */ }
}

/* ---------- efeitos do jogo ---------- */
const sfxRaw = {
  /** tecla do teclado numérico */
  key() {
    noiseBurst(0.035, 0.05, 2400);
    tone(880 + Math.random() * 120, 0.035, "square", 0.045);
  },
  /** tecla de texto, mais suave */
  type() {
    noiseBurst(0.022, 0.03, 3000);
  },
  /** acesso negado */
  error() {
    tone(220, 0.16, "sawtooth", 0.12);
    setTimeout(() => tone(165, 0.26, "sawtooth", 0.12), 130);
  },
  /** dispositivo desbloqueado */
  unlock() {
    tone(523, 0.1, "sine", 0.11);
    setTimeout(() => tone(659, 0.1, "sine", 0.11), 90);
    setTimeout(() => tone(784, 0.26, "sine", 0.12), 180);
  },
  /** prova anexada ao dossiê */
  evidence() {
    tone(1046, 0.07, "triangle", 0.1);
    setTimeout(() => tone(1318, 0.14, "triangle", 0.09), 70);
  },
  /** mensagem recebida */
  message() {
    tone(740, 0.06, "sine", 0.08);
    setTimeout(() => tone(988, 0.1, "sine", 0.07), 60);
  },
  /** abrir app / navegar */
  tap() {
    tone(420, 0.03, "sine", 0.05);
  },
  /** alerta de suspeita / caso perdido */
  alarm() {
    tone(400, 0.5, "sawtooth", 0.1, 120);
  },
  /** sucesso final */
  solved() {
    [523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => tone(f, 0.3, "sine", 0.1), i * 130)
    );
  },
};

/** Fachada à prova de falhas: nenhum efeito sonoro pode derrubar um clique. */
export const sfx = Object.fromEntries(
  Object.entries(sfxRaw).map(([k, fn]) => [
    k,
    (...args: unknown[]) => {
      try {
        (fn as (...a: unknown[]) => void)(...args);
      } catch {
        /* ignora */
      }
    },
  ])
) as typeof sfxRaw;

/* ---------- ruído ambiente do terminal ---------- */
export function startHum() {
  try {
  const c = ensure();
  if (!c || !master || muted || hum) return;
  const frames = c.sampleRate * 2;
  const buf = c.createBuffer(1, frames, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const filt = c.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = 220;
  const g = c.createGain();
  g.gain.value = 0.012;
  src.connect(filt);
  filt.connect(g);
  g.connect(master);
  src.start();
  hum = { src, gain: g };
  } catch { /* silencioso */ }
}

export function stopHum() {
  if (!hum) return;
  try {
    hum.src.stop();
  } catch {
    /* ignore */
  }
  hum = null;
}
