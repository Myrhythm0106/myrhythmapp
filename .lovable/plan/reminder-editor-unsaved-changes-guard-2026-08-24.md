# Reminder editor unsaved-changes guard

## UX rationale

Yes — asking "are you sure you want to discard unsaved changes?" is standard, familiar practice. It is the same pattern used by Google Docs, Notion, iOS Settings, and browser forms. For people with memory, stress, or brain-injury challenges it is especially important because it prevents accidental loss of work without blame. The guard is kept **low-friction**: it only appears when something has actually changed, the wording is reassuring rather than alarming, and the safe choice ("Keep editing") is the primary button so the user can recover from a mistake with one tap.



## What

The new Save/Cancel reminder editor can be closed by tapping **Cancel**, the **X**, or the backdrop. If the user has already changed presets or ticked rungs, that currently discards the draft without warning. This plan adds a confirmation prompt that only appears when there are unsaved changes.

## How it will work

1. **Detect dirty state** — `ReminderLadderPicker` already tracks `isDirty` by comparing the draft offsets to the loaded `initialOffsets`.
2. **Intercept the close path** — expose a new `onBeforeClose` callback from `ReminderLadderPicker` so the parent `ActionsViewer` can decide whether to close immediately or show the guard.
3. **Show a confirmation sheet** when `isDirty` and the user attempts to:
   - Tap **Cancel**
   - Click the dialog **X**
   - Tap the backdrop
   - Use the browser back gesture (if feasible)
4. **Confirmation copy**
   - Title: "Discard unsaved reminder changes?"
   - Body: "You've changed your reminder settings. If you close now, those changes won't be saved."
   - Primary action: "Keep editing" (closes the guard and leaves the editor open)
   - Secondary action: "Discard changes" (closes the editor and reverts to the previously saved settings)
5. **State management** — `ActionsViewer` will hold a local `showUnsavedGuard` flag. When the guard is dismissed, `ReminderLadderPicker` resets its draft to `initialOffsets` so the editor is clean if reopened later.

## Files to change

- `src/components/memoryBridge/ReminderLadderPicker.tsx`
  - Add `onBeforeClose` prop.
  - Call `onBeforeClose` instead of `onClose` directly from Cancel and when the component detects a close attempt.
  - Reset `offsets` to `initialOffsets` when the guard resolves to "discard".

- `src/components/memoryBridge/ActionsViewer.tsx`
  - Add `showUnsavedGuard` state and an inline confirmation dialog next to the existing reminder `Dialog`.
  - Wire the reminder dialog's `onOpenChange` through `onBeforeClose`.

## No other changes

- No database, edge function, or migration work.
- No changes to how reminders are saved or displayed on the calendar.
