# Plan: Onboarding polish + card-on-file trial

## 1. Hide the You-Are-Here dial until membership is confirmed

Today `LaunchLayout.tsx` shows the dial to any signed-in user outside pre-account routes. We'll gate it behind actual membership (paid subscription, active trial with card on file, or redeemed founding code).

- New `src/hooks/useMembershipStatus.ts` returns `{ hasMembership, isFoundingComped, trialActive, trialDaysLeft, loading }`, sourced from `check-subscription` + `profiles.founding_comped`.
- In `LaunchLayout.tsx`, replace `showDial = !!user && !PRE_ACCOUNT_PATHS.has(...)` with `showDial = hasMembership && !PRE_ACCOUNT_PATHS.has(...)`.
- Founding-code and card-on-file trial both count as membership; unpaid registered users see a clean header.

## 2. Assessment: fix the "where are you in recovery?" gap

Split the stage question in `LaunchAssessment.tsx` + `launchAssessmentBanks.ts`:
1. **"When did the experience happen?"** — chips: `Not sure / Not applicable`, `Last 3 months`, `3–12 months ago`, `1–3 years ago`, `3–10 years ago`, `10+ years ago`. Stored as `event_recency`.
2. **"How does it feel today?"** keeps the Pause→Sustain lens, reframed as *"Pick what matches today — you can change this anytime."*

Auto-suggest a stage from recency (10+ years → Sustain) but leave it editable, so the 16-years-ago tester lands somewhere sensible without being forced.

## 3. Assessment: "None of these fit me" escape hatch

Every multi-choice question gets:
- A neutral **"None of these fit"** option at the bottom.
- When chosen, a small optional textarea: *"Tell us in your own words."* Saved as `freeform_notes` on the response.
- Scoring: counts as unanswered for MYRHYTHM letter scoring — we don't fabricate signal.
- Results page shows a subtle "We tailored this from the questions that fit — tell us more anytime" line when ≥1 question was answered this way.
- Same pattern for the primary/also-fits picker (free-text submit allowed with no chip selected).

## 4. Trial model: card-on-file at trial start (approved)

Standard for Calm, Headspace, Notion AI, Superhuman — higher conversion, one less friction moment at the point of value, and kinder for the Discharge-Cliff audience (no card re-entry on day 7).

**Flow**
- `LaunchPayment.tsx` CTA becomes: **"Start 7-day free trial — card required, cancel anytime."**
- Reassurance line above the card field: *"You won't be charged until [date]. Cancel anytime from Account."*
- Stripe checkout session passes `subscription_data.trial_period_days: 7` and `payment_method_collection: 'always'`.
- On return, `PaymentSuccessPage.tsx` writes `subscription_active` + `trial_start_date` and hands off to `/launch/welcome`.
- Founding-code users skip card entry entirely (dial + full app unlock via `founding_comped`).

**Guardrails (ethical, brain-health audience)**
- Email reminder 2 days before conversion via existing `trial-reminder` edge function, pointed at the new `trial_end`.
- One-tap cancel button in `/launch/profile` that opens Stripe Customer Portal (`customer-portal` function already exists).
- Clear trial_end date visible in profile + header pill ("Trial: 5 days left").

**Backend touch points**
- `supabase/functions/check-subscription/index.ts`: already returns `trial_days_left`; surface `trial_end` in the response so the dial gate and profile pill can render.
- No schema changes needed — `subscriptions` already tracks `status`, `trial_start`, `trial_end`.

## Technical summary

- New file: `src/hooks/useMembershipStatus.ts`.
- Edited: `LaunchLayout.tsx`, `LaunchAssessment.tsx`, `launchAssessmentBanks.ts`, `LaunchPayment.tsx`, `PaymentSuccessPage.tsx`, `LaunchProfile.tsx`, `check-subscription/index.ts`.
- Migration: add `event_recency text` and `freeform_notes jsonb` columns to `assessment_results` (nullable, backwards-compatible) with `GRANT`s preserved.
- No changes to 4C loop, Memory Bridge, or Calendar in this pass.
