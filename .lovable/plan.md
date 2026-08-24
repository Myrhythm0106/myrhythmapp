# Reminder picker: Save and Cancel

## What changes

Today the reminder panel saves the moment you tap a preset or tick a rung — there is no way to back out. It becomes a normal edit-then-confirm panel:

- Your taps only change a draft on screen; nothing is written until you press **Save reminders**.
- **Cancel** closes the panel and throws the draft away, leaving the previous setting untouched.
- Save stays disabled until something actually changed, and shows a spinner while saving.
- Closing the dialog with the X or by tapping outside behaves like Cancel.

## Your second question: does the selection show in the calendar?

Yes — it already does, from the work in the last change:

- Every reminder you set becomes a nudge marker in the Calendar: a dashed row on the Day view at its time, and a small bell on the Week and Month views for any day carrying nudges.
- Tapping a nudge opens a sheet where you can mark the step done, turn its nudges off, or jump to Memory Bridge.
- The bell button in the Calendar header hides or shows the nudge layer.
- Nudges are markers only — they never create duplicate calendar events, and they need a finish date on the step to be counted from.

One thing to be aware of: nudges appear as soon as they are saved, so with Save/Cancel added, the calendar will update on Save rather than on every tap. That is the intended behaviour.

## Technical detail

- `src/components/memoryBridge/ReminderLadderPicker.tsx`: hold `offsets` as a draft, keep the loaded value as `initialOffsets`, drop the per-tap `persist` call. Add a footer with Cancel (secondary) and Save reminders (primary), both min 56px tall. Save calls `saveActionReminders`, fires `onSaved`, toasts, then calls a new `onClose` prop. Dirty check compares sorted draft to sorted initial.
- Add optional `onCancel` / `onClose` props so the dialog owner closes it.
- `src/components/memoryBridge/ActionsViewer.tsx` (~line 984): pass `onClose={() => setRemindersTarget(null)}` to the picker; `onSaved` keeps calling `refreshLadders()`.
- No database or edge-function changes.
