/**
 * Predictable state machine shared by every activity:
 *
 *   ready ──start──▶ inProgress ──solve──▶ feedback ──next──▶ inProgress (next round)
 *                      │  ▲                     └──next (last round)──▶ completed
 *                      └──┘ miss (hint, retry)                 completed ──restart──▶ inProgress
 *
 * Events that do not fit the current phase are ignored, so repeated taps or
 * duplicated events cannot skip rounds or complete an activity twice.
 */
export type ActivityPhase = "ready" | "inProgress" | "feedback" | "completed";

export interface ActivityState {
  phase: ActivityPhase;
  roundIndex: number;
  totalRounds: number;
  /** Attempts that did not match in the current round. */
  misses: number;
}

export type ActivityEvent =
  | { type: "start" }
  | { type: "miss" }
  | { type: "solve" }
  | { type: "next" }
  | { type: "restart" };

export function initialActivityState(totalRounds: number): ActivityState {
  return { phase: "ready", roundIndex: 0, totalRounds, misses: 0 };
}

export function activityReducer(state: ActivityState, event: ActivityEvent): ActivityState {
  switch (event.type) {
    case "start":
      return state.phase === "ready" && state.totalRounds > 0
        ? { ...state, phase: "inProgress", roundIndex: 0, misses: 0 }
        : state;
    case "miss":
      return state.phase === "inProgress" ? { ...state, misses: state.misses + 1 } : state;
    case "solve":
      return state.phase === "inProgress" ? { ...state, phase: "feedback" } : state;
    case "next":
      if (state.phase !== "feedback") return state;
      return isLastRound(state)
        ? { ...state, phase: "completed" }
        : { ...state, phase: "inProgress", roundIndex: state.roundIndex + 1, misses: 0 };
    case "restart":
      return state.phase === "completed" && state.totalRounds > 0
        ? { ...state, phase: "inProgress", roundIndex: 0, misses: 0 }
        : state;
  }
}

export function isLastRound(state: ActivityState): boolean {
  return state.roundIndex >= state.totalRounds - 1;
}
