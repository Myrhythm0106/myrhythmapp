Plan to fix the prototype flow and landing page:

1. Add the missing assessment before capture
- Create a new `/prototype/assessment` step and make the landing CTA go there instead of directly to `/prototype/capture`.
- Add “Assessment” into the prototype progress header so the visible flow becomes:

```text
Assessment -> Capture -> Review -> Calendar -> Reminders -> Done
```

- Keep it quick and brain-friendly: one question per screen, maximum 3 answer choices, 56px+ touch targets.

2. Make the questions identify the person and branch appropriately
- Start with a persona-identifying question such as:
  - “I’m rebuilding after a brain health event or injury”
  - “I’m managing daily cognitive load, focus, or fatigue”
  - “I’m supporting someone else”
- Then ask a tailored micro-set based on that answer. Each branch will capture:
  - what feels hardest right now
  - what support style they need
  - their best/most productive time of day
  - their lower-energy time to avoid
  - whether they need reminders, accountability, or shared support
- Wording will stay empowering and non-diagnostic. Include the required disclaimer that MyRhythm does not diagnose, treat, or cure conditions.

3. Store assessment answers in the prototype session
- Extend `src/prototype/prototypeStore.ts` with a lightweight `PrototypeAssessmentProfile`.
- Store persona, cognitive-load pattern, best focus window, low-energy window, reminder style, support preference, and recommended next step.
- Replace the current hardcoded schedule note “peak 09:00–11:00...” with the actual assessment-derived profile.

4. Correlate assessment -> capture -> calendar
- Update `autoScheduleActs()` so action placement uses the assessment profile:
  - cognitively heavy/high-priority tasks go into the user’s best productive window
  - low-priority/admin tasks go into lighter windows
  - low-energy periods are avoided
  - support/caregiver tasks suggest inviting the right person
- Update the “How this was decided” section to explicitly show the chain:

```text
Your assessment -> your best brain-health window -> available calendar space -> action priority
```

5. Bring in the richer MVP-style landing page
- Rework `src/pages/prototype/PrototypeLanding.tsx` to feel closer to the previous MVP landing page: stronger visual hierarchy, warmer empowerment copy, richer sections, and more immediate value.
- Keep the title: “Think clearly. Live fully.”
- Add instantly engaging sections:
  - a high-impact hero with CTA: “Start my rhythm check”
  - 3 pain-to-relief cards: forgetting conversations, overwhelm, missed follow-through
  - data/value tiles showing what the prototype will demonstrate, e.g. “90-second rhythm check”, “actions extracted automatically”, “scheduled around your best time”, “support people invited when helpful”
  - 4C loop cards: Capture, Commit, Calibrate, Celebrate
  - a mini calendar preview showing Vision -> week -> day -> action
- Avoid unverifiable medical claims; use product demonstration data and benefit framing instead.

6. Use the calendar with vision included
- Rename the prototype schedule step visually from “Schedule” to “Calendar”.
- Add a vision strip/calendar context to the schedule page so users see the same concept from the MVP/launch calendar:

```text
Vision: Live with more ease and follow-through
This week: Protect energy and complete the essentials
Today: 2 high-priority actions placed in best-focus windows
```

- Keep the current scheduling controls, but make it feel like MyRhythm’s calendar, not a generic slot picker.

7. Routing and acceptance criteria
- Add route: `/prototype/assessment`.
- Landing CTA opens assessment.
- Assessment completion opens capture.
- Capture/review/schedule uses the saved assessment profile.
- Calendar explanation reflects the user’s selected best time and low-energy time.
- Landing page feels visually closer to the earlier MVP page while preserving the prototype route tree and no-medical-claims policy.