# Five fixes: landing text, Back, register flow, Full name, Join now

1. **Landing page sections**: remove the small teal line under each label (THE MOMENT, THE DECISION, THE TIME, THE PERSON), e.g. "Loop in someone you trust, if you choose". The label, big heading, description and photo stay.

2. **In-app Back button**: today it relies on the browser's history, which breaks after redirects and fresh opens. Replace it with the app's own list of visited in-app pages: Back takes you to the page you actually came from, never to the landing page, and to Home when there is nothing before. Small test added.

3. **Register page after Get Started**: make sure every Get Started / register tap opens `/launch/register` (no detours or skipped screens), and that finishing registration moves straight on to the next set-up step. If you meant something different, tell me and I'll adjust.

4. **Full name**: on `/launch/register`, "First name" becomes "Full name" (placeholder and saved name use the whole name).

5. **Join now doing nothing**: the payment page is shown inside the preview frame, and the card page from Stripe refuses to open inside a frame, so the tap appears dead. Fix: open the secure card page in the full window (new tab when framed), show a "Taking you to secure checkout..." message, and if you are not signed in, send you to Log In and back rather than silently stopping. After payment you return to the welcome / Who it's for step.

## Technical
- `MVPCore4C.tsx`: delete the `chapter.promise` paragraph.
- `appHistory.ts`: keep a stack; `goBack()` pops to previous non-public path; `LaunchPageHeader` uses `navigate(prev)` instead of `navigate(-1)`.
- `LaunchRegister.tsx`: label/placeholder change; audit Get Started links.
- `LaunchPayment.tsx` `handleStartTrial`: `window.top.location` / `window.open` fallback, loading toast, sign-in redirect with return path.
