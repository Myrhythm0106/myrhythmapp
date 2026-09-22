# Hero headline — "The app that keeps your plans and actions going…"

One copy amendment on `/launch/landingpage` (`src/components/mvp/MVPCore4C.tsx`, line 295). No layout, image, colour or CTA changes.

## Change

Current hero headline:

> "The app that keeps your plan going after the appointment ends."

New hero headline:

> **"The app that keeps your plans and actions going after your appointment or conversation ends."**

Notes:

- I've dropped the comma after "keeps" from your message — it read like a typing slip, and the line flows cleanly without it. Happy to put it back if you meant it.
- "plans and actions" matches the app's actual vocabulary (plans + Next Step actions), and "appointment or conversation" covers both the clinical and everyday use cases.
- The longer "remembers and keeps" variant from the earlier plan is superseded by this wording — this is now the single hero line.
- No other page uses the old tagline (checked the whole app), so nothing else changes.

## Verification

- Typecheck via `tsgo`.
- Playwright screenshots of the hero at desktop and mobile widths to confirm the longer headline wraps cleanly over the photograph.
