# Permanent mic: Quick Start first, details after

## What changes for the user
Today, tapping the orange mic opens a "Capture" panel with a typing box first — recording is a second tap away and it asks for thought before anything is captured.

New behaviour:
1. **Tap the mic → a small panel with one big button: "Start recording now"** (top, largest, orange). Underneath, two quieter options: "Type a quick note" and "My last conversation".
2. **Recording starts immediately** — no title, no questions. The live "Listening · 0:42 · Stop" pill stays visible on every page (already exists).
3. **After Stop → "Add details (optional)" card** with anything worth capturing, all pre-filled or skippable:
   - Name for this conversation (suggested: "Conversation · 30 Sep, 11:34")
   - Who was there (optional, from Support Circle / contacts)
   - What happens next: Actions only / Full write-up / Just save (defaults to the user's usual choice)
   - Buttons: **Save** (primary) and **Skip — save as it is**
4. Then the captured result shows as normal (write-up and actions when ready), with its reference code.

Max 3 choices per screen, 56px buttons, Light Linen styling to match /start (replacing the old white/purple-toned panel).

## Technical details
- `src/components/launch/CaptureDock.tsx`: reorder `CaptureSheet` — primary "Start recording now" navigates to `/launch/memory?record=1&quick=1`; typing box moves behind "Type a quick note" (expands inline). Restyle with launch tokens (`launch-ink`, `launch-linen`, `launch-teal`, ember for live).
- Memory Bridge recorder page: when `quick=1`, auto-start recording without the pre-record setup step (title/participants/output mode skipped, defaults applied: auto title, user's last `output_mode`).
- On stop in quick mode: show a post-capture "Add details" step that updates `meeting_recordings` (`meeting_title`, participants, `output_mode`) before/while `process-meeting-audio` runs; Skip keeps defaults. Output mode stays enforced server-side as today.
- Verify on 393px: mic → 1 tap to start → Stop → details → saved result visible in Diary.
