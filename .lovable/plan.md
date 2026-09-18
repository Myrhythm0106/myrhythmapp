# Landing page wording: capture stage + hero headline

Two copy amendments on `/launch/landingpage` (all in `src/components/mvp/MVPCore4C.tsx`). No layout, image, colour or CTA changes.

## 1. First stage label — "Record conversation or upload report"

The first story stage currently shows the plain label "Conversation or report". It becomes an action, matching how the app actually works:

- Chapter 01 promise (line 50): "Conversation or report" → **"Record a conversation or upload a report"**
- Continuity sequence, first item (line 356): "Conversation or report" → **"Record a conversation or upload a report"**

(Chapter 01's detail bullet already reads "I can record a conversation or upload a report." — unchanged, and now the headline label agrees with it.)

## 2. Hero headline — "The app that remembers and keeps…"

- Hero headline (line 295): "The app that keeps your plan going after the appointment ends." → **"The app that remembers and keeps your plan going after the appointment ends."**

This adds "remembers and" so the hero states both halves of the promise: nothing forgotten, nothing dropped. It stays within the non-medical-claims policy.

## Verification

- Typecheck the project.
- Playwright screenshot of the hero (desktop and mobile) to confirm the new headline wraps cleanly over the photograph, and of the Chapter 01 block and continuity sequence to confirm the new label renders without overflow.
