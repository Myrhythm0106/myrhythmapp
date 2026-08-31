# Memory Bridge: confirm before deleting, and speak up when something's wrong

## What's happening today (checked in the code)

- In the review step (`ReviewStep.tsx`), tapping the bin icon on a next step deletes it **immediately** — no confirmation, no undo. If the database delete fails, nothing is shown at all: the row vanishes on screen but still exists.
- There is **no way to delete a recording** anywhere in Memory Bridge.
- Recording and upload already have good error messages. What's missing is feedback on the **editing** side: blank step text, a finish date before the start date, a badly typed email address, or a save that silently fails.

## Part 1 — Delete with a confirmation

Follow the app's existing three-tier delete standard rather than inventing new behaviour.

**Removing a single next step (review table and phone cards)**
- Tap the bin → a short confirmation appears: "Remove this step?" with the step's own wording quoted back, plus **Remove** and **Keep it**.
- After removing, an **Undo** toast stays for 10 seconds — tap it and the step comes back.
- If the delete genuinely fails, the step reappears and a clear message says so.
- Reference codes and the source conversation are untouched, so traceability holds.

**Deleting a recording (new)**
- Add a discreet delete option on each recording in the recordings list.
- Because this is permanent, it uses a full confirmation dialog: it names the recording, states plainly that the audio, transcript and its extracted steps go with it, and requires an explicit **Delete permanently**.
- Any steps already scheduled in the diary are called out in the dialog before you confirm.

## Part 2 — Tell me when something's been done incorrectly

Add plain, kind messages wherever an edit can go wrong:

- **Empty step text** — can't be saved; the field is marked and says "A next step needs some words."
- **Finish date before start date** — flagged on the spot: "The finish date is before the start date."
- **Date in the past** when scheduling — a gentle warning, not a block.
- **Badly typed email** in Who's Involved / owner email — "That email doesn't look right" before it's accepted, so invites don't silently fail.
- **Nothing selected** when committing steps to the diary — "Tick at least one step first" instead of a dead button.
- **Save failed** — any database write that errors now shows a message and puts the screen back to what's actually stored, instead of showing a change that never saved.

All messages are short, first-person in tone, non-alarming, and never blame the person.

## Technical notes

- Reuse `AlertDialog`, `useUndoableDelete`, and the wording in `src/lib/deleteStandard.ts` — no new patterns.
- Files touched: `src/components/memoryBridge/review/ReviewStep.tsx` (confirm + undo + validation), `src/components/memoryBridge/RecordingsTab.tsx` and the recordings list in `src/pages/launch/LaunchMemoryBridge.tsx` (recording delete), `src/components/memoryBridge/WhosInvolvedCell.tsx` and `ActionsTableView.tsx` (email and date validation).
- Recording deletion removes the storage object, the `meeting_recordings` row and its `extracted_actions`, with errors surfaced rather than swallowed.
- No schema changes.
