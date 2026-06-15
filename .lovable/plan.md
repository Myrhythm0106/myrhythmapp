# MyRhythm User Guide — Founder's Edition (Quick Start + Full Manual)

A commercial-grade user guide for Founding Edition (v0.1) buyers, written from the founder's voice. Delivered as PDF + DOCX, with a tiered structure: a short Quick Start booklet and a longer Full Manual. Designed to evolve quickly as feedback arrives.

## Deliverables

Four files in `/mnt/documents/`:

1. `MyRhythm_QuickStart_FoundersEdition_v1.pdf`
2. `MyRhythm_QuickStart_FoundersEdition_v1.docx`
3. `MyRhythm_UserManual_FoundersEdition_v1.pdf`
4. `MyRhythm_UserManual_FoundersEdition_v1.docx`

All four carry the standard 3pt confidentiality footer and the medical disclaimer block.

## Voice and framing (founder's perspective)

- First-person founder voice ("I built this because…", "Here's what works today, here's what's coming").
- Honest about v0.1 — what's polished, what's rough, what's intentionally minimal.
- Treats the reader as a co-builder. Every section ends with a "Tell me what's broken" prompt and the feedback channel.
- No medical claims. Explicit disclaimer: MyRhythm does not diagnose, treat, or fix any condition.
- All personas addressed equally, with a short "Read this first if you are a…" matrix up front (Survivor, Caregiver, Clinician, Executive, Student, Long COVID, MS, ADHD, Post-Recovery).

## Quick Start booklet (≈18 pages)

1. Welcome from the founder — why this exists, the Discharge Cliff, the Clinical-Ready vs Life-Ready Gap.
2. What you bought — Founding Edition v0.1 promise.
3. Read this first if you are a… (persona matrix, 1 page).
4. The 30-minute first run — Sign in → Energy Check → Pick a persona → Capture one thing → Commit one thing.
5. The 4C loop in plain language — Capture, Commit, Calibrate, Celebrate.
6. The Continuity layer — why returning users see a Re-entry card, what carry-forward means.
7. Your daily 5 minutes — the smallest viable routine.
8. Safety, privacy, disclaimers.
9. How to send feedback (and what I'll do with it).

## Full Manual (≈55 pages)

Section A — Foundations
- Founder's letter (longer version).
- The thesis: Discharge Cliff, Life-Readiness Gap, Bridge Pathway.
- The MYRHYTHM framework (8 clusters → Smart Scheduling).
- Glass-morphism UI conventions, 3-options-max rule, 56px touch targets.

Section B — Getting in
- Account, MFA, security settings.
- Persona selection and the 9 onboarding flows.
- Assessment system (per persona) and what the score means (and does not mean).
- Vision Board (5 pillars, quadrant export 9:16).

Section C — Daily use (the 4C loop, screen by screen)
- Capture (voice + text, 30-day retention, 5/25 day reminders).
- Commit (Smart Schedule cards, energy badges, auto-suggested invites).
- Calibrate (energy check, adjustments).
- Celebrate (wins, gratitude, streaks — without gamification pressure).

Section D — Cognitive Continuity layer
- Continuity Rail (persona, energy, open commits).
- Re-entry card rules (2–4 days soft, 5+ reset).
- Continuity Summary export (PDF + JSON) for handoff.
- Subject Switch carry-forward preview.

Section E — People and support
- Support Circle vs Contact List.
- Calendar invitations and SMART showup fuzzy-matching.
- Memory Bridge assistant-first flow.

Section F — Integrations and settings
- Google Calendar and Outlook sync.
- Timezone, voice retention, notification cadence.
- Data export (GDPR), account deletion.

Section G — Personas in depth
- One short chapter each: Brain Injury (foundation), Caregiver, Clinician, Executive, Student, Long COVID, MS, ADHD, Post-Recovery.
- For each: what to ignore in v0.1, what to lean on, one sample week.

Section H — Founder's notes
- What's in v0.1, what's deferred, why.
- Roadmap snapshot (anchored to 28 Apr 2026).
- How to file feedback into `founding_feedback`.
- Confidentiality and medical disclaimer (full text).

## Production approach (technical, for your reference)

- Build with the `docx` skill via Node + `docx-js` to generate the DOCX masters, then convert to PDF with LibreOffice (`run_libreoffice.py --convert-to pdf`).
- US Letter, 1" margins, Arial body 12pt, Calibri/Arial Black headers, brand-orange accent for H1, semantic heading styles so the TOC works.
- Standard 3pt confidentiality footer per the Document Confidentiality Standard memory; EditionBadge "Founding Edition v0.1" on the cover.
- No live screenshots in v1 (the UI will shift fast); use simple labeled flow diagrams and screen-frame placeholders described in text.
- Visual QA: render each page to JPEG via `pdftoppm` and inspect before delivery; fix overflow/contrast issues; re-render.
- Files versioned `_v1`; future revisions become `_v2`, `_v3` so you can compare.

## Out of scope (v1)

- No in-app `/launch/user-guide` route (you chose PDF + DOCX).
- No screenshots, no video, no translations.
- No changes to app code, schema, routes, or features.

## Open question I'll assume unless you say otherwise

I'll write the founder's voice as **yours** (first person, "I"), signed simply "— The Founder, MyRhythm". If you want a specific name, byline, photo, or signature block on the cover, tell me before I build.
