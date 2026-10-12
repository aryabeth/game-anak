"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { currentSettings } from "@/lib/app-store";
import { playChime, speak, stopSpeech, type SpeakResult } from "@/lib/audio";
import type { Speech } from "@/types/learning";

export type SpeechStatus = "idle" | "playing" | "unavailable";

/**
 * Speech playback for one screen. Speech stops when the component unmounts
 * or is hidden by a navigation, so clips never pile up.
 */
export function useSpeech() {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const callId = useRef(0);

  useEffect(() => {
    const ref = callId;
    return () => {
      ref.current++;
      stopSpeech();
    };
  }, []);

  const play = useCallback(async (parts: Speech[], chime?: "success" | "complete"): Promise<SpeakResult> => {
    const id = ++callId.current;
    const settings = currentSettings();
    if (chime && settings.soundEffectsEnabled) {
      stopSpeech();
      await playChime(chime);
      if (id !== callId.current) return "interrupted";
    }
    if (!settings.audioEnabled || parts.length === 0) return "unavailable";
    // Only show "playing" once the device actually starts speaking.
    const result = await speak(parts, () => {
      if (id === callId.current) setStatus("playing");
    });
    if (id === callId.current) {
      setStatus(result === "unavailable" || result === "error" ? "unavailable" : "idle");
    }
    return result;
  }, []);

  const stop = useCallback(() => {
    callId.current++;
    stopSpeech();
    setStatus("idle");
  }, []);

  return { status, play, stop };
}
