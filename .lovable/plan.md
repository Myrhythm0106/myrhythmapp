# Hero copy: tense and punctuation pass

## What changes

On the landing page hero (the copy under the headline), three small wording fixes, exactly as the user specified:

1. "Your Pocket PA — it remembers, so you don't have to." →
   "Your Pocket PA. **It remembers**, so you don't have to."
   (em dash becomes a full stop; "It" capitalised; the teal/gold accent styling stays on "It remembers")
2. "Captures it. Plans it. Keeps it. And follows it through." →
   "Captures it. Plans it. Keeps it. **Follows it through.** You stay in control."
   (drop "And")
3. "…then helps those steps find a realistic place in **my day**." →
   "…find a realistic place in **your day**."
   (first-person "my" was wrong on a public landing page — it should address the reader)

## Where

- `src/components/mvp/MVPCore4C.tsx` (lines ~336–346) — the main hero block on /start.
- `src/pages/launch/LaunchStart.tsx` (line ~51) — the same Pocket PA line appears in the welcome-back header; updated for consistency so both say "Your Pocket PA. It remembers, so you don't have to."

No other copy, layout, or styling changes.

## Verify

- Typecheck passes; view the hero on phone (393×822) and desktop to confirm the lines wrap cleanly and the teal accent still renders.
