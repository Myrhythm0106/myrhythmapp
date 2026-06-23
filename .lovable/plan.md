# Plan: Update Founders Edition Quick Start + User Manual (v2)

Two new versioned files written to `/mnt/documents/` — originals preserved.

## 1. User Manual v2 — C1 Capture retention warnings

In the **C1 Capture** section, expand the deletion-warning subsection so the countdown reads:

- **Day 5 before deletion** — first heads-up reminder (extract any keepers).
- **Day 25 of retention / Day 5 before deletion** — banner + email.
- **Day 3 before deletion** — escalated warning (amber banner, in-app + email).
- **Day 2 before deletion** — urgent warning (red banner, push + email).
- **Day 1 before deletion** — final warning (red banner, push + email, "deleting tomorrow").
- **Day 30** — permanent deletion; transcripts/extracted ACTs are retained, audio is not.

Add a callout: "Tap **Save Forever** (Taste & See tier) at any warning to preserve the recording."

Also update `mem://data/retention-policy` to reflect the 5/3/2/1-day cadence.

## 2. Quick Start v2 — Tiered user journey + time-based milestones

Replace the existing "Day 1 / Week 1 / Month 1" section with a **two-axis matrix**:

### Axis A — User Level (Basic / Intermediate / Advanced)

| Level | Who | Features they maximise | Benefit |
|---|---|---|---|
| **Basic** | Just discharged, caregiver-supported, low cognitive load | Energy Check-in, Daily Action card, Smart Schedule (auto-suggested), Voice Capture | Reduce overwhelm; one decision per moment; never miss a medication or appointment |
| **Intermediate** | 2–6 weeks in, building routine | + Memory Bridge (Capture → Commit → Calibrate → Celebrate), Support Circle invites, Vision Board (1 pillar), Weekly Review | Build trusted routine; loop family in; see weekly wins |
| **Advanced** | 2+ months, self-directed | + Full 5-pillar Vision Board, Goals → Priorities → Actions traceability, Calendar sync (Google/Outlook), Continuity Rail re-entry, Founder Feedback loop | Run life as a system; export to clinicians; coach other Founders |

This table is dual-purpose: onboarding **and** investor/sales pitch (shows expanding LTV per tier).

### Axis B — Time-based competency milestones ("What you'll know how to do")

Included in **both the short Quick Start and the comprehensive User Manual**:

- **After 1 hour** — Log Energy Check, accept one Smart Schedule suggestion, record one Voice Capture.
- **After 1 day** — Complete the 4C loop once (Capture → Commit → Calibrate → Celebrate); review tomorrow's schedule.
- **After 1 week** — Invite one Support Circle member; set one Vision pillar; complete first Weekly Review.
- **After 1 month** — Full 5-pillar Vision board; Goals → Priorities → Actions traced; Calendar sync active; first Founder Feedback submitted.
- **After 3 months** — Self-directed Memory Bridge mastery; clinician export ready; mentoring a new Founder.

## 3. Sync between docs

- Short version (Quick Start v2): condensed level matrix + milestone bullets.
- Comprehensive version (User Manual v2): full matrix + milestone bullets + retention warning expansion + cross-references to feature chapters.

## 4. Deliverables

- `MyRhythm_QuickStart_FoundersEdition_v2.docx` + `.pdf`
- `MyRhythm_UserManual_FoundersEdition_v2.docx` + `.pdf`
- Updated `mem://data/retention-policy`

## 5. Technical notes

- Generate `.docx` with `docx-js` (US Letter, Arial, brand-orange H1s, proper tables with DXA widths, bullet numbering config — no unicode bullets).
- Convert to PDF via LibreOffice; QA every page as JPEG before delivering; fix overflow/clipping and re-run if needed.
- Footer on every page: confidentiality line (3pt) per project standard; "Founding Edition v0.1" label.

## Open question

Should I keep the **existing structure/branding** of v1 (same cover, section order, fonts) and only add the new content, or take the chance to refresh layout? Default: keep v1 structure, add new content only.
