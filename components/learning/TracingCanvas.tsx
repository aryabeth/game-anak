"use client";

import { useRef, useState } from "react";
import {
  OFF_PATH_DISTANCE,
  TRACE_SIZE,
  TRACE_TOLERANCE,
  createTraceState,
  distanceToGuide,
  isTraceComplete,
  toSvgPath,
  totalCoverage,
  traceSegment,
  type TraceState,
} from "@/lib/tracing";
import type { Point, TracingRound } from "@/types/learning";
import type { GameProps } from "./game-props";

/**
 * Finger/mouse/stylus tracing over SVG guide paths. Progress is approximate
 * path coverage within a generous tolerance — practice feedback only, not a
 * handwriting assessment.
 */
export function TracingCanvas({ round, solved, onSolve, play }: GameProps<TracingRound>) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [trace, setTrace] = useState<TraceState>(() => createTraceState(round.strokes));
  const [ink, setInk] = useState<Point[][]>([]);
  const [offPath, setOffPath] = useState(false);
  // Mirrors of state for use inside rapid pointer events.
  const traceRef = useRef(trace);
  const inkRef = useRef(ink);
  const activePointer = useRef<number | null>(null);
  const lastPoint = useRef<Point | null>(null);

  const coverage = Math.round(totalCoverage(trace) * 100);

  const toCanvas = (clientX: number, clientY: number): Point | null => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };

  const endStroke = () => {
    activePointer.current = null;
    lastPoint.current = null;
  };

  const addPoints = (points: Point[]) => {
    let t = traceRef.current;
    const strokes = inkRef.current.slice();
    const current = strokes[strokes.length - 1]?.slice() ?? [];
    for (const p of points) {
      const from = lastPoint.current ?? p;
      t = traceSegment(t, from, p);
      const prev = current[current.length - 1];
      if (!prev || Math.hypot(prev.x - p.x, prev.y - p.y) >= 1.5) current.push(p);
      lastPoint.current = p;
    }
    strokes[strokes.length - 1] = current;
    traceRef.current = t;
    inkRef.current = strokes;
    setTrace(t);
    setInk(strokes);
    const last = points[points.length - 1];
    setOffPath(distanceToGuide(t, last) > OFF_PATH_DISTANCE);
    if (isTraceComplete(t)) {
      endStroke();
      onSolve();
      void play(round.successSpeak ?? [], "success");
    }
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (solved || activePointer.current !== null) return;
    const p = toCanvas(e.clientX, e.clientY);
    if (!p) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    activePointer.current = e.pointerId;
    lastPoint.current = null;
    inkRef.current = [...inkRef.current, []];
    addPoints([p]);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (solved || activePointer.current !== e.pointerId) return;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
    const raw = events.length > 0 ? events : [e.nativeEvent];
    const points = raw.map((ev) => toCanvas(ev.clientX, ev.clientY)).filter((p): p is Point => p !== null);
    if (points.length > 0) addPoints(points);
  };

  const onPointerEnd = (e: React.PointerEvent<SVGSVGElement>) => {
    if (activePointer.current === e.pointerId) endStroke();
  };

  const reset = () => {
    const fresh = createTraceState(round.strokes);
    traceRef.current = fresh;
    inkRef.current = [];
    endStroke();
    setTrace(fresh);
    setInk([]);
    setOffPath(false);
  };

  const multi = round.strokes.length > 1;

  return (
    <div className="flex flex-col items-center gap-4">
      {round.model && (
        <p className="flex gap-2 text-4xl font-extrabold tracking-widest" aria-label={`Contoh kata: ${round.model}`}>
          {round.model.split("").map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`rounded-2xl px-3 py-1 ${ch === round.label ? "bg-yellow text-ink" : "text-muted"}`}
            >
              {ch}
            </span>
          ))}
        </p>
      )}

      <div className="card relative w-full max-w-[min(100%,28rem,60vh)] p-2 sm:p-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${TRACE_SIZE} ${TRACE_SIZE}`}
          preserveAspectRatio="xMidYMid meet"
          className="block aspect-square w-full touch-none select-none"
          role="img"
          aria-label={`Area menelusuri ${round.label}. Jejak ${coverage} persen.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onLostPointerCapture={onPointerEnd}
        >
          <rect x="0" y="0" width={TRACE_SIZE} height={TRACE_SIZE} rx="18" fill="#faf7f0" />
          {/* Writing lines for letters */}
          <g stroke="#e9ddc9" strokeWidth="1.5">
            <line x1="10" y1="40" x2="190" y2="40" />
            <line x1="10" y1="90" x2="190" y2="90" strokeDasharray="4 6" />
            <line x1="10" y1="160" x2="190" y2="160" />
          </g>
          {/* Tolerance corridor */}
          {round.strokes.map((s, i) => (
            <path key={`c${i}`} d={toSvgPath(s)} fill="none" stroke="#dde7d5" strokeWidth={TRACE_TOLERANCE * 1.6} strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {/* Dashed guide */}
          {round.strokes.map((s, i) => (
            <path key={`g${i}`} d={toSvgPath(s)} fill="none" stroke="#73796f" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {/* Traced guide points */}
          {trace.checkpoints.map((cps, si) =>
            cps.map((cp, ci) =>
              trace.covered[si][ci] ? <circle key={`p${si}-${ci}`} cx={cp.x} cy={cp.y} r="4.5" fill="#8fb487" /> : null,
            ),
          )}
          {/* Child's ink */}
          {ink.map((s, i) =>
            s.length === 1 ? (
              <circle key={`i${i}`} cx={s[0].x} cy={s[0].y} r="4" fill="#d58c70" />
            ) : (
              <path key={`i${i}`} d={toSvgPath(s)} fill="none" stroke="#d58c70" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            ),
          )}
          {/* Start points and direction arrows */}
          {round.strokes.map((s, i) => (
            <StartMarker
              key={`s${i}`}
              stroke={trace.checkpoints[i] ?? s}
              number={multi ? i + 1 : undefined}
              // Strokes that share a start point (like A) get their marker moved along the stroke.
              nudge={round.strokes.slice(0, i).some((prev) => Math.hypot(prev[0].x - s[0].x, prev[0].y - s[0].y) < 14)}
            />
          ))}
        </svg>
      </div>

      <div className="flex w-full max-w-md flex-col gap-2">
        <div className="flex items-center justify-between text-base font-bold text-sage-dark">
          <span>Jejak</span>
          <span>{coverage}%</span>
        </div>
        <div
          className="h-4 w-full overflow-hidden rounded-full bg-beige"
          role="progressbar"
          aria-label="Jejak menelusuri"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={coverage}
        >
          <div className="h-full rounded-full bg-sage-dark transition-[width] duration-200" style={{ width: `${coverage}%` }} />
        </div>
        <p className="min-h-6 text-base font-semibold text-terracotta-dark" role="status">
          {!solved && offPath && "Ikuti garis putus-putus, ya. Mulai dari titik hijau."}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" className="btn-secondary" onClick={reset} disabled={solved}>
            ↺ Ulangi garis
          </button>
          <p className="text-sm text-muted">Latihan menelusuri, bukan penilaian tulisan tangan.</p>
        </div>
      </div>
    </div>
  );
}

function StartMarker({ stroke, number, nudge }: { stroke: Point[]; number?: number; nudge?: boolean }) {
  const start = nudge ? stroke[Math.min(4, stroke.length - 1)] : stroke[0];
  const offset = nudge ? 4 : 0;
  const a = stroke[Math.min(offset + 2, stroke.length - 1)];
  const b = stroke[Math.min(offset + 4, stroke.length - 1)];
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  return (
    <g pointerEvents="none">
      <g transform={`translate(${b.x} ${b.y}) rotate(${angle})`}>
        <path d="M-6 -7 L6 0 L-6 7 Z" fill="#9c4f33" />
      </g>
      <circle cx={start.x} cy={start.y} r="10" fill="#4e9a51" stroke="#ffffff" strokeWidth="3" />
      {number !== undefined && (
        <text x={start.x} y={start.y + 4.5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffffff">
          {number}
        </text>
      )}
    </g>
  );
}
