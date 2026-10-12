import { arc, join, line, polyline } from "@/lib/tracing";
import type { Activity, Point, TracingRound } from "@/types/learning";

const id = (text: string) => ({ text, lang: "id-ID" as const });

function stroke(
  key: string,
  label: string,
  instruction: string,
  strokes: Point[][],
): TracingRound {
  return {
    id: key,
    label,
    instruction,
    speak: [id(instruction)],
    strokes,
    successText: `Hebat! Kamu sudah berlatih ${label.toLowerCase()}.`,
    successSpeak: [id(`Hebat! Kamu sudah berlatih ${label.toLowerCase()}.`)],
    hint: "Mulai dari titik hijau, lalu ikuti garis putus-putus.",
  };
}

function letter(
  char: string,
  strokes: Point[][],
  options: { model?: string; size?: "besar" | "kecil" } = {},
): TracingRound {
  const name = options.size ? `huruf ${char} ${options.size}` : `huruf ${char}`;
  const instruction = options.model
    ? `Salin kata ${options.model}. Telusuri ${name}.`
    : `Telusuri ${name}. Mulai dari titik hijau.`;
  return {
    id: `letter-${char}${options.model ? `-${options.model}` : ""}${options.size === "kecil" ? "-kecil" : ""}`,
    label: char,
    model: options.model,
    instruction,
    speak: [id(instruction)],
    strokes,
    successText: `Hebat! Kamu sudah menelusuri ${name}.`,
    successSpeak: [id(`Hebat! Kamu sudah menelusuri ${name}.`)],
    hint:
      strokes.length > 1
        ? "Ikuti garis putus-putus. Mulai dari titik 1, lalu titik 2."
        : "Mulai dari titik hijau, lalu ikuti arah panah.",
  };
}

const UPPER = {
  I: [line(100, 40, 100, 160)],
  L: [join(line(70, 40, 70, 160), line(70, 160, 140, 160))],
  T: [line(50, 40, 150, 40), line(100, 40, 100, 160)],
  A: [line(100, 40, 50, 160), line(100, 40, 150, 160), line(72, 110, 128, 110)],
  O: [arc(100, 100, 48, 60, -90, -450)],
  U: [join(line(60, 40, 60, 120), arc(100, 120, 40, 40, 180, 0), line(140, 120, 140, 40))],
  E: [line(65, 40, 65, 160), line(65, 40, 140, 40), line(65, 100, 125, 100), line(65, 160, 140, 160)],
  H: [line(60, 40, 60, 160), line(140, 40, 140, 160), line(60, 100, 140, 100)],
};

const LOWER = {
  l: [line(100, 40, 100, 160)],
  o: [arc(100, 125, 35, 35, -90, -450)],
  c: [arc(100, 125, 35, 35, -45, -315)],
  a: [arc(95, 125, 30, 35, -60, -420), line(125, 90, 125, 160)],
  i: [line(100, 95, 100, 160), line(100, 62, 100, 72)],
  v: [join(line(65, 90, 100, 160), line(100, 160, 135, 90))],
  u: [join(line(70, 90, 70, 125), arc(100, 125, 30, 35, 180, 0), line(130, 125, 130, 90)), line(130, 90, 130, 160)],
  n: [line(70, 90, 70, 160), join(arc(100, 125, 30, 35, 180, 360), line(130, 125, 130, 160))],
};

export const writingActivities: Activity[] = [
  {
    id: "writing-prewriting",
    module: "writing",
    kind: "tracing",
    title: "Garis Dasar",
    summary: "Telusuri garis tegak, datar, miring, lengkung, lingkaran, zigzag, dan gelombang.",
    completionText: "Kamu sudah berlatih delapan garis dasar!",
    offlineTip: "Gambar garis yang sama di pasir, tepung, atau kertas dengan krayon.",
    difficulty: 1,
    rounds: [
      stroke("line-vertical", "Garis tegak", "Tarik garis dari atas ke bawah.", [line(100, 30, 100, 170)]),
      stroke("line-horizontal", "Garis datar", "Tarik garis dari kiri ke kanan.", [line(30, 100, 170, 100)]),
      stroke("line-diagonal", "Garis miring", "Tarik garis miring ke bawah.", [line(40, 40, 160, 160)]),
      stroke("line-diagonal-up", "Garis miring naik", "Tarik garis miring ke atas.", [line(40, 160, 160, 40)]),
      stroke("line-curve", "Garis lengkung", "Buat lengkungan seperti pelangi.", [arc(100, 140, 70, 70, 180, 360)]),
      stroke("line-circle", "Lingkaran", "Buat lingkaran. Mulai dari atas.", [arc(100, 100, 60, 60, -90, -450)]),
      stroke(
        "line-zigzag",
        "Garis zigzag",
        "Buat garis zigzag naik turun.",
        [polyline([30, 70], [65, 130], [100, 70], [135, 130], [170, 70])],
      ),
      stroke(
        "line-wave",
        "Garis gelombang",
        "Buat gelombang seperti ombak.",
        [join(arc(65, 100, 35, 30, 180, 360), arc(135, 100, 35, 30, 180, 0))],
      ),
    ],
  },
  {
    id: "writing-uppercase",
    module: "writing",
    kind: "tracing",
    title: "Huruf Besar",
    summary: "Telusuri huruf besar I, L, T, A, O, U, E, dan H.",
    completionText: "Kamu sudah berlatih menulis huruf I, L, T, A, O, U, E, dan H!",
    offlineTip: "Bentuk huruf dari tanah liat atau tali, lalu raba bentuknya dengan jari.",
    difficulty: 2,
    rounds: [
      letter("I", UPPER.I),
      letter("L", UPPER.L),
      letter("T", UPPER.T),
      letter("A", UPPER.A),
      letter("O", UPPER.O),
      letter("U", UPPER.U),
      letter("E", UPPER.E),
      letter("H", UPPER.H),
    ],
  },
  {
    id: "writing-lowercase",
    module: "writing",
    kind: "tracing",
    title: "Huruf Kecil",
    summary: "Telusuri huruf kecil l, o, c, a, i, v, u, dan n.",
    completionText: "Kamu sudah berlatih menulis huruf l, o, c, a, i, v, u, dan n!",
    offlineTip: "Tulis huruf kecil di udara dengan jari, besar-besar, bersama orang tua.",
    difficulty: 2,
    rounds: [
      letter("l", LOWER.l, { size: "kecil" }),
      letter("o", LOWER.o, { size: "kecil" }),
      letter("c", LOWER.c, { size: "kecil" }),
      letter("a", LOWER.a, { size: "kecil" }),
      letter("i", LOWER.i, { size: "kecil" }),
      letter("v", LOWER.v, { size: "kecil" }),
      letter("u", LOWER.u, { size: "kecil" }),
      letter("n", LOWER.n, { size: "kecil" }),
    ],
  },
  {
    id: "writing-copy-word",
    module: "writing",
    kind: "tracing",
    title: "Salin Kata",
    summary: "Salin kata ITU dan LIHAT dengan menelusuri hurufnya satu per satu.",
    completionText: "Kamu sudah berlatih menyalin kata ITU dan LIHAT!",
    offlineTip: "Salin kata ITU di kertas dengan pensil tebal sambil melihat contoh.",
    difficulty: 3,
    rounds: [
      letter("I", UPPER.I, { model: "ITU" }),
      letter("T", UPPER.T, { model: "ITU" }),
      letter("U", UPPER.U, { model: "ITU" }),
      letter("L", UPPER.L, { model: "LIHAT" }),
      letter("I", UPPER.I, { model: "LIHAT" }),
      letter("H", UPPER.H, { model: "LIHAT" }),
      letter("A", UPPER.A, { model: "LIHAT" }),
      letter("T", UPPER.T, { model: "LIHAT" }),
    ],
  },
];
