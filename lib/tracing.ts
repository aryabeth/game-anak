import type { Point } from "@/types/learning";

/** Tracing canvas uses a fixed 200 × 200 coordinate space. */
export const TRACE_SIZE = 200;
/** Distance (in canvas units) within which a guide point counts as traced. */
export const TRACE_TOLERANCE = 16;
/** Share of a stroke's guide points that must be traced. */
export const STROKE_COMPLETE_RATIO = 0.85;
/** Pointer farther than this from every guide point triggers a hint. */
export const OFF_PATH_DISTANCE = TRACE_TOLERANCE * 2.5;
const CHECKPOINT_SPACING = 6;

// ---------- Geometry helpers used by content files ----------

export function line(x1: number, y1: number, x2: number, y2: number): Point[] {
  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ];
}

/**
 * Arc around (cx, cy). Angles are in degrees, 0 = right, 90 = down
 * (screen coordinates). Direction follows the sign of `endDeg - startDeg`.
 */
export function arc(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  startDeg: number,
  endDeg: number,
): Point[] {
  const steps = Math.max(8, Math.ceil(Math.abs(endDeg - startDeg) / 10));
  const points: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = ((startDeg + ((endDeg - startDeg) * i) / steps) * Math.PI) / 180;
    points.push({ x: round(cx + rx * Math.cos(t)), y: round(cy + ry * Math.sin(t)) });
  }
  return points;
}

/** Joins several pieces into one continuous stroke. */
export function join(...pieces: Point[][]): Point[] {
  const out: Point[] = [];
  for (const piece of pieces) {
    for (const p of piece) {
      const last = out[out.length - 1];
      if (!last || last.x !== p.x || last.y !== p.y) out.push(p);
    }
  }
  return out;
}

export function polyline(...coords: [number, number][]): Point[] {
  return coords.map(([x, y]) => ({ x, y }));
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

// ---------- Coverage tracking ----------

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Resamples a polyline into evenly spaced checkpoints. */
export function checkpointsForStroke(stroke: Point[]): Point[] {
  if (stroke.length === 0) return [];
  const out: Point[] = [stroke[0]];
  for (let i = 1; i < stroke.length; i++) {
    const a = stroke[i - 1];
    const b = stroke[i];
    const len = distance(a, b);
    const steps = Math.max(1, Math.round(len / CHECKPOINT_SPACING));
    for (let s = 1; s <= steps; s++) {
      out.push({ x: a.x + ((b.x - a.x) * s) / steps, y: a.y + ((b.y - a.y) * s) / steps });
    }
  }
  return out;
}

export interface TraceState {
  checkpoints: Point[][];
  covered: boolean[][];
}

export function createTraceState(strokes: Point[][]): TraceState {
  const checkpoints = strokes.map(checkpointsForStroke);
  return { checkpoints, covered: checkpoints.map((cps) => cps.map(() => false)) };
}

/**
 * Marks checkpoints near the segment from `from` to `to` as covered.
 * Returns a new state when something changed, otherwise the same object.
 */
export function traceSegment(state: TraceState, from: Point, to: Point): TraceState {
  const samples = samplesBetween(from, to);
  let changed = false;
  const covered = state.covered.map((row, si) =>
    row.map((isCovered, ci) => {
      if (isCovered) return true;
      const cp = state.checkpoints[si][ci];
      const hit = samples.some((p) => distance(p, cp) <= TRACE_TOLERANCE);
      if (hit) changed = true;
      return hit;
    }),
  );
  return changed ? { ...state, covered } : state;
}

function samplesBetween(from: Point, to: Point): Point[] {
  const steps = Math.max(1, Math.ceil(distance(from, to) / (TRACE_TOLERANCE / 2)));
  const out: Point[] = [];
  for (let s = 0; s <= steps; s++) {
    out.push({ x: from.x + ((to.x - from.x) * s) / steps, y: from.y + ((to.y - from.y) * s) / steps });
  }
  return out;
}

export function strokeCoverage(state: TraceState): number[] {
  return state.covered.map((row) =>
    row.length === 0 ? 1 : row.filter(Boolean).length / row.length,
  );
}

/** Overall coverage in 0..1, weighted by checkpoint count. */
export function totalCoverage(state: TraceState): number {
  const all = state.covered.flat();
  return all.length === 0 ? 0 : all.filter(Boolean).length / all.length;
}

export function isTraceComplete(state: TraceState): boolean {
  if (state.checkpoints.length === 0) return false;
  return strokeCoverage(state).every((c) => c >= STROKE_COMPLETE_RATIO);
}

export function distanceToGuide(state: TraceState, p: Point): number {
  let best = Infinity;
  for (const cps of state.checkpoints) {
    for (const cp of cps) best = Math.min(best, distance(cp, p));
  }
  return best;
}

export function toSvgPath(stroke: Point[]): string {
  return stroke.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
}
