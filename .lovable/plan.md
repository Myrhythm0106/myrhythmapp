# Pricing: what to charge Founding Members, and what F&F should be

## Where competitors actually sit (monthly equivalent, GBP)

| Band | Brands | Price | What the money buys |
|---|---|---|---|
| Commodity utility | Todoist, Goblin Tools | £0–£4 | A list. No judgement, no help. |
| Neurodivergent-native | Tiimo | £7–£9 | Visual day structure, designed *for* someone |
| Wellbeing habit | Calm, Headspace | £4–£6 (annual-led, ~£50–£70/yr) | Content library, not a day that holds |
| Planning relief / AI | Sunsama, Motion | £16–£28 | Someone else runs your day. Premium, unapologetic. |
| Clinical / rehab | Constant Therapy, CogniFit | £15–£25 | Exercises, clinician-backed, stops at the session |

Two things fall out of that table:

1. Nobody credible sits below £7 while doing real daily work. Sub-£5 is where lists live, and lists shame people who miss a day.
2. The £16–£28 band exists *purely* because people pay for planning relief. Sunsama charges £16+ to high performers with intact executive function. Our user needs that relief more, not less.

MyRhythm does clinical-adjacent work (Discharge Bridge), planning relief (4C loop, AI plan assist), and a care-network surface (Support Circle) — three bands at once. Priced at £10 it undersells all three.

## Recommendation

**Regular price: £15/month, £150/year.** Keep it. It sits at the floor of the planning-relief band and below every clinical comparable. Defensible in one sentence: "less than Sunsama, and it holds the whole day, not just work."

**Founding Member: £10/month or £100/year — locked for life, capped at 500 seats.** No change. It is a 33% discount, a round number, and the cap is what makes it a status rather than a sale. This is the number that already sits in F1, M2 and every investor artefact. Changing it now costs more in model rework than it gains.

**Friends & Family: 50% off the £15 regular price → £7.50/month or £75/year.**

Why 50%-off-regular rather than 50%-off-founding:

- £7.50 is still inside the credible band (above Tiimo's floor). £5 is not — it prices the product as a to-do list and, more importantly, it anchors the people closest to you at a third of list. Those are the people who will introduce you to others; you do not want them describing MyRhythm as "the fiver app".
- The story is clean for investors and for the recipients: "friends and family pay half list." One sentence, no ladder confusion.
- Blended ARPU stays honest. 50 seats at £7.50 against a £10 founding base is a ~£125/month give — visible, bounded, and easy to defend in the F1 model.

**Duration: for life, capped at 50 seats, invite-only via `founding_access_codes`.** A lifetime rate is only dangerous when it is uncapped. Fifty seats is a rounding error on the model and a permanent, genuine thank-you to the people who carried you through the build. Offer £75/year alongside — it front-loads cash you need inside the 90-day window and roughly a third of them will take it.

What F&F is *not*: a cheaper Founding Member. Distinct badge — "Friends & Family, Founding Circle" — with an expectation of feedback attached. People pay £7.50 for belonging; the £2.50 is not the point.

## What this changes in the build

- `src/config/pricing.ts` — add a `friendsFamily` tier: £7.50/mo (750 pence), £75/yr (7500 pence), `lifetime: true`, `maxSeats: 50`, own badge and tagline. Regular and founding numbers unchanged.
- Redemption rides the existing `founding_access_codes` gate — a new code batch tagged `friends_family`, not a new payment path.
- `LaunchPayment.tsx` — when a valid F&F code is held, show £7.50/£75, the F&F badge, and the seats-remaining line. Otherwise the screen is untouched.
- `src/founder/dataRoom.ts` — add the F&F tier and 50-seat cap to the assumptions so the in-app data room and the docs agree.
- Assumptions rows added to `MyRhythm_F1_Investor_Financials_v1.xlsx` and the M2 `Assumptions` tab so the blended-ARPU line reflects 50 discounted lifetime seats.
- A short `docs/pricing-rationale.md` capturing the competitor table above, so the £15 / £10 / £7.50 ladder can be defended without re-deriving it.

## Still outstanding from the previous plan

The Google-Sheets-safe 90-day workbook (`..._GSHEETS.xlsx`), the `90_Day_Actions.csv` fallback and `HOW_TO_IMPORT.md` are unbuilt. They ship in the same pass.
