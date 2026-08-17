# Fix the Memory Bridge screen: visible record button, clearer layout

## What I found

The page does load — nothing is broken in code — but two things make it read as "black and confusing":

1. **A tall solid dark-green hero band** fills the top third of the screen. On a phone that band is most of what you see on first paint, which looks like a black screen.
2. **The record button is invisible.** The big circular "Tap to Record" control renders as a white circle on a near-white card, so there is no obvious thing to press.
3. **The order of the page is upside down.** "Import from a document" (the rare action) sits above recording (the main action), and the egg-timer allowance panel is stacked *inside* the record card, pushing the mic further down and competing with it.

## What I'll change (presentation only)

**1. Shrink and lighten the hero**
- Reduce the dark band to a compact header strip: small "CAPTURE" label, "Memory Bridge" title, one-line subtitle.
- Keep the deep-green brand colour but cut the vertical height by roughly half so content is visible immediately on a phone.

**2. Make the record button unmistakable**
- Solid brand-teal circle with a white mic icon, gold ring, and a soft shadow.
- Clear pressed/recording states: teal when idle, ember/red with a pulse while recording.
- Minimum 96px touch target, centred, first thing under the header.

**3. Reorder the page**
```text
Header strip (compact)
────────────────────────
1. Record  ← primary, big teal mic, one line of helper text
2. Time left  ← slim single-line strip: "4h left this month · up to 20m in one go"
                (tap to expand into the Week/Month egg timer)
3. Recent recordings
4. Import from a document  ← collapsed row, expands when tapped
```
- The egg timer moves out of the record card into its own collapsible strip so the mic is never crowded.
- Document import becomes a single tappable row that expands, rather than a large always-open panel.

**4. Keep it calm**
- One primary action visible at a time; everything else is a reveal.
- No new features, no backend or recording-logic changes — recording, allowance limits, and extraction all keep working exactly as they do now.

## Technical notes

- Edits are confined to `src/pages/launch/LaunchMemoryBridge.tsx` (layout/order and hero sizing) and `src/components/memoryBridge/RecordingEggTimer.tsx` (a `compact` single-line variant plus expand).
- The record-button styling lives in the same page file; only Tailwind classes and the existing launch design tokens are touched.
- Hooks `useVoiceRecorder`, `useMicLevel`, and `useRecordingAllowance` are untouched.
- Verify after the change with a phone-width and desktop-width screenshot of `/launch/memory`.
