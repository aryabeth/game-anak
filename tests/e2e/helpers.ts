import { expect, type Page } from "@playwright/test";
import { numberWordIdTo99 } from "../../lib/number-words";

/** Makes speech deterministic: the device reports no voices at all. */
export async function withoutVoices(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(window.speechSynthesis, "getVoices", { value: () => [] });
  });
}

export async function passParentGate(page: Page) {
  const hold = page.getByRole("button", { name: "Tahan 3 detik" });
  await hold.hover();
  await page.mouse.down();
  await expect(page.getByText(/Langkah 2 dari 2/)).toBeVisible({ timeout: 6000 });
  await page.mouse.up();
  const words = (await page.locator("#challenge-label span").textContent())!.replace(/[“”]/g, "");
  for (let n = 11; n <= 99; n++) {
    if (numberWordIdTo99(n) === words) {
      await page.getByRole("button", { name: String(n), exact: true }).click();
      return;
    }
  }
  throw new Error(`No number for "${words}"`);
}

/** Drags across the tracing SVG through points in its 200 × 200 coordinate space. */
export async function traceStroke(page: Page, points: { x: number; y: number }[]) {
  const box = (await page.getByRole("img", { name: /Area menelusuri/ }).boundingBox())!;
  const toPx = (p: { x: number; y: number }) => ({ x: box.x + (p.x / 200) * box.width, y: box.y + (p.y / 200) * box.height });
  const first = toPx(points[0]);
  await page.mouse.move(first.x, first.y);
  await page.mouse.down();
  for (const p of points.slice(1)) {
    const px = toPx(p);
    await page.mouse.move(px.x, px.y, { steps: 8 });
  }
  await page.mouse.up();
}
