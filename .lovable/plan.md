# Two taps to a conversation

Today the orange mic button opens the capture sheet (tap 1), "Record" takes you to Memory Bridge (tap 2), and you still have to press the record circle (tap 3). Past conversations take even longer. This closes both to two taps.

## What changes

**Tap 1 — orange mic button (already on every page)**

**Tap 2 — one of:**

| Button in the sheet | What happens |
| --- | --- |
| Record | Memory Bridge opens and recording is already live. No Start button, no title prompt. |
| Last conversation | Opens the record of your most recent capture — summary, transcript and next steps — with its reference code and date on the button so you know which one it is. |
| Check in / Save to today | Unchanged. |

"All conversations" stays as a quiet link underneath for anything older.

## Recording straight away

- Recording begins the moment the page opens. A calm banner at the top says "Recording now" with the timer, plus **Pause** and **Discard**.
- A title is not asked for up front — it is auto-named by date and time and can be renamed afterwards on the saved record.
- If the microphone is blocked, denied, or the page is in a restricted frame, the existing status panel appears instead and explains what to do — it tries once, never loops.
- While recording, the orange mic button becomes a pulsing "Recording" button from anywhere in the app, so you can get back to it in one tap.

## Accuracy of what's captured

No change to how audio is transcribed or how next steps are extracted — this is purely about how fast you reach the recorder, so less of the conversation is missed while you navigate. Removing the third tap means capture starts seconds earlier, which is where most of the lost opening context comes from.

## Technical notes

- `src/components/launch/CaptureDock.tsx`: Record navigates to `/launch/memory?record=1`; add a "Last conversation" button fed by a lightweight query of the newest `meeting_recordings` row (id, title, reference_code, started_at) taken when the sheet opens, navigating to `/launch/memory?open=<recordingId>`. Add an "All conversations" text link. FAB reflects a global recording state.
- `src/pages/launch/LaunchMemoryBridge.tsx`: read `useSearchParams`; on mount, if `record=1` (keep `quick=1` as an alias) call the existing `handleStartRecording()` exactly once behind a ref guard, then strip the param with `replace: true`. If `open=<id>` is present, set `viewingActions` for that recording so the review surface opens directly. Auto-title when `recordingTitle` is empty.
- Recording-live state exposed via a small module-level store or context so `CaptureDock` can render the pulsing state without prop drilling.
- PWA shortcut and the Home/Start quick actions point at `?record=1` so an app-icon long-press is also two taps.
- No schema, backend, or extraction changes.
