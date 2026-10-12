import type { LearningModule } from "./learning";

export type ActivityStatus = "not-started" | "in-progress" | "practiced";

export interface ActivityProgress {
  activityId: string;
  module: LearningModule;
  /** Number of times the activity was started. */
  attempts: number;
  /** Number of times the activity was finished. */
  completedCount: number;
  lastPracticedAt?: string;
}

export interface ChildProfile {
  id: string;
  nickname?: string;
  createdAt: string;
}

export interface AppSettings {
  /** Spoken instructions and words. */
  audioEnabled: boolean;
  /** Short chimes on success and completion. */
  soundEffectsEnabled: boolean;
}

export interface LocalAppData {
  schemaVersion: number;
  profile: ChildProfile;
  settings: AppSettings;
  progress: ActivityProgress[];
  lastActivityId?: string;
}

/**
 * - `ok`: data loaded and saving works.
 * - `recovered`: stored data was unreadable and has been replaced with defaults.
 * - `unavailable`: the browser blocks storage; progress lives only in memory.
 */
export type StorageHealth = "ok" | "recovered" | "unavailable";
