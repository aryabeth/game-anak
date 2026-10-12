import type { Activity, ChoiceOption, ChoiceRound, ColorId, IllustrationId } from "@/types/learning";

const en = (text: string) => ({ text, lang: "en-US" as const });

interface Word {
  word: string;
  /** Indonesian meaning, shown to support understanding. */
  meaning: string;
  visual: { kind: "picture"; illustration: IllustrationId } | { kind: "color"; color: ColorId };
}

/** Beginner English vocabulary used by the English Corner. */
export const vocabulary = {
  cat: { word: "cat", meaning: "kucing", visual: { kind: "picture", illustration: "cat" } },
  dog: { word: "dog", meaning: "anjing", visual: { kind: "picture", illustration: "dog" } },
  bird: { word: "bird", meaning: "burung", visual: { kind: "picture", illustration: "bird" } },
  fish: { word: "fish", meaning: "ikan", visual: { kind: "picture", illustration: "fish" } },
  red: { word: "red", meaning: "merah", visual: { kind: "color", color: "red" } },
  blue: { word: "blue", meaning: "biru", visual: { kind: "color", color: "blue" } },
  yellow: { word: "yellow", meaning: "kuning", visual: { kind: "color", color: "yellow" } },
  green: { word: "green", meaning: "hijau", visual: { kind: "color", color: "green" } },
  book: { word: "book", meaning: "buku", visual: { kind: "picture", illustration: "book" } },
  ball: { word: "ball", meaning: "bola", visual: { kind: "picture", illustration: "ball" } },
  cup: { word: "cup", meaning: "cangkir", visual: { kind: "picture", illustration: "cup" } },
  bag: { word: "bag", meaning: "tas", visual: { kind: "picture", illustration: "bag" } },
  apple: { word: "apple", meaning: "apel", visual: { kind: "picture", illustration: "apple" } },
  banana: { word: "banana", meaning: "pisang", visual: { kind: "picture", illustration: "banana" } },
  bread: { word: "bread", meaning: "roti", visual: { kind: "picture", illustration: "bread" } },
} satisfies Record<string, Word>;

type VocabId = keyof typeof vocabulary;

function pictureChoice(key: VocabId): ChoiceOption {
  const v: Word = vocabulary[key];
  return { id: key, visual: v.visual, label: v.word };
}

/** `again` marks a review round for a word that was already practised. */
function listenAndFind(target: VocabId, choices: VocabId[], again = false): ChoiceRound {
  const v = vocabulary[target];
  return {
    id: `listen-${target}${again ? "-again" : ""}`,
    instruction: `Find the ${v.word}.`,
    support: "Dengarkan, lalu pilih gambarnya.",
    speak: [en(`${cap(v.word)}. Find the ${v.word}.`)],
    choices: choices.map(pictureChoice),
    answerId: target,
    successText: `Great! This is a ${v.word}. (${v.meaning})`,
    successSpeak: [en(`Great! This is a ${v.word}.`)],
    hint: "Listen again. Dengarkan sekali lagi, ya.",
  };
}

function matchWord(target: VocabId, choices: VocabId[], again = false): ChoiceRound {
  const v = vocabulary[target];
  return {
    id: `word-${target}${again ? "-again" : ""}`,
    instruction: `Match the word: ${v.word}`,
    support: "Pilih gambar yang cocok dengan kata.",
    speak: [en(cap(v.word))],
    prompt: { kind: "text", text: v.word },
    choices: choices.map(pictureChoice),
    answerId: target,
    successText: `Great! ${cap(v.word)}. (${v.meaning})`,
    successSpeak: [en(`Great! ${cap(v.word)}.`)],
    hint: "Listen again. Dengarkan sekali lagi, ya.",
  };
}

function findColor(target: VocabId, choices: VocabId[], again = false): ChoiceRound {
  const v = vocabulary[target];
  return {
    id: `color-${target}${again ? "-again" : ""}`,
    instruction: `Find ${v.word}.`,
    support: "Dengarkan, lalu pilih warnanya.",
    speak: [en(`${cap(v.word)}. Find ${v.word}.`)],
    choices: choices.map(pictureChoice),
    answerId: target,
    successText: `Great! It is ${v.word}. (${v.meaning})`,
    successSpeak: [en(`Great! It is ${v.word}.`)],
    hint: "Listen again. Dengarkan sekali lagi, ya.",
  };
}

function phrase(text: string, target: VocabId, choices: VocabId[]): ChoiceRound {
  return {
    id: `phrase-${target}`,
    instruction: text,
    support: "Pilih gambar yang cocok dengan kalimat.",
    speak: [en(text)],
    prompt: { kind: "text", text },
    choices: choices.map(pictureChoice),
    answerId: target,
    successText: `Great! ${text}`,
    successSpeak: [en(`Great! ${text}`)],
    hint: "Listen again. Dengarkan sekali lagi, ya.",
  };
}

function cap(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}

export const englishActivities: Activity[] = [
  {
    id: "english-animals",
    module: "english",
    kind: "choice",
    title: "Listen & Find: Animals",
    summary: "Dengarkan nama hewan, lalu pilih gambarnya.",
    completionText: "Kamu sudah berlatih kata cat, dog, bird, dan fish!",
    offlineTip: "Sebutkan nama hewan dalam bahasa Inggris saat melihat buku bergambar.",
    difficulty: 1,
    rounds: [
      listenAndFind("cat", ["dog", "cat", "bird"]),
      listenAndFind("dog", ["dog", "fish", "cat"]),
      listenAndFind("bird", ["fish", "cat", "bird"]),
      listenAndFind("fish", ["bird", "fish", "dog"]),
      listenAndFind("bird", ["bird", "dog", "fish"], true),
      listenAndFind("cat", ["fish", "bird", "cat"], true),
      listenAndFind("dog", ["cat", "dog", "bird"], true),
      listenAndFind("fish", ["fish", "cat", "dog"], true),
    ],
  },
  {
    id: "english-colors",
    module: "english",
    kind: "choice",
    title: "Colors",
    summary: "Dengarkan nama warna, lalu pilih warnanya.",
    completionText: "Kamu sudah berlatih warna red, blue, yellow, dan green!",
    offlineTip: "Main 'I spy': cari benda berwarna red atau blue di sekitar rumah.",
    difficulty: 1,
    rounds: [
      findColor("red", ["blue", "red", "green"]),
      findColor("blue", ["blue", "yellow", "red"]),
      findColor("yellow", ["green", "red", "yellow"]),
      findColor("green", ["yellow", "green", "blue"]),
      findColor("yellow", ["yellow", "blue", "green"], true),
      findColor("red", ["green", "yellow", "red"], true),
      findColor("blue", ["red", "blue", "yellow"], true),
      findColor("green", ["green", "red", "yellow"], true),
    ],
  },
  {
    id: "english-things",
    module: "english",
    kind: "choice",
    title: "Things & Food",
    summary: "Cocokkan kata bahasa Inggris dengan gambarnya.",
    completionText: "Kamu sudah berlatih kata book, ball, cup, bag, apple, banana, dan bread!",
    offlineTip: "Tempel kartu kata 'cup' dan 'book' di benda aslinya di rumah.",
    difficulty: 2,
    rounds: [
      matchWord("book", ["book", "cup", "bag"]),
      matchWord("ball", ["apple", "ball", "bread"]),
      matchWord("cup", ["bag", "banana", "cup"]),
      matchWord("bag", ["bag", "book", "ball"]),
      matchWord("apple", ["bread", "apple", "cup"]),
      matchWord("banana", ["banana", "apple", "bread"]),
      matchWord("bread", ["ball", "bread", "banana"]),
      matchWord("book", ["ball", "bag", "book"], true),
    ],
  },
  {
    id: "english-phrases",
    module: "english",
    kind: "choice",
    title: "Simple Phrases",
    summary: "Dengarkan kalimat pendek, lalu pilih gambarnya.",
    completionText: "Kamu sudah berlatih kalimat pendek bahasa Inggris!",
    offlineTip: "Tunjuk benda dan ucapkan bersama: 'This is a cup.'",
    difficulty: 3,
    rounds: [
      phrase("This is a cat.", "cat", ["bird", "dog", "cat"]),
      phrase("It is red.", "red", ["red", "green", "yellow"]),
      phrase("I see a ball.", "ball", ["book", "ball", "bag"]),
      phrase("This is a banana.", "banana", ["apple", "bread", "banana"]),
      phrase("This is a dog.", "dog", ["dog", "cat", "fish"]),
      phrase("It is blue.", "blue", ["yellow", "blue", "red"]),
      phrase("I see a fish.", "fish", ["bird", "dog", "fish"]),
      phrase("This is a book.", "book", ["book", "cup", "ball"]),
    ],
  },
];
