# Plan v62 — Persistent dial, Back button, persona-aware assessment

Three small, scoped frontend changes. No business logic, no DB.

## 1. Persistent Compass "dial" on every Launch page

The dial is `LaunchQuickActions`, mounted inside `LaunchLayout`. It already appears on Home and other pages that use the layout. It disappears on 14 pages that render their own full-screen shells.

**Two-tier rule** (so we don't break full-screen flows like Sign-in or Payment):

- **Tier A — wrap in `LaunchLayout`** (so dial + nav + header all return):
  `LaunchAssessment`, `LaunchCalibrate`, `LaunchCapture`, `LaunchCaptureResult`, `LaunchCommit`, `LaunchWelcome`, `LaunchSCCapture`.
  These are in-app pages a logged-in user moves through daily — they should match Home.

- **Tier B — keep current full-screen shell, but mount a slimmed dial**:
  `LaunchUserType`, `LaunchRegister`, `LaunchSignIn`, `LaunchPayment`, `LaunchStart`, `LaunchLanding`, `LaunchScience`.
  These are pre-auth / one-time gates. They get a new lightweight `LaunchFloatingHome` button (Home icon FAB, same position as the dial) instead of the full Quick Actions menu, so the user always has one tap back to safety without breaking the focused flow.

For Tier A, the existing page-level back arrows/headers stay (they sit inside `<LaunchLayout>` children — no conflict).

## 2. Consistent Back button on every non-Home page

Add a single shared component **`LaunchPageHeader`** with:
- Back arrow (left) — calls `navigate(-1)` with a `fallbackPath` prop (default `/launch/home`).
- Optional title and subtitle.
- 56px touch target, plain-language `aria-label="Go back"`.

Drop it at the top of every Launch page **except** `/launch/home` (Home is the root, no back). For Tier A pages it sits inside `LaunchLayout`'s `<main>`. For Tier B pages it replaces the ad-hoc back buttons already there so behaviour is uniform.

Pages getting the header (back button visible):
Assessment, Calibrate, Calendar, Capture, CaptureResult, Commit, Memory/Bridge, Gratitude, Support, Profile, Settings, Help, Welcome, UserType, Vision, Analytics, Goals, Roadmap, ClinicalBrief, Continuity, FeatureStore, WhatsNew, EditionAbout, Science.

No back button on: Home, Landing, SignIn, Register, Payment, Start (entry/auth gates).

## 3. Persona-aware assessment

Today `/launch/user-type` writes `myrhythm_user_type` (`brain-injury` | `caregiver` | `executive` | `student`) then `/launch/assessment` ignores it and re-asks a different Q1.

Changes to `LaunchAssessment.tsx`:

- **Read** `localStorage.getItem('myrhythm_user_type')` on mount. If missing, redirect to `/launch/user-type` (the proper entry point) instead of asking again.
- **Remove** the duplicate Q1 ("What brings you here?"). The persona is already known.
- **Replace the generic question bank with four persona-specific banks** (4 questions each, kept to the existing 4-question rhythm so length feels the same):

  ### brain-injury (Rebuilding after a brain change)
  1. When does your brain feel clearest? (morning / afternoon / evening / it varies)
  2. What's hardest right now? *(multi)* — remembering appointments, fatigue/overwhelm, starting tasks, following conversations
  3. What would a good week look like? *(multi)* — steadier routine, fewer missed things, more energy left over, feeling more like myself
  4. Who's in your corner? — yes, a few people / one key person / building it / prefer solo for now

  ### caregiver (Caring for someone I love)
  1. When do you have your own bandwidth? (early morning / nap windows / evening / rarely)
  2. What drains you most? *(multi)* — appointment juggling, repeating myself, my own sleep, no time for me
  3. What would help most? *(multi)* — shared calendar with them, quick capture of what happened, gentler reminders for them, a record I can show the clinician
  4. Are other people helping? — yes regularly / occasionally / not yet / I want to ask but haven't

  ### executive (Protecting my focus at work)
  1. When is your deep-work window? (early morning / late morning / afternoon / evening)
  2. What erodes your focus? *(multi)* — meeting overload, context-switching, decision fatigue, after-hours pings
  3. What would a winning week deliver? *(multi)* — protected focus blocks, fewer dropped follow-ups, clear daily top-3, real recovery time
  4. Who do you sync with? — team / EA or chief of staff / partner/spouse / just me

  ### student (Studying and learning)
  1. When do you study best? (morning / afternoon / evening / late night)
  2. What's getting in the way? *(multi)* — procrastination, recall under pressure, overwhelm with volume, sleep/energy
  3. What's the goal this term? *(multi)* — steadier study rhythm, better recall, finish on time, reduce stress
  4. Who keeps you accountable? — study group / tutor or mentor / family / on my own

- Final answers stored alongside persona under the existing `myrhythm_launch_mode` key so `useLaunchMode` keeps working. Shape:
  ```ts
  assessmentResults: {
    userType: 'brain-injury' | 'caregiver' | 'executive' | 'student', // from localStorage
    rhythmPreference: string,   // Q1
    keyStruggles: string[],     // Q2
    goals: string[],            // Q3
    hasSupport: boolean         // derived from Q4 (anything other than "solo"/"on my own"/"not yet")
  }
  ```
  This preserves the existing downstream contract — no other code changes needed.

- Caregiver path passes `subject=loved-one` through to `SubjectProvider` defaults (already supported) so copy on Home reflects "for {name}" instead of "for you".

## Technical details

**New files**
- `src/components/launch/LaunchPageHeader.tsx` — back arrow + optional title/subtitle, uses `navigate(-1)` with `fallbackPath`.
- `src/components/launch/LaunchFloatingHome.tsx` — single-button FAB (Home icon) for Tier B pre-auth pages.
- `src/data/launchAssessmentBanks.ts` — the four persona question banks, typed.

**Edited files**
- `src/pages/launch/LaunchAssessment.tsx` — read persona, redirect if missing, render bank, write results.
- `src/pages/launch/LaunchCalibrate.tsx`, `LaunchCapture.tsx`, `LaunchCaptureResult.tsx`, `LaunchCommit.tsx`, `LaunchWelcome.tsx`, `LaunchSCCapture.tsx`, `LaunchAssessment.tsx` — wrap in `<LaunchLayout>` (Tier A). Remove their own min-h-screen/background wrappers where they conflict.
- `src/pages/launch/LaunchUserType.tsx`, `LaunchRegister.tsx`, `LaunchSignIn.tsx`, `LaunchPayment.tsx`, `LaunchStart.tsx`, `LaunchLanding.tsx`, `LaunchScience.tsx` — mount `<LaunchFloatingHome />` (Tier B).
- Every page in the "back button visible" list above — add `<LaunchPageHeader title="…" />` at top of main content. Remove now-duplicate inline back buttons.

**Out of scope (not changing this round)**
- The localStorage→Supabase migration for assessment results.
- Copy review of Home tiles per persona (separate pass).
- Any change to the 4C loop, Memory Bridge, or sharing flow built last round.

## Open question

For Tier A pages I'm proposing to wrap them in the standard `LaunchLayout` (which brings the dial, bottom nav and header). The Assessment is currently a focused full-screen flow with a progress bar — wrapping it means it will look like a normal app page with a header on top. Two options:

- **A. Full wrap** (recommended) — uniform shell, dial always present, matches Home.
- **B. Tier B treatment instead** — keep Assessment full-screen and just drop in the floating Home button, so the focused feel is preserved.

I'll default to **A** unless you say otherwise.
