# MyRhythm Go-To-Market Playbook (2026–2028)

## Goal

Produce a single, board- and operator-ready **Go-To-Market Playbook** that turns the 5-Year Vision into a transparent, week-by-week executable plan to acquire users profitably, defend high gross margin (target 85%+), and reach £3M ARR by end of Year 2. Every action must be measurable, owned, and time-boxed.

## File Produced

- `/mnt/documents/MyRhythm_GTM_Playbook_v1.docx`

All prior documents (Use Cases v4, Timeline v3, 5-Year Vision v1, Founding Member Launch Strategy) remain untouched and are referenced as canonical inputs.

## Document Structure

1. **Cover** — Title, v1.0, 26 May 2026, 3pt confidentiality footer (Document Confidentiality Standard).
2. **Executive Summary (1 page)** — Thesis, 3 wedge segments, North-Star metric (Weekly Active Paying User), 90-day / 12-month / 24-month targets, headline unit economics (CAC < £25, LTV > £240, gross margin 85%+, payback < 4 months).
3. **Market Wedge & Beachhead** — Why we enter through **ABI/TBI survivors + their caregivers** first (highest pain, weakest competition, clearest Discharge Cliff narrative), then expand to dementia caregivers, then high-performers. Map to existing Use Cases v4 personas.
4. **Ideal Customer Profile (ICP) Scorecard** — Per-segment ICP table: trigger event, where they are, willingness to pay, decision-maker, objections, winning message.
5. **Positioning & Messaging Engine**
   - One-line positioning ("MyRhythm is the Cognitive Continuity OS that bridges clinical recovery to real life").
   - Message house: persona → pain → promise → proof.
   - Banned phrases (no medical claims — per Medical Disclaimer Policy).
   - Hero proof points and the Bridge Pathway narrative.
6. **Competitive Battlecards** — One page each vs Lumosity, Headway, Calm, Motion, CogniFit, Constant Therapy. "When prospect says X, we say Y." Land-and-expand traps competitors cannot copy.
7. **Pricing & Packaging for Margin**
   - Confirm Founding tier (£10/mo) → Regular (£15/mo) → Care Network seat add-on (£8/mo per caregiver) → Clinic/Employer per-seat (£25–£40/mo).
   - Discount discipline rules (never discount Founding, annual = 2 months free max).
   - Gross-margin math: hosting + AI inference + Memory Bridge transcription cost per user/month vs ARPU; target ≥85% blended GM by month 12.
   - Pricing experiments backlog (paywall placement, trial length, annual nudge).
8. **Acquisition Channels — Ranked by CAC** (each with budget, owner, KPI, kill criteria at 60 days):
   - **Tier 1 (proven, fund first):** Clinical referral partnerships (Shepherd, Craig, UK NHS trusts), ABI/TBI Facebook/Reddit communities, caregiver SEO content, founder-led LinkedIn.
   - **Tier 2 (test, scale on signal):** Headway UK partnership, Google Search (high-intent terms), podcast sponsorships (brain health), YouTube long-form.
   - **Tier 3 (defer until £1M ARR):** Paid social at scale, influencer, TV/radio.
9. **The Funnel — Numbers That Must Hold**
   - Visitor → Assessment start: 25%
   - Assessment → Trial: 60%
   - Trial → Paid: 22%
   - Month-1 retention: 85%; Month-6: 65%
   - NPS: 60+
   - Includes diagnostic table: if metric drops, where to look and which experiment to run.
10. **90-Day Launch Plan (Week-by-Week)** — Gantt-style table: weeks 1–13, columns for Acquisition / Product / Clinical / Content / Ops, each cell with owner and deliverable. Ends at 250 Founding Members + 2 clinical pilots signed.
11. **12-Month Operating Plan** — Quarterly OKRs aligned to 5-Year Vision Year-1 targets (£500K ARR, 1,000 founders). Hiring sequence (Growth lead → Clinical partnerships → Content → Support).
12. **24-Month Expansion** — Trigger gates to unlock B2B2C (clinic seats), dementia caregiver vertical, US market entry, NHS Digital Tech Assessment submission.
13. **Unit Economics Dashboard (template)** — Table the team updates weekly: CAC by channel, LTV, payback months, GM%, MRR, Net Revenue Retention, Care Network attach rate.
14. **Retention & Expansion Playbook** — Onboarding Golden Path, 5/25-day voice retention reminders, Care Network attach motion (every survivor invites ≥1 caregiver), Promise Score & streak celebrations as retention levers.
15. **Risk Register & Kill-Switches** — Top 8 risks (CAC inflation, clinical partner stall, AI cost spike, regulatory drift, churn cliff at month 3, founder bandwidth, ad platform policy on health, copycat from big tech) with mitigation owner and trigger threshold.
16. **What We Will NOT Do** — Mirrors 5-Year Vision guardrails (no diagnosis, no ads, no data resale, no clinician displacement, no discounting Founding tier).
17. **Scorecard — One Page** — Single table the founder reads every Monday: North-Star, 5 input metrics, 3 financial metrics, RAG status.
18. **Sources** — Standard sources block.

## Out of Scope

- No edits to existing v1–v4 docs or 5-Year Vision.
- No app code, DB, or `/launch/*` changes.
- No clinical efficacy claims; all language supportive/compensatory per Medical Disclaimer Policy.
- No new pricing committed in-app — playbook proposes; any code/pricing changes are a separate build-mode task.

## Technical

- `docx-js` script in `/tmp/`, output to `/mnt/documents/`.
- US Letter, 1" margins, Arial, H1/H2 with `outlineLevel`.
- Tables: `WidthType.DXA`, matching `columnWidths`, `ShadingType.CLEAR` headers, cell margins.
- Lists via `LevelFormat.BULLET` numbering config.
- 3pt confidentiality footer on every page (per Document Confidentiality Standard).
- QA: convert to PDF + per-page JPEG, inspect every page for clipping/overflow, regenerate until clean.
- Return one `<presentation-artifact>` tag.
