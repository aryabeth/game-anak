import { describe, expect, it } from "vitest";
import { activities, getModuleActivities, getNextActivity } from "@/data";
import { vocabulary } from "@/data/english";
import { validateActivity, validateAllActivities } from "@/lib/validation";
import { LEARNING_MODULES, type Activity } from "@/types/learning";

describe("learning content", () => {
  it("passes validation", () => {
    expect(validateAllActivities(activities)).toEqual([]);
  });

  it("has at least one activity per module", () => {
    for (const m of LEARNING_MODULES) expect(getModuleActivities(m).length).toBeGreaterThan(0);
  });

  it("covers numbers 1–10 in counting, recognition, or ordering", () => {
    const seen = new Set<number>();
    for (const a of getModuleActivities("numbers")) {
      if (a.kind === "counting") a.rounds.forEach((r) => seen.add(r.count));
      if (a.kind === "choice") a.rounds.forEach((r) => seen.add(Number(r.answerId)));
      if (a.kind === "sequence") a.rounds.forEach((r) => r.answerOrder.forEach((n) => seen.add(Number(n))));
    }
    for (let n = 1; n <= 10; n++) expect(seen.has(n)).toBe(true);
  });

  it("has 8–15 beginner English words", () => {
    const n = Object.keys(vocabulary).length;
    expect(n).toBeGreaterThanOrEqual(8);
    expect(n).toBeLessThanOrEqual(15);
  });

  it("varies the position of the correct choice", () => {
    for (const a of activities) {
      if (a.kind !== "choice") continue;
      const positions = new Set(a.rounds.map((r) => r.choices.findIndex((c) => c.id === r.answerId)));
      expect(positions.size, a.id).toBeGreaterThan(1);
    }
  });

  it("never uses discouraging wording", () => {
    const text = JSON.stringify(activities).toLowerCase();
    for (const banned of ["salah", "gagal", "kalah"]) expect(text).not.toContain(banned);
  });

  it("links each activity to the next one in its module", () => {
    const reading = getModuleActivities("reading");
    expect(getNextActivity(reading[0])).toBe(reading[1]);
    expect(getNextActivity(reading[reading.length - 1])).toBeUndefined();
  });
});

describe("validateActivity catches content mistakes", () => {
  const base = {
    id: "t",
    module: "reading" as const,
    title: "T",
    summary: "",
    completionText: "",
    difficulty: 1 as const,
  };
  const round = { instruction: "x", speak: [{ text: "x", lang: "id-ID" as const }], successText: "", hint: "" };

  it("flags missing answers and duplicate choices", () => {
    const bad: Activity = {
      ...base,
      kind: "choice",
      rounds: [
        {
          ...round,
          id: "r1",
          answerId: "Z",
          choices: [
            { id: "A", label: "A", visual: { kind: "text", text: "A" } },
            { id: "A", label: "A", visual: { kind: "text", text: "A" } },
          ],
        },
      ],
    };
    const errors = validateActivity(bad);
    expect(errors.some((e) => e.includes("duplicate choices"))).toBe(true);
    expect(errors.some((e) => e.includes("not a choice"))).toBe(true);
  });

  it("flags counts that are not among the choices", () => {
    const bad: Activity = {
      ...base,
      kind: "counting",
      rounds: [{ ...round, id: "r1", illustration: "apple", objectName: "apel", count: 5, choices: [3, 4, 6] }],
    };
    expect(validateActivity(bad)).toContain("t/r1: count is not among the choices");
  });

  it("flags a group prompt whose size differs from the answer", () => {
    const bad: Activity = {
      ...base,
      kind: "choice",
      rounds: [
        {
          ...round,
          id: "r1",
          prompt: { kind: "group", illustration: "apple", count: 4 },
          answerId: "5",
          choices: ["4", "5"].map((n) => ({ id: n, label: n, visual: { kind: "text" as const, text: n } })),
        },
      ],
    };
    expect(validateActivity(bad)).toContain("t/r1: group size does not match the answer");
  });

  it("flags empty activities", () => {
    expect(validateActivity({ ...base, kind: "tracing", rounds: [] })).toContain("t: has no rounds");
  });
});
