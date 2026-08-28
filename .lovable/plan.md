# RACI on My Next Step Summary

Add clear accountability to every next step — who does it, who signs it off, who is asked, who is kept in the loop — without making the table heavier to read.

## The RACI model, in plain words

- **Responsible (R)** — the person doing it. This is the existing Owner column (name + optional email). No change to how it works.
- **Accountable (A)** — one person who signs it off. Defaults to me.
- **Consulted (C)** — people asked for input before it's done.
- **Informed (I)** — people told once it's done or scheduled.

Only one A per action (enforced in the picker), C and I can be several people.

## How it looks and behaves (SMART, not overwhelming)

- The table keeps one **Accountability** column showing small initial chips: `R` avatar, then `A`, then `+2` for C/I. Nothing new is added visually beyond that single column.
- Tapping the chips opens a compact **RACI sheet** with four rows (R, A, C, I). Each row picks from the Support Circle (name + email already on file) or accepts a typed email address for anyone outside the circle.
- Email is optional for R and A, required for anyone you want to notify. Invalid emails are flagged inline before saving.
- Draft state with **Save / Cancel** and an unsaved-changes confirm, matching the reminder editor pattern already in the app.
- Sensible defaults so nothing needs filling in: R = the extracted owner, A = me, C and I empty.

## Sending the details immediately

- The RACI sheet has a **Send details now** switch (on by default when at least one email exists).
- On save, everyone with an email gets one email per action containing: the action text, its reference code, start/end dates, priority, the success criteria, the source conversation reference, and their RACI role in one line ("You are Consulted on this step").
- A **Send to all** button on the table header sends the current view's actions in a single digest email per person, so you can brief a whole meeting's output in one tap.
- Each send is logged on the action so the table can show "Sent 28 Aug" and avoid accidental duplicate sends.
- Anyone marked Responsible or Accountable with an email is also carried through to the calendar invite when the action is scheduled, reusing the existing invitation flow.

## Technical notes

- Migration on `public.extracted_actions`: add `accountable` (jsonb: name/email), `consulted` (jsonb array), `informed` (jsonb array), `raci_notified_at` (timestamptz). Existing `assigned_to` / `owner_email` stay as Responsible. Defaults `'[]'::jsonb` / null so existing rows are valid; no backfill needed. RLS is unchanged (owner-scoped policies already cover the table).
- New component `src/components/memoryBridge/RaciCell.tsx` plus a `RaciSheet` dialog; reuses `useAccountabilitySystem()` for Support Circle options and the existing `LoopInPicker` styling language.
- `ActionsTableView.tsx`: replace the current Owner + Support columns with the single Accountability column, wire `onRaciChange`, and add the header "Send to all" action.
- New edge function `send-action-raci` (modelled on `send-action-reminders` / `send-email`, Resend): accepts action ids + recipient roles, composes the per-person digest, writes `raci_notified_at`. Uses the existing `RESEND_API_KEY`.
- `scheduleFromMeeting.ts`: include Accountable and Consulted emails as invitees alongside the current owner email.
