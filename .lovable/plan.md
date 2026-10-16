# The report that does the job before it asks, with mindset at its heart

## The unobvious idea
Most reports describe you, then ask you to sign up. Ours **saves something real for you, on the spot**, using your own answers. It also shows the hidden thing nobody else names: **what you tell yourself when something slips**. Once that's shown, asking "would you like to use the app?" sounds silly.

## 1. Questions: quiet brain-health basis, with mindset added to the Quick Start
The quick questions already cover the four sides of brain health without naming them: body (rest, movement, fuel, rhythm), mind (memory, calm), people (support) and meaning (what matters). Mindset currently only appears in the longer Full Picture.

Add **one mindset question** to the Quick Start, worded naturally:
**"When I forget something or a plan slips, what do I usually say to myself?"**
- "That's okay, I'll sort it." (kind)
- "Not again. What's wrong with me?" (harsh)
- "I'll just let it go." (giving up)
- "Someone else will remind me." (relying on others)

The Quick Start stays about 6 minutes. No practitioner or programme names appear anywhere in the app. The internal reference log gets a neutral entry for the source.

## 2. The flow after the last question (about 60 seconds)

**Step 1: "What's on your mind that you can't afford to forget?"**
Type it or speak it. Examples help you start. It can be skipped, but the screen invites you warmly.

**Step 2: My slip line** (the reveal, built only from my answers)
*Without MyRhythm:*
- Today: "I'll remember."
- Tonight: "It's fading." (next-day memory)
- Thursday 4pm: "It slips." (what slips plus energy dip)
- **And then I tell myself: "Not again. What's wrong with me?"** (my own mindset answer, shown in my words)

*With MyRhythm:*
- **Remembered:** saved word for word now
- **Reliable:** set for 9:30 tomorrow, my clearest hour, with reminders the evening before and that morning
- **Resilient:** if I miss it, it waits for me. It's not lost, and there's nothing to beat myself up about.

**Step 3: "Keep this for me"**
One tap. The item lands in tomorrow's plan, and the screen says "Done. MyRhythm has it."

**Step 4: My brain-health snapshot** (short and personal)
- **My pattern** in one sentence, linking memory, rhythm and mindset
- **My four sides:** Body, Mind, People and Meaning, each marked Strong, Building or Needs support, with one line on why. These are habits, not scores or diagnoses.
- **My best window**
- **What's already working**
- **One action I choose**, with a gentle mindset reframe when my answer was harsh. For example: "Swap 'What's wrong with me?' for 'MyRhythm has it.'"

Each insight keeps "Why this?" (which answers it came from) and "This feels right" or "Not true for me".

**Step 5: Honest choice, unchanged.** Free stays free, and membership is clearly explained.

## Guardrails
First-person voice, plain words, no medical claims, no diagnosis, and no practitioner names in the app or the code.

## Technical
- Add a quick-tier `mindsetSlip` question to `src/data/launchAssessmentBanks.ts` (letter M, slot mindset, pillar psychological). Bump the bank version so older saved answers still load, and add a neutral entry to `docs/brain-health-reference-log.md`.
- Add `buildSlipLine(results, bestTime)` and `buildFourSides(results)` to `src/launch/compass/myCompass.ts`. These use existing pillar tags and fall back to gentler wording if an answer is missing. Add tests for three sample answer sets, including harsh vs kind mindset.
- Add a new `CatchOneThing.tsx` step before `LivingCompassReport`. "Keep this for me" saves it through the existing next-step and reminder path, for tomorrow at the best window.
- Trim `LivingCompassReport` to the Step 4 order.
- Check on a phone at 320px and 393px.
