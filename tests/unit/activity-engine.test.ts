import { describe, expect, it } from "vitest";
import { activityReducer, initialActivityState, type ActivityEvent, type ActivityState } from "@/lib/activity-engine";

const run = (events: ActivityEvent["type"][], total = 2): ActivityState =>
  events.reduce((s, type) => activityReducer(s, { type } as ActivityEvent), initialActivityState(total));

describe("activity engine", () => {
  it("walks ready → inProgress → feedback → completed", () => {
    expect(run(["start"]).phase).toBe("inProgress");
    expect(run(["start", "solve"]).phase).toBe("feedback");
    expect(run(["start", "solve", "next"])).toMatchObject({ phase: "inProgress", roundIndex: 1 });
    expect(run(["start", "solve", "next", "solve", "next"]).phase).toBe("completed");
  });

  it("ignores repeated or out-of-order events", () => {
    // Double solve / double next cannot skip a round.
    expect(run(["start", "solve", "solve", "next", "next"])).toMatchObject({ phase: "inProgress", roundIndex: 1 });
    // Next without solving does nothing.
    expect(run(["start", "next"])).toMatchObject({ phase: "inProgress", roundIndex: 0 });
    // Completed stays completed.
    expect(run(["start", "solve", "next", "solve", "next", "next", "solve"]).phase).toBe("completed");
  });

  it("counts misses per round without penalty", () => {
    const s = run(["start", "miss", "miss"]);
    expect(s).toMatchObject({ phase: "inProgress", misses: 2 });
    expect(run(["start", "miss", "solve", "next"]).misses).toBe(0);
  });

  it("restarts from the first round after completion", () => {
    expect(run(["start", "solve", "next", "solve", "next", "restart"])).toMatchObject({ phase: "inProgress", roundIndex: 0 });
  });

  it("cannot start an activity with no rounds", () => {
    expect(run(["start"], 0).phase).toBe("ready");
  });
});
