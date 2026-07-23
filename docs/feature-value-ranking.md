# Feature Value Ranking — v0.1 Sprint

**Status:** Living doc · Refresh at end of each sprint
**Anchor date:** 3 June 2026
**Companion docs:** [`docs/problem-fit-and-market.md`](./problem-fit-and-market.md), [`docs/market-evidence.md`](./market-evidence.md), [`docs/discharge-bridge-kit.md`](./discharge-bridge-kit.md)

Purpose: rank every feature shipped or improved in this sprint against (a) the value it delivers, (b) the three locked problem definitions, and (c) the competitor set. Used for founder decisions, investor conversations, and v0.2 backlog shaping.

---

## 1 · Scoring model

Each feature scored 1–5 on four axes. Composite = sum (max 20). Tier is a judgement call informed by composite plus strategic weight.

| Axis | 1 = low | 5 = high |
|---|---|---|
| **Problem Fit** | Nice-to-have, tangential to the three problems | Directly closes Discharge Cliff / Life-Ready Gap / Ideal-Brain Assumption |
| **User Value** | Founding Member wouldn't notice if it vanished | Would trigger a complaint within 24h if removed |
| **Competitive Moat** | Any competitor can ship in <1 month | Requires our specific stack (Support Circle + clinical export + Memory-First Design) — 6+ months to replicate |
| **v0.1 Readiness** | Fragile, demo-risky, hidden behind flags | Demo-ready today, works on a stranger's phone |

**Tiers:**
- **S** — Hero it. Landing page, investor Loom, first onboarding moment.
- **A** — Ship it, mention it, don't lead with it.
- **B** — Present in the app, not marketed.
- **Defer** — Keep the code, quietly de-emphasise until v0.2.

The three problems (locked):
1. **Discharge Cliff** — The moment a survivor leaves clinical care with no operational bridge to daily life.
2. **Clinical-Ready vs Life-Ready Gap** — Being medically stable ≠ being able to run a Tuesday.
3. **Ideal-Brain Assumption** — Consumer productivity tools assume an "average" brain; ADHD, MCI/dementia, stress, and focus users are silently excluded.

Competitor set: Calm, Headspace, MyReha, CogniFit, NeuroNation, Constant Therapy, generic PA apps (Motion, Reclaim), consumer to-do apps (Todoist, TickTick).

---

## 2 · Ranking table

Sorted by composite, then strategic weight. `PF` = Problem Fit, `UV` = User Value, `CM` = Competitive Moat, `RD` = v0.1 Readiness.

| # | Feature | Surface | PF | UV | CM | RD | Total | Tier | Why this rank |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Document import → extract → accuracy-checkbox → audit-log → calendar | Capture | 5 | 5 | 5 | 4 | **19** | **S** | Only feature in the sprint that touches all 3 problems in one flow. No competitor closes the loop from paper discharge summary to a scheduled action with an approval audit trail. |
| 2 | Memory Bridge (4h recording, live countdown, Save & Extract, source-quote reveal) | Capture | 5 | 5 | 5 | 4 | **19** | **S** | The named hero feature. Competitors record; nobody extracts commitments with the exact spoken source line attached. Life-Ready Gap in one artefact. |
| 3 | Smart Scheduling with MYRHYTHM-aware suggested dates/times | Commit | 5 | 4 | 5 | 4 | **18** | **S** | This is what makes us feel like a PA. Motion/Reclaim schedule for ideal brains; we schedule against your assessed energy pattern. Directly attacks Ideal-Brain Assumption. |
| 4 | Support Circle CRUD + Loop-In picker (was "Watchers") | Trust layer | 5 | 5 | 5 | 4 | **19** | **S** | "No one walks alone" is the brand promise. Ability to actually invite a real person into an action is the moat — every consumer PA is single-player. |
| 5 | MyRHYTHM-G growth-mindset layer (8 states, home chip, circle-visible) | Calibrate | 4 | 4 | 5 | 4 | **17** | **A** | Culturally distinctive (Amen/Leaf-aligned), owned vocabulary, no direct competitor. Slightly softer on immediate problem-fit — sits above the 4C loop rather than inside it. |
| 6 | LaunchDailyBrief + LaunchRescheduleModal | Commit | 4 | 5 | 3 | 4 | **16** | **A** | The daily "what's on my plate" surface. High user value but PA apps have equivalents; our moat is the tie-in to Support Circle and MYRHYTHM-G, not the brief itself. |
| 7 | Add Event upgrades (Meeting type, Gentle/Steady/Strong reminders, invites, recurrence) | Commit | 4 | 5 | 3 | 5 | **17** | **A** | Table stakes for a PA-feeling calendar, but "Gentle/Steady/Strong" reminder tiers are a genuine Ideal-Brain differentiator. Ship, don't lead. |
| 8 | AI Weekly Planning Assist (`plan-assist` + LaunchWeeklyPlanningCard + planning_scopes) | Commit | 5 | 4 | 4 | 3 | **16** | **A** | Directly answers "planning overwhelms me." Slight readiness deduction — needs one more UX pass before it's demo-fluent. |
| 9 | Assessment Phase 0 (recency: "10 years or more") + "None of these fit me" | Onboarding | 5 | 4 | 4 | 5 | **18** | **S** | Small change, huge problem-fit lift. Directly answers "I don't fit any of these boxes" — the exact complaint that keeps 16-years-post survivors and stressed executives out of every competitor. |
| 10 | Results page redesign with interactive letter bars + Founding CTA | Onboarding | 3 | 5 | 4 | 5 | **17** | **A** | Converts. Owned aesthetic. Problem-fit is indirect (it sells the fit, doesn't create it). |
| 11 | You-Are-Here dial, gated post-payment | Continuity | 3 | 4 | 4 | 5 | **16** | **A** | Unique spatial nav; genuinely helps cognitive-load users. Gating it post-payment protects first-run simplicity. |
| 12 | Google/Outlook sync bar + push tracking + `calendar-push-upcoming` | Commit | 3 | 5 | 2 | 4 | **14** | **A** | High user value (real calendar or bust), low moat (everyone does this). Necessary hygiene, not a story. |
| 13 | Card-on-file trial + Back-to-results from payment | Commercial | 3 | 4 | 3 | 5 | **15** | **A** | Industry standard trial flow. Improves conversion, not category. |
| 14 | Tester bundle (access codes + Stripe test mode + tester banner) | Ops | 2 | 3 | 3 | 5 | **13** | **B** | Zero customer value; huge internal value. Correctly invisible to end users. |
| 15 | Emerald Prestige theming across launch pages | Polish | 2 | 4 | 3 | 5 | **14** | **A** | Trust signal. Doesn't move the problem, moves the "will I pay for this" needle. |
| 16 | Founding-Member gating + Edition badge | Commercial | 2 | 3 | 3 | 5 | **13** | **B** | Necessary for the cohort model. Not a feature you sell. |

**Sprint composite average: 16.4 / 20.** That's high — but read Section 4 before celebrating.

---

## 3 · Problem-coverage matrix

`●` = direct hit · `◐` = indirect / supporting · `○` = not applicable

| Feature | Discharge Cliff | Life-Ready Gap | Ideal-Brain Assumption |
|---|:---:|:---:|:---:|
| Document import → calendar | ● | ● | ◐ |
| Memory Bridge (record + extract + source) | ● | ● | ● |
| Smart Scheduling (MYRHYTHM-aware) | ◐ | ● | ● |
| Support Circle + Loop-In | ● | ● | ◐ |
| MyRHYTHM-G growth layer | ◐ | ● | ● |
| Daily Brief + Reschedule | ○ | ● | ● |
| Add Event upgrades (tiered reminders) | ◐ | ● | ● |
| AI Weekly Planning Assist | ◐ | ● | ● |
| Assessment Phase 0 + "None fit me" | ● | ◐ | ● |
| Results page redesign | ◐ | ○ | ◐ |
| You-Are-Here dial | ○ | ● | ● |
| Google/Outlook sync | ○ | ● | ○ |
| Trial + payment polish | ○ | ○ | ○ |
| Tester bundle | ○ | ○ | ○ |
| Emerald theming | ○ | ○ | ○ |
| Founding gating | ○ | ○ | ○ |

**What the matrix says:**
- **Life-Ready Gap** is our strongest column — the sprint was well-aimed. 10/16 features hit it directly.
- **Ideal-Brain Assumption** is better served than expected (7 direct hits) — MyRHYTHM-G and tiered reminders pulled their weight.
- **Discharge Cliff** has only 4 direct hits and depends heavily on the Discharge Bridge Kit (v0.1 sprint headline, not yet shipped). Without the Kit landing by 15 Aug, we are marketing a problem the app doesn't yet visibly solve on Day 1.

---

## 4 · Competitor delta (Tier S & A only)

| Our feature | Closest competitor equivalent | Why ours is defensible | Where they're ahead |
|---|---|---|---|
| Document import → audited calendar | None. Motion imports from email; nobody ingests a discharge letter and closes the loop with an audit row. | Clinical-grade audit trail + ephemeral file handling + Support Circle context | — |
| Memory Bridge + source quote | Otter, Fireflies (transcription); Todoist AI (parse text) | We attach the spoken line to the action; Support Circle can co-review (v0.2) | Otter's raw transcription accuracy at scale |
| Smart Scheduling (MYRHYTHM-aware) | Motion, Reclaim | They optimise for ideal brains; we schedule against assessed energy | Motion's polish and API depth |
| Support Circle + Loop-In | CaringBridge (community only); Lotsa Helping Hands (rota only) | We tie Circle to actions, not just posts. Consent-first, role-preset | CaringBridge's install base and SEO |
| MyRHYTHM-G | Calm mood check-in; Headspace daily reflection | 8 states mapped to assessment, not generic emojis. Support-Circle-visible with consent | Calm's brand equity; Headspace's content library |
| Daily Brief | Motion morning digest; Sunsama daily plan | Ours references Support Circle + MYRHYTHM-G state | Sunsama's calmness of design |
| Tiered reminders (Gentle/Steady/Strong) | Google Calendar single-tone reminders | Named tiers tied to cognitive load, not just time offsets | — |
| AI Weekly Planning Assist | Reclaim's Smart 1:1s; Motion's auto-schedule | Ours drafts from Vision → Goals → Priorities → Actions traceability | Reclaim's ML maturity |
| Assessment recency + "None fit me" | Ada, Woebot intake flows | We accept "16 years post" and free-text without breaking the flow | Ada's medical rigour |
| Results page interactive bars | 16Personalities-style result reveal | Aesthetic ownership; ties results to Founding CTA in one screen | — |
| You-Are-Here dial | Command palettes (Linear, Notion) | Spatial, not textual — reduces working-memory load | Command palettes' power-user speed |
| Google/Outlook sync | Every calendar app on earth | We don't win here — we just need to not lose | Everyone |

**Honest read:** we lead where the Support Circle + clinical export stack matters (rows 1, 2, 4, 6). We tie where the differentiator is cognitive-load-aware UX (3, 7, 8, 9, 11). We lose on raw AI/ML polish (transcription accuracy, scheduling optimisation), and we should stop competing on it.

---

## 5 · Recommendations

### Hero these in the investor Loom and landing copy
1. **Document import → calendar with audit** — the single most demonstrable "we close the Discharge Cliff" moment. Under 60 seconds, on camera.
2. **Memory Bridge with source quote** — the "we are Memory-First Design™" proof. One sentence: *"You spoke it, we caught it, and here's the exact line it came from."*
3. **Support Circle Loop-In** — the moat. Show a real invite going to a real person.
4. **Smart Scheduling that respects your MYRHYTHM** — the "why we're not Motion" line.

### Quietly de-emphasise in v0.1 marketing
- Google/Outlook sync — mention in FAQ, not on the landing.
- Tester bundle, Founding gating, Emerald theming — internal wins, not sales points.
- You-Are-Here dial — power feature, show it in the app, not the Loom (risk of "what is that thing?" from investors).

### Gaps this ranking exposes for v0.2

1. **The Discharge Bridge Kit must ship by 15 Aug 2026.** The matrix in §3 shows Discharge Cliff is our weakest problem column. The Kit is the fix. Do not let it slip.
2. **Memory Bridge "Bring a Witness"** (already in memory) — closes the co-listen loop the sprint opened. Highest-leverage v0.2 addition.
3. **Discharge Summary → Life-Ready Plan** (already in memory as v0.2) — is the natural extension of the document-import flow that scored 19/20. Prioritise ahead of anything shinier.
4. **Server-side persistence** of MyRHYTHM-G states and Bridge progress. Currently localStorage; will break at device swap and cost trust once we're past 100 members.

### Candid over-build call-outs

- **AI Weekly Planning Assist** scored 16 but has the lowest readiness (3). We built the pipe before we built the UX. In v0.2, fix the UX before extending the AI.
- **MyRHYTHM-G** is culturally strong but adds a concept to explain. Watch for it becoming a "second thing to learn" on top of the 4C loop. If Day-7 completion rate on the Bridge drops below 30%, MyRHYTHM-G may need to hide until Week 2.
- **You-Are-Here dial** is a beautiful piece of engineering. It is also the exact kind of feature a founder falls in love with while the customer just wanted "where's my calendar." Keep it gated, keep it optional.

### What we should stop doing

- Building features that score high on Competitive Moat but low on Problem Fit. Nothing in this sprint fell in that trap — but the temptation for v0.2 (multi-language, advanced analytics, wearables) is real.
- Shipping calendar hygiene features (sync, timezone, ICS) as if they're differentiators. They're plumbing.

---

## 6 · How to use this doc

- **Founder decisions:** when a new feature is proposed, score it on the four axes before writing any code. If composite < 14 or Problem Fit < 4, defer.
- **Investor conversations:** lead with the four Tier S features. Do not list features — tell the story of one Discharge Cliff Tuesday, and let the features appear inside it.
- **v0.2 planning:** the "Gaps this ranking exposes" list is the backlog seed. Rank v0.2 proposals against this same rubric before scheduling them.

Next review: end of the 15 Aug 2026 sprint (post-Discharge Bridge Kit ship).
