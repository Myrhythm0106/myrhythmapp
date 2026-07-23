# Three fixes for /launch/assessment, document import, and results access

## 1. Duplicate banner on /launch/assessment

**What's happening:** `LaunchLayout` renders `LaunchPageHeader` (a "Back" row) at the top of the main content on every non-home page. `LaunchAssessment` then renders its *own* Back button inside both the recency phase and the questions phase — so users see two "Back" controls stacked, plus the persona label above the progress bar reads like a second banner.

**Fix:**
- In `LaunchAssessment.tsx`, remove the in-content Back buttons in the recency phase footer (line ~177–194) and questions phase footer, letting `LaunchPageHeader` be the single Back control.
- Replace the standalone footer with just the primary CTA ("Continue" / "Next" / "See my results").
- Give `LaunchPageHeader` a proper title on this route so it becomes the single header: pass `title="Your MyRhythm assessment"` via a small wrapper, OR add an optional `pageTitle` prop the assessment sets.
- Verify no other `/launch/*` page has the same double-header pattern; if it does, remove the duplicate there too.

## 2. Upload a schedule/report → extract actions → push to calendar

Reuse the Memory Bridge extraction pipeline instead of building a parallel one.

**New surface:** an "Import from document" card on `/launch/memory-bridge` (and a shortcut on `/launch/calendar` header).

**Flow:**
1. User uploads PDF / DOCX / image / plain text (drag-drop or file picker), max 20 MB.
2. File is sent to a new edge function `import-schedule-actions` which:
   - Parses text (pdf-parse for PDF, mammoth for DOCX, Tesseract via Lovable AI vision for images, raw text otherwise).
   - Calls Lovable AI Gateway (`google/gemini-2.5-flash`) with a strict JSON schema: `{ actions: [{ title, description, suggested_date, suggested_time, duration_minutes, category, priority_level, source_quote }] }`.
   - Inserts a lightweight row in `meeting_recordings` (type = `document_import`, `meeting_title` = filename) so extracted actions have a parent.
   - Inserts each action into `extracted_actions` with `status='pending'` and the AI's suggested schedule fields.
3. The existing `PostExtractionDialog` opens with the checklist ("Select all / X of Y selected") so the user reviews, edits inline, and clicks **Send to Calendar** — same flow already shipped for voice captures.
4. Skipped actions stay in the Actions tab for later; scheduled ones create `calendar_events` rows exactly like today.

**Storage:** private Supabase bucket `document-imports` (create via storage tool), 30-day retention matching voice recordings.

**Files:**
- new: `supabase/functions/import-schedule-actions/index.ts`
- new: `src/components/memoryBridge/DocumentImportCard.tsx`
- edit: `src/pages/launch/LaunchMemoryBridge.tsx` (mount the new card above the recorder)
- edit: `src/pages/launch/LaunchCalendar.tsx` (add "Import schedule" button in header that opens the same dialog)
- migration: add `source_type` column to `extracted_actions` (`voice` | `document`) so history is filterable; add storage bucket + RLS.

## 3. Assessment results: always available & editable

Today results only appear once on `/launch/welcome` right after the assessment; there's no persistent home for them.

**Add:**
- New route `/launch/results` (file `src/pages/launch/LaunchResults.tsx`) that:
  - Lists every row in `assessment_results` for the user, newest first, with taken-on date and headline MYRHYTHM snapshot.
  - Expands the latest into the same rich snapshot component already used on `/launch/welcome`.
  - Buttons: **Retake assessment** → `/launch/assessment`, **Update recency / notes** (inline edit of `event_recency` and `freeform_notes` on the latest row), **Download PDF** (existing snapshot export).
- Deep link from:
  - Home dashboard card ("Your MyRhythm snapshot" → View / Retake)
  - Profile page ("Assessment history")
  - You-Are-Here dial
  - Post-payment success screen ("Return to your results")
- Route registered in `src/launch/routes.ts` so the dial and nav pick it up.

## Technical notes

- Edge function must use `LOVABLE_API_KEY` gateway (already project default), handle 429/402 with clear toast.
- `import-schedule-actions` runs with `verify_jwt = false` but validates the caller's JWT in code, same pattern as `process-meeting-audio`.
- Assessment page fix is UI-only; no schema change.
- Results page reads existing `assessment_results` table (no new table). Inline edits use `.update()` on the latest row scoped by `auth.uid()` under existing RLS.

## Out of scope (call out for later)

- Automatic recurring imports (e.g. weekly clinic schedule email) — v0.2.
- Multi-assessment comparison graph — noted, not built in this pass.
