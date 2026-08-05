# Continuity Report (30 / 60 / 90) + a new plain-language definition

Continuity is the core differentiator — the thing MyRhythm does that nothing else in this space does. The report is not an admin export; it is the **visible proof of the differentiator**, and it should look and feel like a sibling of the assessment results dossier.

Two deliverables: one build, one wording. Both written **for a Friends & Family member first** — someone using MyRhythm for themselves who wants to show a partner, parent or friend how it's going — and usable by a rehab service second, without building two products.

## 1 · The 30/60/90 continuity report

One report, two audiences, one toggle. The member picks a window (30 / 60 / 90 days from a start date — default account creation, or discharge date if set) and picks who it's for.

| | **Personal** (default) | **Clinical / service** |
|---|---|---|
| Title | "My first 30 days" | "30-Day Continuity Report" |
| Tone | Warm, second person — "You committed to 42 things and carried 31 of them through." | Neutral, third person, structured |
| Extras | Wins, a short "what I'd like help with" note | GAS-shaped goal table, DOB field, sign-off block |
| Both | Commitments vs completion · Support Circle involvement · follow-through on agreed items · rhythm and energy pattern · "Prepared by the member. Not a clinical record." + 3pt footer |

**Route:** `/launch/continuity-report` — window selector, audience toggle, live on-screen dossier, Export PDF, and Share (native share sheet / email) so it goes straight to a family member. Entry points: Continuity page, Home after day 30, Discharge Bridge page.

### Make it rich — same family as the assessment results

The screen reuses the results dossier language from `LaunchWelcome.tsx` so it is unmistakably part of the same system, without being a copy:

- **Same palette and type**: cream page, ink dossier panel, gold accents, moss body; Sora for numerals and labels, Manrope for body. Same 10px uppercase `tracking-[0.3em]` section eyebrows and hairline borders.
- **Dossier shell**: white card, heavy shadow, thin ink border, a stamped meta strip at the top (member, window, generated date) — same construction as the results card.
- **Ink hero band** with a single dominant figure: **follow-through rate** rendered at 7–8xl the way the assessment score is, with the window label beside it and one plain-language line under it ("31 of 42 commitments carried through").
- **The signature chart** — where the assessment has eight MYRHYTHM letter bars, this has a **week-by-week continuity ribbon**: one column per week across the window, each column stacked completed / partially met / not met, on the same dashed gridlines. Tapping a week reveals that week's detail beneath — same progressive-reveal behaviour as the letter bars.
- **Two-column body** like the results page: left is the narrative (what changed, top wins, what's carrying forward), right is the numbered breakdown rail (goals, Support Circle, follow-through, rhythm).
- **Support Circle panel gets real weight** — avatars or initials of who was in the loop, count of check-ins, and how many actions had someone alongside them. For the Friends & Family audience this is the emotional payload of the report, not a statistic.
- **Footer band** with the boundary statement, mirroring the results footer.

The PDF follows the same structure and palette so the exported file reads as the same document, printed.

### Contents, in order

1. **Header** — name, window with real dates, generated date, boundary label. DOB only in clinical mode, only if ticked.
2. **Follow-through** — committed, completed, partially met, not met, rate, week-by-week ribbon.
3. **Goals** — met / partially met / not met. GAS-shaped table in clinical mode, plain list in personal. No numeric scoring.
4. **Support Circle involvement** — circle size, people looped in, check-ins and comments, actions with someone alongside.
5. **Follow-through on agreed items** — items from an imported document or the Bridge Kit, how many reached the calendar, how many completed. Hidden in personal mode when nothing was imported.
6. **Rhythm** — days active, capture and calibrate frequency, energy pattern.
7. **Boundary statement + 3pt confidentiality footer.**

**Language:** confidence, identity, behaviour, quality of life only. No clinical outcome verbs, no scores, no improvement claims. Validated against `docs/claims-policy.md`.

**Empty windows:** at day 40 the 60- and 90-day tabs read "Day 41–60 not yet reached" rather than padding with zeros.

### Technical notes

- `src/launch/continuity/buildContinuityReport.ts` — pure function taking `{ windowDays, startDate, mode }` plus rows from `daily_actions`, `goals`, `extracted_actions`, `support_circle_members`, `support_member_action_notes`, `document_import_audit`, `continuity_thread`, `growth_states`; returns a typed report object. Mode affects copy, not data.
- `src/launch/continuity/continuityReportPdf.ts` — jsPDF builder extending the `continuitySummaryPdf.ts` pattern with the dossier palette and the 3pt `EDITION_FOOTER`.
- `ContinuityRibbon.tsx` — the week-column chart, built the same way as the assessment letter bars (shared spacing, dashed gridlines, tap-to-reveal).
- `useContinuityReport(windowDays, startDate)` hook; page `src/pages/launch/LaunchContinuityReport.tsx`; registered in `src/launch/routes.ts`. Given continuity is the differentiator, it sits on the middle ring, not the outer.
- No schema changes.

## 2 · Standards alignment — why the report is not arbitrary

The 30/60/90 windows and the section order are shaped to match what services already have to report on. This is a **structural** alignment only: same intervals, same goal vocabulary, same participation focus. MyRhythm never administers, scores, or outputs a validated instrument.

| Framework | Used by | What the report already produces |
|---|---|---|
| Goal Attainment Scaling (GAS / GAS-light) | Neuro-rehab goal-setting standard | Individualised goals as met / partially met / not met |
| UKROC & the rehabilitation prescription (BSRM) | UK Level 1–2 rehab units | Goals set at discharge and what became of them |
| NICE NG211 | England | Person-set goals, a written plan, post-discharge review, family involvement — the Support Circle section |
| CARF Brain Injury Specialty Program | US/international accreditation | Post-discharge follow-up data, person-defined goals, family involvement |
| CQC Responsive / Effective | England | Evidence care continues to meet needs after the episode |
| WHO ICF Activity & Participation | Universal | Behaviour and participation framing, not impairment |
| 30-day readmission / 90-day follow-up convention | NHS, CMS | Why the windows are 30/60/90 |
| PROMs / PREMs (EQ-5D-5L, WHODAS 2.0 shape) | Commissioning | Quality-of-life and experience domains |

Also relevant as reference points for participation reporting: MPAI-4 Participation Index and the Community Integration Questionnaire.

**Guardrails, non-negotiable:**

- Wording is always "aligns with the reporting shape of…", never "compliant with", "validated against", or "accredited".
- No numeric GAS, MPAI, FIM or EQ-5D score is ever produced or implied.
- The mapping table lives in the Rehab Partner Pack and in a collapsed "How this maps to standards" panel on the report page — never in the PDF header, and never in Friends & Family / personal mode.
- Before the table is printed in any partner-facing document, the current UKROC dataset version, NICE NG211 status and CARF standards year are confirmed with a rehab lead. Treat the versions above as unverified until then.
- Everything here passes the six-point checklist in `docs/claims-policy.md`.

New doc: `docs/standards-alignment.md` holding the table, the source list, and the verification date.

## 3 · The new definition


The locked internal term stays. This adds a **public-facing one-liner** a Friends & Family member can repeat without explaining brain injury, that a rehab lead still recognises as the gap they know.

**Primary:**

> MyRhythm is the app that keeps your plan going after the appointment ends — or the commitment has been made.

**Supporting sentence:**

> It captures what was agreed, turns it into daily actions that fit your energy, and lets the people around you help you carry it — so the plan lives in your week, not in a folder.

**Why it carries both audiences:** a friend hears "after the meeting"; a parent hears "after the review"; an ADHD adult hears "after the session"; a survivor hears "after discharge"; a rehab lead hears the discharge cliff without it being named. Nobody has to identify as a patient to see themselves in it.

**Alternates:**

- "Plans are easy to make and hard to keep going. MyRhythm keeps them going."
- "The part that happens after the plan is made."
- "Where agreements become a week you can actually live."

**Where it goes once chosen:** landing hero subline, the Friends & Family invite email and share card, App Store short description, the Rehab Partner one-pager, the founder outreach script. Recorded in `mem://brand/app-description` beside Memory-First Design™ — it does not replace it.

## Out of scope

- Clinician logins or a portal — v0.2
- Any new member-facing feature beyond the report route
- Any change to the locked internal definition or the 4C loop

## Order

Report data layer → the on-screen dossier (personal mode) → PDF → clinical toggle. Definition wording chosen in parallel.
