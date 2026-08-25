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

## 4. Delete confirmation — nothing goes silently

Every action that removes something follows the same three beats:

1. **Ask first** — a dialog naming the exact item in quotes.
2. **Say how permanent it is** — one plain line, always present, directly above the buttons.
3. **Confirm it happened** — a toast afterwards, with Undo where we can genuinely offer it.

Three levels of permanence, so the wording always matches what actually happens:

| Level | Wording | Used for |
|---|---|---|
| **Permanent** | "This is permanent. It can't be recovered." | Recordings, transcripts, calendar events, notes, Support Circle members, account deletion |
| **Reversible briefly** | "Removed now — you have 10 seconds to undo." | Removing a step during Memory Bridge review |
| **Removed but traceable** | "The step goes, but its reference code and source link stay, so you can still trace where it came from." | Next Step items that came from a capture |

Permanent deletes use the destructive colour on the icon and confirm button. The other two stay neutral so routine tidying doesn't feel like an alarm. Cancel is always the first button. Account deletion and "delete all my data" additionally require typing DELETE, with an explicit list of everything that goes.

**Sites that currently delete with no prompt at all**, all of which get one: Support Circle member removal, Memory Bridge step removal, calendar action deletion, calendar sync disconnect, note deletion, community message and member removal, and the gratitude journal swipe-to-delete.

## 5. Consent and documentation

- Explicit consent captured at first recording, with the chosen retention period named on screen.
- A retention schedule and DPIA written up in `docs/` — the artefacts a rehab centre or CQC-facing partner asks for by name.
- Account deletion removes everything, including research pseudonyms.

## Visible cost

Three quiet labels, one onboarding tap, one Settings row, and confirm dialogs where there were none. Everything else is backend. The app does not get busier.

## Technical notes

- Migration adds: `privacy_mode` on `profiles`; `reference_code`, `summary_card` (jsonb), `source_state` and `downloaded_at` on `meeting_recordings`; `reference_code` and `source_quote` on `extracted_actions`; a `recording_consent` table; retention columns keyed to the user's mode on `voice_recordings`.
- `cleanup_expired_voice_recordings` is extended to purge transcripts on the same schedule and to leave summary cards and reference codes untouched.
- Reference codes are generated on insert by a database function, unique per user.
- New components: `SourceRefLine` (the calendar and table line) and `SourceSheet` (the detail view).
- `useDeleteConfirmation` and `DeleteConfirmationDialog` already exist but are used in only one place. They gain a `permanence` field and an optional `consequences` list, and get mounted once via a provider so any screen can call `confirmDelete(...)`. The three permanence strings live in one constants file.
- Confirm buttons keep the 56px minimum touch target.
- No change to what any delete actually does to the data — that part is presentation only.
