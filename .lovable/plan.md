

# Where "Block Unavailable Days + Optimal Scheduling" Fits in the Plan

## What Already Exists

The codebase has the building blocks but they're not fully connected:

- **MYRHYTHM Assessment** (`myrhythmQuestions.ts`) — 7 letters (M-Y-R-H-Y-T-H-M) covering cognitive patterns, energy, recovery, motivation
- **SmartScheduler** (`src/utils/smartScheduler.ts`) — already reads `assessment_results` and maps responses to productive hours, energy peaks, and do-not-disturb windows
- **useSchedulePreferences** hook — reads/writes `user_schedule_preferences` table with time slots and energy levels
- **No UI exists** for blocking out unavailable days/times or visually configuring availability

## What's Missing

1. **Availability Blocker UI** — a visual calendar/weekly grid where users mark days/times as unavailable (medical appointments, rest days, caregiver commitments)
2. **Assessment → Schedule Pipeline** — the MYRHYTHM assessment captures energy patterns (the "H" cluster: Energy & Recovery) but doesn't automatically write optimal windows into `user_schedule_preferences`
3. **Optimal Meeting Scheduler** — using the combined data (blocked times + assessment-derived energy peaks) to suggest the best meeting slots

## Where This Fits in the Plan

This is a **Smart Scheduling enhancement** that sits in the **MVP Core (Months 1-3)** section of the investor deck, specifically under "Smart Scheduling (calendar sync + energy-aware time blocking)."

In the current plan, it strengthens Slide 12 (Expansion) and Slide 20 (MVP Appendix) by making the scheduling story concrete:

### Updated MVP Appendix (Slide 20) — Add to Smart Scheduling bullet:

**Smart Scheduling** becomes:
- "Smart Scheduling — MYRHYTHM assessment determines cognitive peaks and energy patterns; users block unavailable days; AI schedules meetings and actions at optimal cognitive windows"

### Implementation Plan (3 components)

**A. Availability Manager Component**
- New file: `src/components/smart-scheduling/AvailabilityBlocker.tsx`
- Weekly grid view (Mon-Sun, 7am-9pm) where users tap to block/unblock time slots
- "Block entire day" toggle for rest days or appointments
- Recurring blocks (e.g., "every Tuesday afternoon is therapy")
- Saves to `user_schedule_preferences` table with `preference_type: 'unavailable'`

**B. Assessment → Preferences Pipeline**
- Update `SmartScheduler.mapAssessmentToPreferences()` to read MYRHYTHM "H" (Energy & Recovery) and "R" (Rhythm) cluster responses
- After assessment completion, auto-populate `user_schedule_preferences` with derived optimal windows
- Add a "Your Optimal Schedule" summary card shown post-assessment: "Based on your MYRHYTHM results, your peak cognitive hours are 9-11am and 2-4pm"

**C. Optimal Meeting Suggester**
- Enhance existing `SmartScheduler.suggestOptimalTime()` to cross-reference: blocked times + assessment energy peaks + existing calendar events
- When scheduling any action or meeting, show a ranked list of suggested slots with confidence scores and reasons ("Peak energy window", "No conflicts", "Matches your rhythm")

### Files to Create/Edit

| File | Action |
|------|--------|
| `src/components/smart-scheduling/AvailabilityBlocker.tsx` | New — weekly grid UI for blocking unavailable times |
| `src/utils/smartScheduler.ts` | Enhance `mapAssessmentToPreferences()` and `suggestOptimalTime()` |
| `src/hooks/useSchedulePreferences.ts` | Add `saveUnavailableBlocks()` method and `'unavailable'` preference type |
| `src/components/smart-scheduling/SmartSchedulingPage.tsx` | Integrate AvailabilityBlocker into the scheduling page |
| `src/components/investor/ProductivityInvestorSlides.tsx` | Update Smart Scheduling description in Slide 20 MVP Appendix |

### Investor Deck Narrative Update

In Slide 20 (MVP Appendix), the Smart Scheduling bullet becomes:

> **Smart Scheduling** — MYRHYTHM assessment establishes cognitive baseline and energy patterns. Users block unavailable days. AI cross-references peaks, availability, and calendar to schedule meetings and actions at optimal cognitive windows. Built for ABI/TBI-grade precision, available to everyone.

This directly ties the assessment ("where the user is cognitively") to the scheduling engine ("when they should do things"), which is the core CCM value proposition.

