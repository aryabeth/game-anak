import type { SpeakResult } from "@/lib/audio";
import type { Speech } from "@/types/learning";

/** Props every game receives from the activity player. */
export interface GameProps<Round> {
  round: Round;
  /** True once the round is solved; the game must ignore further input. */
  solved: boolean;
  onSolve: () => void;
  onMiss: () => void;
  play: (parts: Speech[], chime?: "success" | "complete") => Promise<SpeakResult>;
}
