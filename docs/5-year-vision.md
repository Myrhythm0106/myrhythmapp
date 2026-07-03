# MyRhythm — 5-Year Vision (2026 → 2031)

**Status:** Draft v1 · Owned by Founder · Review quarterly
**Anchor date:** 3 July 2026
**Companion doc:** [`docs/90-day-sprint.md`](./90-day-sprint.md)

---

## 1 · Why we exist (the through-line to 2031)

MyRhythm fixes three failures the current care system leaves on the table:

1. **The Discharge Cliff** — survivors leave hospital with a folder and no scaffolding.
2. **The Clinical-Ready vs Life-Ready Gap** — "medically stable" is not the same as "can run a Tuesday."
3. **The Ideal-Brain Assumption** — tools, workplaces, and calendars are built for brains that don't exist (fully rested, undistracted, non-fluctuating). That excludes brain-injury survivors, ADHD, MCI/early dementia, chronic stress, and burnout — a market measured in hundreds of millions, not thousands.

Everything on the 5-year plan must be traceable to closing at least one of those three gaps.

---

## 2 · What we are (and what we're not)

- **Product form:** cross-platform app (React/Vite + Capacitor + Supabase). MyRhythm runs *on* an operating system; it is not one.
- **Operating role (internal only):** a **Collaborative Cognitive Continuity operating layer** running the **4C loop** (Capture → Commit → Calibrate → Celebrate), with the **Bridge Pathway** as its clinical on-ramp. Short form: *Collaborative Cognitive Continuity layer.*
- **Why "Collaborative" is load-bearing:** continuity is not solo. The Support Circle, clinicians, and family are first-class participants in the layer — not notification recipients. This is the moat and the answer to "why not Notion / Apple Notes / Google Keep?"
- **Category we are earning (external):** **Memory-First Design™** — the design discipline for brains that fluctuate.

### Language ladder by audience

| Audience | Say this |
|---|---|
| User-facing (landing, app store, onboarding) | *"the Memory-First app for brain-injury recovery, MCI, and cognitive load"* |
| Clinical | *"a post-discharge cognitive-support companion; not a medical device"* |
| Investor (narrative) | *"the default post-discharge companion for brain-injury and MCI, with a clinical bridge into NHS and US rehab networks"* |
| Investor (architecture slide only) | *"a Collaborative Cognitive Continuity operating layer running the 4C loop"* |
| Internal / engineering / strategy docs | any of the allowed internal terms below |

### Allowed internal vocabulary (priority order)

1. **Collaborative Cognitive Continuity layer** — primary short form.
2. **Collaborative Cognitive Continuity operating layer running the 4C loop** — full form (architecture / investor technical slide).
3. **4C loop** — Capture → Commit → Calibrate → Celebrate.
4. **Bridge Pathway** — pre-discharge → life-ready on-ramp.

### Banned externally (and why)

- "OS", "brain OS", "operating system for your brain" — regulatory drift toward medical-device claims, buyer confusion.
- "Second brain" — wrong category (personal knowledge management); we are not Notion/Roam.
- "Brain gym app" — wrong category (cognitive training/games); dismissed as unserious by clinicians.

Category creation is expensive; we don't pay that cost when *Memory-First Design™* already lands.

---

## 3 · End-state options for 2031 (pick one)

I've drafted three flavours. They're not mutually exclusive but the emphasis changes what we build in years 2–3.

### Option A — Consumer-led, clinically credentialed
- **200,000** active users across UK + US + EN-speaking EU
- **£8M ARR**, 85% consumer subscriptions, 15% clinical seats
- **6 NHS trust contracts** + 3 US rehab networks (Shepherd, Craig, one more)
- Memory-First Design™ recognised as a category, not just a product feature
- **Win condition:** MyRhythm is the default download after any brain-injury or MCI diagnosis in the UK

### Option B — Clinical-first, B2B2C
- **60,000** active users (most reach us via a clinician)
- **£12M ARR**, 70% clinical/enterprise seats, 30% consumer
- **20+ NHS trust contracts**, 15 US hospital networks, insurance reimbursement pilot live
- Clinical Export + outcomes data is the moat
- **Win condition:** MyRhythm is on the discharge checklist at every major UK neurorehab unit

### Option C — Platform play (Ideal-Brain Assumption at scale)
- **1M+ active users** across the four audience blocks (TBI/stroke, ADHD, MCI/dementia, stress/burnout)
- **£15M ARR**, mostly consumer, some enterprise/employer channel
- Fewer clinical contracts (5–6 flagship), but every major workplace-wellness platform has a MyRhythm integration
- **Win condition:** "Rhythm-aware" is a checkbox in HR wellness RFPs

**Founder decision needed:** which end-state anchors 2026–2031? My read is **A → drifting toward B** in years 3–5, because the clinical credentialing from A is what unlocks B's contracts. C is the biggest TAM but needs a category shift we can't force from the outside.

---

## 3 · Year-by-year shape (assuming Option A)

Each year has **one theme**, **one proof point**, **one thing we do not do**.

### 2026 · Prove the loop works
- **Theme:** Founding Edition validates the 4C loop and Bridge Pathway on real users.
- **Proof:** 100 paying Founding Members retained ≥ 90 days, NPS ≥ 40, 3 clinical letters of intent.
- **Not doing:** B2B enterprise, brain games as a headline feature, international expansion.

### 2027 · Prove the clinical bridge
- **Theme:** Pre-discharge on-ramp lives inside 2 NHS trusts and 1 US partner.
- **Proof:** 1,000 users onboarded on-ward, outcomes report published, £500K ARR.
- **Not doing:** Consumer paid acquisition at scale — clinical referrals only.

### 2028 · Prove it scales without hand-selling
- **Theme:** Self-serve consumer funnel + Support Circle drives 60% of new users.
- **Proof:** 15,000 active users, £2M ARR, CAC:LTV ≥ 1:3, first employer pilot signed.
- **Not doing:** New audience segments — deepen TBI/stroke + MCI before touching ADHD.

### 2029 · Prove the second audience
- **Theme:** MCI/early-dementia becomes a first-class persona with its own on-ramp.
- **Proof:** 60,000 active users, £4M ARR, one major memory-clinic network on board.
- **Not doing:** ADHD as a separate product — it uses the same rails.

### 2030 · Prove the moat
- **Theme:** Outcomes data + Memory-First Design™ credentials make us the default.
- **Proof:** 120,000 users, £6M ARR, insurance reimbursement pilot in market.
- **Not doing:** White-label — the brand is the moat.

### 2031 · Prove the exit path exists
- **Theme:** Category leadership; strategic optionality (IPO, acquisition, or continued raise).
- **Proof:** 200,000 users, £8M ARR, Option A win condition met.

---

## 4 · What has to be true in the product

Traceable to the three failures, not features for their own sake.

| By end of… | Must exist in-app |
|---|---|
| 2026 | Founding Core (v0.1) — 9 `/launch/*` routes, Memory Library, Support Circle, Clinical Export, Bridge Pathway landing pages |
| 2027 | v0.2 Brain Games shipped and used by ≥ 50% of active users; Pre-discharge on-ramp (ward flow) with clinician sign-off |
| 2028 | Self-serve consumer funnel with paid acquisition; Support Circle referral loop closed; outcomes dashboard for clinicians |
| 2029 | MCI/dementia persona with its own onboarding, memory prompts, and caregiver dashboard |
| 2030 | Outcomes API for insurance and employer channels; multi-language (start EN → ES) |
| 2031 | Platform surface — third-party integrations (calendar, EHR, workplace wellness) |

---

## 5 · Guardrails that hold across all 5 years

Non-negotiable — repeat these when we're tempted to drift.

- **No medical claims.** Ever. We do not diagnose, treat, or cure. Disclaimers stay.
- **Memory-First Design™** is the visible brand descriptor. In-app labels (Capture/Commit/Calibrate/Celebrate) stay as-is.
- **Inclusive Design First** — 16px body floor, 56px tap targets, max 3 primary choices per screen. No "senior mode" toggle.
- **The 4C loop is the product.** Every feature must earn its place inside Capture → Commit → Calibrate → Celebrate, or it doesn't ship.
- **Founder-led narrative.** The story is Belinda's story. That's the moat as much as the code.

---

## 6 · Open questions the founder needs to answer

1. Which end-state (A / B / C) do we commit to?
2. Do we take institutional money before 2028, and if so, at what stage?
3. UK-first or transatlantic-from-day-one for clinical partnerships?
4. When does Belinda transition from doing everything to hiring the person who does the thing?

---

## 7 · Files this doc supersedes / links to

- Supersedes: nothing (this is the first 5-year artifact).
- Links to: `docs/90-day-sprint.md`, `strategic-documents/24-Month-Master-Execution-Plan.md`, `src/data/roadmapData.ts`, `strategic-documents/Feature-Release-Calendar.md`.

Once you pick an end-state, I'll trim the other two options out and lock v1.
