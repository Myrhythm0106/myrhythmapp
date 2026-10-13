# Goal labels + one-tap vision paragraph

## 1. Rename the three targets
Everywhere the vision targets appear (calendar "My Vision in ACTion" banner, edit fields, Settings preview, Help me plan wording), use:
- **Core Goal** — my main step towards my vision
- **Key Goal** — another step towards it
- **Stretch Goal** — only if I feel up to it

Labels only; saved data and behaviour stay the same.

## 2. "Write my vision for me" on /launch/vision-statement
Today the paragraph is just the prompt answers (Finance, Future, etc.) glued together sentence by sentence, which reads mechanically.

Add one optional button above the paragraph box: **Write my vision for me**.
- Enabled once at least two sections have answers; shows "Uses what you wrote in: Finance, Future…" so the source is clear.
- One tap produces a polished, first-person paragraph (about 80–120 words) that weaves all filled sections together — warm, confident, professional, in the person's own words where possible. No new facts, no medical claims, no practitioner names.
- The draft appears in a preview card with **Use this**, **Try another version** and **Keep mine**. Nothing replaces the person's own paragraph unless they choose **Use this** — and a one-tap **Undo** restores the previous text.
- They can still edit freely, then Save vision as today. Read aloud works on the new text.
- Clear message if the service is busy or out of credits; their text is never lost.

## Technical details
- Label changes in `LaunchCommitmentBanner.tsx`, `LaunchDayView.tsx`, `LaunchFocusDisplaySettings.tsx`, and planning copy (search for "Core"/"Key"/"Stretch" user-facing strings).
- New edge function `compose-vision` (server-side, `LOVABLE_API_KEY`), streaming via `/v1/responses` with default model `openai/gpt-6-astra`, reasoning low, `store: false`; input = filled prompt answers + future label; system prompt enforces first person, no invented content, no clinical language. 402/429/403 surfaced as friendly messages.
- `VisionStatementComposer.tsx` gets the button, preview card, undo state; existing auto-stitch fallback kept.
- No database changes.
