"use client";

import { useState } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { numberWordId } from "@/lib/number-words";
import type { CountingRound } from "@/types/learning";
import { Badge } from "./ChoiceGame";
import type { GameProps } from "./game-props";

// Few objects get bigger targets; more than five wrap in rows of five.
const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1 max-w-40 mx-auto",
  2: "grid-cols-2 max-w-80 mx-auto",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
};

/**
 * Tap each object once to count it, then choose the numeral.
 * Counted objects stay visible and show their count number.
 */
export function CountingGame({ round, solved, onSolve, onMiss, play }: GameProps<CountingRound>) {
  // Object index → order in which it was counted (1-based).
  const [counted, setCounted] = useState<number[]>([]);
  const [tried, setTried] = useState<number[]>([]);
  const allCounted = counted.length === round.count;

  const countObject = (index: number) => {
    if (solved || counted.includes(index)) return;
    const next = [...counted, index];
    setCounted(next);
    void play([{ text: numberWordId(next.length), lang: "id-ID" }]);
  };

  const chooseNumber = (n: number) => {
    if (solved || tried.includes(n)) return;
    if (n === round.count) {
      onSolve();
      void play(round.successSpeak ?? [], "success");
    } else {
      setTried((t) => [...t, n]);
      onMiss();
      void play([{ text: round.hint, lang: "id-ID" }]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={`card w-full max-w-2xl p-4 transition-shadow sm:p-6 ${solved ? "ring-4 ring-sage-dark" : ""}`}
      >
        <ul
          className={`grid gap-2 sm:gap-4 ${GRID_COLS[Math.min(round.count, 5)]}`}
          aria-label={`Benda untuk dihitung: ${round.objectName}`}
        >
          {Array.from({ length: round.count }, (_, i) => {
            const order = counted.indexOf(i) + 1;
            const isCounted = order > 0;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => countObject(i)}
                  aria-pressed={isCounted}
                  aria-label={isCounted ? `${round.objectName}, sudah dihitung: ${order}` : `${round.objectName}, belum dihitung`}
                  className={`relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-3xl border-4 p-1 transition-[background-color,border-color] duration-150 ${
                    isCounted ? "border-sage-dark bg-sage" : "border-dashed border-beige bg-cream hover:border-sage-dark/40"
                  }`}
                >
                  <Illustration id={round.illustration} label="" className="h-full max-h-28 w-full" />
                  {isCounted && (
                    <span
                      aria-hidden="true"
                      className="animate-pop absolute -top-2 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-sage-dark text-lg font-extrabold text-cream"
                    >
                      {order}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xl font-extrabold text-sage-dark" aria-live="polite">
            {counted.length === 0 ? "Ketuk benda pertama." : `Sudah dihitung: ${counted.length}`}
          </p>
          {counted.length > 0 && !solved && (
            <button type="button" className="btn-quiet" onClick={() => setCounted([])}>
              ↺ Hitung ulang
            </button>
          )}
        </div>
      </div>

      {allCounted && (
        <div className="animate-fade-up flex w-full max-w-2xl flex-col items-center gap-3">
          <p className="text-2xl font-extrabold text-ink">Ada berapa {round.objectName}?</p>
          <ul className="grid w-full grid-cols-3 gap-3 sm:gap-5" aria-label="Pilihan angka">
            {round.choices.map((n) => {
              const isAnswer = solved && n === round.count;
              const wasTried = tried.includes(n);
              return (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => chooseNumber(n)}
                    aria-label={`Angka ${n}${isAnswer ? ", cocok" : wasTried ? ", coba yang lain" : ""}`}
                    aria-disabled={solved || wasTried}
                    className={`relative flex min-h-24 w-full cursor-pointer items-center justify-center rounded-[var(--radius-card)] border-4 bg-surface text-5xl font-extrabold transition-[transform,opacity] duration-150 active:scale-95 ${
                      isAnswer
                        ? "animate-pop border-sage-dark bg-sage"
                        : wasTried
                          ? "border-dashed border-muted/40 opacity-55"
                          : "border-transparent shadow-[0_6px_20px_-12px_rgba(64,86,65,0.45)] hover:border-sage"
                    }`}
                  >
                    {n}
                    {isAnswer && <Badge tone="success" />}
                    {wasTried && <Badge tone="retry" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
