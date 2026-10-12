export type LearningModule = "reading" | "writing" | "numbers" | "english";

export const LEARNING_MODULES: readonly LearningModule[] = [
  "reading",
  "writing",
  "numbers",
  "english",
];

export type SpeechLang = "id-ID" | "en-US";

/** One piece of text to be spoken by the device voice. */
export interface Speech {
  text: string;
  lang: SpeechLang;
}

export type IllustrationId =
  | "apple"
  | "ball"
  | "bag"
  | "banana"
  | "bird"
  | "book"
  | "bread"
  | "cat"
  | "cow"
  | "cup"
  | "dog"
  | "eye"
  | "fish"
  | "flower"
  | "hat";

export type ColorId = "red" | "blue" | "yellow" | "green";

/** What is shown on a prompt card or an answer choice. */
export type Visual =
  | { kind: "text"; text: string }
  | { kind: "picture"; illustration: IllustrationId; caption?: string }
  | { kind: "color"; color: ColorId; caption?: string }
  | { kind: "group"; illustration: IllustrationId; count: number };

export interface ChoiceOption {
  id: string;
  visual: Visual;
  /** Accessible name for the choice. */
  label: string;
}

interface RoundBase {
  id: string;
  /** Short written instruction, shown on screen. */
  instruction: string;
  /** Optional Indonesian support line under an English instruction. */
  support?: string;
  /** What the replay-audio button says. */
  speak: Speech[];
  /** Specific positive message once the round is solved. */
  successText: string;
  successSpeak?: Speech[];
  /** Neutral hint shown after an attempt that did not match. */
  hint: string;
}

export interface ChoiceRound extends RoundBase {
  prompt?: Visual;
  choices: ChoiceOption[];
  answerId: string;
}

export interface CountingRound extends RoundBase {
  illustration: IllustrationId;
  /** Indonesian name of the object, used in spoken feedback. */
  objectName: string;
  count: number;
  choices: number[];
}

export interface SequenceRound extends RoundBase {
  prompt?: Visual;
  /** Tiles in the order they are displayed. */
  tiles: ChoiceOption[];
  /** Tile ids in the expected order. */
  answerOrder: string[];
}

export interface Point {
  x: number;
  y: number;
}

/** Strokes are polylines in a 200 × 200 coordinate space. */
export interface TracingRound extends RoundBase {
  label: string;
  /** Optional model word shown above the canvas when copying a word. */
  model?: string;
  strokes: Point[][];
}

interface ActivityBase {
  id: string;
  module: LearningModule;
  title: string;
  /** One-line description for the activity card. */
  summary: string;
  /** Shown on the completion screen, e.g. "Kamu sudah berlatih huruf A!" */
  completionText: string;
  /** Optional off-screen activity suggestion for parents and children. */
  offlineTip?: string;
  difficulty: 1 | 2 | 3;
}

export type Activity =
  | (ActivityBase & { kind: "choice"; rounds: ChoiceRound[] })
  | (ActivityBase & { kind: "counting"; rounds: CountingRound[] })
  | (ActivityBase & { kind: "sequence"; rounds: SequenceRound[] })
  | (ActivityBase & { kind: "tracing"; rounds: TracingRound[] });

export type ActivityKind = Activity["kind"];

export interface ModuleInfo {
  id: LearningModule;
  title: string;
  subtitle: string;
  description: string;
  /** Tailwind background class for the module accent surface. */
  accentClass: string;
  symbol: string;
}
