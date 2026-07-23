# Two fixes: assessment header + document → calendar actions

## 1. Duplicate banner on `/launch/assessment`

**Cause:** `App.tsx` wraps `<LaunchAssessment />` in `<LaunchLayout>`, and `LaunchAssessment.tsx` also renders its own `<LaunchLayout>` internally — so the sticky header, Back row, and page chrome render twice.

**Fix:**
- Remove the outer `<LaunchLayout>` wrapper from the `/launch/assessment` route in `src/App.tsx` (keep the page's own layout, which is the richer one), OR remove the internal `<LaunchLayout>` from `LaunchAssessment.tsx` — whichever preserves the current visual. Pick the route-level unwrap so the page file stays self-contained like the other launch pages.
- Also remove the in-content secondary "Back" buttons in the recency and questions phases (footer areas ~line 177 and questions footer) so `LaunchPageHeader` (from `LaunchLayout`) is the single Back control.
- Leave the primary CTA ("Continue" / "Next" / "See my results") in place.

No schema change, UI-only.

## 2. Upload a schedule/report → extract actions → push to calendar

Reuse the Memory Bridge extraction pipeline so behaviour, review dialog, and smart-scheduling logic stay identical.

### Flow
1. User uploads PDF / DOCX / image / plain text (drag-drop or picker), max 20 MB.
2. Client uploads file to a new private storage bucket `document-imports`.
3. Client invokes new edge function `import-schedule-actions` with the storage path + filename.
4. Edge function:
   - Parses text (pdf-parse for PDF, mammoth for DOCX, Gemini vision for images, raw text for txt/md).
   - Calls Lovable AI Gateway (`google/gemini-2.5-flash`) with a strict JSON schema:
     `{ actions: [{ title, description, suggested_date, suggested_time, duration_minutes, category, priority_level, source_quote }] }`.
   - Inserts a parent row in `meeting_recordings` (`meeting_type='document_import'`, `meeting_title=filename`).
   - For each action, checks the user's existing `calendar_events` for that suggested date and shifts the `suggested_time` to the next open slot within the user's active hours (reuse smart-scheduling helpers from Memory Bridge). Stores original vs adjusted time in metadata.
   - Inserts each action into `extracted_actions` with `status='pending'`, `source_type='document'`, and the (possibly adjusted) schedule fields.
5. Client opens the existing `PostExtractionDialog` — same select-all checklist, inline edits of date/time/duration, and "Send to Calendar". Skipped items stay in Actions tab.
6. Confirmed items create `calendar_events` exactly like voice-captured actions.

### New surface
- Card **"Import from document"** at the top of `/launch/memory-bridge` (above the recorder).
- Shortcut button **"Import schedule"** in `/launch/calendar` header that opens the same upload dialog and, on success, opens `PostExtractionDialog` in-place.

### Files
- new: `supabase/functions/import-schedule-actions/index.ts` (JWT-verify-in-code, CORS, Zod input validation, gateway 402/429 handling)
- new: `src/components/memoryBridge/DocumentImportCard.tsx` (drag-drop + file picker, progress, error toast, reuses `FileValidator`)
- edit: `src/pages/launch/LaunchMemoryBridge.tsx` — mount `DocumentImportCard` above the recorder; on success, feed extracted action IDs into the existing `PostExtractionDialog`.
- edit: `src/pages/launch/LaunchCalendar.tsx` — add "Import schedule" header button that opens `DocumentImportCard` in a dialog.
- migration:
  - `ALTER TABLE public.extracted_actions ADD COLUMN source_type text NOT NULL DEFAULT 'voice';` (values: `voice` | `document`)
  - Create private storage bucket `document-imports` (via storage tool) + RLS on `storage.objects` restricting to `auth.uid()` folder prefix.
- secret: reuse `LOVABLE_API_KEY` (already present).

## Out of scope (deferred)
- Persistent `/launch/results` history page — will handle in a follow-up so this turn stays scoped.
- Automatic recurring imports (e.g. weekly clinic email) — v0.2.

## Technical notes
- Edge function runs `verify_jwt = false` (Lovable default) but validates the caller's JWT via `getClaims()` — same pattern as `process-meeting-audio`.
- Smart-scheduling collision check uses existing helpers; no new algorithm.
- `PostExtractionDialog` needs no changes — it already renders whatever `extracted_actions` rows are passed in.
- All existing RLS on `extracted_actions`, `calendar_events`, `meeting_recordings` continues to apply.
