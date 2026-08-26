# MyRhythm — Data, Traceability & Deletion Standard

_Reference document. Version 1.0._

This is the permanent record of how MyRhythm keeps, traces and removes a person's
information. It covers three things that are deliberately linked: **traceability**,
**retention** and **deletion**.

Confidential — MyRhythm. Not for external distribution without written permission.

---

## 1. Principle

> Nothing a person relies on should disappear without warning, and nothing they
> remove should feel like a trap.

Two commitments follow from that:

1. **A step always knows where it came from** — even after the recording is gone.
2. **Routine removals are undoable; only genuinely permanent things ask twice.**

---

## 2. Traceability

### Reference codes

Every capture gets a short, human-readable reference at the moment it is created:

```
MB-260826-K4
│  │      └─ two random characters (unambiguous alphabet, no O/0/I/1)
│  └──────── date of the capture (YYMMDD)
└─────────── Memory Bridge
```

Steps extracted from that capture inherit the code with an ordinal:
`MB-260826-K4.1`, `MB-260826-K4.2`, and so on.

The code appears in three places, always rendered by one component
(`src/components/traceability/SourceRefLine.tsx`):

- the capture header in Memory Bridge
- each row of the Next Step Summary
- each calendar event created from a step

### Source states

The reference line carries a small coloured dot:

| Dot   | State        | Meaning                                                                   |
| ----- | ------------ | ------------------------------------------------------------------------- |
| Teal  | `available`  | The write-up is still in the app. Tapping the reference opens it.          |
| Gold  | `downloaded` | The person downloaded the source; the in-app copy has been tidied away.    |
| Grey  | `retired`    | The keep-for period passed. The summary card and reference remain.         |

### What survives forever

A **summary card** is stored on the capture and is never purged: title, date,
participants, the headline outcome and the list of step references. This is what
keeps a calendar event meaningful in five years' time, long after the audio and
the transcript are gone.

---

## 3. Retention — chosen by the person, not by us

Retention is a preference, not a legal checkbox. It is offered **after the first
recording**, not during onboarding, and can be changed at any time in Settings.

| Mode            | Audio                      | Write-up   | Summary card |
| --------------- | -------------------------- | ---------- | ------------ |
| **Light touch** | removed after processing   | 7 days     | kept         |
| **Balanced** (default) | 30 days             | 30 days    | kept         |
| **Full record** | 12 months                  | 12 months  | kept         |

Enforced in the database, not the client:

- `profiles.privacy_mode` holds the choice.
- `apply_retention_to_voice_recording()` stamps `expires_at` on every new recording
  from that choice.
- `cleanup_expired_voice_recordings()` runs on schedule and clears audio **and**
  transcripts, sets the source state to `downloaded` or `retired`, and never
  touches summary cards or reference codes.
- `recording_consent` records what the person agreed to and which retention
  period was in force at the time.

---

## 4. Deletion — three tiers

### Tier 1 — Undo-first (the default)

Industry standard (Material Design, NN/g): remove immediately, show a toast with
**Undo** for 10 seconds, commit afterwards. No dialog.

Applies to: extracted steps, Next Step rows, notes and encouragement, calendar
events, reminders, contacts, support-circle members, vision items, growth entries.

Wording: `Removed "<name>"` with **Undo**. Where the item came from a capture,
the description reassures rather than warns:

> Removed. Its reference code and source stay, so you can still trace it.

Implemented once, in `src/hooks/useUndoableDelete.ts`. Undo is only ever offered
where restoration is genuinely possible.

### Tier 2 — Confirm dialog

For a single item that cannot come back. One line, no jargon:

> This is permanent. It can't be recovered.

Applies to: deleting a recording early, deleting a transcript early, downloading-
then-removing a source, removing a capture entirely.

### Tier 3 — Type to confirm

For everything at once. The person types `DELETE`.

> This removes everything below and can't be undone. Type DELETE to confirm.

Applies to: delete my account, delete all my recordings, withdraw research
consent and purge contributions.

### Rule of thumb

If we can put it back, we do not ask. If we cannot, we say so plainly once.
Countdown language ("3 days left!") is avoided — it creates deadline anxiety.
Reassurance is used instead ("Your summary and reference stay either way").

---

## 5. Where this lives in code

| Concern                    | File                                              |
| -------------------------- | ------------------------------------------------- |
| Wording constants, tiers   | `src/lib/deleteStandard.ts`                       |
| Undo behaviour             | `src/hooks/useUndoableDelete.ts`                  |
| Retention preference       | `src/hooks/usePrivacyMode.ts`                     |
| Reference rendering        | `src/components/traceability/SourceRefLine.tsx`   |
| Retention enforcement      | Database functions listed in section 3            |

Any new destructive action must pick a tier from this document. Adding a fourth
pattern is a regression.
