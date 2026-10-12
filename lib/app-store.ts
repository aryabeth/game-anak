"use client";

import { useSyncExternalStore } from "react";
import type { Activity } from "@/types/learning";
import type { AppSettings, LocalAppData, StorageHealth } from "@/types/progress";
import {
  STORAGE_KEY,
  cleanNickname,
  createDefaultData,
  createLocalProgressStorage,
  recordCompletion,
  recordStart,
  resetProgress,
} from "./progress-storage";

export interface AppState {
  /** False until local data has been read in the browser. */
  ready: boolean;
  data: LocalAppData;
  health: StorageHealth;
}

const storage = createLocalProgressStorage(() =>
  typeof window === "undefined" ? null : window.localStorage,
);

const SERVER_STATE: AppState = {
  ready: false,
  data: createDefaultData(new Date(0), "server"),
  health: "ok",
};

let state: AppState | null = null;
const listeners = new Set<() => void>();

function load(): AppState {
  const { data, health } = storage.load();
  return { ready: true, data, health };
}

function getSnapshot(): AppState {
  if (state === null) state = load();
  return state;
}

function emit() {
  listeners.forEach((l) => l());
}

function onStorageEvent(e: StorageEvent) {
  // Another tab changed the data: reload it.
  if (e.key === STORAGE_KEY || e.key === null) {
    state = load();
    emit();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorageEvent);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorageEvent);
  };
}

function commit(update: (data: LocalAppData) => LocalAppData): boolean {
  const current = getSnapshot();
  const data = update(current.data);
  const saved = storage.save(data);
  state = { ready: true, data, health: saved ? (current.health === "unavailable" ? "ok" : current.health) : "unavailable" };
  emit();
  return saved;
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_STATE);
}

export const appActions = {
  startActivity(activity: Pick<Activity, "id" | "module">) {
    return commit((d) => recordStart(d, activity));
  },
  completeActivity(activity: Pick<Activity, "id" | "module">) {
    return commit((d) => recordCompletion(d, activity));
  },
  updateSettings(patch: Partial<AppSettings>) {
    return commit((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  },
  setNickname(value: string) {
    const nickname = cleanNickname(value);
    return commit((d) => ({ ...d, profile: { id: d.profile.id, createdAt: d.profile.createdAt, ...(nickname ? { nickname } : {}) } }));
  },
  resetProgress() {
    return commit(resetProgress);
  },
};

/** Current settings, readable outside React (e.g. by the audio helpers). */
export function currentSettings(): AppSettings {
  return getSnapshot().data.settings;
}
