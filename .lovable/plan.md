

# Three Updates: Title Slide, MVP Appendix, and 5-Year Strategy Alignment

## Overview

Three deliverables:
1. A Deloitte/Accenture-grade title slide for the in-app investor deck
2. A recommended MVP appendix slide added to the deck
3. An updated 5-Year Strategy PDF (v5) aligned with the investor deck content

---

## 1. Deloitte/Accenture-Influenced Title Slide

Replace `Slide01` in `InvestorSlides.tsx` with a premium consulting-firm aesthetic:

- **Dark background** (`#0a0a1a`) — the "boardroom" look Deloitte and Accenture use
- **Thin accent line** at top (brand gradient orange → violet, full width, 4px)
- **"MyRhythm"** in large, bold white type (80pt) with subtle letter-spacing
- **Subtitle**: "Collaborative Cognitive Management" in muted teal (`#028090`)
- **Tagline**: "Bridging the gap between clinical care and daily living" in light grey
- **Divider line** (thin, 1px white at 10% opacity)
- **Bottom metadata bar** in structured layout:
  - Left: "Investor Presentation | Pre-Seed Round | Confidential"
  - Center: "Prepared by Annabel Aaron, Founder & CEO"
  - Right: "March 2026"
- **"CONFIDENTIAL"** watermark-style text, small, bottom-right corner
- Clean geometric feel — no emojis, no gradients on text, just precision typography

This replaces the current light-background centred title with something that commands the room.

---

## 2. Recommended MVP Slide (Appendix)

Add a new `Slide20` — "Appendix: Recommended MVP" — after the References slide. This slide answers "what gets built first and why":

**Layout**: Two-column with a priority matrix feel

**Left column — "MVP Core (Months 1-3)":**
- Memory Bridge (voice capture + AI action extraction)
- Support Circle (invite up to 5 people, escalation alerts)
- Daily Brain Boost (50 cognitive exercises from the 240+ library)
- Smart Scheduling (calendar sync + energy-aware time blocking)
- Founding Member subscription (Stripe, £10/month)

**Right column — "Post-MVP (Months 4-6)":**
- Clinical Dashboard (provider view of patient progress)
- Full Brain Boost library (240+ exercises)
- Progressive Escalation v2 (customisable urgency tiers)
- B2B licensing portal
- Analytics and outcome reporting

**Bottom bar**: "MVP Scope: 12 weeks | Budget: £100K of £250K raise | Target: 50 founding members at launch"

**Why this MVP**: The features selected are the ones that demonstrate the CCM methodology end-to-end — capture (Memory Bridge), commit (Support Circle + Scheduling), calibrate (Brain Boost tracking), and celebrate (progress milestones). They also create the Support Circle virality loop from day one.

Update `TOTAL_SLIDES` in `InvestorDeckPage.tsx` from 18 to 20 (fixing the existing off-by-one: 19 slides currently, plus this new one = 20).

---

## 3. Updated 5-Year Strategy PDF (v5)

Regenerate `MyRhythm_5_Year_Strategy_v5.pdf` using ReportLab, aligned with the investor deck's numbers and narrative:

**Content alignment with investor deck:**

| Element | Investor Deck Says | Strategy v5 Will Say |
|---------|-------------------|---------------------|
| Raise | £250K pre-seed | £250K pre-seed → £2M Series A → £10M Series B |
| Year 1 target | £500K revenue | £500K ARR by Dec 2026 |
| TAM | $4.2B | $4.2B (ABI $2.4B + TBI $1.8B) |
| SAM / SOM | $1.1B / $28M | Same |
| Margins | 85% gross | 85% gross, 9:1 LTV:CAC |
| Beachhead | US (NYC, LA, Chicago) | Same — Shepherd Center, Craig Hospital |
| Year 5 target | Per memory: £100M+ ARR | £100M+ ARR |

**Document structure** (ReportLab, dark header bars with brand colours):
1. Executive Summary (1 page)
2. Market Opportunity & TAM/SAM/SOM (1 page)
3. Year-by-Year Roadmap: 2026-2031 (2 pages)
4. Revenue Model & Unit Economics (1 page)
5. Funding Roadmap: Pre-seed → Series D (1 page)
6. Go-to-Market: Bowling Pin Expansion (1 page)
7. Risk Mitigation (1 page)

**Author**: "Annabel Aaron, Founder & CEO" on the cover page
**Design**: Professional consulting-style with MyRhythm brand colours, clean tables, no emojis

Full visual QA cycle on the PDF before delivery.

---

## Files to Create/Edit

| File | Action |
|------|--------|
| `src/components/investor/InvestorSlides.tsx` | Edit Slide01 (title), add Slide20 (MVP appendix), update slides array |
| `src/pages/InvestorDeckPage.tsx` | Update `TOTAL_SLIDES` to 20 |
| `/mnt/documents/MyRhythm_5_Year_Strategy_v5.pdf` | Create via ReportLab script |

