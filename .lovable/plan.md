# Brain-Healthy Scheduling + Time-Blocking — editable defaults with safe ranges

Every field ships with a sensible default **and** a user-adjustable range. Nothing is locked. Users can nudge, reset, or turn any rule off.

## 1. Settings → Rhythm → Brain-Healthy Scheduling (live-saved)

Card at `/launch/settings`. Each row: label · current value · stepper/slider (range shown) · **Reset to default** · inline help.

| Field | Default | Editable range | Control |
|---|---|---|---|
| Protect my day from back-to-back meetings | On | On / Off | Toggle |
| Min gap between meetings | **15 min** | 0–60 min, 5-min steps | Stepper + slider |
| Longer-break trigger (max consecutive meeting time) | **2 h** | 30 min – 4 h, 15-min steps | Stepper |
| Daily meeting cap | **5** | 1–20 or "No cap" | Stepper + "No cap" toggle |
| Auto-insert Recovery breaks | On | On / Off | Toggle |
| Recovery break length | **10 min** | 5–30 min, 5-min steps | Stepper |
| Break style | Quiet reset | `Quiet reset · Walk / move · Hydrate & breathe · Choose each time · Custom` | Select + free-text when Custom |
| Longer-break length (after trigger) | **20 min** | 10–60 min | Stepper |
| Reminder buffer before meetings | **10 min** | 0–60 min | Stepper |

**Protected windows** (fully add/edit/remove):
- Seeded: Morning start-up 07:30–08:30, Lunch 12:30–13:15, Wind-down 21:00–22:00
- Each editable: name · start · end · days (Mon–Sun chips) · active toggle · delete
- Time ranges: any 15-min slot 00:00–23:45; length 15 min – 4 h
- "Add window" · "Restore seeded windows" · "Clear all"

Validation is soft: values outside range clamp to the nearest allowed value and show a hint ("Set to 60 min — the max"), never a red error.

## 2. Time-blocking (opt-in, template-seeded, fully editable)

| Field | Default | Range |
|---|---|---|
| Use time-blocks | Off | On / Off |
| Starting template | Blank | `Classic Focus · Meeting-heavy · Recovery-friendly · Blank` |
| Block name | template value | Free text, 1–40 chars |
| Block start / end | template value | 00:00–23:45, 15-min grid, min length 15 min, max 8 h |
| Block type | Focus | `Focus · Meetings · Admin · Rest · Personal · Custom` |
| Meetings allowed inside | depends on type | Toggle per block |
| Colour | type default | Palette: MOSS · GOLD · EMBER · INK · slate |
| Repeat | Weekdays | `None · Daily · Weekdays · Weekly · Custom days` |
| Active | On | Toggle |

Every block: **Edit · Duplicate to other days · Delete · Deactivate**. Drag to move/resize on the weekly grid. "Restore template" and "Clear all" at the footer. Templates only seed the grid — after that, everything is user-owned.

Persist:
- Extend `public.user_schedule_preferences` with the fields above (all nullable with defaults so existing rows keep working).
- New table `public.time_blocks` (user_id, day_of_week, date nullable, start_time, end_time, name, block_type, color, meetings_allowed, repeat_rule, is_active) + GRANTs + RLS on `auth.uid() = user_id` + `updated_at` trigger.

## 3. Enforcement at booking (editable in the moment)

Add + Reschedule modals call `evaluateBrainHealthyFit(event, dayEvents, prefs, blocks)`. Calm EMBER-accent banner (never blocking):

- "This lands inside your **Deep Focus** block. Shift to **13:45**?"
- Actions: **Shift to suggested time** · **Book anyway** · **Loosen this rule** → mini popover that edits the exact rule that fired (e.g. drop gap 15 → 10 min, allow meetings in this block). Saves back to prefs immediately, so the same nudge won't fire again unless the user wants it to.

Overrides log to `analytics_events`.

## 4. Blocks on the calendar (editable in place)

`/launch/calendar` shows active blocks as translucent lanes with a name pill. Header toggle **Show blocks**. Click a lane → mini editor (name · times · meetings_allowed · delete). Drag to move/resize. Blocks stay local — never pushed to Google/Outlook.

## 5. Auto-insert recovery breaks (editable + reversible)

After each save, `ensureRecoveryBreaks(date, prefs, blocks)` inserts `calendar_events` rows (`type='break'`, `source='auto_break'`, `is_system_generated=true`) when the gap rule is violated. Idempotent cleanup removes stale auto breaks. Each auto break is a normal event: retitle, move, extend, or delete. A "Keep this one always" toggle promotes it to `source='manual'` so cleanup ignores it.

## 6. Daily Brief + Weekly Planning

- Daily Brief: if today has ≥3 meetings and no breaks → "Today looks meeting-heavy. Add two short resets?" → **Yes** (uses current settings) / **Customise** (opens the settings card) / **Not today**.
- `plan-assist` weekly plan receives `prefs` + active `time_blocks` so it drafts inside allowed windows. Every AI-proposed slot is editable before it's accepted.

## Copy & guardrails

- Language: "your rhythm", "focus time", "reset". No medical framing.
- Emerald + EMBER accents. Banner uses `launch-accent-l`. Lanes at low opacity.
- 56 px targets. All ranges chosen to keep the UI calm — no infinite spinners.

## Technical section

**Files to add**
- `src/launch/scheduling/brainHealthy.ts` — pure evaluator + suggester
- `src/launch/scheduling/ensureRecoveryBreaks.ts` — idempotent inserter
- `src/launch/scheduling/timeBlockTemplates.ts`
- `src/launch/scheduling/defaults.ts` — defaults + ranges in one place, imported by settings + evaluator
- `src/components/launch/BrainHealthySettingsCard.tsx`
- `src/components/launch/TimeBlockingSettingsCard.tsx`
- `src/components/launch/ProtectedWindowsEditor.tsx`
- `src/components/launch/TimeBlockLanes.tsx`
- `src/components/launch/RuleOverridePopover.tsx`
- `src/hooks/useBrainHealthyPrefs.ts`
- `src/hooks/useTimeBlocks.ts`

**Files to edit**
- `src/pages/launch/LaunchAddEventModal.tsx`
- `src/pages/launch/LaunchRescheduleModal.tsx`
- `src/pages/launch/LaunchCalendar.tsx`
- `src/components/launch/LaunchDailyBrief.tsx`
- Settings page (mount both new cards)
- `supabase/functions/plan-assist/index.ts` (pass prefs + blocks into prompt)

**DB (single migration)**
- ALTER `public.user_schedule_preferences` add: `brain_healthy_enabled bool default true`, `min_meeting_gap_minutes int default 15`, `longer_break_trigger_minutes int default 120`, `longer_break_length_minutes int default 20`, `daily_meeting_cap int`, `no_daily_cap bool default false`, `auto_insert_breaks bool default true`, `break_length_minutes int default 10`, `break_style text default 'quiet_reset'`, `break_style_custom_label text`, `reminder_buffer_minutes int default 10`, `protected_windows jsonb default '[]'`, `time_blocking_enabled bool default false`, `time_block_template text default 'blank'`.
- CREATE TABLE `public.time_blocks` (columns above) + GRANT to `authenticated`, `service_role` + RLS + `updated_at` trigger.

**Non-goals**
- No auto-cancel or auto-move of existing meetings.
- Blocks are local; no provider push. Auto breaks flow through the existing push pipeline.
