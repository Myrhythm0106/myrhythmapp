# MyRhythm Launch Plan — Today to Christmas, then Rehab Centres

One document you can open every Monday, tick things off, and know exactly where you are. Starts today: **Wednesday 5 August 2026**. Public launch gate: **Friday 11 December 2026**. Rehab-centre outreach opens: **January 2027**.

## What gets built

### 1. `docs/launch-plan.md` — the master plan (the thing you asked for)

Structure:

**A. The three gates** — nothing is fuzzy; each gate is pass/fail on a fixed date.

| Gate | Date | Pass condition |
|---|---|---|
| G1 — Friends & Family ready | Fri 21 Aug 2026 | MVP checklist 100% green, 3 outside testers complete the full loop unaided |
| G2 — Public launch ready | Fri 11 Dec 2026 | 100 paying members OR 60 members + 3 clinician LOIs; zero P0 bugs open for 14 days |
| G3 — Rehab-centre ready | Fri 30 Jan 2027 | Continuity Report + Discharge Bridge Kit demoed to 5 centres, 1 pilot signed |

**B. MVP definition — the "Done" line.** A hard checklist of what must be true before a single friend gets a link, grouped as: the 4C loop end-to-end, Memory Bridge recording + extraction, Calendar with reminders/invites/recurrence, Support Circle invite accepted by a real person, access codes + Stripe test mode, data export, disclaimers and claims-policy pass, mobile (phone-sized) pass, and error/empty states. Anything not on the list is explicitly out of MVP and named as such, so you stop building sideways.

**C. Week-by-week SMART schedule, 5 Aug → 18 Dec (20 weeks).** Every week has: one theme, max 3 outcomes, a measurable target, and a Friday check figure. Example shape:

```text
W1  5–9 Aug    Self-test all green            Target: 6/6 sections pass, screenshots stored
W2 12–16 Aug   Fix P0s + 3 outside testers    Target: 3 testers finish unaided
W3 19–23 Aug   GATE G1 · F&F invites out      Target: 15 invites sent, 8 accounts created
...
W20 15–18 Dec  Launch week + rest             Target: launch post live, inbox triaged
```

**D. Metrics you check every Friday (one line each).** Paying members, weekly-active completing a full 4C loop, capture→commit conversion, invite acceptance rate, P0 bugs open, clinician conversations booked. Baseline column left blank for you to fill this Friday.

**E. The weekly ritual.** 30 minutes, Friday 4pm: fill the metrics row, mark last week red/amber/green, pick next week's 3 outcomes, log one thing to stop doing.

**F. Feedback → decision loop.** How F&F feedback becomes a Keep / Fix / Cut verdict using the evidence system already at `/founder/evidence`, so features change on data not on the loudest voice.

**G. Risk register.** Five real risks (solo founder capacity, Stripe live-mode switch, clinician gatekeeping, scope creep, testing fatigue) each with a trigger and a pre-agreed response.

### 2. `docs/ip-and-protection.md` — copyright, trademark, and protecting the concept

Plain-English, action-dated, and explicit that it is a founder's action list, **not legal advice** — a solicitor signs off before anything is filed.

- **What is automatically yours** — copyright in the code, copy, PDFs, and designs exists on creation; what to do to make it provable (dated repo history, a `NOTICE`/copyright header policy, an IP asset inventory).
- **What copyright does not protect** — the idea, the concept, the workflow. This is the "limitation" piece: ideas are not protectable, so the moat has to come from trademark, trade secrets, execution speed, and data.
- **Trademark actions** — classes to file "MyRhythm" and "Memory-First Design™" in (UK IPO + USPTO, classes 9/42/44), the ™ vs ® rule for current copy, and a clearance-search step before filing.
- **Assignment and ownership hygiene** — every contractor, designer, or developer signs an IP assignment; founder IP assigned into the company at incorporation; a template list of what each agreement must contain.
- **NDAs and disclosure discipline** — a one-page mutual NDA for clinician and investor conversations, plus what you can safely say without one (the problem, the category, the demo) versus what you don't say (roadmap internals, extraction prompts, research schema).
- **Trade secrets** — naming the parts that are genuinely secret (AI extraction prompts, MYRHYTHM assessment scoring, research pseudonymisation salt handling) and how they're handled.
- **Rehab-centre specific** — data-processing terms, DPIA prompt, and the claims-policy boundary that must survive contact with a clinical buyer.
- **Dated action table** — every item with an owner, a cost estimate, and a due date that sits inside the week-by-week schedule above.

### 3. `docs/mvp-gate-checklist.md` — the tick-sheet

The MVP section of the plan pulled out as a standalone printable checklist with checkboxes, so G1 is a physical act of ticking. Cross-references the existing `docs/v0.1-weekend-self-test.md` rather than duplicating it.

### 4. In-app tracker at `/founder/launch-plan` (admin-only)

So the plan is not a file you forget. A single page, same admin gate as `/founder/evidence`:

- Gate countdown strip — days to G1, G2, G3.
- Current week card — this week's theme and 3 outcomes, tickable.
- 20-week grid — each week red/amber/green, click to see its outcomes.
- Friday metrics row — enter the six numbers, see the trend.
- Link-outs to the launch plan, IP doc, and MVP checklist.

State persists in a new `founder_launch_progress` table (admin-only RLS, one row per week) so ticks survive refresh and phone/desktop switches.

## Technical notes

- New docs are markdown in `docs/`, linked from the existing docs index and from `90-day-sprint.md` so there's one entry point, not two competing plans. The 90-day sprint dates (3 Jul → 1 Oct) are folded into the new 20-week schedule rather than left to drift.
- `/founder/launch-plan` follows the existing founder-route pattern (admin role check via `has_role`, not client-side).
- Migration creates `public.founder_launch_progress` with grants to `authenticated` + `service_role`, RLS restricted to admins via `has_role(auth.uid(),'admin')`.
- All copy passes `docs/claims-policy.md` — no clinical outcome language in the rehab-facing sections.

## Not in this plan

No new member-facing features. No changes to the 4C loop, Memory Bridge, or Calendar. If the MVP checklist turns up a P0, it gets logged and fixed as its own task.
