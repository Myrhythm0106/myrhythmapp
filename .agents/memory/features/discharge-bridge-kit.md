---
name: Discharge Bridge Kit
description: Kit replacing Brain Games v0.2 as v0.1 sprint headline — printed one-pager + 7-day in-app path + clinician handover PDF. Ships 15 Aug 2026.
type: feature
---
The Discharge Bridge Kit is the v0.1 sprint headline (replaces Brain Games v0.2 as the wedge). Three artefacts:

1. **Printed one-pager** at `/launch/discharge-bridge/handout` — "First 30 Days Home — you don't walk this alone" + 5 locked bullets + QR to `/subscribe`. Print A4.
2. **In-app 7-day path** at `/launch/discharge-bridge` — one action per day mapped to loop stages: Reconnect → Capture → Commit → Calibrate → Celebrate → Continuity → Handover. Progress persisted in `localStorage` (`discharge_bridge_progress_v1`) for v0.1; Supabase table with RLS in v0.2.
3. **Clinician handover PDF** — `buildDischargeHandoverPdf()` in `src/utils/clinicalExport.ts`. Explicitly "Prepared by the patient. Not a clinical record." Standard 3pt confidentiality footer.

**Why it replaced Brain Games:** wedge over retention. Brain Games (~8 weeks, ~200 hours) converts no new patient; the Kit is the tangible thing a clinician can hand over, unlocking LOI conversations and the investor Loom demo moment. Brain Games code stays in place at `/launch/games` — only demoted from the v0.1 headline.

**Locked copy** lives in `src/config/appDescription.ts` as `DISCHARGE_BRIDGE_KIT_DESCRIPTION` and `DISCHARGE_BRIDGE_KIT_TAGLINE`. Do not paraphrase.

**Success metric:** ≥ 60% of new Founding Members complete Day 1 within 48h of signup; ≥ 30% complete Day 7 (generate handover PDF) by 1 Oct 2026.

**Full spec:** `docs/discharge-bridge-kit.md`. Sprint impact in `docs/90-day-sprint.md` (Workstream C, week 6 milestone).
