# Live recording countdown — free (20 min/day) and premium (4h/session)

## Current state (verified)
- `MemoryBridgeRecorder.tsx` (lines 460–473) shows a **static** "X min remaining" badge for free tier only — hidden for premium.
- The value comes from `getRemainingDailyTime()` in `useRecordingLimits.ts`, computed from stored daily usage. It does NOT decrement while recording.
- `duration` (seconds elapsed) already ticks live from `useVoiceRecorder`.
- Premium users currently see only `MM:SS / MM:SS` at the top — no explicit "remaining" surfacing.

## Change

Turn the block into a **live countdown that ticks every second while recording** and show it for both tiers.

### Free tier (20 min/day cap)
- Label: **"Free time left today"**
- Live remaining = `max(0, remainingDailyMinutes*60 − duration)`
- Progress = `((dailyUsageMinutes*60 + duration) / (dailyLimit*60)) * 100`
- Display badge: `MM:SS` (so seconds visibly tick).
- Colour thresholds:
  - `> 5:00` → secondary
  - `1:00–5:00` → amber
  - `< 1:00` → destructive + pulse

### Premium / founding-comped (4h per-session cap)
- Show the same block (previously hidden).
- Label: **"Session time left"**
- Live remaining = `max(0, maxDuration − duration)` where `maxDuration = 240 min`.
- Progress = `duration / maxDuration * 100`.
- Display badge: `HH:MM:SS` for values ≥ 1h, else `MM:SS`.
- Colour thresholds:
  - `> 30:00` → secondary
  - `5:00–30:00` → amber
  - `< 5:00` → destructive + pulse
- No daily-usage bar (premium is per-session, unlimited daily).

### Shared behaviour
- Pause → counter freezes (duration stops incrementing — already handled).
- Auto-stop at zero uses existing `isOverLimit` guard.
- Idle (not recording): show the static full allowance so users see the cap up-front.

## Files touched
- `src/components/memoryBridge/MemoryBridgeRecorder.tsx` — un-gate the block from `tier === 'free'`, branch label / math / formatter by tier.
- `src/components/memoryBridge/QuickCaptureRecorder.tsx` — mirror the same block (add if absent) for consistency.

## Not changing
- Hook API (`useRecordingLimits`) — math stays in the component so it re-renders each second with `duration`.
- Daily-limit modal, upgrade prompts, storage/retention logic — untouched.

## Verification
- Free user recording: badge counts `20:00 → 19:59 → …`; turns red under 1 min; auto-stops at 0.
- Premium user recording: badge counts `4:00:00 → 3:59:59 → …`; amber at 30 min left; red at 5 min; auto-stops at 4h.
- Pause freezes both. Resume continues.
