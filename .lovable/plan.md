# Bring "MYRHYTHM: What matters to me" into the app without changing its structure

## My advice: keep the structure, change the content
Your document fits the app as it is. MyRhythm already runs on the eight MYRHYTHM letters: the Full Picture, the snapshot strip, the calendar links and My Compass all read from one list of letters. So we **swap the meaning and questions behind each letter**. We don't rebuild screens or navigation. People see the same journey, with much stronger words.

```text
Before                    After (your document)
M  Mindset            ->  M  What matters to me
Y  Yes to Reality     ->  Y  Your brain, your starting point
R  Rhythm             ->  R  Remember what matters
H  Harness Support    ->  H  Help me begin
Y  Your Victories     ->  Y  Your pace, your capacity
T  Transform          ->  T  Turn intention into follow-through
H  Heal               ->  H  Help that works for me
M  Meaning            ->  M  My progress, my next choice
```

The closing line becomes your sign-off: "Capture it. Plan it. Keep it. Follow it through. Be in control."

## Three things to fix in the document before it goes in
1. **Open questions are heavy.** "What tends to interrupt your rhythm?" means a blank box, which is hard when you're tired or have memory challenges. Each question becomes 3 or 4 tap answers written in everyday speech, plus "Something else" for anyone who wants to type.
2. **Mindset is missing.** It must stay. Add it under **T** (follow-through): "When I forget something or a plan slips, what do I tell myself?" The answers include the harsh voice ("Not again, what's wrong with me?").
3. **Thirty questions is too many to start with.** Keep two depths, as now:
   - **Quick Start (about 5 minutes, 9 questions):** the most revealing ones, grouped under Remembered · Reliable · Resilient
   - **Full Picture (optional, all 30 plus mindset):** one letter at a time, as now

## Quick Start: 9 questions taken from your document
| Promise | Your question | Letter |
|---|---|---|
| Remembered | 13 What do you most want help remembering? | R |
| Remembered | 17 After an appointment, what would help you remember what was agreed? (shown as the "just left the appointment" moment) | R |
| Remembered | 15 How often do you save something and then can't find it? | R |
| Reliable | 7 When is your thinking clearest? (on the day strip, with drained times too) | Y |
| Reliable | 18 When you know what to do, what makes starting hard? | H |
| Reliable | 23 When a reminder arrives, what stops you acting on it? | T |
| Resilient | 6 How rested do you feel when you wake up? | Y |
| Resilient | 11 How much are stress or low mood affecting your day? + the new mindset question | Y / T |
| Resilient | 1 What would you most like to feel in control of? (becomes my first focus) | M |

Each answer still shows an instant teal reply, for example: *"Then MyRhythm will break it into one small first step."*

Question 12 (brain injury, stroke, illness) stays **optional and Full Picture only**. It's worded neutrally and never used to label anyone.

## What the report gains
The report now speaks your language. "What matters to me" opens it, "Remember what matters" and "Turn intention into follow-through" explain my pattern, and "My progress, my next choice" ends with one action I choose. The agreed flow stays: catch one real thing → my slip line → "Keep this for me" → my snapshot → an honest free or membership choice.

## Guardrails
- No practitioner names anywhere. The quiet brain-health basis stays: sleep, movement, food, water, stress, mindset, support and meaning are all in your document.
- No medical claims and no diagnosis. First person.

## Technical
- Update the letter names, short descriptions and research notes in `src/launch/framework/myrhythm.ts`, the single source of truth. The screens using it update automatically.
- Rewrite `src/data/launchAssessmentBanks.ts`:
  - The Quick Start uses the 9 questions above.
  - The Full Picture uses all 30 plus mindset, as tap answers with an optional "Something else" text box.
  - Bump the bank version so older saved answers still load. Keep the best-time and energy-dip fields so Calendar and Help me plan keep working.
- Update `FULL_PICTURE_LETTERS`, the snapshot strip labels and the report helpers (`buildSlipLine`, `buildThreeR` in `myCompass.ts`), with tests.
- Add `CatchOneThing.tsx` before the report, as already planned.
- Update the memory notes on the MYRHYTHM framework and the YES/MYRHYTHM structure. Add neutral entries to the reference log.
- Check phone layouts at 320px and 393px.
