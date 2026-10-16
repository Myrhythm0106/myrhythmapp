# The report that does the job before it asks

## The unobvious idea
Most reports describe you, then ask you to sign up. Ours **saves something real for you, on the spot**, using your own answers. By the time you finish reading, MyRhythm has already caught something you would have forgotten. Asking "would you like to use the app?" then sounds silly, because you already are.

## The flow (about 60 seconds, after the last question)

**1. "What's on your mind that you can't afford to forget?"**
One big box, with a microphone or typing. Examples help you start: "Call the surgery about my results", "Mum's birthday on Saturday". You can skip, but the screen invites you warmly.

**2. Your personal "slip line"** (the reveal, built only from your answers)
A simple timeline from now to next week shows what normally happens to that item for *you*:
- *Today:* "I'll remember." (you said things feel clear in the moment)
- *Tonight:* "It's fading." (you said next-day memory fades quickly)
- *Thursday 4pm:* "It slips." (you said appointments and dates slip, and afternoons are your hardest time)

Then the same line **with MyRhythm**, built from your rhythm:
- **Remembered:** saved word for word now
- **Reliable:** placed at 9:30 tomorrow, your clearest hour, with a reminder the evening before and on the morning
- **Resilient:** if you miss it, it waits for you the next morning. It's not lost.

The words **"Remembered · Reliable · Resilient"** tie straight back to the welcome promise.

**3. One tap: "Keep this for me"**
The item is saved and shown in tomorrow's plan. You see "Done. MyRhythm has it." and that's the yes.

**4. Then your snapshot** (the current report, made shorter)
Your pattern in one sentence, your best window, what's already working, and one action you choose. "Why this?" still shows which answers each insight came from.

**5. Honest choice, unchanged**
Free stays free. Membership is clearly explained as "keep this going for everything, every day".

## Why this works
- It **proves** the promise, instead of describing it.
- The "before" line uses their own answers, so it feels uncomfortably accurate. That's the "that's me" moment.
- They act once and get relief straight away. The yes comes from what they did, not from a sales pitch.
- It's calm and personal, with no scores, no diagnosis and no medical claims.

## Technical
- Add a "Catch one thing" step (`CatchOneThing.tsx`) before `LivingCompassReport`. It uses typing first, plus the existing quick-capture microphone where available.
- Add a `buildSlipLine(results, bestTime)` helper in `src/launch/compass/myCompass.ts`. It maps quick-tier answers (what slips, next-day memory, best time of day) to the "without" points, and the best window to the "with" points. If an answer is missing, it falls back to gentler wording. Includes a test with three answer sets.
- "Keep this for me" saves the item using the existing next-step and reminder path, for tomorrow at the best window, so it appears on Home and in the Calendar. Nothing is added without the tap.
- Trim `LivingCompassReport` to: pattern, best window, strength, chosen action, and free vs membership.
- Check it on a phone at 320px and 393px.
