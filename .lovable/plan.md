# Action plan — start today, Monday 14 September 2026

This turns the strategy into dated, tickable tasks. Nothing here needs money. Everything here can be started today.

## What changes in the project

Rewrite `docs/ichoose-365-gtm-plan.md` from a strategy summary into a **daily action tracker**: every task gets a date, an owner action verb, a time estimate, and a "done when" test. Add three new supporting files so you never have to invent words on the spot.

## The four things being created or rewritten

### 1. `docs/ichoose-365-gtm-plan.md` — rewritten as a dated action tracker

Replaced with a day-by-day list for the first 14 days, then week-by-week to 7 December. Each line becomes:

```text
[ ] Mon 14 Sept · 15 min · Post #IChoose statement 1 on LinkedIn
    Done when: post is live and ends with one ask (journal or founding list)
```

Sections:
- **Today (14 Sept)** — six tasks, roughly 90 minutes total.
- **This week (15–20 Sept)** — one named task per day, plus Sunday review.
- **Week 2 (21–27 Sept)** — same shape, adding the FIT Collective follow-up and the device tests.
- **Weeks 3–12** — weekly blocks with targets, not daily micro-tasks.
- **Weekly scorecard** — the same seven numbers each Sunday.
- **Blocked / waiting on** — a live list so nothing silently stalls.

### 2. `docs/outreach-scripts.md` — the exact words to send

Copy-paste ready, all passing the claims policy:
- FIT Collective first approach (free 20-min talk offer).
- Support group / charity approach.
- Employer and occupational health approach.
- Podcast pitch.
- Founding tester invitation (survivor + supporter pair).
- Rehab centre approach, reusing the approved script already in `docs/claims-policy.md`.
- Follow-up message for each, to send after 5 working days.

### 3. `docs/ichoose-first-14-posts.md` — two weeks of content written in advance

Fourteen ready-to-post drafts, one per day from 14–27 Sept, each with:
- the #IChoose statement,
- three to four lines of real story,
- one question back to the reader,
- one ask (journal or founding list).

Drawn from the five talking points already in `docs/ichoose-talking-points.md` so the voice stays consistent. This removes the single biggest failure point: needing to be creative daily.

### 4. `docs/app-proof-checklist.md` — the hard gate before selling anything

The five blockers from `docs/readiness-statement.md` turned into a test script you can actually run:
- iPhone 2–4 hour capture: exact steps, what to check, pass/fail box.
- Android 2–4 hour capture: same.
- Two-account Support Circle permission test: what each account should and should not see.
- 20-conversation action accuracy sample: how to score it, what counts as a pass.
- Google/Outlook keys: what to request and where they go.

Founding Member seats do not open until every box is ticked.

## What is deliberately not in this plan

- No app feature work. The only app tasks are the five proof items.
- No paid advertising.
- No new platforms beyond LinkedIn plus one.
- No clinical language anywhere — all copy is checked against `docs/claims-policy.md`.

## Technical notes

- All four files are markdown under `docs/`, editable by hand and safe to keep in the repo.
- `docs/ichoose-talking-points.md` stays as-is and is referenced, not duplicated.
- `docs/readiness-statement.md` stays as the honest status document; the new checklist is its actionable twin.
- The 30 statements in `src/data/iChooseStatements.ts` are the app-side pool; the first 14 posts will note where the journal's 365 and the app's daily statement should line up.
- No application code, database or edge function changes.
