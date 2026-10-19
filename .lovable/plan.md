# Make the Quick Start questions match the promise

## Verdict
Mostly yes, with two gaps.

| Promise | Questions today | Fit |
|---|---|---|
| Captures it | Which things catch me out; what's left after an appointment | Strong |
| Plans it | When I'm sharpest; when I run on empty | Good, but two questions do one job |
| Keeps it | Saved it but can't find it | Weak. It's about searching, not the app keeping things for me |
| Follows it through | What stops me starting; what stops me acting on a reminder | Strong |
| You stay in control | No question | **Missing** |
| Your Pocket PA, it remembers | Only in some replies | Patchy |
| After the appointment or conversation ends | One question | Thin |

The sleep, stress and self-talk questions don't match a promise line. They stay: they feed Resilient and the brain-health part of the report.

## Changes (still 11 Quick Start questions)

1. **Group headings follow the promise.** Questions are grouped as Captures it, Plans it, Keeps it, Follows it through and You stay in control, with Resilient after them. The person sees the promise build as they answer.
2. **Merge sharp and drained times into one day-strip question:** "Tap when I'm sharp and when I'm running on empty." This is the day-strip from the earlier plan you approved, and it frees one slot.
3. **Rewrite "Keeps it" around the conversation ending:**
   "A week after an appointment, someone asks what was agreed. I…"
   - "Know exactly, and can show them" / "Remember roughly" / "Have to guess or ask someone else"
   - The reply says MyRhythm keeps the note and every step, ready to show.
4. **New "You stay in control" question (in the freed slot):**
   "When MyRhythm spots a next step, I'd like it to…"
   - "Ask me before anything goes in my day"
   - "Suggest a time, and I just say yes"
   - "Put it in, and I can change it any time"
   - Replies confirm that nothing happens without my say. The answer decides how much MyRhythm asks before placing steps.
5. **Pocket PA voice in every reply.** Each reply ends on what my PA does next, for example: "Done. I'll keep that for you." All replies stay first-person and plain.

## Guardrails
No medical claims. No practitioner names. Max 3 to 4 tap options. The Full Picture questions are not changed.

## Technical
- `src/data/launchAssessmentBanks.ts`: merge `planningRhythm` and `energyDip` into one day-strip question that saves both answers, so the report and calendar inputs keep working. Rewrite `findAgain`, add `controlStyle` (tier `quick`), and increase `ASSESSMENT_SCHEMA_VERSION`.
- Save `controlStyle` as a user-scoped preference on the device for now. Using it to decide whether steps are placed automatically comes later.
- Update the `myCompass` and `priorityAreas` tests for the changed IDs, then run them.
- Check that questions wrap cleanly on screens 393px and 834px wide.
