## Goal

Two deliverables, both document-only, no code changes:

1. **Alignment sweep** — bring the existing strategy docs in line with the latest v2 problem-fit + infographic (category claim, cohort map, MVP-readiness matrix) so nothing contradicts.
2. **Founders-market marketing plan** — a practical, maintainable action plan to circulate the MVP to your immediate founders/warm network (not paid acquisition, not public launch).

Anchor date: 28 July 2026. Founding-stage rules (single CTA "Become a Founding Member", no public broadcast of Loom, no medical claims) are respected.

---

## Part 1 — Alignment sweep (surgical edits only)

Only the docs that could contradict v2 get touched. Everything else stays.

| Doc | Change |
|---|---|
| `docs/market-evidence.md` | Add one-line pointer to v2 category claim + cohort map so sales script matches the infographic. No stat changes. |
| `docs/myrhythm-one-page-pitch.md` | Update the category sentence to the locked wording ("Collaborative Cognitive Continuity layer, externally Memory-First Design™"). Add the six-cohort strip as a single line. |
| `docs/feature-value-ranking.md` | Add pointer row: "For cohort applicability of each feature, see §4.3 of problem-fit v2." |
| `docs/founding-core-value-map.md` | Verify wording matches v2; fix any drift in category/cohort language. |
| `strategic-documents/Founding-Member-Launch-Strategy.md` | Reconcile with new marketing plan (see Part 2) so the two don't diverge — this doc becomes the *strategy*, the new plan becomes the *operational action plan*. |
| `strategic-documents/MyRhythm-Launch-Strategy-v2.md` | Same reconciliation; add pointer to new action plan. |
| `docs/investor-loom-script.md` | Confirm category sentence in segment 2:30–3:30 matches locked wording; small edit if drifted. |

**Explicitly not touched:** `problem-fit-and-market.md` (already v2), `discharge-bridge-kit.md`, `v0.1-*` test docs, `5-year-vision.md`, `24-Month-Master-Execution-Plan.md`, `Revenue-Projections`, `Pricing-Evolution-Timeline`. These are either already current or downstream of decisions not being changed.

---

## Part 2 — Founders-market marketing plan

New file: **`docs/founders-market-marketing-plan.md`**

Scope: the **first 100 Founding Members** from your immediate warm network — no paid ads, no public LinkedIn/X broadcast (per founding-stage rules), no press.

### Structure of the new doc

1. **Objective** — 100 Founding Members + 3 clinical LOIs by 1 Oct 2026. One primary CTA everywhere: "Become a Founding Member" → `/subscribe`.

2. **Audiences (4 concentric rings)**
   - Ring 1: Personal warm list (family, friends, ex-colleagues who know the founder story)
   - Ring 2: Brain-injury community contacts (Headway, ABI support groups, survivor peers)
   - Ring 3: Clinicians / rehab contacts (for LOIs, not for member acquisition)
   - Ring 4: Founder-of-founders (other early-stage founders, angels, advisors — for referrals, not direct sales)

3. **Channels (only the ones a solo founder can actually maintain)**
   - 1:1 personal email (primary — reuses Loom distribution templates)
   - WhatsApp/Signal warm intros (Ring 1 + 2)
   - Loom link (already documented in `investor-loom-distribution.md` — this plan reuses, doesn't rewrite)
   - Printed Discharge Bridge Kit handouts for clinician meetings
   - One monthly founder update email to everyone who's been contacted (opt-out, no automation platform)

4. **12-week rolling action plan** (weeks of 3 Aug → 26 Oct 2026)
   - Every week has: outreach target (N people per ring), content task (max 1), one metric to log
   - Weekly rhythm anchored to Monday review already in `90-day-sprint.md` §8
   - Deliberately capped at ~4 hours/week of marketing work so a solo founder can sustain it

5. **Assets checklist** (what must exist before outreach starts)
   - Loom recorded and unlisted ✓ (script already exists)
   - Printed Bridge Kit PDFs ✓
   - Founding Member landing (`/subscribe`) ✓
   - Personal email templates for each ring (in the doc)
   - Monthly-update template (in the doc)

6. **Metrics — the only 5 numbers to track**
   - New Founding Members this week
   - Loom viewers past 3:30 (from Loom analytics)
   - Reply rate by ring
   - LOI conversations open / signed
   - Weekly-active rate of existing members (from Supabase)

   Logged in a single weekly line in `90-day-sprint.md` §8 — no new dashboard, no new tool.

7. **Maintenance model** — how to keep this plan alive
   - Owner: Founder (only)
   - Review cadence: Monday 20-min review
   - Update trigger: monthly, or when a metric target is missed 2 weeks running
   - Version convention: `founders-market-marketing-plan_vN.md` when a material change lands

8. **Guardrails (non-negotiable)**
   - No medical claims in any outreach copy
   - No public social broadcast during Founding phase
   - No paid acquisition until 3 LOIs signed
   - Every email personal, from the founder's address, never a "team@" alias
   - "Memory-First Design™" is the external descriptor; "Collaborative Cognitive Continuity layer" stays internal

9. **What this plan deliberately excludes** (so scope doesn't creep)
   - SEO/content marketing
   - Paid ads
   - Influencer/podcast tour
   - Press outreach
   - Community platform (Discord/Slack)
   - Referral program tech (too early; ask verbally)

---

## Out of scope

- No code changes.
- No new app routes or UI.
- No changes to pricing, Founding Edition scope, or v0.1 feature set.
- No changes to problem-fit v2 or the infographic.
- No new automation tooling (CRM, email platform, analytics).

## Deliverables

1. Edits to the 7 docs listed in Part 1 (small, targeted).
2. New file: `docs/founders-market-marketing-plan.md` (~600–900 lines of practical copy + templates + weekly grid).
