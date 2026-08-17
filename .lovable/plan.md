# Live mic quality indicator + one source of truth for recording lengths

Two things: you should be able to see, while recording, that your voice is actually being picked up — and the app should hold one consistent set of recording-length rules everywhere.

## 1. Live recording quality indicator

While recording on Memory Bridge you currently see elapsed time and a byte counter. Bytes climbing tells you a file is growing, but not whether your voice is in it — a muted or dead mic can still produce a growing near-silent file.

Add a live level meter under the timer:

- **Peak/level bar** — a smooth horizontal meter driven by the real mic signal, updating ~20x/sec, plus a slowly-decaying peak marker so quiet-but-present speech is still visible.
- **Status line** with three plain-language states:
  - "Picking you up clearly" (healthy level)
  - "Very quiet — move closer or speak up" (low but non-zero)
  - "No sound reaching the mic" (silence for 3+ continuous seconds) — shown in a warning colour with a "Check microphone" hint
- **Silence detection**: if silence persists past ~8 seconds, an inline warning banner appears (not a toast that can be missed), telling you the recording is continuing but nothing is being heard.
- **Clipping hint**: if the signal is pinned at maximum, "That's a bit loud — back off slightly."
- Accessible: the status line is `aria-live="polite"`, the meter is decorative with the text carrying the meaning. Meter and text both work without colour alone.

This is read-only monitoring on the same mic stream — it does not change what gets recorded.

## 2. Recording lengths — three tiers, defined once

Today the length rules are duplicated in two recorder components, only know "free vs everything else", and are absent from the main Memory Bridge page. Proposed ladder, matching the pricing ladder (Free trial → Regular £15 → Founding £10 for life / Friends & Family £7.50):

| Tier | Per recording | Per week | Per month |
| --- | --- | --- | --- |
| Free (no subscription / trial expired) | 20 minutes | 1 hour | 4 hours |
| Regular (paid £15/mo) | 2 hours (120 min) | 10 hours | 40 hours |
| Founding Member (£10 for life) and Friends & Family (£7.50) | 4 hours (240 min) | 20 hours | 80 hours |

Active 7-day trial gets the Regular allowance, so nobody hits a 20-minute wall while evaluating.

**My view on totals:** yes — every tier should have a pool, and it should be a **monthly** pool with the weekly figure shown as a pacing guide, not a hard gate. A weekly hard cap punishes real life (three appointments land in one week, then nothing for a fortnight). So: the monthly total is the limit; the weekly number is guidance the egg timer can display. That also replaces the current 20-minutes-per-*day* free rule, which is stricter and more confusing than a monthly pool.

The founding tiers keep generous-but-finite numbers so "unlimited" never becomes an uncapped transcription bill — 80 hours a month is far beyond any realistic use, while still being a defined figure.

Work:

- Create a single `recordingLimits` config keyed by tier — free, regular, founding, friends_family — holding per-recording, weekly and monthly figures, read by both recorders and the Memory Bridge page.
- Bring the countdown to **Memory Bridge** (`/launch/memory`), which currently has no cap display at all: a "1:58:12 remaining (this recording)" pill, amber under 5 minutes, red under 1 minute, with the existing threshold chimes, and auto-stop at the cap so a long recording ends cleanly instead of failing.
- Before you start, a one-line "You can record up to 2 hours in one go — 32h left this month" (per tier).
- When a free or Regular user runs out, an upgrade line naming the next tier's lengths rather than a bare "limit reached".
- Retire the old 20-min/day free rule in favour of the monthly pool; save the ladder to project memory and reflect it in the pricing feature lists so marketing and code agree.

If any of these numbers should be different, tell me and I'll set them before building.


## 3. Egg timer — allowance at a glance, weekly or monthly

An hourglass-style dial on Memory Bridge (and in the capture sheet) showing how much recording allowance is left, in the period you choose.

- **Egg timer visual**: an hourglass whose sand level drops as allowance is used — full and calm when plenty remains, amber past 75% used, red past 90%. Centre reads plain time, e.g. "6h 20m left".
- **You pick the period**: a small Week / Month toggle above the timer. Your choice is remembered, so it opens on the view you think in.
- **Under the dial**: "of 10h this week · resets Monday" (or "resets 1 September"), so the number always has context.
- **Unlimited tiers** don't get a scary countdown — the hourglass shows a steady full state with "Unlimited — 3h 40m recorded this month", turning the same widget into a usage view rather than a limit.
- Tap the timer to expand a short breakdown: recordings made this period and total minutes, plus an upgrade line for free users.
- Accessible: time and period are text, `aria-live="polite"` on the remaining figure; the hourglass is decorative.

The weekly/monthly totals are aggregated from your existing recording usage records; no new tracking is introduced.

## Verify

- Start a recording with the mic muted: meter stays flat, "No sound reaching the mic" within ~3s, warning banner by ~8s.
- Speak normally: meter moves, status reads "Picking you up clearly".
- Recorder shows the correct remaining time for your tier and counts down; the pill turns amber then red near the cap.
- Egg timer: switch Week/Month, values change and the choice survives a reload; sand level drops after a recording completes.

## Technical notes

- New `src/hooks/useMicLevel.ts`: `AudioContext` + `AnalyserNode` on the existing `MediaStream`, RMS + peak per animation frame, throttled state updates, torn down with the stream. `useVoiceRecorder` exposes the active stream so the meter can tap it.
- New `src/components/memoryBridge/MicLevelMeter.tsx` for the bar + status line.
- New `src/config/recordingLimits.ts` holding per-tier session, daily, weekly and monthly caps; `MemoryBridgeRecorder.tsx`, `QuickCaptureRecorder.tsx` and `LaunchMemoryBridge.tsx` all read it.
- New `src/components/memoryBridge/RecordingEggTimer.tsx` (SVG hourglass with animated fill) plus a `useRecordingAllowance(period)` hook that sums `voice_recordings.duration_seconds` for the current week/month; period preference in `localStorage`. Existing `useRecordingLimits` daily logic stays as is.
- No database or edge function changes.

