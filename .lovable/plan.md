## Why the two buttons look identical today

Both links land on `/launch/calendar?view=week`. The only extra thing "Help me plan" does today is `?assist=1`, which merely **scrolls** to the commitment banner (`LaunchCalendar.tsx` lines 41–48). It does not open the AI Plan Assist drawer — so visually the two views are the same page in the same state.

## Intended difference

- **Plan my week** → open Week view of the calendar, blank commitment banner ready for the user to type Core / Key / Stretch themselves. No AI.
- **Help me plan** → open Week view **and immediately open the AI Plan Assist drawer** (`LaunchAiPlanAssist`) so the user is walked through a gentle one-question-at-a-time flow that drafts Core / Key / Stretch for them.

## Changes

1. **`src/pages/launch/LaunchCalendar.tsx`**
   - Add local state `assistOpen` initialised from `searchParams.get('assist') === '1'`.
   - Render `<LaunchAiPlanAssist open={assistOpen} onOpenChange={setAssistOpen} scope="week" date={selectedDate} />` (drawer already exists).
   - On accept/apply from the drawer, the existing `usePlanningScope` autosave in `LaunchCommitmentBanner` will pick up the new values.
   - Keep the scroll-into-view behaviour so the banner is visible behind the drawer when it closes.

2. **`src/components/launch/LaunchWeeklyPlanningCard.tsx`** — copy tightening only, so the two buttons read as clearly different:
   - Primary: **"Plan my week"** — subtext "I'll write it myself"
   - Secondary: **"Help me plan"** — subtext "Guided 3-minute draft" + Sparkles icon

3. **Verify** `LaunchAiPlanAssist` already accepts `open` / `onOpenChange` props; if it currently self-manages a trigger, expose a controlled mode (small prop addition, no behaviour change for other callers).

## Out of scope

- No schema changes.
- No changes to the AI prompt or `plan-assist` edge function.
- No change to the Sunday-only visibility rule of the home card.

After this, "Help me plan" will land on the same Week view **with the AI drawer already open**, which is the visible difference the user expects.