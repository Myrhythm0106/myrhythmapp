# MyRhythm: Heart and MVP presentation

A 12-slide deck that tells the story in Annabel's voice (British English, warm, no hype, no medical claims), shown in the app at a new open link `/mvp-deck`, alongside the existing investor decks. Presentable full screen, swipeable on a phone, and exportable to PDF.

## Story (one idea per slide)
1. Title: MyRhythm. Memory-First Design™. The North Point, verbatim.
2. The problem: remembering, not failure. Confidence knocked, feeling unreliable, alone.
3. Three failures: Discharge Cliff, Clinical-Ready vs Life-Ready Gap, Ideal-Brain Assumption.
4. Who it serves: brain injury survivors, caregivers, returning professionals, stress and overwhelm, ADHD and focus.
5. The promise: "Captures it. Plans it. Keeps it. Follows it through. You stay in control."
6. MVP feature 1, Capture: one-tap recording or upload (Memory Bridge), consent line.
7. MVP feature 2, Confirm: summary plus Agreed / Guidance / Suggestions, nothing scheduled without a choice.
8. MVP feature 3, Commit: actions placed in the diary at the person's best times, reminders attached.
9. MVP feature 4, Follow through: get-ready prompt, Done / Snooze / Let go, one gentle follow-up, Still open at 18:00, closed loop with Undo.
10. MVP feature 5, No one walks alone: Support Circle with permission levels, private stays private, off switch.
11. What is in the MVP and what waits: in v0.1 vs later (watch app, discharge plan, Bring a Witness).
12. Close: the five feelings (reliable, trustworthy, confident, independent, follow-through) and the North Point.

## Look
Existing brand colours (orange, purple, teal, emerald), dark title and closing slides, light content slides, landing photos reused, one repeated motif: rounded glass cards.

## Technical details
- New page `src/pages/MvpDeckPage.tsx` with slide components at 1920x1080 scaled to fit; arrow keys, swipe, full screen, `?slide=N`, `?print` for PDF.
- Add `/mvp-deck` route in `App.tsx` and the public allowlist in `publicPaths.ts` (plus its test), matching the investor decks.
- No numbers invented; pricing uses the locked ladder only.

## Optional ideas
- A PowerPoint (.pptx) copy for sharing by email.
