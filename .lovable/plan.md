# Make /launch feel like /mvp — story-led, plain language, register-now

You like /mvp because it tells a story (Empower Your Brain → relatable pain-point images → 4C solutions → founder story → final CTA). The current `/launch` rewrite is a stripped-down imitation that lost the emotional pull, and downstream the "Pathfinders / Anchors / Operators / Scholars" labels read as jargon. Fix both.

## What changes

### 1. `/launch` becomes the real /mvp story page

`src/pages/launch/LaunchLanding.tsx` is rewritten to render the existing `MVPCore4C` component (the exact /mvp page) instead of the diluted custom version. CTAs in `MVPCore4C` already route to `/launch/register`, so the Launch funnel stays intact.

Two small touch-ups inside `src/components/mvp/MVPCore4C.tsx`:
- Authed redirect target changes from `/dashboard` to `/launch/home` (matches Launch Mode routing rule).
- "Log In" link routes to `/launch/signin` (already does); "Sign Out" returns to `/launch` instead of `/`.

Net effect: visiting `/launch` shows the same story the user loves, with the Launch funnel preserved.

### 2. Immediate register opportunity on the landing hero

Add a single-field email capture directly in the MVPCore4C hero, above the existing "Start Your Journey" button:

```text
[ your@email.com ] [ Reserve my spot → ]
        or just tap "Start Your Journey" below
```

Submitting the field stores the email in `localStorage.myrhythm_prefill_email` and navigates to `/launch/register`. `LaunchRegister.tsx` already has the bypass flow; it reads the prefill on mount and drops the email straight into the form. No backend changes.

This satisfies "immediate or at least the opportunity to register on the landing page" without a second click.

### 3. Plain-language labels on `/launch/user-type`

`src/pages/launch/LaunchUserType.tsx` currently uses Pathfinders / Anchors / Operators / Scholars. Replace with everyday language people self-identify with:

| Old | New title | New one-liner |
|---|---|---|
| Pathfinders | Rebuilding after a brain change | Brain injury, stroke, dementia, long COVID, MS — finding your rhythm again. |
| Anchors | Caring for someone I love | Family carer, spouse, adult child — holding it together for them and you. |
| Operators | Protecting my focus at work | Busy professional defending deep work and clear thinking. |
| Scholars | Studying and learning | Student or lifelong learner pacing toward recall, not burnout. |
| (fallback) | Not sure yet — show me around | unchanged |

Icons and colours stay; only copy changes. The clinical-style descriptions are replaced with the shorter, first-person lines above.

### 4. Authed users still skip the story

The redirect rule "authenticated users land on `/launch/home`" is preserved. The check moves inside `MVPCore4C` (already there) — `LaunchLanding.tsx` just renders the component, no separate redirect.

## Out of scope

- No changes to `LaunchRegister.tsx` beyond reading the `myrhythm_prefill_email` value (the bypass flow stays).
- No backend / Supabase / RLS changes.
- No new components or routes.
- No visual redesign of MVPCore4C — only the two-line redirect tweak and the email-capture insertion in the hero.
- No changes to `/launch/welcome`, `/launch/home`, onboarding, or downstream.

## Files touched

- `src/pages/launch/LaunchLanding.tsx` — replace body with `<MVPCore4C />`.
- `src/components/mvp/MVPCore4C.tsx` — change authed redirect target, add inline email-capture in hero.
- `src/pages/launch/LaunchUserType.tsx` — swap titles + one-liners to everyday language.
- `src/pages/launch/LaunchRegister.tsx` — on mount, prefill email from `localStorage.myrhythm_prefill_email` then clear it.

Ready to build on approval.