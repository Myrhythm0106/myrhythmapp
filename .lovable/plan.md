# Make the welcome promise unforgettable

## The problem
The three promises before the questions are accurate but they describe features. Nobody feels the "oh wow". They need to name a moment the person has already lived, show the relief, and leave them feeling in control and confident.

## New pattern for each promise
- **The moment I know** (one short line, in my own voice)
- **What MyRhythm does** (one short line)
- **How it feels** (two or three words, in bold teal)

## New copy

Intro: "This takes about 6 minutes. My answers shape MyRhythm around me. Here's what changes."

1. **"I walked out and forgot half of it."**
   I record the conversation. MyRhythm turns it into next steps and stays with me until each one is done.
   **Nothing slips.**

2. **"I meant to do it, then the day ran away."**
   Important things go into the hours when my mind works best. Breaks are built in, and I agree every change.
   **I'm in control.**

3. **"I'm not sure where to start."**
   I get my free snapshot and a simple 3-week plan, one small step at a time. Both are mine to keep.
   **I feel confident.**

Under the cards, one reassurance line: "Nothing goes on my calendar without my say-so."

## What stays the same
- The numbered card layout and the Start button
- First-person voice, no medical claims, and "free" said clearly
- No dashes standing in for sentences, and no jargon

## If you meant the answer choices inside the questions instead
Tell me and I'll apply the same approach there: each answer becomes a recognisable everyday moment, and straight after answering a short line shows what MyRhythm will do with it, e.g. "Got it. I'll remind you the day before and the morning of."

## Technical
- Edit the welcome block strings in `src/pages/launch/LaunchAssessment.tsx` only. Add a bold teal outcome line per card using existing launch tokens.
- Check wrapping at 320px, 393px and 834px.
