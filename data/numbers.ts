import { countAloud, numberWordId } from "@/lib/number-words";
import type { Activity, ChoiceOption, CountingRound, IllustrationId } from "@/types/learning";

const id = (text: string) => ({ text, lang: "id-ID" as const });

function numeralChoice(n: number): ChoiceOption {
  return { id: String(n), visual: { kind: "text", text: String(n) }, label: `Angka ${n}` };
}

function findNumeral(target: number, choices: number[]) {
  const word = numberWordId(target);
  return {
    id: `find-${target}`,
    instruction: `Cari angka ${word}!`,
    speak: [id(`Cari angka ${word}.`)],
    choices: choices.map(numeralChoice),
    answerId: String(target),
    successText: `Hebat! Ini angka ${target}, ${word}.`,
    successSpeak: [id(`Hebat! Ini angka ${word}.`)],
    hint: `Dengarkan sekali lagi, ya. Angka ${word}.`,
  };
}

function matchQuantity(illustration: IllustrationId, objectName: string, count: number, choices: number[]) {
  const word = numberWordId(count);
  return {
    id: `match-${illustration}-${count}`,
    instruction: `Ada berapa ${objectName}? Pilih angkanya.`,
    speak: [id(`Ada berapa ${objectName}? Pilih angkanya.`)],
    prompt: { kind: "group" as const, illustration, count },
    choices: choices.map(numeralChoice),
    answerId: String(count),
    successText: `Hebat! Ada ${word} ${objectName}. Angka ${count}.`,
    successSpeak: [id(`Hebat! Ada ${word} ${objectName}. Angka ${word}.`)],
    hint: `Ayo hitung bersama: ${countAloud(count)}.`,
  };
}

function countObjects(
  illustration: IllustrationId,
  objectName: string,
  count: number,
  choices: number[],
): CountingRound {
  const word = numberWordId(count);
  return {
    id: `count-${illustration}-${count}`,
    illustration,
    objectName,
    count,
    choices,
    instruction: `Ketuk setiap ${objectName} satu per satu.`,
    speak: [id(`Ayo hitung ${objectName}. Ketuk satu per satu.`)],
    successText: `Hebat! Ada ${word} ${objectName}. Angka ${count}.`,
    successSpeak: [id(`Hebat! Ada ${word} ${objectName}. Angka ${word}.`)],
    hint: `Ayo hitung bersama: ${countAloud(count)}.`,
  };
}

function orderNumbers(from: number, to: number, displayOrder: number[]) {
  const answer = Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
  return {
    id: `order-${from}-${to}`,
    instruction: `Susun angka dari ${from} sampai ${to}.`,
    speak: [id(`Susun angka dari ${numberWordId(from)} sampai ${numberWordId(to)}. Ketuk yang paling kecil dulu.`)],
    tiles: displayOrder.map(numeralChoice),
    answerOrder: answer,
    successText: `Hebat! ${answer.join(", ")}.`,
    successSpeak: [id(`Hebat! ${answer.map((n) => numberWordId(Number(n))).join(", ")}.`)],
    hint: "Ayo coba lagi. Cari angka yang datang berikutnya.",
  };
}

export const numberActivities: Activity[] = [
  {
    id: "numbers-count",
    module: "numbers",
    kind: "counting",
    title: "Hitung Benda",
    summary: "Ketuk benda satu per satu, lalu pilih angkanya.",
    completionText: "Kamu sudah berlatih menghitung sampai sepuluh!",
    offlineTip: "Hitung sendok, kancing, atau balok di rumah sambil menyentuhnya satu per satu.",
    difficulty: 1,
    rounds: [
      countObjects("apple", "apel", 3, [2, 3, 5]),
      countObjects("ball", "bola", 5, [5, 4, 6]),
      countObjects("fish", "ikan", 7, [6, 8, 7]),
      countObjects("flower", "bunga", 4, [4, 3, 7]),
      countObjects("bird", "burung", 10, [8, 10, 9]),
    ],
  },
  {
    id: "numbers-recognize",
    module: "numbers",
    kind: "choice",
    title: "Kenali Angka",
    summary: "Dengarkan, lalu cari angkanya.",
    completionText: "Kamu sudah berlatih mengenal angka 1 sampai 10!",
    offlineTip: "Cari angka di jam, kalender, atau nomor rumah saat berjalan-jalan.",
    difficulty: 1,
    rounds: [
      findNumeral(3, [3, 8, 5]),
      findNumeral(7, [1, 7, 4]),
      findNumeral(5, [2, 6, 5]),
      findNumeral(10, [10, 1, 9]),
      findNumeral(6, [9, 6, 3]),
    ],
  },
  {
    id: "numbers-match",
    module: "numbers",
    kind: "choice",
    title: "Cocokkan Jumlah",
    summary: "Lihat kelompok benda, lalu pilih angka yang cocok.",
    completionText: "Kamu sudah berlatih mencocokkan jumlah dengan angka!",
    offlineTip: "Taruh kertas bertuliskan angka, lalu letakkan jumlah balok yang sama di atasnya.",
    difficulty: 2,
    rounds: [
      matchQuantity("banana", "pisang", 2, [2, 4, 1]),
      matchQuantity("cup", "cangkir", 4, [5, 4, 3]),
      matchQuantity("book", "buku", 6, [6, 8, 9]),
      matchQuantity("apple", "apel", 8, [7, 6, 8]),
      matchQuantity("fish", "ikan", 9, [9, 10, 6]),
    ],
  },
  {
    id: "numbers-order",
    module: "numbers",
    kind: "sequence",
    title: "Urutkan Angka",
    summary: "Susun angka dari yang kecil ke yang besar.",
    completionText: "Kamu sudah berlatih mengurutkan angka 1 sampai 10!",
    offlineTip: "Jajarkan kartu angka 1–10 di lantai, lalu lompat dari satu angka ke angka berikutnya.",
    difficulty: 2,
    rounds: [
      orderNumbers(1, 3, [3, 1, 2]),
      orderNumbers(1, 5, [4, 2, 5, 1, 3]),
      orderNumbers(6, 10, [8, 10, 6, 9, 7]),
    ],
  },
];
