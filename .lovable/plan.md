# Never "What do I do here?": a clarity pass on the start of the journey

## The rule (saved permanently)
Every screen answers three questions at a glance, before anything else:
1. **Where am I?** A plain title that says what the screen is.
2. **What do I do?** One obvious main button, with words that say exactly what happens next.
3. **What happens after?** One short line, for example "Next: 11 quick questions, about 6 minutes."

No jargon, no unexplained labels, no slogans standing in for instructions.

## What confused you on the screen before the questions (checked)
- The heading is a slogan ("MyRhythm remembers, so I don't have to"), not an instruction.
- Three cards explain values (Remembered, Reliable, Resilient) when you just want to start.
- Then a choice appears with unexplained labels: "**YES** Quick Start" and "all eight **MYRHYTHM letters**". Two options and no clear "just start".
- The page before it, "What brings you to MyRhythm?", has a "Personalize Your Experience" badge and no line saying why it's asked or what comes next.

## New: a calm welcome straight after registering
The first thing after creating an account, shown once:
```text
You're in, Annabel. Welcome to MyRhythm.

Here's what happens next. It takes about 10 minutes, and I can stop any time.
  1  A few quick questions about my day    (about 6 minutes)
  2  My free personal snapshot             (ready straight away)
  3  My first small step, saved to my day  (1 minute)

  [ Guide me through it ]                 <- main button, recommended
  I'd rather look around first            <- quiet link
```
- **Guide me** (the default): a slim "My guided start · 1 of 3" strip leads the way, one step at a time. It says what to do and what comes next, then gets out of the way when the step is done. No pop-ups, no arrows and no cartoon tips.
- **Look around first:** goes to Home. A small "Pick up my guided start" link stays on Home until it's finished, so nobody is lost.
- Tone: warm and adult, like a good personal assistant. "Here's what happens next", never "Yay!" or "Great job!".
- Never shown again once chosen. It can be found later in Help as "Show me around again".

## The new screen before the questions
```text
Step 3 of 4 · My questions

A few quick questions about my day
I answer 11 simple questions. MyRhythm uses them to set up
my reminders, my day and a free personal snapshot.

  [ Start my questions ]          <- one big orange button
  About 6 minutes · I can stop and come back any time

  Why it helps   (tap to open: the 3 short benefit lines)
  Want the longer version?  (quiet link: "Answer more later")
```
- The welcome line moves to a small greeting: "Welcome, Annabel."
- Remembered, Reliable and Resilient move behind "Why it helps", closed by default.
- "YES" and "MYRHYTHM letters" disappear from this screen. The longer version becomes a quiet link: "I'd like to answer more (about 20 minutes)."
- The first question's screen keeps the step bar, plus "Question 1 of 11".

## "What brings you to MyRhythm?" made obvious
- The badge reads **"Step 2 of 4 · About me (optional)"** instead of "Personalize Your Experience".
- Line under the title: "I pick what fits best, so the questions use words that suit me. Not sure? I can skip this."
- The skip button reads **"Skip and start my questions"**.

## Then: a quick check of every screen against the rule
Landing, Create account, About me, Questions, My snapshot, Home, Memory Bridge, Conversation Summary and Support Circle. Anything that fails the three questions gets fixed in the same way: a plain title, one obvious button and a "next" line.

## Afterwards, carry on with the approved plan
Publish, Support Circle first, Conversation Summary, recording reminders, then the landing page North Point wording.

## Technical details
- `src/pages/launch/LaunchAssessment.tsx` (welcome block): new heading and line, a single primary button that starts the quick questions, "Why it helps" disclosure for the 3 cards, the full-picture option as a text link setting WANTS_FULL_KEY, and removal of "YES"/"MYRHYTHM" labels from the copy. JourneySteps stays.
- `src/pages/launch/LaunchUserType.tsx`: badge text, helper line, skip label. No logic changes.
- Save the three-question rule to memory alongside the friction-free principle.
- Check at 320px, 393px and desktop with Playwright screenshots.
