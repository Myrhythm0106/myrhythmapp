
# Discharge Summary → Life-Ready Plan

A new flow that turns a rehab discharge summary into a reviewable, nurse-approved schedule inside MyRhythm. Lives inside the Discharge Bridge Kit (Stage 02 of the Bridge Pathway) so it reinforces the Clinical-Ready → Life-Ready thesis, not a new pillar.

Route: `/launch/discharge-bridge/plan`
Entry points: Day 1 card of the existing 7-day Bridge path, and a new "Have a discharge summary?" tile on `/launch/home` for post-discharge users.

## User flow (4 quiet steps, max 3 choices per screen)

1. **Upload / paste** — user uploads PDF/image or pastes text of the discharge summary. Voice dictation fallback via existing Memory Bridge recorder.
2. **Review extracted items** — AI returns a structured list: medications, follow-up appointments, therapy exercises, red-flag symptoms to watch, activity restrictions, rest guidance. Each item is editable and can be removed. Nothing is scheduled yet.
3. **Draft plan** — user picks a horizon (First 7 days / First 30 days). AI proposes a gentle schedule using existing energy-aware Smart Scheduling (respects cognitive load, rest windows, MyRHYTHM-G states). User can accept, tweak, or regenerate one section at a time.
4. **Send for approval** — user picks discharge nurse / clinician from Support Circle or types an email. A PDF ("Proposed Home Plan — for your review") is emailed with an approve/decline link. Nothing hits the calendar until approval (or user overrides with "Add to my schedule anyway").

On approval: items become real `calendar_events` (source: `discharge_plan`, status: `approved`), reminders auto-set per user's Gentle/Steady/Strong preference, Support Circle looped in per item.

## Guardrails (non-negotiable)

- Zero medical claims. Copy: "MyRhythm helps you organise what your clinician wrote — it does not diagnose, treat, or replace clinical judgement." Present on every screen + PDF footer.
- The AI **never invents** clinical items. If a field is uncertain it's flagged "please confirm with your clinician" rather than guessed.
- Nurse email is opt-in; users can skip and self-approve, with a clear banner that the plan is unreviewed.
- All uploads encrypted at rest (Supabase storage, private bucket) and auto-purged after 90 days unless user pins them.
- Fits the D0–D4 core-surface guardrails: one primary CTA per step, progressive reveal for detail, 56px targets.

## Technical outline

**DB (migration):**
- `discharge_summaries` — id, user_id, source_type (upload/paste/voice), file_path, raw_text, extracted_json, created_at. RLS: owner only. GRANTs for authenticated + service_role.
- `discharge_plans` — id, user_id, summary_id, horizon (7d/30d), draft_json, status (draft/awaiting_approval/approved/declined/self_approved), reviewer_email, reviewer_name, approval_token, approved_at, created_at. RLS: owner + token-based read for reviewer.
- `calendar_events.source` extended to include `discharge_plan`; link column `discharge_plan_id`.

**Edge functions:**
- `discharge-extract` — accepts file or text, calls Lovable AI Gateway (Gemini 3.x flash for extraction, strict JSON schema via `Output.object`), returns structured items. OCR for images via existing pipeline.
- `discharge-draft-plan` — takes edited items + horizon + user's schedule preferences + MyRHYTHM-G recent states, returns a proposed schedule (JSON). Uses same gateway.
- `discharge-send-for-approval` — generates PDF (reuses `clinicalExport.ts` with new `buildProposedHomePlanPdf` variant), emails via existing Resend integration, creates signed approval URL.
- `discharge-approval` — public endpoint validated by signed token; marks plan approved/declined, triggers calendar materialisation, notifies user.

**Frontend (`src/pages/launch/`):**
- `LaunchDischargePlan.tsx` — 4-step wizard, reuses `LaunchAiPlanAssist` patterns and `LoopInPicker`.
- `LaunchDischargePlanReview.tsx` — public page (no auth) for the reviewer to see and approve/decline.
- Card on `LaunchDischargeBridge.tsx` and `LaunchHome.tsx` pointing here.

**Copy source of truth:** add `DISCHARGE_PLAN_COPY` block to `src/config/appDescription.ts`, per the memory rule.

## Success signals

- % of Founding Members with a discharge summary who reach step 3 (draft plan): target 70%.
- % of drafts sent to a clinician: target 40%.
- % of sent drafts approved within 7 days: target 30% — proves the loop closes.
- Anecdotal: at least one nurse from LOI 1 replies "approve".

## Out of scope for v0.1

- Direct EHR/HL7 integration (defer to v0.3+; hospital-side work).
- Multi-clinician review threads.
- In-app chat with the nurse (email is enough for the wedge).
- Non-English discharge summaries (English-first; German/Spanish later).

## Risk / mitigation

| Risk | Mitigation |
|---|---|
| AI misreads dose/frequency | Every med row shows raw source quote + "confirm with clinician" flag; user must tick before it can be scheduled |
| Nurse won't click a link from an unknown domain | PDF attachment is the primary artefact; approval link is secondary convenience |
| Feels like a medical device | Explicit disclaimer on every screen + PDF; framed as "your notes, organised" |
| Scope creep into treatment plans | Locked template: schedule + reminders only, never dosages calculated by us |

## Rollout

- Ships as part of the Discharge Bridge Kit sprint (target 15 Aug 2026).
- Behind a `discharge_plan_v1` feature flag for the first 2 weeks; enabled for Founding Members with the `brain_injury` persona first, then all personas.
