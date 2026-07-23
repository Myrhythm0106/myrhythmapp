## Goal
Add a hard-stop accuracy confirmation before actions are pushed to the MyRhythm calendar, and record an audit trail of document approval + deletion.

## 1. Accuracy confirmation checkbox (`PostExtractionDialog.tsx`)
- Add local state `confirmedAccurate` (default `false`), shown only when `sourceFilePath` is present (i.e. the actions came from an uploaded document).
- Render a required checkbox just above the "Send N to calendar" button:
  - Label: **"I confirm these actions are accurate and match my document."**
  - Helper line: "Ticking this approves the actions and permanently deletes the uploaded document."
- Disable the "Send N to calendar" button when `sourceFilePath` is set and `confirmedAccurate` is `false` (in addition to the existing `noneSelected` / `isScheduling` guards).
- Keep behaviour unchanged for non-document flows (voice-only extractions) — no checkbox required.

## 2. Audit log of approval + deletion
- New table `public.document_import_audit` (RLS: user owns rows):
  - `user_id`, `meeting_id`, `file_path`, `file_name` (nullable), `actions_sent_count`,
  - `approved_at`, `deleted_at` (nullable), `deletion_status` (`deleted` | `failed` | `not_applicable`), `deletion_error` (nullable).
- On "Send to calendar" in `PostExtractionDialog.handleSendSelected`:
  1. Await `onAcceptAndScheduleAll(...)` as today.
  2. Insert an audit row with `approved_at = now()` and `actions_sent_count = selectedIds.size`.
  3. Attempt `storage.remove([sourceFilePath])`; update the same row with `deleted_at` + `deletion_status` (`deleted` or `failed` + error message).
- Thread the source `file_name` from the extraction result through `LaunchMemoryBridge.tsx` and `LaunchCalendar.tsx` into the dialog so the audit row is human-readable. (`sourceFilePath` already flows through.)

## 3. Surface the audit (lightweight)
- Add a small "Document approved and deleted on {date}" confirmation toast/line after successful send, so the user sees the audit event happened.
- No new UI page in v0.1 — the table is queryable for support/compliance. A "Document history" view can land in v0.2 if you want it visible in-app.

## Technical notes
- Migration includes the mandatory `GRANT` block (`authenticated` + `service_role`) and RLS policies scoped to `auth.uid() = user_id`.
- Deletion still happens client-side (same code path as today); the audit row captures both success and failure so a failed delete is not silent.
- No changes to the `import-schedule-actions` edge function.

## Out of scope (defer to v0.2)
- Clinician-facing approval log, signed PDFs, or in-app "Document history" page — these belong with the Discharge Bridge Kit.