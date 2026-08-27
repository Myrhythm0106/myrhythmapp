# Fix: tapping the record circle does nothing on laptop Chrome

The record circle stays — it's the right control. The problem is that the tap can end without you ever seeing why.

## Most likely cause (to confirm on the first tap after the fix)

On a laptop in Chrome, the app is usually being viewed inside the Lovable preview frame. A page inside a frame can only use the microphone if the frame explicitly allows it; when it doesn't, the browser refuses the request and the app's error path is the only thing that can tell you. Two other silent paths exist in today's code: the screen can open on the leftover "review" state instead of the record circle (so the circle isn't reachable), and the allowance check can block the tap before the microphone is ever asked for.

None of these is confirmed for your session yet, so step 1 makes the reason visible instead of guessing.

## Fix, in order

1. **Say what happened, every time.** Before asking for the microphone, check whether the page is running inside a frame and whether microphone use is permitted there. If it isn't, show a clear panel on the record card: "Chrome is blocking the microphone inside this preview frame — open the app in its own tab to record", with a one-tap "Open in a new tab" button. Log the exact reason to the console too.

2. **Show a live permission state on the card.** Query the browser's microphone permission when the Memory Bridge page opens and show a short line under the circle: ready, blocked, or needs permission — plus a "How to allow the microphone in Chrome" hint when it's blocked. No more tapping into silence.

3. **Never let the tap look dead.** Put the circle into a visible "starting…" state the instant it's pressed, and return it to normal with a message if the microphone request fails. Keep the circle exactly as it is visually.

4. **Make sure the circle is actually on screen.** If the page restores a leftover recording and opens on the review screen, show a clear "Record something new" action next to it so the circle is always one tap away.

5. **Don't block silently on allowance.** If recording time has run out, show that as a message on the card itself, not only as a toast that can be missed.

## Verify

- Laptop Chrome inside the preview: the card explains the frame restriction and the "Open in a new tab" button leads to a working recorder.
- Laptop Chrome in its own tab: tap the circle, permission prompt appears, timer starts, level meter moves, stop produces a saved recording.
- Deny permission on purpose: the card shows the blocked state and how to re-allow it.

## Technical notes

- `src/pages/launch/LaunchMemoryBridge.tsx` — permission/frame status panel, pressed state on the record button, always-available "record new" escape from the restored review state, inline allowance message.
- `src/hooks/useVoiceRecorder.ts` — pre-flight frame/permission-policy check returning a specific reason, plus a `permission` status exposed for the UI.
- No database, edge function, or extraction changes in this pass.
