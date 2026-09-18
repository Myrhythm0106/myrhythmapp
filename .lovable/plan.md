# Landing story copy: decisions & commitments + completion in the thread

Two copy fixes in the landing page story (`src/components/mvp/MVPCore4C.tsx`), per your feedback.

## 1. Chapter 01 description

Current line 51 reads:

> "…brings the important decisions into view—without asking me to remember everything at once."

Change to:

> "Memory Bridge keeps the source, creates a clear write-up and brings the important decisions and commitments into view—without asking me to remember everything at once."

## 2. "One thread" section — include follow-through and completion

The thread currently ends at "follow-through" but never shows the moment of finishing. Two touches in the continuity sequence section:

- Headline (line 345): "One thread. From source to follow-through." becomes **"One thread. From source, through follow-through, to completion."**
- Sequence list (lines 354–359): add a closing step so the flow visibly ends with finishing the loop, e.g.:

```text
1. Conversation or report
2. Verify my next steps
3. Place them into my real schedule
4. Loop in someone I trust—if I choose
5. Return to the source at any time
6. Follow through—and mark it complete   (new, gold check icon, styled like the others)
```

Supporting paragraph (line 348) gets a small extension so the wording matches, ending: "…decide who can help, and see each step through to done."

No layout, image, colour or CTA changes — the flow and design stay exactly as approved.

## Verification

- Typecheck via `tsgo`.
- Playwright screenshots of the story and sequence sections at desktop and mobile widths to confirm the new copy reads correctly and the sixth step renders cleanly.
