# Continuity Report (30 / 60 / 90) + a new plain-language definition

Two deliverables. One is a build, one is wording. Both are written **for a Friends & Family member first** — someone using MyRhythm for themselves and wanting to show a partner, parent or friend how it's going — and **usable by a rehab service second**, without producing two separate products.

## 1 · The 30/60/90 continuity report

One PDF, two audiences, one toggle. The member picks a window (30 / 60 / 90 days from a chosen start date — default account creation, or discharge date if one is set) and picks who it's for.

**Two modes of the same report:**

| | **Personal** (default) | **Clinical / service** |
|---|---|---|
| Title | "My first 30 days" | "30-Day Continuity Report" |
| Tone | Warm, second person — "You committed to 42 things and carried 31 of them through." | Neutral, third person, structured |
| Extras | Wins and photos of progress, a short "what I'd like help with" note | GAS-shaped goal table, DOB field, sign-off block |
| Both | Commitments vs completion · Support Circle involvement · follow-through on agreed items · rhythm and energy pattern · the "Prepared by the member. Not a clinical record." label and 3pt footer |

**Route:** `/launch/continuity-report` — window selector, audience toggle, live on-screen preview, one Export PDF button, plus Share (native share sheet / email) so it can go straight to a family member. Reached from the Continuity page, from Home after day 30, and from the Discharge Bridge page.

**What the report shows, in this order:**

1. **Header** — name, window with real dates, generated date, boundary label. DOB only in clinical mode, only if ticked.
2. **Commitments vs completion** — committed, completed, partially met, not met; completion rate; a week-by-week bar so trend is visible, not just a number.
3. **Goals** — each goal with met / partially met / not met. In clinical mode this is laid out in a GAS-familiar table; in personal mode it is a plain list. No numeric scoring either way.
4. **Support Circle involvement** — circle size, how many people were looped into actions, check-ins and comments received, and how many actions had at least one person in the loop. This is the section a Friends & Family user will care most about — it shows the people around them that they were part of it.
5. **Follow-through on agreed items** — items originating from an imported document or the Bridge Kit, how many reached the calendar, how many were completed. Hidden entirely in personal mode when nothing was imported.
6. **Rhythm** — days active, capture and calibrate frequency, energy pattern.
7. **Boundary statement + standard 3pt confidentiality footer.**

**Language:** confidence, identity, behaviour, quality of life only. No clinical outcome verbs, no scores, no improvement claims. Validated against `docs/claims-policy.md`.

**Empty windows:** at day 40 the 60- and 90-day tabs say "Day 41–60 not yet reached" rather than padding with zeros.

### Technical notes

- `src/launch/continuity/buildContinuityReport.ts` — pure function taking `{ windowDays, startDate, mode }` plus rows from `daily_actions`, `goals`, `extracted_actions`, `support_circle_members`, `support_member_action_notes`, `document_import_audit`, `continuity_thread`, `growth_states`; returns a typed report object. Mode affects copy, not data.
- `src/launch/continuity/continuityReportPdf.ts` — jsPDF builder following the existing `continuitySummaryPdf.ts` pattern (orange header rule, teal section heads, 3pt footer with `EDITION_FOOTER`).
- `useContinuityReport(windowDays, startDate)` hook; page `src/pages/launch/LaunchContinuityReport.tsx`; registered in `src/launch/routes.ts` on the outer ring.
- No schema changes.

## 2 · The new definition

The locked internal term stays. This adds a **public-facing one-liner** that a Friends & Family member can repeat to someone else without explaining brain injury — and that a rehab lead still recognises as the gap they know.

**Primary:**

> MyRhythm is the app that keeps your plan going after the appointment ends.

**Supporting sentence:**

> It captures what was agreed, turns it into daily actions that fit your energy, and lets the people around you help you carry it — so the plan lives in your week, not in a folder.

**Why it carries both audiences:** a friend hears "after the meeting"; a parent hears "after the review"; an ADHD adult hears "after the session"; a survivor hears "after discharge"; a rehab lead hears the discharge cliff without it being named. Nobody has to identify as a patient to see themselves in it.

**Alternates to choose from:**

- "Plans are easy to make and hard to keep going. MyRhythm keeps them going."
- "The part that happens after the plan is made."
- "Where agreements become a week you can actually live."

**Where it goes once you pick:** landing hero subline, the Friends & Family invite email and share card, App Store short description, the Rehab Partner one-pager, and the founder outreach script. Recorded in `mem://brand/app-description` beside Memory-First Design™ — it does not replace it.

## Out of scope

- Clinician logins or a portal — v0.2
- Any new member-facing feature beyond the report route
- Any change to the locked internal definition or the 4C loop

## Order

Personal mode of the report first (that is what Friends & Family will actually send), clinical mode as a toggle on the same builder, definition wording chosen in parallel.
