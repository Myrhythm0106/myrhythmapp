# Owner email on Next Step Summary — send it straight to their diary

Today the "Assigned" column is just a name, so when an action belongs to someone else nothing reaches them. This adds an email to the owner, so scheduling the action puts it in their diary too.

## What changes

- The **Assigned** cell becomes name + email. Tap it and you can either:
  - pick someone from my Support Circle (their email comes with them), or
  - type a name and an email by hand.
- The cell shows the name, with a small envelope tick when an email is on file and a quiet "no email — they won't get this" hint when it isn't.
- When the action is scheduled, the owner is treated as an invitee: they get the same calendar invitation email with an attachment their calendar app can accept, exactly like looped-in people do today.
- The owner is never double-invited if they are also a watcher.
- Owner email is optional everywhere — an action with no owner email behaves exactly as it does now.

## Behaviour

- Saving the email is instant (same inline-save pattern as Priority and Status), with a quiet confirmation and rollback if it fails.
- Invalid email addresses are rejected inline; the previous value comes back.
- The confirmation sheet after committing lists the owner alongside anyone else who was told.
- If the invite can't be delivered, the owner's name appears in the existing "couldn't reach" line rather than failing the schedule.

## Technical notes

- Migration: add `owner_email text` to `public.extracted_actions` (nullable, no other schema change).
- `src/components/memoryBridge/ActionsTableView.tsx`: extend the Assigned cell to an owner popover (Support Circle list from `useAccountabilitySystem` + manual name/email fields, zod email validation); new optional prop `onOwnerChange(actionId, { assigned_to, owner_email })`.
- `src/components/memoryBridge/ActionsViewer.tsx`: route through the existing `handleFieldChange` optimistic write.
- `src/components/memoryBridge/capture-brief/model/scheduleFromMeeting.ts`: when `row.owner_email` is set, push a `PersonPick` with `role: 'invite'`, `pre: 'manual'`, deduped against watcher and ad-hoc emails; existing `send-event-invitation` function already builds the ICS and sends it, so no edge-function change.
- `src/types/memoryBridge.ts`: add `owner_email?: string`.
