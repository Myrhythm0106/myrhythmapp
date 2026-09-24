# /start: A founding CTA that never leaves sight

## The problem
On /start the only "Become a Founding Member" button lives in the hero. Scroll down to read the story and the button is gone — nothing to press until the very bottom, and even the closing section has no button. A reader who is convinced has nowhere to go.

## The fix — always one glance away, never in the way

**1. Sticky top-nav CTA (desktop + mobile landscape)**
- Add a compact teal "Founding Member" button to the existing sticky top navigation (it already stays pinned at the top).
- Always visible while scrolling; same action as the hero button.
- Slightly smaller than the hero button so it never fights the headline.

**2. Floating bottom bar (phone-first)**
- A fixed bottom "Become a Founding Member" bar that appears only once the hero button has scrolled out of view (IntersectionObserver), and fades away when the hero button is back in sight — so there is never a duplicate.
- 56px minimum touch height, sits above the phone's home-indicator safe area, honours the reduced-motion setting (appears/disappears without animation for those users).
- Cream/ivory surface with gold hairline, teal button — consistent with the Light Linen look.

**3. Closing section gets its button**
- The final "I do not need to hold the whole plan in my head." section currently has no button — add the same "Become a Founding Member" button beneath the founding price line, so the natural end of the page converts.

**4. Apply the previously approved-in-principle wording**
- In the continuity sequence, change "Conversation or report" → "Record a conversation or upload a report" (this was requested earlier and is still pending — approving this plan applies it).

## Guardrails respected
- Still ONE primary CTA everywhere — the persistent button is the same founding CTA, not a new choice.
- Max 3 visible actions per screen; no new nav items.
- No medical claims, no new copy beyond the two CTA labels.

## Files
- `src/components/mvp/MVPCore4C.tsx` — nav CTA, floating bar with IntersectionObserver, closing-section button, sequence wording.

## Verification
- Playwright: desktop (1280px) and phone (390px) — scroll to mid-page, confirm the floating bar/nav CTA is visible and clickable; scroll back to hero, confirm no duplicate; typecheck.
