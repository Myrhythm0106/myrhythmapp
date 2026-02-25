

## The Problem: Neither Deck Answers the Investor's Two Core Questions

Both decks currently have a critical gap. An investor watching either deck will think:

1. **"How much money do you actually want from me?"** — Neither deck states a specific funding amount. They show percentage allocations (40% engineering, 30% growth...) but 40% *of what*? There is no number.

2. **"What do I get back?"** — Neither deck explains the return. No equity mention, no valuation, no projected exit, no multiple. An investor puts money in to get more money out. That story is completely missing.

### What Needs to Change — Both Decks

The **Business Model slide** (Slide 16 in both) and **The Ask slide** (Slide 18 in both) need to be rewritten to answer these questions in plain, non-financial language.

---

### Slide 16 (Business Model) — Add "Why This Is a Good Investment"

After the revenue streams and unit economics, add a clear section:

**"Why This Makes Money for Investors"**
- **£500K revenue by Dec 2026** — proves the model works
- **85% gross margins** — for every £1 earned, £0.85 is profit before overheads
- **9:1 LTV:CAC ratio** — every £1 spent acquiring a customer returns £9 in revenue over their lifetime
- **Recurring subscription revenue** — money comes in every month, not one-off purchases
- **Multiple exit paths** — acquisition by health tech or productivity platform, or continued growth to IPO

This section translates the metrics into plain English: "this is a business that makes far more than it spends."

---

### Slide 18 (The Ask) — Rewrite to Be Crystal Clear

Replace the current vague "Investment Opportunity" / "Funding the First Cognitive Performance Network" with a slide that explicitly states:

**The specific funding ask:**
- "We are raising **£250,000** in pre-seed funding" (or whatever the actual number is — I will use £250K as a placeholder since the docs reference early-stage)

**What the investor gets:**
- Equity in MyRhythm (percentage based on valuation)
- Early-stage entry before clinical validation increases valuation
- A seat at the table in a category being created

**What the money buys (in plain English):**
- £100K → Build the product to clinical-grade standard
- £75K → Get the first 1,000 paying users
- £37.5K → Run clinical pilots that prove outcomes
- £25K → Hire key team members
- £12.5K → Safety net for unexpected costs

**What happens next (the investor's journey):**
- **Month 1-3:** Product launched, founding members onboarded
- **Month 4-6:** Clinical pilots producing outcome data
- **Month 7-9:** 2,500+ subscribers, B2B revenue starting
- **Month 10-12:** £500K revenue run rate, Series A ready — investor's stake has grown significantly

**The return story (in plain terms):**
- Pre-seed investors in successful health-tech startups typically see **10-20x returns**
- If MyRhythm hits £500K revenue and raises a Series A, the company valuation increases substantially
- Your £250K investment today could be worth significantly more at the next funding round

---

### Important Note

I need to use placeholder numbers (£250K raise) since the actual funding amount is not specified anywhere in the codebase. The structure will make it trivial to swap in the real number.

---

### Implementation

| File | Action |
|------|--------|
| `src/components/investor/InvestorSlides.tsx` | **MODIFY** Slide16 and Slide18 — add investor return section and explicit ask |
| `src/components/investor/ProductivityInvestorSlides.tsx` | **MODIFY** Slide16 and Slide18 — same changes, productivity framing |

Both decks get the same financial clarity. Four slide functions rewritten across two files.

