# Move the "Also fits" box to the left-hand side

## What changes
On the multi-select question in the assessment (the one that allows second picks), the small "Also fits" checkbox currently sits at the far **right** edge of each option card. It moves to the **left** side of the card, so the row reads:

```text
( ○ primary circle )  [ ☐ Also fits ]   Option text
                                          description
                                          (Make primary — when it's a secondary)
```

- The selection circle stays first (it is the well-known primary selector on the left).
- The "Also fits" toggle is inserted immediately after the circle, before the option text — its behaviour (tap to add/remove a secondary) is unchanged.
- The "Primary", "Also fits" chips, "Make primary" button, helper text, and ARIA labels all stay as they are.
- Touch targets stay at 44px minimum; no change to scoring or answers.

## File
- `src/pages/launch/LaunchAssessment.tsx` — reorder the card row: move the `question.multiSelect` toggle button block from after the text column to directly after the selection circle.

## Verification
- Typecheck (`tsgo --noEmit --pretty false`).
- Phone-size (393×822) Playwright check on the multi-select question: confirm the box renders on the left, no horizontal overflow, toggling a secondary and promoting a primary still work.
