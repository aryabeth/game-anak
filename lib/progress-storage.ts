import { LEARNING_MODULES, type Activity, type LearningModule } from "@/types/learning";
import type {
  ActivityProgress,
  ActivityStatus,
  AppSettings,
  LocalAppData,
  StorageHealth,
} from "@/types/progress";

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = "little-learners";
/** Finishing an activity this many times earns the "often practiced" label. */
export const OFTEN_PRACTICED_COUNT = 3;
const MAX_NICKNAME_LENGTH = 20;

export const DEFAULT_SETTINGS: AppSettings = {
  audioEnabled: true,
  soundEffectsEnabled: true,
};

export function createDefaultData(now: Date = new Date(), profileId = makeId()): LocalAppData {
  return {
    schemaVersion: SCHEMA_VERSION,
    profile: { id: profileId, createdAt: now.toISOString() },
    settings: { ...DEFAULT_SETTINGS },
    progress: [],
  };
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- Validation ----------

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isCount = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 0;
const isIsoDate = (v: unknown): v is string => typeof v === "string" && !Number.isNaN(Date.parse(v));

function parseProgress(v: unknown): ActivityProgress | null {
  if (!isRecord(v)) return null;
  const { activityId, module, attempts, completedCount, lastPracticedAt } = v;
  if (typeof activityId !== "string" || !activityId) return null;
  if (!LEARNING_MODULES.includes(module as LearningModule)) return null;
  if (!isCount(attempts) || !isCount(completedCount)) return null;
  if (lastPracticedAt !== undefined && !isIsoDate(lastPracticedAt)) return null;
  return {
    activityId,
    module: module as LearningModule,
    attempts,
    completedCount,
    ...(lastPracticedAt ? { lastPracticedAt } : {}),
  };
}

/**
 * Validates data read from storage. Returns null when the data is not a
 * readable version of `LocalAppData`. Individual invalid progress entries are
 * dropped instead of discarding everything.
 */
export function parseAppData(raw: unknown): LocalAppData | null {
  if (!isRecord(raw) || raw.schemaVersion !== SCHEMA_VERSION) return null;
  const { profile, settings, progress, lastActivityId } = raw;
  if (!isRecord(profile) || typeof profile.id !== "string" || !isIsoDate(profile.createdAt)) return null;
  if (!isRecord(settings) || !Array.isArray(progress)) return null;

  const nickname = typeof profile.nickname === "string" ? cleanNickname(profile.nickname) : undefined;
  return {
    schemaVersion: SCHEMA_VERSION,
    profile: {
      id: profile.id,
      createdAt: profile.createdAt,
      ...(nickname ? { nickname } : {}),
    },
    settings: {
      audioEnabled:
        typeof settings.audioEnabled === "boolean" ? settings.audioEnabled : DEFAULT_SETTINGS.audioEnabled,
      soundEffectsEnabled:
        typeof settings.soundEffectsEnabled === "boolean"
          ? settings.soundEffectsEnabled
          : DEFAULT_SETTINGS.soundEffectsEnabled,
    },
    progress: progress.map(parseProgress).filter((p): p is ActivityProgress => p !== null),
    ...(typeof lastActivityId === "string" && lastActivityId ? { lastActivityId } : {}),
  };
}

export function cleanNickname(value: string): string | undefined {
  const trimmed = value.replace(/\s+/g, " ").trim().slice(0, MAX_NICKNAME_LENGTH);
  return trimmed || undefined;
}

// ---------- Storage adapter (replaceable later by a backend) ----------

export interface ProgressStorage {
  load(): { data: LocalAppData; health: StorageHealth };
  /** Returns false when the data could not be written. */
  save(data: LocalAppData): boolean;
}

export function createLocalProgressStorage(getStorage: () => Storage | null): ProgressStorage {
  const storage = (): Storage | null => {
    try {
      return getStorage();
    } catch {
      return null;
    }
  };

  return {
    load() {
      const s = storage();
      if (!s) return { data: createDefaultData(), health: "unavailable" };
      let text: string | null;
      try {
        text = s.getItem(STORAGE_KEY);
      } catch {
        return { data: createDefaultData(), health: "unavailable" };
      }
      if (text === null) return { data: createDefaultData(), health: "ok" };
      try {
        const parsed = parseAppData(JSON.parse(text));
        if (parsed) return { data: parsed, health: "ok" };
      } catch {
        // fall through to recovery
      }
      return { data: createDefaultData(), health: "recovered" };
    },
    save(data) {
      const s = storage();
      if (!s) return false;
      try {
        s.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch {
        return false;
      }
    },
  };
}

// ---------- Pure updates ----------

function upsert(
  data: LocalAppData,
  activity: Pick<Activity, "id" | "module">,
  change: (p: ActivityProgress) => ActivityProgress,
): ActivityProgress[] {
  const existing = data.progress.find((p) => p.activityId === activity.id);
  const base: ActivityProgress = existing ?? {
    activityId: activity.id,
    module: activity.module,
    attempts: 0,
    completedCount: 0,
  };
  const updated = change(base);
  return existing
    ? data.progress.map((p) => (p === existing ? updated : p))
    : [...data.progress, updated];
}

export function recordStart(
  data: LocalAppData,
  activity: Pick<Activity, "id" | "module">,
  now: Date = new Date(),
): LocalAppData {
  return {
    ...data,
    lastActivityId: activity.id,
    progress: upsert(data, activity, (p) => ({
      ...p,
      attempts: p.attempts + 1,
      lastPracticedAt: now.toISOString(),
    })),
  };
}

export function recordCompletion(
  data: LocalAppData,
  activity: Pick<Activity, "id" | "module">,
  now: Date = new Date(),
): LocalAppData {
  return {
    ...data,
    lastActivityId: activity.id,
    progress: upsert(data, activity, (p) => ({
      ...p,
      // An activity always counts as started when it is completed.
      attempts: Math.max(p.attempts, p.completedCount + 1),
      completedCount: p.completedCount + 1,
      lastPracticedAt: now.toISOString(),
    })),
  };
}

/** Clears practice history but keeps the profile and settings. */
export function resetProgress(data: LocalAppData): LocalAppData {
  return { ...data, progress: [], lastActivityId: undefined };
}

// ---------- Labels ----------

export function getActivityStatus(p: ActivityProgress | undefined): ActivityStatus {
  if (!p || (p.attempts === 0 && p.completedCount === 0)) return "not-started";
  return p.completedCount > 0 ? "practiced" : "in-progress";
}

/**
 * Modest, transparent labels. They describe practice, not mastery:
 * - Belum dicoba: never opened.
 * - Sedang berlatih: started, not yet finished.
 * - Sudah berlatih: finished at least once.
 * - Sudah sering berlatih: finished at least OFTEN_PRACTICED_COUNT times.
 */
export function getProgressLabel(p: ActivityProgress | undefined): string {
  const status = getActivityStatus(p);
  if (status === "not-started") return "Belum dicoba";
  if (status === "in-progress") return "Sedang berlatih";
  return p && p.completedCount >= OFTEN_PRACTICED_COUNT ? "Sudah sering berlatih" : "Sudah berlatih";
}
