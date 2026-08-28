# Who's involved — everyday-language accountability on My Next Step Summary

Add clear accountability to every next step — who does it, who signs it off, who is asked first, who is kept in the loop — in plain everyday words that clinicians, family and colleagues all understand at a glance, without making the table heavier to read.

## The four roles, in everyday words (RACI underneath)

No acronyms on screen as the primary language. Each role shows its everyday label first; the small R/A/C/I letter sits beside it as a quiet secondary tag for anyone who knows the standard.

- **Does it** (Responsible) — the person doing it. This is the existing Owner column (name + optional email). No change to how it works.
- **Signs it off** (Accountable) — one person who confirms it's done properly. Defaults to me.
- **Ask first** (Consulted) — people asked for input before it's done.
- **Keep in the loop** (Informed) — people told once it's scheduled or done.

Only one "Signs it off" person per action (enforced in the picker); "Ask first" and "Keep in the loop" can be several people.

## How it looks and behaves (SMART, not overwhelming)

- The table keeps one **Who's involved** column showing small initial chips: the person doing it, the sign-off person, then `+2` for the rest. Nothing new is added visually beyond that single column.
- Tapping the chips opens a compact **Who's involved** sheet with four plainly labelled rows (Does it / Signs it off / Ask first / Keep in the loop), each with a one-line helper: "Asks for their input before it's done." Every row picks from the Support Circle (name + email already on file) or accepts a typed email address for anyone outside the circle — useful for medical staff who aren't in the circle.
- Email is optional for "Does it" and "Signs it off", required for anyone you want to notify. Invalid emails are flagged inline before saving.
- Draft state with **Save / Cancel** and an unsaved-changes confirm, matching the reminder editor pattern already in the app.
- Sensible defaults so nothing needs filling in: Does it = the extracted owner, Signs it off = me, the other two empty.

## Sending the details immediately

- The sheet has a **Send details now** switch (on by default when at least one email exists).
- On save, everyone with an email gets one email per action containing: the action text, its reference code, start/end dates, priority, the success criteria, the source conversation reference, and their role in one plain line — e.g. "You're asked first on this step" or "We'll keep you in the loop on this step".
- A **Send to everyone** button on the table header sends the current view's actions in a single digest email per person, so you can brief a whole meeting's output in one tap.
- Each send is logged on the action so the table can show "Sent 28 Aug" and avoid accidental duplicate sends.
- Anyone marked "Does it" or "Signs it off" with an email is also carried through to the calendar invite when the action is scheduled, reusing the existing invitation flow.

## Technical notes

- Migration on `public.extracted_actions`: add `accountable` (jsonb: name/email), `consulted` (jsonb array), `informed` (jsonb array), `raci_notified_at` (timestamptz). Existing `assigned_to` / `owner_email` stay as Responsible. Defaults `'[]'::jsonb` / null so existing rows are valid; no backfill needed. RLS is unchanged (owner-scoped policies already cover the table).
- Everyday labels are the single source of truth in `src/config/actionRoles.ts` (label, helper line, RACI letter, email wording) so the sheet, table chips and emails can never drift apart.
- New component `src/components/memoryBridge/WhosInvolvedCell.tsx` plus a sheet dialog; reuses `useAccountabilitySystem()` for Support Circle options and the existing `LoopInPicker` styling language.
- `ActionsTableView.tsx`: replace the current Owner + Support columns with the single Who's involved column, wire `onRaciChange`, and add the header "Send to everyone" action.
- New edge function `send-action-raci` (modelled on `send-action-reminders` / `send-email`, Resend): accepts action ids + recipient roles, composes the per-person digest in everyday wording, writes `raci_notified_at`. Uses the existing `RESEND_API_KEY`.
- `scheduleFromMeeting.ts`: include Signs-it-off and Ask-first emails as invitees alongside the current owner email.
