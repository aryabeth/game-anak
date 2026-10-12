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

/** One vowel hidden among consonants. */
function anyVowel(n: number, choices: string[], vowel: string) {
  return {
    id: `any-vowel-${n}`,
    instruction: "Mana yang huruf vokal?",
    speak: [id("Mana yang huruf vokal? A, I, U, E, atau O.")],
    choices: choices.map(textChoice),
    answerId: vowel,
    successText: `Hebat! ${vowel} adalah huruf vokal.`,
    successSpeak: [id(`Hebat! ${vowel} adalah huruf vokal.`)],
    hint: "Ayo coba lagi. Cari A, I, U, E, atau O.",
  };
}

function findVowel(vowel: string, choices: string[]) {
  return {
    id: `vowel-${vowel}`,
    instruction: `Mana huruf vokal ${vowel}?`,
    speak: [id(`Huruf vokal ada lima: A, I, U, E, O. Mana huruf ${vowel}?`)],
    choices: choices.map(textChoice),
    answerId: vowel,
    successText: `Hebat! ${vowel} adalah huruf vokal.`,
    successSpeak: [id(`Hebat! ${vowel}. ${vowel} adalah huruf vokal.`)],
    hint: `Ayo coba lagi. Huruf vokal itu A, I, U, E, O.`,
  };
}

/** Picture word with one letter hidden, e.g. B _ L A. */
function missingLetter(word: string, missingIndex: number, illustration: IllustrationId, choices: string[]) {
  const name = word[0] + word.slice(1).toLowerCase();
  const letter = word[missingIndex];
  const gap = [...word].map((c, i) => (i === missingIndex ? "_" : c)).join(" ");
  return {
    id: `missing-${word.toLowerCase()}`,
    instruction: `${name}. Huruf apa yang hilang?`,
    speak: [id(`${name}. Huruf apa yang hilang?`)],
    prompt: { kind: "picture" as const, illustration, caption: gap },
    choices: choices.map(textChoice),
    answerId: letter,
    successText: `Hebat! ${word} memakai huruf ${letter}.`,
    successSpeak: [id(`Hebat! ${letter}. ${name}.`)],
    hint: `Dengarkan sekali lagi, ya: ${name}. Ucapkan pelan-pelan.`,
  };
}

/** Read a written word, then find its picture. The word itself is not spoken first. */
function readWord(syllables: string[], answer: IllustrationId, choices: [IllustrationId, string][]) {
  const word = syllables.join("");
  const name = word[0] + word.slice(1).toLowerCase();
  return {
    id: `read-${word.toLowerCase()}`,
    instruction: "Baca kata ini. Gambar mana yang cocok?",
    speak: [id("Baca kata ini. Gambar mana yang cocok?")],
    prompt: { kind: "text" as const, text: word },
    choices: choices.map(([illustration, label]) => ({
      id: illustration,
      visual: { kind: "picture" as const, illustration },
      label,
    })),
    answerId: answer,
    successText: `Hebat! Kamu membaca kata ${word}.`,
    successSpeak: [id(`Hebat! ${syllables.join(", ")}. ${name}.`)],
    hint: `Ayo eja pelan-pelan: ${syllables.join("-")}.`,
  };
}

/** Tap letters in order to spell a pictured word. Words have no repeated letters. */
function spellWord(word: string, illustration: IllustrationId, shuffled: string) {
  const name = word[0] + word.slice(1).toLowerCase();
  return {
    id: `spell-${word.toLowerCase()}`,
    instruction: `Susun huruf menjadi kata ${word}.`,
    speak: [id(`Ayo susun huruf menjadi kata ${name}. ${[...word].join(", ")}.`)],
    prompt: { kind: "picture" as const, illustration, caption: word },
    tiles: [...shuffled].map(textChoice),
    answerOrder: [...word],
    successText: `Hebat! Kamu mengeja kata ${word}.`,
    successSpeak: [id(`Hebat! ${[...word].join(", ")}. ${name}.`)],
    hint: `Ayo coba lagi. Lihat huruf berikutnya pada tulisan ${word}.`,
  };
}

export const readingActivities: Activity[] = [
  {
    id: "reading-letters",
    module: "reading",
    kind: "choice",
    title: "Kenali Huruf",
    summary: "Cari huruf A, B, S, T, dan pasangan huruf kecilnya.",
    completionText: "Kamu sudah berlatih mengenal huruf A, B, S, T, dan M!",
    offlineTip: "Cari huruf A di buku cerita atau kemasan di rumah bersama orang tua.",
    difficulty: 1,
    rounds: [
      findLetter("A", ["M", "A", "S"]),
      findLetter("B", ["B", "O", "T"]),
      findLetter("S", ["I", "M", "S"]),
      findLetter("T", ["T", "O", "A"]),
      pairLetter("A", ["s", "a", "o"]),
      pairLetter("M", ["m", "b", "i"]),
      pairLetter("B", ["o", "s", "b"]),
      pairLetter("S", ["s", "m", "a"]),
    ],
  },
  {
    id: "reading-vowels",
    module: "reading",
    kind: "choice",
    title: "Huruf Vokal",
    summary: "Kenali lima huruf vokal: A, I, U, E, O.",
    completionText: "Kamu sudah berlatih huruf vokal A, I, U, E, dan O!",
    offlineTip: "Nyanyikan A-I-U-E-O bersama sambil membuka mulut lebar-lebar.",
    difficulty: 1,
    rounds: [
      findVowel("A", ["A", "K", "T"]),
      findVowel("I", ["M", "I", "B"]),
      findVowel("U", ["S", "P", "U"]),
      findVowel("E", ["E", "L", "R"]),
      findVowel("O", ["N", "O", "D"]),
      anyVowel(1, ["B", "T", "U"], "U"),
      anyVowel(2, ["O", "S", "P"], "O"),
      anyVowel(3, ["L", "E", "N"], "E"),
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
      initialLetter("Topi", "hat", ["P", "I", "T"]),
      initialLetter("Buku", "book", ["B", "K", "U"]),
      initialLetter("Kucing", "cat", ["S", "K", "N"]),
    ],
  },
  {
    id: "reading-missing-letter",
    module: "reading",
    kind: "choice",
    title: "Huruf Hilang",
    summary: "Lengkapi kata dengan huruf yang hilang.",
    completionText: "Kamu sudah berlatih melengkapi delapan kata, dari BOLA sampai TAS!",
    offlineTip: "Tulis nama benda di kertas, tutup satu huruf dengan jari, lalu tebak bersama.",
    difficulty: 2,
    rounds: [
      missingLetter("BOLA", 1, "ball", ["O", "A", "I"]),
      missingLetter("BUKU", 1, "book", ["A", "U", "E"]),
      missingLetter("IKAN", 2, "fish", ["I", "O", "A"]),
      missingLetter("TOPI", 3, "hat", ["I", "U", "A"]),
      missingLetter("SAPI", 1, "cow", ["E", "A", "O"]),
      missingLetter("MATA", 3, "eye", ["I", "U", "A"]),
      missingLetter("ROTI", 1, "bread", ["O", "E", "U"]),
      missingLetter("TAS", 1, "bag", ["I", "A", "U"]),
    ],
  },
  {
    id: "reading-syllables",
    module: "reading",
    kind: "choice",
    title: "Suku Kata",
    summary: "Dengarkan kata, lalu pilih suku kata awalnya.",
    completionText: "Kamu sudah berlatih suku kata BO, BU, MA, SA, TO, RO, PI, dan KU!",
    offlineTip: "Tepuk tangan untuk setiap suku kata: BO (tepuk) LA (tepuk).",
    difficulty: 2,
    rounds: [
      firstSyllable(["BO", "LA"], "ball", ["BA", "BO", "BU"]),
      firstSyllable(["BU", "KU"], "book", ["BU", "BI", "BE"]),
      firstSyllable(["MA", "TA"], "eye", ["MI", "MO", "MA"]),
      firstSyllable(["SA", "PI"], "cow", ["SA", "SU", "SI"]),
      firstSyllable(["TO", "PI"], "hat", ["TA", "TO", "TU"]),
      firstSyllable(["RO", "TI"], "bread", ["RO", "RA", "RI"]),
      firstSyllable(["PI", "SANG"], "banana", ["PA", "PI", "PU"]),
      firstSyllable(["KU", "CING"], "cat", ["KA", "KI", "KU"]),
    ],
  },
  {
    id: "reading-read-word",
    module: "reading",
    kind: "choice",
    title: "Baca Kata",
    summary: "Baca kata sederhana, lalu pilih gambarnya.",
    completionText: "Kamu sudah membaca delapan kata sederhana!",
    offlineTip: "Tempel kartu nama benda (MEJA, PINTU) di rumah dan baca bersama setiap hari.",
    difficulty: 2,
    rounds: [
      readWord(["BO", "LA"], "ball", [["ball", "bola"], ["book", "buku"], ["cat", "kucing"]]),
      readWord(["I", "KAN"], "fish", [["cow", "sapi"], ["fish", "ikan"], ["hat", "topi"]]),
      readWord(["TO", "PI"], "hat", [["bag", "tas"], ["bread", "roti"], ["hat", "topi"]]),
      readWord(["RO", "TI"], "bread", [["bread", "roti"], ["eye", "mata"], ["ball", "bola"]]),
      readWord(["TAS"], "bag", [["flower", "bunga"], ["bag", "tas"], ["fish", "ikan"]]),
      readWord(["BU", "KU"], "book", [["cat", "kucing"], ["cow", "sapi"], ["book", "buku"]]),
      readWord(["SA", "PI"], "cow", [["cow", "sapi"], ["bird", "burung"], ["cup", "cangkir"]]),
      readWord(["MA", "TA"], "eye", [["bag", "tas"], ["eye", "mata"], ["flower", "bunga"]]),
    ],
  },
  {
    id: "reading-build-words",
    module: "reading",
    kind: "sequence",
    title: "Susun Kata",
    summary: "Susun suku kata menjadi kata sederhana.",
    completionText: "Kamu sudah berlatih menyusun delapan kata dari suku kata!",
    offlineTip: "Tulis suku kata di kertas kecil, lalu susun bersama menjadi kata.",
    difficulty: 3,
    rounds: [
      buildWord(["BO", "LA"], "ball"),
      buildWord(["BU", "KU"], "book"),
      buildWord(["MA", "TA"], "eye"),
      buildWord(["SA", "PI"], "cow"),
      buildWord(["TO", "PI"], "hat"),
      buildWord(["RO", "TI"], "bread"),
      buildWord(["I", "KAN"], "fish"),
      buildWord(["PI", "SANG"], "banana"),
    ],
  },
  {
    id: "reading-spell-word",
    module: "reading",
    kind: "sequence",
    title: "Eja Kata",
    summary: "Susun huruf satu per satu menjadi kata.",
    completionText: "Kamu sudah berlatih mengeja kata TAS, ROTI, IKAN, SAPI, TOPI, BOLA, dan APEL!",
    offlineTip: "Pakai huruf magnet atau potongan kertas untuk menyusun nama sendiri.",
    difficulty: 3,
    rounds: [
      spellWord("TAS", "bag", "STA"),
      spellWord("ROTI", "bread", "TOIR"),
      spellWord("IKAN", "fish", "NKIA"),
      spellWord("SAPI", "cow", "PISA"),
      spellWord("TOPI", "hat", "IPTO"),
      spellWord("BOLA", "ball", "LABO"),
      spellWord("APEL", "apple", "ELPA"),
    ],
  },
];
