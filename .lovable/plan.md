# v0.1 Plan — Freemium Reveal + Memory Bridge SMARTness + Clinician PDF

## Goals
1. Make the free assessment teaser feel generous and specific, not withholding.
2. Make Memory Bridge the clearest, easiest capture-to-action flow in the category.
3. Repackage capture output into a one-page clinician format that proves the Clinical-Ready vs Life-Ready Gap.

## Out of scope for this plan
- "Bring a witness" live/async co-listen (flagged for v0.2; saved to memory).
- New backend tables or realtime plumbing beyond existing schema.
- Changes to `/launch/payment` pricing logic.
- Radar/spider chart toggle for MYRHYTHM snapshot.

---

## 1. Revised freemium reveal on `/launch/welcome`

### Current state
- `LaunchWelcome.tsx` shows the 8-letter MYRHYTHM bar chart with a `/100` score and band label.
- `MyRhythmLetterBar.tsx` opens a dialog with a free band-summary paragraph and a frosted/blurred premium section.
- The "focus this week" card and guide ticks are already in place.

### Changes

#### A. Replace the frosted blur with a structured teaser
In `MyRhythmLetterBar.tsx`:
- Remove the blurred overlay pattern.
- The free tier shows:
  - Letter + word + band score.
  - The band meaning paragraph (already free).
  - A new **persona-specific line** drawn from `usePersona` / `mapToPersona`, e.g. for recovery: "This matters for your rhythm because clear windows can shift after a brain injury." (copy to be added per persona).
  - The **headings** of the locked personal read, with placeholder copy that proves specificity:
    - "Your pattern"
    - "What's driving your score"
    - "Your first move this week"
- The premium section is not blurred; instead, each heading shows a one-line teaser like "Based on your answers and your [persona context], this is personal to you." and a lock chip + CTA.
- CTA button copy changes from generic "Unlock full plan" to **"Become a Founding Member — £{price}/mo"** when `isFoundingMemberActive()` is true, matching the locked landing CTA rule.

#### B. Hero refinements (keep existing, tighten)
- Keep guide ticks, `/3` labels, band label, and "focus this week" card.
- Ensure the "focus this week" card shows the **lowest facet word** and a specific teaser: "Your personalized 3-step raise-it plan is behind the paywall."
- Keep the primary CTA as "Register & Unlock Your Plan" but align secondary copy with Founding Member framing.

#### C. Add persona-specific free teaser line
- Add a small helper in `src/launch/persona/copy.ts` or a new `src/launch/persona/snapshotTeasers.ts` that returns one sentence per `Persona` per `LetterId`.
- Wire it into `MyRhythmLetterBar` so the free tier always includes one line that competitors cannot copy.

### Files touched
- `src/components/launch/MyRhythmLetterBar.tsx`
- `src/pages/launch/LaunchWelcome.tsx`
- `src/launch/persona/copy.ts` (or new `snapshotTeasers.ts`)

---

## 2. Memory Bridge v0.1 upgrades — pre-capture context, "So what?" card, two-minute starter

### 2.1 Pre-capture one-tap context

#### Current state
- `MeetingSetupDialog.tsx` opens with empty fields for title, participants, context, location, energy, emotional context.

#### Changes
In `MeetingSetupDialog.tsx` and a new helper `src/components/memoryBridge/capture-brief/model/suggestSetup.ts`:
- Auto-suggest the **title** from the user's next calendar event in the next 2 hours (if calendar integration exists), or from recent recording titles.
- Auto-suggest **participants** from:
  - The Support Circle.
  - People mentioned in the last 2 recordings with the same title pattern.
- Auto-suggest **context** from a one-line template based on meeting type + persona + last recording topic.
- Surface these as **chips above the form**, not pre-filled inputs. One tap applies the suggestion. This keeps the form fast while making the AI output 3× more relevant.
- Energy level defaults to the most recent Energy Check if today, otherwise stays at 5.

### 2.2 "So what?" lead card in Capture Brief

#### Current state
- `CaptureBriefPreview.tsx` opens with a cover, stats, and an "Executive summary" section.

#### Changes
- Add a new "So what?" card immediately below the stats row (always visible, even when summary is toggled off):
  - **The one thing to remember** — one sentence, derived from the executive summary or the highest-confidence action.
  - **The one action to take** — top-priority action with owner and due.
  - **One watch-out** — from open questions or low-confidence actions.
  - **One person to loop in** — from `supportMembers` or `people` on the top action.
- Keep the existing sections; this card is a lead, not a replacement.

### 2.3 Surface `two_minute_starter` on every action

#### Current state
- `BriefAction` does not currently carry `two_minute_starter`. The database field exists on `extracted_actions` (`two_minute_starter`).
- `SmartCommitSlot.tsx` shows scheduling suggestions but not the starter.

#### Changes
- Update `buildCaptureBrief.ts` to map `two_minute_starter` from `extracted_actions` into `BriefAction`.
- Update `SmartCommitSlot.tsx` to show the starter as a small card below the action text:
  - Label: "2-minute starter"
  - The starter text.
  - A "Start now" button that marks the action as `in_progress`.
- Update the PDF and DOCX exporters to include the starter in the action register.

### Files touched
- `src/components/memoryBridge/MeetingSetupDialog.tsx`
- `src/components/memoryBridge/capture-brief/model/suggestSetup.ts` (new)
- `src/components/memoryBridge/capture-brief/CaptureBriefPreview.tsx`
- `src/components/memoryBridge/capture-brief/SmartCommitSlot.tsx`
- `src/components/memoryBridge/capture-brief/model/buildCaptureBrief.ts`
- `src/components/memoryBridge/capture-brief/model/types.ts`
- `src/components/memoryBridge/capture-brief/exporters/pdf.ts`
- `src/components/memoryBridge/capture-brief/exporters/docx.ts`

---

## 3. Clinician one-page PDF redesign

### Current state
- `exporters/pdf.ts` produces a multi-page Capture Brief with executive summary, action register, decisions, questions, and optional transcript.
- Clinicians rarely need all of that; they need symptoms, commitments, and red flags.

### Changes
- Add a new export option/kind: `clinician`.
- In `CaptureDeliverableView.tsx`, add a fourth export button: **"Clinician summary (PDF)"**.
- Create `src/components/memoryBridge/capture-brief/exporters/clinicianPdf.ts`:
  - One page, A4.
  - Header: patient identifier (first name only + date), MyRhythm logo line, confidentiality footer.
  - Three sections:
    1. **Symptoms / concerns mentioned** — extracted from transcript via keyword/heuristic list (fatigue, headache, confusion, anxiety, sleep, etc.) plus source quotes.
    2. **Commitments made / actions agreed** — top actions with owner, due, and confidence.
    3. **Red flags / open questions** — unresolved questions plus any explicitly urgent language.
  - Footer: "MyRhythm · Confidential — Not medical advice. v0.1 Founding Edition."
- Reuse existing `buildCaptureBrief` output; no new AI call needed for v0.1. Use simple keyword matching for symptoms.

### Files touched
- `src/components/memoryBridge/capture-brief/CaptureDeliverableView.tsx`
- `src/components/memoryBridge/capture-brief/exporters/clinicianPdf.ts` (new)
- `src/components/memoryBridge/capture-brief/exporters/pdf.ts` (minor, if shared helpers)

---

## Acceptance criteria

### Freemium reveal
- [ ] Tapping a letter opens a dialog with free band summary + persona line + structured premium teaser (no blur).
- [ ] Premium CTA reads "Become a Founding Member — £{price}/mo" during founding period.
- [ ] "Focus this week" card still surfaces the lowest facet with unlock CTA.

### Memory Bridge
- [ ] Meeting setup dialog shows suggestion chips for title, participants, and context when data is available.
- [ ] Capture Brief preview shows a "So what?" card with one remember/action/watch-out/person.
- [ ] Each action card shows a "2-minute starter" when the field is populated.

### Clinician PDF
- [ ] A "Clinician summary (PDF)" button exists in Capture Deliverable view.
- [ ] Exported PDF is one page with symptoms, commitments, and red flags sections.
- [ ] Footer contains the required confidentiality / not-medical-advice disclaimer.

---

## Technical notes
- No new Supabase migrations required; all data fields already exist.
- `two_minute_starter` may be null for older recordings; UI handles missing gracefully.
- Persona teaser copy should be short (< 120 chars) and avoid medical claims.
- Keep all primary tap targets ≥ 56px and max 3 primary choices per screen per existing design rules.
