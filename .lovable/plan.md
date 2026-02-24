

## Brain Health & Productivity Investor Deck — Alternate Entry Point

The current deck starts with TBI and expands outward. This new deck **inverts the funnel**: starts with the massive brain health and productivity market, then reveals the clinical depth as a defensible moat.

Same presentation engine (`InvestorDeckPage.tsx`), new route, new slide component.

---

### The Strategic Inversion

| Current Deck | New Deck |
|---|---|
| Starts with TBI pain | Starts with universal cognitive inefficiency |
| Clinical credibility → mass market | Mass market opportunity → clinical moat |
| "Built for TBI, useful for everyone" | "Built for everyone, validated in the hardest cases" |
| Wedge = underserved patients | Wedge = professionals losing productivity |
| Emotional hook | Commercial hook |

---

### 18-Slide Structure

| # | Title | Purpose |
|---|-------|---------|
| 1 | **MyRhythm** — "Your brain is your operating system. It has no support layer." | Title. Category: Cognitive Performance Infrastructure |
| 2 | **The Productivity Problem** — "Knowledge workers lose 2.1 hours/day to cognitive friction" | Hook with universal stats (interruptions, context-switching, forgotten commitments) |
| 3 | **The Hidden Cost** — "Broken commitments erode trust, teams, and careers" | The downstream damage: missed follow-ups, lost credibility, relationship erosion |
| 4 | **Why It Happens** — "The gap between intending and doing has no infrastructure" | Insight: no system exists between thinking and reliably acting |
| 5 | **The Scale** — "A universal problem disguised as individual failure" | Populations: professionals, students, aging adults, ADHD, caregivers, post-surgery, brain injury |
| 6 | **Why Tools Fail** — "Productivity tools assume the brain they are trying to help" | Same table concept but framed for productivity: Notion, Todoist, Apple Reminders, Calendly |
| 7 | **The Insight** — "The problem is not organisation. It is cognitive continuity." | Reframe from task management to behavioural reliability |
| 8 | **The Category** — "Cognitive Performance Infrastructure" | New category: the missing layer between intention and reliable execution |
| 9 | **The Solution** — "Capture → Commit → Calibrate → Celebrate" | Same behaviour loop, framed for productivity/performance |
| 10 | **How It Works** — "A closed performance loop across the day" | Morning intention → interruption → re-engagement → completion → confidence |
| 11 | **The Clinical Moat** — "Validated in the hardest cognitive environments" | The aha: built to work for TBI survivors, which means it works for everyone. Clinical-grade reliability as competitive advantage |
| 12 | **The Expansion** — Concentric circles inverted: Professionals → Caregivers → MCI → TBI | "We start where the volume is massive and deepen where the need is clinical." Caption explains wedge, expansion, defensibility |
| 13 | **Market Size** — TAM/SAM/SOM | TAM: $22B global productivity + cognitive wellness. SAM: $4.2B English-speaking knowledge workers + brain health. SOM: $35M UK+US Year 1 |
| 14 | **Distribution** — "Built-in adoption channels: Workplace → Home → Family → Clinical → Insurer" | Viral loops: team accountability, family support circles, clinical referrals |
| 15 | **Early Evidence** — "What happens when people use it" | Consistency improves, restart after interruption improves, confidence improves. Working MVP, lived-experience validation |
| 16 | **Business Model** — "Recurring cognitive infrastructure" | B2C subscription, B2B team/enterprise licensing, clinical licensing (future). £500K target Dec 2026 |
| 17 | **Competitive Advantage** — "Why this wins" | Not a productivity app (assumes functioning). Not therapy (episodic). Cognitive continuity infrastructure (always-on). Feature comparison table |
| 18 | **The Ask** — "Funding the first cognitive performance network" | Use of funds, milestones, contact. "Built from the gap it solves." |

---

### Key Messaging Differences

1. **From "behavioural reliability" to "cognitive performance infrastructure"** — same system, investor-friendly productivity framing
2. **Clinical depth becomes the moat, not the entry** — Slide 11 is the "aha" moment: "We built this to work for TBI survivors. If it works there, it works everywhere."
3. **TAM is larger** — $22B productivity market vs $4.2B cognitive wellness. Different investor appetite
4. **Distribution starts with teams** — workplace adoption, then home, then clinical. Reverses the current flow

---

### Implementation

| File | Action |
|------|--------|
| `src/components/investor/ProductivityInvestorSlides.tsx` | **CREATE** — all 18 slides with productivity-first messaging |
| `src/pages/ProductivityDeckPage.tsx` | **CREATE** — presentation shell (same pattern as InvestorDeckPage) |
| `src/App.tsx` | **MODIFY** — add `/investor-deck-productivity` route |

The existing `/investor-deck` (clinical-first) remains untouched. Two decks, two entry points, same company, same product.

Design language identical: white backgrounds, near-black type, gradient accents, clean tables, generous spacing. Only the narrative arc and framing change.

