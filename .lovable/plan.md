# Make the welcome promise a must-have

## Why the last version felt optional
It described nice outcomes. A must-have names what it **costs me** when things slip, like a missed appointment, a wrong dose or a let-down family member. Then it shows MyRhythm stepping in at that exact moment. People pay to avoid losing something, not to gain something pleasant.

## New pattern for each card
- **The cost** (bold, one line I recognise from my own life)
- **What MyRhythm does about it** (one line that sounds active, as if MyRhythm is beside me)
- **Proof it's real** (a small grey example of what I'll actually see)

## New copy

Heading: "Welcome, {name}. Here's what stops slipping from today."
Intro: "This takes about 6 minutes. My answers set MyRhythm up around me."

1. **The doctor said three things. By the car park, I remembered one.**
   MyRhythm records it, pulls out every next step, and keeps reminding me until each one is done.
   *Example: "Book blood test by Friday" appears in my day, with a reminder the day before.*

2. **I missed it, again, and someone was let down.**
   Appointments and promises go into my day at times I can actually manage them. Nothing gets moved without my yes.
   *Example: "Call Mum, 10:30" lands in my clearest hour, not at 4pm when I'm drained.*

3. **I'm tired of starting over every Monday.**
   My free snapshot shows what's really getting in my way. Then a 3-week plan gives me one small step a day.
   *Example: Week 1, day 1: "Put tomorrow's one priority on the fridge."*

Closing line, in bold teal under the cards: "I stay in control. MyRhythm does the remembering."

## What stays the same
- The card layout, numbering and Start button
- First-person voice, no medical claims, "free" stated clearly
- No jargon and no dashes standing in for sentences

## Technical
- Edit the welcome block in `src/pages/launch/LaunchAssessment.tsx` only. Add a small muted example line per card using existing launch tokens.
- Check wrapping at 320px, 393px and 834px.
