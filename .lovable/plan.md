# Traceability, Retention & Delete Confirmation

Every action can be traced back to where it came from — for as long as it matters, even after the recording is gone. The user chooses how long we keep things, and nothing disappears without them saying so.

## 1. Reference codes — the traceability spine

Every Memory Bridge capture gets a short, human-readable reference: `MB-260825-A7` (source, date, suffix). Extracted steps inherit it as `MB-260825-A7.1`, `.2`, and so on.

The code appears in three places, identically:

- The capture header in Memory Bridge
- The reference column in My Next Step Summary
- A quiet source line under each calendar event

Tapping the code anywhere opens the same **Source Sheet**: what the capture was, when, who was there, the summary card, and the specific quote the step came from.

## 2. The source line on calendar events

A single muted line beneath the event title — a small state dot, the code, and one short phrase. Never more than one line, never competing with the event itself.

| Dot | Meaning | Line reads |
|---|---|---|
| Teal | Source available | `MB-260825-A7 · from my capture on 25 Aug` |
| Gold | Downloaded by me | `MB-260825-A7 · I downloaded this on 12 Sep` |
| Grey | Source retired | `MB-260825-A7 · source retired — summary kept` |

The grey state is the important one. The audio and transcript may be long gone, but the summary card and the originating quote remain, so the line never becomes a dead end.

## 3. Privacy modes — retention the user chooses

Chosen once during onboarding as a simple preference, changeable any time in Settings. Framed as "how long should I keep your recordings?", not as a legal notice.

| Mode | Audio | Transcript | Summary card + reference |
|---|---|---|---|
| **Light touch** | Deleted after transcription | 7 days | Kept |
| **Balanced** (default) | 30 days | 30 days | Kept |
| **Full record** | 12 months | 12 months | Kept |

**The summary card and reference code never expire in any mode.** This is the single decision that makes the whole thing work: a task in October still knows where it came from, whatever happened to the August audio.

Before anything is purged, a reminder at 5 days and 1 day offers a download. Downloading flips the source line to the gold "I downloaded this" state.

## 4. Deletes — undo first, confirm only when it's truly irreversible

The industry standard (NN/g, Material) is: don't interrupt routine actions; make them reversible. Confirmation dialogs are reserved for destruction that genuinely can't be walked back. Most mistaken deletes here come from fatigue or a mistaken tap, and an undo toast rescues those without adding a decision to every action.

**Tier 1 — Undo (the default, most deletes).** The item disappears immediately, and a toast appears: *"Removed 'Call the physio' · Undo"*, live for 10 seconds. No dialog. Used for: Memory Bridge step removal, Next Step item deletion, calendar action deletion, note deletion, gratitude journal swipe-to-delete, Support Circle member removal, community message removal.

Where the item came from a capture, the toast carries the reassurance instead of a warning: *"Removed. Its reference code and source stay, so you can still trace it."*

**Tier 2 — Confirm (irreversible, but a single item).** A dialog naming the item in quotes, with one plain line above the buttons: *"This is permanent. It can't be recovered."* Cancel is the first button; the confirm button uses the destructive colour. Used for: deleting a recording or its audio, deleting a transcript, disconnecting a calendar sync, removing a community member.

**Tier 3 — Type to confirm (everything at once).** Account deletion and "delete all my data" require typing DELETE, with an explicit list of what goes.

Undo is real, not cosmetic: the delete is deferred for the life of the toast, or performed and restored from the retained row. If we cannot honestly restore something, it belongs in Tier 2, not Tier 1.

**Sites that currently delete with no feedback at all**, all of which get at least an undo toast: Support Circle member removal, Memory Bridge step removal, calendar action deletion, calendar sync disconnect, note deletion, community message and member removal, and the gratitude journal swipe-to-delete.


## 5. Consent and documentation

- Explicit consent captured at first recording, with the chosen retention period named on screen.
- A retention schedule and DPIA written up in `docs/` — the artefacts a rehab centre or CQC-facing partner asks for by name.
- Account deletion removes everything, including research pseudonyms.

## Visible cost

Three quiet labels, one onboarding tap, one Settings row, and an undo toast where deletes were previously silent. Dialogs appear only for irreversible deletes. Everything else is backend. The app does not get busier.

## Technical notes

- Migration adds: `privacy_mode` on `profiles`; `reference_code`, `summary_card` (jsonb), `source_state` and `downloaded_at` on `meeting_recordings`; `reference_code` and `source_quote` on `extracted_actions`; a `recording_consent` table; retention columns keyed to the user's mode on `voice_recordings`.
- `cleanup_expired_voice_recordings` is extended to purge transcripts on the same schedule and to leave summary cards and reference codes untouched.
- Reference codes are generated on insert by a database function, unique per user.
- New components: `SourceRefLine` (the calendar and table line) and `SourceSheet` (the detail view).
- New `useUndoableDelete` hook: performs the delete after a 10s window (or performs then restores), renders the sonner toast with an Undo action, and cancels cleanly on unmount or repeat deletes.
- `useDeleteConfirmation` and `DeleteConfirmationDialog` already exist but are used in one place. They gain a `permanence` field and an optional `consequences` list, and get mounted once via a provider so any Tier 2/3 screen can call `confirmDelete(...)`. The wording strings live in one constants file.
- Confirm buttons keep the 56px minimum touch target.
- No change to what any delete ultimately does to the data — only to timing and feedback.
