
# Daily Rhythm → Weekly / Monthly / Yearly Planning (with AI Plan Assist)

Turn the existing scope switcher on `/launch/calendar` into a real planning loop that persists, cascades **top-down** (Year → Month → Week → Day) and rolls up **bottom-up** (Day wins → Week review → Month theme → Year vision). Includes a user-chosen **Planning Day** (default Sunday, editable) and an **AI Plan Assist** for people who feel overwhelmed or don't know where to start.

## What's already in place
- `LaunchCalendar.tsx` has Day / Week / Month / Year views with local `yearVision`, `monthFocus`, `weekFocus` state.
- `LaunchCommitmentBanner.tsx` captures **Core / Key / Stretch** per scope.
- Tables: `annual_priorities`, `monthly_themes`, `priorities`, `daily_actions`, `mood_entries` — but the four Commitment scopes don't have a shared persistence layer.

Problem: state is local — the plan evaporates on refresh, and a blank Core/Key/Stretch banner is exactly what triggers overwhelm.

## Proposed model

```text
Year Vision  ─┐
              ├→ Monthly Theme ─┐
              │                 ├→ Weekly Focus (Core/Key/Stretch) ─┐
              │                 │                                    ├→ Daily Rhythm (today's 3)
              └─────────────────┴────────────────────────────────────┘
                                              ↑ bottom-up rollup feeds AI + weekly review
```

## Build (4 PRs)

### PR-1 — Persistence layer
New table `planning_scopes` (one table, all four scopes):

| column | type | notes |
|---|---|---|
| id | uuid | pk |
| user_id | uuid | RLS: `auth.uid()` |
| scope | text | `'day'\|'week'\|'month'\|'year'` |
| period_start | date | week-start (user's planning day), 1st of month, Jan 1, or exact day |
| vision_text | text | free-text focus / vision |
| core / key / stretch | text | the three commitments |
| parent_id | uuid | FK to enclosing scope (nullable for year) |
| source | text | `'user'` or `'ai_assisted'` |
| updated_at | timestamptz | |

Unique on `(user_id, scope, period_start)`. RLS: user reads/writes own rows only. GRANTs for `authenticated` + `service_role`. Hook: `usePlanningScope(scope, date)`.

Also extend `profiles`:
- `planning_day_of_week` `smallint` default `0` (**0 = Sunday**, 1 = Monday, … 6 = Saturday). Nullable safe.
- All "week starts on…" logic app-wide reads this instead of hard-coding Monday/Sunday.

### PR-2 — Wire the banner
- `LaunchCommitmentBanner` becomes controlled by `usePlanningScope` with 400ms debounced autosave.
- Inherited breadcrumb becomes live: Day banner shows Week's Core → Month's theme → Year vision.
- Empty parent → soft nudge: "Set a focus for this week first?" with a one-tap jump.

### PR-3 — "Plan the Week" surface (day-of-week configurable)
- **Weekly Planning Card** on `/launch/home`, shown on the user's chosen **Planning Day** and any day the coming week is still unplanned.
- Card shows:
  - Read-only: Year vision + Month theme (top-down context).
  - Last week's rollup: captures, actions completed, top mood (bottom-up).
  - Three inputs (Core / Key / Stretch) → `planning_scopes`.
  - Two CTAs: **"I'll plan it myself"** and **"✨ Help me plan this week"** (opens PR-4).
- **Choose your planning day** — small settings row directly on the card ("Plan on ▾ Sunday"), also mirrored under `/launch/settings`. Options: any day of the week + "Whenever I open the app on a new week". Writing this updates `profiles.planning_day_of_week`.
- **Week view** gains a "Last week you…" strip with one-tap "Carry Stretch → next week's Key".
- **Month view** shows 4 mini week-cards (core text + completion %).
- **Year view** gets 12 month-tiles.

The card's trigger logic: `dayOfWeek(today) === profiles.planning_day_of_week` **OR** no `planning_scopes` row exists for the upcoming week. So a Wednesday planner sees it on Wednesday; someone who missed their day still sees it until they've planned.

### PR-4 — ✨ AI Plan Assist (the overwhelm-buster)

The answer to "planning overwhelms me". A calm, one-question-at-a-time drawer that produces a *draft* plan the user then edits — never a scary blank form.

**Surface.** New drawer `LaunchAiPlanAssist.tsx` opened from:
- The Planning Card ("Help me plan this week")
- Any empty CommitmentBanner scope (Day / Week / Month / Year) via a small "✨ Help me start" button

**Flow (max 3 gentle prompts, all skippable):**
1. "How are you feeling about this week? Low / Steady / Strong" — tap or voice.
2. "One thing you'd love to be true by [end of scope]?" — free text or 🎤 voice (reuses Memory Bridge recorder — natural for brain-injury users).
3. "Anything you're already committed to?" — optional.

Then shows a **suggested draft** — Core / Key / Stretch pre-filled — with:
- Plain-English rationale ("Because you said energy is low, I kept Core to one small win.")
- Each field individually **editable** and **regenerable** (small ↻ per field).
- Buttons: **"Use this plan"** (saves with `source='ai_assisted'`) · **"Edit first"** · **"Start over"**.

**Model call.** New edge function `plan-assist` via Lovable AI Gateway (see `connecting-to-ai-models-classic-stack`):
- Model: `google/gemini-3.5-flash` — fast, cheap, plenty for 3 short strings.
- Structured output via `Output.object` → `{ core, key, stretch, rationale }`.
- Server-only system prompt hard-codes:
  - Brain-injury-aware tone (short sentences, no jargon, no medical claims — respects `mem://brand/medical-disclaimer-policy`).
  - Cognitive-load rules: Core / Key / Stretch each ≤ 8 words; rationale ≤ 2 sentences.
  - Scope-aware context: walks `parent_id` chain (Year vision + Month theme) + last period's completion count + latest mood, so suggestions cascade from top-down context.
  - Never diagnose, never promise outcomes, never mention conditions.
- Rate limit: 20 calls/user/day (soft cap; overage returns a friendly "let's try tomorrow").
- 402/429 handled with Lovable Cloud copy.

**Safety & consent.**
- First-use dialog: "MyRhythm can suggest a plan based on your recent activity. You always decide. Nothing is shared." One-tap agree; stored on `profiles`.
- All AI outputs labelled with a small ✨ chip and "Suggested — edit anything" microcopy.
- Voice is transcribed via the existing recorder pipeline; only the resulting text goes to the model.

**Success criteria.**
- Overwhelmed user opens the Planning Card on their chosen day, taps ✨ Help me plan, answers 2 taps + optional voice, receives a 3-line draft in <3s, edits Stretch, hits Use → refresh → plan is on today's Daily Brief and cascades to Day view.
- Confident user ignores ✨ entirely; existing manual flow unchanged.
- Metric: % of weekly plans with `source='ai_assisted'` (via founding-member cohort).

## Non-goals
- No new routes. Everything lives in `/launch/calendar`, `/launch/home`, `/launch/settings`.
- No chat interface — this is a one-shot assist, not an AI companion.
- No changes to `calendar_events` or Google/Outlook sync.
- Legacy `/mvp` and `/dashboard` planning stays archived.

## Technical notes
- Single `planning_scopes` table keeps parent resolution simple.
- Planning-day preference lives on `profiles` (already user-scoped), so no new lookup surface.
- AI stays in an edge function; `LOVABLE_API_KEY` never ships to client; system prompt never ships to client.
- `source` column enables A/B on "AI-assisted weeks" vs manual weeks for completion rate.
- Voice reuses the recorder — no new hardware/permissions prompts.
