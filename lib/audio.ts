"use client";

import type { Speech, SpeechLang } from "@/types/learning";

/**
 * Audio uses the device's built-in speech voices (Web Speech API), so the app
 * ships no recorded audio. When no voice exists for a language, callers get
 * "unavailable" and must show the text instead — never a fake "played" state.
 */
export type SpeakResult = "played" | "unavailable" | "interrupted" | "error";

let currentToken = 0;

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  return window.speechSynthesis;
}

function voicesNow(): SpeechSynthesisVoice[] {
  try {
    return synth()?.getVoices() ?? [];
  } catch {
    return [];
  }
}

/** Voices load asynchronously in some browsers; wait briefly for them. */
function loadVoices(timeoutMs = 1200): Promise<SpeechSynthesisVoice[]> {
  const s = synth();
  if (!s) return Promise.resolve([]);
  const now = voicesNow();
  if (now.length > 0) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => {
      s.removeEventListener("voiceschanged", done);
      clearTimeout(timer);
      resolve(voicesNow());
    };
    const timer = setTimeout(done, timeoutMs);
    s.addEventListener("voiceschanged", done);
  });
}

export function pickVoice(voices: SpeechSynthesisVoice[], lang: SpeechLang): SpeechSynthesisVoice | null {
  const prefix = lang.slice(0, 2).toLowerCase();
  const normalized = (v: SpeechSynthesisVoice) => v.lang.replace("_", "-").toLowerCase();
  return (
    voices.find((v) => normalized(v) === lang.toLowerCase()) ??
    voices.find((v) => normalized(v).startsWith(prefix)) ??
    null
  );
}

/** Stops any speech that is playing. */
export function stopSpeech() {
  currentToken++;
  try {
    synth()?.cancel();
  } catch {
    // ignore
  }
}

/**
 * Speaks the given parts one after another. Any earlier speech is cancelled
 * first so clips never overlap.
 */
export async function speak(parts: Speech[], onStart?: () => void): Promise<SpeakResult> {
  const s = synth();
  if (!s || parts.length === 0) return "unavailable";
  stopSpeech();
  const token = currentToken;

  const voices = await loadVoices();
  if (token !== currentToken) return "interrupted";
  const withVoices = parts.map((p) => ({ part: p, voice: pickVoice(voices, p.lang) }));
  if (withVoices.some((p) => p.voice === null)) return "unavailable";

  let anyStarted = false;
  for (const { part, voice } of withVoices) {
    if (token !== currentToken) return "interrupted";
    const result = await speakOne(s, part, voice!, () => {
      if (!anyStarted) onStart?.();
      anyStarted = true;
    });
    if (result !== "played") return token !== currentToken ? "interrupted" : result;
  }
  return anyStarted ? "played" : "error";
}

function speakOne(
  s: SpeechSynthesis,
  part: Speech,
  voice: SpeechSynthesisVoice,
  onStart: () => void,
): Promise<SpeakResult> {
  return new Promise((resolve) => {
    let settled = false;
    let started = false;
    const finish = (r: SpeakResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(r);
    };
    const u = new SpeechSynthesisUtterance(part.text);
    u.lang = part.lang;
    u.voice = voice;
    u.rate = part.lang === "en-US" ? 0.85 : 0.95;
    u.onstart = () => {
      started = true;
      onStart();
    };
    u.onend = () => finish(started ? "played" : "error");
    u.onerror = (e) => finish(e.error === "interrupted" || e.error === "canceled" ? "interrupted" : "error");
    // Some browsers never fire `end`; do not hang forever.
    const timer = setTimeout(() => finish(started ? "played" : "error"), 4000 + part.text.length * 160);
    try {
      s.speak(u);
    } catch {
      finish("error");
    }
  });
}

// ---------- Sound effects (generated tones, no audio files) ----------

let audioContext: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined" || typeof window.AudioContext === "undefined") return null;
  try {
    audioContext ??= new window.AudioContext();
    return audioContext;
  } catch {
    return null;
  }
}

/** A short, soft two- or three-note chime. Resolves when it has finished. */
export function playChime(kind: "success" | "complete"): Promise<void> {
  const ctx = context();
  if (!ctx) return Promise.resolve();
  const notes = kind === "success" ? [523.25, 659.25] : [523.25, 659.25, 783.99];
  const step = 0.14;
  try {
    if (ctx.state === "suspended") void ctx.resume();
    const start = ctx.currentTime + 0.02;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = start + i * step;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    });
  } catch {
    return Promise.resolve();
  }
  const totalMs = (notes.length * step + 0.3) * 1000;
  return new Promise((resolve) => setTimeout(resolve, totalMs));
}
