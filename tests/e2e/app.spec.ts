import { expect, test } from "@playwright/test";
import { getActivity } from "../../data";
import { passParentGate, traceStroke, withoutVoices } from "./helpers";

test.beforeEach(async ({ page }) => {
  await withoutVoices(page);
});

test("welcome → home → every module card opens its module", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Explore · Learn · Grow")).toBeVisible();
  await page.getByRole("link", { name: "Mulai Belajar" }).click();
  await expect(page.getByRole("heading", { name: "Halo!" })).toBeVisible();

  const modules: [RegExp, string][] = [
    [/^Membaca/, "Membaca"],
    [/^Menulis/, "Menulis"],
    [/^Mengenal Angka/, "Mengenal Angka"],
    [/^Bahasa Inggris/, "Bahasa Inggris"],
  ];
  for (const [card, heading] of modules) {
    await page.getByRole("link", { name: card }).click();
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await page.getByRole("link", { name: "Kembali ke Beranda" }).click();
    await expect(page.getByRole("heading", { name: "Halo!" })).toBeVisible();
  }
});

test("letter matching: retry, specific praise, completion, persistence, resume", async ({ page }) => {
  await page.goto("/activity/reading-letters");
  await page.getByRole("button", { name: "Mulai" }).click();
  await expect(page.getByRole("heading", { name: "Ayo cari huruf A!" })).toBeVisible();

  // A non-matching choice gives a gentle hint and can be retried.
  await page.getByRole("button", { name: "M", exact: true }).click();
  await expect(page.getByText(/Ayo coba lagi/)).toBeVisible();
  await expect(page.getByRole("button", { name: "M, coba yang lain" })).toBeVisible();
  await expect(page.getByText(/salah|gagal/i)).toHaveCount(0);

  const activity = getActivity("reading-letters")!;
  if (activity.kind !== "choice") throw new Error("expected choice activity");
  for (const [i, round] of activity.rounds.entries()) {
    await page.getByRole("button", { name: round.answerId, exact: true }).click();
    await expect(page.getByText(round.successText)).toBeVisible();
    // Further taps after solving change nothing.
    await page.getByRole("button", { name: `${round.answerId}, cocok` }).click({ force: true });
    await page.getByRole("button", { name: i === activity.rounds.length - 1 ? "Selesai ✓" : "Lanjut →" }).click();
  }
  await expect(page.getByRole("heading", { name: activity.completionText })).toBeVisible();
  await expect(page.getByRole("button", { name: "↺ Ulangi" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Aktivitas Berikutnya →" })).toBeVisible();

  // Progress survives a reload and the last activity can be resumed.
  await page.goto("/home");
  await page.reload();
  const resume = page.getByRole("link", { name: /Lanjutkan belajar/ });
  await expect(resume).toContainText("Kenali Huruf");
  await expect(page.getByText("1 bintang")).toBeVisible();
  await resume.click();
  await expect(page.getByRole("heading", { name: "Kenali Huruf" })).toBeVisible();

  await page.goto("/learn/reading");
  await expect(page.getByText("Sudah berlatih", { exact: true })).toBeVisible();
});

test("counting: each object counts once, numeral reinforces quantity", async ({ page }) => {
  await page.goto("/activity/numbers-count");
  await page.getByRole("button", { name: "Mulai" }).click();
  const apples = page.getByRole("button", { name: /^apel, / });
  await expect(apples).toHaveCount(3);

  await apples.nth(0).click();
  await apples.nth(0).click();
  await apples.nth(0).click();
  await expect(page.getByText("Sudah dihitung: 1")).toBeVisible();
  await expect(page.getByText("Ada berapa apel?")).toHaveCount(0);

  await apples.nth(1).click();
  await apples.nth(2).click();
  await expect(page.getByText("Sudah dihitung: 3")).toBeVisible();
  await page.getByRole("button", { name: "Angka 2" }).click();
  await expect(page.getByText(/Ayo hitung bersama: satu, dua, tiga/)).toBeVisible();
  await page.getByRole("button", { name: "Angka 3" }).click();
  await expect(page.getByText("Hebat! Ada tiga apel. Angka 3.")).toBeVisible();
});

test("ordering numbers fills slots only in order", async ({ page }) => {
  await page.goto("/activity/numbers-order");
  await page.getByRole("button", { name: "Mulai" }).click();
  await page.getByRole("button", { name: "Angka 3" }).click();
  await expect(page.getByLabel("Kotak 1: kosong")).toBeVisible();
  await page.getByRole("button", { name: /^Angka 1/ }).click();
  await page.getByRole("button", { name: /^Angka 2/ }).click();
  await page.getByRole("button", { name: /^Angka 3/ }).click();
  await expect(page.getByText("Hebat! 1, 2, 3.")).toBeVisible();
});

test("tracing: a click never completes, reset clears, full trace completes", async ({ page }) => {
  await page.goto("/activity/writing-prewriting");
  await page.getByRole("button", { name: "Mulai" }).click();
  const canvas = page.getByRole("img", { name: /Area menelusuri/ });
  const box = (await canvas.boundingBox())!;

  // Single click on the path.
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.getByRole("button", { name: "Lanjut →" })).toHaveCount(0);
  await expect(page.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow", "0");

  await page.getByRole("button", { name: "↺ Ulangi garis" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");

  // Far from the path: hint, no completion.
  await traceStroke(page, [{ x: 20, y: 30 }, { x: 20, y: 170 }]);
  await expect(page.getByText(/Ikuti garis putus-putus/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Lanjut →" })).toHaveCount(0);

  // Along the vertical guide.
  await traceStroke(page, [{ x: 100, y: 30 }, { x: 101, y: 100 }, { x: 99, y: 170 }]);
  await expect(page.getByText("Hebat! Kamu sudah berlatih garis tegak.")).toBeVisible();
  await expect(page.getByText("Latihan menelusuri, bukan penilaian tulisan tangan.")).toBeVisible();
});

test("English: picture-word match with honest audio fallback", async ({ page }) => {
  await page.goto("/activity/english-animals");
  await page.getByRole("button", { name: "Mulai" }).click();
  await expect(page.getByRole("heading", { name: "Find the cat." })).toBeVisible();
  await expect(page.getByText("Suara belum tersedia di perangkat ini.", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Diputar…" })).toHaveCount(0);
  await page.getByRole("button", { name: "cat", exact: true }).click();
  await expect(page.getByText("Great! This is a cat. (kucing)")).toBeVisible();
  await expect(page.getByRole("img", { name: "kucing" })).toHaveCount(0); // choice images are labelled by their button
});

test("parent corner: gate, settings, reset with confirmation", async ({ page }) => {
  // Create some progress first.
  await page.goto("/activity/numbers-order");
  await page.getByRole("button", { name: "Mulai" }).click();

  await page.goto("/parent");
  await expect(page.getByRole("heading", { name: "Khusus orang tua" })).toBeVisible();
  // A quick tap does not open the gate.
  await page.getByRole("button", { name: "Tahan 3 detik" }).click();
  await expect(page.getByText(/Langkah 2 dari 2/)).toHaveCount(0);

  await passParentGate(page);
  await expect(page.getByRole("heading", { name: "Pojok Orang Tua" })).toBeVisible();

  // Nickname appears in the greeting.
  await page.getByLabel("Nama panggilan (opsional)").fill("Mia");
  await page.getByRole("button", { name: "Simpan" }).click();
  await expect(page.getByText("Tersimpan.")).toBeVisible();

  // Audio toggle persists after reload (gate locks again after reload).
  const audio = page.getByRole("switch", { name: "Suara instruksi dan kata" });
  await audio.click();
  await expect(audio).toHaveAttribute("aria-checked", "false");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Khusus orang tua" })).toBeVisible();
  await passParentGate(page);
  await expect(page.getByRole("switch", { name: "Suara instruksi dan kata" })).toHaveAttribute("aria-checked", "false");

  // Progress page shows the started activity.
  await page.getByRole("link", { name: /Catatan Belajar/ }).click();
  await expect(page.getByRole("row", { name: /Urutkan Angka/ })).toContainText("Sedang berlatih");
  await expect(page.getByText(/bukan penilaian perkembangan anak/)).toBeVisible();
  await page.getByRole("link", { name: "← Pojok Orang Tua" }).click();

  // Reset needs confirmation; cancel keeps data.
  await page.getByRole("button", { name: "Hapus progres…" }).click();
  await page.getByRole("button", { name: "Batal" }).click();
  await page.getByRole("button", { name: "Hapus progres…" }).click();
  await page.getByRole("button", { name: "Ya, hapus progres" }).click();
  await expect(page.getByText("Progres sudah dihapus.")).toBeVisible();

  await page.goto("/home");
  await expect(page.getByRole("heading", { name: "Halo, Mia!" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Lanjutkan belajar/ })).toHaveCount(0);
  await expect(page.getByText("Suara dimatikan di Pojok Orang Tua.")).toHaveCount(0);
});

test("corrupted storage is recovered without crashing", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("little-learners", "{broken"));
  await page.goto("/home");
  await expect(page.getByRole("heading", { name: "Halo!" })).toBeVisible();
  await page.goto("/parent");
  await passParentGate(page);
  await expect(page.getByText(/tidak bisa dibaca/)).toBeVisible();
});

for (const path of ["/", "/home", "/learn/reading", "/activity/numbers-count", "/activity/writing-uppercase", "/parent"]) {
  test(`no horizontal scrolling on ${path}`, async ({ page }, info) => {
    await page.goto(path);
    const start = page.getByRole("button", { name: "Mulai" });
    if (path.startsWith("/activity")) await start.click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `test-results/screens/${info.project.name}${path.replaceAll("/", "_") || "_root"}.png`, fullPage: true });
  });
}
