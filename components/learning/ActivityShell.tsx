"use client";

import { useReducer, useRef, useState } from "react";
import { activityReducer, initialActivityState, isLastRound } from "@/lib/activity-engine";
import { appActions, useAppState } from "@/lib/app-store";
import type { Activity } from "@/types/learning";
import { ChoiceGame } from "./ChoiceGame";
import { CompletionPanel } from "./CompletionPanel";
import { CountingGame } from "./CountingGame";
import { FeedbackMessage } from "./FeedbackMessage";
import type { GameProps } from "./game-props";
import { InstructionPanel } from "./InstructionPanel";
import { SequenceGame } from "./SequenceGame";
import { TracingCanvas } from "./TracingCanvas";
import { useSpeech } from "./useSpeech";

/**
 * Hosts one activity: start screen, rounds with instructions/audio/feedback,
 * and the completion screen. Progress is recorded from event handlers (not
 * effects), and at most once per run.
 */
export function ActivityShell({
  activity,
  next,
  moduleHref,
}: {
  activity: Activity;
  next?: { href: string; title: string };
  moduleHref: string;
}) {
  const [state, dispatch] = useReducer(activityReducer, activity.rounds.length, initialActivityState);
  const { data } = useAppState();
  const speech = useSpeech();
  const [saveFailed, setSaveFailed] = useState(false);
  const completionRecorded = useRef(false);

  const round = activity.rounds[state.roundIndex];

  const begin = () => {
    completionRecorded.current = false;
    setSaveFailed(!appActions.startActivity(activity));
    void speech.play(activity.rounds[0].speak);
  };

  const start = () => {
    if (state.phase !== "ready") return;
    dispatch({ type: "start" });
    begin();
  };

  const restart = () => {
    if (state.phase !== "completed") return;
    dispatch({ type: "restart" });
    begin();
  };

  const goNext = () => {
    if (state.phase !== "feedback") return;
    dispatch({ type: "next" });
    if (isLastRound(state)) {
      if (!completionRecorded.current) {
        completionRecorded.current = true;
        setSaveFailed(!appActions.completeActivity(activity));
      }
      void speech.play([{ text: activity.completionText, lang: "id-ID" }], "complete");
    } else {
      void speech.play(activity.rounds[state.roundIndex + 1].speak);
    }
  };

  if (state.phase === "ready") {
    return (
      <section className="card mx-auto flex w-full max-w-xl flex-col items-center gap-4 p-6 text-center sm:p-10" aria-labelledby="activity-title">
        <h1 id="activity-title" className="text-3xl font-extrabold text-sage-dark sm:text-4xl">
          {activity.title}
        </h1>
        <p className="text-lg text-muted">{activity.summary}</p>
        <p className="text-base font-semibold text-muted">{activity.rounds.length} langkah · tanpa batas waktu</p>
        <button type="button" className="btn-primary mt-2 min-h-16 px-10 text-2xl" onClick={start}>
          Mulai
        </button>
      </section>
    );
  }

  if (state.phase === "completed") {
    return (
      <CompletionPanel
        message={activity.completionText}
        offlineTip={activity.offlineTip}
        saveFailed={saveFailed}
        onRepeat={restart}
        next={next}
        moduleHref={moduleHref}
      />
    );
  }

  const solved = state.phase === "feedback";
  const gameProps = {
    solved,
    onSolve: () => dispatch({ type: "solve" }),
    onMiss: () => dispatch({ type: "miss" }),
    play: speech.play,
  } satisfies Omit<GameProps<unknown>, "round">;

  return (
    <section className="flex flex-col gap-5" aria-labelledby="activity-title">
      <div className="flex items-center justify-between gap-3">
        <h1 id="activity-title" className="text-lg font-extrabold text-muted">
          {activity.title}
        </h1>
        <RoundDots current={state.roundIndex} total={state.totalRounds} />
      </div>

      <InstructionPanel
        instruction={round.instruction}
        support={round.support}
        status={speech.status}
        audioEnabled={data.settings.audioEnabled}
        onPlay={() => void speech.play(round.speak)}
      />

      {/* Keyed by round so each round starts with fresh game state. */}
      <div key={round.id}>
        {activity.kind === "choice" && <ChoiceGame round={activity.rounds[state.roundIndex]} {...gameProps} />}
        {activity.kind === "counting" && <CountingGame round={activity.rounds[state.roundIndex]} {...gameProps} />}
        {activity.kind === "sequence" && <SequenceGame round={activity.rounds[state.roundIndex]} {...gameProps} />}
        {activity.kind === "tracing" && <TracingCanvas round={activity.rounds[state.roundIndex]} {...gameProps} />}
      </div>

      <div className="sticky bottom-3 z-10 mx-auto flex w-full max-w-2xl flex-col gap-3">
        {solved ? (
          <>
            <FeedbackMessage tone="success">{round.successText}</FeedbackMessage>
            <button type="button" className="btn-primary min-h-16 text-2xl" onClick={goNext}>
              {isLastRound(state) ? "Selesai ✓" : "Lanjut →"}
            </button>
          </>
        ) : (
          state.misses > 0 && (
            <FeedbackMessage key={state.misses} tone="hint">
              {round.hint}
            </FeedbackMessage>
          )
        )}
      </div>
    </section>
  );
}

function RoundDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`Langkah ${current + 1} dari ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-3 rounded-full transition-[width,background-color] duration-200 ${
            i < current ? "w-3 bg-sage-dark" : i === current ? "w-7 bg-terracotta" : "w-3 bg-beige"
          }`}
        />
      ))}
    </div>
  );
}
