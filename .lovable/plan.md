## Scope

Three new items only. Already-shipped v0.1 work (freemium reveal, Memory Bridge upgrades, clinician PDF, `useLaunchMode` fix, "Bring a witness" v0.2 flag) stays as-is.

---

## 1. Sign-in fix (blocker)

**Root cause:** `LaunchRegister.tsx` has `BYPASS_REGISTRATION = true` — signup only writes `myrhythm_mock_user` to `localStorage`; no real Supabase user exists, so `LaunchSignIn` correctly rejects the login.

**Changes**
- `src/pages/launch/LaunchRegister.tsx`: flip `BYPASS_REGISTRATION = false`; keep the "Check your email" screen; add an **"I've verified — sign in now"** CTA that navigates to `/launch/signin` with `state: { email }`.
- `src/pages/launch/LaunchSignIn.tsx`:
  - Read `location.state.email` on mount and prefill the email field.
  - Match Supabase's `"Email not confirmed"` string to trigger the existing resend block.
  - On `"Invalid login credentials"`, show inline helpers: **"No account? Create one"** + **"Registered but not verified? Resend verification"**. Keep the Magic Link button.
- **Supabase Auth setting (dashboard toggle, no code):** recommend turning **off** "Confirm email" in Auth → Providers → Email during testing so signup → sign-in is instant. Turn back on before public launch.

---

## 2. Zero-cost payment path (Access Code gate)

No Stripe, no real cards during testing. Payment surface stays; it just checks a code.

**Data (single migration)**
- `founding_access_codes`: `code` (unique), `max_uses`, `uses_remaining`, `active`, timestamps. RLS: no direct client SELECT; only the RPC reads.
- `redeem_founding_code(p_code text)` SECURITY DEFINER: validates code, decrements `uses_remaining`, sets `profiles.founding_comped = true`, inserts `subscriptions` row (`plan_type='founding_comped'`, `status='active'`). Returns `{ success, error? }`.
- Seed codes (e.g. `FOUNDING2026`, `TESTER01`–`TESTER10`) via `supabase--insert`.

**UI**
- Payment surface (`LaunchPayment.tsx` / `MVPPaymentPage.tsx` — confirm on read): replace Stripe CTA with an **Access Code** input + "Unlock Founding Access" button that calls the RPC. Success → route to `/launch/welcome`. Invalid/exhausted → inline error.
- Existing `get_user_subscription_status()` already returns `founding_comped`; downstream gating just works.

**Founding pricing copy**
- `src/config/pricing.ts`: bump `launchDate` forward (e.g. `2026-08-01`) so `isFoundingMemberActive()` returns true and reveal + payment screens render **"Become a Founding Member — £{price}/mo"**.

**When v1 ships:** swap the access-code panel for real Stripe checkout. Same `subscriptions` row shape, no other code changes.

---

## 3. Deloitte/Bain-tier capture + transcripts

Plumbing exists (`meeting_recordings`, `extracted_actions`, `TranscriptEditor`, `buildCaptureBrief`, PDF/DOCX/XLSX/Clinician exporters, AssemblyAI live). This tier is deliverable quality + export options + reliability — not new AI.

**A. Recording reliability**
- `src/hooks/memoryBridge/useRealtimeTranscription.ts`: switch capture from `MediaRecorder` timeslices to Web Audio API PCM → WAV upload. Kills iOS Safari corrupted-webm 400s.
- Surface AssemblyAI **speaker diarization** ("Speaker 1 / Speaker 2") in `parseTranscriptTurns`.
- `TranscriptEditor` already has a confidence badge (keep) and low-confidence warning (keep). Add a small **"Edit history (last 5)"** dropdown backed by the new `transcript_revisions` table.

**B. Deliverable formats — Word / Excel / Google-ready**

Existing `.docx` files open natively in **Microsoft Word AND Google Docs** (File → Open → Upload). Existing `.xlsx` files open natively in **Microsoft Excel AND Google Sheets** the same way. No new export code is needed for cross-suite compatibility — only the UI needs to say so.

Format picker in `CaptureDeliverableView`:
1. **Executive Summary — Word / Google Docs (.docx)** — 1-page polish over existing DOCX exporter. "So what?" card + top 3 decisions + top 3 actions with owners/dates. Persona-aware register via `usePersona`.
2. **Full Annotated Transcript — PDF** — new exporter. Verbatim, speaker-labelled, timestamped, with margin colour codes: decisions (blue), actions (green), open questions (amber), watch-outs (red). Colours mapped from existing `extracted_actions.category`. *(New: `exporters/annotatedTranscriptPdf.ts`.)*
3. **Action Register — Excel / Google Sheets (.xlsx)** — polish the existing `xlsx.ts` exporter: Action, Owner, Due, Priority, Confidence, Two-minute starter, Source quote. Already opens in both suites.
4. **Clinician One-Pager — PDF** — already shipped; unchanged.
5. **Copy actions as table (clipboard)** — new small button. Tab-separated `Action \t Owner \t Due \t Priority` — pastes straight into Word, Excel, Google Docs, Google Sheets, Slack, email. No download, no auth, instant.

**Helper text under the export panel:**
> *"Word and Excel files download to your device. To use them in Google Docs or Google Sheets, open Drive and upload the file (File → Open → Upload)."*

**Deliberately NOT in v0.1:** per-user Google Drive OAuth ("Send to my Drive"). Wrong shape for testing (each tester would need to authorise Google), adds an auth surface, and adds no capability beyond File → Open. Deferred to v1.

**C. Defensible edits**
- New `transcript_revisions` table (`meeting_id`, `user_id`, `previous_transcript`, `new_transcript`, `created_at`) + RLS scoped to owner.
- `TranscriptEditor` writes a revision row on save; "Edit history (last 5)" dropdown reads it.

**D. Professional footer**
- All four exports render a footer strip: `Prepared by MyRhythm · Confidence {avg}% · {date}` above the existing 3pt confidentiality line (per project standard).

---

## Files touched

- `src/pages/launch/LaunchRegister.tsx`
- `src/pages/launch/LaunchSignIn.tsx`
- `src/pages/launch/LaunchPayment.tsx` (or `MVPPaymentPage.tsx` — confirm on read)
- `src/config/pricing.ts` (launchDate bump)
- `src/hooks/memoryBridge/useRealtimeTranscription.ts` (WAV/PCM path)
- `src/components/memoryBridge/TranscriptEditor.tsx` (Edit history dropdown; revision write on save)
- `src/components/memoryBridge/capture-brief/CaptureDeliverableView.tsx` (renamed export buttons + helper text + "Copy actions as table")
- `src/components/memoryBridge/capture-brief/exporters/pdf.ts`, `docx.ts`, `xlsx.ts` (exec-summary polish + footer strip)
- `src/components/memoryBridge/capture-brief/exporters/annotatedTranscriptPdf.ts` (new)
- `src/components/memoryBridge/capture-brief/exporters/copyActionsTable.ts` (new — tab-separated clipboard writer)

**Migrations**
- `founding_access_codes` + `redeem_founding_code()` RPC + seed codes.
- `transcript_revisions` table + RLS.

---

## Out of scope

- Real Stripe integration (v1).
- Per-user Google Drive / Docs / Sheets OAuth (v1).
- New AI models beyond AssemblyAI diarization already available.
- "Bring a witness" co-listen (v0.2, already flagged).

---

## Acceptance criteria

- [ ] Register → sign out → sign in works end-to-end against real Supabase (with "Confirm email" off in dashboard during test).
- [ ] "Email not confirmed" shows resend block; "Invalid credentials" shows create-account + resend helpers with prefilled email.
- [ ] A valid access code on the payment screen unlocks `/launch/welcome` and downstream gated surfaces; no Stripe call fires.
- [ ] Invalid/exhausted codes show a clear inline error.
- [ ] Founding Member CTA copy renders on reveal + payment screens after `launchDate` bump.
- [ ] iOS Safari recording uploads WAV successfully; transcript shows speaker labels + confidence badge.
- [ ] Deliverable view shows 4 export options with the new labels ("Word / Google Docs", "Excel / Google Sheets"), plus "Copy actions as table" and the helper line about File → Open.
- [ ] Downloaded `.docx` opens correctly in Microsoft Word and, after upload, in Google Docs. Downloaded `.xlsx` opens in Microsoft Excel and, after upload, in Google Sheets. (Manual smoke test on one tester machine.)
- [ ] "Copy actions as table" places a tab-separated table on the clipboard that pastes cleanly into Word, Excel, Google Docs, Google Sheets.
- [ ] Editing a transcript writes a `transcript_revisions` row visible in "Edit history".
- [ ] All exports render the `Prepared by MyRhythm · Confidence {avg}% · {date}` footer above the 3pt confidentiality line.