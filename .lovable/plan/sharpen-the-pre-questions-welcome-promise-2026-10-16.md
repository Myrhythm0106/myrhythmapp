# Sharpen the pre-questions welcome promise

## Verdict
Clear and honest, but not yet enticing. All three lines describe **set-up** ("my diary", "my reminders") rather than the **relief** people buy. Market leaders (Tiimo, Finch, Headspace, Granola) open with the felt outcome first, then the feature. "YES plan" is also unexplained jargon at this point, and nothing names the core differentiator: conversations turning into next steps.

## New copy (same 3 numbered cards, same layout)

Intro line under "Welcome, {name}":
"About 6 minutes. My answers set MyRhythm up around me — not the other way round."

1. **Nothing important slips.** What I need to do after a conversation or appointment is captured, planned and followed through until it's done.
2. **My best hours, protected.** Important things land when my mind is usually clearest, with reminders shaped around what I forget and breaks built in.
3. **Free to keep: my snapshot and first 3 weeks.** A personal picture of my brain-health habits and a simple plan to start, step by step.

Card 1 leads with follow-through because that's the main difference from other apps. Recording apps stop at notes, and planners don't know what was said.

## Why this works
- Outcome-first bold lead (what changes for me), feature second.
- Plain words for an 80-year-old or someone tired; no unexplained "YES".
- "Free to keep" stays explicit — transparency rule kept.
- Non-clinical; no diagnosis or treatment claims; first-person voice kept.

## Technical
- Edit the three strings and intro paragraph in `src/pages/launch/LaunchAssessment.tsx` (welcome block, ~lines 272–280). No other changes.
- Phone (320px/393px) wrap check.
