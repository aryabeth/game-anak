"use client";

import { useSyncExternalStore } from "react";
import { numberWordIdTo99 } from "./number-words";

/** How long the Parent Corner stays open after passing the gate. */
export const PARENT_UNLOCK_MS = 10 * 60 * 1000;

let unlockedUntil = 0;
let expiryTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export function unlockParentArea() {
  unlockedUntil = Date.now() + PARENT_UNLOCK_MS;
  clearTimeout(expiryTimer);
  expiryTimer = setTimeout(emit, PARENT_UNLOCK_MS + 50);
  emit();
}

export function lockParentArea() {
  unlockedUntil = 0;
  clearTimeout(expiryTimer);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Lives in memory only: reloading the page locks the Parent Corner again. */
export function useParentUnlocked(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => Date.now() < unlockedUntil,
    () => false,
  );
}

export interface GateChallenge {
  target: number;
  words: string;
  options: number[];
}

/**
 * Second gate step: tap the numeral for a number written in words
 * ("empat puluh tujuh" → 47). Distractors reuse the same digits so the answer
 * cannot be found by matching shapes.
 */
export function createGateChallenge(random: () => number = Math.random): GateChallenge {
  let target = 0;
  while (target % 10 === 0 || Math.floor(target / 10) === target % 10) {
    target = 21 + Math.floor(random() * 79);
  }
  const tens = Math.floor(target / 10);
  const units = target % 10;
  const candidates = [units * 10 + tens, target + 10 > 99 ? target - 20 : target + 10, target - 1, target + 1];
  const distractors = candidates.filter((n, i) => n !== target && n > 10 && n < 100 && candidates.indexOf(n) === i);
  const options = [target, ...distractors.slice(0, 3)];
  // Shuffle so the answer is not always first.
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { target, words: numberWordIdTo99(target), options };
}
