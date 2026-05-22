# Plan v7.12 — SMART Context Presets, brain-health aware, assistant-quiet

## Two non-negotiables (from user)
1. **MYRHYTHM brain-health intake runs first.** Every downstream suggestion (ACT type, owner, time, invitees) is filtered through the user's energy profile from the 8-question MYRHYTHM assessment (Phase A of v7.11). No context preset overrides energy fit.
2. **The assistant stays invisible.** No "pick a mode", no "choose a template", no settings screens, no jargon. The user records. We infer. We propose one obvious next tap. Everything clever happens behind a single confirm.

So the v7.12 SMART context work is **inferred, not asked**. The capture screen does not grow a chip row.

## Flow (unchanged surface, smarter brain)

```
/prototype/welcome
   → /prototype/rhythm        (8-question MYRHYTHM, ~90s, once)
   → /prototype/capture       (one big record button, nothing else)
   → /prototype/review        (context inferred, ACTs already shaped)
   → /prototype/schedule      (one tap: "Looks good, send invites")
   → /prototype/done
```

## How context is inferred (silently)

After transcription, before extraction, a lightweight classifier runs on the transcript inside `prototype-extract-acts`:
- Medical vocabulary (mg, dose, scan, referral, follow-up, Dr / Doctor / Nurse / GP / consultant) → **doctor visit**
- Family-name density + home vocabulary (school, dinner, weekend, mum/dad/son/daughter) → **family meeting**
- Project / deliverable / deadline / client / Q3 → **work call**
- Feelings vocabulary + first-person dominance + therapist name → **therapy**
- Otherwise → **general**

The inferred context is shown as a small, non-blocking pill at the top of `/prototype/review`:

```
Looks like a doctor visit · not right? change ▾
```

One tap to override, never required. This is the only surfacing of the preset — the rest is just better defaults on the cards the user already expects.

## Brain-health filter sits above context

Every ACT, regardless of inferred context, is scored for cognitive load (high / medium / low) and routed by the v7.11 `autoScheduleActs()`:
- High-load medical follow-ups → MYRHYTHM **peak window**
- Medication reminders, simple admin → **low-load window**
- Family / social ACTs → **social window**

If the user's MYRHYTHM profile says they have **no peak window today** (low energy day flag from the intake), the schedule screen quietly defers non-urgent ACTs to tomorrow and says:

```
Today's a lower-energy day. I've kept the urgent one and
moved the other 3 to tomorrow morning when you tend to focus best.
```

That single sentence is the entire visible expression of "we used your brain-health data". No charts, no scores, no MYRHYTHM letters shown to the user mid-flow.

## What changes per inferred context (silently, on the review card)

All context-specific behaviour is **defaults**, never new questions:

| Inferred | Owner default | Auto-invitees | ACT shape |
|---|---|---|---|
| Doctor visit | Named clinician if detected, else "me" | GP + caregiver pre-ticked for medication ACTs only | Adds clinician name + type chip (Medication / Follow-up / Test / Referral / Question) |
| Family meeting | Named family member | Everyone named in transcript | Standard ACT, owner chip prominent |
| Work call | Named colleague or "me" | None auto-added | Optional project tag |
| Therapy | "me" | None — privacy on | Homework vs reflection split |
| General | "me" | None | Today's card, untouched |

Each card still has Confirm / Edit / Reject. The extra fields are visible but pre-filled — the user only touches them if something is wrong.

## Files

- **Edit** `supabase/functions/prototype-extract-acts/index.ts` — add a `classifyContext(transcript)` helper that returns `{ contextId, confidence }`; include it in the response. Inject a context-specific addendum into the extraction prompt so the model fills `actType`, `clinician`, `shareWith` where relevant.
- **New** `src/prototype/prototypeContexts.ts` — `CONTEXTS` config: id, label, defaultShareWith, actCardExtras. No UI strings the user sees during recording — only on the review card.
- **Edit** `src/prototype/prototypeStore.ts` — extend `PrototypeAct` with optional `actType`, `clinician`, `shareWith: string[]`, `cognitiveLoad`, `contextId`. Add `applyContextDefaults()` and feed `cognitiveLoad` into the existing `autoScheduleActs()` (v7.11 Phase C).
- **Edit** `src/pages/prototype/PrototypeReview.tsx` — render the inferred-context pill at the top with a one-tap override sheet; render the small extra rows on each card when `contextId !== 'general'`. No new screen, no new step.
- **Edit** `src/pages/prototype/PrototypeSchedule.tsx` — read `shareWith`, render invitee chips, render the "lower-energy day" sentence when MYRHYTHM profile flags it. ICS dispatch via existing `src/utils/ics.ts` and `send-invitation-email`.
- **Do not touch** `src/pages/prototype/PrototypeCapture.tsx`. Capture screen stays one button.

## Out of scope
- No context picker UI, no settings screen, no "modes".
- No new edge functions, no schema changes, no new tables.
- No EHR / FHIR / real medical data. Clinician matching is name-only against `prototypeContacts`.
- No changes to `/launch/*`, auth, Support Circle, or pricing.
- MYRHYTHM intake itself, rewind buffer, and wake word stay scheduled per v7.11 Phases A and D — unchanged here.

## Acceptance
1. Recording a doctor-visit transcript with "Dr Patel said start metformin 500mg and book a follow-up in 6 weeks" produces, with **zero extra taps before recording**, two ACTs on review: one tagged Medication change with pharmacy + caregiver pre-ticked, one Follow-up appointment with Dr Patel as clinician. The inferred-context pill reads "Looks like a doctor visit" and is one tap to change.
2. Recording a casual family transcript produces general/family-shaped ACTs with no medical fields visible.
3. On a low-energy MYRHYTHM day, `/prototype/schedule` shows the single "Today's a lower-energy day…" sentence and defers non-urgent ACTs to tomorrow's peak window.
4. The capture screen still shows one record button and nothing else.
5. Confirming dispatch produces one `.ics` per ACT with the right `ATTENDEE` lines for every invitee with an email.

## Build order
1. `classifyContext` + extraction prompt addenda in the edge function (no UI change, testable from existing flow).
2. `prototypeContexts.ts` + ACT card extras + inferred-context pill on review.
3. `cognitiveLoad` field + low-energy-day sentence on schedule; wire invitees into ICS.
