import type { SpeechStatus } from "./useSpeech";
import { AudioButton } from "./AudioButton";

export function InstructionPanel({
  instruction,
  support,
  status,
  audioEnabled,
  onPlay,
}: {
  instruction: string;
  support?: string;
  status: SpeechStatus;
  audioEnabled: boolean;
  onPlay: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-2xl leading-snug font-extrabold text-sage-dark sm:text-3xl">{instruction}</h2>
        {support && <p className="mt-1 text-base font-semibold text-muted">{support}</p>}
      </div>
      <AudioButton status={status} audioEnabled={audioEnabled} onPlay={onPlay} />
    </div>
  );
}
