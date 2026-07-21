# Next Step summary declutter + Support Circle as the single access roster

## 1. Next Step summary — quieter card, richer on tap

Files: `src/components/memory-bridge/MemoryBridgeActionReport.tsx`, `src/components/memory-bridge/ActionDetailCard.tsx`.

Default card shows only 3 lines: **title**, **status · when**, one primary CTA (**Mark done**). Everything else moves behind three collapsed reveals using the existing `Collapsible`:

1. **"You'll know you're done when…"** — uses `next_steps_items.success_criteria`; a one-line fallback is generated at extraction time (prompt update to `process-meeting-audio`), never at view time.
2. **"This will help because…"** — merges `motivation_statement`, `relationship_impact`, `emotional_stakes` into one short paragraph.
3. **"More details"** — the current dense grid (transcript excerpt, timing, confidence, assignee, category).

Reveal state is per-action, session-only (no persistence). Same three named reveals live in the list card and the detail view so language never drifts.

## 2. Support Circle = the single roster of access. "In the loop" = per-action tag.

The model you want already fits the existing schema. No migration needed for the core split.

### The rule

- **Support Circle** is the one place that answers "who has access to what." Every member has a **relationship**, a **role preset**, and per-area **permissions** (all three already exist as columns on `support_circle_members`).
- **"In the loop"** on an action is a lightweight, per-action tag. A person can be in the loop **without** being in the Support Circle. If they are in the circle, we reuse their prefs; if they're not, we send a one-off notification for that action only.

### Two ways to loop someone in (chosen in the Add/Edit action modal)

| Option | Who they are | What they get | Where they're stored |
|---|---|---|---|
| **Pick from Support Circle** | Existing member | Notification per their `notification_preferences`, plus visibility on this action | `extracted_actions.assigned_watchers` = member id |
| **Add just for this action** | Ad-hoc name + email | One-off email about *this action only*. No login, no dashboard, no permissions. | `extracted_actions.assigned_watchers` entry with `{ kind: 'adhoc', name, email }` (JSONB) |

Copy shown under the ad-hoc row: *"They'll only be notified about this action. Add them to your Support Circle if you want them to see more."* One-tap link to "Add to Support Circle" that pre-fills the invite form with the same name/email.

### Support Circle member card (in `PersonalCommunityPage` + `SupportCircle.tsx`)

Always visible per member:
- Name, avatar, email
- **Relationship** chip — Family / Friend / Partner / Carer / Colleague / Clinician / Other (free text). Editable inline. Constants in new `src/config/supportCircle.ts`.
- **Role preset** dropdown that writes `role` + `permissions` together:
  - **Cheerleader** — sees your wins only. `{ growth: true }`
  - **Everyday buddy** — calendar + actions. `{ calendar: true, actions: true }`
  - **Family / co-planner** — calendar + actions + goals + growth.
  - **Clinician** — everything + concern alerts. `role='medical'`.
  - **Custom** — reveals raw per-area toggles (existing `EnhancedSupportCirclePermissions`).
- Notify by email / SMS toggles (existing `notification_preferences`).

### Copy retirement — "Watcher" out, "In the loop" in

| Old | New |
|---|---|
| Watchers (badge/count) | In the loop |
| 2 watchers | 2 in the loop |
| Assigned Watchers (section title) | Keep in the loop |
| Watch out (action category) | *unchanged — different concept* |

`WatchersDisplay` stays as the visual component; only labels + icon change (Eye stays fine). No rename required to avoid churn.

## Files touched

- `src/components/memory-bridge/MemoryBridgeActionReport.tsx` — quiet card + 3 reveals + copy
- `src/components/memory-bridge/ActionDetailCard.tsx` — same reveals + copy
- `src/components/memory-bridge/SupportCircleActionView.tsx` — relationship chip + role preset + permissions
- `src/components/memory-bridge/*ActionModal*.tsx` (Add/Edit action) — picker with "From your circle" and "Add just for this action" sections
- `src/pages/SupportCircle.tsx`, `src/pages/PersonalCommunityPage.tsx` — role preset dropdown on each member row
- `src/components/personal-community/EnhancedSupportCirclePermissions.tsx` — mount only under Custom
- `src/components/shared/WatchersDisplay.tsx` — icon unchanged, tooltip copy → "In the loop"
- `src/components/calendar/EventForm.tsx`, `src/pages/launch/LaunchAddEventModal.tsx`, `ActionItem.tsx`, `ActionItemDetailed.tsx`, `EventCard.tsx` — label pass
- New: `src/config/supportCircle.ts` — `RELATIONSHIP_OPTIONS`, `ROLE_PRESETS`, `getLoopLabel(count)`

## Out of scope / not changing

- No schema change to `support_circle_members` — `relationship`, `role`, `permissions` already exist and are already read by `generate_accountability_alert` and `support_member_can_access_actions`.
- `extracted_actions.assigned_watchers` is already an array; ad-hoc entries fit as JSON objects. If the column is currently `uuid[]` and won't accept a JSON blob, a small migration switches it to `jsonb` — will confirm with a read query at the start of build and only migrate if required.
- Invitation flow, MFA, and email templates untouched.

## Technical notes

- Reveals: `useState<Record<string, { done?: boolean; why?: boolean; more?: boolean }>>`; no persistence.
- Success criteria fallback is generated during extraction so the reveal is free at view time; no per-view AI call.
- Role presets are pure UI sugar; picking one just writes `role` + `permissions`. RLS + helper functions keep working unchanged.
- Ad-hoc "in the loop" notification uses the existing `send-invitation-email` function with a new template variant (`variant: 'action_loop_in'`) so no new secret / infra is needed.
- QA: dark-mode contrast on the collapsed card, focus rings on reveal triggers, one manual pass through Clinician preset to confirm `generate_accountability_alert` still routes correctly, one manual pass adding an ad-hoc loop-in and confirming they receive the email but do not appear in the Support Circle roster.
