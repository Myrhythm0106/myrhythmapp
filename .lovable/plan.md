# Plan v6.1 — Vision Statement (the "5 Fs")

## Goal
Give the user one quiet, McKinsey-grade place to articulate their **ultimate vision** — a single, personal paragraph — guided by light prompts across five life domains. No checklists, no patronising copy, no overwhelm. Just enough scaffolding to spark thought.

## The "5 Fs" framing
The classic five (we use the warm, secular-friendly set; user can rename any of them):

1. **Family** — the people closest to you
2. **Friends** — the wider circle who lifts you
3. **Fitness** — body, energy, brain health
4. **Finances** — security and freedom
5. **Future** — purpose, contribution, the legacy you'd be proud of

(The fifth "F" you were searching for is most often **Future**, sometimes **Faith** or **Fulfilment** — we offer all three as an editable label so the user picks what fits.)

## What the user sees

Route: **`/launch/vision-statement`** (new, linked from the Vision Board page and the Goals page sidebar).

Single scrollable page, three light sections:

### 1. Hero — `CapabilityHero`
- Eyebrow: `VISION`
- H1: *"Your ultimate vision, in your own words."*
- Lede: *"One short paragraph. Five gentle prompts. No right answer — just the one that feels true today."*
- Icon: `Compass` (brand-teal tone)
- Status pill: *"Private · Editable any time"*

### 2. The Five Prompts — five stacked, collapsible cards
Each card uses the existing `IconBadge` + a single open question + 2–3 *thought-starter chips* (not answers — sparks). Tapping a chip pre-fills a sentence stem the user can rewrite. Free-text area, ~280 char soft limit, no required fields.

| F | Icon | Question | Sample sparks (≤3) |
|---|---|---|---|
| Family | `Users` | *"Who do you want to be for the people closest to you?"* | "Present at dinner", "Patient on hard days", "The one who listens" |
| Friends | `HeartHandshake` | *"What kind of friend do you want to be — and to be near?"* | "Easy to call", "Quietly loyal", "First to show up" |
| Fitness | `Activity` | *"How do you want your body and brain to feel a year from now?"* | "Steady energy", "Sleep that restores", "Strong enough to keep up" |
| Finances | `TrendingUp` | *"What would 'enough' look like — and what would it free you to do?"* | "No quiet money worry", "Choices, not pressure", "Generous without strain" |
| Future (editable label → Faith / Fulfilment / Purpose) | `Compass` | *"When you look back in ten years, what would make you proud?"* | "I kept showing up", "I left things better", "I lived on purpose" |

Each card collapses to a single line once written, showing the first ~80 chars — so the page stays calm.

### 3. The Statement — `VisionStatementComposer`
A single textarea pre-seeded by stitching the five answers into one paragraph (only the F's the user filled in — never patronising blanks). Editable. Below it:
- **Save** (solid `brand-teal-600`)
- **Read aloud** (ghost, reuses existing `speechSynthesis` util)
- **Export as wallpaper** (reuses `ShareVisionBoard` 9:16 export)
- Last-saved timestamp (anchored to 28 April 2026 in demo mode)

Persistence: `localStorage` key `myrhythm.visionStatement.v1` for now (matches current vision board pattern; no backend changes).

## Tone & guard-rails
- No medical claims, no "fix", no "transform your life".
- No emojis in copy. Lucide icons only.
- Max 3 sparks per prompt (per Core memory).
- Sparks are *stems*, not finished sentences — they invite editing.
- One soft disclaimer at the foot: *"This is yours. Nothing here is shared, scored, or judged."*

## Files

**New**
- `src/pages/launch/LaunchVisionStatement.tsx` — page shell using `LaunchLayout` + `CapabilityHero`
- `src/components/launch/vision/FivePromptCard.tsx` — one collapsible prompt card
- `src/components/launch/vision/VisionStatementComposer.tsx` — stitch + edit + save
- `src/data/fivePrompts.ts` — the five F definitions (label, icon, question, sparks, editable label options for the 5th)

**Edited**
- `src/App.tsx` — add `/launch/vision-statement` route
- `src/pages/launch/index.ts` — export `LaunchVisionStatement`
- `src/components/launch/LaunchNav.tsx` — add a Vision link (or surface from the existing Vision Board page header — see Open question)
- `src/pages/launch/LaunchGoals.tsx` — small "Start with a vision" link card pointing to the new page
- `src/components/launch/vision/VisionBoardHeader.tsx` — add a quiet "Write vision statement" secondary action

No backend, no schema, no business-logic changes. Pure presentation + localStorage.

## Verification
- Visual pass at 1430px and 375px.
- `rg "from-.*-500 to-.*-500"` returns 0 hits in the new files.
- No emojis in the new files.
- Tab order: prompt 1 → 5 → composer → Save.

## Open question (one)
**Where should the entry point live?** Three options:
- **A.** Add a new "Vision" tab in `LaunchNav` (most discoverable, costs one nav slot).
- **B.** Surface only inside the existing Vision Board page header (keeps nav clean).
- **C.** Both — nav tab + Vision Board entry.

I'll default to **B** unless you say otherwise.
