

# Fix Founding Member Pricing + Add Layman Interpretations

## Problem 1: Pricing Error in Excel

The app's pricing config is correct — Founding Members pay **£10/month** (cheaper) and regular users pay **£15/month** (more). The Excel model has these swapped or mislabelled. We'll regenerate the Excel with correct pricing:

- **Founding Member price**: £10/month (the discount, locked in forever)
- **Standard/Regular price**: £15/month (what new users pay after founding period ends)

## Problem 2: Layman Interpretations

Every financial row/metric in the Excel will get a plain-English explanation column. For the interactive dashboard, each metric will show a tooltip or subtitle in everyday language.

### Examples of layman interpretations:

| Financial Term | Layman Explanation |
|---|---|
| MRR £15,000 | "We're earning £15,000 every month from subscriptions" |
| ARR £180K | "If this month repeated for a year, we'd earn £180K total" |
| CAC £35 | "It costs us £35 in marketing to get one new paying customer" |
| LTV £315 | "Each customer is worth £315 to us over their whole lifetime" |
| LTV:CAC 9:1 | "For every £1 we spend getting a customer, we earn £9 back" |
| Gross Margin 85% | "We keep 85p of every £1 earned after basic costs" |
| Burn Rate £22K | "We're spending £22K more than we earn each month" |
| Runway 11 months | "At this spending rate, our money lasts 11 more months" |
| EBIT -£8K | "We lost £8K this month after all expenses — normal for startups" |
| Churn 5% | "5 out of every 100 subscribers cancel each month" |
| Payback 3.5 months | "We recover the cost of getting a customer in 3.5 months" |

## Deliverables

### 1. Regenerate Excel (`MyRhythm_LEAP_OS_Financial_Model_v2.xlsx`)

- Fix founding vs standard pricing labels and values
- Add a "What This Means" column to every sheet with plain-English explanations
- Every row with a financial figure gets a layman interpretation
- Assumptions sheet: each assumption gets a "Why This Matters" note
- Revenue sheet: each monthly line explains what's driving the number
- P&L sheet: each line item explained in everyday language

### 2. Update Interactive Dashboard (`FounderFinancialsPage.tsx`)

- Add subtitle/description text under every metric card explaining what it means
- Unit economics section: add plain-English explanation under each value
- Funding roadmap: add "what this means for you" context
- Summary cards: add layman-friendly subtitles

### Files

| # | File | Action |
|---|------|--------|
| 1 | `/mnt/documents/MyRhythm_LEAP_OS_Financial_Model_v2.xlsx` | Regenerate with correct pricing + layman explanations |
| 2 | `src/pages/FounderFinancialsPage.tsx` | Add layman interpretations to all metrics and charts |

