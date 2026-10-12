const ID_WORDS = [
  "nol",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
  "sebelas",
  "dua belas",
  "tiga belas",
  "empat belas",
  "lima belas",
  "enam belas",
  "tujuh belas",
  "delapan belas",
  "sembilan belas",
  "dua puluh",
] as const;

/** Indonesian number word for 0–20. */
export function numberWordId(n: number): string {
  const word = ID_WORDS[n];
  if (word === undefined) throw new RangeError(`No Indonesian number word for ${n}`);
  return word;
}

/** "1, 2, 3" spoken as "satu, dua, tiga". */
export function countAloud(upTo: number): string {
  return Array.from({ length: upTo }, (_, i) => numberWordId(i + 1)).join(", ");
}

/** Indonesian number word for 0–99, e.g. 47 → "empat puluh tujuh". */
export function numberWordIdTo99(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 99) throw new RangeError(`Unsupported number ${n}`);
  if (n <= 20) return numberWordId(n);
  const tens = Math.floor(n / 10);
  const units = n % 10;
  const tensWord = `${numberWordId(tens)} puluh`;
  return units === 0 ? tensWord : `${tensWord} ${numberWordId(units)}`;
}
