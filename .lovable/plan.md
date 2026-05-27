# Plan v14 — MVP Hardening (Locked Scope)

Confirmed:
1. Reorder Welcome before Payment ✅
2. Record-on-behalf OFF by default for everyone ✅
3. All 7 friction fixes in Phase 1 ✅
4. Clinical export in MVP ✅
5. Pull in accessibility baseline (G6-min) + GDPR data export (G9) ✅
6. Document deferred items in strategy + features docs ✅

---

## Phase 1 — Friction, UI consistency, accessibility baseline (frontend)

| # | Change | Files |
|---|---|---|
| F1 | "Skip" on UserType routes to neutral default + 1-line preview under each identity | `LaunchUserType.tsx` |
| F2 | Reorder flow: `UserType → Welcome → Payment` | `LaunchUserType.tsx`, `LaunchWelcome.tsx`, `LaunchPayment.tsx` |
| F3 | First-run 3-card overlay on `/launch/home` (Capture / Add Anchor / See your day), dismissible via `mr:first-run-done` flag | New `src/components/launch/FirstRunOverlay.tsx`, mounted in `LaunchDashboard.tsx` |
| F4 | Persistent "Need a hand?" pill bottom-right on every Launch page | `LaunchLayout.tsx` (mount existing `FloatingGuideButton`) |
| F5 | SC Capture: hide Tap/Hold toggle behind ⋯ until first capture; Online chip only when offline | `LaunchSCCapture.tsx` |
| F6 | 4-dot onboarding progress rail (Identity → Welcome → First capture → Invite circle) | New `src/components/launch/OnboardingProgressRail.tsx`, conditional in `LaunchLayout.tsx` |
| F7 | Bump persona definitions to `text-base text-stone-700` | `LaunchUserType.tsx` |
| Visual | Unify Dashboard + UserType with Welcome's editorial language: bone bg `#FDFCFB`, single teal `#0D9488`, Playfair Display headlines | `LaunchUserType.tsx`, `LaunchDashboard.tsx`, `index.css` token check |
| **G6-min** | Accessibility baseline: 18px min body, `focus-visible` rings on all interactive elements, high-contrast toggle in Settings, respect `prefers-reduced-motion`, alt text audit on hero/persona images | `index.css`, `LaunchSettings.tsx`, sweep across launch pages |

---

## Phase 2 — Support Circle "Record on behalf" (frontend + permission flag)

**Default: OFF for every member, every role.**

| Change | Files |
|---|---|
| 7th permission toggle `can_record_on_behalf` with explicit copy ("…recordings appear in your Memory Bridge for you to review and accept. OFF by default.") | `EnhancedSupportCirclePermissions.tsx` |
| Anchor-side "Record meeting for [name]" button on `/launch/support-circle`, disabled with tooltip when permission OFF | `LaunchSupportCircle.tsx` |
| `MemoryBridgeRecorder` accepts `subjectUserId` + `onBehalf` props; banner "Recording on behalf of [name]" | `MemoryBridgeRecorder.tsx`, `routes/MemoryBridge.tsx` |
| Persist `recorded_by` in recording metadata JSONB (no schema change) | `useVoiceRecorder.ts`, `processSavedRecording.ts` |

---

## Phase 3 — Clinical Export (MVP critical)

| Change | Files |
|---|---|
| "Share with my clinician" button on each Memory Bridge meeting + dashboard "Last 7 days" | `MemoryBridgeMainDashboard.tsx`, `LaunchDashboard.tsx` |
| 1-page PDF: header (patient name, optional DOB, date range), summary, key captures, extracted actions, medications mentioned, 3pt confidentiality footer per `mem://brand/document-confidentiality-standard` | New `src/utils/clinicalExport.ts` (jspdf) |
| Outputs: (a) Download PDF, (b) Email to clinician via existing Resend `send-email` edge function | Reuse `send-email` |
| Pre-export consent dialog: itemised checkboxes, explicit "nothing is shared until you confirm" | New `src/components/launch/ClinicalExportDialog.tsx` |
| Audit log row per export | `accountability_alerts` insert |

---

## Phase 4 — Backend hardening for record-on-behalf (separate migration)

- Promote `recorded_by_user_id uuid` from metadata to column on `voice_recordings`
- RLS: support member can INSERT when target user's `support_circle_members.permissions->>'can_record_on_behalf' = 'true'`
- Trigger: notify owner via `accountability_alerts` type `recording_on_behalf`

---

## Phase 5 — GDPR Data Export (legal baseline)

| Change | Files |
|---|---|
| Settings → "Download my data" button | `LaunchSettings.tsx` |
| Bundles: JSON (raw rows the user owns across profiles, recordings metadata, actions, mood, goals, support_circle_members) + human-readable PDF summary | New `src/utils/gdprExport.ts`, new edge function `gdpr-export` |
| Confirmation modal with what's included + 24h re-request rate-limit | Modal in `LaunchSettings.tsx` |

---

## Documentation updates

| Doc | Addition |
|---|---|
| `strategic-documents/Founding-Member-Launch-Strategy.md` | New section **"v1.1 Roadmap (Post-Founding-Member Launch)"** — lists deferred items with trigger conditions: G5 Weekly Anchor digest (trigger: ≥50 active Anchors), G6 formal WCAG 2.2 AA certification (trigger: pre-NHS pilot), persona switcher mid-journey (trigger: ≥10% of users request it) |
| `docs/v0.1-features.md` | New section **"Deferred / Out-of-Scope for v0.1"** mirroring the above, linking to strategy doc |
| New `strategic-documents/Memory-Bridge-Positioning-Decision.md` | One-pager capturing the proposal to lead marketing with "Memory Bridge" as the hero feature; awaits founder sign-off |

---

## Execution order

```text
Phase 1   Friction + UI + a11y baseline       (~9 files, 1 commit)
Phase 2   Record-on-behalf frontend           (~4 files, 1 commit)
Phase 3   Clinical export PDF + email         (~5 files + reuse edge fn)
Phase 5   GDPR data export                    (~3 files + 1 edge fn)
Docs      Strategy + features + positioning   (3 docs)
Phase 4   Backend migration for on-behalf     (separate approval)
```

Phases 1–3, 5, and Docs ship in a single build pass. Phase 4 follows as its own migration cycle.

Ready to build on approval.
