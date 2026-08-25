# Confirm Before Deleting — Everywhere

Right now deletion is inconsistent. Some places ask first, most don't, and almost none say whether the thing is gone for good or just tidied away. This makes one confirm pattern and applies it to every destructive action in the app.

## The rule

Every action that removes something follows the same three beats:

1. **Ask first** — a confirmation dialog naming the exact item.
2. **Say how permanent it is** — one plain line, always present.
3. **Confirm it happened** — a toast after it completes, with Undo where we can offer it.

## Three levels of permanence

The dialog wording changes based on what actually happens to the data. No guessing — each delete site is tagged with one of these.

| Level | Wording shown | Used for |
|---|---|---|
| **Permanent** | "This is permanent. It can't be recovered." | Recordings, transcripts, calendar events, notes, support-circle members, account deletion |
| **Reversible for a short time** | "Removed now — you have 10 seconds to undo." | Removing a step during Memory Bridge review |
| **Removed but traceable** | "The step goes, but its reference code and source link stay so you can still trace where it came from." | Next Step items that came from a Memory Bridge capture |

The permanence line sits directly above the buttons in its own muted row with a small icon, so it reads as information rather than alarm. For permanent deletes the icon and the confirm button use the destructive colour; for the other two levels the dialog stays neutral so routine tidying doesn't feel like a warning.

## What changes

### A shared confirm hook and dialog

`useDeleteConfirmation` and `DeleteConfirmationDialog` already exist but are only used in the voice recordings list. Both get extended and then reused everywhere:

- Add a `permanence` field (`permanent` / `undoable` / `traceable`) that drives the wording line and the colour.
- Add an optional `consequences` list for cases with knock-on effects worth naming (for example: deleting a capture also removes its transcript).
- Add an `itemName` that is always shown in quotes so the user can see exactly what they're about to lose.
- Mount the dialog once via a provider so any screen can call `confirmDelete(...)` without wiring its own dialog.

### Sites to wire up

**Currently delete with no confirmation at all:**
- Support Circle — removing a member (`LaunchSupportCircle`, both the list and card views)
- Memory Bridge review — removing an extracted step (`ReviewStep`)
- Calendar — deleting an action (`ActionItemDetailed`)
- Calendar sync — disconnecting a linked calendar (`CalendarSyncSettings`)
- Notes — deleting a note (`useItemNotes`, plus the Notes page)
- Community — deleting a message, removing a member
- Gratitude journal — deleting an entry (currently deletes on swipe with only a toast afterwards)

**Already confirm, but need the permanence line and consistent wording:**
- Voice recordings list
- Settings — recording deletion
- Reminder editor unsaved-changes guard (keeps its own wording; only the button styling aligns)

**Needs the strongest treatment:**
- Account deletion, and any "delete all my data" control — these get a type-to-confirm step where the user types DELETE, plus an explicit list of everything that goes.

### Swipe-to-delete

The gratitude journal deletes on a left swipe with no prompt, which is easy to trigger by accident. Swipe will open the confirm dialog rather than deleting outright.

### Toast after the fact

Every completed delete shows a confirmation toast. Where the underlying operation is a soft delete or we hold the row briefly, the toast carries an **Undo** button. Where it's genuinely gone, the toast says so plainly.

## Technical notes

- `DeleteConfirmationDialog` gains `permanence`, `consequences?: string[]` and keeps its existing `title` / `description` / `itemName` props; the description template continues to interpolate `{itemName}`.
- A `DeleteConfirmationProvider` mounts a single dialog at the app root and exposes `confirmDelete(item, onConfirm)` through context, so call sites only need the hook.
- The three permanence strings live in one constants file so the wording stays identical across screens.
- Confirm buttons keep the 56px minimum touch target and Cancel is always the left/first action.
- No database or RLS changes. This is presentation and interaction only — the existing delete queries are unchanged.

## Out of scope

- Changing what any delete actually does to the data.
- The retention and traceability work (reference codes, source cards, privacy modes) already covered by the previous plan.
