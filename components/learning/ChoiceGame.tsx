"use client";

import { useState } from "react";
import type { ChoiceRound } from "@/types/learning";
import type { GameProps } from "./game-props";
import { VisualView } from "./VisualView";

/**
 * Tap the matching choice. Used for letter matching, initial letters,
 * syllables, numeral recognition, quantity matching, and English vocabulary.
 */
export function ChoiceGame({ round, solved, onSolve, onMiss, play }: GameProps<ChoiceRound>) {
  const [tried, setTried] = useState<string[]>([]);

  const choose = (choiceId: string) => {
    if (solved || tried.includes(choiceId)) return;
    if (choiceId === round.answerId) {
      onSolve();
      void play(round.successSpeak ?? [], "success");
    } else {
      setTried((t) => [...t, choiceId]);
      onMiss();
      void play(round.speak);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {round.prompt && (
        <div
          className={`card flex min-h-40 min-w-48 items-center justify-center px-8 py-6 transition-shadow ${
            solved ? "ring-4 ring-sage-dark" : ""
          }`}
        >
          <VisualView visual={round.prompt} size="lg" />
        </div>
      )}

      <ul className="grid w-full max-w-2xl grid-cols-3 gap-3 sm:gap-5" aria-label="Pilihan jawaban">
        {round.choices.map((choice) => {
          const isAnswer = solved && choice.id === round.answerId;
          const wasTried = tried.includes(choice.id);
          return (
            <li key={choice.id}>
              <button
                type="button"
                onClick={() => choose(choice.id)}
                aria-label={`${choice.label}${isAnswer ? ", cocok" : wasTried ? ", coba yang lain" : ""}`}
                aria-disabled={solved || wasTried}
                className={`relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-[var(--radius-card)] border-4 bg-surface p-2 transition-[transform,opacity,border-color] duration-150 active:scale-95 ${
                  isAnswer
                    ? "animate-pop border-sage-dark bg-sage"
                    : wasTried
                      ? "border-dashed border-muted/40 opacity-55"
                      : "border-transparent shadow-[0_6px_20px_-12px_rgba(64,86,65,0.45)] hover:border-sage"
                }`}
              >
                <VisualView visual={choice.visual} label="" />
                {isAnswer && <Badge tone="success" />}
                {wasTried && <Badge tone="retry" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Badge({ tone }: { tone: "success" | "retry" }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface text-xl font-extrabold ${
        tone === "success" ? "bg-sage-dark text-cream" : "bg-yellow text-terracotta-dark"
      }`}
    >
      {tone === "success" ? "✓" : "↻"}
    </span>
  );
}
