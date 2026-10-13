# Goal labels + one-tap vision paragraph

## 1. Rename the three targets
Everywhere the vision targets appear (calendar "My Vision in ACTion" banner, edit fields, Settings preview, Help me plan wording), use:
- **Core Goal** — my main step towards my vision
- **Key Goal** — another step towards it
- **Stretch Goal** — only if I feel up to it

Labels only; saved data and behaviour stay the same.

## 2. "Write my vision for me" on /launch/vision-statement
Today the paragraph is just the prompt answers (Finance, Future, etc.) glued together sentence by sentence, which reads mechanically.

### A clear structure: Who, What, Where, When, Why, How
Every vision write-up follows the same six plain-language anchors, so it is always clear and practical:
- **Who** — who I am becoming, and who is with me (Support Circle)
- **What** — what I want to have, do or achieve
- **Where** — where life happens (home, work, community)
- **When** — by when, in my chosen timeframe
- **Why** — why it matters to me
- **How** — the first practical steps (links to Core / Key / Stretch Goals)

The tool fills these from what the person already wrote in the life sections. A small "Add a little more" card offers one short optional question for any anchor that is empty (e.g. "Why does this matter to you?") — skippable.

### Levels and timeframes
A simple three-choice selector above the button: **This year**, **3 years**, **Long term (5+ years)**. Each level gets its own saved vision paragraph, so people can hold a near-term and a big-picture vision side by side. The calendar banner shows the level the person picks as their current focus.

### One tap
Add one optional button: **Write my vision for me**. Free for everyone.
- Enabled once at least two sections have answers; shows "Uses what you wrote in: Finance, Future…" so the source is clear.
- Produces two parts: a polished first-person **vision paragraph** (about 80–120 words, warm, professional) and underneath a compact **Who / What / Where / When / Why / How** summary the person can scan at a glance. No invented facts, no medical claims, no practitioner names.
- Draft appears in a preview card with **Use this**, **Try another version** and **Keep mine**. Nothing replaces the person's own text unless they choose **Use this**; a one-tap **Undo** restores it.
- Still freely editable; Save vision and Read aloud work as today.
- Clear message if the service is busy; their text is never lost.

## Technical details
- Label changes in `LaunchCommitmentBanner.tsx`, `LaunchDayView.tsx`, `LaunchFocusDisplaySettings.tsx`, and planning copy (search for "Core"/"Key"/"Stretch" user-facing strings).
- New edge function `compose-vision` (server-side, `LOVABLE_API_KEY`), streaming via `/v1/responses` with default model `openai/gpt-6-astra`, reasoning low, `store: false`, strict JSON schema output `{ paragraph, who, what, where, when, why, how }`; input = filled prompt answers, optional anchor answers, chosen level, saved goals. System prompt enforces first person, no invented content, no clinical language. 402/429/403 surfaced as friendly messages.
- `VisionStatementComposer.tsx` gets the level selector, button, preview card with 5W1H summary, optional anchor questions and undo state; existing auto-stitch fallback kept.
- Per-level vision text and 5W1H summary stored alongside the existing vision statement storage, keyed by level (existing statement becomes "This year"). No new tables.
