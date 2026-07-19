## Goal

Make the free-tier countdown trustworthy across refreshes, and warn the user with on-screen alerts + a soft chime as they approach zero — so important thoughts can be finished before time runs out.

Scope is deliberately small: **no service workers, no web push, no schema changes.** The countdown already reads from Supabase; we just need to make it hydrate cleanly on refresh and layer alerts on top.

## What changes

### 1. Trustworthy countdown across refresh / restart

Current state (verified by reading `useRecordingLimits.ts` + `useVoiceRecorder.ts`):
- Daily usage is already stored in Supabase (`recording_usage_tracking.daily_duration_minutes`).
- On save, `useVoiceRecorder.ts` writes the new total.
- On refresh, `useRecordingLimits` refetches it.

Gap: while the hook is loading, the recorder UI briefly shows the full 20:00 as if nothing had been used, then snaps to the real remaining time. That flicker is what makes the countdown feel untrustworthy.

Fix (frontend only, in `MemoryBridgeRecorder.tsx` and `QuickCaptureRecorder.tsx`):
- Render a subtle "Syncing…" placeholder in the countdown pill while `isLoading` is true, instead of the full daily limit.
- Cache the last-known `daily_duration_minutes` in `localStorage` under a user-scoped key so the countdown hydrates instantly on refresh with the last known value, then reconciles when Supabase responds.
- Keep the "charge on save" behaviour you chose — mid-recording minutes remain uncommitted until Stop & Save.

Result: after any refresh or app restart the pill shows the true remaining time within one paint, and matches the server once it responds.

### 2. On-screen alerts as time runs out

Add a small `useRecordingCountdownAlerts` hook used by both recorders. It watches the live remaining seconds and fires exactly once per threshold per recording:

| Trigger | Free tier | Premium (4 h session) | Surface |
| --- | --- | --- | --- |
| 5 min left | ✅ | ✅ | Amber toast: "5 minutes left — wrap up your thought" |
| 1 min left | ✅ | ✅ | Red toast with pulse: "1 minute left — recording will auto-stop" + soft chime |
| 10 s left | ✅ | ✅ | Red toast countdown "10… 9… 8" + second chime |
| At 0 | ✅ | ✅ | Auto-stop (already wired) + final toast: "Time's up — your recording has been saved" |

Toasts use `sonner` (already in the stack). The chime is a short WebAudio beep generated in-code (no asset needed, ~200 ms, respects the tab's mute state). A "Silence chime" link in the toast writes `mb_chime_muted=1` to localStorage so power users can turn it off per device.

Each threshold fires only once per session using a ref — no spamming if the user pauses and resumes.

### 3. Small polish

- The existing amber/red pill classes get a matching `aria-live="polite"` (5 min) and `aria-live="assertive"` (1 min) so screen readers announce the change.
- On the free-tier "Daily limit reached" modal, add "Time resets in X h Y min" using the existing `getHoursUntilReset` / `getMinutesUntilReset` helpers — makes the limit feel finite instead of punitive.

## Out of scope (deliberately)

- **Web Push / service worker / VAPID** — not building. Alerts fire only while the tab is open.
- **Native push (Capacitor / FCM / APNs)** — not building.
- **Mid-recording persistence to DB** — you chose "charge on save"; no periodic writes, no schema change.
- **Recording resume after crash** — audio recovery is a separate feature.

## Files touched

- `src/hooks/memoryBridge/useRecordingLimits.ts` — add `localStorage` hydration for `daily_duration_minutes`, scoped by `user.id`.
- `src/hooks/memoryBridge/useRecordingCountdownAlerts.ts` — **new**, threshold-based toasts + chime.
- `src/components/memoryBridge/MemoryBridgeRecorder.tsx` — wire the hook, add "Syncing…" placeholder, aria-live on the pill.
- `src/components/memoryBridge/QuickCaptureRecorder.tsx` — same wiring.
- `src/components/memoryBridge/DailyLimitReachedModal.tsx` — add "resets in X h Y min" line.

No migrations, no edge functions, no new dependencies.

## Verification

After build, I'll:
1. Open the recorder as a free-tier user, start a session, watch the pill tick down.
2. Fast-forward the local `duration` state via the browser console to hit the 5:00, 1:00, and 0:10 thresholds and confirm each toast + chime fires exactly once.
3. Refresh the page mid-cooldown and confirm the pill hydrates to the correct remaining value without flashing 20:00 first.