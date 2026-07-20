## Upgrade the "Add Event" modal on `/launch/calendar`

Keep the current one-screen simplicity — everything new lives behind two collapsed "reveal" rows so the default view stays as calm as it is today. Two rows appear under Type: **Invite someone** and **Remind me**, each with a small summary chip when set (e.g. "Sarah + 1", "Steady · 30 min before"). Tap to expand.

### 1. Add "Meeting" as a Type
Add a new chip to the type grid in `LaunchAddEventModal.tsx`:
- `meeting` · label "Meeting" · indigo swatch
Slotted between Appointment and Activity.

### 2. Invite someone (Support Circle + email)
Collapsed row shows: `+ Invite someone` (or the chip summary when filled).
Expanded panel contains:
- **From your Support Circle** — list of active members (name + relationship) as toggle chips. Loaded via `useSupportCircle()` (already in the codebase, reads `support_circle_members`).
- **Or invite by email** — single email input with `+ Add` button; validated with zod (`z.string().email()`), max 5 additional emails shown as removable chips.
- Empty-state (no circle yet): a soft link "Add someone to your Support Circle" → `/launch/support-circle`.

Invitees are stored in the existing `calendar_events.watchers` array (already `text[]`) as either `circle:<member_id>` or `email:<address>` — no schema change needed for invites. Actual email dispatch is deferred (v0.2); for v0.1 the invitee list is saved and shown on the event so the user sees it worked.

### 3. Remind me — non-demeaning three-level presets
Collapsed row: `Remind me` (or chip like "Steady · 30 min & 1 day before").
Expanded panel: one clear question — **How much reminding helps you?** — with three warm, plain-language options (no "excessive", no clinical framing):

| Level | Label | Micro-copy | What it schedules |
|---|---|---|---|
| gentle | **Gentle** | "A single nudge, close to the time." | 15 min before |
| steady | **Steady** *(default)* | "A heads-up the day before, plus one on the day." | 1 day + 30 min before |
| strong | **Strong** | "Extra reminders so nothing slips — as many as you want." | 1 day + 2 hr + 30 min + 10 min before |

Below the three, a small **"Fine-tune"** reveal (collapsed by default) lets power users toggle the individual offsets — same progressive-disclosure pattern used elsewhere in the app. Copy at the top: _"Pick what feels right today — you can change it anytime."_ No shame language.

Persisted per-event via two new columns (see Technical).

### 4. Modal layout (unchanged simplicity)
```text
┌ Add Event ─────────────────────── × ┐
│ 📅 Monday, 20 July                  │
│ What's happening? [___________]     │
│ 🕐 Time  [09:00]                    │
│ Type    [chips incl. Meeting]       │
│ ─────────────────────────────────── │
│ + Invite someone            ▸       │  ← reveal
│ 🔔 Remind me · Steady       ▸       │  ← reveal, defaults to Steady
│ [ Add Event ]                       │
└─────────────────────────────────────┘
```
Defaults keep the "one-tap add" feel: no invitees, Steady reminders pre-selected but collapsed.

### 5. Where reminders surface
- Event cards on `/launch/calendar` show a small 🔔 chip with the level.
- The existing daily brief / notification pipeline reads `reminder_offsets_minutes` and schedules toasts (wired to the same alert utility used by recording countdowns). Actual push delivery is v0.2; in v0.1 in-app toasts fire at the offsets when the app is open.

---

### Technical details

**Schema migration** (single call, `calendar_events`):
- `reminder_level text default 'steady' check (reminder_level in ('gentle','steady','strong','custom'))`
- `reminder_offsets_minutes int[] default '{1440,30}'` — array of "minutes before start"
- No new grants needed (existing table).
- Backfill: existing rows get defaults via the column defaults.

**Files to edit**
- `src/components/launch/calendar/LaunchAddEventModal.tsx` — add Meeting chip, two collapsible sections, email zod validation, invitee/reminder state, expanded `onAdd` payload.
- `src/components/launch/calendar/eventTypes.ts` (new, small) — extract the type list so the card renderer can share Meeting styling.
- `src/hooks/useLaunchCalendarEvents.ts` — extend `addEvent` input to `{ title, time, type, date, watchers?, reminder_level?, reminder_offsets_minutes? }` and pass through on insert; extend `LaunchCalendarEvent` and `rowToEvent`.
- `src/pages/launch/LaunchCalendar.tsx` — pass the extra fields to `addEvent`; show 🔔 + invitee chip on event cards.
- `src/hooks/useLaunchReminderAlerts.ts` (new) — subscribes to today's events and fires in-app toasts at each offset (reuses `sonner`).

**Preset → offsets mapping** lives in a small constant so it's easy to tune:
```ts
export const REMINDER_PRESETS = {
  gentle:  { label: 'Gentle',  offsets: [15] },
  steady:  { label: 'Steady',  offsets: [1440, 30] },
  strong:  { label: 'Strong',  offsets: [1440, 120, 30, 10] },
} as const;
```

**Guardrails respected**
- Max 3 primary choices on the reminder screen (gentle/steady/strong); "Fine-tune" is a reveal, not a fourth primary.
- Non-demeaning copy — no "excessive", "severe", "impaired".
- No new required fields; modal still submits with just title + time.
- 56px tap targets on the three reminder buttons.

### Out of scope (call out to user before build)
- Actually **sending** email invitations and **push** notifications for reminders — both need email/push infra beyond this modal. v0.1 saves the intent and fires in-app toasts; v0.2 wires SendGrid + web-push. Confirm this is acceptable or I'll fold the send step in.