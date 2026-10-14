# Make assessment statements and answers clearly different

## Confirmed issue
In “What I told MyRhythm,” each statement and answer currently appears as one continuous line with the same size, weight and colour. This makes the distinction unnecessarily difficult to read.

## Proposed presentation
Keep the existing professional design, but give each response a clear two-line structure:

```text
What slips
Appointments and dates

What helps now
Reminders on my phone

Next-day memory
Very little — it fades quickly
```

- Place the statement above its answer, rather than joining them with a colon.
- Make the answer bold and more prominent; keep the statement regular-weight and clearly legible.
- Use at least 18px text, comfortable line spacing and generous space between response pairs.
- Use subtle dividing lines between pairs, not additional cards or coloured badges.
- Distinguish meaning through position, weight and spacing—not colour alone. Keep both lines high-contrast.
- Preserve the exact saved answers, free snapshot and assessment behaviour.

## Technical details
- Update the response list in `LivingCompassReport` to semantic description-list pairs (`dt` for the statement and `dd` for the answer).
- Separate existing combined strings at the first colon only; retain any later colons within answers. Display older entries without a separator safely, without inventing a label.
- Use existing design tokens and avoid faded text for these labels and answers.

## Checks before completion
- Confirm the three example pairs are visually distinct on phone and desktop, including in greyscale.
- Check text contrast, long-answer wrapping and 200% zoom without clipping or horizontal scrolling.
- Confirm assistive technology can identify the statement–answer relationships.

Scope: this assessment-summary section only; no scoring, navigation or saved-data changes.