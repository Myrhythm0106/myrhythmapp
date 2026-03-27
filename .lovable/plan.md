

# Revised: Assistant-First Smart Scheduling

## Philosophy Change

Instead of building 3 complex screens (grid blocker, review panel, summary), we build **one smart card-based flow** where the app does the thinking and the user just confirms.

## How It Works

```text
MYRHYTHM Assessment → AI knows your peaks
Memory Bridge extracts actions → AI auto-schedules to optimal windows
User sees: "I've scheduled 4 things this week" card → Swipe/tap to approve, adjust, or dismiss
Mentioned someone? → AI auto-suggests inviting them + manual add option
```

## What We Build

### 1. Database Migration

Add `auto_accept_scheduling` boolean to `user_schedule_preferences`. No blocked_slots/blocked_dates columns needed — the assessment data and existing `preference_type = 'unavailable'` rows already handle this.

### 2. Smart Schedule Card (`src/components/scheduling/SmartScheduleCard.tsx`)

A single, clean card component that replaces the 3 planned screens:

- **Header**: "Your assistant scheduled 4 items this week" with energy-match confidence score
- **Swipeable/scrollable list**: Each item shows title, date/time, and a coloured energy badge (green = peak match, amber = good, grey = off-peak)
- **Per-item actions**: Approve (checkmark), Adjust time (opens a simple time picker), Dismiss (X)
- **"Approve All" button** at the bottom for quick confirmation
- **Auto-accept toggle**: "Let me handle scheduling automatically" — when on, items schedule silently and the card becomes a summary notification
- **Post-approval summary**: Replaces the list with "Done! 3 scheduled, 1 dismissed. View in Calendar."

### 3. Inline Attendee Suggestions

Built into the SmartScheduleCard, not a separate component:

- When Memory Bridge extracts an action mentioning a person, the card row shows "Invite [Name]?" with their photo/initial if they're in Support Circle
- Tap to confirm, or tap "Add others" to open a simple email input
- Support Circle members shown as quick-add chips
- Uses `EmailValidator` for manual entries
- Attendee data passed to ICS/Google/Outlook links

### 4. SmartScheduler Update (`src/utils/smartScheduler.ts`)

- Read existing `preference_type = 'unavailable'` rows (already in the table) to skip blocked times
- Add `extractMentionedContacts(actionText)` — simple NLP to detect names mentioned in extracted actions, cross-reference with `support_circle_members`
- If no assessment data exists, prompt user to take MYRHYTHM assessment instead of using defaults

### 5. ICS + Calendar Link Updates (`src/utils/ics.ts`)

- Add `attendees` to `CalendarEvent` interface
- Emit `ATTENDEE` lines in ICS
- Append `&add=` for Google, `&to=` for Outlook

### 6. Calendar Integration Update (`src/utils/calendarIntegration.ts`)

- Accept `attendees` parameter in `convertActionToCalendarEvent()`
- Pass through to ICS and edge function

### 7. Google Calendar Edge Function (`supabase/functions/create-google-calendar-event/index.ts`)

- Add optional `attendees` array to request schema
- Include in Google Calendar API payload

## What We DON'T Build (Removed from Previous Plan)

- ~~AvailabilityBlocker weekly grid~~ — assessment data + existing unavailable preferences handle this
- ~~ScheduleReviewPanel~~ — replaced by the simpler SmartScheduleCard
- ~~ScheduleSummary~~ — integrated into the card's post-approval state
- ~~Standalone AttendeeSelector~~ — inline in the card instead

## Files

| File | Action |
|------|--------|
| Migration | Add `auto_accept_scheduling boolean DEFAULT false` to `user_schedule_preferences` |
| `src/components/scheduling/SmartScheduleCard.tsx` | Create — the one card that does everything |
| `src/utils/smartScheduler.ts` | Edit — respect unavailable prefs, extract mentioned contacts |
| `src/utils/ics.ts` | Edit — attendee support |
| `src/utils/calendarIntegration.ts` | Edit — pass attendees |
| `supabase/functions/create-google-calendar-event/index.ts` | Edit — attendees in API call |

## Why This Is Better

- **1 component instead of 4** — less code, less navigation, less cognitive load
- **Assessment-driven** — the app already knows when you're at your best; no grid needed
- **Context-aware invites** — mentions someone in a conversation? The app suggests inviting them automatically
- **Progressive trust** — start in review mode, graduate to auto-accept as confidence grows

