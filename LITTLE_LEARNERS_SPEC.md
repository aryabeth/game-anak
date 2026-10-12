# Little Learners — Product Requirements & Claude Build Brief

> **Purpose:** A practical product specification and implementation brief for building a web-based Montessori-inspired learning application for children aged 4–6.
>
> **Product tagline:** Explore · Learn · Grow  
> **Primary language:** Indonesian  
> **Additional learning language:** English  
> **Target platform:** Responsive web app / Progressive Web App (PWA-ready)  
> **MVP target:** A polished, playable browser application with four learning modules and locally saved progress.

---

## 1. Product Overview

### 1.1 Product concept

**Little Learners** is a gentle, Montessori-inspired educational web application for children aged 4–6. It introduces early literacy, handwriting readiness, number sense, and beginner English through short, hands-on digital activities.

The app should feel like a calm digital learning environment, not a competitive arcade game. Children should be able to choose activities, explore materials, repeat exercises, and receive encouraging feedback without pressure.

### 1.2 Learning areas

1. **Reading Garden** — Indonesian letter recognition, letter sounds, initial sounds, syllables, and simple words.
2. **Writing Studio** — pre-writing strokes, tracing uppercase/lowercase letters, and copying simple words.
3. **Number Garden** — number recognition, one-to-one counting, quantity matching, and number ordering.
4. **English Corner** — beginner English vocabulary, audio pronunciation, picture-word matching, and simple phrases.
5. **Parent Corner** — child profile, progress overview, activity history, and parent-controlled settings.

### 1.3 Target users

- **Primary users:** Children aged 4–6.
- **Secondary users:** Parents, caregivers, and early-childhood educators.
- **Usage context:** Short learning sessions at home or in a supervised classroom.
- **Devices:** Tablets first, then laptops and mobile phones. Touch interactions must work well; mouse and keyboard should also work where practical.

### 1.4 Product goals

- Make it easy for a child to start an activity with little or no reading required.
- Teach concepts through matching, manipulating, tracing, counting, listening, and repetition.
- Encourage independent exploration while keeping parent controls protected.
- Give parents a clear, honest view of practice activity and progress.
- Keep the experience accessible, private, responsive, and free from advertising.

### 1.5 Non-goals for the MVP

Do **not** build these in the first release unless the core MVP is already stable:

- AI tutor or open-ended chatbot.
- Automatic speech recognition or pronunciation scoring.
- Complex AI handwriting recognition.
- Multiplayer, public profiles, leaderboards, or social features.
- Paid subscriptions, payment processing, or advertisements.
- Large content-management system.
- Cross-device account sync.
- Complex math operations.
- Full curriculum coverage for every age and skill level.

---

## 2. Learning and Montessori-Inspired Design Principles

The product should be Montessori-inspired rather than claiming to be a certified Montessori curriculum.

### 2.1 Principles

- **Concrete to abstract:** Show objects and quantities before relying only on symbols.
- **One task at a time:** Keep each activity focused on a single learning goal.
- **Child choice:** Let children select a learning area and repeat an activity.
- **Self-paced repetition:** Allow practice without penalties or countdown timers.
- **Simple feedback:** Explain or demonstrate rather than marking children as failures.
- **Purposeful interaction:** Tapping, dragging, tracing, sorting, and counting should support the learning objective.
- **Low distraction:** Use limited animation, no flashing effects, and no unnecessary sound.
- **Real-world extension:** Encourage offline activities such as tracing in sand, counting blocks, or finding letters in a book.
- **Age-appropriate expectations:** Do not assume all children aged 4–6 have identical reading or fine-motor skills.

### 2.2 Session design

Use approximately **3–7 minutes per activity as a starting design target**, not a strict requirement. Parents should be able to stop at any time. Avoid streak pressure, timers, lives, punishment, or rewards tied exclusively to correct answers.

### 2.3 Feedback examples

Correct answer:
- “Hebat! Ini huruf A.”
- “Kamu berhasil menghitung lima apel.”
- “Great! This is a cat.”

Incorrect or incomplete answer:
- “Ayo coba lagi.”
- “Dengarkan sekali lagi, ya.”
- Show a visual hint or demonstrate the first step.

Do not use:
- “Kamu salah!”
- “Kamu gagal.”
- “Kamu kalah.”
- Red failure screens or loss of previously earned rewards.

---

## 3. Brand and Visual Design System

### 3.1 Brand identity

**Name:** Little Learners  
**Tagline:** Explore · Learn · Grow  
**Personality:** Calm, warm, curious, encouraging, trustworthy, and playful without being noisy.

### 3.2 Visual direction

Use a **natural Montessori-inspired palette**:

- Warm cream background: `#FAF7F0`
- Sage green: `#DDE7D5`
- Deep sage / primary text: `#405641`
- Soft terracotta: `#D58C70`
- Warm beige: `#E9DDC9`
- Soft sky blue: `#DCEAF3`
- Muted yellow: `#F3E6B5`
- Main text: `#343A34`
- Secondary text: `#73796F`
- White surface: `#FFFFFF`

Use colors consistently and verify text contrast. Pastel colors are for surfaces and illustrations; essential text and controls must remain readable.

### 3.3 Typography

- Use a friendly, highly legible sans-serif such as Nunito, Atkinson Hyperlegible, or a comparable available font.
- Headings should be short and clear.
- Use large labels and buttons.
- Avoid long paragraphs in child-facing screens.
- Prefer lowercase examples when teaching lowercase letter forms, but explicitly teach uppercase/lowercase relationships.

### 3.4 Layout

- Soft rounded cards and generous whitespace.
- Large touch targets (aim for at least 48 × 48 CSS pixels; larger for primary child controls).
- Use recognizable illustrations and simple icons with text or audio labels.
- Avoid dense navigation, tiny controls, excessive gradients, and complicated menus.
- Use subtle motion only when it supports feedback or orientation.
- Ensure layouts work in portrait and landscape tablet orientations.

### 3.5 Illustration and audio

- Use consistent, friendly illustrations.
- Avoid visual clutter and excessive decorative elements.
- Use licensed, original, or properly permitted image and audio assets.
- If audio files are unavailable, implement a graceful placeholder state; do not pretend audio played.
- Audio controls must have visible play/replay states and must not stack overlapping clips.

---

## 4. Information Architecture and Routes

Suggested routes:

```text
/
├── /learn/reading
├── /learn/writing
├── /learn/numbers
├── /learn/english
├── /activity/[id]
├── /progress
└── /parent
```

### 4.1 Welcome screen — `/`

Purpose:
- Introduce the product.
- Let a parent create or select a simple child profile if profile selection is implemented.
- Let a child enter the learning home.

Elements:
- Little Learners logo and tagline.
- Friendly welcome illustration.
- Large primary button: **Mulai Belajar**.
- Optional profile selector.
- Parent Corner access, visually separated from the main child action.

Keep onboarding short. The MVP may use one local profile without requiring an account.

### 4.2 Home dashboard

Purpose:
- Let children immediately choose an activity.

Elements:
- Greeting, e.g. “Halo, Mia! Mau belajar apa hari ini?”
- Four large learning cards:
  - Reading Garden / Membaca
  - Writing Studio / Menulis
  - Number Garden / Mengenal Angka
  - English Corner / Bahasa Inggris
- “Lanjutkan belajar” card if a recent activity exists.
- Small, friendly progress summary.
- Parent Corner entry with a parent gate.

Behavior:
- Cards navigate to their module routes.
- Resume action opens the last activity when available.
- Avoid showing a complex score or a long list of unfinished tasks.

### 4.3 Module overview pages

Each module overview should include:
- Module title and one-line explanation.
- A small set of activity cards.
- Activity completion indicators.
- Suggested starting activity.
- Back-to-home control.
- Optional audio instruction.

Do not lock children out of every other activity because they did not pass a previous activity. Use suggested sequences rather than harsh gating.

### 4.4 Activity screen

Each activity screen should contain:
- Short instruction in Indonesian, or English for a selected English exercise.
- Replay-audio control when relevant.
- Large interactive task area.
- Optional hint button.
- Back control.
- Encouraging feedback.
- A clear finish/continue action.
- Minimal distractions.

Activity state should be explicit:
- `ready`
- `inProgress`
- `feedback`
- `completed`

Avoid triggering completion repeatedly for a single answer.

### 4.5 Completion screen

Elements:
- Positive, specific message: “Kamu sudah berlatih huruf A!”
- A star or sticker earned for participation/completion.
- Buttons: **Ulangi** and **Aktivitas Berikutnya**.
- Optional “Kembali ke Beranda”.
- Do not compare children or display leaderboards.

### 4.6 Progress page

Designed for parents, not as a complicated child-facing analytics page.

Show:
- Activity count by learning area.
- Recently practiced items.
- Items practiced multiple times.
- Simple status such as “Belum dicoba”, “Sedang berlatih”, “Sudah sering berlatih”.
- Date/time of last practice where useful.
- A clear explanation that app activity is not a formal developmental assessment.

Do not claim mastery from one correct response. Use modest progress labels and explain how they are calculated.

### 4.7 Parent Corner

Protect this area with a simple parent gate, such as a hold-to-enter interaction or a parent confirmation step. Do not rely on a child-readable arithmetic question as the only protection.

Settings:
- Child profile nickname (optional).
- Audio on/off.
- Sound effects on/off.
- Reset progress, with explicit confirmation.
- Activity history.
- Privacy information.
- Optional session reminder/settings; no intrusive timer or forced session length.

For MVP, settings and progress can be local to the current browser.

---

## 5. Learning Content Specification

### 5.1 Reading Garden — Bahasa Indonesia

MVP activities:
1. Recognize selected uppercase and lowercase letters.
2. Match a letter to an illustration/word.
3. Identify a letter by its spoken name or sound.
4. Match simple syllables.
5. Build selected simple words.

Suggested sequence:
- Letter recognition: begin with a small set, then expand to A–Z.
- Letter-to-picture matching.
- Syllables such as BA, BI, BU, BE, BO and other familiar combinations.
- Simple words such as BOLA, BUKU, MATA, SAPI, and TOPI.

Content rules:
- Make the relationship between a letter and its sound clear.
- Avoid teaching a potentially confusing sound as if letter names and phonemes were identical.
- Use familiar vocabulary and accurate illustrations.
- Do not make every word-building activity a spelling test.
- Keep the initial MVP content set small enough to test thoroughly.

### 5.2 Writing Studio

MVP activities:
1. Pre-writing lines: vertical, horizontal, diagonal, curves, circles, and zigzags.
2. Trace selected uppercase letters.
3. Trace selected lowercase letters.
4. Copy a short word using a model.
5. Optional free drawing canvas.

Tracing interaction:
- Use SVG paths or canvas paths.
- Show a clear start point and directional cue.
- Accept a reasonable tolerance around the path.
- Do not require perfect precision.
- Give a hint if the pointer/finger is far from the path.
- Support touch, stylus where available, and mouse.
- Include a reset/try-again action.
- Avoid treating a simple distance check as professional handwriting assessment.

Suggested MVP implementation:
- SVG paths for a limited set of letters.
- Track pointer movement with Pointer Events.
- Compare pointer positions against a path or corridor around the path.
- Display progress feedback based on approximate path coverage.
- Handle pointer cancellation, leaving the activity, and resetting safely.
- Do not count a single click on the finish line as successful tracing.

For very young children, include offline suggestions such as tracing in sand, drawing with crayons, or practicing on paper with adult guidance.

### 5.3 Number Garden

MVP range: numbers 1–10, with a content structure that can later expand to 20.

Activities:
1. Recognize a numeral.
2. Count illustrated objects one by one.
3. Match quantity to numeral.
4. Put numerals in ascending order.
5. Compare groups as more/fewer/same where appropriate.

Example:
- Display five apples.
- Let the child tap each apple to count.
- Show a choice of numerals.
- On selection, highlight the five objects and numeral together.
- Audio: “Ada lima apel. Angka lima.”

Important:
- Ensure object count and answer choices are correct.
- Avoid ambiguous layouts that cause children to accidentally count the same object twice.
- Use touch-friendly spacing.
- Make visual and audio feedback reinforce quantity, not just the symbol.

### 5.4 English Corner

Beginner vocabulary themes:
- Animals: cat, dog, bird, fish.
- Colors: red, blue, yellow, green.
- Objects: book, ball, cup, bag.
- Food: apple, banana, bread.
- Numbers: one through ten.
- Simple phrases: “This is a cat.”, “It is red.”, “I see a ball.”

Activities:
1. Listen and find the picture.
2. Match word to illustration.
3. Repeat/listen to a word.
4. Choose the picture that matches a simple phrase.
5. Optional uppercase/lowercase word recognition.

Content rules:
- English instructions must be short.
- Indonesian can provide supporting instructions for the first activities.
- Use consistent, clear audio pronunciation.
- Do not pretend the app can evaluate a child’s spoken pronunciation unless speech recognition is actually implemented.
- Avoid mixing language goals confusingly within one activity.

### 5.5 Content data format

Store learning content separately from UI code. Example:

```json
{
  "id": "letter-a",
  "module": "reading",
  "type": "letter-match",
  "language": "id",
  "title": "Kenali huruf A",
  "instruction": "Ayo cari huruf A!",
  "target": "A",
  "choices": ["M", "A", "S"],
  "illustration": "/assets/illustrations/apple.svg",
  "word": "Apel",
  "audio": {
    "instruction": "/assets/audio/id/find-letter-a.mp3",
    "word": "/assets/audio/id/apel.mp3"
  },
  "difficulty": 1,
  "tags": ["letters", "recognition"]
}
```

This is an example schema, not a requirement to use exactly these fields. Define and validate a consistent TypeScript type for actual content.

---

## 6. Game Mechanics and Feedback

### 6.1 Game A — Match the Letter

Goal: recognize letter forms and associate them with a familiar word.

Flow:
1. Play or display the instruction: “Ayo cari huruf A!”
2. Show three large letter choices.
3. Child taps a choice.
4. If correct, show a gentle visual response and pronounce the letter/word.
5. If incorrect, offer a neutral hint and let the child try again.
6. Record the activity attempt and completion once the activity finishes.

Acceptance criteria:
- Choices are not duplicated.
- Correct answer is randomized only if randomization does not make testing flaky.
- Correct and incorrect responses are clearly distinguishable without relying only on color.
- The child can replay the instruction.
- The child can leave the activity without corrupting progress.

### 6.2 Game B — Trace & Write

Goal: practice fine-motor control and letter shapes.

Flow:
1. Show a large letter outline with a starting point.
2. Explain/show the direction.
3. Track the pointer or finger.
4. Provide gentle progress feedback.
5. If tracing is incomplete, show a hint.
6. On completion, offer a star/sticker for practice.
7. Allow retry without penalty.

Acceptance criteria:
- Works with touch and mouse.
- Uses pointer events and handles cancellation.
- Canvas/SVG scales responsively without distorting paths.
- The child can reset.
- A reasonable path tolerance is used.
- It is not marketed as accurate handwriting assessment.

### 6.3 Game C — Count the Objects

Goal: link a numeral to a quantity.

Flow:
1. Show a group of objects and a spoken prompt.
2. Let the child tap objects one by one.
3. Visually mark counted objects without hiding them.
4. Present a few numeral choices.
5. On correct selection, highlight the quantity and numeral together.
6. On incorrect selection, replay or demonstrate counting.

Acceptance criteria:
- The displayed count always matches the answer.
- Repeated taps do not count one object multiple times.
- Tapped objects remain distinguishable.
- Touch targets are sufficiently large.
- Audio and text do not contradict each other.

### 6.4 Game D — Listen & Find

Goal: build receptive English vocabulary.

Flow:
1. Play a word, e.g. “Cat”.
2. Show three illustrated options.
3. Child selects one.
4. Confirm with the word and image.
5. Offer replay and a next activity.

Acceptance criteria:
- Audio can be replayed.
- If audio is missing, a visible fallback is provided.
- No overlapping audio clips.
- Image alt text and accessible labels are provided where relevant.
- The app does not claim to evaluate pronunciation.

### 6.5 Rewards

- Award a star/sticker for completing or practicing an activity, not only for a perfect score.
- Avoid loss mechanics, countdown pressure, leaderboards, public profiles, and competitive streaks.
- Keep rewards modest and calm.
- Do not use rewards to encourage excessive screen time.
- Let children repeat activities freely.

---

## 7. Progress Tracking and Data Model

### 7.1 MVP persistence

Use `localStorage` or IndexedDB for local progress. Make the storage layer replaceable so it can be moved to a backend later.

Storage behavior:
- Save after a completed activity.
- Validate and version stored data.
- Handle unavailable/corrupted storage gracefully.
- Provide a reset flow with explicit confirmation.
- Do not store unnecessary personal information.
- Explain that local progress belongs to the current browser/device and may not sync elsewhere.

### 7.2 Example TypeScript types

```ts
export type LearningModule =
  | "reading"
  | "writing"
  | "numbers"
  | "english";

export type ActivityStatus =
  | "not-started"
  | "in-progress"
  | "practiced";

export interface ActivityProgress {
  activityId: string;
  module: LearningModule;
  status: ActivityStatus;
  attempts: number;
  completedCount: number;
  lastPracticedAt?: string;
}

export interface ChildProfile {
  id: string;
  nickname?: string;
  createdAt: string;
}

export interface AppSettings {
  audioEnabled: boolean;
  soundEffectsEnabled: boolean;
}

export interface LocalAppData {
  schemaVersion: number;
  profile: ChildProfile;
  settings: AppSettings;
  progress: ActivityProgress[];
  lastActivityId?: string;
}
```

Adapt the types to the final content model. Avoid storing detailed behavioral analytics unless needed for a clear educational purpose.

### 7.3 Progress labels

Use modest, transparent labels:
- **Belum dicoba**
- **Sedang berlatih**
- **Sudah berlatih**

Do not claim that a child has mastered a skill based on one response. If a “comfortable with this activity” label is introduced later, document the rule and treat it as an estimate rather than a developmental diagnosis.

---

## 8. Recommended Technical Stack

Preferred implementation:
- Next.js with App Router.
- TypeScript.
- Tailwind CSS 4, or CSS Modules if a simpler styling setup is preferred.
- React components for reusable activity UI.
- SVG for letter outlines and simple illustrations.
- Pointer Events for tracing interactions.
- HTML Audio API or standard audio elements for playback.
- JSON/TypeScript data files for initial learning content.
- localStorage or IndexedDB for MVP persistence.
- Optional PWA setup after the core application is stable.

### 8.1 Engineering principles

- Keep learning content separate from presentation.
- Build reusable components for instructions, audio controls, feedback, activity navigation, and completion.
- Use strict TypeScript types.
- Keep animations subtle and respect `prefers-reduced-motion`.
- Make touch input first-class.
- Provide keyboard focus states for parent-facing controls.
- Handle missing images/audio without crashing.
- Avoid adding dependencies unless they solve a real requirement.
- Avoid adding a backend before the MVP needs one.
- Keep code readable, maintainable, and split into sensible files.
- Use real interactions, not decorative buttons that do nothing.

### 8.2 Suggested project structure

```text
app/
  layout.tsx
  page.tsx
  learn/
    reading/page.tsx
    writing/page.tsx
    numbers/page.tsx
    english/page.tsx
  activity/[id]/page.tsx
  progress/page.tsx
  parent/page.tsx

components/
  layout/
    AppHeader.tsx
    ParentGate.tsx
    PageContainer.tsx
  home/
    WelcomeHero.tsx
    LearningModuleCard.tsx
    ContinueLearningCard.tsx
  learning/
    ActivityShell.tsx
    InstructionPanel.tsx
    AudioButton.tsx
    FeedbackMessage.tsx
    LetterMatcher.tsx
    TracingCanvas.tsx
    CountingGame.tsx
    WordMatcher.tsx
    CompletionPanel.tsx
  progress/
    ProgressSummary.tsx
    ActivityHistory.tsx

data/
  letters.json
  numbers.json
  vocabulary-id.json
  vocabulary-en.json

lib/
  activity-engine.ts
  audio.ts
  progress-storage.ts
  validation.ts

types/
  learning.ts
  progress.ts

public/
  assets/
    illustrations/
    audio/
```

Adjust the folder structure to the selected Next.js version and routing conventions. Do not create empty abstractions without a real use.

---

## 9. Accessibility, Privacy, and Child Safety

The application is for young children. Safety and accessibility are product requirements, not optional polish.

### 9.1 Child safety

- No advertisements.
- No third-party marketing trackers.
- No public profiles, chat, or social sharing.
- No external links that a child can easily open.
- Keep parent settings behind a parent gate.
- Ask for minimal personal data.
- Do not require an account for the initial local MVP.
- Do not collect recordings or microphone data.
- Do not use a camera or microphone without a clear, parent-facing explanation and explicit permission.
- Provide a clear privacy notice for parents.
- Do not include manipulative notifications, streak pressure, or excessive reward loops.

### 9.2 Accessibility

- Large touch targets.
- Clear labels and high text contrast.
- Never use color alone to indicate correct/incorrect states.
- Replayable audio and visible text instructions.
- Support keyboard access for parent-facing UI.
- Add useful accessible names to interactive controls.
- Respect reduced-motion preferences.
- Make layouts responsive.
- Ensure activities can be paused or exited without losing all progress.

### 9.3 Data protection

If the product later introduces accounts, cloud storage, analytics, or deployment for real families:
- Review applicable child privacy and data protection requirements.
- Obtain appropriate parental consent where required.
- Document data collected, purpose, retention, deletion, and access controls.
- Use secure authentication and authorization.
- Avoid collecting full birth dates, addresses, photos, voice recordings, or other sensitive details unless genuinely necessary.
- Never expose one child's progress to another family.
- Provide a clear deletion mechanism.

This specification is not legal advice; review requirements for the countries in which the app will be offered.

---

## 10. Four-Week MVP Plan

The following is an initial estimate for one developer, assuming a limited content set and available assets. Adjust based on scope and testing.

### Week 1 — Foundation and design

Deliverables:
- Set up the app and styling system.
- Define design tokens, typography, buttons, cards, and spacing.
- Build Welcome and Home Dashboard.
- Build navigation for the four modules.
- Make layouts responsive for tablet, mobile, and desktop.

Definition of done:
- All module cards navigate correctly.
- Main screens work at common viewport sizes.
- Controls have visible focus and pressed states.
- No dead-end navigation.

### Week 2 — Core learning activities

Deliverables:
- Letter matching.
- Basic tracing activity for a small set of letters.
- Counting objects 1–10.
- English picture-word matching.
- Shared activity shell and feedback components.
- Initial content data.

Definition of done:
- Each of the four modules contains at least one fully playable activity.
- Instructions are understandable and short.
- Touch and mouse interactions work.
- Wrong answers allow retry without punishment.

### Week 3 — Audio, rewards, and progress

Deliverables:
- Audio playback and replay controls.
- Gentle completion feedback and rewards.
- Local progress storage.
- Resume last activity.
- Parent Corner and progress overview.
- Reset progress with confirmation.

Definition of done:
- Completed activities persist after refresh.
- Missing audio does not break the activity.
- Audio does not overlap unexpectedly.
- Reset behavior is clear and reliable.
- Stored data is validated and versioned.

### Week 4 — Testing and polish

Deliverables:
- Test with a small number of families or educators with appropriate permission.
- Review child usability and parent feedback.
- Fix touch, layout, audio, and progress bugs.
- Review accessibility and privacy.
- Prepare a simple deployment and usage guide.

Definition of done:
- No known critical bugs in the core activity flows.
- Core activities are usable on tablet and mobile.
- Parent settings are not easily opened by accidental child taps.
- Privacy and data behavior are explained.
- Deployment instructions are documented.

---

## 11. MVP Acceptance Checklist

### Navigation and UI
- [ ] Welcome screen opens correctly.
- [ ] Home displays four learning areas.
- [ ] All module cards navigate to the correct module.
- [ ] Back and home controls work consistently.
- [ ] Layout works in portrait and landscape.
- [ ] Touch targets are large and easy to use.

### Reading
- [ ] Letter choices are valid and not duplicated.
- [ ] Correct answers receive specific positive feedback.
- [ ] Incorrect answers can be retried.
- [ ] Audio can be replayed where provided.

### Writing
- [ ] Tracing works with touch and mouse.
- [ ] Tracing paths scale without distortion.
- [ ] Reset clears the current attempt.
- [ ] Incomplete tracing does not falsely count as complete.
- [ ] Feedback is encouraging and does not claim professional assessment.

### Numbers
- [ ] Displayed objects match the intended quantity.
- [ ] Each object is counted only once per attempt.
- [ ] Numeral choices and correct answer are valid.
- [ ] Quantity and numeral are reinforced together.

### English
- [ ] Vocabulary matches the selected illustration.
- [ ] Audio can be replayed.
- [ ] Missing audio has a graceful fallback.
- [ ] No pronunciation assessment is claimed unless implemented.

### Progress and parent controls
- [ ] Progress persists after refresh.
- [ ] Last activity can be resumed.
- [ ] Parent Corner has a parent gate.
- [ ] Reset requires confirmation.
- [ ] Local data limitations are explained.

### Safety and quality
- [ ] No ads or marketing trackers.
- [ ] No unnecessary child personal data is collected.
- [ ] Reduced motion is respected.
- [ ] Controls have accessible labels.
- [ ] No visible button is non-functional.
- [ ] No fake success state is shown when an action fails.

---

## 12. Suggested Future Roadmap

Only consider these after the MVP has been tested and the core learning experience works well.

### Version 1.1
- Expand the Indonesian reading content.
- Add more letter tracing paths.
- Expand English vocabulary themes.
- Add printable worksheets for offline practice.
- Improve parent progress summaries.

### Version 1.2
- Add a guided activity recommendation based on practice history.
- Add optional multiple local profiles.
- Add PWA installation and offline caching for approved assets.
- Add simple downloadable progress summaries for parents.

### Version 2.0
- Optional parent accounts and secure cloud sync.
- More detailed educator view.
- Additional languages.
- More advanced accessibility options.
- Carefully evaluated handwriting support, if it provides real value.

Do not add AI, speech recognition, or cloud profiles solely to make the product seem more advanced. Add them only when there is a validated user need and a clear privacy approach.

---

# 13. Prompt for Claude — Build the Application

Copy the prompt below into Claude Code or a Claude coding session along with this Markdown specification.

---

## Claude Implementation Prompt

You are a senior product designer and full-stack frontend engineer. Build **Little Learners**, a polished Montessori-inspired educational web application for children aged 4–6, following the complete product specification in this document.

### Primary objective

Deliver a **working, responsive, interactive MVP**, not just a visual mockup. The app must contain four usable learning modules:

1. Indonesian early reading.
2. Pre-writing and letter tracing.
3. Number recognition and counting.
4. Beginner English vocabulary.

Also implement a home dashboard, activity completion screens, local progress persistence, and a protected Parent Corner.

### Before coding

1. Inspect the existing repository and identify the framework, package manager, routing setup, and existing conventions.
2. If this is an existing project, preserve useful code and do not overwrite unrelated work.
3. If the repository is empty, initialize a suitable Next.js + TypeScript application using the package manager and versions available in the environment.
4. Use Tailwind CSS 4 if it is already configured or can be configured cleanly. Do not assume Tailwind 4 uses `tailwind.config.js`; follow the installed version's setup.
5. Briefly state the implementation plan, then start building. Do not stop after giving a plan.
6. If an essential requirement is unclear, make a reasonable, conservative decision and document it rather than blocking all progress.

### Visual requirements

- Natural Montessori-inspired design.
- Warm cream background, sage green, beige, soft terracotta, muted yellow, and soft blue accents.
- Friendly, legible typography.
- Generous whitespace and rounded cards.
- Large child-friendly touch targets.
- Simple, consistent illustrations.
- Subtle transitions only.
- Responsive layouts for mobile, tablet, and desktop.
- Calm and educational rather than arcade-like.
- Avoid generic dashboard clutter, excessive gradients, excessive shadows, and dense text.
- Keep CSS readable and maintainable.

Suggested design tokens:

```css
:root {
  --color-cream: #FAF7F0;
  --color-sage: #DDE7D5;
  --color-sage-dark: #405641;
  --color-terracotta: #D58C70;
  --color-beige: #E9DDC9;
  --color-sky: #DCEAF3;
  --color-yellow: #F3E6B5;
  --color-text: #343A34;
  --color-muted: #73796F;
  --color-surface: #FFFFFF;
}
```

Adapt tokens to the existing styling system if necessary.

### Required routes/screens

- `/` — welcome and home entry.
- `/learn/reading` — reading module.
- `/learn/writing` — writing module.
- `/learn/numbers` — numbers module.
- `/learn/english` — English module.
- `/activity/[id]` — reusable activity route if appropriate for the architecture.
- `/progress` — parent-facing progress summary.
- `/parent` — parent settings and privacy information.

You may adjust routing if a simpler, coherent architecture is more appropriate, but every required user flow must be accessible.

### Required interactions

**Home**
- Four large module cards.
- A continue-learning card when there is a recent activity.
- Friendly greeting.
- Clear navigation.

**Reading**
- Implement a working letter-to-picture or letter-choice activity.
- Include correct and incorrect answer states.
- Include retry behavior.
- Use actual content data, not hard-coded decorative controls.

**Writing**
- Implement an interactive tracing activity using SVG or Canvas.
- Support pointer/touch and mouse.
- Provide start-point and directional cues.
- Show progress feedback and allow reset.
- Use reasonable tolerance and avoid falsely completing an untouched trace.
- Clearly treat the result as practice feedback, not a professional handwriting evaluation.

**Numbers**
- Implement an interactive object-counting activity.
- Prevent repeated taps from incrementing the count for the same object.
- Connect the object quantity to the numeral answer.

**English**
- Implement picture-word matching.
- Include audio controls when valid assets are available.
- If audio assets are missing, provide a graceful fallback and never pretend audio played.

**Progress**
- Persist activity progress locally.
- Show a simple activity summary and recent practice.
- Resume the last activity where possible.
- Validate stored data and handle corrupted or unavailable local storage.

**Parent Corner**
- Include a simple parent gate.
- Provide audio settings, progress access, privacy information, and reset-progress confirmation.
- Do not collect unnecessary personal information.

### Engineering requirements

- Use TypeScript types for modules, activities, and progress.
- Separate learning content from UI components.
- Create reusable components for activity instructions, audio, feedback, navigation, and completion.
- Keep state transitions predictable.
- Prevent duplicate progress updates from repeated events or React development behavior.
- Handle empty content, missing images, missing audio, and storage errors.
- Respect reduced-motion preferences.
- Use accessible labels and focus states.
- Do not add a backend unless it is needed for the existing project.
- Do not add third-party analytics or advertising.
- Do not use external assets with uncertain licensing. Prefer original SVG illustrations, CSS illustrations, or clearly licensed assets.
- Do not leave buttons that look functional but do nothing.
- Do not substitute a static screenshot for the working app.

### Content requirements

Start with a small but complete sample set:
- A selection of Indonesian letters and familiar words.
- A few tracing paths.
- Numbers 1–10.
- At least 8–12 beginner English vocabulary items across simple themes.

Keep content in JSON or typed data structures. Ensure answer keys, audio paths, image paths, and quantities are consistent.

### Quality and testing

After implementation:
1. Run the project's available lint, type-check, and build commands.
2. Fix errors caused by the implementation.
3. Test the primary user flows and all major interactions.
4. Test responsive layouts at mobile and tablet widths.
5. Verify that progress survives refresh.
6. Verify that reset progress requires confirmation.
7. Verify that tracing can be reset and does not complete on a single click.
8. Report any tests that could not be run and why.

Do not claim tests passed unless they were actually run.

### Implementation approach

Work in small, coherent steps:
1. Establish or inspect the app foundation.
2. Implement the design system and navigation.
3. Implement the shared activity shell.
4. Implement the four learning activities.
5. Implement audio and local progress.
6. Implement parent controls.
7. Run checks and fix issues.
8. Summarize the files created, features implemented, commands run, and remaining limitations.

**Start by inspecting the repository, then build the app. Do not return only a tutorial, wireframe description, or implementation plan.**

---

## 14. How to Use This File with Claude

1. Save this document as `LITTLE_LEARNERS_SPEC.md` in your project folder.
2. Open that folder in Claude Code, or attach the file to a Claude conversation that supports project files.
3. Paste the **Claude Implementation Prompt** from Section 13.
4. Ask Claude to inspect the repository and implement the MVP in small, testable steps.
5. Run the app locally and test the four learning modules on a touch-capable device.
6. Review the code and test the parent/privacy controls before using it with children.

### Important delivery expectation

A Markdown specification describes what should be built; it is not itself the running application. Claude still needs to create the project files, install any required dependencies, and run the application in the target environment.
