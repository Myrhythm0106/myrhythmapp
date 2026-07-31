# MyRhythm Pricing Rationale

**Status:** Locked for v0.1 · **Owner:** Founder · **Last reviewed:** 31 July 2026
**Canonical source in code:** `src/config/pricing.ts` (`foundingMemberConfig`, `friendsFamilyConfig`)

---

## 1 · The ladder

| Tier | Monthly | Yearly | Seats | Duration | How you get it |
|---|---|---|---|---|---|
| Regular | £15.00 | £150 | Unlimited | Ongoing | Public sign-up after the founding window |
| Founding Member | £10.00 | £100 | 500 | **For life** | Sign up during the founding window |
| Friends & Family | £7.50 | £75 | 50 | **For life** | Invite-only access code (`FF…`) |

Free trial: 7 days, card on file, cancel anytime.

---

## 2 · Competitor pricing (UK consumer, monthly equivalent)

| Product | Cluster | Monthly | Annual | Notes |
|---|---|---|---|---|
| Calm | Mindfulness | ~£12.99 | ~£34.99–£49.99 | Annual heavily discounted; content library, no follow-through |
| Headspace | Mindfulness | ~£12.99 | ~£49.99 | Same shape — content, not continuity |
| Lumosity | Brain training | ~£11.99 | ~£59.99 | Games; no real-life carry-over |
| Elevate | Brain training | ~£9.99 | ~£44.99 | Games; no support circle |
| BrainHQ | Clinical-adjacent | ~£12.00 | ~£75 | Evidence-led drills, no daily planning |
| Sunsama | Planning | ~£16–£20 | ~£16/mo billed yearly | Daily planning for high-functioning knowledge workers |
| Motion | Planning | ~£26–£34 | — | AI scheduling, high cognitive load |
| Reclaim.ai | Planning | ~£8–£14 | — | Calendar automation only |
| Todoist Pro | Planning | ~£4.00 | ~£3/mo yearly | Task list, no cognitive support |
| Jour / Reflectly | Journaling | ~£5–£9 | ~£30–£50 | Reflection only |
| Birdie / Jointly (care) | Care coordination | £0–£8 | — | Carer-facing, not survivor-facing |

**Read of the market:** the serious consumer band is £10–£15/month. Planning tools that do real work sit £16–£34 but assume an ideal brain. Anything under £5 is a to-do list and signals low value.

---

## 3 · Why £15 regular

- It sits at the **top of the wellbeing band and the bottom of the planning band** — which is exactly what MyRhythm is: a daily continuity layer, not a content library.
- Undercutting Calm at £9.99 would have priced us as a meditation alternative. We are not competing on content minutes.
- £15 supports the unit economics in F1 at 5% monthly churn without needing scale we do not have.
- It leaves genuine room for the two discounted tiers to feel like a real gift rather than a fake anchor.

## 4 · Why £10 Founding Member, for life, 500 seats

- A **33% lifetime discount** is materially better than the annual discounts competitors offer, and it is the standard shape founding cohorts recognise.
- "For life" buys what we actually need in the founding window: **retention and testimony**, not margin. A member who stays two years and gives us one clinician introduction is worth more than £5/month.
- **500 seats** caps the lifetime liability. At full take-up that is £30K/year of foregone revenue against the regular price — visible, bounded, and defensible to an investor.
- The scarcity is real, not theatrical. When the 500 are gone the price is £15.

## 5 · Why £7.50 Friends & Family, for life, 50 seats

- Exactly **50% of regular**. A round, honest number that reads as a gift rather than a pricing experiment.
- **Invite-only via `FF…` access codes** through the existing `founding_access_codes` gate. It cannot be discovered, guessed from the pricing page, or shared into a public discount forum.
- **50 seats** is the whole cap. Maximum lifetime exposure is £4,500/year against regular price — small enough that it never distorts the F1 model, large enough to cover every early tester, family member and first believer.
- This is the cohort who will use the app badly, honestly, and out loud. That is the point. The price is what we pay for candour.

## 6 · How long each price lasts

- Founding Member and Friends & Family are **for life, for that account**, as long as the subscription stays active. A cancelled subscription forfeits the rate — this must be stated at checkout.
- The founding window closes at whichever comes first: 500 Founding Members, or 12 months after launch (`foundingMemberConfig.triggers`).
- Compare to competitors: Calm and Headspace discount only the **annual** rate and re-price on renewal. Nobody in the category offers a genuine lifetime rate. That is our differentiator on price, and it costs us at most £34.5K/year at full take-up of both capped tiers.

## 7 · Guardrails

- Never advertise the F&F price publicly. It exists only behind a code.
- Never extend either cap without re-running the F1 revenue build first.
- Never discount the regular £15 with time-limited sales — it devalues the lifetime tiers we have already given away.
- Any change to these numbers changes `src/config/pricing.ts`, `src/founder/dataRoom.ts` and the Business Plan Chapter 8 together, or the three drift apart.
