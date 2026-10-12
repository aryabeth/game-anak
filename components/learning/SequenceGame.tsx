"use client";

import { useState } from "react";
import type { SequenceRound } from "@/types/learning";
import { Badge } from "./ChoiceGame";
import type { GameProps } from "./game-props";
import { VisualView } from "./VisualView";

/** Tap tiles in order to fill the slots (syllables into words, numbers 1–10). */
export function SequenceGame({ round, solved, onSolve, onMiss, play }: GameProps<SequenceRound>) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [triedNow, setTriedNow] = useState<string | null>(null);
  const tileById = new Map(round.tiles.map((t) => [t.id, t]));

  const tap = (tileId: string) => {
    if (solved || placed.includes(tileId)) return;
    const expected = round.answerOrder[placed.length];
    if (tileId === expected) {
      const next = [...placed, tileId];
      setPlaced(next);
      setTriedNow(null);
      if (next.length === round.answerOrder.length) {
        onSolve();
        void play(round.successSpeak ?? [], "success");
      } else {
        void play([{ text: tileById.get(tileId)?.label ?? tileId, lang: "id-ID" }]);
      }
    } else {
      setTriedNow(tileId);
      onMiss();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {round.prompt && (
        <div className={`card flex items-center justify-center px-8 py-5 ${solved ? "ring-4 ring-sage-dark" : ""}`}>
          <VisualView visual={round.prompt} size="lg" />
        </div>
      )}

      <ol className="flex flex-wrap justify-center gap-2 sm:gap-3" aria-label="Susunan">
        {round.answerOrder.map((id, i) => {
          const tile = placed[i] ? tileById.get(placed[i]) : undefined;
          return (
            <li
              key={id}
              className={`flex h-20 min-w-20 items-center justify-center rounded-3xl border-4 px-3 sm:h-24 sm:min-w-24 ${
                tile ? "animate-pop border-sage-dark bg-sage" : "border-dashed border-beige bg-cream"
              }`}
              aria-label={tile ? `Kotak ${i + 1}: ${tile.label}` : `Kotak ${i + 1}: kosong`}
            >
              {tile ? <VisualView visual={tile.visual} label="" /> : <span aria-hidden="true" className="text-2xl text-muted">{i + 1}</span>}
            </li>
          );
        })}
      </ol>

      <ul className="flex flex-wrap justify-center gap-3 sm:gap-4" aria-label="Pilihan">
        {round.tiles.map((tile) => {
          const isPlaced = placed.includes(tile.id);
          const wasTried = triedNow === tile.id;
          return (
            <li key={tile.id}>
              <button
                type="button"
                onClick={() => tap(tile.id)}
                disabled={isPlaced}
                aria-label={`${tile.label}${isPlaced ? ", sudah dipakai" : wasTried ? ", coba yang lain" : ""}`}
                className={`relative flex h-24 min-w-24 cursor-pointer items-center justify-center rounded-[var(--radius-card)] border-4 bg-surface px-4 transition-[transform,opacity] duration-150 active:scale-95 disabled:cursor-default ${
                  isPlaced
                    ? "border-dashed border-beige opacity-30"
                    : wasTried
                      ? "border-dashed border-terracotta/60"
                      : "border-transparent shadow-[0_6px_20px_-12px_rgba(64,86,65,0.45)] hover:border-sage"
                }`}
              >
                <VisualView visual={tile.visual} label="" />
                {wasTried && <Badge tone="retry" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
