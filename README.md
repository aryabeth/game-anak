# Little Learners — Explore · Learn · Grow

A calm, Montessori-inspired learning web app for children aged 4–6. The interface is in Indonesian, and English is offered as a learning language. This is the MVP described in [`LITTLE_LEARNERS_SPEC.md`](./LITTLE_LEARNERS_SPEC.md).

## What is included

| Area | Activities |
| --- | --- |
| **Membaca** (Reading Garden) | Letter recognition with upper/lowercase pairs · vowels A I U E O · initial letter of a pictured word · missing letter (B _ L A) · first syllable · reading a word and finding its picture · building words from syllables · spelling words letter by letter (TAS, ROTI, IKAN, SAPI, TOPI, BOLA, APEL) |
| **Menulis** (Writing Studio) | Tracing eight pre-writing strokes · uppercase I L T A O U E H · lowercase l o c a i v u n · copying the words ITU and LIHAT |
| **Mengenal Angka** (Number Garden) | Counting objects one by one (1–10) · numeral recognition · matching quantity to numeral · ordering 1–10 |
| **Bahasa Inggris** (English Corner) | Listen & find (animals) · colors · word-to-picture (things & food) · simple phrases. 15 words in total; later rounds review words already met |
| **Pojok Orang Tua** | Two-step parent gate · nickname · voice and sound-effect toggles · progress overview · reset with confirmation · privacy notice |

Every activity has more than five steps (eight in most; a unit test enforces the minimum). The app also has a welcome screen, a home dashboard with a "Lanjutkan belajar" (resume) card, module pages that suggest an activity without locking the others, a completion screen with a star and an off-screen activity idea, and local progress that survives a page reload.

## Running it

Requires Node 22+.

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm run start        # serves the production build on port 3000
```

Every page is prerendered, and there is no backend or environment configuration. The app can be deployed to any Node host that runs `next start`, or to Vercel with no extra settings.

## Checks

```bash
npm run lint         # ESLint (next/core-web-vitals + TypeScript)
npm run typecheck    # generate route types, then tsc --noEmit
npm test             # Vitest unit tests: content validation, storage, engine, tracing, parent gate
npm run test:e2e     # builds, then runs Playwright flows at tablet (820×1180) and phone (390×844) sizes
```

The end-to-end suite uses Playwright's Chromium. On a new machine, run `npx playwright install chromium` first.

## How it is built

- **Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS 4.** Design tokens live in `app/globals.css` (`@theme`).
- **Content is separate from the UI.** It lives in typed data files in `data/` (`reading.ts`, `writing.ts`, `numbers.ts`, `english.ts`). `lib/validation.ts` checks every activity for problems such as an answer missing from its choices, duplicate choices, a count that does not match, or an empty tracing path. The unit tests run this check over all content, and the activity page shows a friendly "not ready" message instead of a broken activity.
- **Four reusable game types** cover all activities: `ChoiceGame`, `CountingGame`, `SequenceGame` and `TracingCanvas`. All of them run inside `ActivityShell`.
- **Activity state machine** (`lib/activity-engine.ts`): `ready → inProgress → feedback → completed`. The machine ignores events that do not fit the current phase, so double taps cannot skip a round or complete an activity twice. Progress is recorded from event handlers rather than effects, so React's development double-rendering cannot record it twice.
- **Storage** (`lib/progress-storage.ts`): versioned (`schemaVersion: 1`), validated on load, and behind a small `ProgressStorage` interface so a backend can replace it later. Corrupted data is replaced with defaults, and the parent is told. When storage is blocked, the app keeps working in memory and shows a warning.
- **Tracing** (`lib/tracing.ts`): strokes are polylines in a 200×200 space. The pointer must pass within 16 units of the guide points, and every stroke must reach 85 % coverage. A single tap covers only a few guide points, so it can never complete a letter (this is unit-tested for every point of every letter). The canvas uses Pointer Events with pointer capture, handles `pointercancel`, and scales via `viewBox` without distortion.
- **Page state across navigations:** Next 16 keeps recently visited pages alive (hidden with React `<Activity>`). Activities are keyed on `router.bfcacheId`, so opening one from a link starts it fresh. The parent gate and the reset confirmation also reset when their page is hidden.

## Decisions worth knowing

- **Audio uses the device's built-in voices** (Web Speech API). The project has no licensed recordings, so it ships no audio files. When a device has no Indonesian or English voice, the button says so ("Suara belum tersedia di perangkat ini…"), and the written text remains the instruction. The "playing" state only appears once speech has actually started. Starting a new clip cancels the previous one, so clips never overlap, and speech stops when the child leaves the screen. Sound effects are short tones generated with Web Audio.
- **All illustrations are original inline SVGs** (`components/illustrations/Illustration.tsx`). No third-party image assets are used.
- **Fonts:** Nunito is loaded through `next/font`. It is downloaded at build time and served by the app itself, so children's devices make no request to Google.
- **Muted text color:** the spec's `#73796F` reaches only 4.18:1 contrast on the cream background, which fails WCAG AA for small text. The app uses `#5F655B` (5.6:1) instead. A darker terracotta (`#9C4F33`) is used for text and for focus outlines.
- **Parent gate:** step 1 is to hold a button for 3 seconds; step 2 is to tap the numeral for a number written in Indonesian words (e.g. "empat puluh tujuh" → 47). The gate is a speed bump for young children, not a security control. Once passed, the area stays open for 10 minutes or until "Kunci Pojok Orang Tua" is pressed, and a page reload locks it again.
- **Progress labels** describe practice, not mastery: *Belum dicoba* (never opened), *Sedang berlatih* (started, not finished), *Sudah berlatih* (finished at least once), *Sudah sering berlatih* (finished 3 or more times). The progress page explains these rules and says that it is not a developmental assessment.
- **Answer order is fixed in the content**, not randomized. This keeps tests deterministic and avoids hydration mismatches. The correct answer's position varies between rounds, and a unit test enforces this.
- The **home route** is `/home`, so that `/` can stay a short welcome screen. Module pages are `/learn/[module]` and activities are `/activity/[id]`; both are prerendered for every known id.

## Privacy

There are no accounts, ads, analytics, trackers, external links for children, microphone, or camera. The only stored data is an optional nickname, the two sound settings, and per-activity counts with the last practice time. This data stays in `localStorage` on the current browser and is never sent anywhere. Because it is local, progress does not sync between devices and is lost if the browser's site data is cleared. The Parent Corner explains this.

## Not done yet / known limits

- Testing with real families or educators, as planned for week 4 of the spec, needs people and permission. It has not been done.
- The real-device check covered only automated Chromium at tablet and phone sizes. Safari/iPadOS, Android Chrome, and stylus input still need manual testing on hardware.
- Voice availability depends on the device. Desktop Chromium on Linux often has no Indonesian voice, in which case the fallback text appears.
- No PWA or offline caching yet (spec roadmap 1.2), and no free-drawing canvas (optional in the spec).
