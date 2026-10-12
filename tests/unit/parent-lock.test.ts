import { describe, expect, it } from "vitest";
import { numberWordIdTo99 } from "@/lib/number-words";
import { createGateChallenge } from "@/lib/parent-lock";

describe("parent gate challenge", () => {
  it("always offers four unique options including the answer", () => {
    for (let seed = 0; seed < 500; seed++) {
      let x = seed + 1;
      const random = () => {
        x = (x * 9301 + 49297) % 233280;
        return x / 233280;
      };
      const c = createGateChallenge(random);
      expect(c.options).toHaveLength(4);
      expect(new Set(c.options).size).toBe(4);
      expect(c.options).toContain(c.target);
      expect(c.words).toBe(numberWordIdTo99(c.target));
    }
  });
});

describe("Indonesian number words", () => {
  it.each([
    [7, "tujuh"],
    [10, "sepuluh"],
    [11, "sebelas"],
    [19, "sembilan belas"],
    [47, "empat puluh tujuh"],
    [90, "sembilan puluh"],
  ])("%i → %s", (n, word) => expect(numberWordIdTo99(n)).toBe(word));
});
