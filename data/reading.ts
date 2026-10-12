import type { Activity, ChoiceOption, IllustrationId } from "@/types/learning";

const id = (text: string) => ({ text, lang: "id-ID" as const });

function textChoice(text: string): ChoiceOption {
  return { id: text, visual: { kind: "text", text }, label: text };
}

function findLetter(target: string, choices: string[]) {
  return {
    id: `find-${target}`,
    instruction: `Ayo cari huruf ${target}!`,
    speak: [id(`Ayo cari huruf ${target}.`)],
    choices: choices.map(textChoice),
    answerId: target,
    successText: `Hebat! Ini huruf ${target}.`,
    successSpeak: [id(`Hebat! Ini huruf ${target}.`)],
    hint: `Ayo coba lagi. Lihat bentuk huruf ${target} di atas.`,
  };
}

function pairLetter(upper: string, choices: string[]) {
  const lower = upper.toLowerCase();
  return {
    id: `pair-${upper}`,
    instruction: `Ini huruf ${upper} besar. Cari huruf ${lower} kecil!`,
    speak: [id(`Ini huruf ${upper} besar. Cari pasangannya, huruf ${lower} kecil.`)],
    prompt: { kind: "text" as const, text: upper },
    choices: choices.map(textChoice),
    answerId: lower,
    successText: `Hebat! ${upper} besar dan ${lower} kecil adalah pasangan.`,
    successSpeak: [id(`Hebat! ${upper} besar dan ${lower} kecil adalah pasangan.`)],
    hint: `Ayo coba lagi. Huruf ${lower} kecil bentuknya lebih kecil.`,
  };
}

function initialLetter(word: string, illustration: IllustrationId, choices: string[]) {
  const first = word[0].toUpperCase();
  return {
    id: `initial-${word.toLowerCase()}`,
    instruction: `${word}. Huruf pertamanya apa?`,
    speak: [id(`${word}. Huruf pertamanya apa?`)],
    prompt: { kind: "picture" as const, illustration, caption: word },
    choices: choices.map(textChoice),
    answerId: first,
    successText: `Hebat! ${word} dimulai dengan huruf ${first}.`,
    successSpeak: [id(`Hebat! ${word} dimulai dengan huruf ${first}.`)],
    hint: `Dengarkan sekali lagi, ya. Lihat huruf pertama pada tulisan ${word}.`,
  };
}

function firstSyllable(syllables: [string, string], illustration: IllustrationId, choices: string[]) {
  const word = syllables.join("");
  const name = word[0] + word.slice(1).toLowerCase();
  return {
    id: `syllable-${word.toLowerCase()}`,
    instruction: `${name}. Pilih suku kata awalnya!`,
    speak: [id(`${name}. ${syllables[0]}, ${syllables[1]}. Pilih suku kata awalnya.`)],
    prompt: { kind: "picture" as const, illustration, caption: `__ ${syllables[1]}` },
    choices: choices.map(textChoice),
    answerId: syllables[0],
    successText: `Hebat! ${syllables[0]}-${syllables[1]}, ${name.toLowerCase()}.`,
    successSpeak: [id(`Hebat! ${syllables[0]}, ${syllables[1]}. ${name}.`)],
    hint: `Dengarkan sekali lagi, ya: ${syllables[0]}-${syllables[1]}.`,
  };
}

function buildWord(syllables: [string, string], illustration: IllustrationId) {
  const word = syllables.join("");
  const name = word[0] + word.slice(1).toLowerCase();
  const tiles = [...syllables].reverse().map(textChoice);
  return {
    id: `build-${word.toLowerCase()}`,
    instruction: `Susun kata ${word}. Ketuk suku kata satu per satu.`,
    speak: [id(`Ayo susun kata ${name}. ${syllables[0]}, ${syllables[1]}.`)],
    prompt: { kind: "picture" as const, illustration, caption: word },
    tiles,
    answerOrder: [...syllables],
    successText: `Hebat! Kamu menyusun kata ${word}.`,
    successSpeak: [id(`Hebat! ${syllables[0]}, ${syllables[1]}. ${name}.`)],
    hint: `Ayo coba lagi. Lihat contoh tulisan ${word} di gambar.`,
  };
}

export const readingActivities: Activity[] = [
  {
    id: "reading-letters",
    module: "reading",
    kind: "choice",
    title: "Kenali Huruf",
    summary: "Cari huruf A, B, S, dan pasangan huruf kecilnya.",
    completionText: "Kamu sudah berlatih mengenal huruf A, B, S, dan M!",
    offlineTip: "Cari huruf A di buku cerita atau kemasan di rumah bersama orang tua.",
    difficulty: 1,
    rounds: [
      findLetter("A", ["M", "A", "S"]),
      findLetter("B", ["B", "O", "T"]),
      findLetter("S", ["I", "M", "S"]),
      pairLetter("A", ["s", "a", "o"]),
      pairLetter("M", ["m", "b", "i"]),
    ],
  },
  {
    id: "reading-initial-letter",
    module: "reading",
    kind: "choice",
    title: "Huruf Awal",
    summary: "Lihat gambar, lalu pilih huruf pertamanya.",
    completionText: "Kamu sudah berlatih mencari huruf awal kata!",
    offlineTip: "Main tebak benda: sebutkan benda di rumah yang dimulai dengan huruf B.",
    difficulty: 1,
    rounds: [
      initialLetter("Apel", "apple", ["A", "B", "M"]),
      initialLetter("Bola", "ball", ["S", "B", "I"]),
      initialLetter("Ikan", "fish", ["T", "M", "I"]),
      initialLetter("Mata", "eye", ["M", "A", "S"]),
      initialLetter("Sapi", "cow", ["B", "S", "T"]),
    ],
  },
  {
    id: "reading-syllables",
    module: "reading",
    kind: "choice",
    title: "Suku Kata",
    summary: "Dengarkan kata, lalu pilih suku kata awalnya.",
    completionText: "Kamu sudah berlatih suku kata BO, BU, MA, SA, dan TO!",
    offlineTip: "Tepuk tangan untuk setiap suku kata: BO (tepuk) LA (tepuk).",
    difficulty: 2,
    rounds: [
      firstSyllable(["BO", "LA"], "ball", ["BA", "BO", "BU"]),
      firstSyllable(["BU", "KU"], "book", ["BU", "BI", "BE"]),
      firstSyllable(["MA", "TA"], "eye", ["MI", "MO", "MA"]),
      firstSyllable(["SA", "PI"], "cow", ["SA", "SU", "SI"]),
      firstSyllable(["TO", "PI"], "hat", ["TA", "TO", "TU"]),
    ],
  },
  {
    id: "reading-build-words",
    module: "reading",
    kind: "sequence",
    title: "Susun Kata",
    summary: "Susun suku kata menjadi kata sederhana.",
    completionText: "Kamu sudah berlatih menyusun kata BOLA, BUKU, MATA, SAPI, dan TOPI!",
    offlineTip: "Tulis suku kata di kertas kecil, lalu susun bersama menjadi kata.",
    difficulty: 3,
    rounds: [
      buildWord(["BO", "LA"], "ball"),
      buildWord(["BU", "KU"], "book"),
      buildWord(["MA", "TA"], "eye"),
      buildWord(["SA", "PI"], "cow"),
      buildWord(["TO", "PI"], "hat"),
    ],
  },
];
