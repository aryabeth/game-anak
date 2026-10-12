import { LEARNING_MODULES, type Activity, type IllustrationId, type Visual } from "@/types/learning";

export const ILLUSTRATION_IDS: readonly IllustrationId[] = [
  "apple",
  "ball",
  "bag",
  "banana",
  "bird",
  "book",
  "bread",
  "cat",
  "cow",
  "cup",
  "dog",
  "eye",
  "fish",
  "flower",
  "hat",
];

const MAX_COUNT = 20;

/**
 * Checks one activity for content mistakes: missing answers, duplicate
 * choices, counts that do not match, empty tracing paths, and so on.
 * Returns human-readable problems; an empty array means the content is valid.
 */
export function validateActivity(activity: Activity): string[] {
  const errors: string[] = [];
  const at = (roundId: string, msg: string) => errors.push(`${activity.id}/${roundId}: ${msg}`);

  if (!LEARNING_MODULES.includes(activity.module)) errors.push(`${activity.id}: unknown module`);
  if (activity.rounds.length === 0) errors.push(`${activity.id}: has no rounds`);

  const roundIds = new Set<string>();
  for (const round of activity.rounds) {
    if (roundIds.has(round.id)) at(round.id, "duplicate round id");
    roundIds.add(round.id);
    if (!round.instruction.trim()) at(round.id, "empty instruction");
    if (round.speak.length === 0) at(round.id, "nothing to speak");
  }

  switch (activity.kind) {
    case "choice":
      for (const r of activity.rounds) {
        checkVisual(r.prompt, (m) => at(r.id, m));
        const ids = r.choices.map((c) => c.id);
        if (r.choices.length < 2) at(r.id, "needs at least two choices");
        if (new Set(ids).size !== ids.length) at(r.id, "duplicate choices");
        if (!ids.includes(r.answerId)) at(r.id, `answer "${r.answerId}" is not a choice`);
        r.choices.forEach((c) => checkVisual(c.visual, (m) => at(r.id, m)));
        if (r.prompt?.kind === "group" && r.answerId !== String(r.prompt.count)) {
          at(r.id, "group size does not match the answer");
        }
      }
      break;
    case "counting":
      for (const r of activity.rounds) {
        if (!Number.isInteger(r.count) || r.count < 1 || r.count > MAX_COUNT) at(r.id, "count out of range");
        if (!r.choices.includes(r.count)) at(r.id, "count is not among the choices");
        if (new Set(r.choices).size !== r.choices.length) at(r.id, "duplicate choices");
        if (!ILLUSTRATION_IDS.includes(r.illustration)) at(r.id, `unknown illustration ${r.illustration}`);
      }
      break;
    case "sequence":
      for (const r of activity.rounds) {
        checkVisual(r.prompt, (m) => at(r.id, m));
        const ids = r.tiles.map((t) => t.id);
        if (new Set(ids).size !== ids.length) at(r.id, "duplicate tiles");
        const sameSet =
          r.answerOrder.length === ids.length && r.answerOrder.every((a) => ids.includes(a));
        if (!sameSet) at(r.id, "answer order must use every tile exactly once");
        if (r.answerOrder.length < 2) at(r.id, "needs at least two tiles");
      }
      break;
    case "tracing":
      for (const r of activity.rounds) {
        if (r.strokes.length === 0) at(r.id, "has no strokes");
        for (const s of r.strokes) {
          if (s.length < 2) at(r.id, "stroke needs at least two points");
          if (s.some((p) => p.x < 0 || p.x > 200 || p.y < 0 || p.y > 200)) at(r.id, "stroke leaves the canvas");
        }
        if (r.model && !r.model.includes(r.label)) at(r.id, "label is not part of the model word");
      }
      break;
  }
  return errors;
}

function checkVisual(visual: Visual | undefined, report: (msg: string) => void) {
  if (!visual) return;
  if ((visual.kind === "picture" || visual.kind === "group") && !ILLUSTRATION_IDS.includes(visual.illustration)) {
    report(`unknown illustration ${visual.illustration}`);
  }
  if (visual.kind === "group" && (visual.count < 1 || visual.count > MAX_COUNT)) {
    report("group size out of range");
  }
  if (visual.kind === "text" && !visual.text.trim()) report("empty text");
}

export function validateAllActivities(list: Activity[]): string[] {
  const errors = list.flatMap(validateActivity);
  const ids = list.map((a) => a.id);
  ids.forEach((id, i) => {
    if (ids.indexOf(id) !== i) errors.push(`${id}: duplicate activity id`);
  });
  return errors;
}
