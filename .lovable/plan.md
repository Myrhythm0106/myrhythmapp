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

| Tier | Per recording | Per day | Purpose |
| --- | --- | --- | --- |
| Free (no subscription / trial expired) | 20 minutes | 20 minutes total | Enough to feel the value on one appointment |
| Regular (paid £15/mo) | 60 minutes | unlimited sessions | Covers a full consultation or therapy session |
| Founding Member (£10 for life) and Friends & Family (£7.50) | 4 hours (240 min) | unlimited | Full-day capture — the founding-cohort benefit |

Active 7-day trial gets the Regular allowance (60 min), so nobody hits a 20-minute wall while evaluating.

Work:

- Create a single `recordingLimits` config keyed by tier — free, regular, founding, friends_family — that both recorders and the Memory Bridge page read from, so 20 / 60 / 240 exist in exactly one place.
- Bring the countdown to **Memory Bridge** (`/launch/memory`), which currently has no cap display at all: a "3:58:12 remaining (this session)" / "12:30 remaining (today)" pill, amber under 5 minutes, red under 1 minute, with the existing threshold chimes, and auto-stop at the cap so a long recording ends cleanly instead of failing.
- Before you start, a one-line "You can record up to 4 hours in one go" (per tier) so the length is known up front, not discovered at the limit.
- When a free or Regular user hits their cap, an upgrade line naming the next tier's length rather than a bare "limit reached".
- Save the ladder to project memory and reflect the recording lengths in the pricing feature lists so marketing and code agree.

If the 60-minute middle tier isn't the number you want, say the word and I'll swap it before building.


## Verify

- Start a recording with the mic muted: meter stays flat, "No sound reaching the mic" within ~3s, warning banner by ~8s.
- Speak normally: meter moves, status reads "Picking you up clearly".
- Recorder shows the correct remaining time for your tier and counts down; the pill turns amber then red near the cap.

## Technical notes

- New `src/hooks/useMicLevel.ts`: `AudioContext` + `AnalyserNode` on the existing `MediaStream`, RMS + peak per animation frame, throttled state updates, torn down with the stream. `useVoiceRecorder` exposes the active stream so the meter can tap it.
- New `src/components/memoryBridge/MicLevelMeter.tsx` for the bar + status line.
- New `src/config/recordingLimits.ts` holding per-tier session and daily caps; `MemoryBridgeRecorder.tsx`, `QuickCaptureRecorder.tsx` and `LaunchMemoryBridge.tsx` all read it. Existing `useRecordingLimits` daily-usage logic stays as is.
- No database or edge function changes.
