# MyRhythm — 90-Day Sprint (3 Jul → 1 Oct 2026)

**Status:** Draft v1 · Owned by Founder · Review every Monday
**Anchor date:** 3 July 2026 (Friday)
**Companion doc:** [`docs/5-year-vision.md`](./5-year-vision.md)

---

## 1 · The one sentence

By **1 October 2026**, MyRhythm has **100 paying Founding Members** using the 4C loop weekly, the **Discharge Bridge Kit shipped and in use**, and **3 clinical letters of intent** on file — enough evidence to open the 2027 clinical-bridge conversation.

If we hit two of three, the sprint was a win. If we hit one or none, we stop and re-plan before starting the next 90.

---

## 2 · Success metrics (measure weekly)

| # | Metric | Baseline (3 Jul) | Target (1 Oct) | How measured |
|---|---|---|---|---|
| M1 | Paying Founding Members | ~[TBC — fill in] | **100** | Stripe dashboard |
| M2 | Weekly-active users completing a full 4C loop | [TBC] | **≥ 40%** of paying members | Supabase event query |
| M3 | Discharge Bridge Kit live at `/launch/discharge-bridge` | Not built | **Shipped by 15 Aug** and used by ≥ 30% of new members | Feature route live + Loom weekly log |
| M4 | Clinical letters of intent | 0 | **3 signed** | Founder folder |
| M5 | NPS from Founding Members | — | **≥ 40** | In-app survey wk 10 |
| M6 | Weekend self-test pass rate | Partial | **100% green on 6 sections** | `docs/v0.1-weekend-self-test.md` |

M1 is a lag metric. M2, M3, M6 are lead metrics — those are the ones we drive.

---

## 3 · The three workstreams

Everything else is noise. If a task doesn't belong to one of these, defer it.

### Workstream A — Ship & harden Founding Edition (v0.1)
Owner: Founder + Lovable · Runs weeks 1–8
- Weekend self-test all green (6 sections, screenshots stored)
- Husband walkthrough passes end-to-end without help
- Purchase → `/launch/welcome` → `/launch/home` continuity confirmed
- All 9 `/launch/*` routes have EditionBadge, disclaimers, no medical claims
- Support Circle invite flow working with 1 real invitee
- Clinical Export footer correct on every generated PDF

### Workstream B — Grow to 100 Founding Members
Owner: Founder · Runs weeks 2–13
- Landing page conversion audited (`/launch` — CTA above the fold, one primary action)
- Founder story email sequence (5 emails, published Substack + inbox)
- 3 podcast/press appearances booked
- Referral loop live in-app (invite → free month for both)
- Weekly office hours for Founding Members (Fridays 4pm UK)

### Workstream C — Ship the Discharge Bridge Kit + open clinical door
Owner: Founder + Lovable · Runs weeks 3–13
- Discharge Bridge Kit spec locked (see [`docs/discharge-bridge-kit.md`](./discharge-bridge-kit.md))
- `/launch/discharge-bridge` 7-day path + `/launch/discharge-bridge/handout` printable one-pager live by **15 Aug (week 6)**
- Discharge Handover PDF variant working end-to-end from Day 7
- 3 clinician conversations → 3 letters of intent (LOI 1 pulled forward to week 4)
- 5-minute investor Loom recorded once the Kit is live (see [`docs/investor-loom-script.md`](./investor-loom-script.md))
- **Deferred to post-sprint:** Brain Games v0.2. Code stays in place at `/launch/games`, removed from v0.1 headline. Reason: the Kit is a wedge; Brain Games is retention. Wedge first.

---

## 4 · Week-by-week milestones

Weeks are Mon–Sun. Week 1 = 6 Jul – 12 Jul.

| Week | Dates | Milestone |
|---|---|---|
| 1 | 6–12 Jul | Weekend self-test 100% green · husband walkthrough clean · sprint doc published |
| 2 | 13–19 Jul | First 10 paying Founding Members onboarded · founder story email 1 live |
| 3 | 20–26 Jul | Support Circle invite tested with 3 real users · referral loop shipped |
| 4 | 27 Jul – 2 Aug | 25 paying members · founder story emails 2–3 live · Brain Games spec locked |
| 5 | 3–9 Aug | Brain Games dev starts · first clinician conversation booked |
| 6 | 10–16 Aug | 40 paying members · podcast 1 recorded · Brain Games memory module in review |
| 7 | 17–23 Aug | Clinician conversation 2 · Brain Games focus module in review · NPS survey drafted |
| 8 | 24–30 Aug | 60 paying members · Founding Edition retro (what's holding retention?) |
| 9 | 31 Aug – 6 Sep | Brain Games progress analytics + achievements in review · LOI 1 signed |
| 10 | 7–13 Sep | NPS survey sent · 75 paying members · podcast 2 released |
| 11 | 14–20 Sep | **Brain Games ships to `/launch/games` (19 Sep)** · LOI 2 signed |
| 12 | 21–27 Sep | 90 paying members · v0.2 announcement email · press push |
| 13 | 28 Sep – 1 Oct | **100 paying members · LOI 3 signed · sprint retro + next-90 kickoff** |

---

## 5 · What we are explicitly not doing in this 90

Say no with a reason.

- **B2B enterprise features.** Wrong horizon. Belongs in 2028.
- **International expansion / localisation.** UK + US-English only. Save ES for 2030.
- **New personas beyond TBI/stroke + light MCI touch.** ADHD and dementia get their own sprints later.
- **Rebuilding the marketing site.** Landing page tune-up only.
- **New pricing tiers.** Founding Edition price holds until 1 Oct review.
- **Paid ads.** Founder-led acquisition until we know retention holds.

---

## 6 · Weekly review ritual (Monday 30 min)

Same 6 questions every Monday. Answer in a running log in this file (Section 8).

1. Did last week's milestone ship?
2. What's the number on M1–M6 this week vs. last week?
3. What surprised us?
4. What are we doing this week that we should stop?
5. Does the 1 Oct target still hold, or do we need to adjust?
6. Who do we need to ask for help from before next Monday?

---

## 7 · Risk register

| Risk | Likelihood | If it happens | Mitigation |
|---|---|---|---|
| Retention < 40% weekly-active | Med | Sprint fails M2 → replan | Retro at week 8, ship one retention fix by week 10 |
| Brain Games slips past 19 Sep | Med | v0.2 headline gone | Cut scope to memory + focus modules only; ship progress/achievements in v0.3 |
| Clinician conversations stall | Med | LOI target missed | Widen from NHS to independent neuropsychs |
| Founder burnout | High | Everything slips | Fridays after office hours = protected. No sprint work Sat/Sun. |
| Payment/onboarding gap surfaces | Low | Refunds + trust hit | Weekend self-test + husband walkthrough are the guard |

---

## 8 · Weekly log (append as we go)

### Week 0 · 3 Jul (today)
- Sprint doc + 5-year vision drafted.
- Weekend self-test partially green; five legacy redirects fixed, purchase→`/launch/welcome` wired.
- Founder decision pending: 5-year end-state (A / B / C).
- **Next action:** finish weekend self-test, then run the husband walkthrough clean.

### Week 1 · 6–12 Jul
_TBD_

### Week 2 · 13–19 Jul
_TBD_

_(continue weekly)_

---

## 9 · Definition of "sprint complete" on 1 Oct 2026

- [ ] 100 paying Founding Members
- [ ] Brain Games shipped and used by ≥ 30% of active members
- [ ] 3 clinical LOIs signed
- [ ] NPS ≥ 40
- [ ] Weekend self-test still passes end-to-end
- [ ] Next-90 sprint drafted before 5 Oct

Three or more checked = green. Two = amber, replan. One or none = red, stop and rethink.
