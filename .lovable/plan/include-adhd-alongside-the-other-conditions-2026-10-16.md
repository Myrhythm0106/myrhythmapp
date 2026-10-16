# Include ADHD alongside the other conditions

## What changes
ADHD is named in the existing lists, just like dementia. There is no separate ADHD choice or section.

- **Starting choice, first card:** "Brain injury, stroke, dementia, long COVID, MS, ADHD — finding your rhythm again, one steady step at a time."
- **Supporting someone card:** stays as it is. It already covers "brain change", which now includes ADHD through the first card.
- **App description of this group:** "brain injury, stroke, dementia, long COVID, MS, ADHD" in the longer and short descriptions.

## What stays the same
- Still three main choices, the same questions, scoring, free snapshot and membership.
- The "does not diagnose or treat" wording stays.

## Check
- Check the starting-choice screen on phone (320px) and at your current size, and confirm the text wraps neatly.

## Technical details
- `src/pages/launch/LaunchUserType.tsx`: update the `brain-injury` definition.
- `src/launch/persona/usePersona.ts`: add ADHD to the `recovery` entries in `PERSONA_DEFINITION` and `PERSONA_DEFINITION_SHORT`. The existing `'adhd'` mapping stays unchanged.
