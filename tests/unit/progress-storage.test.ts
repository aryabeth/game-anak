import { describe, expect, it } from "vitest";
import {
  STORAGE_KEY,
  createDefaultData,
  createLocalProgressStorage,
  getProgressLabel,
  parseAppData,
  recordCompletion,
  recordStart,
  resetProgress,
} from "@/lib/progress-storage";

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  failWrites = false;
  get length() {
    return this.map.size;
  }
  clear() {
    this.map.clear();
  }
  getItem(key: string) {
    return this.map.get(key) ?? null;
  }
  key(i: number) {
    return [...this.map.keys()][i] ?? null;
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  setItem(key: string, value: string) {
    if (this.failWrites) throw new Error("QuotaExceededError");
    this.map.set(key, value);
  }
}

const activity = { id: "reading-letters", module: "reading" as const };
const now = new Date("2026-01-02T03:04:05.000Z");

describe("progress updates", () => {
  it("records a start and a completion once each", () => {
    let data = createDefaultData(now, "child");
    data = recordStart(data, activity, now);
    expect(data.lastActivityId).toBe("reading-letters");
    expect(getProgressLabel(data.progress[0])).toBe("Sedang berlatih");

    data = recordCompletion(data, activity, now);
    expect(data.progress).toHaveLength(1);
    expect(data.progress[0]).toMatchObject({ attempts: 1, completedCount: 1, lastPracticedAt: now.toISOString() });
    expect(getProgressLabel(data.progress[0])).toBe("Sudah berlatih");
  });

  it("only says 'often practiced' after three completions", () => {
    let data = createDefaultData(now, "child");
    for (let i = 0; i < 2; i++) data = recordCompletion(recordStart(data, activity, now), activity, now);
    expect(getProgressLabel(data.progress[0])).toBe("Sudah berlatih");
    data = recordCompletion(recordStart(data, activity, now), activity, now);
    expect(getProgressLabel(data.progress[0])).toBe("Sudah sering berlatih");
  });

  it("labels unknown activities as not tried", () => {
    expect(getProgressLabel(undefined)).toBe("Belum dicoba");
  });

  it("reset clears progress but keeps profile and settings", () => {
    let data = createDefaultData(now, "child");
    data = { ...data, profile: { ...data.profile, nickname: "Mia" }, settings: { audioEnabled: false, soundEffectsEnabled: true } };
    data = recordCompletion(recordStart(data, activity, now), activity, now);
    const reset = resetProgress(data);
    expect(reset.progress).toEqual([]);
    expect(reset.lastActivityId).toBeUndefined();
    expect(reset.profile.nickname).toBe("Mia");
    expect(reset.settings.audioEnabled).toBe(false);
  });
});

describe("parseAppData", () => {
  it("accepts valid data", () => {
    const data = recordStart(createDefaultData(now, "child"), activity, now);
    expect(parseAppData(JSON.parse(JSON.stringify(data)))).toEqual(data);
  });

  it("rejects other schema versions and garbage", () => {
    expect(parseAppData({ ...createDefaultData(now), schemaVersion: 99 })).toBeNull();
    expect(parseAppData("hello")).toBeNull();
    expect(parseAppData(null)).toBeNull();
  });

  it("drops invalid progress entries and fills missing settings", () => {
    const raw = {
      ...createDefaultData(now, "child"),
      settings: {},
      progress: [
        { activityId: "ok", module: "numbers", attempts: 1, completedCount: 0 },
        { activityId: "bad", module: "cooking", attempts: 1, completedCount: 0 },
        { activityId: "neg", module: "numbers", attempts: -1, completedCount: 0 },
      ],
    };
    const parsed = parseAppData(raw);
    expect(parsed?.progress.map((p) => p.activityId)).toEqual(["ok"]);
    expect(parsed?.settings).toEqual({ audioEnabled: true, soundEffectsEnabled: true });
  });
});

describe("local storage adapter", () => {
  it("round-trips data", () => {
    const mem = new MemoryStorage();
    const store = createLocalProgressStorage(() => mem);
    const data = recordStart(createDefaultData(now, "child"), activity, now);
    expect(store.save(data)).toBe(true);
    expect(store.load()).toEqual({ data, health: "ok" });
  });

  it("recovers from corrupted JSON", () => {
    const mem = new MemoryStorage();
    mem.setItem(STORAGE_KEY, "{not json");
    const { data, health } = createLocalProgressStorage(() => mem).load();
    expect(health).toBe("recovered");
    expect(data.progress).toEqual([]);
  });

  it("reports unavailable storage and failed writes", () => {
    const blocked = createLocalProgressStorage(() => {
      throw new Error("SecurityError");
    });
    expect(blocked.load().health).toBe("unavailable");
    expect(blocked.save(createDefaultData(now))).toBe(false);

    const mem = new MemoryStorage();
    mem.failWrites = true;
    expect(createLocalProgressStorage(() => mem).save(createDefaultData(now))).toBe(false);
  });
});
