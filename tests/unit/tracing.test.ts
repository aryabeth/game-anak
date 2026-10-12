import { describe, expect, it } from "vitest";
import { activities } from "@/data";
import {
  arc,
  createTraceState,
  isTraceComplete,
  line,
  totalCoverage,
  traceSegment,
  type TraceState,
} from "@/lib/tracing";
import type { Point } from "@/types/learning";

/** Simulates a pointer drag along the given points. */
function drag(state: TraceState, points: Point[]): TraceState {
  let s = state;
  for (let i = 0; i < points.length; i++) s = traceSegment(s, points[i - 1] ?? points[i], points[i]);
  return s;
}

const tracingRounds = activities.flatMap((a) => (a.kind === "tracing" ? a.rounds : []));

describe("tracing coverage", () => {
  it("completes when every stroke is followed", () => {
    for (const round of tracingRounds) {
      let s = createTraceState(round.strokes);
      for (const stroke of round.strokes) s = drag(s, stroke);
      expect(isTraceComplete(s), round.id).toBe(true);
    }
  });

  it("never completes from a single tap anywhere on the path", () => {
    for (const round of tracingRounds) {
      for (const stroke of round.strokes) {
        for (const p of stroke) {
          const s = traceSegment(createTraceState(round.strokes), p, p);
          expect(isTraceComplete(s), `${round.id} tap at ${p.x},${p.y}`).toBe(false);
        }
      }
    }
  });

  it("does not complete when only part of a multi-stroke letter is traced", () => {
    const round = tracingRounds.find((r) => r.strokes.length === 3)!;
    let s = createTraceState(round.strokes);
    s = drag(s, round.strokes[0]);
    s = drag(s, round.strokes[1]);
    expect(isTraceComplete(s)).toBe(false);
  });

  it("does not complete when the drag stays far from the path", () => {
    let s = createTraceState([line(100, 30, 100, 170)]);
    s = drag(s, line(20, 30, 20, 170));
    s = drag(s, line(180, 30, 180, 170));
    expect(totalCoverage(s)).toBe(0);
    expect(isTraceComplete(s)).toBe(false);
  });

  it("accepts a wobbly line within tolerance", () => {
    let s = createTraceState([line(30, 100, 170, 100)]);
    const wobbly = Array.from({ length: 29 }, (_, i) => ({ x: 30 + i * 5, y: 100 + (i % 2 ? 9 : -9) }));
    s = drag(s, wobbly);
    expect(isTraceComplete(s)).toBe(true);
  });

  it("fills in fast pointer moves between samples", () => {
    let s = createTraceState([line(30, 100, 170, 100)]);
    s = drag(s, [{ x: 30, y: 100 }, { x: 170, y: 100 }]);
    expect(isTraceComplete(s)).toBe(true);
  });

  it("builds arcs that start and end at the requested angles", () => {
    const pts = arc(100, 100, 50, 50, -90, -450);
    expect(pts[0]).toEqual({ x: 100, y: 50 });
    expect(pts[pts.length - 1]).toEqual({ x: 100, y: 50 });
  });
});
