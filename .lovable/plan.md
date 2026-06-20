
# Memory Bridge AI Overhaul + Memory Library (MVP)

Goal: make Memory Bridge dramatically more **accurate, easy, and dependable**, and give every recording (plus its transcript, summary, and actions) a **single, searchable home** with one-tap **copy / edit / email / export**.

Constraints kept: medical-disclaimer policy, 30-day voice retention, Vault/RLS, human-in-the-loop, no auto-send.

---

## 1. Smarter transcription (accuracy & reliability)

`process-meeting-audio` + realtime path upgraded:

- Primary STT: **AssemblyAI Universal-2** with diarization, custom vocab (medical / family / brand), word-level confidence, auto punctuation.
- **Fallback chain:** AssemblyAI → `openai/gpt-4o-transcribe` via Lovable AI Gateway → mark job `needs_review`.
- Sentences below confidence threshold rendered with a subtle underline in `TranscriptEditor`.
- Long recordings auto-chunked server-side and stitched.

## 2. Smarter action extraction (multi-pass AI)

New edge function `mb-synthesize` (AI SDK + Lovable AI Gateway, default `google/gemini-3-flash-preview`, escalate to `gemini-3.1-pro-preview` for long transcripts). Four passes with structured (Zod) output:

1. **Summary** — exec summary, themes, decisions.
2. **Actions** — `text, owner, due, priority, confidence, dependencies[], watch_outs[], source_quote, transcript_offset`.
3. **Follow-ups** — open questions, suggested next captures, suggested Support Circle invitees.
4. **Schedule-fit** — proposes time using Energy Check + Brain Health score + calendar availability (illustrative when no live signal).

Every field carries confidence + a `source_quote` deep-linking back to the transcript.

## 3. Easier capture → commit

- **One-tap record** floating mic on Launch home; auto-title from first ~6s; auto-detect participants from Support Circle.
- **Live transcript + actions rail** while recording (`useRealtimeTranscription` wired to incremental extraction).
- **Commit Sheet**: per-action Confirm / Edit / Skip with energy badge, suggested time, pre-ticked invitees.
- "Low confidence — review?" nudge when avg confidence < 0.8.

## 4. Dependability (never lose a recording)

- **Offline-safe capture** — chunks to IndexedDB; resumable upload to `voice-recordings` with retry/backoff.
- **Background jobs** — `transcription_jobs` state machine: `queued → transcribing → extracting → ready → needs_review → failed`.
- **Cron retry** (`pg_cron`, every 2 min) for jobs stuck > 5 min, up to 3 attempts.
- Persistent "Processing" pill in Launch header; per-recording status with retry / re-extract / download.

## 5. Memory Library — the centralised home (NEW)

Route: `/launch/memory-library` (replaces scattered access; existing VoiceNotes, MemoryBridge list views point here).

**Layout**
- Left: filters (Date range, Participant, Tag, Status: ready/needs review, Has actions, Energy/Brain-Health context).
- Center: **searchable list** of recordings (full-text search over title + transcript + actions via `tsvector`).
- Right: detail pane with 4 tabs — **Summary · Transcript · Actions · Follow-ups**.

**Per recording, one-tap actions** (visible in list row and in detail header):
- **Copy** — copy summary / transcript / actions list / single action to clipboard.
- **Edit** — inline edit of title, summary, any action; re-extract button.
- **Email** — opens email composer (new edge function `mb-send-recap`) with prefilled subject + body (summary + actions + disclaimer footer). Sends via Resend. Recipient picker = Support Circle + free-type. No auto-send; user reviews + clicks Send.
- **Export** — Markdown (.md), PDF (uses existing `continuitySummaryPdf` style), .ics for any scheduled action.
- **Share to Support Circle** — posts as a `memory_bridge_comments` thread; recipients see it in their feed (existing infra).
- **Download audio** while still within 30-day retention.
- **Delete** (respects `legal_retention_required`).

**Reliability indicators in the list**
- Confidence chip (High / Med / Low), job status, action count, "Needs review" badge.

**Empty / safe states**
- Disclaimer footer on every emailed / exported artifact: *"MyRhythm organises — it doesn't diagnose or treat. Please review before acting."*

## 6. Trust & safety (all 4 non-negotiables)

- Medical-disclaimer footer on every AI output, email, and export.
- Confidence chip + "View source" on every action.
- Nothing auto-scheduled or auto-sent; everything is a proposal.
- 30-day voice retention preserved; AI runs inside existing Vault/RLS.

---

## Files & infra (technical)

**New edge functions**
- `supabase/functions/mb-synthesize/index.ts` — multi-pass AI pipeline.
- `supabase/functions/mb-send-recap/index.ts` — Resend email of summary/actions, validates recipients, writes audit row.
- `supabase/functions/mb-retry-stuck-jobs/index.ts` — cron worker.
- `supabase/functions/_shared/ai-gateway.ts` — provider helper (per AI SDK gateway pattern).

**New frontend**
- `src/routes/MemoryLibrary.tsx` + nested `src/components/memoryLibrary/{LibraryList,LibraryFilters,RecordingDetail,SummaryTab,TranscriptTab,ActionsTab,FollowupsTab,CopyMenu,EmailRecapDialog,ExportMenu}.tsx`.
- `src/components/memoryBridge/{ConfidenceChip,SourceQuotePopover,ProcessingPill,CommitSheet}.tsx`.
- `src/hooks/memoryBridge/{useTranscriptionJob,useMemoryLibrary,useRecapEmail}.ts`.
- `src/utils/memoryBridge/offlineQueue.ts` (IndexedDB + resumable upload).

**Edited**
- `process-meeting-audio`, `extract-acts-incremental` — fallback chain, write `transcription_jobs`, call `mb-synthesize`.
- `useMemoryBridge`, `MemoryBridgeLayout`, `TranscriptEditor`, `VoiceNotesPage` — point list views at Memory Library, surface confidence + source links + commit sheet.
- Launch top nav — add **Memory Library** entry.

**DB migration**
- `extracted_actions` add: `source_quote text, transcript_offset int, confidence_breakdown jsonb, dependencies text[], watch_outs text[]`.
- `transcription_jobs` add: `attempts int default 0, last_error text, avg_confidence numeric`.
- `meeting_recordings` add: `search_tsv tsvector` + GIN index + trigger.
- New table `recap_emails`: `id, user_id, meeting_recording_id, recipients[], subject, body_preview, sent_at` (RLS: user-owns-row; GRANTs to `authenticated` + `service_role`).
- Enable `pg_cron` + schedule `mb-retry-stuck-jobs` every 2 min.

**Secrets** — all present: `LOVABLE_API_KEY`, `ASSEMBLYAI_API_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`.

---

## MVP scope check

In scope (v0.1):
- Everything above.

Out of scope (post-MVP):
- Live Google/Outlook fetch inside Schedule-fit pass (still illustrative).
- Real-time Brain Health re-scoring (uses last assessment if present).
- Per-speaker voice fingerprints / cross-recording speaker identity.
- Team / multi-user shared libraries.
- Auto-send of recaps without review.
- Stripe Founding-50% wiring.

---

## ASCII flow

```text
 mic ─► IndexedDB ─► resumable upload ─► voice-recordings bucket
                                              │
                                              ▼
                                    transcription_jobs (queued)
                                              │
                  ┌───────────────────────────┼───────────────────────────┐
                  ▼                           ▼                           ▼
          AssemblyAI Universal-2   fallback gpt-4o-transcribe    cron retry (stuck)
                  │                           │
                  └────► transcript + word-confidence ──┐
                                                        ▼
                                                mb-synthesize
                                summary → actions → follow-ups → schedule-fit
                                                        │
                                              extracted_actions
                                                        │
                                                        ▼
                                            ┌───────────────────┐
                                            │  Memory Library   │
                                            │  search · filter  │
                                            │ copy·edit·email·  │
                                            │   export·share    │
                                            └───────────────────┘
```
