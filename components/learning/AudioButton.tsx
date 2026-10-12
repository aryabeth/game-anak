"use client";

import type { SpeechStatus } from "./useSpeech";

/**
 * Replay control. Shows a visible playing state, and an honest fallback when
 * the device has no voice for the language (audio is never faked).
 */
export function AudioButton({
  status,
  audioEnabled,
  onPlay,
  label = "Dengarkan",
}: {
  status: SpeechStatus;
  audioEnabled: boolean;
  onPlay: () => void;
  label?: string;
}) {
  if (!audioEnabled) {
    return (
      <p className="text-sm font-semibold text-muted">
        Suara dimatikan di Pojok Orang Tua.
      </p>
    );
  }
  const playing = status === "playing";
  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={onPlay}
        className={`btn min-h-14 border-2 px-5 ${
          playing ? "border-sage-dark bg-sage text-sage-dark" : "border-sage-dark/25 bg-surface text-sage-dark hover:bg-sage/50"
        }`}
        aria-label={playing ? `${label}: sedang diputar, ketuk untuk mengulang` : label}
      >
        <SpeakerIcon playing={playing} />
        <span>{playing ? "Diputar…" : label}</span>
      </button>
      <p className="min-h-5 text-sm font-semibold text-terracotta-dark" role="status">
        {status === "unavailable" && "Suara belum tersedia di perangkat ini. Bacakan tulisannya bersama, ya."}
      </p>
    </div>
  );
}

function SpeakerIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" focusable="false">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      <path d="M16 9c1.5 1.5 1.5 4.5 0 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {playing && (
        <path d="M18.5 6.5c3 3 3 8 0 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}
